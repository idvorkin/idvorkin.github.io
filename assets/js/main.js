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
    const backToTop = $('<a class="back-to-top" href="#">Back to top</a>');
    const gotoBottom = $('<a class="go-to-bottom" href="#">Go to bottom</a>');
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
        window.scrollTo(0, 0)
    });
    gotoBottom.click(e => {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, document.body.scrollHeight)
    });
    forceSideBar.click(e => ForceShowRightSideBar())
    tocMenu.append(toggle).append(backToTop).append(gotoBottom);
    if (showPinToc) {
        tocMenu.append(forceSideBar)
    }
    target.append(tocMenu);

    function ForceShowRightSideBar() {
        let toc = $("#right-sidebar")
        let mainContent = $("#main-content")
        toc.removeClass()
        toc.addClass("col-4 pl-0")

        mainContent.removeClass()
        mainContent.addClass("col-8 pr-0")

        // Hide DropUp
        tocDropUp = $("#id-ui-toc-dropdown")
        tocDropUp.removeClass()
        tocDropUp.addClass("d-none")
    }
    Mousetrap.bind('s', e => {
        console.log("search");
        location.href = "/"
    });
    Mousetrap.bind('l', e => ForceShowRightSideBar());

    Mousetrap.bind('t', e => {
        toc = $("#id-ui-toc-dropdown")
        toc.css("position", "fixed")
        toc.css("top", "10px")
        toc.css("right", "10px")
    });

    let shortcutHelp = `
Keyboard Shortcuts: 
  s - search
  l - latch sidebar
  t - toc to top
  `
    Mousetrap.bind('?', e => alert(shortcutHelp));

}
// NOTE: This should really be in post.md
generateToc("ui-toc", showPinToc = true);
generateToc("ui-toc-affix", showPinToc = false);
console.log(`toc generate for ${id}`);