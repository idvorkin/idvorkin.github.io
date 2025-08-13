/**
 * Header Copy Link Feature
 * Adds a copy link icon to headers that allows users to copy the URL with anchor
 * Handles domain remapping from idvork.in to idvorkin.azurewebsites.net
 */

import { makeRedirectUrl } from "./shared";

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
 * Creates the GitHub issue icon element with Font Awesome fallback
 */
function createGitHubIssueIcon(): HTMLElement {
  const icon = document.createElement("span");
  icon.className = "header-github-issue";
  icon.title = "Create GitHub issue for this section";
  icon.style.cursor = "pointer";
  icon.style.marginLeft = "0.5rem";
  icon.style.opacity = "0";
  icon.style.transition = "opacity 0.2s ease";
  icon.style.fontSize = "0.8em";
  icon.style.userSelect = "none";
  
  // Add accessibility attributes
  icon.setAttribute('role', 'button');
  icon.setAttribute('tabindex', '0');
  icon.setAttribute('aria-label', 'Create GitHub issue for this section');
  
  // Check if Font Awesome is available (more robust detection)
  const hasFontAwesome = !!(
    document.querySelector('link[href*="font-awesome"]') || 
    document.querySelector('script[src*="font-awesome"]') ||
    document.querySelector('.fa, .fab, .fas, .far') ||
    // Check for inline styles that might include Font Awesome
    Array.from(document.styleSheets).some(sheet => {
      try {
        return sheet.href && sheet.href.includes('font-awesome');
      } catch (e) {
        return false; // Cross-origin stylesheets may throw
      }
    })
  );
  
  if (hasFontAwesome) {
    const faIcon = document.createElement('i');
    faIcon.className = 'fab fa-github';
    icon.appendChild(faIcon);
  } else {
    // Fallback to text or emoji
    icon.textContent = '⚠️';
  }

  return icon;
}

/**
 * Creates an inline popup editor for adding comments (safe from XSS)
 */
function createIssuePopup(headerId: string, headerText: string): HTMLElement {
  const popup = document.createElement("div");
  popup.className = "github-issue-popup";
  popup.style.display = "none";
  popup.id = `github-issue-popup-${headerId}`;
  
  // Create structure safely without innerHTML to prevent XSS
  const content = document.createElement("div");
  content.className = "github-issue-popup-content";
  
  // Header
  const header = document.createElement("div");
  header.className = "github-issue-popup-header";
  
  const h4 = document.createElement("h4");
  h4.textContent = `Report Issue: ${headerText}`; // Safe from XSS
  
  const closeBtn = document.createElement("button");
  closeBtn.className = "github-issue-popup-close";
  closeBtn.title = "Close";
  closeBtn.textContent = "×";
  
  header.appendChild(h4);
  header.appendChild(closeBtn);
  
  // Body
  const body = document.createElement("div");
  body.className = "github-issue-popup-body";
  
  // Title input
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", `issue-title-${headerId}`);
  titleLabel.textContent = "Issue Title:";
  
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = `issue-title-${headerId}`;
  titleInput.className = "github-issue-title";
  titleInput.placeholder = "Brief title for the issue";
  
  // Description textarea
  const descLabel = document.createElement("label");
  descLabel.setAttribute("for", `issue-comment-${headerId}`);
  descLabel.textContent = "Description:";
  
  const descTextarea = document.createElement("textarea");
  descTextarea.id = `issue-comment-${headerId}`;
  descTextarea.className = "github-issue-comment";
  descTextarea.placeholder = "Describe the issue with this section...";
  descTextarea.rows = 4;
  
  // Buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "github-issue-popup-buttons";
  
  const submitBtn = document.createElement("button");
  submitBtn.className = "github-issue-submit";
  submitBtn.textContent = "Create Issue on GitHub";
  
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "github-issue-cancel";
  cancelBtn.textContent = "Cancel";
  
  buttonsDiv.appendChild(submitBtn);
  buttonsDiv.appendChild(cancelBtn);
  
  // Hint
  const hintDiv = document.createElement("div");
  hintDiv.className = "github-issue-popup-hint";
  const small = document.createElement("small");
  small.textContent = "Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit";
  hintDiv.appendChild(small);
  
  // Assemble body
  body.appendChild(titleLabel);
  body.appendChild(titleInput);
  body.appendChild(descLabel);
  body.appendChild(descTextarea);
  body.appendChild(buttonsDiv);
  body.appendChild(hintDiv);
  
  // Assemble popup
  content.appendChild(header);
  content.appendChild(body);
  popup.appendChild(content);
  
  return popup;
}

