// ABOUTME: Real-browser check of the annotate composer's Enter-Enter save: two quick Enters at the end save
// ABOUTME: the trimmed note with its intent; slow, mid-text and empty-note Enters stay line breaks.

import { type Page, expect, test } from "./base-test";

const POST = "/eulogy?annotate=1";

type Note = { comment: string; intent: string };

async function notes(page: Page): Promise<Note[]> {
  return page.evaluate(() => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]"));
}

async function openComposer(page: Page): Promise<void> {
  await page.evaluate(() => {
    const p = document.querySelector("#content-holder p") as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(p);
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(range);
    document.dispatchEvent(new MouseEvent("mouseup"));
  });
  await page.locator("#blog-annot-btn").click();
  await expect(page.locator("#blog-annot-text")).toBeFocused();
}

test.describe("annotate composer Enter-Enter save", () => {
  test.beforeEach(async ({ page }) => {
    // Never reach the Cockpit or GitHub from a test: no real batch goes to Larry.
    await page.route("**/larry/**", (r) => r.fulfill({ status: 503, body: "" }));
    await page.route("**/blog-review**", (r) => r.fulfill({ status: 503, body: "" }));
    await page.route("https://api.github.com/**", (r) => r.abort());
    await page.goto(POST);
    await page.evaluate(() => localStorage.setItem("blogAnnotateBuffer", "[]"));
    await openComposer(page);
  });

  test("two quick Enters at the end save the trimmed note with the chosen intent", async ({ page }) => {
    await page.locator('#blog-annot-intents button[data-intent="cut"]').click();
    await page.keyboard.type("too wordy");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.locator("#blog-annot-modal")).toBeHidden();
    expect(await notes(page)).toEqual([expect.objectContaining({ comment: "too wordy", intent: "cut" })]);
    await expect(page.locator("#blog-annot-count")).toHaveText("Review (1)");
  });

  test("slow Enters stay line breaks", async ({ page }) => {
    await page.keyboard.type("line one");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(600);
    await page.keyboard.press("Enter");
    await expect(page.locator("#blog-annot-text")).toHaveValue("line one\n\n");
    await expect(page.locator("#blog-annot-modal")).toBeVisible();
    expect(await notes(page)).toEqual([]);
  });

  test("quick Enters mid-text stay line breaks", async ({ page }) => {
    await page.keyboard.type("first second");
    await page.locator("#blog-annot-text").evaluate((el) => (el as HTMLTextAreaElement).setSelectionRange(5, 5));
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.locator("#blog-annot-text")).toHaveValue("first\n\n second");
    await expect(page.locator("#blog-annot-modal")).toBeVisible();
    expect(await notes(page)).toEqual([]);
  });

  test("an empty note never saves", async ({ page }) => {
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await expect(page.locator("#blog-annot-modal")).toBeVisible();
    expect(await notes(page)).toEqual([]);
  });
});
