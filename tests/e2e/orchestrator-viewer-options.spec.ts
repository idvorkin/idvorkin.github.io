// ABOUTME: Drives the orchestrator viewer on the pick-sheet page, in both controls placements.
// ABOUTME: Covers Back/Next/Play, the scrubber by pointer and keyboard, the fixed controls row, and reduced motion.

import { type Page, expect, test } from "./base-test";

const PAGE = "/test/orchestrator-viewer-options";
const LAST = 9;
const ALL_BLOCKS = 19; // every block except the single agent that step 2 replaces
const SHOWN = [2, 3, 6, 9, 12, 14, 15, 17, 18, 19];
const PLACEMENTS = [
  { id: "orc-top", order: ["orcv-bar", "orcv-story", "orcv-canvas"] },
  { id: "orc-between", order: ["orcv-story", "orcv-bar", "orcv-canvas"] },
];

const part = (id: string, name: string) => `#${id} [data-orc="${name}"]`;
const shown = (id: string) => `#${id} .orc-svg .orc-brick:not([hidden])`;

async function open(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto(PAGE);
  await page.waitForLoadState("networkidle");
  // The controller paints the story and measures the floor on DOMContentLoaded,
  // so a settled story is also the "JS ran" gate.
  for (const { id } of PLACEMENTS) {
    await expect(page.locator(part(id, "title"))).toHaveText("The whole stack");
    await expect(page.locator(`#${id} .orcv-story`)).not.toHaveAttribute("style", "min-height: 0px");
  }
}

// Walks the scrubber over every state and reports what the caller asked for.
async function overEveryState<T>(page: Page, id: string, read: () => Promise<T>): Promise<T[]> {
  const out: T[] = [];
  for (let v = 0; v <= LAST + 1; v++) {
    await page.locator(part(id, "range")).fill(String(v));
    await expect(page.locator(part(id, "title"))).toHaveText(v > LAST ? "The whole stack" : new RegExp(`^${v}\\. `));
    out.push(await read());
  }
  return out;
}

const barY = (page: Page, id: string) =>
  page.evaluate((i) => {
    const root = document.getElementById(i) as HTMLElement;
    const bar = root.querySelector(".orcv-bar") as HTMLElement;
    return Math.round(bar.getBoundingClientRect().top - root.getBoundingClientRect().top);
  }, id);

