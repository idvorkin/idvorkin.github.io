import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentPort, getCurrentPR, isDevServer } from "../dev-info";

describe("dev-info", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    (window as any).location = undefined;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe("isDevServer", () => {
    it("should return true for localhost", () => {
      window.location = { hostname: "localhost" } as Location;
      expect(isDevServer()).toBe(true);
    });

    it("should return true for 127.0.0.1", () => {
      window.location = { hostname: "127.0.0.1" } as Location;
      expect(isDevServer()).toBe(true);
    });

    it("should return false for production domain", () => {
      window.location = { hostname: "idvork.in" } as Location;
      expect(isDevServer()).toBe(false);
    });
  });

  describe("getCurrentPort", () => {
    it("should return port when specified", () => {
      window.location = { port: "3000" } as Location;
      expect(getCurrentPort()).toBe("3000");
    });

    it("should return 80 when no port specified", () => {
      window.location = { port: "" } as Location;
      expect(getCurrentPort()).toBe("80");
    });

    it("should return 4000 for Jekyll default", () => {
      window.location = { port: "4000" } as Location;
      expect(getCurrentPort()).toBe("4000");
    });
  });

  describe("getCurrentPR", () => {
    it("should return PR number when global variable is set", () => {
      (window as any).__GIT_PR__ = 123;
      expect(getCurrentPR()).toBe(123);
    });

    it("should return null when PR is not set", () => {
      (window as any).__GIT_PR__ = null;
      expect(getCurrentPR()).toBe(null);
    });

    it("should return null when PR is not a number", () => {
      (window as any).__GIT_PR__ = "not-a-number";
      expect(getCurrentPR()).toBe(null);
    });
  });
});
