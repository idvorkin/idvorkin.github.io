const W = { added: "#1a7f37", removed: "#cf222e", changed: "#bf8700" }, q = `
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
function B(e, o = document) {
  const i = o.defaultView, r = /* @__PURE__ */ new Set();
  let t = -1;
  if (!o.getElementById("rd-nav-style")) {
    const a = o.createElement("style");
    a.id = "rd-nav-style", a.textContent = q, o.head.appendChild(a);
  }
  const n = o.createElement("div");
  n.id = "rd-nav", n.innerHTML = '<button type="button" data-rd="prev" title="Previous change (p / k)">‹</button><span class="rd-count"></span><button type="button" data-rd="next" title="Next change (n / j)">›</button><span class="rd-keys">n/p</span>';
  const s = n.querySelector(".rd-count"), d = o.createElement("div");
  d.id = "rd-map";
  const f = e.map((a, c) => {
    const h = o.createElement("div");
    return h.className = "rd-tick", h.style.background = W[a.kind], h.title = `${a.kind} — change ${c + 1}`, h.onclick = () => b(c), d.appendChild(h), h;
  });
  function l() {
    const a = Math.max(o.documentElement.scrollHeight, 1);
    e.forEach((c, h) => {
      const g = c.el.getBoundingClientRect();
      f[h].style.top = `${(g.top + i.scrollY) / a * 100}%`, f[h].style.height = `${g.height / a * 100}%`;
    });
  }
  function u() {
    const a = e.length, c = t < 0 ? `${a} change${a === 1 ? "" : "s"}` : `change ${t + 1} of ${a}`, h = r.size === a ? `all ${a} seen ✓` : `${r.size} of ${a} seen`;
    s.innerHTML = `${c}<span class="rd-seen-count">${h}</span>`, f.forEach((g, y) => {
      g.classList.toggle("rd-tick-seen", r.has(y) && y !== t), g.classList.toggle("rd-tick-current", y === t);
    });
  }
  function b(a) {
    if (!e.length) return;
    t = (a % e.length + e.length) % e.length;
    const c = e[t].el;
    r.add(t);
    const h = c.getBoundingClientRect().top + i.scrollY - i.innerHeight / 3;
    i.scrollTo({ top: Math.max(0, h), behavior: "smooth" }), c.classList.remove("rd-flash"), c.offsetWidth, c.classList.add("rd-flash"), u();
  }
  const p = () => b(t + 1), m = () => b(t < 0 ? e.length - 1 : t - 1);
  n.addEventListener("click", (a) => {
    const c = a.target.closest("button")?.dataset.rd;
    c === "next" && p(), c === "prev" && m();
  });
  const w = (a) => {
    if (!(a.metaKey || a.ctrlKey || a.altKey || a.target?.closest?.("input, textarea, select, [contenteditable]"))) {
      if (a.key === "n" || a.key === "j") p();
      else if (a.key === "p" || a.key === "k") m();
      else return;
      a.preventDefault();
    }
  };
  o.addEventListener("keydown", w), i.addEventListener("resize", l), o.body.append(n, d), l();
  const x = i.setTimeout(l, 1500);
  return u(), {
    go: b,
    next: p,
    prev: m,
    dispose() {
      o.removeEventListener("keydown", w), i.removeEventListener("resize", l), i.clearTimeout(x), n.remove(), d.remove();
    }
  };
}
const F = "https://idvork.in", U = "/_diff-base", Y = (e) => U + (e.replace(/\/+$/, "") || "/"), j = "script, style, svg, canvas, iframe, video, audio, object", R = (e) => e.replace(/\s+/g, " ").trim();
function G(e) {
  const o = typeof window > "u" ? "" : window.location.origin;
  let i = e.split(F).join("");
  return o && (i = i.split(o).join("")), R(i);
}
function k(e) {
  return e.matches(j) || !!e.querySelector(j);
}
function z(e) {
  return e ? Array.from(e.children).filter((o) => !o.hasAttribute("data-pagefind-ignore")) : [];
}
function D(e) {
  return `${e.tagName}|${k(e) ? G(e.outerHTML) : R(e.textContent || "")}`;
}
function I(e, o, i = (r, t) => r === t) {
  const r = e.length, t = o.length, n = Array.from({ length: r + 1 }, () => new Uint32Array(t + 1));
  for (let l = r - 1; l >= 0; l--)
    for (let u = t - 1; u >= 0; u--)
      n[l][u] = i(e[l], o[u]) ? n[l + 1][u + 1] + 1 : Math.max(n[l + 1][u], n[l][u + 1]);
  const s = [];
  let d = 0, f = 0;
  for (; d < r && f < t; )
    i(e[d], o[f]) ? (s.push([d, f]), d++, f++) : n[d + 1][f] >= n[d][f + 1] ? d++ : f++;
  return s;
}
const C = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu, O = (e) => e.match(C) || [];
function V(e, o) {
  const i = new Set(O(e.toLowerCase()).filter((n) => n.trim())), r = new Set(O(o.toLowerCase()).filter((n) => n.trim()));
  if (!i.size || !r.size) return 0;
  let t = 0;
  for (const n of i) r.has(n) && t++;
  return t / Math.min(i.size, r.size);
}
const Q = 0.5;
function _(e, o) {
  const i = e.map(D), r = o.map(D), t = I(i, r);
  t.push([e.length, o.length]);
  const n = [];
  let s = 0, d = 0;
  for (const [f, l] of t) {
    const u = e.slice(s, f), b = o.slice(d, l);
    n.push(...X(u, b)), f < e.length && n.push({ kind: "same", block: o[l] }), s = f + 1, d = l + 1;
  }
  return n;
}
function X(e, o) {
  const i = [];
  let r = 0;
  for (const t of o) {
    let n = -1;
    for (let s = r; s < e.length; s++) {
      const d = e[s];
      if (!(d.tagName !== t.tagName || k(d) !== k(t)) && (k(d) || V(d.textContent || "", t.textContent || "") >= Q)) {
        n = s;
        break;
      }
    }
    if (n < 0) {
      i.push({ kind: "added", block: t });
      continue;
    }
    for (; r < n; ) i.push({ kind: "removed", block: e[r++] });
    i.push({ kind: "changed", old: e[r++], block: t });
  }
  for (; r < e.length; ) i.push({ kind: "removed", block: e[r++] });
  return i;
}
function S(e) {
  const o = [], i = e.ownerDocument.createTreeWalker(
    e,
    4
    /* NodeFilter.SHOW_TEXT */
  );
  for (let r = i.nextNode(); r; r = i.nextNode())
    if (!r.parentElement?.closest("script, style")) {
      C.lastIndex = 0;
      for (let t = C.exec(r.data); t; t = C.exec(r.data))
        o.push({ text: t[0], node: r, start: t.index, end: t.index + t[0].length });
    }
  return o;
}
const H = (e) => !e.trim(), J = 4e6;
function P(e, o) {
  const i = S(e), r = S(o), t = i.flatMap((p, m) => H(p.text) ? [] : [m]), n = r.flatMap((p, m) => H(p.text) ? [] : [m]);
  if (t.length * n.length > J) return !1;
  const s = I(
    t.map((p) => i[p].text),
    n.map((p) => r[p].text)
  );
  s.push([t.length, n.length]);
  const d = /* @__PURE__ */ new Map(), f = (p) => (d.has(p) || d.set(p, { ins: [], del: [] }), d.get(p)), l = o.ownerDocument;
  let u = 0, b = 0;
  for (const [p, m] of s) {
    const w = b < m ? r.slice(n[b], n[m - 1] + 1) : [];
    if (u < p) {
      const x = i.slice(t[u], t[p - 1] + 1).map((h) => h.text).join(""), a = r[n[b]], c = r[n[n.length - 1]];
      a ? f(a.node).del.push([a.start, w.length ? `${x} ` : x]) : c ? f(c.node).del.push([c.end, ` ${x}`]) : o.appendChild(Object.assign(l.createElement("del"), { textContent: x }));
    }
    for (const x of w) {
      const a = f(x.node).ins, c = a[a.length - 1];
      c && c[1] === x.start ? c[1] = x.end : a.push([x.start, x.end]);
    }
    u = p + 1, b = m + 1;
  }
  for (const [p, { ins: m, del: w }] of d) {
    const x = p.data, a = /* @__PURE__ */ new Set([0, x.length, ...w.map(([g]) => g)]);
    for (const [g, y] of m) a.add(g).add(y);
    const c = Array.from(a).sort((g, y) => g - y), h = l.createDocumentFragment();
    for (let g = 0; g < c.length; g++) {
      const y = c[g];
      for (const [N, T] of w)
        N === y && h.appendChild(Object.assign(l.createElement("del"), { textContent: T }));
      const $ = c[g + 1];
      if ($ === void 0 || $ === y) continue;
      const M = x.slice(y, $), K = m.some(([N, T]) => N <= y && $ <= T);
      h.appendChild(
        K ? Object.assign(l.createElement("ins"), { textContent: M }) : l.createTextNode(M)
      );
    }
    p.replaceWith(h);
  }
  return !0;
}
const Z = `
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
function E(e, o, i, r) {
  const t = e.createElement("div");
  if (t.className = `rd-block ${o}`, r) {
    const n = e.createElement("span");
    n.className = "rd-note", n.textContent = r, t.appendChild(n);
  }
  return t.appendChild(e.importNode(i, !0)), t;
}
function ee(e, o, i) {
  const r = e.importNode(i, !1);
  for (const t of _(Array.from(o.children), Array.from(i.children))) {
    const n = e.importNode(t.block, !0);
    t.kind === "changed" && !k(t.old) && !k(t.block) && P(t.old, n), t.kind !== "same" && n.classList.add(`rd-li-${t.kind}`), r.appendChild(n);
  }
  return r;
}
function te(e, o) {
  const i = e.createElement("div");
  i.id = "rich-diff-view";
  const r = { added: 0, removed: 0, changed: 0 }, t = [], n = (s, d) => {
    r[s]++, t.push({ kind: s, el: d }), i.appendChild(d);
  };
  for (const s of o) {
    if (s.kind === "same") {
      i.appendChild(e.importNode(s.block, !0));
      continue;
    }
    if (s.kind === "added") n("added", E(e, "rd-added", s.block));
    else if (s.kind === "removed") n("removed", E(e, "rd-removed", s.block));
    else if (/^(UL|OL)$/.test(s.block.tagName))
      n("changed", E(e, "rd-changed", ee(e, s.old, s.block)));
    else {
      const d = e.importNode(s.block, !0), l = !(k(s.old) || k(s.block)) && P(s.old, d);
      n("changed", E(e, "rd-changed", d, l ? void 0 : "changed block (not diffed word by word)"));
    }
  }
  return { view: i, counts: r, changes: t };
}
async function A(e) {
  let o;
  try {
    o = await fetch(e, { cache: "no-store" });
  } catch (r) {
    throw new Error(`fetching ${e}: ${r.message}`);
  }
  if (!o.ok) return { status: o.status, body: null };
  const i = new DOMParser().parseFromString(await o.text(), "text/html");
  return { status: o.status, body: i.getElementById("content-holder") };
}
let L = null, v = null;
async function ne(e) {
  const o = document.getElementById("content-holder");
  if (!o) return !1;
  if (L)
    return L.remove(), L = null, v?.dispose(), v = null, o.style.display = "", !1;
  if (!document.getElementById("rich-diff-style")) {
    const s = document.createElement("style");
    s.id = "rich-diff-style", s.textContent = Z, document.head.appendChild(s);
  }
  const i = window.location.pathname, r = Y(i), t = document.createElement("div");
  t.className = "rd-summary";
  let n;
  try {
    const [s, d] = await Promise.all([A(i), A(r)]);
    if (!s.body) throw new Error(`couldn't reload this page, ${i} (HTTP ${s.status})`);
    const f = d.status === 404;
    if (!d.body && !f) throw new Error(`main-branch copy ${r} returned HTTP ${d.status}`);
    const l = _(z(d.body), z(s.body)), u = te(document, l);
    n = u.view;
    const { added: b, removed: p, changed: m } = u.counts, w = f ? "main" : `<a href="${r}" target="_blank">main</a>`;
    t.innerHTML = `<span>Rendered diff vs ${w}${f ? " — <b>new page</b>" : ""}</span><span class="rd-add">+${b} added</span><span class="rd-del">−${p} removed</span><span class="rd-chg">~${m} changed</span>`, e && (t.innerHTML += `<a href="${e}/files" target="_blank">source diff</a>`), u.changes.length ? v = B(u.changes) : t.innerHTML += "<span>No rendered changes.</span>";
  } catch (s) {
    n = document.createElement("div"), n.id = "rich-diff-view", t.textContent = `Diff vs main failed: ${s.message}`;
  }
  return n.prepend(t), o.before(n), o.style.display = "none", L = n, v ? v.next() : (t.scrollIntoView({ block: "start" }), window.scrollBy(0, -110)), !0;
}
export {
  U as DIFF_BASE,
  F as PROD_ORIGIN,
  Y as baseUrl,
  _ as diffBlocks,
  z as extractBlocks,
  k as isOpaque,
  I as lcsPairs,
  P as markWordDiff,
  te as renderDiff,
  V as similarity,
  ne as toggleRichDiff,
  O as tokenize
};
//# sourceMappingURL=rich-diff.js.map
