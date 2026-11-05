// ABOUTME: Anchors an annotate-tool selection made inside the dev "Diff vs main" view to the real page text,
// ABOUTME: so a note taken on the rich diff is identical to one taken on the page itself (_includes/annotate.html).

/** W3C TextQuoteSelector triple, the shape _includes/annotate.html saves and scripts/blog_review.py locates. */
export type Selector = { quote: string; prefix: string; suffix: string };

export type DiffSelector = Selector & {
  diff: {
    /** How much of the selected text is new in this branch (<ins> words, added blocks or list items). */
    inserted: "all" | "some" | "none";
    /** "page": found in the real article text. "diff-view": not found there, so context comes from the diff. */
    anchoredTo: "page" | "diff-view";
  };
};

// Diff-only text: struck-out old words and blocks, the "changed block" labels, the summary bar.
const NOT_ON_PAGE = "del, .rd-removed, .rd-li-removed, .rd-note, .rd-summary, script, style";
const INSERTED = "ins, .rd-added, .rd-li-added";
const BLOCK = "p, li, h1, h2, h3, h4, h5, h6, blockquote, pre, td, th, dt, dd, figcaption, tr, div";

type Piece = { node: Text; at: number };

/**
 * The diff view's text as the NEW page reads it: deletions and diff chrome dropped. The diff copies blocks
 * without the whitespace between them, so a newline stands in wherever the text crosses into another block.
 */
export function newPageText(view: Element): { text: string; pieces: Piece[] } {
  const pieces: Piece[] = [];
  let text = "";
  let lastBlock: Element | null = null;
  const walker = view.ownerDocument.createTreeWalker(view, 4 /* NodeFilter.SHOW_TEXT */);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const parent = n.parentElement;
    if (!parent || parent.closest(NOT_ON_PAGE)) continue;
    const block = parent.closest(BLOCK);
    if (text && block !== lastBlock && !/\s$/.test(text) && !/^\s/.test(n.data)) text += "\n";
    lastBlock = block;
    pieces.push({ node: n, at: text.length });
    text += n.data;
  }
  return { text, pieces };
}

/** Offset in newPageText() of a DOM boundary point; a point inside dropped text maps to where it would sit. */
function offsetOf(pieces: Piece[], textLength: number, container: Node, offset: number): number {
  const probe = (container.ownerDocument ?? document).createRange();
  probe.setStart(container, offset);
  probe.collapse(true);
  for (const { node, at } of pieces) {
    if (node === container) return at + offset;
    if (probe.comparePoint(node, 0) >= 0) return at; // this piece starts at or after the point
  }
  return textLength;
}

/** Everything the page's own selection code sees: a Range over the whole article, as a string. */
function articleText(holder: Element): string {
  const r = holder.ownerDocument.createRange();
  r.selectNodeContents(holder);
  return r.toString();
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const squash = (s: string) => s.replace(/\s+/g, "");

function commonSuffix(a: string, b: string): number {
  let k = 0;
  while (k < a.length && k < b.length && a[a.length - 1 - k] === b[b.length - 1 - k]) k++;
  return k;
}

function commonPrefix(a: string, b: string): number {
  let k = 0;
  while (k < a.length && k < b.length && a[k] === b[k]) k++;
  return k;
}

/**
 * Find `quote` (whitespace-insensitive) in the article text; with several hits, take the one whose
 * surroundings best match the diff view's. Returns [start, end) in `page`, or null when it isn't there.
 */
export function locateInPage(page: string, quote: string, before: string, after: string): [number, number] | null {
  const words = quote.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  const re = new RegExp(words.map(escapeRe).join("\\s*"), "g");
  const want = { before: squash(before), after: squash(after) };
  let best: [number, number] | null = null;
  let bestScore = -1;
  for (let m = re.exec(page); m; m = re.exec(page)) {
    const s = m.index;
    const e = s + m[0].length;
    const score =
      commonSuffix(squash(page.slice(Math.max(0, s - 200), s)), want.before) +
      commonPrefix(squash(page.slice(e, e + 200)), want.after);
    if (score > bestScore) {
      best = [s, e];
      bestScore = score;
    }
    if (!m[0].length) re.lastIndex++;
  }
  return best;
}

/**
 * Selector for a selection made in the rich-diff `view`, anchored against the real article in `holder`.
 * The quote/prefix/suffix are sliced from the article text exactly as a selection on the page would be,
 * so the note resolves the same way with the diff on or off. Null when nothing on the new page is selected
 * (e.g. only struck-out text).
 */
export function selectorFromDiffRange(range: Range, view: Element, holder: Element, ctx = 30): DiffSelector | null {
  // Clamp to the view, so a drag that runs past it into the footer only counts what's in the diff.
  const r = range.cloneRange();
  if (!view.contains(r.startContainer)) r.setStart(view, 0);
  if (!view.contains(r.endContainer)) r.setEnd(view, view.childNodes.length);

  const { text, pieces } = newPageText(view);
  const s = offsetOf(pieces, text.length, r.startContainer, r.startOffset);
  const e = offsetOf(pieces, text.length, r.endContainer, r.endOffset);
  const quote = text.slice(s, e);
  if (!quote.trim()) return null;

  let seen = 0;
  let fresh = 0;
  for (const { node, at } of pieces) {
    const from = Math.max(s, at);
    const to = Math.min(e, at + node.data.length);
    if (from >= to) continue;
    const chars = squash(node.data.slice(from - at, to - at)).length;
    seen += chars;
    if (node.parentElement?.closest(INSERTED)) fresh += chars;
  }
  const inserted = fresh === 0 ? "none" : fresh === seen ? "all" : "some";

  const page = articleText(holder);
  const hit = locateInPage(page, quote, text.slice(Math.max(0, s - 200), s), text.slice(e, e + 200));
  if (!hit) {
    return {
      quote,
      prefix: text.slice(Math.max(0, s - ctx), s),
      suffix: text.slice(e, e + ctx),
      diff: { inserted, anchoredTo: "diff-view" },
    };
  }
  const [ps, pe] = hit;
  return {
    quote: page.slice(ps, pe),
    prefix: page.slice(Math.max(0, ps - ctx), ps),
    suffix: page.slice(pe, pe + ctx),
    diff: { inserted, anchoredTo: "page" },
  };
}
