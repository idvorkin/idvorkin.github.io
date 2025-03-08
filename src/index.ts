/**
 * Main JavaScript Entry Point
 *
 * This file serves as the single entry point for all JavaScript functionality
 * on the blog. It imports and initializes all necessary modules.
 */

// Import shared utilities
import {
  random_from_list,
  shuffle,
  append_randomizer_div,
  get_link_info,
  type IURLInfo,
  type IURLInfoMap,
} from "./shared";

// Import main functionality
import { load_globals, MakeBackLinkHTML } from "./main";

// Import search functionality
import { CreateAutoComplete } from "./search";

// Import recent posts functionality
import { initRecentAllPosts } from "./recent";

// Import random-prompter functionality
import { add_random_prompts, add_sunburst, TreeNode } from "./random-prompter";

// Import page-loader functionality
import {
  load_enjoy2,
  load_7_habits,
  makePostPreviewHTML,
  load_ig66,
  load_balance,
  load_random_eulogy,
} from "./page-loader";

// Declare global variables from external libraries
declare var $: any;
declare var Mousetrap: any;
declare global {
  function defer(fn: Function): void;
}

// Main initialization
$(document).ready(function () {
  // Initialize main functionality
  let tocExpand = true;

  // Call the global initialization function from main.ts
  if (typeof defer === "function") {
    defer(load_globals);
  } else {
    load_globals();
  }

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
  get_link_info().then(links => {
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
  get_link_info,
  // Export the interface types
  type IURLInfo,
  type IURLInfoMap,
  load_globals,
  MakeBackLinkHTML,
  CreateAutoComplete,
  // Recent posts export
  initRecentAllPosts,
  // Random prompter exports
  add_random_prompts,
  add_sunburst,
  TreeNode,
  // Page loader exports
  load_enjoy2,
  load_7_habits,
  makePostPreviewHTML,
  load_ig66,
  load_balance,
  load_random_eulogy,
};
