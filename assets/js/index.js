// src/shared.ts
function MakeBackLinkHTML(url_info) {
  const title_href = `<a href=${url_info.url}>${url_info.title}</a>`;
  const class_link = "link-box description truncate-css";
  const output = `
<div>
    <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info.description} <span></div>
</div>`;
  return output;
}
function random_from_list(list) {
  if (list.length === 0) return void 0;
  return list[Math.floor(Math.random() * list.length)];
}
function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}
function defer(fn, functionName) {
  const name = functionName || fn.name || "anonymous function";
  if (document.readyState === "loading") {
    console.log(`\u{1F550} Deferring ${name} until DOM is ready`);
    document.addEventListener("DOMContentLoaded", () => {
      console.log(`\u{1F680} Executing deferred ${name}`);
      fn();
    });
  } else {
    console.log(`\u26A1 DOM already ready, executing ${name} immediately`);
    fn();
  }
}
async function append_randomizer_div(parent_id, random_html_factory) {
  const $parent = $(parent_id);
  if ($parent.length !== 1) {
    console.log(`append_randomizer_div ${parent_id} not present`);
    return;
  }
  const html = await random_html_factory();
  const new_element = $(html);
  $parent.empty().append(new_element);
  $parent.click(async (event) => {
    if (event.target.tagName !== "A") {
      const html2 = await random_html_factory();
      const new_element2 = $(html2);
      $parent.empty().append(new_element2);
    }
  });
}
var cached_link_info = null;
async function get_link_info(url) {
  if (cached_link_info != null) {
    return cached_link_info;
  }
  const current_url = url || window.location.href;
  const prodPrefix = "https://idvork.in";
  const isProd = current_url.includes(prodPrefix);
  let backlinks_url = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
  if (!isProd) {
    backlinks_url = "/back-links.json";
  }
  try {
    const response = await fetch(backlinks_url);
    const data = await response.json();
    cached_link_info = data.url_info;
    return cached_link_info;
  } catch (e) {
    console.error("Error fetching link info", e);
    return {};
  }
}
async function get_random_page_url() {
  try {
    const linkInfo = await get_link_info();
    const urls = Object.keys(linkInfo).filter((url) => {
      const excludedPaths = ["/404", "/404.html", "/search", "/recent", "/index.html", "/graph", "/about", "/random"];
      const isExcluded = excludedPaths.some((path) => url === path || url.endsWith(path));
      const excludedPatterns = [
        "/ig66/"
        // Exclude all ig66 subdirectory pages
      ];
      const hasExcludedPattern = excludedPatterns.some((pattern) => url.includes(pattern));
      return !isExcluded && !hasExcludedPattern;
    });
    if (urls.length === 0) {
      return "/";
    }
    const randomUrl = random_from_list(urls);
    return randomUrl || "/";
  } catch (error) {
    console.error("\u{1F6A8} Error getting random page URL:", error);
    return "/";
  }
}

// src/recent-posts-shared.ts
async function fetchBacklinksData(url = "/back-links.json") {
  if (url === "/test-missing-url-info") {
    throw new Error("Missing url_info in data structure");
  }
  try {
    return await get_link_info(url);
  } catch (error) {
    throw new Error("Missing url_info in data structure");
  }
}
function convertToPages(urlInfoMap) {
  return Object.entries(urlInfoMap).map(([url, metadata]) => ({
    url,
    title: metadata.title || url,
    description: metadata.description || "",
    doc_size: metadata.doc_size || 0,
    last_modified: metadata.last_modified || ""
  }));
}
function filterRealPages(pages) {
  return pages.filter(
    (page) => page.description && page.description.trim() !== "" && page.title && page.title.trim() !== ""
  );
}
function sortPagesByDate(pages) {
  return [...pages].sort((a, b) => {
    if (a.last_modified && b.last_modified) {
      return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
    }
    return b.doc_size - a.doc_size;
  });
}
async function getProcessedPages() {
  const urlInfoMap = await fetchBacklinksData();
  const pages = convertToPages(urlInfoMap);
  const realPages = filterRealPages(pages);
  const sortedPages = sortPagesByDate(realPages);
  return sortedPages;
}

// src/recent.ts
function groupPagesByMonthYear(pages) {
  const groupedPages = {};
  for (const page of pages) {
    if (!page.last_modified) continue;
    const date = new Date(page.last_modified);
    const monthYear = `${date.toLocaleString("default", {
      month: "long"
    })} ${date.getFullYear()}`;
    if (!groupedPages[monthYear]) {
      groupedPages[monthYear] = [];
    }
    groupedPages[monthYear].push(page);
  }
  return groupedPages;
}
function generateGroupedPagesHTML(groupedPages) {
  let html = "";
  for (const [monthYear, pages] of Object.entries(groupedPages)) {
    html += `
      <h3>${monthYear}</h3>
      <ul class="last-modified-list">
        ${pages.map((page) => {
      const date = new Date(page.last_modified);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
      });
      return `
          <li>
            <span class="date-badge">${formattedDate}</span>
            <a href="${page.url}">${page.title}</a>
            <p class="description">${page.description.split("\n")[0].substring(0, 150)}${page.description.length > 150 ? "..." : ""}</p>
          </li>
        `;
    }).join("")}
      </ul>
    `;
  }
  return html;
}
function createToggleSection(remainingHtml, count) {
  return `
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u25B6</span> Remaining Modified Files (${count} more)
      </h2>
      <div id="remaining-posts-content" class="remaining-content" style="display: none;">
        ${remainingHtml}
      </div>
    </div>
  `;
}
function generateStyles() {
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
function setupToggleEventListener(toggleId = "remaining-posts-toggle", contentId = "remaining-posts-content", doc = document) {
  const toggleElement = doc.getElementById(toggleId);
  if (!toggleElement) {
    console.log(`Toggle element with ID ${toggleId} not found`);
    return;
  }
  toggleElement.addEventListener("click", function() {
    const contentElement = doc.getElementById(contentId);
    if (!contentElement) {
      console.log(`Content element with ID ${contentId} not found`);
      return;
    }
    const iconElement = this.querySelector(".toggle-icon");
    if (contentElement.style.display === "none") {
      contentElement.style.display = "block";
      iconElement?.classList.add("open");
    } else {
      contentElement.style.display = "none";
      iconElement?.classList.remove("open");
    }
  });
}
function generateRecentPostsHTML(pages, initialPostsCount = 15) {
  if (pages.length === 0) {
    return "<p>No modified posts found.</p>";
  }
  const initialPages = pages.slice(0, initialPostsCount);
  const remainingPages = pages.slice(initialPostsCount);
  const groupedPages = groupPagesByMonthYear(initialPages);
  let html = generateGroupedPagesHTML(groupedPages);
  if (remainingPages.length > 0) {
    const remainingGroupedPages = groupPagesByMonthYear(remainingPages);
    const remainingHtml = generateGroupedPagesHTML(remainingGroupedPages);
    html += createToggleSection(remainingHtml, remainingPages.length);
  }
  return generateStyles() + html;
}
async function updateRecentPosts(containerId = "last-modified-posts", initialPostsCount = 15, doc = document) {
  const recentContainer = doc.getElementById(containerId);
  if (!recentContainer) {
    console.log(`\u274C ${containerId} container not found in DOM`);
    return;
  }
  try {
    const sortedPages = await getProcessedPages();
    const html = generateRecentPostsHTML(sortedPages, initialPostsCount);
    recentContainer.innerHTML = html;
    setupToggleEventListener("remaining-posts-toggle", "remaining-posts-content", doc);
  } catch (error) {
    console.error("\u274C Error loading recent posts:", error);
    recentContainer.innerHTML = "<p>Error loading modified posts. Please try again later.</p>";
  }
}
function initRecentAllPosts(containerId = "last-modified-posts", doc = document) {
  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", () => {
      updateRecentPosts(containerId, 15, doc);
    });
  } else {
    updateRecentPosts(containerId, 15, doc);
  }
}

// src/recent-posts.ts
function getRecentPages(pages, count = 5) {
  return pages.slice(0, count);
}
function generateRecentPagesHTML(recentPages) {
  if (recentPages.length === 0) {
    return "<p>No recent posts found.</p>";
  }
  return `
    <ul>
      ${recentPages.map(
    (page) => `
        <li>
          <a href="${page.url}">${page.title}</a> - 
          ${page.description.split("\n")[0].substring(0, 100)}${page.description.length > 100 ? "..." : ""}
        </li>
      `
  ).join("")}
    </ul>
  `;
}
async function updateRecentPosts2(containerId = "recent-posts") {
  const recentPostsContainer = document.getElementById(containerId);
  if (!recentPostsContainer) {
    console.error(`\u274C ${containerId} container not found in DOM`);
    return;
  }
  try {
    const sortedPages = await getProcessedPages();
    const recentPages = getRecentPages(sortedPages);
    const html = generateRecentPagesHTML(recentPages);
    recentPostsContainer.innerHTML = html;
  } catch (error) {
    console.error("\u274C Error loading recent posts:", error);
    recentPostsContainer.innerHTML = "<p>Error loading recent posts. Please try again later.</p>";
  }
}
function initRecentPosts(containerId = "recent-posts", doc = document) {
  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", () => {
      updateRecentPosts2(containerId);
    });
  } else {
    updateRecentPosts2(containerId);
  }
}

