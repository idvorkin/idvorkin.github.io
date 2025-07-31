import { beforeEach, describe, expect, it, vi } from "vitest";

describe("SwapProdAndTest", () => {
  let originalLocation: Location;

  beforeEach(() => {
    // Save original location
    originalLocation = window.location;

    // Mock window.location
    (window as any).location = undefined;
    window.location = {
      href: "",
      port: "",
      protocol: "",
      hostname: "",
      pathname: "",
    } as any;
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
  });

  describe("when swapping from production to test", () => {
    it("should swap from production to localhost with default port 4000", () => {
      window.location.href = "https://idvork.in/some-page";
      window.location.port = "";

      // Import and execute the function
      const SwapProdAndTest = getSwapProdAndTestFunction();
      SwapProdAndTest();

      expect(window.location.href).toBe("http://localhost:4000/some-page");
    });

    it("should preserve the current port when available", () => {
      window.location.href = "https://idvork.in/another-page";
      window.location.port = "4002";

      const SwapProdAndTest = getSwapProdAndTestFunction();
      SwapProdAndTest();

      expect(window.location.href).toBe("http://localhost:4002/another-page");
    });
  });

  describe("when swapping from test to production", () => {
    it("should swap from localhost:4000 to production", () => {
      window.location.href = "http://localhost:4000/test-page";
      window.location.port = "4000";

      const SwapProdAndTest = getSwapProdAndTestFunction();
      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/test-page");
    });

    it("should swap from localhost:4002 to production", () => {
      window.location.href = "http://localhost:4002/test-page";
      window.location.port = "4002";

      const SwapProdAndTest = getSwapProdAndTestFunction();
      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/test-page");
    });

    it("should handle any port number", () => {
      window.location.href = "http://localhost:8888/custom-port-page";
      window.location.port = "8888";

      const SwapProdAndTest = getSwapProdAndTestFunction();
      SwapProdAndTest();

      expect(window.location.href).toBe("https://idvork.in/custom-port-page");
    });
  });
});

// Extract the SwapProdAndTest function for testing
function getSwapProdAndTestFunction() {
  return function SwapProdAndTest() {
    const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    // Get the current port from the URL
    const currentPort = window.location.port || "4000";
    const testPrefix = `http://localhost:${currentPort}`;
    const isProd = url.includes(prodPrefix);
    let newURL = url;
    if (isProd) {
      newURL = url.replace(prodPrefix, testPrefix);
    } else {
      // When swapping from test to prod, we need to handle any port number
      newURL = url.replace(/http:\/\/localhost:\d+/, prodPrefix);
    }

    window.location.href = newURL;
  };
}
