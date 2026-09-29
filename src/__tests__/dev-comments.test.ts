// ABOUTME: The dev banner's "Comments" button toggles the real annotate tool (_includes/annotate.html) live:
// ABOUTME: same localStorage flag as ?annotate=1, no reload, and an open "Diff vs main" view stays open.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { initDevInfo } from "../dev-info";
import { toggleRichDiff } from "../rich-diff";

const PAGE = "<p>Intro stays the same here.</p>\n<p>The quick red fox leaps over the lazy dog.</p>";
const OLD = "<p>Intro stays the same here.</p>\n<p>The quick brown fox jumps over the lazy dog.</p>";

const loadAnnotate = () => {
  const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
  // The last <script> is the tool; the header comment mentions "<script>" in prose.
  const start = include.lastIndexOf("<script>");
  new Function(include.slice(start + "<script>".length, include.lastIndexOf("</script>")))();
};

const html = (inner: string) =>
  new Response(`<html><body><div id="content-holder">${inner}</div></body></html>`, {
    headers: { "Content-Type": "text/html" },
  });

function selectIn(root: Element, needle: string) {
  const walker = document.createTreeWalker(root, 4);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const i = n.data.indexOf(needle);
    if (i < 0 || n.parentElement?.closest("del")) continue;
    const r = document.createRange();
    r.setStart(n, i);
    r.setEnd(n, i + needle.length);
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(r);
    return;
  }
  throw new Error(`"${needle}" not found`);
}

async function settleSelection() {
  document.dispatchEvent(new MouseEvent("mouseup"));
  await vi.advanceTimersByTimeAsync(20);
}

describe("dev banner Comments button", () => {
  const button = () => document.getElementById("dev-comments-toggle") as HTMLButtonElement;
  const off = () => document.documentElement.classList.contains("blog-annot-off");

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    localStorage.clear();
    (window as any).__GIT_BRANCH__ = "dev-banner-comments";
    (window as any).__GIT_CHANGED__ = ["/foo"];
    window.location.pathname = "/foo";
    window.location.port = "4000";
    window.location.reload = vi.fn();
    window.scrollTo = vi.fn() as typeof window.scrollTo;
    window.scrollBy = vi.fn() as typeof window.scrollBy;
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => html(url === "/foo" ? PAGE : OLD)),
    );
    document.body.innerHTML = `<div id="blog-annot-meta" data-permalink="/foo/" hidden></div><div id="content-holder">${PAGE}</div>`;
    loadAnnotate();
    initDevInfo();
  });

  afterAll(async () => {
    if (document.getElementById("rich-diff-view")) await toggleRichDiff();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
    (window as any).__GIT_BRANCH__ = undefined;
    (window as any).__GIT_CHANGED__ = undefined;
    (window as any).blogAnnotate = undefined;
    window.location.pathname = "/";
    document.documentElement.classList.remove("blog-annot-off");
    document.body.innerHTML = "";
  });

  it("starts off: no annotate UI, button not pressed", () => {
    expect(button().getAttribute("aria-pressed")).toBe("false");
    expect(document.getElementById("blog-annot-pill")).toBeNull();
    expect(localStorage.getItem("blogAnnotate")).toBeNull();
  });

  it("turns annotate on live, sets the ?annotate=1 flag, and never reloads", async () => {
    button().click();
    expect(localStorage.getItem("blogAnnotate")).toBe("1");
    expect(button().getAttribute("aria-pressed")).toBe("true");
    expect(button().textContent).toContain("Comments on");
    expect(off()).toBe(false);
    expect(document.getElementById("blog-annot-pill")).not.toBeNull();
    expect(window.location.reload).not.toHaveBeenCalled();

    selectIn(document.getElementById("content-holder") as Element, "lazy dog");
    await settleSelection();
    (document.getElementById("blog-annot-btn") as HTMLElement).click();
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).toBe("lazy dog");
    (document.getElementById("blog-annot-cancel") as HTMLElement).click();
  });

  it("turns off and back on inside the diff view without leaving it", async () => {
    await toggleRichDiff();
    const view = document.getElementById("rich-diff-view") as HTMLElement;

    button().click();
    expect(localStorage.getItem("blogAnnotate")).toBeNull();
    expect(off()).toBe(true);
    expect(button().getAttribute("aria-pressed")).toBe("false");
    // Off: a selection offers nothing.
    selectIn(view, "over the");
    await settleSelection();
    (document.getElementById("blog-annot-btn") as HTMLElement).click();
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).not.toBe("over the");
    (document.getElementById("blog-annot-cancel") as HTMLElement | null)?.click();

    button().click();
    expect(off()).toBe(false);
    expect(document.getElementById("rich-diff-view")).toBe(view); // diff still open, nothing reloaded
    expect(document.querySelectorAll("#blog-annot-btn")).toHaveLength(1); // UI built once, reused
    selectIn(view, "over the");
    await settleSelection();
    (document.getElementById("blog-annot-btn") as HTMLElement).click();
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).toBe("over the");
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});

describe("dev banner without the annotate tool", () => {
  it("shows no Comments button on pages that don't include annotate.html", () => {
    (window as any).__GIT_BRANCH__ = "b";
    window.location.port = "4000";
    document.body.innerHTML = "";
    initDevInfo();
    expect(document.getElementById("dev-info-banner")).not.toBeNull();
    expect(document.getElementById("dev-comments-toggle")).toBeNull();
    (window as any).__GIT_BRANCH__ = undefined;
    document.body.innerHTML = "";
  });
});
