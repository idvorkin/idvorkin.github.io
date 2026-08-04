function F(e) {
  return `
<div>
    <div class="link-box description truncate-css"> ${`<a href=${e.url}>${e.title}</a>`}:<span class="link-description"> ${e.description} <span></div>
</div>`;
}
function _(e) {
  if (e.length !== 0)
    return e[Math.floor(Math.random() * e.length)];
}
function he(e) {
  let t = e.length, n;
  for (; t !== 0; )
    n = Math.floor(Math.random() * t), t--, [e[t], e[n]] = [e[n], e[t]];
  return e;
}
function Le(e, t) {
  const n = t || e.name || "anonymous function";
  document.readyState === "loading" ? (console.log(`🕐 Deferring ${n} until DOM is ready`), document.addEventListener("DOMContentLoaded", () => {
    console.log(`🚀 Executing deferred ${n}`), e();
  })) : (console.log(`⚡ DOM already ready, executing ${n} immediately`), e());
}
async function x(e, t) {
  const n = $(e);
  if (n.length !== 1) {
    console.log(`append_randomizer_div ${e} not present`);
    return;
  }
  const o = await t(), r = $(o);
  n.empty().append(r), n.click(async (s) => {
    if (s.target.tagName !== "A") {
      const i = await t(), a = $(i);
      n.empty().append(a);
    }
  });
}
let S = null;
async function w(e) {
  if (S != null)
    return S;
  const o = (e || window.location.href).includes("https://idvork.in");
  let r = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
  o || (r = "/back-links.json");
  try {
    return S = (await (await fetch(r)).json()).url_info, S;
  } catch (s) {
    return console.error("Error fetching link info", s), {};
  }
}
async function sn() {
  try {
    const e = await w(), t = Object.keys(e).filter((o) => {
      const s = ["/404", "/404.html", "/search", "/recent", "/index.html", "/graph", "/about", "/random"].some((l) => o === l || o.endsWith(l)), a = [
        "/ig66/"
        // Exclude all ig66 subdirectory pages
      ].some((l) => o.includes(l));
      return !s && !a;
    });
    return t.length === 0 ? "/" : _(t) || "/";
  } catch (e) {
    return console.error("🚨 Error getting random page URL:", e), "/";
  }
}
async function Se(e = "/back-links.json") {
  if (e === "/test-missing-url-info")
    throw new Error("Missing url_info in data structure");
  try {
    return await w(e);
  } catch {
    throw new Error("Missing url_info in data structure");
  }
}
function Pe(e) {
  return Object.entries(e).map(([t, n]) => ({
    url: t,
    title: n.title || t,
    description: n.description || "",
    doc_size: n.doc_size || 0,
    last_modified: n.last_modified || ""
  }));
}
function Ie(e) {
  return e.filter(
    (t) => t.description && t.description.trim() !== "" && t.title && t.title.trim() !== ""
  );
}
function Ne(e) {
  return [...e].sort((t, n) => t.last_modified && n.last_modified ? new Date(n.last_modified).getTime() - new Date(t.last_modified).getTime() : n.doc_size - t.doc_size);
}
async function be() {
  const e = await Se(), t = Pe(e), n = Ie(t);
  return Ne(n);
}
function te(e) {
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
function ne(e) {
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
function Me(e, t) {
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
function He() {
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
function Re(e = "remaining-posts-toggle", t = "remaining-posts-content", n = document) {
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
    const s = this.querySelector(".toggle-icon");
    r.style.display === "none" ? (r.style.display = "block", s?.classList.add("open")) : (r.style.display = "none", s?.classList.remove("open"));
  });
}
function Ae(e, t = 15) {
  if (e.length === 0)
    return "<p>No modified posts found.</p>";
  const n = e.slice(0, t), o = e.slice(t), r = te(n);
  let s = ne(r);
  if (o.length > 0) {
    const i = te(o), a = ne(i);
    s += Me(a, o.length);
  }
  return He() + s;
}
async function oe(e = "last-modified-posts", t = 15, n = document) {
  const o = n.getElementById(e);
  if (!o) {
    console.log(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const r = await be(), s = Ae(r, t);
    o.innerHTML = s, Re("remaining-posts-toggle", "remaining-posts-content", n);
  } catch (r) {
    console.error("❌ Error loading recent posts:", r), o.innerHTML = "<p>Error loading modified posts. Please try again later.</p>";
  }
}
function ze(e = "last-modified-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    oe(e, 15, t);
  }) : oe(e, 15, t);
}
function Be(e, t = 5) {
  return e.slice(0, t);
}
function De(e) {
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
async function re(e = "recent-posts") {
  const t = document.getElementById(e);
  if (!t) {
    console.error(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const n = await be(), o = Be(n), r = De(o);
    t.innerHTML = r;
  } catch (n) {
    console.error("❌ Error loading recent posts:", n), t.innerHTML = "<p>Error loading recent posts. Please try again later.</p>";
  }
}
function Oe(e = "recent-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    re(e);
  }) : re(e);
}
console.log("Load force graph in TS v 0.9");
function z(e, t) {
  const n = e.filter((s) => s.url === t)[0];
  if (n)
    return n;
  const o = t.replace(/^\//, "").replace(/\/$/, "");
  return e.filter((s) => s.url.replace(/^\//, "").replace(/\/$/, "") === o)[0];
}
function Fe(e) {
  const t = [];
  for (const n of e) {
    const o = n.outgoing_links || [], r = n.incoming_links || [], s = [...o, ...r];
    for (const a of s)
      z(y, a) && t.push({ source: n, target: a, value: 1 });
    t.filter((a) => a.source === n).length === 0 && n.url === "/eulogy" && console.log(`No valid links found for ${n.url}`);
  }
  return t;
}
function U(e) {
  const t = e.filter((i) => i.expanded);
  e.find((i) => i.url === "/eulogy") || console.log("Eulogy node not found in pages");
  const o = Fe(t), r = o.map((i) => z(e, i.target)).filter((i) => i);
  return {
    nodes: t.concat(r),
    links: o
  };
}
function Ue(e, t, n) {
  const o = e.outgoing_links.length, r = e.expanded ? "-" : `+${o}`, s = `${e.id} [${r}]`, i = 12 / n;
  t.font = `${i}px Sans-Serif`;
  const l = [t.measureText(s).width, i].map((c) => c + i * 0.2);
  t.fillStyle = "rgba(255, 255, 255, 0.8)", t.fillRect(e.x - l[0] / 2, e.y - l[1] / 2, ...l), t.textAlign = "center", t.textBaseline = "middle", t.fillStyle = e.color, t.fillText(s, e.x, e.y), e.__bckgDimensions = l;
}
function je(e, t, n) {
  n.fillStyle = t;
  const o = e.__bckgDimensions;
  o && n.fillRect(e.x - o[0] / 2, e.y - o[1] / 2, ...o);
}
let y = [], b = null, k = null;
function H(e) {
  if (!k) {
    console.log("Cannot center: Graph not initialized");
    return;
  }
  if (!e) {
    console.log("Cannot center: Node is null or undefined");
    return;
  }
  k.centerAt(e.x, e.y, 500), k.zoom(8, 500), ye(e);
}
function ye(e) {
  if (!e)
    return;
  b = e;
  const t = F(e), n = document.getElementById("detail");
  n && (n.innerHTML = t);
}
function Ge() {
  b ? b.url ? window.open(b.url, "_blank") : console.log("Active node has no URL") : console.log("No active node to go to");
}
function We() {
  for (const e of y)
    e.expanded = !1;
  b && (b.expanded = !0), k && (k.graphData(U(y)), b && setTimeout(() => {
    H(b);
  }, 300));
}
async function qe() {
  if (!document.getElementById("graph")) {
    console.log("Graph element not found, exiting initialization");
    return;
  }
  window.location.hash.substr(1), y = Object.values(await w()).map((a) => ({
    ...a,
    id: a.url,
    expanded: !1
  }));
  const t = `/${window.location.hash ? window.location.hash.substr(1) : ""}`, n = y.map((a) => a.url).includes(t) ? t : "/eulogy";
  for (const a of y)
    a.expanded = a.url === n;
  if (typeof ForceGraph > "u") {
    console.log("Force Graph not defined, providing fallback functionality");
    const a = z(y, n);
    a && (ye(a), b = a);
    const l = document.getElementById("center_control");
    l && l.addEventListener("click", () => {
      console.log("Center control clicked (fallback mode)");
    });
    const c = document.getElementById("goto_control");
    c && c.addEventListener("click", () => {
      b?.url && window.open(b.url, "_blank");
    });
    const d = document.getElementById("collapse_control");
    d && d.addEventListener("click", () => {
      console.log("Collapse control clicked (fallback mode)");
    });
    return;
  }
  k = ForceGraph()(document.getElementById("graph")).graphData(U(y)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(Ue).nodePointerAreaPaint(je).onNodeRightClick((a) => {
    window.open(a.url, "_blank");
  }).onNodeClick((a) => {
    a.expanded = !a.expanded, y.filter((c) => c.expanded).length === 0 && (a.expanded = !0), k.graphData(U(y)), setTimeout(() => {
      H(a);
    }, 300);
  });
  const o = z(y, n);
  o ? H(o) : console.log("Initial node not found, cannot center");
  const r = document.getElementById("center_control");
  r ? r.addEventListener("click", () => {
    b ? H(b) : console.log("No last detail node to center on");
  }) : console.log("Center control element not found");
  const s = document.getElementById("goto_control");
  s && s.addEventListener("click", Ge);
  const i = document.getElementById("collapse_control");
  i && i.addEventListener("click", We);
}
typeof window < "u" && (window.initializeGraph = qe);
function Je() {
  const e = window.__GIT_BRANCH__;
  return e ? (console.log("Branch from global variable:", e), e) : (console.log("Branch info not found"), null);
}
function Ye() {
  const e = window.__GIT_PR__;
  return e && typeof e == "number" ? (console.log("PR from global variable:", e), e) : (console.log("PR info not found"), null);
}
function Xe() {
  return window.location.port || "80";
}
function Ke() {
  console.log("Initializing dev info...");
  const e = Je(), t = Ye(), n = Xe();
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
    if (e && (r += `<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${e}</code>`), t) {
      e && (r += " | ");
      const i = `https://github.com/idvorkin/idvorkin.github.io/pull/${t}`;
      r += `<i class="fas fa-code-pull-request"></i> PR: <a href="${i}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${t}</code></a>`;
    }
    (e || t) && n && (r += " | "), r += `<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${n}</code>`, o.innerHTML = r, document.body.appendChild(o);
    const s = Number.parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${s + 40}px`;
  }
}
const K = {
  iconClass: "header-copy-link",
  tooltipDuration: 2e3,
  domainMapping: {
    from: "idvork.in/",
    to: "idvorkin.azurewebsites.net/"
  }
};
function Ve(e) {
  const t = document.createElement("span");
  return t.className = e.iconClass || K.iconClass, t.title = "Share this section", t.style.cursor = "pointer", t.style.marginLeft = "0.5rem", t.style.opacity = "0", t.style.transition = "opacity 0.2s ease", t.style.fontSize = "0.8em", t.style.userSelect = "none", t.setAttribute("role", "button"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-label", "Share this section"), t.innerHTML = `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`, t;
}
function Ze() {
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
function Qe(e, t) {
  const n = document.createElement("div");
  n.className = "github-issue-popup", n.style.display = "none", n.id = `github-issue-popup-${e}`;
  const o = document.createElement("div");
  o.className = "github-issue-popup-content";
  const r = document.createElement("div");
  r.className = "github-issue-popup-header";
  const s = document.createElement("h4");
  s.textContent = `Report Issue: ${t}`;
  const i = document.createElement("button");
  i.className = "github-issue-popup-close", i.title = "Close", i.textContent = "×", r.appendChild(s), r.appendChild(i);
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
  const E = document.createElement("small");
  return E.textContent = "Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit", h.appendChild(E), a.appendChild(l), a.appendChild(c), a.appendChild(d), a.appendChild(u), a.appendChild(p), a.appendChild(h), o.appendChild(r), o.appendChild(a), n.appendChild(o), n;
}
function et(e, t) {
  document.querySelectorAll(".github-issue-popup").forEach((i) => {
    i.style.display = "none";
  }), e.style.display = "block", e.style.position = "absolute", e.style.zIndex = "1000";
  const n = t.getBoundingClientRect(), o = window.pageYOffset || document.documentElement.scrollTop, r = window.pageXOffset || document.documentElement.scrollLeft;
  e.style.top = `${n.bottom + o + 10}px`, e.style.left = `${n.left + r}px`;
  const s = e.querySelector(".github-issue-title");
  s && s.focus();
}
function R(e) {
  e.style.display = "none";
  const t = e.querySelector(".github-issue-comment");
  t && (t.value = "");
}
function tt(e, t = 2e3) {
  if (typeof document < "u" && document.querySelector) {
    const o = document.querySelector(".copy-link-tooltip");
    o && o.remove();
  }
  const n = document.createElement("span");
  n.className = "copy-link-tooltip", n.textContent = "Copied!", n.style.position = "absolute", n.style.backgroundColor = "#333", n.style.color = "white", n.style.padding = "4px 8px", n.style.borderRadius = "4px", n.style.fontSize = "12px", n.style.zIndex = "1000", n.style.marginLeft = "10px", n.style.marginTop = "-5px", e.parentElement?.appendChild(n), setTimeout(() => {
    n.remove();
  }, t);
}
function ie(e) {
  if (!e) return "";
  const o = (window.location.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index").replace(/-/g, " "), r = [], s = e.tagName, i = Number.parseInt(s.substring(1)), a = Array.from(e.childNodes).filter((c) => c.nodeType === Node.TEXT_NODE).map((c) => c.textContent?.trim()).join(" ").trim();
  if (i >= 2) {
    let c = e.previousElementSibling;
    const d = [], u = /* @__PURE__ */ new Set();
    for (; c; ) {
      const p = c.tagName;
      if (p?.match(/^H[1-6]$/)) {
        const g = Number.parseInt(p.substring(1));
        if (g < i && !u.has(g)) {
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
function se(e, t) {
  let n = e;
  n = n.replace("localhost:4000/", "idvorkin.azurewebsites.net/"), t.domainMapping && (n = n.replace(t.domainMapping.from, t.domainMapping.to));
  const o = new URL(n), r = o.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index", s = o.hash.replace("#", "");
  return s ? `${r}#${s}` : r;
}
async function nt(e, t) {
  try {
    const n = window.location.href, o = n.includes("#") ? n.replace(/#.*/, `#${e}`) : `${n}#${e}`, r = se(o, t), s = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`, i = document.getElementById(e), l = `${i ? Array.from(i.childNodes).filter((m) => m.nodeType === Node.TEXT_NODE).map((m) => m.textContent?.trim()).join(" ").trim() : ""} - Igor's Blog`, c = le(e), d = ie(i);
    let u = `From: ${d} ...`;
    c && (u = `From: ${d} ...

${c}`), fetch(s).catch(() => {
    });
    const p = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (navigator.share && p)
      try {
        return await navigator.share({
          title: l,
          text: u,
          url: s
        }), console.log(`📱 Shared via native share: ${s}`), !0;
      } catch (m) {
        console.log("Share cancelled or failed, falling back to clipboard", m);
      }
    let g = s;
    return c && (g = `From: ${d} ...

${c}

${s}`), await navigator.clipboard.writeText(g), console.log(`📋 Copied to clipboard with preview: ${g.substring(0, 100)}...`), !1;
  } catch (n) {
    console.error("Failed to share/copy header link:", n);
    try {
      const o = window.location.href, r = o.includes("#") ? o.replace(/#.*/, `#${e}`) : `${o}#${e}`, s = se(r, t), i = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(s)}`, a = document.getElementById(e), l = ie(a), c = le(e);
      let d = i;
      c && (d = `From: ${l} ...

${c}

${i}`);
      const u = document.createElement("textarea");
      return u.value = d, document.body.appendChild(u), u.select(), document.execCommand("copy"), document.body.removeChild(u), console.log(`📋 Copied with preview (fallback): ${d.substring(0, 100)}...`), !1;
    } catch (o) {
      throw console.error("Failed to copy URL even with fallback:", o), o;
    }
  }
}
function ot(e) {
  if (e.id)
    return e.id;
  const n = (e.textContent || "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let o = n, r = 1;
  for (; document.getElementById(o); )
    o = `${n}-${r}`, r++;
  return e.id = o, o;
}
const _e = 600;
function we(e) {
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
      let s = 0, i = !1;
      for (const a of Array.from(o)) {
        const l = Array.from(a.childNodes).filter(
          (d) => d.nodeType === Node.TEXT_NODE || d.nodeType === Node.ELEMENT_NODE && d.tagName !== "UL" && d.tagName !== "OL"
        ).map((d) => (d.textContent || "").trim()).join(" ").trim();
        if (l.length === 0) continue;
        const c = l.length + 2;
        if (r.length > 0 && s + c + 1 > _e) {
          i = !0;
          break;
        }
        r.push(`• ${l}`), s += c + 1;
      }
      if (r.length > 0) {
        const a = i || n(t.nextElementSibling);
        return { text: r.join(`
`), hasMore: a };
      }
    }
    t = t.nextElementSibling;
  }
  return { text: "", hasMore: !1 };
}
function P(e, t = _e) {
  if (e.length <= t)
    return e;
  const n = e.substring(0, t), o = Math.floor(t * 0.6), r = [". ", "! ", "? ", `.
`, `!
`, `?
`];
  let s = -1;
  for (const l of r) {
    const c = n.lastIndexOf(l);
    c >= o && c + l.length > s && (s = c + 1);
  }
  if (s > 0)
    return `${n.substring(0, s).trimEnd()}...`;
  const i = n.lastIndexOf(`
•`);
  if (i >= o)
    return `${n.substring(0, i).trimEnd()}...`;
  const a = n.lastIndexOf(" ");
  return a > 0 ? `${n.substring(0, a)}...` : `${n}...`;
}
function ae(e, t) {
  return !t || e.endsWith("...") || e.endsWith("…") ? e : `${e}...`;
}
function le(e) {
  if (e) {
    const o = document.getElementById(e);
    if (o) {
      const { text: r, hasMore: s } = we(o);
      if (r)
        return ae(P(r), s);
      let i = o.nextElementSibling;
      const a = [];
      let l = 0, c = !1;
      for (; i && l < 400 && !i.tagName.match(/^H[1-6]$/); ) {
        if (i.tagName === "P" || i.tagName === "LI" || i.tagName === "BLOCKQUOTE" || i.tagName === "DIV") {
          const u = (i.textContent || "").trim();
          u.length > 0 && (a.push(u), l += u.length);
        }
        i = i.nextElementSibling;
      }
      let d = i;
      for (; d && !c && !d.tagName.match(/^H[1-6]$/); ) {
        if ((d.textContent || "").trim().length > 0) {
          c = !0;
          break;
        }
        d = d.nextElementSibling;
      }
      if (a.length > 0)
        return ae(P(a.join(" ")), c);
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
      const s = r.querySelector("p");
      if (s) {
        const i = (s.textContent || "").trim();
        if (i.length > 0)
          return P(i);
      }
    }
  }
  const n = document.querySelector("p");
  if (n) {
    const o = (n.textContent || "").trim();
    if (o.length > 0)
      return P(o);
  }
  return "";
}
function rt(e, t, n, o, r) {
  const i = window.location.pathname.replace(/^\//, "").replace(/\.html$/, ""), a = document.querySelector('meta[property="markdown-path"]'), l = a ? a.getAttribute("content") : `${i || "index"}.md`, c = "https://github.com/idvorkin/idvorkin.github.io", d = n ? `${i || "index"}/${e}: ${n}` : `${i || "index"}/${e}: Issue with ${t}`, u = encodeURIComponent(d), p = o || n || `Issue with section: ${t}`, g = r ? we(r) : "";
  let h = `${`📍 [${i || "index"}](https://idvorkin.azurewebsites.net/${i})/[${e}](https://idvorkin.azurewebsites.net/${i}/${e}) - [[GitHub]](${c}/blob/main/${l}#${e})`}

## Description

${p}

`;
  g && (h += `## Content Excerpt

#### ${t}

> ${g}

`);
  const E = encodeURIComponent(h);
  return `${c}/issues/new?title=${u}&body=${E}`;
}
const j = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new Set();
function st(e, t) {
  let n = G.get(e);
  return n || (n = Qe(t, e.textContent || ""), document.body.appendChild(n), G.set(e, n), at(n, e, t)), n;
}
function at(e, t, n) {
  const o = [], r = e.querySelector(".github-issue-popup-close");
  if (r) {
    const p = () => R(e);
    r.addEventListener("click", p), o.push(() => r.removeEventListener("click", p));
  }
  const s = e.querySelector(".github-issue-cancel");
  if (s) {
    const p = () => R(e);
    s.addEventListener("click", p), o.push(() => s.removeEventListener("click", p));
  }
  const i = () => {
    const p = e.querySelector(".github-issue-title"), g = e.querySelector(".github-issue-comment"), m = p?.value || "", h = g?.value || "", E = rt(n, t.textContent || "", m, h, t);
    window.open(E, "_blank"), R(e);
  }, a = e.querySelector(".github-issue-submit");
  a && (a.addEventListener("click", i), o.push(() => a.removeEventListener("click", i)));
  const l = e.querySelector(".github-issue-title"), c = e.querySelector(".github-issue-comment"), d = (p) => {
    (p.ctrlKey || p.metaKey) && p.key === "Enter" && (p.preventDefault(), i());
  };
  l && (l.addEventListener("keydown", d), o.push(() => l.removeEventListener("keydown", d))), c && (c.addEventListener("keydown", d), o.push(() => c.removeEventListener("keydown", d)));
  const u = j.get(t) || [];
  j.set(t, [...u, ...o]);
}
function lt(e, t) {
  if (e.querySelector(`.${t.iconClass || K.iconClass}`))
    return;
  const o = ot(e), r = Ve(t), s = Ze(), i = [], a = async (m) => {
    m.preventDefault(), m.stopPropagation(), await nt(o, t) || tt(r, t.tooltipDuration);
  };
  r.addEventListener("click", a), i.push(() => r.removeEventListener("click", a));
  const l = (m) => {
    (m.key === "Enter" || m.key === " ") && (m.preventDefault(), a(m));
  };
  r.addEventListener("keydown", l), i.push(() => r.removeEventListener("keydown", l));
  const c = (m) => {
    m.preventDefault(), m.stopPropagation();
    const h = st(e, o);
    et(h, e);
  };
  s.addEventListener("click", c), i.push(() => s.removeEventListener("click", c));
  const d = (m) => {
    const h = G.get(e);
    h && !h.contains(m.target) && m.target !== s && !s.contains(m.target) && h.style.display !== "none" && R(h);
  }, u = setTimeout(() => {
    typeof document > "u" || (document.addEventListener("click", d, !0), i.push(() => document.removeEventListener("click", d, !0)));
  }, 100);
  i.push(() => clearTimeout(u)), e.appendChild(r), e.appendChild(s);
  const p = () => {
    r.style.opacity = "1", s.style.opacity = "1";
  }, g = () => {
    r.style.opacity = "0", s.style.opacity = "0";
  };
  e.addEventListener("mouseenter", p), e.addEventListener("mouseleave", g), i.push(() => {
    e.removeEventListener("mouseenter", p), e.removeEventListener("mouseleave", g);
  }), j.set(e, i), it.add(e);
}
function ce(e = {}) {
  const t = { ...K, ...e }, n = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const o of Array.from(n))
    lt(o, t);
}
function ct() {
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
let de = !1;
function dt(e = {}) {
  de || (de = !0, ct(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    ce(e);
  }) : ce(e));
}
const W = 50, q = 100, ut = W * q;
function B(e = 0) {
  if (typeof document > "u")
    return;
  if (console.log("🖼️ Enabling image zoom functionality"), typeof window.GLightbox > "u") {
    if (e < W) {
      console.warn(
        `⚠️ GLightbox not found, retrying in ${q}ms (attempt ${e + 1}/${W})`
      ), setTimeout(() => B(e + 1), q);
      return;
    }
    console.error(
      `❌ GLightbox failed to load after ${ut / 1e3} seconds, aborting image zoom initialization`
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
  n.forEach((r, s) => {
    const i = r;
    if (i.parentElement?.tagName === "A") {
      console.log(`⏭️ Skipping image ${s + 1} - already wrapped`);
      return;
    }
    if (i.naturalWidth > 0 && i.naturalWidth < 100 && i.naturalHeight < 100) {
      console.log(
        `⏭️ Skipping image ${s + 1} - too small (${i.naturalWidth}x${i.naturalHeight})`
      );
      return;
    }
    const a = document.createElement("a");
    a.href = i.src, a.className = "glightbox", a.setAttribute("data-gallery", "post-images"), i.alt && a.setAttribute("data-description", i.alt), i.parentNode?.insertBefore(a, i), a.appendChild(i), o++, console.log(
      `✅ Processed image ${s + 1}: ${i.src.substring(i.src.lastIndexOf("/") + 1)}`
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
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => B()) : setTimeout(() => B(), 500));
let J = !0;
function ue() {
  const e = $(".ui-toc-dropdown .toc"), t = $(".expand-toggle");
  if (e.length === 0 || t.length === 0) {
    console.warn("TOC or toggle elements not found for expand/collapse");
    return;
  }
  J ? (e.addClass("expand"), t.text("Collapse all")) : (e.removeClass("expand"), t.text("Expand all"));
}
const pt = "https://idvork.in", Y = "idvorkin_dev_origin";
function mt() {
  return window.location.hostname === "idvork.in";
}
function ft(e) {
  try {
    const t = new URL(e), n = t.hostname;
    return n === "localhost" || n === "127.0.0.1" || n.endsWith(".ts.net") ? !0 : t.port !== "" && t.port !== "80" && t.port !== "443";
  } catch {
    return !1;
  }
}
function gt() {
  if (document.referrer)
    try {
      const e = new URL(document.referrer).origin;
      ft(e) && localStorage.setItem(Y, e);
    } catch {
    }
}
function ht() {
  const e = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (mt()) {
    const t = localStorage.getItem(Y) || "http://localhost:4000";
    window.location.href = `${t}${e}`;
  } else
    localStorage.setItem(Y, window.location.origin), window.location.href = `${pt}${e}`;
}
function xe() {
  const e = $("#right-sidebar"), t = $("#main-content");
  e.length > 0 && (e.removeClass(), e.addClass("col-4 pl-0")), t.length > 0 && (t.removeClass(), t.addClass("col-8 pr-0"));
  const n = $("#id-ui-toc-dropdown");
  n.length > 0 && (n.removeClass(), n.addClass("d-none"));
}
function pe(e, t) {
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
  const o = $('<div class="toc-menu"></div'), r = $('<a class="expand-toggle" href="#">Collapse all</a>'), s = $('<a class="back-to-top" href="#">Top of page</a>'), i = $('<a class="go-to-bottom" href="#">Bottom of page</a>'), a = $('<a class="go-to-bottom" href="#">Pin ToC</a>');
  ue(), r.click((l) => {
    l.preventDefault(), l.stopPropagation(), J = !J, ue();
  }), s.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, 0);
  }), i.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, document.body.scrollHeight);
  }), a.click((l) => xe()), o.append(r).append(s).append(i), t && o.append(a), n.append(o);
}
async function bt(e) {
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
  const s = r.find("#incoming"), i = (u, p) => Number(e[p].doc_size) - Number(e[u].doc_size);
  if (n)
    for (const u of n.sort(i)) {
      const p = e[u];
      s.append(F(p));
    }
  const a = [];
  for (const u of o)
    e[u] && a.push(u);
  const l = r.find("#outgoing");
  if (a)
    for (const u of a.sort(i)) {
      const p = e[u];
      l.append(F(p));
    }
  const c = r.find("#graph"), d = t.replace(/\//g, "");
  c.append(`<a href='/graph#${d}'>${t} (${d}) </a>`);
}
function yt(e, t) {
  if (!t)
    return C(e, "URL info is undefined");
  const n = t.url || "#", o = t.title || "Untitled", r = t.description || "No description available", s = `(From:<a href='${n}'> ${o}</a>)`;
  return `<div>
        <i> ${r}</i> ${s}
    </div>`;
}
function C(e, t) {
  return `<span class='text-danger'>Error: Invalid link for ${e?.attr ? e.attr("href") : "unknown"} ${t} </span>`;
}
function _t(e) {
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
          o.html(C(o, "missing href"));
          return;
        }
        if (!e.redirects || !e.url_info) {
          o.html(C(o, "incomplete backLinks data"));
          return;
        }
        if (e.redirects[r] !== void 0 && (r = e.redirects[r]), e.url_info[r] === void 0) {
          o.html(C(o, "not found in url info"));
          return;
        }
        o.html(yt(o, e.url_info[r]));
      } catch (r) {
        o?.html ? o.html(C(o, r)) : console.error("Error processing link and unable to display error:", r);
      }
    }
  } catch (t) {
    console.error("Error processing summary links:", t);
  }
}
async function wt() {
  const e = "__idvorkin_add_link_loader_initialized__";
  window[e] || (window[e] = !0, bt(await w()), _t(await xt()));
}
let I = null;
async function xt() {
  try {
    if (I != null)
      return I;
    const n = window.location.href.includes("https://idvork.in");
    let o = "";
    n ? o = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True" : o = "/back-links.json";
    try {
      const r = await $.getJSON(o);
      return r.redirects || (r.redirects = {}), r.url_info || (r.url_info = {}), I = r, I;
    } catch (r) {
      return console.error("Error fetching backlinks JSON:", r), { redirects: {}, url_info: {} };
    }
  } catch (e) {
    return console.error("Error in get_back_links:", e), { redirects: {}, url_info: {} };
  }
}
function kt() {
  window.location.href = "/";
}
function vt() {
  const e = window.Mousetrap();
  e.bind("s", (n) => kt()), e.bind("t", (n) => xe()), e.bind("p", (n) => ht()), e.bind("a", (n) => {
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
  `;
  e.bind("?", (n) => alert(t));
}
function $t(e) {
  for (const [t, n] of Object.entries(e)) {
    const o = typeof $ < "u" && $.fn ? $(`a[href=${t}]`).first()[0] : document.querySelector(`a[href="${t}"]`);
    if (!o) return;
    const r = n.cloneNode(!0);
    r.children.length > 0 && r.children[0].remove(), o.replaceWith(r), n.remove();
  }
}
function Et() {
  const e = {}, t = typeof $ < "u" && $.fn ? $("ul").toArray() : Array.from(document.querySelectorAll("ul"));
  for (const n of t) {
    const o = n.firstElementChild;
    if (!o) continue;
    const r = o.textContent;
    if (!r || !r.startsWith("l")) continue;
    const s = Number.parseInt(r.substring(1));
    Number.isNaN(s) || (e[r] = n);
  }
  return e;
}
function D() {
  const e = Et();
  $t(e);
}
function A() {
  const e = "__idvorkin_load_globals_initialized__";
  window[e] || (window[e] = !0, gt(), $(wt), $(vt), typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(D) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", D) : D()), Oe(), document.getElementById("last-modified-posts") && ze(), $(() => {
    pe("ui-toc", !0), pe("ui-toc-affix", !1);
  }), dt(), B(), Ke());
}
typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(A) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A());
function O(e) {
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
  const r = e.thumbnail.replace("s72-c", "s320"), s = new Date(e.published), i = `
    <div> ${o[s.getMonth()]} ${s.getFullYear()} - ${e.excerpt}
    </div>
   `;
  return e.thumbnail !== "" ? (console.log(e.title), console.log(s), t.append(
    // `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
    `
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${r}'/></a>
      ${i}
      </div>`
  )) : t.append(i), t.html();
}
function Ct(e) {
  return e.filter((t) => t.title.toLowerCase().includes("achievement"));
}
function Tt(e) {
  return e.filter((t) => t.tags.includes("family-journal"));
}
function Lt(e) {
  if (console.log("Processing", e.length, "posts"), !e) {
    console.log("No posts being imported");
    return;
  }
  const t = "#random-post", n = "#achievment", o = "#random-recent";
  x(t, () => O(_(e))), x(n, () => O(_(Ct(e)))), x(o, () => O(_(Tt(e))));
}
function V() {
  $.getJSON("/ig66/ig66-export.json", Lt);
}
function St(e) {
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
function Pt(e, t) {
  if (!t) {
    console.log("No roles being imported");
    return;
  }
  console.log("Processing", t.roles.length, "roles"), x(e, () => St(_(t.roles)));
}
function Z(e) {
  $.getJSON("/eulogy.json", (n) => Pt(e, n));
}
class f {
  constructor({
    name: t,
    value: n = 25,
    children: o = []
  }) {
    this.name = t, this.children = he(o), this.value = n;
  }
}
function Q(e = ke, t = It) {
  const n = e();
  for (const o of n.keys())
    t(o, n.get(o));
}
function It(e, t, n = $, o = x) {
  const r = () => `<span>${_(
    t
  )}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">🔄</span>`, s = n('<div class="alert alert-primary" role="alert"/>');
  n(e).after(s), o(s, r);
}
function ke(e = $) {
  const t = e("h3").first();
  let n = t, o = [];
  const r = /* @__PURE__ */ new Map();
  for (let s = t; s.length !== 0; s = e(s).next()) {
    if (s.prop("tagName") === "H3") {
      r.set(n, o), n = s, o = [];
      continue;
    }
    s.prop("tagName") === "UL" && (o = Array.from(e(s).find("li")).map((i) => e(i).text()));
  }
  return r.set(n, o), r;
}
function* X(e) {
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
function Nt(e) {
  const t = Array.from(X(e)).map(([n, o]) => [n.name, o?.name]);
  return {
    ids: t.map(([n, o]) => n),
    labels: t.map(([n, o]) => n),
    parents: t.map(([n, o]) => o)
  };
}
function me(e = ke) {
  const t = e(), n = Array.from(t.entries()).map(([o, r], s) => [o.text(), r]);
  return new Map(n);
}
function fe(e, t, n) {
  const o = Array.from(X(t)).find(([a, l]) => a.name === e);
  if (!o)
    return "Click in any box or circle";
  const [r, s] = o, i = Array.from(X(r)).map(([a, l]) => a).filter((a) => {
    const l = n.has(a.name), c = n.has(`${a.name}🔗`);
    return l || c;
  }).flatMap((a) => (n.get(a.name) || n.get(`${a.name}🔗`) || []).map((c) => `${a.name}: ${c}`));
  return i.length === 0 ? "Click in any box or circle" : _(i);
}
async function ee(e, t, n, o = $, r = Plotly) {
  if (!r) {
    console.error("Plotly is not available");
    return;
  }
  const s = Nt(n), i = {
    type: "sunburst",
    outsidetextfont: { size: 20, color: "#377eb8" },
    // leaf: {opacity: 0.4},
    hoverinfo: "none",
    marker: { line: { width: 2 } },
    maxdepth: 2,
    displayModeBar: !1
  };
  Object.assign(i, s), i.values = void 0;
  const a = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"]
  }, l = {
    displayModeBar: !1
  };
  try {
    await r.newPlot(e, [i], a, l);
    const c = (u) => {
      o(`#${t}`).text(u);
    };
    o(`#${t}`).first().click(() => {
      const u = o("#sunburst text:first").text(), p = fe(u, n, me());
      c(p);
    });
    const d = document.getElementById(e);
    return d && typeof d.on == "function" && d.on("plotly_click", (u) => {
      if (u?.points?.[0]) {
        const p = u.points[0].label, g = fe(p, n, me());
        c(g);
      }
    }), d;
  } catch (c) {
    return console.error("Failed to create sunburst plot:", c), null;
  }
}
function Mt(e = "Root", t = null, n = $) {
  const o = t ? n(t).find("h2") : n("h2"), r = [];
  return o.each((s, i) => {
    const a = n(i), l = a.text().trim();
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
async function Ht(e, t, n = "Root", o = null, r = $, s = Plotly) {
  const i = Mt(n, o, r);
  return ee(e, t, i, r, s);
}
class Rt {
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
class At {
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
    }), s = new f({
      name: "Joy",
      children: [new f({ name: "Balloons" }), new f({ name: "Joy to Others" })]
    });
    return new f({
      name: "Invest in",
      children: [t, n, o, r, s]
    });
  }
}
function zt({ url: e, title: t, description: n }) {
  const o = `<a href='${e}'}>${t}</a>`, r = `audio_player_${Math.floor(Math.random() * 1e10)}`, s = e.replace(/\//g, "_");
  return `
    <div>
        <audio id='${r}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${s}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${r}')">🔈</a></b> ${n}
    </div>
  `;
}
async function ve(e = w, t = _) {
  try {
    const n = await e(), o = Object.entries(n).map((s) => s[1]), r = t(o);
    return zt({
      url: r.url,
      title: r.title,
      description: r.description
    });
  } catch (n) {
    return console.error("Error generating random post HTML:", n), "<div>Could not load random post</div>";
  }
}
function an(e = "#e1", t = "#e2", n = "#e3", o = Z) {
  try {
    o(e), o(t), o(n);
  } catch (r) {
    console.error("Error loading random eulogy:", r);
  }
}
function ln(e = ee, t = Q, n = V, o = Z, r = x) {
  try {
    e("sunburst", "sunburst_text", new At().get_tree()), t(), n(), o("#random-eulogy-role"), r("#random-blog-posts", async () => await ve());
  } catch (s) {
    console.error("❌ Error loading enjoy page:", s);
  }
}
function cn(e = ee, t = Q) {
  try {
    e("sunburst", "sunburst_text", new Rt().get_tree()), t();
  } catch (n) {
    console.error("Error loading 7 habits page:", n);
  }
}
function dn(e = V) {
  try {
    e();
  } catch (t) {
    console.error("Error loading IG66 page:", t);
  }
}
function un(e = Ot, t = Dt, n = Bt) {
  try {
    e("balance-heatmap-rest"), t("balance-heatmap-work"), n("balance-radar-map-ideal");
  } catch (o) {
    console.error("Error loading balance page:", o);
  }
}
const $e = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"], Ee = 20, Ce = 100, Te = "#00BF00";
async function Bt(e, t) {
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
    } catch (s) {
      console.error("Error creating radar map:", s);
    }
  else
    console.warn("Plotly is not defined, skipping chart rendering");
}
async function Dt(e, t) {
  const n = ["Tech", "Work"], o = {
    height: Ee * n.length + Ce,
    margin: {
      t: 5
    },
    pad: 0
  }, r = [
    [0, "darkblue"],
    [0.4, "blue"],
    [0.5, Te],
    [0.6, "darkred"],
    [1, "red"]
  ], s = [
    [7, 4, 7, 8, 2, 4, 2, 3, 2, 8],
    //  Tech
    [10, 7, 5, 5, 3, 5, 6, 6, 7, 5]
    //  Work
  ], i = [
    {
      colorscale: r,
      zmin: 0,
      zmax: 10,
      x: $e.slice(2, 13),
      y: n,
      z: s,
      type: "heatmap"
    }
  ], a = {
    displayModeBar: !1
  };
  if (typeof t < "u" && t)
    try {
      await t.newPlot(e, i, o, a);
    } catch (l) {
      console.error("Error creating work balance chart:", l);
    }
  else
    console.warn("Plotly is not defined, skipping chart rendering");
}
async function Ot(e, t) {
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
  ], s = [
    {
      colorscale: [
        [0, "red"],
        [0.4, "darkred"],
        [0.5, Te],
        [0.6, "blue"],
        [1, "darkblue"]
      ],
      zmin: 0,
      zmax: 10,
      x: $e.slice(2, 13),
      y: n.reverse(),
      z: o.reverse(),
      type: "heatmap"
    }
  ], i = {
    displayModeBar: !1
  }, a = {
    height: Ee * n.length + Ce,
    margin: {
      t: 5
    },
    pad: 0
  };
  if (typeof t < "u" && t)
    try {
      await t.newPlot(e, s, a, i);
    } catch (l) {
      console.error("Error creating rest time chart:", l);
    }
  else
    console.warn("Plotly is not defined, skipping chart rendering");
}
function pn(e = "Topics", t = Ht, n = Q, o = V, r = Z, s = x) {
  try {
    t("sunburst", "sunburst_text", e), n(), o(), r("#random-eulogy-role"), s("#random-blog-posts", async () => await ve());
  } catch (i) {
    console.error("Error loading auto-generated sunburst:", i);
  }
}
function Ft() {
  if (!(typeof window > "u"))
    return window["@algolia/autocomplete-js"]?.autocomplete;
}
const Ut = "Search Igor's Musings ...", ge = "/pagefind/", jt = "/search-titles.json";
function v(e) {
  const t = document.createElement("div");
  return t.textContent = e || "", t.innerHTML;
}
function T(e) {
  return v(e).replace(/"/g, "&quot;");
}
function L(e) {
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
function Gt(e) {
  return e && e.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
}
let N = null;
async function Wt() {
  return N || (N = (async () => {
    const e = await import(
      /* @vite-ignore */
      `${ge}pagefind.js`
    );
    return await e.options({ basePath: ge }), e;
  })().catch((e) => {
    throw N = null, e;
  })), N;
}
async function qt(e, t = 10) {
  if (!e || !e.trim()) return [];
  try {
    const r = (await (await Wt()).search(e)).results.slice(0, t);
    return (await Promise.all(r.map((i) => i.data()))).map((i) => ({
      url: Gt(i.url),
      title: i.meta?.title || i.url,
      excerpt: i.excerpt || "",
      source: "pagefind"
    })).filter((i) => L(i.url));
  } catch (n) {
    return console.warn("Pagefind unavailable, falling back to title search:", n), [];
  }
}
let M = null;
async function Jt() {
  return M || (M = (async () => {
    const [{ default: e }, t] = await Promise.all([import("./minisearch.js"), fetch(jt)]);
    if (!t.ok) throw new Error(`title index HTTP ${t.status}`);
    const o = (await t.json()).map((s, i) => ({ id: i, title: s.t, url: s.u })), r = new e({
      fields: ["title"],
      storeFields: ["title", "url"]
    });
    return r.addAll(o), r;
  })().catch((e) => (console.warn("Title index unavailable:", e), M = null, null))), M;
}
async function Yt(e, t = 5) {
  if (!e || !e.trim()) return [];
  const n = await Jt();
  if (!n) return [];
  const o = await w().catch(() => ({}));
  return n.search(e, { fuzzy: 0.3, prefix: !0 }).slice(0, t).map((r) => ({
    url: r.url,
    title: r.title,
    excerpt: o?.[r.url]?.description || "",
    source: "title"
  })).filter((r) => L(r.url));
}
async function Xt(e, t = 10) {
  if (!e || !e.trim()) return [];
  const [n, o] = await Promise.all([qt(e, t), Yt(e, 5)]), r = /* @__PURE__ */ new Set(), s = [];
  for (const i of [...n, ...o])
    r.has(i.url) || (r.add(i.url), s.push(i));
  return s.slice(0, t);
}
function Kt(e) {
  return e.source === "pagefind" ? e.excerpt || "" : v(e.excerpt || "");
}
function Vt(e) {
  if (!L(e.url))
    return console.warn("Invalid URL skipped in renderSearchHit:", e.url), "<div>Invalid result</div>";
  const t = T(e.url);
  return `
           <span data-url="${t}" style="cursor: pointer;">
              <b> <a href="${t}">${v(e.title)}</a></b> <span>${Kt(e)}</span>
           </span>
        `;
}
async function Zt() {
  const e = performance.now(), t = await w(), n = performance.now() - e;
  console.log(`  📊 [get_random_post] Loaded links in ${n.toFixed(0)}ms`);
  const o = Object.entries(t).map((i) => i[1]), r = _(o);
  return {
    title: r.title,
    url: r.url,
    description: r.description
  };
}
async function mn(e = 4) {
  const t = performance.now(), n = await w(), o = performance.now() - t;
  console.log(`  📊 [get_random_posts_batch] Loaded links once in ${o.toFixed(0)}ms`);
  const r = Object.entries(n).map((a) => a[1]), s = [], i = /* @__PURE__ */ new Set();
  for (; s.length < e && s.length < r.length; ) {
    const a = Math.floor(Math.random() * r.length);
    if (!i.has(a)) {
      i.add(a);
      const l = r[a];
      s.push({
        title: l.title,
        url: l.url,
        description: l.description
      });
    }
  }
  return s;
}
async function Qt(e = 4) {
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
async function en(e = 3) {
  return {
    sourceId: "random_posts",
    async getItems() {
      const t = new Array(e).join("_").split("_");
      return await Promise.all(
        t.map(async (o) => {
          try {
            return await Zt();
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
        return L(t.url) ? n("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${T(t.url)}" style="cursor: pointer;">
           <b> <a href="${T(t.url)}">${v(t.title)}</a></b>
            <span>${v(t.description)}</span>
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
async function tn(e = 4) {
  return {
    sourceId: "recent_posts",
    async getItems() {
      return await Qt(e);
    },
    getItemUrl({ item: t }) {
      return t.url;
    },
    templates: {
      item({ item: t, createElement: n }) {
        return L(t.url) ? n("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${T(t.url)}" style="cursor: pointer;">
           <b> <a href="${T(t.url)}">${v(t.title)}</a></b>
            <span>${v(t.description)}</span>
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
function nn(e, t = 10) {
  return {
    sourceId: "featured_posts",
    async getItems() {
      return await Xt(e, t);
    },
    templates: {
      item({ item: n, createElement: o }) {
        return o("div", {
          dangerouslySetInnerHTML: {
            __html: Vt(n)
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
async function fn(e, t = {}) {
  const { featuredCount: n = 10, recentCount: o = 4, randomCount: r = 3 } = t, s = Ft();
  if (!s) {
    console.error("Autocomplete is not defined");
    return;
  }
  const i = await en(r), a = await tn(o);
  function l({ query: d }) {
    return !d || d.length === 0 ? [a, i] : [nn(d, n)];
  }
  const c = e.startsWith("#") ? e : `#${e}`;
  if ($(c).length === 0) {
    console.log("No autocomplete element found", "autocomplete_id", e);
    return;
  }
  return s({
    container: c,
    placeholder: Ut,
    getSources: l,
    debug: !1,
    openOnFocus: !0,
    detachedMediaQuery: ""
  });
}
$(document).ready(() => {
  Le(A);
  const e = () => {
    typeof Mousetrap < "u" && Mousetrap.bind("s", () => t());
  }, t = () => {
    const o = $("#search-box");
    o.length > 0 && o.focus();
  };
  e(), on(), rn();
  const n = ["item1", "item2", "item3"];
  console.log("Random item:", _(n)), console.log("Shuffled items:", he([...n])), w().then((o) => {
    console.log("Links loaded, count:", Object.keys(o).length);
  }), console.log("Blog JavaScript initialized");
});
function on() {
  $("#toc-content").length > 0 && console.log("TOC initialized");
}
function rn() {
  $("#search-box").length > 0 && console.log("Search initialized");
}
export {
  fn as CreateAutoComplete,
  F as MakeBackLinkHTML,
  f as TreeNode,
  Q as add_random_prompts,
  ee as add_sunburst,
  Ht as add_sunburst_from_dom,
  x as append_randomizer_div,
  Le as defer,
  w as get_link_info,
  sn as get_random_page_url,
  Zt as get_random_post,
  mn as get_random_posts_batch,
  Qt as get_recent_posts,
  ze as initRecentAllPosts,
  cn as load_7_habits,
  pn as load_auto_sunburst,
  un as load_balance,
  ln as load_enjoy2,
  A as load_globals,
  dn as load_ig66,
  an as load_random_eulogy,
  zt as makePostPreviewHTML,
  ve as make_random_post_html,
  _ as random_from_list,
  Vt as renderSearchHit,
  Xt as searchBlog,
  he as shuffle
};
//# sourceMappingURL=index.js.map
