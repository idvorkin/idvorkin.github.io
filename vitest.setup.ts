// This file contains setup code that will run before each test
import { vi } from "vitest";

// Define a simplified jQuery mock
const jQueryMock = vi.fn().mockImplementation((selector) => {
  return {
    length: selector ? 1 : 0,
    text: vi.fn().mockReturnThis(),
    html: vi.fn().mockReturnThis(),
    addClass: vi.fn().mockReturnThis(),
    removeClass: vi.fn().mockReturnThis(),
    toggleClass: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    css: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    click: vi.fn().mockReturnThis(),
    append: vi.fn().mockReturnThis(),
    find: vi.fn().mockReturnThis(),
  };
});

// Add static methods
jQueryMock.ajax = vi.fn().mockResolvedValue({});
jQueryMock.get = vi.fn().mockResolvedValue({});
jQueryMock.post = vi.fn().mockResolvedValue({});

// Make it available to tests
vi.stubGlobal("$", jQueryMock);
vi.stubGlobal("jQuery", jQueryMock);

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:4000/",
    pathname: "/",
    search: "",
    hash: "",
    host: "localhost:4000",
    hostname: "localhost",
    protocol: "http:",
    origin: "http://localhost:4000",
    port: "4000",
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Add any other global mocks or setup here
