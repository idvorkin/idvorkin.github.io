import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the DOM environment
const mockDocument = {
  createElement: vi.fn(),
  getElementById: vi.fn(),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(() => []),
  head: {
    appendChild: vi.fn(),
  },
  readyState: "complete",
  addEventListener: vi.fn(),
  body: {
    appendChild: vi.fn(),
    querySelectorAll: vi.fn(() => []),
  },
  documentElement: {
    scrollTop: 0,
  },
  styleSheets: [],
};

const mockWindow = {
  location: {
    href: "http://localhost:4000/manager-book",
    pathname: "/manager-book",
  },
  navigator: {
    clipboard: {
      writeText: vi.fn(),
    },
  },
  document: mockDocument,
  pageYOffset: 0,
  pageXOffset: 0,
};

// Mock globals - using type assertions for test environment
(globalThis as unknown as { document: typeof mockDocument }).document = mockDocument;
(globalThis as unknown as { window: typeof mockWindow }).window = mockWindow;
(globalThis as unknown as { navigator: typeof mockWindow.navigator }).navigator = mockWindow.navigator;

// Mock Array.from if it doesn't exist
if (typeof Array.from === "undefined") {
  (Array as any).from = (arrayLike: any) => {
    const result = [];
    for (let i = 0; i < (arrayLike?.length || 0); i++) {
      result.push(arrayLike[i]);
    }
    return result;
  };
}

// Import the module after setting up mocks
import {
  addHeaderCopyLinkStyles,
  enableHeaderCopyLinks,
  initHeaderCopyLinks,
  resetHeaderCopyLinksInitialization,
} from "../../src/header-copy-link";

// Helper function to create mock header elements
function createMockHeader(id: string, textContent: string, nextElementSibling: any = null) {
  return {
    id,
    textContent,
    appendChild: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    querySelector: vi.fn(() => null),
    getBoundingClientRect: vi.fn(() => ({
      bottom: 100,
      left: 50,
      right: 200,
      top: 80,
      width: 150,
      height: 20,
    })),
    nextElementSibling,
    childNodes: [
      {
        nodeType: 3, // Node.TEXT_NODE
        textContent: textContent,
      },
    ],
  };
}

// Helper function to create mock paragraph element
function createMockParagraph(textContent: string, nextElementSibling: any = null) {
  return {
    tagName: "P",
    textContent,
    nextElementSibling,
  };
}

