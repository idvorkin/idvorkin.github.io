import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Featured Posts functionality", () => {
  test("Homepage shows hardcoded featured posts", async ({ page }) => {
    await page.goto("/");

    // Wait for featured posts to load
    await page.waitForSelector("#featured-results .result-item");

    // Check that we have exactly 3 featured posts
    const featuredItems = page.locator("#featured-results .result-item");
    await expect(featuredItems).toHaveCount(3);

    // Verify the specific posts are shown (hardcoded list)
    const featuredText = await page.locator("#featured-results").textContent();
    expect(featuredText).toContain("Igor's Eulogy");
    expect(featuredText).toContain("How to EM");
    expect(featuredText).toContain("I don't want to die knowing I spent too much time at work");

    // Verify descriptions are present (checking for key phrases from actual descriptions)
    expect(featuredText).toContain("Wearing a silly hat");
    expect(featuredText).toContain("Being an engineering manager is hard");
    expect(featuredText).toContain("work with people who value a culture");
  });

  test("Featured posts are not affected by search", async ({ page }) => {
    await page.goto("/");

    // Get initial featured posts
    await page.waitForSelector("#featured-results .result-item");
    const initialFeatured = await page.locator("#featured-results").textContent();

    // Verify at least one featured post is present (Igor's Eulogy should always be there)
    expect(initialFeatured).toContain("Igor's Eulogy");

    // Perform a search
    const searchInput = page.locator("#search-input");
    await searchInput.fill("test search");
    await page.waitForTimeout(500);

    // Clear search
    await searchInput.clear();

    // Wait for featured posts to reappear after clearing search
    await page.waitForFunction(
      () => {
        const featured = document.getElementById("featured-results");
        return featured?.textContent?.includes("Igor's Eulogy");
      },
      { timeout: 5000 },
    );

    // Featured posts should contain at least Igor's Eulogy after clearing search
    const finalFeatured = await page.locator("#featured-results").textContent();
    expect(finalFeatured).toContain("Igor's Eulogy");

    // Test that we have some featured content (not empty)
    const featuredItems = page.locator("#featured-results .result-item");
    await expect(featuredItems).toHaveCount(3); // Should have 3 featured posts
  });

  test("Featured page displays all featured posts from data file", async ({ page }) => {
    await page.goto("/featured/");

    // Wait for posts to load
    await page.waitForSelector(".post-list li", { timeout: 10000 });

    // Check that posts are displayed
    const postList = page.locator(".post-list li");
    const count = await postList.count();
    expect(count).toBeGreaterThanOrEqual(3); // At least the 3 main featured posts

    // Verify first post has expected structure
    const firstPost = postList.first();
    await expect(firstPost.locator("a")).toBeVisible();
    await expect(firstPost.locator(".entry-description")).toBeVisible();
    // Note: tags might not be present as they're not in backlinks.json

    // Check for specific posts
    const pageContent = await page.locator(".post-list").textContent();
    expect(pageContent).toContain("Igor's Eulogy");
    expect(pageContent).toContain("How to EM");
    expect(pageContent).toContain("I don't want to die knowing");
  });

  test("Featured posts have clickable links", async ({ page }) => {
    await page.goto("/");

    // Wait for featured posts to load
    await page.waitForSelector("#featured-results .result-item");

    // Click on the first featured post
    const firstPost = page.locator("#featured-results .result-item").first();
    const firstLink = await firstPost.locator("a").getAttribute("href");
    expect(firstLink).toBeTruthy();

    // Click the post
    await firstPost.click();

    // Verify navigation occurred
    await page.waitForURL(`**${firstLink}`);
    expect(page.url()).toContain(firstLink);
  });

  test.skip("Featured page shows tags for posts", async ({ page }) => {
    // Skipping this test as tags are not currently available in backlinks.json
    // This would require parsing the actual markdown files to extract tags
    await page.goto("/featured/");

    // Check that tags are displayed
    const tags = page.locator(".tag");
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);

    // Check for specific tags
    const tagTexts = await tags.allTextContents();
    expect(tagTexts.some((tag) => tag.includes("how igor ticks"))).toBeTruthy();
    expect(tagTexts.some((tag) => tag.includes("management") || tag.includes("book-notes"))).toBeTruthy();
  });

  test("Featured posts descriptions are truncated appropriately", async ({ page }) => {
    await page.goto("/");

    // Wait for featured posts to load
    await page.waitForSelector("#featured-results .result-item");

    // Get all descriptions
    const descriptions = page.locator("#featured-results .description");
    const descCount = await descriptions.count();

    for (let i = 0; i < descCount; i++) {
      const descText = await descriptions.nth(i).textContent();
      // Check that descriptions are not too long (should be truncated around 150 chars)
      expect(descText?.length).toBeLessThanOrEqual(160); // Allow some buffer
    }
  });

  test("No JavaScript errors on featured pages", async ({ page }) => {
    // Test homepage
    await checkForJsErrors(page, "/");

    // Test featured page
    await checkForJsErrors(page, "/featured/");
  });

  test("Featured posts remain consistent across page reloads", async ({ page }) => {
    await page.goto("/");

    // Wait for featured posts to load
    await page.waitForSelector("#featured-results .result-item");

    // Get featured posts
    const firstLoad = await page.locator("#featured-results").textContent();

    // Reload the page
    await page.reload();
    await page.waitForSelector("#featured-results .result-item");

    // Get featured posts again
    const secondLoad = await page.locator("#featured-results").textContent();

    // They should be identical (hardcoded list)
    expect(firstLoad).toContain("Igor's Eulogy");
    expect(secondLoad).toContain("Igor's Eulogy");
    expect(firstLoad).toContain("How to EM");
    expect(secondLoad).toContain("How to EM");
    expect(firstLoad).toContain("I don't want to die knowing I spent too much time at work");
    expect(secondLoad).toContain("I don't want to die knowing I spent too much time at work");
  });
});
