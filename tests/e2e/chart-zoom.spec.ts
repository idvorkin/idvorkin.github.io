import { expect, test } from "@playwright/test";

test.describe("Chart Zoom Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Set up console log capture for debugging
    page.on("console", (msg) => {
      if (msg.text().includes("chart zoom") || msg.text().includes("Chart")) {
        console.log(`PAGE LOG: ${msg.text()}`);
      }
    });
  });

  test("activation page charts are half size and clickable", async ({ page }) => {
    // Navigate to the activation page
    await page.goto("/activation");

    // Wait for page to fully load and scripts to run
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Give extra time for Chart.js and our script to run

    // Check that Chart.js charts exist
    const chartCanvases = await page.locator("canvas").count();
    console.log(`Found ${chartCanvases} canvas elements on activation page`);
    expect(chartCanvases).toBeGreaterThan(0);

    // Check that charts have been processed by our chart zoom functionality
    // Look for canvases that have been styled with our half-size CSS
    const canvases = await page.locator("canvas").all();
    let halfSizedCharts = 0;
    let clickableCharts = 0;

    for (const canvas of canvases) {
      const styleAttr = await canvas.getAttribute("style");
      console.log(`Canvas style: ${styleAttr}`);

      if (styleAttr && (styleAttr.includes("max-width: 400px") || styleAttr.includes("width: 50%"))) {
        halfSizedCharts++;
      }
      if (styleAttr && styleAttr.includes("cursor: pointer")) {
        clickableCharts++;
      }
    }

    console.log(`Found ${halfSizedCharts} half-sized charts`);
    console.log(`Found ${clickableCharts} clickable charts`);
    expect(halfSizedCharts).toBeGreaterThan(0);
    expect(clickableCharts).toBeGreaterThan(0);
  });

  test("clicking chart opens zoom modal with interactive chart", async ({ page }) => {
    // Navigate to the activation page
    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Find the first chart canvas
    const firstChart = page.locator("canvas").first();
    await expect(firstChart).toBeVisible();

    // Click the chart to open zoom modal
    console.log("Clicking chart to open zoom modal...");
    await firstChart.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check that modal is present
    const modal = page.locator(".chart-zoom-modal");
    await expect(modal).toBeVisible({ timeout: 5000 });
    console.log("✅ Chart zoom modal opened");

    // Check that modal has correct styling
    const modalStyles = await modal.getAttribute("style");
    expect(modalStyles).toContain("position: fixed");
    expect(modalStyles).toContain("z-index: 9999");

    // Check that modal contains a canvas (the zoomed chart)
    const modalCanvas = modal.locator("canvas");
    await expect(modalCanvas).toBeVisible();
    console.log("✅ Modal contains interactive chart canvas");

    // Check that close button exists
    const closeButton = modal.locator("button");
    await expect(closeButton).toBeVisible();
    console.log("✅ Close button present");
  });

  test("modal can be closed with ESC key", async ({ page }) => {
    // Navigate and open modal
    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const firstChart = page.locator("canvas").first();
    await firstChart.click();
    await page.waitForTimeout(500);

    // Verify modal is open
    const modal = page.locator(".chart-zoom-modal");
    await expect(modal).toBeVisible();

    // Press ESC to close
    console.log("Pressing ESC to close modal...");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
    console.log("✅ Modal closed with ESC key");
  });

  test("modal can be closed with close button", async ({ page }) => {
    // Navigate and open modal
    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const firstChart = page.locator("canvas").first();
    await firstChart.click();
    await page.waitForTimeout(500);

    // Verify modal is open
    const modal = page.locator(".chart-zoom-modal");
    await expect(modal).toBeVisible();

    // Click close button
    const closeButton = modal.locator("button");
    console.log("Clicking close button...");
    await closeButton.click();
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
    console.log("✅ Modal closed with close button");
  });

  test("modal can be closed by clicking outside", async ({ page }) => {
    // Navigate and open modal
    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const firstChart = page.locator("canvas").first();
    await firstChart.click();
    await page.waitForTimeout(500);

    // Verify modal is open
    const modal = page.locator(".chart-zoom-modal");
    await expect(modal).toBeVisible();

    // Click on the modal background (outside the content)
    console.log("Clicking outside modal content...");
    await modal.click({ position: { x: 50, y: 50 } }); // Click near top-left of modal background
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
    console.log("✅ Modal closed by clicking outside");
  });

  test("multiple charts on activation page work independently", async ({ page }) => {
    // Navigate to activation page
    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Get all chart canvases
    const charts = await page.locator("canvas").all();
    console.log(`Testing ${charts.length} charts for independent functionality`);

    expect(charts.length).toBeGreaterThanOrEqual(3); // Activation page should have 3 charts

    // Test each chart can open its own modal
    for (let i = 0; i < Math.min(charts.length, 3); i++) {
      console.log(`Testing chart ${i + 1}...`);

      // Click chart
      await charts[i].click();
      await page.waitForTimeout(500);

      // Verify modal opens
      const modal = page.locator(".chart-zoom-modal");
      await expect(modal).toBeVisible();

      // Close modal with ESC
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      // Verify modal closes
      await expect(modal).not.toBeVisible();

      console.log(`✅ Chart ${i + 1} zoom functionality working`);
    }
  });

  test("chart zoom functionality is responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check that charts are still half-sized on mobile
    const halfSizedCharts = await page.locator('canvas[style*="max-width: 400px"]').count();
    expect(halfSizedCharts).toBeGreaterThan(0);

    // Test that modal works on mobile
    const firstChart = page.locator("canvas").first();
    await firstChart.click();
    await page.waitForTimeout(500);

    const modal = page.locator(".chart-zoom-modal");
    await expect(modal).toBeVisible();

    // Check that modal content fits in mobile viewport
    const modalContent = modal.locator("div").first();
    const boundingBox = await modalContent.boundingBox();
    expect(boundingBox.width).toBeLessThanOrEqual(375);

    console.log("✅ Chart zoom works on mobile viewport");

    // Close modal
    await page.keyboard.press("Escape");
  });

  test("verify chart zoom script is loaded", async ({ page }) => {
    await page.goto("/activation");

    // Check if our chart zoom function exists in the page
    const hasChartZoomFunction = await page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      return scripts.some(
        (script) =>
          script.src.includes("index.js") ||
          script.textContent?.includes("chart zoom") ||
          script.textContent?.includes("enableChartZoom")
      );
    });

    console.log(`Chart zoom code present in page: ${hasChartZoomFunction}`);

    // Check the compiled JS bundle
    const jsResponse = await page.goto("/assets/js/index.js");
    const jsContent = await jsResponse.text();
    const hasChartZoomInBundle =
      jsContent.includes("chart zoom") ||
      jsContent.includes("enableChartZoom") ||
      jsContent.includes("chart-zoom-modal");
    console.log(`Chart zoom code in bundle: ${hasChartZoomInBundle}`);

    expect(hasChartZoomInBundle).toBeTruthy();
  });
});