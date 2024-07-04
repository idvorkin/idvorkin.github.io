//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS v 0.8");
import { get_link_info } from "./main";

// import ForceGraph from "force-graph";

// Pages are the link_infos
// Set id to be the URL.

// Example to make collapsable tree:
// https://github.com/vasturiano/force-graph/blob/master/example/expandable-nodes/index.html

// Uncollapse any page wtih the url == eulogy
function is_expanded(node) {
  if (node.url == "/eulogy") {
    return true;
  } else {
    return false;
  }
}
const pages = Object.values(await get_link_info()).map(p => ({
  ...p,
  id: p.url,
  expanded: is_expanded(p),
}));

function is_valid_url(url) {
  // check if the url is in the list of pages
  return pages.map(p => p.url).includes(url);
}

function build_links(pages) {
  // build links
  const links = [];
  pages.forEach(page => {
    page.outgoing_links
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
  console.log(visible_pages);
  const visible_links = build_links(visible_pages);
  console.log(visible_links);
  const newly_visible_pages = visible_links.map(l =>
    node_for_url(pages, l.target)
  );
  console.log(newly_visible_pages);
  // update visable pages with newly visible ones
  const combined_pages = visible_pages.concat(newly_visible_pages);

  console.log(combined_pages);
  return {
    nodes: combined_pages,
    links: visible_links,
  };
}

// log first 20 pages
console.log("Originals");
console.log(pages.slice(0, 20).map(p => p));
console.log(pages.map(p => p.url));

// Make tree collapasable

function TextLabelNodeCanvas(node, ctx, globalScale: number) {
  const label = node.id;
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

const Graph = ForceGraph()(document.getElementById("graph"))
  .graphData(build_graph_data(pages))
  .nodeLabel("id")
  .nodeAutoColorBy("group")
  .nodeCanvasObject(TextLabelNodeCanvas)
  .nodePointerAreaPaint(TextLabelNodePointerAreaPaint)
  .onNodeClick(node => {
    // Center/zoom on node
    // Graph.centerAt(node.x, node.y, 1000);
    // Graph.zoom(8, 2000);
    console.log(node);
    node.expanded = !node.expanded;
    Graph.graphData(build_graph_data(pages));
  });

console.log("Post Graph");
