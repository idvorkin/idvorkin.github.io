// For autocomplete
const { autocomplete, getAlgoliaResults } = window["@algolia/autocomplete-js"];

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
            <h3><a href="${url}">${title}</a></h3>
            <p>${content}</p>
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

function CreateAutoComplete(appid, search_api_key, index_name) {
  const searchClient = algoliasearch(appid, search_api_key);
  function GetSources({ query }) {
    if (query.length == 0) {
      // Searching for a space gives nice default results
      // so when no results search for that ...
      // TODO: Consider including the recent search history as well
      // And perhaps include the page you are on in recents
      query = " ";
    }
    return [
      {
        sourceId: "products",
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: index_name,
                query,
                params: {
                  hitsPerPage: 5,
                  highlightPreTag: "<span style='background:yellow'>",
                  highlightPostTag: "</span>",
                },
              },
            ],
          });
        },
        templates: {
          item: AutoCompleteHitTemplate,
        },
      },
    ];
  }
  const autocomplete_id = "#autocomplete-search-box";

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
  });
}

export { CreateSearch, getParameterByName, CreateAutoComplete };
