/**
 * Main JavaScript Entry Point
 *
 * This file serves as the single entry point for all JavaScript functionality
 * on the blog. It imports and initializes all necessary modules.
 */

// Import main functionality
import { load_globals, enableChartZoom } from "./main";
// Import page-loader functionality
import {
  load_7_habits,
  load_auto_sunburst,
  load_balance,
  load_enjoy2,
  load_ig66,
  load_random_eulogy,
  makePostPreviewHTML,
  make_random_post_html,
} from "./page-loader";
// Import random-prompter functionality
import { TreeNode, add_random_prompts, add_sunburst, add_sunburst_from_dom } from "./random-prompter";

// Import recent posts functionality
import { initRecentAllPosts } from "./recent";
// Import search functionality
import { CreateAutoComplete, get_random_post, get_random_posts_batch, get_recent_posts } from "./search";
// Import shared utilities
import {
  type IURLInfo,
  type IURLInfoMap,
  MakeBackLinkHTML,
  append_randomizer_div,
  defer,
  get_link_info,
  get_random_page_url,
  random_from_list,
  shuffle,
} from "./shared";

// Declare global variables from external libraries
declare let $: {
  (
    selector: string,
  ): {
    ready: (fn: () => void) => void;
    length: number;
    focus: () => void;
  };
  (
    document: Document,
  ): {
    ready: (fn: () => void) => void;
  };
};
declare let Mousetrap: {
  bind: (key: string, callback: () => void) => void;
};

// Declare global window extension
declare global {
  interface Window {
    enableChartZoom: typeof enableChartZoom;
  }
}

// Main initialization
$(document).ready(() => {
  // Initialize main functionality
  const tocExpand = true;

  // Call the global initialization function from main.ts
  defer(load_globals);

  // Setup event handlers
  const setupKeyboardShortcuts = () => {
    if (typeof Mousetrap !== "undefined") {
      Mousetrap.bind("s", () => focusSearch());
      // Add other keyboard shortcuts as needed
    }
  };

  const focusSearch = () => {
    const searchInput = $("#search-box");
    if (searchInput.length > 0) {
      searchInput.focus();
    }
  };

  // Initialize components
  setupKeyboardShortcuts();
  initializeTOC();
  initializeSearch();

  // Example usage of shared utilities
  const items = ["item1", "item2", "item3"];
  console.log("Random item:", random_from_list(items));
  console.log("Shuffled items:", shuffle([...items]));

  // Initialize link loading
  get_link_info().then((links) => {
    console.log("Links loaded, count:", Object.keys(links).length);
  });

  // Log successful initialization
  console.log("Blog JavaScript initialized");
});

// Initialize TOC
function initializeTOC() {
  const tocElement = $("#toc-content");
  if (tocElement.length > 0) {
    // TOC initialization code
    console.log("TOC initialized");
  }
}

// Initialize search
function initializeSearch() {
  const searchElement = $("#search-box");
  if (searchElement.length > 0) {
    // Search initialization code
    console.log("Search initialized");
  }
}

// Export shared utilities and main functions for potential direct use
export {
  random_from_list,
  shuffle,
  append_randomizer_div,
  defer,
  get_link_info,
  get_random_page_url,
  // Export the interface types
  type IURLInfo,
  type IURLInfoMap,
  load_globals,
  enableChartZoom,
  MakeBackLinkHTML,
  CreateAutoComplete,
  get_random_post,
  get_recent_posts,
  get_random_posts_batch,
  // Recent posts export
  initRecentAllPosts,
  // Random prompter exports
  add_random_prompts,
  add_sunburst,
  add_sunburst_from_dom,
  TreeNode,
  // Page loader exports
  load_enjoy2,
  load_7_habits,
  load_auto_sunburst,
  makePostPreviewHTML,
  make_random_post_html,
  load_ig66,
  load_balance,
  load_random_eulogy,
};

// Expose enableChartZoom globally for conditional loading
if (typeof window !== "undefined") {
  window.enableChartZoom = enableChartZoom;
}
