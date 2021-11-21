function append_post(div, post) {
    var item = $("<div/>");
    // TODO: HACK: Strip to the right of Week number
    var title_href = "<h3> <a href='".concat(post.url, "'}>").concat(post.title, "</a></h3>");
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
    var excerptDisplayText = "\n    <div> ".concat(monthNames[published_date.getMonth()], " ").concat(published_date.getFullYear(), " - ").concat(post.excerpt, "\n    </div>\n   ");
    if (post.thumbnail != "") {
        console.log(post.title);
        console.log(published_date);
        item.append(
        // `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
        "\n      <div style='overflow:auto'>\n\n      <a href='".concat(post.url, "'}><img style='float:left; margin-right:10px' src='").concat(thumbnail_url, "'/></a>\n      ").concat(excerptDisplayText, "\n      </div>"));
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
    var randomPosts = _.chain(posts)
        .sampleSize(count_random_posts)
        .orderBy(function (o) { return o.published; }, "desc")
        .value();
    for (var _i = 0, randomPosts_1 = randomPosts; _i < randomPosts_1.length; _i++) {
        var randomPost = randomPosts_1[_i];
        append_post(random_div, randomPost);
    }
    // Add a random achievement post
    // TODO: Merge in new posts to this feed
    // Consider doing the merge with a jquery selector
    var count_achievement_posts = 1;
    var random_achievement_posts = _.chain(posts)
        .filter(function (o) { return o.title.toLowerCase().includes("achievement"); })
        .sampleSize(count_achievement_posts)
        .orderBy(function (o) { return o.published; }, "desc")
        .value();
    for (var _a = 0, random_achievement_posts_1 = random_achievement_posts; _a < random_achievement_posts_1.length; _a++) {
        var randomPost2 = random_achievement_posts_1[_a];
        append_post(achievement_div, randomPost2);
    }
    var count_history_to_display = 0;
    for (var _b = 0, _c = _.take(posts, count_history_to_display); _b < _c.length; _b++) {
        var post = _c[_b];
        append_post(import_div, post);
        console.log("adding_post ${post}");
    }
}
function add_imported_blog_posts() {
    if (!document.URL.includes("/ig66")) {
        return;
    }
    var imported_posts_url = "/ig66/ig66-export.json";
    $.getJSON(imported_posts_url, ProcessImports);
}
$(add_imported_blog_posts);
