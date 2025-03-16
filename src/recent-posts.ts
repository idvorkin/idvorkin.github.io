/**
 * Recent Posts Display Module
 *
 * Fetches and displays the most recently modified posts
 * from the backlinks.json file.
 */

import { IURLInfoMap, IURLInfo } from "./shared";

/**
 * Represents the simplified structure of a page for display.
 */
export interface IPage {
  url: string;
  title: string;
  description: string;
  doc_size: number;
  last_modified: string;
}

/**
 * Fetches backlinks data from the specified URL.
 * @param url The URL to fetch backlinks data from, defaults to "/back-links.json"
 * @returns The URL info map from the backlinks data
 */
export async function fetchBacklinksData(
  url = "/back-links.json"
): Promise<IURLInfoMap> {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.url_info) {
    throw new Error("Missing url_info in data structure");
  }

  return data.url_info;
}

/**
 * Converts URL info map to an array of page objects.
 * @param urlInfoMap The URL info map to convert
 * @returns An array of page objects
 */
export function convertToPages(urlInfoMap: IURLInfoMap): IPage[] {
  return Object.entries(urlInfoMap).map(([url, metadata]) => ({
    url,
    title: metadata.title || url,
    description: metadata.description || "",
    doc_size: metadata.doc_size || 0,
    last_modified: metadata.last_modified || "",
  }));
}

/**
 * Filters out pages that are likely redirects (have empty descriptions and titles).
 * @param pages The array of pages to filter
 * @returns The filtered array of pages
 */
export function filterRealPages(pages: IPage[]): IPage[] {
  return pages.filter(
    page =>
      page.description &&
      page.description.trim() !== "" &&
      page.title &&
      page.title.trim() !== ""
  );
}

/**
 * Sorts pages by last_modified date (newest first) with fallback to doc_size.
 * @param pages The array of pages to sort
 * @returns The sorted array of pages
 */
export function sortPagesByDate(pages: IPage[]): IPage[] {
  return [...pages].sort((a, b) => {
    if (a.last_modified && b.last_modified) {
      return (
        new Date(b.last_modified).getTime() -
        new Date(a.last_modified).getTime()
      );
    }
    // Fallback to doc_size if last_modified is not available
    return b.doc_size - a.doc_size;
  });
}

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
}

/**
 * Updates the recent posts container with post data.
 * @param containerId The ID of the container element, defaults to "recent-posts"
 */
export async function updateRecentPosts(
  containerId = "recent-posts"
): Promise<void> {
  console.log("🔍 updateRecentPosts function called");

  const recentPostsContainer = document.getElementById(containerId);
  console.log(
    "🔍 recent-posts container element:",
    recentPostsContainer ? "found" : "not found"
  );

  if (!recentPostsContainer) {
    console.error(`❌ ${containerId} container not found in DOM`);
    return;
  }

  try {
    console.log("🔍 Fetching back-links.json...");

    // Process the data
    const urlInfoMap = await fetchBacklinksData();
    console.log(
      "🔍 Number of entries in urlInfoMap:",
      Object.keys(urlInfoMap).length
    );

    const pages = convertToPages(urlInfoMap);
    console.log("🔍 Transformed pages array, length:", pages.length);

    const realPages = filterRealPages(pages);
    console.log("🔍 Filtered real pages, length:", realPages.length);

    const sortedPages = sortPagesByDate(realPages);
    console.log(
      "🔍 Sorted pages, first 5:",
      sortedPages.slice(0, 5).map(p => ({
        url: p.url,
        title: p.title,
        last_modified: p.last_modified,
      }))
    );

    const recentPages = getRecentPages(sortedPages);

    // Create and update the HTML
    const html = generateRecentPagesHTML(recentPages);

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
 * Initializes the recent posts component.
 * @param containerId The ID of the container element, defaults to "recent-posts"
 */
export function initRecentPosts(containerId = "recent-posts"): void {
  console.log("🔍 initRecentPosts called");

  // Check if document is already loaded
  if (document.readyState === "loading") {
    // Document still loading, add event listener
    console.log("🔍 Document still loading, adding DOMContentLoaded listener");
    document.addEventListener("DOMContentLoaded", () => {
      console.log(
        "🔍 DOMContentLoaded event fired, calling updateRecentPosts()"
      );
      updateRecentPosts(containerId);
    });
  } else {
    // Document already loaded, run immediately
    console.log(
      "🔍 Document already loaded, calling updateRecentPosts() immediately"
    );
    updateRecentPosts(containerId);
  }

  console.log("🔍 initRecentPosts completed initial setup");
}
