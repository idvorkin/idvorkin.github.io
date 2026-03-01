import { expect, test } from "./base-test";

test.describe("Search Redirect", () => {
  test('pressing "s" key should redirect to main search page', async ({ page }) => {
    // Go to any page on the site that's not the main page
    await page.goto("/about");

    // Press the 's' key
    await page.keyboard.press("s");

    // Should redirect to the main page
    await expect(page).toHaveURL("/");

    // The search input should be visible
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();
  });

  test("clicking bunny ears icon should redirect to main search page", async ({ page }) => {
    // Go to any page on the site that's not the main page
    await page.goto("/about");

    // Click the bunny ears icon (logo)
    await page.click("#autocomplete-search-box-button");

    // Should redirect to the main page
    await expect(page).toHaveURL("/");

    // The search input should be visible
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();
  });

  test("search functionality on main page works", async ({ page }) => {
    // Go to the main page
    await page.goto("/");

    // The search input should be visible
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();

    // Type in the search box
    await searchInput.fill("test search");

    // Wait a moment for search to trigger
    await page.waitForTimeout(500);

    // Search results should appear (featured posts section should have results)
    const featuredResults = page.locator("#featured-results");
    await expect(featuredResults).toBeVisible();
  });

  test('pressing "s" on main page keeps user on main page', async ({ page }) => {
    // Go to the main page
    await page.goto("/");

    // Press the 's' key
    await page.keyboard.press("s");

    // Should stay on the main page (no redirect)
    await expect(page).toHaveURL("/");

    // The search input should still be visible
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();
  });
});
