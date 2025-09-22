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

  // Find only canvas elements that already have chart-zoom-enabled class
  const canvases = document.querySelectorAll("canvas.chart-zoom-enabled");
  console.log(`🔍 Found ${canvases.length} canvas elements with chart-zoom-enabled class`);

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

    // Only add interactive behavior - CSS styling is handled by the CSS file
    canvas.style.cursor = 'pointer';
    canvas.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

    // Add hover effects
    const addHoverEffect = () => {
      canvas.style.transform = 'scale(1.02)';
      canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    };

    const removeHoverEffect = () => {
      canvas.style.transform = 'scale(1)';
      canvas.style.boxShadow = 'none';
    };

    canvas.addEventListener('mouseenter', addHoverEffect);
    canvas.addEventListener('mouseleave', removeHoverEffect);

    // Add click handler for zoom functionality
    canvas.addEventListener("click", () => openChartModal(chart, canvas));

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


/**
 * Creates modal DOM structure for chart zoom
 */
function createModalElements(): { modalContainer: HTMLElement; modalContent: HTMLElement; modalCanvas: HTMLCanvasElement; closeButton: HTMLElement } {
  console.log("✅ Creating modal DOM elements");

  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.className = "chart-zoom-modal";
  modalContainer.setAttribute('role', 'dialog');
  modalContainer.setAttribute('aria-modal', 'true');
  modalContainer.setAttribute('aria-labelledby', 'chart-modal-title');
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

  // Create canvas for the zoomed chart
  const modalCanvas = document.createElement("canvas");
  modalCanvas.setAttribute('aria-label', 'Zoomed chart view');
  modalCanvas.style.cssText = `
    width: 800px;
    height: 400px;
    max-width: 90vw;
    max-height: 60vh;
    display: block;
  `;

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.setAttribute('aria-label', 'Close chart zoom modal');
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

  // Assemble modal structure
  modalContent.appendChild(modalCanvas);
  modalContent.appendChild(closeButton);
  modalContainer.appendChild(modalContent);

  return { modalContainer, modalContent, modalCanvas, closeButton };
}

/**
 * Creates Chart.js configuration from original chart
 */
function createChartConfiguration(originalChart: ChartInstance): any {
  console.log("📊 Creating chart configuration");

  try {
    const originalConfig = originalChart.config;
    const config = {
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
    return config;
  } catch (error) {
    console.error("❌ Error constructing config:", error);
    console.log("📊 Falling back to simple config copy");

    try {
      return JSON.parse(JSON.stringify(originalChart.config));
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
      // Create a minimal working config
      return {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { responsive: true, maintainAspectRatio: true }
      };
    }
  }
}

/**
 * Creates and initializes Chart.js instance in modal
 */
function createModalChart(canvas: HTMLCanvasElement, config: any): ChartInstance | null {
  console.log("📊 Creating modal Chart.js instance");

  try {
    const modalChart = new window.Chart(canvas, config);
    console.log("✅ Modal chart created successfully");

    // Force the chart to render and update
    modalChart.update();
    modalChart.resize();
    console.log("✅ Modal chart updated and resized");

    return modalChart;
  } catch (error) {
    console.error("❌ Error creating modal chart:", error);
    return null;
  }
}

/**
 * Sets up event listeners for modal interactions and accessibility
 */
function setupModalEventListeners(
  modalContainer: HTMLElement,
  closeButton: HTMLElement,
  modalCanvas: HTMLCanvasElement,
  modalChart: ChartInstance,
  closeModal: () => void
): () => void {
  console.log("✅ Setting up modal event listeners");

  // Focus management for accessibility
  const previousActiveElement = document.activeElement as HTMLElement;
  closeButton.focus();

  // Event handlers
  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    }
    // Simple focus trap - keep focus within modal
    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  };

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

  // Add event listeners
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
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", resizeHandler);

  // Return cleanup function
  return () => {
    document.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("orientationchange", resizeHandler);

    // Restore focus for accessibility
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  };
}

/**
 * Cleans up modal resources and state
 */
function cleanupModal(
  modalChart: ChartInstance | null,
  modalContainer: HTMLElement,
  cleanupEventListeners: () => void
): void {
  console.log("🔍 Cleaning up chart zoom modal");

  // Destroy modal chart
  if (modalChart) {
    try {
      modalChart.destroy();
    } catch (e) {
      console.warn("Error destroying modal chart:", e);
    }
  }

  // Remove event listeners
  cleanupEventListeners();

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

  console.log("✅ Chart zoom modal cleaned up");
}

/**
 * Opens chart in full-screen modal with zoom functionality
 */
function openChartModal(originalChart: ChartInstance, originalCanvas: HTMLCanvasElement) {
  console.log("🔍 Opening chart zoom modal");

  // Prevent multiple modals from opening
  if (activeZoomState) {
    console.log("⚠️ Modal already open, ignoring click");
    return;
  }

  // Create modal DOM structure
  const { modalContainer, modalContent, modalCanvas, closeButton } = createModalElements();

  // Add modal to DOM
  document.body.appendChild(modalContainer);

  // Create chart configuration and instance
  const config = createChartConfiguration(originalChart);
  const modalChart = createModalChart(modalCanvas, config);

  if (!modalChart) {
    // Cleanup and exit if chart creation failed
    if (modalContainer.parentNode) {
      modalContainer.parentNode.removeChild(modalContainer);
    }
    return;
  }

  // Create close function that will be used by event listeners
  let cleanupEventListeners: () => void;
  const closeModal = () => {
    cleanupModal(modalChart, modalContainer, cleanupEventListeners);
  };

  // Setup event listeners and get cleanup function
  cleanupEventListeners = setupModalEventListeners(
    modalContainer,
    closeButton,
    modalCanvas,
    modalChart,
    closeModal
  );

  // Store state for global tracking
  activeZoomState = {
    originalChart,
    modalChart,
    originalCanvas,
    modalCanvas,
    modalContainer
  };

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  console.log("✅ Chart zoom modal opened");
}

// Removed duplicate closeChartModal and handleModalKeydown functions - using the local closeModal and keydownHandler inside openChartModal instead

// Auto-initialization removed - chart zoom is now opt-in per page via frontmatter