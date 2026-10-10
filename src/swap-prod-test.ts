// ABOUTME: The "p" key: jump from any test server to the same page on prod, and from prod back to the
// ABOUTME: test server you came from. Prod learns that origin from a URL handoff param, else the referrer.

const PROD_ORIGIN = "https://idvork.in";
const PROD_HOST = "idvork.in";
const MAC_DEFAULT_ORIGIN = "http://localhost:4000";
/** Query param a test server appends when sending you to prod, so prod knows where "back" is. */
export const FROM_TEST_PARAM = "from_test";
/** Storage key, in sessionStorage (this tab) and localStorage (last used on any tab). */
const TEST_ORIGIN_KEY = "idvorkin_test_origin";
const TOAST_ID = "swap-toast";

export function isProduction(hostname: string): boolean {
  return hostname === PROD_HOST;
}

/**
 * True when `value` is exactly an origin (scheme://host[:port]) that serves a test copy of the site:
 * a loopback name, a tailnet host, or anything with an explicit port (LAN IPs, bare c-500X names).
 */
export function isTestOrigin(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.origin !== value) return false;
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname;
  if (isProduction(host)) return false;
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".ts.net")) {
    return true;
  }
  return url.port !== "";
}

export type SwapTarget = { url: string } | { error: "no-test-origin" };

/**
 * Where "p" goes from `current`. Path, query and hash carry over unchanged in both directions;
 * the only query edit is our own handoff param, added going to prod and removed coming back.
 */
export function swapTarget(current: URL, rememberedTestOrigin: string | null): SwapTarget {
  const params = new URLSearchParams(current.search);
  params.delete(FROM_TEST_PARAM);
  if (isProduction(current.hostname)) {
    if (!rememberedTestOrigin || !isTestOrigin(rememberedTestOrigin)) {
      return { error: "no-test-origin" };
    }
    return { url: `${rememberedTestOrigin}${current.pathname}${query(params)}${current.hash}` };
  }
  params.append(FROM_TEST_PARAM, current.origin);
  return { url: `${PROD_ORIGIN}${current.pathname}${query(params)}${current.hash}` };
}

function query(params: URLSearchParams): string {
  const s = params.toString();
  return s ? `?${s}` : "";
}

/** The test origin a prod page arrived from: the handoff param wins, else the referrer, else null. */
export function testOriginFromArrival(url: URL, referrer: string): string | null {
  const handed = url.searchParams.get(FROM_TEST_PARAM);
  if (handed && isTestOrigin(handed)) return handed;
  try {
    const origin = new URL(referrer).origin;
    if (isTestOrigin(origin)) return origin;
  } catch {
    // no referrer, or one that is not a URL
  }
  return null;
}

/** On prod page load: remember the test origin we came from and scrub the handoff param off the URL. */
export function rememberTestOrigin(): void {
  if (!isProduction(window.location.hostname)) return;
  const current = new URL(window.location.href);
  const origin = testOriginFromArrival(current, document.referrer);
  if (!origin) return;
  try {
    sessionStorage.setItem(TEST_ORIGIN_KEY, origin);
    localStorage.setItem(TEST_ORIGIN_KEY, origin);
  } catch {
    // storage unavailable (private mode); the key still works within this page load via the param
  }
  if (current.searchParams.has(FROM_TEST_PARAM)) {
    current.searchParams.delete(FROM_TEST_PARAM);
    history.replaceState(history.state, "", current.href);
  }
}

function rememberedTestOrigin(): string | null {
  try {
    return sessionStorage.getItem(TEST_ORIGIN_KEY) || localStorage.getItem(TEST_ORIGIN_KEY);
  } catch {
    return null;
  }
}

/** The "p" key handler. */
export function swapProdAndTest(): void {
  const current = new URL(window.location.href);
  const target = swapTarget(current, rememberedTestOrigin());
  if ("url" in target) {
    window.location.assign(target.url);
    return;
  }
  const here = `${current.pathname}${current.search}${current.hash}`;
  showToast(
    "No test server remembered. Press P on a test server first, or try ",
    `${MAC_DEFAULT_ORIGIN}${here}`,
    "localhost:4000",
  );
}

function showToast(text: string, linkHref: string, linkText: string): void {
  document.getElementById(TOAST_ID)?.remove();
  const toast = document.createElement("div");
  toast.id = TOAST_ID;
  toast.setAttribute("role", "status");
  toast.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10000;" +
    "background:#333;color:#fff;padding:10px 16px;border-radius:6px;font:14px/1.4 system-ui,sans-serif;" +
    "box-shadow:0 2px 8px rgba(0,0,0,.4);max-width:90vw;";
  toast.append(text);
  const link = document.createElement("a");
  link.href = linkHref;
  link.textContent = linkText;
  link.style.cssText = "color:#9cf;text-decoration:underline;";
  toast.append(link);
  document.body.append(toast);
  setTimeout(() => toast.remove(), 5000);
}
