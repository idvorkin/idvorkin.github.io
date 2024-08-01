/**
 * Replaces placeholder links in the document with their corresponding list content.
 * @param listReplacements - An object mapping placeholder texts to list elements.
 */
export function replacePlaceholdersWithLists(listReplacements) {
  Object.entries(listReplacements).forEach(([placeholderText, list]) => {
    const placeholderLink = $(`a[href=${placeholderText}]`).first();
    if (!placeholderLink.length) return; // Placeholder not found, skip

    const listClone = $(list).clone();
    listClone.children().first().remove(); // Remove the 'lookup id' from the list
    placeholderLink.replaceWith(listClone);
  });
}

/**
 * Replaces list placeholders in tables with actual list content.
 * This function orchestrates the process of finding and replacing placeholders.
 */
export function replaceListPlaceholdersInTables() {
  console.log("Replacing List Placeholders in Tables");
  const listReplacements = buildListReplacementMap();
  replacePlaceholdersWithLists(listReplacements);
}

/**
 * Builds a map of list replacements by scanning the document for specially formatted lists.
 * @returns An object where keys are placeholder texts and values are the corresponding list elements.
 */
function buildListReplacementMap() {
  const replacements = {};
  $("ul").each((_, list) => {
    const firstListItem = list.firstElementChild;
    if (!firstListItem) return;

    const firstItemText = firstListItem.textContent;
    if (!firstItemText.startsWith("l")) return;

    const listId = parseInt(firstItemText.substring(1));
    if (isNaN(listId)) return;

    replacements[firstItemText] = list;
  });
  return replacements;
}

$(replaceListPlaceholdersInTables);
