import { type Page, expect, test } from "./base-test";

test.describe("Featured Section Collapse Functionality", () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto("/");

    // Wait for the featured section to be loaded
    await page.waitForSelector("#featured-section", { state: "visible" });
  });

  test("should collapse and expand featured section on button click", async () => {
    const collapseBtn = page.locator("#featured-collapse-btn");
    const featuredResults = page.locator("#featured-results");

    // Initial state - expanded
    await expect(featuredResults).toBeVisible();
    await expect(collapseBtn).toHaveText("Collapse −");

    // Click to collapse
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText("Expand +");
    await expect(collapseBtn).toHaveAttribute("title", "Expand section");

    // Click to expand
    await collapseBtn.click();
    await expect(featuredResults).toBeVisible();
    await expect(collapseBtn).toHaveText("Collapse −");
    await expect(collapseBtn).toHaveAttribute("title", "Collapse section");
  });

  test("collapsed state should persist during content loading", async () => {
    const collapseBtn = page.locator("#featured-collapse-btn");
    const featuredResults = page.locator("#featured-results");

    // Collapse the section
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();

    // Wait for content to potentially load
    await page.waitForTimeout(2000);

    // Should still be collapsed
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText("Expand +");
  });

  test("should show results when searching even if collapsed", async () => {
    const collapseBtn = page.locator("#featured-collapse-btn");
    const featuredResults = page.locator("#featured-results");
    const searchInput = page.locator("#search-input");

    // Collapse the section
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();

    // Perform a search
    await searchInput.fill("test search");
    await page.waitForTimeout(1000); // Wait for search debounce

    // The section should become visible when search results are shown
    await expect(featuredResults).toBeVisible();

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(1000);

    // Featured section should restore to collapsed state after clearing search
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText("Expand +");
  });

  test("should be keyboard accessible", async () => {
    const collapseBtn = page.locator("#featured-collapse-btn");
    const featuredResults = page.locator("#featured-results");

    // Focus the button
    await collapseBtn.focus();

    // Press Enter to collapse
    await page.keyboard.press("Enter");
    await expect(featuredResults).not.toBeVisible();

    // Press Enter to expand
    await page.keyboard.press("Enter");
    await expect(featuredResults).toBeVisible();
  });

  test("collapse button should have consistent styling with other action links", async () => {
    const collapseBtn = page.locator("#featured-collapse-btn");
    const otherActionLink = page.locator(".section-header .action-link").first();

    // Get computed styles
    const collapseBtnColor = await collapseBtn.evaluate((el) => window.getComputedStyle(el).color);

    const otherLinkColor = await otherActionLink.evaluate((el) => window.getComputedStyle(el).color);

    // Colors should match
    expect(collapseBtnColor).toBe(otherLinkColor);
  });

  test("should persist collapse state across page reloads", async () => {
    const collapseBtn = page.locator("#featured-collapse-btn");
    const featuredResults = page.locator("#featured-results");

    // Collapse the section
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForSelector("#featured-section", { state: "visible" });

    // Should still be collapsed after reload
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText("Expand +");

    // Expand it
    await collapseBtn.click();
    await expect(featuredResults).toBeVisible();

    // Reload again
    await page.reload();
    await page.waitForSelector("#featured-section", { state: "visible" });

    // Should be expanded after reload
    await expect(featuredResults).toBeVisible();
    await expect(collapseBtn).toHaveText("Collapse −");
  });
});
