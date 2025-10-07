import { beforeEach, describe, expect, it, vi } from "vitest";
import { enableChartZoom } from "../chart-zoom";

describe("Chart Zoom", () => {
  beforeEach(() => {
    // Clear the document
    document.body.innerHTML = "";

    // Reset any module-level state
    vi.clearAllMocks();
  });

  it("should find canvas elements", () => {
    // Create a test canvas
    const canvas = document.createElement("canvas");
    canvas.id = "test-chart";
    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Mock GLightbox
    (window as any).GLightbox = vi.fn(() => ({
      open: vi.fn(),
    }));

    const consoleSpy = vi.spyOn(console, "log");

    enableChartZoom();

    // Should find 1 canvas
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Found 1 canvas"),
    );
  });

  it("should skip small canvases", () => {
    // Create a tiny canvas
    const canvas = document.createElement("canvas");
    canvas.id = "tiny-chart";
    canvas.width = 50;
    canvas.height = 50;
    document.body.appendChild(canvas);

    // Mock GLightbox
    (window as any).GLightbox = vi.fn(() => ({
      open: vi.fn(),
    }));

    const consoleSpy = vi.spyOn(console, "log");

    enableChartZoom();

    // Should skip the tiny canvas
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("too small"),
    );
  });

  it("should make canvas clickable", () => {
    // Create a test canvas
    const canvas = document.createElement("canvas");
    canvas.id = "clickable-chart";
    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Mock GLightbox
    (window as any).GLightbox = vi.fn(() => ({
      open: vi.fn(),
    }));

    enableChartZoom();

    // Check that cursor is set to pointer
    expect(canvas.style.cursor).toBe("pointer");

    // Check that data attribute is set
    expect(canvas.getAttribute("data-chart-zoom-enabled")).toBe("true");
  });

  it("should open lightbox when canvas is clicked", () => {
    // Create a test canvas with 2D context
    const canvas = document.createElement("canvas");
    canvas.id = "click-test-chart";
    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Draw something on the canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, 100, 100);
    }

    // Mock GLightbox
    const mockOpen = vi.fn();
    const mockGLightbox = vi.fn(() => ({
      open: mockOpen,
    }));
    (window as any).GLightbox = mockGLightbox;

    enableChartZoom();

    // Click the canvas
    canvas.click();

    // Check that GLightbox was created
    expect(mockGLightbox).toHaveBeenCalled();

    // Check that open was called
    expect(mockOpen).toHaveBeenCalled();

    // Check that GLightbox was called with correct options
    const glightboxCall = mockGLightbox.mock.calls[mockGLightbox.mock.calls.length - 1][0];
    expect(glightboxCall).toHaveProperty("elements");
    expect(glightboxCall.elements).toHaveLength(1);
    expect(glightboxCall.elements[0]).toHaveProperty("type", "image");
    expect(glightboxCall.elements[0].href).toContain("data:image/png");
  });

  it("should skip already-enabled canvases", () => {
    // Create a test canvas
    const canvas = document.createElement("canvas");
    canvas.id = "already-enabled-chart";
    canvas.width = 400;
    canvas.height = 300;
    canvas.setAttribute("data-chart-zoom-enabled", "true");
    document.body.appendChild(canvas);

    // Mock GLightbox
    (window as any).GLightbox = vi.fn(() => ({
      open: vi.fn(),
    }));

    const consoleSpy = vi.spyOn(console, "log");

    enableChartZoom();

    // Should skip the already-enabled canvas
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("already has zoom"),
    );
  });

  it("should retry if GLightbox is not available", () => {
    vi.useFakeTimers();

    // Don't define GLightbox initially
    delete (window as any).GLightbox;

    const consoleWarnSpy = vi.spyOn(console, "warn");

    // Call enableChartZoom
    enableChartZoom();

    // Should warn about retrying
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("GLightbox not found"),
    );

    // Fast-forward time
    vi.advanceTimersByTime(100);

    // Should have retried
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("should give up after max retries", () => {
    vi.useFakeTimers();

    // Don't define GLightbox
    delete (window as any).GLightbox;

    const consoleErrorSpy = vi.spyOn(console, "error");

    // Call enableChartZoom
    enableChartZoom();

    // Fast-forward past max retry time
    vi.advanceTimersByTime(5100);

    // Should have given up
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("GLightbox failed to load"),
    );

    vi.useRealTimers();
  });
});
