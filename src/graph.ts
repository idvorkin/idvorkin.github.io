//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS v 0.9");
import { get_link_info, MakeBackLinkHTML } from "./index";
//import ForceGraph from "force-graph";

// Define variables that are used but not declared
declare var ForceGraph: any;
const first_expanded = window.location.hash.substr(1);

// Pages are the link_infos
// Set id to be the URL.

// Example to make collapsable tree:
// https://github.com/vasturiano/force-graph/blob/master/example/expandable-nodes/index.html

// Uncollapse any page wtih the url == eulogy
function is_initial_expanded(node) {
  if (node.url == first_expanded) {
    return true;
  }

  return false;
}

const pages = Object.values(await get_link_info()).map(p => ({
  ...p,
  id: p.url,
  expanded: false,
}));

const slug = "/" + window.location.href.split("#")[1];
const initial_expanded_url = pages.map(p => p.url).includes(slug)
  ? slug
  : "/eulogy";

pages.forEach(p => {
  p.expanded = p.url == initial_expanded_url;
});

function is_valid_url(url) {
  // check if the url is in the list of pages
  return pages.map(p => p.url).includes(url);
}
function build_links(pages) {
  // build links
  const links = [];
  pages.forEach(page => {
    page.outgoing_links
      .concat(page.incoming_links)
      .filter(is_valid_url) // We have lots of dead links, go fix them in the source material
      .forEach(target => {
        links.push({ source: page, target, value: 1 });
      });

    //page.incoming_links.forEach(target => {
    //links.push({ source: target, target: source, value: 1 });
    //});
  });
  return links;
}

function node_for_url(pages, url) {
  return pages.filter(p => p.url == url)[0];
}

function build_graph_data(pages) {
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

// Make tree collapasable

function TextLabelNodeCanvas(node, ctx, globalScale: number) {
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

function TextLabelNodePointerAreaPaint(node, color, ctx) {
  ctx.fillStyle = color;
  const bckgDimensions = node.__bckgDimensions;
  bckgDimensions &&
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      ...bckgDimensions
    );
}
// If ForceGraph isn't defined, return
console.log("🔍 Checking if ForceGraph is defined:", typeof ForceGraph);

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔄 DOM fully loaded, initializing graph");
  initializeGraph();
});

// Also try to initialize if the script loads after DOMContentLoaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("🔄 Document already loaded, initializing graph immediately");
  setTimeout(initializeGraph, 500); // Short delay to ensure everything is ready
}

function initializeGraph() {
  if (typeof ForceGraph === "undefined") {
    console.error("❌ Force Graph library not defined - check script loading");
    // Try loading it directly as a fallback
    const script = document.createElement("script");
    script.src = "https://unpkg.com/force-graph";
    script.onload = () => {
      console.log("✅ Force Graph library loaded as fallback");
      initializeGraphWithLib();
    };
    document.head.appendChild(script);
    return;
  }

  initializeGraphWithLib();
}

function initializeGraphWithLib() {
  const graphElement = document.getElementById("graph");
  if (!graphElement) {
    console.error("❌ Graph element not found in DOM");
    return;
  }

  console.log("🚀 Initializing Force Graph with element:", graphElement);

  // Clear any loading indicators
  const loadingElement = document.getElementById("graph-loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  const graphData = build_graph_data(pages);
  console.log("📊 Graph data prepared:", graphData);

  try {
    const Graph = ForceGraph()(graphElement)
      .graphData(build_graph_data(pages))
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
        const expanded_nodes = pages.filter(p => p.expanded).length;
        if (expanded_nodes == 0) {
          // re-expand me.
          node.expanded = true;
        }
        Graph.graphData(build_graph_data(pages));

        // center on node in 300 ms, post graph update
        setTimeout(() => {
          center_on_node(node);
        }, 300);
      });

    // Center on initial node
    center_on_node(node_for_url(pages, initial_expanded_url));

    function center_on_node(node) {
      if (!node || !Graph) {
        console.error("❌ Cannot center - node or graph is undefined");
        return;
      }
      Graph.centerAt(node.x, node.y, 500);
      Graph.zoom(8, 500);
      update_detail(node);
      console.log("📍 Centering on", node.url);
    }

    var g_last_detail_node = null;

    // Setup control handlers when DOM is fully loaded
    $(document).ready(function () {
      console.log("🔧 Setting up control event handlers");

      // Set click handler for center control
      $("#center_control").on("click", function () {
        console.log("🔍 Center control clicked");
        if (g_last_detail_node) {
          center_on_node(g_last_detail_node);
        }
      });

      // Set click handler for goto control
      $("#goto_control").on("click", open_goto_control);

      // Set click handler for collapse control
      $("#collapse_control").on("click", collapse_all_except_active);
    });

    function open_goto_control() {
      console.log("🔗 Goto control clicked");
      if (g_last_detail_node) {
        if (g_last_detail_node.url) {
          window.open(g_last_detail_node.url, "_blank");
        } else {
          console.log("⚠️ Active node has no URL");
        }
      } else {
        console.log("⚠️ No active node to go to");
      }
    }

    function collapse_all_except_active() {
      console.log("📊 Collapse control clicked");
      pages.forEach(p => {
        p.expanded = false;
      });
      if (g_last_detail_node) {
        g_last_detail_node.expanded = true;
      }
      Graph.graphData(build_graph_data(pages));

      // Center on the active node after collapsing
      if (g_last_detail_node) {
        setTimeout(() => {
          center_on_node(g_last_detail_node);
        }, 300);
      }
    }

    function update_detail(page) {
      // Replace HTML of element of id above with the page
      g_last_detail_node = page;
      const html = MakeBackLinkHTML(page);
      const detail = document.getElementById("detail");
      if (detail) {
        detail.innerHTML = html;
      } else {
        console.error("❌ Detail element not found");
      }
    }

    return Graph; // Return the graph instance
  } catch (error) {
    console.error("❌ Error initializing Force Graph:", error);
  }
}

console.log("📋 Graph script loaded");

console.log("Post Graph");
