// Import dependencies
import { get_link_info, random_from_list } from "./shared";

// For autocomplete, safely access the window properties
// This makes it more testable
let autocomplete: any;
let getAlgoliaResults: any;
if (typeof window !== "undefined" && window["@algolia/autocomplete-js"]) {
  const algoliaAutocomplete = window["@algolia/autocomplete-js"];
  autocomplete = algoliaAutocomplete.autocomplete;
  getAlgoliaResults = algoliaAutocomplete.getAlgoliaResults;
}

// Adding a query parameter.
// import instantsearch from "algoliasearch";

export const search_placeholder_text = "Search Igor's Musings ...";

/**
 * Helper function to escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

/**
 * Helper function to validate URLs
 */
function isValidUrl(url: string): boolean {
  if (!url) return false;

  // Allow relative URLs (starting with /)
  if (url.startsWith("/")) {
    return true;
  }

  // Allow well-formed absolute URLs
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Gets a query parameter value from a URL
 * @param name Parameter name
 * @param url URL to extract from (defaults to window.location.href)
 * @returns Parameter value, empty string if parameter exists with no value, or null if parameter doesn't exist
 */
export function getParameterByName(name: string, url?: string): string | null {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]\\]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Generates HTML for an Algolia search hit
 * @param hit Algolia search hit
 * @returns HTML string
 */
export function InstantSearchHitTemplate(hit) {
  // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
  try {
    let url = hit.url;
    if (hit.anchor) {
      url += `#${hit.anchor}`;
    }

    // Validate URL before using it
    if (!isValidUrl(url)) {
      console.warn("Invalid URL skipped in InstantSearchHitTemplate:", url);
      return "<div>Invalid result</div>";
    }

    const highlighted = hit._highlightResult;

    if (!highlighted) {
      console.log("No Highlight", hit);
    }
    const title = highlighted.title.value;
    const content = highlighted?.content?.value ?? "";
    // <section class="notepad-post-excerpt"><p>${content}</p></section>

    // Use data attribute instead of onclick for better security
    const string_rep = `
           <span data-url="${escapeHtml(url)}" style="cursor: pointer;">
              <b> <a href="${escapeHtml(url)}">${title}</a></b> <span>${content}</span>
           </span>
        `;
    return string_rep;
  } catch (err) {
    console.log("Error in hitTemplate", err, hit);
  }
  return "invalid HTML";
}

declare function instantsearch(l: any): any;
declare function algoliasearch(l: any, l2: any): any;

/**
 * Creates an Algolia InstantSearch instance
 * @param appid Algolia app ID
 * @param search_api_key Algolia search API key
 * @param index_name Algolia index name
 * @param initial_query Initial search query
 * @returns InstantSearch instance
 */
export function CreateSearch(appid, search_api_key, index_name, initial_query) {
  // Instanciating InstantSearch.js with Algolia credentials
  const searchClient = algoliasearch(appid, search_api_key);
  const search = instantsearch({
    searchClient: searchClient,
    indexName: index_name,
    searchParameters: {
      query: initial_query,
    },
  });

  // Adding searchbar and results widgets
  search.addWidget(
    // @ts-ignore:TS2339
    instantsearch.widgets.searchBox({
      container: "#search-box",
      placeholder: search_placeholder_text,
      poweredBy: true, // This is required if you're on the free Community plan
      showSubmit: false,
      showReset: false,
      showLoadingIndicator: false,
    }),
  );

  search.addWidget(
    // @ts-ignore:TS2339
    instantsearch.widgets.infiniteHits({
      container: "#search-hits",
      templates: {
        item: InstantSearchHitTemplate,
      },
      item({ item }) {
        return `Result: ${item.name}`;
      },
    }),
  );

  return search;
}

// Copied from the docs, but this isn't working for me.
export function AutoCompleteHitTemplateWithComponentDoesNotWork({ item, components, createElement, fragments }) {
  console.log(item);
  return components.Highlight({ hit: item });
}

// Algolia uses some PREACT thing, which this project does not support
// Reach way into algolia and build the HTML manually
export function AutoCompleteHitTemplate({ item, createElement }) {
  // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
  // Note: InstantSearchHitTemplate now includes URL validation and HTML escaping for security
  return createElement("div", {
    dangerouslySetInnerHTML: {
      __html: InstantSearchHitTemplate(item),
    },
  });
}

