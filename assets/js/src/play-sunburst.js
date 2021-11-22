var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function get_energy_allocation() {
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
            new TreeNode({ name: "Zach" }),
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
function* in_order_walk(node) {
    var _a;
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
    for (const [current, parent] of in_order_walk(root)) {
        out.ids.push(current.name);
        out.labels.push(current.name);
        out.values.push(current.value);
        out.parents.push(parent === null || parent === void 0 ? void 0 : parent.name);
    }
    return out;
}
var sunburst_data = [
    {
        type: "sunburst",
        outsidetextfont: { size: 20, color: "#377eb8" },
        // leaf: {opacity: 0.4},
        marker: { line: { width: 2 } },
        maxdepth: 2
    }
];
var layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"]
};
function sunburst_loader() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!document.URL.includes("sunburst")) {
            return;
        }
        console.log("drawing sunburst");
        const root = get_energy_allocation();
        const sunburst_data2 = tree_to_plotly_sunburst_format(root);
        sunburst_data[0]["ids"] = sunburst_data2.ids;
        sunburst_data[0]["labels"] = sunburst_data2.labels;
        sunburst_data[0]["parents"] = sunburst_data2.parents;
        // Ignore values for now.
        // sunburst_data[0]["values"] = sunburst_data2.values;
        const sunburstPlot = yield Plotly.newPlot("sunburst", sunburst_data, layout);
        const map_category_to_prompts_objects = make_category_to_prompt_map();
        const map_category_to_prompts_text = new Map();
        for (const k of map_category_to_prompts_objects.keys()) {
            map_category_to_prompts_text.set(k.text(), map_category_to_prompts_objects.get(k)); // do via lodash
        }
        sunburstPlot.on("plotly_sunburstclick", event => {
            const point = event.points[0];
            console.log(`sunburst click:`);
            console.log(point.label);
            console.log(point["currentPath"]);
            $("#sunburst_text").text(point.label);
            if (map_category_to_prompts_text.get(point.label)) {
                const prompts = map_category_to_prompts_text.get(point.label);
                const random_prompt = _.sampleSize(prompts, 1)[0];
                $("#sunburst_text").text(`${point.label}:${random_prompt}`);
            }
        });
    });
}
$(sunburst_loader);
//# sourceMappingURL=play-sunburst.js.map