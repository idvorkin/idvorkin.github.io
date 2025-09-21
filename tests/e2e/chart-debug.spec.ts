import { expect, test } from "@playwright/test";

test.describe("Chart Debug Page", () => {
  test.beforeEach(async ({ page }) => {
    // Set up console log capture for debugging
    page.on("console", (msg) => {
      console.log(`PAGE LOG: ${msg.text()}`);
    });
  });

  test("debug chart opens and closes with ESC", async ({ page }) => {
    // Navigate to the debug page
    await page.goto("/chart-debug.html");

    // Wait for page to fully load and scripts to run
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000); // Give extra time for Chart.js and our script to run

    // Check that Chart.js chart exists
    const chartCanvas = await page.locator("#debug-chart").first();
    await expect(chartCanvas).toBeVisible();

    // Click the chart to open zoom modal
    console.log("Clicking chart to open zoom modal...");
    await chartCanvas.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check that modal is present
    const modal = page.locator(".chart-zoom-modal").first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    console.log("✅ Chart zoom modal opened");

    // Press ESC to close
    console.log("Pressing ESC to close modal...");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
    console.log("✅ Modal closed with ESC key");
  });

  test("debug modal canvas content and dimensions", async ({ page }) => {
    // Navigate to the activation page (has real charts)
    await page.goto("/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3500); // Wait for deferred charts

    // Find and click the first chart
    const firstChart = page.locator("canvas").first();
    await expect(firstChart).toBeVisible();
    await firstChart.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);
    const modal = page.locator(".chart-zoom-modal").first();
    await expect(modal).toBeVisible();

    // Check modal canvas properties
    const modalCanvas = modal.locator("canvas");
    await expect(modalCanvas).toBeVisible();

    // Get canvas dimensions and style
    const canvasBox = await modalCanvas.boundingBox();
    const canvasStyle = await modalCanvas.getAttribute("style");

    console.log("Canvas bounding box:", canvasBox);
    console.log("Canvas style:", canvasStyle);

    // Check if canvas has actual dimensions
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);

    // Check if canvas style includes our fixed dimensions
    expect(canvasStyle).toContain("width: 800px");
    expect(canvasStyle).toContain("height: 400px");

    // Take a screenshot of the modal for visual debugging
    await modal.screenshot({ path: "/home/developer/gits/idvorkin.github.io/repo_tmp/modal-debug.png" });

    console.log("Modal screenshot saved to repo_tmp/modal-debug.png");
  });
});