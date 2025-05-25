import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateRecentPagesHTML, getRecentPages, initRecentPosts, updateRecentPosts } from "../../src/recent-posts";
import * as sharedModule from "../../src/recent-posts-shared";
import {
  type IPage,
  convertToPages,
  fetchBacklinksData,
  filterRealPages,
  sortPagesByDate,
} from "../../src/recent-posts-shared";
import { IURLInfo, type IURLInfoMap } from "../../src/shared";

// Mock fetch globally
const originalFetch = global.fetch;

describe("Recent Posts Module", () => {
  // Setup and teardown for tests that mock fetch
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
    // Clear the document body and add test containers
    document.body.innerHTML = "";
    document.body.innerHTML =
      '<div id="test-recent-posts"></div><div id="test-container"></div><div id="non-existent-container"></div>';
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("fetchBacklinksData", () => {
    it("should fetch and return URL info map", async () => {
      // Mock response
      const mockURLInfoMap: IURLInfoMap = {
        "/page1": {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          file_path: "page1.md",
          outgoing_links: [],
          incoming_links: [],
          redirect_url: "",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
      };

      const mockResponse = {
        url_info: mockURLInfoMap,
      };

      // Setup fetch mock
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      // Call the function
      const result = await fetchBacklinksData();

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith("/back-links.json");
      expect(result).toEqual(mockURLInfoMap);
    });

    it("should throw error if url_info is missing", async () => {
      // Use special test URL that triggers the error
      await expect(fetchBacklinksData("/test-missing-url-info")).rejects.toThrow("Missing url_info in data structure");
    });
  });

  describe("convertToPages", () => {
    it("should convert URL info map to array of page objects", () => {
      // Sample input
      const urlInfoMap: IURLInfoMap = {
        "/page1": {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          file_path: "page1.md",
          outgoing_links: [],
          incoming_links: [],
          redirect_url: "",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        "/page2": {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          file_path: "page2.md",
          outgoing_links: [],
          incoming_links: [],
          redirect_url: "",
          doc_size: 500,
          last_modified: "2023-01-02",
        },
      };

      // Expected output
      const expected: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "2023-01-02",
        },
      ];

      // Call the function
      const result = convertToPages(urlInfoMap);

      // Assertions (compare without caring about order)
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(expected));
    });

    it("should handle missing properties with defaults", () => {
      // Sample input with missing properties
      const urlInfoMap: IURLInfoMap = {
        "/page1": {
          url: "/page1", // Title missing
          description: "", // Empty description
          file_path: "page1.md",
          outgoing_links: [],
          incoming_links: [],
          redirect_url: "",
          doc_size: null as any, // Missing doc_size
          last_modified: null as any, // Missing last_modified
        },
      };

      // Expected output with defaults
      const expected: IPage[] = [
        {
          url: "/page1",
          title: "/page1", // Default to URL
          description: "",
          doc_size: 0, // Default
          last_modified: "", // Default
        },
      ];

      // Call the function
      const result = convertToPages(urlInfoMap);

      // Assertions
      expect(result).toEqual(expected);
    });
  });

  describe("filterRealPages", () => {
    it("should filter out pages with empty titles or descriptions", () => {
      // Sample input
      const pages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "", // Empty title
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "2023-01-02",
        },
        {
          url: "/page3",
          title: "Page 3",
          description: "", // Empty description
          doc_size: 300,
          last_modified: "2023-01-03",
        },
        {
          url: "/page4",
          title: "   ", // Whitespace title
          description: "Description for page 4",
          doc_size: 200,
          last_modified: "2023-01-04",
        },
      ];

      // Expected output
      const expected: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
      ];

      // Call the function
      const result = filterRealPages(pages);

      // Assertions
      expect(result).toEqual(expected);
    });
  });

  describe("sortPagesByDate", () => {
    it("should sort pages by last_modified date, newest first", () => {
      // Sample input
      const pages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "2023-01-03", // Most recent
        },
        {
          url: "/page3",
          title: "Page 3",
          description: "Description for page 3",
          doc_size: 300,
          last_modified: "2023-01-02",
        },
      ];

      // Expected output order
      const expectedOrder = ["/page2", "/page3", "/page1"];

      // Call the function
      const result = sortPagesByDate(pages);

      // Assertions
      expect(result.map((p) => p.url)).toEqual(expectedOrder);
    });

    it("should fallback to doc_size if last_modified dates are missing", () => {
      // Sample input with missing dates
      const pages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000, // Largest
          last_modified: "", // Missing
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "", // Missing
        },
        {
          url: "/page3",
          title: "Page 3",
          description: "Description for page 3",
          doc_size: 800,
          last_modified: "", // Missing
        },
      ];

      // Expected output order by doc_size
      const expectedOrder = ["/page1", "/page3", "/page2"];

      // Call the function
      const result = sortPagesByDate(pages);

      // Assertions
      expect(result.map((p) => p.url)).toEqual(expectedOrder);
    });

    it("should not modify the original array", () => {
      // Sample input
      const pages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "2023-01-03",
        },
      ];

      // Create a copy for comparison
      const originalPages = [...pages];

      // Call the function
      sortPagesByDate(pages);

      // Assertions - original array should be unchanged
      expect(pages).toEqual(originalPages);
    });
  });

  describe("getRecentPages", () => {
    it("should return the specified number of pages", () => {
      // Sample input
      const pages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Desc 1",
          doc_size: 100,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Desc 2",
          doc_size: 200,
          last_modified: "2023-01-02",
        },
        {
          url: "/page3",
          title: "Page 3",
          description: "Desc 3",
          doc_size: 300,
          last_modified: "2023-01-03",
        },
        {
          url: "/page4",
          title: "Page 4",
          description: "Desc 4",
          doc_size: 400,
          last_modified: "2023-01-04",
        },
        {
          url: "/page5",
          title: "Page 5",
          description: "Desc 5",
          doc_size: 500,
          last_modified: "2023-01-05",
        },
        {
          url: "/page6",
          title: "Page 6",
          description: "Desc 6",
          doc_size: 600,
          last_modified: "2023-01-06",
        },
      ];

      // Call the function with default count (5)
      const resultDefault = getRecentPages(pages);
      expect(resultDefault).toHaveLength(5);
      expect(resultDefault.map((p) => p.url)).toEqual(["/page1", "/page2", "/page3", "/page4", "/page5"]);

      // Call the function with custom count
      const resultCustom = getRecentPages(pages, 3);
      expect(resultCustom).toHaveLength(3);
      expect(resultCustom.map((p) => p.url)).toEqual(["/page1", "/page2", "/page3"]);
    });

    it("should handle array with fewer pages than requested count", () => {
      // Sample input
      const pages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Desc 1",
          doc_size: 100,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Desc 2",
          doc_size: 200,
          last_modified: "2023-01-02",
        },
      ];

      // Call the function with count larger than array length
      const result = getRecentPages(pages, 5);

      // Should return all available pages
      expect(result).toHaveLength(2);
      expect(result).toEqual(pages);
    });
  });

  describe("generateRecentPagesHTML", () => {
    it("should generate correct HTML for recent pages", () => {
      // Sample input
      const recentPages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "2023-01-02",
        },
      ];

      // Call the function
      const html = generateRecentPagesHTML(recentPages);

      // Assertions
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>");
      expect(html).toContain('<a href="/page1">Page 1</a>');
      expect(html).toContain('<a href="/page2">Page 2</a>');
      expect(html).toContain("Description for page 1");
      expect(html).toContain("Description for page 2");
    });

    it("should truncate descriptions longer than 100 characters", () => {
      // Sample input with a long description
      const longDescription =
        "This is a very long description that should be truncated because it exceeds the 100 character limit set in the generateRecentPagesHTML function. This text should not appear in the output.";

      const recentPages: IPage[] = [
        {
          url: "/page1",
          title: "Page 1",
          description: longDescription,
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
      ];

      // Call the function
      const html = generateRecentPagesHTML(recentPages);

      // Assertions
      expect(html).toContain(longDescription.substring(0, 100)); // First 100 chars
      expect(html).toContain("..."); // Ellipsis for truncation
      expect(html).not.toContain(longDescription.substring(100)); // Should not contain text after 100 chars
    });

    it("should show message for empty pages array", () => {
      // Call the function with empty array
      const html = generateRecentPagesHTML([]);

      // Assertions
      expect(html).toContain("<p>No recent posts found.</p>");
      expect(html).not.toContain("<ul>");
    });
  });

  describe("updateRecentPosts", () => {
    it("should update the container with recent posts HTML", async () => {
      // Mock getProcessedPages function
      vi.spyOn(sharedModule, "getProcessedPages").mockResolvedValue([
        {
          url: "/page1",
          title: "Page 1",
          description: "Description for page 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
        },
        {
          url: "/page2",
          title: "Page 2",
          description: "Description for page 2",
          doc_size: 500,
          last_modified: "2023-01-02",
        },
      ]);

      // We don't need to create a test container since it's already in the DOM from beforeEach
      const container = document.getElementById("test-recent-posts");
      expect(container).not.toBeNull();

      // Call the function
      await updateRecentPosts("test-recent-posts");

      // Check that container was updated correctly
      expect(container?.innerHTML).toContain("Page 1");
      expect(container?.innerHTML).toContain("Page 2");
      expect(container?.innerHTML).toContain("Description for page 1");
    });

    it("should show error message when getProcessedPages fails", async () => {
      // Mock getProcessedPages to reject
      vi.spyOn(sharedModule, "getProcessedPages").mockRejectedValue(new Error("Test error"));

      // Get test container from the DOM
      const container = document.getElementById("test-recent-posts");
      expect(container).not.toBeNull();

      // Call the function
      await updateRecentPosts("test-recent-posts");

      // Check error message
      expect(container?.innerHTML).toContain("Error loading recent posts");
    });

    it("should do nothing if container is not found", async () => {
      // Save original document.getElementById
      const originalGetElementById = document.getElementById;

      // Override document.getElementById to return null
      document.getElementById = vi.fn().mockReturnValue(null);

      // Setup spy for getProcessedPages (should not be called)
      const processSpy = vi.spyOn(sharedModule, "getProcessedPages").mockImplementation(() => {
        throw new Error("This should not be called");
      });

      // Call the function with non-existent container ID
      await updateRecentPosts("non-existent-container");

      // Assertions - processSpy shouldn't be called because we should exit early
      expect(processSpy).not.toHaveBeenCalled();

      // Restore original getElementById
      document.getElementById = originalGetElementById;
    });
  });

  describe("initRecentPosts", () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it("should call updateRecentPosts immediately if document is loaded", async () => {
      // Create full mock Document with DOM methods
      const mockDoc = {
        readyState: "complete",
        addEventListener: vi.fn(),
        getElementById: (id: string) => document.getElementById(id),
        body: document.body,
      };

      // Spy on updateRecentPosts to verify it's called
      const updateSpy = vi.spyOn(sharedModule, "getProcessedPages").mockResolvedValue([]);

      // Call the function with mock document
      initRecentPosts("test-container", mockDoc as any);

      // Wait a bit for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify updateRecentPosts was called
      expect(updateSpy).toHaveBeenCalled();
    });

    it("should add event listener if document is still loading", () => {
      // Create mock Document object with minimum required properties
      const mockDoc = {
        readyState: "loading",
        addEventListener: vi.fn(),
        getElementById: (id: string) => document.getElementById(id),
        body: document.body,
      };

      // Call the function with mock document
      initRecentPosts("test-container", mockDoc as any);

      // Assertions
      expect(mockDoc.addEventListener).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function));
    });
  });
});
