// ABOUTME: Verifies the orchestrator widget on the rendered /ai-orchestrator page.
// ABOUTME: Covers the viewer in context, the layer/column toggles over the table, and phone-width layout.

import { type Page, expect, test } from "./base-test";

const WIDGET = "#orc-stack";
const VIEW = "orc-stack-view";
const LAST = 9;
const ALL_BLOCKS = 19; // every block except the single agent that step 2 replaces
const WHOLE = "The whole stack";

// Slot 0 of the scrubber is the whole stack, so block n sits in slot n + 1.
const SLOTS = LAST + 2;
const slotOf = (block: number) => String(block + 1);
const titleAt = (slot: number) => (slot === 0 ? WHOLE : new RegExp(`^${slot - 1}\\. `));

const part = (name: string) => `#${VIEW} [data-orc="${name}"]`;
const shown = `#${VIEW} .orc-svg .orc-brick:not([hidden])`;

async function openStack(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/ai-orchestrator");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(WIDGET)).toBeVisible();
  // The script paints the story and un-hides the toggles, so this is the
  // "JS ran" gate for both halves of the widget.
  await expect(page.locator(part("title"))).toHaveText(WHOLE);
  await expect(page.locator("#orc-toggles")).toBeVisible();
}

test.describe("Orchestrator stack", () => {
  test("the viewer leads the widget, with no title block above it", async ({ page }) => {
    await openStack(page);

    // The drawing is the first thing in the box: no heading, no sub line.
    await expect(page.locator(`${WIDGET} .orc-title, ${WIDGET} .orc-sub`)).toHaveCount(0);
    const first = await page.evaluate(
      () => (document.querySelector("#orc-stack") as HTMLElement).firstElementChild?.id,
    );
    expect(first).toBe(VIEW);

    // Controls at the top, and they hold their place through the whole story.
    const order = await page.evaluate(() =>
      Array.from((document.querySelector("#orc-stack-view .orcv-fig") as HTMLElement).children).map(
        (el) => el.className,
      ),
    );
    expect(order).toEqual(["orcv-bar", "orcv-story", "orcv-hint", "orcv-canvas"]);

    const ys: number[] = [];
    for (let v = 0; v < SLOTS; v++) {
      await page.locator(part("range")).fill(String(v));
      await expect(page.locator(part("title"))).toHaveText(titleAt(v));
      ys.push(
        await page.evaluate(() => {
          const root = document.getElementById("orc-stack-view") as HTMLElement;
          const bar = root.querySelector(".orcv-bar") as HTMLElement;
          return Math.round(bar.getBoundingClientRect().top - root.getBoundingClientRect().top);
        }),
      );
    }
    expect(ys).toHaveLength(SLOTS);
    expect(new Set(ys).size).toBe(1);
  });

  test("the stepper starts on everything and walks the stack one block at a time", async ({ page }) => {
    await openStack(page);

    // The post opens on the finished stack, in the scrubber's first slot.
    await expect(page.locator(part("count"))).toHaveText("the whole stack");
    await expect(page.locator(part("range"))).toHaveValue("0");
    await expect(page.locator(shown)).toHaveCount(ALL_BLOCKS);
    await expect(page.locator(part("prev"))).toBeDisabled();
    await expect(page.locator(part("next"))).toBeEnabled();

    await page.locator(part("next")).click();
    await expect(page.locator(part("count"))).toHaveText(`block 0 of ${LAST}`);
    await expect(page.locator(part("range"))).toHaveValue(slotOf(0));
    await expect(page.locator(shown)).toHaveCount(2);
    await expect(page.locator(part("prev"))).toBeEnabled();

    await page.locator(part("next")).click();
    await expect(page.locator(part("count"))).toHaveText(`block 1 of ${LAST}`);
    await expect(page.locator(shown)).toHaveCount(3);
    // The **bold** markers in the step data render as real elements, not literals.
    await expect(page.locator(part("solution")).locator("b")).toHaveText("work ledger");
    await expect(page.locator(part("solution"))).not.toContainText("**");

    await page.locator(part("prev")).click();
    await expect(page.locator(part("count"))).toHaveText(`block 0 of ${LAST}`);
    await expect(page.locator(shown)).toHaveCount(2);

    // Back out of the first block returns to everything.
    await page.locator(part("prev")).click();
    await expect(page.locator(part("count"))).toHaveText("the whole stack");
    await expect(page.locator(part("range"))).toHaveValue("0");
    await expect(page.locator(shown)).toHaveCount(ALL_BLOCKS);

    // And Next off the last block wraps to everything rather than dead-ending.
    await page.locator(part("range")).fill(slotOf(LAST));
    await page.locator(part("next")).click();
    await expect(page.locator(part("count"))).toHaveText("the whole stack");
    await expect(page.locator(part("range"))).toHaveValue("0");
  });

  test("a layer toggle hides its rows and dims its blocks", async ({ page }) => {
    await openStack(page);

    const execRows = page.locator('#orc-parts tr[data-layer="exec"]');
    await expect(execRows).toHaveCount(3);
    await expect(execRows.first()).toBeVisible();

    await page.locator('.orc-layer-toggle[data-layer="exec"]').uncheck();
    await expect(execRows.first()).toBeHidden();
    await expect(execRows.last()).toBeHidden();
    await expect(page.locator(`${WIDGET} .orc-svg`)).toHaveClass(/off-exec/);

    await page.locator('.orc-layer-toggle[data-layer="exec"]').check();
    await expect(execRows.first()).toBeVisible();
    await expect(page.locator(`${WIDGET} .orc-svg`)).not.toHaveClass(/off-exec/);

    // Columns hide independently of layers.
    const firstmate = page.locator('#orc-parts [data-col="1"]');
    await expect(firstmate.first()).toBeVisible();
    await page.locator('.orc-col-toggle[data-col="1"]').uncheck();
    await expect(firstmate.first()).toBeHidden();
    await expect(firstmate.last()).toBeHidden();

    // And so does the why line under each block name.
    const why = page.locator("#orc-parts .orc-why");
    await expect(why.first()).toBeVisible();
    await page.locator("#orc-why-toggle").uncheck();
    await expect(why.first()).toBeHidden();
  });

  test("the widget does not push the page sideways at phone width", async ({ page }) => {
    await openStack(page, 390);

    // Stepping still works with the column stacked.
    await page.locator(part("range")).fill(slotOf(0));
    await expect(page.locator(part("count"))).toHaveText(`block 0 of ${LAST}`);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // The drawing reflows; the comparison table still scrolls in its own box.
    const scrolls = await page.evaluate(() =>
      [".orcv-canvas", ".orc-table-wrap"].map((sel) => {
        const el = document.querySelector(`#orc-stack ${sel}`) as HTMLElement | null;
        return !!el && el.scrollWidth > el.clientWidth;
      }),
    );
    expect(scrolls).toEqual([false, true]);
  });

  for (const width of [320, 390, 430, 844, 1280]) {
    test(`every diagram label fits at ${width}px throughout the walkthrough`, async ({ page }) => {
      await openStack(page, width);
      await page.setViewportSize({ width, height: width === 844 ? 390 : 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const hint = page.locator(`#${VIEW} .orcv-hint`);
      if (width < 700) await expect(hint).toBeVisible();
      else await expect(hint).toBeHidden();
      for (let slot = 0; slot < SLOTS; slot++) {
        await page.locator(part("range")).fill(String(slot));
        const clipped = await page.locator(`#${VIEW} .orcv-canvas`).evaluate((canvas) => {
          const bounds = canvas.getBoundingClientRect();
          return Array.from(canvas.querySelectorAll("text, rect"))
            .filter((el) => el.getBoundingClientRect().width > 0)
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.left < bounds.left - 1 || r.right > bounds.right + 1;
            })
            .map((el) => el.textContent || el.outerHTML);
        });
        expect(clipped, `slot ${slot}`).toEqual([]);
      }
    });
  }

  test("container resize reflows the same blocks without losing the current step", async ({ page }) => {
    await openStack(page);
    const svg = page.locator(`#${VIEW} .orc-svg`);
    await page.locator(part("range")).fill(slotOf(3));
    await page.locator(`#${VIEW}`).evaluate((el) => {
      el.style.width = "300px";
    });
    await expect(svg).toHaveAttribute("data-compact", "");
    await expect(page.locator(part("count"))).toHaveText("block 3 of 9");
    await expect(page.locator(`#${VIEW} .orc-mobile-hide`).first()).toBeHidden();
    await page.locator(`#${VIEW}`).evaluate((el) => {
      el.style.width = "";
    });
    await expect(svg).not.toHaveAttribute("data-compact", "");
    await expect(page.locator(part("count"))).toHaveText("block 3 of 9");
    await expect(page.locator(`#${VIEW} .orc-mobile-hide`).first()).toBeVisible();
  });
});
