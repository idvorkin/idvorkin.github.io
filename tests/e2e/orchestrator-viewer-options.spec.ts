// ABOUTME: Drives the three orchestrator viewer variants on the pick-sheet test page.
// ABOUTME: Walks every step in each variant, exercises play/pause, and checks reduced motion.

import { type Page, expect, test } from "./base-test";

const PAGE = "/test/orchestrator-viewer-options";
const STEPS = 10;
const LAST = STEPS - 1;
const ALL_BLOCKS = 19; // every block except the single agent that step 2 replaces

// What the drawing shows at each step, finished state last.
const SHOWN = [2, 3, 6, 9, 12, 14, 15, 17, 18, 19];

const part = (id: string, name: string) => `#${id} [data-orc="${name}"]`;
const shown = (id: string) => `#${id} .orc-svg .orc-brick:not([hidden])`;

async function open(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto(PAGE);
  await page.waitForLoadState("networkidle");
  // The controller wires every instance on DOMContentLoaded, so a painted
  // story is also the "JS ran" gate.
  await expect(page.locator(part("orc-a", "title"))).toHaveText("The whole stack");
  await expect(page.locator(part("orc-b", "count"))).toHaveText("the whole stack");
  await expect(page.locator(part("orc-c", "status"))).toHaveText("The whole stack");
}

test.describe("Orchestrator viewer options", () => {
  test("one story and one drawing feed all three variants", async ({ page }) => {
    await open(page);

    // One data island, three drawings, no copy-pasted story.
    await expect(page.locator("#orc-data")).toHaveCount(1);
    await expect(page.locator(".orcv .orc-svg")).toHaveCount(3);
    for (const id of ["orc-a", "orc-b", "orc-c"]) {
      await expect(page.locator(shown(id))).toHaveCount(ALL_BLOCKS);
    }

    // The title block and the sub line are gone from all three.
    await expect(page.locator(".orcv .orc-title, .orcv .orc-sub")).toHaveCount(0);
  });

  test("A: the scrubber walks every block and play advances it", async ({ page }) => {
    await open(page);
    const range = page.locator(part("orc-a", "range"));
    const title = page.locator(part("orc-a", "title"));

    for (let i = 0; i <= LAST; i++) {
      await range.fill(String(i));
      await expect(title).toHaveText(new RegExp(`^${i}\\. `));
      await expect(page.locator(shown("orc-a"))).toHaveCount(SHOWN[i]);
      // The label under the thumb says the same thing the story does.
      await expect(page.locator(part("orc-a", "thumb"))).toHaveText((await title.textContent()) ?? "");
    }

    // The right-hand end of the track is the finished stack.
    await range.fill(String(STEPS));
    await expect(title).toHaveText("The whole stack");
    await expect(page.locator(shown("orc-a"))).toHaveCount(ALL_BLOCKS);

    // Play restarts at the top of the story and moves on by itself.
    const play = page.locator(part("orc-a", "play"));
    await play.click();
    await expect(play).toHaveText("Pause");
    await expect(title).toHaveText(/^0\. /);
    await expect(title).toHaveText(/^1\. /, { timeout: 15000 });

    // Pause stops it where it stands.
    await play.click();
    await expect(play).toHaveText("Play");
    const held = await title.textContent();
    await expect(title).toHaveText(held ?? "", { timeout: 5000 });
  });

  test("B: the drawing is the nav, by mouse and by keyboard", async ({ page }) => {
    await open(page);
    const title = page.locator(part("orc-b", "title"));
    const count = page.locator(part("orc-b", "count"));
    const all = page.locator(part("orc-b", "all"));

    for (let i = 0; i <= LAST; i++) {
      await all.click();
      await page.locator(`#orc-b .orc-svg .orc-brick[data-from="${i}"]:not([hidden])`).first().click();
      await expect(count).toHaveText(`block ${i} of ${LAST}`);
      await expect(title).toHaveText(new RegExp(`^${i}\\. `));
      await expect(page.locator(shown("orc-b"))).toHaveCount(SHOWN[i]);
    }

    // Every block is a real button for the keyboard too.
    const buttons = page.locator('#orc-b .orc-brick[role="button"][tabindex="0"]');
    await expect(buttons).toHaveCount(20);
    await all.click();
    const gate = page.locator('#orc-b .orc-brick[data-from="7"]:not([hidden])').first();
    await expect(gate).toHaveAttribute("aria-label", /Quality gate/);
    await gate.focus();
    await gate.press("Enter");
    await expect(count).toHaveText(`block 7 of ${LAST}`);

    // Play from the whole stack walks the story from the top, and any click
    // takes control back.
    const play = page.locator(part("orc-b", "play"));
    await all.click();
    await play.click();
    await expect(title).toHaveText(/^0\. /);
    await expect(play).toHaveText("Pause");
    await expect(title).toHaveText(/^1\. /, { timeout: 15000 });
    await all.click();
    await expect(play).toHaveText("Play the story");
    await expect(title).toHaveText("The whole stack");
  });

  test("C: the card in the middle of the screen owns the drawing", async ({ page }) => {
    await open(page);
    const status = page.locator(part("orc-c", "status"));

    await expect(page.locator("#orc-c .orcv-sticky")).toHaveCSS("position", "sticky");

    for (let i = 0; i <= LAST; i++) {
      const card = page.locator(`#orc-c .orcv-card[data-step="${i}"]`);
      await card.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(status).toHaveText(new RegExp(`^Block ${i}\\. `));
      await expect(page.locator(shown("orc-c"))).toHaveCount(SHOWN[i]);
      await expect(card).toHaveAttribute("data-orc-live", "true");
    }

    // The tail card exists and is reachable, so the story ends on the whole stack.
    const last = page.locator('#orc-c .orcv-card[data-step="-1"]');
    await last.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(status).toHaveText("The whole stack");
    await expect(page.locator(shown("orc-c"))).toHaveCount(ALL_BLOCKS);
  });

  test("reduced motion swaps the animation for an instant change", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);

    const range = page.locator(part("orc-a", "range"));
    await range.fill("0");
    await range.fill("1");

    const arrived = page.locator('#orc-a .orc-svg .orc-brick[data-from="1"]');
    await expect(arrived).toHaveCSS("animation-name", "none");
    await expect(arrived).not.toHaveClass(/orc-in/);
    await expect(arrived.locator("rect").last()).toHaveCSS("transition-duration", "0s");
    await expect(page.locator("#orc-c .orcv-card").first()).toHaveCSS("transition-duration", "0s");

    // The state still changes, it just does not move.
    await expect(page.locator(part("orc-a", "title"))).toHaveText(/^1\. /);
    await expect(page.locator(shown("orc-a"))).toHaveCount(SHOWN[1]);

    // With motion allowed the block animates in instead.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await range.fill("0");
    await range.fill("1");
    await expect(arrived).toHaveClass(/orc-in/);
    await expect(arrived).toHaveCSS("animation-name", "orc-drop");
  });

  test("no variant pushes the page sideways at phone width", async ({ page }) => {
    await open(page, 390);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // The drawing scrolls inside its own canvas in every variant.
    const canvases = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>(".orcv-canvas")).map((el) => el.scrollWidth > el.clientWidth),
    );
    expect(canvases).toEqual([true, true, true]);

    // And stepping still works with the column stacked.
    await page.locator(part("orc-a", "range")).fill("2");
    await expect(page.locator(part("orc-a", "title"))).toHaveText(/^2\. /);
  });
});