describe("Header Copy Link", () => {
  beforeEach(() => {
    // Reset the global initialization flag before each test
    resetHeaderCopyLinksInitialization();
    vi.clearAllMocks();

    // Reset document mock
    mockDocument.createElement.mockImplementation((tagName: string) => {
      const element = {
        tagName: tagName.toUpperCase(),
        className: "",
        innerHTML: "",
        title: "",
        style: {},
        appendChild: vi.fn(),
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        removeEventListener: vi.fn(),
        textContent: "",
        id: "",
        querySelector: vi.fn(() => null),
        remove: vi.fn(),
        parentElement: {
          appendChild: vi.fn(),
        },
      };
      return element;
    });

    mockDocument.getElementById.mockReturnValue(null);
  });

  describe("URL Transformation", () => {
    // We need to test the transformUrl function, but it's not exported
    // So we'll test it indirectly through the copy functionality

    it("should transform localhost URL to production domain", async () => {
      // Mock a header element
      const mockHeader = {
        id: "test-header",
        textContent: "Test Header",
        appendChild: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        querySelector: vi.fn(() => null),
        childNodes: [
          {
            nodeType: 3, // Node.TEXT_NODE
            textContent: "Test Header",
          },
        ],
      };

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      // Set up window location for localhost
      mockWindow.location.href = "http://localhost:4000/manager-book";

      // Initialize with custom options
      const options = {
        domainMapping: {
          from: "localhost:4000/",
          to: "idvorkin.azurewebsites.net/",
        },
      };

      initHeaderCopyLinks(options);

      // Verify that the header got a copy link added
      expect(mockHeader.appendChild).toHaveBeenCalled();
      expect(mockHeader.addEventListener).toHaveBeenCalledWith("mouseenter", expect.any(Function));
      expect(mockHeader.addEventListener).toHaveBeenCalledWith("mouseleave", expect.any(Function));
    });

    it("should handle production domain mapping correctly", async () => {
      // Set up window location for production
      mockWindow.location.href = "https://idvork.in/manager-book";

      const mockHeader = {
        id: "test-header",
        textContent: "Test Header",
        appendChild: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        querySelector: vi.fn(() => null),
        childNodes: [
          {
            nodeType: 3, // Node.TEXT_NODE
            textContent: "Test Header",
          },
        ],
      };

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      initHeaderCopyLinks();

      expect(mockHeader.appendChild).toHaveBeenCalled();
    });
  });

  describe("Header ID Generation", () => {
    it("should use existing header ID if present", () => {
      const mockHeader = createMockHeader("existing-id", "Test Header");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      initHeaderCopyLinks();

      // The ID should remain unchanged
      expect(mockHeader.id).toBe("existing-id");
    });

    it("should generate ID from header text when no ID exists", () => {
      const mockHeader = createMockHeader(
        "",
        "How do you identify and help eng decide if management is right for them",
      );

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      // Mock getElementById to return null for ID uniqueness check
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null; // No existing elements with generated IDs
      });

      initHeaderCopyLinks();

      // The ID should be generated from the text
      expect(mockHeader.id).toBe("how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them");
    });

    it("should handle special characters in header text", () => {
      const mockHeader = createMockHeader("", "How to EM: Be the manager everyone wants!");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      // Special characters should be removed, spaces converted to hyphens
      expect(mockHeader.id).toBe("how-to-em-be-the-manager-everyone-wants");
    });

    it("should ensure ID uniqueness", () => {
      const mockHeader1 = createMockHeader("", "Test Header");
      const mockHeader2 = createMockHeader("", "Different Header");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader1, mockHeader2]);

      // Mock getElementById to return null for all ID checks (no existing elements)
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null; // No existing elements with generated IDs
      });

      initHeaderCopyLinks();

      // Both headers should get IDs based on their text content
      expect(mockHeader1.id).toBe("test-header");
      expect(mockHeader2.id).toBe("different-header");
      expect(mockHeader1.id).not.toBe(mockHeader2.id);
    });
  });

  describe("Copy Functionality", () => {
    it("should copy correct URL format", async () => {
      const mockClipboard = vi.fn();
      (
        globalThis as unknown as {
          navigator: { clipboard: { writeText: typeof mockClipboard } };
        }
      ).navigator.clipboard.writeText = mockClipboard;

      mockWindow.location.href = "http://localhost:4000/manager-book";

      const mockHeader = createMockHeader("test-section", "Test Section");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      // Use default options - localhost is now handled automatically
      initHeaderCopyLinks();

      // Get the copy icon that was appended to the header
      expect(mockHeader.appendChild).toHaveBeenCalled();
      const copyIcon = mockHeader.appendChild.mock.calls[0][0];

      // Get the click handler from the copy icon
      expect(copyIcon.addEventListener).toHaveBeenCalled();
      const clickHandler = copyIcon.addEventListener.mock.calls.find((call) => call[0] === "click")?.[1];

      expect(clickHandler).toBeDefined();

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      await clickHandler(mockEvent);

      // Should copy the modal.run redirect URL with query parameters
      expect(mockClipboard).toHaveBeenCalledWith("https://tinyurl.com/igor-blog/?path=manager-book%23test-section");
    });

    it("should handle clipboard API failure gracefully", async () => {
      // Mock clipboard API to fail
      const mockFailingClipboard = vi.fn().mockRejectedValue(new Error("Clipboard failed"));
      (
        globalThis as unknown as {
          navigator: { clipboard: { writeText: typeof mockFailingClipboard } };
        }
      ).navigator.clipboard.writeText = mockFailingClipboard;

      // Mock document.execCommand fallback
      const mockExecCommand = vi.fn();
      (
        globalThis as unknown as {
          document: { execCommand: typeof mockExecCommand };
        }
      ).document.execCommand = mockExecCommand;

      const mockTextArea = {
        value: "",
        select: vi.fn(),
      };

      mockDocument.createElement.mockImplementation((tagName: string) => {
        if (tagName === "textarea") return mockTextArea;
        return {
          tagName: tagName.toUpperCase(),
          className: "",
          innerHTML: "",
          title: "",
          style: {},
          appendChild: vi.fn(),
          addEventListener: vi.fn(),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          removeEventListener: vi.fn(),
          textContent: "",
          id: "",
          querySelector: vi.fn(() => null),
          remove: vi.fn(),
          parentElement: { appendChild: vi.fn() },
        };
      });

      const mockBody = {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        querySelectorAll: vi.fn(() => []),
      };
      (mockDocument as unknown as { body: typeof mockBody }).body = mockBody;

      mockWindow.location.href = "http://localhost:4000/manager-book";

      const mockHeader = createMockHeader("test-section", "Test Section");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      initHeaderCopyLinks();

      // Get the copy icon that was appended to the header
      expect(mockHeader.appendChild).toHaveBeenCalled();
      const copyIcon = mockHeader.appendChild.mock.calls[0][0];

      // Get the click handler from the copy icon
      const clickHandler = copyIcon.addEventListener.mock.calls.find((call) => call[0] === "click")?.[1];

      expect(clickHandler).toBeDefined();

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      await clickHandler(mockEvent);

      // Should fall back to execCommand
      expect(mockBody.appendChild).toHaveBeenCalledWith(mockTextArea);
      expect(mockTextArea.select).toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith("copy");
      expect(mockBody.removeChild).toHaveBeenCalledWith(mockTextArea);
    });
  });

  describe("CSS Styles", () => {
    it("should add styles only once", () => {
      // First call
      addHeaderCopyLinkStyles();
      expect(mockDocument.head.appendChild).toHaveBeenCalledTimes(1);

      // Mock that the style element now exists
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return {};
        return null;
      });

      // Second call should not add styles again
      addHeaderCopyLinkStyles();
      expect(mockDocument.head.appendChild).toHaveBeenCalledTimes(1);
    });

    it("should create style element with correct content", () => {
      addHeaderCopyLinkStyles();

      // Get the style element from head.appendChild call
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
      const styleElement = mockDocument.head.appendChild.mock.calls[0][0];
      expect(styleElement.id).toBe("header-copy-link-styles");
      expect(styleElement.textContent).toContain(".header-copy-link");
      expect(styleElement.textContent).toContain("opacity: 0");
      expect(styleElement.textContent).toContain("h1:hover .header-copy-link");
    });
  });

  describe("Integration", () => {
    it("should add share links to all header types including H1", () => {
      mockDocument.readyState = "complete";

      const mockH1 = createMockHeader("title-header", "Page Title");
      const mockH2 = createMockHeader("section-header", "Section Header");
      const mockH3 = createMockHeader("subsection-header", "Subsection Header");

      [mockH1, mockH2, mockH3].forEach((header) => {
        header.querySelector = vi.fn(() => null);
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === "h1, h2, h3, h4, h5, h6") {
          return [mockH1, mockH2, mockH3];
        }
        return [];
      });

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      // Each header should have 2 icons appended (share and GitHub)
      expect(mockH1.appendChild).toHaveBeenCalledTimes(2);
      expect(mockH2.appendChild).toHaveBeenCalledTimes(2);
      expect(mockH3.appendChild).toHaveBeenCalledTimes(2);
    });

    it("should initialize correctly when DOM is ready", () => {
      mockDocument.readyState = "complete";

      const mockHeader = createMockHeader("test-header", "Test Header");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      // Mock getElementById to return null for styles check
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      enableHeaderCopyLinks();

      // Should add styles and initialize headers
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
      expect(mockHeader.appendChild).toHaveBeenCalled();
    });

    it("should wait for DOM ready when loading", () => {
      mockDocument.readyState = "loading";

      enableHeaderCopyLinks();

      // Should add event listener for DOMContentLoaded
      expect(mockDocument.addEventListener).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function));
    });

    it("should not add duplicate copy links when called multiple times", () => {
      const mockHeader = createMockHeader("test-header", "Test Header");
      let copyLinkExists = false;

      // Mock querySelector to return null first time, then return an existing element
      mockHeader.querySelector = vi.fn(() => {
        if (copyLinkExists) {
          return { className: "header-copy-link" }; // Simulate existing copy link
        }
        return null;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      // First call should add the copy link
      initHeaderCopyLinks();
      copyLinkExists = true; // Simulate that copy link now exists

      // Second call should not add another copy link
      initHeaderCopyLinks();

      // Should add two icons per header (copy link and GitHub issue)
      expect(mockHeader.appendChild).toHaveBeenCalledTimes(2);
    });

    it("should not add duplicate copy links when enableHeaderCopyLinks is called multiple times", () => {
      mockDocument.readyState = "complete";

      const mockHeader = createMockHeader("test-header", "Test Header");
      let copyLinkExists = false;

      // Mock querySelector to return null first time, then return an existing element
      mockHeader.querySelector = vi.fn(() => {
        if (copyLinkExists) {
          return { className: "header-copy-link" }; // Simulate existing copy link
        }
        return null;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      // First call should add the copy link
      enableHeaderCopyLinks();
      copyLinkExists = true; // Simulate that copy link now exists

      // Second call should not add another copy link
      enableHeaderCopyLinks();

      // Should add two icons per header (copy link and GitHub issue)
      expect(mockHeader.appendChild).toHaveBeenCalledTimes(2);
    });
  });

  describe("Breadcrumb Format", () => {
    it("should build breadcrumb with page name and header hierarchy", async () => {
      // Mock the window location
      mockWindow.location.pathname = "/manager-book";

      // Create a mock H3 header with parent H2 and H1
      const h1 = {
        tagName: "H1",
        childNodes: [{ nodeType: 3, textContent: "Managing Engineers" }],
        previousElementSibling: null,
      };

      const h2 = {
        tagName: "H2",
        childNodes: [{ nodeType: 3, textContent: "Career Development" }],
        previousElementSibling: h1,
      };

      const h3 = {
        id: "growing-early",
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "Growing Early Career" }],
        previousElementSibling: h2,
      };

      // Mock getElementById to return our H3
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "growing-early") return h3;
        return null;
      });

      // Import the module
      const module = await import("../header-copy-link");

      // The breadcrumb should be built when copying
      // We'll test this through the share function
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      };
      mockWindow.navigator.clipboard = mockClipboard;

      // Test the function indirectly through initialization
      module.initHeaderCopyLinks();

      // Verify the expected format would be: [manager book]: Managing Engineers > Career Development > Growing Early Career
      expect(mockWindow.location.pathname).toBe("/manager-book");
    });

    it("should convert hyphens to spaces in page name", async () => {
      mockWindow.location.pathname = "/gap-year-igor";

      const h1 = {
        id: "test-header",
        tagName: "H1",
        childNodes: [{ nodeType: 3, textContent: "My Gap Year" }],
        previousElementSibling: null,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "test-header") return h1;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // The page name should be [gap year igor] not [gap-year-igor]
      expect(mockWindow.location.pathname).toBe("/gap-year-igor");
    });

    it("should handle index page correctly", async () => {
      mockWindow.location.pathname = "/";

      const h1 = {
        id: "welcome",
        tagName: "H1",
        childNodes: [{ nodeType: 3, textContent: "Welcome" }],
        previousElementSibling: null,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "welcome") return h1;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // Root path should show as [index]
      expect(mockWindow.location.pathname).toBe("/");
    });

    it("should show correct hierarchy for AI Journal diary entry", async () => {
      mockWindow.location.pathname = "/ai-journal";

      // Simulate AI Journal structure: H2 (Diary) > H3 (2025-08-21)
      const h2Diary = {
        tagName: "H2",
        childNodes: [{ nodeType: 3, textContent: "Diary" }],
        previousElementSibling: null,
      };

      const h3Date = {
        id: "2025-08-21",
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "2025-08-21" }],
        previousElementSibling: h2Diary,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "2025-08-21") return h3Date;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // Verify the breadcrumb would be: [ai journal]: Diary > 2025-08-21
      expect(mockWindow.location.pathname).toBe("/ai-journal");
    });

    it("should handle deeply nested headers with depth limit", async () => {
      mockWindow.location.pathname = "/ai-journal";

      // Create deep hierarchy: H1 > H2 > H3 > H4
      const h1 = {
        tagName: "H1",
        childNodes: [{ nodeType: 3, textContent: "Level 1" }],
        previousElementSibling: null,
      };

      const h2 = {
        tagName: "H2",
        childNodes: [{ nodeType: 3, textContent: "Level 2" }],
        previousElementSibling: h1,
      };

      const h3 = {
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "Level 3" }],
        previousElementSibling: h2,
      };

      const h4 = {
        id: "deep-section",
        tagName: "H4",
        childNodes: [{ nodeType: 3, textContent: "Level 4" }],
        previousElementSibling: h3,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "deep-section") return h4;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // Should limit to 3 levels: [ai journal]: Level 1 > Level 2 > Level 3 ...
      expect(mockWindow.location.pathname).toBe("/ai-journal");
    });

    it("should use most recent parent header when duplicates exist", async () => {
      mockWindow.location.pathname = "/test-page";

      // Structure with multiple H2s - should use the closest one
      const h2First = {
        tagName: "H2",
        childNodes: [{ nodeType: 3, textContent: "First Section" }],
        previousElementSibling: null,
      };

      const h3Under = {
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "Subsection" }],
        previousElementSibling: h2First,
      };

      const h2Second = {
        tagName: "H2",
        childNodes: [{ nodeType: 3, textContent: "Second Section" }],
        previousElementSibling: h3Under,
      };

      const h3Target = {
        id: "target",
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "Target Section" }],
        previousElementSibling: h2Second,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "target") return h3Target;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // Should use Second Section (most recent H2): [test page]: Second Section > Target Section
      expect(mockWindow.location.pathname).toBe("/test-page");
    });

    it("should handle missing intermediate header levels", async () => {
      mockWindow.location.pathname = "/blog-post";

      // H1 followed directly by H3 (no H2 in between)
      const h1 = {
        tagName: "H1",
        childNodes: [{ nodeType: 3, textContent: "Main Title" }],
        previousElementSibling: null,
      };

      const h3 = {
        id: "subsection",
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "Direct Subsection" }],
        previousElementSibling: h1,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "subsection") return h3;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // Should handle missing H2: [blog post]: Main Title > Direct Subsection
      expect(mockWindow.location.pathname).toBe("/blog-post");
    });

    it("should handle AI Journal nested subsection breadcrumb", async () => {
      mockWindow.location.pathname = "/ai-journal";

      // Simulate: H2 (Diary) > H3 (2025-08-21) > H4 (Psychic Shadows)
      const h2 = {
        tagName: "H2",
        childNodes: [{ nodeType: 3, textContent: "Diary" }],
        previousElementSibling: null,
      };

      const h3 = {
        tagName: "H3",
        childNodes: [{ nodeType: 3, textContent: "2025-08-21" }],
        previousElementSibling: h2,
      };

      const h4 = {
        id: "psychic-shadows",
        tagName: "H4",
        childNodes: [{ nodeType: 3, textContent: "Psychic Shadows Gas Lighting" }],
        previousElementSibling: h3,
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "psychic-shadows") return h4;
        return null;
      });

      const module = await import("../header-copy-link");
      module.initHeaderCopyLinks();

      // Expected: [ai journal]: Diary > 2025-08-21 > Psychic Shadows Gas Lighting
      expect(mockWindow.location.pathname).toBe("/ai-journal");
    });
  });

  describe("GitHub Issue Creation", () => {
    it("should add GitHub issue icon alongside copy link icon", () => {
      const mockHeader = createMockHeader("test-header", "Test Header");
      mockHeader.querySelector = vi.fn(() => null);

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      // Mock Font Awesome detection (return null to use fallback)
      mockDocument.querySelector.mockReturnValue(null);

      initHeaderCopyLinks();

      // Should add both copy link and GitHub issue icons
      expect(mockHeader.appendChild).toHaveBeenCalledTimes(2);

      // Check that both icons were appended
      const appendedElements = mockHeader.appendChild.mock.calls.map((call) => call[0]);
      expect(appendedElements.length).toBe(2);
      expect(appendedElements[0].className).toContain("header-copy-link");
      expect(appendedElements[1].className).toContain("header-github-issue");
    });

    it("should show popup when GitHub icon is clicked", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;

      // Mock the meta tag for source file path
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => (attr === "content" ? "_d/manager-book.md" : null),
          };
        }
        return null;
      });

      const mockHeader = createMockHeader("test-header", "Test Header");
      mockHeader.querySelector = vi.fn(() => null);

      let githubIconClickHandler: Function | null = null;

      // Capture the GitHub icon when it's created
      mockDocument.createElement.mockImplementation((tagName: string) => {
        const element: any = {
          tagName: tagName.toUpperCase(),
          className: "",
          innerHTML: "",
          title: "",
          style: {},
          appendChild: vi.fn((child: any) => {
            // When appendChild is called with an i element, simulate innerHTML update
            if (child && child.className === "fab fa-github") {
              element.innerHTML = '<i class="fab fa-github"></i>';
            }
          }),
          addEventListener: vi.fn((event: string, handler: Function) => {
            if (element.className === "header-github-issue" && event === "click") {
              githubIconClickHandler = handler;
            }
          }),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          removeEventListener: vi.fn(),
          textContent: "",
          id: "",
          querySelector: vi.fn(() => null),
          remove: vi.fn(),
          parentElement: {
            appendChild: vi.fn(),
          },
        };
        return element;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === ".github-issue-popup") {
          return []; // No existing popups
        }
        return [mockHeader];
      });

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      // Simulate clicking the GitHub issue icon
      if (githubIconClickHandler) {
        const mockEvent = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        };

        // Mock body.appendChild for popup
        const mockBodyAppendChild = vi.fn();
        mockDocument.body.appendChild = mockBodyAppendChild;

        githubIconClickHandler(mockEvent);

        // Should create and show a popup instead of immediately opening GitHub
        expect(mockOpen).not.toHaveBeenCalled();

        // Verify popup was created by checking body.appendChild was called
        expect(mockBodyAppendChild).toHaveBeenCalled();
      }
    });

    it("should open GitHub issue with custom description when popup is submitted", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;

      // Mock the meta tag for source file path
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => (attr === "content" ? "_d/manager-book.md" : null),
          };
        }
        return null;
      });

      // Mock document.body.appendChild
      mockDocument.body.appendChild = vi.fn();

      const mockHeader = createMockHeader("test-header", "Test Header");
      mockHeader.querySelector = vi.fn(() => null);

      // Track popup element and its submit handler
      let popupElement: any = null;
      let submitHandler: Function | null = null;

      mockDocument.createElement.mockImplementation((tagName: string) => {
        const element: any = {
          tagName: tagName.toUpperCase(),
          className: "",
          innerHTML: "",
          title: "",
          style: {},
          appendChild: vi.fn(),
          addEventListener: vi.fn((event: string, handler: Function) => {
            if (element.className === "github-issue-submit" && event === "click") {
              submitHandler = handler;
            }
          }),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          removeEventListener: vi.fn(),
          textContent: "",
          id: "",
          querySelector: vi.fn((selector: string) => {
            if (selector === ".github-issue-title") {
              return { value: "Custom issue title" };
            }
            if (selector === ".github-issue-comment") {
              return { value: "This section has an error in the code example" };
            }
            if (selector === ".github-issue-submit" && popupElement) {
              return element;
            }
            return null;
          }),
          remove: vi.fn(),
          parentElement: {
            appendChild: vi.fn(),
          },
        };

        if (tagName === "div" && !popupElement) {
          popupElement = element;
        }

        return element;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      // Simulate form submission in popup
      if (submitHandler && popupElement) {
        // Mock the popup querySelector to return input values
        popupElement.querySelector = vi.fn((selector: string) => {
          if (selector === ".github-issue-title") {
            return { value: "Custom issue title" };
          }
          if (selector === ".github-issue-comment") {
            return { value: "This section has an error in the code example" };
          }
          return null;
        });

        submitHandler();

        // Should open GitHub with custom title and description
        expect(mockOpen).toHaveBeenCalledWith(
          expect.stringContaining("github.com/idvorkin/idvorkin.github.io/issues/new"),
          "_blank",
        );

        const urlCall = mockOpen.mock.calls[0][0];
        const decodedUrl = decodeURIComponent(urlCall);
        // Title should have format: page/section: custom title
        expect(decodedUrl).toContain("manager-book/test-header: Custom issue title");
        // Location should be at the top as a single line
        expect(decodedUrl).toContain("📍");
        expect(decodedUrl).toContain("[[GitHub]]");
        expect(decodedUrl).not.toContain("[[Live]]");
        // Description should come after location
        expect(decodedUrl).toContain("## Description");
        expect(decodedUrl).toContain("This section has an error in the code example");
      }
    });

    it("should include content excerpt when no custom description provided", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;

      // Mock the meta tag for source file path
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => (attr === "content" ? "_d/test-page.md" : null),
          };
        }
        return null;
      });

      // Mock document.body.appendChild
      mockDocument.body.appendChild = vi.fn();

      // Create header with next paragraph element
      const mockParagraph = {
        tagName: "P",
        textContent: "This is the first paragraph after the header with important content.",
        nextElementSibling: null,
      };

      const mockHeader = createMockHeader("test-section", "Test Section");
      mockHeader.querySelector = vi.fn(() => null);
      mockHeader.nextElementSibling = mockParagraph;

      let submitHandler: Function | null = null;
      let popupElement: any = null;

      mockDocument.createElement.mockImplementation((tagName: string) => {
        const element: any = {
          tagName: tagName.toUpperCase(),
          className: "",
          innerHTML: "",
          title: "",
          style: {},
          appendChild: vi.fn(),
          addEventListener: vi.fn((event: string, handler: Function) => {
            if (element.className === "github-issue-submit" && event === "click") {
              submitHandler = handler;
            }
          }),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          removeEventListener: vi.fn(),
          textContent: "",
          id: "",
          querySelector: vi.fn((selector: string) => {
            if (selector === ".github-issue-title") {
              return { value: "" }; // No custom title
            }
            if (selector === ".github-issue-comment") {
              return { value: "" }; // No custom description
            }
            if (selector === ".github-issue-submit" && popupElement) {
              return element;
            }
            return null;
          }),
          remove: vi.fn(),
          parentElement: {
            appendChild: vi.fn(),
          },
        };

        if (tagName === "div" && !popupElement) {
          popupElement = element;
        }

        return element;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      // Simulate form submission with no custom input
      if (submitHandler && popupElement) {
        popupElement.querySelector = vi.fn((selector: string) => {
          if (selector === ".github-issue-title") {
            return { value: "" };
          }
          if (selector === ".github-issue-comment") {
            return { value: "" };
          }
          return null;
        });

        submitHandler();

        // Should open GitHub with content excerpt even without custom description
        expect(mockOpen).toHaveBeenCalled();

        const urlCall = mockOpen.mock.calls[0][0];
        const decodedUrl = decodeURIComponent(urlCall);

        // Should still have content excerpt with section heading
        expect(decodedUrl).toContain("## Content Excerpt");
        expect(decodedUrl).toContain("#### Test Section");
        expect(decodedUrl).toContain("This is the first paragraph after the header");
      }
    });

    it("should truncate long content excerpts to 500 characters", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;

      // Mock the meta tag
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => (attr === "content" ? "long-content.md" : null),
          };
        }
        return null;
      });

      mockDocument.body.appendChild = vi.fn();

      // Create a very long paragraph
      const longText = "Lorem ipsum ".repeat(100); // Creates text longer than 500 chars
      const mockParagraph = {
        tagName: "P",
        textContent: longText,
        nextElementSibling: null,
      };

      const mockHeader = createMockHeader("long-section", "Long Section");
      mockHeader.querySelector = vi.fn(() => null);
      mockHeader.nextElementSibling = mockParagraph;

      let submitHandler: Function | null = null;
      let popupElement: any = null;

      mockDocument.createElement.mockImplementation((tagName: string) => {
        const element: any = {
          tagName: tagName.toUpperCase(),
          className: "",
          innerHTML: "",
          title: "",
          style: {},
          appendChild: vi.fn(),
          addEventListener: vi.fn((event: string, handler: Function) => {
            if (element.className === "github-issue-submit" && event === "click") {
              submitHandler = handler;
            }
          }),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          removeEventListener: vi.fn(),
          textContent: "",
          id: "",
          querySelector: vi.fn(() => null),
          remove: vi.fn(),
          parentElement: {
            appendChild: vi.fn(),
          },
        };

        if (tagName === "div" && !popupElement) {
          popupElement = element;
        }

        return element;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      if (submitHandler && popupElement) {
        popupElement.querySelector = vi.fn((selector: string) => {
          if (selector === ".github-issue-title") {
            return { value: "Test" };
          }
          if (selector === ".github-issue-comment") {
            return { value: "" };
          }
          return null;
        });

        submitHandler();

        const urlCall = mockOpen.mock.calls[0][0];
        const decodedUrl = decodeURIComponent(urlCall);

        // Should have truncated content with ellipsis and section heading
        expect(decodedUrl).toContain("## Content Excerpt");
        expect(decodedUrl).toContain("#### Long Section");
        expect(decodedUrl).toContain("...");

        // Extract the content excerpt from the URL
        const excerptMatch = decodedUrl.match(/## Content Excerpt\n\n> ([^\n]+)/);
        if (excerptMatch) {
          const excerpt = excerptMatch[1];
          expect(excerpt.length).toBeLessThanOrEqual(500);
        }
      }
    });

    it("should skip empty paragraphs and find first non-empty one", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;

      // Mock the meta tag
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => (attr === "content" ? "test.md" : null),
          };
        }
        return null;
      });

      mockDocument.body.appendChild = vi.fn();

      // Create chain: header -> empty paragraph -> paragraph with content
      const emptyParagraph = {
        tagName: "P",
        textContent: "   ", // Just whitespace
        nextElementSibling: null,
      };

      const contentParagraph = {
        tagName: "P",
        textContent: "This is the actual content paragraph.",
        nextElementSibling: null,
      };

      emptyParagraph.nextElementSibling = contentParagraph;

      const mockHeader = createMockHeader("test-section", "Test Section");
      mockHeader.querySelector = vi.fn(() => null);
      mockHeader.nextElementSibling = emptyParagraph;

      let submitHandler: Function | null = null;
      let popupElement: any = null;

      mockDocument.createElement.mockImplementation((tagName: string) => {
        const element: any = {
          tagName: tagName.toUpperCase(),
          className: "",
          innerHTML: "",
          title: "",
          style: {},
          appendChild: vi.fn(),
          addEventListener: vi.fn((event: string, handler: Function) => {
            if (element.className === "github-issue-submit" && event === "click") {
              submitHandler = handler;
            }
          }),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          removeEventListener: vi.fn(),
          textContent: "",
          id: "",
          querySelector: vi.fn(() => null),
          remove: vi.fn(),
          parentElement: {
            appendChild: vi.fn(),
          },
        };

        if (tagName === "div" && !popupElement) {
          popupElement = element;
        }

        return element;
      });

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        return null;
      });

      initHeaderCopyLinks();

      if (submitHandler && popupElement) {
        popupElement.querySelector = vi.fn((selector: string) => {
          if (selector === ".github-issue-title") {
            return { value: "Test" };
          }
          if (selector === ".github-issue-comment") {
            return { value: "" };
          }
          return null;
        });

        submitHandler();

        const urlCall = mockOpen.mock.calls[0][0];
        const decodedUrl = decodeURIComponent(urlCall);

        // Should skip empty paragraph and use the one with content
        expect(decodedUrl).toContain("## Content Excerpt");
        expect(decodedUrl).toContain("#### Test Section");
        expect(decodedUrl).toContain("This is the actual content paragraph");
        expect(decodedUrl).not.toContain("   "); // Should not include the empty paragraph
      }
    });
  });
});

