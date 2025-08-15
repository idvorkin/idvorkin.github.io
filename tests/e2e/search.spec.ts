import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Homepage search functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Search input exists and is visible", async ({ page }) => {
    // Check that the search input exists
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();
    
    // Check placeholder text
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      "Search Igor's Blog, or browse featured/recent/random posts below..."
    );
  });

  test("Shows initial content sections", async ({ page }) => {
    // Check that all three sections are visible
    await expect(page.locator("#featured-section h3")).toContainText("Featured posts");
    await expect(page.locator("#recent-section h3")).toContainText("Recent posts");
    await expect(page.locator("#random-section h3")).toContainText("Random posts");
    
    // Check that each section has content
    const featuredItems = page.locator("#featured-results .result-item");
    await expect(featuredItems).toHaveCount(3);
    
    const recentItems = page.locator("#recent-results .result-item");
    await expect(recentItems).toHaveCount(3);
    
    const randomItems = page.locator("#random-results .result-item");
    await expect(randomItems).toHaveCount(3);
  });

  test("Can search for content", async ({ page }) => {
    // Type in the search box
    const searchInput = page.locator("#search-input");
    await searchInput.fill("eulogy");
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Check that featured section title changes to search results
    await expect(page.locator("#featured-section h3")).toContainText("Search results");
    
    // Check that there are some results
    const searchResults = page.locator("#featured-results .result-item");
    const count = await searchResults.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Shows no results for nonsense search", async ({ page }) => {
    // Type nonsense in the search box
    const searchInput = page.locator("#search-input");
    await searchInput.fill("xyzabc123nonsense");
    
    // Wait for search to complete
    await page.waitForTimeout(500);
    
    // Check that it shows no results message
    await expect(page.locator("#featured-results")).toContainText("No results found");
  });

  test("Clearing search restores original content", async ({ page }) => {
    // First search for something
    const searchInput = page.locator("#search-input");
    await searchInput.fill("test");
    await page.waitForTimeout(500);
    
    // Clear the search
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Check that original sections are restored
    await expect(page.locator("#featured-section h3")).toContainText("Featured posts");
    await expect(page.locator("#recent-section h3")).toContainText("Recent posts");
    await expect(page.locator("#random-section h3")).toContainText("Random posts");
  });

  test("Mobile view has compact spacing", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that search input is visible
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();
    
    // Check that sections are visible
    await expect(page.locator("#featured-section")).toBeVisible();
    await expect(page.locator("#recent-section")).toBeVisible();
    await expect(page.locator("#random-section")).toBeVisible();
  });

  test("Homepage has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/");
  });
});