/**
 * Shows the issue popup near the header
 */
function showIssuePopup(popup: HTMLElement, header: HTMLElement): void {
  // Hide any other open popups
  document.querySelectorAll(".github-issue-popup").forEach(p => {
    (p as HTMLElement).style.display = "none";
  });
  
  // Position the popup near the header
  popup.style.display = "block";
  popup.style.position = "absolute";
  popup.style.zIndex = "1000";
  
  // Get header position
  const rect = header.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  popup.style.top = (rect.bottom + scrollTop + 10) + "px";
  popup.style.left = (rect.left + scrollLeft) + "px";
  
  // Focus on the title input
  const titleInput = popup.querySelector(".github-issue-title") as HTMLInputElement;
  if (titleInput) {
    titleInput.focus();
  }
}

/**
 * Hides the issue popup
 */
function hideIssuePopup(popup: HTMLElement): void {
  popup.style.display = "none";
  // Clear the textarea
  const textarea = popup.querySelector(".github-issue-comment") as HTMLTextAreaElement;
  if (textarea) {
    textarea.value = "";
  }
}

/**
 * Shows a temporary tooltip indicating the link was copied
 */
function showCopiedTooltip(element: HTMLElement, duration = 2000): void {
  // Remove any existing tooltip first
  if (typeof document !== "undefined" && document.querySelector) {
    const existingTooltip = document.querySelector(".copy-link-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }
  }

  const tooltip = document.createElement("span");
  tooltip.className = "copy-link-tooltip";
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
    // Get the current page path
    const pathname = window.location.pathname;
    const pagePath = pathname.replace(/^\//, "").replace(/\.html$/, "") || "index";
    
    // Generate the modal.run redirect URL
    const redirectUrl = makeRedirectUrl(pagePath, headerId, true);
    
    // Fetch the content from the modal.run URL
    console.log(`Fetching content from: ${redirectUrl}`);
    const response = await fetch(redirectUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    
    const textContent = await response.text();

    // Copy the fetched text content to clipboard
    await navigator.clipboard.writeText(textContent);

    console.log(`Copied content from: ${redirectUrl}`);
  } catch (error) {
    console.error("Failed to copy header content:", error);

    // Fallback: try to fetch and copy, or copy the URL if fetch fails
    try {
      const pathname = window.location.pathname;
      const pagePath = pathname.replace(/^\//, "").replace(/\.html$/, "") || "index";
      const redirectUrl = makeRedirectUrl(pagePath, headerId, true);
      
      // Try to fetch content even in fallback
      const response = await fetch(redirectUrl);
      const textContent = await response.text();
      
      // Use textarea fallback for copying
      const textArea = document.createElement("textarea");
      textArea.value = textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (fallbackError) {
      // If all else fails, copy the URL itself
      console.error("Fallback also failed, copying URL instead:", fallbackError);
      const pathname = window.location.pathname;
      const pagePath = pathname.replace(/^\//, "").replace(/\.html$/, "") || "index";
      const redirectUrl = makeRedirectUrl(pagePath, headerId, true);
      
      const textArea = document.createElement("textarea");
      textArea.value = redirectUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
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
 * Gets the first non-empty paragraph of content after a header
 */
function getFirstParagraphAfterHeader(header: HTMLElement): string {
  let nextElement = header.nextElementSibling;
  
  // Look for the first non-empty paragraph before the next header
  while (nextElement) {
    // Stop if we hit another header
    if (nextElement.tagName.match(/^H[1-6]$/)) {
      break;
    }
    
    // Check if it's a paragraph with actual content
    if (nextElement.tagName === 'P') {
      const text = (nextElement.textContent || '').trim();
      if (text.length > 0) {
        // Found non-empty paragraph - truncate if too long
        return text.length > 500 ? text.substring(0, 497) + '...' : text;
      }
    }
    
    nextElement = nextElement.nextElementSibling;
  }
  
  return '';
}

/**
 * Creates a GitHub issue URL for a section with optional custom title and description
 */
function createGitHubIssueUrl(
  headerId: string, 
  headerText: string, 
  customTitle?: string, 
  customDescription?: string,
  header?: HTMLElement
): string {
  // Get the current page path from the URL
  const pathname = window.location.pathname;
  // Remove leading slash and .html extension if present
  const pagePath = pathname.replace(/^\//, "").replace(/\.html$/, "");
  
  // Get the actual source file path from the meta tag (set by Jekyll)
  const metaTag = document.querySelector('meta[property="markdown-path"]');
  const sourceFile = metaTag ? metaTag.getAttribute("content") : `${pagePath || "index"}.md`;
  
  // Construct the GitHub issue URL
  const repoUrl = "https://github.com/idvorkin/idvorkin.github.io";
  
  // Format title as: page/section: custom title
  const formattedTitle = customTitle 
    ? `${pagePath || "index"}/${headerId}: ${customTitle}`
    : `${pagePath || "index"}/${headerId}: Issue with ${headerText}`;
  
  const issueTitle = encodeURIComponent(formattedTitle);
  
  // Use description if provided, otherwise use title as description
  const description = customDescription || customTitle || `Issue with section: ${headerText}`;
  
  // Get first paragraph of content if header is provided
  const firstParagraph = header ? getFirstParagraphAfterHeader(header) : '';
  
  // Format location as a single line with hyperlinks
  const locationLine = `📍 [${pagePath || "index"}](https://idvorkin.azurewebsites.net/${pagePath})/[${headerId}](https://idvorkin.azurewebsites.net/${pagePath}/${headerId}) - [[GitHub]](${repoUrl}/blob/main/${sourceFile}#${headerId})`;
  
  // Format the issue body with location at top, then description, then content excerpt
  let issueBodyContent = `${locationLine}\n\n` +
    `## Description\n\n` +
    `${description}\n\n`;
  
  // Add content excerpt with section heading if available
  if (firstParagraph) {
    issueBodyContent += `## Content Excerpt\n\n` +
      `#### ${headerText}\n\n` +
      `> ${firstParagraph}\n\n`;
  }
  
  const issueBody = encodeURIComponent(issueBodyContent);
  
  return `${repoUrl}/issues/new?title=${issueTitle}&body=${issueBody}`;
}

// Store cleanup functions for each header
const headerCleanupFunctions = new WeakMap<HTMLElement, (() => void)[]>();

// Store popup references for lazy loading
const headerPopups = new WeakMap<HTMLElement, HTMLElement>();

/**
 * Creates and shows popup lazily when needed
 */
function getOrCreatePopup(header: HTMLElement, headerId: string): HTMLElement {
  let popup = headerPopups.get(header);
  
  if (!popup) {
    popup = createIssuePopup(headerId, header.textContent || "");
    document.body.appendChild(popup);
    headerPopups.set(header, popup);
    
    // Setup popup event handlers
    setupPopupEventHandlers(popup, header, headerId);
  }
  
  return popup;
}

/**
 * Sets up event handlers for a popup
 */
function setupPopupEventHandlers(popup: HTMLElement, header: HTMLElement, headerId: string): void {
  const cleanupFunctions: (() => void)[] = [];
  
  // Handle close button
  const closeBtn = popup.querySelector(".github-issue-popup-close");
  if (closeBtn) {
    const closeHandler = () => hideIssuePopup(popup);
    closeBtn.addEventListener("click", closeHandler);
    cleanupFunctions.push(() => closeBtn.removeEventListener("click", closeHandler));
  }
  
  // Handle cancel button
  const cancelBtn = popup.querySelector(".github-issue-cancel");
  if (cancelBtn) {
    const cancelHandler = () => hideIssuePopup(popup);
    cancelBtn.addEventListener("click", cancelHandler);
    cleanupFunctions.push(() => cancelBtn.removeEventListener("click", cancelHandler));
  }
  
  // Function to submit the issue
  const submitIssue = () => {
    const titleInput = popup.querySelector(".github-issue-title") as HTMLInputElement;
    const commentTextarea = popup.querySelector(".github-issue-comment") as HTMLTextAreaElement;
    
    const customTitle = titleInput?.value || "";
    const customDescription = commentTextarea?.value || "";
    
    const issueUrl = createGitHubIssueUrl(headerId, header.textContent || "", customTitle, customDescription, header);
    window.open(issueUrl, "_blank");
    
    hideIssuePopup(popup);
  };
  
  // Handle submit button
  const submitBtn = popup.querySelector(".github-issue-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitIssue);
    cleanupFunctions.push(() => submitBtn.removeEventListener("click", submitIssue));
  }
  
  // Handle keyboard shortcuts (Ctrl/Cmd + Enter)
  const titleInput = popup.querySelector(".github-issue-title") as HTMLInputElement;
  const commentTextarea = popup.querySelector(".github-issue-comment") as HTMLTextAreaElement;
  
  const handleKeydown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      submitIssue();
    }
  };
  
  if (titleInput) {
    titleInput.addEventListener("keydown", handleKeydown);
    cleanupFunctions.push(() => titleInput.removeEventListener("keydown", handleKeydown));
  }
  if (commentTextarea) {
    commentTextarea.addEventListener("keydown", handleKeydown);
    cleanupFunctions.push(() => commentTextarea.removeEventListener("keydown", handleKeydown));
  }
  
  // Store cleanup functions for this popup
  const existingCleanup = headerCleanupFunctions.get(header) || [];
  headerCleanupFunctions.set(header, [...existingCleanup, ...cleanupFunctions]);
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
  const githubIcon = createGitHubIssueIcon();
  const cleanupFunctions: (() => void)[] = [];

  // Add click handler for copy link
  const copyClickHandler = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    await copyHeaderLink(headerId, options);
    showCopiedTooltip(copyIcon, options.tooltipDuration);
  };
  copyIcon.addEventListener("click", copyClickHandler);
  cleanupFunctions.push(() => copyIcon.removeEventListener("click", copyClickHandler));

  // Add click handler for GitHub issue icon to show popup (lazy loading)
  const githubClickHandler = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const popup = getOrCreatePopup(header, headerId);
    showIssuePopup(popup, header);
  };
  githubIcon.addEventListener("click", githubClickHandler);
  cleanupFunctions.push(() => githubIcon.removeEventListener("click", githubClickHandler));
  
  // Close popup when clicking outside (use capture phase to avoid conflicts)
  const handleOutsideClick = (event: MouseEvent) => {
    const popup = headerPopups.get(header);
    if (popup && !popup.contains(event.target as Node) && 
        event.target !== githubIcon && 
        !githubIcon.contains(event.target as Node) &&
        popup.style.display !== "none") {
      hideIssuePopup(popup);
    }
  };
  
  // Add slight delay to avoid immediate closing
  const timeoutId = setTimeout(() => {
    document.addEventListener("click", handleOutsideClick, true);
    cleanupFunctions.push(() => document.removeEventListener("click", handleOutsideClick, true));
  }, 100);
  cleanupFunctions.push(() => clearTimeout(timeoutId));

  // Append the icons to the header
  header.appendChild(copyIcon);
  header.appendChild(githubIcon);

  // Add hover effects to the header
  const mouseEnterHandler = () => {
    copyIcon.style.opacity = "1";
    githubIcon.style.opacity = "1";
  };
  const mouseLeaveHandler = () => {
    copyIcon.style.opacity = "0";
    githubIcon.style.opacity = "0";
  };
  
  header.addEventListener("mouseenter", mouseEnterHandler);
  header.addEventListener("mouseleave", mouseLeaveHandler);
  cleanupFunctions.push(() => {
    header.removeEventListener("mouseenter", mouseEnterHandler);
    header.removeEventListener("mouseleave", mouseLeaveHandler);
  });
  
  // Store cleanup functions for this header
  headerCleanupFunctions.set(header, cleanupFunctions);
}

/**
 * Cleans up all event listeners and popups
 */
export function cleanupHeaderCopyLinks(): void {
  // Clean up all stored event listeners
  headerCleanupFunctions.forEach((cleanupFns) => {
    cleanupFns.forEach(fn => fn());
  });
  headerCleanupFunctions.clear();
  
  // Remove all popups
  headerPopups.forEach((popup) => {
    popup.remove();
  });
  headerPopups.clear();
  
  // Reset initialization flag
  isHeaderCopyLinksInitialized = false;
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
    .header-copy-link,
    .header-github-issue {
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
    
    .header-github-issue:hover {
      color: #dc3545;
    }
    
    h1:hover .header-copy-link,
    h2:hover .header-copy-link,
    h3:hover .header-copy-link,
    h4:hover .header-copy-link,
    h5:hover .header-copy-link,
    h6:hover .header-copy-link,
    h1:hover .header-github-issue,
    h2:hover .header-github-issue,
    h3:hover .header-github-issue,
    h4:hover .header-github-issue,
    h5:hover .header-github-issue,
    h6:hover .header-github-issue {
      opacity: 1;
    }
    
    /* Ensure headers have relative positioning for tooltip placement */
    h1, h2, h3, h4, h5, h6 {
      position: relative;
    }
    
    /* GitHub Issue Popup Styles */
    .github-issue-popup {
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 400px;
      max-width: 90vw;
      z-index: 1000;
    }
    
    .github-issue-popup-content {
      padding: 0;
    }
    
    .github-issue-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f6f8fa;
      border-bottom: 1px solid #e1e4e8;
      border-radius: 8px 8px 0 0;
    }
    
    .github-issue-popup-header h4 {
      margin: 0;
      font-size: 14px;
      color: #24292e;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 350px;
    }
    
    .github-issue-popup-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #586069;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .github-issue-popup-close:hover {
      color: #24292e;
    }
    
    .github-issue-popup-body {
      padding: 16px;
    }
    
    .github-issue-popup-body label {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #24292e;
    }
    
    .github-issue-title,
    .github-issue-comment {
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 12px;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    
    .github-issue-title:focus,
    .github-issue-comment:focus {
      outline: none;
      border-color: #0366d6;
      box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
    }
    
    .github-issue-comment {
      resize: vertical;
      min-height: 80px;
    }
    
    .github-issue-popup-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 12px;
    }
    
    .github-issue-submit,
    .github-issue-cancel {
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid;
      transition: all 0.2s;
    }
    
    .github-issue-submit {
      background: #2ea44f;
      color: white;
      border-color: #2ea44f;
    }
    
    .github-issue-submit:hover {
      background: #2c974b;
      border-color: #2c974b;
    }
    
    .github-issue-cancel {
      background: #fafbfc;
      color: #24292e;
      border-color: #e1e4e8;
    }
    
    .github-issue-cancel:hover {
      background: #f3f4f6;
      border-color: #c9ced1;
    }
    
    .github-issue-popup-hint {
      margin-top: 8px;
      text-align: center;
      color: #586069;
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
    return;
  }

  isHeaderCopyLinksInitialized = true;

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
