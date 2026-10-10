// ABOUTME: Unit tests for the "p" key prod <-> test swap: URL mapping both ways,
// ABOUTME: which origins count as test, and how prod learns the test origin it came from.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  FROM_TEST_PARAM,
  isProduction,
  isTestOrigin,
  rememberTestOrigin,
  swapProdAndTest,
  swapTarget,
  testOriginFromArrival,
} from "../swap-prod-test";

const PROD = "https://idvork.in";
const TAILNET = "https://c-5004.squeaker-teeth.ts.net:8445";
const KEY = "idvorkin_test_origin";

describe("isProduction", () => {
  it("is exactly idvork.in", () => {
    expect(isProduction("idvork.in")).toBe(true);
    expect(isProduction("localhost")).toBe(false);
    expect(isProduction("idvorkin.github.io")).toBe(false);
    expect(isProduction("www.idvork.in")).toBe(false);
  });
});

describe("isTestOrigin", () => {
  it("accepts localhost, 127.0.0.1 and ::1 on any port", () => {
    expect(isTestOrigin("http://localhost:4000")).toBe(true);
    expect(isTestOrigin("http://localhost")).toBe(true);
    expect(isTestOrigin("http://127.0.0.1:4011")).toBe(true);
    expect(isTestOrigin("http://[::1]:4000")).toBe(true);
  });

  it("accepts tailnet hosts, proxied (https, 844x) or direct (http, 40xx)", () => {
    expect(isTestOrigin(TAILNET)).toBe(true);
    expect(isTestOrigin("http://c-5004.squeaker-teeth.ts.net:4010")).toBe(true);
    expect(isTestOrigin("https://c-5004.squeaker-teeth.ts.net")).toBe(true);
  });

  it("accepts 0.0.0.0, which jekyll-serve binds in containers", () => {
    expect(isTestOrigin("http://0.0.0.0:4010")).toBe(true);
  });

  it("accepts a ts.net host with a port and rejects any other host with a port", () => {
    expect(isTestOrigin("https://c-5004.squeaker-teeth.ts.net:8445")).toBe(true);
    expect(isTestOrigin("https://evil.example:8443")).toBe(false);
    expect(isTestOrigin("http://192.168.1.50:8080")).toBe(false);
    expect(isTestOrigin("http://c-5004:4000")).toBe(false);
    expect(isTestOrigin("https://evilts.net:8443")).toBe(false);
  });

  it("rejects prod, standard-port strangers and garbage", () => {
    expect(isTestOrigin(PROD)).toBe(false);
    expect(isTestOrigin("https://idvork.in:443")).toBe(false);
    expect(isTestOrigin("https://example.com")).toBe(false);
    expect(isTestOrigin("http://example.com:80")).toBe(false);
    expect(isTestOrigin("javascript:alert(1)")).toBe(false);
    expect(isTestOrigin("not-a-url")).toBe(false);
    expect(isTestOrigin("")).toBe(false);
  });

  it("rejects a value that is more than an origin", () => {
    expect(isTestOrigin("http://localhost:4000/some/path")).toBe(false);
  });
});

describe("swapTarget: test -> prod", () => {
  it("maps path, query and hash onto prod and hands over the test origin", () => {
    const target = swapTarget(new URL("http://localhost:4000/caring?x=1#section"), null);
    expect(target).toEqual({ url: `${PROD}/caring?x=1&${FROM_TEST_PARAM}=http%3A%2F%2Flocalhost%3A4000#section` });
  });

  it("works from a tailnet-proxied server and keeps the port in the handoff", () => {
    const target = swapTarget(new URL(`${TAILNET}/toc`), null);
    expect(target).toEqual({
      url: `${PROD}/toc?${FROM_TEST_PARAM}=${encodeURIComponent(TAILNET)}`,
    });
  });

  it("maps the home page", () => {
    const target = swapTarget(new URL("http://127.0.0.1:4011/"), null);
    expect(target).toEqual({ url: `${PROD}/?${FROM_TEST_PARAM}=http%3A%2F%2F127.0.0.1%3A4011` });
  });

  it("does not stack a stale handoff param", () => {
    const target = swapTarget(new URL(`http://localhost:4000/x?${FROM_TEST_PARAM}=http%3A%2F%2Fold%3A1`), null);
    expect(target).toEqual({ url: `${PROD}/x?${FROM_TEST_PARAM}=http%3A%2F%2Flocalhost%3A4000` });
  });
});

describe("swapTarget: prod -> test", () => {
  it("returns to the remembered origin with path, query and hash", () => {
    const target = swapTarget(new URL(`${PROD}/caring?x=1#section`), TAILNET);
    expect(target).toEqual({ url: `${TAILNET}/caring?x=1#section` });
  });

  it("strips the handoff param if it is still on the URL", () => {
    const target = swapTarget(new URL(`${PROD}/caring?${FROM_TEST_PARAM}=x&y=2`), "http://localhost:4000");
    expect(target).toEqual({ url: "http://localhost:4000/caring?y=2" });
  });

  it("refuses a remembered value that is not a test origin", () => {
    const target = swapTarget(new URL(`${PROD}/caring`), "https://example.com");
    expect(target).toEqual({ error: "no-test-origin" });
  });

  it("reports no origin instead of guessing", () => {
    expect(swapTarget(new URL(`${PROD}/caring`), null)).toEqual({ error: "no-test-origin" });
    expect(swapTarget(new URL(`${PROD}/caring`), "")).toEqual({ error: "no-test-origin" });
  });
});

