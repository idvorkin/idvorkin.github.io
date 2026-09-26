// ABOUTME: Dev-only "Diff vs main": diffs this page's rendered post body against the main-branch copy the
// ABOUTME: preview server renders same-origin at /_diff-base/<path> (_plugins/diff_base_generator.rb).
// Block-level LCS pairs paragraphs; word-level LCS marks <ins>/<del> inside changed blocks, keeping markup.

import { type Change, type ChangeNav, attachChangeNav } from "./diff-nav";

export const PROD_ORIGIN = "https://idvork.in";
export const DIFF_BASE = "/_diff-base";

/** Same-origin URL of the main-branch render of `path` (no cross-origin fetch, so no CORS to fail). */
export const baseUrl = (path: string) => DIFF_BASE + (path.replace(/\/+$/, "") || "/");

export type BlockOp =
  | { kind: "same"; block: Element }
  | { kind: "added"; block: Element }
  | { kind: "removed"; block: Element }
  | { kind: "changed"; old: Element; block: Element };

// Blocks whose text alone can't say whether they changed (charts, embeds): compared by markup, never word-diffed.
const OPAQUE = "script, style, svg, canvas, iframe, video, audio, object";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Strip origins so the same link renders equal on localhost and on idvork.in. */
function normMarkup(html: string): string {
  const local = typeof window === "undefined" ? "" : window.location.origin;
  let out = html.split(PROD_ORIGIN).join("");
  if (local) out = out.split(local).join("");
  return norm(out);
}

export function isOpaque(el: Element): boolean {
  return el.matches(OPAQUE) || !!el.querySelector(OPAQUE);
}

/** Top-level blocks of the post body, minus the TOC dropdown and comments. */
export function extractBlocks(root: Element | null): Element[] {
  if (!root) return [];
  return Array.from(root.children).filter((el) => !el.hasAttribute("data-pagefind-ignore"));
}

function blockKey(el: Element): string {
  return `${el.tagName}|${isOpaque(el) ? normMarkup(el.outerHTML) : norm(el.textContent || "")}`;
}

