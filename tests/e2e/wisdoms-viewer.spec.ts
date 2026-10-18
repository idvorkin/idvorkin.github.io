// ABOUTME: Verifies the shared panel viewer on /japanese-wisdoms: grid tiles and section images open it.
// ABOUTME: Covers post-order stepping across all twelve panels, captions, swipe, keys and the last-panel stop.

import { type Page, expect, test } from "./base-test";

async function openWisdoms(page: Page, width: number): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/japanese-wisdoms");
  await page.waitForLoadState("networkidle");
}

const current = '.den-lightbox__image[data-den-current="true"]';

test.describe("Japanese wisdoms panel viewer", () => {
  test("a grid tile opens its panel and arrow keys walk all twelve in post order", async ({ page }) => {
    await openWisdoms(page, 1280);
    await page.locator('[data-den-strip][data-num="japanese-wisdoms"] [data-den-panel="1"]').click();

    const lightbox = page.locator("#den-lightbox");
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightbox.locator(".den-lightbox__title")).toHaveText("1. Ikigai — a reason to get up");
    await expect(lightbox.locator(".den-lightbox__counter")).toHaveText("panel 1 of 12");
    await expect(lightbox.locator(".den-lightbox__dot")).toHaveCount(12);
    await expect(lightbox.locator(".den-lightbox__receipts")).toBeHidden();
    await expect(lightbox.locator(".den-lightbox__previous")).toBeDisabled();

    for (let step = 0; step < 11; step++) await page.keyboard.press("ArrowRight");
    await expect(lightbox.locator(".den-lightbox__title")).toHaveText("12. Mottainai — don't waste it");
    await expect(lightbox.locator(current)).toHaveAttribute("src", "/images/japanese-wisdoms/mottainai.webp");
    await expect(lightbox.locator(".den-lightbox__next")).toBeDisabled();

    await page.keyboard.press("ArrowRight");
    await expect(lightbox.locator(".den-lightbox__counter")).toHaveText("panel 12 of 12");

    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
  });

  test("a section image opens the viewer on phone, and swipes step both ways", async ({ page }) => {
    await openWisdoms(page, 390);
    const opener = page.locator('img[data-den-open="japanese-wisdoms"][data-den-panel="5"]');
    await opener.scrollIntoViewIfNeeded();
    await opener.click();

    const lightbox = page.locator("#den-lightbox");
    const imageShell = lightbox.locator(".den-lightbox__image-shell");
    await expect(lightbox.locator(".den-lightbox__title")).toHaveText("5. Gaman — endure with dignity");

    await imageShell.dispatchEvent("pointerdown", { clientX: 300, clientY: 300 });
    await imageShell.dispatchEvent("pointerup", { clientX: 200, clientY: 300 });
    await expect(lightbox.locator(".den-lightbox__title")).toHaveText("6. Wabi-sabi — beauty in imperfection");

    await imageShell.dispatchEvent("pointerdown", { clientX: 100, clientY: 300 });
    await imageShell.dispatchEvent("pointerup", { clientX: 250, clientY: 300 });
    await expect(lightbox.locator(".den-lightbox__title")).toHaveText("5. Gaman — endure with dignity");
    await expect(lightbox.locator(current)).toHaveAttribute("src", "/images/japanese-wisdoms/gaman.webp");

    const box = await lightbox.locator(".den-lightbox__caption").boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(390);

    await lightbox.locator(".den-lightbox__close").click();
    await expect(lightbox).toBeHidden();
    await expect(opener).toBeFocused();
  });
});
