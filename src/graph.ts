//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS");
import { warn } from "console";
import { get_link_info } from "./main";

// import ForceGraph from "force-graph";
const N = 300;
const gDataExample = {
  nodes: [...Array(N).keys()].map(i => ({ id: i })),
  links: [...Array(N).keys()]
    .filter(id => id)
    .map(id => ({
      source: id,
      target: Math.round(Math.random() * (id - 1)),
    })),
};

// Create gData from get_link_info

const pages = Object.values(await get_link_info());

console.log(pages.map(p => p.url));

const gData = {
  nodes: pages.map(p => ({ id: p.url })),
  links: pages.map(p => ({ id: p.url })),
};

console.log("HEllo From Typescript");

ForceGraph()(document.getElementById("graph"))
  .linkDirectionalParticles(2)
  .graphData(gData)
  .nodeLabel("id");

console.log("Post Graph");
