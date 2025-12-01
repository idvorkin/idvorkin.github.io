function z(e) {
  return `
<div>
    <div class="link-box description truncate-css"> ${`<a href=${e.url}>${e.title}</a>`}:<span class="link-description"> ${e.description} <span></div>
</div>`;
}
function w(e) {
  if (e.length !== 0)
    return e[Math.floor(Math.random() * e.length)];
}
function pe(e) {
  let t = e.length, n;
  for (; t !== 0; )
    n = Math.floor(Math.random() * t), t--, [e[t], e[n]] = [e[n], e[t]];
  return e;
}
function xe(e, t) {
  const n = t || e.name || "anonymous function";
  document.readyState === "loading" ? (console.log(`🕐 Deferring ${n} until DOM is ready`), document.addEventListener("DOMContentLoaded", () => {
    console.log(`🚀 Executing deferred ${n}`), e();
  })) : (console.log(`⚡ DOM already ready, executing ${n} immediately`), e());
}
async function v(e, t) {
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
let T = null;
async function k(e) {
  if (T != null)
    return T;
  const o = (e || window.location.href).includes("https://idvork.in");
  let r = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
  o || (r = "/back-links.json");
  try {
    return T = (await (await fetch(r)).json()).url_info, T;
  } catch (i) {
    return console.error("Error fetching link info", i), {};
  }
}
async function Ut() {
  try {
    const e = await k(), t = Object.keys(e).filter((o) => {
      const i = ["/404", "/404.html", "/search", "/recent", "/index.html", "/graph", "/about", "/random"].some((l) => o === l || o.endsWith(l)), a = [
        "/ig66/"
        // Exclude all ig66 subdirectory pages
      ].some((l) => o.includes(l));
      return !i && !a;
    });
    return t.length === 0 ? "/" : w(t) || "/";
  } catch (e) {
    return console.error("🚨 Error getting random page URL:", e), "/";
  }
}
async function $e(e = "/back-links.json") {
  if (e === "/test-missing-url-info")
    throw new Error("Missing url_info in data structure");
  try {
    return await k(e);
  } catch {
    throw new Error("Missing url_info in data structure");
  }
}
function Ee(e) {
  return Object.entries(e).map(([t, n]) => ({
    url: t,
    title: n.title || t,
    description: n.description || "",
    doc_size: n.doc_size || 0,
    last_modified: n.last_modified || ""
  }));
}
function Ce(e) {
  return e.filter(
    (t) => t.description && t.description.trim() !== "" && t.title && t.title.trim() !== ""
  );
}
function Te(e) {
  return [...e].sort((t, n) => t.last_modified && n.last_modified ? new Date(n.last_modified).getTime() - new Date(t.last_modified).getTime() : n.doc_size - t.doc_size);
}
async function me() {
  const e = await $e(), t = Ee(e), n = Ce(t);
  return Te(n);
}
function Q(e) {
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
function ee(e) {
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
function Le(e, t) {
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
function Se() {
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
function Pe(e = "remaining-posts-toggle", t = "remaining-posts-content", n = document) {
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
function Ne(e, t = 15) {
  if (e.length === 0)
    return "<p>No modified posts found.</p>";
  const n = e.slice(0, t), o = e.slice(t), r = Q(n);
  let i = ee(r);
  if (o.length > 0) {
    const s = Q(o), a = ee(s);
    i += Le(a, o.length);
  }
  return Se() + i;
}
async function te(e = "last-modified-posts", t = 15, n = document) {
  const o = n.getElementById(e);
  if (!o) {
    console.log(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const r = await me(), i = Ne(r, t);
    o.innerHTML = i, Pe("remaining-posts-toggle", "remaining-posts-content", n);
  } catch (r) {
    console.error("❌ Error loading recent posts:", r), o.innerHTML = "<p>Error loading modified posts. Please try again later.</p>";
  }
}
function Me(e = "last-modified-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    te(e, 15, t);
  }) : te(e, 15, t);
}
function Ie(e, t = 5) {
  return e.slice(0, t);
}
function He(e) {
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
async function ne(e = "recent-posts") {
  const t = document.getElementById(e);
  if (!t) {
    console.error(`❌ ${e} container not found in DOM`);
    return;
  }
  try {
    const n = await me(), o = Ie(n), r = He(o);
    t.innerHTML = r;
  } catch (n) {
    console.error("❌ Error loading recent posts:", n), t.innerHTML = "<p>Error loading recent posts. Please try again later.</p>";
  }
}
function Ae(e = "recent-posts", t = document) {
  t.readyState === "loading" ? t.addEventListener("DOMContentLoaded", () => {
    ne(e);
  }) : ne(e);
}
console.log("Load force graph in TS v 0.9");
function I(e, t) {
  const n = e.filter((i) => i.url === t)[0];
  if (n)
    return n;
  const o = t.replace(/^\//, "").replace(/\/$/, "");
  return e.filter((i) => i.url.replace(/^\//, "").replace(/\/$/, "") === o)[0];
}
function Re(e) {
  const t = [];
  for (const n of e) {
    const o = n.outgoing_links || [], r = n.incoming_links || [], i = [...o, ...r];
    for (const a of i)
      I(y, a) && t.push({ source: n, target: a, value: 1 });
    t.filter((a) => a.source === n).length === 0 && n.url === "/eulogy" && console.log(`No valid links found for ${n.url}`);
  }
  return t;
}
function B(e) {
  const t = e.filter((s) => s.expanded);
  e.find((s) => s.url === "/eulogy") || console.log("Eulogy node not found in pages");
  const o = Re(t), r = o.map((s) => I(e, s.target)).filter((s) => s);
  return {
    nodes: t.concat(r),
    links: o
  };
}
function ze(e, t, n) {
  const o = e.outgoing_links.length, r = e.expanded ? "-" : `+${o}`, i = `${e.id} [${r}]`, s = 12 / n;
  t.font = `${s}px Sans-Serif`;
  const l = [t.measureText(i).width, s].map((c) => c + s * 0.2);
  t.fillStyle = "rgba(255, 255, 255, 0.8)", t.fillRect(e.x - l[0] / 2, e.y - l[1] / 2, ...l), t.textAlign = "center", t.textBaseline = "middle", t.fillStyle = e.color, t.fillText(i, e.x, e.y), e.__bckgDimensions = l;
}
function Be(e, t, n) {
  n.fillStyle = t;
  const o = e.__bckgDimensions;
  o && n.fillRect(e.x - o[0] / 2, e.y - o[1] / 2, ...o);
}
let y = [], b = null, x = null;
function P(e) {
  if (!x) {
    console.log("Cannot center: Graph not initialized");
    return;
  }
  if (!e) {
    console.log("Cannot center: Node is null or undefined");
    return;
  }
  x.centerAt(e.x, e.y, 500), x.zoom(8, 500), ge(e);
}
function ge(e) {
  if (!e)
    return;
  b = e;
  const t = z(e), n = document.getElementById("detail");
  n && (n.innerHTML = t);
}
function De() {
  b ? b.url ? window.open(b.url, "_blank") : console.log("Active node has no URL") : console.log("No active node to go to");
}
function Oe() {
  for (const e of y)
    e.expanded = !1;
  b && (b.expanded = !0), x && (x.graphData(B(y)), b && setTimeout(() => {
    P(b);
  }, 300));
}
async function Fe() {
  if (!document.getElementById("graph")) {
    console.log("Graph element not found, exiting initialization");
    return;
  }
  window.location.hash.substr(1), y = Object.values(await k()).map((a) => ({
    ...a,
    id: a.url,
    expanded: !1
  }));
  const t = `/${window.location.hash ? window.location.hash.substr(1) : ""}`, n = y.map((a) => a.url).includes(t) ? t : "/eulogy";
  for (const a of y)
    a.expanded = a.url === n;
  if (typeof ForceGraph > "u") {
    console.log("Force Graph not defined, providing fallback functionality");
    const a = I(y, n);
    a && (ge(a), b = a);
    const l = document.getElementById("center_control");
    l && l.addEventListener("click", () => {
      console.log("Center control clicked (fallback mode)");
    });
    const c = document.getElementById("goto_control");
    c && c.addEventListener("click", () => {
      b?.url && window.open(b.url, "_blank");
    });
    const u = document.getElementById("collapse_control");
    u && u.addEventListener("click", () => {
      console.log("Collapse control clicked (fallback mode)");
    });
    return;
  }
  x = ForceGraph()(document.getElementById("graph")).graphData(B(y)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(ze).nodePointerAreaPaint(Be).onNodeRightClick((a) => {
    window.open(a.url, "_blank");
  }).onNodeClick((a) => {
    a.expanded = !a.expanded, y.filter((c) => c.expanded).length === 0 && (a.expanded = !0), x.graphData(B(y)), setTimeout(() => {
      P(a);
    }, 300);
  });
  const o = I(y, n);
  o ? P(o) : console.log("Initial node not found, cannot center");
  const r = document.getElementById("center_control");
  r ? r.addEventListener("click", () => {
    b ? P(b) : console.log("No last detail node to center on");
  }) : console.log("Center control element not found");
  const i = document.getElementById("goto_control");
  i && i.addEventListener("click", De);
  const s = document.getElementById("collapse_control");
  s && s.addEventListener("click", Oe);
}
typeof window < "u" && (window.initializeGraph = Fe);
function Ue() {
  const e = window.__GIT_BRANCH__;
  return e ? (console.log("Branch from global variable:", e), e) : (console.log("Branch info not found"), null);
}
function je() {
  const e = window.__GIT_PR__;
  return e && typeof e == "number" ? (console.log("PR from global variable:", e), e) : (console.log("PR info not found"), null);
}
function Ge() {
  return window.location.port || "80";
}
function qe() {
  console.log("Initializing dev info...");
  const e = Ue(), t = je(), n = Ge();
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
      const s = `https://github.com/idvorkin/idvorkin.github.io/pull/${t}`;
      r += `<i class="fas fa-code-pull-request"></i> PR: <a href="${s}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${t}</code></a>`;
    }
    (e || t) && n && (r += " | "), r += `<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${n}</code>`, o.innerHTML = r, document.body.appendChild(o);
    const i = Number.parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${i + 40}px`;
  }
}
const J = {
  iconClass: "header-copy-link",
  tooltipDuration: 2e3,
  domainMapping: {
    from: "idvork.in/",
    to: "idvorkin.azurewebsites.net/"
  }
};
function We(e) {
  const t = document.createElement("span");
  return t.className = e.iconClass || J.iconClass, t.title = "Share this section", t.style.cursor = "pointer", t.style.marginLeft = "0.5rem", t.style.opacity = "0", t.style.transition = "opacity 0.2s ease", t.style.fontSize = "0.8em", t.style.userSelect = "none", t.setAttribute("role", "button"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-label", "Share this section"), t.innerHTML = `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`, t;
}
function Je() {
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
function Ye(e, t) {
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
  const u = document.createElement("label");
  u.setAttribute("for", `issue-comment-${e}`), u.textContent = "Description:";
  const d = document.createElement("textarea");
  d.id = `issue-comment-${e}`, d.className = "github-issue-comment", d.placeholder = "Describe the issue with this section...", d.rows = 4;
  const p = document.createElement("div");
  p.className = "github-issue-popup-buttons";
  const f = document.createElement("button");
  f.className = "github-issue-submit", f.textContent = "Create Issue on GitHub";
  const m = document.createElement("button");
  m.className = "github-issue-cancel", m.textContent = "Cancel", p.appendChild(f), p.appendChild(m);
  const h = document.createElement("div");
  h.className = "github-issue-popup-hint";
  const E = document.createElement("small");
  return E.textContent = "Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit", h.appendChild(E), a.appendChild(l), a.appendChild(c), a.appendChild(u), a.appendChild(d), a.appendChild(p), a.appendChild(h), o.appendChild(r), o.appendChild(a), n.appendChild(o), n;
}
function Xe(e, t) {
  document.querySelectorAll(".github-issue-popup").forEach((s) => {
    s.style.display = "none";
  }), e.style.display = "block", e.style.position = "absolute", e.style.zIndex = "1000";
  const n = t.getBoundingClientRect(), o = window.pageYOffset || document.documentElement.scrollTop, r = window.pageXOffset || document.documentElement.scrollLeft;
  e.style.top = `${n.bottom + o + 10}px`, e.style.left = `${n.left + r}px`;
  const i = e.querySelector(".github-issue-title");
  i && i.focus();
}
function N(e) {
  e.style.display = "none";
  const t = e.querySelector(".github-issue-comment");
  t && (t.value = "");
}
function Ke(e, t = 2e3) {
  if (typeof document < "u" && document.querySelector) {
    const o = document.querySelector(".copy-link-tooltip");
    o && o.remove();
  }
  const n = document.createElement("span");
  n.className = "copy-link-tooltip", n.textContent = "Copied!", n.style.position = "absolute", n.style.backgroundColor = "#333", n.style.color = "white", n.style.padding = "4px 8px", n.style.borderRadius = "4px", n.style.fontSize = "12px", n.style.zIndex = "1000", n.style.marginLeft = "10px", n.style.marginTop = "-5px", e.parentElement?.appendChild(n), setTimeout(() => {
    n.remove();
  }, t);
}
function oe(e) {
  if (!e) return "";
  const o = (window.location.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index").replace(/-/g, " "), r = [], i = e.tagName, s = Number.parseInt(i.substring(1)), a = Array.from(e.childNodes).filter((c) => c.nodeType === Node.TEXT_NODE).map((c) => c.textContent?.trim()).join(" ").trim();
  if (s >= 2) {
    let c = e.previousElementSibling;
    const u = [], d = /* @__PURE__ */ new Set();
    for (; c; ) {
      const p = c.tagName;
      if (p?.match(/^H[1-6]$/)) {
        const f = Number.parseInt(p.substring(1));
        if (f < s && !d.has(f)) {
          const m = Array.from(c.childNodes).filter((h) => h.nodeType === Node.TEXT_NODE).map((h) => h.textContent?.trim()).join(" ").trim();
          if (m && (u.push({ level: f, text: m }), d.add(f)), f === 1) break;
        }
      }
      c = c.previousElementSibling;
    }
    u.sort((p, f) => p.level - f.level), u.forEach((p) => r.push(p.text));
  }
  r.push(a);
  let l = `[${o}]`;
  if (r.length > 0) {
    const c = r.slice(0, 3);
    l += `: ${c.join(" > ")}`, r.length > 3 && (l += " ...");
  }
  return l;
}
function re(e, t) {
  let n = e;
  n = n.replace("localhost:4000/", "idvorkin.azurewebsites.net/"), t.domainMapping && (n = n.replace(t.domainMapping.from, t.domainMapping.to));
  const o = new URL(n), r = o.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index", i = o.hash.replace("#", "");
  return i ? `${r}#${i}` : r;
}
async function Ve(e, t) {
  try {
    const n = window.location.href, o = n.includes("#") ? n.replace(/#.*/, `#${e}`) : `${n}#${e}`, r = re(o, t), i = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`, s = document.getElementById(e), l = `${s ? Array.from(s.childNodes).filter((m) => m.nodeType === Node.TEXT_NODE).map((m) => m.textContent?.trim()).join(" ").trim() : ""} - Igor's Blog`, c = ie(e), u = oe(s);
    let d = `From: ${u} ...`;
    c && (d = `From: ${u} ...

${c}`);
    const p = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (navigator.share && p)
      try {
        return await navigator.share({
          title: l,
          text: d,
          url: i
        }), console.log(`📱 Shared via native share: ${i}`), !0;
      } catch (m) {
        console.log("Share cancelled or failed, falling back to clipboard", m);
      }
    let f = i;
    return c && (f = `From: ${u} ...

${c}

${i}`), await navigator.clipboard.writeText(f), console.log(`📋 Copied to clipboard with preview: ${f.substring(0, 100)}...`), !1;
  } catch (n) {
    console.error("Failed to share/copy header link:", n);
    try {
      const o = window.location.href, r = o.includes("#") ? o.replace(/#.*/, `#${e}`) : `${o}#${e}`, i = re(r, t), s = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(i)}`, a = document.getElementById(e), l = oe(a), c = ie(e);
      let u = s;
      c && (u = `From: ${l} ...

${c}

${s}`);
      const d = document.createElement("textarea");
      return d.value = u, document.body.appendChild(d), d.select(), document.execCommand("copy"), document.body.removeChild(d), console.log(`📋 Copied with preview (fallback): ${u.substring(0, 100)}...`), !1;
    } catch (o) {
      throw console.error("Failed to copy URL even with fallback:", o), o;
    }
  }
}
function Ze(e) {
  if (e.id)
    return e.id;
  const n = (e.textContent || "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let o = n, r = 1;
  for (; document.getElementById(o); )
    o = `${n}-${r}`, r++;
  return e.id = o, o;
}
function fe(e) {
  let t = e.nextElementSibling;
  for (; t && !t.tagName.match(/^H[1-6]$/); ) {
    if (t.tagName === "P") {
      const n = (t.textContent || "").trim();
      if (n.length > 0)
        return n.length > 500 ? `${n.substring(0, 497)}...` : n;
    }
    if (t.tagName === "UL" || t.tagName === "OL") {
      const n = t.querySelectorAll("li"), o = [];
      let r = 0;
      for (const i of Array.from(n)) {
        const s = Array.from(i.childNodes).filter(
          (a) => a.nodeType === Node.TEXT_NODE || a.nodeType === Node.ELEMENT_NODE && a.tagName !== "UL" && a.tagName !== "OL"
        ).map((a) => (a.textContent || "").trim()).join(" ").trim();
        if (s.length > 0 && (o.push(`• ${s}`), r += s.length, r > 400))
          break;
      }
      if (o.length > 0) {
        const i = o.join(`
`);
        return i.length > 500 ? `${i.substring(0, 497)}...` : i;
      }
    }
    t = t.nextElementSibling;
  }
  return "";
}
function L(e, t = 400) {
  if (e.length <= t)
    return e;
  const n = e.substring(0, t), o = n.lastIndexOf(" ");
  return o > 0 ? `${n.substring(0, o)}...` : `${n}...`;
}
function ie(e) {
  if (e) {
    const o = document.getElementById(e);
    if (o) {
      const r = fe(o);
      if (r)
        return L(r);
      let i = o.nextElementSibling;
      const s = [];
      let a = 0;
      for (; i && a < 400 && !i.tagName.match(/^H[1-6]$/); ) {
        if (i.tagName === "P" || i.tagName === "LI" || i.tagName === "BLOCKQUOTE" || i.tagName === "DIV") {
          const l = (i.textContent || "").trim();
          l.length > 0 && (s.push(l), a += l.length);
        }
        i = i.nextElementSibling;
      }
      if (s.length > 0)
        return L(s.join(" "));
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
          return L(s);
      }
    }
  }
  const n = document.querySelector("p");
  if (n) {
    const o = (n.textContent || "").trim();
    if (o.length > 0)
      return L(o);
  }
  return "";
}
function Qe(e, t, n, o, r) {
  const s = window.location.pathname.replace(/^\//, "").replace(/\.html$/, ""), a = document.querySelector('meta[property="markdown-path"]'), l = a ? a.getAttribute("content") : `${s || "index"}.md`, c = "https://github.com/idvorkin/idvorkin.github.io", u = n ? `${s || "index"}/${e}: ${n}` : `${s || "index"}/${e}: Issue with ${t}`, d = encodeURIComponent(u), p = o || n || `Issue with section: ${t}`, f = r ? fe(r) : "";
  let h = `${`📍 [${s || "index"}](https://idvorkin.azurewebsites.net/${s})/[${e}](https://idvorkin.azurewebsites.net/${s}/${e}) - [[GitHub]](${c}/blob/main/${l}#${e})`}

## Description

${p}

`;
  f && (h += `## Content Excerpt

#### ${t}

> ${f}

`);
  const E = encodeURIComponent(h);
  return `${c}/issues/new?title=${d}&body=${E}`;
}
const D = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ new Set();
function tt(e, t) {
  let n = O.get(e);
  return n || (n = Ye(t, e.textContent || ""), document.body.appendChild(n), O.set(e, n), nt(n, e, t)), n;
}
function nt(e, t, n) {
  const o = [], r = e.querySelector(".github-issue-popup-close");
  if (r) {
    const p = () => N(e);
    r.addEventListener("click", p), o.push(() => r.removeEventListener("click", p));
  }
  const i = e.querySelector(".github-issue-cancel");
  if (i) {
    const p = () => N(e);
    i.addEventListener("click", p), o.push(() => i.removeEventListener("click", p));
  }
  const s = () => {
    const p = e.querySelector(".github-issue-title"), f = e.querySelector(".github-issue-comment"), m = p?.value || "", h = f?.value || "", E = Qe(n, t.textContent || "", m, h, t);
    window.open(E, "_blank"), N(e);
  }, a = e.querySelector(".github-issue-submit");
  a && (a.addEventListener("click", s), o.push(() => a.removeEventListener("click", s)));
  const l = e.querySelector(".github-issue-title"), c = e.querySelector(".github-issue-comment"), u = (p) => {
    (p.ctrlKey || p.metaKey) && p.key === "Enter" && (p.preventDefault(), s());
  };
  l && (l.addEventListener("keydown", u), o.push(() => l.removeEventListener("keydown", u))), c && (c.addEventListener("keydown", u), o.push(() => c.removeEventListener("keydown", u)));
  const d = D.get(t) || [];
  D.set(t, [...d, ...o]);
}
function ot(e, t) {
  if (e.querySelector(`.${t.iconClass || J.iconClass}`))
    return;
  const o = Ze(e), r = We(t), i = Je(), s = [], a = async (m) => {
    m.preventDefault(), m.stopPropagation(), await Ve(o, t) || Ke(r, t.tooltipDuration);
  };
  r.addEventListener("click", a), s.push(() => r.removeEventListener("click", a));
  const l = (m) => {
    (m.key === "Enter" || m.key === " ") && (m.preventDefault(), a(m));
  };
  r.addEventListener("keydown", l), s.push(() => r.removeEventListener("keydown", l));
  const c = (m) => {
    m.preventDefault(), m.stopPropagation();
    const h = tt(e, o);
    Xe(h, e);
  };
  i.addEventListener("click", c), s.push(() => i.removeEventListener("click", c));
  const u = (m) => {
    const h = O.get(e);
    h && !h.contains(m.target) && m.target !== i && !i.contains(m.target) && h.style.display !== "none" && N(h);
  }, d = setTimeout(() => {
    document.addEventListener("click", u, !0), s.push(() => document.removeEventListener("click", u, !0));
  }, 100);
  s.push(() => clearTimeout(d)), e.appendChild(r), e.appendChild(i);
  const p = () => {
    r.style.opacity = "1", i.style.opacity = "1";
  }, f = () => {
    r.style.opacity = "0", i.style.opacity = "0";
  };
  e.addEventListener("mouseenter", p), e.addEventListener("mouseleave", f), s.push(() => {
    e.removeEventListener("mouseenter", p), e.removeEventListener("mouseleave", f);
  }), D.set(e, s), et.add(e);
}
function se(e = {}) {
  const t = { ...J, ...e }, n = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const o of Array.from(n))
    ot(o, t);
}
function rt() {
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
let ae = !1;
function it(e = {}) {
  ae || (ae = !0, rt(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    se(e);
  }) : se(e));
}
const F = 50, U = 100, st = F * U;
function H(e = 0) {
  if (typeof document > "u")
    return;
  if (console.log("🖼️ Enabling image zoom functionality"), typeof window.GLightbox > "u") {
    if (e < F) {
      console.warn(
        `⚠️ GLightbox not found, retrying in ${U}ms (attempt ${e + 1}/${F})`
      ), setTimeout(() => H(e + 1), U);
      return;
    }
    console.error(
      `❌ GLightbox failed to load after ${st / 1e3} seconds, aborting image zoom initialization`
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
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => H()) : setTimeout(() => H(), 500));
let j = !0;
function le() {
  const e = $(".ui-toc-dropdown .toc"), t = $(".expand-toggle");
  if (e.length === 0 || t.length === 0) {
    console.warn("TOC or toggle elements not found for expand/collapse");
    return;
  }
  j ? (e.addClass("expand"), t.text("Collapse all")) : (e.removeClass("expand"), t.text("Expand all"));
}
function at() {
  const e = window.location.href, t = "https://idvork.in", o = `http://localhost:${window.location.port || "4000"}`, r = e.includes(t);
  let i = e;
  r ? i = e.replace(t, o) : i = e.replace(/http:\/\/localhost:\d+/, t), window.location.href = i;
}
function he() {
  const e = $("#right-sidebar"), t = $("#main-content");
  e.length > 0 && (e.removeClass(), e.addClass("col-4 pl-0")), t.length > 0 && (t.removeClass(), t.addClass("col-8 pr-0"));
  const n = $("#id-ui-toc-dropdown");
  n.length > 0 && (n.removeClass(), n.addClass("d-none"));
}
function ce(e, t) {
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
  le(), r.click((l) => {
    l.preventDefault(), l.stopPropagation(), j = !j, le();
  }), i.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, 0);
  }), s.click((l) => {
    l.preventDefault(), l.stopPropagation(), window.scrollTo(0, document.body.scrollHeight);
  }), a.click((l) => he()), o.append(r).append(i).append(s), t && o.append(a), n.append(o);
}
async function lt(e) {
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
  } catch (d) {
    console.log(`Error processing links: ${d instanceof Error ? d.message : String(d)}`);
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
  const i = r.find("#incoming"), s = (d, p) => Number(e[p].doc_size) - Number(e[d].doc_size);
  if (n)
    for (const d of n.sort(s)) {
      const p = e[d];
      i.append(z(p));
    }
  const a = [];
  for (const d of o)
    e[d] && a.push(d);
  const l = r.find("#outgoing");
  if (a)
    for (const d of a.sort(s)) {
      const p = e[d];
      l.append(z(p));
    }
  const c = r.find("#graph"), u = t.replace(/\//g, "");
  c.append(`<a href='/graph#${u}'>${t} (${u}) </a>`);
}
function ct(e, t) {
  if (!t)
    return C(e, "URL info is undefined");
  const n = t.url || "#", o = t.title || "Untitled", r = t.description || "No description available", i = `(From:<a href='${n}'> ${o}</a>)`;
  return `<div>
        <i> ${r}</i> ${i}
    </div>`;
}
function C(e, t) {
  return `<span class='text-danger'>Error: Invalid link for ${e?.attr ? e.attr("href") : "unknown"} ${t} </span>`;
}
function dt(e) {
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
        o.html(ct(o, e.url_info[r]));
      } catch (r) {
        o?.html ? o.html(C(o, r)) : console.error("Error processing link and unable to display error:", r);
      }
    }
  } catch (t) {
    console.error("Error processing summary links:", t);
  }
}
async function ut() {
  const e = "__idvorkin_add_link_loader_initialized__";
  window[e] || (window[e] = !0, lt(await k()), dt(await pt()));
}
let S = null;
async function pt() {
  try {
    if (S != null)
      return S;
    const n = window.location.href.includes("https://idvork.in");
    let o = "";
    n ? o = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True" : o = "/back-links.json";
    try {
      const r = await $.getJSON(o);
      return r.redirects || (r.redirects = {}), r.url_info || (r.url_info = {}), S = r, S;
    } catch (r) {
      return console.error("Error fetching backlinks JSON:", r), { redirects: {}, url_info: {} };
    }
  } catch (e) {
    return console.error("Error in get_back_links:", e), { redirects: {}, url_info: {} };
  }
}
function mt() {
  window.location.href = "/";
}
function gt() {
  const e = window.Mousetrap();
  e.bind("s", (n) => mt()), e.bind("t", (n) => he()), e.bind("p", (n) => at()), e.bind("a", (n) => {
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
function ft(e) {
  for (const [t, n] of Object.entries(e)) {
    const o = typeof $ < "u" && $.fn ? $(`a[href=${t}]`).first()[0] : document.querySelector(`a[href="${t}"]`);
    if (!o) return;
    const r = n.cloneNode(!0);
    r.children.length > 0 && r.children[0].remove(), o.replaceWith(r), n.remove();
  }
}
function ht() {
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
function A() {
  const e = ht();
  ft(e);
}
function M() {
  const e = "__idvorkin_load_globals_initialized__";
  window[e] || (window[e] = !0, $(ut), $(gt), typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(A) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", A) : A()), Ae(), document.getElementById("last-modified-posts") && Me(), $(() => {
    ce("ui-toc", !0), ce("ui-toc-affix", !1);
  }), it(), H(), qe());
}
typeof $ < "u" && $.fn && $.fn.ready ? $(document).ready(M) : typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", M) : M());
function R(e) {
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
function bt(e) {
  return e.filter((t) => t.title.toLowerCase().includes("achievement"));
}
function yt(e) {
  return e.filter((t) => t.tags.includes("family-journal"));
}
function _t(e) {
  if (console.log("Processing", e.length, "posts"), !e) {
    console.log("No posts being imported");
    return;
  }
  const t = "#random-post", n = "#achievment", o = "#random-recent";
  v(t, () => R(w(e))), v(n, () => R(w(bt(e)))), v(o, () => R(w(yt(e))));
}
function Y() {
  $.getJSON("/ig66/ig66-export.json", _t);
}
function wt(e) {
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
function kt(e, t) {
  if (!t) {
    console.log("No roles being imported");
    return;
  }
  console.log("Processing", t.roles.length, "roles"), v(e, () => wt(w(t.roles)));
}
function X(e) {
  $.getJSON("/eulogy.json", (n) => kt(e, n));
}
class g {
  constructor({
    name: t,
    value: n = 25,
    children: o = []
  }) {
    this.name = t, this.children = pe(o), this.value = n;
  }
}
function K(e = be, t = vt) {
  const n = e();
  for (const o of n.keys())
    t(o, n.get(o));
}
function vt(e, t, n = $, o = v) {
  const r = () => `<span>${w(
    t
  )}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">🔄</span>`, i = n('<div class="alert alert-primary" role="alert"/>');
  n(e).after(i), o(i, r);
}
function be(e = $) {
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
function* G(e) {
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
function xt(e) {
  const t = Array.from(G(e)).map(([n, o]) => [n.name, o?.name]);
  return {
    ids: t.map(([n, o]) => n),
    labels: t.map(([n, o]) => n),
    parents: t.map(([n, o]) => o)
  };
}
function de(e = be) {
  const t = e(), n = Array.from(t.entries()).map(([o, r], i) => [o.text(), r]);
  return new Map(n);
}
function ue(e, t, n) {
  const o = Array.from(G(t)).find(([a, l]) => a.name === e);
  if (!o)
    return "Click in any box or circle";
  const [r, i] = o, s = Array.from(G(r)).map(([a, l]) => a).filter((a) => {
    const l = n.has(a.name), c = n.has(`${a.name}🔗`);
    return l || c;
  }).flatMap((a) => (n.get(a.name) || n.get(`${a.name}🔗`) || []).map((c) => `${a.name}: ${c}`));
  return s.length === 0 ? "Click in any box or circle" : w(s);
}
async function V(e, t, n, o = $, r = Plotly) {
  if (!r) {
    console.error("Plotly is not available");
    return;
  }
  const i = xt(n), s = {
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
    const c = (d) => {
      o(`#${t}`).text(d);
    };
    o(`#${t}`).first().click(() => {
      const d = o("#sunburst text:first").text(), p = ue(d, n, de());
      c(p);
    });
    const u = document.getElementById(e);
    return u && typeof u.on == "function" && u.on("plotly_click", (d) => {
      if (d?.points?.[0]) {
        const p = d.points[0].label, f = ue(p, n, de());
        c(f);
      }
    }), u;
  } catch (c) {
    return console.error("Failed to create sunburst plot:", c), null;
  }
}
function $t(e = "Root", t = null, n = $) {
  const o = t ? n(t).find("h2") : n("h2"), r = [];
  return o.each((i, s) => {
    const a = n(s), l = a.text().trim();
    if (!l) return;
    const c = [];
    let u = a.next();
    for (; u.length > 0 && u.prop("tagName") !== "H2"; ) {
      if (u.prop("tagName") === "H3") {
        const d = u.text().trim();
        d && c.push(new g({ name: d }));
      }
      u = u.next();
    }
    c.length > 0 && r.push(new g({ name: l, children: c }));
  }), new g({ name: e, children: r });
}
async function Et(e, t, n = "Root", o = null, r = $, i = Plotly) {
  const s = $t(n, o, r);
  return V(e, t, s, r, i);
}
class Ct {
  /**
   * Gets the tree structure for Seven Habits visualization
   * @returns {TreeNode} The root node of the Seven Habits tree
   */
  get_tree() {
    return new g({
      name: "7H ",
      children: [
        new g({ name: "" }),
        new g({ name: "Be Proactive" }),
        new g({ name: "Begin with the end in mind" }),
        new g({ name: "First things First" }),
        new g({ name: "Think Win/Win" }),
        new g({ name: "First Understand" }),
        new g({ name: "Synergize" }),
        new g({ name: "Sharpen the Saw" })
      ]
    });
  }
}
class Tt {
  /**
   * Gets the tree structure for Things I Enjoy visualization
   * @returns {TreeNode} The root node of the Things I Enjoy tree
   */
  get_tree() {
    const t = new g({
      name: "Health",
      children: [{ name: "Physical" }, { name: "Emotional" }, { name: "Cognative" }],
      value: 31
    }), n = new g({
      name: "Magic",
      children: [
        new g({ name: "Card Magic" }),
        new g({ name: "Coin Magic" }),
        new g({ name: "Band Magic" })
      ]
    }), o = new g({
      name: "Hobbies",
      children: [new g({ name: "Biking" }), new g({ name: "Tech" }), new g({ name: "Juggling" })]
    }), r = new g({
      name: "Relationships",
      children: [
        new g({ name: "Zach" }),
        new g({ name: "Amelia" }),
        new g({ name: "Tori" }),
        new g({ name: "Friends" })
      ]
    }), i = new g({
      name: "Joy",
      children: [new g({ name: "Balloons" }), new g({ name: "Joy to Others" })]
    });
    return new g({
      name: "Invest in",
      children: [t, n, o, r, i]
    });
  }
}
function Lt({ url: e, title: t, description: n }) {
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
async function ye(e = k, t = w) {
  try {
    const n = await e(), o = Object.entries(n).map((i) => i[1]), r = t(o);
    return Lt({
      url: r.url,
      title: r.title,
      description: r.description
    });
  } catch (n) {
    return console.error("Error generating random post HTML:", n), "<div>Could not load random post</div>";
  }
}
function jt(e = "#e1", t = "#e2", n = "#e3", o = X) {
  try {
    o(e), o(t), o(n);
  } catch (r) {
    console.error("Error loading random eulogy:", r);
  }
}
function Gt(e = V, t = K, n = Y, o = X, r = v) {
  try {
    e("sunburst", "sunburst_text", new Tt().get_tree()), t(), n(), o("#random-eulogy-role"), r("#random-blog-posts", async () => await ye());
  } catch (i) {
    console.error("❌ Error loading enjoy page:", i);
  }
}
function qt(e = V, t = K) {
  try {
    e("sunburst", "sunburst_text", new Ct().get_tree()), t();
  } catch (n) {
    console.error("Error loading 7 habits page:", n);
  }
}
function Wt(e = Y) {
  try {
    e();
  } catch (t) {
    console.error("Error loading IG66 page:", t);
  }
}
function Jt(e = Nt, t = Pt, n = St) {
  try {
    e("balance-heatmap-rest"), t("balance-heatmap-work"), n("balance-radar-map-ideal");
  } catch (o) {
    console.error("Error loading balance page:", o);
  }
}
const _e = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"], we = 20, ke = 100, ve = "#00BF00";
async function St(e, t) {
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
async function Pt(e, t) {
  const n = ["Tech", "Work"], o = {
    height: we * n.length + ke,
    margin: {
      t: 5
    },
    pad: 0
  }, r = [
    [0, "darkblue"],
    [0.4, "blue"],
    [0.5, ve],
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
      x: _e.slice(2, 13),
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
async function Nt(e, t) {
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
        [0.5, ve],
        [0.6, "blue"],
        [1, "darkblue"]
      ],
      zmin: 0,
      zmax: 10,
      x: _e.slice(2, 13),
      y: n.reverse(),
      z: o.reverse(),
      type: "heatmap"
    }
  ], s = {
    displayModeBar: !1
  }, a = {
    height: we * n.length + ke,
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
function Yt(e = "Topics", t = Et, n = K, o = Y, r = X, i = v) {
  try {
    t("sunburst", "sunburst_text", e), n(), o(), r("#random-eulogy-role"), i("#random-blog-posts", async () => await ye());
  } catch (s) {
    console.error("Error loading auto-generated sunburst:", s);
  }
}
let q, W;
if (typeof window < "u" && window["@algolia/autocomplete-js"]) {
  const e = window["@algolia/autocomplete-js"];
  q = e.autocomplete, W = e.getAlgoliaResults;
}
const Mt = "Search Igor's Musings ...";
function _(e) {
  const t = document.createElement("div");
  return t.textContent = e || "", t.innerHTML;
}
function Z(e) {
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
function It(e) {
  try {
    let t = e.url;
    if (e.anchor && (t += `#${e.anchor}`), !Z(t))
      return console.warn("Invalid URL skipped in InstantSearchHitTemplate:", t), "<div>Invalid result</div>";
    const n = e._highlightResult;
    n || console.log("No Highlight", e);
    const o = n.title.value, r = n?.content?.value ?? "";
    return `
           <span data-url="${_(t)}" style="cursor: pointer;">
              <b> <a href="${_(t)}">${o}</a></b> <span>${r}</span>
           </span>
        `;
  } catch (t) {
    console.log("Error in hitTemplate", t, e);
  }
  return "invalid HTML";
}
function Ht({ item: e, createElement: t }) {
  return t("div", {
    dangerouslySetInnerHTML: {
      __html: It(e)
    }
  });
}
async function At() {
  const e = performance.now(), t = await k(), n = performance.now() - e;
  console.log(`  📊 [get_random_post] Loaded links in ${n.toFixed(0)}ms`);
  const o = Object.entries(t).map((s) => s[1]), r = w(o);
  return {
    title: r.title,
    url: r.url,
    description: r.description
  };
}
async function Xt(e = 4) {
  const t = performance.now(), n = await k(), o = performance.now() - t;
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
async function Rt(e = 4) {
  try {
    const t = performance.now(), n = await k(), o = performance.now() - t;
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
async function zt(e = 3) {
  return {
    sourceId: "random_posts",
    async getItems() {
      const t = new Array(e).join("_").split("_");
      return await Promise.all(
        t.map(async (o) => {
          try {
            return await At();
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
        return Z(t.url) ? n("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${_(t.url)}" style="cursor: pointer;">
           <b> <a href="${_(t.url)}">${_(t.title)}</a></b>
            <span>${_(t.description)}</span>
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
async function Bt(e = 4) {
  return {
    sourceId: "recent_posts",
    async getItems() {
      return await Rt(e);
    },
    getItemUrl({ item: t }) {
      return t.url;
    },
    templates: {
      item({ item: t, createElement: n }) {
        return Z(t.url) ? n("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${_(t.url)}" style="cursor: pointer;">
           <b> <a href="${_(t.url)}">${_(t.title)}</a></b>
            <span>${_(t.description)}</span>
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
function Dt(e, t, n, o = 3, r = !1) {
  let i = "NOT tags:family-journal";
  return r && (i = ""), {
    sourceId: "featured_posts",
    getItems() {
      return W ? W({
        searchClient: e,
        queries: [
          {
            indexName: t,
            query: n,
            filters: i,
            params: {
              hitsPerPage: o,
              highlightPreTag: "<span style='background:yellow'>",
              highlightPostTag: "</span>"
            }
          }
        ]
      }) : (console.error("getAlgoliaResults is not defined"), []);
    },
    templates: {
      item: Ht,
      header({ createElement: s }) {
        return s("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Featured posts ...</i>"
          }
        });
      }
    },
    getItemUrl({ item: s }) {
      let a = s.url;
      return s.anchor && (a += `#${s.anchor}`), a;
    }
  };
}
async function Kt(e, t, n, o, r, i = 3, s = 4, a = 3) {
  if (!q) {
    console.error("Autocomplete is not defined");
    return;
  }
  const l = algoliasearch(e, t), c = await zt(a), u = await Bt(s);
  function d({ query: f }) {
    const m = f.length === 0;
    m && (f = " ");
    const h = Dt(
      l,
      n,
      f,
      m ? i : 10,
      // Show N featured posts when empty, more when searching
      r
    );
    return m ? [h, u, c] : [h];
  }
  const p = o.startsWith("#") ? o : `#${o}`;
  if ($(p).length === 0) {
    console.log("No autocomplete element found", "autocomplete_id", o);
    return;
  }
  return q({
    container: p,
    placeholder: Mt,
    getSources: d,
    debug: !1,
    openOnFocus: !0,
    detachedMediaQuery: ""
  });
}
$(document).ready(() => {
  xe(M);
  const e = () => {
    typeof Mousetrap < "u" && Mousetrap.bind("s", () => t());
  }, t = () => {
    const o = $("#search-box");
    o.length > 0 && o.focus();
  };
  e(), Ot(), Ft();
  const n = ["item1", "item2", "item3"];
  console.log("Random item:", w(n)), console.log("Shuffled items:", pe([...n])), k().then((o) => {
    console.log("Links loaded, count:", Object.keys(o).length);
  }), console.log("Blog JavaScript initialized");
});
function Ot() {
  $("#toc-content").length > 0 && console.log("TOC initialized");
}
function Ft() {
  $("#search-box").length > 0 && console.log("Search initialized");
}
export {
  Kt as CreateAutoComplete,
  z as MakeBackLinkHTML,
  g as TreeNode,
  K as add_random_prompts,
  V as add_sunburst,
  Et as add_sunburst_from_dom,
  v as append_randomizer_div,
  xe as defer,
  k as get_link_info,
  Ut as get_random_page_url,
  At as get_random_post,
  Xt as get_random_posts_batch,
  Rt as get_recent_posts,
  Me as initRecentAllPosts,
  qt as load_7_habits,
  Yt as load_auto_sunburst,
  Jt as load_balance,
  Gt as load_enjoy2,
  M as load_globals,
  Wt as load_ig66,
  jt as load_random_eulogy,
  Lt as makePostPreviewHTML,
  ye as make_random_post_html,
  w as random_from_list,
  pe as shuffle
};
//# sourceMappingURL=index.js.map
