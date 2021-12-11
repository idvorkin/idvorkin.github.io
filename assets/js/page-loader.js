// Only include this in the html files, one per file
// This allows code to seet things to refactor
import { add_sunburst, add_random_prompts, TreeNode, shuffle, } from "./random-prompter.js";
import { get_link_info } from "./main.js";
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
// TODO: De-Dup from blogger_import.ts
function makePostPreviewHTML({ url, title, description }) {
    // TODO: HACK: Strip to the right of Week number
    const title_href = `<a href='${url}'}>${title}</a>`;
    return `
    <div class='alert alert-info'>
      ${title_href}: ${description}
    </div>
  `;
}
async function add_random_post(element) {
    const all_url_info = await get_link_info();
    console.log("AUI as OE", Object.entries(all_url_info));
    //  Yuk, find a clearere way to do this
    const all_pages = Object.entries(all_url_info) // returns a list of [url, info]
        .map(e => e[1]);
    console.log("AP", all_pages);
    const random_post = shuffle(all_pages)[0];
    const new_element_html = makePostPreviewHTML({
        url: random_post["url"],
        title: random_post["title"],
        description: random_post["description"],
    });
    const new_element = $(new_element_html);
    console.log(new_element);
    $(element)
        .empty()
        .append(new_element);
    // Clicking on the element should result in a reload, unless you're
    // Clicking on a link
    new_element.click(event => {
        if (event.target.tagName != "A") {
            add_random_post(element);
        }
    });
}
function load_enjoy2() {
    add_sunburst("sunburst", "sunburst_text", new ThingsIEnjoy().get_tree());
    add_random_prompts();
    add_random_post("#random-blog-posts");
}
function load_7_habits() {
    add_sunburst("sunburst", "sunburst_text", new SevenHabits().get_tree());
    add_random_prompts();
}
const UT = {
    SevenHabits,
    ThingsIEnjoy,
};
export { UT, load_enjoy2, load_7_habits, makePostPreviewHTML };
//# sourceMappingURL=page-loader.js.map