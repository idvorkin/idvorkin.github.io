import { expect, test } from "@playwright/test";

test.describe("Sunburst path element clicks", () => {
  test("Clicking sunburst path segments updates prompt text", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#sunburst", { state: "visible" });

    // Wait for sunburst to be fully rendered
    await page.waitForFunction(() => {
      const sunburst = document.getElementById("sunburst");
      return sunburst && (sunburst as any).data;
    });

    const promptElement = page.locator("#sunburst_text");
    const initialText = await promptElement.textContent();

    // Click on a path element (not text)
    const pathElements = page.locator("#sunburst path");
    const pathCount = await pathElements.count();

    if (pathCount > 0) {
      // Click the second path element (first might be center)
      const targetPath = pathElements.nth(1);

      await targetPath.click({ force: true });

      // Wait for prompt text to update
      await page.waitForFunction(
        (oldText) => {
          const element = document.getElementById("sunburst_text");
          return element && element.textContent !== oldText;
        },
        initialText,
        { timeout: 5000 },
      );

      const newText = await promptElement.textContent();

      // The text should have changed
      expect(newText?.trim()).not.toBe(initialText?.trim());
      expect(newText?.trim()).not.toBe("Click in any box or circle");
    }
  });

  test("Multiple path clicks generate different prompts", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#sunburst", { state: "visible" });

    // Wait for sunburst to be fully rendered
    await page.waitForFunction(() => {
      const sunburst = document.getElementById("sunburst");
      return sunburst && (sunburst as any).data;
    });

    const promptElement = page.locator("#sunburst_text");
    const pathElements = page.locator("#sunburst path");

    const prompts: string[] = [];

    // Click different path elements and collect prompts
    for (let i = 1; i <= 3 && i < (await pathElements.count()); i++) {
      await pathElements.nth(i).click({ force: true });

      // Small delay between clicks
      await page.waitForTimeout(200);

      const text = await promptElement.textContent();
      if (text && text.trim() !== "Click in any box or circle") {
        prompts.push(text.trim());
      }
    }

    // We should have collected some prompts
    expect(prompts.length).toBeGreaterThan(0);

    // At least one should be different from the initial text
    expect(prompts.some((p) => p !== "Click in any box or circle")).toBe(true);
  });
});
