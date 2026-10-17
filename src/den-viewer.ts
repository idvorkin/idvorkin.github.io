// ABOUTME: Controls the full-screen panel reader used by comic strips on The Den page.
// ABOUTME: Keeps each strip independent and adds its full composite as the final reading step.

export interface DenStripEntry {
  num: number;
  title: string;
  date: string;
  img: string;
  alt: string;
  receipts_url?: string;
  panels: string[];
}

interface ActiveView {
  entry: DenStripEntry;
  step: number;
}

interface ViewerElements {
  lightbox: HTMLElement;
  dialog: HTMLElement;
  stage: HTMLElement;
  title: HTMLElement;
  closeButton: HTMLButtonElement;
  previousButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  imageShell: HTMLElement;
  tapPrevious: HTMLButtonElement;
  tapNext: HTMLButtonElement;
  counter: HTMLElement;
  dots: HTMLElement;
  date: HTMLElement;
  receipts: HTMLAnchorElement;
}

const PANEL_COUNT = 4;
const FULL_STRIP_STEP = PANEL_COUNT;
const SWIPE_DISTANCE = 40;

export class DenViewerManager {
  private active: ActiveView | null = null;
  private closeTimer: number | null = null;
  private currentLayer = 0;
  private elements: ViewerElements | null = null;
  private imageLayers: HTMLImageElement[] = [];
  private imageToken = 0;
  private initialized = false;
  private manifest = new Map<string, DenStripEntry>();
  private opener: HTMLElement | null = null;
  private preloaded = new Set<string>();
  private reduceMotion: boolean;

  public constructor(
    private readonly doc: Document = document,
    private readonly browserWindow: Window = window,
  ) {
    this.reduceMotion = this.browserWindow.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }

  public initialize(): boolean {
    if (this.initialized) return true;

    const data = this.doc.getElementById("den-manifest");
    const elements = this.findElements();
    if (!data || !elements) return false;

    const entries = this.readManifest(data.textContent ?? "");
    if (!entries) return false;

    this.elements = elements;
    entries.forEach((entry) => this.manifest.set(String(entry.num), entry));
    this.bindStripOpeners();
    this.createDots();
    this.bindControls();
    this.initialized = true;
    return true;
  }

  private findElements(): ViewerElements | null {
    const lightbox = this.doc.getElementById("den-lightbox");
    if (!lightbox) return null;

    const dialog = lightbox.querySelector<HTMLElement>(".den-lightbox__dialog");
    const stage = lightbox.querySelector<HTMLElement>(".den-lightbox__stage");
    const title = lightbox.querySelector<HTMLElement>(".den-lightbox__title");
    const closeButton = lightbox.querySelector<HTMLButtonElement>(".den-lightbox__close");
    const previousButton = lightbox.querySelector<HTMLButtonElement>(".den-lightbox__previous");
    const nextButton = lightbox.querySelector<HTMLButtonElement>(".den-lightbox__next");
    const imageShell = lightbox.querySelector<HTMLElement>(".den-lightbox__image-shell");
    const tapPrevious = lightbox.querySelector<HTMLButtonElement>(".den-lightbox__tap-previous");
    const tapNext = lightbox.querySelector<HTMLButtonElement>(".den-lightbox__tap-next");
    const counter = lightbox.querySelector<HTMLElement>(".den-lightbox__counter");
    const dots = lightbox.querySelector<HTMLElement>(".den-lightbox__dots");
    const date = lightbox.querySelector<HTMLElement>(".den-lightbox__date");
    const receipts = lightbox.querySelector<HTMLAnchorElement>(".den-lightbox__receipts");

    if (
      !dialog ||
      !stage ||
      !title ||
      !closeButton ||
      !previousButton ||
      !nextButton ||
      !imageShell ||
      !tapPrevious ||
      !tapNext ||
      !counter ||
      !dots ||
      !date ||
      !receipts
    ) {
      return null;
    }

    return {
      lightbox,
      dialog,
      stage,
      title,
      closeButton,
      previousButton,
      nextButton,
      imageShell,
      tapPrevious,
      tapNext,
      counter,
      dots,
      date,
      receipts,
    };
  }

  private readManifest(source: string): DenStripEntry[] | null {
    try {
      const entries = JSON.parse(source) as DenStripEntry[];
      return Array.isArray(entries) ? entries : null;
    } catch (error) {
      console.warn("⚠️ Den viewer could not read its strip manifest", error);
      return null;
    }
  }

