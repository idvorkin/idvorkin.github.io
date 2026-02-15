import { test as base, chromium } from "@playwright/test";

/**
 * Custom Playwright fixture that connects to a running Lightpanda CDP server
 * instead of launching its own Chromium instance.
 *
 * Usage: import { test, expect } from "./lightpanda-fixture";
 *
 * Lightpanda must be running: lightpanda serve --port 9222
 *
 * Note: We use the browser's default context because Lightpanda doesn't
 * implement the Emulation CDP domain (setUserAgentOverride, setDeviceMetrics).
 * Creating a new context via browser.newContext() triggers those calls and fails.
 */
export const test = base.extend({
  browser: async ({}, use) => {
    const browser = await chromium.connectOverCDP("ws://127.0.0.1:9222");
    await use(browser);
    await browser.close();
  },
  context: async ({ browser }, use) => {
    // Use the default context that CDP provides — avoids Emulation domain calls
    const contexts = browser.contexts();
    const context = contexts.length > 0 ? contexts[0] : await browser.newContext();
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

export { expect } from "@playwright/test";
