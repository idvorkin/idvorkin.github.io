import { type Page, expect, test } from "./base-test";

test.describe("Random page topic", () => {
  const url_info = {
    "/topic-ai-post": { url: "/topic-ai-post", topics: ["ai"] },
    "/topic-family-post": { url: "/topic-family-post", topics: ["family"] },
    "/topic-last-post": { url: "/topic-last-post", topics: [] },
  };

  // Always picks the last candidate, so which page we land on shows the pool that was rolled from.
  async function rollFrom(page: Page, path: string, warnings: string[] = []) {
    page.on("console", (message) => {
      if (message.type() === "warning") warnings.push(message.text());
    });
    await page.addInitScript(() => {
      Math.random = () => 0.999;
    });
    await page.route("**/back-links.json", (route) => route.fulfill({ json: { url_info } }));
    await page.route("**/topic-*-post", (route) => route.fulfill({ contentType: "text/html", body: "landed" }));
    await page.goto(path);
    await page.waitForURL(/\/topic-.*-post$/);
    return new URL(page.url()).pathname;
  }

  test("?topic=ai lands on a post in that topic", async ({ page }) => {
    expect(await rollFrom(page, "/random?topic=ai")).toBe("/topic-ai-post");
  });
});

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
});
