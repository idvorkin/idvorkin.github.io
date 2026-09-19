// ABOUTME: Verifies the time-allocation buckets include on the rendered /time-allocation page.
// ABOUTME: Covers the weekday/weekend toggle, the shrink-tech slider, the ceiling markers and the numbers table.

import { type Page, expect, test } from "./base-test";

const WIDGET = "#bkt-buckets";

async function openChart(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/time-allocation");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(WIDGET)).toBeVisible();
  // The script builds the five segments and five rows from its data block.
  await expect(page.locator(`${WIDGET} .bkt-seg`)).toHaveCount(5);
  await expect(page.locator(`${WIDGET} .bkt-row`)).toHaveCount(5);
}

// The rendered box animates, so read the width the script set rather than the
// box: it is assigned synchronously and is the value under test.
async function segHours(page: Page, id: string): Promise<number> {
  return page.evaluate((bucket) => {
    const el = document.querySelector(`#bkt-buckets .bkt-seg[data-id="${bucket}"]`) as HTMLElement | null;
    return el ? Number.parseFloat(el.style.width) : Number.NaN;
  }, id);
}

async function setShrink(page: Page, hours: string): Promise<void> {
  const slider = page.locator("#bkt-shrink");
  await slider.fill(hours);
  await slider.dispatchEvent("input");
  await expect(page.locator("#bkt-shrink-out")).toHaveText(`${hours}h`);
}

test.describe("Time allocation buckets chart", () => {
  test("shrinking tech pushes hours into consumption, not into relationships", async ({ page }) => {
    await openChart(page);

    const techBefore = await segHours(page, "tech");
    const consumptionBefore = await segHours(page, "consumption");
    const relationshipsBefore = await segHours(page, "relationships");

    await page.locator(`${WIDGET} [data-flow="usual"]`).click();
    await expect(page.locator(`${WIDGET} [data-flow="usual"]`)).toHaveAttribute("aria-pressed", "true");
    await setShrink(page, "4");

    const consumptionAfter = await segHours(page, "consumption");
    const relationshipsAfter = await segHours(page, "relationships");

    expect(await segHours(page, "tech")).toBeLessThan(techBefore);
    // The freed hours go mostly to consumption, which is the point of the chart.
    expect(consumptionAfter - consumptionBefore).toBeGreaterThan(relationshipsAfter - relationshipsBefore);
  });

  test("the relationships ceiling pins the bar and the overflow lands in consumption", async ({ page }) => {
    await openChart(page);

    // Weekday + "what I expect" + 4h is the case where two buckets top out.
    await setShrink(page, "4");

    await expect(page.locator(`${WIDGET} .bkt-row.is-capped`)).toHaveCount(2);
    await expect(page.locator(`${WIDGET} .bkt-rows`)).toContainText("at the ceiling");
    await expect(page.locator(`${WIDGET} .bkt-data caption`)).toContainText("landed in consumption");

    // Once the width transition settles, the dashed ceiling marker sits on the
    // right edge of the segment it capped.
    await page.waitForFunction(() => {
      const rect = document.querySelector('#bkt-buckets .bkt-seg[data-id="relationships"]')?.getBoundingClientRect();
      const mark = document.querySelector("#bkt-buckets .bkt-rail .bkt-mark")?.getBoundingClientRect();
      return !!rect && !!mark && Math.abs(rect.right - mark.left) < 2;
    });
  });

  test("the weekend toggle and the numbers table stay in step at phone width", async ({ page }) => {
    await openChart(page, 390);

    const techWeekday = await segHours(page, "tech");
    await page.locator(`${WIDGET} [data-day="weekend"]`).click();
    await expect(page.locator(`${WIDGET} [data-day="weekend"]`)).toHaveAttribute("aria-pressed", "true");
    expect(await segHours(page, "tech")).toBeLessThan(techWeekday);

    await page.locator(`${WIDGET} .bkt-data summary`).click();
    const table = page.locator(`${WIDGET} .bkt-data table`);
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr")).toHaveCount(5);
    await expect(page.locator(`${WIDGET} .bkt-data caption`)).toContainText("Weekend");

    // The chart must not push the page sideways on a phone.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
