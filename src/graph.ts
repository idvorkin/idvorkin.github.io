//
//  graph.ts - Interactive graph visualization for blog posts
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS v 0.9");
import { MakeBackLinkHTML, get_link_info } from "./shared";
//import ForceGraph from "force-graph";

// Define variables that are used but not declared
interface ForceGraphInstance {
  graphData: (data: { nodes: unknown[]; links: unknown[] }) => ForceGraphInstance;
  centerAt: (x: number, y: number, duration: number) => ForceGraphInstance;
  zoom: (scale: number, duration: number) => ForceGraphInstance;
  onNodeClick: (callback: (node: unknown) => void) => ForceGraphInstance;
  nodeCanvasObject: (
    callback: (node: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => void,
  ) => ForceGraphInstance;
  nodePointerAreaPaint: (
    callback: (node: unknown, color: string, ctx: CanvasRenderingContext2D) => void,
  ) => ForceGraphInstance;
  onNodeRightClick: (callback: (node: unknown) => void) => ForceGraphInstance;
  nodeLabel: (label: string) => ForceGraphInstance;
  nodeAutoColorBy: (property: string) => ForceGraphInstance;
}

declare let ForceGraph: () => (element: HTMLElement) => ForceGraphInstance;

/**
 * Checks if a URL is present in the list of pages
 * @param pages Array of page objects
 * @param url URL to check
 * @returns true if URL exists in pages
 */
export function is_valid_url(pages, url) {
  if (typeof url !== "string") {
    console.log("Invalid URL type:", typeof url);
    return false;
  }

  // Check if the exact URL exists in pages
  if (pages.map((p) => p.url).includes(url)) {
    return true;
  }

  // Try more flexible matching for URLs that might have different formats
  // e.g., with or without trailing slashes, or with different prefixes
  const normalizedUrl = url.replace(/^\//, "").replace(/\/$/, "");
  const normalizedPageUrls = pages.map((p) => p.url.replace(/^\//, "").replace(/\/$/, ""));

  return normalizedPageUrls.includes(normalizedUrl);
}

/**
 * Find a node in pages by URL
 * @param pages Array of page objects
 * @param url URL to find
 * @returns Page object or undefined if not found
 */
export function node_for_url(pages, url) {
  // First try exact match
  const exactMatch = pages.filter((p) => p.url === url)[0];
  if (exactMatch) {
    return exactMatch;
  }

  // Try normalized match (without leading/trailing slashes)
  const normalizedUrl = url.replace(/^\//, "").replace(/\/$/, "");
  const normalizedMatch = pages.filter((p) => p.url.replace(/^\//, "").replace(/\/$/, "") === normalizedUrl)[0];

  return normalizedMatch;
}

/**
 * Build links between pages based on outgoing and incoming links
 * @param pages Array of page objects
 * @returns Array of link objects {source, target, value}
 */
export function build_links(pages) {
  // build links
  const links = [];

  // Regular link building for multiple expanded pages
  for (const page of pages) {
    // Ensure we have arrays even if they're undefined in the data
    const outgoingLinks = page.outgoing_links || [];
    const incomingLinks = page.incoming_links || [];

    // Get all combined links
    const combinedLinks = [...outgoingLinks, ...incomingLinks];

    // Check if each link is valid and add it
    for (const targetUrl of combinedLinks) {
      // Try to find the target node
      const targetNode = node_for_url(g_pages, targetUrl);
      if (targetNode) {
        links.push({ source: page, target: targetUrl, value: 1 });
      }
    }

    // Check if we added any links for this page
    const pageLinks = links.filter((link) => link.source === page);

    if (pageLinks.length === 0 && page.url === "/eulogy") {
      console.log(`No valid links found for ${page.url}`);
    }
  }

  return links;
}

/**
 * Build graph data from pages, showing only expanded pages and their links
 * @param pages Array of page objects
 * @returns Object with nodes and links arrays
 */
export function build_graph_data(pages) {
  const visible_pages = pages.filter((page) => page.expanded);

  // Find eulogy node and check its links
  const eulogyNode = pages.find((p) => p.url === "/eulogy");
  if (!eulogyNode) {
    console.log("Eulogy node not found in pages");
  }

  const visible_links = build_links(visible_pages);

  const newly_visible_pages = visible_links.map((l) => node_for_url(pages, l.target)).filter((node) => node); // Filter out nulls/undefined

  // update visible pages with newly visible ones
  const combined_pages = visible_pages.concat(newly_visible_pages);

  return {
    nodes: combined_pages,
    links: visible_links,
  };
}

/**
 * Render node labels on canvas
 * @param node Node object to render
 * @param ctx Canvas context
 * @param globalScale Current zoom scale
 */
export function TextLabelNodeCanvas(node, ctx, globalScale: number) {
  const outgoingCount = node.outgoing_links.length;
  const expandedText = node.expanded ? "-" : `+${outgoingCount}`;
  const label = `${node.id} [${expandedText}]`;
  const fontSize = 12 / globalScale;
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(label).width;
  const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = node.color;
  ctx.fillText(label, node.x, node.y);

  node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
}

/**
 * Paint node pointer area
 * @param node Node object
 * @param color Color to fill with
 * @param ctx Canvas context
 */
export function TextLabelNodePointerAreaPaint(node, color, ctx) {
  ctx.fillStyle = color;
  const bckgDimensions = node.__bckgDimensions;
  bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
}

// Variables used in the graph module
let g_pages = [];
let g_last_detail_node = null;
let Graph = null;

/**
 * Centers the graph on a node and updates detail view
 * @param node Node to center on
 */
export function center_on_node(node) {
  if (!Graph) {
    console.log("Cannot center: Graph not initialized");
    return;
  }
  if (!node) {
    console.log("Cannot center: Node is null or undefined");
    return;
  }

  Graph.centerAt(node.x, node.y, 500);
  Graph.zoom(8, 500);
  update_detail(node);
}

/**
 * Updates the detail panel with node information
 * @param page Node to display details for
 */
export function update_detail(page) {
  if (!page) {
    return;
  }

  // replace html of element of id above with the page
  g_last_detail_node = page;
  const html = MakeBackLinkHTML(page);

  const detail = document.getElementById("detail");
  if (detail) {
    detail.innerHTML = html;
  }
}

/**
 * Opens the current node in a new tab
 */
export function open_goto_control() {
  if (g_last_detail_node) {
    if (g_last_detail_node.url) {
      window.open(g_last_detail_node.url, "_blank");
    } else {
      console.log("Active node has no URL");
    }
  } else {
    console.log("No active node to go to");
  }
}

/**
 * Collapses all nodes except the active node
 */
export function collapse_all_except_active() {
  for (const p of g_pages) {
    p.expanded = false;
  }
  if (g_last_detail_node) {
    g_last_detail_node.expanded = true;
  }
  if (Graph) {
    Graph.graphData(build_graph_data(g_pages));

    // Center on the active node after collapsing
    if (g_last_detail_node) {
      setTimeout(() => {
        center_on_node(g_last_detail_node);
      }, 300);
    }
  }
}

/**
 * Initialize the graph visualization
 */
export async function initializeGraph() {
  // Exit early if we're not on a page with a graph
  const graphElement = document.getElementById("graph");
  if (!graphElement) {
    console.log("Graph element not found, exiting initialization");
    return;
  }

  const first_expanded = window.location.hash.substr(1);

  // Uncollapse any page wtih the url == eulogy
  function is_initial_expanded(node) {
    if (node.url === first_expanded) {
      return true;
    }
    return false;
  }

  g_pages = Object.values(await get_link_info()).map((p) => ({
    ...p,
    id: p.url,
    expanded: false,
  }));

  const slug = `/${window.location.hash ? window.location.hash.substr(1) : ""}`;

  const initial_expanded_url = g_pages.map((p) => p.url).includes(slug) ? slug : "/eulogy";

  for (const p of g_pages) {
    p.expanded = p.url === initial_expanded_url;
  }

  // If ForceGraph isn't defined, provide fallback functionality
  if (typeof ForceGraph === "undefined") {
    console.log("Force Graph not defined, providing fallback functionality");

    // Still initialize the detail panel with the initial node for testing
    const initialNode = node_for_url(g_pages, initial_expanded_url);
    if (initialNode) {
      update_detail(initialNode);
      g_last_detail_node = initialNode;
    }

    // Set up basic control handlers even without the graph
    const centerControl = document.getElementById("center_control");
    if (centerControl) {
      centerControl.addEventListener("click", () => {
        console.log("Center control clicked (fallback mode)");
      });
    }

    const gotoControl = document.getElementById("goto_control");
    if (gotoControl) {
      gotoControl.addEventListener("click", () => {
        if (g_last_detail_node?.url) {
          window.open(g_last_detail_node.url, "_blank");
        }
      });
    }

    const collapseControl = document.getElementById("collapse_control");
    if (collapseControl) {
      collapseControl.addEventListener("click", () => {
        console.log("Collapse control clicked (fallback mode)");
      });
    }

    return;
  }

  Graph = ForceGraph()(document.getElementById("graph"))
    .graphData(build_graph_data(g_pages))
    .nodeLabel("id")
    .nodeAutoColorBy("group")
    .nodeCanvasObject(TextLabelNodeCanvas)
    .nodePointerAreaPaint(TextLabelNodePointerAreaPaint)
    .onNodeRightClick((node: any) => {
      // Open the node in a new tab
      window.open(node.url, "_blank");
    })
    .onNodeClick((node: any) => {
      // count expanded nodes
      node.expanded = !node.expanded;
      const expanded_nodes = g_pages.filter((p) => p.expanded).length;
      if (expanded_nodes === 0) {
        // re-expand me.
        node.expanded = true;
      }
      Graph.graphData(build_graph_data(g_pages));

      // center on node in 300 ms, post graph update
      setTimeout(() => {
        center_on_node(node);
      }, 300);
    });

  const initialNode = node_for_url(g_pages, initial_expanded_url);
  if (initialNode) {
    center_on_node(initialNode);
  } else {
    console.log("Initial node not found, cannot center");
  }

  // set click handler for center control
  const centerControl = document.getElementById("center_control");
  if (centerControl) {
    centerControl.addEventListener("click", () => {
      if (g_last_detail_node) {
        center_on_node(g_last_detail_node);
      } else {
        console.log("No last detail node to center on");
      }
    });
  } else {
    console.log("Center control element not found");
  }

  // set click handler for goto control
  const gotoControl = document.getElementById("goto_control");
  if (gotoControl) {
    gotoControl.addEventListener("click", open_goto_control);
  }

  // set click handler for collapse control
  const collapseControl = document.getElementById("collapse_control");
  if (collapseControl) {
    collapseControl.addEventListener("click", collapse_all_except_active);
  }
}

// Make initializeGraph available in the global scope if needed for testing
declare global {
  interface Window {
    initializeGraph: () => Promise<void>;
  }
}

if (typeof window !== "undefined") {
  window.initializeGraph = initializeGraph;
}
