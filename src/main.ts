// Import shared functions
import {
  random_from_list,
  shuffle,
  append_randomizer_div,
  get_link_info,
  MakeBackLinkHTML,
  IURLInfo,
  IURLInfoMap,
} from "./shared";

import { initRecentPosts } from "./recent-posts";
import { initRecentAllPosts } from "./recent";
import "./graph";

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
  const testPrefix = "http://localhost:4000";
  const isProd = url.includes(prodPrefix);
  let newURL = url;
  if (isProd) {
    newURL = url.replace(prodPrefix, testPrefix);
  } else {
    newURL = url.replace(testPrefix, prodPrefix);
  }

  window.location.href = newURL;
}

function ForceShowRightSideBar() {
  let toc = $("#right-sidebar");
  let mainContent = $("#main-content");

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
  toggle.click(e => {
    e.preventDefault();
    e.stopPropagation();
    tocExpand = !tocExpand;
    checkExpandToggle();
  });
  backToTop.click(e => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0);
  });
  gotoBottom.click(e => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, document.body.scrollHeight);
  });
  forceSideBar.click(e => ForceShowRightSideBar());
  tocMenu.append(toggle).append(backToTop).append(gotoBottom);
  if (showPinToc) {
    tocMenu.append(forceSideBar);
  }
  target.append(tocMenu);
}

// MakeBackLinkHTML moved to shared.ts

