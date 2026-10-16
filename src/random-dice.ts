/**
 * Re-roll dice for random-post visits.
 *
 * /random picks a page and jumps to it. Before jumping it records the target
 * path in sessionStorage; when that page loads with a matching path, a small
 * dice button appears in the bottom-left corner. Tapping it rolls again.
 *
 * sessionStorage (not a ?random=1 query param) keeps shared links clean: a
 * copied URL never shows the dice to someone who didn't roll. It's per-tab, so
 * reloading the landed page keeps the dice, and following any normal link to a
 * different path drops it.
 */
import { get_random_page_url } from "./shared";

export const RANDOM_ARRIVAL_KEY = "random-arrival-path";
const DICE_ID = "random-reroll-dice";

/** "/foo/" and "/foo" are the same page; "/" stays "/". */
export function normalizePath(path: string): string {
  let p = path.split(/[?#]/)[0] || "/";
  try {
    p = decodeURI(p);
  } catch {
    // keep the raw path if it isn't valid percent-encoding
  }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

function safeStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null; // blocked storage (privacy modes): no dice, plain redirect still works
  }
}

export function markRandomArrival(url: string, storage: Storage | null = safeStorage()): void {
  try {
    storage?.setItem(RANDOM_ARRIVAL_KEY, normalizePath(new URL(url, window.location.origin).pathname));
  } catch {
    // ignore: storage full or blocked
  }
}

export function isRandomArrival(pathname: string, storage: Storage | null = safeStorage()): boolean {
  try {
    const marked = storage?.getItem(RANDOM_ARRIVAL_KEY);
    return marked != null && marked === normalizePath(pathname);
  } catch {
    return false;
  }
}

/** Pick a random page that isn't the one we're on (best effort, a few tries). */
export async function pickNextRandomUrl(currentPath: string, pick: () => Promise<string> = get_random_page_url) {
  const here = normalizePath(currentPath);
  let url = await pick();
  for (let i = 0; i < 4 && normalizePath(url) === here; i++) {
    url = await pick();
  }
  return url;
}

/** Roll, mark the landing as a random arrival, and go. Used by /random and the dice. */
export async function goToRandomPage(
  navigate: (url: string) => void = (url) => window.location.assign(url),
  pick: () => Promise<string> = get_random_page_url,
): Promise<string> {
  const url = await pickNextRandomUrl(window.location.pathname, pick);
  markRandomArrival(url);
  navigate(url);
  return url;
}

export function initRandomDice(doc: Document = document): HTMLButtonElement | null {
  if (!isRandomArrival(window.location.pathname) || doc.getElementById(DICE_ID)) {
    return null;
  }

  const button = doc.createElement("button");
  button.id = DICE_ID;
  button.type = "button";
  button.textContent = "🎲";
  button.title = "Another random post";
  button.setAttribute("aria-label", "Another random post");
  // Bottom-left: bottom-right already holds the TOC drop-up, annotate pill and diff nav.
  button.style.cssText = [
    "position:fixed",
    "left:max(12px, env(safe-area-inset-left))",
    "bottom:max(12px, env(safe-area-inset-bottom))",
    "z-index:9999",
    "width:48px",
    "height:48px",
    "padding:0",
    "font-size:28px",
    "line-height:48px",
    "text-align:center",
    "border:0",
    "border-radius:50%",
    "background:rgba(255,255,255,.9)",
    "box-shadow:0 2px 8px rgba(0,0,0,.3)",
    "cursor:pointer",
    "touch-action:manipulation",
  ].join(";");

  button.addEventListener("click", () => {
    button.disabled = true;
    button.style.transition = "transform .4s";
    button.style.transform = "rotate(360deg)";
    void goToRandomPage();
  });

  doc.body.appendChild(button);
  return button;
}