/**
 * Gets a random post from the backlinks
 * @returns Random post with title, URL, and description
 */
export async function get_random_post() {
  const startTime = performance.now();
  const all_url_info = await get_link_info();
  const loadTime = performance.now() - startTime;
  console.log(`  📊 [get_random_post] Loaded links in ${loadTime.toFixed(0)}ms`);

  //  Yuk, find a clearere way to do this
  const all_pages = Object.entries(all_url_info) // returns a list of [url, info]
    .map((e) => e[1]);
  const random_post = random_from_list(all_pages);
  const ret = {
    title: random_post.title,
    url: random_post.url,
    description: random_post.description,
  };
  return ret;
}

/**
 * Gets multiple random posts efficiently
 * @param count Number of random posts to return
 * @returns Array of random posts
 */
export async function get_random_posts_batch(count = 4) {
  const startTime = performance.now();
  const all_url_info = await get_link_info();
  const loadTime = performance.now() - startTime;
  console.log(`  📊 [get_random_posts_batch] Loaded links once in ${loadTime.toFixed(0)}ms`);

  const all_pages = Object.entries(all_url_info).map((e) => e[1]);
  const results = [];
  const usedIndices = new Set();

  // Get unique random posts
  while (results.length < count && results.length < all_pages.length) {
    const randomIndex = Math.floor(Math.random() * all_pages.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      const post = all_pages[randomIndex];
      results.push({
        title: post.title,
        url: post.url,
        description: post.description,
      });
    }
  }

  return results;
}

/**
 * Gets recent posts from the back-links.json file
 * Returns the specified number of most recently modified posts
 * @param count Number of posts to return
 */
export async function get_recent_posts(count = 4) {
  try {
    const startTime = performance.now();
    const all_url_info = await get_link_info();
    const loadTime = performance.now() - startTime;
    console.log(`  📊 [get_recent_posts] Loaded links in ${loadTime.toFixed(0)}ms`);

    // Convert to array of pages for easier processing
    const pages = Object.entries(all_url_info).map(([url, metadata]) => ({
      url,
      title: metadata.title || url,
      description: metadata.description || "",
      doc_size: metadata.doc_size || 0,
      last_modified: metadata.last_modified || "",
    }));

    // Filter out pages that are likely redirects (these have empty descriptions and titles)
    const realPages = pages.filter(
      (page) => page.description && page.description.trim() !== "" && page.title && page.title.trim() !== "",
    );

    // Sort by last_modified date (newest first)
    const sortedPages = realPages.sort((a, b) => {
      if (a.last_modified && b.last_modified) {
        return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
      }
      // Fallback to doc_size if last_modified is not available
      return b.doc_size - a.doc_size;
    });

    // Take the top N most recent posts
    return sortedPages.slice(0, count);
  } catch (error) {
    console.error("❌ Error loading recent posts:", error);
    return [];
  }
}

/**
 * Gets random posts for search results
 * @param count Number of random posts to return (default: 3)
 */
export async function GetRandomSearchResults(count = 3) {
  return {
    sourceId: "random_posts",
    async getItems() {
      const sized_array = new Array(count).join("_").split("_");
      const random_posts = await Promise.all(
        sized_array.map(async (e) => {
          try {
            return await get_random_post();
          } catch (error) {
            console.error("Error getting random post:", error);
            return { url: "", title: "Error", description: "Failed to load post" };
          }
        }),
      );
      return random_posts;
    },
    getItemUrl({ item }) {
      const ret = item.url;
      return ret;
    },
    templates: {
      item({ item, createElement }) {
        // Validate URL before using it
        if (!isValidUrl(item.url)) {
          console.warn("Invalid URL skipped in GetRandomSearchResults:", item.url);
          return createElement("div", {
            dangerouslySetInnerHTML: {
              __html: "<div>Invalid result</div>",
            },
          });
        }

        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${escapeHtml(item.url)}" style="cursor: pointer;">
           <b> <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></b>
            <span>${escapeHtml(item.description)}</span>
            </span>
            `,
          },
        });
      },
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Random posts ...</i>",
          },
        });
      },
    },
  };
}

/**
 * Gets recent posts for search results
 * @param count Number of recent posts to return (default: 4)
 */
export async function GetRecentSearchResults(count = 4) {
  return {
    sourceId: "recent_posts",
    async getItems() {
      const recentPosts = await get_recent_posts(count);
      return recentPosts;
    },
    getItemUrl({ item }) {
      const ret = item.url;
      return ret;
    },
    templates: {
      item({ item, createElement }) {
        // Validate URL before using it
        if (!isValidUrl(item.url)) {
          console.warn("Invalid URL skipped in GetRecentSearchResults:", item.url);
          return createElement("div", {
            dangerouslySetInnerHTML: {
              __html: "<div>Invalid result</div>",
            },
          });
        }

        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span data-url="${escapeHtml(item.url)}" style="cursor: pointer;">
           <b> <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></b>
            <span>${escapeHtml(item.description)}</span>
            </span>
            `,
          },
        });
      },
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Recent posts ...</i>",
          },
        });
      },
    },
  };
}

