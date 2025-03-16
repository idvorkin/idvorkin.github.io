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

// Only initialize the graph if we're on a page that needs it
async function initializeGraph() {
  // Exit early if we're not on a page with a graph
  if (!document.getElementById("graph")) {
    return;
  }

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

  if (typeof ForceGraph === "undefined") {
    console.log("Force Graph not defined");
  } else {
    const Graph = ForceGraph()(document.getElementById("graph"))
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

    center_on_node(node_for_url(pages, initial_expanded_url));

    function center_on_node(node) {
      Graph.centerAt(node.x, node.y, 500);
      Graph.zoom(8, 500);
      update_detail(node);
      console.log("centering on", node);
    }

    var g_last_detail_node = null;

    // set click handler for center control
    $("#center_control").on("click", () => center_on_node(g_last_detail_node));

    // set click handler for goto control
    $("#goto_control").on("click", open_goto_control);

    // set click handler for collapse control
    $("#collapse_control").on("click", collapse_all_except_active);

    function open_goto_control() {
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

    function collapse_all_except_active() {
      console.log("Collapse control clicked");
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
      // replace html of element of id above with the page
      g_last_detail_node = page;
      const html = MakeBackLinkHTML(page);
      const detail = document.getElementById("detail");
      detail.innerHTML = html;
    }
  }

  console.log("Post Graph");
}
