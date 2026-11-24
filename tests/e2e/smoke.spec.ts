// ABOUTME: One data-driven smoke check per key page: it loads, shows what makes it that page, and throws no JS errors.
// ABOUTME: Replaces the per-feature "loads correctly" and "has no JavaScript errors" tests; page logic is tested in vitest.
import { expect, test } from "./base-test";

interface SmokePage {
  path: string;
  /** Expected HTTP status of the final response. Defaults to any non-error status (redirects are followed). */
  status?: number;
  title?: RegExp;
  h1?: string;
  text?: string;
  visible?: string[];
}

const PAGES: SmokePage[] = [
  { path: "/", text: "Igor", visible: ["header", "#search-input"] },
  { path: "/about", h1: "Where am I?", text: "Igor" },
  {
    path: "/this-page-does-not-exist",
    status: 404,
    title: /PAGE NOT FOUND/,
    text: "The Monkey has eaten the page you are looking for",
  },
  { path: "/all/", h1: "All Blog Posts", text: "This page lists all blog posts for link checking purposes" },
  { path: "/graph#eulogy", visible: ["#detail", "#controls", "#center_control"] },
  { path: "/test-auto-sunburst", title: /TEST AUTO-GENERATED SUNBURST/i, visible: ["#sunburst svg"] },
  { path: "/featured/" },
  { path: "/7-habits" },
  { path: "/save-the-soup" },
  { path: "/activation" },
  { path: "/prompts" },
  { path: "/tags" },
  { path: "/categories" },
  { path: "/todo_enjoy" },
  { path: "/timeoff", visible: ["h2"] },
];

// Errors that are logged but do not fail the smoke. Each is a known, harmless race.
const WARNING_PATTERNS = [
  /ResizeObserver loop limit exceeded/,
  /ResizeObserver loop completed with undelivered notifications/,
  /Script error/,
  /Cannot read properties of null \(reading 'classList'\)/,
  // Bootstrap ScrollSpy race: /tags has whitespace-id debug headings whose TOC links
  // reduce to href="#", and ScrollSpy then calls querySelector('#'). Rare, also on prod.
  /'#' is not a valid selector/,
  /Plotly is not defined/,
];

// Long enough for deferred page scripts to run and throw.
const SETTLE_MS = 1000;

test.describe("Smoke: key pages load without JavaScript errors", () => {
  for (const spec of PAGES) {
    test(spec.path, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));

      const response = await page.goto(spec.path);
      if (spec.status === undefined) {
        expect(response?.status(), `HTTP status for ${spec.path}`).toBeLessThan(400);
      } else {
        expect(response?.status(), `HTTP status for ${spec.path}`).toBe(spec.status);
      }

      if (spec.title) await expect(page).toHaveTitle(spec.title);
      if (spec.h1) await expect(page.locator("h1").first()).toContainText(spec.h1);
      if (spec.text) await expect(page.locator("body")).toContainText(spec.text);
      for (const selector of spec.visible ?? []) {
        await expect(page.locator(selector).first()).toBeVisible();
      }

      await page.waitForTimeout(SETTLE_MS);
      const critical = errors.filter((message) => !WARNING_PATTERNS.some((pattern) => pattern.test(message)));
      if (errors.length > critical.length) {
        console.warn(`JavaScript warnings on ${spec.path}:`, errors.join(", "));
      }
      expect(critical, `Critical JavaScript errors on ${spec.path}`).toEqual([]);
    });
  }
});
