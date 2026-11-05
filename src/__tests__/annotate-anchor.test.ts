// ABOUTME: Annotating inside the dev "Diff vs main" view: selections anchor to the real page text, the page
// ABOUTME: digest ignores the diff DOM, and the real _includes/annotate.html script saves the same note either way.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { locateInPage, newPageText, selectorFromDiffRange } from "../annotate-anchor";
import { diffBlocks, extractBlocks, renderDiff, toggleRichDiff } from "../rich-diff";

const OLD = `
<p>Intro stays the same here.</p>
<p>The quick brown fox jumps over the lazy dog.</p>
<p>Gone paragraph text.</p>
<p>Say it again: the lazy dog sleeps.</p>
`;
const NEW = `
<p>Intro stays the same here.</p>
<p>The quick red fox leaps over the lazy dog.</p>
<h2>Brand new section</h2>
<p>Say it again: the lazy dog sleeps.</p>
`;

const div = (html: string) => {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el;
};

/** Boundary point just before (or after, with `end`) the n-th occurrence of `needle` inside one text node. */
function point(root: Node, needle: string, { end = false, nth = 0 } = {}): [Text, number] {
  const walker = document.createTreeWalker(root, 4);
  let seen = 0;
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    for (let i = n.data.indexOf(needle); i >= 0; i = n.data.indexOf(needle, i + 1)) {
      if (seen++ === nth) return [n, end ? i + needle.length : i];
    }
  }
  throw new Error(`"${needle}" not found`);
}

function rangeFrom(root: Node, from: string, to: string, nth = 0): Range {
  const r = document.createRange();
  r.setStart(...point(root, from, { nth }));
  r.setEnd(...point(root, to, { end: true, nth }));
  return r;
}

/** The live page plus a rendered diff of it against OLD, the way toggleRichDiff lays them out. */
function diffPage(oldHtml = OLD, newHtml = NEW) {
  document.body.innerHTML = `<div id="content-holder">${newHtml}</div>`;
  const holder = document.getElementById("content-holder") as HTMLElement;
  const { view } = renderDiff(document, diffBlocks(extractBlocks(div(oldHtml)), extractBlocks(div(newHtml))));
  holder.before(view);
  holder.style.display = "none";
  return { holder, view };
}

/** What a selection on the page itself yields: the annotate tool's prefix/quote/suffix over the article. */
function pageSelector(holder: Element, range: Range, ctx = 30) {
  const pre = document.createRange();
  pre.selectNodeContents(holder);
  pre.setEnd(range.startContainer, range.startOffset);
  const post = document.createRange();
  post.selectNodeContents(holder);
  post.setStart(range.endContainer, range.endOffset);
  return { quote: range.toString(), prefix: pre.toString().slice(-ctx), suffix: post.toString().slice(0, ctx) };
}

describe("newPageText", () => {
  it("drops struck-out words and removed blocks, keeps inserted ones", () => {
    const { view } = diffPage();
    const { text } = newPageText(view);
    expect(text).toContain("The quick red fox leaps over the lazy dog.");
    expect(text).toContain("Brand new section");
    expect(text).not.toContain("brown");
    expect(text).not.toContain("jumps");
    expect(text).not.toContain("Gone paragraph");
  });
});

describe("selectorFromDiffRange", () => {
  it("anchors a selection spanning inserted and deleted words to the page text", () => {
    const { holder, view } = diffPage();
    const sel = selectorFromDiffRange(rangeFrom(view, "quick", "lazy"), view, holder);
    const onPage = pageSelector(holder, rangeFrom(holder, "quick", "lazy"));
    expect(sel).toEqual({ ...onPage, diff: { inserted: "some", anchoredTo: "page" } });
    expect(sel?.quote).toBe("quick red fox leaps over the lazy");
  });

  it("flags a selection inside an added block as all inserted", () => {
    const { holder, view } = diffPage();
    const sel = selectorFromDiffRange(rangeFrom(view, "Brand", "section"), view, holder);
    expect(sel?.quote).toBe("Brand new section");
    expect(sel?.diff).toEqual({ inserted: "all", anchoredTo: "page" });
    expect(sel?.prefix).toBe(pageSelector(holder, rangeFrom(holder, "Brand", "section")).prefix);
  });

  it("flags unchanged text as not inserted", () => {
    const { holder, view } = diffPage();
    expect(selectorFromDiffRange(rangeFrom(view, "Intro", "same"), view, holder)?.diff.inserted).toBe("none");
  });

  it("returns null when only struck-out text is selected", () => {
    const { holder, view } = diffPage();
    expect(selectorFromDiffRange(rangeFrom(view, "Gone", "text"), view, holder)).toBeNull();
    expect(selectorFromDiffRange(rangeFrom(view, "brown", "brown"), view, holder)).toBeNull();
  });

  it("picks the right occurrence of a repeated phrase", () => {
    const { holder, view } = diffPage();
    const sel = selectorFromDiffRange(rangeFrom(view, "the lazy dog", "the lazy dog", 1), view, holder);
    expect(sel).toEqual({
      ...pageSelector(holder, rangeFrom(holder, "the lazy dog", "the lazy dog", 1)),
      diff: { inserted: "none", anchoredTo: "page" },
    });
    expect(sel?.suffix.startsWith(" sleeps.")).toBe(true);
  });

  it("matches a selection across blocks despite the diff dropping the whitespace between them", () => {
    const { holder, view } = diffPage();
    const sel = selectorFromDiffRange(rangeFrom(view, "lazy dog.", "Brand"), view, holder);
    expect(sel?.quote).toBe(pageSelector(holder, rangeFrom(holder, "lazy dog.", "Brand")).quote);
    expect(sel?.diff.anchoredTo).toBe("page");
  });

  it("falls back to the diff's own text when the page no longer has the quote", () => {
    const { holder, view } = diffPage();
    holder.innerHTML = "<p>something else entirely</p>";
    const sel = selectorFromDiffRange(rangeFrom(view, "red", "leaps"), view, holder);
    expect(sel?.quote).toBe("red fox leaps");
    expect(sel?.prefix.endsWith("The quick ")).toBe(true);
    expect(sel?.diff.anchoredTo).toBe("diff-view");
  });
});

