import { Page, expect } from "@playwright/test";

/**
 * Helper function to check for JavaScript errors on a page
 * @param page The Playwright page instance
 * @param path The path to navigate to (will be appended to baseURL)
 *
 * NOTE: Always use headless browser when running tests (the default).
 * Do NOT use the --debug flag which launches a non-headless browser.
 */
export async function checkForJsErrors(
  page: Page,
  path: string
): Promise<void> {
  // Store all page errors for reporting
  const allErrors: string[] = [];

  // Store only critical errors that will fail the test
  const criticalErrors: string[] = [];

  // Define error patterns to treat as warnings (non-critical errors)
  // These errors will be logged but won't fail the test
  // Note: We've fixed most of these errors with proper null checks,
  // but we're keeping the patterns to ensure tests don't break
  // if some edge cases are still present
  const warningPatterns = [
    /ResizeObserver loop limit exceeded/,
    /ResizeObserver loop completed with undelivered notifications/,
    /Script error/,
  ];

  // Listen for JavaScript errors
  page.on("pageerror", error => {
    // Store all errors for logging
    allErrors.push(error.message);

    // Check if this is a warning or critical error
    const isWarning = warningPatterns.some(pattern =>
      pattern.test(error.message)
    );

    if (!isWarning) {
      criticalErrors.push(error.message);
    }
  });

  // Navigate to the page
  await page.goto(path);

  // Wait for any potential errors to surface
  await page.waitForTimeout(1000);

  // Log all errors as warnings
  if (allErrors.length > 0) {
    console.warn(`JavaScript warnings on ${path}:`, allErrors.join(", "));
  }

  // Only fail the test for critical errors
  expect(
    criticalErrors,
    `Critical JavaScript errors found on ${path}: ${criticalErrors.join(", ")}`
  ).toEqual([]);
}
