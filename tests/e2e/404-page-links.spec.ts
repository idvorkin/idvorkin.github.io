import { type Page, expect, test } from "./base-test";

// One test per link: five navigations in one 30 s budget timed out on a busy
// machine, and a failure now names the link that broke.
const links: { name: string; from: string; landed: (page: Page) => Promise<void> }[] = [
  {
    name: "About",
    from: "/this-page-does-not-exist",
    landed: async (page) => {
      await expect(page.locator("h1")).toContainText("Where am I?");
    },
  },
  {
    name: "Search",
    from: "/another-non-existent-page",
    // Just check we're on the home page by looking for the featured content
    landed: async (page) => {
      await expect(page.locator("body")).toContainText("Featured");
    },
  },
  {
    name: "Random post",
    from: "/yet-another-missing-page",
    // Random page should redirect to some blog post, just check we're not on 404
    landed: async (page) => {
      await page.waitForURL((url) => url.pathname !== "/random");
      await expect(page).not.toHaveTitle(/PAGE NOT FOUND/);
    },
  },
  {
    name: "Table of Contents",
    from: "/missing-page-for-toc-test",
    landed: async (page) => {
      await expect(page.locator("body")).toContainText("Table of Contents");
    },
  },
  {
    name: "All posts",
    from: "/missing-page-for-all-test",
    landed: async (page) => {
      await expect(page.locator("h1")).toContainText("All Blog Posts");
      await expect(page.locator("body")).toContainText("This page lists all blog posts for link checking purposes");
    },
  },
];

for (const link of links) {
  test(`404 page link "${link.name}" works`, async ({ page }) => {
    // The links are static HTML, so don't wait for "load": that waits on the
    // monkey picture from i.pinimg.com, which has its own test below.
    await page.goto(link.from, { waitUntil: "domcontentloaded" });

    // Look inside the page body only: the header also carries a "Random post"
    // dice link (b3bb3e726), so an unscoped lookup matches twice.
    const target = page.locator("#content-holder").getByRole("link", { name: link.name });
    await expect(target).toBeVisible();
    await target.click();
    await link.landed(page);
  });
}

test("404 page image loads correctly", async ({ page }) => {
  await page.goto("/non-existent-page");

  // Check that the monkey image is present
  const monkeyImage = page.locator('img[src*="pinimg.com"]');
  await expect(monkeyImage).toBeVisible();

  // Verify the image loads successfully (not broken)
  const response = await page.request.get((await monkeyImage.getAttribute("src")) || "");
  expect(response.status()).toBe(200);
});
