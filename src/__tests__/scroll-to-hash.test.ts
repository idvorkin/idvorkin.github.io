import { beforeEach, describe, expect, it, vi } from "vitest";
import { alignmentErrorPx, installHashScrollCorrection, targetForHash } from "../scroll-to-hash";

describe("targetForHash", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("resolves a plain fragment by id", () => {
    document.body.innerHTML = '<h3 id="physical">Physical</h3>';
    expect(targetForHash("#physical")?.id).toBe("physical");
  });

  it("accepts the fragment without its leading hash", () => {
    document.body.innerHTML = '<h3 id="physical">Physical</h3>';
    expect(targetForHash("physical")?.id).toBe("physical");
  });

  it("resolves percent-encoded fragments", () => {
    document.body.innerHTML = '<h3 id="a b">Spaced</h3>';
    expect(targetForHash("#a%20b")?.id).toBe("a b");
  });

  it("falls back to the literal text when the escape sequence is malformed", () => {
    document.body.innerHTML = '<h3 id="100%">Full</h3>';
    expect(targetForHash("#100%")?.id).toBe("100%");
  });

  it("falls back to a named anchor", () => {
    document.body.innerHTML = '<a name="legacy"></a>';
    expect(targetForHash("#legacy")).not.toBeNull();
  });

  it("returns null for an empty or unknown fragment", () => {
    expect(targetForHash("")).toBeNull();
    expect(targetForHash("#nope")).toBeNull();
  });
});

describe("alignmentErrorPx", () => {
  it("reports how far the target sits below its resting place", () => {
    document.body.innerHTML = '<h3 id="physical">Physical</h3>';
    const el = document.getElementById("physical") as HTMLElement;
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 360 } as DOMRect);
    expect(alignmentErrorPx(el)).toBe(360);
  });

  it("subtracts scroll-padding-top and scroll-margin-top", () => {
    document.body.innerHTML = '<h3 id="physical" style="scroll-margin-top: 20px">Physical</h3>';
    const el = document.getElementById("physical") as HTMLElement;
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 90 } as DOMRect);

    const realGetComputedStyle = window.getComputedStyle.bind(window);
    const fakeWindow = {
      getComputedStyle: (node: Element) =>
        node === el
          ? ({ scrollMarginTop: "20px" } as CSSStyleDeclaration)
          : ({ scrollPaddingTop: "60px" } as CSSStyleDeclaration),
    } as unknown as Window;

    expect(alignmentErrorPx(el, fakeWindow)).toBe(10);
    expect(realGetComputedStyle(el)).toBeTruthy();
  });

  it("treats a non-numeric scroll-padding-top (e.g. `auto`) as zero", () => {
    document.body.innerHTML = '<h3 id="physical">Physical</h3>';
    const el = document.getElementById("physical") as HTMLElement;
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 42 } as DOMRect);
    const fakeWindow = {
      getComputedStyle: () => ({ scrollPaddingTop: "auto", scrollMarginTop: "auto" }) as CSSStyleDeclaration,
    } as unknown as Window;
    expect(alignmentErrorPx(el, fakeWindow)).toBe(42);
  });
});

describe("installHashScrollCorrection", () => {
  const makeWindow = (overrides: Record<string, unknown> = {}) => {
    const listeners: Record<string, ((e: Event) => void)[]> = {};
    const win = {
      location: { hash: "#physical" },
      document,
      performance: { now: () => 0, getEntriesByType: () => [{ type: "navigate" }] },
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
      addEventListener: vi.fn((type: string, fn: (e: Event) => void) => {
        if (!listeners[type]) listeners[type] = [];
        listeners[type].push(fn);
      }),
      removeEventListener: vi.fn(),
      getComputedStyle: () => ({ scrollPaddingTop: "0px", scrollMarginTop: "0px" }) as CSSStyleDeclaration,
      ResizeObserver: undefined,
      ...overrides,
    } as unknown as Window;
    return { win, listeners };
  };

  beforeEach(() => {
    document.body.innerHTML = '<h3 id="physical">Physical</h3>';
  });

  it("does nothing when the URL carries no fragment", () => {
    const { win } = makeWindow({ location: { hash: "" } });
    installHashScrollCorrection(win);
    expect(win.addEventListener).not.toHaveBeenCalled();
  });

  it("stands down when the reader scrolled before the module loaded", () => {
    const { win } = makeWindow({ __readerScrolled: true });
    installHashScrollCorrection(win);
    expect(win.addEventListener).not.toHaveBeenCalled();
  });

  it("stays out of the way of a back/forward scroll restore", () => {
    const { win } = makeWindow({
      performance: { now: () => 0, getEntriesByType: () => [{ type: "back_forward" }] },
    });
    installHashScrollCorrection(win);
    expect(win.addEventListener).not.toHaveBeenCalled();
  });

  it("watches for scrolls and for reader input when a fragment is present", () => {
    const { win } = makeWindow();
    installHashScrollCorrection(win);
    const types = (win.addEventListener as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[0]);
    expect(types).toEqual(expect.arrayContaining(["scroll", "wheel", "touchstart", "mousedown", "keydown"]));
  });

  it("disarms permanently once the reader scrolls", () => {
    const { win, listeners } = makeWindow();
    installHashScrollCorrection(win);
    listeners.wheel[0](new Event("wheel"));
    expect(win.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("ignores keys that do not scroll the page", () => {
    const { win, listeners } = makeWindow();
    installHashScrollCorrection(win);
    listeners.keydown[0]({ type: "keydown", key: "a" } as unknown as Event);
    expect(win.removeEventListener).not.toHaveBeenCalled();

    listeners.keydown[0]({ type: "keydown", key: "PageDown" } as unknown as Event);
    expect(win.removeEventListener).toHaveBeenCalled();
  });

  it("returns a disposer that tears the listeners down", () => {
    const { win } = makeWindow();
    const dispose = installHashScrollCorrection(win);
    dispose();
    expect(win.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
