import { append_randomizer_div, random_from_list, shuffle } from "./index";

// Declare global Plotly
declare const Plotly: any;

/**
 * Represents a node in a tree structure used for visualization
 */
export class TreeNode {
  name: string;
  children: TreeNode[];
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
    this.children = shuffle(children) as TreeNode[];
    this.value = value;
  }
}

/**
 * Main function to add random prompts to categories on the page
 * @param categoryToPromptsProvider Function that provides category-to-prompts mapping (default: internal implementation)
 * @param renderer Function that renders prompts for a category (default: internal implementation)
 */
export function add_random_prompts(
  categoryToPromptsProvider = category_to_prompts,
  renderer = render_prompt_for_category,
) {
  const map_category_to_prompts = categoryToPromptsProvider();
  for (const category of map_category_to_prompts.keys()) {
    renderer(category, map_category_to_prompts.get(category));
  }
}

/**
 * Renders prompts for a specific category
 * @param category The category element
 * @param prompts_for_category Array of prompts for this category
 * @param jQueryProvider jQuery function (default: global $)
 * @param randomizerAppender Function to append randomizer div (default: append_randomizer_div)
 */
export function render_prompt_for_category(
  category,
  prompts_for_category,
  jQueryProvider = $,
  randomizerAppender = append_randomizer_div,
) {
  //print one of the prompts
  const get_random_prompt_html = () =>
    `<span>${random_from_list(
      prompts_for_category,
    )}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">🔄</span>`;

  // add a place holder for random div.
  const new_element = jQueryProvider(`<div class="alert alert-primary" role="alert"/>`);
  jQueryProvider(category).after(new_element);
  randomizerAppender(new_element, get_random_prompt_html);
}

/**
 * Extracts prompts from categories on the page
 * @param jQueryProvider jQuery function (default: global $)
 * @returns Map of category elements to their prompts
 */
export function category_to_prompts(jQueryProvider = $) {
  // prompt_categories are H3s with a UL under them, and the li's under there are the prompt.
  const starting_node = jQueryProvider("h3").first();
  let current_category = starting_node;
  let prompts_for_category = [];
  const map_category_to_prompts = new Map();

  for (let node = starting_node; node.length !== 0; node = jQueryProvider(node).next()) {
    if (node.prop("tagName") === "H3") {
      // Build prompt map
      map_category_to_prompts.set(current_category, prompts_for_category);

      // start processing next categroy
      current_category = node;
      prompts_for_category = [];
      continue;
    }

    // in a category, prompts are the children of the first unordered list, so skip
    // stuff that isn't a list
    if (node.prop("tagName") !== "UL") {
      continue;
    }
    // we should now be the first list in the category
    prompts_for_category = Array.from(jQueryProvider(node).find("li")).map((li) => jQueryProvider(li).text());
  }

  map_category_to_prompts.set(current_category, prompts_for_category);

  return map_category_to_prompts;
}

/**
 * Performs a breadth-first traversal of a tree
 * @param node The root node of the tree to traverse
 * @yields [current node, parent node] pairs for each node in the tree
 */
export function* breadth_first_walk(node: TreeNode) {
  if (!node) {
    return;
  }
  const Q = [];
  Q.push([node, null as TreeNode]);
  while (Q.length > 0) {
    const [current, parent]: [TreeNode, TreeNode] = Q.shift();
    for (const child of current.children ?? []) {
      Q.push([child, current]);
    }
    yield [current, parent];
  }
}

/**
 * Converts a tree structure to Plotly's data format for visualization
 * @param root Root node of the tree
 * @returns Object with ids, labels, and parents arrays for Plotly
 */
export function tree_to_plotly_data_format(root) {
  // Plotly needs a tree to be flattened into a set of lists
  // ids
  // labels
  // parents
  // values

  const names_parent_names = Array.from(breadth_first_walk(root)).map(([n, p]) => [n.name, p?.name]);

  return {
    ids: names_parent_names.map(([n, p]) => n),
    labels: names_parent_names.map(([n, p]) => n),
    parents: names_parent_names.map(([n, p]) => p),
  };
}

/**
 * Converts category elements to category text with their associated prompts
 * @param mapProvider Function that provides category-to-prompts mapping (default: internal implementation)
 * @returns Map of category texts to their prompts
 */
export function category_to_prompts_text(mapProvider = category_to_prompts) {
  const map = mapProvider();
  const list = Array.from(map.entries()).map(([k, v], _index) => [(k as any).text(), v]);
  return new Map(list as any);
}

/**
 * Gets a random prompt for a specific label from the tree
 * @param label The label to find in the tree
 * @param tree_node The root node of the tree
 * @param map_node_to_prompts Map of node names to prompts
 * @returns Random prompt for the specified label
 */
export function random_prompt_for_label(label, tree_node, map_node_to_prompts) {
  // Find the label in the tree
  // recall bread first search returns a parent as well.
  const result = Array.from(breadth_first_walk(tree_node)).find(([current, _parent]) => current.name === label);

  if (!result) {
    return "Click in any box or circle";
  }

  const [clicked_node, _parent] = result;

  // Gather all the prompts for the children of the clicked node.
  const all_prompts = Array.from(breadth_first_walk(clicked_node))
    .map(([node, _parent]) => node) // returns node and parent
    .filter((node) => {
      // Check both with and without the link emoji
      const hasWithoutEmoji = map_node_to_prompts.has(node.name);
      const hasWithEmoji = map_node_to_prompts.has(`${node.name}🔗`);
      return hasWithoutEmoji || hasWithEmoji;
    })
    .flatMap((node) => {
      // Try to get prompts with and without emoji
      const prompts = map_node_to_prompts.get(node.name) || map_node_to_prompts.get(`${node.name}🔗`) || [];
      return prompts.map((prompt) => `${node.name}: ${prompt}`);
    });

  if (all_prompts.length === 0) {
    return "Click in any box or circle";
  }

  return random_from_list(all_prompts);
}