/** Longest-common-subsequence alignment. Returns pairs [i, j] of equal items, in order. */
export function lcsPairs<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean = (x, y) => x === y): [number, number][] {
  const n = a.length;
  const m = b.length;
  // ponytail: O(n·m) table. Fine for a post (hundreds of blocks, a few hundred words per block);
  // swap in Myers' O(ND) diff if a page ever makes this slow.
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = eq(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const pairs: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (eq(a[i], b[j])) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

const WORD = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu;
export const tokenize = (s: string): string[] => s.match(WORD) || [];

/** Share of the smaller block's words that also appear in the other — decides "edited" vs "replaced". */
export function similarity(a: string, b: string): number {
  const wa = new Set(tokenize(a.toLowerCase()).filter((t) => t.trim()));
  const wb = new Set(tokenize(b.toLowerCase()).filter((t) => t.trim()));
  if (!wa.size || !wb.size) return 0;
  let common = 0;
  for (const w of wa) if (wb.has(w)) common++;
  return common / Math.min(wa.size, wb.size);
}

const PAIR_THRESHOLD = 0.5;

/** Diff two block lists: LCS on exact blocks, then pair leftover removed/added blocks that look like edits. */
export function diffBlocks(oldBlocks: Element[], newBlocks: Element[]): BlockOp[] {
  const oldKeys = oldBlocks.map(blockKey);
  const newKeys = newBlocks.map(blockKey);
  const anchors = lcsPairs(oldKeys, newKeys);
  anchors.push([oldBlocks.length, newBlocks.length]);

  const ops: BlockOp[] = [];
  let oi = 0;
  let ni = 0;
  for (const [ai, aj] of anchors) {
    const dels = oldBlocks.slice(oi, ai);
    const adds = newBlocks.slice(ni, aj);
    ops.push(...pairGap(dels, adds));
    if (ai < oldBlocks.length) ops.push({ kind: "same", block: newBlocks[aj] });
    oi = ai + 1;
    ni = aj + 1;
  }
  return ops;
}

function pairGap(dels: Element[], adds: Element[]): BlockOp[] {
  const ops: BlockOp[] = [];
  let d = 0; // next removed block not yet emitted
  for (const add of adds) {
    let match = -1;
    for (let k = d; k < dels.length; k++) {
      const old = dels[k];
      if (old.tagName !== add.tagName || isOpaque(old) !== isOpaque(add)) continue;
      if (isOpaque(old) || similarity(old.textContent || "", add.textContent || "") >= PAIR_THRESHOLD) {
        match = k;
        break;
      }
    }
    if (match < 0) {
      ops.push({ kind: "added", block: add });
      continue;
    }
    while (d < match) ops.push({ kind: "removed", block: dels[d++] });
    ops.push({ kind: "changed", old: dels[d++], block: add });
  }
  while (d < dels.length) ops.push({ kind: "removed", block: dels[d++] });
  return ops;
}

type Tok = { text: string; node: Text; start: number; end: number };

function textTokens(root: Element): Tok[] {
  const toks: Tok[] = [];
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    if (n.parentElement?.closest("script, style")) continue;
    WORD.lastIndex = 0;
    for (let m = WORD.exec(n.data); m; m = WORD.exec(n.data)) {
      toks.push({ text: m[0], node: n, start: m.index, end: m.index + m[0].length });
    }
  }
  return toks;
}

const isWs = (s: string) => !s.trim();
const MAX_WORD_CELLS = 4_000_000;

/**
 * Mark word-level changes inside `fresh` (a clone of the new block) against `old`, keeping fresh's markup:
 * inserted words get wrapped in <ins>, deleted words are spliced in as <del> where they used to sit.
 * Returns false when the block is too big to diff word-by-word.
 */
export function markWordDiff(old: Element, fresh: Element): boolean {
  const a = textTokens(old);
  const b = textTokens(fresh);
  // Align on words only: matching the spaces between words would interleave a reworded phrase word by word.
  const aw = a.flatMap((t, k) => (isWs(t.text) ? [] : [k]));
  const bw = b.flatMap((t, k) => (isWs(t.text) ? [] : [k]));
  if (aw.length * bw.length > MAX_WORD_CELLS) return false;
  const pairs = lcsPairs(
    aw.map((k) => a[k].text),
    bw.map((k) => b[k].text),
  );
  pairs.push([aw.length, bw.length]);

  // Per text node: inserted [start,end) ranges and deleted text anchored at an offset.
  const edits = new Map<Text, { ins: [number, number][]; del: [number, string][] }>();
  const at = (n: Text) => {
    if (!edits.has(n)) edits.set(n, { ins: [], del: [] });
    return edits.get(n);
  };
  const doc = fresh.ownerDocument;

  let i = 0;
  let j = 0;
  for (const [pi, pj] of pairs) {
    const added = j < pj ? b.slice(bw[j], bw[pj - 1] + 1) : [];
    if (i < pi) {
      const gone = a
        .slice(aw[i], aw[pi - 1] + 1)
        .map((t) => t.text)
        .join("");
      const next = b[bw[j]];
      const prev = b[bw[bw.length - 1]];
      // Deleted words sit just before whatever replaced them, or before the next kept word.
      if (next) at(next.node).del.push([next.start, added.length ? `${gone} ` : gone]);
      else if (prev) at(prev.node).del.push([prev.end, ` ${gone}`]);
      else fresh.appendChild(Object.assign(doc.createElement("del"), { textContent: gone }));
    }
    for (const t of added) {
      const r = at(t.node).ins;
      const last = r[r.length - 1];
      if (last && last[1] === t.start) last[1] = t.end;
      else r.push([t.start, t.end]);
    }
    i = pi + 1;
    j = pj + 1;
  }

  for (const [node, { ins, del }] of edits) {
    const text = node.data;
    const cuts = new Set<number>([0, text.length, ...del.map(([o]) => o)]);
    for (const [s, e] of ins) cuts.add(s).add(e);
    const points = Array.from(cuts).sort((x, y) => x - y);
    const frag = doc.createDocumentFragment();
    for (let k = 0; k < points.length; k++) {
      const p = points[k];
      for (const [o, t] of del)
        if (o === p) frag.appendChild(Object.assign(doc.createElement("del"), { textContent: t }));
      const q = points[k + 1];
      if (q === undefined || q === p) continue;
      const piece = text.slice(p, q);
      const inserted = ins.some(([s, e]) => s <= p && q <= e);
      frag.appendChild(
        inserted ? Object.assign(doc.createElement("ins"), { textContent: piece }) : doc.createTextNode(piece),
      );
    }
    node.replaceWith(frag);
  }
  return true;
}

const STYLE = `
#rich-diff-view .rd-summary{background:#f6f8fa;border:1px solid #d0d7de;border-radius:6px;padding:6px 10px;margin:0 0 16px;font-size:14px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
#rich-diff-view .rd-summary .rd-add{color:#1a7f37;font-weight:600}
#rich-diff-view .rd-summary .rd-del{color:#cf222e;font-weight:600}
#rich-diff-view .rd-summary .rd-chg{color:#9a6700;font-weight:600}
#rich-diff-view .rd-block{border-left:4px solid transparent;padding:2px 0 2px 10px;margin-left:-14px;margin-bottom:1em}
#rich-diff-view .rd-block>*:last-child{margin-bottom:0}
#rich-diff-view .rd-added{border-color:#1a7f37;background:#dafbe1}
#rich-diff-view .rd-removed{border-color:#cf222e;background:#ffebe9;text-decoration:line-through;text-decoration-color:#cf222e80;opacity:.85}
#rich-diff-view .rd-changed{border-color:#bf8700}
#rich-diff-view .rd-note{display:block;font:600 11px/1.6 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#57606a;text-decoration:none}
#rich-diff-view .rd-li-added{background:#dafbe1}
#rich-diff-view .rd-li-removed{background:#ffebe9;text-decoration:line-through;text-decoration-color:#cf222e80}
#rich-diff-view ins{background:#abf2bc;text-decoration:none;border-radius:2px}
#rich-diff-view del{background:#ffcecb;color:#82071e;text-decoration:line-through;border-radius:2px}
`;

function wrap(doc: Document, cls: string, inner: Element, note?: string): HTMLElement {
  const box = doc.createElement("div");
  box.className = `rd-block ${cls}`;
  if (note) {
    const n = doc.createElement("span");
    n.className = "rd-note";
    n.textContent = note;
    box.appendChild(n);
  }
  box.appendChild(doc.importNode(inner, true));
  return box;
}

/** A changed list, diffed item by item so a dropped bullet stays its own struck-out bullet. */
function diffList(doc: Document, old: Element, now: Element): Element {
  const list = doc.importNode(now, false) as Element;
  for (const op of diffBlocks(Array.from(old.children), Array.from(now.children))) {
    const li = doc.importNode(op.block, true) as Element;
    if (op.kind === "changed" && !isOpaque(op.old) && !isOpaque(op.block)) markWordDiff(op.old, li);
    if (op.kind !== "same") li.classList.add(`rd-li-${op.kind}`);
    list.appendChild(li);
  }
  return list;
}

/** Render diff ops into a container; returns the container and the change counts. */
export function renderDiff(doc: Document, ops: BlockOp[]) {
  const view = doc.createElement("div");
  view.id = "rich-diff-view";
  const counts = { added: 0, removed: 0, changed: 0 };
  const changes: Change[] = [];
  const add = (kind: Change["kind"], el: HTMLElement) => {
    counts[kind]++;
    changes.push({ kind, el });
    view.appendChild(el);
  };
  for (const op of ops) {
    if (op.kind === "same") {
      view.appendChild(doc.importNode(op.block, true));
      continue;
    }
    if (op.kind === "added") add("added", wrap(doc, "rd-added", op.block));
    else if (op.kind === "removed") add("removed", wrap(doc, "rd-removed", op.block));
    else if (/^(UL|OL)$/.test(op.block.tagName))
      add("changed", wrap(doc, "rd-changed", diffList(doc, op.old, op.block)));
    else {
      const fresh = doc.importNode(op.block, true);
      const opaque = isOpaque(op.old) || isOpaque(op.block);
      const worded = !opaque && markWordDiff(op.old, fresh);
      add("changed", wrap(doc, "rd-changed", fresh, worded ? undefined : "changed block (not diffed word by word)"));
    }
  }
  return { view, counts, changes };
}

async function fetchBody(url: string): Promise<{ status: number; body: Element | null }> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e) {
    throw new Error(`fetching ${url}: ${(e as Error).message}`);
  }
  if (!res.ok) return { status: res.status, body: null };
  const doc = new DOMParser().parseFromString(await res.text(), "text/html");
  return { status: res.status, body: doc.getElementById("content-holder") };
}

