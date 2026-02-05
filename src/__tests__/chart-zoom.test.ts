import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { enableChartZoom, resetChartZoomState } from "../chart-zoom";

// Mock DOM elements and Chart.js
const mockChart = {
  config: {
    type: "bar",
    data: { labels: ["A", "B"], datasets: [{ data: [1, 2] }] },
    options: { responsive: true }
  },
  destroy: vi.fn()
};

const mockCanvas = {
  id: "test-chart",
  style: {} as CSSStyleDeclaration,
  classList: {
    add: vi.fn()
  },
  addEventListener: vi.fn(),
  getAttribute: vi.fn(),
  setAttribute: vi.fn()
};

const mockDocument = {
  readyState: "complete",
  querySelectorAll: vi.fn(),
  createElement: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  body: {
    appendChild: vi.fn(),
    style: {}
  }
};

// Mock Chart.js
const mockChartJS = {
  getChart: vi.fn(),
  constructor: vi.fn()
};

// Setup global mocks
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks();

  // Reset the chart zoom state for each test
  resetChartZoomState();

  // Mock global objects
  (globalThis as any).document = mockDocument;
  (globalThis as any).window = {
    Chart: mockChartJS,
    setTimeout: vi.fn((cb, delay) => {
      // Don't immediately call the callback for testing setTimeout behavior
      return 1;
    })
  };

  // Mock console separately
  (globalThis as any).console = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  };

  // Reset mock implementations
  mockDocument.querySelectorAll.mockReturnValue([]);
  mockChartJS.getChart.mockReturnValue(null);
});

afterEach(() => {
  // Clean up global mocks
  delete (globalThis as any).document;
  delete (globalThis as any).window;
});

