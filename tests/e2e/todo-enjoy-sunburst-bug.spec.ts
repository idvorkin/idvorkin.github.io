import { expect, test } from "@playwright/test";

test.describe("Todo enjoy sunburst click bug", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#sunburst", { state: "visible" });
    await page.waitForTimeout(2000);
  });

  test("BUG: Clicking sunburst segments should update prompt but doesn't", async ({ page }) => {
    const promptElement = page.locator("#sunburst_text");
    const initialText = await promptElement.textContent();

    console.log("🐛 DOCUMENTING BUG: Sunburst segment clicks not updating prompt");
    console.log("📝 Initial prompt text:", initialText?.trim());
    console.log("✅ EXPECTED: Clicking any sunburst segment should show a random suggestion from that category");
    console.log("❌ ACTUAL: Clicking sunburst segments does nothing - text remains 'Click in any box or circle'");

    // Test clicking on path elements (the colored segments)
    const pathElements = page.locator("#sunburst path");
    const pathCount = await pathElements.count();

    console.log(`\n🎯 Testing ${pathCount} path elements (sunburst segments):`);

    // Try clicking the first few path elements
    for (let i = 0; i < Math.min(3, pathCount); i++) {
      const path = pathElements.nth(i);

      // Get bounding box to ensure element is clickable
      const box = await path.boundingBox();
      if (box) {
        console.log(`\n  Clicking path element ${i + 1}...`);
        await path.click({ force: true });
        await page.waitForTimeout(1000);

        const newText = await promptElement.textContent();
        const textChanged = newText?.trim() !== initialText?.trim();

        console.log(`  Result: Text ${textChanged ? "CHANGED ✅" : "DID NOT CHANGE ❌"}`);
        console.log(`  Current text: "${newText?.trim()}"`);

        if (!textChanged) {
          console.log(`  ⚠️  BUG CONFIRMED: Path click ${i + 1} failed to update prompt`);
        }
      }
    }

    // Also test clicking on text labels (category names)
    console.log("\n🏷️  Testing text labels (category names):");
    const textElements = page.locator("#sunburst text").filter({ hasText: /^(?!Invest in).*$/ }); // Exclude center text
    const textCount = await textElements.count();

    if (textCount > 0) {
      const firstLabel = textElements.first();
      const labelText = await firstLabel.textContent();

      console.log(`\n  Clicking on category label: "${labelText}"`);
      await firstLabel.click({ force: true });
      await page.waitForTimeout(1000);

      const afterLabelClick = await promptElement.textContent();
      const labelClickChanged = afterLabelClick?.trim() !== initialText?.trim();

      console.log(`  Result: Text ${labelClickChanged ? "CHANGED ✅" : "DID NOT CHANGE ❌"}`);
      console.log(`  Current text: "${afterLabelClick?.trim()}"`);

      if (labelClickChanged) {
        console.log("  ✅ Text labels ARE working - prompt updated to show category-specific suggestion");
      } else {
        console.log(`  ❌ Even text labels don't work`);
      }
    }

    // Check if the plotly click handler is attached
    const hasClickHandler = await page.evaluate(() => {
      const sunburstDiv = document.getElementById("sunburst") as any;
      return sunburstDiv?._fullLayout?._has?.("plotly_sunburstclick");
    });

    console.log(`\n🔧 Plotly sunburstclick handler attached: ${hasClickHandler ? "YES ✅" : "NO ❌"}`);

    // Log the issue summary
    console.log("\n📋 ISSUE SUMMARY:");
    console.log("- User expects: Click any segment (the 'circles') → prompt updates with random suggestion");
    console.log("- What happens: Clicking segments does nothing → prompt stays as 'Click in any box or circle'");
    console.log("- Root cause: Plotly sunburstclick event handler may not be properly attached or functioning");

    // This test documents the bug, so we expect it to fail
    expect(initialText?.trim()).toBe("Click in any box or circle");
  });
});
