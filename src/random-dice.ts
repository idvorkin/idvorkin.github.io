/**
 * Re-roll dice for random-post visits.
 *
 * /random picks a page and jumps to it. Before jumping it records the target
 * path in sessionStorage; when that page loads with a matching path, a small
 * dice button appears in the bottom-right corner, above the TOC button.
 * Tapping it tumbles the dice and rolls again; its × dismisses it for the page.
 *
 * sessionStorage (not a ?random=1 query param) keeps shared links clean: a
 * copied URL never shows the dice to someone who didn't roll. It's per-tab, so
 * reloading the landed page keeps the dice, and following any normal link to a
 * different path drops it.
 */
import { get_random_page_url } from "./shared";

export const RANDOM_ARRIVAL_KEY = "random-arrival-path";
const DICE_ID = "random-reroll-dice";
const WRAP_ID = "random-reroll";
const CLOSE_ID = "random-reroll-close";
const STYLE_ID = "random-reroll-style";
/** How long the tumble plays before we navigate. */
export const ROLL_MS = 550;

// Bottom-right, stacked above the TOC button (bottom 20px, 48px tall). The
// annotate pill (bottom 14px) sits below 80px too; with the rich-diff nav the
// pill moves up to 70px, so the dice climbs higher.
const DICE_CSS = `
#${WRAP_ID}{position:fixed;right:max(4px, env(safe-area-inset-right));
  bottom:calc(80px + env(safe-area-inset-bottom));z-index:9999;width:48px;height:48px}
body:has(#rd-nav) #${WRAP_ID}{bottom:calc(120px + env(safe-area-inset-bottom))}
#${DICE_ID}{width:48px;height:48px;padding:0;font-size:28px;line-height:48px;text-align:center;
  border:0;border-radius:50%;color:#000;background:rgba(255,255,255,.92);box-shadow:0 2px 8px rgba(0,0,0,.3);
  cursor:pointer;touch-action:manipulation;animation:rrd-wiggle 6s ease-in-out 2s infinite}
/* disabled buttons get translucent text, which fades the color emoji mid-roll */
#${DICE_ID}:disabled{color:#000;opacity:1}
#${DICE_ID}.rrd-rolling{animation:rrd-roll ${ROLL_MS}ms cubic-bezier(.3,1.4,.6,1) forwards}
#${CLOSE_ID}{position:absolute;top:-14px;left:-14px;width:32px;height:32px;padding:0;border:0;
  background:transparent;cursor:pointer;touch-action:manipulation;display:flex;
  align-items:center;justify-content:center}
#${CLOSE_ID} span{width:18px;height:18px;border-radius:50%;background:#555;color:#fff;
  font:700 13px/18px system-ui,sans-serif;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.35)}
@keyframes rrd-roll{
  0%{transform:translateY(0) rotate(0) scale(1)}
  35%{transform:translateY(-22px) rotate(220deg) scale(1.18)}
  65%{transform:translateY(0) rotate(400deg) scale(.88,1.08)}
  82%{transform:translateY(-7px) rotate(440deg) scale(1.04)}
  100%{transform:translateY(0) rotate(360deg) scale(1)}}
@keyframes rrd-wiggle{
  0%,86%,100%{transform:rotate(0)}
  89%{transform:rotate(-14deg) scale(1.06)}
  93%{transform:rotate(11deg) scale(1.06)}
  96%{transform:rotate(-5deg)}}
@media (prefers-reduced-motion: reduce){#${DICE_ID},#${DICE_ID}.rrd-rolling{animation:none}}
`;

/** "/foo/" and "/foo" are the same page; "/" stays "/". */
export function normalizePath(path: string): string {
  let p = path.split(/[?#]/)[0] || "/";
  try {
    p = decodeURI(p);
  } catch {
    // keep the raw path if it isn't valid percent-encoding
  }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

function safeStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null; // blocked storage (privacy modes): no dice, plain redirect still works
  }
}

export function clearRandomArrival(storage: Storage | null = safeStorage()): void {
  try {
    storage?.removeItem(RANDOM_ARRIVAL_KEY);
  } catch {
    // ignore
  }
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  } catch {
    return false;
  }
}

export function markRandomArrival(url: string, storage: Storage | null = safeStorage()): void {
  try {
    storage?.setItem(RANDOM_ARRIVAL_KEY, normalizePath(new URL(url, window.location.origin).pathname));
  } catch {
    // ignore: storage full or blocked
  }
}

export function isRandomArrival(pathname: string, storage: Storage | null = safeStorage()): boolean {
  try {
    const marked = storage?.getItem(RANDOM_ARRIVAL_KEY);
    return marked != null && marked === normalizePath(pathname);
  } catch {
    return false;
  }
}

/** Pick a random page that isn't the one we're on (best effort, a few tries). */
export async function pickNextRandomUrl(currentPath: string, pick: () => Promise<string> = get_random_page_url) {
  const here = normalizePath(currentPath);
  let url = await pick();
  for (let i = 0; i < 4 && normalizePath(url) === here; i++) {
    url = await pick();
  }
  return url;
}

/** Roll, mark the landing as a random arrival, and go. Used by /random and the dice. */
export async function goToRandomPage(
  navigate: (url: string) => void = (url) => window.location.assign(url),
  pick: () => Promise<string> = get_random_page_url,
): Promise<string> {
  const url = await pickNextRandomUrl(window.location.pathname, pick);
  markRandomArrival(url);
  navigate(url);
  return url;
}

export function initRandomDice(doc: Document = document): HTMLButtonElement | null {
  if (!isRandomArrival(window.location.pathname) || doc.getElementById(DICE_ID)) {
    return null;
  }

  if (!doc.getElementById(STYLE_ID)) {
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = DICE_CSS;
    doc.head.appendChild(style);
  }

  const wrap = doc.createElement("div");
  wrap.id = WRAP_ID;

  const button = doc.createElement("button");
  button.id = DICE_ID;
  button.type = "button";
  button.textContent = "🎲";
  button.title = "Another random post";
  button.setAttribute("aria-label", "Another random post");

  // A sibling of the dice (not nested), so tapping it can never re-roll.
  // The visible dot is 18px; the button around it is a 32px tap target.
  const close = doc.createElement("button");
  close.id = CLOSE_ID;
  close.type = "button";
  close.title = "Hide the dice";
  close.setAttribute("aria-label", "Hide the random dice");
  close.innerHTML = '<span aria-hidden="true">×</span>';

  button.addEventListener("click", () => {
    if (button.disabled) return;
    button.disabled = true;
    const started = Date.now();
    const wait = prefersReducedMotion() ? 0 : ROLL_MS;
    button.classList.add("rrd-rolling");
    void goToRandomPage((url) => {
      window.setTimeout(() => window.location.assign(url), Math.max(0, wait - (Date.now() - started)));
    });
  });

  close.addEventListener("click", (e) => {
    e.stopPropagation();
    clearRandomArrival();
    wrap.remove();
  });

  wrap.append(button, close);
  doc.body.appendChild(wrap);
  return button;
}
