// ABOUTME: Verifies the clickable body-figure opener on the rendered /physical-pain page.
// ABOUTME: Every region links to a real section, clicking jumps there, and it works by keyboard and at phone width.

import { type Page, expect, test } from "./base-test";

const MAP = "#pain-body-map";

// The regions the figure draws and the section each one jumps to.
const REGIONS: Record<string, string> = {
  shoulders: "shoulder-pain",
  back: "back-pain",
  hips: "rotation-for-stiffness",
  knees: "knee-pain",
  achilles: "the-tendon-problem-no-pain-until-its-too-late",
};

async function openPage(page: Page, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  // Off-site images are irrelevant here and can stall the load event; keep the
  // CDN stylesheets and scripts so the page is laid out as readers see it.
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => (route.request().resourceType() === "image" ? route.abort() : route.continue()),
  );
  await page.goto("/physical-pain");
  // summarize-page includes load after the first paint and shift the layout.
  await page.waitForLoadState("networkidle");
  await expect(page.locator(MAP)).toBeVisible();
}

for (const width of [1280, 390]) {
  test.describe(`Physical pain body map at ${width}px`, () => {
    test("draws one link per region, each pointing at a section on the page", async ({ page }) => {
      await openPage(page, width);
      const links = page.locator(`${MAP} a[data-region]`);
      await expect(links).toHaveCount(Object.keys(REGIONS).length);
      for (const [region, anchor] of Object.entries(REGIONS)) {
        const link = page.locator(`${MAP} a[data-region="${region}"]`);
        await expect(link).toHaveAttribute("href", `#${anchor}`);
        await expect(link).toHaveAttribute("aria-label", /.+/);
        await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
      }
    });

    test("clicking a region jumps to its section", async ({ page }) => {
      await openPage(page, width);
      for (const [region, anchor] of Object.entries(REGIONS)) {
        await page.locator(`${MAP} a[data-region="${region}"] .pm-label`).click();
        await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
        await expect(page.locator(`[id="${anchor}"]`)).toBeInViewport();
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    });

    test("tapping the drawn zone (not the label) also jumps", async ({ page }) => {
      await openPage(page, width);
      await page.locator(`${MAP} a[data-region="knees"] .pm-zone`).first().click();
      await expect(page).toHaveURL(/#knee-pain$/);
    });
  });
}

test("keyboard Tab reaches every region with a visible focus ring", async ({ page }) => {
  await openPage(page);
  // Step onto the map by keyboard so the browser is in keyboard-focus mode.
  await page.locator(`${MAP} a[data-region]`).first().focus();
  await page.keyboard.press("Shift+Tab");
  const order: string[] = [];
  for (let i = 0; i < Object.keys(REGIONS).length; i++) {
    await page.keyboard.press("Tab");
    const region = await page.evaluate(() => {
      const el = document.activeElement as Element | null;
      return el?.matches("#pain-body-map a[data-region]") ? el.getAttribute("data-region") : null;
    });
    expect(region).not.toBeNull();
    order.push(region ?? "");
    // Focus ring: the focused zone's outline thickens (after its short transition).
    await expect
      .poll(() =>
        page.evaluate((r) => {
          const zone = document.querySelector(`#pain-body-map a[data-region="${r}"] .pm-zone`) as SVGElement;
          return Number.parseFloat(getComputedStyle(zone).strokeWidth);
        }, region),
      )
      .toBeGreaterThanOrEqual(3);
  }
  expect(order.sort()).toEqual(Object.keys(REGIONS).sort());
  await page.locator(`${MAP} a[data-region="back"]`).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#back-pain$/);
});

test("the figure sits after the in-page table of contents and before the first section", async ({ page }) => {
  await openPage(page);
  const order = await page.evaluate(() => {
    const map = document.querySelector("#pain-body-map") as Element;
    const tocLinks = [...document.querySelectorAll('a[href="#great-books-for-across-the-board-improvements"]')];
    const inPageToc = tocLinks.find((a) => !a.closest("#right-sidebar"));
    const firstSection = document.getElementById("places-ive-had-pain") as Element;
    const follows = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return {
      afterToc: inPageToc ? follows(inPageToc, map) : false,
      beforeFirstSection: follows(map, firstSection),
    };
  });
  expect(order).toEqual({ afterToc: true, beforeFirstSection: true });
});

test("the figure contains no headings, so it stays out of the table of contents", async ({ page }) => {
  await openPage(page);
  await expect(page.locator(`${MAP} h1, ${MAP} h2, ${MAP} h3, ${MAP} h4`)).toHaveCount(0);
});
