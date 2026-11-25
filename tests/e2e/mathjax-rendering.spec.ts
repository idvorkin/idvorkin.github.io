import { expect, test } from "./base-test";

test.describe("MathJax rendering", () => {
  test("MathJax renders equations on activation page", async ({ page }) => {
    // Navigate to the activation page
    await page.goto("/activation", { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for MathJax to load and process the equations
    // MathJax adds a script tag with id "MathJax-script"
    await expect(page.locator("#MathJax-script")).toBeAttached();

    // Wait for MathJax to process the math - it creates mjx-container elements
    await page.waitForSelector("mjx-container", { timeout: 10000 });

    // Verify that MathJax has processed the equation. The page has one display
    // equation since e89aac509 merged its three $$ lines into a single block.
    const mathContainers = page.locator("mjx-container");
    await expect(mathContainers).toHaveCount(1);

    // Verify the equation content is rendered (not just the raw TeX source):
    // neither the $$ delimiters nor a TeX command may be left in the page.
    const contentHolder = page.locator("#content-holder");
    const htmlContent = await contentHolder.innerHTML();
    expect(htmlContent).not.toContain("$$");
    expect(htmlContent).not.toContain("\\text{");

    // Verify specific equation parts are rendered
    await expect(mathContainers.first()).toContainText("Energyactivation=EnergyStop(Activitycurrent)");

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
});
