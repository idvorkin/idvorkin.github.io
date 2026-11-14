// ABOUTME: Verifies the Staying Afloat stress tolerance slider: in view without opening More controls,
// ABOUTME: moves the waterline (lower tolerance = higher water), and resets with "Reset".

import { type Page, expect, test } from "./base-test";

const EMBED = "/floating-zooming/app.html?embed=float";

// The waterline's vertical offset, read off the water layer's transform (translate(0 y)). Negative is higher.
async function waterY(page: Page): Promise<number> {
  const t = await page.locator("#water-back-g").getAttribute("transform");
  const m = /translate\(0 (-?[\d.]+)\)/.exec(t ?? "");
  return m ? Number(m[1]) : Number.NaN;
}

async function setTolerance(page: Page, value: number): Promise<void> {
  await page.locator("#tolerance").evaluate((el, v) => {
    const input = el as HTMLInputElement;
    input.value = String(v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test.describe("Staying Afloat stress tolerance", () => {
  test.use({ reducedMotion: "reduce" }); // the water snaps instead of easing, so one frame is enough

  test("is in view with More controls closed", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(EMBED);
    await expect(page.locator("#more")).not.toHaveAttribute("open", "");
    await expect(page.locator("#tolerance")).toBeVisible();
    await expect(page.locator("#tolerance")).toHaveValue("71");
    // the row sits outside the disclosure
    expect(await page.locator("#more #tolerance").count()).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test("lower tolerance raises the water, higher lowers it, reset restores it", async ({ page }) => {
    await page.goto(EMBED);
    await expect.poll(() => waterY(page)).not.toBeNaN();
    const typical = await waterY(page);

    await setTolerance(page, 0);
    await expect.poll(() => waterY(page)).toBeLessThan(typical - 100);
    await expect(page.locator("#tolerance")).toHaveAttribute("aria-valuetext", "low tolerance");

    await setTolerance(page, 100);
    await expect.poll(() => waterY(page)).toBeGreaterThan(typical + 30);
    await expect(page.locator("#tolerance")).toHaveAttribute("aria-valuetext", "high tolerance");

    await page.locator("#more > summary").click();
    await page.locator("#preset-reset").click();
    await expect(page.locator("#tolerance")).toHaveValue("71");
    await expect.poll(() => waterY(page)).toBeCloseTo(typical, 0);
  });

  test("the same weights sink you sooner at low tolerance", async ({ page }) => {
    await page.goto(EMBED);
    await page.locator("#more > summary").click();
    await page.locator("#preset-neither").click();
    await expect(page.locator("#zone-val")).toHaveText("coping");
    await setTolerance(page, 0);
    await expect(page.locator("#zone-val")).toHaveText("overwhelmed");
    await setTolerance(page, 100);
    await expect(page.locator("#zone-val")).toHaveText("thriving");
  });

  test("shows under the picture in the post", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/staying-afloat");
    const frame = page.frameLocator("iframe.afloat-embed");
    await expect(frame.locator("#tolerance")).toBeVisible();
    await expect(frame.locator("#more")).not.toHaveAttribute("open", "");
  });
});
