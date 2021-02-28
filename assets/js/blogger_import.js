function ProcessImports(posts) {
  if (!posts) {
    console.log(`No posts being imported`);
    return;
  }

  let post_location = $("#imported-posts");
  if (!post_location) {
    console.log("No back_link_location");
    return;
  }

  console.log("mark");

  post_location.append("<h2 id='imported-post'> <b>IMPORTED_NOTES</b><h2>");

  /*
    posts
    var sort_descending_by_size = (a, b) =>
        Number(bl_ui[b].doc_size) - Number(bl_ui[a].doc_size);
*/

  for (var post of posts) {
    console.log(post.title);
    console.log(post.url);
    title_href = `<h3> <a href='${post.url}'}>${post.title}</a></h3>`;
    post_location.append(title_href);
    // HACK: Upsize to larger thumbnail, seems like blogger auto resizes to include a 320 image as well.
    var thumbnail_url = post.thumbnail.replace("s72-c", "s320");
    if (post.thumbnail != "") {
      post_location.append(
        `<div> <a href='${post.url}'}><img src='${thumbnail_url}'/></div>`
      );
    }
  }
}
function add_imported_blog_posts() {
  var imported_posts_url = "/ig66/ig66-export.json";
  $.getJSON(imported_posts_url, ProcessImports);
}

$(document).ready(add_imported_blog_posts);
