// ABOUTME: Verifies the time-allocation buckets include on the rendered /time-allocation page.
// ABOUTME: Covers the weekday/weekend toggle, the shrink-tech slider, the ceiling markers, the Tech expand and the table.

import { type Page, expect, test } from "./base-test";

const WIDGET = "#bkt-buckets";

async function openChart(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/time-allocation");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(WIDGET)).toBeVisible();
  // The script builds five bucket blocks, five rows, and Tech's three parts
  // (drawn at zero width until Tech is opened) from its data block.
  await expect(page.locator(`${WIDGET} .bkt-seg[data-id]`)).toHaveCount(5);
  await expect(page.locator(`${WIDGET} .bkt-seg[data-part]`)).toHaveCount(3);
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

// Tech's hours and the hours of its three parts, as the reader sees them.
async function techAndParts(page: Page): Promise<{ tech: number; parts: number[] }> {
  return page.evaluate(() => {
    const num = (el: Element | null) => Number.parseFloat((el?.textContent ?? "").replace("h", ""));
    return {
      tech: num(document.querySelector("#bkt-buckets .bkt-row .bkt-hours")),
      parts: [...document.querySelectorAll("#bkt-buckets .bkt-subrow .bkt-hours")].map(num),
    };
  });
}

function sum(values: number[]): number {
  return Math.round(values.reduce((a, b) => a + b, 0) * 10) / 10;
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

  test("opening Tech shows its three parts, and they add back up to Tech", async ({ page }) => {
    await openChart(page);

    const toggle = page.locator("#bkt-tech-toggle");
    const parts = page.locator(`${WIDGET} #bkt-tech-parts`);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(parts).toBeHidden();
    // Splitting Tech must not change the five top-level rows.
    await expect(page.locator(`${WIDGET} .bkt-data tbody tr`)).toHaveCount(5);

    // Keyboard, because the control is a real button and that is the point.
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(parts).toBeVisible();

    await expect(page.locator(`${WIDGET} .bkt-subrow .bkt-name`)).toHaveText([
      "Work",
      "Side projects",
      "Enabling environment",
    ]);
    await expect(page.locator(`${WIDGET} .bkt-row`)).toHaveCount(5);
    await expect(page.locator(`${WIDGET} .bkt-data tbody tr`)).toHaveCount(8);

    const atZero = await techAndParts(page);
    expect(atZero.parts).toHaveLength(3);
    expect(sum(atZero.parts)).toBe(atZero.tech);

    // Shrinking tech drains the parts proportionally, and they still add up.
    await setShrink(page, "4");
    const atFour = await techAndParts(page);
    expect(atFour.tech).toBeLessThan(atZero.tech);
    expect(sum(atFour.parts)).toBe(atFour.tech);
  });

  test("closing Tech puts the single block back", async ({ page }) => {
    await openChart(page);

    const toggle = page.locator("#bkt-tech-toggle");
    const parts = page.locator(`${WIDGET} #bkt-tech-parts`);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // While open, Tech is drawn as its parts rather than as one block.
    await expect
      .poll(() =>
        page.evaluate(() => document.querySelector<HTMLElement>('#bkt-buckets .bkt-seg[data-id="tech"]')?.style.width),
      )
      .toBe("0%");

    // Clicking a part block in the bar closes it again.
    await page.locator(`${WIDGET} .bkt-seg[data-part="work"]`).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(parts).toBeHidden();
    await expect(page.locator(`${WIDGET} .bkt-data tbody tr`)).toHaveCount(5);
    await expect
      .poll(() =>
        page.evaluate(() => document.querySelector<HTMLElement>('#bkt-buckets .bkt-seg[data-id="tech"]')?.style.width),
      )
      .not.toBe("0%");
  });
});
