import { expect, test } from "./base-test";
import { checkForJsErrors } from "./js-error-checker";

test("About page loads correctly", async ({ page }) => {
  // Navigate to the About page
  await page.goto("/about");

  // Check that the page has loaded by verifying the title
  await expect(page.locator("h1")).toContainText("Where am I?");

  // Verify some content on the page to ensure it loaded properly
  await expect(page.locator("body")).toContainText("Igor");
});

test("About page has no JavaScript errors", async ({ page }) => {
  await checkForJsErrors(page, "/about");
});
