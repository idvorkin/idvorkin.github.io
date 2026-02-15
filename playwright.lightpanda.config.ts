import { defineConfig } from "@playwright/test";

// Lightpanda config: runs DOM/content tests against a Lightpanda CDP server.
// Start Lightpanda first: lightpanda serve --port 9222
//
// These tests use a custom fixture (lightpanda-fixture.ts) that connects
// via connectOverCDP instead of launching Chromium.
//
// Only DOM/content tests work — no screenshots, viewport, or visual assertions.

const SERVER_PORT = process.env.SERVER_PORT || "4000";
const BASE_URL = `http://localhost:${SERVER_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "lightpanda-*.spec.ts",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 15000,
  use: {
    baseURL: BASE_URL,
    actionTimeout: 5000,
    navigationTimeout: 15000,
  },
  // No browser launch — tests connect to Lightpanda via CDP fixture
  // No webServer — assumes Jekyll is already running
});
