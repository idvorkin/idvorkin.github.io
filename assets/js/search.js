// For autocomplete
const { autocomplete, getAlgoliaResults } = window["@algolia/autocomplete-js"];
// Adding a query paramater.
// import instantsearch from "algoliasearch";
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
        const string_rep = `
            <h3><a href="${url}">${title}</a></h3>
            <section class="notepad-post-excerpt"><p>${content}</p></section>
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
        placeholder: "Search Igor's musings...",
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
function AlgoliaMarkupToHTML(algolia_markup) {
    return algolia_markup
        .replace(/__aa-highlight__/g, "<mark>")
        .replace(/__\/aa-highlight__/g, "</mark>");
}
// Algolia uses some PREACT thing, which this project does not support
// Reach way into algolia and build the HTML manually
function AutoCompleteHitTemplate({ item, createElement }) {
    // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
    return createElement("div", {
        dangerouslySetInnerHTML: {
            __html: AlgoliaMarkupToHTML(InstantSearchHitTemplate(item)),
        },
    });
}
function CreateAutoComplete(appid, search_api_key, index_name) {
    const searchClient = algoliasearch(appid, search_api_key);
    function GetSources({ query }) {
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
        console.log("No autocomplete element found", "autocomplete_id", autocomplete_id);
        return;
    }
    // Setup Auto Complete Stuff
    return autocomplete({
        container: "#autocomplete-search-box",
        placeholder: "Search",
        getSources: GetSources,
        debug: false,
        autoFocus: true,
    });
}
export { CreateSearch, getParameterByName, CreateAutoComplete };
//# sourceMappingURL=search.js.map