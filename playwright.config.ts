import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 10,
  reporter: "html",
  maxFailures: 1,
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
    // Balanced optimizations for speed and reliability
    actionTimeout: 30000,
    navigationTimeout: 45000,
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
    command: "just jekyll-serve",
    url: "http://localhost:4000",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