test.describe("Orchestrator viewer placements", () => {
  test("both placements render from one story and one drawing", async ({ page }) => {
    await open(page);

    await expect(page.locator("#orc-data")).toHaveCount(1);
    await expect(page.locator(".orcv .orc-svg")).toHaveCount(2);

    for (const { id, order } of PLACEMENTS) {
      await expect(page.locator(shown(id))).toHaveCount(ALL_BLOCKS);
      const actual = await page.evaluate((i) => {
        const fig = document.querySelector(`#${i} .orcv-fig`);
        return fig ? Array.from(fig.children).map((el) => el.className) : [];
      }, id);
      expect(actual).toEqual(order);
    }

    // No title block and no sub line in either.
    await expect(page.locator(".orcv .orc-title, .orcv .orc-sub")).toHaveCount(0);
  });

  for (const { id } of PLACEMENTS) {
    test(`${id}: the controls row never moves between states`, async ({ page }) => {
      await open(page);
      const ys = await overEveryState(page, id, () => barY(page, id));
      expect(ys).toHaveLength(LAST + 2);
      expect(new Set(ys).size).toBe(1);
    });

    test(`${id}: the scrubber walks every block`, async ({ page }) => {
      await open(page);
      const counts = await overEveryState(page, id, () => page.locator(shown(id)).count());
      expect(counts).toEqual([...SHOWN, ALL_BLOCKS]);
    });
  }

  test("Back and Next walk the story and stop at both ends", async ({ page }) => {
    await open(page);
    const id = "orc-top";
    const title = page.locator(part(id, "title"));
    const count = page.locator(part(id, "count"));
    const back = page.locator(part(id, "prev"));
    const next = page.locator(part(id, "next"));

    // The finished stack is the right-hand end: Next has nowhere to go.
    await expect(count).toHaveText("the whole stack");
    await expect(next).toBeDisabled();

    await back.click();
    await expect(title).toHaveText(`${LAST}. No one view of the whole`);
    await expect(next).toBeEnabled();

    await page.locator(part(id, "range")).fill("0");
    await expect(back).toBeDisabled();
    await expect(title).toHaveText("0. One agent in a terminal");

    await next.click();
    await expect(title).toHaveText("1. It forgets");
    await expect(back).toBeEnabled();
    await back.click();
    await expect(title).toHaveText("0. One agent in a terminal");

    // Next on the last step lands on the finished stack.
    await page.locator(part(id, "range")).fill(String(LAST));
    await next.click();
    await expect(title).toHaveText("The whole stack");
    await expect(count).toHaveText("the whole stack");
    await expect(next).toBeDisabled();
    await expect(page.locator(shown(id))).toHaveCount(ALL_BLOCKS);
  });

  test("the scrubber answers the keyboard", async ({ page }) => {
    await open(page);
    const id = "orc-between";
    const title = page.locator(part(id, "title"));
    const range = page.locator(part(id, "range"));

    await range.fill("5");
    await range.focus();
    await range.press("ArrowLeft");
    await expect(title).toHaveText("4. You cannot see them");
    await range.press("ArrowRight");
    await expect(title).toHaveText("5. Which agent? Who has quota?");
    await range.press("Home");
    await expect(title).toHaveText("0. One agent in a terminal");
    await range.press("End");
    await expect(title).toHaveText("The whole stack");
    // The slider tells a screen reader where it is, in words.
    await expect(range).toHaveAttribute("aria-valuetext", "The whole stack");
  });

  test("Play walks the story and Pause holds it", async ({ page }) => {
    await open(page);
    const id = "orc-top";
    const title = page.locator(part(id, "title"));
    const play = page.locator(part(id, "play"));

    await play.click();
    await expect(play).toHaveText("Pause");
    await expect(title).toHaveText(/^0\. /);
    await expect(title).toHaveText(/^1\. /, { timeout: 15000 });

    await play.click();
    await expect(play).toHaveText("Play");
    const held = (await title.textContent()) ?? "";
    await expect(title).toHaveText(held, { timeout: 5000 });

    // Touching the scrubber also takes control back.
    await play.click();
    await expect(play).toHaveText("Pause");
    await page.locator(part(id, "range")).fill("4");
    await expect(play).toHaveText("Play");
    await expect(title).toHaveText(/^4\. /);
  });

  test("reduced motion swaps the animation for an instant change", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);

    const range = page.locator(part("orc-top", "range"));
    await range.fill("0");
    await range.fill("1");

    const arrived = page.locator('#orc-top .orc-svg .orc-brick[data-from="1"]');
    await expect(arrived).toHaveCSS("animation-name", "none");
    await expect(arrived).not.toHaveClass(/orc-in/);
    await expect(arrived.locator("rect").last()).toHaveCSS("transition-duration", "0s");

    // The state still changes, it just does not move.
    await expect(page.locator(part("orc-top", "title"))).toHaveText(/^1\. /);
    await expect(page.locator(shown("orc-top"))).toHaveCount(SHOWN[1]);

    // With motion allowed the block animates in instead.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await range.fill("0");
    await range.fill("1");
    await expect(arrived).toHaveClass(/orc-in/);
    await expect(arrived).toHaveCSS("animation-name", "orc-drop");
  });

  test("at phone width the row wraps and the targets stay big", async ({ page }) => {
    await open(page, 390);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // Buttons and slider all clear a 40px touch target.
    const heights = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("#orc-top .orcv-btn, #orc-top .orcv-range")).map(
        (el) => el.getBoundingClientRect().height,
      ),
    );
    expect(heights).toHaveLength(4);
    for (const h of heights) expect(h).toBeGreaterThanOrEqual(40);

    // The slider drops to its own full-width line under the buttons.
    const layout = await page.evaluate(() => {
      const root = document.getElementById("orc-top") as HTMLElement;
      const bar = root.querySelector(".orcv-bar") as HTMLElement;
      const scrub = root.querySelector(".orcv-scrub") as HTMLElement;
      const play = root.querySelector('[data-orc="play"]') as HTMLElement;
      return {
        below: scrub.getBoundingClientRect().top >= play.getBoundingClientRect().bottom,
        fills: Math.round(scrub.getBoundingClientRect().width) >= Math.round(bar.clientWidth) - 1,
      };
    });
    expect(layout).toEqual({ below: true, fills: true });

    // And the controls still hold their place through the whole story.
    const ys = await overEveryState(page, "orc-between", () => barY(page, "orc-between"));
    expect(new Set(ys).size).toBe(1);
  });
});
