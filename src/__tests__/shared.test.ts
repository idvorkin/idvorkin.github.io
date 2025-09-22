import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  type IURLInfo,
  MakeBackLinkHTML,
  append_randomizer_div,
  makeRedirectUrl,
  random_from_list,
  shuffle,
} from "../../src/shared";

// Add jQuery type declaration
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
  var $: any;
  var jQuery: any;
}

describe("Shared Utility Functions", () => {
  describe("MakeBackLinkHTML", () => {
    it("should generate correct HTML for a backlink", () => {
      const urlInfo: IURLInfo = {
        url: "https://example.com",
        title: "Example Page",
        description: "This is an example page",
        file_path: "example.md",
        outgoing_links: [],
        incoming_links: [],
        redirect_url: "",
        doc_size: 1000,
        last_modified: "2023-01-01",
      };

      const result = MakeBackLinkHTML(urlInfo);
      expect(result).toContain("<a href=https://example.com>Example Page</a>");
      expect(result).toContain('class="link-box description truncate-css"');
      expect(result).toContain('<span class="link-description"> This is an example page <span>');
    });
  });

  describe("random_from_list", () => {
    it("should return an element from the list", () => {
      const list = [1, 2, 3, 4, 5];
      const result = random_from_list(list);
      expect(list).toContain(result);
    });

    it("should return undefined for empty list", () => {
      expect(random_from_list([])).toBeUndefined();
    });

    it("should have a roughly even distribution over many calls", () => {
      // This is a statistical test, so it could occasionally fail
      // even if the function is working correctly
      const list = [1, 2, 3, 4, 5];
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      // Run many iterations to get a distribution
      for (let i = 0; i < 1000; i++) {
        const result = random_from_list(list);
        counts[result]++;
      }

      // Each item should be selected roughly 200 times (1000/5)
      // Allow for some statistical variation (150-250 is reasonable)
      for (const count of Object.values(counts)) {
        expect(count).toBeGreaterThan(150);
        expect(count).toBeLessThan(250);
      }
    });
  });

  describe("shuffle", () => {
    it("should return an array of the same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle([...input]);
      expect(result.length).toBe(input.length);
    });

    it("should contain all the same elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle([...input]);
      expect(result.sort()).toEqual(input.sort());
    });

    it("should change the order of elements (most of the time)", () => {
      // This test could occasionally fail if the shuffle happens to return
      // the same order, but that's very unlikely with a longer array
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let sameOrderCount = 0;

      // Run multiple shuffles to reduce the chance of a false positive
      for (let i = 0; i < 10; i++) {
        const result = shuffle([...input]);

        // Check if arrays are in the same order
        const sameOrder = input.every((val, idx) => val === result[idx]);
        if (sameOrder) sameOrderCount++;
      }

      // It's extremely unlikely that more than 1 shuffle would return the original order
      expect(sameOrderCount).toBeLessThan(2);
    });
  });

  describe("append_randomizer_div", () => {
    let clickCallback: (() => void) | null;

    beforeEach(() => {
      // Set up the DOM
      document.body.innerHTML = '<div id="test-container"></div>';

      // Create a mock for the jQuery function and track the click handler
      clickCallback = null;

      // Mock jQuery
      global.$ = vi.fn().mockImplementation((selector: any) => {
        // Handle both the selector string case and the jQuery result case
        if (selector === "#test-container") {
          // Mock for the parent element
          return {
            length: 1,
            html: vi.fn(),
            empty: vi.fn().mockReturnThis(),
            click: vi.fn().mockImplementation(function (callback) {
              clickCallback = callback;
              return this;
            }),
            append: vi.fn().mockReturnThis(),
          };
        }
        if (typeof selector === "string" && selector.startsWith("<")) {
          // Mock for the jQuery result of HTML content
          return {
            length: 1,
            html: vi.fn(),
          };
        }

        // Default case for non-matching selectors
        return { length: 0 };
      });
    });

    it("should not append anything if parent is not found", async () => {
      const htmlFactory = vi.fn().mockReturnValue("<p>Test content</p>");
      await append_randomizer_div("#non-existent", htmlFactory);

      expect(htmlFactory).not.toHaveBeenCalled();
    });

    it("should append content from the factory when parent is found", async () => {
      // Setup
      const htmlContent = "<p>Test content</p>";
      const htmlFactory = vi.fn().mockResolvedValue(htmlContent);

      // Act
      await append_randomizer_div("#test-container", htmlFactory);

      // Assert
      expect(htmlFactory).toHaveBeenCalled();

      // Verify the parent was queried
      expect($).toHaveBeenCalledWith("#test-container");

      // Verify event handler was registered
      expect(clickCallback).not.toBeNull();
    });

    it("should handle click events on non-link elements", async () => {
      // Setup
      const htmlContent = "<p>Test content</p>";
      const htmlFactory = vi.fn().mockResolvedValue(htmlContent);

      // Act
      await append_randomizer_div("#test-container", htmlFactory);

      // Reset the factory mock to test the click handler
      htmlFactory.mockClear();

      // Get the jQuery mock for the parent
      const $parent = $("#test-container");

      // Test the click handler with a DIV event target
      const mockEvent = { target: { tagName: "DIV" } };
      await clickCallback(mockEvent);

      // Verify new content was generated
      expect(htmlFactory).toHaveBeenCalled();
    });

    it("should not regenerate content when clicking on a link", async () => {
      // Setup
      const htmlContent = "<a href='#'>Test Link</a>";
      const htmlFactory = vi.fn().mockResolvedValue(htmlContent);

      // Act
      await append_randomizer_div("#test-container", htmlFactory);

      // Reset the factory mock to test the click handler
      htmlFactory.mockClear();

      // Test the click handler with an A (link) event target
      const mockEvent = { target: { tagName: "A" } };
      await clickCallback(mockEvent);

      // Verify no new content was generated
      expect(htmlFactory).not.toHaveBeenCalled();
    });
  });

  describe("makeRedirectUrl", () => {
    it("should generate correct URL with path only", () => {
      const url = makeRedirectUrl("timeoff");
      expect(url).toBe("https://tinyurl.com/igor-blog/?path=timeoff");
    });

    it("should generate correct URL with path and anchor", () => {
      const url = makeRedirectUrl("timeoff", "very-vegetating");
      expect(url).toBe("https://tinyurl.com/igor-blog/?path=timeoff%23very-vegetating");
    });

    it("should handle special characters in path", () => {
      const url = makeRedirectUrl("time off/test", "anchor name");
      expect(url).toBe("https://tinyurl.com/igor-blog/?path=time%20off%2Ftest%23anchor%20name");
    });

    it("should handle empty anchor gracefully", () => {
      const url = makeRedirectUrl("page", "");
      expect(url).toBe("https://tinyurl.com/igor-blog/?path=page");
    });

    it("should handle undefined anchor", () => {
      const url = makeRedirectUrl("page", undefined);
      expect(url).toBe("https://tinyurl.com/igor-blog/?path=page");
    });
  });
});
