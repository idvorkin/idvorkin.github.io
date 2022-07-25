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
import { add_imported_blog_posts, add_eulogy_roles } from "./blogger_import.js";

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
        new TreeNode({ name: "Zach" }),
        new TreeNode({ name: "Amelia" }),
        new TreeNode({ name: "Tori" }),
        new TreeNode({ name: "Friends" }),
      ],
    });
    const joy = new TreeNode({
      name: "Joy",
      children: [
        new TreeNode({ name: "Balloons" }),
        new TreeNode({ name: "Joy to Others" }),
      ],
    });

    return new TreeNode({
      name: "Invest in",
      children: [health, magic, hobbies, relationships, joy],
    });
  }
}

// TODO: De-Dup from blogger_import.ts

function makePostPreviewHTML({ url, title, description }) {
  // TODO: HACK: Strip to the right of Week number
  const title_href = `<a href='${url}'}>${title}</a>`;
  return `
    <div>
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

function load_random_eulogy() {
  add_imported_blog_posts(); // has a random achievement post
  add_eulogy_roles("e1");
  add_eulogy_roles("e2");
  add_eulogy_roles("e3");
  add_eulogy_roles("e4");
  add_eulogy_roles("e5");
}

function load_enjoy2() {
  add_sunburst("sunburst", "sunburst_text", new ThingsIEnjoy().get_tree());
  add_random_prompts();
  add_imported_blog_posts(); // has a random achievement post
  add_eulogy_roles("#random-eulogy-role");
  append_randomizer_div("#random-blog-posts", make_random_post_html as any);
}
function load_7_habits() {
  add_sunburst("sunburst", "sunburst_text", new SevenHabits().get_tree());
  add_random_prompts();
}
function load_ig66() {
  add_imported_blog_posts();
}
function load_balance() {
  make_balance_chart_by_desired_time_rest("balance-heatmap-rest");
  make_balance_chart_by_work("balance-heatmap-work");
  make_radar_map("balance-radar-map-ideal");
}
const UT = {
  SevenHabits,
  ThingsIEnjoy,
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

async function make_radar_map(div) {
  const data = [
    {
      type: "scatterpolar",
      r: [8, 8, 8, 5, 8, 8, 8],
      theta: [
        "Work",
        "Tech",
        "Health",
        "Hobbies",
        "Relationships",
        "Magic",
        "Work",
      ],
      name: "2020 Goal",
      fill: "toself",
    },
    {
      type: "scatterpolar",
      r: [7, 7, 5, 5, 5, 9, 7],
      theta: [
        "Work",
        "Tech",
        "Health",
        "Hobbies",
        "Relationships",
        "Magic",
        "Work",
      ],
      name: "2020 Actual",
      fill: "toself",
    },
  ];

  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10],
      },
    },
    showlegend: true,
  };
  const config = {
    displayModeBar: false,
  };

  Plotly.newPlot(div, data as any, layout, config);
}

const row_height = 20;
const heatmap_base = 100;
const ideal_color = "#00BF00";
async function make_balance_chart_by_work(div) {
  const roles = ["Tech", "Work"];
  const layout = {
    height: row_height * roles.length + heatmap_base,
    margin: {
      t: 5,
    },
    pad: 0,
  };
  const color_scale = [
    [0.0, "darkblue"],
    [0.4, "blue"],
    [0.5, ideal_color],
    [0.6, "darkred"],
    [1.0, "red"],
  ];
  const gap_desire_over_time = [
    [7, 4, 7, 8, 2, 4, 2, 3, 2, 8], //  Tech
    [10, 7, 5, 5, 3, 5, 6, 6, 7, 5], //  Work
  ];

  const data = [
    {
      colorscale: color_scale,
      zmin: 0,
      zmax: 10,
      x: months.slice(2, 13),
      y: roles,
      z: gap_desire_over_time,
      type: "heatmap",
    },
  ];
  const config = {
    displayModeBar: false,
  };

  await (Plotly as any).newPlot(div, data, layout, config);
}

// Could be over or under
// GREEN be Good,
// RED be Bad
async function make_balance_chart_by_desired_time_rest(div) {
  const roles = ["Health", "Hobbies", "Family", "Magic"];
  const gap_desire_over_time = [
    // J, F, M, A, M, J, J, A, S, O, N, D
    [4, 4, 3, 4, 5, 3, 2, 2, 3, 2], // Health
    [4, 4, 3, 4, 5, 4, 4, 2, 4, 5], // Hobbies
    [2, 3, 3, 4, 1, 5, 4, 3, 2, 4], // Family
    [5, 5, 5, 4, 5, 5, 4, 5, 4, 5], //  Magic
  ];

  const color_scale = [
    [0.0, "red"],
    [0.4, "darkred"],
    [0.5, ideal_color],
    [0.6, "blue"],
    [1.0, "darkblue"],
  ];
  const data = [
    {
      colorscale: color_scale,
      zmin: 0,
      zmax: 10,
      x: months.slice(2, 13),
      y: roles.reverse(),
      z: gap_desire_over_time.reverse(),
      type: "heatmap",
    },
  ];
  const config = {
    displayModeBar: false,
  };
  const layout = {
    height: row_height * roles.length + heatmap_base,
    margin: {
      t: 5,
    },
    pad: 0,
  };

  await (Plotly as any).newPlot(div, data, layout, config);
}

export {
  UT,
  load_enjoy2,
  load_7_habits,
  makePostPreviewHTML,
  load_ig66,
  load_balance,
};
