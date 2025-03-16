import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  toggleClass,
  createElement,
  findClosestParent,
} from "../../src/utils/dom-helpers";

describe("DOM Helper Functions", () => {
  // Setup and teardown
  beforeEach(() => {
    // Create a test container for DOM operations
    document.body.innerHTML = `
      <div id="test-container">
        <div id="test-element" class="initial-class"></div>
      </div>
    `;
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = "";
  });

  describe("toggleClass", () => {
    it("should toggle a class on an element when using a selector", () => {
      const element = toggleClass("#test-element", "test-class");
      expect(element.classList.contains("test-class")).toBe(true);

      // Toggle again to remove
      toggleClass("#test-element", "test-class");
      expect(element.classList.contains("test-class")).toBe(false);
    });

    it("should toggle a class on an element when using an element reference", () => {
      const el = document.querySelector("#test-element") as HTMLElement;
      toggleClass(el, "test-class");
      expect(el.classList.contains("test-class")).toBe(true);
    });

    it("should add a class when force parameter is true", () => {
      const element = toggleClass("#test-element", "test-class", true);
      expect(element.classList.contains("test-class")).toBe(true);

      // Should not toggle off when force is true
      toggleClass("#test-element", "test-class", true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("should remove a class when force parameter is false", () => {
      // First add the class
      const el = document.querySelector("#test-element") as HTMLElement;
      el.classList.add("test-class");

      // Then remove it with force=false
      toggleClass(el, "test-class", false);
      expect(el.classList.contains("test-class")).toBe(false);
    });

    it("should return null when element is not found", () => {
      const result = toggleClass("#non-existent", "test-class");
      expect(result).toBeNull();
    });
  });

  describe("createElement", () => {
    it("should create an element with the specified tag", () => {
      const element = createElement("div");
      expect(element.tagName).toBe("DIV");
    });

    it("should set attributes on the created element", () => {
      const element = createElement("a", {
        href: "https://example.com",
        class: "link-class",
        id: "test-link",
      });

      expect(element.getAttribute("href")).toBe("https://example.com");
      expect(element.getAttribute("class")).toBe("link-class");
      expect(element.getAttribute("id")).toBe("test-link");
    });

    it("should append text children to the element", () => {
      const element = createElement("p", {}, ["Hello, world!"]);
      expect(element.textContent).toBe("Hello, world!");
    });

    it("should append node children to the element", () => {
      const childNode = document.createElement("span");
      childNode.textContent = "Child node";

      const element = createElement("div", {}, [childNode]);
      expect(element.firstChild).toBe(childNode);
      expect(element.textContent).toBe("Child node");
    });

    it("should handle mixed text and node children", () => {
      const childNode = document.createElement("em");
      childNode.textContent = "emphasized";

      const element = createElement("p", {}, ["This is ", childNode, " text."]);

      expect(element.childNodes.length).toBe(3);
      expect(element.textContent).toBe("This is emphasized text.");
    });
  });

  describe("findClosestParent", () => {
    beforeEach(() => {
      // Create a nested structure for testing findClosestParent
      document.body.innerHTML = `
        <div id="grandparent" class="level-1">
          <div id="parent" class="level-2">
            <div id="child" class="level-3">
              <div id="grandchild" class="level-4"></div>
            </div>
          </div>
        </div>
      `;
    });

    it("should find the immediate parent element matching a selector", () => {
      const child = document.getElementById("grandchild");
      const parent = findClosestParent(child, "#child");
      expect(parent).not.toBeNull();
      expect(parent.id).toBe("child");
    });

    it("should find a distant parent element matching a selector", () => {
      const child = document.getElementById("grandchild");
      const grandparent = findClosestParent(child, "#grandparent");
      expect(grandparent).not.toBeNull();
      expect(grandparent.id).toBe("grandparent");
    });

    it("should find a parent element by class selector", () => {
      const child = document.getElementById("grandchild");
      const parent = findClosestParent(child, ".level-2");
      expect(parent).not.toBeNull();
      expect(parent.id).toBe("parent");
    });

    it("should return null when no matching parent is found", () => {
      const child = document.getElementById("grandchild");
      const result = findClosestParent(child, ".non-existent");
      expect(result).toBeNull();
    });
  });
});
