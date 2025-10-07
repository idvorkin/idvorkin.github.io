/**
 * Chart Zoom functionality for Chart.js charts
 * Enables clicking on charts to view them in a GLightbox lightbox
 */

// Constants for retry logic
const MAX_RETRY_ATTEMPTS = 50;
const RETRY_DELAY_MS = 100;
const MAX_RETRY_TIME_MS = MAX_RETRY_ATTEMPTS * RETRY_DELAY_MS;

declare global {
  interface Window {
    GLightbox: any;
  }
}

export function enableChartZoom(retryCount = 0) {
  // Skip if running in test environment without DOM
  if (typeof document === "undefined") {
    return;
  }

  console.log("📊 Enabling chart zoom functionality");

  // Wait for GLightbox to be available with retry limit
  if (typeof window.GLightbox === "undefined") {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      console.warn(
        `⚠️ GLightbox not found for charts, retrying in ${RETRY_DELAY_MS}ms (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`,
      );
      setTimeout(() => enableChartZoom(retryCount + 1), RETRY_DELAY_MS);
      return;
    }
    console.error(
      `❌ GLightbox failed to load after ${MAX_RETRY_TIME_MS / 1000} seconds, aborting chart zoom initialization`,
    );
    return;
  }

  // Find all canvas elements that might be Chart.js charts
  const canvases = document.querySelectorAll("canvas");
  console.log(`🔍 Found ${canvases.length} canvas elements to process`);

  let processedCount = 0;

  canvases.forEach((canvas, index) => {
    const canvasElement = canvas as HTMLCanvasElement;

    // Skip if already has zoom functionality
    if (canvasElement.hasAttribute("data-chart-zoom-enabled")) {
      console.log(`⏭️ Skipping canvas ${index + 1} - already has zoom`);
      return;
    }

    // Skip tiny canvases (likely not charts)
    if (canvasElement.width < 100 || canvasElement.height < 100) {
      console.log(
        `⏭️ Skipping canvas ${index + 1} - too small (${canvasElement.width}x${canvasElement.height})`,
      );
      return;
    }

    // Add click handler to open chart in lightbox
    canvasElement.style.cursor = "pointer";
    canvasElement.setAttribute("data-chart-zoom-enabled", "true");

    canvasElement.addEventListener("click", () => {
      console.log(`📊 Opening chart ${index + 1} in lightbox`);

      // Convert canvas to data URL
      const dataUrl = canvasElement.toDataURL("image/png");

      // Get canvas ID for description
      const canvasId = canvasElement.id || `chart-${index + 1}`;

      // Create a temporary GLightbox instance for this chart
      const chartLightbox = window.GLightbox({
        elements: [
          {
            href: dataUrl,
            type: "image",
            title: canvasId.replace(/-/g, " ").replace(/chart /i, "Chart: "),
          },
        ],
        touchNavigation: true,
        loop: false,
        autoplayVideos: false,
      });

      // Open the lightbox
      chartLightbox.open();
    });

    processedCount++;
    console.log(
      `✅ Enabled zoom for canvas ${index + 1}: ${canvasElement.id || "unnamed"}`,
    );
  });

  if (processedCount > 0) {
    console.log(`🎉 Chart zoom enabled for ${processedCount} charts`);
  } else {
    console.log("ℹ️ No charts found to enable zoom on");
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => enableChartZoom());
  } else {
    // DOM already loaded, but wait for Chart.js to render charts
    setTimeout(() => enableChartZoom(), 1000);
  }
}