/**
 * Adds a sunburst visualization to the page
 * @param plot_element_id ID of the element where the plot should be rendered
 * @param random_text_div_id ID of the div where random text should be displayed
 * @param root Root node of the tree to visualize
 * @param jQueryProvider jQuery function (default: global $)
 * @param plotlyProvider Plotly library (default: global Plotly)
 */
export async function add_sunburst(
  plot_element_id,
  random_text_div_id,
  root: TreeNode,
  jQueryProvider = $,
  plotlyProvider = Plotly,
) {
  if (!plotlyProvider) {
    console.error("Plotly is not available");
    return;
  }

  const sunburst_tree_flat = tree_to_plotly_data_format(root);
  const sunburst_data = {
    type: "sunburst",
    outsidetextfont: { size: 20, color: "#377eb8" },
    // leaf: {opacity: 0.4},
    hoverinfo: "none",
    marker: { line: { width: 2 } },
    maxdepth: 2,
    displayModeBar: false,
  };
  Object.assign(sunburst_data, sunburst_tree_flat);
  (sunburst_data as any).values = undefined; // remove values to avoid sizing pie slices

  const sunburst_layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"],
  };
  const config = {
    displayModeBar: false,
  };

  try {
    await plotlyProvider.newPlot(plot_element_id, [sunburst_data] as any, sunburst_layout, config);

    const set_random_prompt_text = (text) => {
      jQueryProvider(`#${random_text_div_id}`).text(text);
    };

    // Set click handler for div
    jQueryProvider(`#${random_text_div_id}`)
      .first()
      .click(() => {
        const label = jQueryProvider("#sunburst text:first").text(); // Hack should use an API to find center text
        const prompt = random_prompt_for_label(label, root, category_to_prompts_text());
        set_random_prompt_text(prompt);
      });

    // Attach the sunburst click event handler
    const plotElement = document.getElementById(plot_element_id);
    if (plotElement && typeof (plotElement as any).on === "function") {
      (plotElement as any).on("plotly_click", (eventData: any) => {
        if (eventData?.points?.[0]) {
          const label = eventData.points[0].label;
          const prompt = random_prompt_for_label(label, root, category_to_prompts_text());
          set_random_prompt_text(prompt);
        }
      });
    }

    return plotElement;
  } catch (error) {
    console.error("Failed to create sunburst plot:", error);
    return null;
  }
}

/**
 * Extracts a tree structure from H2, H3, and LI elements on the page
 * @param rootName The name for the root node of the tree
 * @param containerSelector Optional jQuery selector to scope the search (e.g., "article", "#content")
 * @param jQueryProvider jQuery function (default: global $)
 * @returns TreeNode representing the extracted hierarchy
 */
export function extract_tree_from_dom(
  rootName = "Root",
  containerSelector: string | null = null,
  jQueryProvider: any = $,
): TreeNode {
  const h2Elements = containerSelector ? jQueryProvider(containerSelector).find("h2") : jQueryProvider("h2");
  const rootChildren: TreeNode[] = [];

  h2Elements.each((_index, h2Element) => {
    const h2 = jQueryProvider(h2Element);
    const h2Text = h2.text().trim();

    // Skip if empty
    if (!h2Text) return;

    const h2Children: TreeNode[] = [];
    let currentElement = h2.next();

    // Process elements until we hit another H2 or run out of elements
    while (currentElement.length > 0 && currentElement.prop("tagName") !== "H2") {
      if (currentElement.prop("tagName") === "H3") {
        const h3Text = currentElement.text().trim();
        if (h3Text) {
          // Add H3 as a node regardless of whether it has a UL after it
          h2Children.push(new TreeNode({ name: h3Text }));
        }
      }
      currentElement = currentElement.next();
    }

    if (h2Children.length > 0) {
      rootChildren.push(new TreeNode({ name: h2Text, children: h2Children }));
    }
  });

  return new TreeNode({ name: rootName, children: rootChildren });
}

/**
 * Creates a sunburst visualization automatically from the page's H2/H3 structure
 * @param plot_element_id ID of the element where the plot should be rendered
 * @param random_text_div_id ID of the div where random text should be displayed
 * @param rootName Optional name for the root node (default: "Root")
 * @param containerSelector Optional jQuery selector to scope the search (e.g., "article", "#content")
 * @param jQueryProvider jQuery function (default: global $)
 * @param plotlyProvider Plotly library (default: global Plotly)
 */
export async function add_sunburst_from_dom(
  plot_element_id: string,
  random_text_div_id: string,
  rootName = "Root",
  containerSelector: string | null = null,
  jQueryProvider = $,
  plotlyProvider = Plotly,
) {
  const tree = extract_tree_from_dom(rootName, containerSelector, jQueryProvider);
  return add_sunburst(plot_element_id, random_text_div_id, tree, jQueryProvider, plotlyProvider);
}

// Export testing utilities separately
export const UT = {
  breadth_first_walk,
  shuffle,
};
