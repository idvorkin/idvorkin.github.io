const W = "del, .rd-removed, .rd-li-removed, .rd-note, .rd-summary, script, style", F = "ins, .rd-added, .rd-li-added", U = "p, li, h1, h2, h3, h4, h5, h6, blockquote, pre, td, th, dt, dd, figcaption, tr, div";
function Y(e) {
  const r = [];
  let n = "", s = null;
  const t = e.ownerDocument.createTreeWalker(
    e,
    4
    /* NodeFilter.SHOW_TEXT */
  );
  for (let o = t.nextNode(); o; o = t.nextNode()) {
    const i = o.parentElement;
    if (!i || i.closest(W)) continue;
    const a = i.closest(U);
    n && a !== s && !/\s$/.test(n) && !/^\s/.test(o.data) && (n += `
`), s = a, r.push({ node: o, at: n.length }), n += o.data;
  }
  return { text: n, pieces: r };
}
function O(e, r, n, s) {
  const t = (n.ownerDocument ?? document).createRange();
  t.setStart(n, s), t.collapse(!0);
  for (const { node: o, at: i } of e) {
    if (o === n) return i + s;
    if (t.comparePoint(o, 0) >= 0) return i;
  }
  return r;
}
function G(e) {
  const r = e.ownerDocument.createRange();
  return r.selectNodeContents(e), r.toString();
}
const V = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $ = (e) => e.replace(/\s+/g, "");
function Q(e, r) {
  let n = 0;
  for (; n < e.length && n < r.length && e[e.length - 1 - n] === r[r.length - 1 - n]; ) n++;
  return n;
}
function X(e, r) {
  let n = 0;
  for (; n < e.length && n < r.length && e[n] === r[n]; ) n++;
  return n;
}
function J(e, r, n, s) {
  const t = r.trim().split(/\s+/).filter(Boolean);
  if (!t.length) return null;
  const o = new RegExp(t.map(V).join("\\s*"), "g"), i = { before: $(n), after: $(s) };
  let a = null, l = -1;
  for (let d = o.exec(e); d; d = o.exec(e)) {
    const u = d.index, m = u + d[0].length, p = Q($(e.slice(Math.max(0, u - 200), u)), i.before) + X($(e.slice(m, m + 200)), i.after);
    p > l && (a = [u, m], l = p), d[0].length || o.lastIndex++;
  }
  return a;
}
function Z(e, r, n, s = 30) {
  const t = e.cloneRange();
  r.contains(t.startContainer) || t.setStart(r, 0), r.contains(t.endContainer) || t.setEnd(r, r.childNodes.length);
  const { text: o, pieces: i } = Y(r), a = O(i, o.length, t.startContainer, t.startOffset), l = O(i, o.length, t.endContainer, t.endOffset), d = o.slice(a, l);
  if (!d.trim()) return null;
  let u = 0, m = 0;
  for (const { node: f, at: h } of i) {
    const b = Math.max(a, h), w = Math.min(l, h + f.data.length);
    if (b >= w) continue;
    const v = $(f.data.slice(b - h, w - h)).length;
    u += v, f.parentElement?.closest(F) && (m += v);
  }
  const p = m === 0 ? "none" : m === u ? "all" : "some", g = G(n), k = J(g, d, o.slice(Math.max(0, a - 200), a), o.slice(l, l + 200));
  if (!k)
    return {
      quote: d,
      prefix: o.slice(Math.max(0, a - s), a),
      suffix: o.slice(l, l + s),
      diff: { inserted: p, anchoredTo: "diff-view" }
    };
  const [x, c] = k;
  return {
    quote: g.slice(x, c),
    prefix: g.slice(Math.max(0, x - s), x),
    suffix: g.slice(c, c + s),
    diff: { inserted: p, anchoredTo: "page" }
  };
}
const ee = { added: "#1a7f37", removed: "#cf222e", changed: "#bf8700" }, te = `
#rd-nav{position:fixed;right:20px;bottom:20px;z-index:1001;display:flex;align-items:center;gap:6px;background:#24292f;color:#fff;border-radius:8px;padding:6px 8px;font:600 13px/1.2 system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25)}
#rd-nav button{background:#444c56;color:#fff;border:0;border-radius:5px;padding:5px 10px;font:inherit;cursor:pointer;min-width:36px}
#rd-nav button:hover{background:#57606a}
#rd-nav .rd-count{min-width:9.5em;text-align:center}
#rd-nav .rd-seen-count{display:block;font-weight:400;font-size:11px;opacity:.8}
#rd-nav .rd-keys{font-weight:400;font-size:11px;opacity:.6}
#rd-map{position:fixed;right:0;top:100px;bottom:16px;width:12px;z-index:1000;background:rgba(175,184,193,.25)}
#rd-map .rd-tick{position:absolute;left:1px;right:1px;min-height:3px;border-radius:1px;cursor:pointer;opacity:.55}
#rd-map .rd-tick.rd-tick-seen{background:#8c959f !important;opacity:.7}
#rd-map .rd-tick.rd-tick-current{opacity:1;left:-3px;box-shadow:0 0 0 1px #fff}
.rd-flash{animation:rd-flash 1.2s ease-out}
@keyframes rd-flash{0%{box-shadow:0 0 0 4px #0969da}100%{box-shadow:0 0 0 4px rgba(9,105,218,0)}}
@media (max-width:600px){
  #rd-nav{left:0;right:0;bottom:0;border-radius:0;justify-content:space-between;padding:8px 10px}
  #rd-nav button{padding:8px 14px}
  #rd-nav .rd-keys{display:none}
  #rd-map{bottom:52px;width:8px}
}
`;
function ne(e, r = document) {
  const n = r.defaultView, s = /* @__PURE__ */ new Set();
  let t = -1;
  if (!r.getElementById("rd-nav-style")) {
    const c = r.createElement("style");
    c.id = "rd-nav-style", c.textContent = te, r.head.appendChild(c);
  }
  const o = r.createElement("div");
  o.id = "rd-nav", o.innerHTML = '<button type="button" data-rd="prev" title="Previous change (p / k)">‹</button><span class="rd-count"></span><button type="button" data-rd="next" title="Next change (n / j)">›</button><span class="rd-keys">n/p</span>';
  const i = o.querySelector(".rd-count"), a = r.createElement("div");
  a.id = "rd-map";
  const l = e.map((c, f) => {
    const h = r.createElement("div");
    return h.className = "rd-tick", h.style.background = ee[c.kind], h.title = `${c.kind} — change ${f + 1}`, h.onclick = () => m(f), a.appendChild(h), h;
  });
  function d() {
    const c = Math.max(r.documentElement.scrollHeight, 1);
    e.forEach((f, h) => {
      const b = f.el.getBoundingClientRect();
      l[h].style.top = `${(b.top + n.scrollY) / c * 100}%`, l[h].style.height = `${b.height / c * 100}%`;
    });
  }
  function u() {
    const c = e.length, f = t < 0 ? `${c} change${c === 1 ? "" : "s"}` : `change ${t + 1} of ${c}`, h = s.size === c ? `all ${c} seen ✓` : `${s.size} of ${c} seen`;
    i.innerHTML = `${f}<span class="rd-seen-count">${h}</span>`, l.forEach((b, w) => {
      b.classList.toggle("rd-tick-seen", s.has(w) && w !== t), b.classList.toggle("rd-tick-current", w === t);
    });
  }
  function m(c) {
    if (!e.length) return;
    t = (c % e.length + e.length) % e.length;
    const f = e[t].el;
    s.add(t);
    const h = f.getBoundingClientRect().top + n.scrollY - n.innerHeight / 3;
    n.scrollTo({ top: Math.max(0, h), behavior: "smooth" }), f.classList.remove("rd-flash"), f.offsetWidth, f.classList.add("rd-flash"), u();
  }
  const p = () => m(t + 1), g = () => m(t < 0 ? e.length - 1 : t - 1);
  o.addEventListener("click", (c) => {
    const f = c.target.closest("button")?.dataset.rd;
    f === "next" && p(), f === "prev" && g();
  });
  const k = (c) => {
    if (!(c.metaKey || c.ctrlKey || c.altKey || c.target?.closest?.("input, textarea, select, [contenteditable]"))) {
      if (c.key === "n" || c.key === "j") p();
      else if (c.key === "p" || c.key === "k") g();
      else return;
      c.preventDefault();
    }
  };
  r.addEventListener("keydown", k), n.addEventListener("resize", d), r.body.append(o, a), d();
  const x = n.setTimeout(d, 1500);
  return u(), {
    go: m,
    next: p,
    prev: g,
    dispose() {
      r.removeEventListener("keydown", k), n.removeEventListener("resize", d), n.clearTimeout(x), o.remove(), a.remove();
    }
  };
}
const oe = "https://idvork.in", re = "/_diff-base", se = (e) => re + (e.replace(/\/+$/, "") || "/"), S = "script, style, svg, canvas, iframe, video, audio, object", H = (e) => e.replace(/\s+/g, " ").trim();
function ie(e) {
  const r = typeof window > "u" ? "" : window.location.origin;
  let n = e.split(oe).join("");
  return r && (n = n.split(r).join("")), H(n);
}
function y(e) {
  return e.matches(S) || !!e.querySelector(S);
}
function R(e) {
  return e ? Array.from(e.children).filter((r) => !r.hasAttribute("data-pagefind-ignore")) : [];
}
function j(e) {
  return `${e.tagName}|${y(e) ? ie(e.outerHTML) : H(e.textContent || "")}`;
}
function _(e, r, n = (s, t) => s === t) {
  const s = e.length, t = r.length, o = Array.from({ length: s + 1 }, () => new Uint32Array(t + 1));
  for (let d = s - 1; d >= 0; d--)
    for (let u = t - 1; u >= 0; u--)
      o[d][u] = n(e[d], r[u]) ? o[d + 1][u + 1] + 1 : Math.max(o[d + 1][u], o[d][u + 1]);
  const i = [];
  let a = 0, l = 0;
  for (; a < s && l < t; )
    n(e[a], r[l]) ? (i.push([a, l]), a++, l++) : o[a + 1][l] >= o[a][l + 1] ? a++ : l++;
  return i;
}
const N = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu, z = (e) => e.match(N) || [];
function ae(e, r) {
  const n = new Set(z(e.toLowerCase()).filter((o) => o.trim())), s = new Set(z(r.toLowerCase()).filter((o) => o.trim()));
  if (!n.size || !s.size) return 0;
  let t = 0;
  for (const o of n) s.has(o) && t++;
  return t / Math.min(n.size, s.size);
}
const ce = 0.5;
function q(e, r) {
  const n = e.map(j), s = r.map(j), t = _(n, s);
  t.push([e.length, r.length]);
  const o = [];
  let i = 0, a = 0;
  for (const [l, d] of t) {
    const u = e.slice(i, l), m = r.slice(a, d);
    o.push(...de(u, m)), l < e.length && o.push({ kind: "same", block: r[d] }), i = l + 1, a = d + 1;
  }
  return o;
}
function de(e, r) {
  const n = [];
  let s = 0;
  for (const t of r) {
    let o = -1;
    for (let i = s; i < e.length; i++) {
      const a = e[i];
      if (!(a.tagName !== t.tagName || y(a) !== y(t)) && (y(a) || ae(a.textContent || "", t.textContent || "") >= ce)) {
        o = i;
        break;
      }
    }
    if (o < 0) {
      n.push({ kind: "added", block: t });
      continue;
    }
    for (; s < o; ) n.push({ kind: "removed", block: e[s++] });
    n.push({ kind: "changed", old: e[s++], block: t });
  }
  for (; s < e.length; ) n.push({ kind: "removed", block: e[s++] });
  return n;
}
function P(e) {
  const r = [], n = e.ownerDocument.createTreeWalker(
    e,
    4
    /* NodeFilter.SHOW_TEXT */
  );
  for (let s = n.nextNode(); s; s = n.nextNode())
    if (!s.parentElement?.closest("script, style")) {
      N.lastIndex = 0;
      for (let t = N.exec(s.data); t; t = N.exec(s.data))
        r.push({ text: t[0], node: s, start: t.index, end: t.index + t[0].length });
    }
  return r;
}
const A = (e) => !e.trim(), le = 4e6;
function B(e, r) {
  const n = P(e), s = P(r), t = n.flatMap((p, g) => A(p.text) ? [] : [g]), o = s.flatMap((p, g) => A(p.text) ? [] : [g]);
  if (t.length * o.length > le) return !1;
  const i = _(
    t.map((p) => n[p].text),
    o.map((p) => s[p].text)
  );
  i.push([t.length, o.length]);
  const a = /* @__PURE__ */ new Map(), l = (p) => (a.has(p) || a.set(p, { ins: [], del: [] }), a.get(p)), d = r.ownerDocument;
  let u = 0, m = 0;
  for (const [p, g] of i) {
    const k = m < g ? s.slice(o[m], o[g - 1] + 1) : [];
    if (u < p) {
      const x = n.slice(t[u], t[p - 1] + 1).map((h) => h.text).join(""), c = s[o[m]], f = s[o[o.length - 1]];
      c ? l(c.node).del.push([c.start, k.length ? `${x} ` : x]) : f ? l(f.node).del.push([f.end, ` ${x}`]) : r.appendChild(Object.assign(d.createElement("del"), { textContent: x }));
    }
    for (const x of k) {
      const c = l(x.node).ins, f = c[c.length - 1];
      f && f[1] === x.start ? f[1] = x.end : c.push([x.start, x.end]);
    }
    u = p + 1, m = g + 1;
  }
  for (const [p, { ins: g, del: k }] of a) {
    const x = p.data, c = /* @__PURE__ */ new Set([0, x.length, ...k.map(([b]) => b)]);
    for (const [b, w] of g) c.add(b).add(w);
    const f = Array.from(c).sort((b, w) => b - w), h = d.createDocumentFragment();
    for (let b = 0; b < f.length; b++) {
      const w = f[b];
      for (const [T, M] of k)
        T === w && h.appendChild(Object.assign(d.createElement("del"), { textContent: M }));
      const v = f[b + 1];
      if (v === void 0 || v === w) continue;
      const D = x.slice(w, v), K = g.some(([T, M]) => T <= w && v <= M);
      h.appendChild(
        K ? Object.assign(d.createElement("ins"), { textContent: D }) : d.createTextNode(D)
      );
    }
    p.replaceWith(h);
  }
  return !0;
}
const fe = `
#rich-diff-view .rd-summary{background:#f6f8fa;border:1px solid #d0d7de;border-radius:6px;padding:6px 10px;margin:0 0 16px;font-size:14px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
#rich-diff-view .rd-summary .rd-add{color:#1a7f37;font-weight:600}
#rich-diff-view .rd-summary .rd-del{color:#cf222e;font-weight:600}
#rich-diff-view .rd-summary .rd-chg{color:#9a6700;font-weight:600}
#rich-diff-view .rd-block{border-left:4px solid transparent;padding:2px 0 2px 10px;margin-left:-14px;margin-bottom:1em}
#rich-diff-view .rd-block>*:last-child{margin-bottom:0}
#rich-diff-view .rd-added{border-color:#1a7f37;background:#dafbe1}
#rich-diff-view .rd-removed{border-color:#cf222e;background:#ffebe9;text-decoration:line-through;text-decoration-color:#cf222e80;opacity:.85}
#rich-diff-view .rd-changed{border-color:#bf8700}
#rich-diff-view .rd-note{display:block;font:600 11px/1.6 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#57606a;text-decoration:none}
#rich-diff-view .rd-li-added{background:#dafbe1}
#rich-diff-view .rd-li-removed{background:#ffebe9;text-decoration:line-through;text-decoration-color:#cf222e80}
#rich-diff-view ins{background:#abf2bc;text-decoration:none;border-radius:2px}
#rich-diff-view del{background:#ffcecb;color:#82071e;text-decoration:line-through;border-radius:2px}
`;
function C(e, r, n, s) {
  const t = e.createElement("div");
  if (t.className = `rd-block ${r}`, s) {
    const o = e.createElement("span");
    o.className = "rd-note", o.textContent = s, t.appendChild(o);
  }
  return t.appendChild(e.importNode(n, !0)), t;
}
function pe(e, r, n) {
  const s = e.importNode(n, !1);
  for (const t of q(Array.from(r.children), Array.from(n.children))) {
    const o = e.importNode(t.block, !0);
    t.kind === "changed" && !y(t.old) && !y(t.block) && B(t.old, o), t.kind !== "same" && o.classList.add(`rd-li-${t.kind}`), s.appendChild(o);
  }
  return s;
}
function ue(e, r) {
  const n = e.createElement("div");
  n.id = "rich-diff-view";
  const s = { added: 0, removed: 0, changed: 0 }, t = [], o = (i, a) => {
    s[i]++, t.push({ kind: i, el: a }), n.appendChild(a);
  };
  for (const i of r) {
    if (i.kind === "same") {
      n.appendChild(e.importNode(i.block, !0));
      continue;
    }
    if (i.kind === "added") o("added", C(e, "rd-added", i.block));
    else if (i.kind === "removed") o("removed", C(e, "rd-removed", i.block));
    else if (/^(UL|OL)$/.test(i.block.tagName))
      o("changed", C(e, "rd-changed", pe(e, i.old, i.block)));
    else {
      const a = e.importNode(i.block, !0), d = !(y(i.old) || y(i.block)) && B(i.old, a);
      o("changed", C(e, "rd-changed", a, d ? void 0 : "changed block (not diffed word by word)"));
    }
  }
  return { view: n, counts: s, changes: t };
}
async function I(e) {
  let r;
  try {
    r = await fetch(e, { cache: "no-store" });
  } catch (s) {
    throw new Error(`fetching ${e}: ${s.message}`);
  }
  if (!r.ok) return { status: r.status, body: null };
  const n = new DOMParser().parseFromString(await r.text(), "text/html");
  return { status: r.status, body: n.getElementById("content-holder") };
}
let L = null, E = null;
async function he(e) {
  const r = document.getElementById("content-holder");
  if (!r) return !1;
  if (L)
    return L.remove(), L = null, E?.dispose(), E = null, r.style.display = "", !1;
  if (!document.getElementById("rich-diff-style")) {
    const i = document.createElement("style");
    i.id = "rich-diff-style", i.textContent = fe, document.head.appendChild(i);
  }
  window.blogAnnotateDiffSelector = Z;
  const n = window.location.pathname, s = se(n), t = document.createElement("div");
  t.className = "rd-summary";
  let o;
  try {
    const [i, a] = await Promise.all([I(n), I(s)]);
    if (!i.body) throw new Error(`couldn't reload this page, ${n} (HTTP ${i.status})`);
    const l = a.status === 404;
    if (!a.body && !l) throw new Error(`main-branch copy ${s} returned HTTP ${a.status}`);
    const d = q(R(a.body), R(i.body)), u = ue(document, d);
    o = u.view;
    const { added: m, removed: p, changed: g } = u.counts, k = l ? "main" : `<a href="${s}" target="_blank">main</a>`;
    t.innerHTML = `<span>Rendered diff vs ${k}${l ? " — <b>new page</b>" : ""}</span><span class="rd-add">+${m} added</span><span class="rd-del">−${p} removed</span><span class="rd-chg">~${g} changed</span>`, e && (t.innerHTML += `<a href="${e}/files" target="_blank">source diff</a>`), u.changes.length ? E = ne(u.changes) : t.innerHTML += "<span>No rendered changes.</span>";
  } catch (i) {
    o = document.createElement("div"), o.id = "rich-diff-view", t.textContent = `Diff vs main failed: ${i.message}`;
  }
  return o.prepend(t), r.before(o), r.style.display = "none", L = o, E ? E.next() : (t.scrollIntoView({ block: "start" }), window.scrollBy(0, -110)), !0;
}
export {
  re as DIFF_BASE,
  oe as PROD_ORIGIN,
  se as baseUrl,
  q as diffBlocks,
  R as extractBlocks,
  y as isOpaque,
  _ as lcsPairs,
  B as markWordDiff,
  ue as renderDiff,
  ae as similarity,
  he as toggleRichDiff,
  z as tokenize
};
//# sourceMappingURL=rich-diff.js.map
