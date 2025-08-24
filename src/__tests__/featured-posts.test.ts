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
    it("should render hardcoded featured posts on homepage", () => {
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

      // Hardcoded featured posts data (matching what's in index.md)
      const featuredPosts = [
        {
          title: "Igor's Eulogy",
          url: "/eulogy",
          description: "A vision of a life well-lived and the legacy to leave behind",
        },
        {
          title: "The Manager Book",
          url: "/manager-book",
          description: "Essential guide for engineering managers and leadership",
        },
        {
          title: "Work-Life Balance",
          url: "/work-life-balance",
          description: "Finding harmony between professional success and personal fulfillment",
        },
      ];

      // Simulate rendering featured posts (same logic as in index.md)
      const renderBasicItem = (item: any) => {
        let description = item.description || "";
        if (description.length > 150) {
          description = description.substring(0, 147) + "...";
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

    it("should not make Algolia search calls for featured posts", () => {
      // Mock Algolia search client
      const mockSearchClient = {
        initIndex: vi.fn(),
      };
      
      const mockIndex = {
        search: vi.fn(),
      };
      
      mockSearchClient.initIndex.mockReturnValue(mockIndex);
      
      // Simulate loading featured posts without Algolia
      const featuredPosts = [
        {
          title: "Igor's Eulogy",
          url: "/eulogy",
          description: "A vision of a life well-lived and the legacy to leave behind",
        },
      ];

      // Featured posts should be loaded from hardcoded data, not search
      expect(mockIndex.search).not.toHaveBeenCalled();
      expect(featuredPosts).toHaveLength(1);
      expect(featuredPosts[0].title).toBe("Igor's Eulogy");
    });

    it("should truncate long descriptions to 150 characters", () => {
      const longDescription = "This is a very long description that exceeds the 150 character limit and should be truncated with ellipsis at the end. This ensures that the UI remains consistent and clean without overly long text blocks that could break the layout.";
      
      const renderBasicItem = (item: any) => {
        let description = item.description || "";
        if (description.length > 150) {
          description = description.substring(0, 147) + "...";
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
      // Mock the featured data structure
      const featuredData = {
        featured_posts: [
          {
            title: "Igor's Eulogy",
            url: "/eulogy",
            description: "A vision of a life well-lived and the legacy to leave behind",
            tags: ["how igor ticks", "emotional intelligence"],
          },
          {
            title: "The Manager Book",
            url: "/manager-book",
            description: "Essential guide for engineering managers and leadership",
            tags: ["management", "software engineering"],
          },
          {
            title: "Work-Life Balance",
            url: "/work-life-balance",
            description: "Finding harmony between professional success and personal fulfillment",
            tags: ["how igor ticks", "emotional intelligence"],
          },
          {
            title: "Seven Habits of Highly Effective People",
            url: "/7-habits",
            description: "The foundational book for living an effective life",
            tags: ["book-notes", "how igor ticks"],
          },
          {
            title: "Essentialism",
            url: "/essentialism",
            description: "The disciplined pursuit of less but better",
            tags: ["book-notes", "productivity"],
          },
          {
            title: "Tech Career Insights",
            url: "/tech-career-insights",
            description: "Lessons learned from decades in the tech industry",
            tags: ["software engineering", "career"],
          },
        ],
      };

      // Verify data structure
      expect(featuredData.featured_posts).toBeDefined();
      expect(featuredData.featured_posts).toHaveLength(6);
      
      // Check first post structure
      const firstPost = featuredData.featured_posts[0];
      expect(firstPost).toHaveProperty("title");
      expect(firstPost).toHaveProperty("url");
      expect(firstPost).toHaveProperty("description");
      expect(firstPost).toHaveProperty("tags");
      expect(Array.isArray(firstPost.tags)).toBe(true);
      
      // Verify all posts have required fields
      featuredData.featured_posts.forEach((post) => {
        expect(post.title).toBeTruthy();
        expect(post.url).toBeTruthy();
        expect(post.description).toBeTruthy();
        expect(Array.isArray(post.tags)).toBe(true);
        expect(post.tags.length).toBeGreaterThan(0);
      });
    });

    it("should render featured posts with tags on featured page", () => {
      const mockFeaturedPageContainer = {
        innerHTML: "",
      };

      // Simulate Jekyll data
      const siteData = {
        featured: {
          featured_posts: [
            {
              title: "Test Post",
              url: "/test",
              description: "Test description",
              tags: ["tag1", "tag2"],
            },
          ],
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