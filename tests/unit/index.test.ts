import { beforeEach, describe, expect, it, vi } from "vitest";

// Set up the window object with necessary properties
window["@algolia/autocomplete-js"] = {
  autocomplete: vi.fn(),
  getAlgoliaResults: vi.fn(),
};

// Mock dependencies
vi.mock("../../src/main", () => ({
  load_globals: vi.fn(),
}));

vi.mock("../../src/search", () => ({
  CreateAutoComplete: vi.fn(),
}));

vi.mock("../../src/recent", () => ({
  initRecentAllPosts: vi.fn(),
}));

vi.mock("../../src/random-prompter", () => ({
  add_random_prompts: vi.fn(),
  add_sunburst: vi.fn(),
  TreeNode: class MockTreeNode {
    constructor(label, parent, value) {
      this.label = label;
      this.parent = parent;
      this.value = value;
      this.children = [];
    }
  },
}));

vi.mock("../../src/page-loader", () => ({
  load_enjoy2: vi.fn(),
  load_7_habits: vi.fn(),
  makePostPreviewHTML: vi.fn(),
  load_ig66: vi.fn(),
  load_balance: vi.fn(),
  load_random_eulogy: vi.fn(),
}));

vi.mock("../../src/shared", () => ({
  random_from_list: vi.fn().mockReturnValue("item1"),
  shuffle: vi.fn().mockReturnValue(["item3", "item2", "item1"]),
  append_randomizer_div: vi.fn(),
  get_link_info: vi.fn().mockResolvedValue({}),
  MakeBackLinkHTML: vi.fn(),
}));

describe("Index Module", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Setup console mock
    console.log = vi.fn();

    // Mock jQuery
    global.$ = vi.fn().mockReturnValue({
      ready: vi.fn((cb) => cb()),
      focus: vi.fn(),
      length: 1,
    });

    // Mock Mousetrap
    global.Mousetrap = vi.fn().mockReturnValue({
      bind: vi.fn(),
    });

    // Mock defer function
    global.defer = vi.fn((fn) => fn());

    // Set up DOM
    document.body.innerHTML = `
      <div id="search-box"></div>
      <div id="toc-content"></div>
    `;
  });

  it("should initialize when ready", async () => {
    // Import the index module which will run initialization
    const index = await import("../../src/index");

    // Verify it loaded and basic functionality works
    expect(index.random_from_list).toBeDefined();
    expect(index.shuffle).toBeDefined();

    // Check that jQuery ready was called (indirectly)
    const { load_globals } = await import("../../src/main");
    expect(load_globals).toHaveBeenCalled();
  });
});
