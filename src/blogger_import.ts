import { random_from_list, append_randomizer_div } from "./main.js";
function html_for_blogpost(post) {
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
    "December",
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

      <a href='${post.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${thumbnail_url}'/></a>
      ${excerptDisplayText}
      </div>`
    );
  } else {
    item.append(excerptDisplayText);
  }
  const ret = item.html();
  return ret;
}

function get_achievement_posts(imported_posts: Array<any>) {
  // TODO: merge imported and new posts
  return imported_posts.filter(post =>
    post.title.toLowerCase().includes("achievement")
  );
}
function get_recent_posts(imported_posts: Array<any>) {
  // TODO: merge imported and new posts
  return imported_posts.filter(post => post.tags.includes("family-journal"));
}

function ProcessImports(posts: Array<any>) {
  console.log("Processing", posts.length, "posts");
  if (!posts) {
    console.log(`No posts being imported`);
    return;
  }

  //
  // Import all history
  const random_div = $("#random-post");
  const achievement_div = $("#achievment");
  const random_recent = $("#random-recent");

  append_randomizer_div(random_div, () =>
    html_for_blogpost(random_from_list(posts))
  );

  // Add a random achievement post
  append_randomizer_div(achievement_div, () =>
    html_for_blogpost(random_from_list(get_achievement_posts(posts)))
  );
  append_randomizer_div(random_recent, () =>
    html_for_blogpost(random_from_list(get_recent_posts(posts)))
  );
}

function add_imported_blog_posts() {
  const imported_posts_url = "/ig66/ig66-export.json";
  $.getJSON(imported_posts_url, ProcessImports);
}

export { add_imported_blog_posts };
