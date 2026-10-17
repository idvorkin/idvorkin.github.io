import { expect, test } from "./base-test";

/**
 * The sunburst on /todo_enjoy is a navigation control, not just a chart:
 * clicking a leaf segment (a "final target" like Physical) must scroll the
 * page to that section's heading. Parent segments keep Plotly's zoom-in-place
 * behavior — covered by todo-enjoy.spec.ts — and must NOT scroll away.
 *
 * Deep links (/todo_enjoy#physical) must also land on their heading even
 * though content above it (the sunburst itself, the randomizer blocks) grows
 * after the browser's initial fragment jump.
 */

// How far from the viewport top the heading may sit and still count as
// "landed". Covers sub-pixel rounding and heading margins collapsing.
const HEADING_TOLERANCE_PX = 40;

/** Absolute distance of a heading from the viewport top. */
const headingDistance = (page, id: string) =>
  page.evaluate((headingId) => {
    const el = document.getElementById(headingId);
    return el ? Math.abs(Math.round(el.getBoundingClientRect().top)) : Number.MAX_SAFE_INTEGER;
  }, id);

const waitForSunburst = async (page) => {
  await page.waitForFunction(() => {
    const sunburst = document.getElementById("sunburst");
    return sunburst && (sunburst as any).data;
  });
  // Click handlers attach after the plot renders
  await page.waitForTimeout(500);
};

test.describe("Sunburst scroll navigation", () => {
  test("Clicking a leaf segment scrolls its section heading to the top", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await waitForSunburst(page);

    // Zoom into Health so the Physical leaf is visible
    await page.locator('#sunburst text:has-text("Health")').first().click({ force: true });
    await expect(page.locator(".sunburst text").first()).toContainText("Health");

    // Click the final target
    await page.locator('#sunburst text:has-text("Physical")').first().click({ force: true });

    // Smooth scroll takes a moment — poll until the heading settles at the top
    await expect
      .poll(() => headingDistance(page, "physical"), { timeout: 5000 })
      .toBeLessThanOrEqual(HEADING_TOLERANCE_PX);

    // The URL records where the click navigated to
    expect(page.url()).toContain("#physical");
  });

  test("Clicking a parent segment zooms without scrolling away", async ({ page }) => {
    await page.goto("/todo_enjoy");
    await waitForSunburst(page);

    await page.locator('#sunburst text:has-text("Health")').first().click({ force: true });
    await expect(page.locator(".sunburst text").first()).toContainText("Health");

    // Zooming happens in place — the page must not scroll
    await page.waitForTimeout(1000);
    const scrollY = await page.evaluate(() => Math.round(window.scrollY));
    expect(scrollY).toBe(0);
  });

  test("Deep link lands on its heading after the page settles", async ({ page }) => {
    await page.goto("/todo_enjoy#physical");
    await page.waitForLoadState("load");

    // Content above the heading (sunburst, randomizer blocks) keeps growing
    // for a while after load; the scroll correction settles within 2.5s of it.
    await page.waitForTimeout(3500);

    expect(await headingDistance(page, "physical")).toBeLessThanOrEqual(HEADING_TOLERANCE_PX);
  });

  test("Deep link to a second anchor also lands on its heading", async ({ page }) => {
    await page.goto("/todo_enjoy#emotional");
    await page.waitForLoadState("load");
    await page.waitForTimeout(3500);

    expect(await headingDistance(page, "emotional")).toBeLessThanOrEqual(HEADING_TOLERANCE_PX);
  });
});