// src/graph.ts
console.log("Load force graph in TS v 0.9");
function node_for_url(pages, url) {
  const exactMatch = pages.filter((p) => p.url === url)[0];
  if (exactMatch) {
    return exactMatch;
  }
  const normalizedUrl = url.replace(/^\//, "").replace(/\/$/, "");
  const normalizedMatch = pages.filter((p) => p.url.replace(/^\//, "").replace(/\/$/, "") === normalizedUrl)[0];
  return normalizedMatch;
}
function build_links(pages) {
  const links = [];
  for (const page of pages) {
    const outgoingLinks = page.outgoing_links || [];
    const incomingLinks = page.incoming_links || [];
    const combinedLinks = [...outgoingLinks, ...incomingLinks];
    for (const targetUrl of combinedLinks) {
      const targetNode = node_for_url(g_pages, targetUrl);
      if (targetNode) {
        links.push({ source: page, target: targetUrl, value: 1 });
      }
    }
    const pageLinks = links.filter((link) => link.source === page);
    if (pageLinks.length === 0 && page.url === "/eulogy") {
      console.log(`No valid links found for ${page.url}`);
    }
  }
  return links;
}
function build_graph_data(pages) {
  const visible_pages = pages.filter((page) => page.expanded);
  const eulogyNode = pages.find((p) => p.url === "/eulogy");
  if (!eulogyNode) {
    console.log("Eulogy node not found in pages");
  }
  const visible_links = build_links(visible_pages);
  const newly_visible_pages = visible_links.map((l) => node_for_url(pages, l.target)).filter((node) => node);
  const combined_pages = visible_pages.concat(newly_visible_pages);
  return {
    nodes: combined_pages,
    links: visible_links
  };
}
function TextLabelNodeCanvas(node, ctx, globalScale) {
  const outgoingCount = node.outgoing_links.length;
  const expandedText = node.expanded ? "-" : `+${outgoingCount}`;
  const label = `${node.id} [${expandedText}]`;
  const fontSize = 12 / globalScale;
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(label).width;
  const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = node.color;
  ctx.fillText(label, node.x, node.y);
  node.__bckgDimensions = bckgDimensions;
}
function TextLabelNodePointerAreaPaint(node, color, ctx) {
  ctx.fillStyle = color;
  const bckgDimensions = node.__bckgDimensions;
  bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
}
var g_pages = [];
var g_last_detail_node = null;
var Graph = null;
function center_on_node(node) {
  if (!Graph) {
    console.log("Cannot center: Graph not initialized");
    return;
  }
  if (!node) {
    console.log("Cannot center: Node is null or undefined");
    return;
  }
  Graph.centerAt(node.x, node.y, 500);
  Graph.zoom(8, 500);
  update_detail(node);
}
function update_detail(page) {
  if (!page) {
    return;
  }
  g_last_detail_node = page;
  const html = MakeBackLinkHTML(page);
  const detail = document.getElementById("detail");
  if (detail) {
    detail.innerHTML = html;
  }
}
function open_goto_control() {
  if (g_last_detail_node) {
    if (g_last_detail_node.url) {
      window.open(g_last_detail_node.url, "_blank");
    } else {
      console.log("Active node has no URL");
    }
  } else {
    console.log("No active node to go to");
  }
}
function collapse_all_except_active() {
  for (const p of g_pages) {
    p.expanded = false;
  }
  if (g_last_detail_node) {
    g_last_detail_node.expanded = true;
  }
  if (Graph) {
    Graph.graphData(build_graph_data(g_pages));
    if (g_last_detail_node) {
      setTimeout(() => {
        center_on_node(g_last_detail_node);
      }, 300);
    }
  }
}
async function initializeGraph() {
  const graphElement = document.getElementById("graph");
  if (!graphElement) {
    console.log("Graph element not found, exiting initialization");
    return;
  }
  const first_expanded = window.location.hash.substr(1);
  function is_initial_expanded(node) {
    if (node.url === first_expanded) {
      return true;
    }
    return false;
  }
  g_pages = Object.values(await get_link_info()).map((p) => ({
    ...p,
    id: p.url,
    expanded: false
  }));
  const slug = `/${window.location.hash ? window.location.hash.substr(1) : ""}`;
  const initial_expanded_url = g_pages.map((p) => p.url).includes(slug) ? slug : "/eulogy";
  for (const p of g_pages) {
    p.expanded = p.url === initial_expanded_url;
  }
  if (typeof ForceGraph === "undefined") {
    console.log("Force Graph not defined, providing fallback functionality");
    const initialNode2 = node_for_url(g_pages, initial_expanded_url);
    if (initialNode2) {
      update_detail(initialNode2);
      g_last_detail_node = initialNode2;
    }
    const centerControl2 = document.getElementById("center_control");
    if (centerControl2) {
      centerControl2.addEventListener("click", () => {
        console.log("Center control clicked (fallback mode)");
      });
    }
    const gotoControl2 = document.getElementById("goto_control");
    if (gotoControl2) {
      gotoControl2.addEventListener("click", () => {
        if (g_last_detail_node?.url) {
          window.open(g_last_detail_node.url, "_blank");
        }
      });
    }
    const collapseControl2 = document.getElementById("collapse_control");
    if (collapseControl2) {
      collapseControl2.addEventListener("click", () => {
        console.log("Collapse control clicked (fallback mode)");
      });
    }
    return;
  }
  Graph = ForceGraph()(document.getElementById("graph")).graphData(build_graph_data(g_pages)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(TextLabelNodeCanvas).nodePointerAreaPaint(TextLabelNodePointerAreaPaint).onNodeRightClick((node) => {
    window.open(node.url, "_blank");
  }).onNodeClick((node) => {
    node.expanded = !node.expanded;
    const expanded_nodes = g_pages.filter((p) => p.expanded).length;
    if (expanded_nodes === 0) {
      node.expanded = true;
    }
    Graph.graphData(build_graph_data(g_pages));
    setTimeout(() => {
      center_on_node(node);
    }, 300);
  });
  const initialNode = node_for_url(g_pages, initial_expanded_url);
  if (initialNode) {
    center_on_node(initialNode);
  } else {
    console.log("Initial node not found, cannot center");
  }
  const centerControl = document.getElementById("center_control");
  if (centerControl) {
    centerControl.addEventListener("click", () => {
      if (g_last_detail_node) {
        center_on_node(g_last_detail_node);
      } else {
        console.log("No last detail node to center on");
      }
    });
  } else {
    console.log("Center control element not found");
  }
  const gotoControl = document.getElementById("goto_control");
  if (gotoControl) {
    gotoControl.addEventListener("click", open_goto_control);
  }
  const collapseControl = document.getElementById("collapse_control");
  if (collapseControl) {
    collapseControl.addEventListener("click", collapse_all_except_active);
  }
}
if (typeof window !== "undefined") {
  window.initializeGraph = initializeGraph;
}

// src/dev-info.ts
function getCurrentBranch() {
  const branch = window.__GIT_BRANCH__;
  if (branch) {
    console.log("Branch from global variable:", branch);
    return branch;
  }
  console.log("Branch info not found");
  return null;
}
function isDevServer() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}
function getCurrentPort() {
  return window.location.port || "80";
}
function initDevInfo() {
  if (!isDevServer()) {
    console.log("Not on dev server, skipping dev info");
    return;
  }
  console.log("Dev server detected, initializing dev info...");
  const branch = getCurrentBranch();
  const port = getCurrentPort();
  console.log("Dev info - Branch:", branch, "Port:", port);
  if (branch && branch !== "main" || port !== "4000") {
    const devInfoElement = document.createElement("div");
    devInfoElement.id = "dev-info-banner";
    devInfoElement.style.cssText = `
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
    let infoContent = "";
    if (branch) {
      infoContent += `<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${branch}</code>`;
    }
    if (branch && port) {
      infoContent += " | ";
    }
    infoContent += `<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${port}</code>`;
    devInfoElement.innerHTML = infoContent;
    document.body.appendChild(devInfoElement);
    const currentPaddingTop = parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${currentPaddingTop + 40}px`;
  }
}

// src/header-copy-link.ts
var DEFAULT_OPTIONS = {
  iconClass: "header-copy-link",
  tooltipDuration: 2e3,
  domainMapping: {
    from: "idvork.in/",
    to: "idvorkin.azurewebsites.net/"
  }
};
function createCopyLinkIcon(options) {
  const icon = document.createElement("span");
  icon.className = options.iconClass || DEFAULT_OPTIONS.iconClass || "";
  icon.title = "Share this section";
  icon.style.cursor = "pointer";
  icon.style.marginLeft = "0.5rem";
  icon.style.opacity = "0";
  icon.style.transition = "opacity 0.2s ease";
  icon.style.fontSize = "0.8em";
  icon.style.userSelect = "none";
  icon.setAttribute("role", "button");
  icon.setAttribute("tabindex", "0");
  icon.setAttribute("aria-label", "Share this section");
  icon.innerHTML = `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`;
  return icon;
}
function createGitHubIssueIcon() {
  const icon = document.createElement("span");
  icon.className = "header-github-issue";
  icon.title = "Create GitHub issue for this section";
  icon.style.cursor = "pointer";
  icon.style.marginLeft = "0.5rem";
  icon.style.opacity = "0";
  icon.style.transition = "opacity 0.2s ease";
  icon.style.fontSize = "0.8em";
  icon.style.userSelect = "none";
  icon.setAttribute("role", "button");
  icon.setAttribute("tabindex", "0");
  icon.setAttribute("aria-label", "Create GitHub issue for this section");
  const hasFontAwesome = !!(document.querySelector('link[href*="font-awesome"]') || document.querySelector('script[src*="font-awesome"]') || document.querySelector(".fa, .fab, .fas, .far") || // Check for inline styles that might include Font Awesome
  Array.from(document.styleSheets).some((sheet) => {
    try {
      return sheet.href && sheet.href.includes("font-awesome");
    } catch (e) {
      return false;
    }
  }));
  if (hasFontAwesome) {
    const faIcon = document.createElement("i");
    faIcon.className = "fab fa-github";
    icon.appendChild(faIcon);
  } else {
    icon.textContent = "\u26A0\uFE0F";
  }
  return icon;
}
function createIssuePopup(headerId, headerText) {
  const popup = document.createElement("div");
  popup.className = "github-issue-popup";
  popup.style.display = "none";
  popup.id = `github-issue-popup-${headerId}`;
  const content = document.createElement("div");
  content.className = "github-issue-popup-content";
  const header = document.createElement("div");
  header.className = "github-issue-popup-header";
  const h4 = document.createElement("h4");
  h4.textContent = `Report Issue: ${headerText}`;
  const closeBtn = document.createElement("button");
  closeBtn.className = "github-issue-popup-close";
  closeBtn.title = "Close";
  closeBtn.textContent = "\xD7";
  header.appendChild(h4);
  header.appendChild(closeBtn);
  const body = document.createElement("div");
  body.className = "github-issue-popup-body";
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", `issue-title-${headerId}`);
  titleLabel.textContent = "Issue Title:";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = `issue-title-${headerId}`;
  titleInput.className = "github-issue-title";
  titleInput.placeholder = "Brief title for the issue";
  const descLabel = document.createElement("label");
  descLabel.setAttribute("for", `issue-comment-${headerId}`);
  descLabel.textContent = "Description:";
  const descTextarea = document.createElement("textarea");
  descTextarea.id = `issue-comment-${headerId}`;
  descTextarea.className = "github-issue-comment";
  descTextarea.placeholder = "Describe the issue with this section...";
  descTextarea.rows = 4;
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "github-issue-popup-buttons";
  const submitBtn = document.createElement("button");
  submitBtn.className = "github-issue-submit";
  submitBtn.textContent = "Create Issue on GitHub";
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "github-issue-cancel";
  cancelBtn.textContent = "Cancel";
  buttonsDiv.appendChild(submitBtn);
  buttonsDiv.appendChild(cancelBtn);
  const hintDiv = document.createElement("div");
  hintDiv.className = "github-issue-popup-hint";
  const small = document.createElement("small");
  small.textContent = "Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit";
  hintDiv.appendChild(small);
  body.appendChild(titleLabel);
  body.appendChild(titleInput);
  body.appendChild(descLabel);
  body.appendChild(descTextarea);
  body.appendChild(buttonsDiv);
  body.appendChild(hintDiv);
  content.appendChild(header);
  content.appendChild(body);
  popup.appendChild(content);
  return popup;
}
function showIssuePopup(popup, header) {
  document.querySelectorAll(".github-issue-popup").forEach((p) => {
    p.style.display = "none";
  });
  popup.style.display = "block";
  popup.style.position = "absolute";
  popup.style.zIndex = "1000";
  const rect = header.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  popup.style.top = rect.bottom + scrollTop + 10 + "px";
  popup.style.left = rect.left + scrollLeft + "px";
  const titleInput = popup.querySelector(".github-issue-title");
  if (titleInput) {
    titleInput.focus();
  }
}
function hideIssuePopup(popup) {
  popup.style.display = "none";
  const textarea = popup.querySelector(".github-issue-comment");
  if (textarea) {
    textarea.value = "";
  }
}
function showCopiedTooltip(element, duration = 2e3) {
  if (typeof document !== "undefined" && document.querySelector) {
    const existingTooltip = document.querySelector(".copy-link-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }
  }
  const tooltip = document.createElement("span");
  tooltip.className = "copy-link-tooltip";
  tooltip.textContent = "Copied!";
  tooltip.style.position = "absolute";
  tooltip.style.backgroundColor = "#333";
  tooltip.style.color = "white";
  tooltip.style.padding = "4px 8px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "12px";
  tooltip.style.zIndex = "1000";
  tooltip.style.marginLeft = "10px";
  tooltip.style.marginTop = "-5px";
  element.parentElement?.appendChild(tooltip);
  setTimeout(() => {
    tooltip.remove();
  }, duration);
}
function buildBreadcrumbFrom(header) {
  if (!header) return "";
  const pathname = window.location.pathname;
  const pageName = pathname.replace(/^\//, "").replace(/\.html$/, "") || "index";
  const readablePageName = pageName.replace(/-/g, " ");
  const headerHierarchy = [];
  const tagName = header.tagName;
  const headerLevel = parseInt(tagName.substring(1));
  const currentHeaderText = Array.from(header.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent?.trim()).join(" ").trim();
  if (headerLevel >= 2) {
    let prevElement = header.previousElementSibling;
    const foundHeaders = [];
    const seenLevels = /* @__PURE__ */ new Set();
    while (prevElement) {
      const prevTagName = prevElement.tagName;
      if (prevTagName && prevTagName.match(/^H[1-6]$/)) {
        const prevLevel = parseInt(prevTagName.substring(1));
        if (prevLevel < headerLevel && !seenLevels.has(prevLevel)) {
          const prevHeaderText = Array.from(prevElement.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent?.trim()).join(" ").trim();
          if (prevHeaderText) {
            foundHeaders.push({ level: prevLevel, text: prevHeaderText });
            seenLevels.add(prevLevel);
          }
          if (prevLevel === 1) break;
        }
      }
      prevElement = prevElement.previousElementSibling;
    }
    foundHeaders.sort((a, b) => a.level - b.level);
    foundHeaders.forEach((h) => headerHierarchy.push(h.text));
  }
  headerHierarchy.push(currentHeaderText);
  let breadcrumb = `[${readablePageName}]`;
  if (headerHierarchy.length > 0) {
    const limitedHierarchy = headerHierarchy.slice(0, 3);
    breadcrumb += `: ${limitedHierarchy.join(" > ")}`;
    if (headerHierarchy.length > 3) {
      breadcrumb += " ...";
    }
  }
  return breadcrumb;
}
function transformUrl(url, options) {
  let transformedUrl = url;
  transformedUrl = transformedUrl.replace("localhost:4000/", "idvorkin.azurewebsites.net/");
  if (options.domainMapping) {
    transformedUrl = transformedUrl.replace(options.domainMapping.from, options.domainMapping.to);
  }
  const urlObj = new URL(transformedUrl);
  const pathname = urlObj.pathname.replace(/^\//, "").replace(/\.html$/, "") || "index";
  const anchor = urlObj.hash.replace("#", "");
  return anchor ? `${pathname}#${anchor}` : pathname;
}
async function shareOrCopyHeaderLink(headerId, options) {
  try {
    const currentUrl = window.location.href;
    const anchorUrl = currentUrl.includes("#") ? currentUrl.replace(/#.*/, `#${headerId}`) : `${currentUrl}#${headerId}`;
    const transformedUrl = transformUrl(anchorUrl, options);
    const tinyUrl = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(transformedUrl)}`;
    const header = document.getElementById(headerId);
    const headerText = header ? Array.from(header.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent?.trim()).join(" ").trim() : "";
    const shareTitle = `${headerText} - Igor's Blog`;
    const previewText = getPreviewText(headerId);
    const breadcrumbFrom = buildBreadcrumbFrom(header);
    let shareText = `From: ${breadcrumbFrom} ...`;
    if (previewText) {
      shareText = `From: ${breadcrumbFrom} ...

${previewText}`;
    }
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: tinyUrl
        });
        console.log(`\u{1F4F1} Shared via native share: ${tinyUrl}`);
        return true;
      } catch (shareError) {
        console.log("Share cancelled or failed, falling back to clipboard", shareError);
      }
    }
    let clipboardText = tinyUrl;
    if (previewText) {
      clipboardText = `From: ${breadcrumbFrom} ...

${previewText}

${tinyUrl}`;
    }
    await navigator.clipboard.writeText(clipboardText);
    console.log(`\u{1F4CB} Copied to clipboard with preview: ${clipboardText.substring(0, 100)}...`);
    return false;
  } catch (error) {
    console.error("Failed to share/copy header link:", error);
    try {
      const currentUrl = window.location.href;
      const anchorUrl = currentUrl.includes("#") ? currentUrl.replace(/#.*/, `#${headerId}`) : `${currentUrl}#${headerId}`;
      const transformedUrl = transformUrl(anchorUrl, options);
      const tinyUrl = `https://tinyurl.com/igor-blog/?path=${encodeURIComponent(transformedUrl)}`;
      const header = document.getElementById(headerId);
      const breadcrumbFrom = buildBreadcrumbFrom(header);
      const previewText = getPreviewText(headerId);
      let clipboardText = tinyUrl;
      if (previewText) {
        clipboardText = `From: ${breadcrumbFrom} ...

${previewText}

${tinyUrl}`;
      }
      const textArea = document.createElement("textarea");
      textArea.value = clipboardText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      console.log(`\u{1F4CB} Copied with preview (fallback): ${clipboardText.substring(0, 100)}...`);
      return false;
    } catch (fallbackError) {
      console.error("Failed to copy URL even with fallback:", fallbackError);
      throw fallbackError;
    }
  }
}
function getOrCreateHeaderId(header) {
  if (header.id) {
    return header.id;
  }
  const text = header.textContent || "";
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  let uniqueId = id;
  let counter = 1;
  while (document.getElementById(uniqueId)) {
    uniqueId = `${id}-${counter}`;
    counter++;
  }
  header.id = uniqueId;
  return uniqueId;
}
function getFirstParagraphAfterHeader(header) {
  let nextElement = header.nextElementSibling;
  while (nextElement) {
    if (nextElement.tagName.match(/^H[1-6]$/)) {
      break;
    }
    if (nextElement.tagName === "P") {
      const text = (nextElement.textContent || "").trim();
      if (text.length > 0) {
        return text.length > 500 ? text.substring(0, 497) + "..." : text;
      }
    }
    if (nextElement.tagName === "UL" || nextElement.tagName === "OL") {
      const listItems = nextElement.querySelectorAll("li");
      const itemTexts = [];
      let totalLength = 0;
      for (const li of Array.from(listItems)) {
        const text = Array.from(li.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE && node.tagName !== "UL" && node.tagName !== "OL").map((node) => (node.textContent || "").trim()).join(" ").trim();
        if (text.length > 0) {
          itemTexts.push(`\u2022 ${text}`);
          totalLength += text.length;
          if (totalLength > 400) break;
        }
      }
      if (itemTexts.length > 0) {
        const combinedText = itemTexts.join("\n");
        return combinedText.length > 500 ? combinedText.substring(0, 497) + "..." : combinedText;
      }
    }
    nextElement = nextElement.nextElementSibling;
  }
  return "";
}
function truncateText(text, maxLength = 400) {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }
  return truncated + "...";
}
function getPreviewText(headerId) {
  if (headerId) {
    const header = document.getElementById(headerId);
    if (header) {
      const paragraphText = getFirstParagraphAfterHeader(header);
      if (paragraphText) {
        return truncateText(paragraphText);
      }
      let nextElement = header.nextElementSibling;
      const textParts = [];
      let charCount = 0;
      while (nextElement && charCount < 400) {
        if (nextElement.tagName.match(/^H[1-6]$/)) {
          break;
        }
        if (nextElement.tagName === "P" || nextElement.tagName === "LI" || nextElement.tagName === "BLOCKQUOTE" || nextElement.tagName === "DIV") {
          const text = (nextElement.textContent || "").trim();
          if (text.length > 0) {
            textParts.push(text);
            charCount += text.length;
          }
        }
        nextElement = nextElement.nextElementSibling;
      }
      if (textParts.length > 0) {
        return truncateText(textParts.join(" "));
      }
    }
  }
  const contentSelectors = [
    "article",
    "main",
    ".content",
    ".post-content",
    ".entry-content",
    "#content-holder",
    ".content-holder"
  ];
  for (const selector of contentSelectors) {
    const contentArea = document.querySelector(selector);
    if (contentArea) {
      const firstParagraph2 = contentArea.querySelector("p");
      if (firstParagraph2) {
        const text = (firstParagraph2.textContent || "").trim();
        if (text.length > 0) {
          return truncateText(text);
        }
      }
    }
  }
  const firstParagraph = document.querySelector("p");
  if (firstParagraph) {
    const text = (firstParagraph.textContent || "").trim();
    if (text.length > 0) {
      return truncateText(text);
    }
  }
  return "";
}
function createGitHubIssueUrl(headerId, headerText, customTitle, customDescription, header) {
  const pathname = window.location.pathname;
  const pagePath = pathname.replace(/^\//, "").replace(/\.html$/, "");
  const metaTag = document.querySelector('meta[property="markdown-path"]');
  const sourceFile = metaTag ? metaTag.getAttribute("content") : `${pagePath || "index"}.md`;
  const repoUrl = "https://github.com/idvorkin/idvorkin.github.io";
  const formattedTitle = customTitle ? `${pagePath || "index"}/${headerId}: ${customTitle}` : `${pagePath || "index"}/${headerId}: Issue with ${headerText}`;
  const issueTitle = encodeURIComponent(formattedTitle);
  const description = customDescription || customTitle || `Issue with section: ${headerText}`;
  const firstParagraph = header ? getFirstParagraphAfterHeader(header) : "";
  const locationLine = `\u{1F4CD} [${pagePath || "index"}](https://idvorkin.azurewebsites.net/${pagePath})/[${headerId}](https://idvorkin.azurewebsites.net/${pagePath}/${headerId}) - [[GitHub]](${repoUrl}/blob/main/${sourceFile}#${headerId})`;
  let issueBodyContent = `${locationLine}

## Description

${description}

`;
  if (firstParagraph) {
    issueBodyContent += `## Content Excerpt

#### ${headerText}

> ${firstParagraph}

`;
  }
  const issueBody = encodeURIComponent(issueBodyContent);
  return `${repoUrl}/issues/new?title=${issueTitle}&body=${issueBody}`;
}
var headerCleanupFunctions = /* @__PURE__ */ new WeakMap();
var headerPopups = /* @__PURE__ */ new WeakMap();
var trackedHeaders = /* @__PURE__ */ new Set();
function getOrCreatePopup(header, headerId) {
  let popup = headerPopups.get(header);
  if (!popup) {
    popup = createIssuePopup(headerId, header.textContent || "");
    document.body.appendChild(popup);
    headerPopups.set(header, popup);
    setupPopupEventHandlers(popup, header, headerId);
  }
  return popup;
}
function setupPopupEventHandlers(popup, header, headerId) {
  const cleanupFunctions = [];
  const closeBtn = popup.querySelector(".github-issue-popup-close");
  if (closeBtn) {
    const closeHandler = () => hideIssuePopup(popup);
    closeBtn.addEventListener("click", closeHandler);
    cleanupFunctions.push(() => closeBtn.removeEventListener("click", closeHandler));
  }
  const cancelBtn = popup.querySelector(".github-issue-cancel");
  if (cancelBtn) {
    const cancelHandler = () => hideIssuePopup(popup);
    cancelBtn.addEventListener("click", cancelHandler);
    cleanupFunctions.push(() => cancelBtn.removeEventListener("click", cancelHandler));
  }
  const submitIssue = () => {
    const titleInput2 = popup.querySelector(".github-issue-title");
    const commentTextarea2 = popup.querySelector(".github-issue-comment");
    const customTitle = titleInput2?.value || "";
    const customDescription = commentTextarea2?.value || "";
    const issueUrl = createGitHubIssueUrl(headerId, header.textContent || "", customTitle, customDescription, header);
    window.open(issueUrl, "_blank");
    hideIssuePopup(popup);
  };
  const submitBtn = popup.querySelector(".github-issue-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitIssue);
    cleanupFunctions.push(() => submitBtn.removeEventListener("click", submitIssue));
  }
  const titleInput = popup.querySelector(".github-issue-title");
  const commentTextarea = popup.querySelector(".github-issue-comment");
  const handleKeydown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      submitIssue();
    }
  };
  if (titleInput) {
    titleInput.addEventListener("keydown", handleKeydown);
    cleanupFunctions.push(() => titleInput.removeEventListener("keydown", handleKeydown));
  }
  if (commentTextarea) {
    commentTextarea.addEventListener("keydown", handleKeydown);
    cleanupFunctions.push(() => commentTextarea.removeEventListener("keydown", handleKeydown));
  }
  const existingCleanup = headerCleanupFunctions.get(header) || [];
  headerCleanupFunctions.set(header, [...existingCleanup, ...cleanupFunctions]);
}
function addCopyLinkToHeader(header, options) {
  const existingCopyLink = header.querySelector(`.${options.iconClass || DEFAULT_OPTIONS.iconClass}`);
  if (existingCopyLink) {
    return;
  }
  const headerId = getOrCreateHeaderId(header);
  const copyIcon = createCopyLinkIcon(options);
  const githubIcon = createGitHubIssueIcon();
  const cleanupFunctions = [];
  const shareClickHandler = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasShared = await shareOrCopyHeaderLink(headerId, options);
    if (!wasShared) {
      showCopiedTooltip(copyIcon, options.tooltipDuration);
    }
  };
  copyIcon.addEventListener("click", shareClickHandler);
  cleanupFunctions.push(() => copyIcon.removeEventListener("click", shareClickHandler));
  const keyboardHandler = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      shareClickHandler(event);
    }
  };
  copyIcon.addEventListener("keydown", keyboardHandler);
  cleanupFunctions.push(() => copyIcon.removeEventListener("keydown", keyboardHandler));
  const githubClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const popup = getOrCreatePopup(header, headerId);
    showIssuePopup(popup, header);
  };
  githubIcon.addEventListener("click", githubClickHandler);
  cleanupFunctions.push(() => githubIcon.removeEventListener("click", githubClickHandler));
  const handleOutsideClick = (event) => {
    const popup = headerPopups.get(header);
    if (popup && !popup.contains(event.target) && event.target !== githubIcon && !githubIcon.contains(event.target) && popup.style.display !== "none") {
      hideIssuePopup(popup);
    }
  };
  const timeoutId = setTimeout(() => {
    document.addEventListener("click", handleOutsideClick, true);
    cleanupFunctions.push(() => document.removeEventListener("click", handleOutsideClick, true));
  }, 100);
  cleanupFunctions.push(() => clearTimeout(timeoutId));
  header.appendChild(copyIcon);
  header.appendChild(githubIcon);
  const mouseEnterHandler = () => {
    copyIcon.style.opacity = "1";
    githubIcon.style.opacity = "1";
  };
  const mouseLeaveHandler = () => {
    copyIcon.style.opacity = "0";
    githubIcon.style.opacity = "0";
  };
  header.addEventListener("mouseenter", mouseEnterHandler);
  header.addEventListener("mouseleave", mouseLeaveHandler);
  cleanupFunctions.push(() => {
    header.removeEventListener("mouseenter", mouseEnterHandler);
    header.removeEventListener("mouseleave", mouseLeaveHandler);
  });
  headerCleanupFunctions.set(header, cleanupFunctions);
  trackedHeaders.add(header);
}
function initHeaderCopyLinks(customOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  const allHeaders = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const header of Array.from(allHeaders)) {
    addCopyLinkToHeader(header, options);
  }
}
function addHeaderCopyLinkStyles() {
  const styleId = "header-copy-link-styles";
  if (document.getElementById(styleId)) {
    return;
  }
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
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
  `;
  document.head.appendChild(style);
}
var isHeaderCopyLinksInitialized = false;
function enableHeaderCopyLinks(options = {}) {
  if (isHeaderCopyLinksInitialized) {
    return;
  }
  isHeaderCopyLinksInitialized = true;
  addHeaderCopyLinkStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initHeaderCopyLinks(options);
    });
  } else {
    initHeaderCopyLinks(options);
  }
}

// src/image-zoom.ts
var MAX_RETRY_ATTEMPTS = 50;
var RETRY_DELAY_MS = 100;
var MAX_RETRY_TIME_MS = MAX_RETRY_ATTEMPTS * RETRY_DELAY_MS;
function enableImageZoom(retryCount = 0) {
  if (typeof document === "undefined") {
    return;
  }
  console.log("\u{1F5BC}\uFE0F Enabling image zoom functionality");
  if (typeof window.GLightbox === "undefined") {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      console.warn(
        `\u26A0\uFE0F GLightbox not found, retrying in ${RETRY_DELAY_MS}ms (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`
      );
      setTimeout(() => enableImageZoom(retryCount + 1), RETRY_DELAY_MS);
      return;
    }
    console.error(
      `\u274C GLightbox failed to load after ${MAX_RETRY_TIME_MS / 1e3} seconds, aborting image zoom initialization`
    );
    return;
  }
  const contentSelectors = [
    "p img",
    // Images inside paragraphs (most common in markdown)
    "li img",
    // Images inside list items
    ".container img",
    ".post-content img",
    "article img",
    ".markdown-body img",
    "main img"
  ];
  const images = document.querySelectorAll(contentSelectors.join(", "));
  console.log(`\u{1F50D} Found ${images.length} images to process`);
  let processedCount = 0;
  images.forEach((img, index) => {
    const imageElement = img;
    if (imageElement.parentElement?.tagName === "A") {
      console.log(`\u23ED\uFE0F Skipping image ${index + 1} - already wrapped`);
      return;
    }
    if (imageElement.naturalWidth > 0 && imageElement.naturalWidth < 100 && imageElement.naturalHeight < 100) {
      console.log(
        `\u23ED\uFE0F Skipping image ${index + 1} - too small (${imageElement.naturalWidth}x${imageElement.naturalHeight})`
      );
      return;
    }
    const link = document.createElement("a");
    link.href = imageElement.src;
    link.className = "glightbox";
    link.setAttribute("data-gallery", "post-images");
    if (imageElement.alt) {
      link.setAttribute("data-description", imageElement.alt);
    }
    imageElement.parentNode?.insertBefore(link, imageElement);
    link.appendChild(imageElement);
    processedCount++;
    console.log(
      `\u2705 Processed image ${index + 1}: ${imageElement.src.substring(imageElement.src.lastIndexOf("/") + 1)}`
    );
  });
  try {
    const lightbox = window.GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
    if (processedCount > 0) {
      console.log(`\u{1F389} Image zoom enabled for ${processedCount} images`);
    } else {
      console.log("\u2139\uFE0F No images needed processing, but GLightbox initialized for existing elements");
    }
  } catch (error) {
    console.error("Error initializing GLightbox:", error);
  }
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => enableImageZoom());
  } else {
    setTimeout(() => enableImageZoom(), 500);
  }
}

// src/main.ts
var tocExpand = true;
function checkExpandToggle() {
  const toc = $(".ui-toc-dropdown .toc");
  const toggle = $(".expand-toggle");
  if (toc.length === 0 || toggle.length === 0) {
    console.warn("TOC or toggle elements not found for expand/collapse");
    return;
  }
  if (!tocExpand) {
    toc.removeClass("expand");
    toggle.text("Expand all");
  } else {
    toc.addClass("expand");
    toggle.text("Collapse all");
  }
}
function SwapProdAndTest() {
  const url = window.location.href;
  const prodPrefix = "https://idvork.in";
  const currentPort = window.location.port || "4000";
  const testPrefix = `http://localhost:${currentPort}`;
  const isProd = url.includes(prodPrefix);
  let newURL = url;
  if (isProd) {
    newURL = url.replace(prodPrefix, testPrefix);
  } else {
    newURL = url.replace(/http:\/\/localhost:\d+/, prodPrefix);
  }
  window.location.href = newURL;
}
function ForceShowRightSideBar() {
  const toc = $("#right-sidebar");
  const mainContent = $("#main-content");
  if (toc.length > 0) {
    toc.removeClass();
    toc.addClass("col-4 pl-0");
  }
  if (mainContent.length > 0) {
    mainContent.removeClass();
    mainContent.addClass("col-8 pr-0");
  }
  const tocDropUp = $("#id-ui-toc-dropdown");
  if (tocDropUp.length > 0) {
    tocDropUp.removeClass();
    tocDropUp.addClass("d-none");
  }
}
function generateToc(id, showPinToc) {
  const target = $(`#${id}`);
  if (target.length === 0) {
    console.warn(`Target element #${id} not found for TOC generation`);
    return;
  }
  target.html("");
  if ($("#content-holder").length === 0) {
    console.warn("Content holder not found for TOC generation");
    return;
  }
  const toc = new window.Toc("content-holder", {
    level: 3,
    top: -1,
    class: "toc",
    ulClass: "nav",
    targetId: id
  });
  if (target.text() === "undefined") {
    target.html("");
  }
  const tocMenu = $('<div class="toc-menu"></div');
  const toggle = $('<a class="expand-toggle" href="#">Collapse all</a>');
  const backToTop = $('<a class="back-to-top" href="#">Top of page</a>');
  const gotoBottom = $('<a class="go-to-bottom" href="#">Bottom of page</a>');
  const forceSideBar = $('<a class="go-to-bottom" href="#">Pin ToC</a>');
  checkExpandToggle();
  toggle.click((e) => {
    e.preventDefault();
    e.stopPropagation();
    tocExpand = !tocExpand;
    checkExpandToggle();
  });
  backToTop.click((e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0);
  });
  gotoBottom.click((e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, document.body.scrollHeight);
  });
  forceSideBar.click((e) => ForceShowRightSideBar());
  tocMenu.append(toggle).append(backToTop).append(gotoBottom);
  if (showPinToc) {
    tocMenu.append(forceSideBar);
  }
  target.append(tocMenu);
}
async function AddLinksToPage(allUrls) {
  let page_path;
  let backlinks;
  let frontlinks;
  try {
    if (!allUrls) {
      console.log("No backlinks available");
      return;
    }
    page_path = new URL(document.URL).pathname;
    if (!allUrls[page_path]) {
      console.log(`Page ${page_path} not found in backlinks`);
      return;
    }
    backlinks = allUrls[page_path]?.incoming_links;
    frontlinks = allUrls[page_path]?.outgoing_links;
    if (!backlinks && !frontlinks) {
      console.log(`No backlinks for the page ${page_path}`);
      return;
    }
  } catch (error) {
    console.log(`Error processing links: ${error instanceof Error ? error.message : String(error)}`);
    return;
  }
  const link_parent_location = $("#links-to-page");
  if (!link_parent_location || link_parent_location.length === 0) {
    console.log("No back_link_location");
    return;
  }
  link_parent_location.append(
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
  const incoming_location = link_parent_location.find("#incoming");
  const sort_descending_by_size = (a, b) => Number(allUrls[b].doc_size) - Number(allUrls[a].doc_size);
  if (backlinks) {
    for (const backlink of backlinks.sort(sort_descending_by_size)) {
      const url_info = allUrls[backlink];
      incoming_location.append(MakeBackLinkHTML(url_info));
    }
  }
  const clean_front_links = [];
  for (const frontlink of frontlinks) {
    if (allUrls[frontlink]) {
      clean_front_links.push(frontlink);
    }
  }
  const outgoing_location = link_parent_location.find("#outgoing");
  if (clean_front_links) {
    for (const link of clean_front_links.sort(sort_descending_by_size)) {
      const url_info = allUrls[link];
      outgoing_location.append(MakeBackLinkHTML(url_info));
    }
  }
  const graph_location = link_parent_location.find("#graph");
  const stripped_page_path = page_path.replace(/\//g, "");
  graph_location.append(`<a href='/graph#${stripped_page_path}'>${page_path} (${stripped_page_path}) </a>`);
}
function make_html_summary_link(link, url_info) {
  if (!url_info) {
    return make_html_summary_link_error(link, "URL info is undefined");
  }
  const url = url_info.url || "#";
  const title = url_info.title || "Untitled";
  const description = url_info.description || "No description available";
  const attribution = `(From:<a href='${url}'> ${title}</a>)`;
  return `<div>
        <i> ${description}</i> ${attribution}
    </div>`;
}
function make_html_summary_link_error(link, error) {
  const href = link?.attr ? link.attr("href") : "unknown";
  return `<span class='text-danger'>Error: Invalid link for ${href} ${error} </span>`;
}
function AddSummarysToPage(backLinks) {
  if (!backLinks) {
    console.log("No backlinks data available");
    return;
  }
  try {
    const summary_links = $.makeArray($(".summary-link"));
    if (!summary_links || summary_links.length === 0) {
      console.log("No summary links found");
      return;
    }
    for (const raw_link of summary_links) {
      const link = $(raw_link);
      try {
        if (!link || !link.attr) {
          console.log("Invalid link element");
          return;
        }
        let ref = link.attr("href");
        if (!ref) {
          link.html(make_html_summary_link_error(link, "missing href"));
          return;
        }
        if (!backLinks.redirects || !backLinks.url_info) {
          link.html(make_html_summary_link_error(link, "incomplete backLinks data"));
          return;
        }
        if (backLinks.redirects[ref] !== void 0) {
          ref = backLinks.redirects[ref];
        }
        if (backLinks.url_info[ref] === void 0) {
          link.html(make_html_summary_link_error(link, "not found in url info"));
          return;
        }
        link.html(make_html_summary_link(link, backLinks.url_info[ref]));
      } catch (e) {
        if (link?.html) {
          link.html(make_html_summary_link_error(link, e));
        } else {
          console.error("Error processing link and unable to display error:", e);
        }
      }
    }
  } catch (error) {
    console.error("Error processing summary links:", error);
  }
}
async function add_link_loader() {
  const globalFlag = "__idvorkin_add_link_loader_initialized__";
  if (window[globalFlag]) {
    return;
  }
  window[globalFlag] = true;
  AddLinksToPage(await get_link_info());
  AddSummarysToPage(await get_back_links());
}
var cached_back_links = null;
async function get_back_links() {
  try {
    if (cached_back_links != null) {
      return cached_back_links;
    }
    const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    const isProd = url.includes(prodPrefix);
    let backlinks_url = "";
    if (isProd) {
      backlinks_url = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
    } else {
      backlinks_url = "/back-links.json";
    }
    try {
      const backlinksJson = await $.getJSON(backlinks_url);
      if (!backlinksJson.redirects) backlinksJson.redirects = {};
      if (!backlinksJson.url_info) backlinksJson.url_info = {};
      cached_back_links = backlinksJson;
      return cached_back_links;
    } catch (error) {
      console.error("Error fetching backlinks JSON:", error);
      return { redirects: {}, url_info: {} };
    }
  } catch (error) {
    console.error("Error in get_back_links:", error);
    return { redirects: {}, url_info: {} };
  }
}
function search() {
  window.location.href = "/";
}
function keyboard_shortcut_loader() {
  const mouseTrap = window.Mousetrap();
  mouseTrap.bind("s", (e) => search());
  mouseTrap.bind("t", (e) => ForceShowRightSideBar());
  mouseTrap.bind("p", (e) => SwapProdAndTest());
  mouseTrap.bind("a", (e) => {
    location.href = "/all";
  });
  mouseTrap.bind("m", (e) => {
    location.href = "/toc";
  });
  mouseTrap.bind("6", (e) => {
    location.href = "/ig66";
  });
  const shortcutHelp = `
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
  mouseTrap.bind("?", (e) => alert(shortcutHelp));
}
function replacePlaceholdersWithLists(listReplacements) {
  for (const [placeholderText, list] of Object.entries(listReplacements)) {
    const placeholderLink = typeof $ !== "undefined" && $.fn ? $(`a[href=${placeholderText}]`).first()[0] : document.querySelector(`a[href="${placeholderText}"]`);
    if (!placeholderLink) return;
    const listClone = list.cloneNode(true);
    if (listClone.children.length > 0) {
      listClone.children[0].remove();
    }
    placeholderLink.replaceWith(listClone);
    list.remove();
  }
}
function buildListReplacementMap() {
  const replacements = {};
  const lists = typeof $ !== "undefined" && $.fn ? $("ul").toArray() : Array.from(document.querySelectorAll("ul"));
  for (const list of lists) {
    const firstListItem = list.firstElementChild;
    if (!firstListItem) continue;
    const firstItemText = firstListItem.textContent;
    if (!firstItemText || !firstItemText.startsWith("l")) continue;
    const listId = Number.parseInt(firstItemText.substring(1));
    if (Number.isNaN(listId)) continue;
    replacements[firstItemText] = list;
  }
  return replacements;
}
function replaceListPlaceholdersInTables() {
  const listReplacements = buildListReplacementMap();
  replacePlaceholdersWithLists(listReplacements);
}
function load_globals() {
  const globalFlag = "__idvorkin_load_globals_initialized__";
  if (window[globalFlag]) {
    return;
  }
  window[globalFlag] = true;
  $(add_link_loader);
  $(keyboard_shortcut_loader);
  if (typeof $ !== "undefined" && $.fn && $.fn.ready) {
    $(document).ready(replaceListPlaceholdersInTables);
  } else if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", replaceListPlaceholdersInTables);
    } else {
      replaceListPlaceholdersInTables();
    }
  }
  initRecentPosts();
  if (document.getElementById("last-modified-posts")) {
    initRecentAllPosts();
  }
  $(() => {
    generateToc("ui-toc", true);
    generateToc("ui-toc-affix", false);
  });
  enableHeaderCopyLinks();
  enableImageZoom();
  initDevInfo();
}
if (typeof $ !== "undefined" && $.fn && $.fn.ready) {
  $(document).ready(load_globals);
} else if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load_globals);
  } else {
    load_globals();
  }
}

// src/blogger_import.ts
function html_for_blogpost(post) {
  const item = $("<div/>");
  const title_href = `<h4> <a href='${post.url}'}>${post.title}</a></h4>`;
  const monthNames = [
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
  item.append(title_href);
  const thumbnail_url = post.thumbnail.replace("s72-c", "s320");
  const published_date = new Date(post.published);
  const excerptDisplayText = `
    <div> ${monthNames[published_date.getMonth()]} ${published_date.getFullYear()} - ${post.excerpt}
    </div>
   `;
  if (post.thumbnail !== "") {
    console.log(post.title);
    console.log(published_date);
    item.append(
      // `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
      `
      <div style='overflow:auto'>

      <a href='${post.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${thumbnail_url}'/></a>
      ${excerptDisplayText}
      </div>`
    );
  } else {
    item.append(excerptDisplayText);
  }
  const ret = item.html();
  return ret;
}
function get_achievement_posts(imported_posts) {
  return imported_posts.filter((post) => post.title.toLowerCase().includes("achievement"));
}
function get_recent_posts(imported_posts) {
  return imported_posts.filter((post) => post.tags.includes("family-journal"));
}
function ProcessImports(posts) {
  console.log("Processing", posts.length, "posts");
  if (!posts) {
    console.log("No posts being imported");
    return;
  }
  const random_div = "#random-post";
  const achievement_div = "#achievment";
  const random_recent = "#random-recent";
  append_randomizer_div(random_div, () => html_for_blogpost(random_from_list(posts)));
  append_randomizer_div(achievement_div, () => html_for_blogpost(random_from_list(get_achievement_posts(posts))));
  append_randomizer_div(random_recent, () => html_for_blogpost(random_from_list(get_recent_posts(posts))));
}
function add_imported_blog_posts() {
  const imported_posts_url = "/ig66/ig66-export.json";
  $.getJSON(imported_posts_url, ProcessImports);
}
function html_for_role(role) {
  const role_file_name = role.title.replace(/ /g, "%20");
  const voices = ["igor", "ammon"];
  const random_voice = voices[Math.floor(Math.random() * voices.length)];
  return `
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${random_voice}/${role_file_name}.mp3" type="audio/mp3">
    </audio>
  <b>${role.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${role.summary}
  </div>
  `;
}
function ProcessEulogy(div, roles) {
  if (!roles) {
    console.log("No roles being imported");
    return;
  }
  console.log("Processing", roles.roles.length, "roles");
  append_randomizer_div(div, () => html_for_role(random_from_list(roles.roles)));
}
function add_eulogy_roles(div) {
  const imported_posts_url = "/eulogy.json";
  $.getJSON(imported_posts_url, (roles) => ProcessEulogy(div, roles));
}

