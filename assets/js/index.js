function V(e) {
  return `
<div>
    <div class="link-box description truncate-css"> ${`<a href=${e.url}>${e.title}</a>`}:<span class="link-description"> ${e.description} <span></div>
</div>`;
}
function v(e) {
  if (e.length !== 0)
    return e[Math.floor(Math.random() * e.length)];
}
function Re(e) {
  let t = e.length, n;
  for (; t !== 0; )
    n = Math.floor(Math.random() * t), t--, [e[t], e[n]] = [e[n], e[t]];
  return e;
}
function Xe(e, t) {
  const n = t || e.name || "anonymous function";
  document.readyState === "loading" ? (console.log(`🕐 Deferring ${n} until DOM is ready`), document.addEventListener("DOMContentLoaded", () => {
    console.log(`🚀 Executing deferred ${n}`), e();
  })) : (console.log(`⚡ DOM already ready, executing ${n} immediately`), e());
}
async function C(e, t) {
  const n = $(e);
  if (n.length !== 1) {
    console.log(`append_randomizer_div ${e} not present`);
    return;
  }
  const o = await t(), r = $(o);
  n.empty().append(r), n.click(async (i) => {
    if (i.target.tagName !== "A") {
      const s = await t(), a = $(s);
      n.empty().append(a);
    }
  });
}
let A = null;
async function x(e) {
  if (A != null)
    return A;
  const t = "/back-links.json";
  try {
    return A = (await (await fetch(t)).json()).url_info, A;
  } catch (n) {
    return console.error("Error fetching link info", n), {};
  }
}
async function He() {
  try {
    const e = await x(), t = Object.keys(e).filter((o) => {
      const i = ["/404", "/404.html", "/search", "/recent", "/index.html", "/graph", "/about", "/random"].some((l) => o === l || o.endsWith(l)), a = [
        "/ig66/"
        // Exclude all ig66 subdirectory pages
      ].some((l) => o.includes(l));
      return !i && !a;
    });
    return t.length === 0 ? "/" : v(t) || "/";
  } catch (e) {
    return console.error("🚨 Error getting random page URL:", e), "/";
  }
}
async function Ke(e = "/back-links.json") {
  if (e === "/test-missing-url-info")
    throw new Error("Missing url_info in data structure");
  try {
    return await x(e);
  } catch {
    throw new Error("Missing url_info in data structure");
  }
}
function Ve(e) {
  return Object.entries(e).map(([t, n]) => ({
    url: t,
    title: n.title || t,
    description: n.description || "",
    doc_size: n.doc_size || 0,
    last_modified: n.last_modified || ""
  }));
}
function Ze(e) {
  return e.filter(
    (t) => t.description && t.description.trim() !== "" && t.title && t.title.trim() !== ""
  );
}
function Qe(e) {
  return [...e].sort((t, n) => t.last_modified && n.last_modified ? new Date(n.last_modified).getTime() - new Date(t.last_modified).getTime() : n.doc_size - t.doc_size);
}
async function De() {
  const e = await Ke(), t = Ve(e), n = Ze(t);
  return Qe(n);
}
function ge(e) {
  const t = {};
  for (const n of e) {
    if (!n.last_modified) continue;
    const o = new Date(n.last_modified), r = `${o.toLocaleString("default", {
      month: "long"
    })} ${o.getFullYear()}`;
    t[r] || (t[r] = []), t[r].push(n);
  }
  return t;
}
function he(e) {
  let t = "";
  for (const [n, o] of Object.entries(e))
    t += `
      <h3>${n}</h3>
      <ul class="last-modified-list">
        ${o.map((r) => `
          <li>
            <span class="date-badge">${new Date(r.last_modified).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short"
    })}</span>
            <a href="${r.url}">${r.title}</a>
            <p class="description">${r.description.split(`
`)[0].substring(0, 150)}${r.description.length > 150 ? "..." : ""}</p>
          </li>
        `).join("")}
      </ul>
    `;
  return t;
}
function et(e, t) {
  return `
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">▶</span> Remaining Modified Files (${t} more)
      </h2>
      <div id="remaining-posts-content" class="remaining-content" style="display: none;">
        ${e}
      </div>
    </div>
  `;
}
function tt() {
  return `
    <style>
      .last-modified-list {
        list-style-type: none;
        padding-left: 0;
      }
      .last-modified-list li {
        margin-bottom: 1.5rem;
        position: relative;
      }
      .date-badge {
        display: inline-block;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        margin-right: 0.5rem;
        font-size: 0.8rem;
      }
      .description {
        margin-top: 0.5rem;
        margin-bottom: 0;
        color: #6c757d;
      }
      .remaining-toggle {
        cursor: pointer;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        margin-top: 2rem;
        transition: background-color 0.3s;
      }
      .remaining-toggle:hover {
        background-color: #e9ecef;
      }
      .toggle-icon {
        display: inline-block;
        transition: transform 0.3s;
      }
      .toggle-icon.open {
        transform: rotate(90deg);
      }
    </style>
  `;
}
function nt(e = "remaining-posts-toggle", t = "remaining-posts-content", n = document) {
  const o = n.getElementById(e);
  if (!o) {
    console.log(`Toggle element with ID ${e} not found`);
    return;
  }
  o.addEventListener("click", function() {
    const r = n.getElementById(t);
    if (!r) {
      console.log(`Content element with ID ${t} not found`);
      return;
    }
    const i = this.querySelector(".toggle-icon");
    r.style.display === "none" ? (r.style.display = "block", i?.classList.add("open")) : (r.style.display = "none", i?.classList.remove("open"));
  });
}
function ot(e, t = 15) {
  if (e.length === 0)
    return "<p>No modified posts found.</p>";
  const n = e.slice(0, t), o = e.slice(t), r = ge(n);
  let i = he(r);
  if (o.length > 0) {
    const s = ge(o), a = he(s);
    i += et(a, o.length);
  }
  return tt() + i;
}
async function be(e = "last-modified-posts", t = 15, n = document) {
  const o = n.getElementById(e);
  if (!o) {
    console.log(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const r = await De(), i = ot(r, t);
    o.innerHTML = i, nt("remaining-posts-toggle", "remaining-posts-content", n);
  } catch (r) {
    console.error("❌ Error loading recent posts:", r), o.innerHTML = "<p>Error loading modified posts. Please try again later.</p>";
  }
}
function rt(e = "last-modified-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    be(e, 15, t);
  }) : be(e, 15, t);
}
function it(e, t = 5) {
  return e.slice(0, t);
}
function st(e) {
  return e.length === 0 ? "<p>No recent posts found.</p>" : `
    <ul>
      ${e.map(
    (t) => `
        <li>
          <a href="${t.url}">${t.title}</a> - 
          ${t.description.split(`
`)[0].substring(0, 100)}${t.description.length > 100 ? "..." : ""}
        </li>
      `
  ).join("")}
    </ul>
  `;
}
async function ye(e = "recent-posts") {
  const t = document.getElementById(e);
  if (!t) {
    console.error(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const n = await De(), o = it(n), r = st(o);
    t.innerHTML = r;
  } catch (n) {
    console.error("❌ Error loading recent posts:", n), t.innerHTML = "<p>Error loading recent posts. Please try again later.</p>";
  }
}
function at(e = "recent-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    ye(e);
  }) : ye(e);
}
console.log("Load force graph in TS v 0.9");
function j(e, t) {
  const n = e.filter((i) => i.url === t)[0];
  if (n)
    return n;
  const o = t.replace(/^\//, "").replace(/\/$/, "");
  return e.filter((i) => i.url.replace(/^\//, "").replace(/\/$/, "") === o)[0];
}
function lt(e) {
  const t = [];
  for (const n of e) {
    const o = n.outgoing_links || [], r = n.incoming_links || [], i = [...o, ...r];
    for (const a of i)
      j(w, a) && t.push({ source: n, target: a, value: 1 });
    t.filter((a) => a.source === n).length === 0 && n.url === "/eulogy" && console.log(`No valid links found for ${n.url}`);
  }
  return t;
}
function Z(e) {
  const t = e.filter((s) => s.expanded);
  e.find((s) => s.url === "/eulogy") || console.log("Eulogy node not found in pages");
  const o = lt(t), r = o.map((s) => j(e, s.target)).filter((s) => s);
  return {
    nodes: t.concat(r),
    links: o
  };
}
function ct(e, t, n) {
  const o = e.outgoing_links.length, r = e.expanded ? "-" : `+${o}`, i = `${e.id} [${r}]`, s = 12 / n;
  t.font = `${s}px Sans-Serif`;
  const l = [t.measureText(i).width, s].map((c) => c + s * 0.2);
  t.fillStyle = "rgba(255, 255, 255, 0.8)", t.fillRect(e.x - l[0] / 2, e.y - l[1] / 2, ...l), t.textAlign = "center", t.textBaseline = "middle", t.fillStyle = e.color, t.fillText(i, e.x, e.y), e.__bckgDimensions = l;
}
function dt(e, t, n) {
  n.fillStyle = t;
  const o = e.__bckgDimensions;
  o && n.fillRect(e.x - o[0] / 2, e.y - o[1] / 2, ...o);
}
let w = [], y = null, T = null;
function z(e) {
  if (!T) {
    console.log("Cannot center: Graph not initialized");
    return;
  }
  if (!e) {
    console.log("Cannot center: Node is null or undefined");
    return;
  }
  T.centerAt(e.x, e.y, 500), T.zoom(8, 500), Be(e);
}
function Be(e) {
  if (!e)
    return;
  y = e;
  const t = V(e), n = document.getElementById("detail");
  n && (n.innerHTML = t);
}
function ut() {
  y ? y.url ? window.open(y.url, "_blank") : console.log("Active node has no URL") : console.log("No active node to go to");
}
function pt() {
  for (const e of w)
    e.expanded = !1;
  y && (y.expanded = !0), T && (T.graphData(Z(w)), y && setTimeout(() => {
    z(y);
  }, 300));
}
async function mt() {
  if (!document.getElementById("graph")) {
    console.log("Graph element not found, exiting initialization");
    return;
  }
  window.location.hash.substr(1), w = Object.values(await x()).map((a) => ({
    ...a,
    id: a.url,
    expanded: !1
  }));
  const t = `/${window.location.hash ? window.location.hash.substr(1) : ""}`, n = w.map((a) => a.url).includes(t) ? t : "/eulogy";
  for (const a of w)
    a.expanded = a.url === n;
  if (typeof ForceGraph > "u") {
    console.log("Force Graph not defined, providing fallback functionality");
    const a = j(w, n);
    a && (Be(a), y = a);
    const l = document.getElementById("center_control");
    l && l.addEventListener("click", () => {
      console.log("Center control clicked (fallback mode)");
    });
    const c = document.getElementById("goto_control");
    c && c.addEventListener("click", () => {
      y?.url && window.open(y.url, "_blank");
    });
    const d = document.getElementById("collapse_control");
    d && d.addEventListener("click", () => {
      console.log("Collapse control clicked (fallback mode)");
    });
    return;
  }
  T = ForceGraph()(document.getElementById("graph")).graphData(Z(w)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(ct).nodePointerAreaPaint(dt).onNodeRightClick((a) => {
    window.open(a.url, "_blank");
  }).onNodeClick((a) => {
    a.expanded = !a.expanded, w.filter((c) => c.expanded).length === 0 && (a.expanded = !0), T.graphData(Z(w)), setTimeout(() => {
      z(a);
    }, 300);
  });
  const o = j(w, n);
  o ? z(o) : console.log("Initial node not found, cannot center");
  const r = document.getElementById("center_control");
  r ? r.addEventListener("click", () => {
    y ? z(y) : console.log("No last detail node to center on");
  }) : console.log("Center control element not found");
  const i = document.getElementById("goto_control");
  i && i.addEventListener("click", ut);
  const s = document.getElementById("collapse_control");
  s && s.addEventListener("click", pt);
}
typeof window < "u" && (window.initializeGraph = mt);
function ft() {
  const e = window.__GIT_BRANCH__;
  return e ? (console.log("Branch from global variable:", e), e) : (console.log("Branch info not found"), null);
}
function gt() {
  const e = window.__GIT_PR__;
  return e && typeof e == "number" ? (console.log("PR from global variable:", e), e) : (console.log("PR info not found"), null);
}
function ht() {
  const e = window.__GIT_CHANGED__;
  return Array.isArray(e) ? e.filter((t) => typeof t == "string" && t.startsWith("/")) : [];
}
const _e = (e) => e.replace(/\/+$/, "") || "/";
function bt(e, t) {
  return t.some((n) => _e(n) === _e(e));
}
const P = (e) => `<i class="fas ${e}"></i>`;
function yt(e) {
  const t = document.createElement("button");
  t.id = "dev-diff-toggle", t.type = "button";
  const n = (o) => {
    t.innerHTML = P(o ? "fa-times" : "fa-exchange-alt"), t.title = o ? "Exit diff" : "Diff vs main", t.setAttribute("aria-label", t.title), t.setAttribute("aria-pressed", String(o));
  };
  return t.style.cssText = "background:#238636;color:#fff;border:0;border-radius:4px;padding:1px 8px;font:inherit;cursor:pointer;", t.onclick = async () => {
    t.disabled = !0;
    const { toggleRichDiff: o } = await import("./rich-diff.js");
    n(await o(e)), t.disabled = !1;
  }, n(!1), t;
}
const _t = () => window.blogAnnotate;
function wt(e) {
  const t = document.createElement("button");
  t.id = "dev-comments-toggle", t.type = "button";
  const n = () => {
    const o = e.enabled();
    t.innerHTML = `${P("fa-comment")} ${o ? "on" : "off"}`, t.setAttribute("aria-pressed", String(o)), t.setAttribute("aria-label", "Comments"), t.title = o ? "Comments on: select text to comment. Click to turn off." : "Comments off: click to turn on annotate mode", t.style.cssText = `background:${o ? "#0b5ed7" : "#444c56"};color:#fff;border:0;border-radius:4px;padding:1px 8px;font:inherit;cursor:pointer;`;
  };
  return t.onclick = () => {
    e.set(!e.enabled()), n();
  }, n(), t;
}
function xt() {
  return window.location.port || "80";
}
function vt() {
  console.log("Initializing dev info...");
  const e = ft(), t = gt(), n = xt();
  if (console.log("Dev info - Branch:", e, "PR:", t, "Port:", n), (e || t) && n !== "80" && n !== "443") {
    const o = document.createElement("div");
    o.id = "dev-info-banner", o.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background-color: #2c2c2c;
      color: white;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    let r = "";
    if (e && (r += `<span title="Branch">${P("fa-code-branch")} <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${e}</code></span>`), t) {
      e && (r += " | ");
      const l = `https://github.com/idvorkin/idvorkin.github.io/pull/${t}`;
      r += `<a href="${l}" title="Pull request" target="_blank" style="color: #58a6ff; text-decoration: none;"><i class="fab fa-github"></i></a> <a href="${l}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${t}</code></a>`;
    }
    (e || t) && n && (r += " | "), r += `<span title="Port">${P("fa-plug")} <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${n}</code></span>`;
    const i = ht();
    if (i.length) {
      const l = i.map(
        (c) => `<a href="${encodeURI(c)}" style="color: #58a6ff; text-decoration: none;">${c.replace(/[<>&"]/g, "")}</a>`
      ).join(" ");
      r += ` | ${P("fa-edit")} Changed: ${l}`;
    }
    o.innerHTML = r, bt(window.location.pathname, i) && (o.appendChild(document.createTextNode(" | ")), o.appendChild(
      yt(t ? `https://github.com/idvorkin/idvorkin.github.io/pull/${t}` : void 0)
    ));
    const s = _t();
    s && (o.appendChild(document.createTextNode(" | ")), o.appendChild(wt(s))), document.body.appendChild(o);
    const a = Number.parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${a + 40}px`;
  }
}
const ae = {
  iconClass: "header-copy-link",
  tooltipDuration: 2e3,
  domainMapping: {
    from: "idvork.in/",
    to: "idvorkin.azurewebsites.net/"
  }
};
function kt(e) {
  const t = document.createElement("span");
  return t.className = e.iconClass || ae.iconClass, t.title = "Share this section", t.style.cursor = "pointer", t.style.marginLeft = "0.5rem", t.style.opacity = "0", t.style.transition = "opacity 0.2s ease", t.style.fontSize = "0.8em", t.style.userSelect = "none", t.setAttribute("role", "button"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-label", "Share this section"), t.innerHTML = `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`, t;
}
function $t() {
  const e = document.createElement("span");
  if (e.className = "header-github-issue", e.title = "Create GitHub issue for this section", e.style.cursor = "pointer", e.style.marginLeft = "0.5rem", e.style.opacity = "0", e.style.transition = "opacity 0.2s ease", e.style.fontSize = "0.8em", e.style.userSelect = "none", e.setAttribute("role", "button"), e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", "Create GitHub issue for this section"), !!(document.querySelector('link[href*="font-awesome"]') || document.querySelector('script[src*="font-awesome"]') || document.querySelector(".fa, .fab, .fas, .far") || // Check for inline styles that might include Font Awesome
  Array.from(document.styleSheets).some((n) => {
    try {
      return n.href?.includes("font-awesome");
    } catch {
      return !1;
    }
  }))) {
    const n = document.createElement("i");
    n.className = "fab fa-github", e.appendChild(n);
  } else
    e.textContent = "⚠️";
  return e;
}
function Et(e, t) {
  const n = document.createElement("div");
  n.className = "github-issue-popup", n.style.display = "none", n.id = `github-issue-popup-${e}`;
  const o = document.createElement("div");
  o.className = "github-issue-popup-content";
  const r = document.createElement("div");
  r.className = "github-issue-popup-header";
  const i = document.createElement("h4");
  i.textContent = `Report Issue: ${t}`;
  const s = document.createElement("button");
  s.className = "github-issue-popup-close", s.title = "Close", s.textContent = "×", r.appendChild(i), r.appendChild(s);
  const a = document.createElement("div");
  a.className = "github-issue-popup-body";
  const l = document.createElement("label");
  l.setAttribute("for", `issue-title-${e}`), l.textContent = "Issue Title:";
  const c = document.createElement("input");
  c.type = "text", c.id = `issue-title-${e}`, c.className = "github-issue-title", c.placeholder = "Brief title for the issue";
  const d = document.createElement("label");
  d.setAttribute("for", `issue-comment-${e}`), d.textContent = "Description:";
  const u = document.createElement("textarea");
  u.id = `issue-comment-${e}`, u.className = "github-issue-comment", u.placeholder = "Describe the issue with this section...", u.rows = 4;
  const p = document.createElement("div");
  p.className = "github-issue-popup-buttons";
  const g = document.createElement("button");
  g.className = "github-issue-submit", g.textContent = "Create Issue on GitHub";
  const m = document.createElement("button");
  m.className = "github-issue-cancel", m.textContent = "Cancel", p.appendChild(g), p.appendChild(m);
  const h = document.createElement("div");
  h.className = "github-issue-popup-hint";
  const b = document.createElement("small");
  return b.textContent = "Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit", h.appendChild(b), a.appendChild(l), a.appendChild(c), a.appendChild(d), a.appendChild(u), a.appendChild(p), a.appendChild(h), o.appendChild(r), o.appendChild(a), n.appendChild(o), n;
}
function Ct(e, t) {
  document.querySelectorAll(".github-issue-popup").forEach((s) => {
    s.style.display = "none";
  }), e.style.display = "block", e.style.position = "absolute", e.style.zIndex = "1000";
  const n = t.getBoundingClientRect(), o = window.pageYOffset || document.documentElement.scrollTop, r = window.pageXOffset || document.documentElement.scrollLeft;
  e.style.top = `${n.bottom + o + 10}px`, e.style.left = `${n.left + r}px`;
  const i = e.querySelector(".github-issue-title");
  i && i.focus();
}
function U(e) {
  e.style.display = "none";
  const t = e.querySelector(".github-issue-comment");
  t && (t.value = "");
}
function Tt(e, t = 2e3) {
  if (typeof document < "u" && document.querySelector) {
    const o = document.querySelector(".copy-link-tooltip");
    o && o.remove();
  }
  const n = document.createElement("span");
  n.className = "copy-link-tooltip", n.textContent = "Copied!", n.style.position = "absolute", n.style.backgroundColor = "#333", n.style.color = "white", n.style.padding = "4px 8px", n.style.borderRadius = "4px", n.style.fontSize = "12px", n.style.zIndex = "1000", n.style.marginLeft = "10px", n.style.marginTop = "-5px", e.parentElement?.appendChild(n), setTimeout(() => {
    n.remove();
  }, t);
}
function we(e) {
  if (!e) return "";
  const o = (window.location.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index").replace(/-/g, " "), r = [], i = e.tagName, s = Number.parseInt(i.substring(1)), a = Array.from(e.childNodes).filter((c) => c.nodeType === Node.TEXT_NODE).map((c) => c.textContent?.trim()).join(" ").trim();
  if (s >= 2) {
    let c = e.previousElementSibling;
    const d = [], u = /* @__PURE__ */ new Set();
    for (; c; ) {
      const p = c.tagName;
      if (p?.match(/^H[1-6]$/)) {
        const g = Number.parseInt(p.substring(1));
        if (g < s && !u.has(g)) {
          const m = Array.from(c.childNodes).filter((h) => h.nodeType === Node.TEXT_NODE).map((h) => h.textContent?.trim()).join(" ").trim();
          if (m && (d.push({ level: g, text: m }), u.add(g)), g === 1) break;
        }
      }
      c = c.previousElementSibling;
    }
    d.sort((p, g) => p.level - g.level), d.forEach((p) => r.push(p.text));
  }
  r.push(a);
  let l = `[${o}]`;
  if (r.length > 0) {
    const c = r.slice(0, 3);
    l += `: ${c.join(" > ")}`, r.length > 3 && (l += " ...");
  }
  return l;
}
function xe(e, t) {
  let n = e;
  n = n.replace("localhost:4000/", "idvorkin.azurewebsites.net/"), t.domainMapping && (n = n.replace(t.domainMapping.from, t.domainMapping.to));
  const o = new URL(n), r = o.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index", i = o.hash.replace("#", "");
  return i ? `${r}#${i}` : r;
}
async function Lt(e, t) {
  try {
    const n = window.location.href, o = n.includes("#") ? n.replace(/#.*/, `#${e}`) : `${n}#${e}`, r = xe(o, t), i = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`, s = document.getElementById(e), l = `${s ? Array.from(s.childNodes).filter((m) => m.nodeType === Node.TEXT_NODE).map((m) => m.textContent?.trim()).join(" ").trim() : ""} - Igor's Blog`, c = ke(e), d = we(s);
    let u = `From: ${d} ...`;
    c && (u = `From: ${d} ...

${c}`), fetch(i).catch(() => {
    });
    const p = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (navigator.share && p)
      try {
        return await navigator.share({
          title: l,
          text: u,
          url: i
        }), console.log(`📱 Shared via native share: ${i}`), !0;
      } catch (m) {
        console.log("Share cancelled or failed, falling back to clipboard", m);
      }
    let g = i;
    return c && (g = `From: ${d} ...

${c}

${i}`), await navigator.clipboard.writeText(g), console.log(`📋 Copied to clipboard with preview: ${g.substring(0, 100)}...`), !1;
  } catch (n) {
    console.error("Failed to share/copy header link:", n);
    try {
      const o = window.location.href, r = o.includes("#") ? o.replace(/#.*/, `#${e}`) : `${o}#${e}`, i = xe(r, t), s = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(i)}`, a = document.getElementById(e), l = we(a), c = ke(e);
      let d = s;
      c && (d = `From: ${l} ...

${c}

${s}`);
      const u = document.createElement("textarea");
      return u.value = d, document.body.appendChild(u), u.select(), document.execCommand("copy"), document.body.removeChild(u), console.log(`📋 Copied with preview (fallback): ${d.substring(0, 100)}...`), !1;
    } catch (o) {
      throw console.error("Failed to copy URL even with fallback:", o), o;
    }
  }
}
function St(e) {
  if (e.id)
    return e.id;
  const n = (e.textContent || "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let o = n, r = 1;
  for (; document.getElementById(o); )
    o = `${n}-${r}`, r++;
  return e.id = o, o;
}
const Oe = 600;
function ze(e) {
  let t = e.nextElementSibling;
  const n = (o) => {
    let r = o;
    for (; r; ) {
      if (r.tagName.match(/^H[1-6]$/))
        return !1;
      if ((r.tagName === "P" || r.tagName === "UL" || r.tagName === "OL") && (r.textContent || "").trim().length > 0)
        return !0;
      r = r.nextElementSibling;
    }
    return !1;
  };
  for (; t && !t.tagName.match(/^H[1-6]$/); ) {
    if (t.tagName === "P") {
      const o = (t.textContent || "").trim();
      if (o.length > 0) {
        const r = n(t.nextElementSibling);
        return { text: o, hasMore: r };
      }
    }
    if (t.tagName === "UL" || t.tagName === "OL") {
      const o = t.querySelectorAll("li"), r = [];
      let i = 0, s = !1;
      for (const a of Array.from(o)) {
        const l = Array.from(a.childNodes).filter(
          (d) => d.nodeType === Node.TEXT_NODE || d.nodeType === Node.ELEMENT_NODE && d.tagName !== "UL" && d.tagName !== "OL"
        ).map((d) => (d.textContent || "").trim()).join(" ").trim();
        if (l.length === 0) continue;
        const c = l.length + 2;
        if (r.length > 0 && i + c + 1 > Oe) {
          s = !0;
          break;
        }
        r.push(`• ${l}`), i += c + 1;
      }
      if (r.length > 0) {
        const a = s || n(t.nextElementSibling);
        return { text: r.join(`
`), hasMore: a };
      }
    }
    t = t.nextElementSibling;
  }
  return { text: "", hasMore: !1 };
}
function R(e, t = Oe) {
  if (e.length <= t)
    return e;
  const n = e.substring(0, t), o = Math.floor(t * 0.6), r = [". ", "! ", "? ", `.
`, `!
`, `?
`];
  let i = -1;
  for (const l of r) {
    const c = n.lastIndexOf(l);
    c >= o && c + l.length > i && (i = c + 1);
  }
  if (i > 0)
    return `${n.substring(0, i).trimEnd()}...`;
  const s = n.lastIndexOf(`
•`);
  if (s >= o)
    return `${n.substring(0, s).trimEnd()}...`;
  const a = n.lastIndexOf(" ");
  return a > 0 ? `${n.substring(0, a)}...` : `${n}...`;
}
function ve(e, t) {
  return !t || e.endsWith("...") || e.endsWith("…") ? e : `${e}...`;
}
function ke(e) {
  if (e) {
    const o = document.getElementById(e);
    if (o) {
      const { text: r, hasMore: i } = ze(o);
      if (r)
        return ve(R(r), i);
      let s = o.nextElementSibling;
      const a = [];
      let l = 0, c = !1;
      for (; s && l < 400 && !s.tagName.match(/^H[1-6]$/); ) {
        if (s.tagName === "P" || s.tagName === "LI" || s.tagName === "BLOCKQUOTE" || s.tagName === "DIV") {
          const u = (s.textContent || "").trim();
          u.length > 0 && (a.push(u), l += u.length);
        }
        s = s.nextElementSibling;
      }
      let d = s;
      for (; d && !c && !d.tagName.match(/^H[1-6]$/); ) {
        if ((d.textContent || "").trim().length > 0) {
          c = !0;
          break;
        }
        d = d.nextElementSibling;
      }
      if (a.length > 0)
        return ve(R(a.join(" ")), c);
    }
  }
  const t = [
    "article",
    "main",
    ".content",
    ".post-content",
    ".entry-content",
    "#content-holder",
    ".content-holder"
  ];
  for (const o of t) {
    const r = document.querySelector(o);
    if (r) {
      const i = r.querySelector("p");
      if (i) {
        const s = (i.textContent || "").trim();
        if (s.length > 0)
          return R(s);
      }
    }
  }
  const n = document.querySelector("p");
  if (n) {
    const o = (n.textContent || "").trim();
    if (o.length > 0)
      return R(o);
  }
  return "";
}
function It(e, t, n, o, r) {
  const s = window.location.pathname.replace(/^\//, "").replace(/\.html$/, ""), a = document.querySelector('meta[property="markdown-path"]'), l = a ? a.getAttribute("content") : `${s || "index"}.md`, c = "https://github.com/idvorkin/idvorkin.github.io", d = n ? `${s || "index"}/${e}: ${n}` : `${s || "index"}/${e}: Issue with ${t}`, u = encodeURIComponent(d), p = o || n || `Issue with section: ${t}`, g = r ? ze(r) : "";
  let h = `${`📍 [${s || "index"}](https://idvorkin.azurewebsites.net/${s})/[${e}](https://idvorkin.azurewebsites.net/${s}/${e}) - [[GitHub]](${c}/blob/main/${l}#${e})`}

## Description

${p}

`;
  g && (h += `## Content Excerpt

#### ${t}

> ${g}

`);
  const b = encodeURIComponent(h);
  return `${c}/issues/new?title=${u}&body=${b}`;
}
const Q = /* @__PURE__ */ new WeakMap(), ee = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new Set();
function Mt(e, t) {
  let n = ee.get(e);
  return n || (n = Et(t, e.textContent || ""), document.body.appendChild(n), ee.set(e, n), Nt(n, e, t)), n;
}
function Nt(e, t, n) {
  const o = [], r = e.querySelector(".github-issue-popup-close");
  if (r) {
    const p = () => U(e);
    r.addEventListener("click", p), o.push(() => r.removeEventListener("click", p));
  }
  const i = e.querySelector(".github-issue-cancel");
  if (i) {
    const p = () => U(e);
    i.addEventListener("click", p), o.push(() => i.removeEventListener("click", p));
  }
  const s = () => {
    const p = e.querySelector(".github-issue-title"), g = e.querySelector(".github-issue-comment"), m = p?.value || "", h = g?.value || "", b = It(n, t.textContent || "", m, h, t);
    window.open(b, "_blank"), U(e);
  }, a = e.querySelector(".github-issue-submit");
  a && (a.addEventListener("click", s), o.push(() => a.removeEventListener("click", s)));
  const l = e.querySelector(".github-issue-title"), c = e.querySelector(".github-issue-comment"), d = (p) => {
    (p.ctrlKey || p.metaKey) && p.key === "Enter" && (p.preventDefault(), s());
  };
  l && (l.addEventListener("keydown", d), o.push(() => l.removeEventListener("keydown", d))), c && (c.addEventListener("keydown", d), o.push(() => c.removeEventListener("keydown", d)));
  const u = Q.get(t) || [];
  Q.set(t, [...u, ...o]);
}
function At(e, t) {
  if (e.querySelector(`.${t.iconClass || ae.iconClass}`))
    return;
  const o = St(e), r = kt(t), i = $t(), s = [], a = async (m) => {
    m.preventDefault(), m.stopPropagation(), await Lt(o, t) || Tt(r, t.tooltipDuration);
  };
  r.addEventListener("click", a), s.push(() => r.removeEventListener("click", a));
  const l = (m) => {
    (m.key === "Enter" || m.key === " ") && (m.preventDefault(), a(m));
  };
  r.addEventListener("keydown", l), s.push(() => r.removeEventListener("keydown", l));
  const c = (m) => {
    m.preventDefault(), m.stopPropagation();
    const h = Mt(e, o);
    Ct(h, e);
  };
  i.addEventListener("click", c), s.push(() => i.removeEventListener("click", c));
  const d = (m) => {
    const h = ee.get(e);
    h && !h.contains(m.target) && m.target !== i && !i.contains(m.target) && h.style.display !== "none" && U(h);
  }, u = setTimeout(() => {
    typeof document > "u" || (document.addEventListener("click", d, !0), s.push(() => document.removeEventListener("click", d, !0)));
  }, 100);
  s.push(() => clearTimeout(u)), e.appendChild(r), e.appendChild(i);
  const p = () => {
    r.style.opacity = "1", i.style.opacity = "1";
  }, g = () => {
    r.style.opacity = "0", i.style.opacity = "0";
  };
  e.addEventListener("mouseenter", p), e.addEventListener("mouseleave", g), s.push(() => {
    e.removeEventListener("mouseenter", p), e.removeEventListener("mouseleave", g);
  }), Q.set(e, s), Pt.add(e);
}
function $e(e = {}) {
  const t = { ...ae, ...e }, n = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const o of Array.from(n))
    At(o, t);
}
function Rt() {
  const e = "header-copy-link-styles";
  if (document.getElementById(e))
    return;
  const t = document.createElement("style");
  t.id = e, t.textContent = `
    .header-copy-link,
    .header-github-issue {
      opacity: 0;
      margin-left: 0.5rem;
      transition: opacity 0.2s ease;
      cursor: pointer;
      user-select: none;
      font-size: 0.8em;
      color: #6c757d;
      text-decoration: none;
    }
    
    .header-copy-link:hover {
      color: #007bff;
    }
    
    .header-github-issue:hover {
      color: #dc3545;
    }
    
    h1:hover .header-copy-link,
    h2:hover .header-copy-link,
    h3:hover .header-copy-link,
    h4:hover .header-copy-link,
    h5:hover .header-copy-link,
    h6:hover .header-copy-link,
    h1:hover .header-github-issue,
    h2:hover .header-github-issue,
    h3:hover .header-github-issue,
    h4:hover .header-github-issue,
    h5:hover .header-github-issue,
    h6:hover .header-github-issue {
      opacity: 1;
    }
    
    /* Ensure headers have relative positioning for tooltip placement */
    h1, h2, h3, h4, h5, h6 {
      position: relative;
    }
    
    /* GitHub Issue Popup Styles */
    .github-issue-popup {
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 400px;
      max-width: 90vw;
      z-index: 1000;
    }
    
    .github-issue-popup-content {
      padding: 0;
    }
    
    .github-issue-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f6f8fa;
      border-bottom: 1px solid #e1e4e8;
      border-radius: 8px 8px 0 0;
    }
    
    .github-issue-popup-header h4 {
      margin: 0;
      font-size: 14px;
      color: #24292e;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 350px;
    }
    
    .github-issue-popup-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #586069;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .github-issue-popup-close:hover {
      color: #24292e;
    }
    
    .github-issue-popup-body {
      padding: 16px;
    }
    
    .github-issue-popup-body label {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #24292e;
    }
    
    .github-issue-title,
    .github-issue-comment {
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 12px;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    
    .github-issue-title:focus,
    .github-issue-comment:focus {
      outline: none;
      border-color: #0366d6;
      box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
    }
    
    .github-issue-comment {
      resize: vertical;
      min-height: 80px;
    }
    
    .github-issue-popup-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 12px;
    }
    
    .github-issue-submit,
    .github-issue-cancel {
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid;
      transition: all 0.2s;
    }
    
    .github-issue-submit {
      background: #2ea44f;
      color: white;
      border-color: #2ea44f;
    }
    
    .github-issue-submit:hover {
      background: #2c974b;
      border-color: #2c974b;
    }
    
    .github-issue-cancel {
      background: #fafbfc;
      color: #24292e;
      border-color: #e1e4e8;
    }
    
    .github-issue-cancel:hover {
      background: #f3f4f6;
      border-color: #c9ced1;
    }
    
    .github-issue-popup-hint {
      margin-top: 8px;
      text-align: center;
      color: #586069;
    }
  `, document.head.appendChild(t);
}
let Ee = !1;
function Ht(e = {}) {
  Ee || (Ee = !0, Rt(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    $e(e);
  }) : $e(e));
}
const te = 50, ne = 100, Dt = te * ne;
function G(e = 0) {
  if (typeof document > "u")
    return;
  if (console.log("🖼️ Enabling image zoom functionality"), typeof window.GLightbox > "u") {
    if (e < te) {
      console.warn(
        `⚠️ GLightbox not found, retrying in ${ne}ms (attempt ${e + 1}/${te})`
      ), setTimeout(() => G(e + 1), ne);
      return;
    }
    console.error(
      `❌ GLightbox failed to load after ${Dt / 1e3} seconds, aborting image zoom initialization`
    );
    return;
  }
  const t = [
    "p img",
    // Images inside paragraphs (most common in markdown)
    "li img",
    // Images inside list items
    ".container img",
    ".post-content img",
    "article img",
    ".markdown-body img",
    "main img"
  ], n = document.querySelectorAll(t.join(", "));
  console.log(`🔍 Found ${n.length} images to process`);
  let o = 0;
  n.forEach((r, i) => {
    const s = r;
    if (s.parentElement?.tagName === "A") {
      console.log(`⏭️ Skipping image ${i + 1} - already wrapped`);
      return;
    }
    if (s.naturalWidth > 0 && s.naturalWidth < 100 && s.naturalHeight < 100) {
      console.log(
        `⏭️ Skipping image ${i + 1} - too small (${s.naturalWidth}x${s.naturalHeight})`
      );
      return;
    }
    const a = document.createElement("a");
    a.href = s.src, a.className = "glightbox", a.setAttribute("data-gallery", "post-images"), s.alt && a.setAttribute("data-description", s.alt), s.parentNode?.insertBefore(a, s), a.appendChild(s), o++, console.log(
      `✅ Processed image ${i + 1}: ${s.src.substring(s.src.lastIndexOf("/") + 1)}`
    );
  });
  try {
    const r = window.GLightbox({
      selector: ".glightbox",
      touchNavigation: !0,
      loop: !0,
      autoplayVideos: !0
    });
    o > 0 ? console.log(`🎉 Image zoom enabled for ${o} images`) : console.log("ℹ️ No images needed processing, but GLightbox initialized for existing elements");
  } catch (r) {
    console.error("Error initializing GLightbox:", r);
  }
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => G()) : setTimeout(() => G(), 500));
const le = "random-arrival-path", E = "random-reroll-dice", oe = "random-reroll", re = "random-reroll-close", Ce = "random-reroll-style", Ue = 550, Bt = `
#${oe}{position:fixed;right:max(4px, env(safe-area-inset-right));
  bottom:calc(80px + env(safe-area-inset-bottom));z-index:9999;width:48px;height:48px}
body:has(#rd-nav) #${oe}{bottom:calc(120px + env(safe-area-inset-bottom))}
#${E}{width:48px;height:48px;padding:0;font-size:28px;line-height:48px;text-align:center;
  border:0;border-radius:50%;color:#000;background:rgba(255,255,255,.92);box-shadow:0 2px 8px rgba(0,0,0,.3);
  cursor:pointer;touch-action:manipulation;animation:rrd-wiggle 6s ease-in-out 2s infinite}
/* disabled buttons get translucent text, which fades the color emoji mid-roll */
#${E}:disabled{color:#000;opacity:1}
#${E}.rrd-rolling{animation:rrd-roll ${Ue}ms cubic-bezier(.3,1.4,.6,1) forwards}
#${re}{position:absolute;top:-14px;left:-14px;width:32px;height:32px;padding:0;border:0;
  background:transparent;cursor:pointer;touch-action:manipulation;display:flex;
  align-items:center;justify-content:center}
#${re} span{width:18px;height:18px;border-radius:50%;background:#555;color:#fff;
  font:700 13px/18px system-ui,sans-serif;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.35)}
@keyframes rrd-roll{
  0%{transform:translateY(0) rotate(0) scale(1)}
  35%{transform:translateY(-22px) rotate(220deg) scale(1.18)}
  65%{transform:translateY(0) rotate(400deg) scale(.88,1.08)}
  82%{transform:translateY(-7px) rotate(440deg) scale(1.04)}
  100%{transform:translateY(0) rotate(360deg) scale(1)}}
@keyframes rrd-wiggle{
  0%,86%,100%{transform:rotate(0)}
  89%{transform:rotate(-14deg) scale(1.06)}
  93%{transform:rotate(11deg) scale(1.06)}
  96%{transform:rotate(-5deg)}}
@media (prefers-reduced-motion: reduce){#${E},#${E}.rrd-rolling{animation:none}}
`;
function W(e) {
  let t = e.split(/[?#]/)[0] || "/";
  try {
    t = decodeURI(t);
  } catch {
  }
  return t.length > 1 ? t.replace(/\/+$/, "") : t;
}
function ce() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
function Ot(e = ce()) {
  try {
    e?.removeItem(le);
  } catch {
  }
}
function zt() {
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  } catch {
    return !1;
  }
}
function Ut(e, t = ce()) {
  try {
    t?.setItem(le, W(new URL(e, window.location.origin).pathname));
  } catch {
  }
}
function Ft(e, t = ce()) {
  try {
    const n = t?.getItem(le);
    return n != null && n === W(e);
  } catch {
    return !1;
  }
}
async function jt(e, t = He) {
  const n = W(e);
  let o = await t();
  for (let r = 0; r < 4 && W(o) === n; r++)
    o = await t();
  return o;
}
async function Gt(e = (n) => window.location.assign(n), t = He) {
  const n = await jt(window.location.pathname, t);
  return Ut(n), e(n), n;
}
function Wt(e = document) {
  if (!Ft(window.location.pathname) || e.getElementById(E))
    return null;
  if (!e.getElementById(Ce)) {
    const r = e.createElement("style");
    r.id = Ce, r.textContent = Bt, e.head.appendChild(r);
  }
  const t = e.createElement("div");
  t.id = oe;
  const n = e.createElement("button");
  n.id = E, n.type = "button", n.textContent = "🎲", n.title = "Another random post", n.setAttribute("aria-label", "Another random post");
  const o = e.createElement("button");
  return o.id = re, o.type = "button", o.title = "Hide the dice", o.setAttribute("aria-label", "Hide the random dice"), o.innerHTML = '<span aria-hidden="true">×</span>', n.addEventListener("click", () => {
    if (n.disabled) return;
    n.disabled = !0;
    const r = Date.now(), i = zt() ? 0 : Ue;
    n.classList.add("rrd-rolling"), Gt((s) => {
      window.setTimeout(() => window.location.assign(s), Math.max(0, i - (Date.now() - r)));
    });
  }), o.addEventListener("click", (r) => {
    r.stopPropagation(), Ot(), t.remove();
  }), t.append(n, o), e.body.appendChild(t), n;
}
const qt = "https://idvork.in", Yt = "idvork.in", Jt = "http://localhost:4000", M = "from_test", q = "idvorkin_test_origin", Te = "swap-toast", Xt = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);
function de(e) {
  return e === Yt;
}
function ie(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    return !1;
  }
  if (t.origin !== e || t.protocol !== "http:" && t.protocol !== "https:") return !1;
  const n = t.hostname;
  return de(n) ? !1 : Xt.has(n) || n.endsWith(".ts.net");
}
function Kt(e, t) {
  const n = new URLSearchParams(e.search);
  return n.delete(M), de(e.hostname) ? !t || !ie(t) ? { error: "no-test-origin" } : { url: `${t}${e.pathname}${Le(n)}${e.hash}` } : (n.append(M, e.origin), { url: `${qt}${e.pathname}${Le(n)}${e.hash}` });
}
function Le(e) {
  const t = e.toString();
  return t ? `?${t}` : "";
}
function Vt(e, t) {
  const n = e.searchParams.get(M);
  if (n && ie(n)) return n;
  try {
    const o = new URL(t).origin;
    if (ie(o)) return o;
  } catch {
  }
  return null;
}
function Zt() {
  if (!de(window.location.hostname)) return;
  const e = new URL(window.location.href), t = Vt(e, document.referrer);
  if (t) {
    try {
      sessionStorage.setItem(q, t), localStorage.setItem(q, t);
    } catch {
    }
    e.searchParams.has(M) && (e.searchParams.delete(M), history.replaceState(history.state, "", e.href));
  }
}
function Qt() {
  try {
    return sessionStorage.getItem(q) || localStorage.getItem(q);
  } catch {
    return null;
  }
}
function en() {
  const e = new URL(window.location.href), t = Kt(e, Qt());
  if ("url" in t) {
    window.location.assign(t.url);
    return;
  }
  const n = `${e.pathname}${e.search}${e.hash}`;
  tn(
    "No test server remembered. Press P on a test server first, or try ",
    `${Jt}${n}`,
    "localhost:4000"
  );
}
function tn(e, t, n) {
  document.getElementById(Te)?.remove();
  const o = document.createElement("div");
  o.id = Te, o.setAttribute("role", "status"), o.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10000;background:#333;color:#fff;padding:10px 16px;border-radius:6px;font:14px/1.4 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.4);max-width:90vw;", o.append(e);
  const r = document.createElement("a");
  r.href = t, r.textContent = n, r.style.cssText = "color:#9cf;text-decoration:underline;", o.append(r), document.body.append(o), setTimeout(() => o.remove(), 5e3);
}
let se = !0;
function Se() {
  const e = $(".ui-toc-dropdown .toc"), t = $(".expand-toggle");
  if (e.length === 0 || t.length === 0) {
    console.warn("TOC or toggle elements not found for expand/collapse");
    return;
  }
  se ? (e.addClass("expand"), t.text("Collapse all")) : (e.removeClass("expand"), t.text("Expand all"));
}
function Fe() {
  const e = $("#right-sidebar"), t = $("#main-content");
  e.length > 0 && (e.removeClass(), e.addClass("col-4 pl-0")), t.length > 0 && (t.removeClass(), t.addClass("col-8 pr-0"));
  const n = $("#id-ui-toc-dropdown");
  n.length > 0 && (n.removeClass(), n.addClass("d-none"));
}
function Ie(e, t) {
  const n = $(`#${e}`);
  if (n.length === 0) {
    console.warn(`Target element #${e} not found for TOC generation`);
    return;
  }
  if (n.html(""), $("#content-holder").length === 0) {
    console.warn("Content holder not found for TOC generation");
    return;
  }
  new window.Toc("content-holder", {
    level: 3,
    top: -1,
    class: "toc",
    ulClass: "nav",
    targetId: e
  }), n.text() === "undefined" && n.html("");
  const o = $('<div class="toc-menu"></div'), r = $('<a class="expand-toggle" href="#">Collapse all</a>'), i = $('<a class="back-to-top" href="#">Top of page</a>'), s = $('<a class="go-to-bottom" href="#">Bottom of page</a>'), a = $('<a class="go-to-bottom" href="#">Pin ToC</a>');
  Se(), r.click((l) => {
    l.preventDefault(), l.stopPropagation(), se = !se, Se();
  }), i.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, 0);
  }), s.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, document.body.scrollHeight);
  }), a.click((l) => Fe()), o.append(r).append(i).append(s), t && o.append(a), n.append(o);
}
async function nn(e) {
  let t, n, o;
  try {
    if (!e) {
      console.log("No backlinks available");
      return;
    }
    if (t = new URL(document.URL).pathname, !e[t]) {
      console.log(`Page ${t} not found in backlinks`);
      return;
    }
    if (n = e[t]?.incoming_links, o = e[t]?.outgoing_links, !n && !o) {
      console.log(`No backlinks for the page ${t}`);
      return;
    }
  } catch (u) {
    console.log(`Error processing links: ${u instanceof Error ? u.message : String(u)}`);
    return;
  }
  const r = $("#links-to-page");
  if (!r || r.length === 0) {
    console.log("No back_link_location");
    return;
  }
  r.append(
    `
<ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#incoming" type="button" role="tab" aria-controls="incoming" aria-selected="true">Links to here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#outgoing" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Link from here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#graph" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Graph</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active " id="incoming" role="tabpanel" aria-labelledby="incoming-tab"></div>
  <div class="tab-pane fade" id="outgoing" role="tabpanel" aria-labelledby="outgoing-tab"></div>
  <div class="tab-pane fade" id="graph" role="tabpanel" aria-labelledby="outgoing-tab">
    <span> View the graph for: </span>
  </div>
</div>
`
  );
  const i = r.find("#incoming"), s = (u, p) => Number(e[p].doc_size) - Number(e[u].doc_size);
  if (n)
    for (const u of n.sort(s)) {
      const p = e[u];
      i.append(V(p));
    }
  const a = [];
  for (const u of o)
    e[u] && a.push(u);
  const l = r.find("#outgoing");
  if (a)
    for (const u of a.sort(s)) {
      const p = e[u];
      l.append(V(p));
    }
  const c = r.find("#graph"), d = t.replace(/\//g, "");
  c.append(`<a href='/graph#${d}'>${t} (${d}) </a>`);
}
function on(e, t) {
  if (!t)
    return I(e, "URL info is undefined");
  const n = t.url || "#", o = t.title || "Untitled", r = t.description || "No description available", i = `(From:<a href='${n}'> ${o}</a>)`;
  return `<div>
        <i> ${r}</i> ${i}
    </div>`;
}
function I(e, t) {
  return `<span class='text-danger'>Error: Invalid link for ${e?.attr ? e.attr("href") : "unknown"} ${t} </span>`;
}
function rn(e) {
  if (!e) {
    console.log("No backlinks data available");
    return;
  }
  try {
    const t = $.makeArray($(".summary-link"));
    if (!t || t.length === 0) {
      console.log("No summary links found");
      return;
    }
    for (const n of t) {
      const o = $(n);
      try {
        if (!o || !o.attr) {
          console.log("Invalid link element");
          return;
        }
        let r = o.attr("href");
        if (!r) {
          o.html(I(o, "missing href"));
          return;
        }
        if (!e.redirects || !e.url_info) {
          o.html(I(o, "incomplete backLinks data"));
          return;
        }
        if (e.redirects[r] !== void 0 && (r = e.redirects[r]), e.url_info[r] === void 0) {
          o.html(I(o, "not found in url info"));
          return;
        }
        o.html(on(o, e.url_info[r]));
      } catch (r) {
        o?.html ? o.html(I(o, r)) : console.error("Error processing link and unable to display error:", r);
      }
    }
  } catch (t) {
    console.error("Error processing summary links:", t);
  }
}
async function sn() {
  const e = "__idvorkin_add_link_loader_initialized__";
  window[e] || (window[e] = !0, nn(await x()), rn(await an()));
}
let H = null;
async function an() {
  try {
    if (H != null)
      return H;
    const e = "/back-links.json";
    try {
      const t = await $.getJSON(e);
      return t.redirects || (t.redirects = {}), t.url_info || (t.url_info = {}), H = t, H;
    } catch (t) {
      return console.error("Error fetching backlinks JSON:", t), { redirects: {}, url_info: {} };
    }
  } catch (e) {
    return console.error("Error in get_back_links:", e), { redirects: {}, url_info: {} };
  }
}
function ln() {
  window.location.href = "/";
}
function cn() {
  const e = window.Mousetrap();
  e.bind("s", (n) => ln()), e.bind("t", (n) => Fe()), e.bind("p", () => en()), e.bind("a", (n) => {
    location.href = "/all";
  }), e.bind("m", (n) => {
    location.href = "/toc";
  }), e.bind("6", (n) => {
    location.href = "/ig66";
  });
  const t = `
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  Ctrl/Cmd+Shift+A - toggle annotate (comment) mode
  `;
  e.bind("?", (n) => alert(t)), document.body.dataset.shortcuts = "ready";
}
function dn(e) {
  for (const [t, n] of Object.entries(e)) {
    const o = typeof $ < "u" && $.fn ? $(`a[href=${t}]`).first()[0] : document.querySelector(`a[href="${t}"]`);
    if (!o) return;
    const r = n.cloneNode(!0);
    r.children.length > 0 && r.children[0].remove(), o.replaceWith(r), n.remove();
  }
}
function un() {
  const e = {}, t = typeof $ < "u" && $.fn ? $("ul").toArray() : Array.from(document.querySelectorAll("ul"));
  for (const n of t) {
    const o = n.firstElementChild;
    if (!o) continue;
    const r = o.textContent;
    if (!r || !r.startsWith("l")) continue;
    const i = Number.parseInt(r.substring(1));
    Number.isNaN(i) || (e[r] = n);
  }
  return e;
}
function X() {
  const e = un();
  dn(e);
}
function F() {
  const e = "__idvorkin_load_globals_initialized__";
  window[e] || (window[e] = !0, Zt(), $(sn), $(cn), typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(X) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", X) : X()), at(), document.getElementById("last-modified-posts") && rt(), $(() => {
    Ie("ui-toc", !0), Ie("ui-toc-affix", !1);
  }), Ht(), G(), vt(), Wt());
}
typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(F) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", F) : F());
function K(e) {
  const t = $("<div/>"), n = `<h4> <a href='${e.url}'}>${e.title}</a></h4>`, o = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  t.append(n);
  const r = e.thumbnail.replace("s72-c", "s320"), i = new Date(e.published), s = `
    <div> ${o[i.getMonth()]} ${i.getFullYear()} - ${e.excerpt}
    </div>
   `;
  return e.thumbnail !== "" ? (console.log(e.title), console.log(i), t.append(
    // `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
    `
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${r}'/></a>
      ${s}
      </div>`
  )) : t.append(s), t.html();
}
function pn(e) {
  return e.filter((t) => t.title.toLowerCase().includes("achievement"));
}
function mn(e) {
  return e.filter((t) => t.tags.includes("family-journal"));
}
function fn(e) {
  if (console.log("Processing", e.length, "posts"), !e) {
    console.log("No posts being imported");
    return;
  }
  const t = "#random-post", n = "#achievment", o = "#random-recent";
  C(t, () => K(v(e))), C(n, () => K(v(pn(e)))), C(o, () => K(v(mn(e))));
}
function ue() {
  $.getJSON("/ig66/ig66-export.json", fn);
}
function gn(e) {
  const t = e.title.replace(/ /g, "%20"), n = ["igor", "ammon"];
  return `
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${n[Math.floor(Math.random() * n.length)]}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">🔈</a></b> - ${e.summary}
  </div>
  `;
}
function hn(e, t) {
  if (!t) {
    console.log("No roles being imported");
    return;
  }
  console.log("Processing", t.roles.length, "roles"), C(e, () => gn(v(t.roles)));
}
function pe(e) {
  $.getJSON("/eulogy.json", (n) => hn(e, n));
}
class f {
  constructor({
    name: t,
    value: n = 25,
    children: o = []
  }) {
    this.name = t, this.children = Re(o), this.value = n;
  }
}
function me(e = je, t = bn) {
  const n = e();
  for (const o of n.keys())
    t(o, n.get(o));
}
function bn(e, t, n = $, o = C) {
  const r = () => `<span>${v(
    t
  )}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">🔄</span>`, i = n('<div class="alert alert-primary" role="alert"/>');
  n(e).after(i), o(i, r);
}
function je(e = $) {
  const t = e("h3").first();
  let n = t, o = [];
  const r = /* @__PURE__ */ new Map();
  for (let i = t; i.length !== 0; i = e(i).next()) {
    if (i.prop("tagName") === "H3") {
      r.set(n, o), n = i, o = [];
      continue;
    }
    i.prop("tagName") === "UL" && (o = Array.from(e(i).find("li")).map((s) => e(s).text()));
  }
  return r.set(n, o), r;
}
function* Y(e) {
  if (!e)
    return;
  const t = [];
  for (t.push([e, null]); t.length > 0; ) {
    const [n, o] = t.shift();
    for (const r of n.children ?? [])
      t.push([r, n]);
    yield [n, o];
  }
}
function yn(e) {
  const t = Array.from(Y(e)).map(([n, o]) => [n.name, o?.name]);
  return {
    ids: t.map(([n, o]) => n),
    labels: t.map(([n, o]) => n),
    parents: t.map(([n, o]) => o)
  };
}
function Pe(e = je) {
  const t = e(), n = Array.from(t.entries()).map(([o, r], i) => [o.text(), r]);
  return new Map(n);
}
function Me(e, t, n) {
  const o = Array.from(Y(t)).find(([a, l]) => a.name === e);
  if (!o)
    return "Click in any box or circle";
  const [r, i] = o, s = Array.from(Y(r)).map(([a, l]) => a).filter((a) => {
    const l = n.has(a.name), c = n.has(`${a.name}🔗`);
    return l || c;
  }).flatMap((a) => (n.get(a.name) || n.get(`${a.name}🔗`) || []).map((c) => `${a.name}: ${c}`));
  return s.length === 0 ? "Click in any box or circle" : v(s);
}
function _n(e, t = document) {
  const n = (r) => r.replace(/🔗/g, "").trim(), o = n(e ?? "");
  if (!o) return null;
  for (const r of Array.from(t.querySelectorAll("h2, h3")))
    if (n(r.textContent ?? "") === o) return r;
  return null;
}
function wn(e, t = window) {
  const n = _n(e, t.document);
  return n ? (n.scrollIntoView({ behavior: "smooth", block: "start" }), n.id && t.history?.replaceState && t.history.replaceState(null, "", `#${n.id}`), !0) : !1;
}
async function fe(e, t, n, o = $, r = Plotly) {
  if (!r) {
    console.error("Plotly is not available");
    return;
  }
  const i = yn(n), s = {
    type: "sunburst",
    outsidetextfont: { size: 20, color: "#377eb8" },
    // leaf: {opacity: 0.4},
    hoverinfo: "none",
    marker: { line: { width: 2 } },
    maxdepth: 2,
    displayModeBar: !1
  };
  Object.assign(s, i), s.values = void 0;
  const a = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"]
  }, l = {
    displayModeBar: !1
  };
  try {
    await r.newPlot(e, [s], a, l);
    const c = (u) => {
      o(`#${t}`).text(u);
    };
    o(`#${t}`).first().click(() => {
      const u = o("#sunburst text:first").text(), p = Me(u, n, Pe());
      c(p);
    });
    const d = document.getElementById(e);
    return d && typeof d.on == "function" && d.on("plotly_click", (u) => {
      if (u?.points?.[0]) {
        const p = u.points[0].label, g = Me(p, n, Pe());
        c(g);
        const m = Array.from(Y(n)).find(
          ([b, J]) => b.name === p
        ), h = m ? m[0] : void 0;
        h && !h.children?.length && wn(p);
      }
    }), d;
  } catch (c) {
    return console.error("Failed to create sunburst plot:", c), null;
  }
}
function xn(e = "Root", t = null, n = $) {
  const o = t ? n(t).find("h2") : n("h2"), r = [];
  return o.each((i, s) => {
    const a = n(s), l = a.text().trim();
    if (!l) return;
    const c = [];
    let d = a.next();
    for (; d.length > 0 && d.prop("tagName") !== "H2"; ) {
      if (d.prop("tagName") === "H3") {
        const u = d.text().trim();
        u && c.push(new f({ name: u }));
      }
      d = d.next();
    }
    c.length > 0 && r.push(new f({ name: l, children: c }));
  }), new f({ name: e, children: r });
}
async function vn(e, t, n = "Root", o = null, r = $, i = Plotly) {
  const s = xn(n, o, r);
  return fe(e, t, s, r, i);
}
class kn {
  /**
   * Gets the tree structure for Seven Habits visualization
   * @returns {TreeNode} The root node of the Seven Habits tree
   */
  get_tree() {
    return new f({
      name: "7H ",
      children: [
        new f({ name: "" }),
        new f({ name: "Be Proactive" }),
        new f({ name: "Begin with the end in mind" }),
        new f({ name: "First things First" }),
        new f({ name: "Think Win/Win" }),
        new f({ name: "First Understand" }),
        new f({ name: "Synergize" }),
        new f({ name: "Sharpen the Saw" })
      ]
    });
  }
}
class $n {
  /**
   * Gets the tree structure for Things I Enjoy visualization
   * @returns {TreeNode} The root node of the Things I Enjoy tree
   */
  get_tree() {
    const t = new f({
      name: "Health",
      children: [{ name: "Physical" }, { name: "Emotional" }, { name: "Cognative" }],
      value: 31
    }), n = new f({
      name: "Magic",
      children: [
        new f({ name: "Card Magic" }),
        new f({ name: "Coin Magic" }),
        new f({ name: "Band Magic" })
      ]
    }), o = new f({
      name: "Hobbies",
      children: [new f({ name: "Biking" }), new f({ name: "Tech" }), new f({ name: "Juggling" })]
    }), r = new f({
      name: "Relationships",
      children: [
        new f({ name: "Zach" }),
        new f({ name: "Amelia" }),
        new f({ name: "Tori" }),
        new f({ name: "Friends" })
      ]
    }), i = new f({
      name: "Joy",
      children: [new f({ name: "Balloons" }), new f({ name: "Joy to Others" })]
    });
    return new f({
      name: "Invest in",
      children: [t, n, o, r, i]
    });
  }
}
function En({ url: e, title: t, description: n }) {
  const o = `<a href='${e}'}>${t}</a>`, r = `audio_player_${Math.floor(Math.random() * 1e10)}`, i = e.replace(/\//g, "_");
  return `
    <div>
        <audio id='${r}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${r}')">🔈</a></b> ${n}
    </div>
  `;
}
async function Ge(e = x, t = v) {
  try {
    const n = await e(), o = Object.entries(n).map((i) => i[1]), r = t(o);
    return En({
      url: r.url,
      title: r.title,
      description: r.description
    });
  } catch (n) {
    return console.error("Error generating random post HTML:", n), "<div>Could not load random post</div>";
  }
}
function oo(e = "#e1", t = "#e2", n = "#e3", o = pe) {
  try {
    o(e), o(t), o(n);
  } catch (r) {
    console.error("Error loading random eulogy:", r);
  }
}
function ro(e = fe, t = me, n = ue, o = pe, r = C) {
  try {
    e("sunburst", "sunburst_text", new $n().get_tree()), t(), n(), o("#random-eulogy-role"), r("#random-blog-posts", async () => await Ge());
  } catch (i) {
    console.error("❌ Error loading enjoy page:", i);
  }
}
function io(e = fe, t = me) {
  try {
    e("sunburst", "sunburst_text", new kn().get_tree()), t();
  } catch (n) {
    console.error("Error loading 7 habits page:", n);
  }
}
function so(e = ue) {
  try {
    e();
  } catch (t) {
    console.error("Error loading IG66 page:", t);
  }
}
function ao(e = Ln, t = Tn, n = Cn) {
  try {
    e("balance-heatmap-rest"), t("balance-heatmap-work"), n("balance-radar-map-ideal");
  } catch (o) {
    console.error("Error loading balance page:", o);
  }
}
const We = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"], qe = 20, Ye = 100, Je = "#00BF00";
async function Cn(e, t) {
  const n = [
    {
      type: "scatterpolar",
      r: [8, 8, 8, 5, 8, 8, 8],
      theta: ["Work", "Tech", "Health", "Hobbies", "Relationships", "Magic", "Work"],
      name: "2020 Goal",
      fill: "toself"
    },
    {
      type: "scatterpolar",
      r: [7, 7, 5, 5, 5, 9, 7],
      theta: ["Work", "Tech", "Health", "Hobbies", "Relationships", "Magic", "Work"],
      name: "2020 Actual",
      fill: "toself"
    }
  ], o = {
    polar: {
      radialaxis: {
        visible: !0,
        range: [0, 10]
      }
    },
    showlegend: !0
  }, r = {
    displayModeBar: !1
  };
  if (typeof t < "u" && t)
    try {
      await t.newPlot(e, n, o, r);
    } catch (i) {
      console.error("Error creating radar map:", i);
    }
  else
    console.warn("Plotly is not defined, skipping chart rendering");
}
async function Tn(e, t) {
  const n = ["Tech", "Work"], o = {
    height: qe * n.length + Ye,
    margin: {
      t: 5
    },
    pad: 0
  }, r = [
    [0, "darkblue"],
    [0.4, "blue"],
    [0.5, Je],
    [0.6, "darkred"],
    [1, "red"]
  ], i = [
    [7, 4, 7, 8, 2, 4, 2, 3, 2, 8],
    //  Tech
    [10, 7, 5, 5, 3, 5, 6, 6, 7, 5]
    //  Work
  ], s = [
    {
      colorscale: r,
      zmin: 0,
      zmax: 10,
      x: We.slice(2, 13),
      y: n,
      z: i,
      type: "heatmap"
    }
  ], a = {
    displayModeBar: !1
  };
  if (typeof t < "u" && t)
    try {
      await t.newPlot(e, s, o, a);
    } catch (l) {
      console.error("Error creating work balance chart:", l);
    }
  else
    console.warn("Plotly is not defined, skipping chart rendering");
}
async function Ln(e, t) {
  const n = ["Health", "Hobbies", "Family", "Magic"], o = [
    // J, F, M, A, M, J, J, A, S, O, N, D
    [4, 4, 3, 4, 5, 3, 2, 2, 3, 2],
    // Health
    [4, 4, 3, 4, 5, 4, 4, 2, 4, 5],
    // Hobbies
    [2, 3, 3, 4, 1, 5, 4, 3, 2, 4],
    // Family
    [5, 5, 5, 4, 5, 5, 4, 5, 4, 5]
    //  Magic
  ], i = [
    {
      colorscale: [
        [0, "red"],
        [0.4, "darkred"],
        [0.5, Je],
        [0.6, "blue"],
        [1, "darkblue"]
      ],
      zmin: 0,
      zmax: 10,
      x: We.slice(2, 13),
      y: n.reverse(),
      z: o.reverse(),
      type: "heatmap"
    }
  ], s = {
    displayModeBar: !1
  }, a = {
    height: qe * n.length + Ye,
    margin: {
      t: 5
    },
    pad: 0
  };
  if (typeof t < "u" && t)
    try {
      await t.newPlot(e, i, a, s);
    } catch (l) {
      console.error("Error creating rest time chart:", l);
    }
  else
    console.warn("Plotly is not defined, skipping chart rendering");
}
function lo(e = "Topics", t = vn, n = me, o = ue, r = pe, i = C) {
  try {
    t("sunburst", "sunburst_text", e), n(), o(), r("#random-eulogy-role"), i("#random-blog-posts", async () => await Ge());
  } catch (s) {
    console.error("Error loading auto-generated sunburst:", s);
  }
}
const k = 150, Sn = 2500, In = 12e3, Pn = 2, Mn = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar"
]);
function Nn(e, t = document) {
  const n = e.startsWith("#") ? e.slice(1) : e;
  if (!n) return null;
  let o = n;
  try {
    o = decodeURIComponent(n);
  } catch {
  }
  for (const r of o === n ? [n] : [o, n]) {
    const i = t.getElementById(r);
    if (i) return i;
    const s = t.getElementsByName(r)[0];
    if (s) return s;
  }
  return null;
}
function An(e, t = window) {
  const n = e.ownerDocument, o = n.scrollingElement || n.documentElement, r = (a) => {
    const l = Number.parseFloat(a);
    return Number.isFinite(l) ? l : 0;
  }, i = r(t.getComputedStyle(o).scrollPaddingTop), s = r(t.getComputedStyle(e).scrollMarginTop);
  return e.getBoundingClientRect().top - i - s;
}
function Rn(e = window) {
  const t = () => {
  }, n = e.document;
  if (!e.location.hash || e.__readerScrolled || e.performance?.getEntriesByType?.("navigation")?.[0]?.type === "back_forward") return t;
  let r = !1, i = 0, s = 0, l = (e.performance?.now?.() ?? Date.now()) + In;
  const c = () => e.performance?.now?.() ?? Date.now(), d = () => {
    if (!r) {
      r = !0, e.clearTimeout(s), e.removeEventListener("scroll", g);
      for (const _ of ["wheel", "touchstart", "mousedown", "keydown"])
        e.removeEventListener(_, m, !0);
      b?.disconnect();
    }
  }, u = () => {
    if (r) return;
    if (c() > l) {
      d();
      return;
    }
    if (c() - i < k) {
      p(k);
      return;
    }
    const _ = Nn(e.location.hash, n);
    if (!_) {
      p(k);
      return;
    }
    Math.abs(An(_, e)) > Pn && _.scrollIntoView({ block: "start", behavior: "auto" }), p(k);
  };
  function p(_) {
    r || (e.clearTimeout(s), s = e.setTimeout(u, _));
  }
  function g() {
    i = c();
  }
  function m(_) {
    _.type === "keydown" && !Mn.has(_.key) || d();
  }
  e.addEventListener("scroll", g, { passive: !0 });
  for (const _ of ["wheel", "touchstart", "mousedown", "keydown"])
    e.addEventListener(_, m, { passive: !0, capture: !0 });
  const h = e.ResizeObserver, b = typeof h == "function" ? new h(() => p(k)) : void 0;
  b && n.body && b.observe(n.body), b && n.documentElement && b.observe(n.documentElement);
  const J = () => {
    l = Math.min(l, c() + Sn), p(k);
  };
  return n.readyState === "complete" ? J() : e.addEventListener("load", J, { once: !0 }), p(k), d;
}
function Hn() {
  if (!(typeof window > "u"))
    return window["@algolia/autocomplete-js"]?.autocomplete;
}
const Dn = "Search Igor's Musings ...", Ne = "/pagefind/", Bn = "/search-titles.json";
function L(e) {
  const t = document.createElement("div");
  return t.textContent = e || "", t.innerHTML;
}
function N(e) {
  return L(e).replace(/"/g, "&quot;");
}
function S(e) {
  if (!e) return !1;
  if (e.startsWith("/"))
    return !0;
  try {
    const t = new URL(e);
    return t.protocol === "http:" || t.protocol === "https:";
  } catch {
    return !1;
  }
}
function On(e) {
  return e && e.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
}
const zn = "/search-pins.json";
let D = null;
async function Un() {
  return D || (D = (async () => {
    const e = await fetch(zn);
    if (!e.ok) throw new Error(`pins config HTTP ${e.status}`);
    const t = await e.json();
    if (!Array.isArray(t)) throw new Error("pins config is not an array");
    return t;
  })().catch((e) => (console.warn("Search pins unavailable:", e), D = null, null))), D;
}
function Ae(e) {
  return e.toLowerCase().replace(/[\s-]+/g, "");
}
async function Fn(e) {
  const t = await Un();
  if (!t || t.length === 0) return [];
  const n = Ae(e), o = t.filter((i) => i.match?.some((s) => s && n.includes(Ae(s))));
  if (o.length === 0) return [];
  const r = await x().catch(() => ({}));
  return o.flatMap((i) => i.urls || []).map((i) => ({
    url: i.url,
    title: r?.[i.url]?.title || i.title || i.url,
    excerpt: r?.[i.url]?.description || "",
    source: "pinned"
  })).filter((i) => S(i.url));
}
let B = null;
async function jn() {
  return B || (B = (async () => {
    const e = await import(
      /* @vite-ignore */
      `${Ne}pagefind.js`
    );
    return await e.options({ basePath: Ne }), e;
  })().catch((e) => {
    throw B = null, e;
  })), B;
}
async function Gn(e, t = 10) {
  if (!e || !e.trim()) return [];
  try {
    const r = (await (await jn()).search(e)).results.slice(0, t);
    return (await Promise.all(r.map((s) => s.data()))).map((s) => ({
      url: On(s.url),
      title: s.meta?.title || s.url,
      excerpt: s.excerpt || "",
      source: "pagefind"
    })).filter((s) => S(s.url));
  } catch (n) {
    return console.warn("Pagefind unavailable, falling back to title search:", n), [];
  }
}
let O = null;
async function Wn() {
  return O || (O = (async () => {
    const [{ default: e }, t] = await Promise.all([import("./minisearch.js"), fetch(Bn)]);
    if (!t.ok) throw new Error(`title index HTTP ${t.status}`);
    const o = (await t.json()).map((i, s) => ({ id: s, title: i.t, url: i.u })), r = new e({
      fields: ["title"],
      storeFields: ["title", "url"]
    });
    return r.addAll(o), r;
  })().catch((e) => (console.warn("Title index unavailable:", e), O = null, null))), O;
}
async function qn(e, t = 5) {
  if (!e || !e.trim()) return [];
  const n = await Wn();
  if (!n) return [];
  const o = await x().catch(() => ({}));
  return n.search(e, { fuzzy: 0.3, prefix: !0 }).slice(0, t).map((r) => ({
    url: r.url,
    title: r.title,
    excerpt: o?.[r.url]?.description || "",
    source: "title"
  })).filter((r) => S(r.url));
}
async function Yn(e, t = 10) {
  if (!e || !e.trim()) return [];
  const [n, o, r] = await Promise.all([
    Fn(e),
    Gn(e, t),
    qn(e, 5)
  ]), i = /* @__PURE__ */ new Set(), s = [];
  for (const a of [...n, ...o, ...r])
    i.has(a.url) || (i.add(a.url), s.push(a));
  return s.slice(0, t);
}
function Jn(e) {
  return e.source === "pagefind" ? e.excerpt || "" : L(e.excerpt || "");
}
function Xn(e) {
  if (!S(e.url))
    return console.warn("Invalid URL skipped in renderSearchHit:", e.url), "<div>Invalid result</div>";
  const t = N(e.url);
  return `
           <span data-url="${t}" style="cursor: pointer;">
              <b> <a href="${t}">${L(e.title)}</a></b> <span>${Jn(e)}</span>
           </span>
        `;
}
async function Kn() {
  const e = performance.now(), t = await x(), n = performance.now() - e;
  console.log(`  📊 [get_random_post] Loaded links in ${n.toFixed(0)}ms`);
  const o = Object.entries(t).map((s) => s[1]), r = v(o);
  return {
    title: r.title,
    url: r.url,
    description: r.description
  };
}
async function co(e = 4) {
  const t = performance.now(), n = await x(), o = performance.now() - t;
  console.log(`  📊 [get_random_posts_batch] Loaded links once in ${o.toFixed(0)}ms`);
  const r = Object.entries(n).map((a) => a[1]), i = [], s = /* @__PURE__ */ new Set();
  for (; i.length < e && i.length < r.length; ) {
    const a = Math.floor(Math.random() * r.length);
    if (!s.has(a)) {
      s.add(a);
      const l = r[a];
      i.push({
        title: l.title,
        url: l.url,
        description: l.description
      });
    }
  }
  return i;
}
async function Vn(e = 4) {
  try {
    const t = performance.now(), n = await x(), o = performance.now() - t;
    return console.log(`  📊 [get_recent_posts] Loaded links in ${o.toFixed(0)}ms`), Object.entries(n).map(([a, l]) => ({
      url: a,
      title: l.title || a,
      description: l.description || "",
      doc_size: l.doc_size || 0,
      last_modified: l.last_modified || ""
    })).filter(
      (a) => a.description && a.description.trim() !== "" && a.title && a.title.trim() !== ""
    ).sort((a, l) => a.last_modified && l.last_modified ? new Date(l.last_modified).getTime() - new Date(a.last_modified).getTime() : l.doc_size - a.doc_size).slice(0, e);
  } catch (t) {
    return console.error("❌ Error loading recent posts:", t), [];
  }
}
async function Zn(e = 3) {
  return {
    sourceId: "random_posts",
    async getItems() {
      const t = new Array(e).join("_").split("_");
      return await Promise.all(
        t.map(async (o) => {
          try {
            return await Kn();
          } catch (r) {
            return console.error("Error getting random post:", r), { url: "", title: "Error", description: "Failed to load post" };
          }
        })
      );
    },
    getItemUrl({ item: t }) {
      return t.url;
    },
    templates: {
      item({ item: t, createElement: n }) {
        return S(t.url) ? n("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${N(t.url)}" style="cursor: pointer;">
           <b> <a href="${N(t.url)}">${L(t.title)}</a></b>
            <span>${L(t.description)}</span>
            </span>
            `
          }
        }) : (console.warn("Invalid URL skipped in GetRandomSearchResults:", t.url), n("div", {
          dangerouslySetInnerHTML: {
            __html: "<div>Invalid result</div>"
          }
        }));
      },
      header({ createElement: t }) {
        return t("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Random posts ...</i>"
          }
        });
      }
    }
  };
}
async function Qn(e = 4) {
  return {
    sourceId: "recent_posts",
    async getItems() {
      return await Vn(e);
    },
    getItemUrl({ item: t }) {
      return t.url;
    },
    templates: {
      item({ item: t, createElement: n }) {
        return S(t.url) ? n("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${N(t.url)}" style="cursor: pointer;">
           <b> <a href="${N(t.url)}">${L(t.title)}</a></b>
            <span>${L(t.description)}</span>
            </span>
            `
          }
        }) : (console.warn("Invalid URL skipped in GetRecentSearchResults:", t.url), n("div", {
          dangerouslySetInnerHTML: {
            __html: "<div>Invalid result</div>"
          }
        }));
      },
      header({ createElement: t }) {
        return t("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Recent posts ...</i>"
          }
        });
      }
    }
  };
}
function eo(e, t = 10) {
  return {
    sourceId: "featured_posts",
    async getItems() {
      return await Yn(e, t);
    },
    templates: {
      item({ item: n, createElement: o }) {
        return o("div", {
          dangerouslySetInnerHTML: {
            __html: Xn(n)
          }
        });
      },
      header({ createElement: n }) {
        return n("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Results ...</i>"
          }
        });
      },
      noResults({ createElement: n }) {
        return n("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>No results. Try different keywords.</i>"
          }
        });
      }
    },
    getItemUrl({ item: n }) {
      return n.url;
    }
  };
}
async function uo(e, t = {}) {
  const { featuredCount: n = 10, recentCount: o = 4, randomCount: r = 3 } = t, i = Hn();
  if (!i) {
    console.error("Autocomplete is not defined");
    return;
  }
  const s = await Zn(r), a = await Qn(o);
  function l({ query: d }) {
    return !d || d.length === 0 ? [a, s] : [eo(d, n)];
  }
  const c = e.startsWith("#") ? e : `#${e}`;
  if ($(c).length === 0) {
    console.log("No autocomplete element found", "autocomplete_id", e);
    return;
  }
  return i({
    container: c,
    placeholder: Dn,
    getSources: l,
    debug: !1,
    openOnFocus: !0,
    detachedMediaQuery: ""
  });
}
Rn();
$(document).ready(() => {
  Xe(F);
  const e = () => {
    typeof Mousetrap < "u" && Mousetrap.bind("s", () => t());
  }, t = () => {
    const o = $("#search-box");
    o.length > 0 && o.focus();
  };
  e(), to(), no();
  const n = ["item1", "item2", "item3"];
  console.log("Random item:", v(n)), console.log("Shuffled items:", Re([...n])), x().then((o) => {
    console.log("Links loaded, count:", Object.keys(o).length);
  }), console.log("Blog JavaScript initialized");
});
function to() {
  $("#toc-content").length > 0 && console.log("TOC initialized");
}
function no() {
  $("#search-box").length > 0 && console.log("Search initialized");
}
export {
  uo as CreateAutoComplete,
  V as MakeBackLinkHTML,
  f as TreeNode,
  me as add_random_prompts,
  fe as add_sunburst,
  vn as add_sunburst_from_dom,
  C as append_randomizer_div,
  Xe as defer,
  x as get_link_info,
  He as get_random_page_url,
  Kn as get_random_post,
  co as get_random_posts_batch,
  Vn as get_recent_posts,
  Gt as goToRandomPage,
  rt as initRecentAllPosts,
  io as load_7_habits,
  lo as load_auto_sunburst,
  ao as load_balance,
  ro as load_enjoy2,
  F as load_globals,
  so as load_ig66,
  oo as load_random_eulogy,
  En as makePostPreviewHTML,
  Ge as make_random_post_html,
  v as random_from_list,
  Xn as renderSearchHit,
  Yn as searchBlog,
  Re as shuffle
};
//# sourceMappingURL=index.js.map
