// ABOUTME: Verifies the "Move an hour" chart (time-allocation-buckets include) on the rendered /time-allocation page.
// ABOUTME: Covers the work slider and plan toggle, the ceilings, the weekend toggle at phone width, and the point-the-hour ladder.

import { type Page, expect, test } from "./base-test";

// #889 rebuilt this chart from scratch: the shrink slider, the Tech expand and
// the numbers table are gone, replaced by work and own-tech sliders, a
// No plan / Planned toggle and a ladder that points one hour up or back. These
// tests cover the same ideas on the new controls. They assert relationships
// between buckets, never the made-up hours themselves.
const WIDGET = "#tbk-buckets";
const BUCKET_IDS = ["tech", "identity", "health", "relationships", "consumption"];

async function openChart(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/time-allocation");
  await expect(page.locator(WIDGET)).toBeVisible();
  // The script builds one row per bucket from its data block.
  await expect(page.locator(`${WIDGET} .tbk-row`)).toHaveCount(BUCKET_IDS.length);
}

// A bucket's hours as the reader sees them in its row.
async function rowHours(page: Page, id: string): Promise<number> {
  const text = await page.locator(`${WIDGET} .tbk-row[data-id="${id}"] .tbk-hours`).textContent();
  return Number.parseFloat((text ?? "").replace("h", ""));
}

async function allHours(page: Page): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const id of BUCKET_IDS) out[id] = await rowHours(page, id);
  return out;
}

function sum(values: number[]): number {
  return Math.round(values.reduce((a, b) => a + b, 0) * 10) / 10;
}

async function setWork(page: Page, hours: string): Promise<void> {
  const slider = page.locator("#tbk-work");
  await slider.fill(hours);
  await slider.dispatchEvent("input");
  await expect(page.locator("#tbk-work-out")).toHaveText(`${hours}h`);
}

// The day's total never moves: hours only travel between buckets.
async function expectDayTotalKept(page: Page, before: Record<string, number>): Promise<void> {
  const after = await allHours(page);
  expect(sum(Object.values(after))).toBe(sum(Object.values(before)));
  await expect(page.locator(`${WIDGET} .tbk-total-sum`)).toHaveText(/^(\d+(\.\d)?)h of \1h to spend$/);
}

