import { expect, test } from "./base-test";

test.describe("Amazon Include Test Page", () => {
  test("should take screenshot of full page", async ({ page }) => {
    await page.goto("/test/include-amazon");
    await page.waitForLoadState("networkidle");

    // Wait for images to load
    await page.waitForTimeout(3000);

    // Take full page screenshot
    await page.screenshot({
      path: "test-results/amazon-include-full-page.png",
      fullPage: true,
    });

    console.log("✓ Screenshot saved to test-results/amazon-include-full-page.png");
  });

  test("should take screenshot of keyboard products section", async ({ page }) => {
    await page.goto("/test/include-amazon");
    await page.waitForLoadState("networkidle");

    // Wait for images to load
    await page.waitForTimeout(3000);

    // Find all amazon products containers
    const containers = page.locator(".amazon-products");
    const count = await containers.count();

    console.log(`Found ${count} amazon-products containers`);

    // Screenshot the second container (keyboards)
    if (count >= 2) {
      await containers.nth(1).screenshot({
        path: "test-results/keyboards-amazon-include.png",
      });
      console.log("✓ Keyboards screenshot saved");
    }
  });

  test("should verify keyboard products render correctly", async ({ page }) => {
    await page.goto("/test/include-amazon");
    await page.waitForLoadState("networkidle");

    // Find all keyboard ASINs
    const expectedASINs = ["B07ZWK2TQT", "B01JA6HG88", "B0FGN9GC2G"];

    for (const asin of expectedASINs) {
      const product = page.locator(`.amazon-link[data-asin="${asin}"]`);
      await expect(product).toBeVisible();

      // Check link has affiliate tag
      const href = await product.getAttribute("href");
      expect(href).toContain("tag=ighe-20");
      expect(href).toContain(asin);

      console.log(`✓ ${asin}: rendered correctly`);
    }
  });

  test("should verify all products have proper structure", async ({ page }) => {
    await page.goto("/test/include-amazon");
    await page.waitForLoadState("networkidle");

    // Find all Amazon products on the page
    const allProducts = page.locator(".amazon-product");
    const totalCount = await allProducts.count();

    expect(totalCount).toBeGreaterThanOrEqual(5); // At least 5 products

    console.log(`Found ${totalCount} products on test page`);

    // Verify each product
    for (let i = 0; i < totalCount; i++) {
      const product = allProducts.nth(i);
      const link = product.locator("a").first();

      // Has ASIN
      const asin = await link.getAttribute("data-asin");
      expect(asin).toBeTruthy();
      expect(asin).toMatch(/^[A-Z0-9]{10}$/);

      // Has affiliate tag
      const href = await link.getAttribute("href");
      expect(href).toContain("tag=ighe-20");

      // Opens in new tab securely
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener");

      console.log(`  ✓ Product ${i + 1} (${asin}): valid structure`);
    }
  });
});