async function AddLinksToPage(allUrls: IURLInfoMap) {
  // TODO handle redirects
  const page_path = new URL(document.URL).pathname;
  const backlinks = allUrls[page_path]?.incoming_links;
  const frontlinks = allUrls[page_path]?.outgoing_links;

  if (!backlinks && !frontlinks) {
    console.log(`No backlinks for the page ${page_path}`);
    return;
  }

  let link_parent_location = $("#links-to-page");
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

  let incoming_location = link_parent_location.find("#incoming");
  var sort_descending_by_size = (a, b) =>
    Number(allUrls[b].doc_size) - Number(allUrls[a].doc_size);

  if (backlinks) {
    for (var link of backlinks.sort(sort_descending_by_size)) {
      const url_info = allUrls[link];
      incoming_location.append(MakeBackLinkHTML(url_info));
    }
  }

  // remove front links not in
  let clean_front_links = [];
  for (var link of frontlinks) {
    if (allUrls[link]) {
      clean_front_links.push(link);
    }
  }

  let outgoing_location = link_parent_location.find("#outgoing");
  if (clean_front_links) {
    for (let link of clean_front_links.sort(sort_descending_by_size)) {
      const url_info = allUrls[link];
      outgoing_location.append(MakeBackLinkHTML(url_info));
    }
  }
  console.log("Added Graph");
  const graph_location = link_parent_location.find("#graph");
  const stripped_page_path = page_path.replace(/\//g, "");
  graph_location.append(
    `<a href='/graph#${stripped_page_path}'>${page_path} (${stripped_page_path}) </a>`
  );
}
function make_html_summary_link(link, url_info: IURLInfo) {
  const attribution = `(From:<a href='${url_info.url}'> ${url_info.title}</a>)`;

  return `<div>
        <i> ${url_info.description}</i> ${attribution}
    </div>`;
}

function make_html_summary_link_error(link, error) {
  return `<span class='text-danger'>Error: Invalid link for ${link.attr(
    "href"
  )} ${error} </span>`;
}

function AddSummarysToPage(backLinks: IBacklinks) {
  const summary_links = $.makeArray($(".summary-link"));
  summary_links.forEach(raw_link => {
    const link = $(raw_link);
    try {
      console.log(link.attr("href"));

      let ref = link.attr("href");

      // Resolve redirect
      if (backLinks.redirects[ref] != undefined) {
        ref = backLinks.redirects[ref];
      }
      // Look up in url info
      if (backLinks.url_info[ref] == undefined) {
        link.html(make_html_summary_link_error(link, "not found in url info"));
        return;
      }

      link.html(make_html_summary_link(link, backLinks.url_info[ref]));
    } catch (e) {
      link.html(make_html_summary_link_error(link, e));
    }
  });
}

async function add_link_loader() {
  AddLinksToPage(await get_link_info());
  AddSummarysToPage(await get_back_links());
}

export interface IBacklinks {
  redirects: { [key: string]: string };
  url_info: IURLInfoMap;
}

let cached_back_links: IBacklinks = null;
async function get_back_links(): Promise<IBacklinks> {
  if (cached_back_links != null) {
    return cached_back_links;
  }
  const url = window.location.href;
  const prodPrefix = "https://idvork.in";
  const isProd = url.includes(prodPrefix);

  var backlinks_url = "";
  if (isProd) {
    backlinks_url =
      "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
  } else {
    backlinks_url = "/back-links.json";
  }

  const backlinksJson = (await ($.getJSON(backlinks_url) as any)) as IBacklinks;
  cached_back_links = backlinksJson;
  return cached_back_links;
}

function search() {
  $("#autocomplete-search-box-button").click();
}

function keyboard_shortcut_loader() {
  const mouseTrap: any = Mousetrap();
  mouseTrap.bind("s", e => search());
  mouseTrap.bind("t", e => ForceShowRightSideBar());
  mouseTrap.bind("p", e => SwapProdAndTest());
  mouseTrap.bind("a", e => (location.href = "/all"));
  mouseTrap.bind("m", e => (location.href = "/toc"));
  mouseTrap.bind("6", e => (location.href = "/ig66"));

  let shortcutHelp = `
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
  mouseTrap.bind("?", e => alert(shortcutHelp));
}

/**
 * Replaces placeholder links in the document with their corresponding list content.
 * @param listReplacements - An object mapping placeholder texts to list elements.
 */
function replacePlaceholdersWithLists(
  listReplacements: Record<string, Element>
) {
  Object.entries(listReplacements).forEach(([placeholderText, list]) => {
    const placeholderLink = $(`a[href=${placeholderText}]`).first();
    if (!placeholderLink.length) return; // Placeholder not found, skip

    const listClone = $(list).clone();
    if (listClone.children().length > 0) {
      listClone.children().first().remove(); // Remove the 'lookup id' from the list
    }
    placeholderLink.replaceWith(listClone);

    // remove the list from the document
    $(list).remove();
  });
}

/**
 * Builds a map of list replacements by scanning the document for specially formatted lists.
 * @returns An object where keys are placeholder texts and values are the corresponding list elements.
 */
function buildListReplacementMap(): Record<string, Element> {
  const replacements: Record<string, Element> = {};
  $("ul").each((_, list) => {
    const firstListItem = list.firstElementChild;
    if (!firstListItem) return;

    const firstItemText = firstListItem.textContent;
    if (!firstItemText || !firstItemText.startsWith("l")) return;

    const listId = parseInt(firstItemText.substring(1));
    if (isNaN(listId)) return;

    replacements[firstItemText] = list;
  });
  return replacements;
}

/**
 * Replaces list placeholders in tables with actual list content.
 * This function orchestrates the process of finding and replacing placeholders.
 */
function replaceListPlaceholdersInTables() {
  console.log("🔄 Replacing List Placeholders in Tables");
  const listReplacements = buildListReplacementMap();
  replacePlaceholdersWithLists(listReplacements);
}

function load_globals() {
  $(add_link_loader);
  $(keyboard_shortcut_loader);

  // Replace list placeholders in tables
  $(document).ready(replaceListPlaceholdersInTables);

  console.log("🚀 About to call initRecentPosts from main.ts");
  initRecentPosts();
  console.log("✅ Called initRecentPosts from main.ts");

  // Initialize recent posts if the container exists
  if (document.getElementById("last-modified-posts")) {
    console.log("🚀 About to call initRecentAllPosts from main.ts");
    initRecentAllPosts();
    console.log("✅ Called initRecentAllPosts from main.ts");
  }

  $(function () {
    generateToc("ui-toc", true);
    generateToc("ui-toc-affix", false);
  });
}

export {
  load_globals,
  get_link_info,
  shuffle,
  random_from_list,
  append_randomizer_div,
};
