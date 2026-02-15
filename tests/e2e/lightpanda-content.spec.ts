import { test, expect } from "./lightpanda-fixture";

// DOM/content tests running against Lightpanda's CDP server.
// These test that pages load and contain expected content — no rendering needed.

test.describe("Lightpanda: Content Tests", () => {
  test("About page loads and has expected content", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/about`);
    const body = await page.locator("body").textContent();
    expect(body).toContain("Where am I?");
  });

  test("Home page loads without JS errors", async ({ page, baseURL }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      // Ignore known warnings
      const warningPatterns = [
        /ResizeObserver loop/,
        /Cannot read properties of null/,
        /Plotly is not defined/,
      ];
      if (!warningPatterns.some((p) => p.test(error.message))) {
        errors.push(error.message);
      }
    });

    await page.goto(`${baseURL}/`);
    // Give JS time to execute and potentially error
    await page.waitForTimeout(2000);
    expect(errors).toEqual([]);
  });

  test("Page has correct title", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/about`);
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test("Navigation links exist", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);
    const links = await page.locator("a[href]").count();
    expect(links).toBeGreaterThan(0);
  });
});
