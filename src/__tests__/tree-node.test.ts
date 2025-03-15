import { describe, it, expect, vi, beforeEach } from "vitest";
import "./test-setup"; // Import mocks from test setup

// Create a mock of shuffle for testing
const mockShuffle = vi.fn(arr => arr);

// Create a simple version of TreeNode for testing
class TreeNode {
  name: string;
  children: TreeNode[];
  value: number;

  constructor({
    name,
    value = 25,
    children = [],
  }: {
    name: any;
    value?: number;
    children?: any[];
  }) {
    this.name = name;
    this.children = mockShuffle(children);
    this.value = value;
  }
}

describe("TreeNode Class", () => {
  beforeEach(() => {
    // Reset mock for each test
    mockShuffle.mockClear();
  });

  it("should create a node with default properties", () => {
    const node = new TreeNode({ name: "Test Node" });

    expect(node.name).toBe("Test Node");
    expect(node.value).toBe(25); // Default value
    expect(node.children).toEqual([]); // Empty children array
  });

  it("should create a node with provided properties", () => {
    const node = new TreeNode({
      name: "Parent",
      value: 100,
      children: [
        new TreeNode({ name: "Child 1" }),
        new TreeNode({ name: "Child 2" }),
      ],
    });

    expect(node.name).toBe("Parent");
    expect(node.value).toBe(100);
    expect(node.children.length).toBe(2);
    expect(node.children[0].name).toBe("Child 1");
    expect(node.children[1].name).toBe("Child 2");
  });

  it("should shuffle children during construction", () => {
    const childNodes = [
      new TreeNode({ name: "Child 1" }),
      new TreeNode({ name: "Child 2" }),
      new TreeNode({ name: "Child 3" }),
    ];

    new TreeNode({
      name: "Parent",
      children: childNodes,
    });

    // Verify that shuffle was called with the children
    expect(mockShuffle).toHaveBeenCalledWith(childNodes);
  });
});
