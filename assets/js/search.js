// For autocomplete
const { autocomplete, getAlgoliaResults } = window["@algolia/autocomplete-js"];
import { get_link_info, random_from_list } from "./main.js";
// Adding a query paramater.
// import instantsearch from "algoliasearch";
const search_placeholder_text = "Search Igor's Musings ...";
function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function InstantSearchHitTemplate(hit) {
    var _a, _b;
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
        const content = (_b = (_a = highlighted === null || highlighted === void 0 ? void 0 : highlighted.content) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
        // <section class="notepad-post-excerpt"><p>${content}</p></section>
        const string_rep = `
           <span onClick="window.location='${url}';">
              <b> <a href="${url}">${title}</a></b> <span>${content}</span>
           </span>
        `;
        return string_rep;
    }
    catch (err) {
        console.log("Error in hitTemplate", err, hit);
    }
    return "invalid HTML";
}
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
        poweredBy: true,
        showSubmit: false,
        showReset: false,
        showLoadingIndicator: false,
    }));
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
    }));
    return search;
}
// Copied from the docs, but this isn't working for me.
function AutoCompleteHitTemplateWithComponentDoesNotWork({ item, components, createElement, fragments, }) {
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
async function CreateAutoComplete(appid, search_api_key, index_name) {
    const GetDefaultSearchResults = {
        sourceId: "links",
        async getItems() {
            const random_posts = [];
            for (let i = 0; i < 4; i++) {
                random_posts.push(await get_random_post());
            }
            // random_posts.push({ title: "GitHub", url: "https://github.com" });
            return random_posts;
        },
        getItemUrl({ item }) {
            console.log("getItemUrl ", item);
            // const ret = "https://www.google.com";
            const ret = item.url;
            console.log("ret", ret);
            return ret;
        },
        templates: {
            header({ createElement }) {
                return createElement("div", {
                    dangerouslySetInnerHTML: {
                        __html: "<i style='color:grey'>Random posts ...</i>",
                    },
                });
            },
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
        },
        // ...
    };
    const searchClient = algoliasearch(appid, search_api_key);
    function GetSources({ query }) {
        const isEmptySearch = query.length === 0;
        if (isEmptySearch) {
            // Searching for a space gives nice default results
            // so when no results search for that ...
            // TODO: Consider including the recent search history as well
            // And perhaps include the page you are on in recents
            query = " ";
        }
        const algolia_results = {
            sourceId: "from_search",
            getItems() {
                return getAlgoliaResults({
                    searchClient,
                    queries: [
                        {
                            indexName: index_name,
                            query,
                            params: {
                                hitsPerPage: isEmptySearch
                                    ? 2
                                    : 10 /* On empty serach leave room for random */,
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
        };
        let results = [algolia_results];
        if (isEmptySearch) {
            results.push(GetDefaultSearchResults);
            // results = [GetDefaultSearchResults];
        }
        return results;
    }
    const autocomplete_id = "#autocomplete-search-box";
    if (!$(autocomplete_id).length) {
        console.log("No autocomplete element found", "autocomplete_id", autocomplete_id);
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
//# sourceMappingURL=search.js.map