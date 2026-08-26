/**
 * Keeps a deep link like /todo_enjoy#physical actually landing on its heading.
 *
 * The browser picks the scroll offset for a #fragment from the layout as it
 * stands at that moment. Several pages then grow content *above* that target
 * after the fact — the Plotly sunburst inflates an empty <div> to 450px, the
 * random-eulogy / random-post / random-blog-post placeholders are swapped for
 * longer fetched content, images without intrinsic dimensions settle. Every
 * pixel added above the target pushes it that much further down the screen, so
 * the reader lands somewhere in the middle of the previous section. On
 * /todo_enjoy the drift measured ~840px (desktop) to ~1180px (mobile).
 *
 * So: after the browser has done its own jump, re-assert the alignment while
 * the page is still settling, and get out of the way the instant the reader
 * takes over.
 *
 * Deliberately narrow:
 *  - Only the fragment the page was *loaded* with. In-page clicks (TOC links,
 *    heading permalinks) are left alone, so CSS `scroll-behavior: smooth`
 *    still animates them exactly as before.
 *  - Corrections wait for the scroll position to go quiet, so we never snap
 *    mid-animation and cut the browser's own smooth jump short.
 *  - Any real scroll input from the reader disarms it permanently.
 *  - It stops on its own shortly after load, so a page that keeps mutating
 *    can never trap the reader at one heading.
 */

/** Scroll must be quiet this long before we treat an animation as finished. */
const QUIET_MS = 150;

/** Stop re-asserting this long after `load`. */
const SETTLE_AFTER_LOAD_MS = 2500;

/** Absolute cap, in case `load` never fires. */
const MAX_LIFETIME_MS = 12000;

/** Ignore residuals smaller than this — sub-pixel noise isn't worth a scroll. */
const ALIGN_TOLERANCE_PX = 2;

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

/** Resolves the element a fragment points at, the way the browser does. */
export function targetForHash(hash: string, doc: Document = document): HTMLElement | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // Malformed escape sequence — fall back to the literal text.
  }

  for (const id of decoded === raw ? [raw] : [decoded, raw]) {
    const byId = doc.getElementById(id);
    if (byId) return byId;
    const byName = doc.getElementsByName(id)[0];
    if (byName) return byName as HTMLElement;
  }
  return null;
}

/**
 * How far the target sits from where a fragment jump would park it.
 *
 * Positive means the target is below its resting place, i.e. content grew
 * above it. Honors `scroll-padding-top` on the scrolling element and
 * `scroll-margin-top` on the target, so it agrees with `scrollIntoView`.
 */
export function alignmentErrorPx(el: HTMLElement, win: Window = window): number {
  const doc = el.ownerDocument;
  const scroller = doc.scrollingElement || doc.documentElement;
  const px = (value: string) => {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : 0;
  };
  const padding = px(win.getComputedStyle(scroller).scrollPaddingTop);
  const margin = px(win.getComputedStyle(el).scrollMarginTop);
  return el.getBoundingClientRect().top - padding - margin;
}

/**
 * Arms the corrector for the fragment this document was loaded with.
 * Safe to call more than once; only the first arming does anything.
 */
export function installHashScrollCorrection(win: Window = window): () => void {
  const noop = () => {};
  const doc = win.document;

  if (!win.location.hash) return noop;

  // The reader already started scrolling before this module could load — the
  // flag is set by the snippet in _includes/head.html, which runs early enough
  // to catch gestures a deferred module misses. Their scroll wins.
  if ((win as unknown as { __readerScrolled?: boolean }).__readerScrolled) return noop;

  // Back/forward restores a remembered scroll position — never fight that.
  const nav = win.performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === "back_forward") return noop;

  let disposed = false;
  let lastScrollAt = 0;
  let pending = 0;
  const startedAt = win.performance?.now?.() ?? Date.now();
  let deadline = startedAt + MAX_LIFETIME_MS;

  const now = () => win.performance?.now?.() ?? Date.now();

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    win.clearTimeout(pending);
    win.removeEventListener("scroll", onScroll);
    for (const type of ["wheel", "touchstart", "mousedown", "keydown"]) {
      win.removeEventListener(type, onUserInput, true);
    }
    observer?.disconnect();
  };

  const align = () => {
    if (disposed) return;
    if (now() > deadline) {
      dispose();
      return;
    }

    // Still animating (the browser's own smooth jump, or ours) — wait it out.
    if (now() - lastScrollAt < QUIET_MS) {
      schedule(QUIET_MS);
      return;
    }

    const el = targetForHash(win.location.hash, doc);
    if (!el) {
      schedule(QUIET_MS);
      return;
    }

    if (Math.abs(alignmentErrorPx(el, win)) > ALIGN_TOLERANCE_PX) {
      // "auto" on purpose: this is a layout correction, not a navigation.
      // Animating it would visibly slide the page and could be cut short by
      // the next chunk of content landing.
      el.scrollIntoView({ block: "start", behavior: "auto" });
    }
    schedule(QUIET_MS);
  };

  function schedule(delay: number) {
    if (disposed) return;
    win.clearTimeout(pending);
    pending = win.setTimeout(align, delay);
  }

  function onScroll() {
    lastScrollAt = now();
  }

  function onUserInput(event: Event) {
    if (event.type === "keydown" && !SCROLL_KEYS.has((event as KeyboardEvent).key)) return;
    dispose();
  }

  win.addEventListener("scroll", onScroll, { passive: true });
  for (const type of ["wheel", "touchstart", "mousedown", "keydown"]) {
    win.addEventListener(type, onUserInput, { passive: true, capture: true });
  }

  // Anything resizing means content above the target may have moved.
  const RO = (win as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
  const observer = typeof RO === "function" ? new RO(() => schedule(QUIET_MS)) : undefined;
  if (observer && doc.body) observer.observe(doc.body);
  if (observer && doc.documentElement) observer.observe(doc.documentElement);

  const onLoad = () => {
    deadline = Math.min(deadline, now() + SETTLE_AFTER_LOAD_MS);
    schedule(QUIET_MS);
  };
  if (doc.readyState === "complete") onLoad();
  else win.addEventListener("load", onLoad, { once: true });

  schedule(QUIET_MS);
  return dispose;
}
