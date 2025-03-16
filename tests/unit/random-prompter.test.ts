import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock window.@algolia/autocomplete-js
vi.stubGlobal("window", {
  "@algolia/autocomplete-js": {
    autocomplete: vi.fn(),
    getAlgoliaResults: vi.fn(),
  },
});

// Mock shuffle from src/index
vi.mock("../../src/index", () => ({
  get_link_info: vi.fn(),
  random_from_list: vi.fn(),
  append_randomizer_div: vi.fn(),
  shuffle: vi.fn(arr => arr),
}));

// Import after mocking
import { TreeNode } from "../../src/random-prompter";

// Setup types for global variables
declare global {
  var $: any;
  var Plotly: any;
}

describe("Random Prompter", () => {
  describe("TreeNode", () => {
    it("should create a tree node with given properties", () => {
      const node = new TreeNode({
        name: "Root",
        value: 50,
        children: [{ name: "Child 1" }, { name: "Child 2" }],
      });

      expect(node.name).toBe("Root");
      expect(node.value).toBe(50);
      expect(node.children.length).toBe(2);
      expect(node.children[0].name).toBe("Child 1");
      expect(node.children[1].name).toBe("Child 2");
    });

    it("should use default values when not provided", () => {
      const node = new TreeNode({ name: "Test" });

      expect(node.name).toBe("Test");
      expect(node.value).toBe(25);
      expect(node.children).toEqual([]);
    });
  });
});
