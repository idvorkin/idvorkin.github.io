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
  const class_link = `link-box description truncate-css`;
  const output = `
<div>
    <div class="${class_link}"> ${title_href}:<span class="link-description"> ${url_info.description} <span></div>
</div>`;
  return output;
}

/**
 * Returns a random element from an array
 */
export function random_from_list<T>(list: T[]): T {
  if (list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Shuffles an array in place
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * This div gets content from the random_html_factory
 * and clicking does a re-randomize
 */
export async function append_randomizer_div(
  parent_id: string | JQuery<HTMLElement>,
  random_html_factory: () => string
) {
  // as string to queit type checker.
  // Will be a noop if parent_id is already a jquery object
  const $parent = $(parent_id as string);
  if ($parent.length != 1) {
    console.log(`append_randomizer_div ${parent_id} not present`);
    return;
  }
  const new_element = $(await random_html_factory());
  $parent.empty().append(new_element);

  // Clicking on the element should result in a reload, unless you're
  // Clicking on a link
  $parent.click(async function (event) {
    if (event.target.tagName != "A") {
      const new_element = $(await random_html_factory());
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
 * Gets link information from the back-links.json file
 */
export async function get_link_info(url?: string): Promise<IURLInfoMap> {
  if (cached_link_info != null) {
    return cached_link_info;
  }
  const current_url = url || window.location.href;
  const prodPrefix = "https://idvork.in";
  const isProd = current_url.includes(prodPrefix);

  var backlinks_url =
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
