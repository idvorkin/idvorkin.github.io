import { expect, test } from "@playwright/test";

test.describe("Auto-generated Sunburst", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-auto-sunburst");
  });

  test("Page loads correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/TEST AUTO-GENERATED SUNBURST/i);
  });

  test("Sunburst is generated from DOM structure", async ({ page }) => {
    // Wait for the sunburst to be rendered
    await page.waitForSelector("#sunburst svg", { timeout: 5000 });

    // Check that the sunburst contains the expected structure
    const sunburstText = await page.locator("#sunburst text").allTextContents();

    // Should contain the root "Test Topics"
    expect(sunburstText.some((text) => text.includes("Test Topics"))).toBeTruthy();

    // Should contain H2 elements as categories
    expect(sunburstText.some((text) => text.includes("Category A"))).toBeTruthy();
    expect(sunburstText.some((text) => text.includes("Category B"))).toBeTruthy();

    // The sunburst shows maxdepth: 2 by default, so we see root + 2 categories = 3 elements
    expect(sunburstText.length).toBe(3);
  });

  test("Click on text div with no prompts keeps same message", async ({ page }) => {
    // Wait for sunburst to load
    await page.waitForSelector("#sunburst svg", { timeout: 5000 });

    // Get initial text
    const initialText = await page.locator("#sunburst_text").textContent();
    expect(initialText).toContain("Click in any box or circle");

    // Click on the text div itself (which has a click handler)
    await page.locator("#sunburst_text").click();

    // Since there are no prompts defined (no UL after H3), text should remain the same
    const updatedText = await page.locator("#sunburst_text").textContent();
    expect(updatedText).toBe("Click in any box or circle");
  });

  test("Random prompts are generated for categories", async ({ page }) => {
    // Check that random prompt divs are added after H3 elements
    const promptDivs = await page.locator("h3 + div.alert.alert-primary").count();
    expect(promptDivs).toBeGreaterThan(0);

    // Click on a refresh button to get a new prompt
    const firstPromptDiv = page.locator("h3 + div.alert.alert-primary").first();
    const initialPrompt = await firstPromptDiv.textContent();

    // Click the refresh icon
    const refreshIcon = firstPromptDiv.locator("span[title='Click for another prompt']");
    await refreshIcon.click();

    // Wait a bit for the prompt to update
    await page.waitForTimeout(1000);

    // Prompt should have changed
    let newPrompt = await firstPromptDiv.textContent();

    // If the prompt hasn't changed, try clicking again
    if (newPrompt === initialPrompt) {
      await refreshIcon.click();
      await page.waitForTimeout(1000);
      newPrompt = await firstPromptDiv.textContent();
    }

    expect(newPrompt).not.toBe(initialPrompt);
  });

  test("Page has no JavaScript errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // Ignore known errors that are not related to auto-sunburst functionality
        if (!text.includes("recent-posts container not found") && !text.includes("Error fetching link info")) {
          errors.push(text);
        }
      }
    });

    await page.goto("/test-auto-sunburst");
    await page.waitForSelector("#sunburst svg", { timeout: 5000 });

    expect(errors).toHaveLength(0);
  });
});
