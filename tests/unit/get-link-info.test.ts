import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { IURLInfoMap } from "../../src/shared";

describe("get_link_info", () => {
  // Setup mock data
  const mockLinkInfo: IURLInfoMap = {
    "https://example.com/page1": {
      url: "https://example.com/page1",
      title: "Page 1",
      description: "This is page 1",
      file_path: "page1.md",
      outgoing_links: ["https://example.com/page2"],
      incoming_links: [],
      redirect_url: "",
      doc_size: 1000,
      last_modified: "2023-01-01",
    },
  };

  // Mock data to be returned by fetch
  const mockResponse = {
    url_info: mockLinkInfo,
  };

  beforeEach(() => {
    // Reset modules before each test to clear any cached data
    vi.resetModules();

    // Mock console.error
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch link info from local path when not in production", async () => {
    // Setup window.location for non-production
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost:4000" },
      writable: true,
    });

    // Setup fetch mock
    window.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    // Import the function fresh to avoid cached state
    const { get_link_info } = await import("../../src/shared");

    // Call the function
    const result = await get_link_info();

    // Verify fetch was called with the correct URL
    expect(window.fetch).toHaveBeenCalledWith("/back-links.json");

    // Verify the returned data
    expect(result).toEqual(mockLinkInfo);
  });

  it("should fetch link info from GitHub when in production", async () => {
    // Setup window.location for production
    Object.defineProperty(window, "location", {
      value: { href: "https://idvork.in/somepage" },
      writable: true,
    });

    // Setup fetch mock
    window.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    // Import the function fresh to avoid cached state
    const { get_link_info } = await import("../../src/shared");

    // Call the function
    const result = await get_link_info();

    // Verify fetch was called with the GitHub URL
    expect(window.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True"
    );

    // Verify the returned data
    expect(result).toEqual(mockLinkInfo);
  });

  it("should handle fetch errors gracefully", async () => {
    // Setup window.location
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost:4000" },
      writable: true,
    });

    // Make fetch throw an error
    window.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    // Import the function fresh to avoid cached state
    const { get_link_info } = await import("../../src/shared");

    // Call the function
    const result = await get_link_info();

    // Should return empty object on error
    expect(result).toEqual({});

    // Verify console.error was called
    expect(console.error).toHaveBeenCalled();
  });

  it("should cache responses and not make additional requests", async () => {
    // Setup window.location
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost:4000" },
      writable: true,
    });

    // Setup fetch mock
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    window.fetch = fetchMock;

    // Import the function fresh to avoid cached state
    const { get_link_info } = await import("../../src/shared");

    // First call should make a fetch request
    await get_link_info();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Reset mock call count for clarity
    fetchMock.mockClear();

    // Second call should use cached data
    const result = await get_link_info();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual(mockLinkInfo);
  });
});
