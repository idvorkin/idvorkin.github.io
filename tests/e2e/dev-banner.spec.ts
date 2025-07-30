import { expect, test } from "@playwright/test";

test.describe("Dev Info Banner", () => {
  test("should display branch and port info on dev server", async ({ page }) => {
    // Test on default port 4000 with feature branch
    await page.goto("http://localhost:4000");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Take a screenshot to debug
    await page.screenshot({ path: "dev-banner-debug.png", fullPage: true });

    // Check if branch info is in the page
    const branchInfo = await page.evaluate(() => (window as any).__GIT_BRANCH__);
    console.log("Branch info from page:", branchInfo);

    // Wait for the dev-info banner
    const banner = await page.locator("#dev-info-banner");
    await expect(banner).toBeVisible();

    // Check the banner background color
    const bannerStyles = await banner.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    console.log("Banner background color:", bannerStyles.backgroundColor);
    console.log("Banner text color:", bannerStyles.color);

    // Check the code elements styling
    const codeElements = await page.locator("#dev-info-banner code").all();
    console.log(`Found ${codeElements.length} code elements`);

    for (let i = 0; i < codeElements.length; i++) {
      const codeElement = codeElements[i];
      const text = await codeElement.textContent();
      const styles = await codeElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
        };
      });

      console.log(`Code element ${i + 1}: "${text}"`);
      console.log(`  Background: ${styles.backgroundColor}`);
      console.log(`  Color: ${styles.color}`);
    }

    // Take a screenshot
    await page.screenshot({ path: "dev-banner-test.png" });
  });
});
