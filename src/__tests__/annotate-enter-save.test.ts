// ABOUTME: Two quick Enters (or one change appending two newlines) at the end of a non-empty annotate note save it.
// ABOUTME: Tests the pure rule exposed by the real _includes/annotate.html, then the composer wiring end to end.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type Step = { save: boolean; lastAt: number | null };
type Api = {
  ENTER_SAVE_MS: number;
  noteEnterStep: (prev: string, next: string, caretAtEnd: boolean, lastAt: number | null, now: number) => Step;
};
type Note = { comment: string; intent: string };

const api = () => (window as unknown as { blogAnnotate: Api }).blogAnnotate;
const buffer = (): Note[] => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]");
const textarea = () => document.getElementById("blog-annot-text") as HTMLTextAreaElement;
const modalOpen = () => (document.getElementById("blog-annot-modal") as HTMLElement).style.display === "flex";

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  localStorage.clear();
  localStorage.setItem("blogAnnotate", "1");
  window.scrollTo = vi.fn() as typeof window.scrollTo;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 503 })),
  );
  document.body.innerHTML = `<div id="blog-annot-meta" data-permalink="/foo/" hidden></div><div id="content-holder"><p>The quick brown fox jumps over the lazy dog.</p></div>`;
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

describe("noteEnterStep (the pure rule)", () => {
  const W = () => api().ENTER_SAVE_MS;

  it("uses one 400 ms window", () => {
    expect(W()).toBe(400);
  });

  it("saves on a second trailing Enter inside the window, inclusive", () => {
    const first = api().noteEnterStep("fix", "fix\n", true, null, 1000);
    expect(first).toEqual({ save: false, lastAt: 1000 });
    expect(api().noteEnterStep("fix\n", "fix\n\n", true, 1000, 1000 + W()).save).toBe(true);
  });

  it("keeps a slow second Enter as a line break and restarts the window from it", () => {
    const slow = api().noteEnterStep("fix\n", "fix\n\n", true, 1000, 1001 + W());
    expect(slow).toEqual({ save: false, lastAt: 1001 + W() });
  });

  it("saves when one change appends two or more trailing newlines (dictation)", () => {
    expect(api().noteEnterStep("fix", "fix\n\n", true, null, 0).save).toBe(true);
    expect(api().noteEnterStep("fix", "fix this line\n \n", true, null, 0).save).toBe(true);
    expect(api().noteEnterStep("fix", "fix\n\n\n", true, null, 0).save).toBe(true);
  });

  it("never saves an empty or whitespace-only note", () => {
    expect(api().noteEnterStep("", "\n\n", true, null, 0).save).toBe(false);
    expect(api().noteEnterStep("\n", "\n\n", true, 0, 10).save).toBe(false);
    expect(api().noteEnterStep("  ", "  \n\n", true, null, 0).save).toBe(false);
  });

  it("ignores Enters that are not at the end of the note", () => {
    expect(api().noteEnterStep("ab", "a\nb", false, null, 0)).toEqual({
      save: false,
      lastAt: null,
    });
    // Caret after "fix" in "fix\n": the result starts with the old value, but the caret is not at the end.
    expect(api().noteEnterStep("fix\n", "fix\n\n", false, 0, 10)).toEqual({
      save: false,
      lastAt: null,
    });
  });

  it("forgets the pending Enter on any other input", () => {
    const typed = api().noteEnterStep("fix\n", "fix\nb", true, 1000, 1010);
    expect(typed).toEqual({ save: false, lastAt: null });
    expect(api().noteEnterStep("fix\nb", "fix\nb\n", true, null, 1020)).toEqual({ save: false, lastAt: 1020 });
    expect(api().noteEnterStep("fix\nb\n", "fix\nb", true, 1020, 1030)).toEqual({ save: false, lastAt: null });
  });
});

describe("the composer", () => {
  function openComposer() {
    const p = document.querySelector("#content-holder p") as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(p);
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(range);
    document.dispatchEvent(new MouseEvent("mouseup"));
    vi.advanceTimersByTime(20);
    (document.getElementById("blog-annot-btn") as HTMLElement).click();
  }
  function type(value: string, isComposing = false) {
    const ta = textarea();
    ta.value = value;
    ta.setSelectionRange(value.length, value.length);
    ta.dispatchEvent(new InputEvent("input", { bubbles: true, isComposing }));
  }

  beforeEach(() => {
    localStorage.setItem("blogAnnotateBuffer", "[]");
    openComposer();
  });

  it("two quick trailing Enters save the trimmed note with the chosen intent", () => {
    (document.querySelector('button[data-intent="cut"]') as HTMLElement).click();
    type("too wordy");
    type("too wordy\n");
    type("too wordy\n\n");
    expect(buffer()).toEqual([expect.objectContaining({ comment: "too wordy", intent: "cut" })]);
    expect(modalOpen()).toBe(false);
  });

  it("one dictated change ending in two newlines saves once", () => {
    type("tighten this\n\n");
    expect(buffer()).toHaveLength(1);
    expect(buffer()[0].comment).toBe("tighten this");
    expect(modalOpen()).toBe(false);
  });

  it("counts newlines from a keyboard that marks its input as composing", () => {
    type("dictated note", true);
    type("dictated note\n\n", true);
    expect(buffer()).toEqual([expect.objectContaining({ comment: "dictated note" })]);
  });

  it("a single Enter stays a line break", () => {
    type("line one");
    type("line one\n");
    expect(buffer()).toHaveLength(0);
    expect(modalOpen()).toBe(true);
    expect(textarea().value).toBe("line one\n");
  });
});
