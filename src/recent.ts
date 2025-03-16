/**
 * Recent Posts Display Module
 *
 * Fetches and displays all posts sorted by last modification date
 * from the backlinks.json file.
 */

import { IPage, getProcessedPages } from "./recent-posts-shared";

/**
 * Group pages by month/year for better organization
 * @param pages Array of pages to group
 * @returns Object with month/year keys and arrays of pages
 */
function groupPagesByMonthYear(pages: IPage[]): { [key: string]: IPage[] } {
  const groupedPages: { [key: string]: IPage[] } = {};

  pages.forEach(page => {
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

  return groupedPages;
}

/**
 * Generate HTML for a group of pages
 * @param groupedPages Object with month/year keys and arrays of pages
 * @returns HTML string
 */
function generateGroupedPagesHTML(groupedPages: {
  [key: string]: IPage[];
}): string {
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

  return html;
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

    // Get fully processed pages from shared module
    const sortedPages = await getProcessedPages();

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
    const groupedPages = groupPagesByMonthYear(
      sortedPages.slice(0, initialPostsCount)
    );

    // Create HTML with grouped structure for initial posts
    let html = generateGroupedPagesHTML(groupedPages);

    // Add the "Remaining Modified Files" section if there are more posts
    if (remainingPosts.length > 0) {
      // Group remaining posts by month/year
      const remainingGroupedPages = groupPagesByMonthYear(remainingPosts);

      // Create the remaining posts HTML (initially hidden)
      const remainingHtml = generateGroupedPagesHTML(remainingGroupedPages);

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
