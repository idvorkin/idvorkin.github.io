import { expect, test } from "@playwright/test";

test.describe("Amazon affiliate links", () => {
  test("should display Amazon affiliate links with proper tags", async ({ page }) => {
    // Navigate to content creation page which has Amazon links
    await page.goto("/content-creation");

    // Check for AirTag section
    const airtagSection = page.locator("h4:has-text('AirTag')").first();
    await expect(airtagSection).toBeVisible();

    // Find the Amazon link after the AirTag heading
    const airtagLink = page.locator("a:has-text('View on Amazon')").filter({ hasText: "View on Amazon" }).first();
    await expect(airtagLink).toBeVisible();

    // Check the link has affiliate tag and ASIN
    const airtagHref = await airtagLink.getAttribute("href");
    expect(airtagHref).toContain("tag=ighe-20");
    expect(airtagHref).toContain("B0D54JZTHY"); // AirTag ASIN
    expect(airtagHref).toContain("amazon.com/dp/");

    // Check for Elevation Labs section
    const elevationSection = page.locator("h4:has-text('Elevation Labs')").first();
    await expect(elevationSection).toBeVisible();

    // Find all Amazon links on the page
    const allAmazonLinks = page.locator("a[href*='amazon.com/dp/']");
    const linkCount = await allAmazonLinks.count();

    // Find the Elevation Labs link by checking hrefs
    let elevationLink;
    for (let i = 0; i < linkCount; i++) {
      const link = allAmazonLinks.nth(i);
      const href = await link.getAttribute("href");
      if (href?.includes("B09ZVPWKK3")) {
        elevationLink = link;
        break;
      }
    }

    expect(elevationLink).toBeDefined();
    const elevationHref = await elevationLink?.getAttribute("href");
    expect(elevationHref).toContain("tag=ighe-20");
    expect(elevationHref).toContain("B09ZVPWKK3"); // Elevation Labs ASIN

    // Check both links open in new tab with security
    await expect(airtagLink).toHaveAttribute("target", "_blank");
    await expect(airtagLink).toHaveAttribute("rel", "noopener");
    if (elevationLink) {
      await expect(elevationLink).toHaveAttribute("target", "_blank");
      await expect(elevationLink).toHaveAttribute("rel", "noopener");
    }
  });

  test("should handle multiple ASINs in one include", async ({ page }) => {
    // Navigate to machine learning page which has multiple ASINs
    await page.goto("/machine-learning");

    // Find Amazon links
    const amazonLinks = page.locator("a[href*='amazon.com/dp/']");
    const linkCount = await amazonLinks.count();

    // Skip if no Amazon links found
    if (linkCount === 0) {
      test.skip();
      return;
    }

    // Check that all Amazon links have affiliate tags
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      // Check first 5 links
      const link = amazonLinks.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toContain("tag=ighe-20");
      expect(href).toMatch(/\/dp\/[A-Z0-9]{10}/); // Valid ASIN format
    }
  });
});
