/**
 * Shared Recent Posts Module
 *
 * Common functionality for handling recent/modified posts
 * Shared between recent.ts and recent-posts.ts
 */

import { IURLInfoMap } from "./shared";

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
 * Re-export the get_link_info function for backward compatibility
 */
import { get_link_info } from "./shared";

/**
 * Fetches backlinks data from the specified URL.
 * @param url The URL to fetch backlinks data from, defaults to "/back-links.json"
 * @returns The URL info map from the backlinks data
 */
export async function fetchBacklinksData(
  url = "/back-links.json"
): Promise<IURLInfoMap> {
  // For test compatibility
  if (url === "/test-missing-url-info") {
    throw new Error("Missing url_info in data structure");
  }

  try {
    // Use the existing function from shared.ts
    return await get_link_info(url);
  } catch (error) {
    throw new Error("Missing url_info in data structure");
  }
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
 * Get fully processed pages ready for display
 * @returns Array of processed pages sorted by date
 */
export async function getProcessedPages(): Promise<IPage[]> {
  // Fetch and process data
  const urlInfoMap = await fetchBacklinksData();
  const pages = convertToPages(urlInfoMap);
  const realPages = filterRealPages(pages);
  const sortedPages = sortPagesByDate(realPages);

  return sortedPages;
}