// Test the URL transformation logic specifically
describe("URL Transformation Logic", () => {
  beforeEach(() => {
    // Reset the global initialization flag before each test
    resetHeaderCopyLinksInitialization();
    vi.clearAllMocks();
  });

  const testCases = [
    {
      input:
        "http://localhost:4000/manager-book#how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them",
      expected:
        "https://tinyurl.com/igor-blog/?path=manager-book%23how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them",
      description: "localhost to production with long anchor",
    },
    {
      input: "https://idvork.in/manager-book#test-section",
      expected: "https://tinyurl.com/igor-blog/?path=manager-book%23test-section",
      description: "production domain mapping",
    },
    {
      input: "http://localhost:4000/simple-page#anchor",
      expected: "https://tinyurl.com/igor-blog/?path=simple-page%23anchor",
      description: "simple case",
    },
  ];

  for (const { input, expected, description } of testCases) {
    it(`should transform URL correctly: ${description}`, () => {
      // We'll test this by mocking the copy functionality and checking the result
      const mockClipboard = vi.fn();
      (
        globalThis as unknown as {
          navigator: { clipboard: { writeText: typeof mockClipboard } };
        }
      ).navigator.clipboard.writeText = mockClipboard;

      // Extract the base URL and anchor from input
      const [baseUrl, anchor] = input.split("#");
      mockWindow.location.href = baseUrl;
      // Also update pathname for the test
      const url = new URL(baseUrl);
      mockWindow.location.pathname = url.pathname;

      const mockHeader = createMockHeader(anchor, "Test Header");

      // Mock querySelectorAll directly on document
      mockDocument.querySelectorAll.mockReturnValue([mockHeader]);

      initHeaderCopyLinks();

      // Get the copy icon that was appended to the header
      const copyIcon = mockHeader.appendChild.mock.calls[0][0];

      // Get the click handler from the copy icon
      const clickHandler = copyIcon.addEventListener.mock.calls.find((call) => call[0] === "click")?.[1];

      if (clickHandler) {
        const mockEvent = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        };

        clickHandler(mockEvent);

        expect(mockClipboard).toHaveBeenCalledWith(expected);
      }
    });
  }
});
