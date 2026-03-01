import { expect, test } from "./base-test";

test.describe("Vapi Widget on Tesla Page", () => {
  test("should load Vapi widget script and render widget element", async ({ page }) => {
    // Go to the tesla page
    await page.goto("http://localhost:4000/tesla");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Give extra time for JS to run

    // Log console messages for debugging
    page.on("console", (msg) => {
      if (msg.text().includes("vapi") || msg.text().includes("widget")) {
        console.log("🎙️ Console:", msg.text());
      }
    });

    // Check if the Vapi script is loaded
    const hasVapiScript = await page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      return scripts.some((script) => script.src.includes("@vapi-ai/client-sdk-react"));
    });

    console.log(`Vapi script loaded: ${hasVapiScript}`);
    expect(hasVapiScript).toBe(true);

    // Check if the vapi-widget custom element exists in the DOM
    const vapiWidget = page.locator("vapi-widget");
    const widgetCount = await vapiWidget.count();
    console.log(`Vapi widget elements found: ${widgetCount}`);
    expect(widgetCount).toBeGreaterThan(0);

    // Verify widget has the expected attributes
    const publicKey = await vapiWidget.getAttribute("public-key");
    const assistantId = await vapiWidget.getAttribute("assistant-id");
    const mode = await vapiWidget.getAttribute("mode");
    const theme = await vapiWidget.getAttribute("theme");
    const mainLabel = await vapiWidget.getAttribute("main-label");

    console.log("Widget attributes:");
    console.log(`  - public-key: ${publicKey ? "✓ present" : "✗ missing"}`);
    console.log(`  - assistant-id: ${assistantId ? "✓ present" : "✗ missing"}`);
    console.log(`  - mode: ${mode}`);
    console.log(`  - theme: ${theme}`);
    console.log(`  - main-label: ${mainLabel}`);

    expect(publicKey).toBe("49b277de-d508-4062-bec2-503e40915be4");
    expect(assistantId).toBe("f5fe3b31-0ff6-4395-bc08-bc8ebbbf48a6");
    expect(mode).toBe("chat");
    expect(theme).toBe("dark");
    expect(mainLabel).toBe("Talk to Tony");
  });

  test("verify widget has correct styling attributes", async ({ page }) => {
    await page.goto("http://localhost:4000/tesla");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const vapiWidget = page.locator("vapi-widget");

    // Check color attributes
    const baseColor = await vapiWidget.getAttribute("base-color");
    const accentColor = await vapiWidget.getAttribute("accent-color");

    console.log("Widget styling:");
    console.log(`  - base-color: ${baseColor}`);
    console.log(`  - accent-color: ${accentColor}`);

    expect(baseColor).toBe("#2c2c2c");
    expect(accentColor).toBe("#c0392b");
  });

  test("verify widget appears in Talk to Tony section", async ({ page }) => {
    await page.goto("http://localhost:4000/tesla");
    await page.waitForLoadState("networkidle");

    // Check that the section header exists
    const tonyHeader = page.locator("h3:has-text('Talk to Tony')");
    const headerExists = (await tonyHeader.count()) > 0;
    console.log(`"Talk to Tony" header found: ${headerExists}`);
    expect(headerExists).toBe(true);

    // Check that widget is near the header
    const widgetNearHeader = page.locator("h3:has-text('Talk to Tony') ~ vapi-widget");
    const widgetFound = (await widgetNearHeader.count()) > 0;
    console.log(`Widget found after "Talk to Tony" header: ${widgetFound}`);
    expect(widgetFound).toBe(true);
  });
});
