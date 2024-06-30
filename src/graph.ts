//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
console.log("Load force graph in TS");
// import ForceGraph from "force-graph";
const N = 300;
const gData = {
  nodes: [...Array(N).keys()].map(i => ({ id: i })),
  links: [...Array(N).keys()]
    .filter(id => id)
    .map(id => ({
      source: id,
      target: Math.round(Math.random() * (id - 1)),
    })),
};

console.log("HEllo From Typescript");

const Graph = ForceGraph()(document.getElementById("graph"))
  .linkDirectionalParticles(2)
  .graphData(gData);

console.log("Post Graph");
