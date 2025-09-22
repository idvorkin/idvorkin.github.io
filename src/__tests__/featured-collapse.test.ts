import { beforeEach, describe, expect, it, vi } from "vitest";
import { FeaturedCollapseManager, setupFeaturedCollapse } from "../featured-collapse";

describe("FeaturedCollapseManager", () => {
  let manager: FeaturedCollapseManager;
  let button: HTMLElement;
  let content: HTMLElement;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Setup DOM elements
    document.body.innerHTML = `
      <div>
        <button id="featured-collapse-btn" title="Collapse section">Collapse −</button>
        <div id="featured-results" style="display: block;">
          <div>Test content</div>
        </div>
      </div>
    `;

    button = document.getElementById("featured-collapse-btn")!;
    content = document.getElementById("featured-results")!;
    manager = new FeaturedCollapseManager();
  });

  describe("initialization", () => {
    it("should initialize successfully when elements exist", () => {
      const result = manager.initialize();
      expect(result).toBe(true);
    });

    it("should return false when button element is missing", () => {
      button.remove();
      const newManager = new FeaturedCollapseManager();
      const result = newManager.initialize();
      expect(result).toBe(false);
    });

    it("should return false when content element is missing", () => {
      content.remove();
      const newManager = new FeaturedCollapseManager();
      const result = newManager.initialize();
      expect(result).toBe(false);
    });

    it("should warn when elements are not found", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      button.remove();
      const newManager = new FeaturedCollapseManager();
      newManager.initialize();
      expect(warnSpy).toHaveBeenCalledWith("Featured collapse elements not found");
      warnSpy.mockRestore();
    });
  });

  describe("state management", () => {
    beforeEach(() => {
      manager.initialize();
    });

    it("should start in expanded state", () => {
      expect(manager.isCollapsed()).toBe(false);
      expect(content.style.display).toBe("block");
      expect(button.textContent).toBe("Collapse −");
      expect(button.title).toBe("Collapse section");
    });

    it("should toggle to collapsed state", () => {
      manager.toggle();
      expect(manager.isCollapsed()).toBe(true);
      expect(content.style.display).toBe("none");
      expect(button.textContent).toBe("Expand +");
      expect(button.title).toBe("Expand section");
    });

    it("should toggle back to expanded state", () => {
      manager.toggle(); // collapse
      manager.toggle(); // expand
      expect(manager.isCollapsed()).toBe(false);
      expect(content.style.display).toBe("block");
      expect(button.textContent).toBe("Collapse −");
      expect(button.title).toBe("Collapse section");
    });

    it("should collapse directly", () => {
      manager.collapse();
      expect(manager.isCollapsed()).toBe(true);
      expect(content.style.display).toBe("none");
    });

    it("should expand directly", () => {
      manager.collapse();
      manager.expand();
      expect(manager.isCollapsed()).toBe(false);
      expect(content.style.display).toBe("block");
    });
  });

  describe("click handling", () => {
    beforeEach(() => {
      manager.initialize();
    });

    it("should toggle state on button click", () => {
      const clickEvent = new MouseEvent("click");
      button.dispatchEvent(clickEvent);

      expect(manager.isCollapsed()).toBe(true);
      expect(content.style.display).toBe("none");
    });

    it("should prevent default action on click", () => {
      const clickEvent = new MouseEvent("click", { cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

      button.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should handle multiple clicks correctly", () => {
      const clickEvent = new MouseEvent("click");

      // First click - collapse
      button.dispatchEvent(clickEvent);
      expect(manager.isCollapsed()).toBe(true);

      // Second click - expand
      button.dispatchEvent(clickEvent);
      expect(manager.isCollapsed()).toBe(false);

      // Third click - collapse again
      button.dispatchEvent(clickEvent);
      expect(manager.isCollapsed()).toBe(true);
    });
  });

  describe("helper methods", () => {
    beforeEach(() => {
      manager.initialize();
    });

    it("should return elements via getElements", () => {
      const elements = manager.getElements();
      expect(elements.button).toBe(button);
      expect(elements.content).toBe(content);
    });

    it("should return state copy via getState", () => {
      const state1 = manager.getState();
      expect(state1.isCollapsed).toBe(false);

      manager.toggle();
      const state2 = manager.getState();
      expect(state2.isCollapsed).toBe(true);

      // Ensure it's a copy, not a reference
      state2.isCollapsed = false;
      expect(manager.isCollapsed()).toBe(true);
    });
  });

  describe("setupFeaturedCollapse helper", () => {
    it("should return manager when elements exist", () => {
      const result = setupFeaturedCollapse();
      expect(result).toBeInstanceOf(FeaturedCollapseManager);
    });

    it("should return null when elements do not exist", () => {
      document.body.innerHTML = "";
      const result = setupFeaturedCollapse();
      expect(result).toBeNull();
    });
  });

  describe("custom element IDs", () => {
    it("should work with custom button and content IDs", () => {
      document.body.innerHTML = `
        <div>
          <button id="custom-btn">Custom</button>
          <div id="custom-content">Content</div>
        </div>
      `;

      const customManager = new FeaturedCollapseManager("custom-btn", "custom-content");
      const result = customManager.initialize();

      expect(result).toBe(true);

      const elements = customManager.getElements();
      expect(elements.button?.id).toBe("custom-btn");
      expect(elements.content?.id).toBe("custom-content");
    });
  });

  describe("edge cases", () => {
    it("should handle updateUI gracefully when elements are missing", () => {
      manager.initialize();
      // Simulate elements being removed after initialization
      button.remove();
      content.remove();

      // This should not throw
      expect(() => manager.toggle()).not.toThrow();
    });

    it("should maintain state even when UI update fails", () => {
      manager.initialize();
      content.remove();

      manager.toggle();
      expect(manager.isCollapsed()).toBe(true);

      manager.toggle();
      expect(manager.isCollapsed()).toBe(false);
    });
  });

  describe("localStorage persistence", () => {
    it("should save collapsed state to localStorage", () => {
      manager.initialize();
      manager.collapse();

      expect(localStorage.getItem("featured-section-collapsed")).toBe("true");
    });

    it("should save expanded state to localStorage", () => {
      manager.initialize();
      manager.collapse();
      manager.expand();

      expect(localStorage.getItem("featured-section-collapsed")).toBe("false");
    });

    it("should load collapsed state from localStorage on initialization", () => {
      localStorage.setItem("featured-section-collapsed", "true");

      const newManager = new FeaturedCollapseManager();
      newManager.initialize();

      expect(newManager.isCollapsed()).toBe(true);
      expect(content.style.display).toBe("none");
      expect(button.textContent).toBe("Expand +");
    });

    it("should load expanded state from localStorage on initialization", () => {
      localStorage.setItem("featured-section-collapsed", "false");

      const newManager = new FeaturedCollapseManager();
      newManager.initialize();

      expect(newManager.isCollapsed()).toBe(false);
      expect(content.style.display).toBe("block");
      expect(button.textContent).toBe("Collapse −");
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage to throw errors
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error("localStorage not available");
      });

      manager.initialize();

      // Should not throw when localStorage fails
      expect(() => manager.toggle()).not.toThrow();
      expect(manager.isCollapsed()).toBe(true);

      // Restore original
      localStorage.setItem = originalSetItem;
    });

    it("should clear saved state", () => {
      manager.initialize();
      manager.collapse();
      expect(localStorage.getItem("featured-section-collapsed")).toBe("true");

      manager.clearSavedState();
      expect(localStorage.getItem("featured-section-collapsed")).toBeNull();
    });

    it("should use custom storage key when provided", () => {
      const customManager = new FeaturedCollapseManager(
        "featured-collapse-btn",
        "featured-results",
        "custom-storage-key",
      );
      customManager.initialize();
      customManager.collapse();

      expect(localStorage.getItem("custom-storage-key")).toBe("true");
      expect(localStorage.getItem("featured-section-collapsed")).toBeNull();
    });
  });
});
