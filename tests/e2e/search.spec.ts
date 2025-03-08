import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Search box exists", async ({ page }) => {
    // Check that the search box exists
    await expect(page.locator("#search-box")).toBeVisible();
  });

  test("Can search for content", async ({ page }) => {
    // Type a search term in the search box
    await page.locator("#search-box").fill("meditation");

    // Wait for search results to appear
    await page.waitForSelector("#search-results");

    // Check that search results are displayed
    const searchResults = page.locator("#search-results");
    await expect(searchResults).toBeVisible();

    // Verify that at least one result is shown
    const resultItems = page.locator("#search-results li");
    const count = await resultItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Shows no results for nonsense search", async ({ page }) => {
    // Type a nonsense search term
    await page.locator("#search-box").fill("xyznonexistentterm123");

    // Wait for search results to process
    await page.waitForTimeout(500);

    // Check that no results are shown or an empty results message is displayed
    const resultItems = page.locator("#search-results li");
    await expect(resultItems).toHaveCount(0);
  });
});
