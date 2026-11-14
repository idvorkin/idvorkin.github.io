// ABOUTME: Real-browser check of double-click in the annotate tool: inside the selection it opens the note box for
// ABOUTME: that selection, on a saved note it opens the note to edit, elsewhere it keeps the browser's word select.

import { type Page, expect, test } from "./base-test";

type Note = { quote: string; comment: string; intent: string };
type Point = { x: number; y: number };

async function notes(page: Page): Promise<Note[]> {
  return page.evaluate(() => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]"));
}

// The nth paragraph of the article whose first child is a long plain text node, so word offsets are stable.
const PARA = `(n) => Array.from(document.querySelectorAll("#content-holder p")).filter((p) => p.firstChild && p.firstChild.nodeType === 3 && p.firstChild.textContent.trim().length > 60)[n]`;

async function selectParagraph(page: Page, n: number): Promise<string> {
  return page.evaluate(
    ({ n, para }) => {
      const p = new Function(`return ${para}`)()(n) as HTMLElement;
      const range = document.createRange();
      range.selectNodeContents(p.firstChild as Node);
      const sel = window.getSelection() as Selection;
      sel.removeAllRanges();
      sel.addRange(range);
      document.dispatchEvent(new MouseEvent("mouseup"));
      return range.toString();
    },
    { n, para: PARA },
  );
}

// Center of the third word of paragraph n, in viewport coordinates.
async function wordPoint(page: Page, n: number): Promise<Point> {
  return page.evaluate(
    ({ n, para }) => {
      const p = new Function(`return ${para}`)()(n) as HTMLElement;
      p.scrollIntoView({ block: "center" });
      const text = p.firstChild as Text;
      const m = /^\s*\S+\s+\S+\s+(\w+)/.exec(text.data) as RegExpExecArray;
      const start = m.index + m[0].length - m[1].length;
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, start + m[1].length);
      const r = range.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    { n, para: PARA },
  );
}

test.describe("annotate double-click", () => {
  test.beforeEach(async ({ page }) => {
    // Never reach the Cockpit or GitHub from a test: no real batch goes to Larry.
    await page.route("**/larry/**", (r) => r.fulfill({ status: 503, body: "" }));
    await page.route("**/blog-review**", (r) => r.fulfill({ status: 503, body: "" }));
    await page.route("https://api.github.com/**", (r) => r.abort());
    await page.goto("/eulogy?annotate=1");
    await page.evaluate(() => localStorage.setItem("blogAnnotateBuffer", "[]"));
  });

  test("inside the selection opens the note box for the whole selection", async ({ page }) => {
    const at = await wordPoint(page, 0);
    const quote = await selectParagraph(page, 0);
    await expect(page.locator("#blog-annot-btn")).toBeVisible();
    await page.mouse.dblclick(at.x, at.y);
    await expect(page.locator("#blog-annot-text")).toBeFocused();
    await expect(page.locator("#blog-annot-card blockquote")).toHaveText(quote);
    await expect(page.locator("#blog-annot-btn")).toBeHidden();
    await page.keyboard.type("tighten");
    await page.keyboard.press("Control+Enter");
    expect(await notes(page)).toEqual([expect.objectContaining({ quote, comment: "tighten", intent: "note" })]);
  });

  test("a single click inside the selection does not open it", async ({ page }) => {
    const at = await wordPoint(page, 0);
    await selectParagraph(page, 0);
    await expect(page.locator("#blog-annot-btn")).toBeVisible();
    await page.mouse.click(at.x, at.y);
    await page.waitForTimeout(600);
    await expect(page.locator("#blog-annot-modal")).toBeHidden();
  });

  test("outside the selection it selects a word as usual", async ({ page }) => {
    const p1 = await wordPoint(page, 1);
    await selectParagraph(page, 0);
    await expect(page.locator("#blog-annot-btn")).toBeVisible();
    await page.mouse.dblclick(p1.x, p1.y);
    await expect(page.locator("#blog-annot-btn")).toBeVisible();
    await expect(page.locator("#blog-annot-modal")).toBeHidden();
    const word = await page.evaluate(() => String(window.getSelection()));
    expect(word.trim().split(/\s+/)).toHaveLength(1);
    await page.locator("#blog-annot-btn").click();
    await expect(page.locator("#blog-annot-card blockquote")).toHaveText(word);
  });

  test("with no selection it selects a word, not the last dismissed selection", async ({ page }) => {
    const at = await wordPoint(page, 0);
    await selectParagraph(page, 0);
    await expect(page.locator("#blog-annot-btn")).toBeVisible();
    await page.evaluate(() => (window.getSelection() as Selection).removeAllRanges());
    await expect(page.locator("#blog-annot-btn")).toBeHidden();
    await page.mouse.dblclick(at.x, at.y);
    await expect(page.locator("#blog-annot-modal")).toBeHidden();
    const word = await page.evaluate(() => String(window.getSelection()));
    expect(word.trim().split(/\s+/)).toHaveLength(1);
    await page.locator("#blog-annot-btn").click();
    await expect(page.locator("#blog-annot-card blockquote")).toHaveText(word);
  });

  test("on a saved note it opens that note to edit, and Save replaces it", async ({ page }) => {
    const at = await wordPoint(page, 0);
    const quote = await selectParagraph(page, 0);
    await page.locator("#blog-annot-btn").click();
    await page.locator('#blog-annot-intents button[data-intent="cut"]').click();
    await page.keyboard.type("too long");
    await page.keyboard.press("Control+Enter");
    await expect(page.locator("#blog-annot-modal")).toBeHidden();

    await page.waitForTimeout(600);
    await page.mouse.dblclick(at.x, at.y);
    await expect(page.locator("#blog-annot-text")).toHaveValue("too long");
    await expect(page.locator("#blog-annot-text")).toBeFocused();
    await expect(page.locator('#blog-annot-intents button[data-intent="cut"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#blog-annot-card .hint")).toContainText("Editing saved note");
    await page.keyboard.type(", cut the middle");
    await page.keyboard.press("Control+Enter");
    expect(await notes(page)).toEqual([
      expect.objectContaining({ quote, comment: "too long, cut the middle", intent: "cut" }),
    ]);
    await expect(page.locator("#blog-annot-count")).toHaveText("Review (1)");
  });

  test("readers get nothing", async ({ page }) => {
    await page.goto("/eulogy?annotate=0");
    const at = await wordPoint(page, 0);
    await page.mouse.dblclick(at.x, at.y);
    await expect(page.locator("#blog-annot-modal")).toHaveCount(0);
    await expect(page.locator("#blog-annot-btn")).toHaveCount(0);
  });
});
