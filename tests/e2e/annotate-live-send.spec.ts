// ABOUTME: Real-browser check of the annotate tool off the tailnet: the open-PR badge for a page an open PR
// ABOUTME: changes, and Send writing one secret gist per page (GitHub is mocked; nothing real is created).

import { type Page, expect, test } from "./base-test";

const POST = "/eulogy";
const SOURCE = "_posts/2020-04-01-Igor-Eulogy.md";
const API = "https://api.github.com/repos/idvorkin/idvorkin.github.io";

async function mockGithub(page: Page, files: string[]): Promise<unknown[]> {
  const gists: unknown[] = [];
  await page.route("**/larry/**", (r) => r.fulfill({ status: 503, body: "" }));
  await page.route("**/blog-review**", (r) => r.fulfill({ status: 503, body: "" }));
  await page.route("https://api.github.com/**", async (r) => {
    const url = r.request().url();
    if (url === `${API}/pulls?state=open&per_page=100`)
      return r.fulfill({
        json: [
          { number: 4242, title: "Edit eulogy", html_url: "https://github.com/idvorkin/idvorkin.github.io/pull/4242" },
        ],
      });
    if (url === `${API}/pulls/4242/files?per_page=100`)
      return r.fulfill({ json: files.map((filename) => ({ filename })) });
    if (url === "https://api.github.com/gists") {
      gists.push(JSON.parse(r.request().postData() || "{}"));
      return r.fulfill({ status: 201, json: { id: "fake", html_url: "https://gist.github.com/fake" } });
    }
    return r.abort();
  });
  return gists;
}

// A host that is neither localhost nor a tailnet name, so Send takes the live-site (gist) path.
function liveLikeUrl(baseURL: string | undefined, path: string): string {
  return new URL(path, (baseURL || "http://localhost:4000").replace("localhost", "127.0.0.1")).toString();
}

test.describe("annotate on the live site", () => {
  test("comment mode shows the open PR that changes this page", async ({ page }) => {
    await mockGithub(page, [SOURCE]);
    await page.goto(`${POST}?annotate=1`);
    await expect(page.locator("#blog-annot-prs")).toHaveText("This page has 1 open PR: #4242");
  });

  test("no badge when no open PR changes this page", async ({ page }) => {
    await mockGithub(page, ["_d/elsewhere.md"]);
    await page.goto(`${POST}?annotate=1`);
    await expect(page.locator("#blog-annot-send")).toBeVisible();
    await expect(page.locator("#blog-annot-prs")).toBeHidden();
  });

  test("Send off the tailnet writes a secret gist and clears the buffer", async ({ page, baseURL }) => {
    const gists = await mockGithub(page, []);
    await page.goto(liveLikeUrl(baseURL, `${POST}?annotate=1`));
    await page.evaluate(() => {
      localStorage.setItem("blogAnnotateToken", "fake-token");
      const el = document.querySelector("#content-holder p") as HTMLElement;
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection() as Selection;
      sel.removeAllRanges();
      sel.addRange(range);
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    await page.locator("#blog-annot-btn").click();
    await page.locator("#blog-annot-text").fill("tighten");
    await page.locator("#blog-annot-save").click();
    await page.locator("#blog-annot-send").click();
    await expect(page.locator("#blog-annot-send")).toHaveText("Sent ✓");
    await expect(page.locator("#blog-annot-count")).toHaveText("Review (0)");
    expect(gists).toHaveLength(1);
    const gist = gists[0] as { public: boolean; description: string; files: Record<string, { content: string }> };
    expect(gist.public).toBe(false);
    expect(gist.description).toBe("blog-review: /eulogy");
    const batch = JSON.parse(gist.files["review.json"].content);
    expect(batch).toMatchObject({
      schema: "blog-review-batch/1",
      via: "send",
      permalink: "/eulogy",
      source_path: SOURCE,
    });
    expect(batch.annotations[0].comment).toBe("tighten");
  });
});
