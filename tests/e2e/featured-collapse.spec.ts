import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Featured Section Collapse Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for initial page load
    await page.waitForTimeout(1000);
  });

  test("Featured section has collapse button with correct initial state", async ({ page }) => {
    // Check that the collapse button exists
    const collapseButton = page.locator("#toggle-featured");
    await expect(collapseButton).toBeVisible();
    
    // Check initial button text and title
    await expect(collapseButton).toHaveText("−");
    await expect(collapseButton).toHaveAttribute("title", "Collapse featured section");
    
    // Check that featured results are visible initially
    const featuredResults = page.locator("#featured-results");
    await expect(featuredResults).toBeVisible();
  });

  test("Collapse button successfully collapses featured section", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Verify initial state
    await expect(featuredResults).toBeVisible();
    await expect(collapseButton).toHaveText("−");
    
    // Click to collapse
    await collapseButton.click();
    
    // Verify collapsed state
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
    await expect(collapseButton).toHaveAttribute("title", "Expand featured section");
  });

  test("Collapse button successfully expands featured section after collapse", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // First collapse the section
    await collapseButton.click();
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
    
    // Then expand it again
    await collapseButton.click();
    
    // Verify expanded state
    await expect(featuredResults).toBeVisible();
    await expect(collapseButton).toHaveText("−");
    await expect(collapseButton).toHaveAttribute("title", "Collapse featured section");
  });

  test("Multiple collapse/expand cycles work correctly", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Test 3 complete cycles
    for (let i = 0; i < 3; i++) {
      // Collapse
      await collapseButton.click();
      await expect(featuredResults).toBeHidden();
      await expect(collapseButton).toHaveText("+");
      
      // Expand
      await collapseButton.click();
      await expect(featuredResults).toBeVisible();
      await expect(collapseButton).toHaveText("−");
    }
  });

  test("Collapse state persists during content loading", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Collapse the section immediately
    await collapseButton.click();
    await expect(featuredResults).toBeHidden();
    
    // Wait for featured content to load (if not already loaded)
    await page.waitForTimeout(2000);
    
    // Verify that the section remains collapsed
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
  });

  test("Collapse functionality works during search mode", async ({ page }) => {
    const searchInput = page.locator("#search-input");
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Perform a search
    await searchInput.fill("test");
    await page.waitForTimeout(500);
    
    // Verify we're in search mode
    await expect(page.locator("#featured-section .section-header h3")).toContainText("Search Results");
    
    // Test collapse functionality in search mode
    await collapseButton.click();
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
    
    // Expand again
    await collapseButton.click();
    await expect(featuredResults).toBeVisible();
    await expect(collapseButton).toHaveText("−");
  });

  test("Collapse state is maintained when switching between search and browse modes", async ({ page }) => {
    const searchInput = page.locator("#search-input");
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Collapse in browse mode
    await collapseButton.click();
    await expect(featuredResults).toBeHidden();
    
    // Switch to search mode
    await searchInput.fill("test");
    await page.waitForTimeout(500);
    
    // Verify it's still collapsed in search mode
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
    
    // Switch back to browse mode
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Verify it's still collapsed in browse mode
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
  });

  test("Collapse button styling matches other action links", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    const refreshButton = page.locator("#refresh-random-posts");
    
    // Both buttons should have the action-link class
    await expect(collapseButton).toHaveClass(/action-link/);
    await expect(refreshButton).toHaveClass(/action-link/);
    
    // Both should have similar styling (color, size, etc.)
    const collapseButtonColor = await collapseButton.evaluate((el) => 
      getComputedStyle(el).color
    );
    const refreshButtonColor = await refreshButton.evaluate((el) => 
      getComputedStyle(el).color
    );
    
    expect(collapseButtonColor).toBe(refreshButtonColor);
  });

  test("Collapse button has proper hover behavior", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    
    // Get initial color
    const initialColor = await collapseButton.evaluate((el) => 
      getComputedStyle(el).color
    );
    
    // Hover over the button
    await collapseButton.hover();
    
    // Check that color changes on hover (should be darker)
    const hoverColor = await collapseButton.evaluate((el) => 
      getComputedStyle(el).color
    );
    
    // Colors should be different (hover state should apply)
    expect(hoverColor).not.toBe(initialColor);
  });

  test("Collapse functionality works on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Verify button is visible on mobile
    await expect(collapseButton).toBeVisible();
    
    // Test collapse functionality
    await collapseButton.click();
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
    
    // Test expand functionality
    await collapseButton.click();
    await expect(featuredResults).toBeVisible();
    await expect(collapseButton).toHaveText("−");
  });

  test("Collapse button accessibility", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    
    // Check that button has proper attributes for accessibility
    await expect(collapseButton).toHaveAttribute("title");
    
    // Check that it's keyboard accessible (can be focused)
    await page.keyboard.press("Tab");
    await expect(collapseButton).toBeFocused();
    
    // Check that Enter key triggers the collapse
    const featuredResults = page.locator("#featured-results");
    await page.keyboard.press("Enter");
    await expect(featuredResults).toBeHidden();
  });

  test("No JavaScript errors during collapse operations", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    
    // Perform multiple collapse operations
    for (let i = 0; i < 3; i++) {
      await collapseButton.click();
      await page.waitForTimeout(100);
      await collapseButton.click();
      await page.waitForTimeout(100);
    }
    
    // Check for JavaScript errors
    await checkForJsErrors(page, "/");
  });

  test("Collapse button works with keyboard navigation", async ({ page }) => {
    const collapseButton = page.locator("#toggle-featured");
    const featuredResults = page.locator("#featured-results");
    
    // Use keyboard to navigate to and activate the button
    await page.keyboard.press("Tab"); // This should focus the search input first
    await page.keyboard.press("Tab"); // This should focus the collapse button
    
    // Verify the button is focused
    await expect(collapseButton).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press("Enter");
    
    // Verify collapse worked
    await expect(featuredResults).toBeHidden();
    await expect(collapseButton).toHaveText("+");
  });
});