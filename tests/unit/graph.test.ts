import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as shared from "../../src/shared";

// Mock imports and global objects
vi.mock("../../src/shared", () => ({
  get_link_info: vi.fn(),
  MakeBackLinkHTML: vi.fn(),
}));

// Create ForceGraph mock function
const mockForceGraphInstance = {
  graphData: vi.fn().mockReturnThis(),
  nodeLabel: vi.fn().mockReturnThis(),
  nodeAutoColorBy: vi.fn().mockReturnThis(),
  nodeCanvasObject: vi.fn().mockReturnThis(),
  nodePointerAreaPaint: vi.fn().mockReturnThis(),
  onNodeRightClick: vi.fn().mockReturnThis(),
  onNodeClick: vi.fn(callback => {
    // Store the callback so we can trigger it in tests
    mockForceGraphInstance._nodeClickCallback = callback;
    return mockForceGraphInstance;
  }),
  centerAt: vi.fn(),
  zoom: vi.fn(),
  _nodeClickCallback: null,
};

const mockForceGraphGenerator = vi.fn().mockReturnValue(mockForceGraphInstance);
const ForceGraphMock = vi.fn().mockReturnValue(mockForceGraphGenerator);

// Stub the global ForceGraph variable
vi.stubGlobal("ForceGraph", ForceGraphMock);

