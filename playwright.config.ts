import { defineConfig, devices } from "@playwright/test";

// Allow configuring the server port via environment variable
const SERVER_PORT = process.env.SERVER_PORT || "4000";
const BASE_URL = `http://localhost:${SERVER_PORT}`;

export default defineConfig({
  testDir: "./tests",
  // Explicitly exclude unit tests that use Vitest
  testIgnore: "**/unit/**",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 10,
  reporter: [["html", { open: "never" }]],
  maxFailures: 1,
  timeout: 30000,
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Balanced optimizations for speed and reliability
    actionTimeout: 5000,
    navigationTimeout: 30000,
    // Standard viewport size
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 0,
      // Removed aggressive flags that might cause instability
      args: ["--disable-dev-shm-usage"],
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use headless mode for faster execution
        headless: true,
      },
    },
  ],
  webServer: {
    command: `just jekyll-serve ${SERVER_PORT}`,
    url: BASE_URL,
    reuseExistingServer: true, // Always reuse existing server
    stdout: "pipe",
    stderr: "pipe",
    timeout: 60000,
  },
});
