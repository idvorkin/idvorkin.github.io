class g {
  constructor(e = document, t = window) {
    this.doc = e, this.browserWindow = t, this.active = null, this.closeTimer = null, this.currentLayer = 0, this.elements = null, this.imageLayers = [], this.imageToken = 0, this.initialized = !1, this.manifest = /* @__PURE__ */ new Map(), this.opener = null, this.preloaded = /* @__PURE__ */ new Set(), this.reduceMotion = this.browserWindow.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  }
  initialize() {
    if (this.initialized) return !0;
    const e = this.doc.getElementById("den-manifest"), t = this.findElements();
    if (!e || !t) return !1;
    const i = this.readManifest(e.textContent ?? "");
    return i ? (this.elements = t, i.forEach((s) => this.manifest.set(String(s.num), s)), this.bindStripOpeners(), this.createDots(), this.bindControls(), this.initialized = !0, !0) : !1;
  }
  findElements() {
    const e = this.doc.getElementById("den-lightbox");
    if (!e) return null;
    const t = e.querySelector(".den-lightbox__dialog"), i = e.querySelector(".den-lightbox__stage"), s = e.querySelector(".den-lightbox__title"), o = e.querySelector(".den-lightbox__close"), n = e.querySelector(".den-lightbox__previous"), l = e.querySelector(".den-lightbox__next"), h = e.querySelector(".den-lightbox__image-shell"), c = e.querySelector(".den-lightbox__tap-previous"), a = e.querySelector(".den-lightbox__tap-next"), r = e.querySelector(".den-lightbox__counter"), d = e.querySelector(".den-lightbox__dots"), u = e.querySelector(".den-lightbox__date"), f = e.querySelector(".den-lightbox__receipts");
    return !t || !i || !s || !o || !n || !l || !h || !c || !a || !r || !d || !u || !f ? null : {
      lightbox: e,
      dialog: t,
      stage: i,
      title: s,
      closeButton: o,
      previousButton: n,
      nextButton: l,
      imageShell: h,
      tapPrevious: c,
      tapNext: a,
      counter: r,
      dots: d,
      date: u,
      receipts: f
    };
  }
  readManifest(e) {
    try {
      const t = JSON.parse(e);
      return Array.isArray(t) ? t : null;
    } catch (t) {
      return console.warn("⚠️ Den viewer could not read its strip manifest", t), null;
    }
  }
  bindStripOpeners() {
    this.doc.querySelectorAll("[data-den-strip][data-num]").forEach((e) => {
      const t = this.manifest.get(e.dataset.num ?? "");
      !t || t.panels.length < 4 || e.querySelectorAll("[data-den-panel]").forEach((i) => {
        const s = Number(i.dataset.denPanel) - 1;
        s < 0 || s >= 4 || i.addEventListener("click", () => this.open(t, s, i));
      });
    });
  }
  createDots() {
    if (this.elements)
      for (let e = 0; e <= 4; e++) {
        const t = this.doc.createElement("button"), i = e === 4;
        t.type = "button", t.className = `den-lightbox__dot${i ? " den-lightbox__dot--all" : ""}`, t.setAttribute("aria-label", i ? "Full strip" : `Panel ${e + 1}`), t.title = i ? "Full strip" : `Panel ${e + 1}`, t.addEventListener("click", () => this.render(e)), this.elements.dots.appendChild(t);
      }
  }
  bindControls() {
    if (!this.elements) return;
    const { closeButton: e, previousButton: t, nextButton: i, tapPrevious: s, tapNext: o, imageShell: n } = this.elements;
    e.addEventListener("click", () => this.close()), t.addEventListener("click", () => this.step(-1)), i.addEventListener("click", () => this.step(1));
    let l = 0;
    s.addEventListener("click", () => {
      Date.now() >= l && this.step(-1);
    }), o.addEventListener("click", () => {
      Date.now() >= l && this.step(1);
    });
    let h = 0, c = 0, a = !1;
    n.addEventListener("pointerdown", (r) => {
      h = r.clientX, c = r.clientY, a = !0;
    }), n.addEventListener("pointercancel", () => {
      a = !1;
    }), n.addEventListener("pointerup", (r) => {
      if (!a) return;
      a = !1;
      const d = r.clientX - h, u = r.clientY - c;
      Math.abs(d) <= 40 || Math.abs(d) <= Math.abs(u) || (l = Date.now() + 400, this.step(d < 0 ? 1 : -1));
    }), this.elements.lightbox.addEventListener("click", (r) => {
      (r.target === this.elements?.lightbox || r.target === this.elements?.dialog || r.target === this.elements?.stage) && this.close();
    }), this.doc.addEventListener("keydown", (r) => this.handleKeydown(r));
  }
  open(e, t, i) {
    this.elements && (this.closeTimer !== null && this.browserWindow.clearTimeout(this.closeTimer), this.opener = i, this.active = { entry: e, step: t }, this.elements.lightbox.hidden = !1, this.doc.documentElement.classList.add("den-lightbox-open"), this.doc.body.classList.add("den-lightbox-open"), this.render(t), this.nextFrame(() => {
      !this.active || !this.elements || (this.elements.lightbox.classList.add("is-open"), this.elements.closeButton.focus({ preventScroll: !0 }));
    }));
  }
  render(e) {
    if (!this.active || !this.elements || e < 0 || e > 4) return;
    this.active.step = e;
    const { entry: t } = this.active, i = e === 4, s = `#${t.num} — ${t.title}`, o = e === 0, n = i;
    this.elements.title.textContent = s, this.elements.lightbox.setAttribute("aria-label", `Comic viewer: ${s}`), this.elements.lightbox.dataset.denStrip = String(t.num), this.elements.lightbox.dataset.denStep = i ? "all" : String(e + 1), this.elements.counter.textContent = i ? "full strip" : `panel ${e + 1} of 4`, this.elements.date.textContent = t.date, this.elements.previousButton.disabled = o, this.elements.tapPrevious.disabled = o, this.elements.nextButton.disabled = n, this.elements.tapNext.disabled = n, t.receipts_url ? (this.elements.receipts.href = t.receipts_url, this.elements.receipts.hidden = !1) : (this.elements.receipts.removeAttribute("href"), this.elements.receipts.hidden = !0), this.elements.dots.querySelectorAll(".den-lightbox__dot").forEach((l, h) => {
      h === e ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current");
    }), this.showImage(t, e), this.preload(t, e - 1), this.preload(t, e + 1);
  }
  step(e) {
    if (!this.active) return;
    const t = this.active.step + e;
    t < 0 || t > 4 || this.render(t);
  }
  close() {
    !this.active || !this.elements || (this.active = null, this.imageToken += 1, this.elements.lightbox.classList.remove("is-open"), this.doc.documentElement.classList.remove("den-lightbox-open"), this.doc.body.classList.remove("den-lightbox-open"), this.closeTimer = this.browserWindow.setTimeout(
      () => {
        this.elements && (this.elements.lightbox.hidden = !0, this.opener?.focus({ preventScroll: !0 }));
      },
      this.reduceMotion ? 0 : 180
    ));
  }
  ensureImageLayers() {
    if (!(!this.elements || this.imageLayers.length))
      for (let e = 0; e < 2; e++) {
        const t = this.doc.createElement("img");
        t.className = "den-lightbox__image", t.decoding = "async", this.elements.imageShell.insertBefore(t, this.elements.tapPrevious), this.imageLayers.push(t);
      }
  }
  showImage(e, t) {
    this.ensureImageLayers();
    const i = this.fileFor(e, t);
    if (!i) return;
    const s = this.imageLayers[this.currentLayer], o = s.getAttribute("src") ? 1 - this.currentLayer : this.currentLayer, n = this.imageLayers[o], l = t === 4, h = ++this.imageToken;
    this.imageLayers.forEach((a) => {
      a.classList.remove("is-current", "is-outgoing"), a.removeAttribute("data-den-current"), a.alt = "";
    }), s.getAttribute("src") && s !== n && s.classList.add("is-outgoing"), n.alt = l ? `The Den #${e.num}, full strip` : `The Den #${e.num}, panel ${t + 1} of 4`, n.width = l ? 1600 : 800, n.height = l ? 1600 : 800, n.dataset.denCurrent = "true";
    const c = () => {
      h === this.imageToken && (n.classList.add("is-current"), s.classList.remove("is-outgoing"), this.currentLayer = o);
    };
    n.onload = c, n.setAttribute("src", i), n.complete && n.naturalWidth && c();
  }
  fileFor(e, t) {
    return t === 4 ? e.img : e.panels[t];
  }
  preload(e, t) {
    if (t < 0 || t > 4) return;
    const i = this.fileFor(e, t);
    if (!i || this.preloaded.has(i)) return;
    this.preloaded.add(i);
    const s = this.doc.createElement("img");
    s.src = i;
  }
  handleKeydown(e) {
    if (this.active) {
      if (e.key === "Escape") this.close();
      else if (e.key === "ArrowRight") this.step(1);
      else if (e.key === "ArrowLeft") this.step(-1);
      else if (e.key === "Tab") {
        this.trapFocus(e);
        return;
      } else return;
      e.preventDefault();
    }
  }
  trapFocus(e) {
    if (!this.elements) return;
    const t = Array.from(
      this.elements.lightbox.querySelectorAll(
        'button:not([disabled]):not([tabindex="-1"]), a[href]:not([hidden])'
      )
    ).filter((o) => o.offsetParent !== null);
    if (!t.length) return;
    const i = t[0], s = t[t.length - 1];
    e.shiftKey && this.doc.activeElement === i ? (s.focus(), e.preventDefault()) : !e.shiftKey && this.doc.activeElement === s && (i.focus(), e.preventDefault());
  }
  nextFrame(e) {
    this.browserWindow.requestAnimationFrame ? this.browserWindow.requestAnimationFrame(e) : e();
  }
}
function p(m = document, e = window) {
  const t = new g(m, e);
  return t.initialize() ? t : null;
}
export {
  g as DenViewerManager,
  p as setupDenViewer
};
//# sourceMappingURL=den-viewer.js.map
