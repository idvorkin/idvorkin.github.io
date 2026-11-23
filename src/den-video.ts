// ABOUTME: Share button and deep links for the animated Den strips' videos.
// ABOUTME: A link whose #fragment names a strip video scrolls to it and starts it playing.

const TOAST_MS = 1800;

/** The Den link that opens this page scrolled to the video, playing it. */
export function denVideoShareUrl(video: HTMLVideoElement, loc: Location = window.location): string {
  return `${loc.origin}${loc.pathname}#${video.id}`;
}

/** The strip video a #fragment points at, if it points at one. */
export function linkedDenVideo(hash: string, doc: Document = document): HTMLVideoElement | null {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return null;
  const el = doc.getElementById(id);
  return el instanceof HTMLVideoElement && el.hasAttribute("data-den-video") ? el : null;
}

/**
 * Starts a linked video. Browsers refuse sound without a tap on the page, so a
 * refused play retries muted; the reader can unmute from the controls.
 */
export async function playLinkedDenVideo(video: HTMLVideoElement): Promise<void> {
  try {
    await video.play();
  } catch (error) {
    if ((error as DOMException)?.name !== "NotAllowedError") throw error;
    video.muted = true;
    await video.play();
  }
}

/** Phones and tablets get the native share sheet; desktops get the clipboard. */
export function prefersNativeShare(nav: Navigator = navigator): boolean {
  if (typeof nav.share !== "function") return false;
  const ua = nav.userAgent;
  // iPadOS reports a desktop Mac user agent; touch points give it away.
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1);
}

async function copyText(text: string, doc: Document): Promise<void> {
  const nav = doc.defaultView?.navigator;
  if (nav?.clipboard?.writeText) {
    try {
      await nav.clipboard.writeText(text);
      return;
    } catch {
      // Falls through: plain-http previews have no async clipboard.
    }
  }
  const area = doc.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  doc.body.appendChild(area);
  area.select();
  const copied = doc.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("copy failed");
}

function showToast(doc: Document, message: string): void {
  let toast = doc.querySelector<HTMLElement>(".den-video-toast");
  if (!toast) {
    toast = doc.createElement("div");
    toast.className = "den-video-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    doc.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  const win = doc.defaultView ?? window;
  win.clearTimeout(Number(toast.dataset.timer));
  toast.dataset.timer = String(win.setTimeout(() => toast?.classList.remove("is-visible"), TOAST_MS));
}

/** Shares the video's link: the share sheet on mobile, else copy and say "Copied". */
export async function shareDenVideo(video: HTMLVideoElement, doc: Document = document): Promise<"shared" | "copied"> {
  const win = doc.defaultView ?? window;
  const url = denVideoShareUrl(video, win.location);
  if (prefersNativeShare(win.navigator)) {
    try {
      await win.navigator.share({ title: video.dataset.denTitle || doc.title, url });
      return "shared";
    } catch (error) {
      // The reader closed the sheet: that's an answer, not a failure.
      if ((error as DOMException)?.name === "AbortError") return "shared";
      console.log("📱 Share sheet failed, copying the link instead", error);
    }
  }
  try {
    await copyText(url, doc);
    showToast(doc, "Copied");
  } catch (error) {
    console.error("📋 Couldn't copy the Den video link", error);
    showToast(doc, "Couldn't copy the link");
  }
  return "copied";
}

/** Wires every strip video's Share button and plays the video the URL links to. */
export function setupDenVideos(doc: Document = document, win: Window = window): void {
  doc.querySelectorAll<HTMLButtonElement>("[data-den-video-share]").forEach((button) => {
    const video = doc.getElementById(button.dataset.denVideoShare ?? "");
    if (!(video instanceof HTMLVideoElement)) return;
    button.addEventListener("click", () => {
      void shareDenVideo(video, doc);
    });
  });

  const playFromHash = () => {
    const video = linkedDenVideo(win.location.hash, doc);
    if (!video) return;
    playLinkedDenVideo(video).catch((error) => console.warn("🎬 Couldn't start the linked Den video", error));
  };
  win.addEventListener("hashchange", playFromHash);
  playFromHash();
}
