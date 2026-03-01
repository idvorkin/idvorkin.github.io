import { expect, test } from "./base-test";

test.describe("IRL Page Keyboards Section", () => {
  test("should take screenshot of keyboard products", async ({ page }) => {
    await page.goto("/irl#keyboards");
    await page.waitForLoadState("networkidle");

    // Wait for images to load
    await page.waitForTimeout(3000);

    // Find the amazon-products container with the keyboards
    // Look for container with B07ZWK2TQT
    const keyboardContainer = page.locator('.amazon-products:has([data-asin="B07ZWK2TQT"])');
    await keyboardContainer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Screenshot just the keyboard products
    await keyboardContainer.screenshot({
      path: "test-results/irl-keyboards-products.png",
    });

    console.log("✓ IRL keyboard products screenshot saved");
  });

  test("should verify all 3 keyboard images load", async ({ page }) => {
    await page.goto("/irl#keyboards");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    const keyboardASINs = ["B07ZWK2TQT", "B01JA6HG88", "B0FGN9GC2G"];

    for (const asin of keyboardASINs) {
      const link = page.locator(`.amazon-link[data-asin="${asin}"]`);
      await expect(link).toBeVisible();

      // Find the image within this product
      const img = link.locator("img").first();
      await expect(img).toBeVisible();

      const src = await img.getAttribute("src");
      expect(src).toBeTruthy();

      // Check if it's the high-res image URL
      if (src?.includes("m.media-amazon.com")) {
        console.log(`✓ ${asin}: High-res image (${src.substring(0, 60)}...)`);
      } else {
        console.log(`⚠ ${asin}: Fallback image (${src?.substring(0, 60)}...)`);
      }

      // Verify image actually loaded
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(1);
      console.log(`  Image dimensions: ${naturalWidth}px wide`);
    }
  });
});
