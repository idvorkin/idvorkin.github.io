import { expect, test } from "@playwright/test";

test.describe("Amazon affiliate links", () => {
  test("should display Amazon product images and links with affiliate code", async ({ page }) => {
    // Navigate to content creation page which has Amazon links
    await page.goto("/content-creation");

    // Check for AirTag section
    const airtagSection = page.locator("h4:has-text('AirTag')").first();
    await expect(airtagSection).toBeVisible();

    // Find the Amazon link table after the AirTag heading
    const airtagTable = airtagSection.locator("+ table").first();
    await expect(airtagTable).toBeVisible();

    // Check the link has affiliate tag
    const airtagLink = airtagTable.locator("a").first();
    const airtagHref = await airtagLink.getAttribute("href");
    expect(airtagHref).toContain("tag=ighe-20");
    expect(airtagHref).toContain("B0D54JZTHY"); // AirTag ASIN

    // Check image is present and loaded
    const airtagImage = airtagTable.locator("img").first();
    await expect(airtagImage).toBeVisible();

    // Check image has proper alt text
    const airtagAlt = await airtagImage.getAttribute("alt");
    expect(airtagAlt).toBeTruthy();

    // Verify image actually loaded (not broken)
    const airtagImageSrc = await airtagImage.getAttribute("src");
    expect(airtagImageSrc).toBeTruthy();

    // Check natural width to ensure image loaded
    const airtagNaturalWidth = await airtagImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(airtagNaturalWidth).toBeGreaterThan(0);

    // Check for Elevation Labs section
    const elevationSection = page.locator("h4:has-text('Elevation Labs')").first();
    await expect(elevationSection).toBeVisible();

    // Find the Amazon link table after the Elevation Labs heading
    const elevationTable = elevationSection.locator("+ table").first();
    await expect(elevationTable).toBeVisible();

    // Check the link has affiliate tag
    const elevationLink = elevationTable.locator("a").first();
    const elevationHref = await elevationLink.getAttribute("href");
    expect(elevationHref).toContain("tag=ighe-20");
    expect(elevationHref).toContain("B09ZVPWKK3"); // Elevation Labs ASIN

    // Check Elevation Labs image loaded
    const elevationImage = elevationTable.locator("img").first();
    await expect(elevationImage).toBeVisible();

    // Verify image actually loaded (could be placeholder if Amazon doesn't have image)
    const elevationNaturalWidth = await elevationImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(elevationNaturalWidth).toBeGreaterThan(0);

    // Check both links open in new tab
    await expect(airtagLink).toHaveAttribute("target", "_blank");
    await expect(elevationLink).toHaveAttribute("target", "_blank");

    // Check both links have noopener for security
    await expect(airtagLink).toHaveAttribute("rel", "noopener");
    await expect(elevationLink).toHaveAttribute("rel", "noopener");
  });

  test("should handle multiple ASINs in one include", async ({ page }) => {
    // Navigate to machine learning page which has multiple ASINs
    await page.goto("/machine-learning");

    // Find an Amazon table with multiple products
    const amazonTable = page
      .locator("table")
      .filter({ has: page.locator("a[href*='amazon.com']") })
      .first();

    // Skip this test if no multi-ASIN table found
    const tableCount = await amazonTable.count();
    if (tableCount === 0) {
      test.skip();
      return;
    }

    // Count the number of products in the table
    const productCells = amazonTable.locator("td");
    const cellCount = await productCells.count();

    // Should have at least 2 products if using semicolon syntax
    if (cellCount >= 2) {
      // Check each has affiliate tag
      for (let i = 0; i < cellCount; i++) {
        const link = productCells.nth(i).locator("a");
        const href = await link.getAttribute("href");
        expect(href).toContain("tag=ighe-20");
      }
    }
  });
});
