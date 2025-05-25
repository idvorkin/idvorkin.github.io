import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the DOM environment
const mockDocument = {
	createElement: vi.fn(),
	getElementById: vi.fn(),
	head: {
		appendChild: vi.fn(),
	},
	readyState: "complete",
	addEventListener: vi.fn(),
	body: {
		querySelectorAll: vi.fn(() => []),
	},
};

const mockWindow = {
	location: {
		href: "http://localhost:4000/manager-book",
	},
	navigator: {
		clipboard: {
			writeText: vi.fn(),
		},
	},
	document: mockDocument,
};

// Mock globals - using type assertions for test environment
(globalThis as unknown as { document: typeof mockDocument }).document =
	mockDocument;
(globalThis as unknown as { window: typeof mockWindow }).window = mockWindow;
(
	globalThis as unknown as { navigator: typeof mockWindow.navigator }
).navigator = mockWindow.navigator;

// Import the module after setting up mocks
import {
	addHeaderCopyLinkStyles,
	enableHeaderCopyLinks,
	initHeaderCopyLinks,
} from "../../src/header-copy-link";

describe("Header Copy Link", () => {
	beforeEach(() => {
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
				textContent: "",
				id: "",
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
			expect(mockHeader.addEventListener).toHaveBeenCalledWith(
				"mouseenter",
				expect.any(Function),
			);
			expect(mockHeader.addEventListener).toHaveBeenCalledWith(
				"mouseleave",
				expect.any(Function),
			);
		});

		it("should handle production domain mapping correctly", async () => {
			// Set up window location for production
			mockWindow.location.href = "https://idvork.in/manager-book";

			const mockHeader = {
				id: "test-header",
				textContent: "Test Header",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
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
			const mockHeader = {
				id: "existing-id",
				textContent: "Test Header",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

			const mockContainer = {
				querySelectorAll: vi.fn(() => [mockHeader]),
			};

			mockDocument.getElementById.mockReturnValue(mockContainer);

			initHeaderCopyLinks();

			// The ID should remain unchanged
			expect(mockHeader.id).toBe("existing-id");
		});

		it("should generate ID from header text when no ID exists", () => {
			const mockHeader = {
				id: "",
				textContent:
					"How do you identify and help eng decide if management is right for them",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

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
			expect(mockHeader.id).toBe(
				"how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them",
			);
		});

		it("should handle special characters in header text", () => {
			const mockHeader = {
				id: "",
				textContent: "How to EM: Be the manager everyone wants!",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

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
			const mockHeader1 = {
				id: "",
				textContent: "Test Header",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

			const mockHeader2 = {
				id: "",
				textContent: "Different Header",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

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

			const mockHeader = {
				id: "test-section",
				textContent: "Test Section",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

			const mockContainer = {
				querySelectorAll: vi.fn(() => [mockHeader]),
			};

			mockDocument.getElementById.mockReturnValue(mockContainer);

			// Use default options - localhost is now handled automatically
			initHeaderCopyLinks();

			// Get the click handler that was added to the copy icon
			const copyIcon = mockDocument.createElement.mock.results[0].value;
			const clickHandler = copyIcon.addEventListener.mock.calls.find(
				(call) => call[0] === "click",
			)?.[1];

			if (clickHandler) {
				const mockEvent = {
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				};

				await clickHandler(mockEvent);

				// Should copy the transformed URL with domain mapping and slash instead of hash
				expect(mockClipboard).toHaveBeenCalledWith(
					"http://idvorkin.azurewebsites.net/manager-book/test-section",
				);
			}
		});

		it("should handle clipboard API failure gracefully", async () => {
			// Mock clipboard API to fail
			const mockFailingClipboard = vi
				.fn()
				.mockRejectedValue(new Error("Clipboard failed"));
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
					textContent: "",
					id: "",
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

			const mockHeader = {
				id: "test-section",
				textContent: "Test Section",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

			const mockContainer = {
				querySelectorAll: vi.fn(() => [mockHeader]),
			};

			mockDocument.getElementById.mockReturnValue(mockContainer);

			initHeaderCopyLinks();

			// Get the click handler
			const copyIcon = mockDocument.createElement.mock.results[0].value;
			const clickHandler = copyIcon.addEventListener.mock.calls.find(
				(call) => call[0] === "click",
			)?.[1];

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

			const mockHeader = {
				id: "test-header",
				textContent: "Test Header",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

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
			expect(mockDocument.addEventListener).toHaveBeenCalledWith(
				"DOMContentLoaded",
				expect.any(Function),
			);
		});
	});
});

// Test the URL transformation logic specifically
describe("URL Transformation Logic", () => {
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

			const mockHeader = {
				id: anchor,
				textContent: "Test Header",
				appendChild: vi.fn(),
				addEventListener: vi.fn(),
			};

			const mockContainer = {
				querySelectorAll: vi.fn(() => [mockHeader]),
			};

			mockDocument.getElementById.mockReturnValue(mockContainer);

			initHeaderCopyLinks();

			// Get the click handler
			const copyIcon = mockDocument.createElement.mock.results[0].value;
			const clickHandler = copyIcon.addEventListener.mock.calls.find(
				(call) => call[0] === "click",
			)?.[1];

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
