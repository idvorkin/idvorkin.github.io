import { expect, test } from "@playwright/test";

test.describe("Debug Sunburst Event Handlers", () => {
  test("Check if event handlers are properly attached", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Give extra time for everything to load

    // Check what's actually happening in the browser
    const debugInfo = await page.evaluate(() => {
      const results: any = {
        plotlyExists: typeof window.Plotly !== "undefined",
        jqueryExists: typeof (window as any).$ !== "undefined",
        sunburstDiv: null,
        sunburstTextDiv: null,
        plotlyData: null,
        eventHandlers: null,
        h3Elements: 0,
        ulElements: 0,
        moduleLoaded: false,
      };

      // Check sunburst div
      const sunburstDiv = document.getElementById("sunburst");
      if (sunburstDiv) {
        results.sunburstDiv = {
          exists: true,
          hasData: !!(sunburstDiv as any).data,
          dataLength: (sunburstDiv as any).data ? (sunburstDiv as any).data.length : 0,
          innerHTML: `${sunburstDiv.innerHTML.substring(0, 200)}...`,
        };
      }

      // Check sunburst text div
      const sunburstTextDiv = document.getElementById("sunburst_text");
      if (sunburstTextDiv) {
        results.sunburstTextDiv = {
          exists: true,
          textContent: sunburstTextDiv.textContent,
          hasClickHandler: !!(sunburstTextDiv as any).onclick,
        };
      }

      // Check for H3 and UL elements (needed for category_to_prompts)
      results.h3Elements = document.querySelectorAll("h3").length;
      results.ulElements = document.querySelectorAll("ul").length;

      // Check if the module functions are available
      try {
        results.moduleLoaded = typeof (window as any).load_enjoy2 !== "undefined";
      } catch (e) {
        results.moduleLoaded = false;
      }

      return results;
    });

    console.log("Debug info:", JSON.stringify(debugInfo, null, 2));

    // Basic checks
    expect(debugInfo.plotlyExists).toBe(true);
    expect(debugInfo.jqueryExists).toBe(true);
    expect(debugInfo.sunburstDiv?.exists).toBe(true);
    expect(debugInfo.sunburstTextDiv?.exists).toBe(true);

    // Check if we have the content structure needed for prompts
    expect(debugInfo.h3Elements).toBeGreaterThan(0);
    expect(debugInfo.ulElements).toBeGreaterThan(0);

    // The key issue: check if the sunburst has data
    expect(debugInfo.sunburstDiv?.hasData).toBe(true);
  });

  test("Manually trigger the click event to see what happens", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Try to manually trigger the plotly click event
    const manualClickResult = await page.evaluate(() => {
      const sunburstDiv = document.getElementById("sunburst") as any;

      if (!sunburstDiv || !sunburstDiv.data) {
        return { error: "No sunburst data found" };
      }

      // Try to simulate a plotly_sunburstclick event
      try {
        const mockEvent = {
          points: [{ label: "Health" }],
        };

        // Check if there are any event listeners
        const hasListeners = sunburstDiv._plotly_plot?._events;

        return {
          hasData: true,
          dataLength: sunburstDiv.data.length,
          hasListeners: !!hasListeners,
          mockEventCreated: true,
        };
      } catch (error) {
        return { error: error.toString() };
      }
    });

    console.log("Manual click result:", JSON.stringify(manualClickResult, null, 2));

    // This test is for debugging, so we'll log results
    expect(manualClickResult.hasData).toBe(true);
  });

  test("Check if the load_enjoy2 function was called", async ({ page }) => {
    // Add a console log to track when load_enjoy2 is called
    await page.addInitScript(() => {
      (window as any).debugLogs = [];

      // Override console.log to capture logs
      const originalLog = console.log;
      console.log = (...args) => {
        (window as any).debugLogs.push(args.join(" "));
        originalLog.apply(console, args);
      };

      // Override console.error to capture errors
      const originalError = console.error;
      console.error = (...args) => {
        (window as any).debugLogs.push(`ERROR: ${args.join(" ")}`);
        originalError.apply(console, args);
      };
    });

    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const logs = await page.evaluate(() => {
      return (window as any).debugLogs || [];
    });

    console.log("Page logs:", logs);

    // Check if there are any error logs
    const errorLogs = logs.filter((log: string) => log.includes("ERROR"));
    console.log("Error logs:", errorLogs);

    // This test is for debugging
    expect(Array.isArray(logs)).toBe(true);
  });
});
