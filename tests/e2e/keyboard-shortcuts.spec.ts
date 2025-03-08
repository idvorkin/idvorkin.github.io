import { test, expect } from "@playwright/test";

test.describe("Keyboard shortcuts", () => {
  const startPage = "/save-the-soup";

  test.beforeEach(async ({ page }) => {
    await page.goto(startPage);
    // Wait a bit for keyboard bindings to load
    await page.waitForTimeout(500);
  });

  test("Help dialog loads with ? key", async ({ page }) => {
    // Set up a dialog handler to capture the alert text
    let alertText = "";
    page.on("dialog", async dialog => {
      alertText = dialog.message();
      await dialog.accept();
    });

    // Press the ? key
    await page.keyboard.press("?");

    // Wait a bit for the alert to appear and be handled
    await page.waitForTimeout(500);

    // Check that the alert text contains the expected content
    expect(alertText).toContain("Try these shortcuts");
  });

  test("Navigate to ig66 with 6 key", async ({ page }) => {
    // Press the 6 key
    await page.keyboard.press("6");

    // Check that we navigated to ig66
    await expect(page).toHaveURL(/ig66/);
  });
});
