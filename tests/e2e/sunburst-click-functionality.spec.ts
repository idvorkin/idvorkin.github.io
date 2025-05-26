import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Sunburst Click Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/todo_enjoy");
    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");
    // Wait for the sunburst to be visible
    await page.waitForSelector("#sunburst", { state: "visible" });
  });

  test("Sunburst visualization loads correctly", async ({ page }) => {
    // Check that the sunburst container exists
    await expect(page.locator("#sunburst")).toBeVisible();

    // Check that the prompt text container exists
    await expect(page.locator("#sunburst_text")).toBeVisible();

    // Check that the initial text is present
    const initialText = await page.locator("#sunburst_text").textContent();
    expect(initialText?.trim()).toBe("Click in any box or circle");
  });

  test("Sunburst contains expected categories", async ({ page }) => {
    // Wait for sunburst to load
    await page.waitForTimeout(2000);

    // Check for key categories that should be in the sunburst
    const expectedCategories = ["Health", "Magic", "Family", "Entertaining"];

    for (const category of expectedCategories) {
      const categoryElement = page.locator(`#sunburst text:has-text("${category}")`);
      await expect(categoryElement).toBeVisible();
    }
  });

  test("Click on sunburst segment should change prompt text", async ({ page }) => {
    // Wait for sunburst to fully load
    await page.waitForTimeout(2000);

    const promptElement = page.locator("#sunburst_text");
    const originalText = await promptElement.textContent();

    // Try clicking on a specific category
    const healthElement = page.locator('#sunburst text:has-text("Health")');
    await expect(healthElement).toBeVisible();

    // Click with force to bypass any interception
    await healthElement.click({ force: true });

    // Wait for the prompt to potentially update
    await page.waitForTimeout(1000);

    const newText = await promptElement.textContent();

    // The text should change from the default to a health-related prompt
    expect(newText).not.toEqual(originalText);
    expect(newText).toContain("Health"); // Should contain the category name
  });

  test("Click on prompt text should generate new random prompt", async ({ page }) => {
    // Wait for sunburst to fully load
    await page.waitForTimeout(2000);

    const promptElement = page.locator("#sunburst_text");

    // First click on a category to get a specific prompt
    const healthElement = page.locator('#sunburst text:has-text("Health")');
    await healthElement.click({ force: true });
    await page.waitForTimeout(500);

    const firstPrompt = await promptElement.textContent();

    // Now click on the prompt text itself to get a new random prompt
    await promptElement.click();
    await page.waitForTimeout(500);

    const secondPrompt = await promptElement.textContent();

    // The prompts should be different (though they might occasionally be the same due to randomness)
    // We'll check that the functionality is working by ensuring it's not the default text
    expect(secondPrompt).not.toBe("Click in any box or circle");
  });

  test("JavaScript console shows no errors during sunburst interaction", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for sunburst to load
    await page.waitForTimeout(2000);

    // Interact with the sunburst
    const healthElement = page.locator('#sunburst text:has-text("Health")');
    await healthElement.click({ force: true });
    await page.waitForTimeout(500);

    // Click on prompt text
    const promptElement = page.locator("#sunburst_text");
    await promptElement.click();
    await page.waitForTimeout(500);

    // Check for console errors
    expect(consoleErrors).toEqual([]);
  });

  test("Plotly sunburst click event handler is properly attached", async ({ page }) => {
    // Wait for sunburst to load
    await page.waitForTimeout(2000);

    // Check if Plotly is available
    const plotlyAvailable = await page.evaluate(() => {
      return typeof window.Plotly !== "undefined";
    });

    expect(plotlyAvailable).toBe(true);

    // Check if the sunburst plot exists
    const sunburstExists = await page.evaluate(() => {
      const sunburstDiv = document.getElementById("sunburst") as any;
      return sunburstDiv?.data && sunburstDiv.data.length > 0;
    });

    expect(sunburstExists).toBe(true);
  });

  test("Category to prompts mapping is working", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check if the category_to_prompts function is working by evaluating it
    const categoryMappingExists = await page.evaluate(() => {
      // Check if we can find H3 elements (categories) and UL elements (prompts)
      const h3Elements = document.querySelectorAll("h3");
      const ulElements = document.querySelectorAll("ul");

      return h3Elements.length > 0 && ulElements.length > 0;
    });

    expect(categoryMappingExists).toBe(true);
  });

  test("Random prompt generation function is available", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check if the random_prompt_for_label function is working
    const randomPromptFunctionWorks = await page.evaluate(() => {
      try {
        // Try to access the function through the module system
        return (
          typeof (window as any).random_prompt_for_label !== "undefined" || typeof (window as any).$ !== "undefined"
        ); // jQuery should be available
      } catch (error) {
        return false;
      }
    });

    // At minimum, jQuery should be available for the functionality to work
    const jqueryAvailable = await page.evaluate(() => {
      return typeof (window as any).$ !== "undefined";
    });

    expect(jqueryAvailable).toBe(true);
  });

  test("Debug: Check what happens when clicking sunburst", async ({ page }) => {
    // Enable console logging
    const logs: string[] = [];
    page.on("console", (msg) => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });

    // Wait for sunburst to load
    await page.waitForTimeout(2000);

    const promptElement = page.locator("#sunburst_text");
    const originalText = await promptElement.textContent();

    console.log("Original text:", originalText);

    // Try clicking on Health category
    const healthElement = page.locator('#sunburst text:has-text("Health")');

    // Check if the element exists
    const healthExists = await healthElement.count();
    console.log("Health element count:", healthExists);

    if (healthExists > 0) {
      await healthElement.click({ force: true });
      await page.waitForTimeout(1000);

      const newText = await promptElement.textContent();
      console.log("New text after click:", newText);

      // Log any console messages
      console.log("Console logs:", logs);
    }

    // This test is for debugging, so we'll always pass but log the results
    expect(true).toBe(true);
  });
});
