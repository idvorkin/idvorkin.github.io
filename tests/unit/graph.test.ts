import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as shared from "../../src/shared";

// Mock imports and global objects
vi.mock("../../src/shared", () => ({
  get_link_info: vi.fn(),
  MakeBackLinkHTML: vi.fn(),
}));

describe("Graph Module", () => {
  let mockUrlInfo;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Mock console methods
    console.log = vi.fn();

    // Set up test DOM
    document.body.innerHTML = `
      <div id="graph"></div>
      <div id="detail"></div>
    `;

    // Create mock URL info
    mockUrlInfo = {
      "/test-page": {
        url: "/test-page",
        title: "Test Page",
        description: "A test page",
        outgoing_links: ["/linked-page"],
        incoming_links: ["/incoming-page"],
        doc_size: 100,
      },
      "/linked-page": {
        url: "/linked-page",
        title: "Linked Page",
        description: "A linked page",
        outgoing_links: [],
        incoming_links: ["/test-page"],
        doc_size: 50,
      },
      "/incoming-page": {
        url: "/incoming-page",
        title: "Incoming Page",
        description: "An incoming page",
        outgoing_links: ["/test-page"],
        incoming_links: [],
        doc_size: 75,
      },
      "/eulogy": {
        url: "/eulogy",
        title: "Eulogy",
        description: "Eulogy page",
        outgoing_links: [],
        incoming_links: [],
        doc_size: 200,
      },
    };

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        href: "https://example.com",
        hash: "#test-page",
      },
      writable: true,
    });

    // Mock shared.get_link_info to return mockUrlInfo
    vi.mocked(shared.get_link_info).mockResolvedValue(mockUrlInfo);

    // Mock shared.MakeBackLinkHTML
    vi.mocked(shared.MakeBackLinkHTML).mockReturnValue(
      "<div>Mock backlink HTML</div>"
    );

    // We need to mock the ForceGraph global
    global.ForceGraph = vi.fn().mockReturnValue(
      vi.fn().mockReturnValue({
        graphData: vi.fn().mockReturnThis(),
        nodeLabel: vi.fn().mockReturnThis(),
        nodeAutoColorBy: vi.fn().mockReturnThis(),
        nodeCanvasObject: vi.fn().mockReturnThis(),
        nodePointerAreaPaint: vi.fn().mockReturnThis(),
        onNodeRightClick: vi.fn().mockReturnThis(),
        onNodeClick: vi.fn().mockReturnThis(),
        centerAt: vi.fn(),
        zoom: vi.fn(),
      })
    );

    // Mock jQuery
    global.$ = vi.fn().mockImplementation(selector => {
      return {
        on: vi.fn(),
        length: selector === "#test-element" ? 1 : 0,
      };
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should log that Force Graph is loaded", async () => {
    // Since we can't easily test the internal functions directly,
    // we'll just verify that the module loads and the console.log is called
    await import("../../src/graph");

    // Verify that console.log was called with the expected message
    expect(console.log).toHaveBeenCalledWith("Load force graph in TS v 0.9");
  });
});
