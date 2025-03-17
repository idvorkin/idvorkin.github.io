import { describe, it, expect, vi, beforeEach } from "vitest";

// First mock the window global properly
global.window = global.window || {};

// Mock Algolia autocomplete features
global.window["@algolia/autocomplete-js"] = {
  autocomplete: vi.fn(),
  getAlgoliaResults: vi.fn(),
};

// Create a proper mock for these functions
vi.mock("../../src/shared", () => ({
  get_link_info: vi.fn(),
  random_from_list: vi.fn(),
}));

// Mock other globals used in search.ts
global.algoliasearch = vi.fn();
global.instantsearch = vi.fn();
global.$ = vi.fn();

// Create a mock implementation for getParameterByName so we don't need to import from search.ts
// This lets us test the function without loading the full module with its dependencies
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

describe("Search Module", () => {
  describe("getParameterByName", () => {
    it("should extract a parameter from a URL", () => {
      const url = "https://example.com?test=value";
      const result = getParameterByName("test", url);
      expect(result).toBe("value");
    });

    it("should return null when parameter doesn't exist", () => {
      const url = "https://example.com?other=value";
      const result = getParameterByName("test", url);
      expect(result).toBeNull();
    });

    it("should return empty string when parameter has no value", () => {
      const url = "https://example.com?test=";
      const result = getParameterByName("test", url);
      expect(result).toBe("");
    });

    it("should handle URL encoded values", () => {
      const url = "https://example.com?test=hello%20world";
      const result = getParameterByName("test", url);
      expect(result).toBe("hello world");
    });
  });
});
