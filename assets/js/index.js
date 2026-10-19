function Z(e) {
  return `
<div>
    <div class="link-box description truncate-css"> ${`<a href=${e.url}>${e.title}</a>`}:<span class="link-description"> ${e.description} <span></div>
</div>`;
}
function v(e) {
  if (e.length !== 0)
    return e[Math.floor(Math.random() * e.length)];
}
function He(e) {
  let t = e.length, n;
  for (; t !== 0; )
    n = Math.floor(Math.random() * t), t--, [e[t], e[n]] = [e[n], e[t]];
  return e;
}
function Ke(e, t) {
  const n = t || e.name || "anonymous function";
  document.readyState === "loading" ? (console.log(`🕐 Deferring ${n} until DOM is ready`), document.addEventListener("DOMContentLoaded", () => {
    console.log(`🚀 Executing deferred ${n}`), e();
  })) : (console.log(`⚡ DOM already ready, executing ${n} immediately`), e());
}
async function T(e, t) {
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
async function w(e) {
  if (A != null)
    return A;
  const t = "/back-links.json";
  try {
    return A = (await (await fetch(t)).json()).url_info, A;
  } catch (n) {
    return console.error("Error fetching link info", n), {};
  }
}
async function Be() {
  try {
    const e = await w(), t = Object.keys(e).filter((o) => {
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
async function Ve(e = "/back-links.json") {
  if (e === "/test-missing-url-info")
    throw new Error("Missing url_info in data structure");
  try {
    return await w(e);
  } catch {
    throw new Error("Missing url_info in data structure");
  }
}
function Ze(e) {
  return Object.entries(e).map(([t, n]) => ({
    url: t,
    title: n.title || t,
    description: n.description || "",
    doc_size: n.doc_size || 0,
    last_modified: n.last_modified || ""
  }));
}
function Qe(e) {
  return e.filter(
    (t) => t.description && t.description.trim() !== "" && t.title && t.title.trim() !== ""
  );
}
function et(e) {
  return [...e].sort((t, n) => t.last_modified && n.last_modified ? new Date(n.last_modified).getTime() - new Date(t.last_modified).getTime() : n.doc_size - t.doc_size);
}
async function De() {
  const e = await Ve(), t = Ze(e), n = Qe(t);
  return et(n);
}
function he(e) {
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
function be(e) {
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
function tt(e, t) {
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
function nt() {
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
function ot(e = "remaining-posts-toggle", t = "remaining-posts-content", n = document) {
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
function rt(e, t = 15) {
  if (e.length === 0)
    return "<p>No modified posts found.</p>";
  const n = e.slice(0, t), o = e.slice(t), r = he(n);
  let i = be(r);
  if (o.length > 0) {
    const s = he(o), a = be(s);
    i += tt(a, o.length);
  }
  return nt() + i;
}
async function ye(e = "last-modified-posts", t = 15, n = document) {
  const o = n.getElementById(e);
  if (!o) {
    console.log(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const r = await De(), i = rt(r, t);
    o.innerHTML = i, ot("remaining-posts-toggle", "remaining-posts-content", n);
  } catch (r) {
    console.error("❌ Error loading recent posts:", r), o.innerHTML = "<p>Error loading modified posts. Please try again later.</p>";
  }
}
function it(e = "last-modified-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    ye(e, 15, t);
  }) : ye(e, 15, t);
}
function st(e, t = 5) {
  return e.slice(0, t);
}
function at(e) {
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
async function _e(e = "recent-posts") {
  const t = document.getElementById(e);
  if (!t) {
    console.error(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const n = await De(), o = st(n), r = at(o);
    t.innerHTML = r;
  } catch (n) {
    console.error("❌ Error loading recent posts:", n), t.innerHTML = "<p>Error loading recent posts. Please try again later.</p>";
  }
}
function lt(e = "recent-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    _e(e);
  }) : _e(e);
}
console.log("Load force graph in TS v 0.9");
function G(e, t) {
  const n = e.filter((i) => i.url === t)[0];
  if (n)
    return n;
  const o = t.replace(/^\//, "").replace(/\/$/, "");
  return e.filter((i) => i.url.replace(/^\//, "").replace(/\/$/, "") === o)[0];
}
function ct(e) {
  const t = [];
  for (const n of e) {
    const o = n.outgoing_links || [], r = n.incoming_links || [], i = [...o, ...r];
    for (const a of i)
      G(x, a) && t.push({ source: n, target: a, value: 1 });
    t.filter((a) => a.source === n).length === 0 && n.url === "/eulogy" && console.log(`No valid links found for ${n.url}`);
  }
  return t;
}
function Q(e) {
  const t = e.filter((s) => s.expanded);
  e.find((s) => s.url === "/eulogy") || console.log("Eulogy node not found in pages");
  const o = ct(t), r = o.map((s) => G(e, s.target)).filter((s) => s);
  return {
    nodes: t.concat(r),
    links: o
  };
}
function dt(e, t, n) {
  const o = e.outgoing_links.length, r = e.expanded ? "-" : `+${o}`, i = `${e.id} [${r}]`, s = 12 / n;
  t.font = `${s}px Sans-Serif`;
  const l = [t.measureText(i).width, s].map((c) => c + s * 0.2);
  t.fillStyle = "rgba(255, 255, 255, 0.8)", t.fillRect(e.x - l[0] / 2, e.y - l[1] / 2, ...l), t.textAlign = "center", t.textBaseline = "middle", t.fillStyle = e.color, t.fillText(i, e.x, e.y), e.__bckgDimensions = l;
}
function ut(e, t, n) {
  n.fillStyle = t;
  const o = e.__bckgDimensions;
  o && n.fillRect(e.x - o[0] / 2, e.y - o[1] / 2, ...o);
}
let x = [], y = null, L = null;
function z(e) {
  if (!L) {
    console.log("Cannot center: Graph not initialized");
    return;
  }
  if (!e) {
    console.log("Cannot center: Node is null or undefined");
    return;
  }
  L.centerAt(e.x, e.y, 500), L.zoom(8, 500), Oe(e);
}
function Oe(e) {
  if (!e)
    return;
  y = e;
  const t = Z(e), n = document.getElementById("detail");
  n && (n.innerHTML = t);
}
function pt() {
  y ? y.url ? window.open(y.url, "_blank") : console.log("Active node has no URL") : console.log("No active node to go to");
}
function mt() {
  for (const e of x)
    e.expanded = !1;
  y && (y.expanded = !0), L && (L.graphData(Q(x)), y && setTimeout(() => {
    z(y);
  }, 300));
}
async function ft() {
  if (!document.getElementById("graph")) {
    console.log("Graph element not found, exiting initialization");
    return;
  }
  window.location.hash.substr(1), x = Object.values(await w()).map((a) => ({
    ...a,
    id: a.url,
    expanded: !1
  }));
  const t = `/${window.location.hash ? window.location.hash.substr(1) : ""}`, n = x.map((a) => a.url).includes(t) ? t : "/eulogy";
  for (const a of x)
    a.expanded = a.url === n;
  if (typeof ForceGraph > "u") {
    console.log("Force Graph not defined, providing fallback functionality");
    const a = G(x, n);
    a && (Oe(a), y = a);
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
  L = ForceGraph()(document.getElementById("graph")).graphData(Q(x)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(dt).nodePointerAreaPaint(ut).onNodeRightClick((a) => {
    window.open(a.url, "_blank");
  }).onNodeClick((a) => {
    a.expanded = !a.expanded, x.filter((c) => c.expanded).length === 0 && (a.expanded = !0), L.graphData(Q(x)), setTimeout(() => {
      z(a);
    }, 300);
  });
  const o = G(x, n);
  o ? z(o) : console.log("Initial node not found, cannot center");
  const r = document.getElementById("center_control");
  r ? r.addEventListener("click", () => {
    y ? z(y) : console.log("No last detail node to center on");
  }) : console.log("Center control element not found");
  const i = document.getElementById("goto_control");
  i && i.addEventListener("click", pt);
  const s = document.getElementById("collapse_control");
  s && s.addEventListener("click", mt);
}
typeof window < "u" && (window.initializeGraph = ft);
function gt() {
  const e = window.__GIT_BRANCH__;
  return e ? (console.log("Branch from global variable:", e), e) : (console.log("Branch info not found"), null);
}
function ht() {
  const e = window.__GIT_PR__;
  return e && typeof e == "number" ? (console.log("PR from global variable:", e), e) : (console.log("PR info not found"), null);
}
function bt() {
  const e = window.__GIT_CHANGED__;
  return Array.isArray(e) ? e.filter((t) => typeof t == "string" && t.startsWith("/")) : [];
}
const we = (e) => e.replace(/\/+$/, "") || "/";
function yt(e, t) {
  return t.some((n) => we(n) === we(e));
}
const P = (e) => `<i class="fas ${e}"></i>`;
function _t(e) {
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
const wt = () => window.blogAnnotate;
function xt(e) {
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
function vt() {
  return window.location.port || "80";
}
function kt() {
  console.log("Initializing dev info...");
  const e = gt(), t = ht(), n = vt();
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
    const i = bt();
    if (i.length) {
      const l = i.map(
        (c) => `<a href="${encodeURI(c)}" style="color: #58a6ff; text-decoration: none;">${c.replace(/[<>&"]/g, "")}</a>`
      ).join(" ");
      r += ` | ${P("fa-edit")} Changed: ${l}`;
    }
    o.innerHTML = r, yt(window.location.pathname, i) && (o.appendChild(document.createTextNode(" | ")), o.appendChild(
      _t(t ? `https://github.com/idvorkin/idvorkin.github.io/pull/${t}` : void 0)
    ));
    const s = wt();
    s && (o.appendChild(document.createTextNode(" | ")), o.appendChild(xt(s))), document.body.appendChild(o);
    const a = Number.parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${a + 40}px`;
  }
}
const le = {
  iconClass: "header-copy-link",
  tooltipDuration: 2e3,
  domainMapping: {
    from: "idvork.in/",
    to: "idvorkin.azurewebsites.net/"
  }
};
function $t(e) {
  const t = document.createElement("span");
  return t.className = e.iconClass || le.iconClass, t.title = "Share this section", t.style.cursor = "pointer", t.style.marginLeft = "0.5rem", t.style.opacity = "0", t.style.transition = "opacity 0.2s ease", t.style.fontSize = "0.8em", t.style.userSelect = "none", t.setAttribute("role", "button"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-label", "Share this section"), t.innerHTML = `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`, t;
}
function Et() {
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
function Ct(e, t) {
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
function Tt(e, t) {
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
function Lt(e, t = 2e3) {
  if (typeof document < "u" && document.querySelector) {
    const o = document.querySelector(".copy-link-tooltip");
    o && o.remove();
  }
  const n = document.createElement("span");
  n.className = "copy-link-tooltip", n.textContent = "Copied!", n.style.position = "absolute", n.style.backgroundColor = "#333", n.style.color = "white", n.style.padding = "4px 8px", n.style.borderRadius = "4px", n.style.fontSize = "12px", n.style.zIndex = "1000", n.style.marginLeft = "10px", n.style.marginTop = "-5px", e.parentElement?.appendChild(n), setTimeout(() => {
    n.remove();
  }, t);
}
function xe(e) {
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
function ve(e, t) {
  let n = e;
  n = n.replace("localhost:4000/", "idvorkin.azurewebsites.net/"), t.domainMapping && (n = n.replace(t.domainMapping.from, t.domainMapping.to));
  const o = new URL(n), r = o.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index", i = o.hash.replace("#", "");
  return i ? `${r}#${i}` : r;
}
async function St(e, t) {
  try {
    const n = window.location.href, o = n.includes("#") ? n.replace(/#.*/, `#${e}`) : `${n}#${e}`, r = ve(o, t), i = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`, s = document.getElementById(e), l = `${s ? Array.from(s.childNodes).filter((m) => m.nodeType === Node.TEXT_NODE).map((m) => m.textContent?.trim()).join(" ").trim() : ""} - Igor's Blog`, c = $e(e), d = xe(s);
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
      const o = window.location.href, r = o.includes("#") ? o.replace(/#.*/, `#${e}`) : `${o}#${e}`, i = ve(r, t), s = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(i)}`, a = document.getElementById(e), l = xe(a), c = $e(e);
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
function It(e) {
  if (e.id)
    return e.id;
  const n = (e.textContent || "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let o = n, r = 1;
  for (; document.getElementById(o); )
    o = `${n}-${r}`, r++;
  return e.id = o, o;
}
const ze = 600;
function Ue(e) {
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
        if (r.length > 0 && i + c + 1 > ze) {
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
function R(e, t = ze) {
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
function ke(e, t) {
  return !t || e.endsWith("...") || e.endsWith("…") ? e : `${e}...`;
}
function $e(e) {
  if (e) {
    const o = document.getElementById(e);
    if (o) {
      const { text: r, hasMore: i } = Ue(o);
      if (r)
        return ke(R(r), i);
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
        return ke(R(a.join(" ")), c);
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
function Pt(e, t, n, o, r) {
  const s = window.location.pathname.replace(/^\//, "").replace(/\.html$/, ""), a = document.querySelector('meta[property="markdown-path"]'), l = a ? a.getAttribute("content") : `${s || "index"}.md`, c = "https://github.com/idvorkin/idvorkin.github.io", d = n ? `${s || "index"}/${e}: ${n}` : `${s || "index"}/${e}: Issue with ${t}`, u = encodeURIComponent(d), p = o || n || `Issue with section: ${t}`, g = r ? Ue(r) : "";
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
const ee = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new Set();
function Nt(e, t) {
  let n = te.get(e);
  return n || (n = Ct(t, e.textContent || ""), document.body.appendChild(n), te.set(e, n), At(n, e, t)), n;
}
function At(e, t, n) {
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
    const p = e.querySelector(".github-issue-title"), g = e.querySelector(".github-issue-comment"), m = p?.value || "", h = g?.value || "", b = Pt(n, t.textContent || "", m, h, t);
    window.open(b, "_blank"), U(e);
  }, a = e.querySelector(".github-issue-submit");
  a && (a.addEventListener("click", s), o.push(() => a.removeEventListener("click", s)));
  const l = e.querySelector(".github-issue-title"), c = e.querySelector(".github-issue-comment"), d = (p) => {
    (p.ctrlKey || p.metaKey) && p.key === "Enter" && (p.preventDefault(), s());
  };
  l && (l.addEventListener("keydown", d), o.push(() => l.removeEventListener("keydown", d))), c && (c.addEventListener("keydown", d), o.push(() => c.removeEventListener("keydown", d)));
  const u = ee.get(t) || [];
  ee.set(t, [...u, ...o]);
}
function Rt(e, t) {
  if (e.querySelector(`.${t.iconClass || le.iconClass}`))
    return;
  const o = It(e), r = $t(t), i = Et(), s = [], a = async (m) => {
    m.preventDefault(), m.stopPropagation(), await St(o, t) || Lt(r, t.tooltipDuration);
  };
  r.addEventListener("click", a), s.push(() => r.removeEventListener("click", a));
  const l = (m) => {
    (m.key === "Enter" || m.key === " ") && (m.preventDefault(), a(m));
  };
  r.addEventListener("keydown", l), s.push(() => r.removeEventListener("keydown", l));
  const c = (m) => {
    m.preventDefault(), m.stopPropagation();
    const h = Nt(e, o);
    Tt(h, e);
  };
  i.addEventListener("click", c), s.push(() => i.removeEventListener("click", c));
  const d = (m) => {
    const h = te.get(e);
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
  }), ee.set(e, s), Mt.add(e);
}
function Ee(e = {}) {
  const t = { ...le, ...e }, n = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const o of Array.from(n))
    Rt(o, t);
}
function Ht() {
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
let Ce = !1;
function Bt(e = {}) {
  Ce || (Ce = !0, Ht(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    Ee(e);
  }) : Ee(e));
}
const ne = 50, oe = 100, Dt = ne * oe;
function j(e = 0) {
  if (typeof document > "u")
    return;
  if (console.log("🖼️ Enabling image zoom functionality"), typeof window.GLightbox > "u") {
    if (e < ne) {
      console.warn(
        `⚠️ GLightbox not found, retrying in ${oe}ms (attempt ${e + 1}/${ne})`
      ), setTimeout(() => j(e + 1), oe);
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
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => j()) : setTimeout(() => j(), 500));
const ce = "random-arrival-path", C = "random-reroll-dice", re = "random-reroll", ie = "random-reroll-close", Te = "random-reroll-style", Fe = 550, Ot = `
#${re}{position:fixed;right:max(4px, env(safe-area-inset-right));
  bottom:calc(80px + env(safe-area-inset-bottom));z-index:9990;width:48px;height:48px}
body:has(#rd-nav) #${re}{bottom:calc(120px + env(safe-area-inset-bottom))}
#${C}{width:48px;height:48px;padding:0;font-size:28px;line-height:48px;text-align:center;
  border:0;border-radius:50%;color:#000;background:rgba(255,255,255,.92);box-shadow:0 2px 8px rgba(0,0,0,.3);
  cursor:pointer;touch-action:manipulation;animation:rrd-wiggle 6s ease-in-out 2s infinite}
/* disabled buttons get translucent text, which fades the color emoji mid-roll */
#${C}:disabled{color:#000;opacity:1}
#${C}.rrd-rolling{animation:rrd-roll ${Fe}ms cubic-bezier(.3,1.4,.6,1) forwards}
#${ie}{position:absolute;top:-14px;left:-14px;width:32px;height:32px;padding:0;border:0;
  background:transparent;cursor:pointer;touch-action:manipulation;display:flex;
  align-items:center;justify-content:center}
#${ie} span{width:18px;height:18px;border-radius:50%;background:#555;color:#fff;
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
@media (prefers-reduced-motion: reduce){#${C},#${C}.rrd-rolling{animation:none}}
`;
function W(e) {
  let t = e.split(/[?#]/)[0] || "/";
  try {
    t = decodeURI(t);
  } catch {
  }
  return t.length > 1 ? t.replace(/\/+$/, "") : t;
}
function de() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
function zt(e = de()) {
  try {
    e?.removeItem(ce);
  } catch {
  }
}
function Ut() {
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
  } catch {
    return !1;
  }
}
function Ft(e, t = de()) {
  try {
    t?.setItem(ce, W(new URL(e, window.location.origin).pathname));
  } catch {
  }
}
function Gt(e, t = de()) {
  try {
    const n = t?.getItem(ce);
    return n != null && n === W(e);
  } catch {
    return !1;
  }
}
async function jt(e, t = Be) {
  const n = W(e);
  let o = await t();
  for (let r = 0; r < 4 && W(o) === n; r++)
    o = await t();
  return o;
}
async function Wt(e = (n) => window.location.assign(n), t = Be) {
  const n = await jt(window.location.pathname, t);
  return Ft(n), e(n), n;
}
const qt = "#id-ui-toc-dropdown", Yt = 12;
function X(e, t = document) {
  const n = t.querySelector(qt);
  if (e.style.removeProperty("bottom"), !n) return;
  const o = n.getBoundingClientRect();
  if (o.height === 0) return;
  const r = e.getBoundingClientRect(), i = r.bottom + Yt - o.top;
  if (i > 0) {
    const s = window.innerHeight - r.bottom;
    e.style.bottom = `${Math.ceil(s + i)}px`;
  }
}
function Jt(e = document) {
  if (!Gt(window.location.pathname) || e.getElementById(C))
    return null;
  if (!e.getElementById(Te)) {
    const r = e.createElement("style");
    r.id = Te, r.textContent = Ot, e.head.appendChild(r);
  }
  const t = e.createElement("div");
  t.id = re;
  const n = e.createElement("button");
  n.id = C, n.type = "button", n.textContent = "🎲", n.title = "Another random post", n.setAttribute("aria-label", "Another random post");
  const o = e.createElement("button");
  return o.id = ie, o.type = "button", o.title = "Hide the dice", o.setAttribute("aria-label", "Hide the random dice"), o.innerHTML = '<span aria-hidden="true">×</span>', n.addEventListener("click", () => {
    if (n.disabled) return;
    n.disabled = !0;
    const r = Date.now(), i = Ut() ? 0 : Fe;
    n.classList.add("rrd-rolling"), Wt((s) => {
      window.setTimeout(() => window.location.assign(s), Math.max(0, i - (Date.now() - r)));
    });
  }), o.addEventListener("click", (r) => {
    r.stopPropagation(), zt(), t.remove();
  }), t.append(n, o), e.body.appendChild(t), X(t, e), window.addEventListener("resize", () => X(t, e)), window.setTimeout(() => X(t, e), 1e3), n;
}
const Xt = "https://idvork.in", Kt = "idvork.in", Vt = "http://localhost:4000", M = "from_test", q = "idvorkin_test_origin", Le = "swap-toast", Zt = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);
function ue(e) {
  return e === Kt;
}
function se(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    return !1;
  }
  if (t.origin !== e || t.protocol !== "http:" && t.protocol !== "https:") return !1;
  const n = t.hostname;
  return ue(n) ? !1 : Zt.has(n) || n.endsWith(".ts.net");
}
function Qt(e, t) {
  const n = new URLSearchParams(e.search);
  return n.delete(M), ue(e.hostname) ? !t || !se(t) ? { error: "no-test-origin" } : { url: `${t}${e.pathname}${Se(n)}${e.hash}` } : (n.append(M, e.origin), { url: `${Xt}${e.pathname}${Se(n)}${e.hash}` });
}
function Se(e) {
  const t = e.toString();
  return t ? `?${t}` : "";
}
function en(e, t) {
  const n = e.searchParams.get(M);
  if (n && se(n)) return n;
  try {
    const o = new URL(t).origin;
    if (se(o)) return o;
  } catch {
  }
  return null;
}
function tn() {
  if (!ue(window.location.hostname)) return;
  const e = new URL(window.location.href), t = en(e, document.referrer);
  if (t) {
    try {
      sessionStorage.setItem(q, t), localStorage.setItem(q, t);
    } catch {
    }
    e.searchParams.has(M) && (e.searchParams.delete(M), history.replaceState(history.state, "", e.href));
  }
}
function nn() {
  try {
    return sessionStorage.getItem(q) || localStorage.getItem(q);
  } catch {
    return null;
  }
}
function on() {
  const e = new URL(window.location.href), t = Qt(e, nn());
  if ("url" in t) {
    window.location.assign(t.url);
    return;
  }
  const n = `${e.pathname}${e.search}${e.hash}`;
  rn(
    "No test server remembered. Press P on a test server first, or try ",
    `${Vt}${n}`,
    "localhost:4000"
  );
}
function rn(e, t, n) {
  document.getElementById(Le)?.remove();
  const o = document.createElement("div");
  o.id = Le, o.setAttribute("role", "status"), o.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10000;background:#333;color:#fff;padding:10px 16px;border-radius:6px;font:14px/1.4 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.4);max-width:90vw;", o.append(e);
  const r = document.createElement("a");
  r.href = t, r.textContent = n, r.style.cssText = "color:#9cf;text-decoration:underline;", o.append(r), document.body.append(o), setTimeout(() => o.remove(), 5e3);
}
let ae = !0;
function Ie() {
  const e = $(".ui-toc-dropdown .toc"), t = $(".expand-toggle");
  if (e.length === 0 || t.length === 0) {
    console.warn("TOC or toggle elements not found for expand/collapse");
    return;
  }
  ae ? (e.addClass("expand"), t.text("Collapse all")) : (e.removeClass("expand"), t.text("Expand all"));
}
function Ge() {
  const e = $("#right-sidebar"), t = $("#main-content");
  e.length > 0 && (e.removeClass(), e.addClass("col-4 pl-0")), t.length > 0 && (t.removeClass(), t.addClass("col-8 pr-0"));
  const n = $("#id-ui-toc-dropdown");
  n.length > 0 && (n.removeClass(), n.addClass("d-none"));
}
function Pe(e, t) {
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
  Ie(), r.click((l) => {
    l.preventDefault(), l.stopPropagation(), ae = !ae, Ie();
  }), i.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, 0);
  }), s.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, document.body.scrollHeight);
  }), a.click((l) => Ge()), o.append(r).append(i).append(s), t && o.append(a), n.append(o);
}
async function sn(e) {
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
      i.append(Z(p));
    }
  const a = [];
  for (const u of o)
    e[u] && a.push(u);
  const l = r.find("#outgoing");
  if (a)
    for (const u of a.sort(s)) {
      const p = e[u];
      l.append(Z(p));
    }
  const c = r.find("#graph"), d = t.replace(/\//g, "");
  c.append(`<a href='/graph#${d}'>${t} (${d}) </a>`);
}
function an(e, t) {
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
function ln(e) {
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
        o.html(an(o, e.url_info[r]));
      } catch (r) {
        o?.html ? o.html(I(o, r)) : console.error("Error processing link and unable to display error:", r);
      }
    }
  } catch (t) {
    console.error("Error processing summary links:", t);
  }
}
async function cn() {
  const e = "__idvorkin_add_link_loader_initialized__";
  window[e] || (window[e] = !0, sn(await w()), ln(await dn()));
}
let H = null;
async function dn() {
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
function un() {
  window.location.href = "/";
}
function pn() {
  const e = window.Mousetrap();
  e.bind("s", (n) => un()), e.bind("t", (n) => Ge()), e.bind("p", () => on()), e.bind("a", (n) => {
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
function mn(e) {
  for (const [t, n] of Object.entries(e)) {
    const o = typeof $ < "u" && $.fn ? $(`a[href=${t}]`).first()[0] : document.querySelector(`a[href="${t}"]`);
    if (!o) return;
    const r = n.cloneNode(!0);
    r.children.length > 0 && r.children[0].remove(), o.replaceWith(r), n.remove();
  }
}
function fn() {
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
function K() {
  const e = fn();
  mn(e);
}
function F() {
  const e = "__idvorkin_load_globals_initialized__";
  window[e] || (window[e] = !0, tn(), $(cn), $(pn), typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(K) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", K) : K()), lt(), document.getElementById("last-modified-posts") && it(), $(() => {
    Pe("ui-toc", !0), Pe("ui-toc-affix", !1);
  }), Bt(), j(), kt(), Jt());
}
typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(F) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", F) : F());
function V(e) {
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
function gn(e) {
  return e.filter((t) => t.title.toLowerCase().includes("achievement"));
}
function hn(e) {
  return e.filter((t) => t.tags.includes("family-journal"));
}
function bn(e) {
  if (console.log("Processing", e.length, "posts"), !e) {
    console.log("No posts being imported");
    return;
  }
  const t = "#random-post", n = "#achievment", o = "#random-recent";
  T(t, () => V(v(e))), T(n, () => V(v(gn(e)))), T(o, () => V(v(hn(e))));
}
function pe() {
  $.getJSON("/ig66/ig66-export.json", bn);
}
function yn(e) {
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
function _n(e, t) {
  if (!t) {
    console.log("No roles being imported");
    return;
  }
  console.log("Processing", t.roles.length, "roles"), T(e, () => yn(v(t.roles)));
}
function me(e) {
  $.getJSON("/eulogy.json", (n) => _n(e, n));
}
class f {
  constructor({
    name: t,
    value: n = 25,
    children: o = []
  }) {
    this.name = t, this.children = He(o), this.value = n;
  }
}
function fe(e = je, t = wn) {
  const n = e();
  for (const o of n.keys())
    t(o, n.get(o));
}
function wn(e, t, n = $, o = T) {
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
function xn(e) {
  const t = Array.from(Y(e)).map(([n, o]) => [n.name, o?.name]);
  return {
    ids: t.map(([n, o]) => n),
    labels: t.map(([n, o]) => n),
    parents: t.map(([n, o]) => o)
  };
}
function Me(e = je) {
  const t = e(), n = Array.from(t.entries()).map(([o, r], i) => [o.text(), r]);
  return new Map(n);
}
function Ne(e, t, n) {
  const o = Array.from(Y(t)).find(([a, l]) => a.name === e);
  if (!o)
    return "Click in any box or circle";
  const [r, i] = o, s = Array.from(Y(r)).map(([a, l]) => a).filter((a) => {
    const l = n.has(a.name), c = n.has(`${a.name}🔗`);
    return l || c;
  }).flatMap((a) => (n.get(a.name) || n.get(`${a.name}🔗`) || []).map((c) => `${a.name}: ${c}`));
  return s.length === 0 ? "Click in any box or circle" : v(s);
}
function vn(e, t = document) {
  const n = (r) => r.replace(/🔗/g, "").trim(), o = n(e ?? "");
  if (!o) return null;
  for (const r of Array.from(t.querySelectorAll("h2, h3")))
    if (n(r.textContent ?? "") === o) return r;
  return null;
}
function kn(e, t = window) {
  const n = vn(e, t.document);
  return n ? (n.scrollIntoView({ behavior: "smooth", block: "start" }), n.id && t.history?.replaceState && t.history.replaceState(null, "", `#${n.id}`), !0) : !1;
}
async function ge(e, t, n, o = $, r = Plotly) {
  if (!r) {
    console.error("Plotly is not available");
    return;
  }
  const i = xn(n), s = {
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
      const u = o("#sunburst text:first").text(), p = Ne(u, n, Me());
      c(p);
    });
    const d = document.getElementById(e);
    return d && typeof d.on == "function" && d.on("plotly_click", (u) => {
      if (u?.points?.[0]) {
        const p = u.points[0].label, g = Ne(p, n, Me());
        c(g);
        const m = Array.from(Y(n)).find(
          ([b, J]) => b.name === p
        ), h = m ? m[0] : void 0;
        h && !h.children?.length && kn(p);
      }
    }), d;
  } catch (c) {
    return console.error("Failed to create sunburst plot:", c), null;
  }
}
function $n(e = "Root", t = null, n = $) {
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
async function En(e, t, n = "Root", o = null, r = $, i = Plotly) {
  const s = $n(n, o, r);
  return ge(e, t, s, r, i);
}
class Cn {
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
class Tn {
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
function Ln({ url: e, title: t, description: n }) {
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
async function We(e = w, t = v) {
  try {
    const n = await e(), o = Object.entries(n).map((i) => i[1]), r = t(o);
    return Ln({
      url: r.url,
      title: r.title,
      description: r.description
    });
  } catch (n) {
    return console.error("Error generating random post HTML:", n), "<div>Could not load random post</div>";
  }
}
function ao(e = "#e1", t = "#e2", n = "#e3", o = me) {
  try {
    o(e), o(t), o(n);
  } catch (r) {
    console.error("Error loading random eulogy:", r);
  }
}
function lo(e = ge, t = fe, n = pe, o = me, r = T) {
  try {
    e("sunburst", "sunburst_text", new Tn().get_tree()), t(), n(), o("#random-eulogy-role"), r("#random-blog-posts", async () => await We());
  } catch (i) {
    console.error("❌ Error loading enjoy page:", i);
  }
}
function co(e = ge, t = fe) {
  try {
    e("sunburst", "sunburst_text", new Cn().get_tree()), t();
  } catch (n) {
    console.error("Error loading 7 habits page:", n);
  }
}
function uo(e = pe) {
  try {
    e();
  } catch (t) {
    console.error("Error loading IG66 page:", t);
  }
}
function po(e = Pn, t = In, n = Sn) {
  try {
    e("balance-heatmap-rest"), t("balance-heatmap-work"), n("balance-radar-map-ideal");
  } catch (o) {
    console.error("Error loading balance page:", o);
  }
}
const qe = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"], Ye = 20, Je = 100, Xe = "#00BF00";
async function Sn(e, t) {
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
async function In(e, t) {
  const n = ["Tech", "Work"], o = {
    height: Ye * n.length + Je,
    margin: {
      t: 5
    },
    pad: 0
  }, r = [
    [0, "darkblue"],
    [0.4, "blue"],
    [0.5, Xe],
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
      x: qe.slice(2, 13),
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
async function Pn(e, t) {
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
        [0.5, Xe],
        [0.6, "blue"],
        [1, "darkblue"]
      ],
      zmin: 0,
      zmax: 10,
      x: qe.slice(2, 13),
      y: n.reverse(),
      z: o.reverse(),
      type: "heatmap"
    }
  ], s = {
    displayModeBar: !1
  }, a = {
    height: Ye * n.length + Je,
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
function mo(e = "Topics", t = En, n = fe, o = pe, r = me, i = T) {
  try {
    t("sunburst", "sunburst_text", e), n(), o(), r("#random-eulogy-role"), i("#random-blog-posts", async () => await We());
  } catch (s) {
    console.error("Error loading auto-generated sunburst:", s);
  }
}
const E = 150, Mn = 2500, Nn = 12e3, An = 2, Rn = /* @__PURE__ */ new Set([
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
function Hn(e, t = document) {
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
function Bn(e, t = window) {
  const n = e.ownerDocument, o = n.scrollingElement || n.documentElement, r = (a) => {
    const l = Number.parseFloat(a);
    return Number.isFinite(l) ? l : 0;
  }, i = r(t.getComputedStyle(o).scrollPaddingTop), s = r(t.getComputedStyle(e).scrollMarginTop);
  return e.getBoundingClientRect().top - i - s;
}
function Dn(e = window) {
  const t = () => {
  }, n = e.document;
  if (!e.location.hash || e.__readerScrolled || e.performance?.getEntriesByType?.("navigation")?.[0]?.type === "back_forward") return t;
  let r = !1, i = 0, s = 0, l = (e.performance?.now?.() ?? Date.now()) + Nn;
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
    if (c() - i < E) {
      p(E);
      return;
    }
    const _ = Hn(e.location.hash, n);
    if (!_) {
      p(E);
      return;
    }
    Math.abs(Bn(_, e)) > An && _.scrollIntoView({ block: "start", behavior: "auto" }), p(E);
  };
  function p(_) {
    r || (e.clearTimeout(s), s = e.setTimeout(u, _));
  }
  function g() {
    i = c();
  }
  function m(_) {
    _.type === "keydown" && !Rn.has(_.key) || d();
  }
  e.addEventListener("scroll", g, { passive: !0 });
  for (const _ of ["wheel", "touchstart", "mousedown", "keydown"])
    e.addEventListener(_, m, { passive: !0, capture: !0 });
  const h = e.ResizeObserver, b = typeof h == "function" ? new h(() => p(E)) : void 0;
  b && n.body && b.observe(n.body), b && n.documentElement && b.observe(n.documentElement);
  const J = () => {
    l = Math.min(l, c() + Mn), p(E);
  };
  return n.readyState === "complete" ? J() : e.addEventListener("load", J, { once: !0 }), p(E), d;
}
function On() {
  if (!(typeof window > "u"))
    return window["@algolia/autocomplete-js"]?.autocomplete;
}
const zn = "Search Igor's Musings ...", Ae = "/pagefind/", Un = "/search-titles.json";
function k(e) {
  const t = document.createElement("div");
  return t.textContent = e || "", t.innerHTML;
}
function N(e) {
  return k(e).replace(/"/g, "&quot;");
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
function Fn(e) {
  return e && e.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
}
const Gn = "/search-pins.json";
let B = null;
async function jn() {
  return B || (B = (async () => {
    const e = await fetch(Gn);
    if (!e.ok) throw new Error(`pins config HTTP ${e.status}`);
    const t = await e.json();
    if (!Array.isArray(t)) throw new Error("pins config is not an array");
    return t;
  })().catch((e) => (console.warn("Search pins unavailable:", e), B = null, null))), B;
}
function Re(e) {
  return e.toLowerCase().replace(/[\s-]+/g, "");
}
async function Wn(e) {
  const t = await jn();
  if (!t || t.length === 0) return [];
  const n = Re(e), o = t.filter((i) => i.match?.some((s) => s && n.includes(Re(s))));
  if (o.length === 0) return [];
  const r = await w().catch(() => ({}));
  return o.flatMap((i) => i.urls || []).map((i) => ({
    url: i.url,
    title: r?.[i.url]?.title || i.title || i.url,
    excerpt: r?.[i.url]?.description || "",
    source: "pinned"
  })).filter((i) => S(i.url));
}
let D = null;
async function qn() {
  return D || (D = (async () => {
    const e = await import(
      /* @vite-ignore */
      `${Ae}pagefind.js`
    );
    return await e.options({ basePath: Ae }), e;
  })().catch((e) => {
    throw D = null, e;
  })), D;
}
function Yn(e, t, n, o) {
  const r = e.toLowerCase().split(/\s+/).filter(Boolean), i = t.toLowerCase();
  return o?.trim() && r.length && r.every((s) => i.includes(s)) ? k(o) : n || "";
}
async function Jn(e, t = 10) {
  if (!e || !e.trim()) return [];
  try {
    const r = (await (await qn()).search(e)).results.slice(0, t), [i, s] = await Promise.all([
      Promise.all(r.map((a) => a.data())),
      w().catch(() => ({}))
    ]);
    return i.map((a) => {
      const l = Fn(a.url), c = a.meta?.title || a.url;
      return {
        url: l,
        title: c,
        excerpt: Yn(e, c, a.excerpt, s?.[l]?.description),
        source: "pagefind"
      };
    }).filter((a) => S(a.url));
  } catch (n) {
    return console.warn("Pagefind unavailable, falling back to title search:", n), [];
  }
}
let O = null;
async function Xn() {
  return O || (O = (async () => {
    const [{ default: e }, t] = await Promise.all([import("./minisearch.js"), fetch(Un)]);
    if (!t.ok) throw new Error(`title index HTTP ${t.status}`);
    const o = (await t.json()).map((i, s) => ({ id: s, title: i.t, url: i.u })), r = new e({
      fields: ["title"],
      storeFields: ["title", "url"]
    });
    return r.addAll(o), r;
  })().catch((e) => (console.warn("Title index unavailable:", e), O = null, null))), O;
}
async function Kn(e, t = 5) {
  if (!e || !e.trim()) return [];
  const n = await Xn();
  if (!n) return [];
  const o = await w().catch(() => ({}));
  return n.search(e, { fuzzy: 0.3, prefix: !0 }).slice(0, t).map((r) => ({
    url: r.url,
    title: r.title,
    excerpt: o?.[r.url]?.description || "",
    source: "title"
  })).filter((r) => S(r.url));
}
async function Vn(e, t = 10) {
  if (!e || !e.trim()) return [];
  const [n, o, r] = await Promise.all([
    Wn(e),
    Jn(e, t),
    Kn(e, 5)
  ]), i = /* @__PURE__ */ new Set(), s = [];
  for (const a of [...n, ...o, ...r])
    i.has(a.url) || (i.add(a.url), s.push(a));
  return s.slice(0, t);
}
function Zn(e) {
  return e.source === "pagefind" ? e.excerpt || "" : k(e.excerpt || "");
}
function Qn(e) {
  if (!S(e.url))
    return console.warn("Invalid URL skipped in renderSearchHit:", e.url), "<div>Invalid result</div>";
  const t = N(e.url);
  return `
           <span data-url="${t}" style="cursor: pointer;">
              <b> <a href="${t}">${k(e.title)}</a></b> <span>${Zn(e)}</span>
           </span>
        `;
}
async function eo() {
  const e = performance.now(), t = await w(), n = performance.now() - e;
  console.log(`  📊 [get_random_post] Loaded links in ${n.toFixed(0)}ms`);
  const o = Object.entries(t).map((s) => s[1]), r = v(o);
  return {
    title: r.title,
    url: r.url,
    description: r.description
  };
}
async function fo(e = 4) {
  const t = performance.now(), n = await w(), o = performance.now() - t;
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
async function to(e = 4) {
  try {
    const t = performance.now(), n = await w(), o = performance.now() - t;
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
async function no(e = 3) {
  return {
    sourceId: "random_posts",
    async getItems() {
      const t = new Array(e).join("_").split("_");
      return await Promise.all(
        t.map(async (o) => {
          try {
            return await eo();
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
           <b> <a href="${N(t.url)}">${k(t.title)}</a></b>
            <span>${k(t.description)}</span>
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
async function oo(e = 4) {
  return {
    sourceId: "recent_posts",
    async getItems() {
      return await to(e);
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
           <b> <a href="${N(t.url)}">${k(t.title)}</a></b>
            <span>${k(t.description)}</span>
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
function ro(e, t = 10) {
  return {
    sourceId: "featured_posts",
    async getItems() {
      return await Vn(e, t);
    },
    templates: {
      item({ item: n, createElement: o }) {
        return o("div", {
          dangerouslySetInnerHTML: {
            __html: Qn(n)
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
async function go(e, t = {}) {
  const { featuredCount: n = 10, recentCount: o = 4, randomCount: r = 3 } = t, i = On();
  if (!i) {
    console.error("Autocomplete is not defined");
    return;
  }
  const s = await no(r), a = await oo(o);
  function l({ query: d }) {
    return !d || d.length === 0 ? [a, s] : [ro(d, n)];
  }
  const c = e.startsWith("#") ? e : `#${e}`;
  if ($(c).length === 0) {
    console.log("No autocomplete element found", "autocomplete_id", e);
    return;
  }
  return i({
    container: c,
    placeholder: zn,
    getSources: l,
    debug: !1,
    openOnFocus: !0,
    detachedMediaQuery: ""
  });
}
Dn();
$(document).ready(() => {
  Ke(F);
  const e = () => {
    typeof Mousetrap < "u" && Mousetrap.bind("s", () => t());
  }, t = () => {
    const o = $("#search-box");
    o.length > 0 && o.focus();
  };
  e(), io(), so();
  const n = ["item1", "item2", "item3"];
  console.log("Random item:", v(n)), console.log("Shuffled items:", He([...n])), w().then((o) => {
    console.log("Links loaded, count:", Object.keys(o).length);
  }), console.log("Blog JavaScript initialized");
});
function io() {
  $("#toc-content").length > 0 && console.log("TOC initialized");
}
function so() {
  $("#search-box").length > 0 && console.log("Search initialized");
}
export {
  go as CreateAutoComplete,
  Z as MakeBackLinkHTML,
  f as TreeNode,
  fe as add_random_prompts,
  ge as add_sunburst,
  En as add_sunburst_from_dom,
  T as append_randomizer_div,
  Ke as defer,
  w as get_link_info,
  Be as get_random_page_url,
  eo as get_random_post,
  fo as get_random_posts_batch,
  to as get_recent_posts,
  Wt as goToRandomPage,
  it as initRecentAllPosts,
  co as load_7_habits,
  mo as load_auto_sunburst,
  po as load_balance,
  lo as load_enjoy2,
  F as load_globals,
  uo as load_ig66,
  ao as load_random_eulogy,
  Ln as makePostPreviewHTML,
  We as make_random_post_html,
  v as random_from_list,
  Qn as renderSearchHit,
  Vn as searchBlog,
  He as shuffle
};
//# sourceMappingURL=index.js.map