test.describe("Time allocation buckets chart", () => {
  test("shrinking tech with no plan pushes hours into consumption, not into relationships", async ({ page }) => {
    await openChart(page);
    await expect(page.locator(`${WIDGET} [data-plan="none"]`)).toHaveAttribute("aria-pressed", "true");

    const before = await allHours(page);
    await setWork(page, "4");
    const after = await allHours(page);

    expect(after.tech).toBeLessThan(before.tech);
    // The freed hours go mostly to consumption, which is the point of the chart.
    expect(after.consumption - before.consumption).toBeGreaterThan(after.relationships - before.relationships);
    await expect(page.locator(`${WIDGET} .tbk-leak`)).toContainText("went to the phone");
    await expectDayTotalKept(page, before);
  });

  test("with a plan, the ceilings pin their bars and the overflow lands in consumption", async ({ page }) => {
    await openChart(page);
    await expect(page.locator(`${WIDGET} .tbk-row.is-capped`)).toHaveCount(0);

    const before = await allHours(page);
    await page.locator(`${WIDGET} [data-plan="planned"]`).click();
    await expect(page.locator(`${WIDGET} [data-plan="planned"]`)).toHaveAttribute("aria-pressed", "true");
    // Weekday + Planned + 3h out of work is the case where both ceilings top out.
    await setWork(page, "4");

    await expect(page.locator(`${WIDGET} .tbk-row.is-capped`)).toHaveCount(2);
    await expect(page.locator(`${WIDGET} .tbk-row[data-id="relationships"]`)).toHaveClass(/is-capped/);
    await expect(page.locator(`${WIDGET} .tbk-row[data-id="relationships"] .tbk-note`)).toContainText(
      "nobody else is free",
    );
    await expect(page.locator(`${WIDGET} .tbk-leak`)).toContainText("ran past a ceiling and went to the phone anyway");
    expect(await rowHours(page, "consumption")).toBeGreaterThan(before.consumption);
    await expectDayTotalKept(page, before);

    // Once the width transition settles, the capped bar ends on its dashed
    // ceiling tick.
    await page.waitForFunction(() => {
      const row = document.querySelector('#tbk-buckets .tbk-row[data-id="relationships"]');
      const fill = row?.querySelector(".tbk-fill")?.getBoundingClientRect();
      const cap = row?.querySelector(".tbk-cap")?.getBoundingClientRect();
      return !!fill && !!cap && Math.abs(fill.right - cap.left) < 2;
    });
  });

  test("the weekend toggle resets the day and the chart fits a phone", async ({ page }) => {
    await openChart(page, 390);

    const weekday = await allHours(page);
    const weekdayWork = await page.locator("#tbk-work").inputValue();
    await page.locator(`${WIDGET} [data-dayk="weekend"]`).click();
    await expect(page.locator(`${WIDGET} [data-dayk="weekend"]`)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(`${WIDGET} [data-dayk="weekday"]`)).toHaveAttribute("aria-pressed", "false");

    const weekend = await allHours(page);
    // Less work, more time with people, and the same day to spend.
    expect(weekend.tech).toBeLessThan(weekday.tech);
    expect(weekend.relationships).toBeGreaterThan(weekday.relationships);
    expect(sum(Object.values(weekend))).toBe(sum(Object.values(weekday)));
    // The work slider jumps to the weekend's baseline, and its label follows.
    expect(`${await page.locator("#tbk-work").inputValue()}h`).toBe(await page.locator("#tbk-work-out").textContent());
    expect(await page.locator("#tbk-work").inputValue()).not.toBe(weekdayWork);

    // The chart must not push the page sideways on a phone.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("pushing the hour up moves it out of the phone, into my own tech, then work", async ({ page }) => {
    await openChart(page);

    const up = page.locator(`${WIDGET} [data-lift="1"]`);
    const back = page.locator(`${WIDGET} [data-lift="-1"]`);
    const rung = page.locator(`${WIDGET} .tbk-lift-rung`);
    await expect(rung).toHaveAttribute("data-rung", "0");
    await expect(rung).toContainText("in the phone");
    await expect(back).toBeDisabled();

    const before = await allHours(page);

    // Keyboard, because the control is a real button and that is the point.
    await up.focus();
    await page.keyboard.press("Enter");
    await expect(rung).toHaveAttribute("data-rung", "1");
    await expect(rung).toContainText("in my own tech");
    const atOwn = await allHours(page);
    expect(atOwn.consumption).toBeLessThan(before.consumption);
    expect(atOwn.tech).toBeGreaterThan(before.tech);
    // The hour moved; it was not made.
    expect(sum([atOwn.tech, -before.tech])).toBe(sum([before.consumption, -atOwn.consumption]));
    await expect(page.locator(`${WIDGET} .tbk-leak`)).toContainText("One hour pushed up");

    await page.keyboard.press("Enter");
    await expect(rung).toHaveAttribute("data-rung", "2");
    await expect(rung).toContainText("at work");
    // The top of the ladder: nowhere further to push.
    await expect(up).toBeDisabled();
    await expectDayTotalKept(page, before);
  });

  test("letting the hour slide back returns it to the phone", async ({ page }) => {
    await openChart(page);

    const up = page.locator(`${WIDGET} [data-lift="1"]`);
    const back = page.locator(`${WIDGET} [data-lift="-1"]`);
    const rung = page.locator(`${WIDGET} .tbk-lift-rung`);
    const before = await allHours(page);

    await up.click();
    await up.click();
    await expect(rung).toHaveAttribute("data-rung", "2");

    await back.click();
    await expect(rung).toHaveAttribute("data-rung", "1");
    await expect(page.locator(`${WIDGET} .tbk-leak`)).toContainText("It slid back");

    await back.click();
    await expect(rung).toHaveAttribute("data-rung", "0");
    await expect(page.locator(`${WIDGET} .tbk-leak`)).toContainText("It slid back to the phone");
    await expect(page.locator(`${WIDGET} .tbk-leak`)).toHaveClass(/is-leaking/);
    await expect(back).toBeDisabled();
    // Every bucket is back where it started.
    expect(await allHours(page)).toEqual(before);
  });
});
