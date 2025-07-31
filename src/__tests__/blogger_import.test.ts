import { beforeEach, describe, expect, it, vi } from "vitest";
import { add_eulogy_roles, add_imported_blog_posts, html_for_role } from "../../src/blogger_import";
import * as index from "../../src/index";

// Mock dependencies
vi.mock("../../src/index", () => ({
  random_from_list: vi.fn((arr) => arr[0]),
  append_randomizer_div: vi.fn(),
}));

describe("Blogger Import Module", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Setup jQuery and $.getJSON mock
    global.$ = vi.fn().mockImplementation(() => ({
      append: vi.fn(),
      html: vi.fn().mockReturnValue("<div>Test HTML</div>"),
    }));

    global.$.getJSON = vi.fn().mockImplementation((url, callback) => {
      if (url === "/ig66/ig66-export.json") {
        callback([
          {
            url: "/test-post",
            title: "Test Post",
            excerpt: "Test excerpt",
            published: "2023-01-01T12:00:00Z",
            thumbnail: "https://example.com/thumb.jpg",
            tags: ["tag1", "tag2"],
          },
          {
            url: "/achievement-post",
            title: "Achievement Post",
            excerpt: "Achievement excerpt",
            published: "2023-02-01T12:00:00Z",
            thumbnail: "",
            tags: ["achievement"],
          },
          {
            url: "/family-post",
            title: "Family Post",
            excerpt: "Family excerpt",
            published: "2023-03-01T12:00:00Z",
            thumbnail: "https://example.com/family.jpg",
            tags: ["family-journal"],
          },
        ]);
      } else if (url === "/eulogy.json") {
        callback({
          roles: [
            {
              title: "Role 1",
              summary: "Role 1 summary",
              full_text: "Role 1 full text",
            },
            {
              title: "Role 2",
              summary: "Role 2 summary",
              full_text: "Role 2 full text",
            },
          ],
        });
      }
    });

    // Mock Math.random for deterministic tests
    global.Math.random = vi.fn().mockReturnValue(0);

    // Mock console
    console.log = vi.fn();
  });

  describe("add_imported_blog_posts", () => {
    it("should fetch and process blog posts", () => {
      add_imported_blog_posts();

      // Check that $.getJSON was called with the correct URL
      expect(global.$.getJSON).toHaveBeenCalledWith("/ig66/ig66-export.json", expect.any(Function));

      // Check that append_randomizer_div was called three times
      expect(index.append_randomizer_div).toHaveBeenCalledTimes(3);

      // Check that it was called with the correct selectors
      expect(index.append_randomizer_div).toHaveBeenCalledWith("#random-post", expect.any(Function));
      expect(index.append_randomizer_div).toHaveBeenCalledWith("#achievment", expect.any(Function));
      expect(index.append_randomizer_div).toHaveBeenCalledWith("#random-recent", expect.any(Function));
    });
  });

  describe("add_eulogy_roles", () => {
    it("should fetch and process eulogy roles", () => {
      add_eulogy_roles("#eulogy-div");

      // Check that $.getJSON was called with the correct URL
      expect(global.$.getJSON).toHaveBeenCalledWith("/eulogy.json", expect.any(Function));

      // Check that append_randomizer_div was called once
      expect(index.append_randomizer_div).toHaveBeenCalledTimes(1);

      // Check that it was called with the correct selector
      expect(index.append_randomizer_div).toHaveBeenCalledWith("#eulogy-div", expect.any(Function));
    });
  });

  describe("html_for_role", () => {
    it("should generate HTML for a role", () => {
      const role = {
        title: "Test Role",
        summary: "Test summary",
        full_text: "Test full text",
      };

      const html = html_for_role(role);

      // Check that the HTML contains the role title and summary
      expect(html).toContain("Test Role");
      expect(html).toContain("Test summary");

      // Check that the HTML contains the audio player
      expect(html).toContain('<audio id="eulogy-player">');

      // Check that the correct URL is used for the audio
      expect(html).toContain("Test%20Role.mp3");

      // Check that the play button is included
      expect(html).toContain("toggle_play_pause('eulogy-player')");
    });
  });
});