// src/random-prompter.ts
var TreeNode = class {
  constructor({
    name,
    value = 25,
    children = []
  }) {
    this.name = name;
    this.children = shuffle(children);
    this.value = value;
  }
};
function add_random_prompts(categoryToPromptsProvider = category_to_prompts, renderer = render_prompt_for_category) {
  const map_category_to_prompts = categoryToPromptsProvider();
  for (const category of map_category_to_prompts.keys()) {
    renderer(category, map_category_to_prompts.get(category));
  }
}
function render_prompt_for_category(category, prompts_for_category, jQueryProvider = $, randomizerAppender = append_randomizer_div) {
  const get_random_prompt_html = () => `<span>${random_from_list(
    prompts_for_category
  )}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`;
  const new_element = jQueryProvider(`<div class="alert alert-primary" role="alert"/>`);
  jQueryProvider(category).after(new_element);
  randomizerAppender(new_element, get_random_prompt_html);
}
function category_to_prompts(jQueryProvider = $) {
  const starting_node = jQueryProvider("h3").first();
  let current_category = starting_node;
  let prompts_for_category = [];
  const map_category_to_prompts = /* @__PURE__ */ new Map();
  for (let node = starting_node; node.length !== 0; node = jQueryProvider(node).next()) {
    if (node.prop("tagName") === "H3") {
      map_category_to_prompts.set(current_category, prompts_for_category);
      current_category = node;
      prompts_for_category = [];
      continue;
    }
    if (node.prop("tagName") !== "UL") {
      continue;
    }
    prompts_for_category = Array.from(jQueryProvider(node).find("li")).map((li) => jQueryProvider(li).text());
  }
  map_category_to_prompts.set(current_category, prompts_for_category);
  return map_category_to_prompts;
}
function* breadth_first_walk(node) {
  if (!node) {
    return;
  }
  const Q = [];
  Q.push([node, null]);
  while (Q.length > 0) {
    const [current, parent] = Q.shift();
    for (const child of current.children ?? []) {
      Q.push([child, current]);
    }
    yield [current, parent];
  }
}
function tree_to_plotly_data_format(root) {
  const names_parent_names = Array.from(breadth_first_walk(root)).map(([n, p]) => [n.name, p?.name]);
  return {
    ids: names_parent_names.map(([n, p]) => n),
    labels: names_parent_names.map(([n, p]) => n),
    parents: names_parent_names.map(([n, p]) => p)
  };
}
function category_to_prompts_text(mapProvider = category_to_prompts) {
  const map = mapProvider();
  const list = Array.from(map.entries()).map(([k, v], _index) => [k.text(), v]);
  return new Map(list);
}
function random_prompt_for_label(label, tree_node, map_node_to_prompts) {
  const result = Array.from(breadth_first_walk(tree_node)).find(([current, _parent2]) => current.name === label);
  if (!result) {
    return "Click in any box or circle";
  }
  const [clicked_node, _parent] = result;
  const all_prompts = Array.from(breadth_first_walk(clicked_node)).map(([node, _parent2]) => node).filter((node) => {
    const hasWithoutEmoji = map_node_to_prompts.has(node.name);
    const hasWithEmoji = map_node_to_prompts.has(`${node.name}\u{1F517}`);
    return hasWithoutEmoji || hasWithEmoji;
  }).flatMap((node) => {
    const prompts = map_node_to_prompts.get(node.name) || map_node_to_prompts.get(`${node.name}\u{1F517}`) || [];
    return prompts.map((prompt) => `${node.name}: ${prompt}`);
  });
  if (all_prompts.length === 0) {
    return "Click in any box or circle";
  }
  return random_from_list(all_prompts);
}
async function add_sunburst(plot_element_id, random_text_div_id, root, jQueryProvider = $, plotlyProvider = Plotly) {
  if (!plotlyProvider) {
    console.error("Plotly is not available");
    return;
  }
  const sunburst_tree_flat = tree_to_plotly_data_format(root);
  const sunburst_data = {
    type: "sunburst",
    outsidetextfont: { size: 20, color: "#377eb8" },
    // leaf: {opacity: 0.4},
    hoverinfo: "none",
    marker: { line: { width: 2 } },
    maxdepth: 2,
    displayModeBar: false
  };
  Object.assign(sunburst_data, sunburst_tree_flat);
  sunburst_data.values = void 0;
  const sunburst_layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    sunburstcolorway: ["#636efa", "#ef553b", "#00cc96"]
  };
  const config = {
    displayModeBar: false
  };
  try {
    await plotlyProvider.newPlot(plot_element_id, [sunburst_data], sunburst_layout, config);
    const set_random_prompt_text = (text) => {
      jQueryProvider(`#${random_text_div_id}`).text(text);
    };
    jQueryProvider(`#${random_text_div_id}`).first().click(() => {
      const label = jQueryProvider("#sunburst text:first").text();
      const prompt = random_prompt_for_label(label, root, category_to_prompts_text());
      set_random_prompt_text(prompt);
    });
    const plotElement = document.getElementById(plot_element_id);
    if (plotElement && typeof plotElement.on === "function") {
      plotElement.on("plotly_click", (eventData) => {
        if (eventData?.points?.[0]) {
          const label = eventData.points[0].label;
          const prompt = random_prompt_for_label(label, root, category_to_prompts_text());
          set_random_prompt_text(prompt);
        }
      });
    }
    return plotElement;
  } catch (error) {
    console.error("Failed to create sunburst plot:", error);
    return null;
  }
}
function extract_tree_from_dom(rootName = "Root", containerSelector = null, jQueryProvider = $) {
  const h2Elements = containerSelector ? jQueryProvider(containerSelector).find("h2") : jQueryProvider("h2");
  const rootChildren = [];
  h2Elements.each((_index, h2Element) => {
    const h2 = jQueryProvider(h2Element);
    const h2Text = h2.text().trim();
    if (!h2Text) return;
    const h2Children = [];
    let currentElement = h2.next();
    while (currentElement.length > 0 && currentElement.prop("tagName") !== "H2") {
      if (currentElement.prop("tagName") === "H3") {
        const h3Text = currentElement.text().trim();
        if (h3Text) {
          h2Children.push(new TreeNode({ name: h3Text }));
        }
      }
      currentElement = currentElement.next();
    }
    if (h2Children.length > 0) {
      rootChildren.push(new TreeNode({ name: h2Text, children: h2Children }));
    }
  });
  return new TreeNode({ name: rootName, children: rootChildren });
}
async function add_sunburst_from_dom(plot_element_id, random_text_div_id, rootName = "Root", containerSelector = null, jQueryProvider = $, plotlyProvider = Plotly) {
  const tree = extract_tree_from_dom(rootName, containerSelector, jQueryProvider);
  return add_sunburst(plot_element_id, random_text_div_id, tree, jQueryProvider, plotlyProvider);
}

