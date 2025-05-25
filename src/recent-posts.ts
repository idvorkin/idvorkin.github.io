/**
 * Recent Posts Display Module
 *
 * Fetches and displays the most recently modified posts
 * from the backlinks.json file.
 */

import { type IPage, getProcessedPages } from "./recent-posts-shared";

/**
 * Takes a slice of the most recent pages.
 * @param pages The array of sorted pages
 * @param count The number of recent pages to take
 * @returns The array of most recent pages
 */
export function getRecentPages(pages: IPage[], count = 5): IPage[] {
  return pages.slice(0, count);
}

/**
 * Generates HTML for the recent pages.
 * @param recentPages The array of recent pages
 * @returns The HTML string
 */
export function generateRecentPagesHTML(recentPages: IPage[]): string {
  if (recentPages.length === 0) {
    return "<p>No recent posts found.</p>";
  }

  return `
    <ul>
      ${recentPages
        .map(
          (page) => `
        <li>
          <a href="${page.url}">${page.title}</a> - 
          ${page.description.split("\n")[0].substring(0, 100)}${page.description.length > 100 ? "..." : ""}
        </li>
      `,
        )
        .join("")}
    </ul>
  `;
}

/**
 * Updates the recent posts container with post data.
 * @param containerId The ID of the container element, defaults to "recent-posts"
 */
export async function updateRecentPosts(containerId = "recent-posts"): Promise<void> {
  const recentPostsContainer = document.getElementById(containerId);

  if (!recentPostsContainer) {
    console.error(`❌ ${containerId} container not found in DOM`);
    return; // Exit early if container not found
  }

  try {
    // Get fully processed pages from shared module
    const sortedPages = await getProcessedPages();
    const recentPages = getRecentPages(sortedPages);

    // Create and update the HTML
    const html = generateRecentPagesHTML(recentPages);
    recentPostsContainer.innerHTML = html;
  } catch (error) {
    console.error("❌ Error loading recent posts:", error);
    recentPostsContainer.innerHTML = "<p>Error loading recent posts. Please try again later.</p>";
  }
}

/**
 * Initializes the recent posts component.
 * @param containerId The ID of the container element, defaults to "recent-posts"
 * @param doc Document instance (for testing)
 */
export function initRecentPosts(containerId = "recent-posts", doc: Document = document): void {
  // Check if document is already loaded
  if (doc.readyState === "loading") {
    // Document still loading, add event listener
    doc.addEventListener("DOMContentLoaded", () => {
      updateRecentPosts(containerId);
    });
  } else {
    // Document already loaded, run immediately
    updateRecentPosts(containerId);
  }
}
