/**
 * Chart Zoom functionality for Chart.js charts
 * Makes charts display at half size by default and clickable to zoom to full screen with full interactivity
 */

// Constants for retry logic
const MAX_RETRY_ATTEMPTS = 50;
const RETRY_DELAY_MS = 100;
const MAX_RETRY_TIME_MS = MAX_RETRY_ATTEMPTS * RETRY_DELAY_MS;

// Chart.js TypeScript definitions
interface ChartInstance {
  config: any;
  destroy(): void;
  update(): void;
  resize(): void;
}

interface ChartConstructor {
  getChart(canvas: HTMLCanvasElement): ChartInstance | null;
  new(canvas: HTMLCanvasElement, config: any): ChartInstance;
}

declare global {
  interface Window {
    Chart: ChartConstructor;
  }
}

interface ChartZoomState {
  originalChart: ChartInstance;
  modalChart: ChartInstance;
  originalCanvas: HTMLCanvasElement;
  modalCanvas: HTMLCanvasElement;
  modalContainer: HTMLElement;
}

let activeZoomState: ChartZoomState | null = null;
let processedCanvases = new WeakSet<HTMLCanvasElement>();

// Reset function for testing purposes
export function resetChartZoomState() {
  // Clear the WeakSet by creating a new instance (WeakSet doesn't have clear method)
  processedCanvases = new WeakSet<HTMLCanvasElement>();
  activeZoomState = null;
}

/**
 * Deep clone chart configuration while preserving function references
 * This ensures tooltips, event handlers, and other callbacks remain functional
 */
function deepCloneConfig(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (typeof obj === "function") return obj; // Preserve functions
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(deepCloneConfig);

  const cloned: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepCloneConfig(obj[key]);
    }
  }
  return cloned;
}

