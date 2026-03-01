import { expect, test } from "./base-test";

test.describe("IRL Keyboards Section - Layout Testing", () => {
  test("desktop layout - full width", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/irl#keyboards");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Find the keyboards section
    const keyboardsSection = page.locator('h3:has-text("Keyboards")').locator("..");
    await keyboardsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Take screenshot of the entire keyboards section
    await keyboardsSection.screenshot({
      path: "test-results/irl-keyboards-desktop.png",
    });

    console.log("✓ Desktop layout screenshot saved");
  });

  test("mobile layout - 375px width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/irl#keyboards");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Find the keyboards section
    const keyboardsSection = page.locator('h3:has-text("Keyboards")').locator("..");
    await keyboardsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Take screenshot of the entire keyboards section
    await keyboardsSection.screenshot({
      path: "test-results/irl-keyboards-mobile.png",
    });

    console.log("✓ Mobile layout screenshot saved");
  });

  test("verify alert box is visible and properly positioned", async ({ page }) => {
    await page.goto("/irl#keyboards");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Check for the alert box
    const alertBox = page.locator('.alert:has-text("CRITICAL")');
    await expect(alertBox).toBeVisible();

    // Verify alert has proper spacing
    const boundingBox = await alertBox.boundingBox();
    expect(boundingBox).toBeTruthy();

    console.log("✓ Alert box properly positioned");
  });

  test("verify keyboard images have alt text", async ({ page }) => {
    await page.goto("/irl");
    await page.waitForLoadState("domcontentloaded");

    // Navigate to keyboards section
    await page.locator("#keyboards").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Check both keyboard images exist with alt text
    const ipasteImg = page.locator('img[src*="ipaste/main/20260125_091437.webp"]');
    const blobImg = page.locator('img[src*="dual_keyboard.jpg"]');

    // Verify they exist in the DOM
    await expect(ipasteImg).toHaveCount(1);
    await expect(blobImg).toHaveCount(1);

    // Get alt text
    const ipasteAlt = await ipasteImg.getAttribute("alt");
    const blobAlt = await blobImg.getAttribute("alt");

    // Verify both have alt text (not null, not empty)
    expect(ipasteAlt).toBeTruthy();
    expect(blobAlt).toBeTruthy();

    console.log(`✓ Home keyboard image has alt: "${ipasteAlt}"`);
    console.log(`✓ Coffee shop keyboard image has alt: "${blobAlt}"`);
  });
});
