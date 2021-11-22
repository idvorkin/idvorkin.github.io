// import * as Plotly from "plotly.js";
// import * as _ from "../node_modules/cypress/types/lodash/index";
//import * as _ from "lodash";
import { map } from "jquery";
import { SunburstClickEvent } from "plotly.js";

class TreeNode {
  name: string;
  children: [TreeNode];
  value: number;
  constructor({
    name,
    value = 25,
    children = []
  }: {
    name;
    value?;
    children?;
  }) {
    this.name = name;
    this.children = children;
    this.value = value;
  }
}

function get_things_i_enjoy() {
  const health = new TreeNode({
    name: "Health",
    children: [
      { name: "Physical", value: 25 },
      { name: "Emotional", value: 25 },
      { name: "Cognative", value: 25 }
    ],
    value: 25
  });
  const magic = new TreeNode({
    name: "Magic",
    value: 25,
    children: [
      new TreeNode({ name: "Card Magic" }),
      new TreeNode({ name: "Coin Magic" }),
      new TreeNode({ name: "Band Magic" })
    ]
  });
  const hobbies = new TreeNode({
    name: "Hobbies",
    children: [
      new TreeNode({ name: "Biking", value: 10 }),
      new TreeNode({ name: "Tech", value: 25 }),
      new TreeNode({ name: "Juggling", value: 25 })
    ],
    value: 0
  });
  const relationships = new TreeNode({
    name: "Relationships",
    children: [
      new TreeNode({
        name: "Zach",
        children: [
          new TreeNode({ name: "Pick Zach's Nose" }),
          new TreeNode({ name: "Make Zach Make Dinner" }),
          new TreeNode({ name: "Smell Zach's Feet" })
        ]
      }),
      new TreeNode({ name: "Amelia" }),
      new TreeNode({ name: "Tori" }),
      new TreeNode({ name: "Friends" })
    ],
    value: 0
  });

  const root = new TreeNode({
    name: "Invest in",
    children: [health, magic, hobbies, relationships],
    value: 0
  });
  return root;
}

// sunburst format is an inorder traversal of the tree.
// good thing to unit test

function* breadth_first_walk(node: TreeNode) {
  if (!node) {
    return;
  }
  let Q = [];
  Q.push([node, null as TreeNode]);
  while (Q.length > 0) {
    const [current, parent]: [TreeNode, TreeNode] = Q.shift();
    for (const child of current.children ?? []) {
      Q.push([child, current]);
    }
    yield [current, parent];
  }
}

function tree_to_plotly_data_format(root) {
  // Plotly needs a tree to be flattened into a set of lists
  // ids
  // labels
  // parents
  // values

  // JScript Experts: Is there a desctructing for this?
  const names_parent_names = Array.from(
    breadth_first_walk(root)
  ).map(([n, p]) => [n.name, p?.name]);

  return {
    ids: names_parent_names.map(([n, p]) => n),
    labels: names_parent_names.map(([n, p]) => n),
    parents: names_parent_names.map(([n, p]) => p)
  };
}

function make_map_category_to_prompts_text() {
  const map = make_category_to_prompt_map();
  const list = Array.from(map.entries()).map(([k, v], _index) => [
    (k as any).text(),
    v
  ]);
  return new Map(list as any);
}

// We have a tree of nested categories. [node(category, children)]
// and prompts stored in a map[category, prompt]
// Join and walk

function random_prompt_for_label(label, tree_node, map_node_to_prompts) {
  // Find the label in the tree
  // recall bread first search returns a parent as well.
  const [clicked_node, _parent] = Array.from(
    breadth_first_walk(tree_node)
  ).find(([current, _parent]) => current.name == label);

  // Gather all the prompts for the children of the clicked node.
  let all_prompts = Array.from(breadth_first_walk(clicked_node))
    .map(([node, _parent]) => node) // return node and parent
    .filter(node => map_node_to_prompts.has(node.name))
    .map(node =>
      map_node_to_prompts
        .get(node.name)
        .map(prompt => `${node.name}: ${prompt}`)
    )
    .flat();

  return _.chain(all_prompts)
    .sampleSize(1)
    .first()
    .value();
}

// Yukky, need to lazy load this
// Since it relies on main which isn't in a module yet
let memoized_map_category_to_prompts_text = null;
function on_sunburst_click(event: SunburstClickEvent) {
  if (memoized_map_category_to_prompts_text == null) {
    memoized_map_category_to_prompts_text = make_map_category_to_prompts_text();
  }
  const label = event.points[0].label;
  $("#sunburst_text").text(
    random_prompt_for_label(
      label,
      get_things_i_enjoy(),
      memoized_map_category_to_prompts_text
    )
  );
}

async function sunburst_loader() {
  const root = get_things_i_enjoy();
  const sunburst_tree_flat = tree_to_plotly_data_format(root);
  console.log(sunburst_tree_flat);

  var sunburst_config = {
    type: "sunburst",
    outsidetextfont: { size: 20, color: "#377eb8" },
    // leaf: {opacity: 0.4},
    hoverinfo: "none",
    marker: { line: { width: 2 } },
    maxdepth: 2
  };
  Object.assign(sunburst_config, sunburst_tree_flat);
  delete (sunburst_config as any).values; // remove values to avoid sizing pie slices
  console.log(sunburst_config);

  var sunburst_layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"]
  };

  const sunburstPlot = await Plotly.newPlot(
    "sunburst",
    [sunburst_config] as any,
    sunburst_layout
  );

  sunburstPlot.on("plotly_sunburstclick", on_sunburst_click);
}

export { TreeNode, sunburst_loader, get_things_i_enjoy, breadth_first_walk };
