import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const PROD_ORIGIN = "https://idvork.in";
const DEV_ORIGIN_KEY = "idvorkin_dev_origin";

function isProduction(): boolean {
  return window.location.hostname === "idvork.in";
}

function isDevOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const host = url.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".ts.net")) {
      return true;
    }
    return url.port !== "" && url.port !== "80" && url.port !== "443";
  } catch {
    return false;
  }
}

function saveDevOriginFromReferrer() {
  if (!document.referrer) return;
  try {
    const referrerOrigin = new URL(document.referrer).origin;
    if (isDevOrigin(referrerOrigin)) {
      localStorage.setItem(DEV_ORIGIN_KEY, referrerOrigin);
    }
  } catch {
    // Invalid referrer URL, ignore
  }
}

function SwapProdAndTest() {
  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (isProduction()) {
    const devOrigin = localStorage.getItem(DEV_ORIGIN_KEY) || "http://localhost:4000";
    window.location.href = `${devOrigin}${path}`;
  } else {
    localStorage.setItem(DEV_ORIGIN_KEY, window.location.origin);
    window.location.href = `${PROD_ORIGIN}${path}`;
  }
}

describe("SwapProdAndTest", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    localStorage.clear();

    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: "",
        port: "",
        protocol: "",
        hostname: "",
        pathname: "",
        origin: "",
        hash: "",
        search: "",
      },
    });
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  describe("isDevOrigin", () => {
    it("should return true for localhost (any port)", () => {
      expect(isDevOrigin("http://localhost:4000")).toBe(true);
      expect(isDevOrigin("http://localhost")).toBe(true);
    });

    it("should return true for 127.0.0.1", () => {
      expect(isDevOrigin("http://127.0.0.1:4000")).toBe(true);
      expect(isDevOrigin("http://127.0.0.1")).toBe(true);
    });

    it("should return true for .ts.net (Tailscale)", () => {
      expect(isDevOrigin("http://c-5001.squeaker-teeth.ts.net:4001")).toBe(true);
      expect(isDevOrigin("http://myhost.ts.net")).toBe(true);
    });

    it("should return true for non-standard port on unknown host", () => {
      expect(isDevOrigin("http://192.168.1.50:8080")).toBe(true);
    });

    it("should return false for prod (no port)", () => {
      expect(isDevOrigin("https://idvork.in")).toBe(false);
    });

    it("should return false for standard ports on unknown hosts", () => {
      expect(isDevOrigin("https://example.com:443")).toBe(false);
      expect(isDevOrigin("http://example.com:80")).toBe(false);
    });

    it("should return false for external sites", () => {
      expect(isDevOrigin("https://www.google.com")).toBe(false);
      expect(isDevOrigin("https://github.com")).toBe(false);
    });

    it("should return false for invalid URLs", () => {
      expect(isDevOrigin("not-a-url")).toBe(false);
    });
  });

  describe("isProduction", () => {
    it("should return true for idvork.in", () => {
      window.location.hostname = "idvork.in";
      expect(isProduction()).toBe(true);
    });

    it("should return false for localhost", () => {
      window.location.hostname = "localhost";
      expect(isProduction()).toBe(false);
    });

    it("should not false-positive on idvork.in in query string", () => {
      window.location.hostname = "localhost";
      window.location.href = "http://localhost:4000/page?ref=https://idvork.in";
      expect(isProduction()).toBe(false);
    });
  });

  describe("localhost → prod", () => {
    it("should navigate to prod with clean URL", () => {
      window.location.hostname = "localhost";
      window.location.href = "http://localhost:4000/some-page";
      window.location.origin = "http://localhost:4000";
      window.location.pathname = "/some-page";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/some-page");
    });

    it("should preserve hash", () => {
      window.location.hostname = "localhost";
      window.location.href = "http://localhost:4000/page#section";
      window.location.origin = "http://localhost:4000";
      window.location.pathname = "/page";
      window.location.search = "";
      window.location.hash = "#section";

      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/page#section");
    });

    it("should preserve query string", () => {
      window.location.hostname = "localhost";
      window.location.href = "http://localhost:4000/page?utm_source=test";
      window.location.origin = "http://localhost:4000";
      window.location.pathname = "/page";
      window.location.search = "?utm_source=test";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/page?utm_source=test");
    });

    it("should save origin to localStorage", () => {
      window.location.hostname = "localhost";
      window.location.href = "http://localhost:4002/page";
      window.location.origin = "http://localhost:4002";
      window.location.pathname = "/page";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe("http://localhost:4002");
    });
  });

  describe("Tailscale → prod", () => {
    it("should navigate to prod with clean URL", () => {
      window.location.hostname = "c-5001.squeaker-teeth.ts.net";
      window.location.href = "http://c-5001.squeaker-teeth.ts.net:4001/eulogy";
      window.location.origin = "http://c-5001.squeaker-teeth.ts.net:4001";
      window.location.pathname = "/eulogy";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/eulogy");
    });

    it("should save Tailscale origin to localStorage", () => {
      window.location.hostname = "c-5001.squeaker-teeth.ts.net";
      window.location.href = "http://c-5001.squeaker-teeth.ts.net:4001/page";
      window.location.origin = "http://c-5001.squeaker-teeth.ts.net:4001";
      window.location.pathname = "/page";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe(
        "http://c-5001.squeaker-teeth.ts.net:4001",
      );
    });
  });

  describe("prod → dev", () => {
    it("should fallback to localhost:4000 when no stored origin", () => {
      window.location.hostname = "idvork.in";
      window.location.href = "https://idvork.in/test-page";
      window.location.pathname = "/test-page";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe("http://localhost:4000/test-page");
    });

    it("should use stored localhost origin", () => {
      localStorage.setItem(DEV_ORIGIN_KEY, "http://localhost:4002");
      window.location.hostname = "idvork.in";
      window.location.href = "https://idvork.in/test-page";
      window.location.pathname = "/test-page";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe("http://localhost:4002/test-page");
    });

    it("should use stored Tailscale origin", () => {
      localStorage.setItem(DEV_ORIGIN_KEY, "http://c-5001.squeaker-teeth.ts.net:4001");
      window.location.hostname = "idvork.in";
      window.location.href = "https://idvork.in/eulogy";
      window.location.pathname = "/eulogy";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe(
        "http://c-5001.squeaker-teeth.ts.net:4001/eulogy",
      );
    });

    it("should preserve hash", () => {
      localStorage.setItem(DEV_ORIGIN_KEY, "http://localhost:4000");
      window.location.hostname = "idvork.in";
      window.location.href = "https://idvork.in/page#keyboards";
      window.location.pathname = "/page";
      window.location.search = "";
      window.location.hash = "#keyboards";

      SwapProdAndTest();

      expect(window.location.href).toBe("http://localhost:4000/page#keyboards");
    });

    it("should not overwrite localStorage when reading from prod", () => {
      localStorage.setItem(DEV_ORIGIN_KEY, "http://localhost:4002");
      window.location.hostname = "idvork.in";
      window.location.href = "https://idvork.in/page";
      window.location.pathname = "/page";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      // localStorage should still have the original value, not be overwritten
      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe("http://localhost:4002");
    });
  });

  describe("saveDevOriginFromReferrer", () => {
    // Note: cross-origin referrer policy (strict-origin-when-cross-origin)
    // only sends the origin, not the path. So we only check isDevOrigin.

    it("should save dev origin from referrer (origin-only, as browsers send)", () => {
      Object.defineProperty(document, "referrer", {
        value: "http://localhost:4000",
        configurable: true,
      });

      saveDevOriginFromReferrer();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe("http://localhost:4000");
    });

    it("should save Tailscale origin from referrer", () => {
      Object.defineProperty(document, "referrer", {
        value: "http://c-5001.squeaker-teeth.ts.net:4001",
        configurable: true,
      });

      saveDevOriginFromReferrer();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe(
        "http://c-5001.squeaker-teeth.ts.net:4001",
      );
    });

    it("should NOT save prod origin from referrer", () => {
      Object.defineProperty(document, "referrer", {
        value: "https://idvork.in",
        configurable: true,
      });

      saveDevOriginFromReferrer();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBeNull();
    });

    it("should NOT save standard-port origins (google, etc.)", () => {
      Object.defineProperty(document, "referrer", {
        value: "https://www.google.com",
        configurable: true,
      });

      saveDevOriginFromReferrer();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBeNull();
    });

    it("should do nothing when referrer is empty", () => {
      Object.defineProperty(document, "referrer", {
        value: "",
        configurable: true,
      });

      saveDevOriginFromReferrer();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBeNull();
    });
  });

  describe("round-trip: dev → prod → dev", () => {
    it("should round-trip via localStorage + referrer", () => {
      // Step 1: On Tailscale, press "p" — saves origin, navigates to prod
      window.location.hostname = "c-5001.squeaker-teeth.ts.net";
      window.location.href = "http://c-5001.squeaker-teeth.ts.net:4001/eulogy";
      window.location.origin = "http://c-5001.squeaker-teeth.ts.net:4001";
      window.location.pathname = "/eulogy";
      window.location.search = "";
      window.location.hash = "";

      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/eulogy");
      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe(
        "http://c-5001.squeaker-teeth.ts.net:4001",
      );

      // Step 2: On prod, page loads — referrer is origin-only (cross-origin policy)
      window.location.hostname = "idvork.in";
      window.location.href = "https://idvork.in/eulogy";
      window.location.pathname = "/eulogy";
      window.location.search = "";
      window.location.hash = "";
      Object.defineProperty(document, "referrer", {
        value: "http://c-5001.squeaker-teeth.ts.net:4001", // origin only, no path
        configurable: true,
      });

      saveDevOriginFromReferrer();

      expect(localStorage.getItem(DEV_ORIGIN_KEY)).toBe(
        "http://c-5001.squeaker-teeth.ts.net:4001",
      );

      // Step 3: On prod, press "p" — navigates back to Tailscale
      SwapProdAndTest();

      expect(window.location.href).toBe(
        "http://c-5001.squeaker-teeth.ts.net:4001/eulogy",
      );
    });
  });
});