let active: HTMLElement | null = null;
let nav: ChangeNav | null = null;

/** Toggle the rich diff for the current page. Resolves to true when the diff is showing. */
export async function toggleRichDiff(prUrl?: string): Promise<boolean> {
  const holder = document.getElementById("content-holder");
  if (!holder) return false;
  if (active) {
    active.remove();
    active = null;
    nav?.dispose();
    nav = null;
    holder.style.display = "";
    return false;
  }
  if (!document.getElementById("rich-diff-style")) {
    const s = document.createElement("style");
    s.id = "rich-diff-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  const path = window.location.pathname;
  const mainUrl = baseUrl(path);
  const summary = document.createElement("div");
  summary.className = "rd-summary";
  let view: HTMLElement;
  try {
    const [mine, main] = await Promise.all([fetchBody(path), fetchBody(mainUrl)]);
    if (!mine.body) throw new Error(`couldn't reload this page, ${path} (HTTP ${mine.status})`);
    const isNew = main.status === 404;
    if (!main.body && !isNew) throw new Error(`main-branch copy ${mainUrl} returned HTTP ${main.status}`);
    const ops = diffBlocks(extractBlocks(main.body), extractBlocks(mine.body));
    const r = renderDiff(document, ops);
    view = r.view;
    const { added, removed, changed } = r.counts;
    const mainLink = isNew ? "main" : `<a href="${mainUrl}" target="_blank">main</a>`;
    summary.innerHTML = `<span>Rendered diff vs ${mainLink}${
      isNew ? " — <b>new page</b>" : ""
    }</span><span class="rd-add">+${added} added</span><span class="rd-del">−${removed} removed</span><span class="rd-chg">~${changed} changed</span>`;
    if (prUrl) summary.innerHTML += `<a href="${prUrl}/files" target="_blank">source diff</a>`;
    if (r.changes.length) nav = attachChangeNav(r.changes);
    else summary.innerHTML += "<span>No rendered changes.</span>";
  } catch (e) {
    view = document.createElement("div");
    view.id = "rich-diff-view";
    summary.textContent = `Diff vs main failed: ${(e as Error).message}`;
  }
  view.prepend(summary);
  holder.before(view);
  holder.style.display = "none";
  active = view;
  if (nav) nav.next();
  else {
    summary.scrollIntoView({ block: "start" });
    window.scrollBy(0, -110); // clear the fixed header + dev banner
  }
  return true;
}
