import { expect, test } from "@playwright/test";
import { checkForJsErrors } from "./js-error-checker";

test("404 page loads correctly", async ({ page }) => {
  // Navigate to a non-existent page to trigger 404
  await page.goto("/this-page-does-not-exist");

  // Check that we get the 404 page by looking for the title or unique content
  await expect(page).toHaveTitle(/PAGE NOT FOUND/);
  
  // Verify the monkey message appears
  await expect(page.locator("body")).toContainText("The Monkey has eaten the page you are looking for");
});

test("All links on 404 page work correctly", async ({ page }) => {
  // Navigate to 404 page
  await page.goto("/this-page-does-not-exist");

  // Test About link (get the one in the main content, not navigation)
  const aboutLink = page.getByRole('link', { name: 'About' });
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();
  await expect(page.locator("h1")).toContainText("Where am I?");
  
  // Go back to 404
  await page.goto("/another-non-existent-page");

  // Test Search link (home page)
  const searchLink = page.getByRole('link', { name: 'Search' });
  await expect(searchLink).toBeVisible();
  await searchLink.click();
  // Just check we're on the home page by looking for the search input or featured content
  await expect(page.locator("body")).toContainText("Featured");
  
  // Go back to 404
  await page.goto("/yet-another-missing-page");

  // Test Random post link
  const randomLink = page.getByRole('link', { name: 'Random post' });
  await expect(randomLink).toBeVisible();
  await randomLink.click();
  // Random page should redirect to some blog post, just check we're not on 404
  await expect(page).not.toHaveTitle(/PAGE NOT FOUND/);
  
  // Go back to 404
  await page.goto("/missing-page-for-toc-test");

  // Test Table of Contents link
  const tocLink = page.getByRole('link', { name: 'Table of Contents' });
  await expect(tocLink).toBeVisible();
  await tocLink.click();
  await expect(page.locator("body")).toContainText("Table of Contents");
  
  // Go back to 404
  await page.goto("/missing-page-for-all-test");

  // Test All posts link
  const allLink = page.getByRole('link', { name: 'All posts' });
  await expect(allLink).toBeVisible();
  await allLink.click();
  await expect(page.locator("h1")).toContainText("All Blog Posts");
  await expect(page.locator("body")).toContainText("This page lists all blog posts for link checking purposes");
});

test("404 page has no JavaScript errors", async ({ page }) => {
  await checkForJsErrors(page, "/this-page-definitely-does-not-exist");
});

test("404 page image loads correctly", async ({ page }) => {
  await page.goto("/non-existent-page");
  
  // Check that the monkey image is present
  const monkeyImage = page.locator('img[src*="pinimg.com"]');
  await expect(monkeyImage).toBeVisible();
  
  // Verify the image loads successfully (not broken)
  const response = await page.request.get(await monkeyImage.getAttribute('src') || '');
  expect(response.status()).toBe(200);
});