let tocExpand = true;
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
function MakeBackLinkHTML(url_info) {
    const title_href = `<a href=${url_info.url}>${url_info.title}</a>`;
    const class_link = `link-box description truncate-css`;
    const output = `
<div>
    <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info.description} <span></div>
</div>`;
    return output;
}
async function ProcessBackLinks(allUrls) {
    var _a;
    var my_path = new URL(document.URL).pathname;
    const backlinks = (_a = allUrls[my_path]) === null || _a === void 0 ? void 0 : _a.incoming_links;
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
    var sort_descending_by_size = (a, b) => Number(allUrls[b].doc_size) - Number(allUrls[a].doc_size);
    for (var link of backlinks.sort(sort_descending_by_size)) {
        const url_info = allUrls[link];
        back_link_location.append(MakeBackLinkHTML(url_info));
    }
}
async function addBackLinksLoader() {
    ProcessBackLinks(await get_link_info());
}
async function get_link_info() {
    const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    const isProd = url.includes(prodPrefix);
    var backlinks_url = "";
    if (isProd) {
        backlinks_url =
            "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
    }
    else {
        backlinks_url = "/back-links.json";
    }
    const urlJSON = (await $.getJSON(backlinks_url));
    return urlJSON.url_info;
}
function keyboard_shortcut_loader() {
    const mouseTrap = Mousetrap();
    mouseTrap.bind("s", e => (location.href = "/"));
    mouseTrap.bind("t", e => ForceShowRightSideBar());
    mouseTrap.bind("p", e => SwapProdAndTest());
    mouseTrap.bind("z", e => on_monkey_button_click(e));
    mouseTrap.bind("a", e => (location.href = "/all"));
    mouseTrap.bind("m", e => (location.href = "/toc"));
    mouseTrap.bind("6", e => (location.href = "/ig66"));
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
    mouseTrap.bind("?", e => alert(shortcutHelp));
}
// Export and share with others.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(list) {
    return list
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}
async function on_monkey_button_click(e) {
    if (window.location.href.includes("/ig66")) {
        window.location.href = "/ig66";
        return;
    }
    const all_url_info = await get_link_info();
    //  Yuk, find a clearere way to do this
    const all_pages = Object.entries(all_url_info) // returns a list of [url, info]
        .map(e => e[1]);
    const random_post = shuffle(all_pages)[0];
    const new_url = window.location.origin + random_post.url;
    window.location.href = new_url;
}
function monkey_button_loader() {
    $("#monkey-button").bind("click", on_monkey_button_click);
}
function load_globals() {
    $(monkey_button_loader);
    $(addBackLinksLoader);
    $(JsTemplateReplace);
    $(keyboard_shortcut_loader);
    $(() => {
        // TOC Generation should go to posts.
        generateToc("ui-toc", true);
        generateToc("ui-toc-affix", false);
    });
}
export { load_globals, get_link_info, MakeBackLinkHTML };
//# sourceMappingURL=main.js.map