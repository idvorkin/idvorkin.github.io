const I = "https://idvork.in", j = "script, style, svg, canvas, iframe, video, audio, object", S = (e) => e.replace(/\s+/g, " ").trim();
function P(e) {
  const i = typeof window > "u" ? "" : window.location.origin;
  let o = e.split(I).join("");
  return i && (o = o.split(i).join("")), S(o);
}
function w(e) {
  return e.matches(j) || !!e.querySelector(j);
}
function T(e) {
  return e ? Array.from(e.children).filter((i) => !i.hasAttribute("data-pagefind-ignore")) : [];
}
function $(e) {
  return `${e.tagName}|${w(e) ? P(e.outerHTML) : S(e.textContent || "")}`;
}
function z(e, i, o = (n, t) => n === t) {
  const n = e.length, t = i.length, r = Array.from({ length: n + 1 }, () => new Uint32Array(t + 1));
  for (let l = n - 1; l >= 0; l--)
    for (let d = t - 1; d >= 0; d--)
      r[l][d] = o(e[l], i[d]) ? r[l + 1][d + 1] + 1 : Math.max(r[l + 1][d], r[l][d + 1]);
  const c = [];
  let s = 0, f = 0;
  for (; s < n && f < t; )
    o(e[s], i[f]) ? (c.push([s, f]), s++, f++) : r[s + 1][f] >= r[s][f + 1] ? s++ : f++;
  return c;
}
const v = /\s+|[\p{L}\p{N}_'’]+|[^\s\p{L}\p{N}_]/gu, D = (e) => e.match(v) || [];
function R(e, i) {
  const o = new Set(D(e.toLowerCase()).filter((r) => r.trim())), n = new Set(D(i.toLowerCase()).filter((r) => r.trim()));
  if (!o.size || !n.size) return 0;
  let t = 0;
  for (const r of o) n.has(r) && t++;
  return t / Math.min(o.size, n.size);
}
const _ = 0.5;
function W(e, i) {
  const o = e.map($), n = i.map($), t = z(o, n);
  t.push([e.length, i.length]);
  const r = [];
  let c = 0, s = 0;
  for (const [f, l] of t) {
    const d = e.slice(c, f), h = i.slice(s, l);
    r.push(...q(d, h)), f < e.length && r.push({ kind: "same", block: i[l] }), c = f + 1, s = l + 1;
  }
  return r;
}
function q(e, i) {
  const o = [];
  let n = 0;
  for (const t of i) {
    let r = -1;
    for (let c = n; c < e.length; c++) {
      const s = e[c];
      if (!(s.tagName !== t.tagName || w(s) !== w(t)) && (w(s) || R(s.textContent || "", t.textContent || "") >= _)) {
        r = c;
        break;
      }
    }
    if (r < 0) {
      o.push({ kind: "added", block: t });
      continue;
    }
    for (; n < r; ) o.push({ kind: "removed", block: e[n++] });
    o.push({ kind: "changed", old: e[n++], block: t });
  }
  for (; n < e.length; ) o.push({ kind: "removed", block: e[n++] });
  return o;
}
function O(e) {
  const i = [], o = e.ownerDocument.createTreeWalker(
    e,
    4
    /* NodeFilter.SHOW_TEXT */
  );
  for (let n = o.nextNode(); n; n = o.nextNode())
    if (!n.parentElement?.closest("script, style")) {
      v.lastIndex = 0;
      for (let t = v.exec(n.data); t; t = v.exec(n.data))
        i.push({ text: t[0], node: n, start: t.index, end: t.index + t[0].length });
    }
  return i;
}
const A = (e) => !e.trim(), K = 4e6;
function F(e, i) {
  const o = O(e), n = O(i);
  if (o.length * n.length > K) return !1;
  const t = z(
    o.map((d) => d.text),
    n.map((d) => d.text)
  );
  t.push([o.length, n.length]);
  const r = /* @__PURE__ */ new Map(), c = (d) => (r.has(d) || r.set(d, { ins: [], del: [] }), r.get(d)), s = i.ownerDocument;
  let f = 0, l = 0;
  for (const [d, h] of t) {
    const g = o.slice(f, d).map((a) => a.text).join("");
    if (!A(g)) {
      const a = n[l] ?? n[n.length - 1];
      a ? c(a.node).del.push([n[l] ? a.start : a.end, g]) : i.appendChild(Object.assign(s.createElement("del"), { textContent: g }));
    }
    const x = n.slice(l, h);
    if (!A(x.map((a) => a.text).join("")))
      for (const a of x) {
        const p = c(a.node).ins, u = p[p.length - 1];
        u && u[1] === a.start ? u[1] = a.end : p.push([a.start, a.end]);
      }
    f = d + 1, l = h + 1;
  }
  for (const [d, { ins: h, del: g }] of r) {
    const x = d.data, a = /* @__PURE__ */ new Set([0, x.length, ...g.map(([m]) => m)]);
    for (const [m, b] of h) a.add(m).add(b);
    const p = Array.from(a).sort((m, b) => m - b), u = s.createDocumentFragment();
    for (let m = 0; m < p.length; m++) {
      const b = p[m];
      for (const [C, E] of g)
        C === b && u.appendChild(Object.assign(s.createElement("del"), { textContent: E }));
      const k = p[m + 1];
      if (k === void 0 || k === b) continue;
      const L = x.slice(b, k), H = h.some(([C, E]) => C <= b && k <= E);
      u.appendChild(
        H ? Object.assign(s.createElement("ins"), { textContent: L }) : s.createTextNode(L)
      );
    }
    d.replaceWith(u);
  }
  return !0;
}
const G = `
#rich-diff-view .rd-summary{position:sticky;top:100px;z-index:5;background:#f6f8fa;border:1px solid #d0d7de;border-radius:6px;padding:6px 10px;margin:0 0 16px;font-size:14px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
#rich-diff-view .rd-summary .rd-add{color:#1a7f37;font-weight:600}
#rich-diff-view .rd-summary .rd-del{color:#cf222e;font-weight:600}
#rich-diff-view .rd-summary .rd-chg{color:#9a6700;font-weight:600}
#rich-diff-view .rd-summary button{border:1px solid #d0d7de;background:#fff;border-radius:6px;padding:1px 8px;font-size:13px;cursor:pointer}
#rich-diff-view .rd-block{border-left:4px solid transparent;padding:2px 0 2px 10px;margin-left:-14px;margin-bottom:1em}
#rich-diff-view .rd-block>*:last-child{margin-bottom:0}
#rich-diff-view .rd-added{border-color:#1a7f37;background:#dafbe1}
#rich-diff-view .rd-removed{border-color:#cf222e;background:#ffebe9;text-decoration:line-through;text-decoration-color:#cf222e80;opacity:.85}
#rich-diff-view .rd-changed{border-color:#bf8700}
#rich-diff-view .rd-note{display:block;font:600 11px/1.6 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#57606a;text-decoration:none}
#rich-diff-view ins{background:#abf2bc;text-decoration:none;border-radius:2px}
#rich-diff-view del{background:#ffcecb;color:#82071e;text-decoration:line-through;border-radius:2px}
#rich-diff-view .rd-focus{outline:2px solid #0969da;outline-offset:2px}
`;
function N(e, i, o, n) {
  const t = e.createElement("div");
  if (t.className = `rd-block ${i}`, n) {
    const r = e.createElement("span");
    r.className = "rd-note", r.textContent = n, t.appendChild(r);
  }
  return t.appendChild(e.importNode(o, !0)), t;
}
function U(e, i) {
  const o = e.createElement("div");
  o.id = "rich-diff-view";
  const n = { added: 0, removed: 0, changed: 0 };
  for (const t of i) {
    if (t.kind === "same") {
      o.appendChild(e.importNode(t.block, !0));
      continue;
    }
    if (n[t.kind]++, t.kind === "added") o.appendChild(N(e, "rd-added", t.block));
    else if (t.kind === "removed") o.appendChild(N(e, "rd-removed", t.block));
    else {
      const r = e.importNode(t.block, !0), s = !(w(t.old) || w(t.block)) && F(t.old, r);
      o.appendChild(N(e, "rd-changed", r, s ? void 0 : "changed block (not diffed word by word)"));
    }
  }
  return { view: o, counts: n };
}
async function M(e) {
  const i = await fetch(e, { cache: "no-store" });
  if (!i.ok) return { status: i.status, body: null };
  const o = new DOMParser().parseFromString(await i.text(), "text/html");
  return { status: i.status, body: o.getElementById("content-holder") };
}
let y = null;
async function V(e) {
  const i = document.getElementById("content-holder");
  if (!i) return !1;
  if (y)
    return y.remove(), y = null, i.style.display = "", !1;
  if (!document.getElementById("rich-diff-style")) {
    const c = document.createElement("style");
    c.id = "rich-diff-style", c.textContent = G, document.head.appendChild(c);
  }
  const o = window.location.pathname, n = I + o, t = document.createElement("div");
  t.className = "rd-summary";
  let r;
  try {
    const [c, s] = await Promise.all([M(o), M(n)]);
    if (!c.body) throw new Error(`couldn't reload this page (HTTP ${c.status})`);
    const f = s.status === 404;
    if (!s.body && !f) throw new Error(`idvork.in returned HTTP ${s.status}`);
    const l = W(T(s.body), T(c.body)), d = U(document, l);
    r = d.view;
    const { added: h, removed: g, changed: x } = d.counts;
    if (t.innerHTML = `<span>Rendered diff vs <a href="${n}" target="_blank">idvork.in${o}</a>${f ? " — <b>new page</b>" : ""}</span><span class="rd-add">+${h} added</span><span class="rd-del">−${g} removed</span><span class="rd-chg">~${x} changed</span>`, e && (t.innerHTML += `<a href="${e}/files" target="_blank">source diff</a>`), h + g + x) {
      const a = document.createElement("button");
      a.textContent = "Next change ↓";
      let p = -1;
      a.onclick = () => {
        const u = Array.from(r.querySelectorAll(".rd-block"));
        u[p]?.classList.remove("rd-focus"), p = (p + 1) % u.length, u[p].classList.add("rd-focus"), u[p].scrollIntoView({ behavior: "smooth", block: "center" });
      }, t.appendChild(a);
    } else
      t.innerHTML += "<span>No rendered changes.</span>";
  } catch (c) {
    r = document.createElement("div"), r.id = "rich-diff-view", t.textContent = `Diff vs main failed: ${c.message}`;
  }
  return r.prepend(t), i.before(r), i.style.display = "none", y = r, t.scrollIntoView({ block: "start" }), window.scrollBy(0, -110), !0;
}
export {
  I as PROD_ORIGIN,
  W as diffBlocks,
  T as extractBlocks,
  w as isOpaque,
  z as lcsPairs,
  F as markWordDiff,
  U as renderDiff,
  R as similarity,
  V as toggleRichDiff,
  D as tokenize
};
//# sourceMappingURL=rich-diff.js.map
