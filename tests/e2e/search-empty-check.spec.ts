import { expect, test } from "@playwright/test";

test.describe("Homepage initial load experience", () => {
  test("should show content immediately on page load", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");
    
    // Check if sections have any visible content immediately (no waiting)
    const featuredContent = await page.locator("#featured-results .result-item").count();
    const recentContent = await page.locator("#recent-results .result-item").count();
    const randomContent = await page.locator("#random-results .result-item").count();
    
    console.log("Initial content counts:");
    console.log("Featured:", featuredContent);
    console.log("Recent:", recentContent);
    console.log("Random:", randomContent);
    
    // At least one section should have content or loading indicator immediately
    const hasAnyContent = featuredContent > 0 || recentContent > 0 || randomContent > 0;
    
    if (!hasAnyContent) {
      // Check if there are loading indicators
      const loadingIndicators = await page.locator(".result-item:has-text('Loading')").count();
      console.log("Loading indicators:", loadingIndicators);
      
      expect(loadingIndicators).toBeGreaterThan(0);
    }
  });

  test("visual check - page should not appear empty", async ({ page }) => {
    await page.goto("/");
    
    // Take screenshot immediately
    await page.screenshot({ 
      path: "/home/developer/gits/idvorkin.github.io/repo_tmp/initial-load.png",
      fullPage: false 
    });
    
    // Check what's visible in the viewport
    const resultsContainer = page.locator("#results-container");
    const boundingBox = await resultsContainer.boundingBox();
    
    if (boundingBox) {
      console.log("Results container height:", boundingBox.height);
      // Container should have some height (not collapsed)
      expect(boundingBox.height).toBeGreaterThan(50);
    }
    
    // Count any visible text immediately
    const visibleText = await page.locator("#results-container").textContent();
    console.log("Visible text length:", visibleText?.length);
    
    // Should have more than just headers
    expect(visibleText?.length).toBeGreaterThan(100);
  });
});