/**
 * Recent Posts Display Module
 *
 * Fetches and displays all posts sorted by last modification date
 * from the backlinks.json file.
 */

import { type IPage, getProcessedPages } from "./recent-posts-shared";

/**
 * Group pages by month/year for better organization
 * @param pages Array of pages to group
 * @returns Object with month/year keys and arrays of pages
 */
export function groupPagesByMonthYear(pages: IPage[]): {
  [key: string]: IPage[];
} {
  const groupedPages: { [key: string]: IPage[] } = {};

  for (const page of pages) {
    if (!page.last_modified) continue;

    const date = new Date(page.last_modified);
    const monthYear = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!groupedPages[monthYear]) {
      groupedPages[monthYear] = [];
    }

    groupedPages[monthYear].push(page);
  }

  return groupedPages;
}

/**
 * Generate HTML for a group of pages
 * @param groupedPages Object with month/year keys and arrays of pages
 * @returns HTML string
 */
export function generateGroupedPagesHTML(groupedPages: { [key: string]: IPage[] }): string {
  let html = "";

  for (const [monthYear, pages] of Object.entries(groupedPages)) {
    html += `
      <h3>${monthYear}</h3>
      <ul class="last-modified-list">
        ${pages
          .map((page) => {
            const date = new Date(page.last_modified);
            const formattedDate = date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            });

            return `
          <li>
            <span class="date-badge">${formattedDate}</span>
            <a href="${page.url}">${page.title}</a>
            <p class="description">${page.description.split("\n")[0].substring(0, 150)}${
              page.description.length > 150 ? "..." : ""
            }</p>
          </li>
        `;
          })
          .join("")}
      </ul>
    `;
  }

  return html;
}

/**
 * Create toggle section HTML for hidden content
 * @param remainingHtml HTML content to show/hide
 * @param count Number of items in the hidden content
 * @returns HTML string for the toggle section
 */
export function createToggleSection(remainingHtml: string, count: number): string {
  return `
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">▶</span> Remaining Modified Files (${count} more)
      </h2>
      <div id="remaining-posts-content" class="remaining-content" style="display: none;">
        ${remainingHtml}
      </div>
    </div>
  `;
}

/**
 * Generate CSS styles for the posts display
 * @returns CSS styles as a string
 */
export function generateStyles(): string {
  return `
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
  `;
}

/**
 * Setup toggle event listener for expandable content
 * @param toggleId ID of the toggle element
 * @param contentId ID of the content to toggle
 * @param document Document instance (for testing)
 */
export function setupToggleEventListener(
  toggleId = "remaining-posts-toggle",
  contentId = "remaining-posts-content",
  doc: Document = document,
): void {
  const toggleElement = doc.getElementById(toggleId);
  if (!toggleElement) {
    console.log(`Toggle element with ID ${toggleId} not found`);
    return;
  }

  toggleElement.addEventListener("click", function () {
    const contentElement = doc.getElementById(contentId);
    if (!contentElement) {
      console.log(`Content element with ID ${contentId} not found`);
      return;
    }

    const iconElement = this.querySelector(".toggle-icon");
    if (contentElement.style.display === "none") {
      contentElement.style.display = "block";
      iconElement?.classList.add("open");
    } else {
      contentElement.style.display = "none";
      iconElement?.classList.remove("open");
    }
  });
}

/**
 * Generate complete HTML for recent posts display
 * @param pages Array of pages to display
 * @param initialPostsCount Number of posts to show initially (default: 15)
 * @returns Complete HTML for the posts display
 */
export function generateRecentPostsHTML(pages: IPage[], initialPostsCount = 15): string {
  if (pages.length === 0) {
    return "<p>No modified posts found.</p>";
  }

  const initialPages = pages.slice(0, initialPostsCount);
  const remainingPages = pages.slice(initialPostsCount);

  // Group and generate HTML for initial posts
  const groupedPages = groupPagesByMonthYear(initialPages);
  let html = generateGroupedPagesHTML(groupedPages);

  // Add toggle section for remaining posts if any
  if (remainingPages.length > 0) {
    const remainingGroupedPages = groupPagesByMonthYear(remainingPages);
    const remainingHtml = generateGroupedPagesHTML(remainingGroupedPages);
    html += createToggleSection(remainingHtml, remainingPages.length);
  }

  // Add styling
  return generateStyles() + html;
}

/**
 * Updates the recent posts container with post data
 * @param containerId ID of the container element to update
 * @param initialPostsCount Number of posts to show initially
 * @param doc Document instance (for testing)
 */
export async function updateRecentPosts(
  containerId = "last-modified-posts",
  initialPostsCount = 15,
  doc: Document = document,
): Promise<void> {
  const recentContainer = doc.getElementById(containerId);

  if (!recentContainer) {
    console.log(`❌ ${containerId} container not found in DOM`);
    return; // Exit early if container not found
  }

  try {
    // Get fully processed pages from shared module
    const sortedPages = await getProcessedPages();

    // Generate HTML
    const html = generateRecentPostsHTML(sortedPages, initialPostsCount);

    // Update container
    recentContainer.innerHTML = html;

    // Setup toggle functionality
    setupToggleEventListener("remaining-posts-toggle", "remaining-posts-content", doc);
  } catch (error) {
    console.error("❌ Error loading recent posts:", error);
    recentContainer.innerHTML = "<p>Error loading modified posts. Please try again later.</p>";
  }
}

/**
 * Initializes the recent posts component
 * @param containerId ID of the container element
 * @param doc Document instance (for testing)
 */
export function initRecentAllPosts(containerId = "last-modified-posts", doc: Document = document): void {
  // Check if document is already loaded
  if (doc.readyState === "loading") {
    // Document still loading, add event listener
    doc.addEventListener("DOMContentLoaded", () => {
      updateRecentPosts(containerId, 15, doc);
    });
  } else {
    // Document already loaded, run immediately
    updateRecentPosts(containerId, 15, doc);
  }
}
