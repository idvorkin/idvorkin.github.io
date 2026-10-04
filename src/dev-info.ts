export function getCurrentBranch(): string | null {
  // Get branch info from global variable
  const branch = (window as any).__GIT_BRANCH__;
  if (branch) {
    console.log("Branch from global variable:", branch);
    return branch;
  }

  console.log("Branch info not found");
  return null;
}

export function getCurrentPR(): number | null {
  // Get PR info from global variable
  const pr = (window as any).__GIT_PR__;
  if (pr && typeof pr === "number") {
    console.log("PR from global variable:", pr);
    return pr;
  }

  console.log("PR info not found");
  return null;
}

/** Permalinks of the pages this branch changes, from `just update-pr-data`. */
export function getChangedPages(): string[] {
  const pages = (window as any).__GIT_CHANGED__;
  if (!Array.isArray(pages)) return [];
  return pages.filter((p): p is string => typeof p === "string" && p.startsWith("/"));
}

const trimSlash = (p: string) => p.replace(/\/+$/, "") || "/";

/** True when `path` is one of the pages this branch changes (trailing slashes ignored). */
export function isChangedPage(path: string, changed: string[]): boolean {
  return changed.some((p) => trimSlash(p) === trimSlash(path));
}

// Icon names must exist in Font Awesome 5: the site's kit (_includes/head.html) is FA5, so FA6-only
// names (fa-code-compare, fa-file-pen, fa-xmark) render as nothing. Tooltips go on a wrapper, never on
// the <i>: the kit turns an icon's title into a <span class="sr-only">, which copied banner text includes.
const icon = (name: string) => `<i class="fas ${name}"></i>`;

/** Icon-only button that toggles the rendered diff; the diff code loads only on first click. */
export function diffButton(prUrl?: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.id = "dev-diff-toggle";
  btn.type = "button";
  const render = (on: boolean) => {
    btn.innerHTML = icon(on ? "fa-times" : "fa-exchange-alt");
    btn.title = on ? "Exit diff" : "Diff vs main";
    btn.setAttribute("aria-label", btn.title);
    btn.setAttribute("aria-pressed", String(on));
  };
  btn.style.cssText =
    "background:#238636;color:#fff;border:0;border-radius:4px;padding:1px 8px;font:inherit;cursor:pointer;";
  btn.onclick = async () => {
    btn.disabled = true;
    const { toggleRichDiff } = await import("./rich-diff");
    render(await toggleRichDiff(prUrl));
    btn.disabled = false;
  };
  render(false);
  return btn;
}

type AnnotateApi = { enabled: () => boolean; set: (on: boolean) => void };

/** Live on/off switch the private annotate tool (_includes/annotate.html) exposes on post pages. */
const annotateApi = (): AnnotateApi | undefined => (window as any).blogAnnotate;

/** Banner button that turns annotate (comment) mode on and off live, same flag as ?annotate=1. */
export function commentsButton(api: AnnotateApi): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.id = "dev-comments-toggle";
  btn.type = "button";
  const render = () => {
    const on = api.enabled();
    btn.innerHTML = `${icon("fa-comment")} ${on ? "on" : "off"}`;
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", "Comments");
    btn.title = on
      ? "Comments on: select text to comment. Click to turn off."
      : "Comments off: click to turn on annotate mode";
    btn.style.cssText = `background:${on ? "#0b5ed7" : "#444c56"};color:#fff;border:0;border-radius:4px;padding:1px 8px;font:inherit;cursor:pointer;`;
  };
  btn.onclick = () => {
    api.set(!api.enabled());
    render();
  };
  render();
  return btn;
}

export function isDevServer(): boolean {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function getCurrentPort(): string {
  return window.location.port || "80";
}

export function initDevInfo(): void {
  console.log("Initializing dev info...");
  const branch = getCurrentBranch();
  const pr = getCurrentPR();
  const port = getCurrentPort();

  console.log("Dev info - Branch:", branch, "PR:", pr, "Port:", port);

  // Show banner when we have branch or PR info, but not on production ports (80/443)
  if ((branch || pr) && port !== "80" && port !== "443") {
    const devInfoElement = document.createElement("div");
    devInfoElement.id = "dev-info-banner";
    devInfoElement.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background-color: #2c2c2c;
      color: white;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    let infoContent = "";
    if (branch) {
      infoContent += `<span title="Branch">${icon("fa-code-branch")} <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${branch}</code></span>`;
    }

    // Add PR link if available
    if (pr) {
      if (branch) {
        infoContent += " | ";
      }
      const prUrl = `https://github.com/idvorkin/idvorkin.github.io/pull/${pr}`;
      infoContent += `<a href="${prUrl}" title="Pull request" target="_blank" style="color: #58a6ff; text-decoration: none;"><i class="fab fa-github"></i></a> <a href="${prUrl}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${pr}</code></a>`;
    }

    if ((branch || pr) && port) {
      infoContent += " | ";
    }
    infoContent += `<span title="Port">${icon("fa-plug")} <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${port}</code></span>`;

    const changed = getChangedPages();
    if (changed.length) {
      const links = changed
        .map(
          (p) =>
            `<a href="${encodeURI(p)}" style="color: #58a6ff; text-decoration: none;">${p.replace(/[<>&"]/g, "")}</a>`,
        )
        .join(" ");
      infoContent += ` | ${icon("fa-edit")} Changed: ${links}`;
    }

    devInfoElement.innerHTML = infoContent;
    if (isChangedPage(window.location.pathname, changed)) {
      devInfoElement.appendChild(document.createTextNode(" | "));
      devInfoElement.appendChild(
        diffButton(pr ? `https://github.com/idvorkin/idvorkin.github.io/pull/${pr}` : undefined),
      );
    }
    const annotate = annotateApi();
    if (annotate) {
      devInfoElement.appendChild(document.createTextNode(" | "));
      devInfoElement.appendChild(commentsButton(annotate));
    }
    document.body.appendChild(devInfoElement);

    // Adjust body padding to account for the banner
    const currentPaddingTop = Number.parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${currentPaddingTop + 40}px`;
  }
}
