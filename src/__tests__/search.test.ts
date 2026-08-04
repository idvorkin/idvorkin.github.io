import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as shared from "../../src/shared";

// Create a proper mock for these functions before importing
vi.mock("../../src/shared", () => ({
  get_link_info: vi.fn(),
  random_from_list: vi.fn(),
  MakeBackLinkHTML: vi.fn(),
}));

// Mock the Pagefind runtime. Without this the test resolves the REAL
// /pagefind/pagefind.js whenever a local index happens to exist (just
// build-search writes one to ./pagefind/), and Pagefind's self-initialization
// then throws an unhandled rejection fetching metadata over a base URL that
// does not exist under vitest — failing the run for environmental reasons.
const pagefindMock = vi.hoisted(() => ({
  options: vi.fn(),
  search: vi.fn(),
}));
vi.mock("/pagefind/pagefind.js", () => pagefindMock);

// autocomplete-js is the UI shell only — it no longer talks to any search
// service, so this stubs the widget, not a search backend.
//
// ES imports are hoisted above these calls, so search.ts is evaluated before any
// stub exists. That is fine because search.ts resolves the autocomplete widget
// lazily (getAutocomplete) rather than capturing it at import time. Don't
// unstub between tests — search.ts reads window on every call.
vi.stubGlobal("window", {
  location: {
    href: "https://example.com",
    hash: "#test",
  },
  "@algolia/autocomplete-js": {
    autocomplete: vi.fn(),
  },
});
vi.stubGlobal("$", vi.fn());

import {
  CreateAutoComplete,
  __resetSearchCaches,
  excerptHtml,
  getParameterByName,
  normalizeUrl,
  renderSearchHit,
  searchBlog,
  searchPagefind,
  searchTitles,
} from "../../src/search";

