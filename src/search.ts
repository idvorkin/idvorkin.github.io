/**
 * Blog search — Pagefind (full text) + MiniSearch (typo-tolerant titles).
 *
 * Replaced Algolia. Both engines run entirely in the browser against static
 * files, so there is no service to keep alive, no API key, and no quota.
 *
 * Why two engines: Pagefind shards its index and only fetches the chunks a
 * query needs (~200-300KB on first search, ~3KB per result after), which is
 * what makes full-text search affordable client side. But its typo tolerance is
 * poor — "ketlebell" ranks unrelated pages. MiniSearch over a ~9KB title-only
 * index fixes that for the common case of a misspelled title. Results merge,
 * Pagefind first.
 *
 * See docs/search.md.
 */

// MiniSearch is NOT imported statically: it is ~15KB gzipped and only needed
// once someone actually searches. A static import put it in the main bundle on
// every page view (19KB -> 34KB gzipped). It is dynamically imported in
// loadTitleIndex() instead, which Vite emits as a separate chunk.
import type MiniSearchType from "minisearch";
// Import dependencies
import { get_link_info, random_from_list } from "./shared";

/**
 * Resolves the autocomplete widget factory at CALL time, not import time.
 *
 * autocomplete-js is only the UI shell — it is source-agnostic and no longer
 * talks to Algolia's service. It arrives from a CDN <script> tag, and reading it
 * once when this module is first evaluated meant that if the bundle ran before
 * that script finished loading, `autocomplete` stayed undefined forever and
 * search silently never initialized.
 */
function getAutocomplete(): any {
  if (typeof window === "undefined") return undefined;
  return window["@algolia/autocomplete-js"]?.autocomplete;
}

export const search_placeholder_text = "Search Igor's Musings ...";

/** Where Pagefind's generated index lives, relative to the site root. */
const PAGEFIND_BASE = "/pagefind/";
/** Jekyll-generated title index (see search-titles.json). */
const TITLE_INDEX_URL = "/search-titles.json";

/**
 * Helper function to escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

/**
 * Escapes a value for a double-quoted HTML attribute. escapeHtml alone is not
 * enough there: textContent -> innerHTML escapes & < > but leaves `"` intact,
 * which would let a quote in the value close the attribute.
 */
function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
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
 * Pagefind reports URLs as built file paths (`/kettlebell.html`), but the blog's
 * canonical permalinks are extensionless (`/kettlebell`). Both resolve on
 * GitHub Pages, so this is cosmetic — but links should match the real permalink
 * so they don't look foreign and don't split analytics.
 */
