class TreeNode {
    constructor({ name, value = 25, children = [], }) {
        this.name = name;
        this.children = children;
        this.value = value;
    }
}
function get_7_habits() {
    const root = new TreeNode({
        name: "7H ",
        children: [
            new TreeNode({ name: "" }),
            new TreeNode({ name: "Be Proactive" }),
            new TreeNode({ name: "Begin with the end in mind" }),
            new TreeNode({ name: "First things First" }),
            new TreeNode({ name: "Think Win/Win" }),
            new TreeNode({ name: "First Understand" }),
            new TreeNode({ name: "Synergize" }),
            new TreeNode({ name: "Sharpen the Saw" }),
        ],
    });
    return root;
}
function get_things_i_enjoy() {
    const health = new TreeNode({
        name: "Health",
        children: [
            { name: "Physical" },
            { name: "Emotional" },
            { name: "Cognative" },
        ],
        value: 31,
    });
    const magic = new TreeNode({
        name: "Magic",
        children: [
            new TreeNode({ name: "Card Magic" }),
            new TreeNode({ name: "Coin Magic" }),
            new TreeNode({ name: "Band Magic" }),
        ],
    });
    const hobbies = new TreeNode({
        name: "Hobbies",
        children: [
            new TreeNode({ name: "Biking" }),
            new TreeNode({ name: "Tech" }),
            new TreeNode({ name: "Juggling" }),
        ],
    });
    const relationships = new TreeNode({
        name: "Relationships",
        children: [
            new TreeNode({
                name: "Zach",
                children: [
                    new TreeNode({ name: "Pick Zach's Nose" }),
                    new TreeNode({ name: "Make Zach Make Dinner" }),
                    new TreeNode({ name: "Smell Zach's Feet" }),
                ],
            }),
            new TreeNode({ name: "Amelia" }),
            new TreeNode({ name: "Tori" }),
            new TreeNode({ name: "Friends" }),
        ],
    });
    return new TreeNode({
        name: "Invest in",
        children: [health, magic, hobbies, relationships],
    });
}
// sunburst format is an inorder traversal of the tree.
// good thing to unit test
function* breadth_first_walk(node) {
    var _a;
    if (!node) {
        return;
    }
    let Q = [];
    Q.push([node, null]);
    while (Q.length > 0) {
        const [current, parent] = Q.shift();
        for (const child of (_a = current.children) !== null && _a !== void 0 ? _a : []) {
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
    const names_parent_names = Array.from(breadth_first_walk(root)).map(([n, p]) => [n.name, p === null || p === void 0 ? void 0 : p.name]);
    return {
        ids: names_parent_names.map(([n, p]) => n),
        labels: names_parent_names.map(([n, p]) => n),
        parents: names_parent_names.map(([n, p]) => p),
    };
}
function make_map_category_to_prompts_text() {
    const map = make_category_to_prompt_map();
    const list = Array.from(map.entries()).map(([k, v], _index) => [
        k.text(),
        v,
    ]);
    return new Map(list);
}
// We have a tree of nested categories. [node(category, children)]
// and prompts stored in a map[category, prompt]
// Join and walk
function random_prompt_for_label(label, tree_node, map_node_to_prompts) {
    // Find the label in the tree
    // recall bread first search returns a parent as well.
    const [clicked_node, _parent] = Array.from(breadth_first_walk(tree_node)).find(([current, _parent]) => current.name == label);
    // Gather all the prompts for the children of the clicked node.
    let all_prompts = Array.from(breadth_first_walk(clicked_node))
        .map(([node, _parent]) => node) // return node and parent
        .filter((node) => map_node_to_prompts.has(node.name))
        .map((node) => map_node_to_prompts
        .get(node.name)
        .map((prompt) => `${node.name}: ${prompt}`))
        .flat();
    return _.chain(all_prompts)
        .sampleSize(1)
        .first()
        .value();
}
// Yukky, need to lazy load this object
// Since it relies on main.make_category_to_prompts_text which isn't in a module yet
let memoized_map_category_to_prompts_text = null;
// Messy this includes UX updates and logic, clean up in the mythical later ;)
function on_sunburst_click(set_random_text, root, event) {
    if (!memoized_map_category_to_prompts_text) {
        memoized_map_category_to_prompts_text = make_map_category_to_prompts_text();
    }
    const label = event.points[0].label;
    set_random_text(random_prompt_for_label(label, root, memoized_map_category_to_prompts_text));
}
async function add_sunburst(plot_element_id, random_text_div_id, root) {
    const sunburst_tree_flat = tree_to_plotly_data_format(root);
    var sunburst_config = {
        type: "sunburst",
        outsidetextfont: { size: 20, color: "#377eb8" },
        // leaf: {opacity: 0.4},
        hoverinfo: "none",
        marker: { line: { width: 2 } },
        maxdepth: 2,
    };
    Object.assign(sunburst_config, sunburst_tree_flat);
    delete sunburst_config.values; // remove values to avoid sizing pie slices
    var sunburst_layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"],
    };
    const sunburstPlot = await Plotly.newPlot(plot_element_id, [sunburst_config], sunburst_layout);
    sunburstPlot.on("plotly_sunburstclick", (event) => {
        const set_random_text = (text) => $(`#${random_text_div_id}`).text(text);
        on_sunburst_click(set_random_text, root, event);
    });
}
const UT = {
    breadth_first_walk: breadth_first_walk,
    TreeNode: TreeNode, // For UT
};
// How do I export things only for testing?
// I guess they should be in their own module
export { add_sunburst, get_things_i_enjoy, get_7_habits, UT };
//# sourceMappingURL=random-prompter.js.map