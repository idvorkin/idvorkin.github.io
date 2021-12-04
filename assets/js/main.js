let tocExpand = true;
class TreeNode {
    constructor({ name, value = 25, children = [] }) {
        this.name = name;
        this.children = children;
        this.value = value;
    }
}
function checkExpandToggle() {
    const toc = $(".ui-toc-dropdown .toc");
    const toggle = $(".expand-toggle");
    if (!tocExpand) {
        toc.removeClass("expand");
        toggle.text("Expand all");
    }
    else {
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
    }
    else {
        newURL = url.replace(testPrefix, prodPrefix);
    }
    window.location.href = newURL;
}
function ForceShowRightSideBar() {
    let toc = $("#right-sidebar");
    let mainContent = $("#main-content");
    toc.removeClass();
    toc.addClass("col-4 pl-0");
    mainContent.removeClass();
    mainContent.addClass("col-8 pr-0");
    // Hide DropUp
    const tocDropUp = $("#id-ui-toc-dropdown");
    tocDropUp.removeClass();
    tocDropUp.addClass("d-none");
}
// <!-- Copied from hackmd-extras.js -->
function generateToc(id, showPinToc) {
    const target = $(`#${id}`);
    target.html("");
    /* eslint-disable no-unused-vars */
    /* @ts-ignore:TS2339*/
    const toc = new window.Toc("content-holder", {
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
}
// Yuk: Markdown Table Syntax makes nesting lists in tables hard. Adding JS based macro
// Replacement
//  NOTE: replace [](lX) with a list where X is a number
//  List must start with *lX
//  Markdown does not seperate lists, so stick divs between them.
function JsTemplateReplace() {
    // Build a cache of replacement candidates to avoid multiple iterations over the tables
    let replaces = {};
    for (var list of $("ul")) {
        if (!list.firstElementChild)
            continue;
        let firstLIText = list.firstElementChild.textContent;
        if (!firstLIText.startsWith("l"))
            continue;
        let number = parseInt(firstLIText.substring(1));
        if (number == NaN)
            continue;
        replaces[firstLIText] = list;
    }
    for (var replaceText in replaces) {
        let aToReplace = _($(`a[href=${replaceText}]`)).head();
        if (!aToReplace)
            continue; // Non-replaced targets will be left in place
        const replace = replaces[replaceText];
        replace.removeChild(replace.firstElementChild); // remove the 'lookup id' from the list
        $(aToReplace).replaceWith(replace);
    }
}
function ProcessBackLinks(backLinks) {
    var _a;
    var my_path = new URL(document.URL).pathname;
    var backlinks = (_a = backLinks["url_info"][my_path]) === null || _a === void 0 ? void 0 : _a.incoming_links;
    if (!backlinks) {
        console.log(`No backlinks for the page ${my_path}`);
        return;
    }
    let back_link_location = $("#links-to-page");
    if (!back_link_location) {
        console.log("No back_link_location");
        return;
    }
    back_link_location.append("<div id='links-to-page-title'> <b>LINKS TO THIS NOTE</b><div>");
    const bl_ui = backLinks["url_info"];
    var sort_descending_by_size = (a, b) => Number(bl_ui[b].doc_size) - Number(bl_ui[a].doc_size);
    for (var link of backlinks.sort(sort_descending_by_size)) {
        const url_info = backLinks["url_info"][link];
        console.log(link);
        console.log(url_info);
        const title_href = `<a href=${url_info["url"]}>${url_info["title"]}</a>`;
        const class_link = `link-box description truncate-css`;
        back_link_location.append(`<div> <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info["description"]}  <span></div></div>`);
    }
}
function addBackLinksLoader() {
    const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    const testPrefix = "http://localhost:4000";
    const isProd = url.includes(prodPrefix);
    var backlinks_url = "";
    if (isProd) {
        backlinks_url =
            "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
    }
    else {
        backlinks_url = testPrefix + "/back-links.json";
    }
    $.getJSON(backlinks_url, ProcessBackLinks);
}
function render_prompt_for_category(category, prompts_for_category) {
    //print one of the prompts
    let random_prompt = _.sampleSize(prompts_for_category, 1)[0];
    // console.log(`${category}:${random_prompt}`)
    // elem = $(`<div> <span class="badge badge-pill badge-primary"> ${random_prompt}</span></div>`)[0]
    const elem = $(`<div class="alert alert-primary" role="alert"> ${random_prompt}</span></div>`)[0];
    $(category).after(elem);
}
function render_table_random(prompts_for_category) {
    // Create a table at XYZ.
    const table_placeholder = $("#prompt_table");
    // Build a table
    let table_as_html = "<table class='table table-striped table-bordered'>";
    const categories = _.sampleSize(Array.from(prompts_for_category.keys()), 4);
    console.log(categories);
    for (const category of categories) {
        const prompts = prompts_for_category.get(category);
        const random = _.sampleSize(prompts, 1)[0];
        // console.log(category)
        // table_as_html += `<tr> <td> ${category} </td> <td> ${prompts[0]}</td> </tr>`
        const category_text = category.text();
        table_as_html += `<tr> <td> ${category_text} </td> <td> ${random}</td> </tr>`;
    }
    table_as_html += "</table>";
    const table_element = $(table_as_html);
    $(table_placeholder).after(table_element);
}
// The prompts page has a bunch of lists of prompts
// Would be nice to "pick a random one" to make it less intimidating
// So can add a box at the top with a random prompt on top
// And a random per section prompt
function make_category_to_prompt_map() {
    // prompt_categories are H3s with a UL under them, and the li's under there are the prompt.
    const starting_node = $("h3").first();
    let current_category = starting_node;
    let prompts_for_category = [];
    let map_category_to_prompts = new Map();
    for (let node = starting_node; node.length != 0; node = $(node).next()) {
        if (node.prop("tagName") == "H3") {
            // Build prompt map
            map_category_to_prompts.set(current_category, prompts_for_category);
            // start processing next categroy
            current_category = node;
            prompts_for_category = [];
            continue;
        }
        // in a category, prompts are the children of the first unordered list, so skip
        // stuff that isn't a list
        if (node.prop("tagName") != "UL") {
            continue;
        }
        // we should now be the first list in the category
        prompts_for_category = _.map($(node).find("li"), li => $(li).text());
    }
    map_category_to_prompts.set(current_category, prompts_for_category);
    // XXX: Am I missing the last entry (??)
    return map_category_to_prompts;
}
function add_random_prompts() {
    console.log("add_random_prompts++");
    const map_category_to_prompts = make_category_to_prompt_map();
    for (const category of map_category_to_prompts.keys()) {
        render_prompt_for_category(category, map_category_to_prompts.get(category));
    }
    render_table_random(map_category_to_prompts);
    console.log("add_random_prompts--");
}
function keyboard_shortcut_loader() {
    Mousetrap.bind("s", e => (location.href = "/"));
    Mousetrap.bind("t", e => ForceShowRightSideBar());
    Mousetrap.bind("p", e => SwapProdAndTest());
    Mousetrap.bind("z", e => (location.href = "/random"));
    Mousetrap.bind("a", e => (location.href = "/all"));
    Mousetrap.bind("m", e => (location.href = "/toc"));
    Mousetrap.bind("6", e => (location.href = "/ig66"));
    let shortcutHelp = `
Try these shortcuts:
  s - search
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;
    Mousetrap.bind("?", e => alert(shortcutHelp));
}
function random_prompt_loader() {
    const url = window.location.href;
    const is_target_page = url.includes("/prompts") || url.includes("/todo_enjoy");
    if (!is_target_page) {
        return;
    }
    add_random_prompts();
}
function on_monkey_button_click(e) {
    if (window.location.href.includes("/ig66")) {
        window.location.href = "/ig66";
        return;
    }
    window.location.href = "/random";
}
function elemToList(elem) { }
// Html with headings to Tree
function HeadingsAndListsToTree(elem) {
    // h2, h3, h4, h5, h6 and lists are all the same level, put them in a tree
    //
    // close parent when finding element at the same level
}
function HeadingToTree(depth, dom) {
    // recursion ends when list is empty
    // which is when there are no elements at this depth.
    return dom.find("h" + depth).map(elem => {
        const children = HeadingToTree(depth + 1, elem);
        return new TreeNode({ name: $(elem).text(), children });
    });
}
// h2
// h3
// <li>
/*
  dom.find(" ")
  for (const header of

    ret.push(new TreeNode({ name: headerText, children: children }));
  }
  */
function monkey_button_loader() {
    $("#monkey-button").bind("click", on_monkey_button_click);
}
$(monkey_button_loader);
$(addBackLinksLoader);
$(JsTemplateReplace);
$(random_prompt_loader);
$(keyboard_shortcut_loader);
$(() => {
    // TOC Generation should go to posts.
    generateToc("ui-toc", true);
    generateToc("ui-toc-affix", false);
});
//# sourceMappingURL=main.js.map