describe("Graph Module", () => {
  let mockUrlInfo;
  let mockNode;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Mock console methods
    console.log = vi.fn();

    // Set up test DOM
    document.body.innerHTML = `
      <div id="graph"></div>
      <div id="detail"></div>
      <button id="center_control">Center</button>
      <button id="goto_control">Go To</button>
      <button id="collapse_control">Collapse</button>
    `;

    // Create mock URL info with more complete properties
    mockUrlInfo = {
      "/test-page": {
        url: "/test-page",
        title: "Test Page",
        description: "A test page",
        outgoing_links: ["/linked-page"],
        incoming_links: ["/incoming-page"],
        doc_size: 100,
        expanded: false,
        file_path: "/test-page.md",
        redirect_url: null,
        last_modified: "2023-01-01",
      },
      "/linked-page": {
        url: "/linked-page",
        title: "Linked Page",
        description: "A linked page",
        outgoing_links: [],
        incoming_links: ["/test-page"],
        doc_size: 50,
        expanded: false,
        file_path: "/linked-page.md",
        redirect_url: null,
        last_modified: "2023-01-02",
      },
      "/incoming-page": {
        url: "/incoming-page",
        title: "Incoming Page",
        description: "An incoming page",
        outgoing_links: ["/test-page"],
        incoming_links: [],
        doc_size: 75,
        expanded: false,
        file_path: "/incoming-page.md",
        redirect_url: null,
        last_modified: "2023-01-03",
      },
      "/eulogy": {
        url: "/eulogy",
        title: "Eulogy",
        description: "Eulogy page",
        outgoing_links: [],
        incoming_links: [],
        doc_size: 200,
        expanded: false,
        file_path: "/eulogy.md",
        redirect_url: null,
        last_modified: "2023-01-04",
      },
    };

    // Create a mock node for testing
    mockNode = {
      ...mockUrlInfo["/test-page"],
      id: "/test-page",
      x: 100,
      y: 100,
      color: "red",
      __bckgDimensions: [100, 20],
    };

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        href: "https://example.com#test-page",
        hash: "#test-page",
        split: separator => ["https://example.com", "test-page"],
      },
      writable: true,
    });

    // Mock shared.get_link_info to return mockUrlInfo
    vi.mocked(shared.get_link_info).mockResolvedValue(mockUrlInfo);

    // Mock shared.MakeBackLinkHTML
    vi.mocked(shared.MakeBackLinkHTML).mockReturnValue(
      "<div>Mock backlink HTML</div>"
    );

    // Mock window.open
    window.open = vi.fn();

    // Create a more complete jQuery mock
    const jQueryMock = vi.fn().mockImplementation(selector => {
      // Different behavior based on the selector
      if (
        selector === "#center_control" ||
        selector === "#goto_control" ||
        selector === "#collapse_control"
      ) {
        return {
          on: vi.fn((event, handler) => {
            // Store the handler so we can trigger it in tests
            jQueryMock._handlers[selector] = handler;
          }),
          length: 1,
        };
      } else {
        return {
          on: vi.fn(),
          click: vi.fn(),
          empty: vi.fn().mockReturnThis(),
          append: vi.fn().mockReturnThis(),
          length: 1,
        };
      }
    });

    // Add handlers storage
    jQueryMock._handlers = {};

    // Mock the trigger method to manually trigger event handlers in tests
    jQueryMock.trigger = (selector, event) => {
      const handler = jQueryMock._handlers[selector];
      if (handler) {
        handler(event);
      }
    };

    global.$ = jQueryMock;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should log that Force Graph is loaded", async () => {
    // Import the module to test
    const graphModule = await import("../../src/graph");

    // Verify that console.log was called with the expected message
    expect(console.log).toHaveBeenCalledWith("Load force graph in TS v 0.9");
  });

  it.skip("should initialize the graph when the DOM element exists", async () => {
    // This test needs more work to properly mock the ForceGraph function chain
    // Import and run the initialize function
    const graphModule = await import("../../src/graph");
    await graphModule.initializeGraph();

    // Check that ForceGraph was called
    expect(ForceGraphMock).toHaveBeenCalled();

    // Check that graphData was called with some data
    expect(mockForceGraphInstance.graphData).toHaveBeenCalled();

    // Verify all the other method calls
    expect(mockForceGraphInstance.nodeLabel).toHaveBeenCalledWith("id");
    expect(mockForceGraphInstance.nodeAutoColorBy).toHaveBeenCalledWith(
      "group"
    );
    expect(mockForceGraphInstance.nodeCanvasObject).toHaveBeenCalled();
    expect(mockForceGraphInstance.nodePointerAreaPaint).toHaveBeenCalled();
    expect(mockForceGraphInstance.onNodeRightClick).toHaveBeenCalled();
    expect(mockForceGraphInstance.onNodeClick).toHaveBeenCalled();
  });

  it("should not initialize the graph when the DOM element doesn't exist", async () => {
    // Remove the graph element
    document.body.innerHTML = "";

    // Import and run the initialize function
    const graphModule = await import("../../src/graph");
    await graphModule.initializeGraph();

    // ForceGraph should not be called
    expect(ForceGraphMock).not.toHaveBeenCalled();
  });

  it("should handle ForceGraph not being defined", async () => {
    // Save the original ForceGraph
    const originalForceGraph = global.ForceGraph;

    // Set ForceGraph to undefined
    global.ForceGraph = undefined;

    // Import and run the initialize function
    const graphModule = await import("../../src/graph");
    await graphModule.initializeGraph();

    // Check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalledWith(
      "Force Graph not defined, exiting initialization"
    );

    // Restore the original ForceGraph
    global.ForceGraph = originalForceGraph;
  });

  it("should handle node canvas object rendering", async () => {
    // Import the graph module explicitly
    const graphModule = await import("../../src/graph");

    // Create a mock canvas context
    const ctx = {
      font: "",
      fillStyle: "",
      textAlign: "",
      textBaseline: "",
      measureText: vi.fn().mockReturnValue({ width: 100 }),
      fillRect: vi.fn(),
      fillText: vi.fn(),
    };

    // Call the function with mock parameters
    graphModule.TextLabelNodeCanvas(mockNode, ctx, 1);

    // Check that the context was properly set up
    expect(ctx.font).toBe("12px Sans-Serif");
    expect(ctx.fillStyle).toBe("red");
    expect(ctx.textAlign).toBe("center");
    expect(ctx.textBaseline).toBe("middle");

    // Check that fillRect and fillText were called
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();

    // Check that the node's __bckgDimensions was set
    expect(mockNode.__bckgDimensions).toBeDefined();
  });

  it("should handle goto control click", async () => {
    // Import the module directly
    const graphModule = await import("../../src/graph");

    // Manually set the last detail node
    graphModule.update_detail(mockNode);

    // Call the goto function directly
    graphModule.open_goto_control();

    // Check that window.open was called with the right URL
    expect(window.open).toHaveBeenCalledWith("/test-page", "_blank");
  });

  it("should build graph data correctly", async () => {
    // Import the graph module
    const graphModule = await import("../../src/graph");

    // Test is_valid_url
    expect(
      graphModule.is_valid_url(Object.values(mockUrlInfo), "/test-page")
    ).toBe(true);
    expect(
      graphModule.is_valid_url(Object.values(mockUrlInfo), "/nonexistent")
    ).toBe(false);

    // Test node_for_url
    const node = graphModule.node_for_url(
      Object.values(mockUrlInfo),
      "/test-page"
    );
    expect(node).toBeDefined();
    expect(node.url).toBe("/test-page");

    // Test build_links
    const testPages = Object.values(mockUrlInfo);
    const links = graphModule.build_links(testPages);
    expect(links.length).toBeGreaterThan(0);

    // Test build_graph_data
    // First set some pages to expanded
    testPages[0].expanded = true; // test-page
    const graphData = graphModule.build_graph_data(testPages);
    expect(graphData.nodes).toBeDefined();
    expect(graphData.links).toBeDefined();
    expect(graphData.nodes.length).toBeGreaterThan(0);
  });

  it("should update detail with node information", async () => {
    // Import the module directly
    const graphModule = await import("../../src/graph");

    // Call update_detail
    graphModule.update_detail(mockNode);

    // Check that MakeBackLinkHTML was called with the right node
    expect(shared.MakeBackLinkHTML).toHaveBeenCalledWith(mockNode);

    // Check that the detail element's innerHTML was set
    const detail = document.getElementById("detail");
    expect(detail.innerHTML).toBe("<div>Mock backlink HTML</div>");
  });
});
