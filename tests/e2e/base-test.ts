import { test as base } from "@playwright/test";

/**
 * Custom test fixture that blocks LiveReload to prevent Jekyll dev server
 * rebuilds from destroying execution contexts during tests.
 *
 * LiveReload sends WebSocket "reload" commands whenever Jekyll rebuilds a page,
 * which causes full page navigations that break test assertions.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Block LiveReload script requests at the network level
    await page.route("**/livereload.js*", (route) => route.abort());
    await use(page);
  },
});

export { expect, type Page } from "@playwright/test";