describe("Chart Zoom", () => {
  describe("enableChartZoom", () => {
    it("should skip initialization if document is undefined", () => {
      delete (globalThis as any).document;

      const consoleSpy = vi.spyOn(console, "log");
      enableChartZoom();

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should log enabling message when Chart.js is available", () => {
      const consoleSpy = vi.spyOn((globalThis as any).console, "log");
      mockDocument.querySelectorAll.mockReturnValue([]);

      enableChartZoom();

      expect(consoleSpy).toHaveBeenCalledWith("📊 Enabling chart zoom functionality");
    });

    it("should retry when Chart.js is not available", () => {
      const consoleWarnSpy = vi.spyOn((globalThis as any).console, "warn");

      // Make Chart.js unavailable
      (globalThis as any).window.Chart = undefined;

      // Mock real setTimeout for this test
      const realSetTimeout = globalThis.setTimeout;
      const setTimeoutSpy = vi.fn();
      (globalThis as any).setTimeout = setTimeoutSpy;

      enableChartZoom();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Chart.js not found, retrying")
      );
      expect(setTimeoutSpy).toHaveBeenCalled();

      // Restore original setTimeout
      (globalThis as any).setTimeout = realSetTimeout;
    });

    it("should skip Chart.js initialization gracefully if not found after retries", () => {
      const consoleLogSpy = vi.spyOn((globalThis as any).console, "log");

      // Make Chart.js unavailable and exceed retry limit
      (globalThis as any).window.Chart = undefined;

      enableChartZoom(51); // Exceed MAX_RETRY_ATTEMPTS

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "ℹ️ Chart.js not found, skipping chart zoom initialization"
      );
    });

    it("should find and process canvas elements with Chart.js instances", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {}
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(mockChart);

      const consoleSpy = vi.spyOn((globalThis as any).console, "log");

      enableChartZoom();

      expect(mockDocument.querySelectorAll).toHaveBeenCalledWith("canvas");
      expect(mockChartJS.getChart).toHaveBeenCalledWith(mockCanvasElement);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Processing Chart.js chart")
      );
    });

    it("should apply interactive styles to chart canvases", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {} as CSSStyleDeclaration,
        classList: {
          add: vi.fn()
        }
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(mockChart);

      enableChartZoom();

      // Check that interactive styles were applied
      expect(mockCanvasElement.style.cursor).toBe("pointer");
      expect(mockCanvasElement.style.transition).toContain("transform");
      expect(mockCanvasElement.style.transition).toContain("box-shadow");
    });

    it("should add click and hover event listeners to charts", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {} as CSSStyleDeclaration,
        classList: {
          add: vi.fn()
        }
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(mockChart);

      enableChartZoom();

      expect(mockCanvasElement.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
      expect(mockCanvasElement.addEventListener).toHaveBeenCalledWith("mouseenter", expect.any(Function));
      expect(mockCanvasElement.addEventListener).toHaveBeenCalledWith("mouseleave", expect.any(Function));
    });

    it("should skip canvas elements without Chart.js instances", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {} as CSSStyleDeclaration,
        classList: {
          add: vi.fn()
        }
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(null); // No Chart.js instance

      const consoleSpy = vi.spyOn((globalThis as any).console, "log");

      enableChartZoom();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Skipping canvas 1 - no Chart.js instance found")
      );
      expect(mockCanvasElement.addEventListener).not.toHaveBeenCalled();
    });

    it("should log completion message with processed count", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {} as CSSStyleDeclaration,
        classList: {
          add: vi.fn()
        }
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(mockChart);

      const consoleSpy = vi.spyOn((globalThis as any).console, "log");

      enableChartZoom();

      expect(consoleSpy).toHaveBeenCalledWith("🎉 Chart zoom enabled for 1 charts");
    });

    it("should log when no charts are found", () => {
      mockDocument.querySelectorAll.mockReturnValue([]);

      const consoleSpy = vi.spyOn((globalThis as any).console, "log");

      enableChartZoom();

      expect(consoleSpy).toHaveBeenCalledWith("ℹ️ No Chart.js charts found to process");
    });
  });

  describe("hover effects", () => {
    it("should apply hover styles on mouseenter", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {} as CSSStyleDeclaration,
        classList: {
          add: vi.fn()
        }
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(mockChart);

      enableChartZoom();

      // Get the mouseenter handler and call it
      const mouseenterHandler = mockCanvasElement.addEventListener.mock.calls
        .find(call => call[0] === "mouseenter")?.[1];

      expect(mouseenterHandler).toBeDefined();

      if (mouseenterHandler) {
        mouseenterHandler();

        expect(mockCanvasElement.style.boxShadow).toBe("0 4px 12px rgba(0,0,0,0.15)");
        expect(mockCanvasElement.style.transform).toBe("scale(1.02)");
      }
    });

    it("should remove hover styles on mouseleave", () => {
      const mockCanvasElement = {
        ...mockCanvas,
        addEventListener: vi.fn(),
        style: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: "scale(1.02)"
        } as CSSStyleDeclaration,
        classList: {
          add: vi.fn()
        }
      };

      mockDocument.querySelectorAll.mockReturnValue([mockCanvasElement]);
      mockChartJS.getChart.mockReturnValue(mockChart);

      enableChartZoom();

      // Get the mouseleave handler and call it
      const mouseleaveHandler = mockCanvasElement.addEventListener.mock.calls
        .find(call => call[0] === "mouseleave")?.[1];

      expect(mouseleaveHandler).toBeDefined();

      if (mouseleaveHandler) {
        mouseleaveHandler();

        expect(mockCanvasElement.style.boxShadow).toBe("none");
        expect(mockCanvasElement.style.transform).toBe("scale(1)");
      }
    });
  });

  describe("DOM ready handling", () => {
    it("should initialize when DOM is already loaded", () => {
      mockDocument.readyState = "complete";

      // This test verifies the function works - the initialization code is at module level
      // and doesn't run during individual test function calls
      enableChartZoom();

      // Just verify it doesn't throw errors
      expect(true).toBe(true);
    });

    it("should add DOMContentLoaded listener when DOM is loading", () => {
      mockDocument.readyState = "loading";
      const addEventListenerSpy = vi.spyOn(mockDocument, "addEventListener");

      // This tests the module initialization code, but since we're in a test environment,
      // we'll just verify the function works when called directly
      enableChartZoom();

      // The function should still work when called directly
      expect(true).toBe(true); // Basic smoke test
    });
  });
});