// ABOUTME: Verifies the Den lightbox stays within one strip and ends on its full-strip view.
// ABOUTME: Exercises panel opening, navigation boundaries, metadata, and close restoration.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { type DenStripEntry, DenViewerManager } from "../den-viewer";

const manifest: DenStripEntry[] = [
  {
    num: 7,
    title: "Before AI / After AI",
    date: "September 2, 2026",
    img: "/images/den/den-007.webp",
    alt: "The Den #7",
    receipts_url: "https://gist.github.com/idvorkin-ai-tools/strip-7",
    panels: [
      "/images/den/den-007-p1.webp",
      "/images/den/den-007-p2.webp",
      "/images/den/den-007-p3.webp",
      "/images/den/den-007-p4.webp",
    ],
  },
  {
    num: 6,
    title: "Do a Russian Accent",
    date: "August 30, 2026",
    img: "/images/den/den-006.webp",
    alt: "The Den #6",
    receipts_url: "https://gist.github.com/idvorkin-ai-tools/strip-6",
    panels: [
      "/images/den/den-006-p1.webp",
      "/images/den/den-006-p2.webp",
      "/images/den/den-006-p3.webp",
      "/images/den/den-006-p4.webp",
    ],
  },
];

function stripMarkup(num: number): string {
  return `
    <figure class="den-strip" data-den-strip data-num="${num}">
      <div class="den-frame">
        ${[1, 2, 3, 4]
          .map((panel) => `<button class="den-hit" type="button" data-den-panel="${panel}">Panel ${panel}</button>`)
          .join("")}
      </div>
    </figure>`;
}

function installMarkup(): void {
  document.body.innerHTML = `
    ${stripMarkup(7)}
    ${stripMarkup(6)}
    <div class="den-lightbox" id="den-lightbox" role="dialog" hidden>
      <div class="den-lightbox__dialog">
        <div class="den-lightbox__title"></div>
        <button class="den-lightbox__close" type="button">Close</button>
        <div class="den-lightbox__stage">
          <button class="den-lightbox__previous" type="button">Previous</button>
          <div class="den-lightbox__image-shell">
            <button class="den-lightbox__tap-previous" type="button" tabindex="-1">Previous</button>
            <button class="den-lightbox__tap-next" type="button" tabindex="-1">Next</button>
          </div>
          <button class="den-lightbox__next" type="button">Next</button>
        </div>
        <div class="den-lightbox__counter"></div>
        <div class="den-lightbox__dots"></div>
        <span class="den-lightbox__date"></span>
        <a class="den-lightbox__receipts" href="#">Receipts</a>
      </div>
    </div>
    <script type="application/json" id="den-manifest">${JSON.stringify(manifest)}</script>`;
}

function element<T extends Element>(selector: string): T {
  const found = document.querySelector<T>(selector);
  if (!found) throw new Error(`Missing test element: ${selector}`);
  return found;
}

describe("DenViewerManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installMarkup();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
  });

  it("opens on the tapped panel, then advances to the full strip", () => {
    const manager = new DenViewerManager(document, window);
    expect(manager.initialize()).toBe(true);

    const panelFour = element<HTMLButtonElement>('[data-num="7"] [data-den-panel="4"]');
    panelFour.click();

    const lightbox = element<HTMLElement>("#den-lightbox");
    const next = element<HTMLButtonElement>(".den-lightbox__next");
    expect(lightbox.dataset.denStrip).toBe("7");
    expect(lightbox.dataset.denStep).toBe("4");
    expect(document.querySelector(".den-lightbox__counter")?.textContent).toBe("panel 4 of 4");
    expect(next.disabled).toBe(false);

    next.click();

    expect(lightbox.dataset.denStrip).toBe("7");
    expect(lightbox.dataset.denStep).toBe("all");
    expect(document.querySelector(".den-lightbox__counter")?.textContent).toBe("full strip");
    expect(next.disabled).toBe(true);
    expect(document.querySelector('.den-lightbox__dot--all[aria-current="true"]')).not.toBeNull();
    expect(document.querySelector<HTMLImageElement>('.den-lightbox__image[data-den-current="true"]')?.src).toContain(
      "/images/den/den-007.webp",
    );
  });

  it("never advances from the full view into another strip", () => {
    const manager = new DenViewerManager(document, window);
    manager.initialize();
    element<HTMLButtonElement>('[data-num="7"] [data-den-panel="4"]').click();

    const next = element<HTMLButtonElement>(".den-lightbox__next");
    next.click();
    next.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    const lightbox = element<HTMLElement>("#den-lightbox");
    expect(lightbox.dataset.denStrip).toBe("7");
    expect(lightbox.dataset.denStep).toBe("all");
    expect(document.querySelector(".den-lightbox__title")?.textContent).toBe("#7 — Before AI / After AI");
  });

  it("returns from the full view to panel four and restores focus on close", () => {
    const manager = new DenViewerManager(document, window);
    manager.initialize();
    const panelFour = element<HTMLButtonElement>('[data-num="7"] [data-den-panel="4"]');
    panelFour.click();

    element<HTMLButtonElement>(".den-lightbox__next").click();
    element<HTMLButtonElement>(".den-lightbox__previous").click();
    expect(document.getElementById("den-lightbox")?.dataset.denStep).toBe("4");

    element<HTMLButtonElement>(".den-lightbox__close").click();
    vi.runAllTimers();
    expect(document.documentElement.classList.contains("den-lightbox-open")).toBe(false);
    expect(document.body.classList.contains("den-lightbox-open")).toBe(false);
    expect(document.getElementById("den-lightbox")?.hidden).toBe(true);
    expect(document.activeElement).toBe(panelFour);
  });

  it("shows the active strip date and receipts link outside the art", () => {
    const manager = new DenViewerManager(document, window);
    manager.initialize();
    element<HTMLButtonElement>('[data-num="7"] [data-den-panel="2"]').click();

    expect(document.querySelector(".den-lightbox__date")?.textContent).toBe("September 2, 2026");
    expect(document.querySelector<HTMLAnchorElement>(".den-lightbox__receipts")?.href).toBe(
      "https://gist.github.com/idvorkin-ai-tools/strip-7",
    );
  });
});
