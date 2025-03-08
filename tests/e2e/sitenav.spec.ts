import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Has navigation links", async ({ page }) => {
    // Check that the navigation links exist
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
  });

  test("Can navigate to About page", async ({ page }) => {
    // Find and click the About link
    const aboutLink = page.locator('nav a[href="/about"]');
    await aboutLink.click();

    // Check that we're on the About page
    await expect(page).toHaveURL(/.*\/about/);
    await expect(page.locator("h1")).toContainText("About");
  });

  test("Can navigate to Tags page", async ({ page }) => {
    // Find and click the Tags link
    const tagsLink = page.locator('nav a[href="/tags"]');
    await tagsLink.click();

    // Check that we're on the Tags page
    await expect(page).toHaveURL(/.*\/tags/);
    await expect(page.locator("h1")).toContainText("Tag");
  });

  test("Can navigate to Categories page", async ({ page }) => {
    // Find and click the Categories link
    const categoriesLink = page.locator('nav a[href="/categories"]');
    await categoriesLink.click();

    // Check that we're on the Categories page
    await expect(page).toHaveURL(/.*\/categories/);
    await expect(page.locator("h1")).toContainText("Category");
  });
});
