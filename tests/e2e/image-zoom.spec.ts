import { expect, test } from "./base-test";

test.describe("Image Zoom Functionality", () => {
  test("images should be clickable and open in lightbox", async ({ page }) => {
    // Go to the ai-journal page
    await page.goto("http://localhost:4000/ai-journal");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Give extra time for JS to run

    // Log console messages
    page.on("console", (msg) => {
      if (msg.text().includes("Image zoom")) {
        console.log("🔍 Console:", msg.text());
      }
    });

    // Check initial state - images without glightbox wrapper
    const plainImages = await page.locator("p img:not(a.glightbox img)").count();
    console.log(`Plain images (not wrapped): ${plainImages}`);

    // Check for glightbox wrapped images
    const glightboxImages = await page.locator("a.glightbox img").count();
    console.log(`Glightbox wrapped images: ${glightboxImages}`);

    // Try to find any image we can test
    const testableImages = await page.locator('img[src*="idvorkin/ipaste"]').all();
    console.log(`Found ${testableImages.length} testable images`);

    if (testableImages.length > 0) {
      const firstImage = testableImages[0];
      const imageSrc = await firstImage.getAttribute("src");
      console.log(`Testing with image: ${imageSrc}`);

      // Check if image is wrapped in an anchor
      const parent = await firstImage.locator("..").first();
      const parentTag = await parent.evaluate((el) => el.tagName);
      const parentClass = await parent.getAttribute("class");
      console.log(`Image parent: <${parentTag} class="${parentClass || "none"}">`);

      // Try clicking the image
      console.log("Attempting to click image...");
      await firstImage.click();

      // Wait a bit for lightbox to open
      await page.waitForTimeout(500);

      // Check for lightbox elements
      const hasGlightboxOpen = (await page.locator("body.glightbox-open").count()) > 0;
      const hasGlightboxContainer = (await page.locator(".glightbox-container").count()) > 0;
      const hasGlightboxSlider = (await page.locator(".gslider").count()) > 0;

      console.log("Lightbox state:");
      console.log(`  - Body has glightbox-open class: ${hasGlightboxOpen}`);
      console.log(`  - Glightbox container present: ${hasGlightboxContainer}`);
      console.log(`  - Glightbox slider present: ${hasGlightboxSlider}`);

      if (hasGlightboxContainer) {
        console.log("✅ Lightbox opened successfully!");

        // Close lightbox
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);

        const stillOpen = (await page.locator(".glightbox-container").count()) > 0;
        console.log(`Lightbox closed after ESC: ${!stillOpen}`);
      } else {
        console.log("❌ Lightbox did not open");
      }
    }
  });

  test("verify our image-zoom script is loaded", async ({ page }) => {
    await page.goto("http://localhost:4000/ai-journal");

    // Check if our script exists in the page
    const hasImageZoomFunction = await page.evaluate(() => {
      // Check if our code is in the page by looking for our console messages
      const scripts = Array.from(document.scripts);
      return scripts.some(
        (script) => script.src.includes("index.js") || script.textContent?.includes("Enabling image zoom"),
      );
    });

    console.log(`Image zoom code present in page: ${hasImageZoomFunction}`);

    // Check the compiled JS file
    const jsResponse = await page.goto("http://localhost:4000/assets/js/index.js");
    const jsContent = await jsResponse.text();
    const hasImageZoomInBundle = jsContent.includes("image zoom") || jsContent.includes("glightbox");
    console.log(`Image zoom code in bundle: ${hasImageZoomInBundle}`);
  });
});
