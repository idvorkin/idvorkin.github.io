import { expect, test } from "@playwright/test";

test.describe("Header Copy Link Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with headers
    await page.goto("/manager-book");

    // Wait for the page to load and JavaScript to initialize
    await page.waitForLoadState("networkidle");
  });

  test("should add copy link icons to headers", async ({ page }) => {
    // Check that headers have copy link icons
    const headers = page.locator("h1, h2, h3, h4, h5, h6");
    const headerCount = await headers.count();

    if (headerCount > 0) {
      // Check that at least one header has a copy link icon
      const copyLinks = page.locator(".header-copy-link");
      const copyLinkCount = await copyLinks.count();

      expect(copyLinkCount).toBeGreaterThan(0);
      expect(copyLinkCount).toBeLessThanOrEqual(headerCount);
    }
  });

  test("should not have duplicate copy link icons on headers", async ({ page }) => {
    // Get all headers
    const headers = page.locator("h1, h2, h3, h4, h5, h6");
    const headerCount = await headers.count();

    if (headerCount > 0) {
      // For each header, check that it has at most one copy link icon
      for (let i = 0; i < headerCount; i++) {
        const header = headers.nth(i);
        const copyLinksInHeader = header.locator(".header-copy-link");
        const copyLinkCountInHeader = await copyLinksInHeader.count();

        expect(copyLinkCountInHeader).toBeLessThanOrEqual(1);
      }
    }
  });

  test("should copy correct URL when copy link is clicked", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Find a header with a copy link
    const headerWithCopyLink = page
      .locator("h1, h2, h3, h4, h5, h6")
      .filter({ has: page.locator(".header-copy-link") })
      .first();

    if ((await headerWithCopyLink.count()) > 0) {
      // Get the header ID
      const headerId = await headerWithCopyLink.getAttribute("id");

      // Hover over the header to make the copy link visible
      await headerWithCopyLink.hover();

      // Click the copy link
      const copyLink = headerWithCopyLink.locator(".header-copy-link");
      await copyLink.click();

      // Check clipboard content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

      // Verify the URL format
      expect(clipboardText).toContain("idvorkin.azurewebsites.net");
      expect(clipboardText).toContain("/manager-book/");
      if (headerId) {
        expect(clipboardText).toContain(headerId);
      }
    }
  });

  test("should show tooltip when copy link is clicked", async ({ page }) => {
    // Find a header with a copy link
    const headerWithCopyLink = page
      .locator("h1, h2, h3, h4, h5, h6")
      .filter({ has: page.locator(".header-copy-link") })
      .first();

    if ((await headerWithCopyLink.count()) > 0) {
      // Hover over the header to make the copy link visible
      await headerWithCopyLink.hover();

      // Click the copy link
      const copyLink = headerWithCopyLink.locator(".header-copy-link");
      await copyLink.click();

      // Check for tooltip
      const tooltip = page.locator("text=Copied!");
      await expect(tooltip).toBeVisible();

      // Wait for tooltip to disappear
      await expect(tooltip).toBeHidden({ timeout: 3000 });
    }
  });

  test("should handle multiple script loads without duplicating icons", async ({ page }) => {
    // This test simulates the scenario where the header copy link script
    // might be loaded multiple times (e.g., through dynamic content loading)

    // Get initial count of copy link icons
    const initialCopyLinks = page.locator(".header-copy-link");
    const initialCount = await initialCopyLinks.count();

    // Simulate re-running the initialization script
    await page.evaluate(() => {
      // Re-import and re-initialize the header copy links
      if ((window as any).enableHeaderCopyLinks) {
        (window as any).enableHeaderCopyLinks();
      }
    });

    // Wait a bit for any potential duplicate processing
    await page.waitForTimeout(500);

    // Check that the count hasn't increased
    const finalCopyLinks = page.locator(".header-copy-link");
    const finalCount = await finalCopyLinks.count();

    expect(finalCount).toBe(initialCount);
  });

  test("should maintain copy link visibility on hover", async ({ page }) => {
    // Find a header with a copy link
    const headerWithCopyLink = page
      .locator("h1, h2, h3, h4, h5, h6")
      .filter({ has: page.locator(".header-copy-link") })
      .first();

    if ((await headerWithCopyLink.count()) > 0) {
      const copyLink = headerWithCopyLink.locator(".header-copy-link");

      // Initially, copy link should be hidden (opacity 0)
      await expect(copyLink).toHaveCSS("opacity", "0");

      // Hover over header
      await headerWithCopyLink.hover();

      // Copy link should become visible (opacity 1)
      await expect(copyLink).toHaveCSS("opacity", "1");

      // Move away from header
      await page.locator("body").hover();

      // Copy link should become hidden again
      await expect(copyLink).toHaveCSS("opacity", "0");
    }
  });
});
