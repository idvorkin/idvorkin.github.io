/**
 * Replaces placeholder links in the document with their corresponding list content.
 * @param listReplacements - An object mapping placeholder texts to list elements.
 */ function $baa5cd42515c3a0f$export$edbf5dc6590fcd01(listReplacements) {
    Object.entries(listReplacements).forEach(([placeholderText, list])=>{
        const placeholderLink = $(`a[href=${placeholderText}]`).first();
        if (!placeholderLink.length) return; // Placeholder not found, skip
        const listClone = $(list).clone();
        listClone.children().first().remove(); // Remove the 'lookup id' from the list
        placeholderLink.replaceWith(listClone);
        // remove the list from the document
        $(list).remove();
    });
}
function $baa5cd42515c3a0f$export$87fc814c53cfbd54() {
    console.log("Replacing List Placeholders in Tables");
    const listReplacements = $baa5cd42515c3a0f$var$buildListReplacementMap();
    $baa5cd42515c3a0f$export$edbf5dc6590fcd01(listReplacements);
}
/**
 * Builds a map of list replacements by scanning the document for specially formatted lists.
 * @returns An object where keys are placeholder texts and values are the corresponding list elements.
 */ function $baa5cd42515c3a0f$var$buildListReplacementMap() {
    const replacements = {};
    $("ul").each((_, list)=>{
        const firstListItem = list.firstElementChild;
        if (!firstListItem) return;
        const firstItemText = firstListItem.textContent;
        if (!firstItemText.startsWith("l")) return;
        const listId = parseInt(firstItemText.substring(1));
        if (isNaN(listId)) return;
        replacements[firstItemText] = list;
    });
    return replacements;
}
$($baa5cd42515c3a0f$export$87fc814c53cfbd54);