describe("locateInPage", () => {
  it("is whitespace-insensitive and returns null when absent", () => {
    expect(locateInPage("a\n  b c", "a b", "", "")).toEqual([0, 5]);
    expect(locateInPage("a b c", "zzz", "", "")).toBeNull();
  });
});

// ---------------------------------------------------------------- the real annotate.html, end to end
describe("annotate.html in the diff view", () => {
  const page = (inner: string) => `<html><body><div id="content-holder">${inner}</div></body></html>`;
  const html = (text: string, status = 200) => new Response(text, { status, headers: { "Content-Type": "text/html" } });
  type Note = {
    quote: string;
    prefix: string;
    suffix: string;
    diff?: { inserted: string; anchoredTo: string };
    version: { contentDigest: string; contentLength: number };
  };
  const buffer = (): Note[] => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]");
  const holder = () => document.getElementById("content-holder") as HTMLElement;

  async function annotate(range: Range, comment: string) {
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(range);
    document.dispatchEvent(new MouseEvent("mouseup"));
    await vi.advanceTimersByTimeAsync(20);
    (document.getElementById("blog-annot-btn") as HTMLElement).click();
    (document.getElementById("blog-annot-text") as HTMLTextAreaElement).value = comment;
    (document.getElementById("blog-annot-save") as HTMLElement).click();
  }

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    localStorage.clear();
    localStorage.setItem("blogAnnotate", "1");
    window.location.pathname = "/foo";
    window.scrollTo = vi.fn() as typeof window.scrollTo;
    window.scrollBy = vi.fn() as typeof window.scrollBy;
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => (url === "/foo" ? html(page(NEW)) : html(page(OLD)))),
    );
    document.body.innerHTML = `<div id="blog-annot-meta" data-permalink="/foo/" hidden></div><div id="content-holder">${NEW}</div>`;
    const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
    // The last <script> is the tool; the header comment mentions "<script>" in prose.
    const start = include.lastIndexOf("<script>");
    const script = include.slice(start + "<script>".length, include.lastIndexOf("</script>"));
    if (start < 0 || !script.trim()) throw new Error("no <script> in annotate.html");
    new Function(script)();
  });

  afterAll(async () => {
    if (document.getElementById("rich-diff-view")) await toggleRichDiff();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
    window.location.pathname = "/";
    document.body.innerHTML = "";
  });

  it("saves the same anchor and page digest as annotating the page itself, and survives toggling", async () => {
    await annotate(rangeFrom(holder(), "quick", "lazy"), "on the page");
    expect(buffer()).toHaveLength(1);

    expect(await toggleRichDiff()).toBe(true);
    const view = document.getElementById("rich-diff-view") as HTMLElement;
    expect(holder().style.display).toBe("none");
    await annotate(rangeFrom(view, "quick", "lazy"), "in the diff");

    const [onPage, inDiff] = buffer();
    expect(inDiff.quote).toBe("quick red fox leaps over the lazy");
    expect({ q: inDiff.quote, p: inDiff.prefix, s: inDiff.suffix }).toEqual({
      q: onPage.quote,
      p: onPage.prefix,
      s: onPage.suffix,
    });
    expect(inDiff.version.contentDigest).toBe(onPage.version.contentDigest);
    expect(inDiff.version.contentLength).toBe(onPage.version.contentLength);
    expect(inDiff.diff).toEqual({ inserted: "some", anchoredTo: "page" });
    expect(onPage.diff).toBeUndefined();

    expect(await toggleRichDiff()).toBe(false);
    expect(buffer()).toHaveLength(2);
    expect(document.querySelectorAll("#blog-annot-btn")).toHaveLength(1);
    expect(document.querySelectorAll("#blog-annot-pill")).toHaveLength(1);
    expect(document.getElementById("blog-annot-count")?.textContent).toBe("Review (2)");
    // Diff off: the note taken in the diff still resolves on the page, context and all.
    const text = (() => {
      const r = document.createRange();
      r.selectNodeContents(holder());
      return r.toString();
    })();
    expect(text).toContain(inDiff.prefix + inDiff.quote + inDiff.suffix);

    // And back on again: no second bubble, buffer untouched.
    expect(await toggleRichDiff()).toBe(true);
    expect(document.querySelectorAll("#blog-annot-btn")).toHaveLength(1);
    expect(buffer()).toHaveLength(2);
  });
});
