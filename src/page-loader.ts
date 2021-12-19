// Only include this in the html files, one per file
// This allows code to seet things to refactor
import {
  add_sunburst,
  add_random_prompts,
  TreeNode,
  shuffle,
} from "./random-prompter.js";
import { get_link_info } from "./main.js";
import { get } from "lodash-es";
import { append_randomizer_div, random_from_list } from "./main.js";
import { add_imported_blog_posts } from "./blogger_import.js";

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

async function make_random_post_html() {
  const all_url_info = await get_link_info();
  //  Yuk, find a clearere way to do this
  const all_pages = Object.entries(all_url_info) // returns a list of [url, info]
    .map(e => e[1]);
  const random_post = random_from_list(all_pages);
  return makePostPreviewHTML({
    url: random_post["url"],
    title: random_post["title"],
    description: random_post["description"],
  });
}

function load_enjoy2() {
  add_sunburst("sunburst", "sunburst_text", new ThingsIEnjoy().get_tree());
  add_random_prompts();
  append_randomizer_div($("#random-blog-posts"), make_random_post_html as any);
}
function load_7_habits() {
  add_sunburst("sunburst", "sunburst_text", new SevenHabits().get_tree());
  add_random_prompts();
}
function load_ig66() {
  add_imported_blog_posts();
}
const UT = {
  SevenHabits,
  ThingsIEnjoy,
};

export { UT, load_enjoy2, load_7_habits, makePostPreviewHTML, load_ig66 };
