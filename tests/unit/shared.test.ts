import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  random_from_list,
  shuffle,
  append_randomizer_div,
} from "../../src/shared";

// Add jQuery type declaration
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
  var $: any;
  var jQuery: any;
}

describe("Shared Utility Functions", () => {
  describe("random_from_list", () => {
    it("should return an element from the list", () => {
      const list = [1, 2, 3, 4, 5];
      const result = random_from_list(list);
      expect(list).toContain(result);
    });

    it("should return undefined for empty list", () => {
      expect(random_from_list([])).toBeUndefined();
    });

    it("should have a roughly even distribution over many calls", () => {
      // This is a statistical test, so it could occasionally fail
      // even if the function is working correctly
      const list = [1, 2, 3, 4, 5];
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      // Run many iterations to get a distribution
      for (let i = 0; i < 1000; i++) {
        const result = random_from_list(list);
        counts[result]++;
      }

      // Each item should be selected roughly 200 times (1000/5)
      // Allow for some statistical variation (150-250 is reasonable)
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(150);
        expect(count).toBeLessThan(250);
      });
    });
  });

  describe("shuffle", () => {
    it("should return an array of the same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle([...input]);
      expect(result.length).toBe(input.length);
    });

    it("should contain all the same elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle([...input]);
      expect(result.sort()).toEqual(input.sort());
    });

    it("should change the order of elements (most of the time)", () => {
      // This test could occasionally fail if the shuffle happens to return
      // the same order, but that's very unlikely with a longer array
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let sameOrderCount = 0;

      // Run multiple shuffles to reduce the chance of a false positive
      for (let i = 0; i < 10; i++) {
        const result = shuffle([...input]);

        // Check if arrays are in the same order
        const sameOrder = input.every((val, idx) => val === result[idx]);
        if (sameOrder) sameOrderCount++;
      }

      // It's extremely unlikely that more than 1 shuffle would return the original order
      expect(sameOrderCount).toBeLessThan(2);
    });
  });

  describe("append_randomizer_div", () => {
    beforeEach(() => {
      // Set up the DOM
      document.body.innerHTML = '<div id="test-container"></div>';

      // Mock jQuery
      global.$ = vi.fn().mockImplementation((selector: string) => {
        if (selector === "#test-container") {
          return {
            length: 1,
            html: vi.fn(),
            click: vi.fn().mockImplementation(function (
              this: any,
              callback: Function
            ) {
              // Store the callback for testing
              this.clickCallback = callback;
              return this;
            }),
            append: vi.fn().mockReturnThis(),
          };
        }
        return { length: 0 };
      });
    });

    it("should not append anything if parent is not found", async () => {
      const htmlFactory = vi.fn().mockReturnValue("<p>Test content</p>");
      await append_randomizer_div("#non-existent", htmlFactory);

      expect(htmlFactory).not.toHaveBeenCalled();
    });

    // Add more tests for append_randomizer_div as needed
  });
});
