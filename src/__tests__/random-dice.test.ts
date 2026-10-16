import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  RANDOM_ARRIVAL_KEY,
  goToRandomPage,
  initRandomDice,
  isRandomArrival,
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

    it("clicking the dice re-rolls", async () => {
      markRandomArrival("/voices");
      setPath("/voices");
      const assign = window.location.assign as ReturnType<typeof vi.fn>;
      assign.mockClear();
      const button = initRandomDice();
      button?.click();
      await vi.waitFor(() => expect(assign).toHaveBeenCalledWith("/from-shared"));
      expect(button?.disabled).toBe(true);
      expect(isRandomArrival("/from-shared")).toBe(true);
    });
  });
});
