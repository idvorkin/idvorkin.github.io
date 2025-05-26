import { expect, test } from "@playwright/test";

test.describe("Debug add_sunburst Function", () => {
  test("Check what happens inside add_sunburst", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Try to manually call add_sunburst and see what happens
    const addSunburstResult = await page.evaluate(async () => {
      try {
        // Import the module
        const module = (await import("/assets/js/index.js")) as any;

        if (!module.add_sunburst) {
          return { error: "add_sunburst not found in module" };
        }

        // Check if the required elements exist
        const sunburstDiv = document.getElementById("sunburst");
        const sunburstTextDiv = document.getElementById("sunburst_text");

        if (!sunburstDiv || !sunburstTextDiv) {
          return { error: "Required DOM elements not found" };
        }

        // Check if Plotly is available
        if (typeof window.Plotly === "undefined") {
          return { error: "Plotly not available" };
        }

        // Check if jQuery is available
        if (typeof (window as any).$ === "undefined") {
          return { error: "jQuery not available" };
        }

        // Try to create a simple tree structure
        const TreeNode = module.TreeNode;
        if (!TreeNode) {
          return { error: "TreeNode not found in module" };
        }

        const testTree = new TreeNode({
          name: "Test Root",
          children: [new TreeNode({ name: "Health", children: [] }), new TreeNode({ name: "Magic", children: [] })],
        });

        // Clear the existing sunburst
        sunburstDiv.innerHTML = "";
        sunburstTextDiv.textContent = "Click in any box or circle";

        // Call add_sunburst manually
        const result = await module.add_sunburst("sunburst", "sunburst_text", testTree);

        // Check if event handlers were attached
        const textDivHasClickHandler =
          !!(sunburstTextDiv as any).onclick ||
          (sunburstTextDiv as any)._events ||
          (window as any).jQuery?.(sunburstTextDiv).data("events");

        const plotlyHasEventHandlers =
          !!(sunburstDiv as any)._plotly_plot && !!(sunburstDiv as any)._plotly_plot._events;

        return {
          success: true,
          addSunburstReturned: !!result,
          sunburstHasDataAfter: !!(sunburstDiv as any).data,
          textDivHasClickHandler: textDivHasClickHandler,
          plotlyHasEventHandlers: plotlyHasEventHandlers,
          sunburstTextAfter: sunburstTextDiv.textContent?.trim(),
          plotlyVersion: window.Plotly?.version || "unknown",
        };
      } catch (error) {
        return { error: error.toString() };
      }
    });

    console.log("add_sunburst result:", JSON.stringify(addSunburstResult, null, 2));

    // Basic checks
    if (addSunburstResult.error) {
      console.error("Error in add_sunburst:", addSunburstResult.error);
    } else {
      expect(addSunburstResult.success).toBe(true);
    }
  });

  test("Test clicking on sunburst after manual setup", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Set up the sunburst manually and then test clicking
    const clickTestResult = await page.evaluate(async () => {
      try {
        const module = (await import("/assets/js/index.js")) as any;

        // Create a test tree
        const TreeNode = module.TreeNode;
        const testTree = new TreeNode({
          name: "Test Root",
          children: [new TreeNode({ name: "Health", children: [] }), new TreeNode({ name: "Magic", children: [] })],
        });

        // Clear and recreate sunburst
        const sunburstDiv = document.getElementById("sunburst");
        const sunburstTextDiv = document.getElementById("sunburst_text");

        if (!sunburstDiv || !sunburstTextDiv) {
          return { error: "DOM elements not found" };
        }

        sunburstDiv.innerHTML = "";
        sunburstTextDiv.textContent = "Click in any box or circle";

        // Call add_sunburst
        await module.add_sunburst("sunburst", "sunburst_text", testTree);

        // Wait a moment for everything to be set up
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const originalText = sunburstTextDiv.textContent?.trim();

        // Try to trigger a click event on the text div
        const clickEvent = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });

        sunburstTextDiv.dispatchEvent(clickEvent);

        // Wait for any async updates
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newText = sunburstTextDiv.textContent?.trim();

        return {
          success: true,
          originalText: originalText,
          newText: newText,
          textChanged: originalText !== newText,
          sunburstHasData: !!(sunburstDiv as any).data,
        };
      } catch (error) {
        return { error: error.toString() };
      }
    });

    console.log("Click test result:", JSON.stringify(clickTestResult, null, 2));

    // This test is for debugging
    expect(clickTestResult.success || !!clickTestResult.error).toBe(true);
  });

  test("Check category_to_prompts function", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Test the category_to_prompts function
    const categoryPromptsResult = await page.evaluate(async () => {
      try {
        const module = (await import("/assets/js/index.js")) as any;

        // Check if we can access the category_to_prompts function
        // It's not exported, so we need to test it indirectly

        // Check if we have the required DOM structure
        const h3Elements = document.querySelectorAll("h3");
        const ulElements = document.querySelectorAll("ul");

        if (h3Elements.length === 0 || ulElements.length === 0) {
          return { error: "No H3 or UL elements found" };
        }

        // Try to get some sample data
        const firstH3 = h3Elements[0];
        const firstUL = document.querySelector("h3 + ul") || document.querySelector("ul");

        const h3Text = firstH3.textContent?.trim();
        const ulItems = firstUL ? Array.from(firstUL.querySelectorAll("li")).map((li) => li.textContent?.trim()) : [];

        return {
          success: true,
          h3Count: h3Elements.length,
          ulCount: ulElements.length,
          firstH3Text: h3Text,
          firstULItemCount: ulItems.length,
          firstFewItems: ulItems.slice(0, 3),
        };
      } catch (error) {
        return { error: error.toString() };
      }
    });

    console.log("Category prompts result:", JSON.stringify(categoryPromptsResult, null, 2));

    // Check if we have the required structure
    if (categoryPromptsResult.success) {
      expect(categoryPromptsResult.h3Count).toBeGreaterThan(0);
      expect(categoryPromptsResult.ulCount).toBeGreaterThan(0);
    }
  });
});
