import { expect, test } from "./base-test";
import { checkForJsErrors } from "./js-error-checker";

const SERVER_PORT = process.env.SERVER_PORT || "4000";
const BASE_URL = `http://localhost:${SERVER_PORT}`;
test.describe("Prompts page functionality", () => {
  // This is a more realistic test that requires a running Jekyll server
  test("Random prompt boxes should exist", async ({ page }) => {
    // Navigate to the prompts page
    await page.goto(`${BASE_URL}/prompts`);

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
  });

  test("Page should not have JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/prompts");
  });
});
