import { expect, test } from "@playwright/test";

test.describe("Chart Zoom Functionality", () => {
  test("charts should be clickable and open in lightbox", async ({ page }) => {
    // Go to the activation page which has Chart.js charts
    await page.goto("http://localhost:4000/activation");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500); // Give extra time for Chart.js and our script to run

    // Log console messages
    page.on("console", (msg) => {
      if (msg.text().includes("Chart zoom") || msg.text().includes("chart")) {
        console.log("🔍 Console:", msg.text());
      }
    });

    // Check for canvas elements
    const canvases = await page.locator("canvas").all();
    console.log(`Found ${canvases.length} canvas elements`);

    expect(canvases.length).toBeGreaterThan(0);

    // Get the first canvas (should be the starting-energy chart)
    const firstCanvas = canvases[0];
    const canvasId = await firstCanvas.getAttribute("id");
    console.log(`Testing with canvas: ${canvasId}`);

    // Check if canvas has zoom enabled
    const hasZoomEnabled = await firstCanvas.getAttribute(
      "data-chart-zoom-enabled",
    );
    console.log(`Canvas has zoom enabled: ${hasZoomEnabled === "true"}`);

    // Check if cursor is pointer
    const cursor = await firstCanvas.evaluate((el) =>
      window.getComputedStyle(el).cursor,
    );
    console.log(`Canvas cursor style: ${cursor}`);

    expect(cursor).toBe("pointer");

    // Try clicking the canvas
    console.log("Attempting to click canvas...");
    await firstCanvas.click();

    // Wait for lightbox to open
    await page.waitForTimeout(500);

    // Check for lightbox elements
    const hasGlightboxOpen =
      (await page.locator("body.glightbox-open").count()) > 0;
    const hasGlightboxContainer =
      (await page.locator(".glightbox-container").count()) > 0;
    const hasGlightboxSlider = (await page.locator(".gslider").count()) > 0;

    console.log("Lightbox state:");
    console.log(`  - Body has glightbox-open class: ${hasGlightboxOpen}`);
    console.log(`  - Glightbox container present: ${hasGlightboxContainer}`);
    console.log(`  - Glightbox slider present: ${hasGlightboxSlider}`);

    expect(hasGlightboxContainer).toBe(true);

    if (hasGlightboxContainer) {
      console.log("✅ Lightbox opened successfully!");

      // Check if there's an image in the lightbox (the canvas snapshot)
      const lightboxImage = await page.locator(".glightbox-container img").first();
      const imageSrc = await lightboxImage.getAttribute("src");
      console.log(`Lightbox image source starts with: ${imageSrc?.substring(0, 20)}`);

      expect(imageSrc).toContain("data:image/png");

      // Close lightbox
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      const stillOpen = (await page.locator(".glightbox-container").count()) > 0;
      console.log(`Lightbox closed after ESC: ${!stillOpen}`);
      expect(stillOpen).toBe(false);
    }
  });

  test("multiple charts should all be clickable", async ({ page }) => {
    await page.goto("http://localhost:4000/activation");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    // Get all canvases
    const canvases = await page.locator("canvas").all();
    console.log(`Testing ${canvases.length} canvas elements`);

    // Check that all canvases have zoom enabled
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const canvasId = await canvas.getAttribute("id");
      const hasZoom = await canvas.getAttribute("data-chart-zoom-enabled");
      const cursor = await canvas.evaluate((el) =>
        window.getComputedStyle(el).cursor,
      );

      console.log(
        `Canvas ${i + 1} (${canvasId}): zoom=${hasZoom}, cursor=${cursor}`,
      );

      expect(hasZoom).toBe("true");
      expect(cursor).toBe("pointer");
    }
  });

  test("verify chart-zoom script is loaded", async ({ page }) => {
    await page.goto("http://localhost:4000/activation");

    // Check if our code exists in the page
    const hasChartZoomFunction = await page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      return scripts.some(
        (script) =>
          script.src.includes("index.js") ||
          script.textContent?.includes("Enabling chart zoom"),
      );
    });

    console.log(`Chart zoom code present in page: ${hasChartZoomFunction}`);

    // Check the compiled JS file
    const jsResponse = await page.goto("http://localhost:4000/assets/js/index.js");
    const jsContent = await jsResponse?.text() || "";
    const hasChartZoomInBundle =
      jsContent.includes("chart zoom") || jsContent.includes("enableChartZoom");
    console.log(`Chart zoom code in bundle: ${hasChartZoomInBundle}`);

    expect(hasChartZoomInBundle).toBe(true);
  });
});
