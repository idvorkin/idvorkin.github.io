import { random_from_list, shuffle } from "../../src/main";

describe("Main module functions", () => {
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
  });

  describe("random_from_list", () => {
    it("should return an element from the list", () => {
      const input = [1, 2, 3, 4, 5];
      const result = random_from_list(input);
      expect(input).toContain(result);
    });

    it("should return undefined for empty list", () => {
      const result = random_from_list([]);
      expect(result).toBeUndefined();
    });
  });
});
