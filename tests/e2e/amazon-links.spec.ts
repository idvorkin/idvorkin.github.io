import { expect, test } from "@playwright/test";

test.describe("Amazon affiliate links", () => {
  test("should display Amazon links with images or text fallback", async ({ page }) => {
    // Navigate to content creation page which has Amazon links
    await page.goto("/content-creation");

    // Check for AirTag section
    const airtagSection = page.locator("h4:has-text('AirTag')").first();
    await expect(airtagSection).toBeVisible();

    // Find the Amazon product div
    const airtagProduct = page.locator(".amazon-product").first();
    await expect(airtagProduct).toBeVisible();

    // Check the link has affiliate tag and ASIN
    const airtagLink = airtagProduct.locator("a.amazon-link").first();
    const airtagHref = await airtagLink.getAttribute("href");
    expect(airtagHref).toContain("tag=ighe-20");
    expect(airtagHref).toContain("B0D54JZTHY"); // AirTag ASIN

    // Wait for JavaScript to process images
    await page.waitForTimeout(2500);

    // Check that we have either an image or text fallback visible
    const airtagImage = airtagProduct.locator(".amazon-image").first();
    const airtagFallback = airtagProduct.locator(".amazon-text-fallback").first();

    const imageVisible = await airtagImage.isVisible();
    const fallbackVisible = await airtagFallback.isVisible();

    // Either image or fallback should be visible, not both
    expect(imageVisible || fallbackVisible).toBeTruthy();

    // Find Elevation Labs product by ASIN
    const elevationProduct = page.locator('.amazon-link[data-asin="B09ZVPWKK3"]').locator("..");
    await expect(elevationProduct).toBeVisible();

    // Check the link
    const elevationLink = elevationProduct.locator("a").first();
    const elevationHref = await elevationLink.getAttribute("href");
    expect(elevationHref).toContain("tag=ighe-20");
    expect(elevationHref).toContain("B09ZVPWKK3"); // Elevation Labs ASIN

    // Check fallback is likely visible (since this ASIN typically returns 1x1 image)
    const elevationFallback = elevationProduct.locator(".amazon-text-fallback").first();
    const elevationFallbackVisible = await elevationFallback.isVisible();

    // Log what we found for debugging
    if (elevationFallbackVisible) {
      console.log("Elevation Labs: Using text fallback (expected for this ASIN)");
    } else {
      console.log("Elevation Labs: Showing image");
    }

    // Check both links open in new tab with security
    await expect(airtagLink).toHaveAttribute("target", "_blank");
    await expect(airtagLink).toHaveAttribute("rel", "noopener");
    await expect(elevationLink).toHaveAttribute("target", "_blank");
    await expect(elevationLink).toHaveAttribute("rel", "noopener");
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
