import { expect, test } from "./base-test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Graph page functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Set up console log capture for debugging
    page.on("console", (msg) => {
      console.log(`PAGE LOG: ${msg.text()}`);
    });

    // Navigate directly to the graph page with eulogy node specified in the hash
    await page.goto("/graph#eulogy");

    // Wait for the graph to initialize
    await page.waitForTimeout(2000);
  });

  test("Graph page loads correctly", async ({ page }) => {
    // Check that the page has loaded correctly
    await expect(page).toHaveURL(/.*\/graph#eulogy/);

    // Check for essential page elements
    await expect(page.locator("#detail")).toBeVisible();
    await expect(page.locator("#controls")).toBeVisible();
    await expect(page.locator("#center_control")).toBeVisible();
  });

  test("Graph page has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/graph#eulogy");
  });

  // Test that controls are clickable
  test("Graph controls are clickable", async ({ page }) => {
    // Try clicking the center button
    await page.locator("#center_control").click();

    // Try clicking the collapse button
    await page.locator("#collapse_control").click();

    // Check that the page is still responsive
    await expect(page.locator("#detail")).toBeVisible();
  });

  // Test that the detail panel contains eulogy content
  test("Detail panel shows eulogy content", async ({ page }) => {
    // Get detail panel content
    const detailPanel = page.locator("#detail");
    await expect(detailPanel).toBeVisible({ timeout: 10000 });
    const detailText = (await detailPanel.textContent()) || "";

    // If the detail panel has been properly initialized, it should contain eulogy content
    // Check for common phrases in the eulogy
    const eulogyPatterns = [
      /igor.*eulogy/i,
      /wearing a silly hat/i,
      /trusty folding bike/i,
      /began with the end in mind/i,
    ];

    // Check if at least one of the patterns matches
    const hasEulogyContent = eulogyPatterns.some((pattern) => pattern.test(detailText));
    expect(hasEulogyContent).toBeTruthy();

    // Also verify there are links in the eulogy content
    const linkElements = page.locator("#detail a");
    const linkCount = await linkElements.count();

    // We expect the eulogy to have at least some links
    expect(linkCount).toBeGreaterThan(0);
  });
});
