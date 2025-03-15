import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initRecentPosts } from "../recent-posts";

// Mock fetch function
const mockFetchResponse = (status = 200, data = {}) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  };
};

describe("Recent Posts Module", () => {
  // Setup test environment
  beforeEach(() => {
    // Clear the DOM
    document.body.innerHTML = `<div id="recent-posts"></div>`;

    // Mock console methods to prevent noise during tests
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();

    // Mock global fetch
    global.fetch = vi.fn();

    // Setup fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  describe("initRecentPosts", () => {
    it("should call updateRecentPosts when DOM is already loaded", async () => {
      // Set up the mock response
      const mockData = {
        url_info: {
          "/page1": {
            url: "/page1",
            title: "Page 1",
            description: "This is page 1",
            doc_size: 1000,
            last_modified: "2023-05-01",
          },
          "/page2": {
            url: "/page2",
            title: "Page 2",
            description: "This is page 2",
            doc_size: 2000,
            last_modified: "2023-06-01",
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce(
        mockFetchResponse(200, mockData)
      );

      // Set document readyState
      Object.defineProperty(document, "readyState", {
        value: "complete",
        writable: true,
      });

      // Call initRecentPosts
      initRecentPosts();

      // Resolve the promise from fetch
      await vi.runAllTimersAsync();

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith("/back-links.json");

      // Verify the DOM has been updated
      const recentPostsContainer = document.getElementById("recent-posts");
      expect(recentPostsContainer.innerHTML).toContain("Page 2");
      expect(recentPostsContainer.innerHTML).toContain("Page 1");
    });

    it("should add an event listener when DOM is still loading", () => {
      // Set document readyState
      Object.defineProperty(document, "readyState", {
        value: "loading",
        writable: true,
      });

      // Mock addEventListener
      document.addEventListener = vi.fn();

      // Call initRecentPosts
      initRecentPosts();

      // Verify addEventListener was called
      expect(document.addEventListener).toHaveBeenCalledWith(
        "DOMContentLoaded",
        expect.any(Function)
      );
    });
  });

  it("should handle missing url_info in data structure", async () => {
    // Set up the mock response with no url_info
    const mockData = {};

    (global.fetch as any).mockResolvedValueOnce(
      mockFetchResponse(200, mockData)
    );

    // Set document readyState
    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
    });

    // Call initRecentPosts
    initRecentPosts();

    // Flush promises
    await vi.runAllTimersAsync();

    // Verify the DOM has the error message
    const recentPostsContainer = document.getElementById("recent-posts");
    expect(recentPostsContainer.innerHTML).toContain("Error:");

    // Verify that console.error was called
    expect(console.error).toHaveBeenCalled();
  });

  it("should handle fetch errors gracefully", async () => {
    // Make fetch throw an error
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    // Set document readyState
    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
    });

    // Call initRecentPosts
    initRecentPosts();

    // Flush promises
    await vi.runAllTimersAsync();

    // Verify the DOM has the error message
    const recentPostsContainer = document.getElementById("recent-posts");
    expect(recentPostsContainer.innerHTML).toContain(
      "Error loading recent posts"
    );

    // Verify that console.error was called
    expect(console.error).toHaveBeenCalled();
  });

  it("should sort pages by last_modified date", async () => {
    // Set up mock data with pages having different dates
    const mockData = {
      url_info: {
        "/older": {
          url: "/older",
          title: "Older Page",
          description: "This is an older page",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        "/middle": {
          url: "/middle",
          title: "Middle Page",
          description: "This is a middle page",
          doc_size: 2000,
          last_modified: "2023-02-01",
        },
        "/newest": {
          url: "/newest",
          title: "Newest Page",
          description: "This is the newest page",
          doc_size: 3000,
          last_modified: "2023-03-01",
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce(
      mockFetchResponse(200, mockData)
    );

    // Set document readyState
    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
    });

    // Call initRecentPosts
    initRecentPosts();

    // Flush promises
    await vi.runAllTimersAsync();

    // Get the rendered HTML content
    const recentPostsContainer = document.getElementById("recent-posts");
    const html = recentPostsContainer.innerHTML;

    // The newest page should appear before older pages in the HTML
    const newestIndex = html.indexOf("Newest Page");
    const middleIndex = html.indexOf("Middle Page");
    const olderIndex = html.indexOf("Older Page");

    expect(newestIndex).toBeLessThan(middleIndex);
    expect(middleIndex).toBeLessThan(olderIndex);
  });

  it("should filter out pages with empty or url-matching titles", async () => {
    // Set up mock data with some empty/problematic descriptions/titles
    const mockData = {
      url_info: {
        "/empty-desc": {
          url: "/empty-desc",
          title: "Empty Description",
          description: "",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        "/empty-title": {
          url: "/empty-title",
          title: "",
          description: "Has no title",
          doc_size: 2000,
          last_modified: "2023-02-01",
        },
        "/url-as-title": {
          url: "/url-as-title",
          title: "/url-as-title", // Title is same as URL
          description: "Title equals URL",
          doc_size: 1500,
          last_modified: "2023-01-10",
        },
        "/valid": {
          url: "/valid",
          title: "Valid Page",
          description: "This is a valid page",
          doc_size: 3000,
          last_modified: "2023-03-01",
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce(
      mockFetchResponse(200, mockData)
    );

    // Set document readyState
    Object.defineProperty(document, "readyState", {
      value: "complete",
      writable: true,
    });

    // Call initRecentPosts
    initRecentPosts();

    // Flush promises
    await vi.runAllTimersAsync();

    // Get the rendered HTML content
    const recentPostsContainer = document.getElementById("recent-posts");
    const html = recentPostsContainer.innerHTML;

    // Should include valid page
    expect(html).toContain("Valid Page");

    // Should not include problematic pages
    expect(html).not.toContain("Empty Description");
    expect(html).not.toContain("Title equals URL");

    // Check that the title fallback isn't displayed
    const titleAsUrlPattern = /<a href="\/url-as-title">\/url-as-title<\/a>/;
    expect(html).not.toMatch(titleAsUrlPattern);
  });
});
