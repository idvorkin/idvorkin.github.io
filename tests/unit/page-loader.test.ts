import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock window.@algolia/autocomplete-js
vi.stubGlobal("window", {
  "@algolia/autocomplete-js": {
    autocomplete: vi.fn(),
    getAlgoliaResults: vi.fn(),
  },
});

// Mock the dependencies with shuffle
vi.mock("../../src/index", () => ({
  get_link_info: vi.fn().mockResolvedValue({
    "https://example.com": {
      url: "https://example.com",
      title: "Example Page",
      description: "This is an example page",
      file_path: "example.md",
      outgoing_links: [],
      incoming_links: [],
      redirect_url: "",
      doc_size: 1000,
      last_modified: "2023-01-01",
    },
  }),
  append_randomizer_div: vi.fn(),
  random_from_list: vi.fn(list => list[0]),
  shuffle: vi.fn(arr => arr),
}));

// Mock jQuery
global.$ = vi.fn();

// Import the functions to test after mocking
import { makePostPreviewHTML } from "../../src/page-loader";

describe("Page Loader", () => {
  describe("makePostPreviewHTML", () => {
    it("should generate correct HTML for a post preview", () => {
      const post = {
        url: "/sample-post",
        title: "Sample Post",
        description: "This is a sample post",
      };

      const result = makePostPreviewHTML(post);
      expect(result).toContain("<a href='/sample-post'}");
      expect(result).toContain("Sample Post</a>");
      expect(result).toContain("This is a sample post");
      expect(result).toContain("<audio id='");
      expect(result).toContain("🔈</a>");
    });
  });
});
