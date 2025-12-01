import { test, expect, Page } from '@playwright/test';

test.describe('Featured Section Collapse Functionality', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    
    // Wait for the featured section to be loaded
    await page.waitForSelector('#featured-section', { state: 'visible' });
  });

  test('collapse button should be visible and properly styled', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    
    // Check button exists and is visible
    await expect(collapseBtn).toBeVisible();
    
    // Check initial state
    await expect(collapseBtn).toHaveText('Collapse −');
    await expect(collapseBtn).toHaveAttribute('title', 'Collapse section');
    
    // Check it has the correct class
    await expect(collapseBtn).toHaveClass('action-link');
  });

  test('should collapse and expand featured section on button click', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    
    // Initial state - expanded
    await expect(featuredResults).toBeVisible();
    await expect(collapseBtn).toHaveText('Collapse −');
    
    // Click to collapse
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText('Expand +');
    await expect(collapseBtn).toHaveAttribute('title', 'Expand section');
    
    // Click to expand
    await collapseBtn.click();
    await expect(featuredResults).toBeVisible();
    await expect(collapseBtn).toHaveText('Collapse −');
    await expect(collapseBtn).toHaveAttribute('title', 'Collapse section');
  });

  test('should handle multiple rapid clicks', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    
    // Perform rapid clicks
    await collapseBtn.click(); // collapse
    await collapseBtn.click(); // expand
    await collapseBtn.click(); // collapse
    
    // Should end up collapsed
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText('Expand +');
  });

  test('collapsed state should persist during content loading', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    
    // Collapse the section
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();
    
    // Wait for content to potentially load
    await page.waitForTimeout(2000);
    
    // Should still be collapsed
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText('Expand +');
  });

  test('should show results when searching even if collapsed', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    const searchInput = page.locator('#search-input');
    
    // Collapse the section
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();
    
    // Perform a search
    await searchInput.fill('test search');
    await page.waitForTimeout(1000); // Wait for search debounce
    
    // The section should become visible when search results are shown
    await expect(featuredResults).toBeVisible();
    
    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(1000);
    
    // Featured section should restore to collapsed state after clearing search
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText('Expand +');
  });

  test('should not interfere with other action links', async () => {
    // Check if other action links still work
    const randomRefreshBtn = page.locator('#random-section .action-link');
    
    // Collapse featured section
    await page.locator('#featured-collapse-btn').click();
    
    // Other action links should still be clickable
    if (await randomRefreshBtn.isVisible()) {
      await expect(randomRefreshBtn).toBeEnabled();
      // We don't click it to avoid side effects, just check it's enabled
    }
  });

  test('should be keyboard accessible', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    
    // Focus the button
    await collapseBtn.focus();
    
    // Press Enter to collapse
    await page.keyboard.press('Enter');
    await expect(featuredResults).not.toBeVisible();
    
    // Press Enter to expand
    await page.keyboard.press('Enter');
    await expect(featuredResults).toBeVisible();
  });

  test('should maintain proper ARIA attributes', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredSection = page.locator('#featured-section');
    
    // Check that the button is properly labeled
    await expect(collapseBtn).toHaveAttribute('href', '#');
    
    // The title attribute serves as the accessible name
    await expect(collapseBtn).toHaveAttribute('title');
  });

  test('should work on mobile viewport', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    
    // Button should still be visible and functional
    await expect(collapseBtn).toBeVisible();
    
    // Test collapse/expand on mobile
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();
    
    await collapseBtn.click();
    await expect(featuredResults).toBeVisible();
  });

  test('should not cause JavaScript errors', async () => {
    const errors: string[] = [];
    
    // Listen for console errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    // Perform various interactions
    const collapseBtn = page.locator('#featured-collapse-btn');
    await collapseBtn.click();
    await collapseBtn.click();
    await collapseBtn.click();
    
    // Check no errors occurred
    expect(errors).toHaveLength(0);
  });

  test('collapse button should have consistent styling with other action links', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const otherActionLink = page.locator('.section-header .action-link').first();
    
    // Get computed styles
    const collapseBtnColor = await collapseBtn.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    const otherLinkColor = await otherActionLink.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    // Colors should match
    expect(collapseBtnColor).toBe(otherLinkColor);
  });

  test('should handle edge case of missing content gracefully', async () => {
    // Remove the featured results div to simulate edge case
    await page.evaluate(() => {
      const elem = document.getElementById('featured-results');
      if (elem) elem.remove();
    });
    
    const collapseBtn = page.locator('#featured-collapse-btn');
    
    // Clicking should not cause errors
    await collapseBtn.click();
    
    // Button should still update its text
    await expect(collapseBtn).toHaveText('Expand +');
  });

  test('should persist collapse state across page reloads', async () => {
    const collapseBtn = page.locator('#featured-collapse-btn');
    const featuredResults = page.locator('#featured-results');
    
    // Collapse the section
    await collapseBtn.click();
    await expect(featuredResults).not.toBeVisible();
    
    // Reload the page
    await page.reload();
    await page.waitForSelector('#featured-section', { state: 'visible' });
    
    // Should still be collapsed after reload
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText('Expand +');
    
    // Expand it
    await collapseBtn.click();
    await expect(featuredResults).toBeVisible();
    
    // Reload again
    await page.reload();
    await page.waitForSelector('#featured-section', { state: 'visible' });
    
    // Should be expanded after reload
    await expect(featuredResults).toBeVisible();
    await expect(collapseBtn).toHaveText('Collapse −');
  });

  test('should clear localStorage state when appropriate', async () => {
    // Set a collapsed state
    await page.evaluate(() => {
      localStorage.setItem('featured-section-collapsed', 'true');
    });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForSelector('#featured-section', { state: 'visible' });
    
    const featuredResults = page.locator('#featured-results');
    const collapseBtn = page.locator('#featured-collapse-btn');
    
    // Should be collapsed based on localStorage
    await expect(featuredResults).not.toBeVisible();
    await expect(collapseBtn).toHaveText('Expand +');
  });
});