export function normalizeUrl(url: string): string {
  if (!url) return url;
  return url.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
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

/** A single search result, engine-agnostic. */
export interface ISearchResult {
  url: string;
  title: string;
  /** May contain Pagefind's <mark> highlight tags. Already escaped by Pagefind. */
  excerpt: string;
  source: "pagefind" | "title" | "pinned";
}

// ---------------------------------------------------------------------------
// Pins (stack-ranked policy results)
// ---------------------------------------------------------------------------

/** Curated pins config, published from _data/search_pins.yml. */
const PINS_URL = "/search-pins.json";

interface ISearchPinRule {
  match: string[];
  urls: Array<{ url: string; title?: string }>;
}

let pinsPromise: Promise<ISearchPinRule[] | null> | null = null;

/** Memoized pins config; null (organic-only search) when it can't be loaded. */
async function loadSearchPins(): Promise<ISearchPinRule[] | null> {
  if (!pinsPromise) {
    pinsPromise = (async () => {
      const resp = await fetch(PINS_URL);
      if (!resp.ok) throw new Error(`pins config HTTP ${resp.status}`);
      return (await resp.json()) as ISearchPinRule[];
    })().catch((err) => {
      console.warn("Search pins unavailable:", err);
      pinsPromise = null;
      return null;
    });
  }
  return pinsPromise;
}

/**
 * Spacing-insensitive comparison key: "Time-Off" and "time off" both become
 * "timeoff", so one match phrase covers every way a reader types it.
 */
function spaceless(text: string): string {
  return text.toLowerCase().replace(/[\s-]+/g, "");
}

/**
 * Policy hits for a query: every rule whose match phrase is CONTAINED in the
 * query (spacing-insensitive) contributes its urls, in config order — the
 * config list is an explicit stack rank. Titles and descriptions resolve from
 * back-links.json; a redirect page has no metadata there, so the config's own
 * `title` is the fallback.
 */
async function searchPins(query: string): Promise<ISearchResult[]> {
  const rules = await loadSearchPins();
  if (!rules || rules.length === 0) return [];
  const q = spaceless(query);
  const matched = rules.filter((r) => r.match?.some((phrase) => phrase && q.includes(spaceless(phrase))));
  if (matched.length === 0) return [];
  const linkInfo = await get_link_info().catch(() => ({}) as any);
  return matched
    .flatMap((r) => r.urls || [])
    .map((pin) => ({
      url: pin.url,
      title: linkInfo?.[pin.url]?.title || pin.title || pin.url,
      excerpt: linkInfo?.[pin.url]?.description || "",
      source: "pinned" as const,
    }))
    .filter((r) => isValidUrl(r.url));
}

// ---------------------------------------------------------------------------
// Pagefind (full text)
// ---------------------------------------------------------------------------

let pagefindPromise: Promise<any> | null = null;

/**
 * Loads Pagefind's runtime on demand. The index is only fetched when someone
 * actually searches, so the cost never lands on a normal page view.
 *
 * The @vite-ignore is required: this path only exists after `just build-search`
 * generates it into _site, so Vite must not try to resolve it at build time.
 */
export async function loadPagefind(): Promise<any> {
  if (!pagefindPromise) {
    pagefindPromise = (async () => {
      const pf = await import(/* @vite-ignore */ `${PAGEFIND_BASE}pagefind.js`);
      await pf.options({ basePath: PAGEFIND_BASE });
      return pf;
    })().catch((err) => {
      // Reset so a later search can retry rather than being stuck on a failure
      // from, say, a dev server that hadn't built the index yet.
      pagefindPromise = null;
      throw err;
    });
  }
  return pagefindPromise;
}

/**
 * Full-text search. Returns [] rather than throwing when the index is missing,
 * so a dev server without a built index degrades to title-only search instead
 * of showing an error.
 */
export async function searchPagefind(query: string, limit = 10): Promise<ISearchResult[]> {
  if (!query || !query.trim()) return [];
  try {
    const pf = await loadPagefind();
    const search = await pf.search(query);
    const top = search.results.slice(0, limit);
    const data = await Promise.all(top.map((r: any) => r.data()));
    return data
      .map((d: any) => ({
        url: normalizeUrl(d.url),
        title: d.meta?.title || d.url,
        excerpt: d.excerpt || "",
        source: "pagefind" as const,
      }))
      .filter((r) => isValidUrl(r.url));
  } catch (err) {
    console.warn("Pagefind unavailable, falling back to title search:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// MiniSearch (typo-tolerant titles)
// ---------------------------------------------------------------------------

let titleIndexPromise: Promise<MiniSearchType | null> | null = null;

/**
 * Builds the fuzzy title index from the Jekyll-generated JSON. Memoized — the
 * library chunk and the ~9KB payload are each fetched once per page, and only
 * when a search actually happens.
 */
export async function loadTitleIndex(): Promise<MiniSearchType | null> {
  if (!titleIndexPromise) {
    titleIndexPromise = (async () => {
      const [{ default: MiniSearch }, resp] = await Promise.all([import("minisearch"), fetch(TITLE_INDEX_URL)]);
      if (!resp.ok) throw new Error(`title index HTTP ${resp.status}`);
      const raw = (await resp.json()) as Array<{ t: string; u: string }>;
      const docs = raw.map((d, i) => ({ id: i, title: d.t, url: d.u }));
      const ms = new MiniSearch({
        fields: ["title"],
        storeFields: ["title", "url"],
      });
      ms.addAll(docs);
      return ms;
    })().catch((err) => {
      console.warn("Title index unavailable:", err);
      titleIndexPromise = null;
      return null;
    });
  }
  return titleIndexPromise;
}

/**
 * Fuzzy title search. `fuzzy: 0.3` tolerates roughly one edit per three
 * characters, which recovers "ketlebell" -> "Kettlebells" without turning short
 * queries into noise. Prefix matching handles partially typed words.
 */
export async function searchTitles(query: string, limit = 5): Promise<ISearchResult[]> {
  if (!query || !query.trim()) return [];
  const ms = await loadTitleIndex();
  if (!ms) return [];
  const linkInfo = await get_link_info().catch(() => ({}) as any);
  return ms
    .search(query, { fuzzy: 0.3, prefix: true })
    .slice(0, limit)
    .map((r: any) => ({
      url: r.url,
      title: r.title,
      excerpt: linkInfo?.[r.url]?.description || "",
      source: "title" as const,
    }))
    .filter((r) => isValidUrl(r.url));
}

// ---------------------------------------------------------------------------
// Merged search
// ---------------------------------------------------------------------------

/**
 * Runs both engines and merges. Pagefind results rank first because an exact
 * full-text hit beats a fuzzy title guess; title hits fill in below and are the
 * only thing that survives a typo. Deduped by URL.
 */
export async function searchBlog(query: string, limit = 10): Promise<ISearchResult[]> {
  if (!query || !query.trim()) return [];
  const [pinned, full, titles] = await Promise.all([
    searchPins(query),
    searchPagefind(query, limit),
    searchTitles(query, 5),
  ]);

  const seen = new Set<string>();
  const merged: ISearchResult[] = [];
  for (const r of [...pinned, ...full, ...titles]) {
    if (seen.has(r.url)) continue;
    seen.add(r.url);
    merged.push(r);
  }
  return merged.slice(0, limit);
}

/**
 * Clears the memoized Pagefind runtime and title index.
 *
 * Both loaders cache on first success so a page only pays for them once. Tests
 * that exercise the failure paths need to drop that cache, otherwise an earlier
 * successful load makes a later "index unreachable" case silently pass.
 */
export function __resetSearchCaches(): void {
  pagefindPromise = null;
  titleIndexPromise = null;
  pinsPromise = null;
}

/**
 * Excerpt as safe HTML.
 *
 * Pagefind excerpts are already HTML-escaped by Pagefind and carry <mark>
 * highlight tags, so they pass through. Title-source excerpts are raw
 * descriptions out of back-links.json and MUST be escaped here.
 */
export function excerptHtml(hit: ISearchResult): string {
  return hit.source === "pagefind" ? hit.excerpt || "" : escapeHtml(hit.excerpt || "");
}

/**
 * Renders one result. Titles and URLs are always escaped; the excerpt is
 * handled by excerptHtml above.
 */
export function renderSearchHit(hit: ISearchResult): string {
  if (!isValidUrl(hit.url)) {
    console.warn("Invalid URL skipped in renderSearchHit:", hit.url);
    return "<div>Invalid result</div>";
  }
  const safeUrl = escapeAttr(hit.url);
  return `
           <span data-url="${safeUrl}" style="cursor: pointer;">
              <b> <a href="${safeUrl}">${escapeHtml(hit.title)}</a></b> <span>${excerptHtml(hit)}</span>
           </span>
        `;
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
            <span data-url="${escapeAttr(item.url)}" style="cursor: pointer;">
           <b> <a href="${escapeAttr(item.url)}">${escapeHtml(item.title)}</a></b>
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
            <span data-url="${escapeAttr(item.url)}" style="cursor: pointer;">
           <b> <a href="${escapeAttr(item.url)}">${escapeHtml(item.title)}</a></b>
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
 * Autocomplete source backed by local search.
 * @param query Search query
 * @param hitsPerPage Number of results to return
 */
export function GetLocalSearchResults(query: string, hitsPerPage = 10) {
  return {
    sourceId: "featured_posts",
    async getItems() {
      return await searchBlog(query, hitsPerPage);
    },
    templates: {
      item({ item, createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: renderSearchHit(item as ISearchResult),
          },
        });
      },
      header({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>Results ...</i>",
          },
        });
      },
      noResults({ createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: "<i style='color:grey'>No results. Try different keywords.</i>",
          },
        });
      },
    },
    getItemUrl({ item }) {
      return item.url;
    },
  };
}