// src/page-loader.ts
var SevenHabits = class {
  /**
   * Gets the tree structure for Seven Habits visualization
   * @returns {TreeNode} The root node of the Seven Habits tree
   */
  get_tree() {
    const root = new TreeNode({
      name: "7H ",
      children: [
        new TreeNode({ name: "" }),
        new TreeNode({ name: "Be Proactive" }),
        new TreeNode({ name: "Begin with the end in mind" }),
        new TreeNode({ name: "First things First" }),
        new TreeNode({ name: "Think Win/Win" }),
        new TreeNode({ name: "First Understand" }),
        new TreeNode({ name: "Synergize" }),
        new TreeNode({ name: "Sharpen the Saw" })
      ]
    });
    return root;
  }
};
var ThingsIEnjoy = class {
  /**
   * Gets the tree structure for Things I Enjoy visualization
   * @returns {TreeNode} The root node of the Things I Enjoy tree
   */
  get_tree() {
    const health = new TreeNode({
      name: "Health",
      children: [{ name: "Physical" }, { name: "Emotional" }, { name: "Cognative" }],
      value: 31
    });
    const magic = new TreeNode({
      name: "Magic",
      children: [
        new TreeNode({ name: "Card Magic" }),
        new TreeNode({ name: "Coin Magic" }),
        new TreeNode({ name: "Band Magic" })
      ]
    });
    const hobbies = new TreeNode({
      name: "Hobbies",
      children: [new TreeNode({ name: "Biking" }), new TreeNode({ name: "Tech" }), new TreeNode({ name: "Juggling" })]
    });
    const relationships = new TreeNode({
      name: "Relationships",
      children: [
        new TreeNode({ name: "Zach" }),
        new TreeNode({ name: "Amelia" }),
        new TreeNode({ name: "Tori" }),
        new TreeNode({ name: "Friends" })
      ]
    });
    const joy = new TreeNode({
      name: "Joy",
      children: [new TreeNode({ name: "Balloons" }), new TreeNode({ name: "Joy to Others" })]
    });
    return new TreeNode({
      name: "Invest in",
      children: [health, magic, hobbies, relationships, joy]
    });
  }
};
function makePostPreviewHTML({ url, title, description }) {
  const title_href = `<a href='${url}'}>${title}</a>`;
  const id = `audio_player_${Math.floor(Math.random() * 1e10)}`;
  const filename = url.replace(/\//g, "_");
  return `
    <div>
        <audio id='${id}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${filename}.mp3" type="audio/mp3">
        </audio>
      ${title_href}:  <b><a class='lead' onclick="toggle_play_pause('${id}')">\u{1F508}</a></b> ${description}
    </div>
  `;
}
async function make_random_post_html(linkInfoProvider = get_link_info, randomSelector = random_from_list) {
  try {
    const all_url_info = await linkInfoProvider();
    const all_pages = Object.entries(all_url_info).map((e) => e[1]);
    const random_post = randomSelector(all_pages);
    return makePostPreviewHTML({
      url: random_post.url,
      title: random_post.title,
      description: random_post.description
    });
  } catch (error) {
    console.error("Error generating random post HTML:", error);
    return "<div>Could not load random post</div>";
  }
}
function load_random_eulogy(element1 = "#e1", element2 = "#e2", element3 = "#e3", eulogyLoader = add_eulogy_roles) {
  try {
    eulogyLoader(element1);
    eulogyLoader(element2);
    eulogyLoader(element3);
  } catch (error) {
    console.error("Error loading random eulogy:", error);
  }
}
function load_enjoy2(sunburstAdder = add_sunburst, promptsAdder = add_random_prompts, postsAdder = add_imported_blog_posts, eulogyAdder = add_eulogy_roles, randomizerAppender = append_randomizer_div) {
  try {
    sunburstAdder("sunburst", "sunburst_text", new ThingsIEnjoy().get_tree());
    promptsAdder();
    postsAdder();
    eulogyAdder("#random-eulogy-role");
    randomizerAppender("#random-blog-posts", async () => await make_random_post_html());
  } catch (error) {
    console.error("\u274C Error loading enjoy page:", error);
  }
}
function load_7_habits(sunburstAdder = add_sunburst, promptsAdder = add_random_prompts) {
  try {
    sunburstAdder("sunburst", "sunburst_text", new SevenHabits().get_tree());
    promptsAdder();
  } catch (error) {
    console.error("Error loading 7 habits page:", error);
  }
}
function load_ig66(postsAdder = add_imported_blog_posts) {
  try {
    postsAdder();
  } catch (error) {
    console.error("Error loading IG66 page:", error);
  }
}
function load_balance(restChartMaker = make_balance_chart_by_desired_time_rest, workChartMaker = make_balance_chart_by_work, radarMapMaker = make_radar_map) {
  try {
    restChartMaker("balance-heatmap-rest");
    workChartMaker("balance-heatmap-work");
    radarMapMaker("balance-radar-map-ideal");
  } catch (error) {
    console.error("Error loading balance page:", error);
  }
}
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var row_height = 20;
var heatmap_base = 100;
var ideal_color = "#00BF00";
async function make_radar_map(div, plotly) {
  const data = [
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
  ];
  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 10]
      }
    },
    showlegend: true
  };
  const config = {
    displayModeBar: false
  };
  if (typeof plotly !== "undefined" && plotly) {
    try {
      await plotly.newPlot(div, data, layout, config);
    } catch (error) {
      console.error("Error creating radar map:", error);
    }
  } else {
    console.warn("Plotly is not defined, skipping chart rendering");
  }
}
async function make_balance_chart_by_work(div, plotly) {
  const roles = ["Tech", "Work"];
  const layout = {
    height: row_height * roles.length + heatmap_base,
    margin: {
      t: 5
    },
    pad: 0
  };
  const color_scale = [
    [0, "darkblue"],
    [0.4, "blue"],
    [0.5, ideal_color],
    [0.6, "darkred"],
    [1, "red"]
  ];
  const gap_desire_over_time = [
    [7, 4, 7, 8, 2, 4, 2, 3, 2, 8],
    //  Tech
    [10, 7, 5, 5, 3, 5, 6, 6, 7, 5]
    //  Work
  ];
  const data = [
    {
      colorscale: color_scale,
      zmin: 0,
      zmax: 10,
      x: months.slice(2, 13),
      y: roles,
      z: gap_desire_over_time,
      type: "heatmap"
    }
  ];
  const config = {
    displayModeBar: false
  };
  if (typeof plotly !== "undefined" && plotly) {
    try {
      await plotly.newPlot(div, data, layout, config);
    } catch (error) {
      console.error("Error creating work balance chart:", error);
    }
  } else {
    console.warn("Plotly is not defined, skipping chart rendering");
  }
}
async function make_balance_chart_by_desired_time_rest(div, plotly) {
  const roles = ["Health", "Hobbies", "Family", "Magic"];
  const gap_desire_over_time = [
    // J, F, M, A, M, J, J, A, S, O, N, D
    [4, 4, 3, 4, 5, 3, 2, 2, 3, 2],
    // Health
    [4, 4, 3, 4, 5, 4, 4, 2, 4, 5],
    // Hobbies
    [2, 3, 3, 4, 1, 5, 4, 3, 2, 4],
    // Family
    [5, 5, 5, 4, 5, 5, 4, 5, 4, 5]
    //  Magic
  ];
  const color_scale = [
    [0, "red"],
    [0.4, "darkred"],
    [0.5, ideal_color],
    [0.6, "blue"],
    [1, "darkblue"]
  ];
  const data = [
    {
      colorscale: color_scale,
      zmin: 0,
      zmax: 10,
      x: months.slice(2, 13),
      y: roles.reverse(),
      z: gap_desire_over_time.reverse(),
      type: "heatmap"
    }
  ];
  const config = {
    displayModeBar: false
  };
  const layout = {
    height: row_height * roles.length + heatmap_base,
    margin: {
      t: 5
    },
    pad: 0
  };
  if (typeof plotly !== "undefined" && plotly) {
    try {
      await plotly.newPlot(div, data, layout, config);
    } catch (error) {
      console.error("Error creating rest time chart:", error);
    }
  } else {
    console.warn("Plotly is not defined, skipping chart rendering");
  }
}
function load_auto_sunburst(rootName = "Topics", sunburstAdder = add_sunburst_from_dom, promptsAdder = add_random_prompts, postsAdder = add_imported_blog_posts, eulogyAdder = add_eulogy_roles, randomizerAppender = append_randomizer_div) {
  try {
    sunburstAdder("sunburst", "sunburst_text", rootName);
    promptsAdder();
    postsAdder();
    eulogyAdder("#random-eulogy-role");
    randomizerAppender("#random-blog-posts", async () => await make_random_post_html());
  } catch (error) {
    console.error("Error loading auto-generated sunburst:", error);
  }
}

