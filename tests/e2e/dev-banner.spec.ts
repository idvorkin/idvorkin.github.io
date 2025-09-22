import { expect, test } from "@playwright/test";

test.describe("Dev Info Banner", () => {
  test.skip("should display branch and port info on dev server", async ({ page }) => {
    // Test on default port 4000 with feature branch
    await page.goto("http://localhost:4000");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Take a screenshot to debug
    await page.screenshot({ path: "dev-banner-debug.png", fullPage: true });

    // Check if branch info is in the page
    const branchInfo = await page.evaluate(() => (window as any).__GIT_BRANCH__);
    const prInfo = await page.evaluate(() => (window as any).__GIT_PR__);
    console.log("Branch info from page:", branchInfo);
    console.log("PR info from page:", prInfo);

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

    // Test PR link if present
    if (prInfo) {
      const prLink = await page.locator("#dev-info-banner a[href*='/pull/']");
      await expect(prLink).toBeVisible();
      
      const href = await prLink.getAttribute("href");
      expect(href).toContain(`/pull/${prInfo}`);
      console.log("PR link href:", href);
    }

    // Take a screenshot
    await page.screenshot({ path: "dev-banner-test.png" });
  });

  test.skip("should display clickable PR link when on feature branch with PR", async ({ page }) => {
    // This test assumes we're on a branch with an open PR
    await page.goto("http://localhost:4000");
    await page.waitForLoadState("networkidle");

    const prInfo = await page.evaluate(() => (window as any).__GIT_PR__);
    
    if (prInfo) {
      const banner = await page.locator("#dev-info-banner");
      await expect(banner).toBeVisible();

      // Check that PR link exists and is properly formatted
      const prLink = await page.locator("#dev-info-banner a[href*='/pull/']");
      await expect(prLink).toBeVisible();

      // Verify link text shows PR number
      const linkText = await prLink.textContent();
      expect(linkText).toContain(`#${prInfo}`);

      // Verify link points to correct GitHub PR
      const href = await prLink.getAttribute("href");
      expect(href).toBe(`https://github.com/idvorkin/idvorkin.github.io/pull/${prInfo}`);

      // Verify link styling (blue color for GitHub style)
      const linkStyles = await prLink.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          textDecoration: computed.textDecoration,
        };
      });

      console.log("PR link styles:", linkStyles);
    }
  });
});
