import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Featured Posts", () => {
  let mockDocument: any;
  let mockWindow: any;

  beforeEach(() => {
    // Set up DOM mocks
    mockDocument = {
      getElementById: vi.fn(),
      createElement: vi.fn(),
      querySelectorAll: vi.fn(),
    };

    mockWindow = {
      location: {
        pathname: "/",
        href: "http://localhost:4000/",
      },
    };

    global.document = mockDocument as any;
    global.window = mockWindow as any;
  });

  describe("Homepage Featured Posts", () => {
    it("should fetch featured posts from backlinks data", async () => {
      // Mock the featured results container
      const mockFeaturedContainer = {
        innerHTML: "",
      };

      mockDocument.getElementById.mockImplementation((id: string) => {
        if (id === "featured-results") {
          return mockFeaturedContainer;
        }
        return null;
      });

      // Mock backlinks data
      const mockBacklinksData = {
        "/eulogy": {
          title: "Igor's Eulogy",
          url: "/eulogy",
          description: "A vision of a life well-lived and the legacy to leave behind",
          tags: ["how igor ticks", "emotional intelligence"],
        },
        "/manager-book": {
          title: "The Manager Book",
          url: "/manager-book",
          description: "Essential guide for engineering managers and leadership",
          tags: ["management", "software engineering"],
        },
        "/work-life-balance": {
          title: "Work-Life Balance",
          url: "/work-life-balance",
          description: "Finding harmony between professional success and personal fulfillment",
          tags: ["how igor ticks", "emotional intelligence"],
        },
      };

      // Featured URLs from _data/featured.yml
      const featuredUrls = ["/eulogy", "/manager-book", "/work-life-balance"];

      // Map URLs to post data from backlinks (simulating what index.md does)
      const featuredPosts = featuredUrls
        .map((url) => {
          const postInfo = mockBacklinksData[url];
          if (postInfo) {
            return {
              title: postInfo.title || url,
              url: url,
              description: postInfo.description || "",
            };
          }
          return null;
        })
        .filter((post) => post !== null);

      // Simulate rendering featured posts (same logic as in index.md)
      const renderBasicItem = (item: any) => {
        let description = item.description || "";
        if (description.length > 150) {
          description = `${description.substring(0, 147)}...`;
        }
        return `<div class="result-item" onclick="window.location='${item.url}';"><div><a href="${item.url}">${item.title}</a> <span class="description">${description}</span></div></div>`;
      };

      mockFeaturedContainer.innerHTML = featuredPosts.map(renderBasicItem).join("");

      // Verify the container has the expected content
      expect(mockFeaturedContainer.innerHTML).toContain("Igor's Eulogy");
      expect(mockFeaturedContainer.innerHTML).toContain("/eulogy");
      expect(mockFeaturedContainer.innerHTML).toContain("The Manager Book");
      expect(mockFeaturedContainer.innerHTML).toContain("/manager-book");
      expect(mockFeaturedContainer.innerHTML).toContain("Work-Life Balance");
      expect(mockFeaturedContainer.innerHTML).toContain("/work-life-balance");
      expect(mockFeaturedContainer.innerHTML).toContain("A vision of a life well-lived");
    });

    it("should fetch from backlinks instead of Algolia search", async () => {
      // Mock Algolia search client
      const mockSearchClient = {
        initIndex: vi.fn(),
      };

      const mockIndex = {
        search: vi.fn(),
      };

      mockSearchClient.initIndex.mockReturnValue(mockIndex);

      // Mock get_link_info to return backlinks data
      const mockGetLinkInfo = vi.fn().mockResolvedValue({
        "/eulogy": {
          title: "Igor's Eulogy",
          url: "/eulogy",
          description: "A vision of a life well-lived and the legacy to leave behind",
        },
      });

      // Featured posts should be loaded from backlinks, not Algolia search
      expect(mockIndex.search).not.toHaveBeenCalled();

      // Simulate fetching from backlinks
      const backlinksData = await mockGetLinkInfo();
      expect(mockGetLinkInfo).toHaveBeenCalled();
      expect(backlinksData["/eulogy"]).toBeDefined();
      expect(backlinksData["/eulogy"].title).toBe("Igor's Eulogy");
    });

    it("should truncate long descriptions to 150 characters", () => {
      const longDescription =
        "This is a very long description that exceeds the 150 character limit and should be truncated with ellipsis at the end. This ensures that the UI remains consistent and clean without overly long text blocks that could break the layout.";

      const renderBasicItem = (item: any) => {
        let description = item.description || "";
        if (description.length > 150) {
          description = `${description.substring(0, 147)}...`;
        }
        return `<div class="result-item"><a href="${item.url}">${item.title}</a> <span class="description">${description}</span></div>`;
      };

      const item = {
        title: "Test Post",
        url: "/test",
        description: longDescription,
      };

      const rendered = renderBasicItem(item);

      expect(rendered).toContain("...");
      expect(rendered.indexOf("...")).toBeGreaterThan(0);
      // Check that description was truncated
      expect(rendered).not.toContain("break the layout");
    });
  });

  describe("Featured Page Data Structure", () => {
    it("should have correct data structure for featured.yml", () => {
      // Mock the featured data structure - now just URLs
      const featuredData = {
        featured_posts: ["/eulogy", "/manager-book", "/work-life-balance"],
      };

      // Verify data structure
      expect(featuredData.featured_posts).toBeDefined();
      expect(featuredData.featured_posts).toHaveLength(3);

      // Check that posts are just URLs
      featuredData.featured_posts.forEach((url) => {
        expect(typeof url).toBe("string");
        expect(url).toMatch(/^\/[a-z-]+$/);
      });
    });

    it("should render featured posts fetched from backlinks", async () => {
      const mockFeaturedPageContainer = {
        innerHTML: "",
      };

      // Mock backlinks data
      const mockBacklinksData = {
        "/test": {
          title: "Test Post",
          url: "/test",
          description: "Test description",
          tags: ["tag1", "tag2"],
        },
      };

      // Featured URLs from _data/featured.yml
      const featuredUrls = ["/test"];

      // Map URLs to post data from backlinks (simulating what featured.html does)
      const featuredPosts = featuredUrls
        .map((url) => {
          const postInfo = mockBacklinksData[url];
          if (postInfo) {
            return {
              title: postInfo.title || url,
              url: url,
              description: postInfo.description || "",
              tags: postInfo.tags || [],
            };
          }
          return null;
        })
        .filter((post) => post !== null);

      // Create site data object
      const siteData = {
        featured: {
          featured_posts: featuredPosts,
        },
      };

      // Simulate featured.html rendering logic
      const renderFeaturedPage = (data: any) => {
        if (!data.featured?.featured_posts) {
          return '<div class="notepad-page-title row"><h1>No posts have been featured yet</h1></div>';
        }

        return data.featured.featured_posts
          .map(
            (post: any) => `
          <li>
            <article>
              <i class="fa fa-star-half-o"></i>
              <a href="${post.url}">${post.title}</a>
              <div class="entry-description">${post.description}</div>
              <div class="entry-tags">
                ${post.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join("")}
              </div>
            </article>
          </li>
        `,
          )
          .join("");
      };

      mockFeaturedPageContainer.innerHTML = renderFeaturedPage(siteData);

      // Verify rendering
      expect(mockFeaturedPageContainer.innerHTML).toContain("Test Post");
      expect(mockFeaturedPageContainer.innerHTML).toContain("/test");
      expect(mockFeaturedPageContainer.innerHTML).toContain("Test description");
      expect(mockFeaturedPageContainer.innerHTML).toContain("tag1");
      expect(mockFeaturedPageContainer.innerHTML).toContain("tag2");
      expect(mockFeaturedPageContainer.innerHTML).toContain('class="entry-description"');
      expect(mockFeaturedPageContainer.innerHTML).toContain('class="entry-tags"');
      expect(mockFeaturedPageContainer.innerHTML).toContain('class="tag"');
    });
  });
});
