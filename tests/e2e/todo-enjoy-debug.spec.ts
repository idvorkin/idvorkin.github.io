import { expect, test } from "@playwright/test";

test.describe("Todo enjoy debug", () => {
  test("Check console logs and debug sunburst initialization", async ({ page }) => {
    // Capture console logs
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Print all console logs
    console.log("\n📋 All console logs from page:");
    consoleLogs.forEach((log) => console.log(log));

    // Check if plot element exists and has the on method
    const plotInfo = await page.evaluate(() => {
      const plot = document.getElementById("sunburst");
      return {
        exists: !!plot,
        hasOnMethod: plot ? typeof (plot as any).on === "function" : false,
        hasData: plot ? !!(plot as any).data : false,
        hasLayout: plot ? !!(plot as any).layout : false,
        plotlyVersion: (window as any).Plotly ? (window as any).Plotly.version : "not found",
      };
    });

    console.log("\n🔍 Plot element info:", plotInfo);

    // Try clicking and check for any errors
    const pathElements = page.locator("#sunburst path");
    if ((await pathElements.count()) > 0) {
      console.log("\n🎯 Clicking first path element...");
      await pathElements.first().click({ force: true });
      await page.waitForTimeout(1000);

      // Check console for new logs after click
      const newLogs = consoleLogs.slice(-5);
      console.log("\n📋 Console logs after click:");
      newLogs.forEach((log) => console.log(log));
    }

    expect(true).toBe(true); // This test is just for debugging
  });
});
