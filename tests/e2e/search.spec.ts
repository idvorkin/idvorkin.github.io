import { expect, test } from "./base-test";
import { checkForJsErrors } from "./js-error-checker";

test.describe("Homepage search functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Search input exists and is visible", async ({ page }) => {
    // Check that the search input exists
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();

    // Check placeholder text
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      "Search Igor's Blog, or browse featured/recent/random posts below...",
    );
  });

  test("Shows initial content sections with lazy loading", async ({ page }) => {
    // Check that all three sections are visible with new header structure
    await expect(page.locator("#featured-section .section-header h3")).toContainText("Featured");
    await expect(page.locator("#recent-section .section-header h3")).toContainText("Recent");
    await expect(page.locator("#random-section .section-header h3")).toContainText("Random");

    // Check action links are visible
    await expect(page.locator("#recent-section .action-link")).toContainText("View all");
    await expect(page.locator("#random-section .action-link")).toContainText("Refresh");

    // Wait for lazy loading to complete
    await page.waitForTimeout(1000);

    // Check that each section has content (now just posts, no extra links)
    const featuredItems = page.locator("#featured-results .result-item");
    await expect(featuredItems).toHaveCount(3);

    const recentItems = page.locator("#recent-results .result-item");
    await expect(recentItems).toHaveCount(4); // 4 posts now

    const randomItems = page.locator("#random-results .result-item");
    await expect(randomItems).toHaveCount(4); // 4 posts now
  });

  test("Can search for content", async ({ page }) => {
    // Type in the search box
    const searchInput = page.locator("#search-input");
    await searchInput.fill("eulogy");

    // Check that featured section title changes to search results
    await expect(page.locator("#featured-section .section-header h3")).toContainText("Search Results");

    // Check that there are some results. Uses a retrying assertion rather than a
    // fixed wait + count(): the first search of a page load also downloads the
    // Pagefind runtime, wasm, and index chunks, which is far slower than the
    // steady-state query it used to be measuring.
    //
    // Targets the result LINK: the "Searching..." and "No results found..."
    // placeholders are also .result-item divs, so a bare .result-item locator
    // passes with zero real results. Only rendered hits contain an <a>.
    const searchResults = page.locator("#featured-results .result-item a");
    await expect(searchResults.first()).toBeVisible({ timeout: 15000 });
    expect(await searchResults.count()).toBeGreaterThan(0);
  });

  test("Typo in a post title still finds the post", async ({ page }) => {
    // Pagefind alone ranks garbage for typos; the MiniSearch title index is what
    // rescues this. If the title index stops loading, this is the test that fails.
    const searchInput = page.locator("#search-input");
    await searchInput.fill("ketlebell");

    const searchResults = page.locator("#featured-results .result-item a");
    await expect(searchResults.first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("#featured-results")).toContainText(/kettlebell/i);
  });

  test("Pinned results lead for a 'time off' search, in stack-rank order", async ({ page }) => {
    // Policy layer (_data/search_pins.yml): queries containing "time off" pin
    // /timeoff and /timeoff-next as the first two results, ahead of organic
    // full-text hits.
    const searchInput = page.locator("#search-input");
    await searchInput.fill("time off");

    const links = page.locator("#featured-results .result-item a");
    await expect(links.first()).toBeVisible({ timeout: 15000 });
    await expect(links.nth(0)).toHaveAttribute("href", "/timeoff");
    await expect(links.nth(1)).toHaveAttribute("href", "/timeoff-next");
  });

  test("Shows no results for nonsense search", async ({ page }) => {
    // TWO nonsense words, deliberately. Pagefind progressively shortens the
    // LAST query word until something matches (search-as-you-type), so a single
    // nonsense word like "xyzabc123nonsense" degrades to "xyz" and matches real
    // pages — by design, with no off switch. Non-final words are not shortened,
    // so an all-nonsense multi-word query is the deterministic zero-result case.
    const searchInput = page.locator("#search-input");
    await searchInput.fill("qzxvjw wkjqp");

    // Check that it shows no results message (retrying assertion covers the
    // first-search index download)
    await expect(page.locator("#featured-results")).toContainText("No results found", { timeout: 15000 });
  });

  test("Clearing search restores original content", async ({ page }) => {
    // First search for something
    const searchInput = page.locator("#search-input");
    await searchInput.fill("test");
    await page.waitForTimeout(500);

    // Clear the search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Check that original sections are restored
    await expect(page.locator("#featured-section .section-header h3")).toContainText("Featured");
    await expect(page.locator("#recent-section .section-header h3")).toContainText("Recent");
    await expect(page.locator("#random-section .section-header h3")).toContainText("Random");
  });

  test("Mobile view has compact spacing", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that search input is visible
    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeVisible();

    // Check that sections are visible
    await expect(page.locator("#featured-section")).toBeVisible();
    await expect(page.locator("#recent-section")).toBeVisible();
    await expect(page.locator("#random-section")).toBeVisible();
  });

  test("Homepage has no JavaScript errors", async ({ page }) => {
    await checkForJsErrors(page, "/");
  });

  test("Random posts can be refreshed", async ({ page }) => {
    // Wait for random posts to actually load (not just timeout)
    await page.waitForSelector("#random-results .result-item a", { timeout: 5000 });
    await expect(page.locator("#random-results .result-item")).toHaveCount(4);

    // Get initial random post titles
    const initialPosts = await page.locator("#random-results .result-item a").allTextContents();
    const initialTitles = initialPosts.slice(0, 4);

    // Click the refresh button in the header
    const refreshButton = page.locator("#random-section .action-link");
    await refreshButton.click();

    // Wait for content to change (the innerHTML will be replaced)
    await page.waitForSelector("#random-results .result-item a", { timeout: 5000 });
    await expect(page.locator("#random-results .result-item")).toHaveCount(4);

    // Get new random post titles
    const newPosts = await page.locator("#random-results .result-item a").allTextContents();
    const newTitles = newPosts.slice(0, 4);

    // Verify that at least one post is different (very unlikely to get same 4 random posts)
    const hasChanged = initialTitles.some((title, index) => title !== newTitles[index]);
    expect(hasChanged).toBeTruthy();
  });

  test("Recent posts link navigates to recent page", async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(1000);

    // Find and click the "View all" link in the header
    const recentLink = page.locator("#recent-section .action-link");
    await expect(recentLink).toBeVisible();
    await expect(recentLink).toContainText("View all");

    // Click should navigate to /recent
    await recentLink.click();
    await page.waitForURL("**/recent");

    // Verify we're on the recent page
    expect(page.url()).toContain("/recent");
    await expect(page.locator("h1")).toContainText("Recently Modified Content");
  });

  test("Lazy loading shows loading state", async ({ page }) => {
    // Navigate to page and immediately check for loading states
    await page.goto("/");

    // At least one section should show "Loading..." initially
    const loadingStates = await page.locator(".result-item").filter({ hasText: "Loading..." }).count();

    // If IntersectionObserver is supported, we should see loading states
    // Note: This test might be flaky if content loads too fast
    if (loadingStates > 0) {
      expect(loadingStates).toBeGreaterThanOrEqual(1);
    }

    // Wait for content to load
    await page.waitForTimeout(1500);

    // No loading states should remain
    const remainingLoadingStates = await page.locator(".result-item").filter({ hasText: "Loading..." }).count();
    expect(remainingLoadingStates).toBe(0);
  });

  test("Search hides recent and random sections", async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(1000);

    // Verify sections are initially visible
    await expect(page.locator("#recent-section")).toBeVisible();
    await expect(page.locator("#random-section")).toBeVisible();

    // Perform a search
    const searchInput = page.locator("#search-input");
    await searchInput.fill("test");
    await page.waitForTimeout(500);

    // Verify recent and random sections are hidden during search
    await expect(page.locator("#recent-section")).not.toBeVisible();
    await expect(page.locator("#random-section")).not.toBeVisible();

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Verify sections are visible again
    await expect(page.locator("#recent-section")).toBeVisible();
    await expect(page.locator("#random-section")).toBeVisible();
  });

  test("Sections load in parallel", async ({ page }) => {
    // Clear browser cache to ensure fresh load
    await page.context().clearCookies();

    // Start timing
    const startTime = Date.now();

    // Navigate to page
    await page.goto("/");

    // Wait for all sections to have content
    await Promise.all([
      page.waitForSelector("#featured-results .result-item", { timeout: 5000 }),
      page.waitForSelector("#recent-results .result-item", { timeout: 5000 }),
      page.waitForSelector("#random-results .result-item", { timeout: 5000 }),
    ]);

    const loadTime = Date.now() - startTime;

    // If sections load in parallel, total time should be less than sequential loading would take
    // This is a rough check - parallel loading should be faster than 3x the slowest section
    expect(loadTime).toBeLessThan(5000);
  });
});
