import { expect, test } from "@playwright/test";
import _ from "lodash";
import { checkForJsErrors } from "./js-error-checker";

const SERVER_PORT = process.env.SERVER_PORT || "4000";
const BASE_URL = `http://localhost:${SERVER_PORT}`;

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
    page.on("dialog", async (dialog) => {
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

  test.skip("'p' key swaps between production and test", async ({ page }) => {
    // Start on localhost
    await page.goto("/happy");
    await page.waitForTimeout(500);

    // Press 'p' to go to production
    await page.keyboard.press("p");

    // Wait for navigation to complete
    await page.waitForURL(/https:\/\/idvork\.in/, { timeout: 10000 });
    expect(page.url()).toBe("https://idvork.in/happy");

    // Press 'p' again to go back to test
    await page.keyboard.press("p");

    // Wait for navigation back to localhost with the correct port
    await page.waitForURL(new RegExp(`http://localhost:${_.escapeRegExp(SERVER_PORT)}`), { timeout: 10000 });
    expect(page.url()).toBe(`${BASE_URL}/happy`);
  });

  test("'p' key preserves non-default port", async ({ page }) => {
    // This test is meaningful when running on non-default port
    if (SERVER_PORT !== "4000") {
      await page.goto("/toc");
      await page.waitForTimeout(500);

      // Record the original URL with port
      const originalUrl = page.url();
      expect(originalUrl).toContain(`localhost:${SERVER_PORT}`);

      // Press 'p' to go to production
      await page.keyboard.press("p");
      await page.waitForURL(/https:\/\/idvork\.in/, { timeout: 10000 });

      // Press 'p' to return - should preserve the original port
      await page.keyboard.press("p");
      await page.waitForURL(new RegExp(`http://localhost:${_.escapeRegExp(SERVER_PORT)}`), { timeout: 10000 });

      expect(page.url()).toBe(originalUrl);
    }
  });

  test("Navigate to /all with 'a' key", async ({ page }) => {
    await page.keyboard.press("a");
    await expect(page).toHaveURL(/\/all$/);
  });

  test("Navigate to /toc with 'm' key", async ({ page }) => {
    await page.keyboard.press("m");
    await expect(page).toHaveURL(/\/toc$/);
  });

  test("Shortcuts page has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, startPage);
  });
});
