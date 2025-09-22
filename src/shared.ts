/**
 * Shared utility functions
 *
 * This file contains utility functions that are shared across multiple modules.
 */

/**
 * Creates HTML for a backlink
 */
export function MakeBackLinkHTML(url_info: IURLInfo) {
  const title_href = `<a href=${url_info.url}>${url_info.title}</a>`;
  const class_link = "link-box description truncate-css";
  const output = `
<div>
    <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info.description} <span></div>
</div>`;
  return output;
}

/**
 * Returns a random element from an array
 */
export function random_from_list<T>(list: T[]): T | undefined {
  if (list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Shuffles an array in place
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 * This div gets content from the random_html_factory
 * and clicking does a re-randomize
 */
// Modern defer function that works with ES modules and includes logging
export function defer(fn: () => void, functionName?: string) {
  const name = functionName || fn.name || "anonymous function";

  if (document.readyState === "loading") {
    console.log(`🕐 Deferring ${name} until DOM is ready`);
    document.addEventListener("DOMContentLoaded", () => {
      console.log(`🚀 Executing deferred ${name}`);
      fn();
    });
  } else {
    console.log(`⚡ DOM already ready, executing ${name} immediately`);
    fn();
  }
}

export async function append_randomizer_div(
  parent_id: string | JQuery<HTMLElement>,
  random_html_factory: () => string | Promise<string>,
) {
  // as string to queit type checker.
  // Will be a noop if parent_id is already a jquery object
  const $parent = $(parent_id as string);
  if ($parent.length !== 1) {
    console.log(`append_randomizer_div ${parent_id} not present`);
    return;
  }
  const html = await random_html_factory();
  const new_element = $(html);
  $parent.empty().append(new_element);

  // Clicking on the element should result in a reload, unless you're
  // Clicking on a link
  $parent.click(async (event) => {
    if (event.target.tagName !== "A") {
      const html = await random_html_factory();
      const new_element = $(html);
      $parent.empty().append(new_element);
    }
  });
}

export interface IURLInfoMap {
  [key: string]: IURLInfo;
}

export interface IURLInfo {
  url: string;
  title: string;
  description: string;
  file_path: string;
  outgoing_links: string[];
  incoming_links: string[];
  redirect_url: string;
  doc_size: number;
  last_modified: string;
}

let cached_link_info: IURLInfoMap = null;

/**
 * Creates a modal.run redirect URL that will redirect to the proper blog page
 * @param path - The page path (e.g., "timeoff")
 * @param anchor - Optional anchor/section (e.g., "very-vegetating")
 * @returns The formatted modal.run redirect URL with query parameters
 */
export function makeRedirectUrl(path: string, anchor?: string): string {
  const baseUrl = "https://tinyurl.com/igor-blog/";

  // Combine path and anchor with # if anchor exists
  let fullPath = path;
  if (anchor) {
    fullPath = `${path}#${anchor}`;
  }

  // URL encode the path parameter
  const encodedPath = encodeURIComponent(fullPath);

  // Build the URL with query parameters
  const url = `${baseUrl}?path=${encodedPath}`;

  return url;
}

/**
 * Gets link information from the back-links.json file
 */
export async function get_link_info(url?: string): Promise<IURLInfoMap> {
  if (cached_link_info != null) {
    return cached_link_info;
  }
  const current_url = url || window.location.href;
  const prodPrefix = "https://idvork.in";
  const isProd = current_url.includes(prodPrefix);

  let backlinks_url =
    "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";

  if (!isProd) {
    backlinks_url = "/back-links.json";
  }

  try {
    const response = await fetch(backlinks_url);
    const data = await response.json();
    cached_link_info = data.url_info;
    return cached_link_info;
  } catch (e) {
    console.error("Error fetching link info", e);
    return {};
  }
}

export async function get_random_page_url(): Promise<string> {
  try {
    const linkInfo = await get_link_info();
    const urls = Object.keys(linkInfo).filter((url) => {
      // Filter out non-content pages using exact path matching
      const excludedPaths = ["/404", "/404.html", "/search", "/recent", "/index.html", "/graph", "/about", "/random"];

      // Check if URL ends with any excluded path
      const isExcluded = excludedPaths.some((path) => url === path || url.endsWith(path));

      // Also exclude specific patterns
      const excludedPatterns = [
        "/ig66/", // Exclude all ig66 subdirectory pages
      ];

      const hasExcludedPattern = excludedPatterns.some((pattern) => url.includes(pattern));

      return !isExcluded && !hasExcludedPattern;
    });

    if (urls.length === 0) {
      // Fallback to home if no pages found
      return "/";
    }

    const randomUrl = random_from_list(urls);
    return randomUrl || "/"; // Handle undefined case from random_from_list
  } catch (error) {
    console.error("🚨 Error getting random page URL:", error);
    return "/"; // Fallback to home on error
  }
}
