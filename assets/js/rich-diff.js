const K = { added: "#1a7f37", removed: "#cf222e", changed: "#bf8700" }, W = `
#rd-nav{position:fixed;right:20px;bottom:20px;z-index:1001;display:flex;align-items:center;gap:6px;background:#24292f;color:#fff;border-radius:8px;padding:6px 8px;font:600 13px/1.2 system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25)}
#rd-nav button{background:#444c56;color:#fff;border:0;border-radius:5px;padding:5px 10px;font:inherit;cursor:pointer;min-width:36px}
#rd-nav button:hover{background:#57606a}
#rd-nav .rd-count{min-width:9.5em;text-align:center}
#rd-nav .rd-seen-count{display:block;font-weight:400;font-size:11px;opacity:.8}
#rd-nav .rd-keys{font-weight:400;font-size:11px;opacity:.6}
#rd-map{position:fixed;right:0;top:100px;bottom:16px;width:12px;z-index:1000;background:rgba(175,184,193,.25)}
#rd-map .rd-tick{position:absolute;left:1px;right:1px;min-height:3px;border-radius:1px;cursor:pointer;opacity:.55}
#rd-map .rd-tick.rd-tick-seen{opacity:.2}
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
function q(e, o = document) {
  const r = o.defaultView, i = /* @__PURE__ */ new Set();
  let t = -1;
  if (!o.getElementById("rd-nav-style")) {
    const s = o.createElement("style");
    s.id = "rd-nav-style", s.textContent = W, o.head.appendChild(s);
  }
  const n = o.createElement("div");
  n.id = "rd-nav", n.innerHTML = '<button type="button" data-rd="prev" title="Previous change (p / k)">‹</button><span class="rd-count"></span><button type="button" data-rd="next" title="Next change (n / j)">›</button><span class="rd-keys">n/p</span>';
  const a = n.querySelector(".rd-count"), d = o.createElement("div");
  d.id = "rd-map";
  const p = e.map((s, c) => {
    const h = o.createElement("div");
    return h.className = "rd-tick", h.style.background = K[s.kind], h.title = `${s.kind} — change ${c + 1}`, h.onclick = () => b(c), d.appendChild(h), h;
  });
  function l() {
    const s = Math.max(o.documentElement.scrollHeight, 1);
    e.forEach((c, h) => {
      const g = c.el.getBoundingClientRect();
      p[h].style.top = `${(g.top + r.scrollY) / s * 100}%`, p[h].style.height = `${g.height / s * 100}%`;
    });
  }
  function u() {
    const s = e.length, c = t < 0 ? `${s} change${s === 1 ? "" : "s"}` : `change ${t + 1} of ${s}`, h = i.size === s ? `all ${s} seen ✓` : `${i.size} of ${s} seen`;
    a.innerHTML = `${c}<span class="rd-seen-count">${h}</span>`, p.forEach((g, y) => {
      g.classList.toggle("rd-tick-seen", i.has(y) && y !== t), g.classList.toggle("rd-tick-current", y === t);
    });
  }
  function b(s) {
    if (!e.length) return;
    t = (s % e.length + e.length) % e.length;
    const c = e[t].el;
    i.add(t);
    const h = c.getBoundingClientRect().top + r.scrollY - r.innerHeight / 3;
    r.scrollTo({ top: Math.max(0, h), behavior: "smooth" }), c.classList.remove("rd-flash"), c.offsetWidth, c.classList.add("rd-flash"), u();
  }
  const f = () => b(t + 1), m = () => b(t < 0 ? e.length - 1 : t - 1);
  n.addEventListener("click", (s) => {
    const c = s.target.closest("button")?.dataset.rd;
    c === "next" && f(), c === "prev" && m();
  });
  const v = (s) => {
    if (!(s.metaKey || s.ctrlKey || s.altKey || s.target?.closest?.("input, textarea, select, [contenteditable]"))) {
      if (s.key === "n" || s.key === "j") f();
      else if (s.key === "p" || s.key === "k") m();
      else return;
      s.preventDefault();
    }
  };
  o.addEventListener("keydown", v), r.addEventListener("resize", l), o.body.append(n, d), l();
  const x = r.setTimeout(l, 1500);
  return u(), {
    go: b,
    next: f,
    prev: m,
    dispose() {
      o.removeEventListener("keydown", v), r.removeEventListener("resize", l), r.clearTimeout(x), n.remove(), d.remove();
    }
  };
}
const I = "https://idvork.in", j = "script, style, svg, canvas, iframe, video, audio, object", P = (e) => e.replace(/\s+/g, " ").trim();
function B(e) {
  const o = typeof window > "u" ? "" : window.location.origin;
  let r = e.split(I).join("");
  return o && (r = r.split(o).join("")), P(r);
}
function w(e) {
  return e.matches(j) || !!e.querySelector(j);
}
function z(e) {
  return e ? Array.from(e.children).filter((o) => !o.hasAttribute("data-pagefind-ignore")) : [];
}
function D(e) {
  return `${e.tagName}|${w(e) ? B(e.outerHTML) : P(e.textContent || "")}`;
}
function A(e, o, r = (i, t) => i === t) {
  const i = e.length, t = o.length, n = Array.from({ length: i + 1 }, () => new Uint32Array(t + 1));
  for (let l = i - 1; l >= 0; l--)
    for (let u = t - 1; u >= 0; u--)
      n[l][u] = r(e[l], o[u]) ? n[l + 1][u + 1] + 1 : Math.max(n[l + 1][u], n[l][u + 1]);
  const a = [];
  let d = 0, p = 0;
  for (; d < i && p < t; )
    r(e[d], o[p]) ? (a.push([d, p]), d++, p++) : n[d + 1][p] >= n[d][p + 1] ? d++ : p++;
  return a;
}
const C = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu, O = (e) => e.match(C) || [];
function Y(e, o) {
  const r = new Set(O(e.toLowerCase()).filter((n) => n.trim())), i = new Set(O(o.toLowerCase()).filter((n) => n.trim()));
  if (!r.size || !i.size) return 0;
  let t = 0;
  for (const n of r) i.has(n) && t++;
  return t / Math.min(r.size, i.size);
}
const F = 0.5;
function G(e, o) {
  const r = e.map(D), i = o.map(D), t = A(r, i);
  t.push([e.length, o.length]);
  const n = [];
  let a = 0, d = 0;
  for (const [p, l] of t) {
    const u = e.slice(a, p), b = o.slice(d, l);
    n.push(...U(u, b)), p < e.length && n.push({ kind: "same", block: o[l] }), a = p + 1, d = l + 1;
  }
  return n;
}
function U(e, o) {
  const r = [];
  let i = 0;
  for (const t of o) {
    let n = -1;
    for (let a = i; a < e.length; a++) {
      const d = e[a];
      if (!(d.tagName !== t.tagName || w(d) !== w(t)) && (w(d) || Y(d.textContent || "", t.textContent || "") >= F)) {
        n = a;
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
const S = (e) => !e.trim(), V = 4e6;
function Q(e, o) {
  const r = H(e), i = H(o), t = r.flatMap((f, m) => S(f.text) ? [] : [m]), n = i.flatMap((f, m) => S(f.text) ? [] : [m]);
  if (t.length * n.length > V) return !1;
  const a = A(
    t.map((f) => r[f].text),
    n.map((f) => i[f].text)
  );
  a.push([t.length, n.length]);
  const d = /* @__PURE__ */ new Map(), p = (f) => (d.has(f) || d.set(f, { ins: [], del: [] }), d.get(f)), l = o.ownerDocument;
  let u = 0, b = 0;
  for (const [f, m] of a) {
    const v = b < m ? i.slice(n[b], n[m - 1] + 1) : [];
    if (u < f) {
      const x = r.slice(t[u], t[f - 1] + 1).map((h) => h.text).join(""), s = i[n[b]], c = i[n[n.length - 1]];
      s ? p(s.node).del.push([s.start, v.length ? `${x} ` : x]) : c ? p(c.node).del.push([c.end, ` ${x}`]) : o.appendChild(Object.assign(l.createElement("del"), { textContent: x }));
    }
    for (const x of v) {
      const s = p(x.node).ins, c = s[s.length - 1];
      c && c[1] === x.start ? c[1] = x.end : s.push([x.start, x.end]);
    }
    u = f + 1, b = m + 1;
  }
  for (const [f, { ins: m, del: v }] of d) {
    const x = f.data, s = /* @__PURE__ */ new Set([0, x.length, ...v.map(([g]) => g)]);
    for (const [g, y] of m) s.add(g).add(y);
    const c = Array.from(s).sort((g, y) => g - y), h = l.createDocumentFragment();
    for (let g = 0; g < c.length; g++) {
      const y = c[g];
      for (const [L, N] of v)
        L === y && h.appendChild(Object.assign(l.createElement("del"), { textContent: N }));
      const E = c[g + 1];
      if (E === void 0 || E === y) continue;
      const M = x.slice(y, E), _ = m.some(([L, N]) => L <= y && E <= N);
      h.appendChild(
        _ ? Object.assign(l.createElement("ins"), { textContent: M }) : l.createTextNode(M)
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
#rich-diff-view ins{background:#abf2bc;text-decoration:none;border-radius:2px}
#rich-diff-view del{background:#ffcecb;color:#82071e;text-decoration:line-through;border-radius:2px}
`;
function T(e, o, r, i) {
  const t = e.createElement("div");
  if (t.className = `rd-block ${o}`, i) {
    const n = e.createElement("span");
    n.className = "rd-note", n.textContent = i, t.appendChild(n);
  }
  return t.appendChild(e.importNode(r, !0)), t;
}
function J(e, o) {
  const r = e.createElement("div");
  r.id = "rich-diff-view";
  const i = { added: 0, removed: 0, changed: 0 }, t = [], n = (a, d) => {
    i[a]++, t.push({ kind: a, el: d }), r.appendChild(d);
  };
  for (const a of o) {
    if (a.kind === "same") {
      r.appendChild(e.importNode(a.block, !0));
      continue;
    }
    if (a.kind === "added") n("added", T(e, "rd-added", a.block));
    else if (a.kind === "removed") n("removed", T(e, "rd-removed", a.block));
    else {
      const d = e.importNode(a.block, !0), l = !(w(a.old) || w(a.block)) && Q(a.old, d);
      n("changed", T(e, "rd-changed", d, l ? void 0 : "changed block (not diffed word by word)"));
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
let $ = null, k = null;
async function Z(e) {
  const o = document.getElementById("content-holder");
  if (!o) return !1;
  if ($)
    return $.remove(), $ = null, k?.dispose(), k = null, o.style.display = "", !1;
  if (!document.getElementById("rich-diff-style")) {
    const a = document.createElement("style");
    a.id = "rich-diff-style", a.textContent = X, document.head.appendChild(a);
  }
  const r = window.location.pathname, i = I + r, t = document.createElement("div");
  t.className = "rd-summary";
  let n;
  try {
    const [a, d] = await Promise.all([R(r), R(i)]);
    if (!a.body) throw new Error(`couldn't reload this page (HTTP ${a.status})`);
    const p = d.status === 404;
    if (!d.body && !p) throw new Error(`idvork.in returned HTTP ${d.status}`);
    const l = G(z(d.body), z(a.body)), u = J(document, l);
    n = u.view;
    const { added: b, removed: f, changed: m } = u.counts;
    t.innerHTML = `<span>Rendered diff vs <a href="${i}" target="_blank">idvork.in${r}</a>${p ? " — <b>new page</b>" : ""}</span><span class="rd-add">+${b} added</span><span class="rd-del">−${f} removed</span><span class="rd-chg">~${m} changed</span>`, e && (t.innerHTML += `<a href="${e}/files" target="_blank">source diff</a>`), u.changes.length ? k = q(u.changes) : t.innerHTML += "<span>No rendered changes.</span>";
  } catch (a) {
    n = document.createElement("div"), n.id = "rich-diff-view", t.textContent = `Diff vs main failed: ${a.message}`;
  }
  return n.prepend(t), o.before(n), o.style.display = "none", $ = n, k ? k.next() : (t.scrollIntoView({ block: "start" }), window.scrollBy(0, -110)), !0;
}
export {
  I as PROD_ORIGIN,
  G as diffBlocks,
  z as extractBlocks,
  w as isOpaque,
  A as lcsPairs,
  Q as markWordDiff,
  J as renderDiff,
  Y as similarity,
  Z as toggleRichDiff,
  O as tokenize
};
//# sourceMappingURL=rich-diff.js.map
