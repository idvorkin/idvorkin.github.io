// ABOUTME: Verifies the orchestrator-stack include on the rendered /ai-orchestrator page.
// ABOUTME: Covers the stepper advancing the block diagram, the layer/column toggles, and phone-width layout.

import { type Page, expect, test } from "./base-test";

const WIDGET = "#orc-stack";
const SHOWN_BLOCKS = `${WIDGET} .orc-svg .orc-brick:not([hidden])`;

async function openStack(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto("/ai-orchestrator");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(WIDGET)).toBeVisible();
  // The script un-hides the bar, so this is also the "JS ran" gate.
  await expect(page.locator("#orc-next")).toBeVisible();
  await expect(page.locator(`${WIDGET} .orc-dot`)).toHaveCount(11);
}

test.describe("Orchestrator stack", () => {
  test("the stepper walks the stack one block at a time", async ({ page }) => {
    await openStack(page);

    // The finished stack is every block except the single-agent one it replaces.
    await expect(page.locator("#orc-count")).toHaveText("finished stack");
    await expect(page.locator(SHOWN_BLOCKS)).toHaveCount(19);
    await expect(page.locator("#orc-prev")).toBeDisabled();

    await page.locator("#orc-next").click();
    await expect(page.locator("#orc-count")).toHaveText("block 0 of 9");
    await expect(page.locator("#orc-step-title")).toHaveText("0. One agent in a terminal");
    await expect(page.locator(SHOWN_BLOCKS)).toHaveCount(2);

    await page.locator("#orc-next").click();
    await expect(page.locator("#orc-count")).toHaveText("block 1 of 9");
    await expect(page.locator("#orc-step-title")).toHaveText("1. It forgets");
    await expect(page.locator(SHOWN_BLOCKS)).toHaveCount(3);
    // The **bold** markers in the step data render as real elements, not literals.
    await expect(page.locator("#orc-solution b")).toHaveText("work ledger");
    await expect(page.locator("#orc-solution")).not.toContainText("**");

    await page.locator("#orc-prev").click();
    await expect(page.locator("#orc-count")).toHaveText("block 0 of 9");
    await expect(page.locator(SHOWN_BLOCKS)).toHaveCount(2);

    // The numbered dots jump straight to a step.
    await page.locator(`${WIDGET} .orc-dot`).nth(10).click();
    await expect(page.locator("#orc-count")).toHaveText("block 9 of 9");
    await expect(page.locator("#orc-next")).toBeDisabled();

    // And the All dot goes back to the finished stack.
    await page.locator(`${WIDGET} .orc-dot`).first().click();
    await expect(page.locator("#orc-count")).toHaveText("finished stack");
    await expect(page.locator(SHOWN_BLOCKS)).toHaveCount(19);
  });

  test("the drawing, the controls and the step text are one figure", async ({ page }) => {
    await openStack(page);

    // Controls, dots and step text live inside the single bordered figure.
    const figure = page.locator(`${WIDGET} .orc-figure`);
    await expect(figure).toHaveCount(1);
    for (const inner of [".orc-svg", "#orc-bar", "#orc-dots", "#orc-card"]) {
      await expect(figure.locator(inner)).toHaveCount(1);
    }

    // One width: the figure is as wide as the widget's content box.
    const [figureWidth, contentWidth] = await page.evaluate(() => {
      const widget = document.querySelector("#orc-stack") as HTMLElement;
      const fig = widget.querySelector(".orc-figure") as HTMLElement;
      const cs = getComputedStyle(widget);
      const inner =
        widget.getBoundingClientRect().width -
        Number.parseFloat(cs.paddingLeft) -
        Number.parseFloat(cs.paddingRight) -
        Number.parseFloat(cs.borderLeftWidth) -
        Number.parseFloat(cs.borderRightWidth);
      return [fig.getBoundingClientRect().width, inner];
    });
    expect(Math.abs(figureWidth - contentWidth)).toBeLessThanOrEqual(1);

    // The figure is white paper, nothing inside it wears the grey panel fill,
    // and the You pill is gone.
    const panels = await page.evaluate(() => {
      const fig = document.querySelector("#orc-stack .orc-figure") as HTMLElement;
      const panel = getComputedStyle(fig).getPropertyValue("--orc-panel").trim();
      const grey = panel === "#f2f4f6" ? "rgb(242, 244, 246)" : panel;
      const all = Array.from(fig.querySelectorAll<HTMLElement>("*")).concat(fig);
      return {
        figure: getComputedStyle(fig).backgroundColor,
        greyCount: all.filter((el) => getComputedStyle(el).backgroundColor === grey).length,
      };
    });
    expect(panels.figure).toBe("rgb(255, 255, 255)");
    expect(panels.greyCount).toBe(0);
    await expect(page.locator(`${WIDGET} .orc-you`)).toHaveCount(0);
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
    await page.locator("#orc-next").click();
    await expect(page.locator("#orc-count")).toHaveText("block 0 of 9");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // The diagram and the table scroll inside their own boxes instead.
    const canvasScrolls = await page.evaluate(() => {
      const el = document.querySelector("#orc-stack .orc-canvas") as HTMLElement | null;
      return !!el && el.scrollWidth > el.clientWidth;
    });
    expect(canvasScrolls).toBe(true);
  });
});
