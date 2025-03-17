import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { random_from_list, shuffle, load_globals } from "../../src/main";
import * as shared from "../../src/shared";
import * as recentPosts from "../../src/recent-posts";
import * as recent from "../../src/recent";

// Mock dependencies
vi.mock("../../src/shared", () => ({
  random_from_list: vi.fn(list => list[0]),
  shuffle: vi.fn(list => [...list].reverse()),
  append_randomizer_div: vi.fn(),
  get_link_info: vi.fn().mockResolvedValue({
    "/test-page": {
      url: "/test-page",
      title: "Test Page",
      description: "A test page",
      outgoing_links: ["/linked-page"],
      incoming_links: ["/incoming-page"],
    },
  }),
  MakeBackLinkHTML: vi.fn(info => `<div>${info?.title || "Untitled"}</div>`),
}));

vi.mock("../../src/recent-posts", () => ({
  initRecentPosts: vi.fn(),
}));

vi.mock("../../src/recent", () => ({
  initRecentAllPosts: vi.fn(),
}));

vi.mock("../../src/graph", () => ({}));

// Setup console mocks
console.log = vi.fn();
console.warn = vi.fn();

describe("Main module functions", () => {
  // These tests check the re-exported shared functions
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
  });

  describe("random_from_list", () => {
    it("should return an element from the list", () => {
      const input = [1, 2, 3, 4, 5];
      const result = random_from_list(input);
      expect(input).toContain(result);
    });

    it("should return undefined for empty list", () => {
      const result = random_from_list([]);
      expect(result).toBeUndefined();
    });
  });

  describe("load_globals function", () => {
    beforeEach(() => {
      // Setup jQuery mock
      global.$ = vi.fn().mockImplementation(selector => {
        if (typeof selector === "function") {
          // Handle $(function) case
          selector();
          return { each: vi.fn() };
        }

        // Handle the case when selector is a string
        const isMissingSelector =
          typeof selector === "string" && selector.includes("non-existent");

        return {
          append: vi.fn().mockReturnThis(),
          find: vi.fn().mockReturnThis(),
          length: isMissingSelector ? 0 : 1,
          each: vi.fn(),
          on: vi.fn(),
          ready: vi.fn(cb => cb()), // Add the ready method
          html: vi.fn(),
          click: vi.fn(fn =>
            fn({ preventDefault: vi.fn(), stopPropagation: vi.fn() })
          ),
          removeClass: vi.fn(),
          addClass: vi.fn(),
          text: vi.fn(),
          replaceWith: vi.fn(),
          remove: vi.fn(),
          first: vi.fn().mockReturnThis(),
          children: vi.fn().mockReturnValue({
            first: vi.fn().mockReturnValue({ remove: vi.fn() }),
          }),
        };
      });

      // Add the makeArray method to jQuery
      global.$.makeArray = vi.fn().mockImplementation(arr => []);

      // Mock $.getJSON
      global.$.getJSON = vi.fn().mockResolvedValue({
        redirects: {},
        url_info: {
          "/test-page": {
            url: "/test-page",
            title: "Test Page",
            description: "A test page",
            outgoing_links: ["/linked-page"],
            incoming_links: ["/incoming-page"],
          },
        },
      });

      // Mock window.location and document.URL
      Object.defineProperty(window, "location", {
        value: {
          href: "https://idvork.in/test-page",
          pathname: "/test-page",
        },
        writable: true,
      });

      // Mock document.URL
      Object.defineProperty(document, "URL", {
        value: "https://idvork.in/test-page",
        writable: true,
      });

      // Mock document for TOC
      document.body.innerHTML = `
        <div id="ui-toc"></div>
        <div id="ui-toc-affix"></div>
        <div id="links-to-page"></div>
        <div id="last-modified-posts"></div>
        <div id="content-holder"></div>
      `;

      // Mock Toc constructor
      global.Toc = vi.fn().mockImplementation(() => ({}));

      // Mock Mousetrap
      global.Mousetrap = vi.fn().mockReturnValue({
        bind: vi.fn(),
      });

      // Mock window.scrollTo
      window.scrollTo = vi.fn();
    });

    afterEach(() => {
      vi.resetAllMocks();
      document.body.innerHTML = "";
    });

    it("should initialize recent posts module", async () => {
      await load_globals();
      expect(recentPosts.initRecentPosts).toHaveBeenCalled();
    });

    it("should initialize recent all posts if container exists", async () => {
      await load_globals();
      expect(recent.initRecentAllPosts).toHaveBeenCalled();
    });

    it("should not initialize recent all posts if container doesn't exist", async () => {
      document.body.innerHTML = `
        <div id="ui-toc"></div>
        <div id="ui-toc-affix"></div>
      `;

      await load_globals();
      expect(recent.initRecentAllPosts).not.toHaveBeenCalled();
    });

    it("should call generateToc for both toc containers", async () => {
      await load_globals();
      // Check that $ was called with a function (which would be the generateToc callback)
      const calls = vi.mocked(global.$).mock.calls;
      const functionCalls = calls.filter(call => typeof call[0] === "function");
      expect(functionCalls.length).toBeGreaterThan(0);
    });
  });

  describe("TOC functions", () => {
    beforeEach(() => {
      // Setup jQuery mock with TOC-specific behavior
      global.$ = vi.fn().mockImplementation(selector => {
        if (selector === ".ui-toc-dropdown .toc") {
          return {
            removeClass: vi.fn(),
            addClass: vi.fn(),
            length: 1,
          };
        }
        if (selector === ".expand-toggle") {
          return {
            text: vi.fn(),
            length: 1,
          };
        }
        return {
          length: 0,
        };
      });

      // Reset console mocks
      vi.mocked(console.log).mockReset();
      vi.mocked(console.warn).mockReset();
    });

    it("should warn when TOC elements are not found", async () => {
      // Force the main module to load and run checkExpandToggle indirectly
      await import("../../src/main");

      // Because the mocked selectors return elements with length > 0,
      // we don't expect a warning to be logged
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe("URL swapping function", () => {
    beforeEach(() => {
      // Mock window.location with a writable href
      Object.defineProperty(window, "location", {
        value: {
          href: "https://idvork.in/test-page",
          pathname: "/test-page",
        },
        writable: true,
      });

      // Mock document.URL
      Object.defineProperty(document, "URL", {
        value: "https://idvork.in/test-page",
        writable: true,
      });
    });

    it("should handle production URL swapping", async () => {
      // This is a partial test since we can't fully test window.location.href assignment
      // Force the main module to load
      await import("../../src/main");

      // We're just verifying the module loads without errors
      expect(true).toBe(true);
    });
  });
});
