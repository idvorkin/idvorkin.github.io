import { expect, test } from "@playwright/test";

test.describe("Search page UX verification", () => {
  test("page should never appear empty during load", async ({ page }) => {
    // Slow down network to simulate real-world conditions
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto("/");
    
    // Take screenshots at different intervals
    const timestamps = [0, 100, 300, 500, 1000];
    
    for (const delay of timestamps) {
      if (delay > 0) await page.waitForTimeout(delay);
      
      // Check visible content
      const visibleContent = await page.locator("#results-container").textContent();
      console.log(`At ${delay}ms: ${visibleContent?.substring(0, 100)}...`);
      
      // Should always have some text visible (placeholders or content)
      expect(visibleContent?.length).toBeGreaterThan(50);
      
      await page.screenshot({ 
        path: `/home/developer/gits/idvorkin.github.io/repo_tmp/load-${delay}ms.png`,
        fullPage: false 
      });
    }
  });
  
  test("clean UI with integrated actions", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000); // Let everything load
    
    // Verify the clean header structure
    const recentHeader = page.locator("#recent-section .section-header");
    await expect(recentHeader).toContainText("Recent");
    await expect(recentHeader).toContainText("View all");
    
    const randomHeader = page.locator("#random-section .section-header");
    await expect(randomHeader).toContainText("Random");
    await expect(randomHeader).toContainText("Refresh");
    
    // Verify no duplicate action links in content
    const recentDuplicates = await page.locator("#recent-results a:has-text('View all')").count();
    expect(recentDuplicates).toBe(0);
    
    const randomDuplicates = await page.locator("#random-results a:has-text('Load new')").count();
    expect(randomDuplicates).toBe(0);
    
    // Take final screenshot
    await page.screenshot({ 
      path: `/home/developer/gits/idvorkin.github.io/repo_tmp/final-ui.png`,
      fullPage: true 
    });
  });
});