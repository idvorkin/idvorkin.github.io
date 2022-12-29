// For autocomplete
const { autocomplete, getAlgoliaResults } = window["@algolia/autocomplete-js"];
import { get_link_info, random_from_list } from "./main.js";

// Adding a query paramater.
// import instantsearch from "algoliasearch";

const search_placeholder_text = "Search Igor's Musings ...";

function getParameterByName(name, url): string {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function InstantSearchHitTemplate(hit) {
  // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
  try {
    let url = hit.url;
    if (hit.anchor) {
      url += `#${hit.anchor}`;
    }
    const highlighted = hit._highlightResult;

    if (!highlighted) {
      console.log("No Highlight", hit);
    }
    const title = highlighted.title.value;
    const content = highlighted?.content?.value ?? "";
    // <section class="notepad-post-excerpt"><p>${content}</p></section>

    const string_rep = `
           <span onClick="window.location='${url}';">
              <b> <a href="${url}">${title}</a></b> <span>${content}</span>
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

function CreateSearch(appid, search_api_key, index_name, initial_query) {
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
    })
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
    })
  );

  return search;
}

// Copied from the docs, but this isn't working for me.
function AutoCompleteHitTemplateWithComponentDoesNotWork({
  item,
  components,
  createElement,
  fragments,
}) {
  console.log(item);
  return components.Highlight({ hit: item });
}

// Algolia uses some PREACT thing, which this project does not support
// Reach way into algolia and build the HTML manually
function AutoCompleteHitTemplate({ item, createElement }) {
  // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
  return createElement("div", {
    dangerouslySetInnerHTML: {
      __html: InstantSearchHitTemplate(item),
    },
  });
}

async function get_random_post() {
  const all_url_info = await get_link_info();
  //  Yuk, find a clearere way to do this
  const all_pages = Object.entries(all_url_info) // returns a list of [url, info]
    .map(e => e[1]);
  const random_post = random_from_list(all_pages);
  const ret = {
    title: random_post["title"],
    url: random_post["url"],
    description: random_post["description"],
  };
  return ret;
}

const count_random_posts_to_show = 10;
async function GetDefaultSearchResults() {
  return {
    sourceId: "links",
    async getItems() {
      const sized_array = new Array(count_random_posts_to_show)
        .join("_")
        .split("_");
      const random_posts = await Promise.all(
        sized_array.map(async e => get_random_post())
      );
      return random_posts;
    },
    getItemUrl({ item }) {
      // console.log("getItemUrl ", item);
      const ret = item.url;
      // console.log("ret", ret);
      return ret;
    },
    templates: {
      item({ item, createElement }) {
        return createElement("div", {
          dangerouslySetInnerHTML: {
            __html: `
            <span onClick="window.location='${item.url}';" >
           <b> <a href="${item.url}">${item.title}</a></b>
            <span>${item.description}</span>
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
    // ...
  };
}

function GetAlgoliaResults(
  searchClient,
  index_name,
  query,
  hitsPerPage: number,
  includeFamilyJournal = false
) {
  // By default don't include family journal.
  let filter = "NOT tags:family-journal";
  if (includeFamilyJournal) {
    filter = "";
  }

  return {
    sourceId: "from_search",
    getItems() {
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
      // console.log("getItemUrl ", item);
      // console.log("ret", ret);
      return ret;
    },
  };
}
async function CreateAutoComplete(
  appid,
  search_api_key,
  index_name,
  autocomplete_id,
  includeFamilyJournal
) {
  const searchClient = algoliasearch(appid, search_api_key);
  const defaultSearchResults = await GetDefaultSearchResults();
  function GetSources({ query }) {
    const isEmptySearch = query.length === 0;
    if (isEmptySearch) {
      // Searching for a space gives nice default results, so when no results search for that ...
      // TODO: Consider including the recent search history as well
      query = " ";
    }
    const algoliaResults = GetAlgoliaResults(
      searchClient,
      index_name,
      query,
      isEmptySearch ? 4 : 10,
      includeFamilyJournal
    );
    const results = [algoliaResults];
    if (isEmptySearch) {
      results.push(defaultSearchResults);
      // results = [GetDefaultSearchResults];
    }
    return results;
  }
  if (!$(autocomplete_id).length) {
    console.log(
      "No autocomplete element found",
      "autocomplete_id",
      autocomplete_id
    );
    return;
  }
  // Setup Auto Complete Stuff
  return autocomplete({
    container: "#autocomplete-search-box",
    placeholder: search_placeholder_text,
    getSources: GetSources,
    debug: false,
    openOnFocus: true,
    detachedMediaQuery: "",
  });
}

export { CreateSearch, getParameterByName, CreateAutoComplete };
