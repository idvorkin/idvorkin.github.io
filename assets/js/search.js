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
function hitTemplate(hit) {
    // https://www.algolia.com/doc/api-reference/widgets/infinite-hits/js/
    let string_rep = "";
    try {
        let url = "";
        if (hit.anchor) {
            url = `${hit.url}#${hit.anchor}`;
        }
        else {
            url = `${hit.url}`;
        }
        if (!hit._highlightResult) {
            console.log("No Highlight", hit);
        }
        const title = hit._highlightResult.title.value;
        const content = hit._highlightResult.content.value;
        string_rep = `
            <h3><a href="${url}">${title}</a></h3>
            <section class="notepad-post-excerpt"><p>${content}</p></section>
        `;
    }
    catch (err) {
        console.log("Error in hitTemplate", err, hit);
    }
    return string_rep;
}
function create_search(appid, search_api_key, index_name, initial_query) {
    // Instanciating InstantSearch.js with Algolia credentials
    const search = instantsearch({
        searchClient: algoliasearch(appid, search_api_key),
        indexName: index_name,
        searchParameters: {
            query: initial_query
        }
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
        showLoadingIndicator: false
    }));
    search.addWidget(
    // @ts-ignore:TS2339
    instantsearch.widgets.infiniteHits({
        container: "#search-hits",
        templates: {
            item: hitTemplate
        }
    }));
    return search;
}
export { create_search, getParameterByName };
//# sourceMappingURL=search.js.map