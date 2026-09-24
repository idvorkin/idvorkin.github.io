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

/** Banner button that toggles the rendered diff; the diff code loads only on first click. */
function diffButton(prUrl?: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.id = "dev-diff-toggle";
  btn.innerHTML = '<i class="fas fa-code-compare"></i> Diff vs main';
  btn.style.cssText =
    "background:#238636;color:#fff;border:0;border-radius:4px;padding:1px 8px;font:inherit;cursor:pointer;";
  btn.onclick = async () => {
    btn.disabled = true;
    const { toggleRichDiff } = await import("./rich-diff");
    const on = await toggleRichDiff(prUrl);
    btn.innerHTML = on ? '<i class="fas fa-xmark"></i> Exit diff' : '<i class="fas fa-code-compare"></i> Diff vs main';
    btn.disabled = false;
  };
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
      infoContent += `<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${branch}</code>`;
    }

    // Add PR link if available
    if (pr) {
      if (branch) {
        infoContent += " | ";
      }
      const prUrl = `https://github.com/idvorkin/idvorkin.github.io/pull/${pr}`;
      infoContent += `<i class="fas fa-code-pull-request"></i> PR: <a href="${prUrl}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${pr}</code></a>`;
    }

    if ((branch || pr) && port) {
      infoContent += " | ";
    }
    infoContent += `<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${port}</code>`;

    const changed = getChangedPages();
    if (changed.length) {
      const links = changed
        .map(
          (p) =>
            `<a href="${encodeURI(p)}" style="color: #58a6ff; text-decoration: none;">${p.replace(/[<>&"]/g, "")}</a>`,
        )
        .join(" ");
      infoContent += ` | <i class="fas fa-file-pen"></i> Changed: ${links}`;
    }

    devInfoElement.innerHTML = infoContent;
    if (isChangedPage(window.location.pathname, changed)) {
      devInfoElement.appendChild(document.createTextNode(" | "));
      devInfoElement.appendChild(
        diffButton(pr ? `https://github.com/idvorkin/idvorkin.github.io/pull/${pr}` : undefined),
      );
    }
    document.body.appendChild(devInfoElement);

    // Adjust body padding to account for the banner
    const currentPaddingTop = Number.parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${currentPaddingTop + 40}px`;
  }
}
