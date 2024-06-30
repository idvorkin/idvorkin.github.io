let $b013a5dd6d18443e$var$tocExpand = true;
function $b013a5dd6d18443e$var$checkExpandToggle() {
    const toc = $(".ui-toc-dropdown .toc");
    const toggle = $(".expand-toggle");
    if (!$b013a5dd6d18443e$var$tocExpand) {
        toc.removeClass("expand");
        toggle.text("Expand all");
    } else {
        toc.addClass("expand");
        toggle.text("Collapse all");
    }
}
function $b013a5dd6d18443e$var$SwapProdAndTest() {
    /* Find page title. */ const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    const testPrefix = "http://localhost:4000";
    const isProd = url.includes(prodPrefix);
    let newURL = url;
    if (isProd) newURL = url.replace(prodPrefix, testPrefix);
    else newURL = url.replace(testPrefix, prodPrefix);
    window.location.href = newURL;
}
function $b013a5dd6d18443e$var$ForceShowRightSideBar() {
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
function $b013a5dd6d18443e$var$generateToc(id, showPinToc) {
    const target = $(`#${id}`);
    target.html("");
    /* eslint-disable no-unused-vars */ /* @ts-ignore:TS2339*/ const toc = new window.Toc("content-holder", {
        level: 3,
        top: -1,
        class: "toc",
        ulClass: "nav",
        targetId: id
    });
    /* eslint-enable no-unused-vars */ if (target.text() === "undefined") target.html("");
    const tocMenu = $('<div class="toc-menu"></div');
    const toggle = $('<a class="expand-toggle" href="#">Collapse all</a>');
    const backToTop = $('<a class="back-to-top" href="#">Top of page</a>');
    const gotoBottom = $('<a class="go-to-bottom" href="#">Bottom of page</a>');
    const forceSideBar = $('<a class="go-to-bottom" href="#">Pin ToC</a>');
    $b013a5dd6d18443e$var$checkExpandToggle();
    toggle.click((e)=>{
        e.preventDefault();
        e.stopPropagation();
        $b013a5dd6d18443e$var$tocExpand = !$b013a5dd6d18443e$var$tocExpand;
        $b013a5dd6d18443e$var$checkExpandToggle();
    });
    backToTop.click((e)=>{
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, 0);
    });
    gotoBottom.click((e)=>{
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, document.body.scrollHeight);
    });
    forceSideBar.click((e)=>$b013a5dd6d18443e$var$ForceShowRightSideBar());
    tocMenu.append(toggle).append(backToTop).append(gotoBottom);
    if (showPinToc) tocMenu.append(forceSideBar);
    target.append(tocMenu);
}
// Yuk: Markdown Table Syntax makes nesting lists in tables hard. Adding JS based macro
// Replacement
//  NOTE: replace [](lX) with a list where X is a number
//  List must start with *lX
//  Markdown does not seperate lists, so stick divs between them.
function $b013a5dd6d18443e$var$JsTemplateReplace() {
    // Build a cache of replacement candidates to avoid multiple iterations over the tables
    let replaces = {};
    for (var list of $("ul")){
        if (!list.firstElementChild) continue;
        let firstLIText = list.firstElementChild.textContent;
        if (!firstLIText.startsWith("l")) continue;
        let number = parseInt(firstLIText.substring(1));
        if (Number.isNaN(number)) continue;
        replaces[firstLIText] = list;
    }
    for(var replaceText in replaces){
        let aToReplace = _($(`a[href=${replaceText}]`)).head();
        if (!aToReplace) continue; // Non-replaced targets will be left in place
        const replace = replaces[replaceText];
        replace.removeChild(replace.firstElementChild); // remove the 'lookup id' from the list
        $(aToReplace).replaceWith(replace);
    }
}
function $b013a5dd6d18443e$export$fc303307c4ed1d41(url_info) {
    const title_href = `<a href=${url_info.url}>${url_info.title}</a>`;
    const class_link = `link-box description truncate-css`;
    const output = `
<div>
    <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info.description} <span></div>
</div>`;
    return output;
}
async function $b013a5dd6d18443e$var$AddLinksToPage(allUrls) {
    // TODO handle redirects
    var my_path = new URL(document.URL).pathname;
    const backlinks = allUrls[my_path]?.incoming_links;
    const frontlinks = allUrls[my_path]?.outgoing_links;
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
    var sort_descending_by_size = (a, b)=>Number(allUrls[b].doc_size) - Number(allUrls[a].doc_size);
    if (backlinks) for (var link of backlinks.sort(sort_descending_by_size)){
        const url_info = allUrls[link];
        incoming_location.append($b013a5dd6d18443e$export$fc303307c4ed1d41(url_info));
    }
    // remove front links not in
    let clean_front_links = [];
    for (var link of frontlinks)if (allUrls[link]) clean_front_links.push(link);
    let outgoing_location = link_parent_location.find("#outgoing");
    if (clean_front_links) for (let link of clean_front_links.sort(sort_descending_by_size)){
        const url_info = allUrls[link];
        outgoing_location.append($b013a5dd6d18443e$export$fc303307c4ed1d41(url_info));
    }
}
function $b013a5dd6d18443e$var$make_html_summary_link(link, url_info) {
    const attribution = `(From:<a href='${url_info.url}'> ${url_info.title}</a>)`;
    return `<div>
        <i> ${url_info.description}</i> ${attribution}
    </div>`;
}
function $b013a5dd6d18443e$var$make_html_summary_link_error(link, error) {
    return `<span class='text-danger'>Error: Invalid link for ${link.attr("href")} ${error} </span>`;
}
function $b013a5dd6d18443e$var$AddSummarysToPage(backLinks) {
    const summary_links = $.makeArray($(".summary-link"));
    summary_links.forEach((raw_link)=>{
        const link = $(raw_link);
        try {
            console.log(link.attr("href"));
            let ref = link.attr("href");
            // Resolve redirect
            if (backLinks.redirects[ref] != undefined) ref = backLinks.redirects[ref];
            // Look up in url info
            if (backLinks.url_info[ref] == undefined) {
                link.html($b013a5dd6d18443e$var$make_html_summary_link_error(link, "not found in url info"));
                return;
            }
            link.html($b013a5dd6d18443e$var$make_html_summary_link(link, backLinks.url_info[ref]));
        } catch (e) {
            link.html($b013a5dd6d18443e$var$make_html_summary_link_error(link, e));
        }
    });
}
async function $b013a5dd6d18443e$var$add_link_loader() {
    $b013a5dd6d18443e$var$AddLinksToPage(await $b013a5dd6d18443e$export$46c928bda6aa7b36());
    $b013a5dd6d18443e$var$AddSummarysToPage(await $b013a5dd6d18443e$var$get_back_links());
}
let $b013a5dd6d18443e$var$cached_back_links = null;
async function $b013a5dd6d18443e$var$get_back_links() {
    if ($b013a5dd6d18443e$var$cached_back_links != null) return $b013a5dd6d18443e$var$cached_back_links;
    const url = window.location.href;
    const prodPrefix = "https://idvork.in";
    const isProd = url.includes(prodPrefix);
    var backlinks_url = "";
    if (isProd) backlinks_url = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";
    else backlinks_url = "/back-links.json";
    const backlinksJson = await $.getJSON(backlinks_url);
    $b013a5dd6d18443e$var$cached_back_links = backlinksJson;
    return $b013a5dd6d18443e$var$cached_back_links;
}
async function $b013a5dd6d18443e$export$46c928bda6aa7b36() {
    return (await $b013a5dd6d18443e$var$get_back_links()).url_info;
}
function $b013a5dd6d18443e$var$search() {
    $("#autocomplete-search-box-button").click();
}
function $b013a5dd6d18443e$var$keyboard_shortcut_loader() {
    const mouseTrap = Mousetrap();
    mouseTrap.bind("/", (e)=>$b013a5dd6d18443e$var$search());
    mouseTrap.bind("s", (e)=>$b013a5dd6d18443e$var$search());
    mouseTrap.bind("t", (e)=>$b013a5dd6d18443e$var$ForceShowRightSideBar());
    mouseTrap.bind("p", (e)=>$b013a5dd6d18443e$var$SwapProdAndTest());
    mouseTrap.bind("a", (e)=>location.href = "/all");
    mouseTrap.bind("m", (e)=>location.href = "/toc");
    mouseTrap.bind("6", (e)=>location.href = "/ig66");
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
    mouseTrap.bind("?", (e)=>alert(shortcutHelp));
}
// Export and share with others.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function $b013a5dd6d18443e$export$448332262467e042(list) {
    return list.map((value)=>({
            value: value,
            sort: Math.random()
        })).sort((a, b)=>a.sort - b.sort).map(({ value: value })=>value);
}
function $b013a5dd6d18443e$export$f6f0b6976f5f23e5(list) {
    return $b013a5dd6d18443e$export$448332262467e042(list)[0];
}
// This div gets content from the random_html_factory
// and clicking does a re-randomize
async function $b013a5dd6d18443e$export$7691c4557333f2d2(parent_id, random_html_factory) {
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
    $parent.click(async function(event) {
        if (event.target.tagName != "A") {
            const new_element = $(await random_html_factory());
            $parent.empty().append(new_element);
        }
    });
}
function $b013a5dd6d18443e$export$38653e1d7f0b5689() {
    $($b013a5dd6d18443e$var$add_link_loader);
    $($b013a5dd6d18443e$var$JsTemplateReplace);
    $($b013a5dd6d18443e$var$keyboard_shortcut_loader);
    $(()=>{
        // TOC Generation should go to posts.
        $b013a5dd6d18443e$var$generateToc("ui-toc", true);
        $b013a5dd6d18443e$var$generateToc("ui-toc-affix", false);
    });
}


