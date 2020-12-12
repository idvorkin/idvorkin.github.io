let tocExpand = true;

function checkExpandToggle() {
  const toc = $(".ui-toc-dropdown .toc");
  const toggle = $(".expand-toggle");
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

  window.location = newURL;
}

// <!-- Copied from hackmd-extras.js -->
function generateToc(id, showPinToc) {
  const target = $(`#${id}`);
  target.html("");
  /* eslint-disable no-unused-vars */
  var toc = new window.Toc("content-holder", {
    level: 3,
    top: -1,
    class: "toc",
    ulClass: "nav",
    targetId: id
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
  tocMenu
    .append(toggle)
    .append(backToTop)
    .append(gotoBottom);
  if (showPinToc) {
    tocMenu.append(forceSideBar);
  }
  target.append(tocMenu);

  function ForceShowRightSideBar() {
    let toc = $("#right-sidebar");
    let mainContent = $("#main-content");
    toc.removeClass();
    toc.addClass("col-4 pl-0");

    mainContent.removeClass();
    mainContent.addClass("col-8 pr-0");

    // Hide DropUp
    tocDropUp = $("#id-ui-toc-dropdown");
    tocDropUp.removeClass();
    tocDropUp.addClass("d-none");
  }
  Mousetrap.bind("s", e => (location.href = "/"));
  Mousetrap.bind("t", e => ForceShowRightSideBar());
  Mousetrap.bind("p", e => SwapProdAndTest());
  Mousetrap.bind("z", e => (location.href = "/random"));
  Mousetrap.bind("a", e => (location.href = "/all"));
  Mousetrap.bind("m", e => (location.href = "/toc"));

  let shortcutHelp = `
Keyboard Shortcuts:
  s - search
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  `;
  Mousetrap.bind("?", e => alert(shortcutHelp));
}
// NOTE: This should really be in post.md
generateToc("ui-toc", (showPinToc = true));
generateToc("ui-toc-affix", (showPinToc = false));

// Yuk: Markdown Table Syntax makes nesting lists in tables hard. Adding JS based macro
// Replacement
//  NOTE: replace [](lX) with a list where X is a number
//  List must start with *lX
//  Markdown does not seperate lists, so stick divs between them.

function JsTemplateReplace() {
  // Build a cache of replacement candidates to avoid multiple iterations over the tables
  let replaces = {};
  for (var list of $("ul")) {
    if (!list.firstElementChild) continue;
    let firstLIText = list.firstElementChild.textContent;
    if (!firstLIText.startsWith("l")) continue;
    let number = parseInt(firstLIText.substring(1));
    if (number == NaN) continue;
    replaces[firstLIText] = list;
  }

  for (var replaceText in replaces) {
    let aToReplace = _($(`a[href=${replaceText}]`)).head();
    if (!aToReplace) continue; // Non-replaced targets will be left in place
    replace = replaces[replaceText];
    replace.removeChild(replace.firstElementChild); // remove the 'lookup id' from the list
    $(aToReplace).replaceWith(replace);
  }
  window.replaces = replaces; // help debugging
}

function ProcessBackLinks(backLinks) {
  var my_path = new URL(document.URL).pathname;
  var backlinks = backLinks["backlinks"][my_path];
  if (!backlinks) {
    console.log("No backlinks for the page");
    return;
  }

  let back_link_location = $("#links-to-page");
  if (!back_link_location) {
    console.log("No back_link_location");
    return;
  }

  back_link_location.append("<div id='links-to-page-title'> <b>LINKS TO THIS NOTE</b><div>");

  for (var link of backlinks) {
    url_info = backLinks["url_info"][link];
    console.log(link);
    console.log(url_info);
    title_href =  `<a href=${url_info["url"]}>${ url_info["title"]}</a>`
    class_link=  `link-box description truncate-css`
    back_link_location.append(
      `<div> <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info["description"]} <span></div></div>`
    );
  }
}
// Support for backlinks -- woohoo!
$.getJSON(
  "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True",
  ProcessBackLinks
);

$(document).ready(JsTemplateReplace);
