import { expect, test } from "@playwright/test";

test.describe("Debug load_enjoy2 Function Call", () => {
  test("Check if load_enjoy2 is actually being called", async ({ page }) => {
    // Inject debugging code before the page loads
    await page.addInitScript(() => {
      // Override console.log to capture all logs
      (window as any).debugLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        (window as any).debugLogs.push(`LOG: ${args.join(" ")}`);
        originalLog.apply(console, args);
      };

      const originalError = console.error;
      console.error = (...args) => {
        (window as any).debugLogs.push(`ERROR: ${args.join(" ")}`);
        originalError.apply(console, args);
      };

      // Track function calls
      (window as any).functionCalls = [];

      // Override the module loading to track when load_enjoy2 is called
      const originalImport = (window as any).import;
      if (originalImport) {
        (window as any).import = async (...args) => {
          (window as any).debugLogs.push(`IMPORT: ${args.join(" ")}`);
          return originalImport.apply(window, args);
        };
      }
    });

    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Check what actually happened
    const debugInfo = await page.evaluate(() => {
      return {
        logs: (window as any).debugLogs || [],
        functionCalls: (window as any).functionCalls || [],
        moduleSystemAvailable: typeof (window as any).import !== "undefined",
        plotlyAvailable: typeof window.Plotly !== "undefined",
        jqueryAvailable: typeof (window as any).$ !== "undefined",
        sunburstExists: !!document.getElementById("sunburst"),
        sunburstTextExists: !!document.getElementById("sunburst_text"),
        sunburstHasData: !!(document.getElementById("sunburst") as any)?.data,
        sunburstTextContent: document.getElementById("sunburst_text")?.textContent?.trim(),
        h3Count: document.querySelectorAll("h3").length,
        ulCount: document.querySelectorAll("ul").length,
      };
    });

    console.log("Debug Info:", JSON.stringify(debugInfo, null, 2));

    // Check if the basic requirements are met
    expect(debugInfo.plotlyAvailable).toBe(true);
    expect(debugInfo.jqueryAvailable).toBe(true);
    expect(debugInfo.sunburstExists).toBe(true);
    expect(debugInfo.sunburstTextExists).toBe(true);

    // Check if we have the content structure
    expect(debugInfo.h3Count).toBeGreaterThan(0);
    expect(debugInfo.ulCount).toBeGreaterThan(0);

    // The key test: does the sunburst have data?
    expect(debugInfo.sunburstHasData).toBe(true);
  });

  test("Manually call load_enjoy2 to see what happens", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Try to manually import and call load_enjoy2
    const manualCallResult = await page.evaluate(async () => {
      try {
        // Try to import the module manually
        const module = (await import("/assets/js/index.js")) as any;

        if (module.load_enjoy2) {
          // Call load_enjoy2 manually
          module.load_enjoy2();

          return {
            success: true,
            moduleLoaded: true,
            load_enjoy2Available: true,
            sunburstHasDataAfter: !!(document.getElementById("sunburst") as any)?.data,
            sunburstTextAfter: document.getElementById("sunburst_text")?.textContent?.trim(),
          };
        }
        return {
          success: false,
          moduleLoaded: true,
          load_enjoy2Available: false,
          error: "load_enjoy2 not found in module",
        };
      } catch (error) {
        return {
          success: false,
          moduleLoaded: false,
          error: error.toString(),
        };
      }
    });

    console.log("Manual call result:", JSON.stringify(manualCallResult, null, 2));

    // This test is for debugging, so we'll log results
    expect(manualCallResult.moduleLoaded).toBe(true);
  });

  test("Check if the defer function is working correctly", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check if defer is working by looking at the logs
    const deferInfo = await page.evaluate(() => {
      // Look for defer-related logs in the console
      const logs = (window as any).debugLogs || [];
      const deferLogs = logs.filter((log: string) => log.includes("DOM already ready") || log.includes("defer"));

      return {
        allLogs: logs,
        deferLogs: deferLogs,
        deferWorking: deferLogs.length > 0,
      };
    });

    console.log("Defer info:", JSON.stringify(deferInfo, null, 2));

    // Check if defer is working
    expect(deferInfo.deferWorking).toBe(true);
  });
});
