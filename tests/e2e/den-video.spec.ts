// ABOUTME: Verifies the Den strip videos' Share button and #play-N deep links on /the-den.
// ABOUTME: Real strip mp4s are swapped for a tiny WebM fixture because Playwright's Chromium can't decode H.264.

import { readFileSync } from "node:fs";
import { type Page, expect, test } from "./base-test";

const CLIP = readFileSync(new URL("./fixtures/den-test-clip.webm", import.meta.url));

async function serveTestClip(page: Page): Promise<void> {
  await page.route("**/*.mp4", (route) => route.fulfill({ status: 200, contentType: "video/webm", body: CLIP }));
}

/** Real browsers refuse unmuted playback before a tap; headless Chromium doesn't, so emulate it. */
async function refuseUnmutedAutoplay(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      if (!this.muted && !navigator.userActivation?.hasBeenActive) {
        return Promise.reject(new DOMException("play() needs a user gesture", "NotAllowedError"));
      }
      return play.call(this);
    };
  });
}

test.describe("The Den video share links", () => {
  test("a #play-21 link scrolls to strip 21's video and plays it, muted", async ({ page }) => {
    await serveTestClip(page);
    await refuseUnmutedAutoplay(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/the-den#play-21");

    const video = page.locator("video#play-21");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0), { timeout: 10000 })
      .toBe(true);
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
    expect(await page.locator("video#play-18").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);

    // Wait out the hash-scroll corrector, then check the video is actually on screen.
    await page.waitForTimeout(1500);
    const box = await video.evaluate((v) => {
      const r = v.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, viewport: window.innerHeight };
    });
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(box.viewport);
  });

  test("Share on desktop copies the strip's video link and says Copied", async ({ page, context, baseURL }) => {
    await serveTestClip(page);
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
    await page.goto("/the-den");

    await page.locator('[data-den-video-share="play-21"]').click();

    const toast = page.locator(".den-video-toast");
    await expect(toast).toHaveText("Copied");
    await expect(toast).toHaveClass(/is-visible/);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/the-den#play-21`);
    await expect(toast).not.toHaveClass(/is-visible/, { timeout: 4000 });
  });

  test.describe("on a phone", () => {
    test.use({
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
      viewport: { width: 390, height: 844 },
    });

    test("Share opens the share sheet with the strip's video link", async ({ page, baseURL }) => {
      await serveTestClip(page);
      await page.addInitScript(() => {
        const shared: ShareData[] = [];
        (window as unknown as { __shared: ShareData[] }).__shared = shared;
        Object.defineProperty(navigator, "share", {
          configurable: true,
          value: (data: ShareData) => {
            shared.push(data);
            return Promise.resolve();
          },
        });
      });
      await page.goto("/the-den");

      await page.locator('[data-den-video-share="play-18"]').click();

      await expect
        .poll(() => page.evaluate(() => (window as unknown as { __shared: ShareData[] }).__shared))
        .toEqual([{ title: "The Den #18 — Marco", url: `${baseURL}/the-den#play-18` }]);
      await expect(page.locator(".den-video-toast")).toHaveCount(0);
    });
  });
});