// src/search.ts
var autocomplete;
var getAlgoliaResults;
if (typeof window !== "undefined" && window["@algolia/autocomplete-js"]) {
  const algoliaAutocomplete = window["@algolia/autocomplete-js"];
  autocomplete = algoliaAutocomplete.autocomplete;
  getAlgoliaResults = algoliaAutocomplete.getAlgoliaResults;
}
var search_placeholder_text = "Search Igor's Musings ...";
function InstantSearchHitTemplate(hit) {
  try {
    let url = hit.url;
    if (hit.anchor) {
      url += `#${hit.anchor}`;
    }
    const highlighted = hit._highlightResult;
    if (!highlighted) {
      console.log("No Highlight", hit);
    }
    const title = highlighted.title.value;
    const content = highlighted?.content?.value ?? "";
    const string_rep = `
           <span onClick="window.location='${url}';">
              <b> <a href="${url}">${title}</a></b> <span>${content}</span>
           </span>
        `;
    return string_rep;
  } catch (err) {
    console.log("Error in hitTemplate", err, hit);
  }
  return "invalid HTML";
}
function AutoCompleteHitTemplate({ item, createElement }) {
  return createElement("div", {
    dangerouslySetInnerHTML: {
      __html: InstantSearchHitTemplate(item)
    }
  });
}
async function get_random_post() {
  const startTime = performance.now();
  const all_url_info = await get_link_info();
  const loadTime = performance.now() - startTime;
  console.log(`  \u{1F4CA} [get_random_post] Loaded links in ${loadTime.toFixed(0)}ms`);
  const all_pages = Object.entries(all_url_info).map((e) => e[1]);
  const random_post = random_from_list(all_pages);
  const ret = {
    title: random_post.title,
    url: random_post.url,
    description: random_post.description
  };
  return ret;
}
async function get_random_posts_batch(count = 4) {
  const startTime = performance.now();
  const all_url_info = await get_link_info();
  const loadTime = performance.now() - startTime;
  console.log(`  \u{1F4CA} [get_random_posts_batch] Loaded links once in ${loadTime.toFixed(0)}ms`);
  const all_pages = Object.entries(all_url_info).map((e) => e[1]);
  const results = [];
  const usedIndices = /* @__PURE__ */ new Set();
  while (results.length < count && results.length < all_pages.length) {
    const randomIndex = Math.floor(Math.random() * all_pages.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      const post = all_pages[randomIndex];
      results.push({
        title: post.title,
        url: post.url,
        description: post.description
      });
    }
  }
  return results;
}
async function get_recent_posts2(count = 4) {
  try {
    const startTime = performance.now();
    const all_url_info = await get_link_info();
    const loadTime = performance.now() - startTime;
    console.log(`  \u{1F4CA} [get_recent_posts] Loaded links in ${loadTime.toFixed(0)}ms`);
    const pages = Object.entries(all_url_info).map(([url, metadata]) => ({
      url,
      title: metadata.title || url,
      description: metadata.description || "",
      doc_size: metadata.doc_size || 0,
      last_modified: metadata.last_modified || ""
    }));
    const realPages = pages.filter(
      (page) => page.description && page.description.trim() !== "" && page.title && page.title.trim() !== ""
    );
    const sortedPages = realPages.sort((a, b) => {
      if (a.last_modified && b.last_modified) {
        return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
      }
      return b.doc_size - a.doc_size;
    });
    return sortedPages.slice(0, count);
  } catch (error) {
    console.error("\u274C Error loading recent posts:", error);
    return [];
  }
}
async function GetRandomSearchResults(count = 3) {
  return {
    sourceId: "random_posts",
    async getItems() {
      const sized_array = new Array(count).join("_").split("_");
      const random_posts = await Promise.all(sized_array.map(async (e) => get_random_post()));
      return random_posts;
    },
    getItemUrl({ item }) {
      const ret = item.url;
      return ret;
    },
    templates: {
      item({ item, createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span onClick="window.location='${item.url}';" >
           <b> <a href="${item.url}">${item.title}</a></b>
            <span>${item.description}</span>
            </span>
            `
          }
        });
      },
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Random posts ...</i>"
          }
        });
      }
    }
  };
}
async function GetRecentSearchResults(count = 4) {
  return {
    sourceId: "recent_posts",
    async getItems() {
      const recentPosts = await get_recent_posts2(count);
      return recentPosts;
    },
    getItemUrl({ item }) {
      const ret = item.url;
      return ret;
    },
    templates: {
      item({ item, createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span onClick="window.location='${item.url}';" >
           <b> <a href="${item.url}">${item.title}</a></b>
            <span>${item.description}</span>
            </span>
            `
          }
        });
      },
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Recent posts ...</i>"
          }
        });
      }
    }
  };
}
function GetAlgoliaResults(searchClient, index_name, query, hitsPerPage = 3, includeFamilyJournal = false) {
  let filter = "NOT tags:family-journal";
  if (includeFamilyJournal) {
    filter = "";
  }
  return {
    sourceId: "featured_posts",
    getItems() {
      if (!getAlgoliaResults) {
        console.error("getAlgoliaResults is not defined");
        return [];
      }
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: index_name,
            query,
            filters: filter,
            params: {
              hitsPerPage,
              highlightPreTag: "<span style='background:yellow'>",
              highlightPostTag: "</span>"
            }
          }
        ]
      });
    },
    templates: {
      item: AutoCompleteHitTemplate,
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Featured posts ...</i>"
          }
        });
      }
    },
    getItemUrl({ item }) {
      let url = item.url;
      if (item.anchor) {
        url += `#${item.anchor}`;
      }
      const ret = url;
      return ret;
    }
  };
}
async function CreateAutoComplete(appid, search_api_key, index_name, autocomplete_id, includeFamilyJournal, featuredCount = 3, recentCount = 4, randomCount = 3) {
  if (!autocomplete) {
    console.error("Autocomplete is not defined");
    return;
  }
  const searchClient = algoliasearch(appid, search_api_key);
  const randomSearchResults = await GetRandomSearchResults(randomCount);
  const recentSearchResults = await GetRecentSearchResults(recentCount);
  function GetSources({ query }) {
    const isEmptySearch = query.length === 0;
    if (isEmptySearch) {
      query = " ";
    }
    const featuredPosts = GetAlgoliaResults(
      searchClient,
      index_name,
      query,
      isEmptySearch ? featuredCount : 10,
      // Show N featured posts when empty, more when searching
      includeFamilyJournal
    );
    if (isEmptySearch) {
      return [featuredPosts, recentSearchResults, randomSearchResults];
    }
    return [featuredPosts];
  }
  const elementId = autocomplete_id.startsWith("#") ? autocomplete_id : `#${autocomplete_id}`;
  if ($(elementId).length === 0) {
    console.log("No autocomplete element found", "autocomplete_id", autocomplete_id);
    return;
  }
  return autocomplete({
    container: elementId,
    placeholder: search_placeholder_text,
    getSources: GetSources,
    debug: false,
    openOnFocus: true,
    detachedMediaQuery: ""
  });
}

