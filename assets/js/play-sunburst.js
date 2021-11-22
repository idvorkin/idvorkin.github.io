class TreeNode {
    constructor({ name, value = 25, children = [] }) {
        this.name = name;
        this.children = children;
        this.value = value;
        // If kid sizes are all the same, make them equal to parent value/count kids
        if (this.children.length > 0) {
            // if there are kids
            const all_equal = this.children.every(child => child.value == this.value);
            if (all_equal) {
                this.children.forEach(child => (child.value = this.value / this.children.length));
            }
            this.value = 0; // Set my value to zero since provided by the children.
        }
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
// ids
// labels
// parents
// values
function tree_to_plotly_sunburst_format(root) {
    const out = {
        ids: [],
        labels: [],
        parents: [],
        values: []
    };
    for (const [current, parent] of breadth_first_walk(root)) {
        out.ids.push(current.name);
        out.labels.push(current.name);
        out.values.push(current.value);
        out.parents.push(parent === null || parent === void 0 ? void 0 : parent.name);
    }
    return out;
}
function make_map_category_to_prompts_text() {
    const map = make_category_to_prompt_map();
    const list = Array.from(map.entries()).map(([k, v], _index) => [
        k.text(),
        v
    ]);
    return new Map(list);
}
// Kind of weird, we have a tree of categories for the sunburst category
// But then a map of category to prompts 
function random_prompt_for_label(label, tree_node, map_node_to_prompts) {
    // Find the label in the tree
    // recall bread first search returns a parent as well.
    const [clicked_node, _parent] = Array.from(breadth_first_walk(tree_node)).find(([current, _parent]) => current.name == label);
    // Gather all the prompts for the children of the clicked node.
    let all_prompts = Array.from(breadth_first_walk(clicked_node))
        .map(([node, _parent]) => node) // return node and parent
        .filter(node => map_node_to_prompts.has(node.name))
        .map(node => map_node_to_prompts.get(node.name).map(prompt => `${node.name}: ${prompt}`))
        .flat();
    return _.chain(all_prompts)
        .sampleSize(1)
        .first()
        .value();
}
// Yukky, need to lazy load this
// Since it relies on main which isn't in a module yet
let memoized_map_category_to_prompts_text = null;
function on_sunburst_click(event) {
    if (memoized_map_category_to_prompts_text == null) {
        memoized_map_category_to_prompts_text = make_map_category_to_prompts_text();
    }
    const label = event.points[0].label;
    $("#sunburst_text").text(random_prompt_for_label(label, get_things_i_enjoy(), memoized_map_category_to_prompts_text));
}
async function sunburst_loader() {
    const root = get_things_i_enjoy();
    const sunburst_data2 = tree_to_plotly_sunburst_format(root);
    var sunburst_data = {
        type: "sunburst",
        outsidetextfont: { size: 20, color: "#377eb8" },
        // leaf: {opacity: 0.4},
        hoverinfo: "none",
        marker: { line: { width: 2 } },
        maxdepth: 2
    };
    var layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"]
    };
    sunburst_data["ids"] = sunburst_data2.ids;
    sunburst_data["labels"] = sunburst_data2.labels;
    sunburst_data["parents"] = sunburst_data2.parents;
    // Ignore values for now.
    // sunburst_data[0]["values"] = sunburst_data2.values;
    const sunburstPlot = await Plotly.newPlot("sunburst", [sunburst_data], layout);
    sunburstPlot.on("plotly_sunburstclick", on_sunburst_click);
}
export { TreeNode, sunburst_loader, get_things_i_enjoy, breadth_first_walk };
//# sourceMappingURL=play-sunburst.js.map