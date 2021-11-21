function append_post(div, post) {
  const item = $("<div/>");
  // TODO: HACK: Strip to the right of Week number
  const title_href = `<h3> <a href='${post.url}'}>${post.title}</a></h3>`;
  const monthNames = [
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
  const thumbnail_url = post.thumbnail.replace("s72-c", "s320");

  const published_date = new Date(post.published);
  const excerptDisplayText = `
    <div> ${
      monthNames[published_date.getMonth()]
    } ${published_date.getFullYear()} - ${post.excerpt}
    </div>
   `;
  if (post.thumbnail != "") {
    console.log(post.title);
    console.log(published_date);
    item.append(
      // `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
      `
      <div style='overflow:auto'>

      <a href='${post.url}'}><img style='float:left; margin-right:10px' src='${thumbnail_url}'/></a>
      ${excerptDisplayText}
      </div>`
    );
  } else {
    item.append(excerptDisplayText);
  }
  div.append(item);
}
function ProcessImports(posts: Array<any>) {
  if (!posts) {
    console.log(`No posts being imported`);
    return;
  }

  //
  // Import all history
  const random_div = $("#random-post");
  const import_div = $("#imported-posts");
  const achievement_div = $("#achievment");
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
  const count_random_posts = 1;

  const randomPosts = _.chain(posts)
    .sampleSize(count_random_posts)
    .orderBy(o => o.published, "desc")
    .value();

  for (const randomPost of randomPosts) {
    append_post(random_div, randomPost);
  }
  // Add a random achievement post
  // TODO: Merge in new posts to this feed
  // Consider doing the merge with a jquery selector

  const count_achievement_posts = 1;
  let random_achievement_posts = _.chain(posts)
    .filter(o => o.title.toLowerCase().includes("achievement"))
    .sampleSize(count_achievement_posts)
    .orderBy(o => o.published, "desc")
    .value();

  for (const randomPost2 of random_achievement_posts) {
    append_post(achievement_div, randomPost2);
  }

  const count_history_to_display = 0;
  for (const post of _.take(posts, count_history_to_display)) {
    append_post(import_div, post);
    console.log("adding_post ${post}");
  }
}

function add_imported_blog_posts() {
  if (!document.URL.includes("/ig66")) {
    return;
  }
  const imported_posts_url = "/ig66/ig66-export.json";
  $.getJSON(imported_posts_url, ProcessImports);
}

$(add_imported_blog_posts);
