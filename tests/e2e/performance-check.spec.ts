import { expect, test } from "./base-test";

test.describe("Performance Analysis", () => {
  test("measure and log all load times", async ({ page }) => {
    // Capture console logs
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("[") || text.includes("ms")) {
        consoleLogs.push(text);
      }
    });

    // Navigate to page
    await page.goto("/");

    // Wait for all content to load
    await page.waitForTimeout(3000);

    // Print all timing logs
    console.log("\n========== PERFORMANCE TIMING LOGS ==========");
    consoleLogs.forEach((log) => console.log(log));
    console.log("==============================================\n");

    // Analyze the logs
    const timings = consoleLogs
      .filter((log) => log.includes("ms"))
      .map((log) => {
        const match = log.match(/(\d+)ms/);
        return match ? Number.parseInt(match[1]) : 0;
      })
      .filter((time) => time > 0);

    if (timings.length > 0) {
      const max = Math.max(...timings);
      const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
      console.log("📊 Performance Summary:");
      console.log(`   Max time: ${max}ms`);
      console.log(`   Avg time: ${avg.toFixed(0)}ms`);
      console.log(`   Number of timed operations: ${timings.length}`);
    }

    // Check that something loaded
    const hasContent = await page.locator("#featured-results .result-item").count();
    expect(hasContent).toBeGreaterThan(0);
  });

  test("measure cold cache performance", async ({ page, context }) => {
    // Clear cache
    await context.clearCookies();

    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("[") || text.includes("ms")) {
        consoleLogs.push(text);
      }
    });

    const startTime = Date.now();
    await page.goto("/");

    // Wait for featured content
    await page.waitForSelector("#featured-results .result-item a", { timeout: 10000 });
    const initialLoadTime = Date.now() - startTime;

    console.log(`\n🥶 COLD CACHE: Initial content visible in ${initialLoadTime}ms`);

    // Wait for everything to finish
    await page.waitForTimeout(2000);

    // Show logs
    console.log("\n========== COLD CACHE TIMING LOGS ==========");
    consoleLogs.forEach((log) => console.log(log));
    console.log("=============================================\n");
  });
});
