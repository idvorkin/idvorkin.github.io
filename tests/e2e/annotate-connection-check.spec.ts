// ABOUTME: Real-browser check of the pill's Connection check off the tailnet: every step listed with a Cockpit
// ABOUTME: that answers, and a network failure with Send off for a bogus saved origin (the Cockpit is mocked).

import { type Page, expect, test } from "./base-test";

const POST = "/eulogy";
const SAVED = "https://cockpit.example-tail.ts.net";

// A host that is neither localhost nor a tailnet name, so the saved address is the one checked.
function liveLikeUrl(baseURL: string | undefined, path: string): string {
  return new URL(path, (baseURL || "http://localhost:4000").replace("localhost", "127.0.0.1")).toString();
}

async function openWithSaved(page: Page, baseURL: string | undefined, saved: string) {
  await page.route("https://api.github.com/**", (r) => r.abort());
  await page.goto(liveLikeUrl(baseURL, POST));
  await page.evaluate((origin) => localStorage.setItem("blogLarryCockpit", origin), saved);
  await page.goto(liveLikeUrl(baseURL, `${POST}?annotate=1`));
}

test.describe("annotate connection check", () => {
  test("lists each step as passing when the saved Cockpit answers", async ({ page, baseURL }) => {
    await page.route(`${SAVED}/larry/status`, (r) =>
      r.fulfill({ json: { ok: true, state: "idle" }, headers: { "Access-Control-Allow-Origin": "*" } }),
    );
    await page.route(`${SAVED}/page-chat**`, (r) =>
      r.fulfill({
        json: { ok: true, thread: null, messages: [] },
        headers: { "Access-Control-Allow-Origin": "*" },
      }),
    );
    await openWithSaved(page, baseURL, SAVED);
    await page.locator("#blog-annot-check").click();
    const lines = page.locator("#blog-annot-check-list li");
    await expect(lines).toHaveCount(6);
    await expect(lines.nth(0)).toHaveText(`✓ Cockpit address: saved: ${SAVED}`);
    await expect(lines.nth(1)).toContainText("✓ Cockpit status: HTTP 200");
    await expect(lines.nth(2)).toContainText("no thread for this page yet");
    await expect(page.locator("#blog-annot-check-send")).toBeEnabled();
  });

  test("a bogus saved origin shows the network failure and keeps Send off", async ({ page, baseURL }) => {
    const bogus = "https://nobody.bogus-tail.ts.net";
    await page.route(`${bogus}/**`, (r) => r.abort("namenotresolved"));
    await openWithSaved(page, baseURL, bogus);
    await page.locator("#blog-annot-check").click();
    const lines = page.locator("#blog-annot-check-list li");
    await expect(lines).toHaveCount(6);
    await expect(lines.nth(1)).toHaveAttribute("data-status", "fail");
    await expect(lines.nth(1)).toContainText("network error");
    await expect(lines.nth(2)).toContainText("skipped");
    await expect(page.locator("#blog-annot-check-send")).toBeDisabled();
    await expect(page.locator("#blog-annot-check-copy")).toBeEnabled();
  });
});
