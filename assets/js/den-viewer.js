function x(l) {
  return !!l.img;
}
function m(l) {
  return x(l) ? l.panels.length : l.panels.length - 1;
}
function g(l, e) {
  return x(l) && e === l.panels.length;
}
function b(l) {
  return l.label ?? `#${l.num} — ${l.title}`;
}
class v {
  constructor(e = document, t = window) {
    this.doc = e, this.browserWindow = t, this.active = null, this.closeTimer = null, this.currentLayer = 0, this.dotsFor = null, this.elements = null, this.imageLayers = [], this.imageToken = 0, this.initialized = !1, this.manifest = /* @__PURE__ */ new Map(), this.opener = null, this.preloaded = /* @__PURE__ */ new Set(), this.reduceMotion = this.browserWindow.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  }
  initialize() {
    if (this.initialized) return !0;
    const e = this.doc.getElementById("den-manifest"), t = this.findElements();
    if (!e || !t) return !1;
    const i = this.readManifest(e.textContent ?? "");
    return i ? (this.elements = t, i.forEach((s) => this.manifest.set(String(s.num), s)), this.bindStripOpeners(), this.bindControls(), this.initialized = !0, !0) : !1;
  }
  findElements() {
    const e = this.doc.getElementById("den-lightbox");
    if (!e) return null;
    const t = e.querySelector(".den-lightbox__dialog"), i = e.querySelector(".den-lightbox__stage"), s = e.querySelector(".den-lightbox__title"), o = e.querySelector(".den-lightbox__close"), n = e.querySelector(".den-lightbox__previous"), a = e.querySelector(".den-lightbox__next"), d = e.querySelector(".den-lightbox__image-shell"), u = e.querySelector(".den-lightbox__tap-previous"), h = e.querySelector(".den-lightbox__tap-next"), r = e.querySelector(".den-lightbox__counter"), c = e.querySelector(".den-lightbox__dots"), f = e.querySelector(".den-lightbox__date"), p = e.querySelector(".den-lightbox__receipts");
    return !t || !i || !s || !o || !n || !a || !d || !u || !h || !r || !c || !f || !p ? null : {
      lightbox: e,
      dialog: t,
      stage: i,
      title: s,
      closeButton: o,
      previousButton: n,
      nextButton: a,
      imageShell: d,
      tapPrevious: u,
      tapNext: h,
      counter: r,
      dots: c,
      date: f,
      receipts: p
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
      t && e.querySelectorAll("[data-den-panel]").forEach((i) => this.bindOpener(t, i));
    }), this.doc.querySelectorAll("[data-den-open][data-den-panel]").forEach((e) => {
      const t = this.manifest.get(e.dataset.denOpen ?? "");
      t && this.bindOpener(t, e);
    });
  }
  bindOpener(e, t) {
    const i = Number(t.dataset.denPanel) - 1;
    !Number.isInteger(i) || i < 0 || i >= e.panels.length || (t instanceof HTMLButtonElement || (t.setAttribute("role", "button"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-haspopup", "dialog"), t.style.cursor = "pointer", t.addEventListener("keydown", (s) => {
      s.key !== "Enter" && s.key !== " " || (s.preventDefault(), this.open(e, i, t));
    })), t.addEventListener("click", () => this.open(e, i, t)));
  }
  buildDots(e) {
    if (!(!this.elements || this.dotsFor === e)) {
      this.dotsFor = e, this.elements.dots.replaceChildren();
      for (let t = 0; t <= m(e); t++) {
        const i = this.doc.createElement("button"), s = g(e, t), o = s ? "Full strip" : e.captions?.[t] ?? `Panel ${t + 1}`;
        i.type = "button", i.className = `den-lightbox__dot${s ? " den-lightbox__dot--all" : ""}`, i.setAttribute("aria-label", o), i.title = o, i.addEventListener("click", () => this.render(t)), this.elements.dots.appendChild(i);
      }
    }
  }
  bindControls() {
    if (!this.elements) return;
    const { closeButton: e, previousButton: t, nextButton: i, tapPrevious: s, tapNext: o, imageShell: n } = this.elements;
    e.addEventListener("click", () => this.close()), t.addEventListener("click", () => this.step(-1)), i.addEventListener("click", () => this.step(1));
    let a = 0;
    s.addEventListener("click", () => {
      Date.now() >= a && this.step(-1);
    }), o.addEventListener("click", () => {
      Date.now() >= a && this.step(1);
    });
    let d = 0, u = 0, h = !1;
    n.addEventListener("pointerdown", (r) => {
      d = r.clientX, u = r.clientY, h = !0;
    }), n.addEventListener("pointercancel", () => {
      h = !1;
    }), n.addEventListener("pointerup", (r) => {
      if (!h) return;
      h = !1;
      const c = r.clientX - d, f = r.clientY - u;
      Math.abs(c) <= 40 || Math.abs(c) <= Math.abs(f) || (a = Date.now() + 400, this.step(c < 0 ? 1 : -1));
    }), this.elements.lightbox.addEventListener("click", (r) => {
      (r.target === this.elements?.lightbox || r.target === this.elements?.dialog || r.target === this.elements?.stage) && this.close();
    }), this.doc.addEventListener("keydown", (r) => this.handleKeydown(r));
  }
  open(e, t, i) {
    this.elements && (this.closeTimer !== null && this.browserWindow.clearTimeout(this.closeTimer), this.opener = i, this.active = { entry: e, step: t }, this.buildDots(e), this.elements.lightbox.hidden = !1, this.doc.documentElement.classList.add("den-lightbox-open"), this.doc.body.classList.add("den-lightbox-open"), this.render(t), this.nextFrame(() => {
      !this.active || !this.elements || (this.elements.lightbox.classList.add("is-open"), this.elements.closeButton.focus({ preventScroll: !0 }));
    }));
  }
  render(e) {
    if (!this.active || !this.elements || e < 0 || e > m(this.active.entry)) return;
    this.active.step = e;
    const { entry: t } = this.active, i = g(t, e), s = i ? b(t) : t.captions?.[e] ?? b(t), o = e === 0, n = e === m(t);
    this.elements.title.textContent = s, this.elements.lightbox.setAttribute("aria-label", `Comic viewer: ${s}`), this.elements.lightbox.dataset.denStrip = String(t.num), this.elements.lightbox.dataset.denStep = i ? "all" : String(e + 1), this.elements.counter.textContent = i ? "full strip" : `panel ${e + 1} of ${t.panels.length}`, this.elements.date.textContent = t.date ?? "", this.elements.previousButton.disabled = o, this.elements.tapPrevious.disabled = o, this.elements.nextButton.disabled = n, this.elements.tapNext.disabled = n, t.receipts_url ? (this.elements.receipts.href = t.receipts_url, this.elements.receipts.hidden = !1) : (this.elements.receipts.removeAttribute("href"), this.elements.receipts.hidden = !0), this.elements.dots.querySelectorAll(".den-lightbox__dot").forEach((a, d) => {
      d === e ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
    }), this.showImage(t, e), this.preload(t, e - 1), this.preload(t, e + 1);
  }
  step(e) {
    if (!this.active) return;
    const t = this.active.step + e;
    t < 0 || t > m(this.active.entry) || this.render(t);
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
    const s = this.imageLayers[this.currentLayer], o = s.getAttribute("src") ? 1 - this.currentLayer : this.currentLayer, n = this.imageLayers[o], a = g(e, t), d = ++this.imageToken;
    this.imageLayers.forEach((c) => {
      c.classList.remove("is-current", "is-outgoing"), c.removeAttribute("data-den-current"), c.alt = "";
    }), s.getAttribute("src") && s !== n && s.classList.add("is-outgoing");
    const u = e.label ?? `The Den #${e.num}`, h = e.captions?.[t];
    n.alt = a ? `${u}, full strip` : h ? `${u}: ${h}` : `${u}, panel ${t + 1} of ${e.panels.length}`, n.width = a ? 1600 : 800, n.height = a ? 1600 : 800, n.dataset.denCurrent = "true";
    const r = () => {
      d === this.imageToken && (n.classList.add("is-current"), s.classList.remove("is-outgoing"), this.currentLayer = o);
    };
    n.onload = r, n.setAttribute("src", i), n.complete && n.naturalWidth && r();
  }
  fileFor(e, t) {
    return g(e, t) ? e.img : e.panels[t];
  }
  preload(e, t) {
    if (t < 0 || t > m(e)) return;
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
function y(l = document, e = window) {
  const t = new v(l, e);
  return t.initialize() ? t : null;
}
export {
  v as DenViewerManager,
  y as setupDenViewer
};
//# sourceMappingURL=den-viewer.js.map