//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph

console.log("Load force graph in TS");
// import ForceGraph from "force-graph";
const $0ae4da76013e664e$var$N = 300;
const $0ae4da76013e664e$var$gDataExample = {
    nodes: [
        ...Array($0ae4da76013e664e$var$N).keys()
    ].map((i)=>({
            id: i
        })),
    links: [
        ...Array($0ae4da76013e664e$var$N).keys()
    ].filter((id)=>id).map((id)=>({
            source: id,
            target: Math.round(Math.random() * (id - 1))
        }))
};
// Create gData from get_link_info
const $0ae4da76013e664e$var$pages = Object.values(await (0, $b013a5dd6d18443e$export$46c928bda6aa7b36)());
console.log($0ae4da76013e664e$var$pages.map((p)=>p.url));
const $0ae4da76013e664e$var$gData = {
    nodes: $0ae4da76013e664e$var$pages.map((p)=>({
            id: p.url
        })),
    links: $0ae4da76013e664e$var$pages.map((p)=>({
            id: p.url
        }))
};
console.log("HEllo From Typescript");
ForceGraph()(document.getElementById("graph")).linkDirectionalParticles(2).graphData($0ae4da76013e664e$var$gData).nodeLabel("id");
console.log("Post Graph");


console.log("++ -blog-module:success!");
console.log("-- -blog-module:success!");


//# sourceMappingURL=idv-blog-module.js.map