  private bindStripOpeners(): void {
    this.doc.querySelectorAll<HTMLElement>("[data-den-strip][data-num]").forEach((strip) => {
      const entry = this.manifest.get(strip.dataset.num ?? "");
      if (!entry || entry.panels.length < PANEL_COUNT) return;

      strip.querySelectorAll<HTMLButtonElement>("[data-den-panel]").forEach((button) => {
        const panel = Number(button.dataset.denPanel) - 1;
        if (panel < 0 || panel >= PANEL_COUNT) return;
        button.addEventListener("click", () => this.open(entry, panel, button));
      });
    });
  }

  private createDots(): void {
    if (!this.elements) return;
    for (let step = 0; step <= FULL_STRIP_STEP; step++) {
      const dot = this.doc.createElement("button");
      const isFullStrip = step === FULL_STRIP_STEP;
      dot.type = "button";
      dot.className = `den-lightbox__dot${isFullStrip ? " den-lightbox__dot--all" : ""}`;
      dot.setAttribute("aria-label", isFullStrip ? "Full strip" : `Panel ${step + 1}`);
      dot.title = isFullStrip ? "Full strip" : `Panel ${step + 1}`;
      dot.addEventListener("click", () => this.render(step));
      this.elements.dots.appendChild(dot);
    }
  }