// src/index.ts
$(document).ready(() => {
  const tocExpand2 = true;
  defer(load_globals);
  const setupKeyboardShortcuts = () => {
    if (typeof Mousetrap !== "undefined") {
      Mousetrap.bind("s", () => focusSearch());
    }
  };
  const focusSearch = () => {
    const searchInput = $("#search-box");
    if (searchInput.length > 0) {
      searchInput.focus();
    }
  };
  setupKeyboardShortcuts();
  initializeTOC();
  initializeSearch();
  const items = ["item1", "item2", "item3"];
  console.log("Random item:", random_from_list(items));
  console.log("Shuffled items:", shuffle([...items]));
  get_link_info().then((links) => {
    console.log("Links loaded, count:", Object.keys(links).length);
  });
  console.log("Blog JavaScript initialized");
});
function initializeTOC() {
  const tocElement = $("#toc-content");
  if (tocElement.length > 0) {
    console.log("TOC initialized");
  }
}
function initializeSearch() {
  const searchElement = $("#search-box");
  if (searchElement.length > 0) {
    console.log("Search initialized");
  }
}
export {
  CreateAutoComplete,
  MakeBackLinkHTML,
  TreeNode,
  add_random_prompts,
  add_sunburst,
  add_sunburst_from_dom,
  append_randomizer_div,
  defer,
  get_link_info,
  get_random_page_url,
  get_random_post,
  get_random_posts_batch,
  get_recent_posts2 as get_recent_posts,
  initRecentAllPosts,
  load_7_habits,
  load_auto_sunburst,
  load_balance,
  load_enjoy2,
  load_globals,
  load_ig66,
  load_random_eulogy,
  makePostPreviewHTML,
  make_random_post_html,
  random_from_list,
  shuffle
};
//# sourceMappingURL=index.js.map
