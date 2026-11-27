// ABOUTME: Real-browser check that the chat panel recovers by itself: the mocked Cockpit fails, the panel shows
// ABOUTME: the failure with its facts, the Cockpit comes back and the panel clears and shows replies without a reload.

import { type Page, expect, test } from "./base-test";

const POST = "/eulogy";
const SAVED = "https://cockpit.example-tail.ts.net";
const CORS = { "Access-Control-Allow-Origin": "*" };

// A host that is neither localhost nor a tailnet name, so the saved address is the one used.
function liveLikeUrl(baseURL: string | undefined, path: string): string {
  return new URL(path, (baseURL || "http://localhost:4000").replace("localhost", "127.0.0.1")).toString();
}

async function openWithSaved(page: Page, baseURL: string | undefined) {
  await page.route("https://api.github.com/**", (r) => r.abort());
  await page.goto(liveLikeUrl(baseURL, POST));
  await page.evaluate((origin) => localStorage.setItem("blogLarryCockpit", origin), SAVED);
  await page.goto(liveLikeUrl(baseURL, `${POST}?annotate=1`));
}

test("the chat recovers after the Cockpit comes back, without a reload", async ({ page, baseURL }) => {
  let up = false;
  let gets = 0;
  await page.route(`${SAVED}/larry/status`, (r) =>
    up ? r.fulfill({ json: { ok: true, state: "idle" }, headers: CORS }) : r.abort("internetdisconnected"),
  );
  await page.route(`${SAVED}/page-chat**`, (r) => {
    gets++;
    if (!up) return r.abort("internetdisconnected");
    return r.fulfill({
      json: { ok: true, thread: "t1", messages: [{ id: "m1", who: "larry", text: "Back again." }] },
      headers: CORS,
    });
  });
  await openWithSaved(page, baseURL);
  const loads: string[] = [];
  page.on("load", () => loads.push(page.url()));

  await page.locator("#blog-annot-chat-toggle").click();
  const status = page.locator("#blog-annot-chat-status");
  await expect(status).toContainText("Can't reach Larry: network refused");
  await expect(status).toContainText("last ok never");
  await expect(status).toContainText("cockpit.example-tail.ts.net");
  await expect(page.locator("#blog-annot-chat-retry")).toBeVisible();

  // Still failing on the next try (8 s backoff): the loop has not given up.
  const firstGets = gets;
  await expect.poll(() => gets, { timeout: 12000 }).toBeGreaterThan(firstGets);
  await expect(status).toContainText("retry 2 in 16 s");

  up = true;
  // The browser's 'online' event resumes at once instead of waiting out the backoff.
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(page.locator("#blog-annot-chat .bac-msg")).toHaveText(["Back again."]);
  await expect(status).toHaveText("");
  await expect(page.locator("#blog-annot-larry-dot")).toHaveAttribute("data-state", "idle");
  expect(loads).toEqual([]);
});
