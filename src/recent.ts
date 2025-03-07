/**
 * Recent Posts Display Module
 *
 * Fetches and displays all posts sorted by last modification date
 * from the backlinks.json file.
 */

import { IURLInfoMap, get_link_info } from "./shared";

interface PageInfo {
  url: string;
  title: string;
  description: string;
  doc_size: number;
  last_modified: string;
}

/**
 * Updates the recent posts container with post data
 */
async function updateRecentPosts(): Promise<void> {
  console.log("🔍 updateRecentPosts function called");

  const recentContainer = document.getElementById("last-modified-posts");
  console.log("🔍 recent-posts container element:", recentContainer);

  if (!recentContainer) {
    console.error("❌ recent-posts container not found in DOM");
    return;
  }

  try {
    console.log("🔍 Fetching back-links.json...");
    // Fetch the backlinks data using the shared function
    const urlInfoMap = await get_link_info();
    console.log(
      "🔍 Number of entries in urlInfoMap:",
      Object.keys(urlInfoMap).length
    );

    // Convert to array of pages for easier processing
    const pages: PageInfo[] = Object.entries(urlInfoMap).map(
      ([url, metadata]) => ({
        url,
        title: metadata.title || url,
        description: metadata.description || "",
        doc_size: metadata.doc_size || 0,
        last_modified: metadata.last_modified || "",
      })
    );
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

    // Sort by last_modified date (newest first)
    const sortedPages = realPages.sort((a, b) => {
      if (a.last_modified && b.last_modified) {
        return (
          new Date(b.last_modified).getTime() -
          new Date(a.last_modified).getTime()
        );
      }
      // Fallback to doc_size if last_modified is not available
      return b.doc_size - a.doc_size;
    });

    // Create the HTML
    if (sortedPages.length === 0) {
      console.warn("⚠️ No pages found after filtering and sorting");
      recentContainer.innerHTML = "<p>No modified posts found.</p>";
      return;
    }

    // Define how many posts to show initially and in the expanded section
    const initialPostsCount = 15;
    const remainingPosts = sortedPages.slice(initialPostsCount);

    // Group initial posts by month/year for better organization
    const groupedPages: { [key: string]: PageInfo[] } = {};

    sortedPages.slice(0, initialPostsCount).forEach(page => {
      if (!page.last_modified) return;

      const date = new Date(page.last_modified);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!groupedPages[monthYear]) {
        groupedPages[monthYear] = [];
      }

      groupedPages[monthYear].push(page);
    });

    // Create HTML with grouped structure for initial posts
    let html = "";

    Object.entries(groupedPages).forEach(([monthYear, pages]) => {
      html += `
        <h3>${monthYear}</h3>
        <ul class="last-modified-list">
          ${pages
            .map(page => {
              const date = new Date(page.last_modified);
              const formattedDate = date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              });

              return `
            <li>
              <span class="date-badge">${formattedDate}</span>
              <a href="${page.url}">${page.title}</a>
              <p class="description">${page.description
                .split("\n")[0]
                .substring(0, 150)}${
                page.description.length > 150 ? "..." : ""
              }</p>
            </li>
          `;
            })
            .join("")}
        </ul>
      `;
    });

    // Add the "Remaining Modified Files" section if there are more posts
    if (remainingPosts.length > 0) {
      // Group remaining posts by month/year
      const remainingGroupedPages: { [key: string]: PageInfo[] } = {};

      remainingPosts.forEach(page => {
        if (!page.last_modified) return;

        const date = new Date(page.last_modified);
        const monthYear = `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()}`;

        if (!remainingGroupedPages[monthYear]) {
          remainingGroupedPages[monthYear] = [];
        }

        remainingGroupedPages[monthYear].push(page);
      });

      // Create the remaining posts HTML (initially hidden)
      let remainingHtml = "";

      Object.entries(remainingGroupedPages).forEach(([monthYear, pages]) => {
        remainingHtml += `
          <h3>${monthYear}</h3>
          <ul class="last-modified-list">
            ${pages
              .map(page => {
                const date = new Date(page.last_modified);
                const formattedDate = date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });

                return `
              <li>
                <span class="date-badge">${formattedDate}</span>
                <a href="${page.url}">${page.title}</a>
                <p class="description">${page.description
                  .split("\n")[0]
                  .substring(0, 150)}${
                  page.description.length > 150 ? "..." : ""
                }</p>
              </li>
            `;
              })
              .join("")}
          </ul>
        `;
      });

      // Add the toggle section
      html += `
        <div class="remaining-posts-section">
          <h2 id="remaining-posts-toggle" class="remaining-toggle">
            <span class="toggle-icon">▶</span> Remaining Modified Files (${remainingPosts.length} more)
          </h2>
          <div id="remaining-posts-content" class="remaining-content" style="display: none;">
            ${remainingHtml}
          </div>
        </div>
      `;
    }

    // Add some CSS for styling
    html = `
      <style>
        .last-modified-list {
          list-style-type: none;
          padding-left: 0;
        }
        .last-modified-list li {
          margin-bottom: 1.5rem;
          position: relative;
        }
        .date-badge {
          display: inline-block;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          margin-right: 0.5rem;
          font-size: 0.8rem;
        }
        .description {
          margin-top: 0.5rem;
          margin-bottom: 0;
          color: #6c757d;
        }
        .remaining-toggle {
          cursor: pointer;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
          margin-top: 2rem;
          transition: background-color 0.3s;
        }
        .remaining-toggle:hover {
          background-color: #e9ecef;
        }
        .toggle-icon {
          display: inline-block;
          transition: transform 0.3s;
        }
        .toggle-icon.open {
          transform: rotate(90deg);
        }
      </style>
      ${html}
    `;

    console.log(
      "🔍 Updating recent-posts content with HTML",
      html.substring(0, 100) + "..."
    );
    recentContainer.innerHTML = html;

    // Add event listener for the toggle
    const toggleElement = document.getElementById("remaining-posts-toggle");
    if (toggleElement) {
      toggleElement.addEventListener("click", function () {
        const contentElement = document.getElementById(
          "remaining-posts-content"
        );
        const iconElement = this.querySelector(".toggle-icon");

        if (contentElement.style.display === "none") {
          contentElement.style.display = "block";
          iconElement.classList.add("open");
        } else {
          contentElement.style.display = "none";
          iconElement.classList.remove("open");
        }
      });
    }

    console.log("✅ Recent posts updated successfully");
  } catch (error) {
    console.error("❌ Error loading recent posts:", error);
    recentContainer.innerHTML =
      "<p>Error loading modified posts. Please try again later.</p>";
  }
}

/**
 * Initializes the recent posts component
 */
export function initRecentAllPosts(): void {
  console.log("🔍 initRecentAllPosts called");

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

  console.log("🔍 initRecentAllPosts completed initial setup");
}