export function enableChartZoom(retryCount = 0) {
  // Skip if running in test environment without DOM
  if (typeof document === "undefined") {
    return;
  }

  console.log("📊 Enabling chart zoom functionality");

  // Don't interfere with chart zoom if modal is already open
  if (activeZoomState) {
    console.log("⚠️ Modal is open, skipping chart zoom reinitialization");
    return;
  }

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

  // Find all canvas elements (we'll filter for Chart.js instances)
  const canvases = document.querySelectorAll("canvas");
  console.log(`🔍 Found ${canvases.length} canvas elements marked for chart zoom`);

  let processedCount = 0;

  canvases.forEach((element, index) => {
    const canvas = element as HTMLCanvasElement;

    // Skip if already processed
    if (processedCanvases.has(canvas)) {
      return;
    }

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

    // Mark this canvas as processed
    processedCanvases.add(canvas);

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
  // Apply responsive half-size styling with text wrapping using cssText for better performance
  canvas.style.cssText = `
    width: 50%;
    max-width: 400px;
    height: 200px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    float: right;
    margin: 10px 0 20px 20px;
    z-index: 1000;
    position: relative;
    clear: right;
    pointer-events: auto;
    cursor: pointer;
  `;

  // Ensure the parent container allows the canvas to float properly
  const parent = canvas.parentElement;
  if (parent) {
    parent.style.position = "relative";
  }
}

function openChartModal(originalChart: ChartInstance, originalCanvas: HTMLCanvasElement) {
  console.log("🔍 Opening chart zoom modal");

  // Prevent multiple modals from opening
  if (activeZoomState) {
    console.log("⚠️ Modal already open, ignoring click");
    return;
  }

  console.log("📊 Original chart config:", originalChart.config);
  console.log("📊 Original chart config keys:", Object.keys(originalChart.config));
  console.log("📊 Original chart data:", originalChart.config.data);
  console.log("📊 Original chart type:", originalChart.config.type);
  console.log("📊 Original canvas dimensions:", originalCanvas.width, "x", originalCanvas.height);

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
  console.log("✅ Modal container created");

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
  console.log("✅ Modal content container created");

  // Create canvas for the zoomed chart
  const modalCanvas = document.createElement("canvas");
  modalCanvas.style.cssText = `
    width: 800px;
    height: 400px;
    max-width: 90vw;
    max-height: 60vh;
    display: block;
  `;
  console.log("✅ Modal canvas created");

  // Assemble modal
  modalContent.appendChild(modalCanvas);
  console.log("✅ Canvas added to modal content");
  modalContainer.appendChild(modalContent);
  console.log("✅ Modal content added to modal container");
  document.body.appendChild(modalContainer);
  console.log("✅ Modal container added to body");

  // Create a proper Chart.js configuration by extracting the chart's current state
  console.log("📊 Starting config construction...");
  let config: any;
  try {
    // Extract the actual chart configuration
    const originalConfig = originalChart.config;

    config = {
      type: originalConfig.type,
      data: originalConfig.data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // Copy over any original options while ensuring responsiveness
        ...(originalConfig.options || {})
      }
    };

    console.log("✅ Chart config constructed successfully");
    console.log("📊 Config type:", config.type);
    console.log("📊 Data keys:", Object.keys(config.data || {}));
    console.log("📊 Options keys:", Object.keys(config.options || {}));
  } catch (error) {
    console.error("❌ Error constructing config:", error);
    console.log("📊 Falling back to simple config copy");
    try {
      config = JSON.parse(JSON.stringify(originalChart.config));
      console.log("✅ Fallback config created");
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
      // Create a minimal working config
      config = {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { responsive: true, maintainAspectRatio: true }
      };
      console.log("📊 Using minimal config");
    }
  }

  console.log("📊 About to create Chart.js instance...");

  // Create new Chart.js instance in modal
  let modalChart: ChartInstance;
  try {
    modalChart = new window.Chart(modalCanvas, config);
    console.log("✅ Modal chart created successfully:", modalChart);

    // Force the chart to render and update
    modalChart.update();
    modalChart.resize();
    console.log("✅ Modal chart updated and resized");
  } catch (error) {
    console.error("❌ Error creating modal chart:", error);
    console.log("📊 modalCanvas:", modalCanvas);
    console.log("📊 config:", config);
    return; // Exit if chart creation fails
  }

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
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
  console.log("✅ Close button created");

  // Add close button to modal
  modalContent.appendChild(closeButton);
  console.log("✅ Close button added to modal content");

  // Create local close function with access to modal elements
  const closeModal = () => {
    console.log("🔍 Closing chart zoom modal");

    // Destroy modal chart
    if (modalChart) {
      try {
        modalChart.destroy();
      } catch (e) {
        console.warn("Error destroying modal chart:", e);
      }
    }

    // Remove event listeners
    document.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("orientationchange", resizeHandler);

    // Remove modal from DOM
    if (modalContainer && modalContainer.parentNode) {
      try {
        modalContainer.parentNode.removeChild(modalContainer);
      } catch (e) {
        console.warn("Error removing modal container:", e);
      }
    }

    // Restore body scroll
    document.body.style.overflow = "";

    // Clear global state
    activeZoomState = null;

    console.log("✅ Chart zoom modal closed");
  };

  // Event handler for keyboard (defined after closeModal)
  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    }
  };

  // Event handler for window resize and orientation changes
  const resizeHandler = () => {
    console.log("📱 Window resize/orientation change detected, updating modal chart");

    // Update modal canvas dimensions for new viewport
    const maxWidth = Math.min(800, window.innerWidth * 0.9);
    const maxHeight = Math.min(400, window.innerHeight * 0.6);

    modalCanvas.style.width = `${maxWidth}px`;
    modalCanvas.style.height = `${maxHeight}px`;

    // Tell Chart.js to resize and redraw
    if (modalChart) {
      try {
        modalChart.resize();
        console.log("✅ Modal chart resized for new viewport");
      } catch (e) {
        console.warn("Error resizing modal chart:", e);
      }
    }
  };

  // Store state for cleanup
  activeZoomState = {
    originalChart,
    modalChart,
    originalCanvas,
    modalCanvas,
    modalContainer
  };

  // Add event listeners using the local close function
  closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  });

  document.addEventListener("keydown", keydownHandler);

  // Add resize and orientation change listeners
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", resizeHandler);

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  console.log("✅ Chart zoom modal opened");
}

// Removed duplicate closeChartModal and handleModalKeydown functions - using the local closeModal and keydownHandler inside openChartModal instead

// Re-check for charts that are created with defer()
// These charts are created after the initial DOM load
if (typeof document !== "undefined") {
  // Check for new charts periodically
  let checksRemaining = 3;

  const checkForDeferredCharts = () => {
    if (checksRemaining <= 0) return;
    checksRemaining--;

    enableChartZoom();

    if (checksRemaining > 0) {
      setTimeout(checkForDeferredCharts, 2000);
    }
  };

  // Start checking after a delay to catch defer() wrapped charts
  if (document.readyState === "complete") {
    setTimeout(checkForDeferredCharts, 1500);
  } else {
    window.addEventListener("load", () => {
      setTimeout(checkForDeferredCharts, 1500);
    });
  }
}