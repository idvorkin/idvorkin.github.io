// ABOUTME: E2E for the "p" key: test -> prod -> back across two local test origins on different ports.
// ABOUTME: Prod (https://idvork.in) is mocked by route interception; the real site is never requested.
import http from "node:http";
import type { AddressInfo } from "node:net";
import type { BrowserContext, Page } from "@playwright/test";
import { expect, test } from "./base-test";

const SERVER_PORT = process.env.SERVER_PORT || "4000";
// Origin A is the Playwright-managed Jekyll server; origin B is a second server on another port that
// proxies to it, so both serve the same site but are distinct origins with separate storage.
const ORIGIN_A = `http://localhost:${SERVER_PORT}`;
const PROD = "https://idvork.in";
const PAGE = "/caring";
const SUFFIX = "?x=1#the-anchor";

let serverB: http.Server;
let ORIGIN_B: string;

test.beforeAll(async () => {
  serverB = http.createServer((req, res) => {
    const upstream = http.request(
      {
        host: "127.0.0.1",
        port: Number(SERVER_PORT),
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: `localhost:${SERVER_PORT}` },
      },
      (up) => {
        res.writeHead(up.statusCode ?? 502, up.headers);
        up.pipe(res);
      },
    );
    upstream.on("error", () => {
      res.writeHead(502);
      res.end();
    });
    req.pipe(upstream);
  });
  await new Promise<void>((resolve) => serverB.listen(0, "127.0.0.1", resolve));
  ORIGIN_B = `http://127.0.0.1:${(serverB.address() as AddressInfo).port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve) => serverB.close(() => resolve()));
});

/** Serve every https://idvork.in request from origin A, so "prod" is the same site under the prod hostname. */
async function mockProd(context: BrowserContext) {
  await context.route(/^https:\/\/idvork\.in\//, async (route) => {
    const u = new URL(route.request().url());
    const response = await context.request.get(`${ORIGIN_A}${u.pathname}${u.search}`);
    await route.fulfill({ response });
  });
}

async function pressP(page: Page) {
  await page.waitForLoadState("load");
  await page.keyboard.press("p");
}

async function expectUrl(page: Page, url: string) {
  await page.waitForURL(url);
  expect(page.url()).toBe(url);
}

test.describe("'p' swaps prod and test", () => {
  test.beforeEach(async ({ context }) => {
    await mockProd(context);
  });

  test("test -> prod -> back keeps path, query and anchor and returns to the same origin", async ({ page }) => {
    await page.goto(`${ORIGIN_A}${PAGE}${SUFFIX}`);
    await pressP(page);
    // The handoff param is scrubbed on arrival, so the prod URL is clean.
    await expectUrl(page, `${PROD}${PAGE}${SUFFIX}`);
    await pressP(page);
    await expectUrl(page, `${ORIGIN_A}${PAGE}${SUFFIX}`);
  });

  test("a second test origin on another port returns to itself, not to the first one", async ({ page }) => {
    await page.goto(`${ORIGIN_A}${PAGE}`);
    await pressP(page);
    await expectUrl(page, `${PROD}${PAGE}`);
    await pressP(page);
    await expectUrl(page, `${ORIGIN_A}${PAGE}`);

    await page.goto(`${ORIGIN_B}${PAGE}${SUFFIX}`);
    await pressP(page);
    await expectUrl(page, `${PROD}${PAGE}${SUFFIX}`);
    await pressP(page);
    await expectUrl(page, `${ORIGIN_B}${PAGE}${SUFFIX}`);

    // A fresh prod tab with no handoff falls back to the last test origin used.
    await page.goto(`${PROD}${PAGE}`);
    await pressP(page);
    await expectUrl(page, `${ORIGIN_B}${PAGE}`);
  });

  test("two prod tabs opened from two test servers each go back to their own", async ({ context, page }) => {
    const tabA = page;
    await tabA.goto(`${ORIGIN_A}${PAGE}`);
    await pressP(tabA);
    await expectUrl(tabA, `${PROD}${PAGE}`);

    const tabB = await context.newPage();
    await tabB.goto(`${ORIGIN_B}${PAGE}`);
    await pressP(tabB);
    await expectUrl(tabB, `${PROD}${PAGE}`);

    await pressP(tabA);
    await expectUrl(tabA, `${ORIGIN_A}${PAGE}`);
    await pressP(tabB);
    await expectUrl(tabB, `${ORIGIN_B}${PAGE}`);
  });

  test("arriving on prod by a plain link from a test server still remembers it (referrer)", async ({ page }) => {
    await page.goto(`${PROD}${PAGE}`, { referer: `${ORIGIN_B}${PAGE}` });
    await pressP(page);
    await expectUrl(page, `${ORIGIN_B}${PAGE}`);
  });

  test("prod with no known test server shows a toast and stays put", async ({ page }) => {
    await page.goto(`${PROD}${PAGE}${SUFFIX}`);
    await pressP(page);
    const toast = page.locator("#swap-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("No test server remembered");
    await expect(toast.locator("a")).toHaveAttribute("href", `http://localhost:4000${PAGE}${SUFFIX}`);
    expect(page.url()).toBe(`${PROD}${PAGE}${SUFFIX}`);
  });

  test("typing 'p' in the search box does not swap", async ({ page }) => {
    await page.goto(`${ORIGIN_A}/`);
    await page.waitForLoadState("load");
    await page.locator("#search-input").click();
    await page.keyboard.type("p");
    await page.waitForTimeout(500);
    expect(new URL(page.url()).origin).toBe(ORIGIN_A);
  });
});
