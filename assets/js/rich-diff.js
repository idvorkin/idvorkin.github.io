const A = { added: "#1a7f37", removed: "#cf222e", changed: "#bf8700" }, _ = `
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
function K(e, n = document) {
  const o = n.defaultView, r = /* @__PURE__ */ new Set();
  let t = -1;
  if (!n.getElementById("rd-nav-style")) {
    const a = n.createElement("style");
    a.id = "rd-nav-style", a.textContent = _, n.head.appendChild(a);
  }
  const i = n.createElement("div");
  i.id = "rd-nav", i.innerHTML = '<button type="button" data-rd="prev" title="Previous change (p / k)">‹</button><span class="rd-count"></span><button type="button" data-rd="next" title="Next change (n / j)">›</button><span class="rd-keys">n/p</span>';
  const s = i.querySelector(".rd-count"), d = n.createElement("div");
  d.id = "rd-map";
  const p = e.map((a, l) => {
    const u = n.createElement("div");
    return u.className = "rd-tick", u.style.background = A[a.kind], u.title = `${a.kind} — change ${l + 1}`, u.onclick = () => m(l), d.appendChild(u), u;
  });
  function f() {
    const a = Math.max(n.documentElement.scrollHeight, 1);
    e.forEach((l, u) => {
      const b = l.el.getBoundingClientRect();
      p[u].style.top = `${(b.top + o.scrollY) / a * 100}%`, p[u].style.height = `${b.height / a * 100}%`;
    });
  }
  function c() {
    const a = e.length, l = t < 0 ? `${a} change${a === 1 ? "" : "s"}` : `change ${t + 1} of ${a}`, u = r.size === a ? `all ${a} seen ✓` : `${r.size} of ${a} seen`;
    s.innerHTML = `${l}<span class="rd-seen-count">${u}</span>`, p.forEach((b, v) => {
      b.classList.toggle("rd-tick-seen", r.has(v) && v !== t), b.classList.toggle("rd-tick-current", v === t);
    });
  }
  function m(a) {
    if (!e.length) return;
    t = (a % e.length + e.length) % e.length;
    const l = e[t].el;
    r.add(t);
    const u = l.getBoundingClientRect().top + o.scrollY - o.innerHeight / 3;
    o.scrollTo({ top: Math.max(0, u), behavior: "smooth" }), l.classList.remove("rd-flash"), l.offsetWidth, l.classList.add("rd-flash"), c();
  }
  const g = () => m(t + 1), x = () => m(t < 0 ? e.length - 1 : t - 1);
  i.addEventListener("click", (a) => {
    const l = a.target.closest("button")?.dataset.rd;
    l === "next" && g(), l === "prev" && x();
  });
  const h = (a) => {
    if (!(a.metaKey || a.ctrlKey || a.altKey || a.target?.closest?.("input, textarea, select, [contenteditable]"))) {
      if (a.key === "n" || a.key === "j") g();
      else if (a.key === "p" || a.key === "k") x();
      else return;
      a.preventDefault();
    }
  };
  n.addEventListener("keydown", h), o.addEventListener("resize", f), n.body.append(i, d), f();
  const y = o.setTimeout(f, 1500);
  return c(), {
    go: m,
    next: g,
    prev: x,
    dispose() {
      n.removeEventListener("keydown", h), o.removeEventListener("resize", f), o.clearTimeout(y), i.remove(), d.remove();
    }
  };
}
const S = "https://idvork.in", T = "script, style, svg, canvas, iframe, video, audio, object", R = (e) => e.replace(/\s+/g, " ").trim();
function W(e) {
  const n = typeof window > "u" ? "" : window.location.origin;
  let o = e.split(S).join("");
  return n && (o = o.split(n).join("")), R(o);
}
function w(e) {
  return e.matches(T) || !!e.querySelector(T);
}
function j(e) {
  return e ? Array.from(e.children).filter((n) => !n.hasAttribute("data-pagefind-ignore")) : [];
}
function M(e) {
  return `${e.tagName}|${w(e) ? W(e.outerHTML) : R(e.textContent || "")}`;
}
function I(e, n, o = (r, t) => r === t) {
  const r = e.length, t = n.length, i = Array.from({ length: r + 1 }, () => new Uint32Array(t + 1));
  for (let f = r - 1; f >= 0; f--)
    for (let c = t - 1; c >= 0; c--)
      i[f][c] = o(e[f], n[c]) ? i[f + 1][c + 1] + 1 : Math.max(i[f + 1][c], i[f][c + 1]);
  const s = [];
  let d = 0, p = 0;
  for (; d < r && p < t; )
    o(e[d], n[p]) ? (s.push([d, p]), d++, p++) : i[d + 1][p] >= i[d][p + 1] ? d++ : p++;
  return s;
}
const C = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu, z = (e) => e.match(C) || [];
function q(e, n) {
  const o = new Set(z(e.toLowerCase()).filter((i) => i.trim())), r = new Set(z(n.toLowerCase()).filter((i) => i.trim()));
  if (!o.size || !r.size) return 0;
  let t = 0;
  for (const i of o) r.has(i) && t++;
  return t / Math.min(o.size, r.size);
}
const B = 0.5;
function Y(e, n) {
  const o = e.map(M), r = n.map(M), t = I(o, r);
  t.push([e.length, n.length]);
  const i = [];
  let s = 0, d = 0;
  for (const [p, f] of t) {
    const c = e.slice(s, p), m = n.slice(d, f);
    i.push(...F(c, m)), p < e.length && i.push({ kind: "same", block: n[f] }), s = p + 1, d = f + 1;
  }
  return i;
}
function F(e, n) {
  const o = [];
  let r = 0;
  for (const t of n) {
    let i = -1;
    for (let s = r; s < e.length; s++) {
      const d = e[s];
      if (!(d.tagName !== t.tagName || w(d) !== w(t)) && (w(d) || q(d.textContent || "", t.textContent || "") >= B)) {
        i = s;
        break;
      }
    }
    if (i < 0) {
      o.push({ kind: "added", block: t });
      continue;
    }
    for (; r < i; ) o.push({ kind: "removed", block: e[r++] });
    o.push({ kind: "changed", old: e[r++], block: t });
  }
  for (; r < e.length; ) o.push({ kind: "removed", block: e[r++] });
  return o;
}
function D(e) {
  const n = [], o = e.ownerDocument.createTreeWalker(
    e,
    4
    /* NodeFilter.SHOW_TEXT */
  );
  for (let r = o.nextNode(); r; r = o.nextNode())
    if (!r.parentElement?.closest("script, style")) {
      C.lastIndex = 0;
      for (let t = C.exec(r.data); t; t = C.exec(r.data))
        n.push({ text: t[0], node: r, start: t.index, end: t.index + t[0].length });
    }
  return n;
}
const O = (e) => !e.trim(), G = 4e6;
function U(e, n) {
  const o = D(e), r = D(n);
  if (o.length * r.length > G) return !1;
  const t = I(
    o.map((c) => c.text),
    r.map((c) => c.text)
  );
  t.push([o.length, r.length]);
  const i = /* @__PURE__ */ new Map(), s = (c) => (i.has(c) || i.set(c, { ins: [], del: [] }), i.get(c)), d = n.ownerDocument;
  let p = 0, f = 0;
  for (const [c, m] of t) {
    const g = o.slice(p, c).map((h) => h.text).join("");
    if (!O(g)) {
      const h = r[f] ?? r[r.length - 1];
      h ? s(h.node).del.push([r[f] ? h.start : h.end, g]) : n.appendChild(Object.assign(d.createElement("del"), { textContent: g }));
    }
    const x = r.slice(f, m);
    if (!O(x.map((h) => h.text).join("")))
      for (const h of x) {
        const y = s(h.node).ins, a = y[y.length - 1];
        a && a[1] === h.start ? a[1] = h.end : y.push([h.start, h.end]);
      }
    p = c + 1, f = m + 1;
  }
  for (const [c, { ins: m, del: g }] of i) {
    const x = c.data, h = /* @__PURE__ */ new Set([0, x.length, ...g.map(([l]) => l)]);
    for (const [l, u] of m) h.add(l).add(u);
    const y = Array.from(h).sort((l, u) => l - u), a = d.createDocumentFragment();
    for (let l = 0; l < y.length; l++) {
      const u = y[l];
      for (const [$, L] of g)
        $ === u && a.appendChild(Object.assign(d.createElement("del"), { textContent: L }));
      const b = y[l + 1];
      if (b === void 0 || b === u) continue;
      const v = x.slice(u, b), P = m.some(([$, L]) => $ <= u && b <= L);
      a.appendChild(
        P ? Object.assign(d.createElement("ins"), { textContent: v }) : d.createTextNode(v)
      );
    }
    c.replaceWith(a);
  }
  return !0;
}
const V = `
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
function N(e, n, o, r) {
  const t = e.createElement("div");
  if (t.className = `rd-block ${n}`, r) {
    const i = e.createElement("span");
    i.className = "rd-note", i.textContent = r, t.appendChild(i);
  }
  return t.appendChild(e.importNode(o, !0)), t;
}
function Q(e, n) {
  const o = e.createElement("div");
  o.id = "rich-diff-view";
  const r = { added: 0, removed: 0, changed: 0 }, t = [], i = (s, d) => {
    r[s]++, t.push({ kind: s, el: d }), o.appendChild(d);
  };
  for (const s of n) {
    if (s.kind === "same") {
      o.appendChild(e.importNode(s.block, !0));
      continue;
    }
    if (s.kind === "added") i("added", N(e, "rd-added", s.block));
    else if (s.kind === "removed") i("removed", N(e, "rd-removed", s.block));
    else {
      const d = e.importNode(s.block, !0), f = !(w(s.old) || w(s.block)) && U(s.old, d);
      i("changed", N(e, "rd-changed", d, f ? void 0 : "changed block (not diffed word by word)"));
    }
  }
  return { view: o, counts: r, changes: t };
}
async function H(e) {
  const n = await fetch(e, { cache: "no-store" });
  if (!n.ok) return { status: n.status, body: null };
  const o = new DOMParser().parseFromString(await n.text(), "text/html");
  return { status: n.status, body: o.getElementById("content-holder") };
}
let E = null, k = null;
async function X(e) {
  const n = document.getElementById("content-holder");
  if (!n) return !1;
  if (E)
    return E.remove(), E = null, k?.dispose(), k = null, n.style.display = "", !1;
  if (!document.getElementById("rich-diff-style")) {
    const s = document.createElement("style");
    s.id = "rich-diff-style", s.textContent = V, document.head.appendChild(s);
  }
  const o = window.location.pathname, r = S + o, t = document.createElement("div");
  t.className = "rd-summary";
  let i;
  try {
    const [s, d] = await Promise.all([H(o), H(r)]);
    if (!s.body) throw new Error(`couldn't reload this page (HTTP ${s.status})`);
    const p = d.status === 404;
    if (!d.body && !p) throw new Error(`idvork.in returned HTTP ${d.status}`);
    const f = Y(j(d.body), j(s.body)), c = Q(document, f);
    i = c.view;
    const { added: m, removed: g, changed: x } = c.counts;
    t.innerHTML = `<span>Rendered diff vs <a href="${r}" target="_blank">idvork.in${o}</a>${p ? " — <b>new page</b>" : ""}</span><span class="rd-add">+${m} added</span><span class="rd-del">−${g} removed</span><span class="rd-chg">~${x} changed</span>`, e && (t.innerHTML += `<a href="${e}/files" target="_blank">source diff</a>`), c.changes.length ? k = K(c.changes) : t.innerHTML += "<span>No rendered changes.</span>";
  } catch (s) {
    i = document.createElement("div"), i.id = "rich-diff-view", t.textContent = `Diff vs main failed: ${s.message}`;
  }
  return i.prepend(t), n.before(i), n.style.display = "none", E = i, k ? k.next() : (t.scrollIntoView({ block: "start" }), window.scrollBy(0, -110)), !0;
}
export {
  S as PROD_ORIGIN,
  Y as diffBlocks,
  j as extractBlocks,
  w as isOpaque,
  I as lcsPairs,
  U as markWordDiff,
  Q as renderDiff,
  q as similarity,
  X as toggleRichDiff,
  z as tokenize
};
//# sourceMappingURL=rich-diff.js.map
