import { get } from "lodash-es";
import { add_eulogy_roles, add_imported_blog_posts } from "./blogger_import.js";
import { get_link_info } from "./index";
import { append_randomizer_div, random_from_list } from "./index";
// Only include this in the html files, one per file
// This allows code to seet things to refactor
import { TreeNode, add_random_prompts, add_sunburst } from "./random-prompter";

/**
 * Class representing the Seven Habits tree structure
 */
export class SevenHabits {
  /**
   * Gets the tree structure for Seven Habits visualization
   * @returns {TreeNode} The root node of the Seven Habits tree
   */
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

/**
 * Class representing the Things I Enjoy tree structure
 */
export class ThingsIEnjoy {
  /**
   * Gets the tree structure for Things I Enjoy visualization
   * @returns {TreeNode} The root node of the Things I Enjoy tree
   */
  get_tree() {
    const health = new TreeNode({
      name: "Health",
      children: [{ name: "Physical" }, { name: "Emotional" }, { name: "Cognative" }],
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
      children: [new TreeNode({ name: "Biking" }), new TreeNode({ name: "Tech" }), new TreeNode({ name: "Juggling" })],
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
      children: [new TreeNode({ name: "Balloons" }), new TreeNode({ name: "Joy to Others" })],
    });

    return new TreeNode({
      name: "Invest in",
      children: [health, magic, hobbies, relationships, joy],
    });
  }
}

/**
 * Creates HTML for a post preview with audio player
 * @param {Object} param0 Object containing url, title, and description
 * @returns {string} HTML string for the post preview
 */
export function makePostPreviewHTML({ url, title, description }) {
  // TODO: HACK: Strip to the right of Week number
  const title_href = `<a href='${url}'}>${title}</a>`;
  // random id for audio player
  const id = `audio_player_${Math.floor(Math.random() * 10000000000)}`;
  // filename is URL with '/' turned to '_'
  const filename = url.replace(/\//g, "_");

  return `
    <div>
        <audio id='${id}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${filename}.mp3" type="audio/mp3">
        </audio>
      ${title_href}:  <b><a class='lead' onclick="toggle_play_pause('${id}')">🔈</a></b> ${description}
    </div>
  `;
}

/**
 * Generates HTML for a random post
 * @param {Function} linkInfoProvider Function to get link info (default: get_link_info)
 * @param {Function} randomSelector Function to get a random item (default: random_from_list)
 * @returns {Promise<string>} HTML string for the random post
 */
export async function make_random_post_html(linkInfoProvider = get_link_info, randomSelector = random_from_list) {
  try {
    const all_url_info = await linkInfoProvider();
    //  Yuk, find a clearere way to do this
    const all_pages = Object.entries(all_url_info) // returns a list of [url, info]
      .map((e) => e[1]);
    const random_post = randomSelector(all_pages);
    return makePostPreviewHTML({
      url: random_post.url,
      title: random_post.title,
      description: random_post.description,
    });
  } catch (error) {
    console.error("Error generating random post HTML:", error);
    return "<div>Could not load random post</div>";
  }
}

/**
 * Loads random eulogy roles into specified elements
 * @param {string} element1 ID of first element (default: "#e1")
 * @param {string} element2 ID of second element (default: "#e2")
 * @param {string} element3 ID of third element (default: "#e3")
 * @param {Function} eulogyLoader Function to add eulogy roles (default: add_eulogy_roles)
 */
export function load_random_eulogy(
  element1 = "#e1",
  element2 = "#e2",
  element3 = "#e3",
  eulogyLoader = add_eulogy_roles,
) {
  try {
    eulogyLoader(element1);
    eulogyLoader(element2);
    eulogyLoader(element3);
  } catch (error) {
    console.error("Error loading random eulogy:", error);
  }
}

/**
 * Loads content for the Enjoy page
 * @param {Function} sunburstAdder Function to add sunburst (default: add_sunburst)
 * @param {Function} promptsAdder Function to add random prompts (default: add_random_prompts)
 * @param {Function} postsAdder Function to add blog posts (default: add_imported_blog_posts)
 * @param {Function} eulogyAdder Function to add eulogy roles (default: add_eulogy_roles)
 * @param {Function} randomizerAppender Function to append randomizer (default: append_randomizer_div)
 */
export function load_enjoy2(
  sunburstAdder = add_sunburst,
  promptsAdder = add_random_prompts,
  postsAdder = add_imported_blog_posts,
  eulogyAdder = add_eulogy_roles,
  randomizerAppender = append_randomizer_div,
) {
  try {
    sunburstAdder("sunburst", "sunburst_text", new ThingsIEnjoy().get_tree());
    promptsAdder();
    postsAdder(); // has a random achievement post
    eulogyAdder("#random-eulogy-role");
    randomizerAppender("#random-blog-posts", async () => await make_random_post_html());
  } catch (error) {
    console.error("❌ Error loading enjoy page:", error);
  }
}

/**
 * Loads content for the 7 Habits page
 * @param {Function} sunburstAdder Function to add sunburst (default: add_sunburst)
 * @param {Function} promptsAdder Function to add random prompts (default: add_random_prompts)
 */
export function load_7_habits(sunburstAdder = add_sunburst, promptsAdder = add_random_prompts) {
  try {
    sunburstAdder("sunburst", "sunburst_text", new SevenHabits().get_tree());
    promptsAdder();
  } catch (error) {
    console.error("Error loading 7 habits page:", error);
  }
}

/**
 * Loads content for the IG66 page
 * @param {Function} postsAdder Function to add blog posts (default: add_imported_blog_posts)
 */
export function load_ig66(postsAdder = add_imported_blog_posts) {
  try {
    postsAdder();
  } catch (error) {
    console.error("Error loading IG66 page:", error);
  }
}

/**
 * Loads content for the Balance page
 * @param {Function} restChartMaker Function to make rest chart (default: make_balance_chart_by_desired_time_rest)
 * @param {Function} workChartMaker Function to make work chart (default: make_balance_chart_by_work)
 * @param {Function} radarMapMaker Function to make radar map (default: make_radar_map)
 */
export function load_balance(
  restChartMaker = make_balance_chart_by_desired_time_rest,
  workChartMaker = make_balance_chart_by_work,
  radarMapMaker = make_radar_map,
) {
  try {
    restChartMaker("balance-heatmap-rest");
    workChartMaker("balance-heatmap-work");
    radarMapMaker("balance-radar-map-ideal");
  } catch (error) {
    console.error("Error loading balance page:", error);
  }
}

// Month names for charts
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Constants for heatmap configuration
export const row_height = 20;
export const heatmap_base = 100;
export const ideal_color = "#00BF00";

/**
 * Creates a radar map visualization
 * @param {string} div ID of the element to render the map in
 * @param {Object} plotly Plotly library (optional)
 */
export async function make_radar_map(div, plotly?) {
  const data = [
    {
      type: "scatterpolar",
      r: [8, 8, 8, 5, 8, 8, 8],
      theta: ["Work", "Tech", "Health", "Hobbies", "Relationships", "Magic", "Work"],
      name: "2020 Goal",
      fill: "toself",
    },
    {
      type: "scatterpolar",
      r: [7, 7, 5, 5, 5, 9, 7],
      theta: ["Work", "Tech", "Health", "Hobbies", "Relationships", "Magic", "Work"],
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

  if (typeof plotly !== "undefined" && plotly) {
    try {
      await plotly.newPlot(div, data, layout, config);
    } catch (error) {
      console.error("Error creating radar map:", error);
    }
  } else {
    console.warn("Plotly is not defined, skipping chart rendering");
  }
}

/**
 * Creates a heatmap for work balance
 * @param {string} div ID of the element to render the heatmap in
 * @param {Object} plotly Plotly library (optional)
 */
export async function make_balance_chart_by_work(div, plotly?) {
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

  if (typeof plotly !== "undefined" && plotly) {
    try {
      await plotly.newPlot(div, data, layout, config);
    } catch (error) {
      console.error("Error creating work balance chart:", error);
    }
  } else {
    console.warn("Plotly is not defined, skipping chart rendering");
  }
}

/**
 * Creates a heatmap for desired rest time
 * @param {string} div ID of the element to render the heatmap in
 * @param {Object} plotly Plotly library (optional)
 */
export async function make_balance_chart_by_desired_time_rest(div, plotly?) {
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

  if (typeof plotly !== "undefined" && plotly) {
    try {
      await plotly.newPlot(div, data, layout, config);
    } catch (error) {
      console.error("Error creating rest time chart:", error);
    }
  } else {
    console.warn("Plotly is not defined, skipping chart rendering");
  }
}

// Export utility functions for testing
export const UT = {
  SevenHabits,
  ThingsIEnjoy,
};
