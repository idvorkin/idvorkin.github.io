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
    constructor({ name, value = 100, children = [] }) {
        this.name = name;
        this.children = children;
        this.value = value;
    }
}
function get_energy_allocation() {
    const health = new TreeNode({ name: "Health", children: [], value: 25 });
    const hobbies = new TreeNode({
        name: "Hobbies",
        children: [
            { name: "Magic", children: [], value: 25 },
            { name: "Biking", children: [], value: 10 },
            { name: "Tech", children: [], value: 25 }
        ],
        value: 0
    });
    const relationships = new TreeNode({
        name: "Relationships",
        children: [
            {
                name: "Kids",
                children: [
                    { name: "Zach", children: [], value: 25 },
                    { name: "Amelia", children: [], value: 10 }
                ],
                value: 25
            },
            { name: "Wife", children: [], value: 25 },
            { name: "Friends", children: [], value: 50 }
        ],
        value: 0
    });
    const work = new TreeNode({ name: "Work", children: [], value: 100 });
    const root = new TreeNode({
        name: "Investments",
        children: [health, hobbies, relationships, work],
        value: 0
    });
    return root;
}
// sunburst format is an inorder traversal of the tree.
// good thing to unit test
function* in_order_walk(node) {
    let Q = [];
    Q.push([node, null]);
    while (Q.length > 0) {
        const [current, parent] = Q.shift();
        for (const child of current.children) {
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
        marker: { line: { width: 2 } }
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
        sunburst_data[0]["values"] = sunburst_data2.values;
        const sunburstPlot = yield Plotly.newPlot("sunburst", sunburst_data, layout);
        sunburstPlot.on("plotly_sunburstclick", event => {
            const point = event.points[0];
            console.log(`sunburst click:`);
            console.log(point.label);
            console.log(point["currentPath"]);
        });
    });
}
$(sunburst_loader);