/**
 * Gets featured posts from Algolia search
 * @param searchClient Algolia search client
 * @param index_name Index name to search
 * @param query Search query
 * @param hitsPerPage Number of results to return (default: 3)
 * @param includeFamilyJournal Whether to include family journal posts
 */
export function GetAlgoliaResults(searchClient, index_name, query, hitsPerPage = 3, includeFamilyJournal = false) {
  // By default don't include family journal.
  let filter = "NOT tags:family-journal";
  if (includeFamilyJournal) {
    filter = "";
  }

  return {
    sourceId: "featured_posts",
    getItems() {
      if (!getAlgoliaResults) {
        console.error("getAlgoliaResults is not defined");
        return [];
      }
      return getAlgoliaResults({
        searchClient,
        queries: [
          {
            indexName: index_name,
            query,
            filters: filter,
            params: {
              hitsPerPage: hitsPerPage,
              highlightPreTag: "<span style='background:yellow'>",
              highlightPostTag: "</span>",
            },
          },
        ],
      });
    },
    templates: {
      item: AutoCompleteHitTemplate,
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Featured posts ...</i>",
          },
        });
      },
    },
    getItemUrl({ item }) {
      let url = item.url;
      if (item.anchor) {
        url += `#${item.anchor}`;
      }
      const ret = url;
      return ret;
    },
  };
}

/**
 * Creates an autocomplete search component
 * @param appid Algolia app ID
 * @param search_api_key Algolia search API key
 * @param index_name Algolia index name
 * @param autocomplete_id ID of the autocomplete element
 * @param includeFamilyJournal Whether to include family journal posts
 * @param featuredCount Number of featured posts to show (default: 3)
 * @param recentCount Number of recent posts to show (default: 4)
 * @param randomCount Number of random posts to show (default: 3)
 */
export async function CreateAutoComplete(
  appid,
  search_api_key,
  index_name,
  autocomplete_id,
  includeFamilyJournal,
  featuredCount = 3,
  recentCount = 4,
  randomCount = 3,
) {
  if (!autocomplete) {
    console.error("Autocomplete is not defined");
    return;
  }

  const searchClient = algoliasearch(appid, search_api_key);
  const randomSearchResults = await GetRandomSearchResults(randomCount);
  const recentSearchResults = await GetRecentSearchResults(recentCount);

  function GetSources({ query }) {
    const isEmptySearch = query.length === 0;
    if (isEmptySearch) {
      // Searching for a space gives nice default results, so when no results search for that ...
      query = " ";
    }

    // Get featured posts (from Algolia search)
    const featuredPosts = GetAlgoliaResults(
      searchClient,
      index_name,
      query,
      isEmptySearch ? featuredCount : 10, // Show N featured posts when empty, more when searching
      includeFamilyJournal,
    );

    // For empty search, show featured, recent, and random posts
    // For actual search, just show search results
    if (isEmptySearch) {
      return [featuredPosts, recentSearchResults, randomSearchResults];
    }
    return [featuredPosts];
  }

  // Make sure we have the element
  // autocomplete_id can be either '#id' or just 'id'
  const elementId = autocomplete_id.startsWith("#") ? autocomplete_id : `#${autocomplete_id}`;
  if ($(elementId).length === 0) {
    console.log("No autocomplete element found", "autocomplete_id", autocomplete_id);
    return;
  }

  // Setup Auto Complete Stuff
  return autocomplete({
    container: elementId,
    placeholder: search_placeholder_text,
    getSources: GetSources,
    debug: false,
    openOnFocus: true,
    detachedMediaQuery: "",
  });
}