  private bindControls(): void {
    if (!this.elements) return;
    const { closeButton, previousButton, nextButton, tapPrevious, tapNext, imageShell } = this.elements;

    closeButton.addEventListener("click", () => this.close());
    previousButton.addEventListener("click", () => this.step(-1));
    nextButton.addEventListener("click", () => this.step(1));

    let suppressTapUntil = 0;
    tapPrevious.addEventListener("click", () => {
      if (Date.now() >= suppressTapUntil) this.step(-1);
    });
    tapNext.addEventListener("click", () => {
      if (Date.now() >= suppressTapUntil) this.step(1);
    });

    let startX = 0;
    let startY = 0;
    let tracking = false;
    imageShell.addEventListener("pointerdown", (event) => {
      startX = event.clientX;
      startY = event.clientY;
      tracking = true;
    });
    imageShell.addEventListener("pointercancel", () => {
      tracking = false;
    });
    imageShell.addEventListener("pointerup", (event) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) <= SWIPE_DISTANCE || Math.abs(dx) <= Math.abs(dy)) return;
      suppressTapUntil = Date.now() + 400;
      this.step(dx < 0 ? 1 : -1);
    });

    this.elements.lightbox.addEventListener("click", (event) => {
      if (
        event.target === this.elements?.lightbox ||
        event.target === this.elements?.dialog ||
        event.target === this.elements?.stage
      ) {
        this.close();
      }
    });
    this.doc.addEventListener("keydown", (event) => this.handleKeydown(event));
  }

  private open(entry: DenStripEntry, step: number, trigger: HTMLElement): void {
    if (!this.elements) return;
    if (this.closeTimer !== null) this.browserWindow.clearTimeout(this.closeTimer);

    this.opener = trigger;
    this.active = { entry, step };
    this.elements.lightbox.hidden = false;
    this.doc.documentElement.classList.add("den-lightbox-open");
    this.doc.body.classList.add("den-lightbox-open");
    this.render(step);
    this.nextFrame(() => {
      if (!this.active || !this.elements) return;
      this.elements.lightbox.classList.add("is-open");
      this.elements.closeButton.focus({ preventScroll: true });
    });
  }

  private render(step: number): void {
    if (!this.active || !this.elements || step < 0 || step > FULL_STRIP_STEP) return;

    this.active.step = step;
    const { entry } = this.active;
    const isFullStrip = step === FULL_STRIP_STEP;
    const label = `#${entry.num} — ${entry.title}`;
    const previousDisabled = step === 0;
    const nextDisabled = isFullStrip;

    this.elements.title.textContent = label;
    this.elements.lightbox.setAttribute("aria-label", `Comic viewer: ${label}`);
    this.elements.lightbox.dataset.denStrip = String(entry.num);
    this.elements.lightbox.dataset.denStep = isFullStrip ? "all" : String(step + 1);
    this.elements.counter.textContent = isFullStrip ? "full strip" : `panel ${step + 1} of 4`;
    this.elements.date.textContent = entry.date;
    this.elements.previousButton.disabled = previousDisabled;
    this.elements.tapPrevious.disabled = previousDisabled;
    this.elements.nextButton.disabled = nextDisabled;
    this.elements.tapNext.disabled = nextDisabled;

    if (entry.receipts_url) {
      this.elements.receipts.href = entry.receipts_url;
      this.elements.receipts.hidden = false;
    } else {
      this.elements.receipts.removeAttribute("href");
      this.elements.receipts.hidden = true;
    }

    this.elements.dots.querySelectorAll<HTMLButtonElement>(".den-lightbox__dot").forEach((dot, index) => {
      if (index === step) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    this.showImage(entry, step);
    this.preload(entry, step - 1);
    this.preload(entry, step + 1);
  }

  private step(delta: number): void {
    if (!this.active) return;
    const next = this.active.step + delta;
    if (next < 0 || next > FULL_STRIP_STEP) return;
    this.render(next);
  }

  private close(): void {
    if (!this.active || !this.elements) return;
    this.active = null;
    this.imageToken += 1;
    this.elements.lightbox.classList.remove("is-open");
    this.doc.documentElement.classList.remove("den-lightbox-open");
    this.doc.body.classList.remove("den-lightbox-open");
    this.closeTimer = this.browserWindow.setTimeout(
      () => {
        if (!this.elements) return;
        this.elements.lightbox.hidden = true;
        this.opener?.focus({ preventScroll: true });
      },
      this.reduceMotion ? 0 : 180,
    );
  }

  private ensureImageLayers(): void {
    if (!this.elements || this.imageLayers.length) return;
    for (let layer = 0; layer < 2; layer++) {
      const image = this.doc.createElement("img");
      image.className = "den-lightbox__image";
      image.decoding = "async";
      this.elements.imageShell.insertBefore(image, this.elements.tapPrevious);
      this.imageLayers.push(image);
    }
  }

  private showImage(entry: DenStripEntry, step: number): void {
    this.ensureImageLayers();
    const file = this.fileFor(entry, step);
    if (!file) return;

    const current = this.imageLayers[this.currentLayer];
    const targetIndex = current.getAttribute("src") ? 1 - this.currentLayer : this.currentLayer;
    const target = this.imageLayers[targetIndex];
    const isFullStrip = step === FULL_STRIP_STEP;
    const token = ++this.imageToken;

    this.imageLayers.forEach((image) => {
      image.classList.remove("is-current", "is-outgoing");
      image.removeAttribute("data-den-current");
      image.alt = "";
    });
    if (current.getAttribute("src") && current !== target) current.classList.add("is-outgoing");

    target.alt = isFullStrip ? `The Den #${entry.num}, full strip` : `The Den #${entry.num}, panel ${step + 1} of 4`;
    target.width = isFullStrip ? 1600 : 800;
    target.height = isFullStrip ? 1600 : 800;
    target.dataset.denCurrent = "true";
    const reveal = () => {
      if (token !== this.imageToken) return;
      target.classList.add("is-current");
      current.classList.remove("is-outgoing");
      this.currentLayer = targetIndex;
    };
    target.onload = reveal;
    target.setAttribute("src", file);
    if (target.complete && target.naturalWidth) reveal();
  }

  private fileFor(entry: DenStripEntry, step: number): string | undefined {
    return step === FULL_STRIP_STEP ? entry.img : entry.panels[step];
  }

  private preload(entry: DenStripEntry, step: number): void {
    if (step < 0 || step > FULL_STRIP_STEP) return;
    const file = this.fileFor(entry, step);
    if (!file || this.preloaded.has(file)) return;
    this.preloaded.add(file);
    const image = this.doc.createElement("img");
    image.src = file;
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.active) return;
    if (event.key === "Escape") this.close();
    else if (event.key === "ArrowRight") this.step(1);
    else if (event.key === "ArrowLeft") this.step(-1);
    else if (event.key === "Tab") {
      this.trapFocus(event);
      return;
    } else return;
    event.preventDefault();
  }

  private trapFocus(event: KeyboardEvent): void {
    if (!this.elements) return;
    const controls = Array.from(
      this.elements.lightbox.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"]), a[href]:not([hidden])',
      ),
    ).filter((element) => element.offsetParent !== null);
    if (!controls.length) return;

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && this.doc.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && this.doc.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }

  private nextFrame(callback: () => void): void {
    if (this.browserWindow.requestAnimationFrame) {
      this.browserWindow.requestAnimationFrame(callback);
    } else {
      callback();
    }
  }
}

export function setupDenViewer(doc: Document = document, browserWindow: Window = window): DenViewerManager | null {
  const manager = new DenViewerManager(doc, browserWindow);
  return manager.initialize() ? manager : null;
}
