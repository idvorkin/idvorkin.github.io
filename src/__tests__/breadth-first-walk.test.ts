import { describe, it, expect, vi, beforeEach } from "vitest";

// Simple TreeNode implementation for testing
class TreeNode {
  name: string;
  children: TreeNode[];

  constructor(name: string, children: TreeNode[] = []) {
    this.name = name;
    this.children = children;
  }
}

// Breadth-first walk implementation from random-prompter.ts
function* breadth_first_walk(node: TreeNode) {
  if (!node) {
    return;
  }
  let Q = [];
  Q.push([node, null as TreeNode]);
  while (Q.length > 0) {
    const [current, parent]: [TreeNode, TreeNode] = Q.shift();
    for (const child of current.children ?? []) {
      Q.push([child, current]);
    }
    yield [current, parent];
  }
}

describe("breadth_first_walk", () => {
  let tree: TreeNode;

  beforeEach(() => {
    // Create a test tree
    //       Root
    //      /    \
    //   Child1  Child2
    //    /
    // GrandChild

    const grandChild = new TreeNode("GrandChild");
    const child1 = new TreeNode("Child1", [grandChild]);
    const child2 = new TreeNode("Child2");

    tree = new TreeNode("Root", [child1, child2]);
  });

  it("should return nothing for null tree", () => {
    const walker = breadth_first_walk(null);
    const result = Array.from(walker);
    expect(result).toEqual([]);
  });

  it("should traverse tree in breadth-first order", () => {
    const walker = breadth_first_walk(tree);
    const nodes = Array.from(walker).map(([node, _]) => node.name);

    expect(nodes).toEqual(["Root", "Child1", "Child2", "GrandChild"]);
  });

  it("should provide parent references during traversal", () => {
    const walker = breadth_first_walk(tree);
    const nodeParentPairs = Array.from(walker).map(([node, parent]) => ({
      node: node.name,
      parent: parent?.name,
    }));

    expect(nodeParentPairs).toEqual([
      { node: "Root", parent: undefined },
      { node: "Child1", parent: "Root" },
      { node: "Child2", parent: "Root" },
      { node: "GrandChild", parent: "Child1" },
    ]);
  });

  it("should handle a single node tree", () => {
    const singleNode = new TreeNode("Single");
    const walker = breadth_first_walk(singleNode);
    const result = Array.from(walker);

    expect(result.length).toBe(1);
    expect(result[0][0].name).toBe("Single");
    expect(result[0][1]).toBeNull();
  });

  it("should handle nodes with no children properly", () => {
    // Create a leaf node
    const leaf = new TreeNode("Leaf");
    const walker = breadth_first_walk(leaf);
    const result = Array.from(walker);

    expect(result.length).toBe(1);
    expect(result[0][0].name).toBe("Leaf");
  });
});