describe("Search Module", () => {
  let mockUrlInfo;
  let mockAutocompleteInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    // Both search indexes memoize on first load; without this a cached index
    // from an earlier test would mask the failure-path assertions.
    __resetSearchCaches();

    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();

    mockUrlInfo = {
      "/kettlebell": {
        url: "/kettlebell",
        title: "Kettlebells - A rock with a handle",
        description: "A test page about kettlebells",
      },
      "/eulogy": {
        url: "/eulogy",
        title: "Igor's Eulogy",
        description: "Another test page",
      },
    };

    vi.mocked(shared.get_link_info).mockResolvedValue(mockUrlInfo);
    vi.mocked(shared.random_from_list).mockImplementation((list) => list[0]);

    mockAutocompleteInstance = {};
    vi.mocked(window)["@algolia/autocomplete-js"].autocomplete.mockReturnValue(mockAutocompleteInstance);

    vi.mocked($).mockImplementation((selector) => {
      return {
        length: selector === "#autocomplete" ? 1 : 0,
        empty: vi.fn().mockReturnThis(),
        append: vi.fn().mockReturnThis(),
        click: vi.fn().mockImplementation((fn) => fn),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Deliberately NOT vi.unstubAllGlobals() — see the stub comment above.
  });

  describe("getParameterByName", () => {
    it("should extract a parameter from a URL", () => {
      const url = "https://example.com?test=value";
      expect(getParameterByName("test", url)).toBe("value");
    });

    it("should return null when parameter doesn't exist", () => {
      expect(getParameterByName("test", "https://example.com?other=value")).toBeNull();
    });

    it("should return empty string when parameter has no value", () => {
      expect(getParameterByName("test", "https://example.com?test=")).toBe("");
    });

    it("should handle URL encoded values", () => {
      expect(getParameterByName("test", "https://example.com?test=hello%20world")).toBe("hello world");
    });

    it("should use window.location.href when no URL is provided", () => {
      window.location.href = "https://example.com?test=fromWindow";
      expect(getParameterByName("test")).toBe("fromWindow");
    });
  });

  describe("normalizeUrl", () => {
    // Pagefind reports built file paths; the blog's permalinks are extensionless.
    it("strips the .html Pagefind appends", () => {
      expect(normalizeUrl("/kettlebell.html")).toBe("/kettlebell");
    });

    it("collapses directory index files to the directory", () => {
      expect(normalizeUrl("/d/index.html")).toBe("/d/");
    });

    it("leaves already-clean permalinks alone", () => {
      expect(normalizeUrl("/kettlebell")).toBe("/kettlebell");
    });

    it("handles empty input", () => {
      expect(normalizeUrl("")).toBe("");
    });
  });

  describe("excerptHtml", () => {
    // Pagefind escapes its own excerpts and adds <mark>; our title index does not.
    it("passes Pagefind excerpts through so <mark> highlights survive", () => {
      const hit = {
        url: "/x",
        title: "X",
        excerpt: "a <mark>kettlebell</mark> is a rock",
        source: "pagefind" as const,
      };
      expect(excerptHtml(hit)).toContain("<mark>kettlebell</mark>");
    });

    it("escapes title-source excerpts, which are raw text from back-links.json", () => {
      const hit = {
        url: "/x",
        title: "X",
        excerpt: '<img src=x onerror="alert(1)">',
        source: "title" as const,
      };
      const html = excerptHtml(hit);
      expect(html).not.toContain("<img");
      expect(html).toContain("&lt;img");
    });

    it("handles a missing excerpt", () => {
      expect(excerptHtml({ url: "/x", title: "X", excerpt: "", source: "title" as const })).toBe("");
    });
  });

  describe("renderSearchHit", () => {
    it("renders a link with the title and excerpt", () => {
      const html = renderSearchHit({
        url: "/kettlebell",
        title: "Kettlebells",
        excerpt: "a <mark>rock</mark>",
        source: "pagefind",
      });
      expect(html).toContain('href="/kettlebell"');
      expect(html).toContain("Kettlebells");
      expect(html).toContain("<mark>rock</mark>");
    });

    it("escapes a title containing markup", () => {
      const html = renderSearchHit({
        url: "/x",
        title: "<script>alert(1)</script>",
        excerpt: "",
        source: "pagefind",
      });
      expect(html).not.toContain("<script>");
    });

    it("rejects a hit with an unusable URL", () => {
      const html = renderSearchHit({
        url: "javascript:alert(1)",
        title: "bad",
        excerpt: "",
        source: "pagefind",
      });
      expect(html).toBe("<div>Invalid result</div>");
    });
  });

  describe("searchPagefind", () => {
    beforeEach(() => {
      pagefindMock.options.mockResolvedValue(undefined);
      pagefindMock.search.mockResolvedValue({ results: [] });
    });

    it("returns [] for an empty query without touching the index", async () => {
      expect(await searchPagefind("")).toEqual([]);
      expect(await searchPagefind("   ")).toEqual([]);
      expect(pagefindMock.search).not.toHaveBeenCalled();
    });

    it("maps results, preferring the frontmatter title and clean permalink", async () => {
      pagefindMock.search.mockResolvedValue({
        results: [
          {
            data: async () => ({
              url: "/kettlebell.html",
              meta: { title: "Kettlebells - A rock with a handle" },
              excerpt: "a <mark>rock</mark> with a handle",
            }),
          },
        ],
      });

      const results = await searchPagefind("kettlebell");
      expect(results).toHaveLength(1);
      expect(results[0].url).toBe("/kettlebell");
      expect(results[0].title).toBe("Kettlebells - A rock with a handle");
      expect(results[0].source).toBe("pagefind");
    });

    it("honors the result limit", async () => {
      pagefindMock.search.mockResolvedValue({
        results: Array.from({ length: 25 }, (_, i) => ({
          data: async () => ({ url: `/p${i}.html`, meta: { title: `P${i}` }, excerpt: "" }),
        })),
      });

      expect(await searchPagefind("x", 5)).toHaveLength(5);
    });

    it("degrades to [] when the index is missing rather than throwing", async () => {
      // Exactly the situation on a dev server that hasn't run `just build-search`.
      // Search must fall back to title-only, not blow up.
      pagefindMock.options.mockRejectedValue(new Error("index not built"));
      await expect(searchPagefind("kettlebell")).resolves.toEqual([]);
    });
  });

  describe("searchTitles", () => {
    // Exercises the real MiniSearch index against a stubbed title JSON.
    beforeEach(() => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [
            { t: "Kettlebells - A rock with a handle", u: "/kettlebell" },
            { t: "Igor's Eulogy", u: "/eulogy" },
            { t: "Emotional Health Practices", u: "/emotional-health" },
          ],
        }),
      );
    });

    it("returns [] for an empty query", async () => {
      expect(await searchTitles("")).toEqual([]);
    });

    it("finds an exact title match", async () => {
      const results = await searchTitles("eulogy");
      expect(results.map((r) => r.url)).toContain("/eulogy");
    });

    it("recovers from a typo — the whole reason this index exists", async () => {
      const results = await searchTitles("ketlebell");
      expect(results.map((r) => r.url)).toContain("/kettlebell");
    });

    it("tags results as title-sourced so the renderer escapes them", async () => {
      const results = await searchTitles("eulogy");
      expect(results[0].source).toBe("title");
    });

    it("degrades to [] when the title index is unreachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
      await expect(searchTitles("eulogy")).resolves.toEqual([]);
    });
  });

  describe("searchBlog", () => {
    beforeEach(() => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [
            { t: "Kettlebells - A rock with a handle", u: "/kettlebell" },
            { t: "Igor's Eulogy", u: "/eulogy" },
          ],
        }),
      );
    });

    it("returns [] for an empty query", async () => {
      expect(await searchBlog("")).toEqual([]);
    });

    it("still returns title hits when Pagefind is unavailable", async () => {
      const results = await searchBlog("ketlebell");
      expect(results.map((r) => r.url)).toContain("/kettlebell");
    });

    it("does not return the same URL twice", async () => {
      const results = await searchBlog("eulogy");
      const urls = results.map((r) => r.url);
      expect(urls.length).toBe(new Set(urls).size);
    });

    it("respects the result limit", async () => {
      const results = await searchBlog("a", 1);
      expect(results.length).toBeLessThanOrEqual(1);
    });
  });

  describe("CreateAutoComplete", () => {
    it("initializes the widget against the given container", async () => {
      const result = await CreateAutoComplete("autocomplete");

      expect(window["@algolia/autocomplete-js"].autocomplete).toHaveBeenCalledWith(
        expect.objectContaining({
          container: "#autocomplete",
          placeholder: expect.any(String),
          getSources: expect.any(Function),
          debug: false,
          openOnFocus: true,
          detachedMediaQuery: "",
        }),
      );
      expect(result).toBe(mockAutocompleteInstance);
    });

    it("accepts the container id with or without a leading #", async () => {
      await CreateAutoComplete("#autocomplete");
      expect(window["@algolia/autocomplete-js"].autocomplete).toHaveBeenCalledWith(
        expect.objectContaining({ container: "#autocomplete" }),
      );
    });

    it("bails out when the container is not on the page", async () => {
      const result = await CreateAutoComplete("nonexistent");
      expect(console.log).toHaveBeenCalledWith("No autocomplete element found", "autocomplete_id", "nonexistent");
      expect(result).toBeUndefined();
    });

    it("shows recent and random posts when the query is empty", async () => {
      await CreateAutoComplete("autocomplete");
      const { getSources } = vi.mocked(window["@algolia/autocomplete-js"].autocomplete).mock.calls[0][0];

      const sources = getSources({ query: "" });
      expect(sources.map((s) => s.sourceId)).toEqual(["recent_posts", "random_posts"]);
    });

    it("switches to search results once there is a query", async () => {
      await CreateAutoComplete("autocomplete");
      const { getSources } = vi.mocked(window["@algolia/autocomplete-js"].autocomplete).mock.calls[0][0];

      const sources = getSources({ query: "kettlebell" });
      expect(sources).toHaveLength(1);
      expect(sources[0].sourceId).toBe("featured_posts");
    });
  });
});
