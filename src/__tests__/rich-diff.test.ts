// ABOUTME: Verifies the rendered-page diff: block alignment, edit pairing, and word-level marks that keep markup.
// ABOUTME: Also covers the change navigator (counter, keys, seen tracking, change map, cleanup).

import { afterEach, describe, expect, it, vi } from "vitest";
import { attachChangeNav } from "../diff-nav";
import {
  baseUrl,
  diffBlocks,
  extractBlocks,
  lcsPairs,
  markWordDiff,
  renderDiff,
  toggleRichDiff,
  tokenize,
} from "../rich-diff";

const body = (html: string) => {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el;
};

describe("lcsPairs", () => {
  it("aligns the longest common subsequence", () => {
    expect(lcsPairs(["a", "b", "c", "d"], ["a", "c", "x", "d"])).toEqual([
      [0, 0],
      [2, 1],
      [3, 3],
    ]);
  });
});

describe("tokenize", () => {
  it("splits words, spaces and punctuation", () => {
    expect(tokenize("Don't stop, ok")).toEqual(["Don't", " ", "stop", ",", " ", "ok"]);
  });
});

describe("extractBlocks", () => {
  it("skips the TOC dropdown", () => {
    const blocks = extractBlocks(body("<div data-pagefind-ignore>toc</div><p>one</p><h2>two</h2>"));
    expect(blocks.map((b) => b.tagName)).toEqual(["P", "H2"]);
  });
});

describe("diffBlocks", () => {
  it("marks same, changed, removed and added blocks", () => {
    const old = extractBlocks(body("<p>keep me</p><p>the quick brown fox jumps</p><p>gone for good</p>"));
    const now = extractBlocks(body("<p>keep me</p><p>the quick red fox jumps</p><h2>brand new</h2>"));
    expect(diffBlocks(old, now).map((o) => o.kind)).toEqual(["same", "changed", "added", "removed"]);
  });

  it("treats a page with no old copy as all added", () => {
    const now = extractBlocks(body("<p>a</p><p>b</p>"));
    expect(diffBlocks([], now).map((o) => o.kind)).toEqual(["added", "added"]);
  });

  it("compares widgets by markup and never word-diffs them", () => {
    const old = extractBlocks(body('<div id="w">chart<script>draw(1)</script></div>'));
    const now = extractBlocks(body('<div id="w">chart<script>draw(2)</script></div>'));
    const ops = diffBlocks(old, now);
    expect(ops.map((o) => o.kind)).toEqual(["changed"]);
    const { view } = renderDiff(document, ops);
    expect(view.querySelector(".rd-note")?.textContent).toContain("not diffed word by word");
  });
});

describe("markWordDiff", () => {
  it("wraps inserted words and splices deleted ones, keeping links", () => {
    const old = body('<p>See <a href="/x">the post</a> for the old details.</p>').firstElementChild as Element;
    const fresh = body('<p>See <a href="/x">the post</a> for the new details.</p>').firstElementChild as Element;
    expect(markWordDiff(old, fresh)).toBe(true);
    expect(fresh.querySelector("a")?.getAttribute("href")).toBe("/x");
    expect(fresh.querySelector("ins")?.textContent).toBe("new");
    expect(fresh.querySelector("del")?.textContent?.trim()).toBe("old");
  });

  it("groups a reworded phrase instead of interleaving word by word", () => {
    const old = body("<p>I used to think the fix was obvious.</p>").firstElementChild as Element;
    const fresh = body("<p>For years I assumed the fix was obvious.</p>").firstElementChild as Element;
    markWordDiff(old, fresh);
    expect(Array.from(fresh.querySelectorAll("ins")).map((e) => e.textContent)).toEqual(["For years", "assumed"]);
    expect(Array.from(fresh.querySelectorAll("del")).map((e) => e.textContent?.trim())).toEqual(["used to think"]);
    expect(fresh.textContent).toContain("the fix was obvious.");
  });

  it("puts a trailing deletion after the last kept word", () => {
    const old = body("<p>Flat curve. Often an injury.</p>").firstElementChild as Element;
    const fresh = body("<p>Flat curve.</p>").firstElementChild as Element;
    markWordDiff(old, fresh);
    expect(fresh.innerHTML).toBe("Flat curve.<del> Often an injury.</del>");
  });
});

