import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createLinkTabsHTML,
  createGraphLinkHTML,
  filterAndSortLinks,
  MakeBackLinkHTML,
} from "../main";
import { IURLInfoMap, IURLInfo } from "../shared";

describe("Link Utilities", () => {
  describe("createLinkTabsHTML", () => {
    it("should return HTML with tabs structure", () => {
      const html = createLinkTabsHTML();

      // Verify the HTML contains key elements
      expect(html).toContain('<ul class="nav nav-tabs nav-fill"');
      expect(html).toContain("Links to here");
      expect(html).toContain("Link from here");
      expect(html).toContain("Graph");
      expect(html).toContain('<div class="tab-content"');
      expect(html).toContain('id="incoming"');
      expect(html).toContain('id="outgoing"');
      expect(html).toContain('id="graph"');
    });
  });

  describe("createGraphLinkHTML", () => {
    it("should create a valid graph link with stripped path", () => {
      const pagePath = "/test/path";
      const html = createGraphLinkHTML(pagePath);

      expect(html).toContain("href='/graph#testpath'");
      expect(html).toContain("/test/path (testpath)");
    });

    it("should handle root path correctly", () => {
      const pagePath = "/";
      const html = createGraphLinkHTML(pagePath);

      expect(html).toMatch(/href='\/graph#'>/);
      expect(html).toContain("/ ()");
    });
  });

  describe("filterAndSortLinks", () => {
    let mockURLInfoMap: IURLInfoMap;

    beforeEach(() => {
      // Set up mock URL info map
      mockURLInfoMap = {
        "/page1": {
          url: "/page1",
          title: "Page 1",
          description: "Description 1",
          doc_size: 1000,
          last_modified: "2023-01-01",
          file_path: "page1.md",
          incoming_links: [],
          outgoing_links: [],
          redirect_url: "",
        },
        "/page2": {
          url: "/page2",
          title: "Page 2",
          description: "Description 2",
          doc_size: 3000,
          last_modified: "2023-01-02",
          file_path: "page2.md",
          incoming_links: [],
          outgoing_links: [],
          redirect_url: "",
        },
        "/page3": {
          url: "/page3",
          title: "Page 3",
          description: "Description 3",
          doc_size: 2000,
          last_modified: "2023-01-03",
          file_path: "page3.md",
          incoming_links: [],
          outgoing_links: [],
          redirect_url: "",
        },
      };
    });

    it("should filter out invalid links", () => {
      const links = ["/page1", "/non-existent", "/page2"];
      const result = filterAndSortLinks(links, mockURLInfoMap);

      expect(result).toHaveLength(2);
      expect(result).toContain("/page1");
      expect(result).toContain("/page2");
      expect(result).not.toContain("/non-existent");
    });

    it("should sort links by doc_size in descending order", () => {
      const links = ["/page1", "/page2", "/page3"];
      const result = filterAndSortLinks(links, mockURLInfoMap);

      expect(result).toEqual(["/page2", "/page3", "/page1"]);
    });

    it("should handle empty links array", () => {
      const result = filterAndSortLinks([], mockURLInfoMap);
      expect(result).toEqual([]);
    });

    it("should handle undefined links array", () => {
      const result = filterAndSortLinks(undefined, mockURLInfoMap);
      expect(result).toEqual([]);
    });
  });

  describe("MakeBackLinkHTML", () => {
    it("should create HTML for a link with proper formatting", () => {
      const urlInfo: IURLInfo = {
        url: "/test-page",
        title: "Test Page",
        description: "This is a test page",
        doc_size: 1000,
        last_modified: "2023-01-01",
        file_path: "test.md",
        incoming_links: [],
        outgoing_links: [],
        redirect_url: "",
      };

      const html = MakeBackLinkHTML(urlInfo);

      expect(html).toContain("<a href=/test-page>Test Page</a>");
      expect(html).toContain('class="link-box description truncate-css"');
      expect(html).toContain(
        '<span class="link-description"> This is a test page <span>'
      );
    });

    it("should handle HTML in title and description", () => {
      const urlInfo: IURLInfo = {
        url: "/test",
        title: "<em>Test</em> Title",
        description: "<strong>Description</strong> with HTML",
        doc_size: 1000,
        last_modified: "2023-01-01",
        file_path: "test.md",
        incoming_links: [],
        outgoing_links: [],
        redirect_url: "",
      };

      const html = MakeBackLinkHTML(urlInfo);

      expect(html).toContain("<a href=/test><em>Test</em> Title</a>");
      expect(html).toContain(
        '<span class="link-description"> <strong>Description</strong> with HTML <span>'
      );
    });
  });
});
