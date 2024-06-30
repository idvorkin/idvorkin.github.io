//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS");
import { warn } from "console";
import { get_link_info } from "./main";

const m = get_link_info();
console.log(await m);

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

const gData = {
  nodes: await get_link_info().map(e => {
    id: e.url;
  }),
};

console.log("HEllo From Typescript");

ForceGraph()(document.getElementById("graph"))
  .linkDirectionalParticles(2)
  .graphData(gData);

console.log("Post Graph");
