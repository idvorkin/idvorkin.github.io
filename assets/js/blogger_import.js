function append_post(div, post) {
    var item = $("<div/>");
    // TODO: HACK: Strip to the right of Week number
    var title_href = "<h3> <a href='" + post.url + "'}>" + post.title + "</a></h3>";
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    item.append(title_href);
    // HACK: Upsize to larger thumbnail, seems like blogger auto resizes to include a 320 image as well.
    var thumbnail_url = post.thumbnail.replace("s72-c", "s320");
    var published_date = new Date(post.published);
    var excerptDisplayText = "\n    <div> " + monthNames[published_date.getMonth()] + " " + published_date.getFullYear() + " - " + post.excerpt + "\n    </div>\n   ";
    if (post.thumbnail != "") {
        console.log(post.title);
        console.log(published_date);
        item.append(
        // `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
        "\n      <div style='overflow:auto'>\n\n      <a href='" + post.url + "'}><img style='float:left; margin-right:10px' src='" + thumbnail_url + "'/></a>\n      " + excerptDisplayText + "\n      </div>");
    }
    else {
        item.append(excerptDisplayText);
    }
    div.append(item);
}
function ProcessImports(posts) {
    if (!posts) {
        console.log("No posts being imported");
        return;
    }
    //
    // Import all history
    var random_div = $("#random-post");
    var import_div = $("#imported-posts");
    var achievement_div = $("#achievment");
    if (!achievement_div) {
        console.log("#achievement_div not found");
        return;
    }
    if (!random_div) {
        console.log("#random-post not found");
        return;
    }
    if (!achievement_div) {
        console.log("#achievement_div not found");
        return;
    }
    // Add a random post on top
    var count_random_posts = 1;
    for (var _i = 0, _a = _.chain(posts)
        .sampleSize(count_random_posts)
        .orderBy(function (o) { return o.published; }, "desc"); _i < _a.length; _i++) {
        var randomPost = _a[_i];
        append_post(random_div, randomPost);
    }
    // Add a random achievement post
    // TODO: Merge in new posts to this feed
    // Consider doing the merge with a jquery selector
    var count_achievement_posts = 1;
    for (var _b = 0, _c = _.chain(posts)
        .filter(function (o) { return o.title.toLowerCase().includes("achievement"); })
        .sampleSize(count_achievement_posts)
        .orderBy(function (o) { return o.published; }, "desc"); _b < _c.length; _b++) {
        var randomPost = _c[_b];
        append_post(achievement_div, randomPost);
    }
    var count_history_to_display = 0;
    for (var _d = 0, _e = _.take(posts, count_history_to_display); _d < _e.length; _d++) {
        var post = _e[_d];
        append_post(import_div, post);
        console.log("adding_post ${post}");
    }
}
function add_imported_blog_posts() {
    var imported_posts_url = "/ig66/ig66-export.json";
    $.getJSON(imported_posts_url, ProcessImports);
}
$(document).ready(add_imported_blog_posts);
