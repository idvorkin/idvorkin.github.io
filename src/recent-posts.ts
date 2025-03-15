/**
 * Recent Posts Display Module
 *
 * Fetches and displays the most recently modified posts
 * from the backlinks.json file.
 */

import { IURLInfoMap, IURLInfo } from "./shared";

/**
 * Updates the recent posts container with post data
 */
async function updateRecentPosts(): Promise<void> {
  console.log("🔍 updateRecentPosts function called");

  const recentPostsContainer = document.getElementById("recent-posts");
  console.log("🔍 recent-posts container element:", recentPostsContainer);

  if (!recentPostsContainer) {
    console.error("❌ recent-posts container not found in DOM");
    return;
  }

  try {
    console.log("🔍 Fetching back-links.json...");
    // Fetch the backlinks data
    const response = await fetch("/back-links.json");
    const data = await response.json();
    console.log("🔍 Received data from back-links.json:", data);
    console.log("🔍 Keys in data:", Object.keys(data));

    // Check if the expected structure exists
    if (!data.url_info) {
      console.error("❌ Missing url_info in data structure");
      recentPostsContainer.innerHTML =
        "<p>Error: Could not load recent posts data.</p>";
      return;
    }

    const urlInfoMap: IURLInfoMap = data.url_info;
    console.log(
      "🔍 Number of entries in urlInfoMap:",
      Object.keys(urlInfoMap).length
    );

    // Convert to array of pages for easier processing
    const pages = Object.entries(urlInfoMap).map(([url, metadata]) => ({
      url,
      title: metadata.title || url,
      description: metadata.description || "",
      doc_size: metadata.doc_size || 0,
      last_modified: metadata.last_modified || "",
    }));
    console.log("🔍 Transformed pages array, length:", pages.length);

    // Filter out pages that are likely redirects (these have empty descriptions and titles)
    const realPages = pages.filter(
      page =>
        page.description &&
        page.description.trim() !== "" &&
        page.title &&
        page.title.trim() !== ""
    );
    console.log("🔍 Filtered real pages, length:", realPages.length);
    console.log("🔍 First 3 real pages:", realPages.slice(0, 3));

    // Sort by last_modified date (newest first)
    const sortedPages = realPages.sort((a, b) => {
      if (a.last_modified && b.last_modified) {
        console.log(
          "🔍 Comparing last_modified dates:",
          a.url,
          a.last_modified,
          "vs",
          b.url,
          b.last_modified
        );
        return (
          new Date(b.last_modified).getTime() -
          new Date(a.last_modified).getTime()
        );
      }
      // Fallback to doc_size if last_modified is not available
      return b.doc_size - a.doc_size;
    });
    console.log(
      "🔍 Sorted pages, first 5:",
      sortedPages.slice(0, 5).map(p => ({
        url: p.url,
        title: p.title,
        last_modified: p.last_modified,
      }))
    );

    // Take the top 5 most recent posts
    const recentPages = sortedPages.slice(0, 5);

    // Create the HTML
    if (recentPages.length === 0) {
      console.warn("⚠️ No recent pages found after filtering and sorting");
      recentPostsContainer.innerHTML = "<p>No recent posts found.</p>";
      return;
    }

    const html = `
      <ul>
        ${recentPages
          .map(
            page => `
          <li>
            <a href="${page.url}">${page.title}</a> - 
            ${page.description.split("\n")[0].substring(0, 100)}${
              page.description.length > 100 ? "..." : ""
            }
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    console.log(
      "🔍 Updating recent-posts content with HTML",
      html.substring(0, 100) + "..."
    );
    recentPostsContainer.innerHTML = html;
    console.log("✅ Recent posts updated successfully");
  } catch (error) {
    console.error("❌ Error loading recent posts:", error);
    recentPostsContainer.innerHTML =
      "<p>Error loading recent posts. Please try again later.</p>";
  }
}

/**
 * Initializes the recent posts component
 */
export function initRecentPosts(): void {
  console.log("🔍 initRecentPosts called");

  // Check if document is already loaded
  if (document.readyState === "loading") {
    // Document still loading, add event listener
    console.log("🔍 Document still loading, adding DOMContentLoaded listener");
    document.addEventListener("DOMContentLoaded", () => {
      console.log(
        "🔍 DOMContentLoaded event fired, calling updateRecentPosts()"
      );
      updateRecentPosts();
    });
  } else {
    // Document already loaded, run immediately
    console.log(
      "🔍 Document already loaded, calling updateRecentPosts() immediately"
    );
    updateRecentPosts();
  }

  console.log("🔍 initRecentPosts completed initial setup");
}
