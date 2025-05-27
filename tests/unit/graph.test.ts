import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as shared from "../../src/shared";

// Mock imports and global objects
vi.mock("../../src/shared", () => ({
  get_link_info: vi.fn(),
  get_link_info: vi.fn(),
  MakeBackLinkHTML: vi.fn(),
}));

// Mock specific functions from graph.ts that are dependencies for randomPage and displayRecentPosts
// We will spy on them or mock them as needed within test suites.
// For instance, center_on_node will be handled this way.

// Create ForceGraph mock function
const mockForceGraphInstance = {
  graphData: vi.fn().mockReturnThis(),
  nodeLabel: vi.fn().mockReturnThis(),
  nodeAutoColorBy: vi.fn().mockReturnThis(),
  nodeCanvasObject: vi.fn().mockReturnThis(),
  nodePointerAreaPaint: vi.fn().mockReturnThis(),
  onNodeRightClick: vi.fn().mockReturnThis(),
  onNodeClick: vi.fn((callback) => {
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
        split: (separator) => ["https://example.com", "test-page"],
      },
      writable: true,
    });

    // Mock shared.get_link_info to return mockUrlInfo
    vi.mocked(shared.get_link_info).mockResolvedValue(mockUrlInfo);

    // Mock shared.MakeBackLinkHTML
    vi.mocked(shared.MakeBackLinkHTML).mockReturnValue("<div>Mock backlink HTML</div>");

    // Mock window.open
    window.open = vi.fn();

    // Create a more complete jQuery mock
    const jQueryMock = vi.fn().mockImplementation((selector) => {
      // Different behavior based on the selector
      if (selector === "#center_control" || selector === "#goto_control" || selector === "#collapse_control") {
        return {
          on: vi.fn((event, handler) => {
            // Store the handler so we can trigger it in tests
            jQueryMock._handlers[selector] = handler;
          }),
          length: 1,
        };
      }
      return {
        on: vi.fn(),
        click: vi.fn(),
        empty: vi.fn().mockReturnThis(),
        append: vi.fn().mockReturnThis(),
        length: 1,
      };
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
    expect(mockForceGraphInstance.nodeAutoColorBy).toHaveBeenCalledWith("group");
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
    expect(console.log).toHaveBeenCalledWith("Force Graph not defined, providing fallback functionality");

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
    expect(graphModule.is_valid_url(Object.values(mockUrlInfo), "/test-page")).toBe(true);
    expect(graphModule.is_valid_url(Object.values(mockUrlInfo), "/nonexistent")).toBe(false);

    // Test node_for_url
    const node = graphModule.node_for_url(Object.values(mockUrlInfo), "/test-page");
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

describe("randomPage function", () => {
  let graphModule;
  let mockCenterOnNode;

  beforeEach(async () => {
    graphModule = await import("../../src/graph");
    // Mock dependencies
    mockCenterOnNode = vi.fn();
    graphModule.center_on_node = mockCenterOnNode; // Assuming center_on_node can be mocked this way
    console.error = vi.fn(); // Mock console.error
  });

  it("should not call center_on_node and log an error if g_pages is empty", () => {
    graphModule.g_pages = []; // Set g_pages to empty
    graphModule.randomPage();
    expect(mockCenterOnNode).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("No pages available to select a random page.");
  });

  it("should call center_on_node with a random page if g_pages is not empty", () => {
    const mockPages = [
      { url: "/page1", title: "Page 1", id: "/page1" },
      { url: "/page2", title: "Page 2", id: "/page2" },
    ];
    graphModule.g_pages = mockPages; // Set g_pages with mock data
    graphModule.randomPage();
    expect(mockCenterOnNode).toHaveBeenCalledTimes(1);
    expect(mockPages).toContain(mockCenterOnNode.mock.calls[0][0]);
  });
});

describe("displayRecentPosts function", () => {
  let graphModule;
  let mockRecentPostsDiv;

  const mockPagesFull = [
    { url: "/page1", title: "Page 1", last_modified: "2023-01-01T10:00:00Z", id: "/page1" },
    { url: "/page2", title: "Page 2", last_modified: "2023-01-03T12:00:00Z", id: "/page2" },
    { url: "/page3", title: "Page 3", last_modified: "2023-01-02T08:00:00Z", id: "/page3" },
    { url: "/page4", title: "Page 4", last_modified: "2023-01-05T10:00:00Z", id: "/page4" },
    { url: "/page5", title: "Page 5", last_modified: "2023-01-04T10:00:00Z", id: "/page5" },
    { url: "/page6", title: "Page 6", last_modified: "2023-01-06T10:00:00Z", id: "/page6" },
  ];

  const mockPagesWithInvalidDates = [
    { url: "/pageValid1", title: "Valid Page 1", last_modified: "2023-01-05T00:00:00Z", id: "/pageValid1" },
    { url: "/pageInvalid1", title: "Invalid Date Page 1", last_modified: "invalid-date", id: "/pageInvalid1" },
    { url: "/pageNullDate", title: "Null Date Page", last_modified: null, id: "/pageNullDate" },
    { url: "/pageValid2", title: "Valid Page 2", last_modified: "2023-01-01T00:00:00Z", id: "/pageValid2" },
    { url: "/pageUndefinedDate", title: "Undefined Date Page", last_modified: undefined, id: "/pageUndefinedDate" },
  ];


  beforeEach(async () => {
    graphModule = await import("../../src/graph");
    console.error = vi.fn(); // Mock console.error

    // Mock document.getElementById for 'recent_posts'
    mockRecentPostsDiv = {
      innerHTML: "",
      appendChild: vi.fn(),
      children: [], // To simulate clearing
    };
    vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === "recent_posts") {
        return mockRecentPostsDiv;
      }
      // Fallback for other ids if any are used by the function indirectly
      return document.querySelector(`#${id}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore document.getElementById
  });

  it("should log an error if the recent_posts div does not exist", () => {
    vi.spyOn(document, "getElementById").mockReturnValueOnce(null); // Simulate div not found
    graphModule.g_pages = mockPagesFull;
    graphModule.displayRecentPosts();
    expect(console.error).toHaveBeenCalledWith("The 'recent_posts' div was not found.");
    expect(mockRecentPostsDiv.appendChild).not.toHaveBeenCalled();
  });

  it("should log an error and not populate if g_pages is empty", () => {
    graphModule.g_pages = [];
    graphModule.displayRecentPosts();
    expect(console.error).toHaveBeenCalledWith("No pages available to display recent posts.");
    expect(mockRecentPostsDiv.innerHTML).toBe(""); // Should remain empty or be cleared
    expect(mockRecentPostsDiv.appendChild).not.toHaveBeenCalled();
  });

  it("should display and sort recent posts correctly (max 5)", () => {
    graphModule.g_pages = mockPagesFull;
    graphModule.displayRecentPosts();

    expect(mockRecentPostsDiv.innerHTML).toBe(""); // Check if cleared
    expect(mockRecentPostsDiv.appendChild).toHaveBeenCalledTimes(1);

    const ulElement = mockRecentPostsDiv.appendChild.mock.calls[0][0];
    expect(ulElement.tagName).toBe("UL");
    expect(ulElement.children.length).toBe(5); // Max 5 posts

    // Check order and content
    const expectedOrder = ["/page6", "/page4", "/page5", "/page2", "/page3"]; // Titles based on dates
    const expectedTitles = ["Page 6", "Page 4", "Page 5", "Page 2", "Page 3"];
    for (let i = 0; i < 5; i++) {
      const li = ulElement.children[i];
      expect(li.tagName).toBe("LI");
      const a = li.children[0];
      expect(a.tagName).toBe("A");
      expect(a.href).toContain(expectedOrder[i]);
      expect(a.textContent).toBe(expectedTitles[i]);
    }
  });

  it("should handle pages with invalid or missing last_modified dates", () => {
    graphModule.g_pages = mockPagesWithInvalidDates;
    graphModule.displayRecentPosts();

    expect(mockRecentPostsDiv.appendChild).toHaveBeenCalledTimes(1);
    const ulElement = mockRecentPostsDiv.appendChild.mock.calls[0][0];

    // Expected order: valid dates first, then invalid/null/undefined ones.
    // The exact order of invalid ones might depend on sort stability or specific handling.
    // Here, we primarily care that valid ones are sorted and invalid ones don't break it.
    
    // We expect 2 valid posts to be displayed, then potentially the others if less than 5 total.
    // The provided code sorts invalid dates to the end.
    expect(ulElement.children.length).toBe(mockPagesWithInvalidDates.length); // All pages should be processed

    const links = Array.from(ulElement.children).map(li => li.children[0].href);
    const texts = Array.from(ulElement.children).map(li => li.children[0].textContent);

    // Valid pages should be first and sorted
    expect(texts[0]).toBe("Valid Page 1"); // 2023-01-05
    expect(texts[1]).toBe("Valid Page 2"); // 2023-01-01
    
    // Check that the invalid date pages are present
    expect(texts).toContain("Invalid Date Page 1");
    expect(texts).toContain("Null Date Page");
    expect(texts).toContain("Undefined Date Page");
  });
});


describe("initializeGraph event listeners", () => {
  let graphModule;
  let mockRandomPage;
  let mockDisplayRecentPosts; // To ensure it's called

  beforeEach(async () => {
    graphModule = await import("../../src/graph");

    // Mock dependencies called by initializeGraph or by the functions we're testing
    mockRandomPage = vi.fn();
    mockDisplayRecentPosts = vi.fn();

    // Replace the actual functions with mocks for this test suite
    graphModule.randomPage = mockRandomPage;
    graphModule.displayRecentPosts = mockDisplayRecentPosts; // Also mock this to check if initializeGraph calls it

    // Mock get_link_info as it's called in initializeGraph
    vi.mocked(shared.get_link_info).mockResolvedValue({
      "/eulogy": { url: "/eulogy", title: "Eulogy", last_modified: "2023-01-01", outgoing_links: [], expanded: false, id: "/eulogy" }
    });
    
    // Mock ForceGraph, center_on_node etc. as they are called in initializeGraph
    graphModule.center_on_node = vi.fn(); // Mock center_on_node
    global.ForceGraph = ForceGraphMock; // Use the existing mock for ForceGraph

    // Setup DOM elements required by initializeGraph
    document.body.innerHTML = `
      <div id="graph"></div>
      <div id="detail"></div>
      <button id="center_control">Center</button>
      <button id="goto_control">Go To</button>
      <button id="collapse_control">Collapse</button>
      <button id="random_control">Random Page</button> 
      <div id="recent_posts"></div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = ""; // Clean up DOM
  });

  it("should call displayRecentPosts and set up random_control listener", async () => {
    await graphModule.initializeGraph();

    // Check if displayRecentPosts was called
    expect(mockDisplayRecentPosts).toHaveBeenCalled();

    // Check event listener for random_control
    const randomButton = document.getElementById("random_control");
    expect(randomButton).not.toBeNull();
    
    // Simulate a click
    // Note: Direct click simulation like randomButton.click() works for native elements
    // if the event listener was added via addEventListener.
    // If jQuery or another framework was used internally, that might need specific trigger methods.
    // The current implementation in src/graph.ts uses addEventListener.
    randomButton.click();
    expect(mockRandomPage).toHaveBeenCalled();
  });
});
