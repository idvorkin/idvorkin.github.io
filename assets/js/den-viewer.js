function x(s, e = window.location) {
  return `${e.origin}${e.pathname}#${s.id}`;
}
function v(s, e = document) {
  const t = s.startsWith("#") ? s.slice(1) : s;
  if (!t) return null;
  const i = e.getElementById(t);
  return i instanceof HTMLVideoElement && i.hasAttribute("data-den-video") ? i : null;
}
async function S(s) {
  try {
    await s.play();
  } catch (e) {
    if (e?.name !== "NotAllowedError") throw e;
    s.muted = !0, await s.play();
  }
}
function E(s = navigator) {
  if (typeof s.share != "function") return !1;
  const e = s.userAgent;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(e) || /Macintosh/.test(e) && s.maxTouchPoints > 1;
}
async function L(s, e) {
  const t = e.defaultView?.navigator;
  if (t?.clipboard?.writeText)
    try {
      await t.clipboard.writeText(s);
      return;
    } catch {
    }
  const i = e.createElement("textarea");
  i.value = s, i.setAttribute("readonly", ""), i.style.position = "fixed", i.style.opacity = "0", e.body.appendChild(i), i.select();
  const n = e.execCommand("copy");
  if (i.remove(), !n) throw new Error("copy failed");
}
function b(s, e) {
  let t = s.querySelector(".den-video-toast");
  t || (t = s.createElement("div"), t.className = "den-video-toast", t.setAttribute("role", "status"), t.setAttribute("aria-live", "polite"), s.body.appendChild(t)), t.textContent = e, t.classList.add("is-visible");
  const i = s.defaultView ?? window;
  i.clearTimeout(Number(t.dataset.timer)), t.dataset.timer = String(i.setTimeout(() => t?.classList.remove("is-visible"), 1800));
}
async function _(s, e = document) {
  const t = e.defaultView ?? window, i = x(s, t.location);
  if (E(t.navigator))
    try {
      return await t.navigator.share({ title: s.dataset.denTitle || e.title, url: i }), "shared";
    } catch (n) {
      if (n?.name === "AbortError") return "shared";
      console.log("📱 Share sheet failed, copying the link instead", n);
    }
  try {
    await L(i, e), b(e, "Copied");
  } catch (n) {
    console.error("📋 Couldn't copy the Den video link", n), b(e, "Couldn't copy the link");
  }
  return "copied";
}
function k(s = document, e = window) {
  s.querySelectorAll("[data-den-video-share]").forEach((i) => {
    const n = s.getElementById(i.dataset.denVideoShare ?? "");
    n instanceof HTMLVideoElement && i.addEventListener("click", () => {
      _(n, s);
    });
  });
  const t = () => {
    const i = v(e.location.hash, s);
    i && S(i).catch((n) => console.warn("🎬 Couldn't start the linked Den video", n));
  };
  e.addEventListener("hashchange", t), t();
}
const A = 40;
function w(s) {
  return !!s.img;
}
function m(s) {
  return w(s) ? s.panels.length : s.panels.length - 1;
}
function p(s, e) {
  return w(s) && e === s.panels.length;
}
function y(s) {
  return s.label ?? `#${s.num} — ${s.title}`;
}
class T {
  constructor(e = document, t = window) {
    this.doc = e, this.browserWindow = t, this.active = null, this.closeTimer = null, this.currentLayer = 0, this.dotsFor = null, this.elements = null, this.imageLayers = [], this.imageToken = 0, this.initialized = !1, this.manifest = /* @__PURE__ */ new Map(), this.opener = null, this.preloaded = /* @__PURE__ */ new Set(), this.reduceMotion = this.browserWindow.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  }
  initialize() {
    if (this.initialized) return !0;
    const e = this.doc.getElementById("den-manifest"), t = this.findElements();
    if (!e || !t) return !1;
    const i = this.readManifest(e.textContent ?? "");
    return i ? (this.elements = t, i.forEach((n) => this.manifest.set(String(n.num), n)), this.bindStripOpeners(), this.bindControls(), this.initialized = !0, !0) : !1;
  }
  findElements() {
    const e = this.doc.getElementById("den-lightbox");
    if (!e) return null;
    const t = e.querySelector(".den-lightbox__dialog"), i = e.querySelector(".den-lightbox__stage"), n = e.querySelector(".den-lightbox__title"), l = e.querySelector(".den-lightbox__close"), r = e.querySelector(".den-lightbox__previous"), a = e.querySelector(".den-lightbox__next"), h = e.querySelector(".den-lightbox__image-shell"), u = e.querySelector(".den-lightbox__tap-previous"), c = e.querySelector(".den-lightbox__tap-next"), o = e.querySelector(".den-lightbox__counter"), d = e.querySelector(".den-lightbox__dots"), f = e.querySelector(".den-lightbox__date"), g = e.querySelector(".den-lightbox__receipts");
    return !t || !i || !n || !l || !r || !a || !h || !u || !c || !o || !d || !f || !g ? null : {
      lightbox: e,
      dialog: t,
      stage: i,
      title: n,
      closeButton: l,
      previousButton: r,
      nextButton: a,
      imageShell: h,
      tapPrevious: u,
      tapNext: c,
      counter: o,
      dots: d,
      date: f,
      receipts: g
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
    !Number.isInteger(i) || i < 0 || i >= e.panels.length || (t instanceof HTMLButtonElement || (t.setAttribute("role", "button"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-haspopup", "dialog"), t.style.cursor = "pointer", t.addEventListener("keydown", (n) => {
      n.key !== "Enter" && n.key !== " " || (n.preventDefault(), this.open(e, i, t));
    })), t.addEventListener("click", () => this.open(e, i, t)));
  }
  buildDots(e) {
    if (!(!this.elements || this.dotsFor === e)) {
      this.dotsFor = e, this.elements.dots.replaceChildren();
      for (let t = 0; t <= m(e); t++) {
        const i = this.doc.createElement("button"), n = p(e, t), l = n ? "Full strip" : e.captions?.[t] ?? `Panel ${t + 1}`;
        i.type = "button", i.className = `den-lightbox__dot${n ? " den-lightbox__dot--all" : ""}`, i.setAttribute("aria-label", l), i.title = l, i.addEventListener("click", () => this.render(t)), this.elements.dots.appendChild(i);
      }
    }
  }
  bindControls() {
    if (!this.elements) return;
    const { closeButton: e, previousButton: t, nextButton: i, tapPrevious: n, tapNext: l, imageShell: r } = this.elements;
    e.addEventListener("click", () => this.close()), t.addEventListener("click", () => this.step(-1)), i.addEventListener("click", () => this.step(1));
    let a = 0;
    n.addEventListener("click", () => {
      Date.now() >= a && this.step(-1);
    }), l.addEventListener("click", () => {
      Date.now() >= a && this.step(1);
    });
    let h = 0, u = 0, c = !1;
    r.addEventListener("pointerdown", (o) => {
      h = o.clientX, u = o.clientY, c = !0;
    }), r.addEventListener("pointercancel", () => {
      c = !1;
    }), r.addEventListener("pointerup", (o) => {
      if (!c) return;
      c = !1;
      const d = o.clientX - h, f = o.clientY - u;
      Math.abs(d) <= A || Math.abs(d) <= Math.abs(f) || (a = Date.now() + 400, this.step(d < 0 ? 1 : -1));
    }), this.elements.lightbox.addEventListener("click", (o) => {
      (o.target === this.elements?.lightbox || o.target === this.elements?.dialog || o.target === this.elements?.stage) && this.close();
    }), this.doc.addEventListener("keydown", (o) => this.handleKeydown(o));
  }
  open(e, t, i) {
    this.elements && (this.closeTimer !== null && this.browserWindow.clearTimeout(this.closeTimer), this.opener = i, this.active = { entry: e, step: t }, this.buildDots(e), this.elements.lightbox.hidden = !1, this.doc.documentElement.classList.add("den-lightbox-open"), this.doc.body.classList.add("den-lightbox-open"), this.render(t), this.nextFrame(() => {
      !this.active || !this.elements || (this.elements.lightbox.classList.add("is-open"), this.elements.closeButton.focus({ preventScroll: !0 }));
    }));
  }
  render(e) {
    if (!this.active || !this.elements || e < 0 || e > m(this.active.entry)) return;
    this.active.step = e;
    const { entry: t } = this.active, i = p(t, e), n = i ? y(t) : t.captions?.[e] ?? y(t), l = e === 0, r = e === m(t);
    this.elements.title.textContent = n, this.elements.lightbox.setAttribute("aria-label", `Comic viewer: ${n}`), this.elements.lightbox.dataset.denStrip = String(t.num), this.elements.lightbox.dataset.denStep = i ? "all" : String(e + 1), this.elements.counter.textContent = i ? "full strip" : `panel ${e + 1} of ${t.panels.length}`, this.elements.date.textContent = t.date ?? "", this.elements.previousButton.disabled = l, this.elements.tapPrevious.disabled = l, this.elements.nextButton.disabled = r, this.elements.tapNext.disabled = r, t.receipts_url ? (this.elements.receipts.href = t.receipts_url, this.elements.receipts.hidden = !1) : (this.elements.receipts.removeAttribute("href"), this.elements.receipts.hidden = !0), this.elements.dots.querySelectorAll(".den-lightbox__dot").forEach((a, h) => {
      h === e ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
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
    const n = this.imageLayers[this.currentLayer], l = n.getAttribute("src") ? 1 - this.currentLayer : this.currentLayer, r = this.imageLayers[l], a = p(e, t), h = ++this.imageToken;
    this.imageLayers.forEach((d) => {
      d.classList.remove("is-current", "is-outgoing"), d.removeAttribute("data-den-current"), d.alt = "";
    }), n.getAttribute("src") && n !== r && n.classList.add("is-outgoing");
    const u = e.label ?? `The Den #${e.num}`, c = e.captions?.[t];
    r.alt = a ? `${u}, full strip` : c ? `${u}: ${c}` : `${u}, panel ${t + 1} of ${e.panels.length}`, r.width = a ? 1600 : 800, r.height = a ? 1600 : 800, r.dataset.denCurrent = "true";
    const o = () => {
      h === this.imageToken && (r.classList.add("is-current"), n.classList.remove("is-outgoing"), this.currentLayer = l);
    };
    r.onload = o, r.setAttribute("src", i), r.complete && r.naturalWidth && o();
  }
  fileFor(e, t) {
    return p(e, t) ? e.img : e.panels[t];
  }
  preload(e, t) {
    if (t < 0 || t > m(e)) return;
    const i = this.fileFor(e, t);
    if (!i || this.preloaded.has(i)) return;
    this.preloaded.add(i);
    const n = this.doc.createElement("img");
    n.src = i;
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
    ).filter((l) => l.offsetParent !== null);
    if (!t.length) return;
    const i = t[0], n = t[t.length - 1];
    e.shiftKey && this.doc.activeElement === i ? (n.focus(), e.preventDefault()) : !e.shiftKey && this.doc.activeElement === n && (i.focus(), e.preventDefault());
  }
  nextFrame(e) {
    this.browserWindow.requestAnimationFrame ? this.browserWindow.requestAnimationFrame(e) : e();
  }
}
function q(s = document, e = window) {
  const t = new T(s, e);
  return t.initialize() ? t : null;
}
export {
  T as DenViewerManager,
  k as setupDenVideos,
  q as setupDenViewer
};
//# sourceMappingURL=den-viewer.js.map
