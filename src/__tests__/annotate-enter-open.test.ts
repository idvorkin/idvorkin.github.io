// ABOUTME: Enter with the selection's Comment bubble up opens the annotate composer, exactly as a tap would.
// ABOUTME: Tests the pure rule exposed by the real _includes/annotate.html, then the keydown wiring end to end.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type Api = {
  enterOpensComposer: (
    e: Partial<KeyboardEvent>,
    live: boolean,
    composerOpen: boolean,
    bubbleShown: boolean,
  ) => boolean;
};

const api = () => (window as unknown as { blogAnnotate: Api }).blogAnnotate;
const textarea = () => document.getElementById("blog-annot-text") as HTMLTextAreaElement | null;
const modal = () => document.getElementById("blog-annot-modal") as HTMLElement;
const modalOpen = () => modal().style.display === "flex";
const bubble = () => document.getElementById("blog-annot-btn") as HTMLElement;

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  localStorage.clear();
  localStorage.setItem("blogAnnotate", "1");
  window.scrollTo = vi.fn() as typeof window.scrollTo;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 503 })),
  );
  document.body.innerHTML = `<div id="blog-annot-meta" data-permalink="/foo/" hidden></div><div id="content-holder"><p>The quick brown fox jumps over the lazy dog.</p><input id="other-field" /></div>`;
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

describe("enterOpensComposer (the pure rule)", () => {
  const body = document.createElement("div");
  const enter = (extra: Partial<KeyboardEvent> = {}) =>
    ({ key: "Enter", target: body, ...extra }) as Partial<KeyboardEvent>;

  it("opens on a plain Enter with the bubble up", () => {
    expect(api().enterOpensComposer(enter(), true, false, true)).toBe(true);
  });

  it("needs comment mode on, the bubble showing and the composer shut", () => {
    expect(api().enterOpensComposer(enter(), false, false, true)).toBe(false);
    expect(api().enterOpensComposer(enter(), true, false, false)).toBe(false);
    expect(api().enterOpensComposer(enter(), true, true, true)).toBe(false);
  });

  it("ignores modified, repeated, composing or already-handled Enters and other keys", () => {
    for (const k of ["metaKey", "ctrlKey", "altKey", "shiftKey", "repeat", "isComposing", "defaultPrevented"]) {
      expect(api().enterOpensComposer(enter({ [k]: true }), true, false, true)).toBe(false);
    }
    expect(api().enterOpensComposer(enter({ key: "a" }), true, false, true)).toBe(false);
  });

  it("leaves Enter alone in fields, buttons, links and contenteditable", () => {
    for (const tag of ["input", "textarea", "select", "button", "a"]) {
      expect(api().enterOpensComposer(enter({ target: document.createElement(tag) }), true, false, true)).toBe(false);
    }
    const ce = document.createElement("div");
    Object.defineProperty(ce, "isContentEditable", { value: true });
    expect(api().enterOpensComposer(enter({ target: ce }), true, false, true)).toBe(false);
  });
});

describe("pressing Enter on the page", () => {
  function select() {
    const p = document.querySelector("#content-holder p") as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(p);
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(range);
    document.dispatchEvent(new MouseEvent("mouseup"));
    vi.advanceTimersByTime(20);
    // jsdom has no layout, so positionBtn sees a zero-size range and hides the
    // bubble; the selection is still recorded. Show it as a browser would.
    bubble().style.display = "block";
  }
  function pressEnter(target: EventTarget = document.body, init: KeyboardEventInit = {}) {
    const e = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(e);
    return e;
  }

  beforeEach(() => {
    if (modalOpen()) (document.getElementById("blog-annot-cancel") as HTMLElement).click();
    window.getSelection()?.removeAllRanges();
    bubble().style.display = "none";
  });

  it("opens the composer for the selection and swallows the Enter", () => {
    select();
    const e = pressEnter();
    expect(e.defaultPrevented).toBe(true);
    expect(modalOpen()).toBe(true);
    expect(textarea()?.value).toBe("");
    expect(document.querySelector("#blog-annot-card blockquote")?.textContent).toContain("quick brown fox");
  });

  it("does nothing without the bubble", () => {
    const e = pressEnter();
    expect(e.defaultPrevented).toBe(false);
    expect(modalOpen()).toBe(false);
  });

  it("does nothing on Shift+Enter or Enter in another field", () => {
    select();
    expect(pressEnter(document.body, { shiftKey: true }).defaultPrevented).toBe(false);
    expect(pressEnter(document.getElementById("other-field") as HTMLElement).defaultPrevented).toBe(false);
    expect(modalOpen()).toBe(false);
  });

  it("a second Enter inside the open composer does not reopen or reset it", () => {
    select();
    pressEnter();
    const ta = textarea() as HTMLTextAreaElement;
    ta.value = "note";
    expect(pressEnter(ta).defaultPrevented).toBe(false);
    expect(modalOpen()).toBe(true);
    expect(textarea()?.value).toBe("note");
  });
});
