/**
 * Chart Zoom functionality for Chart.js charts
 * Makes charts display at half size by default and clickable to zoom to full screen with full interactivity
 */

// Constants for retry logic
const MAX_RETRY_ATTEMPTS = 50;
const RETRY_DELAY_MS = 100;
const MAX_RETRY_TIME_MS = MAX_RETRY_ATTEMPTS * RETRY_DELAY_MS;

declare global {
  interface Window {
    Chart: any;
  }
}

interface ChartZoomState {
  originalChart: any;
  modalChart: any;
  originalCanvas: HTMLCanvasElement;
  modalCanvas: HTMLCanvasElement;
  modalContainer: HTMLElement;
}

let activeZoomState: ChartZoomState | null = null;

export function enableChartZoom(retryCount = 0) {
  // Skip if running in test environment without DOM
  if (typeof document === "undefined") {
    return;
  }

  console.log("📊 Enabling chart zoom functionality");

  // Wait for Chart.js to be available with retry limit
  if (typeof window.Chart === "undefined") {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      console.warn(
        `⚠️ Chart.js not found, retrying in ${RETRY_DELAY_MS}ms (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`,
      );
      setTimeout(() => enableChartZoom(retryCount + 1), RETRY_DELAY_MS);
      return;
    }
    console.log("ℹ️ Chart.js not found, skipping chart zoom initialization");
    return;
  }

  // Find all canvas elements that might be Chart.js charts
  const canvases = document.querySelectorAll("canvas");
  console.log(`🔍 Found ${canvases.length} canvas elements to check`);

  let processedCount = 0;

  canvases.forEach((canvas, index) => {
    // Check if this canvas has a Chart.js instance
    const chart = window.Chart.getChart(canvas);
    if (!chart) {
      console.log(`⏭️ Skipping canvas ${index + 1} - no Chart.js instance found`);
      return;
    }

    console.log(`📈 Processing Chart.js chart ${index + 1}: ${canvas.id || 'unnamed'}`);

    // Apply half-size styling to the canvas
    applyHalfSizeStyles(canvas);

    // Add click handler for zoom functionality
    canvas.style.cursor = "pointer";
    canvas.addEventListener("click", () => openChartModal(chart, canvas));

    // Add hover effects
    canvas.addEventListener("mouseenter", () => {
      canvas.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
      canvas.style.transform = "scale(1.02)";
      canvas.style.transition = "all 0.2s ease";
    });

    canvas.addEventListener("mouseleave", () => {
      canvas.style.boxShadow = "none";
      canvas.style.transform = "scale(1)";
    });

    processedCount++;
    console.log(
      `✅ Processed chart ${index + 1}: ${canvas.id || 'unnamed'} - now clickable for zoom`,
    );
  });

  if (processedCount > 0) {
    console.log(`🎉 Chart zoom enabled for ${processedCount} charts`);
  } else {
    console.log("ℹ️ No Chart.js charts found to process");
  }
}

function applyHalfSizeStyles(canvas: HTMLCanvasElement) {
  // Apply responsive half-size styling
  canvas.style.width = "50%";
  canvas.style.maxWidth = "400px";
  canvas.style.height = "auto";
  canvas.style.borderRadius = "4px";
  canvas.style.border = "1px solid #e0e0e0";
}

function openChartModal(originalChart: any, originalCanvas: HTMLCanvasElement) {
  console.log("🔍 Opening chart zoom modal");

  // Prevent multiple modals from opening
  if (activeZoomState) {
    console.log("⚠️ Modal already open, ignoring click");
    return;
  }

  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.className = "chart-zoom-modal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    box-sizing: border-box;
  `;

  // Create modal content container
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `;

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    z-index: 10000;
  `;
  closeButton.addEventListener("click", closeChartModal);

  // Create canvas for the zoomed chart
  const modalCanvas = document.createElement("canvas");
  modalCanvas.style.cssText = `
    width: 100%;
    max-width: 800px;
    height: auto;
    display: block;
  `;

  // Assemble modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalCanvas);
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);

  // Clone the chart configuration and create new chart instance in modal
  const config = JSON.parse(JSON.stringify(originalChart.config));

  // Ensure the modal chart is responsive and full-size
  if (!config.options) config.options = {};
  if (!config.options.responsive) config.options.responsive = true;
  if (!config.options.maintainAspectRatio) config.options.maintainAspectRatio = true;

  // Create new Chart.js instance in modal
  const modalChart = new window.Chart(modalCanvas, config);

  // Store state for cleanup
  activeZoomState = {
    originalChart,
    modalChart,
    originalCanvas,
    modalCanvas,
    modalContainer
  };

  // Add event listeners for closing modal
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeChartModal();
    }
  });

  document.addEventListener("keydown", handleModalKeydown);

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  console.log("✅ Chart zoom modal opened");
}

function closeChartModal() {
  if (!activeZoomState) return;

  console.log("🔍 Closing chart zoom modal");

  // Destroy modal chart
  if (activeZoomState.modalChart) {
    activeZoomState.modalChart.destroy();
  }

  // Remove modal from DOM
  if (activeZoomState.modalContainer) {
    activeZoomState.modalContainer.remove();
  }

  // Remove event listener
  document.removeEventListener("keydown", handleModalKeydown);

  // Restore body scroll
  document.body.style.overflow = "";

  // Clear state
  activeZoomState = null;

  console.log("✅ Chart zoom modal closed");
}

function handleModalKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeChartModal();
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Wait a bit for Chart.js to initialize any charts
      setTimeout(() => enableChartZoom(), 1000);
    });
  } else {
    // DOM already loaded, wait for charts to be created
    setTimeout(() => enableChartZoom(), 1000);
  }
}