describe("testOriginFromArrival", () => {
  it("prefers the handoff param over the referrer", () => {
    const url = new URL(`${PROD}/caring?${FROM_TEST_PARAM}=${encodeURIComponent(TAILNET)}#s`);
    expect(testOriginFromArrival(url, "http://localhost:4000/")).toBe(TAILNET);
  });

  it("falls back to the referrer origin", () => {
    expect(testOriginFromArrival(new URL(`${PROD}/caring`), "http://localhost:4010/caring")).toBe(
      "http://localhost:4010",
    );
  });

  it("ignores non-test referrers and non-test params", () => {
    expect(testOriginFromArrival(new URL(`${PROD}/caring`), "https://www.google.com/")).toBeNull();
    expect(testOriginFromArrival(new URL(`${PROD}/caring?${FROM_TEST_PARAM}=https%3A%2F%2Fevil.com`), "")).toBeNull();
    expect(testOriginFromArrival(new URL(`${PROD}/caring`), "")).toBeNull();
    expect(testOriginFromArrival(new URL(`${PROD}/caring`), "garbage")).toBeNull();
  });
});

describe("DOM wrappers", () => {
  const savedLocation = window.location;
  const savedReplaceState = history.replaceState;
  let navigatedTo: string | null;
  let replacedWith: string | null;

  function setLocation(href: string) {
    const u = new URL(href);
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        href,
        origin: u.origin,
        hostname: u.hostname,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        assign: (next: string) => {
          navigatedTo = next;
        },
      },
    });
  }

  beforeEach(() => {
    navigatedTo = null;
    replacedWith = null;
    sessionStorage.clear();
    localStorage.clear();
    document.body.innerHTML = "";
    Object.defineProperty(document, "referrer", { configurable: true, value: "" });
    history.replaceState = (_state: unknown, _title: string, url?: string | URL | null) => {
      replacedWith = url == null ? null : String(url);
    };
  });

  afterEach(() => {
    Object.defineProperty(window, "location", { configurable: true, writable: true, value: savedLocation });
    history.replaceState = savedReplaceState;
  });

  it("on prod with a handoff param: stores the origin for this tab and for later, and cleans the URL", () => {
    setLocation(`${PROD}/caring?${FROM_TEST_PARAM}=${encodeURIComponent(TAILNET)}&x=1#s`);
    rememberTestOrigin();
    expect(sessionStorage.getItem(KEY)).toBe(TAILNET);
    expect(localStorage.getItem(KEY)).toBe(TAILNET);
    expect(replacedWith).toBe(`${PROD}/caring?x=1#s`);
  });

  it("on prod with only a referrer: remembers it without touching the URL", () => {
    setLocation(`${PROD}/caring`);
    Object.defineProperty(document, "referrer", { configurable: true, value: "http://localhost:4000/caring" });
    rememberTestOrigin();
    expect(sessionStorage.getItem(KEY)).toBe("http://localhost:4000");
    expect(replacedWith).toBeNull();
  });

  it("on a test server: remembers nothing", () => {
    setLocation(`http://localhost:4000/caring?${FROM_TEST_PARAM}=${encodeURIComponent(TAILNET)}`);
    rememberTestOrigin();
    expect(sessionStorage.getItem(KEY)).toBeNull();
    expect(replacedWith).toBeNull();
  });

  it("p on a test server goes to prod", () => {
    setLocation("http://localhost:4000/caring#s");
    swapProdAndTest();
    expect(navigatedTo).toBe(`${PROD}/caring?${FROM_TEST_PARAM}=http%3A%2F%2Flocalhost%3A4000#s`);
  });

  it("p on prod prefers this tab's origin over the last-used one", () => {
    setLocation(`${PROD}/caring#s`);
    sessionStorage.setItem(KEY, "http://localhost:4010");
    localStorage.setItem(KEY, "http://localhost:4011");
    swapProdAndTest();
    expect(navigatedTo).toBe("http://localhost:4010/caring#s");
  });

  it("p on prod falls back to the last-used origin", () => {
    setLocation(`${PROD}/caring`);
    localStorage.setItem(KEY, TAILNET);
    swapProdAndTest();
    expect(navigatedTo).toBe(`${TAILNET}/caring`);
  });

  it("p on prod with nothing remembered shows a toast and stays put", () => {
    setLocation(`${PROD}/caring#s`);
    swapProdAndTest();
    expect(navigatedTo).toBeNull();
    const toast = document.getElementById("swap-toast");
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toContain("No test server remembered");
    expect(toast?.querySelector("a")?.getAttribute("href")).toBe("http://localhost:4000/caring#s");
  });
});