describe("attachChangeNav", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const setup = (n: number) => {
    window.scrollTo = vi.fn() as typeof window.scrollTo;
    const els = Array.from({ length: n }, (_, i) => {
      const el = document.createElement("div");
      el.textContent = `change ${i}`;
      document.body.appendChild(el);
      return el;
    });
    return attachChangeNav(els.map((el) => ({ el, kind: "changed" as const })));
  };
  const counter = () => document.querySelector("#rd-nav .rd-count")?.textContent;
  const key = (k: string) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

  it("counts position and seen changes as you walk them with n/p and j/k", () => {
    const nav = setup(3);
    expect(counter()).toContain("3 changes");
    expect(document.querySelectorAll("#rd-map .rd-tick")).toHaveLength(3);
    key("n");
    expect(counter()).toContain("change 1 of 3");
    expect(counter()).toContain("1 of 3 seen");
    key("j");
    key("j");
    expect(counter()).toContain("change 3 of 3");
    expect(counter()).toContain("all 3 seen");
    key("p");
    expect(counter()).toContain("change 2 of 3");
    key("k");
    key("k");
    expect(counter()).toContain("change 3 of 3"); // wraps
    nav.dispose();
  });

  it("jumps from a change-map tick and ignores keys typed into inputs", () => {
    const nav = setup(4);
    (document.querySelectorAll("#rd-map .rd-tick")[2] as HTMLElement).click();
    expect(counter()).toContain("change 3 of 4");
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "n", bubbles: true }));
    expect(counter()).toContain("change 3 of 4");
    nav.dispose();
  });

  it("removes its control, map and key handler on dispose", () => {
    const nav = setup(2);
    nav.dispose();
    expect(document.getElementById("rd-nav")).toBeNull();
    expect(document.getElementById("rd-map")).toBeNull();
    key("n"); // must not throw or re-render
  });
});

describe("renderDiff lists", () => {
  it("diffs a changed list item by item", () => {
    const old = extractBlocks(
      body("<ol><li>fits me</li><li>how I learn what it is for</li><li>best of each</li></ol>"),
    );
    const now = extractBlocks(body("<ol><li>fits me well</li><li>best of each</li></ol>"));
    const { view } = renderDiff(document, diffBlocks(old, now));
    const items = Array.from(view.querySelectorAll("li"));
    expect(items.map((li) => li.className)).toEqual(["rd-li-changed", "rd-li-removed", ""]);
    expect(items[0].querySelector("ins")?.textContent).toBe("well");
  });
});

describe("baseUrl", () => {
  it("maps a page to its main-branch copy on the same origin", () => {
    expect(baseUrl("/foo")).toBe("/_diff-base/foo");
    expect(baseUrl("/foo/")).toBe("/_diff-base/foo");
    expect(baseUrl("/a/b.html")).toBe("/_diff-base/a/b.html");
  });
});

describe("toggleRichDiff", () => {
  const page = (inner: string) =>
    `<html><body><div id="content-holder"><div data-pagefind-ignore>toc</div>${inner}</div></body></html>`;
  const html = (status: number, text = "") => new Response(text, { status, headers: { "Content-Type": "text/html" } });
  let fetchMock: ReturnType<typeof vi.fn>;

  const start = (responses: Record<string, Response | Error>) => {
    document.body.innerHTML = '<div id="content-holder"><p>live</p></div>';
    window.location.pathname = "/foo"; // vitest.setup.ts replaces location with a plain object
    window.scrollTo = vi.fn() as typeof window.scrollTo;
    window.scrollBy = vi.fn() as typeof window.scrollBy;
    Element.prototype.scrollIntoView = vi.fn();
    fetchMock = vi.fn(async (url: string) => {
      const r = responses[url];
      if (!r) throw new Error(`unexpected fetch ${url}`);
      if (r instanceof Error) throw r;
      return r;
    });
    vi.stubGlobal("fetch", fetchMock);
  };

  afterEach(async () => {
    if (document.getElementById("rich-diff-view")) await toggleRichDiff(); // reset module state
    vi.unstubAllGlobals();
    window.location.pathname = "/";
    document.body.innerHTML = "";
  });

  const summary = () => document.querySelector("#rich-diff-view .rd-summary")?.textContent || "";

  it("diffs against the main-branch copy served same-origin, never idvork.in", async () => {
    start({
      "/foo": html(200, page("<p>keep</p><p>new words here</p>")),
      "/_diff-base/foo": html(200, page("<p>keep</p>")),
    });
    expect(await toggleRichDiff()).toBe(true);
    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(urls.sort()).toEqual(["/_diff-base/foo", "/foo"]);
    expect(urls.some((u) => u.includes("idvork.in"))).toBe(false);
    expect(summary()).toContain("+1 added");
    expect(summary()).not.toContain("new page");
  });

  it("shows a page missing on main as a new page", async () => {
    start({ "/foo": html(200, page("<p>a</p>")), "/_diff-base/foo": html(404) });
    await toggleRichDiff();
    expect(summary()).toContain("new page");
    expect(summary()).toContain("+1 added");
  });

  it("names the request that failed", async () => {
    start({ "/foo": html(200, page("<p>a</p>")), "/_diff-base/foo": new TypeError("Failed to fetch") });
    await toggleRichDiff();
    expect(summary()).toContain("Diff vs main failed");
    expect(summary()).toContain("/_diff-base/foo");
    expect(summary()).toContain("Failed to fetch");
  });

  it("names the base copy when it returns an HTTP error", async () => {
    start({ "/foo": html(200, page("<p>a</p>")), "/_diff-base/foo": html(500) });
    await toggleRichDiff();
    expect(summary()).toContain("/_diff-base/foo");
    expect(summary()).toContain("HTTP 500");
  });
});