/**
 * Creates the autocomplete search component.
 *
 * Signature changed when Algolia was removed: there is no app id, API key, or
 * index name any more, and no `includeFamilyJournal` flag — the family journal
 * is excluded at index time, so there is nothing to filter at query time.
 *
 * @param autocomplete_id ID of the autocomplete element ('#foo' or 'foo')
 * @param options Result counts
 */
export async function CreateAutoComplete(
  autocomplete_id: string,
  options: { featuredCount?: number; recentCount?: number; randomCount?: number } = {},
) {
  const { featuredCount = 10, recentCount = 4, randomCount = 3 } = options;

  const autocomplete = getAutocomplete();
  if (!autocomplete) {
    console.error("Autocomplete is not defined");
    return;
  }

  const randomSearchResults = await GetRandomSearchResults(randomCount);
  const recentSearchResults = await GetRecentSearchResults(recentCount);

  function GetSources({ query }) {
    const isEmptySearch = !query || query.length === 0;

    // With no query there is nothing to full-text search, so show the curated
    // default view instead. (Algolia used a " " query for this; Pagefind has no
    // equivalent and doesn't need one.)
    if (isEmptySearch) {
      return [recentSearchResults, randomSearchResults];
    }
    return [GetLocalSearchResults(query, featuredCount)];
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
