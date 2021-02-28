function append_post(div, post) {
  let item = $("<div/>");
  // TODO: HACK: Strip to the right of Week number
  let title_href = `<h3> <a href='${post.url}'}>${post.title}</a></h3>`;

  item.append(title_href);
  // HACK: Upsize to larger thumbnail, seems like blogger auto resizes to include a 320 image as well.
  let thumbnail_url = post.thumbnail.replace("s72-c", "s320");
  if (post.thumbnail != "") {
    item.append(
      `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
    );
  }
  div.append(item);
}
function ProcessImports(posts) {
  if (!posts) {
    console.log(`No posts being imported`);
    return;
  }

  //
  // Import all history
  let random_div = $("#random-post");
  let import_div = $("#imported-posts");
  if (!import_div) {
    console.log("import-div not found");
    return;
  }
  // Add a random post on top
  var randomPost = posts[Math.floor(Math.random() * posts.length)];
  append_post(random_div, randomPost);

  for (var post of posts) {
    append_post(import_div, post);
  }
}

function add_imported_blog_posts() {
  var imported_posts_url = "/ig66/ig66-export.json";
  $.getJSON(imported_posts_url, ProcessImports);
}

$(document).ready(add_imported_blog_posts);
