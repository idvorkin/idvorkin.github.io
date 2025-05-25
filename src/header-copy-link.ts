/**
 * Header Copy Link Feature
 * Adds a copy link icon to headers that allows users to copy the URL with anchor
 * Handles domain remapping from idvork.in to idvorkin.azurewebsites.net
 */

interface CopyLinkOptions {
  iconClass?: string;
  tooltipDuration?: number;
  domainMapping?: {
    from: string;
    to: string;
  };
}

const DEFAULT_OPTIONS: CopyLinkOptions = {
  iconClass: "header-copy-link",
  tooltipDuration: 2000,
  domainMapping: {
    from: "idvork.in/",
    to: "idvorkin.azurewebsites.net/",
  },
};

/**
 * Creates the copy link icon element
 */
function createCopyLinkIcon(options: CopyLinkOptions): HTMLElement {
  const icon = document.createElement("span");
  icon.className = options.iconClass || DEFAULT_OPTIONS.iconClass || "";
  icon.innerHTML = "🔗"; // Using emoji for now, can be replaced with SVG icon
  icon.title = "Copy link to this section";
  icon.style.cursor = "pointer";
  icon.style.marginLeft = "0.5rem";
  icon.style.opacity = "0";
  icon.style.transition = "opacity 0.2s ease";
  icon.style.fontSize = "0.8em";
  icon.style.userSelect = "none";

  return icon;
}

/**
 * Shows a temporary tooltip indicating the link was copied
 */
function showCopiedTooltip(element: HTMLElement, duration = 2000): void {
  const tooltip = document.createElement("span");
  tooltip.textContent = "Copied!";
  tooltip.style.position = "absolute";
  tooltip.style.backgroundColor = "#333";
  tooltip.style.color = "white";
  tooltip.style.padding = "4px 8px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "12px";
  tooltip.style.zIndex = "1000";
  tooltip.style.marginLeft = "10px";
  tooltip.style.marginTop = "-5px";

  element.parentElement?.appendChild(tooltip);

  setTimeout(() => {
    tooltip.remove();
  }, duration);
}

/**
 * Transforms the URL according to the domain mapping rules
 */
function transformUrl(url: string, options: CopyLinkOptions): string {
  let transformedUrl = url;

  // Always transform localhost to production domain
  transformedUrl = transformedUrl.replace("localhost:4000/", "idvorkin.azurewebsites.net/");

  // Also handle the production domain mapping if configured
  if (options.domainMapping) {
    transformedUrl = transformedUrl.replace(options.domainMapping.from, options.domainMapping.to);
  }

  // Remove the hash character but keep the anchor as part of the path
  // Transform: http://example.com/page#anchor -> http://example.com/page/anchor
  transformedUrl = transformedUrl.replace("#", "/");

  return transformedUrl;
}

/**
 * Copies the header link to clipboard
 */
async function copyHeaderLink(headerId: string, options: CopyLinkOptions): Promise<void> {
  try {
    // Get the current URL without any existing hash
    const baseUrl = window.location.href.split("#")[0];
    const fullUrl = `${baseUrl}#${headerId}`;

    // Apply URL transformation
    const transformedUrl = transformUrl(fullUrl, options);

    // Copy to clipboard
    await navigator.clipboard.writeText(transformedUrl);

    console.log(`Copied header link: ${transformedUrl}`);
  } catch (error) {
    console.error("Failed to copy header link:", error);

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    const baseUrl = window.location.href.split("#")[0];
    const fullUrl = `${baseUrl}#${headerId}`;
    const transformedUrl = transformUrl(fullUrl, options);

    textArea.value = transformedUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}

/**
 * Gets or creates an ID for a header element
 */
function getOrCreateHeaderId(header: HTMLElement): string {
  if (header.id) {
    return header.id;
  }

  // Create an ID from the header text
  const text = header.textContent || "";
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // Ensure uniqueness
  let uniqueId = id;
  let counter = 1;
  while (document.getElementById(uniqueId)) {
    uniqueId = `${id}-${counter}`;
    counter++;
  }

  header.id = uniqueId;
  return uniqueId;
}

/**
 * Adds copy link functionality to a single header
 */
function addCopyLinkToHeader(header: HTMLElement, options: CopyLinkOptions): void {
  // Check if this header already has a copy link
  const existingCopyLink = header.querySelector(`.${options.iconClass || DEFAULT_OPTIONS.iconClass}`);
  if (existingCopyLink) {
    return; // Skip if copy link already exists
  }

  const headerId = getOrCreateHeaderId(header);
  const copyIcon = createCopyLinkIcon(options);

  // Add click handler
  copyIcon.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await copyHeaderLink(headerId, options);
    showCopiedTooltip(copyIcon, options.tooltipDuration);
  });

  // Append the icon to the header
  header.appendChild(copyIcon);

  // Add hover effects to the header
  header.addEventListener("mouseenter", () => {
    copyIcon.style.opacity = "1";
  });

  header.addEventListener("mouseleave", () => {
    copyIcon.style.opacity = "0";
  });
}

/**
 * Initializes the copy link feature for all headers in the content
 */
export function initHeaderCopyLinks(customOptions: Partial<CopyLinkOptions> = {}): void {
  const options: CopyLinkOptions = { ...DEFAULT_OPTIONS, ...customOptions };

  // Find all headers in the main content area
  const contentContainer = document.getElementById("content-holder") || document.body;
  const headers = contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");

  for (const header of Array.from(headers)) {
    addCopyLinkToHeader(header as HTMLElement, options);
  }

  console.log(`✅ Initialized copy links for ${headers.length} headers`);
}

/**
 * Adds CSS styles for the copy link feature
 */
export function addHeaderCopyLinkStyles(): void {
  const styleId = "header-copy-link-styles";

  // Check if styles already exist
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .header-copy-link {
      opacity: 0;
      margin-left: 0.5rem;
      transition: opacity 0.2s ease;
      cursor: pointer;
      user-select: none;
      font-size: 0.8em;
      color: #6c757d;
      text-decoration: none;
    }
    
    .header-copy-link:hover {
      color: #007bff;
    }
    
    h1:hover .header-copy-link,
    h2:hover .header-copy-link,
    h3:hover .header-copy-link,
    h4:hover .header-copy-link,
    h5:hover .header-copy-link,
    h6:hover .header-copy-link {
      opacity: 1;
    }
    
    /* Ensure headers have relative positioning for tooltip placement */
    h1, h2, h3, h4, h5, h6 {
      position: relative;
    }
  `;

  document.head.appendChild(style);
}

// Global flag to prevent multiple initializations
let isHeaderCopyLinksInitialized = false;

/**
 * Reset the initialization flag (for testing purposes)
 */
export function resetHeaderCopyLinksInitialization(): void {
  isHeaderCopyLinksInitialized = false;
}

/**
 * Main initialization function - call this to enable the feature
 */
export function enableHeaderCopyLinks(options: Partial<CopyLinkOptions> = {}): void {
  // Prevent multiple initializations
  if (isHeaderCopyLinksInitialized) {
    console.log("⚠️ Header copy links already initialized, skipping...");
    return;
  }

  isHeaderCopyLinksInitialized = true;
  console.log("🔗 Initializing header copy links...");

  // Add styles
  addHeaderCopyLinkStyles();

  // Initialize the feature
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initHeaderCopyLinks(options);
    });
  } else {
    initHeaderCopyLinks(options);
  }
}
