import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Graph page functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Set up console log capture for debugging
    page.on("console", (msg) => {
      console.log(`PAGE LOG: ${msg.text()}`);
    });

    // Navigate directly to the graph page with eulogy node specified in the hash
    await page.goto("/graph#eulogy");

    // Wait for the graph to initialize
    await page.waitForTimeout(2000);
  });

  test("Graph page loads correctly", async ({ page }) => {
    // Check that the page has loaded correctly
    await expect(page).toHaveURL(/.*\/graph#eulogy/);

    // Check for essential page elements
    await expect(page.locator("#detail")).toBeVisible();
    await expect(page.locator("#controls")).toBeVisible();
    await expect(page.locator("#center_control")).toBeVisible();
  });

  test("Graph page has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/graph#eulogy");
  });

  // Test that controls are clickable
  test("Graph controls are clickable", async ({ page }) => {
    // Try clicking the center button
    await page.locator("#center_control").click();

    // Try clicking the collapse button
    await page.locator("#collapse_control").click();

    // Check that the page is still responsive
    await expect(page.locator("#detail")).toBeVisible();
  });

  // Test that the detail panel contains eulogy content
  test("Detail panel shows eulogy content", async ({ page }) => {
    // Get detail panel content
    const detailPanel = page.locator("#detail");
    await expect(detailPanel).toBeVisible({ timeout: 10000 });
    const detailText = (await detailPanel.textContent()) || "";

    // If the detail panel has been properly initialized, it should contain eulogy content
    // Check for common phrases in the eulogy
    const eulogyPatterns = [
      /igor.*eulogy/i,
      /wearing a silly hat/i,
      /trusty folding bike/i,
      /began with the end in mind/i,
    ];

    // Check if at least one of the patterns matches
    const hasEulogyContent = eulogyPatterns.some((pattern) => pattern.test(detailText));
    expect(hasEulogyContent).toBeTruthy();

    // Also verify there are links in the eulogy content
    const linkElements = page.locator("#detail a");
    const linkCount = await linkElements.count();

    // We expect the eulogy to have at least some links
    expect(linkCount).toBeGreaterThan(0);
  });

  test("Random Page button navigates to a different page", async ({ page }) => {
    // Get the initial content of the #detail panel
    const detailPanel = page.locator("#detail");
    await expect(detailPanel).toBeVisible({ timeout: 10000 });
    const initialDetailText = await detailPanel.textContent();

    // Assert that the #random_control button is visible and clickable
    const randomButton = page.locator("#random_control");
    await expect(randomButton).toBeVisible();
    await expect(randomButton).toBeEnabled();

    // Click the #random_control button
    await randomButton.click();

    // Wait for the detail panel to potentially update
    // This might need adjustment based on how quickly the graph updates
    await page.waitForTimeout(1000); // Wait for graph to settle

    // Get the new content of the #detail panel
    const newDetailText = await detailPanel.textContent();

    // Assert that the new content is different from the initial content
    expect(newDetailText).not.toBe(initialDetailText);
  });

  test("Recent Posts section displays correctly", async ({ page }) => {
    // Assert that the #recent_posts div is visible
    const recentPostsDiv = page.locator("#recent_posts");
    await expect(recentPostsDiv).toBeVisible({ timeout: 10000 });

    // Assert that there is a ul element within #recent_posts
    const ulElement = recentPostsDiv.locator("ul");
    await expect(ulElement).toBeVisible();

    // Assert that there are li elements within the ul
    const liElements = ulElement.locator("li");
    await expect(liElements.first()).toBeVisible(); // Check if at least one li is present
    const liCount = await liElements.count();
    expect(liCount).toBeGreaterThanOrEqual(1); // Expect at least 1 post
    expect(liCount).toBeLessThanOrEqual(5);    // Expect at most 5 posts

    // For each li (or at least the first one), assert that it contains an a (anchor) tag
    // with an href attribute that is not empty and text content that is not empty.
    for (let i = 0; i < liCount; i++) {
      const listItem = liElements.nth(i);
      const anchorTag = listItem.locator("a");
      await expect(anchorTag).toBeVisible();
      const hrefAttribute = await anchorTag.getAttribute("href");
      expect(hrefAttribute).not.toBeNull();
      expect(hrefAttribute).not.toBe("");
      const textContent = await anchorTag.textContent();
      expect(textContent).not.toBeNull();
      expect(textContent?.trim()).not.toBe("");
    }
  });
});
