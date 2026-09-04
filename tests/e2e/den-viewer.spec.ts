// ABOUTME: Verifies the Den panel lightbox on the rendered /the-den page.
// ABOUTME: Covers direct panel opening, full-strip completion, boundaries, and closing.

import { type Page, expect, test } from "./base-test";

async function openDen(page: Page, width: number): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/the-den");
  await page.waitForLoadState("networkidle");
}

test.describe("The Den panel viewer", () => {
  test("opens strip 7 at panel 4 and finishes on the full strip", async ({ page }) => {
    await openDen(page, 390);
    await page.locator('[data-den-strip][data-num="7"] [data-den-panel="4"]').click();

    const lightbox = page.locator("#den-lightbox");
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightbox).toHaveAttribute("data-den-strip", "7");
    await expect(lightbox).toHaveAttribute("data-den-step", "4");
    await expect(lightbox.locator(".den-lightbox__counter")).toHaveText("panel 4 of 4");
    await expect(lightbox.locator('.den-lightbox__image[data-den-current="true"]')).toHaveAttribute(
      "src",
      "/images/den/den-007-p4.webp",
    );

    await lightbox.locator(".den-lightbox__tap-next").click({ force: true });

    await expect(lightbox).toHaveAttribute("data-den-step", "all");
    await expect(lightbox.locator(".den-lightbox__counter")).toHaveText("full strip");
    await expect(lightbox.locator('.den-lightbox__dot--all[aria-current="true"]')).toHaveCount(1);
    await expect(lightbox.locator('.den-lightbox__image[data-den-current="true"]')).toHaveAttribute(
      "src",
      "/images/den/den-007.webp",
    );
    await expect(lightbox.locator(".den-lightbox__next")).toBeDisabled();
  });

  test("supports phone edge taps and swipes without crossing strips", async ({ page }) => {
    await openDen(page, 390);
    await page.locator('[data-den-strip][data-num="7"] [data-den-panel="1"]').click();
    const lightbox = page.locator("#den-lightbox");
    const imageShell = lightbox.locator(".den-lightbox__image-shell");

    await expect(page.locator("html")).toHaveClass(/den-lightbox-open/);
    await expect(page.locator("body")).toHaveClass(/den-lightbox-open/);
    await lightbox.locator(".den-lightbox__tap-next").click({ force: true });
    await expect(lightbox).toHaveAttribute("data-den-step", "2");

    await imageShell.dispatchEvent("pointerdown", { clientX: 300, clientY: 300 });
    await imageShell.dispatchEvent("pointerup", { clientX: 200, clientY: 300 });
    await expect(lightbox).toHaveAttribute("data-den-step", "3");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(lightbox).toHaveAttribute("data-den-strip", "7");
    await expect(lightbox).toHaveAttribute("data-den-step", "all");
  });

  test("traps focus on desktop and restores it when closed", async ({ page }) => {
    await openDen(page, 1280);
    const opener = page.locator('[data-den-strip][data-num="7"] [data-den-panel="4"]');
    await opener.click();
    const lightbox = page.locator("#den-lightbox");

    await expect(lightbox.locator(".den-lightbox__close")).toBeFocused();
    await lightbox.locator(".den-lightbox__next").click();
    await expect(lightbox).toHaveAttribute("data-den-step", "all");
    await lightbox.locator(".den-lightbox__previous").click();
    await expect(lightbox).toHaveAttribute("data-den-step", "4");
    await lightbox.locator(".den-lightbox__close").focus();
    await page.keyboard.press("Shift+Tab");
    await expect(lightbox.locator(".den-lightbox__receipts")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(lightbox.locator(".den-lightbox__close")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator("html")).not.toHaveClass(/den-lightbox-open/);
    await expect(page.locator("body")).not.toHaveClass(/den-lightbox-open/);
  });

  test("redirects the removed demo URL to the main page", async ({ page }) => {
    await page.goto("/den-viewer");
    await expect(page).toHaveURL(/\/the-den$/);
  });
});
