import { expect, test } from "@playwright/test";

test.describe("Todo enjoy circle/checkbox interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    // Wait for sunburst to fully load
    await page.waitForSelector("#sunburst", { state: "visible" });
    await page.waitForTimeout(2000);
  });

  test("Investigate circle/checkbox click behavior on random suggestion", async ({ page }) => {
    // Take initial screenshot
    await page.screenshot({
      path: "tests/screenshots/todo-enjoy-initial.png",
      fullPage: true,
    });

    // Find the circle element within the sunburst
    const sunburstElement = page.locator("#sunburst");
    const promptElement = page.locator("#sunburst_text");

    console.log("🔍 Looking for clickable elements in sunburst...");

    // Look for all potential clickable elements
    const pathElements = await page.locator("#sunburst path").count();
    const textElements = await page.locator("#sunburst text").count();
    const gElements = await page.locator("#sunburst g").count();

    console.log(`📊 Found ${pathElements} path elements in sunburst`);
    console.log(`📊 Found ${textElements} text elements in sunburst`);
    console.log(`📊 Found ${gElements} g elements in sunburst`);

    // Get initial prompt text
    const initialPromptText = await promptElement.textContent();
    console.log(`📝 Initial prompt text: "${initialPromptText}"`);

    // Look for specific elements that might be the "circles" user is referring to
    // Check if there are any circular paths or elements in the sunburst
    const sunburstPaths = page.locator("#sunburst path");

    if ((await sunburstPaths.count()) > 0) {
      console.log("🎯 Clicking on first path element in sunburst...");
      await sunburstPaths.first().click({ force: true });
      await page.waitForTimeout(1000);

      const afterPathClickText = await promptElement.textContent();
      console.log(`📝 Text after path click: "${afterPathClickText}"`);

      if (afterPathClickText === initialPromptText) {
        console.log("❌ BUG: Text did NOT change after clicking path");
      } else {
        console.log("✅ Text changed after clicking path");
      }
    }

    // Try clicking on text elements (categories)
    const categoryElements = page.locator("#sunburst text");
    if ((await categoryElements.count()) > 0) {
      console.log("🎯 Clicking on first text element in sunburst...");
      await categoryElements.first().click({ force: true });
      await page.waitForTimeout(1000);

      const afterTextClickText = await promptElement.textContent();
      console.log(`📝 Text after text click: "${afterTextClickText}"`);
    }

    // Take screenshot after interaction
    await page.screenshot({
      path: "tests/screenshots/todo-enjoy-after-click.png",
      fullPage: true,
    });

    // Debug: Get the sunburst structure
    const sunburstHTML = await sunburstElement.innerHTML();
    console.log("🔍 Sunburst HTML structure (first 500 chars):", `${sunburstHTML.substring(0, 500)}...`);
  });

  test("Document expected vs actual behavior", async ({ page }) => {
    const promptElement = page.locator("#sunburst_text");
    const initialText = await promptElement.textContent();

    // Try different selectors for the circle/checkbox
    const possibleSelectors = [
      "circle",
      'input[type="checkbox"]',
      ".checkbox",
      ".circle",
      '[role="checkbox"]',
      "svg circle",
    ];

    console.log("📋 Testing different selectors for clickable elements:");

    for (const selector of possibleSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();

      if (count > 0) {
        console.log(`✅ Found ${count} elements with selector: ${selector}`);

        // Try clicking the first one
        try {
          await elements.first().click({ force: true, timeout: 2000 });
          await page.waitForTimeout(500);

          const newText = await promptElement.textContent();
          const changed = newText !== initialText;

          console.log(`   Click result: Text ${changed ? "CHANGED" : "DID NOT CHANGE"}`);
          console.log("   Expected: Text should change to random suggestion");
          console.log(`   Actual: ${changed ? "✅ Working correctly" : "❌ BUG - Not updating"}`);

          if (!changed) {
            console.log(`   Issue: Clicking ${selector} does not trigger random suggestion update`);
          }
        } catch (e) {
          console.log(`   ⚠️  Could not click ${selector}: ${e.message}`);
        }
      }
    }
  });
});
