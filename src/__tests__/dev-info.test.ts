import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  diffButton,
  getChangedPages,
  getCurrentPR,
  getCurrentPort,
  initDevInfo,
  isChangedPage,
  isDevServer,
  wantsDiffOnLoad,
} from "../dev-info";

const richDiff = vi.hoisted(() => ({ on: false }));

vi.mock("../rich-diff", () => ({
  toggleRichDiff: vi.fn(async () => {
    richDiff.on = !richDiff.on;
    return richDiff.on;
  }),
}));

describe("dev-info", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    (window as any).location = undefined;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe("isDevServer", () => {
    it("should return true for localhost", () => {
      window.location = { hostname: "localhost" } as Location;
      expect(isDevServer()).toBe(true);
    });

    it("should return true for 127.0.0.1", () => {
      window.location = { hostname: "127.0.0.1" } as Location;
      expect(isDevServer()).toBe(true);
    });

    it("should return false for production domain", () => {
      window.location = { hostname: "idvork.in" } as Location;
      expect(isDevServer()).toBe(false);
    });
  });

  describe("getCurrentPort", () => {
    it("should return port when specified", () => {
      window.location = { port: "3000" } as Location;
      expect(getCurrentPort()).toBe("3000");
    });

    it("should return 80 when no port specified", () => {
      window.location = { port: "" } as Location;
      expect(getCurrentPort()).toBe("80");
    });

    it("should return 4000 for Jekyll default", () => {
      window.location = { port: "4000" } as Location;
      expect(getCurrentPort()).toBe("4000");
    });
  });

  describe("getCurrentPR", () => {
    it("should return PR number when global variable is set", () => {
      (window as any).__GIT_PR__ = 123;
      expect(getCurrentPR()).toBe(123);
    });

    it("should return null when PR is not set", () => {
      (window as any).__GIT_PR__ = null;
      expect(getCurrentPR()).toBe(null);
    });

    it("should return null when PR is not a number", () => {
      (window as any).__GIT_PR__ = "not-a-number";
      expect(getCurrentPR()).toBe(null);
    });
  });

  describe("getChangedPages", () => {
    it("returns the permalinks the build embedded", () => {
      (window as any).__GIT_CHANGED__ = ["/time-allocation", "/build-life-you-want"];
      expect(getChangedPages()).toEqual(["/time-allocation", "/build-life-you-want"]);
    });

    it("drops anything that is not a site path", () => {
      (window as any).__GIT_CHANGED__ = ["/ok", "https://evil.example", 7, null];
      expect(getChangedPages()).toEqual(["/ok"]);
    });

    it("is empty when the build embedded nothing", () => {
      (window as any).__GIT_CHANGED__ = null;
      expect(getChangedPages()).toEqual([]);
    });
  });

  describe("isChangedPage", () => {
    it("matches the current path against changed permalinks, ignoring trailing slashes", () => {
      expect(isChangedPage("/time-allocation", ["/ai-orchestrator", "/time-allocation"])).toBe(true);
      expect(isChangedPage("/time-allocation/", ["/time-allocation"])).toBe(true);
      expect(isChangedPage("/time", ["/time-allocation"])).toBe(false);
      expect(isChangedPage("/", [])).toBe(false);
    });
  });

  describe("banner", () => {
    const banner = () => document.getElementById("dev-info-banner") as HTMLElement;

    beforeEach(() => {
      window.location = { hostname: "localhost", port: "4001", pathname: "/foo" } as Location;
      (window as any).__GIT_BRANCH__ = "mimo-envs";
      (window as any).__GIT_PR__ = 933;
      (window as any).__GIT_CHANGED__ = ["/foo"];
      document.body.innerHTML = "";
      initDevInfo();
    });

    afterEach(() => {
      (window as any).__GIT_BRANCH__ = undefined;
      (window as any).__GIT_PR__ = undefined;
      (window as any).__GIT_CHANGED__ = undefined;
      document.body.innerHTML = "";
    });

    it("shows branch, PR and diff as icons plus values, without label words", () => {
      const text = banner().textContent?.replace(/\s+/g, " ").trim();
      expect(text).toBe("mimo-envs | #933 | Changed: /foo |");
    });

    it("keeps a hover tooltip for every icon-only item", () => {
      expect(banner().querySelector('[title="Branch"] code')?.textContent).toBe("mimo-envs");
      expect(banner().querySelector('[title="Port"]')).toBeNull();
      expect(banner().querySelector("#dev-diff-toggle")?.getAttribute("title")).toBe("Diff vs main");
    });

    it("never puts a title on an icon, which the Font Awesome kit would render as visible text", () => {
      expect(banner().querySelectorAll("i[title]")).toHaveLength(0);
    });
  });

  describe("diffButton", () => {
    it("is icon-only and flips its tooltip and pressed state between diff and exit", async () => {
      const btn = diffButton();
      expect(btn.textContent?.trim()).toBe("");
      expect(btn.getAttribute("aria-label")).toBe("Diff vs main");
      expect(btn.getAttribute("aria-pressed")).toBe("false");

      btn.click();
      await vi.waitFor(() => expect(btn.getAttribute("aria-pressed")).toBe("true"));
      expect(btn.title).toBe("Exit diff");
      expect(btn.getAttribute("aria-label")).toBe("Exit diff");

      btn.click();
      await vi.waitFor(() => expect(btn.getAttribute("aria-pressed")).toBe("false"));
      expect(btn.title).toBe("Diff vs main");
    });
  });

  describe("diff on load", () => {
    const toggle = () => document.getElementById("dev-diff-toggle") as HTMLButtonElement;

    const load = (loc: Partial<Location>) => {
      window.location = {
        hostname: "localhost",
        port: "4001",
        pathname: "/foo",
        search: "",
        hash: "",
        ...loc,
      } as Location;
      (window as any).__GIT_BRANCH__ = "mimo-envs";
      (window as any).__GIT_CHANGED__ = ["/foo"];
      richDiff.on = false;
      document.body.innerHTML = "";
      initDevInfo();
    };

    afterEach(() => {
      (window as any).__GIT_BRANCH__ = undefined;
      (window as any).__GIT_CHANGED__ = undefined;
      document.body.innerHTML = "";
    });

    it("reads ?diff=1 and #diff, nothing else", () => {
      expect(wantsDiffOnLoad({ search: "?diff=1", hash: "" })).toBe(true);
      expect(wantsDiffOnLoad({ search: "?x=2&diff=1", hash: "" })).toBe(true);
      expect(wantsDiffOnLoad({ search: "", hash: "#diff" })).toBe(true);
      expect(wantsDiffOnLoad({ search: "?diff=0", hash: "" })).toBe(false);
      expect(wantsDiffOnLoad({ search: "", hash: "#diffusion" })).toBe(false);
      expect(wantsDiffOnLoad({ search: "", hash: "" })).toBe(false);
    });

    it.each([{ search: "?diff=1" }, { hash: "#diff" }])(
      "%o opens the diff as if the button was clicked once",
      async (loc) => {
        load(loc);
        await vi.waitFor(() => expect(toggle().getAttribute("aria-pressed")).toBe("true"));
        expect(toggle().title).toBe("Exit diff");
        expect(richDiff.on).toBe(true);
      },
    );

    it("leaves the diff off without the param", async () => {
      load({});
      await new Promise((r) => setTimeout(r, 0));
      expect(toggle().getAttribute("aria-pressed")).toBe("false");
      expect(richDiff.on).toBe(false);
    });

    it("does nothing on production, where there is no banner", () => {
      load({ hostname: "idvork.in", port: "", search: "?diff=1" });
      expect(document.getElementById("dev-info-banner")).toBeNull();
      expect(richDiff.on).toBe(false);
    });
  });
});
