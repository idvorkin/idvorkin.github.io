// ABOUTME: Verifies the Den video Share button and #play-N deep links.
// ABOUTME: Covers the link shape, share-sheet vs clipboard choice, the Copied toast, and muted autoplay retry.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  denVideoShareUrl,
  linkedDenVideo,
  playLinkedDenVideo,
  prefersNativeShare,
  setupDenVideos,
  shareDenVideo,
} from "../den-video";

const DESKTOP_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36";
const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";

function installMarkup(): HTMLVideoElement {
  document.body.innerHTML = `
    <figure class="den-strip" data-num="21">
      <div class="den-video">
        <video id="play-21" data-den-video data-den-title="The Den #21 — Thinner" src="/v.mp4"></video>
        <button type="button" class="den-video__share" data-den-video-share="play-21">Share</button>
      </div>
    </figure>
    <h2 id="21--thinner">#21 — Thinner</h2>`;
  return document.getElementById("play-21") as HTMLVideoElement;
}

function stubNavigator(props: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(window.navigator, key, { value, configurable: true, writable: true });
  }
}

// vitest.setup.ts swaps window.location for a plain object, so tests set it directly.
function setLocation(pathname: string, hash = ""): void {
  Object.assign(window.location, { pathname, hash });
}

beforeEach(() => {
  setLocation("/the-den");
});

afterEach(() => {
  setLocation("/", "");
});

describe("Den video links", () => {
  it("links to the page with the video's id as the fragment", () => {
    const video = installMarkup();
    expect(denVideoShareUrl(video)).toBe(`${window.location.origin}/the-den#play-21`);
  });

  it("resolves only fragments that name a strip video", () => {
    installMarkup();
    expect(linkedDenVideo("#play-21")?.id).toBe("play-21");
    expect(linkedDenVideo("#21--thinner")).toBeNull();
    expect(linkedDenVideo("#nope")).toBeNull();
    expect(linkedDenVideo("")).toBeNull();
  });
});

describe("playLinkedDenVideo", () => {
  it("retries muted when the browser refuses sound", async () => {
    const video = installMarkup();
    const play = vi
      .fn()
      .mockRejectedValueOnce(new DOMException("needs a gesture", "NotAllowedError"))
      .mockResolvedValueOnce(undefined);
    video.play = play;
    await playLinkedDenVideo(video);
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.muted).toBe(true);
  });

  it("keeps sound when play is allowed", async () => {
    const video = installMarkup();
    video.play = vi.fn().mockResolvedValue(undefined);
    await playLinkedDenVideo(video);
    expect(video.muted).toBe(false);
  });

  it("plays the linked video on load and on hashchange", async () => {
    const video = installMarkup();
    const play = vi.fn().mockResolvedValue(undefined);
    video.play = play;
    setLocation("/the-den", "#play-21");
    setupDenVideos();
    expect(play).toHaveBeenCalledTimes(1);

    setLocation("/the-den", "#21--thinner");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(play).toHaveBeenCalledTimes(1);

    setLocation("/the-den", "#play-21");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(play).toHaveBeenCalledTimes(2);
  });
});

describe("shareDenVideo", () => {
  const originalUA = window.navigator.userAgent;

  afterEach(() => {
    stubNavigator({ userAgent: originalUA, share: undefined, clipboard: undefined, maxTouchPoints: 0 });
    vi.useRealTimers();
  });

  it("uses the share sheet on a phone", async () => {
    const video = installMarkup();
    const share = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ userAgent: IPHONE_UA, share });
    expect(prefersNativeShare()).toBe(true);
    await expect(shareDenVideo(video)).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith({
      title: "The Den #21 — Thinner",
      url: `${window.location.origin}/the-den#play-21`,
    });
  });

  it("treats a dismissed share sheet as done, not as a copy", async () => {
    const video = installMarkup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({
      userAgent: IPHONE_UA,
      share: vi.fn().mockRejectedValue(new DOMException("cancelled", "AbortError")),
      clipboard: { writeText },
    });
    await expect(shareDenVideo(video)).resolves.toBe("shared");
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copies on desktop even where navigator.share exists, and says Copied", async () => {
    const video = installMarkup();
    const share = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ userAgent: DESKTOP_UA, share, clipboard: { writeText } });
    expect(prefersNativeShare()).toBe(false);
    await expect(shareDenVideo(video)).resolves.toBe("copied");
    expect(share).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/the-den#play-21`);
    const toast = document.querySelector(".den-video-toast");
    expect(toast?.textContent).toBe("Copied");
    expect(toast?.classList.contains("is-visible")).toBe(true);
  });

  it("wires the Share button", async () => {
    installMarkup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ userAgent: DESKTOP_UA, clipboard: { writeText } });
    setupDenVideos();
    document.querySelector<HTMLButtonElement>("[data-den-video-share]")?.click();
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
  });

  it("treats an iPad's desktop user agent with touch as a tablet", () => {
    stubNavigator({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", share: vi.fn(), maxTouchPoints: 5 });
    expect(prefersNativeShare()).toBe(true);
  });
});
