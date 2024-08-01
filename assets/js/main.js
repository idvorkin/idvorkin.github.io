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
    tocMenu.append(toggle).append(backToTop).append(gotoBottom);
    if (showPinToc) {
        tocMenu.append(forceSideBar);
    }
    target.append(tocMenu);
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
async function AddLinksToPage(allUrls) {
    var _a, _b;
    // TODO handle redirects
    var my_path = new URL(document.URL).pathname;
    const backlinks = (_a = allUrls[my_path]) === null || _a === void 0 ? void 0 : _a.incoming_links;
    const frontlinks = (_b = allUrls[my_path]) === null || _b === void 0 ? void 0 : _b.outgoing_links;
    if (!backlinks && !frontlinks) {
        console.log(`No backlinks for the page ${my_path}`);
        return;
    }
    let link_parent_location = $("#links-to-page");
    if (!link_parent_location) {
        console.log("No back_link_location");
        return;
    }
    link_parent_location.append(`
<ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#incoming" type="button" role="tab" aria-controls="incoming" aria-selected="true">Links to here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#outgoing" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Link from here</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active " id="incoming" role="tabpanel" aria-labelledby="incoming-tab"></div>
  <div class="tab-pane fade" id="outgoing" role="tabpanel" aria-labelledby="outgoing-tab"></div>
</div>
`);
    let incoming_location = link_parent_location.find("#incoming");
    var sort_descending_by_size = (a, b) => Number(allUrls[b].doc_size) - Number(allUrls[a].doc_size);
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
    outgoing_location.append("<a href='/graph#joy'>View Graph</a>");
}
function make_html_summary_link(link, url_info) {
    const attribution = `(From:<a href='${url_info.url}'> ${url_info.title}</a>)`;
    return `<div>
        <i> ${url_info.description}</i> ${attribution}
    </div>`;
}
function make_html_summary_link_error(link, error) {
    return `<span class='text-danger'>Error: Invalid link for ${link.attr("href")} ${error} </span>`;
}
function AddSummarysToPage(backLinks) {
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
        }
        catch (e) {
            link.html(make_html_summary_link_error(link, e));
        }
    });
}
async function add_link_loader() {
    AddLinksToPage(await get_link_info());
    AddSummarysToPage(await get_back_links());
}
let cached_back_links = null;
async function get_back_links() {
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
    }
    else {
        backlinks_url = "/back-links.json";
    }
    const backlinksJson = (await $.getJSON(backlinks_url));
    cached_back_links = backlinksJson;
    return cached_back_links;
}
async function get_link_info() {
    return (await get_back_links()).url_info;
}
function search() {
    $("#autocomplete-search-box-button").click();
}
function keyboard_shortcut_loader() {
    const mouseTrap = Mousetrap();
    mouseTrap.bind("/", e => search());
    mouseTrap.bind("s", e => search());
    mouseTrap.bind("t", e => ForceShowRightSideBar());
    mouseTrap.bind("p", e => SwapProdAndTest());
    mouseTrap.bind("a", e => (location.href = "/all"));
    mouseTrap.bind("m", e => (location.href = "/toc"));
    mouseTrap.bind("6", e => (location.href = "/ig66"));
    let shortcutHelp = `
Try these shortcuts:
  s - search
  / - search
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
function random_from_list(list) {
    return shuffle(list)[0];
}
// This div gets content from the random_html_factory
// and clicking does a re-randomize
async function append_randomizer_div(parent_id, random_html_factory) {
    // as string to queit type checker.
    // Will be a noop if parent_id is already a jquery object
    const $parent = $(parent_id);
    if ($parent.length != 1) {
        console.log(`append_randomizer_div ${parent_id} not present`);
        return;
    }
    const new_element = $(await random_html_factory());
    $parent.empty().append(new_element);
    // Clicking on the element should result in a reload, unless you're
    // Clicking on a link
    $parent.click(async function (event) {
        if (event.target.tagName != "A") {
            const new_element = $(await random_html_factory());
            $parent.empty().append(new_element);
        }
    });
}
function load_globals() {
    $(add_link_loader);
    $(keyboard_shortcut_loader);
    $(() => {
        // TOC Generation should go to posts.
        generateToc("ui-toc", true);
        generateToc("ui-toc-affix", false);
    });
}
export { load_globals, get_link_info, MakeBackLinkHTML, shuffle, random_from_list, append_randomizer_div, };
//# sourceMappingURL=main.js.map