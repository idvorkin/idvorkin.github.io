import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  RANDOM_ARRIVAL_KEY,
  ROLL_MS,
  clearRandomArrival,
  goToRandomPage,
  initRandomDice,
  isRandomArrival,
  keepClearOfToc,
  markRandomArrival,
  normalizePath,
  pickNextRandomUrl,
} from "../random-dice";

vi.mock("../shared", () => ({
  get_random_page_url: vi.fn(async () => "/from-shared"),
}));

// vitest.setup.ts replaces window.location with a plain object; set its path directly.
function setPath(path: string) {
  (window.location as { pathname: string }).pathname = path;
}

describe("random-dice", () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    setPath("/");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("normalizePath", () => {
    it("drops trailing slashes, query and hash", () => {
      expect(normalizePath("/foo/")).toBe("/foo");
      expect(normalizePath("/foo?x=1#bar")).toBe("/foo");
      expect(normalizePath("/")).toBe("/");
    });

    it("decodes percent-encoding", () => {
      expect(normalizePath("/a%20b")).toBe("/a b");
    });
  });

  describe("arrival marking", () => {
    it("matches the marked path only", () => {
      markRandomArrival("/voices");
      expect(sessionStorage.getItem(RANDOM_ARRIVAL_KEY)).toBe("/voices");
      expect(isRandomArrival("/voices")).toBe(true);
      expect(isRandomArrival("/voices/")).toBe(true);
      expect(isRandomArrival("/other")).toBe(false);
    });

    it("is false with no mark", () => {
      expect(isRandomArrival("/voices")).toBe(false);
    });

    it("tolerates absent storage", () => {
      expect(() => markRandomArrival("/x", null)).not.toThrow();
      expect(isRandomArrival("/x", null)).toBe(false);
    });
  });

  describe("initRandomDice", () => {
    it("does not show on a normal visit", () => {
      setPath("/voices");
      expect(initRandomDice()).toBeNull();
      expect(document.getElementById("random-reroll-dice")).toBeNull();
    });

    it("shows on a random arrival", () => {
      markRandomArrival("/voices");
      setPath("/voices");
      const button = initRandomDice();
      expect(button).not.toBeNull();
      expect(document.getElementById("random-reroll-dice")).toBe(button);
      expect(button?.getAttribute("aria-label")).toBe("Another random post");
    });

    it("hides after following a normal link to another page", () => {
      markRandomArrival("/voices");
      setPath("/some-linked-post");
      expect(initRandomDice()).toBeNull();
    });

    it("only adds one button", () => {
      markRandomArrival("/voices");
      setPath("/voices");
      initRandomDice();
      expect(initRandomDice()).toBeNull();
      expect(document.querySelectorAll("#random-reroll-dice").length).toBe(1);
    });
  });

  describe("re-roll", () => {
    it("skips the current page when the pick repeats", async () => {
      const pick = vi.fn().mockResolvedValueOnce("/here").mockResolvedValueOnce("/here/").mockResolvedValue("/next");
      expect(await pickNextRandomUrl("/here", pick)).toBe("/next");
      expect(pick).toHaveBeenCalledTimes(3);
    });

    it("gives up after a few tries rather than looping forever", async () => {
      const pick = vi.fn().mockResolvedValue("/only");
      expect(await pickNextRandomUrl("/only", pick)).toBe("/only");
      expect(pick).toHaveBeenCalledTimes(5);
    });

    it("marks the new landing and navigates there", async () => {
      setPath("/voices");
      const navigate = vi.fn();
      await goToRandomPage(navigate, async () => "/eulogy");
      expect(navigate).toHaveBeenCalledWith("/eulogy");
      expect(isRandomArrival("/eulogy")).toBe(true);
      expect(isRandomArrival("/voices")).toBe(false);
    });

    it("uses the shared random picker by default", async () => {
      const navigate = vi.fn();
      await goToRandomPage(navigate);
      expect(navigate).toHaveBeenCalledWith("/from-shared");
    });

    it("clicking the dice tumbles, then re-rolls after the animation", async () => {
      vi.useFakeTimers();
      try {
        markRandomArrival("/voices");
        setPath("/voices");
        const assign = window.location.assign as ReturnType<typeof vi.fn>;
        assign.mockClear();
        const button = initRandomDice();
        button?.click();
        expect(button?.classList.contains("rrd-rolling")).toBe(true);
        expect(button?.disabled).toBe(true);
        await vi.advanceTimersByTimeAsync(ROLL_MS - 100);
        expect(assign).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(200);
        expect(assign).toHaveBeenCalledWith("/from-shared");
        expect(isRandomArrival("/from-shared")).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it("skips the animation delay under prefers-reduced-motion", async () => {
      const original = window.matchMedia;
      window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
      vi.useFakeTimers();
      try {
        markRandomArrival("/voices");
        setPath("/voices");
        const assign = window.location.assign as ReturnType<typeof vi.fn>;
        assign.mockClear();
        initRandomDice()?.click();
        await vi.advanceTimersByTimeAsync(1);
        expect(assign).toHaveBeenCalledWith("/from-shared");
      } finally {
        vi.useRealTimers();
        window.matchMedia = original;
      }
    });
  });

  describe("placement and styling", () => {
    it("sits bottom-right above the TOC button, with animations and reduced-motion opt-out", () => {
      markRandomArrival("/voices");
      setPath("/voices");
      initRandomDice();
      const css = document.getElementById("random-reroll-style")?.textContent ?? "";
      expect(css).toMatch(/#random-reroll\{position:fixed;right:/);
      expect(css).not.toMatch(/left:max/);
      expect(css).toContain("@keyframes rrd-roll");
      expect(css).toContain("@keyframes rrd-wiggle");
      expect(css).toContain("prefers-reduced-motion: reduce");
    });

    it("injects the style only once", () => {
      markRandomArrival("/voices");
      setPath("/voices");
      initRandomDice();
      document.getElementById("random-reroll")?.remove();
      initRandomDice();
      expect(document.querySelectorAll("#random-reroll-style").length).toBe(1);
    });
  });

  describe("dismiss (×)", () => {
    it("hides the dice, clears the flag and does not re-roll", async () => {
      markRandomArrival("/voices");
      setPath("/voices");
      const assign = window.location.assign as ReturnType<typeof vi.fn>;
      assign.mockClear();
      const dice = initRandomDice();
      const close = document.getElementById("random-reroll-close") as HTMLButtonElement;
      expect(close).not.toBeNull();
      expect(dice?.contains(close)).toBe(false);
      close.click();
      await new Promise((r) => setTimeout(r, ROLL_MS + 50));
      expect(document.getElementById("random-reroll-dice")).toBeNull();
      expect(sessionStorage.getItem(RANDOM_ARRIVAL_KEY)).toBeNull();
      expect(assign).not.toHaveBeenCalled();
    });

    it("stays gone on reload", () => {
      markRandomArrival("/voices");
      setPath("/voices");
      initRandomDice();
      (document.getElementById("random-reroll-close") as HTMLButtonElement).click();
      expect(initRandomDice()).toBeNull();
    });

    it("clearRandomArrival tolerates absent storage", () => {
      expect(() => clearRandomArrival(null)).not.toThrow();
    });
  });

  describe("header dice", () => {
    const repo = resolve(__dirname, "../..");

    it("is a plain /random link in the site header, so it works on every page", () => {
      const menu = readFileSync(resolve(repo, "_includes/site-menu.html"), "utf8");
      const link = menu.match(/<a[^>]*nav-random-dice[^>]*>/s)?.[0] ?? "";
      expect(link).toContain('href="/random"');
      expect(link).toContain('aria-label="Random post"');
      expect(menu).toContain("🎲");
    });

    it("/random marks the landing so the floating dice appears", () => {
      const random = readFileSync(resolve(repo, "random.md"), "utf8");
      expect(random).toContain("goToRandomPage");
    });
  });

  describe("keepClearOfToc", () => {
    function rect(top: number, height: number) {
      return { top, bottom: top + height, height, left: 0, right: 0, width: 44, x: 0, y: top, toJSON() {} } as DOMRect;
    }
    function setup(tocTop: number | null, tocHeight = 48) {
      Object.defineProperty(window, "innerHeight", { value: 664, configurable: true });
      if (tocTop != null) {
        const toc = document.createElement("div");
        toc.id = "id-ui-toc-dropdown";
        toc.getBoundingClientRect = () => rect(tocTop, tocHeight);
        document.body.appendChild(toc);
      }
      const wrap = document.createElement("div");
      // Default CSS spot: bottom 80px, 48px tall -> top 536, bottom 584.
      wrap.getBoundingClientRect = () => rect(536, 48);
      document.body.appendChild(wrap);
      return wrap;
    }

    it("leaves the CSS default alone when the TOC has its usual size", () => {
      const wrap = setup(596);
      keepClearOfToc(wrap);
      expect(wrap.style.bottom).toBe("");
    });

    it("raises the dice above a taller TOC instead of overlapping it", () => {
      // Text scaling: TOC is 80px tall, top at 564 -> dice must end by 552.
      const wrap = setup(564, 80);
      keepClearOfToc(wrap);
      expect(wrap.style.bottom).toBe(`${664 - 584 + (584 + 12 - 564)}px`);
    });

    it("is a no-op when the TOC is missing or hidden", () => {
      const wrap = setup(null);
      keepClearOfToc(wrap);
      expect(wrap.style.bottom).toBe("");
      const hidden = setup(0, 0);
      keepClearOfToc(hidden);
      expect(hidden.style.bottom).toBe("");
    });

    it("never touches the TOC itself and stays one layer below it", () => {
      markRandomArrival("/voices");
      setPath("/voices");
      const toc = document.createElement("div");
      toc.id = "id-ui-toc-dropdown";
      toc.setAttribute("style", "position:fixed;bottom:20px");
      document.body.appendChild(toc);
      initRandomDice();
      expect(toc.getAttribute("style")).toBe("position:fixed;bottom:20px");
      const css = document.getElementById("random-reroll-style")?.textContent ?? "";
      expect(css).toContain("z-index:9990");
    });
  });
});
