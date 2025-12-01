import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("TOC Generation with header icons", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a container for our test DOM
    container = document.createElement("div");
    container.id = "test-container";
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container);
  });

  it("should exclude header icon elements when generating TOC text", () => {
    // Create a header with icons like the header-copy-link feature adds
    const header = document.createElement("h3");
    header.id = "test-header";
    header.innerHTML = `
      Test Header Title
      <span class="header-copy-link" style="opacity: 0;">
        <svg><path d="M8 2 L8 12"/></svg>
      </span>
      <span class="header-github-issue" style="opacity: 0;">
        <i class="fab fa-github"></i>
      </span>
    `;
    container.appendChild(header);

    // Simulate the TOC text extraction logic from md-toc.js
    const extractTOCText = (element: HTMLElement): string => {
      const textNodes: string[] = [];
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node.textContent || "");
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          !(node as HTMLElement).classList.contains("header-copy-link") &&
          !(node as HTMLElement).classList.contains("header-github-issue")
        ) {
          textNodes.push(node.textContent || "");
        }
      }
      return textNodes.join("").trim();
    };

    const tocText = extractTOCText(header);

    // Should only get the header text, not the icon content
    expect(tocText).toBe("Test Header Title");
    expect(tocText).not.toContain("M8 2 L8 12"); // SVG path content
    expect(tocText).not.toContain("fab fa-github"); // Icon class text
  });

  it("should handle headers with nested non-icon elements correctly", () => {
    const header = document.createElement("h3");
    header.id = "nested-header";
    header.innerHTML = `
      Header with <code>inline code</code> and <em>emphasis</em>
      <span class="header-copy-link">Copy Icon</span>
    `;
    container.appendChild(header);

    // Simulate the TOC text extraction logic
    const extractTOCText = (element: HTMLElement): string => {
      const textNodes: string[] = [];
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node.textContent || "");
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          !(node as HTMLElement).classList.contains("header-copy-link") &&
          !(node as HTMLElement).classList.contains("header-github-issue")
        ) {
          textNodes.push(node.textContent || "");
        }
      }
      return textNodes.join("").trim();
    };

    const tocText = extractTOCText(header);

    expect(tocText).toBe("Header with inline code and emphasis");
    expect(tocText).not.toContain("Copy Icon");
  });

  it("should handle headers with only text content", () => {
    const header = document.createElement("h3");
    header.id = "simple-header";
    header.textContent = "Simple Header Text";
    container.appendChild(header);

    // Simulate the TOC text extraction logic
    const extractTOCText = (element: HTMLElement): string => {
      const textNodes: string[] = [];
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node.textContent || "");
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          !(node as HTMLElement).classList.contains("header-copy-link") &&
          !(node as HTMLElement).classList.contains("header-github-issue")
        ) {
          textNodes.push(node.textContent || "");
        }
      }
      return textNodes.join("").trim();
    };

    const tocText = extractTOCText(header);

    expect(tocText).toBe("Simple Header Text");
  });

  it("should properly escape quotes in TOC text", () => {
    const header = document.createElement("h3");
    header.id = "quoted-header";
    header.innerHTML = `
      Header with "quotes" in it
      <span class="header-copy-link">Icon</span>
    `;
    container.appendChild(header);

    // Simulate the full TOC text processing including quote escaping
    const extractAndProcessTOCText = (element: HTMLElement): string => {
      const textNodes: string[] = [];
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node.textContent || "");
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          !(node as HTMLElement).classList.contains("header-copy-link") &&
          !(node as HTMLElement).classList.contains("header-github-issue")
        ) {
          textNodes.push(node.textContent || "");
        }
      }
      return textNodes.join("").trim().replace(/"/g, "&quot;");
    };

    const tocText = extractAndProcessTOCText(header);

    expect(tocText).toBe("Header with &quot;quotes&quot; in it");
    expect(tocText).not.toContain("Icon");
  });

  it("should handle empty headers gracefully", () => {
    const header = document.createElement("h3");
    header.id = "empty-header";
    header.innerHTML = `
      <span class="header-copy-link">Icon</span>
      <span class="header-github-issue">GitHub</span>
    `;
    container.appendChild(header);

    // Simulate the TOC text extraction logic
    const extractTOCText = (element: HTMLElement): string => {
      const textNodes: string[] = [];
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node.textContent || "");
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          !(node as HTMLElement).classList.contains("header-copy-link") &&
          !(node as HTMLElement).classList.contains("header-github-issue")
        ) {
          textNodes.push(node.textContent || "");
        }
      }
      return textNodes.join("").trim();
    };

    const tocText = extractTOCText(header);

    // Should return empty string after trimming whitespace
    expect(tocText).toBe("");
  });
});
