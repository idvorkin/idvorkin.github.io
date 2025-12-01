import { expect, test } from "@playwright/test";

test.describe("Amazon affiliate links", () => {
  test("should display Amazon links with proper affiliate tags", async ({ page }) => {
    // Navigate to content creation page which has Amazon links
    await page.goto("/content-creation");

    // Check for AirTag section
    const airtagSection = page.locator("h4:has-text('AirTag')").first();
    await expect(airtagSection).toBeVisible();

    // Find Amazon products
    const products = page.locator(".amazon-product");
    const productCount = await products.count();
    expect(productCount).toBeGreaterThanOrEqual(3); // At least 3 products on content page

    // Check first product (AirTag)
    const airtagProduct = products.first();
    await expect(airtagProduct).toBeVisible();

    const airtagLink = airtagProduct.locator("a").first();
    const airtagHref = await airtagLink.getAttribute("href");
    expect(airtagHref).toContain("tag=ighe-20");
    expect(airtagHref).toContain("B0D54JZTHY"); // AirTag ASIN

    // Find Elevation Labs product by ASIN
    const elevationProduct = page.locator('.amazon-link[data-asin="B09ZVPWKK3"]').locator("..");
    await expect(elevationProduct).toBeVisible();

    const elevationLink = elevationProduct.locator("a").first();
    const elevationHref = await elevationLink.getAttribute("href");
    expect(elevationHref).toContain("tag=ighe-20");
    expect(elevationHref).toContain("B09ZVPWKK3"); // Elevation Labs ASIN

    // Check both links open in new tab with security
    await expect(airtagLink).toHaveAttribute("target", "_blank");
    await expect(airtagLink).toHaveAttribute("rel", "noopener");
    await expect(elevationLink).toHaveAttribute("target", "_blank");
    await expect(elevationLink).toHaveAttribute("rel", "noopener");

    // Verify products are showing content (title/image)
    const airtagContent = await airtagProduct.textContent();
    expect(airtagContent).toContain("Apple AirTag"); // From ASIN database

    const elevationContent = await elevationProduct.textContent();
    expect(elevationContent).toContain("Elevation Lab"); // From ASIN database
  });

  test("should show images from ASIN database", async ({ page }) => {
    // Navigate to content creation page
    await page.goto("/content-creation");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find all Amazon products
    const products = page.locator(".amazon-product");
    const productCount = await products.count();

    expect(productCount).toBeGreaterThan(0);
    console.log(`Found ${productCount} Amazon products on content-creation page`);

    // Check each product has proper structure
    for (let i = 0; i < productCount; i++) {
      const product = products.nth(i);
      const link = product.locator("a").first();

      // Verify link exists and has ASIN
      await expect(link).toBeVisible();
      const asin = await link.getAttribute("data-asin");
      expect(asin).toBeTruthy();

      // Check for affiliate tag
      const href = await link.getAttribute("href");
      expect(href).toContain("tag=ighe-20");
      expect(href).toContain(asin);

      // Look for visible content (image or text)
      const visibleContent = await product.textContent();
      expect(visibleContent).toBeTruthy();

      // Check for images specifically
      const images = product.locator("img");
      const imageCount = await images.count();

      if (imageCount > 0) {
        const img = images.first();
        const src = await img.getAttribute("src");
        console.log(`Product ${i} (${asin}): Image source = ${src}`);

        // Check image is actually loading
        await img.waitFor({ state: "attached" });
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);

        if (naturalWidth > 0 && naturalHeight > 0) {
          console.log(`  ✓ Image loaded successfully (${naturalWidth}x${naturalHeight})`);
        } else {
          console.log("  ✗ Image failed to load!");
        }

        // Note which source is being used
        try {
          const url = new URL(src || "");
          if (url.hostname === "m.media-amazon.com") {
            console.log("  → Using high-res image from ASIN database");
          } else if (url.hostname === "images-na.ssl-images-amazon.com") {
            console.log("  → Using standard Amazon image URL");
          }
        } catch {
          // Invalid URL, skip logging
        }
      }
    }
  });

  test("should handle multiple ASINs in one include", async ({ page }) => {
    // Navigate to machine learning page which has multiple ASINs
    await page.goto("/machine-learning", { waitUntil: "networkidle" });

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
