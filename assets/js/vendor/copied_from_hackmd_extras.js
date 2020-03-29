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

// toc
function generateToc(id = "toc-slot") {
  const target = $(`#${id}`);
  target.html("");
  /* eslint-disable no-unused-vars */
  var toc = new window.Toc("content-holder", {
    level: 3,
    top: -1,
    class: "toc",
    ulClass: "nav",
    targetId: id
    //    process: getHeaderContent
  });
  /* eslint-enable no-unused-vars */
  if (target.text() === "undefined") {
    target.html("");
  }
  const tocMenu = $('<div class="toc-menu"></div');
  const toggle = $('<a class="expand-toggle" href="#">Expand all</a>');
  const backtotop = $('<a class="back-to-top" href="#">Back to top</a>');
  const gotobottom = $('<a class="go-to-bottom" href="#">Go to bottom</a>');
  checkExpandToggle();
  toggle.click(e => {
    e.preventDefault();
    e.stopPropagation();
    tocExpand = !tocExpand;
    checkExpandToggle();
  });
  backtotop.click(e => {
    e.preventDefault();
    e.stopPropagation();
    if (window.scrollToTop) {
      window.scrollToTop();
    }
    // removeHash();
  });
  gotobottom.click(e => {
    e.preventDefault();
    e.stopPropagation();
    if (window.scrollToBottom) {
      window.scrollToBottom();
    }
    // removeHash();
  });
  // .append(toggle) remove toggle for now.
  tocMenu.append(backtotop).append(gotobottom);
  target.append(tocMenu);
  console.log(`toc generate for ${id}`);
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

window.scrollToTop = scrollToTop;
window.scrollToBottom = scrollToBottom;
generateToc("ui-toc");
generateToc("ui-toc-affix");
