const q = { added: "#1a7f37", removed: "#cf222e", changed: "#bf8700" }, B = `
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
function Y(e, o = document) {
  const r = o.defaultView, i = /* @__PURE__ */ new Set();
  let t = -1;
  if (!o.getElementById("rd-nav-style")) {
    const d = o.createElement("style");
    d.id = "rd-nav-style", d.textContent = B, o.head.appendChild(d);
  }
  const n = o.createElement("div");
  n.id = "rd-nav", n.innerHTML = '<button type="button" data-rd="prev" title="Previous change (p / k)">‹</button><span class="rd-count"></span><button type="button" data-rd="next" title="Next change (n / j)">›</button><span class="rd-keys">n/p</span>';
  const s = n.querySelector(".rd-count"), a = o.createElement("div");
  a.id = "rd-map";
  const p = e.map((d, c) => {
    const h = o.createElement("div");
    return h.className = "rd-tick", h.style.background = q[d.kind], h.title = `${d.kind} — change ${c + 1}`, h.onclick = () => b(c), a.appendChild(h), h;
  });
  function l() {
    const d = Math.max(o.documentElement.scrollHeight, 1);
    e.forEach((c, h) => {
      const g = c.el.getBoundingClientRect();
      p[h].style.top = `${(g.top + r.scrollY) / d * 100}%`, p[h].style.height = `${g.height / d * 100}%`;
    });
  }
  function u() {
    const d = e.length, c = t < 0 ? `${d} change${d === 1 ? "" : "s"}` : `change ${t + 1} of ${d}`, h = i.size === d ? `all ${d} seen ✓` : `${i.size} of ${d} seen`;
    s.innerHTML = `${c}<span class="rd-seen-count">${h}</span>`, p.forEach((g, v) => {
      g.classList.toggle("rd-tick-seen", i.has(v) && v !== t), g.classList.toggle("rd-tick-current", v === t);
    });
  }
  function b(d) {
    if (!e.length) return;
    t = (d % e.length + e.length) % e.length;
    const c = e[t].el;
    i.add(t);
    const h = c.getBoundingClientRect().top + r.scrollY - r.innerHeight / 3;
    r.scrollTo({ top: Math.max(0, h), behavior: "smooth" }), c.classList.remove("rd-flash"), c.offsetWidth, c.classList.add("rd-flash"), u();
  }
  const f = () => b(t + 1), m = () => b(t < 0 ? e.length - 1 : t - 1);
  n.addEventListener("click", (d) => {
    const c = d.target.closest("button")?.dataset.rd;
    c === "next" && f(), c === "prev" && m();
  });
  const y = (d) => {
    if (!(d.metaKey || d.ctrlKey || d.altKey || d.target?.closest?.("input, textarea, select, [contenteditable]"))) {
      if (d.key === "n" || d.key === "j") f();
      else if (d.key === "p" || d.key === "k") m();
      else return;
      d.preventDefault();
    }
  };
  o.addEventListener("keydown", y), r.addEventListener("resize", l), o.body.append(n, a), l();
  const x = r.setTimeout(l, 1500);
  return u(), {
    go: b,
    next: f,
    prev: m,
    dispose() {
      o.removeEventListener("keydown", y), r.removeEventListener("resize", l), r.clearTimeout(x), n.remove(), a.remove();
    }
  };
}
const A = "https://idvork.in", j = "script, style, svg, canvas, iframe, video, audio, object", I = (e) => e.replace(/\s+/g, " ").trim();
function U(e) {
  const o = typeof window > "u" ? "" : window.location.origin;
  let r = e.split(A).join("");
  return o && (r = r.split(o).join("")), I(r);
}
function k(e) {
  return e.matches(j) || !!e.querySelector(j);
}
function z(e) {
  return e ? Array.from(e.children).filter((o) => !o.hasAttribute("data-pagefind-ignore")) : [];
}
function O(e) {
  return `${e.tagName}|${k(e) ? U(e.outerHTML) : I(e.textContent || "")}`;
}
function P(e, o, r = (i, t) => i === t) {
  const i = e.length, t = o.length, n = Array.from({ length: i + 1 }, () => new Uint32Array(t + 1));
  for (let l = i - 1; l >= 0; l--)
    for (let u = t - 1; u >= 0; u--)
      n[l][u] = r(e[l], o[u]) ? n[l + 1][u + 1] + 1 : Math.max(n[l + 1][u], n[l][u + 1]);
  const s = [];
  let a = 0, p = 0;
  for (; a < i && p < t; )
    r(e[a], o[p]) ? (s.push([a, p]), a++, p++) : n[a + 1][p] >= n[a][p + 1] ? a++ : p++;
  return s;
}
const C = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu, D = (e) => e.match(C) || [];
function F(e, o) {
  const r = new Set(D(e.toLowerCase()).filter((n) => n.trim())), i = new Set(D(o.toLowerCase()).filter((n) => n.trim()));
  if (!r.size || !i.size) return 0;
  let t = 0;
  for (const n of r) i.has(n) && t++;
  return t / Math.min(r.size, i.size);
}
const G = 0.5;
function _(e, o) {
  const r = e.map(O), i = o.map(O), t = P(r, i);
  t.push([e.length, o.length]);
  const n = [];
  let s = 0, a = 0;
  for (const [p, l] of t) {
    const u = e.slice(s, p), b = o.slice(a, l);
    n.push(...V(u, b)), p < e.length && n.push({ kind: "same", block: o[l] }), s = p + 1, a = l + 1;
  }
  return n;
}
function V(e, o) {
  const r = [];
  let i = 0;
  for (const t of o) {
    let n = -1;
    for (let s = i; s < e.length; s++) {
      const a = e[s];
      if (!(a.tagName !== t.tagName || k(a) !== k(t)) && (k(a) || F(a.textContent || "", t.textContent || "") >= G)) {
        n = s;
        break;
      }
    }
    if (n < 0) {
      r.push({ kind: "added", block: t });
      continue;
    }
    for (; i < n; ) r.push({ kind: "removed", block: e[i++] });
    r.push({ kind: "changed", old: e[i++], block: t });
  }
  for (; i < e.length; ) r.push({ kind: "removed", block: e[i++] });
  return r;
}
function H(e) {
  const o = [], r = e.ownerDocument.createTreeWalker(
    e,
    4
    /* NodeFilter.SHOW_TEXT */
  );
  for (let i = r.nextNode(); i; i = r.nextNode())
    if (!i.parentElement?.closest("script, style")) {
      C.lastIndex = 0;
      for (let t = C.exec(i.data); t; t = C.exec(i.data))
        o.push({ text: t[0], node: i, start: t.index, end: t.index + t[0].length });
    }
  return o;
}
const S = (e) => !e.trim(), Q = 4e6;
function K(e, o) {
  const r = H(e), i = H(o), t = r.flatMap((f, m) => S(f.text) ? [] : [m]), n = i.flatMap((f, m) => S(f.text) ? [] : [m]);
  if (t.length * n.length > Q) return !1;
  const s = P(
    t.map((f) => r[f].text),
    n.map((f) => i[f].text)
  );
  s.push([t.length, n.length]);
  const a = /* @__PURE__ */ new Map(), p = (f) => (a.has(f) || a.set(f, { ins: [], del: [] }), a.get(f)), l = o.ownerDocument;
  let u = 0, b = 0;
  for (const [f, m] of s) {
    const y = b < m ? i.slice(n[b], n[m - 1] + 1) : [];
    if (u < f) {
      const x = r.slice(t[u], t[f - 1] + 1).map((h) => h.text).join(""), d = i[n[b]], c = i[n[n.length - 1]];
      d ? p(d.node).del.push([d.start, y.length ? `${x} ` : x]) : c ? p(c.node).del.push([c.end, ` ${x}`]) : o.appendChild(Object.assign(l.createElement("del"), { textContent: x }));
    }
    for (const x of y) {
      const d = p(x.node).ins, c = d[d.length - 1];
      c && c[1] === x.start ? c[1] = x.end : d.push([x.start, x.end]);
    }
    u = f + 1, b = m + 1;
  }
  for (const [f, { ins: m, del: y }] of a) {
    const x = f.data, d = /* @__PURE__ */ new Set([0, x.length, ...y.map(([g]) => g)]);
    for (const [g, v] of m) d.add(g).add(v);
    const c = Array.from(d).sort((g, v) => g - v), h = l.createDocumentFragment();
    for (let g = 0; g < c.length; g++) {
      const v = c[g];
      for (const [N, T] of y)
        N === v && h.appendChild(Object.assign(l.createElement("del"), { textContent: T }));
      const E = c[g + 1];
      if (E === void 0 || E === v) continue;
      const M = x.slice(v, E), W = m.some(([N, T]) => N <= v && E <= T);
      h.appendChild(
        W ? Object.assign(l.createElement("ins"), { textContent: M }) : l.createTextNode(M)
      );
    }
    f.replaceWith(h);
  }
  return !0;
}
const X = `
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
function $(e, o, r, i) {
  const t = e.createElement("div");
  if (t.className = `rd-block ${o}`, i) {
    const n = e.createElement("span");
    n.className = "rd-note", n.textContent = i, t.appendChild(n);
  }
  return t.appendChild(e.importNode(r, !0)), t;
}
function J(e, o, r) {
  const i = e.importNode(r, !1);
  for (const t of _(Array.from(o.children), Array.from(r.children))) {
    const n = e.importNode(t.block, !0);
    t.kind === "changed" && !k(t.old) && !k(t.block) && K(t.old, n), t.kind !== "same" && n.classList.add(`rd-li-${t.kind}`), i.appendChild(n);
  }
  return i;
}
function Z(e, o) {
  const r = e.createElement("div");
  r.id = "rich-diff-view";
  const i = { added: 0, removed: 0, changed: 0 }, t = [], n = (s, a) => {
    i[s]++, t.push({ kind: s, el: a }), r.appendChild(a);
  };
  for (const s of o) {
    if (s.kind === "same") {
      r.appendChild(e.importNode(s.block, !0));
      continue;
    }
    if (s.kind === "added") n("added", $(e, "rd-added", s.block));
    else if (s.kind === "removed") n("removed", $(e, "rd-removed", s.block));
    else if (/^(UL|OL)$/.test(s.block.tagName))
      n("changed", $(e, "rd-changed", J(e, s.old, s.block)));
    else {
      const a = e.importNode(s.block, !0), l = !(k(s.old) || k(s.block)) && K(s.old, a);
      n("changed", $(e, "rd-changed", a, l ? void 0 : "changed block (not diffed word by word)"));
    }
  }
  return { view: r, counts: i, changes: t };
}
async function R(e) {
  const o = await fetch(e, { cache: "no-store" });
  if (!o.ok) return { status: o.status, body: null };
  const r = new DOMParser().parseFromString(await o.text(), "text/html");
  return { status: o.status, body: r.getElementById("content-holder") };
}
let L = null, w = null;
async function ee(e) {
  const o = document.getElementById("content-holder");
  if (!o) return !1;
  if (L)
    return L.remove(), L = null, w?.dispose(), w = null, o.style.display = "", !1;
  if (!document.getElementById("rich-diff-style")) {
    const s = document.createElement("style");
    s.id = "rich-diff-style", s.textContent = X, document.head.appendChild(s);
  }
  const r = window.location.pathname, i = A + r, t = document.createElement("div");
  t.className = "rd-summary";
  let n;
  try {
    const [s, a] = await Promise.all([R(r), R(i)]);
    if (!s.body) throw new Error(`couldn't reload this page (HTTP ${s.status})`);
    const p = a.status === 404;
    if (!a.body && !p) throw new Error(`idvork.in returned HTTP ${a.status}`);
    const l = _(z(a.body), z(s.body)), u = Z(document, l);
    n = u.view;
    const { added: b, removed: f, changed: m } = u.counts;
    t.innerHTML = `<span>Rendered diff vs <a href="${i}" target="_blank">idvork.in${r}</a>${p ? " — <b>new page</b>" : ""}</span><span class="rd-add">+${b} added</span><span class="rd-del">−${f} removed</span><span class="rd-chg">~${m} changed</span>`, e && (t.innerHTML += `<a href="${e}/files" target="_blank">source diff</a>`), u.changes.length ? w = Y(u.changes) : t.innerHTML += "<span>No rendered changes.</span>";
  } catch (s) {
    n = document.createElement("div"), n.id = "rich-diff-view", t.textContent = `Diff vs main failed: ${s.message}`;
  }
  return n.prepend(t), o.before(n), o.style.display = "none", L = n, w ? w.next() : (t.scrollIntoView({ block: "start" }), window.scrollBy(0, -110)), !0;
}
export {
  A as PROD_ORIGIN,
  _ as diffBlocks,
  z as extractBlocks,
  k as isOpaque,
  P as lcsPairs,
  K as markWordDiff,
  Z as renderDiff,
  F as similarity,
  ee as toggleRichDiff,
  D as tokenize
};
//# sourceMappingURL=rich-diff.js.map
