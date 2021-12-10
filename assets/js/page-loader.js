// Only include this in the html files, one per file
// This allows code to seet things to refactor
import { add_sunburst, add_random_prompts, TreeNode, } from "./random-prompter.js";
class SevenHabits {
    get_tree() {
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
}
class ThingsIEnjoy {
    get_tree() {
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
}
function load_enjoy2() {
    add_sunburst("sunburst", "sunburst_text", new ThingsIEnjoy().get_tree());
    add_random_prompts();
}
function load_7_habits() {
    add_sunburst("sunburst", "sunburst_text", new SevenHabits().get_tree());
    add_random_prompts();
}
const UT = {
    SevenHabits,
    ThingsIEnjoy,
};
export { UT, load_enjoy2, load_7_habits };
//# sourceMappingURL=page-loader.js.map