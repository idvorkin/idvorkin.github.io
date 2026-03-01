import { expect, test } from "./base-test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("MathJax rendering", () => {
  test("MathJax renders equations on activation page", async ({ page }) => {
    // Navigate to the activation page
    await page.goto("/activation", { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for MathJax to load and process the equations
    // MathJax adds a script tag with id "MathJax-script"
    await expect(page.locator("#MathJax-script")).toBeAttached();

    // Wait for MathJax to process the math - it creates mjx-container elements
    await page.waitForSelector("mjx-container", { timeout: 10000 });

    // Verify that MathJax has processed the equations
    // There should be at least 3 mjx-container elements (one for each equation part)
    const mathContainers = page.locator("mjx-container");
    await expect(mathContainers).toHaveCount(3);

    // Verify the equation content is rendered (not just the raw $$ syntax)
    // Check that the original $$ delimiters are not visible in the rendered content
    const contentHolder = page.locator("#content-holder");
    const htmlContent = await contentHolder.innerHTML();

    // The raw $$ should not be visible if MathJax processed it correctly
    expect(htmlContent).not.toContain("$$ Activation");

    // Verify specific equation parts are rendered
    await expect(page.locator("mjx-container").first()).toContainText("Activation");

    // Check that the page title is correct
    await expect(page.locator("h1")).toContainText("Activation Energy");
  });

  test("MathJax does not load on pages without mathjax tag", async ({ page }) => {
    // Navigate to a page that doesn't have mathjax: true
    await page.goto("/about", { waitUntil: "domcontentloaded", timeout: 30000 });

    // Verify that MathJax script is not loaded
    await expect(page.locator("#MathJax-script")).not.toBeAttached();

    // Verify no mjx-container elements exist
    const mathContainers = page.locator("mjx-container");
    await expect(mathContainers).toHaveCount(0);
  });

  test("Activation page has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/activation");
  });
});
