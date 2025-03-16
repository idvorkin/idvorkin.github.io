import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock window.@algolia/autocomplete-js
vi.stubGlobal("window", {
  "@algolia/autocomplete-js": {
    autocomplete: vi.fn(),
    getAlgoliaResults: vi.fn(),
  },
});

// Mock the dependencies
vi.mock("../../src/random-prompter", () => ({
  add_sunburst: vi.fn(),
  add_random_prompts: vi.fn(),
  TreeNode: vi.fn(props => props),
  shuffle: vi.fn(arr => arr),
}));

vi.mock("../../src/index", () => ({
  get_link_info: vi.fn().mockResolvedValue({
    "https://example.com": {
      url: "https://example.com",
      title: "Example Page",
      description: "This is an example page",
      file_path: "example.md",
      outgoing_links: [],
      incoming_links: [],
      redirect_url: "",
      doc_size: 1000,
      last_modified: "2023-01-01",
    },
  }),
  append_randomizer_div: vi.fn(),
  random_from_list: vi.fn(list => list[0]),
}));

vi.mock("../../src/blogger_import.js", () => ({
  add_imported_blog_posts: vi.fn(),
  add_eulogy_roles: vi.fn(),
}));

// Mock jQuery
global.$ = vi.fn();

// Import the functions to test after mocking
import {
  makePostPreviewHTML,
  make_random_post_html,
  load_random_eulogy,
  load_enjoy2,
  load_7_habits,
  load_ig66,
  load_balance,
  make_radar_map,
  make_balance_chart_by_work,
  make_balance_chart_by_desired_time_rest,
  ThingsIEnjoy,
  SevenHabits,
  months,
  row_height,
  heatmap_base,
  ideal_color,
} from "../../src/page-loader";

// Import mocked dependencies for assertions
import { add_sunburst, add_random_prompts } from "../../src/random-prompter";
import {
  get_link_info,
  random_from_list,
  append_randomizer_div,
} from "../../src/index";
import {
  add_imported_blog_posts,
  add_eulogy_roles,
} from "../../src/blogger_import.js";

