//
//  graph.ts - Interactive graph visualization for blog posts
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS v 0.9");
import { get_link_info, MakeBackLinkHTML } from "./shared";
//import ForceGraph from "force-graph";

// Define variables that are used but not declared
declare var ForceGraph: any;

/**
 * Checks if a URL is present in the list of pages
 * @param pages Array of page objects
 * @param url URL to check
 * @returns true if URL exists in pages
 */
export function is_valid_url(pages, url) {
  // check if the url is in the list of pages
  return pages.map(p => p.url).includes(url);
}

/**
 * Build links between pages based on outgoing and incoming links
 * @param pages Array of page objects
 * @returns Array of link objects {source, target, value}
 */
export function build_links(pages) {
  // build links
  const links = [];
  pages.forEach(page => {
    page.outgoing_links
      .concat(page.incoming_links)
      .filter(url => is_valid_url(pages, url)) // We have lots of dead links, go fix them in the source material
      .forEach(target => {
        links.push({ source: page, target, value: 1 });
      });
  });
  return links;
}

/**
 * Find a node in pages by URL
 * @param pages Array of page objects
 * @param url URL to find
 * @returns Page object or undefined if not found
 */
export function node_for_url(pages, url) {
  return pages.filter(p => p.url == url)[0];
}

/**
 * Build graph data from pages, showing only expanded pages and their links
 * @param pages Array of page objects
 * @returns Object with nodes and links arrays
 */
export function build_graph_data(pages) {
  const visible_pages = pages.filter(page => page.expanded);
  const visible_links = build_links(visible_pages);
  const newly_visible_pages = visible_links.map(l =>
    node_for_url(pages, l.target)
  );
  // update visable pages with newly visible ones
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
  const label = node.id + " [" + expandedText + "]";
  const fontSize = 12 / globalScale;
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(label).width;
  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(
    node.x - bckgDimensions[0] / 2,
    node.y - bckgDimensions[1] / 2,
    ...bckgDimensions
  );

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
  bckgDimensions &&
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      ...bckgDimensions
    );
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
  if (!Graph) return;

  Graph.centerAt(node.x, node.y, 500);
  Graph.zoom(8, 500);
  update_detail(node);
  console.log("centering on", node);
}

/**
 * Updates the detail panel with node information
 * @param page Node to display details for
 */
export function update_detail(page) {
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
  console.log("Goto control clicked");
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
  console.log("Collapse control clicked");
  g_pages.forEach(p => {
    p.expanded = false;
  });
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
  if (!document.getElementById("graph")) {
    return;
  }

  const first_expanded = window.location.hash.substr(1);

  // Uncollapse any page wtih the url == eulogy
  function is_initial_expanded(node) {
    if (node.url == first_expanded) {
      return true;
    }

    return false;
  }

  g_pages = Object.values(await get_link_info()).map(p => ({
    ...p,
    id: p.url,
    expanded: false,
  }));

  const slug = "/" + window.location.href.split("#")[1];
  const initial_expanded_url = g_pages.map(p => p.url).includes(slug)
    ? slug
    : "/eulogy";

  g_pages.forEach(p => {
    p.expanded = p.url == initial_expanded_url;
  });

  // If ForceGraph isn't defined, return
  if (typeof ForceGraph === "undefined") {
    console.log("Force Graph not defined");
    return;
  }

  Graph = ForceGraph()(document.getElementById("graph"))
    .graphData(build_graph_data(g_pages))
    .nodeLabel("id")
    .nodeAutoColorBy("group")
    .nodeCanvasObject(TextLabelNodeCanvas)
    .nodePointerAreaPaint(TextLabelNodePointerAreaPaint)
    .onNodeRightClick(node => {
      // Open the node in a new tab
      window.open(node.url, "_blank");
    })
    .onNodeClick(node => {
      // Center/zoom on node
      console.log(node);

      // count expanded nodes
      node.expanded = !node.expanded;
      const expanded_nodes = g_pages.filter(p => p.expanded).length;
      if (expanded_nodes == 0) {
        // re-expand me.
        node.expanded = true;
      }
      Graph.graphData(build_graph_data(g_pages));

      // center on node in 300 ms, post graph update
      setTimeout(() => {
        center_on_node(node);
      }, 300);
    });

  center_on_node(node_for_url(g_pages, initial_expanded_url));

  // set click handler for center control
  $("#center_control").on("click", () => center_on_node(g_last_detail_node));

  // set click handler for goto control
  $("#goto_control").on("click", open_goto_control);

  // set click handler for collapse control
  $("#collapse_control").on("click", collapse_all_except_active);

  console.log("Post Graph");
}
