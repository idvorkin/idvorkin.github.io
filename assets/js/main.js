var tocExpand = true;
function checkExpandToggle() {
  var toc = $(".ui-toc-dropdown .toc");
  var toggle = $(".expand-toggle");
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
  var url = window.location.href;
  var prodPrefix = "https://idvork.in";
  var testPrefix = "http://localhost:4000";
  var isProd = url.includes(prodPrefix);
  var newURL = url;
  if (isProd) {
    newURL = url.replace(prodPrefix, testPrefix);
  } else {
    newURL = url.replace(testPrefix, prodPrefix);
  }
  window.location = newURL;
}
function ForceShowRightSideBar() {
  var toc = $("#right-sidebar");
  var mainContent = $("#main-content");
  toc.removeClass();
  toc.addClass("col-4 pl-0");
  mainContent.removeClass();
  mainContent.addClass("col-8 pr-0");
  // Hide DropUp
  tocDropUp = $("#id-ui-toc-dropdown");
  tocDropUp.removeClass();
  tocDropUp.addClass("d-none");
}
// <!-- Copied from hackmd-extras.js -->
function generateToc(id, showPinToc) {
  var target = $("#" + id);
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
  var tocMenu = $('<div class="toc-menu"></div');
  var toggle = $('<a class="expand-toggle" href="#">Collapse all</a>');
  var backToTop = $('<a class="back-to-top" href="#">Top of page</a>');
  var gotoBottom = $('<a class="go-to-bottom" href="#">Bottom of page</a>');
  var forceSideBar = $('<a class="go-to-bottom" href="#">Pin ToC</a>');
  checkExpandToggle();
  toggle.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    tocExpand = !tocExpand;
    checkExpandToggle();
  });
  backToTop.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0);
  });
  gotoBottom.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, document.body.scrollHeight);
  });
  forceSideBar.click(function(e) {
    return ForceShowRightSideBar();
  });
  tocMenu
    .append(toggle)
    .append(backToTop)
    .append(gotoBottom);
  if (showPinToc) {
    tocMenu.append(forceSideBar);
  }
  target.append(tocMenu);
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
  var replaces = {};
  for (var _i = 0, _a = $("ul"); _i < _a.length; _i++) {
    var list = _a[_i];
    if (!list.firstElementChild) continue;
    var firstLIText = list.firstElementChild.textContent;
    if (!firstLIText.startsWith("l")) continue;
    var number = parseInt(firstLIText.substring(1));
    if (number == NaN) continue;
    replaces[firstLIText] = list;
  }
  for (var replaceText in replaces) {
    var aToReplace = _($("a[href=" + replaceText + "]")).head();
    if (!aToReplace) continue; // Non-replaced targets will be left in place
    replace = replaces[replaceText];
    replace.removeChild(replace.firstElementChild); // remove the 'lookup id' from the list
    $(aToReplace).replaceWith(replace);
  }
  window.replaces = replaces; // help debugging
}
function ProcessBackLinks(backLinks) {
  var _a;
  var my_path = new URL(document.URL).pathname;
  var backlinks =
    (_a = backLinks["url_info"][my_path]) === null || _a === void 0
      ? void 0
      : _a.incoming_links;
  if (!backlinks) {
    console.log("No backlinks for the page " + my_path);
    return;
  }
  var back_link_location = $("#links-to-page");
  if (!back_link_location) {
    console.log("No back_link_location");
    return;
  }
  back_link_location.append(
    "<div id='links-to-page-title'> <b>LINKS TO THIS NOTE</b><div>"
  );
  bl_ui = backLinks["url_info"];
  var sort_descending_by_size = function(a, b) {
    return Number(bl_ui[b].doc_size) - Number(bl_ui[a].doc_size);
  };
  for (
    var _i = 0, _b = backlinks.sort(sort_descending_by_size);
    _i < _b.length;
    _i++
  ) {
    var link = _b[_i];
    url_info = backLinks["url_info"][link];
    console.log(link);
    console.log(url_info);
    title_href =
      "<a href=" + url_info["url"] + ">" + url_info["title"] + "</a>";
    class_link = "link-box description truncate-css";
    back_link_location.append(
      '<div> <div class="' +
        class_link +
        '"> ' +
        title_href +
        ':<span class="link-description"> ' +
        url_info["description"] +
        "  <span></div></div>"
    );
  }
}
function addBackLinksLoader() {
  var url = window.location.href;
  var prodPrefix = "https://idvork.in";
  var testPrefix = "http://localhost:4000";
  var isProd = url.includes(prodPrefix);
  var backlinks_url = "";
  if (isProd) {
    backlinks_url =
      "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
  } else {
    backlinks_url = testPrefix + "/back-links.json";
  }
  $.getJSON(backlinks_url, ProcessBackLinks);
}
function render_prompt_for_category(category, prompts_for_category) {
  //print one of the prompts
  var random_prompt = _.sampleSize(prompts_for_category, 1)[0];
  // console.log(`${category}:${random_prompt}`)
  // elem = $(`<div> <span class="badge badge-pill badge-primary"> ${random_prompt}</span></div>`)[0]
  elem = $(
    '<div class="alert alert-primary" role="alert"> ' +
      random_prompt +
      "</span></div>"
  )[0];
  $(category).after(elem);
}
function render_table_random(prompts_for_category) {
  // Create a table at XYZ.
  var table_placeholder = $("#prompt_table");
  // Build a table
  var table_as_html = "<table class='table table-striped table-bordered'>";
  console.log(prompts_for_category.keys());
  categories = _.sampleSize(Array.from(prompts_for_category.keys()), 4);
  console.log(categories);
  for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
    category = categories_1[_i];
    prompts = prompts_for_category.get(category);
    var random = _.sampleSize(prompts, 1)[0];
    // console.log(category)
    // table_as_html += `<tr> <td> ${category} </td> <td> ${prompts[0]}</td> </tr>`
    table_as_html +=
      "<tr> <td> " + category + " </td> <td> " + random + "</td> </tr>";
  }
  table_as_html += "</table>";
  table_element = $(table_as_html);
  // elem = $(`<div class="alert alert-primary" role="alert"> ${prompts_for_category}</span></div>`)[0]
  console.log(table_element);
  console.log(table_as_html);
  $(table_placeholder).after(table_element);
}
// The prompts page has a bunch of lists of prompts
// Would be nice to "pick a random one" to make it less intimidating
// So can add a box at the top with a random prompt on top
// And a random per section prompt
function add_random_prompts() {
  console.log("add_random_prompts++");
  // prompt_categories are H3s with a UL under them, and the li's under there are the prompt.
  var starting_node = $("h3")[0];
  var node = starting_node;
  var current_category = starting_node;
  var prompts_for_category = [];
  var all_prompts = [];
  var map_category_to_prompts = new Map();
  for (var node_1 = starting_node; node_1; node_1 = node_1.nextSibling) {
    if (node_1.tagName == "H3") {
      // Hit a new category
      if (!_.isEmpty(prompts_for_category)) {
        render_prompt_for_category(current_category, prompts_for_category);
      }
      // Build prompt map
      map_category_to_prompts.set(
        current_category.textContent,
        prompts_for_category
      );
      // start processing next categroy
      current_category = node_1;
      prompts_for_category = [];
      continue;
    }
    // in a category, prompts are the children of the first unordered list, so skip
    // stuff that isn't a list
    if (node_1.tagName != "UL") {
      continue;
    }
    // we should now be the first list in the category
    prompts_for_category = _.map($(node_1).find("li"), function(li) {
      return li.textContent;
    });
    all_prompts.concat(prompts_for_category);
  }
  // render the last category, as we would have left the loop with out it.
  render_prompt_for_category(current_category, prompts_for_category);
  render_table_random(map_category_to_prompts);
  console.log("add_random_prompts--");
}
function keyboard_shortcut_loader() {
  Mousetrap.bind("s", function(e) {
    return (location.href = "/");
  });
  Mousetrap.bind("t", function(e) {
    return ForceShowRightSideBar();
  });
  Mousetrap.bind("p", function(e) {
    return SwapProdAndTest();
  });
  Mousetrap.bind("z", function(e) {
    return (location.href = "/random");
  });
  Mousetrap.bind("a", function(e) {
    return (location.href = "/all");
  });
  Mousetrap.bind("m", function(e) {
    return (location.href = "/toc");
  });
  Mousetrap.bind("6", function(e) {
    return (location.href = "/ig66");
  });
  var shortcutHelp =
    "\nTry these shortcuts:\n  s - search\n  t - force sidebar\n  p - swap prod and test\n  z - surprise me\n  a - all posts\n  m - global toc\n  6 - family journal\n  ";
  Mousetrap.bind("?", function(e) {
    return alert(shortcutHelp);
  });
}
function random_prompt_loader() {
  var url = window.location.href;
  var is_target_page = url.includes("/prompts") || url.includes("/todo_enjoy");
  if (!is_target_page) {
    return;
  }
  add_random_prompts();
}
$(document).ready(addBackLinksLoader);
$(document).ready(JsTemplateReplace);
$(document).ready(random_prompt_loader);
$(document).ready(keyboard_shortcut_loader);
