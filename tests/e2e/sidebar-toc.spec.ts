import { expect, test } from "./base-test";

test.describe("Sidebar TOC rendering", () => {
  test("sidebar TOC entries should have normal spacing without icon text", async ({ page }) => {
    await page.goto("http://localhost:4000/eulogy");

    // Wait for sidebar to be visible
    await page.waitForSelector("#right-sidebar", { timeout: 5000 });

    // Wait for TOC to be generated
    await page.waitForSelector("#ui-toc-affix li", { timeout: 5000 });

    // Get all sidebar TOC entries
    const tocEntries = await page.locator("#ui-toc-affix li").all();

    // Verify we have TOC entries
    expect(tocEntries.length).toBeGreaterThan(0);

    // Check that TOC entries have reasonable height (not inflated by icon content)
    for (let i = 0; i < Math.min(3, tocEntries.length); i++) {
      const entry = tocEntries[i];
      const box = await entry.boundingBox();

      // Normal TOC entries should be between 20-40px tall
      // The bug caused them to be 144px+ tall
      expect(box?.height).toBeLessThan(50);
      expect(box?.height).toBeGreaterThan(15);
    }

    // Check that TOC link text doesn't contain SVG path data or extra whitespace
    const firstLink = await page.locator("#ui-toc-affix li a").first();
    const linkText = await firstLink.textContent();
    const linkTitle = await firstLink.getAttribute("title");

    // Text should be clean without SVG artifacts
    expect(linkText).not.toContain("M8 2"); // SVG path data
    expect(linkText).not.toMatch(/\n\s+\n/); // Multiple newlines with spaces

    // Title attribute should also be clean
    expect(linkTitle).not.toContain("M8 2");
    expect(linkTitle).not.toMatch(/\n\s+\n/);

    // Verify the text is trimmed properly
    expect(linkText?.trim()).toBe(linkText);
    expect(linkTitle?.trim()).toBe(linkTitle);
  });

  test("TOC should exclude header icons but include other inline elements", async ({ page }) => {
    // Create a test page with various header types
    await page.goto("http://localhost:4000/7h");

    // Wait for TOC
    await page.waitForSelector("#ui-toc-affix", { timeout: 5000 });

    // Check that headers with icons still appear in TOC
    const tocLinks = await page.locator("#ui-toc-affix a").all();
    expect(tocLinks.length).toBeGreaterThan(0);

    // Get the headers on the page that have icons
    const headersWithIcons = await page
      .locator("h1 .header-copy-link, h2 .header-copy-link, h3 .header-copy-link")
      .count();

    if (headersWithIcons > 0) {
      // If there are headers with icons, verify TOC entries don't contain icon text
      for (const link of tocLinks.slice(0, 3)) {
        const text = await link.textContent();
        expect(text).not.toContain("Share this section");
        expect(text).not.toContain("Create GitHub issue");
      }
    }
  });

  test("TOC links should navigate to correct sections", async ({ page }) => {
    await page.goto("http://localhost:4000/eulogy");

    // Wait for TOC
    await page.waitForSelector("#ui-toc-affix a", { timeout: 5000 });

    // Get first TOC link
    const firstLink = await page.locator("#ui-toc-affix a").first();
    const href = await firstLink.getAttribute("href");
    const linkText = await firstLink.textContent();

    // Click the link
    await firstLink.click();

    // Verify navigation - the URL should update with the hash
    await expect(page).toHaveURL(new RegExp(`.*${href}$`));

    // Verify the target header exists and matches the TOC text
    if (href) {
      const targetHeader = await page.locator(href);
      await expect(targetHeader).toBeVisible();

      // Get the header text excluding icons
      const headerText = await targetHeader.evaluate((el) => {
        // Extract only text nodes and non-icon element text
        const textParts: string[] = [];
        for (const node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            textParts.push(node.textContent || "");
          } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            !(node as HTMLElement).classList.contains("header-copy-link") &&
            !(node as HTMLElement).classList.contains("header-github-issue")
          ) {
            textParts.push(node.textContent || "");
          }
        }
        return textParts.join("").trim();
      });

      expect(headerText).toBe(linkText?.trim());
    }
  });

  test("TOC should update when navigating between pages", async ({ page }) => {
    // Start on one page
    await page.goto("http://localhost:4000/eulogy");
    await page.waitForSelector("#ui-toc-affix a", { timeout: 5000 });

    const eulogyFirstLink = await page.locator("#ui-toc-affix a").first();
    const eulogyFirstText = await eulogyFirstLink.textContent();

    // Navigate to a different page
    await page.goto("http://localhost:4000/7h");
    await page.waitForSelector("#ui-toc-affix a", { timeout: 5000 });

    const habitsFirstLink = await page.locator("#ui-toc-affix a").first();
    const habitsFirstText = await habitsFirstLink.textContent();

    // TOC content should be different between pages
    expect(eulogyFirstText).not.toBe(habitsFirstText);
  });
});
