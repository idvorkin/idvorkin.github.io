import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "./base-test";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("GitHub source links are visible and functional", async ({ page }) => {
  await page.goto("/all/");

  // Check that GitHub links exist
  const githubLinks = page.locator(".github-link");
  const linkCount = await githubLinks.count();

  // Should have at least some GitHub links (assuming there are posts/pages)
  expect(linkCount).toBeGreaterThan(0);

  // Test the first few GitHub links
  const linksToTest = Math.min(3, linkCount);

  for (let i = 0; i < linksToTest; i++) {
    const link = githubLinks.nth(i);

    // Check that the link is visible
    await expect(link).toBeVisible();

    // Check that the link has the correct href pattern
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^https:\/\/github\.com\/idvorkin\/idvorkin\.github\.io\/blob\/main\/.+$/);

    // Check that the link opens in a new tab
    const target = await link.getAttribute("target");
    expect(target).toBe("_blank");

    // Check that the link has the GitHub icon
    const icon = link.locator("i.fab.fa-github");
    await expect(icon).toBeVisible();
  }
});

test("GitHub links point to valid repository paths", async ({ page }) => {
  await page.goto("/all/");

  // Get the first GitHub link to test
  const firstGithubLink = page.locator(".github-link").first();
  await expect(firstGithubLink).toBeVisible();

  const href = await firstGithubLink.getAttribute("href");
  expect(href).toBeTruthy();

  // Extract the file path from the GitHub URL
  const pathMatch = href?.match(/\/blob\/main\/(.+)$/);
  expect(pathMatch).toBeTruthy();

  if (pathMatch) {
    const filePath = pathMatch[1];

    // The file path should have a valid extension
    expect(filePath).toMatch(/\.(md|html)$/);
  }

  // Every link must name a file that exists in this checkout: the link points
  // at main, and this tree is what main will be. This used to HEAD github.com
  // and accept 200 or 404, which checked nothing and failed whenever GitHub
  // answered 429 to a busy test run.
  const hrefs = await page.locator(".github-link").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(0);
  const missing = hrefs
    .map((h) => h?.match(/\/blob\/main\/(.+)$/)?.[1])
    .filter((rel) => !rel || !fs.existsSync(path.join(REPO_ROOT, decodeURIComponent(rel))));
  expect(missing).toEqual([]);
});

test("GitHub links are grouped correctly by collection", async ({ page }) => {
  await page.goto("/all/");

  // Check that each section has GitHub links for its items
  const sections = [
    { heading: "Posts", selector: "h2:has-text('Posts')" },
    { heading: "Pages", selector: "h2:has-text('Pages')" },
    { heading: "D Collection", selector: "h2:has-text('D Collection')" },
    { heading: "IG66 Collection", selector: "h2:has-text('IG66 Collection')" },
    { heading: "TD Collection", selector: "h2:has-text('TD Collection')" },
  ];

  for (const section of sections) {
    const sectionHeading = page.locator(section.selector);

    // Check if this section exists (some collections might be empty)
    if ((await sectionHeading.count()) > 0) {
      // Find the ul that follows this heading
      const sectionList = sectionHeading.locator("+ ul");

      if ((await sectionList.count()) > 0) {
        // Check if there are any items in this section
        const listItems = sectionList.locator("li");
        const itemCount = await listItems.count();

        if (itemCount > 0) {
          // Each item should have a GitHub link
          const githubLinksInSection = sectionList.locator(".github-link");
          const githubLinkCount = await githubLinksInSection.count();

          // Should have at least one GitHub link in this section
          expect(githubLinkCount).toBeGreaterThan(0);
          expect(githubLinkCount).toBeLessThanOrEqual(itemCount);
        }
      }
    }
  }
});

test("GitHub link styling is correct", async ({ page }) => {
  await page.goto("/all/");

  const firstGithubLink = page.locator(".github-link").first();
  await expect(firstGithubLink).toBeVisible();

  // Check CSS styling
  await expect(firstGithubLink).toHaveCSS("color", "rgb(102, 102, 102)"); // #666
  await expect(firstGithubLink).toHaveCSS("text-decoration-line", "none");
  await expect(firstGithubLink).toHaveCSS("margin-left", "10px");
});
