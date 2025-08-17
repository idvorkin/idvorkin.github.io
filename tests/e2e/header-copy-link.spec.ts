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

      // Verify the tinyurl format with preview text
      expect(clipboardText).toContain("tinyurl.com/igor-blog/?path=");
      expect(clipboardText).toContain("manager-book");
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
      const tooltip = page.locator(".copy-link-tooltip");
      await expect(tooltip).toBeVisible();

      // Wait for tooltip to disappear
      await expect(tooltip).toBeHidden({ timeout: 3000 });
    }
  });

  test("should add GitHub issue icons to headers", async ({ page }) => {
    // Check that headers have GitHub issue icons
    const headers = page.locator("h1, h2, h3, h4, h5, h6");
    const headerCount = await headers.count();

    if (headerCount > 0) {
      // Check that at least one header has a GitHub issue icon
      const githubIcons = page.locator(".header-github-issue");
      const githubIconCount = await githubIcons.count();

      expect(githubIconCount).toBeGreaterThan(0);
      expect(githubIconCount).toBeLessThanOrEqual(headerCount);
    }
  });

  test("should show both copy link and GitHub issue icons on hover", async ({ page }) => {
    // Find a header
    const header = page.locator("h1, h2, h3, h4, h5, h6").first();

    if ((await header.count()) > 0) {
      // Initially, icons should be hidden
      const copyLink = header.locator(".header-copy-link");
      const githubIcon = header.locator(".header-github-issue");

      // Hover over the header
      await header.hover();

      // Both icons should be visible
      await expect(copyLink).toBeVisible();
      await expect(githubIcon).toBeVisible();

      // Move away from header
      await page.locator("body").hover({ position: { x: 0, y: 0 } });
      
      // Wait a moment for the hover effect to clear
      await page.waitForTimeout(300);

      // Icons should have opacity 0 (hidden via CSS)
      await expect(copyLink).toHaveCSS("opacity", "0");
      await expect(githubIcon).toHaveCSS("opacity", "0");
    }
  });

  test("should show popup when GitHub icon is clicked and create issue on submit", async ({ page, context }) => {
    // Find a header with a GitHub issue icon
    const headerWithGitHubIcon = page
      .locator("h1, h2, h3, h4, h5, h6")
      .filter({ has: page.locator(".header-github-issue") })
      .first();

    if ((await headerWithGitHubIcon.count()) > 0) {
      // Get the header text and ID
      const headerText = await headerWithGitHubIcon.textContent();
      const headerId = await headerWithGitHubIcon.getAttribute("id");

      // Hover over the header to make the GitHub icon visible
      await headerWithGitHubIcon.hover();

      // Click the GitHub issue icon
      const githubIcon = headerWithGitHubIcon.locator(".header-github-issue");
      await githubIcon.click();

      // Wait for the popup to appear
      const popup = page.locator(".github-issue-popup");
      await expect(popup).toBeVisible();

      // Check that the popup has the correct elements
      const titleInput = popup.locator(".github-issue-title");
      const commentTextarea = popup.locator(".github-issue-comment");
      const submitButton = popup.locator(".github-issue-submit");
      
      await expect(titleInput).toBeVisible();
      await expect(commentTextarea).toBeVisible();
      await expect(submitButton).toBeVisible();

      // Fill in custom title and description
      await titleInput.clear();
      await titleInput.fill("Outdated example code");
      await commentTextarea.fill("This section contains outdated information that needs updating.");

      // Listen for new page/tab
      const newPagePromise = context.waitForEvent("page");

      // Click submit button
      await submitButton.click();

      // Wait for the new page to open
      const newPage = await newPagePromise;
      await newPage.waitForLoadState();

      // Verify the URL - it may redirect to login first if not authenticated
      const url = newPage.url();
      // Check if we got redirected to login (expected when not authenticated)
      if (url.includes("github.com/login")) {
        // Verify the return URL contains the issue creation URL
        expect(url).toContain("return_to");
        expect(url).toContain("idvorkin%2Fidvorkin.github.io%2Fissues%2Fnew");
        expect(url).toContain("title%3D");
        expect(url).toContain("body%3D");
      } else {
        // Direct navigation to issue creation (when authenticated)
        expect(url).toContain("github.com/idvorkin/idvorkin.github.io/issues/new");
        expect(url).toContain("title=");
        expect(url).toContain("body=");
      }

      // Since unit tests cover the detailed URL formatting,
      // E2E test just needs to verify the basic flow works

      // Close the new page
      await newPage.close();
      
      // Verify popup is closed
      await expect(popup).not.toBeVisible();
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

      // Move away from header - hover on the footer or a different element far from headers
      const footer = page.locator("footer").first();
      if ((await footer.count()) > 0) {
        await footer.hover();
      } else {
        // If no footer, move to coordinates far from the header
        await page.mouse.move(0, 0);
      }

      // Wait for transition to complete
      await page.waitForTimeout(300);

      // Copy link should become hidden again
      await expect(copyLink).toHaveCSS("opacity", "0");
    }
  });
});
