import { test, expect } from "@playwright/test";

test("About page loads correctly", async ({ page }) => {
  // Navigate to the About page
  await page.goto("/about");

  // Check that the page has loaded by verifying the title
  await expect(page.locator("h1")).toContainText("Where am I?");

  // Verify some content on the page to ensure it loaded properly
  await expect(page.locator("body")).toContainText("Igor");
});
