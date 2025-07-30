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

export function isDevServer(): boolean {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function getCurrentPort(): string {
  return window.location.port || "80";
}

export function initDevInfo(): void {
  if (!isDevServer()) {
    console.log("Not on dev server, skipping dev info");
    return;
  }

  console.log("Dev server detected, initializing dev info...");
  const branch = getCurrentBranch();
  const port = getCurrentPort();
  
  console.log("Dev info - Branch:", branch, "Port:", port);

  // Show banner if we have branch info and it's not main, or if we're on a non-standard port
  if ((branch && branch !== "main") || port !== "4000") {
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
    
    let infoContent = '';
    if (branch) {
      infoContent += `<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${branch}</code>`;
    }
    if (branch && port) {
      infoContent += ' | ';
    }
    infoContent += `<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${port}</code>`;
    
    devInfoElement.innerHTML = infoContent;
    document.body.appendChild(devInfoElement);

    // Adjust body padding to account for the banner
    const currentPaddingTop = parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${currentPaddingTop + 40}px`;
  }
}