describe("Page Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Plotly for each test
    global.Plotly = {
      newPlot: vi.fn().mockResolvedValue({}),
    };
  });

  describe("makePostPreviewHTML", () => {
    it("should generate correct HTML for a post preview", () => {
      const post = {
        url: "/sample-post",
        title: "Sample Post",
        description: "This is a sample post",
      };

      const result = makePostPreviewHTML(post);

      expect(result).toContain("<a href='/sample-post'}");
      expect(result).toContain("Sample Post</a>");
      expect(result).toContain("This is a sample post");
      expect(result).toContain("<audio id='");
      expect(result).toContain("🔈</a>");
    });

    it("should encode URLs correctly", () => {
      const post = {
        url: "/path/with spaces/and&symbols",
        title: "Test Post",
        description: "Description",
      };

      const result = makePostPreviewHTML(post);

      // Check that '/' were replaced with '_' in the audio filename
      expect(result).toContain(
        "/path/with spaces/and&symbols.mp3".replace(/\//g, "_")
      );
    });
  });

  describe("make_random_post_html", () => {
    it("should generate HTML for a random post", async () => {
      const mockLinkInfoProvider = vi.fn().mockResolvedValue({
        "https://example.com": {
          url: "https://example.com",
          title: "Example Page",
          description: "This is an example page",
        },
      });

      const mockRandomSelector = vi.fn().mockReturnValue({
        url: "https://example.com",
        title: "Example Page",
        description: "This is an example page",
      });

      const result = await make_random_post_html(
        mockLinkInfoProvider,
        mockRandomSelector
      );

      expect(mockLinkInfoProvider).toHaveBeenCalled();
      expect(mockRandomSelector).toHaveBeenCalled();
      expect(result).toContain("Example Page");
      expect(result).toContain("This is an example page");
    });

    it("should handle errors gracefully", async () => {
      const mockLinkInfoProvider = vi
        .fn()
        .mockRejectedValue(new Error("Test error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await make_random_post_html(mockLinkInfoProvider);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toContain("Could not load random post");

      consoleSpy.mockRestore();
    });
  });

  describe("load_random_eulogy", () => {
    it("should load random eulogy roles", () => {
      const mockEulogyLoader = vi.fn();

      load_random_eulogy(
        "#element1",
        "#element2",
        "#element3",
        mockEulogyLoader
      );

      expect(mockEulogyLoader).toHaveBeenCalledTimes(3);
      expect(mockEulogyLoader).toHaveBeenCalledWith("#element1");
      expect(mockEulogyLoader).toHaveBeenCalledWith("#element2");
      expect(mockEulogyLoader).toHaveBeenCalledWith("#element3");
    });

    it("should use default element IDs if not provided", () => {
      const mockEulogyLoader = vi.fn();

      load_random_eulogy(undefined, undefined, undefined, mockEulogyLoader);

      expect(mockEulogyLoader).toHaveBeenCalledWith("#e1");
      expect(mockEulogyLoader).toHaveBeenCalledWith("#e2");
      expect(mockEulogyLoader).toHaveBeenCalledWith("#e3");
    });

    it("should handle errors gracefully", () => {
      const mockEulogyLoader = vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      load_random_eulogy("#e1", "#e2", "#e3", mockEulogyLoader);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("load_enjoy2", () => {
    it("should load content for the Enjoy page", () => {
      const mockSunburstAdder = vi.fn();
      const mockPromptsAdder = vi.fn();
      const mockPostsAdder = vi.fn();
      const mockEulogyAdder = vi.fn();
      const mockRandomizerAppender = vi.fn();

      load_enjoy2(
        mockSunburstAdder,
        mockPromptsAdder,
        mockPostsAdder,
        mockEulogyAdder,
        mockRandomizerAppender
      );

      expect(mockSunburstAdder).toHaveBeenCalledWith(
        "sunburst",
        "sunburst_text",
        expect.any(Object)
      );
      expect(mockPromptsAdder).toHaveBeenCalled();
      expect(mockPostsAdder).toHaveBeenCalled();
      expect(mockEulogyAdder).toHaveBeenCalledWith("#random-eulogy-role");
      expect(mockRandomizerAppender).toHaveBeenCalledWith(
        "#random-blog-posts",
        expect.any(Function)
      );
    });

    it("should handle errors gracefully", () => {
      const mockSunburstAdder = vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      load_enjoy2(mockSunburstAdder);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("load_7_habits", () => {
    it("should load content for the 7 Habits page", () => {
      const mockSunburstAdder = vi.fn();
      const mockPromptsAdder = vi.fn();

      load_7_habits(mockSunburstAdder, mockPromptsAdder);

      expect(mockSunburstAdder).toHaveBeenCalledWith(
        "sunburst",
        "sunburst_text",
        expect.any(Object)
      );
      expect(mockPromptsAdder).toHaveBeenCalled();
    });

    it("should handle errors gracefully", () => {
      const mockSunburstAdder = vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      load_7_habits(mockSunburstAdder);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("load_ig66", () => {
    it("should load content for the IG66 page", () => {
      const mockPostsAdder = vi.fn();

      load_ig66(mockPostsAdder);

      expect(mockPostsAdder).toHaveBeenCalled();
    });

    it("should handle errors gracefully", () => {
      const mockPostsAdder = vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      load_ig66(mockPostsAdder);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("load_balance", () => {
    it("should load content for the Balance page", () => {
      const mockRestChartMaker = vi.fn();
      const mockWorkChartMaker = vi.fn();
      const mockRadarMapMaker = vi.fn();

      load_balance(mockRestChartMaker, mockWorkChartMaker, mockRadarMapMaker);

      expect(mockRestChartMaker).toHaveBeenCalledWith("balance-heatmap-rest");
      expect(mockWorkChartMaker).toHaveBeenCalledWith("balance-heatmap-work");
      expect(mockRadarMapMaker).toHaveBeenCalledWith("balance-radar-map-ideal");
    });

    it("should handle errors gracefully", () => {
      const mockRestChartMaker = vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      load_balance(mockRestChartMaker);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("make_radar_map", () => {
    it("should create a radar map visualization", async () => {
      const mockPlotly = {
        newPlot: vi.fn().mockResolvedValue({}),
      };

      await make_radar_map("test-div", mockPlotly);

      expect(mockPlotly.newPlot).toHaveBeenCalledWith(
        "test-div",
        expect.any(Array),
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should handle missing Plotly", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Set Plotly to undefined for this test
      delete global.Plotly;

      await make_radar_map("test-div");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle errors gracefully", async () => {
      const mockPlotly = {
        newPlot: vi.fn().mockRejectedValue(new Error("Test error")),
      };
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await make_radar_map("test-div", mockPlotly);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("make_balance_chart_by_work", () => {
    it("should create a work balance chart", async () => {
      const mockPlotly = {
        newPlot: vi.fn().mockResolvedValue({}),
      };

      await make_balance_chart_by_work("test-div", mockPlotly);

      expect(mockPlotly.newPlot).toHaveBeenCalledWith(
        "test-div",
        expect.any(Array),
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should handle missing Plotly", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Set Plotly to undefined for this test
      delete global.Plotly;

      await make_balance_chart_by_work("test-div");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle errors gracefully", async () => {
      const mockPlotly = {
        newPlot: vi.fn().mockRejectedValue(new Error("Test error")),
      };
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await make_balance_chart_by_work("test-div", mockPlotly);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("make_balance_chart_by_desired_time_rest", () => {
    it("should create a rest time chart", async () => {
      const mockPlotly = {
        newPlot: vi.fn().mockResolvedValue({}),
      };

      await make_balance_chart_by_desired_time_rest("test-div", mockPlotly);

      expect(mockPlotly.newPlot).toHaveBeenCalledWith(
        "test-div",
        expect.any(Array),
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should handle missing Plotly", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Set Plotly to undefined for this test
      delete global.Plotly;

      await make_balance_chart_by_desired_time_rest("test-div");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle errors gracefully", async () => {
      const mockPlotly = {
        newPlot: vi.fn().mockRejectedValue(new Error("Test error")),
      };
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await make_balance_chart_by_desired_time_rest("test-div", mockPlotly);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("SevenHabits", () => {
    it("should create a tree with the correct structure", () => {
      const sevenHabits = new SevenHabits();
      const tree = sevenHabits.get_tree();

      expect(tree.name).toBe("7H ");
      expect(tree.children.length).toBe(8);
      expect(tree.children[1].name).toBe("Be Proactive");
      expect(tree.children[7].name).toBe("Sharpen the Saw");
    });
  });

  describe("ThingsIEnjoy", () => {
    it("should create a tree with the correct structure", () => {
      const thingsIEnjoy = new ThingsIEnjoy();
      const tree = thingsIEnjoy.get_tree();

      expect(tree.name).toBe("Invest in");
      expect(tree.children.length).toBe(5);

      // Check that all expected categories exist
      const categoryNames = tree.children.map(child => child.name);
      expect(categoryNames).toContain("Health");
      expect(categoryNames).toContain("Magic");
      expect(categoryNames).toContain("Hobbies");
      expect(categoryNames).toContain("Relationships");
      expect(categoryNames).toContain("Joy");
    });
  });

  describe("Constants", () => {
    it("should export the correct constants", () => {
      expect(months.length).toBe(12);
      expect(months[0]).toBe("Jan");
      expect(months[11]).toBe("Dec");

      expect(row_height).toBe(20);
      expect(heatmap_base).toBe(100);
      expect(ideal_color).toBe("#00BF00");
    });
  });
});
