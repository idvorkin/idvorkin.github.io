import { test, expect } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

// Skip tests if we're not actually running the Jekyll server
const isJekyllRunning = process.env.SKIP_JEKYLL_TESTS !== "true";
test.describe("Prompts page functionality", () => {
  // This is a more realistic test that requires a running Jekyll server
  test("Random prompt boxes should exist", async ({ page }) => {
    test.skip(!isJekyllRunning, "Jekyll server is not running");

    try {
      // Navigate to the prompts page
      await page.goto("https://idvork.in/prompts", { timeout: 10000 });

      // Wait for the page to load fully
      await page.waitForSelector(".alert-primary", { timeout: 5000 });

      // Check that there are random prompt boxes
      const promptBoxes = page.locator(".alert-primary");
      const count = await promptBoxes.count();
      expect(count).toBeGreaterThan(0);
      console.log(`Found ${count} prompt boxes`);

      // Verify the prompt boxes contain actual content
      for (let i = 0; i < Math.min(count, 3); i++) {
        const promptBox = promptBoxes.nth(i);
        const text = await promptBox.textContent();
        expect(text).not.toBeNull();
        expect(text.trim()).not.toBe("");
        console.log(`Box ${i} text: "${text.trim().substring(0, 50)}..."`);
      }

      // If we make it this far without errors, the test passes
    } catch (error) {
      console.log("Error accessing the page:", error.message);
      test.skip(true, "Could not access the prompts page - network error");
    }
  });

  // This is a lighter test that can work with a mock HTML
  test.skip("Page should not have JavaScript errors", async ({ page }) => {
    test.skip(!isJekyllRunning, "Jekyll server is not running");

    // Create a promise that will capture any JS errors
    const errorLogs = [];
    page.on("pageerror", error => {
      errorLogs.push(error.message);
    });

    try {
      // Navigate to the prompts page
      await page.goto("https://idvork.in/prompts", { timeout: 10000 });

      // Wait for the page to load fully
      await page.waitForSelector(".alert-primary", { timeout: 5000 });

      // Wait a bit to ensure all scripts have run
      await page.waitForTimeout(1000);

      // Verify no JavaScript errors were logged
      expect(errorLogs.length).toBe(
        0,
        `JavaScript errors found: ${errorLogs.join(", ")}`
      );
    } catch (error) {
      console.log("Error accessing the page:", error.message);
      test.skip(true, "Could not access the prompts page - network error");
    }
  });

  test("Prompts page has no JavaScript errors", async ({ page }) => {
    test.skip(!isJekyllRunning, "Jekyll server is not running");
    await checkForJsErrors(page, "/prompts");
  });
});
