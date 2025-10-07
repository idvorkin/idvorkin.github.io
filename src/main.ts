// Import shared functions

import { initRecentAllPosts } from "./recent";
import { initRecentPosts } from "./recent-posts";
import {
  type IURLInfo,
  type IURLInfoMap,
  MakeBackLinkHTML,
  append_randomizer_div,
  get_link_info,
  random_from_list,
  shuffle,
} from "./shared";
// Import graph but we'll only initialize it from the graph.html page
import "./graph";
import { initDevInfo } from "./dev-info";
import { enableHeaderCopyLinks } from "./header-copy-link";
import { enableImageZoom } from "./image-zoom";
import { enableChartZoom } from "./chart-zoom";

// Type declarations for external libraries
declare global {
  interface Window {
    Mousetrap(): MousetrapStatic;
  }
}

interface MousetrapStatic {
  bind(key: string, callback: (e: Event) => void): void;
}

let tocExpand = true;

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
  /* Find page title. */
  const url = window.location.href;
  const prodPrefix = "https://idvork.in";
  // Get the current port from the URL
  const currentPort = window.location.port || "4000";
  const testPrefix = `http://localhost:${currentPort}`;
  const isProd = url.includes(prodPrefix);
  let newURL = url;
  if (isProd) {
    newURL = url.replace(prodPrefix, testPrefix);
  } else {
    // When swapping from test to prod, we need to handle any port number
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

  // Hide DropUp
  const tocDropUp = $("#id-ui-toc-dropdown");
  if (tocDropUp.length > 0) {
    tocDropUp.removeClass();
    tocDropUp.addClass("d-none");
  }
}

// <!-- Copied from hackmd-extras.js -->
function generateToc(id, showPinToc) {
  const target = $(`#${id}`);
  if (target.length === 0) {
    console.warn(`Target element #${id} not found for TOC generation`);
    return;
  }

  target.html("");

  // Check if content-holder exists
  if ($("#content-holder").length === 0) {
    console.warn("Content holder not found for TOC generation");
    return;
  }

  /* eslint-disable no-unused-vars */
  /* @ts-ignore:TS2339*/
  const toc = new window.Toc("content-holder", {
    level: 3,
    top: -1,
    class: "toc",
    ulClass: "nav",
    targetId: id,
  });
  /* eslint-enable no-unused-vars */
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

// MakeBackLinkHTML moved to shared.ts

async function AddLinksToPage(allUrls: IURLInfoMap) {
  // TODO handle redirects
  let page_path: string;
  let backlinks: string[] | undefined;
  let frontlinks: string[] | undefined;

  try {
    if (!allUrls) {
      console.log("No backlinks available");
      return;
    }

    page_path = new URL(document.URL).pathname;

    // Safe check for the URL in allUrls
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
`,
  );

  const incoming_location = link_parent_location.find("#incoming");
  const sort_descending_by_size = (a, b) => Number(allUrls[b].doc_size) - Number(allUrls[a].doc_size);

  if (backlinks) {
    for (const backlink of backlinks.sort(sort_descending_by_size)) {
      const url_info = allUrls[backlink];
      incoming_location.append(MakeBackLinkHTML(url_info));
    }
  }

  // remove front links not in
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
function make_html_summary_link(link, url_info: IURLInfo) {
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

function AddSummarysToPage(backLinks: IBacklinks) {
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

        // Check if backLinks has necessary properties
        if (!backLinks.redirects || !backLinks.url_info) {
          link.html(make_html_summary_link_error(link, "incomplete backLinks data"));
          return;
        }

        // Resolve redirect
        if (backLinks.redirects[ref] !== undefined) {
          ref = backLinks.redirects[ref];
        }

        // Look up in url info
        if (backLinks.url_info[ref] === undefined) {
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
  // Prevent multiple initialization using global flag
  const globalFlag = "__idvorkin_add_link_loader_initialized__";
  if ((window as any)[globalFlag]) {
    return;
  }
  (window as any)[globalFlag] = true;

  AddLinksToPage(await get_link_info());
  AddSummarysToPage(await get_back_links());
}

export interface IBacklinks {
  redirects: { [key: string]: string };
  url_info: IURLInfoMap;
}

let cached_back_links: IBacklinks = null;
async function get_back_links(): Promise<IBacklinks> {
  try {
    if (cached_back_links != null) {
      return cached_back_links;
    }

    const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    const isProd = url.includes(prodPrefix);

    let backlinks_url = "";
    if (isProd) {
      backlinks_url =
        "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
    } else {
      backlinks_url = "/back-links.json";
    }

    // Use a try/catch here in case $.getJSON fails
    try {
      const backlinksJson = (await $.getJSON(backlinks_url)) as IBacklinks;

      // Ensure we have the required properties
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
  // Redirect to main page for search
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

/**
 * Replaces placeholder links in the document with their corresponding list content.
 * @param listReplacements - An object mapping placeholder texts to list elements.
 */
function replacePlaceholdersWithLists(listReplacements: Record<string, Element>) {
  for (const [placeholderText, list] of Object.entries(listReplacements)) {
    // Use native DOM methods if jQuery is not available
    const placeholderLink =
      typeof $ !== "undefined" && $.fn
        ? $(`a[href=${placeholderText}]`).first()[0]
        : document.querySelector(`a[href="${placeholderText}"]`);

    if (!placeholderLink) return; // Placeholder not found, skip

    const listClone = list.cloneNode(true) as Element;
    if (listClone.children.length > 0) {
      listClone.children[0].remove(); // Remove the 'lookup id' from the list
    }
    placeholderLink.replaceWith(listClone);

    // remove the list from the document
    list.remove();
  }
}

/**
 * Builds a map of list replacements by scanning the document for specially formatted lists.
 * @returns An object where keys are placeholder texts and values are the corresponding list elements.
 */
function buildListReplacementMap(): Record<string, Element> {
  const replacements: Record<string, Element> = {};

  // Use native DOM methods if jQuery is not available
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

/**
 * Replaces list placeholders in tables with actual list content.
 * This function orchestrates the process of finding and replacing placeholders.
 */
function replaceListPlaceholdersInTables() {
  const listReplacements = buildListReplacementMap();
  replacePlaceholdersWithLists(listReplacements);
}

function load_globals() {
  // Prevent multiple initialization using global flag
  const globalFlag = "__idvorkin_load_globals_initialized__";
  if ((window as any)[globalFlag]) {
    return;
  }
  (window as any)[globalFlag] = true;

  $(add_link_loader);
  $(keyboard_shortcut_loader);

  // Replace list placeholders in tables
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

  // Initialize recent posts if the container exists
  if (document.getElementById("last-modified-posts")) {
    initRecentAllPosts();
  }

  $(() => {
    generateToc("ui-toc", true);
    generateToc("ui-toc-affix", false);
  });

  // Initialize header copy links
  enableHeaderCopyLinks();

  // Initialize image zoom functionality
  enableImageZoom();

  // Initialize chart zoom functionality
  enableChartZoom();

  // Initialize dev info display
  initDevInfo();
}

export {
  load_globals,
  get_link_info,
  shuffle,
  random_from_list,
  append_randomizer_div,
  enableHeaderCopyLinks,
  initDevInfo,
};

// Auto-initialize when the script loads
if (typeof $ !== "undefined" && $.fn && $.fn.ready) {
  $(document).ready(load_globals);
} else if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load_globals);
  } else {
    load_globals();
  }
}