//
//  main.js
//
// Random tree
// Tree copied from: https://github.com/vasturiano/force-graph
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
    const page_path = new URL(document.URL).pathname;
    const backlinks = allUrls[page_path]?.incoming_links;
    const frontlinks = allUrls[page_path]?.outgoing_links;
    if (!backlinks && !frontlinks) {
        console.log(`No backlinks for the page ${page_path}`);
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
    console.log("Added Graph");
    const graph_location = link_parent_location.find("#graph");
    const stripped_page_path = page_path.replace(/\//g, "");
    graph_location.append(`<a href='/graph#${stripped_page_path}'>${page_path} (${stripped_page_path}) </a>`);
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
    mouseTrap.bind("s", (e)=>$b013a5dd6d18443e$var$search());
    mouseTrap.bind("t", (e)=>$b013a5dd6d18443e$var$ForceShowRightSideBar());
    mouseTrap.bind("p", (e)=>$b013a5dd6d18443e$var$SwapProdAndTest());
    mouseTrap.bind("a", (e)=>location.href = "/all");
    mouseTrap.bind("m", (e)=>location.href = "/toc");
    mouseTrap.bind("6", (e)=>location.href = "/ig66");
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
    $($b013a5dd6d18443e$var$keyboard_shortcut_loader);
    $(()=>{
        // TOC Generation should go to posts.
        $b013a5dd6d18443e$var$generateToc("ui-toc", true);
        $b013a5dd6d18443e$var$generateToc("ui-toc-affix", false);
    });
}


console.log("Load force graph in TS v 0.9");
//import ForceGraph from "force-graph";
// Pages are the link_infos
// Set id to be the URL.
// Example to make collapsable tree:
// https://github.com/vasturiano/force-graph/blob/master/example/expandable-nodes/index.html
// Uncollapse any page wtih the url == eulogy
function $0ae4da76013e664e$var$is_initial_expanded(node) {
    if (node.url == first_expanded) return true;
    return false;
}
const $0ae4da76013e664e$var$pages = Object.values(await (0, $b013a5dd6d18443e$export$46c928bda6aa7b36)()).map((p)=>({
        ...p,
        id: p.url,
        expanded: false
    }));
const $0ae4da76013e664e$var$slug = "/" + window.location.href.split("#")[1];
const $0ae4da76013e664e$var$initial_expanded_url = $0ae4da76013e664e$var$pages.map((p)=>p.url).includes($0ae4da76013e664e$var$slug) ? $0ae4da76013e664e$var$slug : "/eulogy";
$0ae4da76013e664e$var$pages.forEach((p)=>{
    p.expanded = p.url == $0ae4da76013e664e$var$initial_expanded_url;
});
function $0ae4da76013e664e$var$is_valid_url(url) {
    // check if the url is in the list of pages
    return $0ae4da76013e664e$var$pages.map((p)=>p.url).includes(url);
}
function $0ae4da76013e664e$var$build_links(pages) {
    // build links
    const links = [];
    pages.forEach((page)=>{
        page.outgoing_links.concat(page.incoming_links).filter($0ae4da76013e664e$var$is_valid_url) // We have lots of dead links, go fix them in the source material
        .forEach((target)=>{
            links.push({
                source: page,
                target: target,
                value: 1
            });
        });
    //page.incoming_links.forEach(target => {
    //links.push({ source: target, target: source, value: 1 });
    //});
    });
    return links;
}
function $0ae4da76013e664e$var$node_for_url(pages, url) {
    return pages.filter((p)=>p.url == url)[0];
}
function $0ae4da76013e664e$var$build_graph_data(pages) {
    const visible_pages = pages.filter((page)=>page.expanded);
    const visible_links = $0ae4da76013e664e$var$build_links(visible_pages);
    const newly_visible_pages = visible_links.map((l)=>$0ae4da76013e664e$var$node_for_url(pages, l.target));
    // update visable pages with newly visible ones
    const combined_pages = visible_pages.concat(newly_visible_pages);
    return {
        nodes: combined_pages,
        links: visible_links
    };
}
// Make tree collapasable
function $0ae4da76013e664e$var$TextLabelNodeCanvas(node, ctx, globalScale) {
    const outgoingCount = node.outgoing_links.length;
    const expandedText = node.expanded ? "-" : `+${outgoingCount}`;
    const label = node.id + " [" + expandedText + "]";
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [
        textWidth,
        fontSize
    ].map((n)=>n + fontSize * 0.2); // some padding
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = node.color;
    ctx.fillText(label, node.x, node.y);
    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
}
function $0ae4da76013e664e$var$TextLabelNodePointerAreaPaint(node, color, ctx) {
    ctx.fillStyle = color;
    const bckgDimensions = node.__bckgDimensions;
    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
}
// If ForceGraph isn't defined, return
if (typeof ForceGraph === "undefined") console.log("Force Graph not defined");
else {
    const Graph = ForceGraph()(document.getElementById("graph")).graphData($0ae4da76013e664e$var$build_graph_data($0ae4da76013e664e$var$pages)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject($0ae4da76013e664e$var$TextLabelNodeCanvas).nodePointerAreaPaint($0ae4da76013e664e$var$TextLabelNodePointerAreaPaint).onNodeRightClick((node)=>{
        // Open the node in a new tab
        window.open(node.url, "_blank");
    }).onNodeClick((node)=>{
        // Center/zoom on node
        console.log(node);
        // count expanded nodes
        node.expanded = !node.expanded;
        const expanded_nodes = $0ae4da76013e664e$var$pages.filter((p)=>p.expanded).length;
        if (expanded_nodes == 0) // re-expand me.
        node.expanded = true;
        Graph.graphData($0ae4da76013e664e$var$build_graph_data($0ae4da76013e664e$var$pages));
        // center on node in 300 ms, post graph update
        setTimeout(()=>{
            center_on_node(node);
        }, 300);
    });
    center_on_node($0ae4da76013e664e$var$node_for_url($0ae4da76013e664e$var$pages, $0ae4da76013e664e$var$initial_expanded_url));
    function center_on_node(node) {
        Graph.centerAt(node.x, node.y, 500);
        Graph.zoom(8, 500);
        update_detail(node);
        console.log("centering on", node);
    }
    var $0ae4da76013e664e$var$g_last_detail_node = null;
    // set click handler for center control
    $("#center_control").on("click", ()=>center_on_node($0ae4da76013e664e$var$g_last_detail_node));
    // set click handler for goto control
    $("#goto_control").on("click", open_goto_control);
    // set click handler for collapse control
    $("#collapse_control").on("click", collapse_all_except_active);
    function open_goto_control() {
        console.log("Goto control clicked");
        if ($0ae4da76013e664e$var$g_last_detail_node) {
            if ($0ae4da76013e664e$var$g_last_detail_node.url) window.open($0ae4da76013e664e$var$g_last_detail_node.url, "_blank");
            else console.log("Active node has no URL");
        } else console.log("No active node to go to");
    }
    function collapse_all_except_active() {
        console.log("Collapse control clicked");
        $0ae4da76013e664e$var$pages.forEach((p)=>{
            p.expanded = false;
        });
        if ($0ae4da76013e664e$var$g_last_detail_node) $0ae4da76013e664e$var$g_last_detail_node.expanded = true;
        Graph.graphData($0ae4da76013e664e$var$build_graph_data($0ae4da76013e664e$var$pages));
        // Center on the active node after collapsing
        if ($0ae4da76013e664e$var$g_last_detail_node) setTimeout(()=>{
            center_on_node($0ae4da76013e664e$var$g_last_detail_node);
        }, 300);
    }
    function update_detail(page) {
        // replace html of element of id above with the page
        $0ae4da76013e664e$var$g_last_detail_node = page;
        const html = (0, $b013a5dd6d18443e$export$fc303307c4ed1d41)(page);
        const detail = document.getElementById("detail");
        detail.innerHTML = html;
    }
}
console.log("Post Graph");


console.log("++ -blog-module:success!");
console.log("-- -blog-module:success!");


//# sourceMappingURL=idv-blog-module.js.map
