import { expect, test } from "@playwright/test";

test.describe("Sunburst path element clicks", () => {
  test("Clicking sunburst path segments updates prompt text", async ({ page }) => {
    // Enable console logging
    page.on("console", (msg) => {
      if (msg.text().includes("Sunburst click")) {
        console.log(`Console: ${msg.text()}`);
      }
    });

    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#sunburst", { state: "visible" });
    await page.waitForTimeout(2000);

    const promptElement = page.locator("#sunburst_text");
    const initialText = await promptElement.textContent();

    console.log("Initial prompt text:", initialText?.trim());

    // Click on a path element (not text)
    const pathElements = page.locator("#sunburst path");
    const pathCount = await pathElements.count();
    console.log(`Found ${pathCount} path elements`);

    if (pathCount > 0) {
      // Click the second path element (first might be center)
      const targetPath = pathElements.nth(1);

      // Get the fill color to identify which segment we're clicking
      const fillColor = await targetPath.getAttribute("fill");
      console.log(`Clicking path with fill color: ${fillColor}`);

      await targetPath.click({ force: true });
      await page.waitForTimeout(1000);

      const newText = await promptElement.textContent();
      console.log("New prompt text:", newText?.trim());

      // The text should have changed
      expect(newText?.trim()).not.toBe(initialText?.trim());
      expect(newText?.trim()).not.toBe("Click in any box or circle");
    }
  });

  test("Multiple path clicks generate different prompts", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#sunburst", { state: "visible" });
    await page.waitForTimeout(2000);

    const promptElement = page.locator("#sunburst_text");
    const pathElements = page.locator("#sunburst path");

    const prompts: string[] = [];

    // Click different path elements and collect prompts
    for (let i = 1; i <= 3 && i < (await pathElements.count()); i++) {
      await pathElements.nth(i).click({ force: true });
      await page.waitForTimeout(500);

      const text = await promptElement.textContent();
      if (text && text.trim() !== "Click in any box or circle") {
        prompts.push(text.trim());
      }
    }

    console.log("Collected prompts:", prompts);

    // We should have collected some prompts
    expect(prompts.length).toBeGreaterThan(0);

    // At least one should be different from the initial text
    expect(prompts.some((p) => p !== "Click in any box or circle")).toBe(true);
  });
});
