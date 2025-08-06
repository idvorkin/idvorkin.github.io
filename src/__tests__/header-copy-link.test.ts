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
if (typeof Array.from === 'undefined') {
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
function createMockHeader(id: string, textContent: string) {
  return {
    id,
    textContent,
    appendChild: vi.fn(),
    addEventListener: vi.fn(),
    querySelector: vi.fn(() => null),
    getBoundingClientRect: vi.fn(() => ({
      bottom: 100,
      left: 50,
      right: 200,
      top: 80,
      width: 150,
      height: 20,
    })),
    nextElementSibling: null,
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
        querySelector: vi.fn(() => null),
      };

      // Mock the content container
      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

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
        querySelector: vi.fn(() => null),
      };

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

      initHeaderCopyLinks();

      expect(mockHeader.appendChild).toHaveBeenCalled();
    });
  });

  describe("Header ID Generation", () => {
    it("should use existing header ID if present", () => {
      const mockHeader = createMockHeader("existing-id", "Test Header");

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

      initHeaderCopyLinks();

      // The ID should remain unchanged
      expect(mockHeader.id).toBe("existing-id");
    });

    it("should generate ID from header text when no ID exists", () => {
      const mockHeader = createMockHeader(
        "",
        "How do you identify and help eng decide if management is right for them",
      );

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

      // Mock getElementById to return null for ID uniqueness check
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
        return null; // No existing elements with generated IDs
      });

      initHeaderCopyLinks();

      // The ID should be generated from the text
      expect(mockHeader.id).toBe("how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them");
    });

    it("should handle special characters in header text", () => {
      const mockHeader = createMockHeader("", "How to EM: Be the manager everyone wants!");

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
        return null;
      });

      initHeaderCopyLinks();

      // Special characters should be removed, spaces converted to hyphens
      expect(mockHeader.id).toBe("how-to-em-be-the-manager-everyone-wants");
    });

    it("should ensure ID uniqueness", () => {
      const mockHeader1 = createMockHeader("", "Test Header");
      const mockHeader2 = createMockHeader("", "Different Header");

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader1, mockHeader2]),
      };

      // Mock getElementById to return null for all ID checks (no existing elements)
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

      // Use default options - localhost is now handled automatically
      initHeaderCopyLinks();

      // Get the click handler that was added to the copy icon
      const copyIcon = mockDocument.createElement.mock.results[0].value;
      const clickHandler = copyIcon.addEventListener.mock.calls.find((call) => call[0] === "click")?.[1];

      if (clickHandler) {
        const mockEvent = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        };

        await clickHandler(mockEvent);

        // Should copy the transformed URL with domain mapping and slash instead of hash
        expect(mockClipboard).toHaveBeenCalledWith("http://idvorkin.azurewebsites.net/manager-book/test-section");
      }
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

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

      initHeaderCopyLinks();

      // Get the click handler
      const copyIcon = mockDocument.createElement.mock.results[0].value;
      const clickHandler = copyIcon.addEventListener.mock.calls.find((call) => call[0] === "click")?.[1];

      if (clickHandler) {
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
      }
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

      const styleElement = mockDocument.createElement.mock.results[0].value;
      expect(styleElement.id).toBe("header-copy-link-styles");
      expect(styleElement.textContent).toContain(".header-copy-link");
      expect(styleElement.textContent).toContain("opacity: 0");
      expect(styleElement.textContent).toContain("h1:hover .header-copy-link");
    });
  });

  describe("Integration", () => {
    it("should initialize correctly when DOM is ready", () => {
      mockDocument.readyState = "complete";

      const mockHeader = createMockHeader("test-header", "Test Header");

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      // Mock getElementById to return null for styles check and mockContainer for content-holder
      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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

  describe("GitHub Issue Creation", () => {
    it("should add GitHub issue icon alongside copy link icon", () => {
      const mockHeader = createMockHeader("test-header", "Test Header");
      mockHeader.querySelector = vi.fn(() => null);

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
        return null;
      });
      
      // Mock Font Awesome detection (return null to use fallback)
      mockDocument.querySelector.mockReturnValue(null);

      initHeaderCopyLinks();

      // Should add both copy link and GitHub issue icons
      expect(mockHeader.appendChild).toHaveBeenCalledTimes(2);
      
      // Check that the created elements include both icons
      const createdElements = mockDocument.createElement.mock.results
        .filter(result => result.value.tagName === "SPAN")
        .map(result => result.value);
      
      // Should have created at least 2 span elements (copy link and GitHub issue)
      expect(createdElements.length).toBeGreaterThanOrEqual(2);
      
      // Check for the GitHub issue icon
      const githubIcon = createdElements.find(el => el.className === "header-github-issue");
      expect(githubIcon).toBeDefined();
      // The innerHTML might be empty or contain the icon depending on Font Awesome availability
      expect(githubIcon?.textContent === '⚠️' || githubIcon?.innerHTML === '<i class="fab fa-github"></i>').toBe(true);
      expect(githubIcon?.title).toBe("Create GitHub issue for this section");
    });

    it("should show popup when GitHub icon is clicked", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;
      
      // Mock the meta tag for source file path
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => attr === "content" ? "_d/manager-book.md" : null
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
            if (child && child.className === 'fab fa-github') {
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

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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
        
        // Verify popup was created
        const createdElements = mockDocument.createElement.mock.results
          .filter(result => result.value.className === "github-issue-popup")
          .map(result => result.value);
        
        expect(createdElements.length).toBeGreaterThan(0);
      }
    });

    it("should open GitHub issue with custom description when popup is submitted", () => {
      const mockOpen = vi.fn();
      (globalThis as any).window.open = mockOpen;
      
      // Mock the meta tag for source file path
      mockDocument.querySelector.mockImplementation((selector: string) => {
        if (selector === 'meta[property="markdown-path"]') {
          return {
            getAttribute: (attr: string) => attr === "content" ? "_d/manager-book.md" : null
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
      
      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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
          "_blank"
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
            getAttribute: (attr: string) => attr === "content" ? "_d/test-page.md" : null
          };
        }
        return null;
      });
      
      // Mock document.body.appendChild
      mockDocument.body.appendChild = vi.fn();
      
      // Create header with next paragraph element
      const mockParagraph = {
        tagName: 'P',
        textContent: 'This is the first paragraph after the header with important content.',
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
      
      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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
            getAttribute: (attr: string) => attr === "content" ? "long-content.md" : null
          };
        }
        return null;
      });
      
      mockDocument.body.appendChild = vi.fn();
      
      // Create a very long paragraph
      const longText = "Lorem ipsum ".repeat(100); // Creates text longer than 500 chars
      const mockParagraph = {
        tagName: 'P',
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
      
      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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
            getAttribute: (attr: string) => attr === "content" ? "test.md" : null
          };
        }
        return null;
      });
      
      mockDocument.body.appendChild = vi.fn();
      
      // Create chain: header -> empty paragraph -> paragraph with content
      const emptyParagraph = {
        tagName: 'P',
        textContent: '   ', // Just whitespace
        nextElementSibling: null,
      };
      
      const contentParagraph = {
        tagName: 'P',
        textContent: 'This is the actual content paragraph.',
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
      
      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "header-copy-link-styles") return null;
        if (id === "content-holder") return mockContainer;
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
        "http://idvorkin.azurewebsites.net/manager-book/how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them",
      description: "localhost to production with long anchor",
    },
    {
      input: "https://idvork.in/manager-book#test-section",
      expected: "https://idvorkin.azurewebsites.net/manager-book/test-section",
      description: "production domain mapping",
    },
    {
      input: "http://localhost:4000/simple-page#anchor",
      expected: "http://idvorkin.azurewebsites.net/simple-page/anchor",
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

      const mockHeader = createMockHeader(anchor, "Test Header");

      const mockContainer = {
        querySelectorAll: vi.fn(() => [mockHeader]),
      };

      mockDocument.getElementById.mockReturnValue(mockContainer);

      initHeaderCopyLinks();

      // Get the click handler
      const copyIcon = mockDocument.createElement.mock.results[0].value;
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
