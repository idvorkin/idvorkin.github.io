// One of the imports is goofy
// @ts-ignore:TS2792
import { SunburstClickEvent } from "plotly.js";
import { shuffle, random_from_list, append_randomizer_div } from "./main.js";
import {
  isNullishCoalesce,
  isTypeAliasDeclaration,
} from "../node_modules/typescript/lib/typescript";
class TreeNode {
  name: string;
  children: [TreeNode];
  value: number;
  constructor({
    name,
    value = 25,
    children = [],
  }: {
    name;
    value?;
    children?;
  }) {
    this.name = name;
    // Keep it interesting
    this.children = shuffle(children);
    this.value = value;
  }
}
function add_random_prompts() {
  const map_category_to_prompts = category_to_prompts();
  for (const category of map_category_to_prompts.keys()) {
    render_prompt_for_category(category, map_category_to_prompts.get(category));
  }
}

function render_prompt_for_category(category, prompts_for_category) {
  //print one of the prompts
  let get_random_prompt_html = () =>
    `<span>${random_from_list(prompts_for_category)}</span>`;

  // add a place holder for random div.
  const new_element = $(`<div class="alert alert-primary" role="alert"/>`);
  $(category).after(new_element);
  append_randomizer_div(new_element, get_random_prompt_html);
}

// The prompts page has a bunch of lists of prompts
// Would be nice to "pick a random one" to make it less intimidating
// So can add a box at the top with a random prompt on top
// And a random per section prompt

function category_to_prompts() {
  // prompt_categories are H3s with a UL under them, and the li's under there are the prompt.
  const starting_node = $("h3").first();
  let current_category = starting_node;
  let prompts_for_category = [];
  let map_category_to_prompts = new Map();
  for (let node = starting_node; node.length != 0; node = $(node).next()) {
    if (node.prop("tagName") == "H3") {
      // Build prompt map
      map_category_to_prompts.set(current_category, prompts_for_category);

      // start processing next categroy
      current_category = node;
      prompts_for_category = [];
      continue;
    }

    // in a category, prompts are the children of the first unordered list, so skip
    // stuff that isn't a list
    if (node.prop("tagName") != "UL") {
      continue;
    }
    // we should now be the first list in the category
    prompts_for_category = Array.from($(node).find("li")).map(li =>
      $(li).text()
    );
  }

  map_category_to_prompts.set(current_category, prompts_for_category);

  // Remove any categories that

  return map_category_to_prompts;
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
    parents: names_parent_names.map(([n, p]) => p),
  };
}

function category_to_prompts_text() {
  const map = category_to_prompts();
  const list = Array.from(map.entries()).map(([k, v], _index) => [
    (k as any).text(),
    v,
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

  // console.log(Array.from(breadth_first_walk(tree_node)));
  // console.log("Label", label);
  // console.log("Clicked Node", clicked_node);
  // console.log(map_node_to_prompts);

  // Gather all the prompts for the children of the clicked node.
  let all_prompts = Array.from(breadth_first_walk(clicked_node))
    .map(([node, _parent]) => node) // returns node and parent
    .filter(node => map_node_to_prompts.has(node.name))
    .map(node =>
      map_node_to_prompts
        .get(node.name)
        .map(prompt => `${node.name}: ${prompt}`)
    )
    .flat();

  return random_from_list(all_prompts);
}

async function add_sunburst(
  plot_element_id,
  random_text_div_id,
  root: TreeNode
) {
  const sunburst_tree_flat = tree_to_plotly_data_format(root);
  var sunburst_data = {
    type: "sunburst",
    outsidetextfont: { size: 20, color: "#377eb8" },
    // leaf: {opacity: 0.4},
    hoverinfo: "none",
    marker: { line: { width: 2 } },
    maxdepth: 2,
    displayModeBar: false,
  };
  Object.assign(sunburst_data, sunburst_tree_flat);
  delete (sunburst_data as any).values; // remove values to avoid sizing pie slices

  var sunburst_layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"],
  };
  const config = {
    displayModeBar: false,
  };

  const sunburstPlot = await Plotly.newPlot(
    plot_element_id,
    [sunburst_data] as any,
    sunburst_layout,
    config
  );
  const set_random_prompt_text = text => {
    console.log("set_random_prompt_text", text);
    $(`#${random_text_div_id}`).text(text);
  };

  // Set click handler for div
  $(`#${random_text_div_id}`)
    .first()
    .click(() => {
      const label = $("#sunburst text:first").text(); // Hack should use an API to find center text
      const prompt = random_prompt_for_label(
        label,
        root,
        category_to_prompts_text()
      );
      set_random_prompt_text(prompt);
    });

  sunburstPlot.on("plotly_sunburstclick", event => {
    const label = event.points[0].label;
    const prompt = random_prompt_for_label(
      label,
      root,
      category_to_prompts_text()
    );
    set_random_prompt_text(prompt);
  });
}

const UT = {
  breadth_first_walk: breadth_first_walk, // for UT
  shuffle: shuffle,
};

// How do I export things only for testing?
// I guess they should be in their own module
export { add_random_prompts, add_sunburst, TreeNode, UT, shuffle };
