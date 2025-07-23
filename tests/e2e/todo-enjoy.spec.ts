import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Things I enjoy page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/todo_enjoy");
  });

  test("Page loads correctly", async ({ page }) => {
    await expect(page).toHaveURL(/todo_enjoy/);
  });

  test("Has entertaining in donut chart", async ({ page }) => {
    await expect(page.locator('#sunburst text:has-text("Entertaining")')).toBeVisible();
  });

  test("Click random blog post randomizes", async ({ page }) => {
    const blogPostElement = page.locator("#random-blog-posts");

    // Get the original text
    const originalText = await blogPostElement.textContent();

    // Click the element
    await blogPostElement.click();

    // Wait for potential update
    await page.waitForTimeout(500);

    // Get the new text
    const newText = await blogPostElement.textContent();

    // Verify the text changed
    expect(newText).not.toEqual(originalText);
  });

  test("Get different prompt clicking in donut", async ({ page }) => {
    const promptElement = page.locator("#sunburst_text");
    const donutCenter = page.locator(".sunburst text").first();

    // Get the original text
    const originalText = await promptElement.textContent();

    // Click the donut center with force: true
    await donutCenter.click({ force: true });

    // Wait for potential update
    await page.waitForTimeout(500);

    // Get the new text
    const newText = await promptElement.textContent();

    // Verify the text changed
    expect(newText).not.toEqual(originalText);
  });

  test("Click into Entertaining zooms Entertaining, click again zooms out", async ({ page }) => {
    const hobbiesElement = page.locator('#sunburst text:has-text("Entertaining")');
    const donutCenter = page.locator(".sunburst text").first();
    const defaultCenterText = "Invest in";

    // Click on Entertaining with force: true to bypass interception
    await hobbiesElement.click({ force: true });

    // Verify center text changed to Entertaining
    await expect(donutCenter).toContainText("Entertaining");

    // Click again to go back with force: true
    await donutCenter.click({ force: true });

    // Verify center text changed back to default
    await expect(donutCenter).toContainText(defaultCenterText);
  });

  test("Leaf selection doesn't change center text", async ({ page }) => {
    const hobbiesElement = page.locator('#sunburst text:has-text("Entertaining")');
    const jugglingElement = page.locator('#sunburst text:has-text("Juggling")');
    const donutCenter = page.locator(".sunburst text").first();
    const defaultCenterText = "Invest in";

    // Go into hobbies with force: true
    await hobbiesElement.click({ force: true });

    // Verify center text changed to Entertaining
    await expect(donutCenter).toContainText("Entertaining");

    // Click on Juggling with force: true
    await jugglingElement.click({ force: true });

    // Verify center text still shows Entertaining
    await expect(donutCenter).toContainText("Entertaining");

    // Go back to default by clicking center with force: true
    await donutCenter.click({ force: true });

    // Verify center text changed back to default
    await expect(donutCenter).toContainText(defaultCenterText);
  });

  test("Click prompt randomizes", async ({ page }) => {
    const promptElement = page.locator("#sunburst_text");

    // Get the original text
    const originalText = await promptElement.textContent();

    // Click the prompt
    await promptElement.click();

    // Wait for potential update
    await page.waitForTimeout(500);

    // Get the new text
    const newText = await promptElement.textContent();

    // Verify the text changed
    expect(newText).not.toEqual(originalText);

    // Do it again to make sure it's random
    const secondText = await promptElement.textContent();

    // Click the prompt again
    await promptElement.click();

    // Wait for potential update
    await page.waitForTimeout(500);

    // Get the third text
    const thirdText = await promptElement.textContent();

    // Verify the text changed again
    expect(thirdText).not.toEqual(secondText);
  });

  test("Todo enjoy page has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/todo_enjoy");
  });
});
