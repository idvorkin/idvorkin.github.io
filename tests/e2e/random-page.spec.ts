import { expect, test } from "@playwright/test";

test.describe("Random Page Navigation", () => {
  test("should redirect from /random to a content page", async ({ page }) => {
    // Navigate to /random
    await page.goto("/random");

    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");

    // Get the current URL after redirect
    const currentUrl = page.url();

    // Verify we're not on /random anymore
    expect(currentUrl).not.toContain("/random");

    // Verify we're on a valid content page (not error pages or utility pages)
    expect(currentUrl).not.toContain("/404");
    expect(currentUrl).not.toContain("/search");
    expect(currentUrl).not.toContain("/graph");

    // Verify the page loaded successfully
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).not.toBe("");
  });

  test("random page links on /about page work", async ({ page }) => {
    // Navigate to about page
    await page.goto("/about");

    // Find the first random page link (there may be multiple)
    const randomLink = page.locator('a[href="/random"]').first();
    await expect(randomLink).toBeVisible();

    // Click the link
    await randomLink.click();

    // Wait for navigation
    await page.waitForLoadState("networkidle");

    // Verify we're not on /about or /random
    const currentUrl = page.url();
    expect(currentUrl).not.toContain("/about");
    expect(currentUrl).not.toContain("/random");
  });

  test("random page links on /recent page work", async ({ page }) => {
    // Navigate to recent page
    await page.goto("/recent");

    // Find the first random page link (there may be multiple)
    const randomLink = page.locator('a[href="/random"]').first();
    await expect(randomLink).toBeVisible();

    // Click the link
    await randomLink.click();

    // Wait for navigation
    await page.waitForLoadState("networkidle");

    // Verify we're not on /recent or /random
    const currentUrl = page.url();
    expect(currentUrl).not.toContain("/recent");
    expect(currentUrl).not.toContain("/random");
  });

  test("multiple /random visits go to different pages", async ({ page }) => {
    const visitedUrls = new Set<string>();
    const numVisits = 5;

    for (let i = 0; i < numVisits; i++) {
      await page.goto("/random");
      await page.waitForLoadState("networkidle");

      const currentUrl = page.url();
      visitedUrls.add(currentUrl);

      // Small delay to ensure we don't hit rate limits
      await page.waitForTimeout(100);
    }

    // We should have visited at least 2 different pages in 5 attempts
    // (allowing for some randomness)
    expect(visitedUrls.size).toBeGreaterThanOrEqual(2);
  });

  test("random post selector on /about page works", async ({ page }) => {
    // Navigate to about page
    await page.goto("/about");

    // Find the random post selector div
    const randomPostDiv = page.locator("#random-blog-post");
    await expect(randomPostDiv).toBeVisible();

    // Get initial text
    const initialText = await randomPostDiv.textContent();

    // Click to load a random post
    await randomPostDiv.click();

    // Wait for content to change
    await page.waitForTimeout(500);

    // Verify content has changed
    const newText = await randomPostDiv.textContent();
    expect(newText).not.toBe(initialText);

    // Verify it contains a link and description
    await expect(randomPostDiv.locator("a").first()).toBeVisible();
    expect(newText).toContain(":");

    // Verify clicking the link navigates to a post
    const linkHref = await randomPostDiv.locator("a").first().getAttribute("href");
    expect(linkHref).toBeTruthy();
    expect(linkHref).not.toBe("#");
  });

  test("random post selector on /recent page works", async ({ page }) => {
    // Navigate to recent page
    await page.goto("/recent");

    // Find the random post selector div
    const randomPostDiv = page.locator("#random-blog-post");
    await expect(randomPostDiv).toBeVisible();

    // Get initial text
    const initialText = await randomPostDiv.textContent();

    // Click to load a random post
    await randomPostDiv.click();

    // Wait for content to change
    await page.waitForTimeout(500);

    // Verify content has changed
    const newText = await randomPostDiv.textContent();
    expect(newText).not.toBe(initialText);

    // Verify it contains a link and description
    await expect(randomPostDiv.locator("a").first()).toBeVisible();
    expect(newText).toContain(":");

    // Verify clicking the link navigates to a post
    const linkHref = await randomPostDiv.locator("a").first().getAttribute("href");
    expect(linkHref).toBeTruthy();
    expect(linkHref).not.toBe("#");
  });
});
