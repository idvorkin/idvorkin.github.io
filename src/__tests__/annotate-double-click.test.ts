// ABOUTME: Double-click inside the annotate selection opens the note box, or the saved note on that spot to edit.
// ABOUTME: Tests the pure double-press rule exposed by the real _includes/annotate.html, then the edit-in-place wiring.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type Press = { t: number; x: number; y: number };
type Api = {
  DOUBLE_PRESS_MS: number;
  DOUBLE_PRESS_PX: number;
  isDoublePress: (prev: Press | null, press: Press) => boolean;
};
type Note = { quote: string; prefix: string; suffix: string; comment: string; intent: string; ts: string };

const api = () => (window as unknown as { blogAnnotate: Api }).blogAnnotate;
const buffer = (): Note[] => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]");
const textarea = () => document.getElementById("blog-annot-text") as HTMLTextAreaElement | null;
const modalOpen = () => (document.getElementById("blog-annot-modal") as HTMLElement).style.display === "flex";

const SENTENCE = "The quick brown fox jumps over the lazy dog.";
let caretOffset = 0; // where the stubbed caretRangeFromPoint lands in the paragraph's text node

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
  localStorage.clear();
  localStorage.setItem("blogAnnotate", "1");
  window.scrollTo = vi.fn() as typeof window.scrollTo;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 503 })),
  );
  document.body.innerHTML = `<div id="blog-annot-meta" data-permalink="/foo/" hidden></div><div id="content-holder"><p>${SENTENCE}</p></div>`;
  // jsdom has no layout: point the caret at a chosen offset in the sentence instead.
  (document as unknown as { caretRangeFromPoint: () => Range }).caretRangeFromPoint = () => {
    const r = document.createRange();
    r.setStart((document.querySelector("#content-holder p") as HTMLElement).firstChild as Node, caretOffset);
    return r;
  };
  const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
  const start = include.lastIndexOf("<script>");
  new Function(include.slice(start + "<script>".length, include.lastIndexOf("</script>")))();
});

afterAll(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.body.innerHTML = "";
});

describe("isDoublePress (the pure rule)", () => {
  const MS = () => api().DOUBLE_PRESS_MS;
  const PX = () => api().DOUBLE_PRESS_PX;

  it("uses a 500 ms, 24 px window", () => {
    expect(MS()).toBe(500);
    expect(PX()).toBe(24);
  });

  it("needs a previous press", () => {
    expect(api().isDoublePress(null, { t: 0, x: 0, y: 0 })).toBe(false);
  });

  it("is a double press inside the window, inclusive at both edges", () => {
    expect(api().isDoublePress({ t: 1000, x: 10, y: 10 }, { t: 1000 + MS(), x: 10 + PX(), y: 10 })).toBe(true);
  });

  it("is not a double press when too slow, too far or out of order", () => {
    expect(api().isDoublePress({ t: 1000, x: 10, y: 10 }, { t: 1001 + MS(), x: 10, y: 10 })).toBe(false);
    expect(api().isDoublePress({ t: 1000, x: 10, y: 10 }, { t: 1100, x: 10 + PX(), y: 11 })).toBe(false);
    expect(api().isDoublePress({ t: 1000, x: 10, y: 10 }, { t: 900, x: 10, y: 10 })).toBe(false);
  });
});

describe("double-click inside the selection", () => {
  const saved = (comment: string, intent: string): Note => ({
    quote: "brown fox",
    prefix: "The quick ",
    suffix: " jumps over the lazy dog.",
    comment,
    intent,
    ts: "2026-11-14T10:00:00.000Z",
  });
  const bubble = () => document.getElementById("blog-annot-btn") as HTMLElement;
  function settle() {
    document.dispatchEvent(new MouseEvent("mouseup"));
    vi.advanceTimersByTime(20);
  }
  function selectSentence() {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("#content-holder p") as HTMLElement);
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(range);
    settle();
  }
  function press(x = 50, y = 50) {
    const p = document.querySelector("#content-holder p") as HTMLElement;
    p.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: x, clientY: y }));
  }
  function doubleClick() {
    press();
    vi.advanceTimersByTime(120);
    press();
  }

  beforeAll(() => {
    // jsdom has no layout: give every range one box around the point the presses use.
    const box = { left: 0, top: 0, right: 500, bottom: 100, width: 500, height: 100, x: 0, y: 0 } as DOMRect;
    Range.prototype.getClientRects = () => Object.assign([box], { item: () => box }) as unknown as DOMRectList;
    Range.prototype.getBoundingClientRect = () => box;
  });

  beforeEach(() => {
    vi.advanceTimersByTime(1000); // no press from the previous test counts
    (document.getElementById("blog-annot-modal") as HTMLElement).style.display = "none";
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify([saved("tighten", "cut")]));
    selectSentence();
    expect(bubble().style.display).toBe("block");
  });

  it("opens a new note for the whole selection", () => {
    caretOffset = SENTENCE.indexOf("lazy");
    doubleClick();
    expect(modalOpen()).toBe(true);
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).toBe(SENTENCE);
    expect(textarea()?.value).toBe("");
    expect(document.querySelector("#blog-annot-card .hint")?.textContent).not.toContain("Editing");
  });

  it("on a spot with a saved note, opens that note with its comment and intent", () => {
    caretOffset = SENTENCE.indexOf("fox");
    doubleClick();
    expect(modalOpen()).toBe(true);
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).toBe("brown fox");
    expect(textarea()?.value).toBe("tighten");
    expect(document.querySelector('button[data-intent="cut"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector("#blog-annot-card .hint")?.textContent).toContain("Editing saved note");
  });

  it("Save on a saved note replaces it in place with a fresh timestamp", () => {
    caretOffset = SENTENCE.indexOf("brown");
    doubleClick();
    (textarea() as HTMLTextAreaElement).value = "tighten, then cut";
    (document.querySelector('button[data-intent="rewrite"]') as HTMLElement).click();
    (document.getElementById("blog-annot-save") as HTMLElement).click();
    const list = buffer();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({
      quote: "brown fox",
      prefix: "The quick ",
      comment: "tighten, then cut",
      intent: "rewrite",
    });
    expect(list[0].ts).not.toBe("2026-11-14T10:00:00.000Z");
  });

  it("a note saved on another page is not offered", () => {
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify([{ ...saved("x", "fix"), permalink: "/other/" }]));
    caretOffset = SENTENCE.indexOf("fox");
    doubleClick();
    expect(textarea()?.value).toBe("");
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).toBe(SENTENCE);
  });

  it("with no selection does nothing, even on a saved note", () => {
    (window.getSelection() as Selection).removeAllRanges();
    settle();
    expect(bubble().style.display).toBe("none");
    caretOffset = SENTENCE.indexOf("fox");
    doubleClick();
    expect(modalOpen()).toBe(false);
    expect(buffer()).toEqual([saved("tighten", "cut")]);
  });

  it("two slow presses are not a double-click", () => {
    press();
    vi.advanceTimersByTime(api().DOUBLE_PRESS_MS + 1);
    press();
    expect(modalOpen()).toBe(false);
  });
});
