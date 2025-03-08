import { test, expect } from "@playwright/test";

test.describe("7 habits", () => {
  const known_category_on_sunburst = "Be Proactive";

  test.beforeEach(async ({ page }) => {
    await page.goto("/7-habits");
  });

  test("Has known category", async ({ page }) => {
    const categoryElement = page.locator(`text=${known_category_on_sunburst}`);
    await expect(categoryElement).toHaveText(known_category_on_sunburst);
  });

  test("Text changes when clicking on donut", async ({ page }) => {
    // Get the default prompt text
    const defaultPromptElement = page.locator("#sunburst_text");
    const originalText = (await defaultPromptElement.textContent()) || "";

    // Click on the donut center
    const donutCenter = page.locator(".sunburst text").first();
    await donutCenter.click({ force: true });

    // Check that the text has changed
    await expect(defaultPromptElement).not.toHaveText(originalText);
  });
});
