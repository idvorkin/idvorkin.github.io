// ABOUTME: Tests that get_random_page_url respects a topic, using a stubbed back-links.json.
// ABOUTME: Covers the fallbacks: unknown topic, topic with no posts, and data that fails to load.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const urlInfo = {
  "/ai-post": { url: "/ai-post", topics: ["ai", "tech"] },
  "/family-post": { url: "/family-post", topics: ["family"] },
  "/second-family-post": { url: "/second-family-post", topics: ["family", "mind"] },
  "/no-topic-post": { url: "/no-topic-post", topics: [] },
  "/stale-index-post": { url: "/stale-index-post" },
  // Excluded from every roll, topic or not.
  "/random": { url: "/random", topics: ["ai"] },
  "/ig66/week-1": { url: "/ig66/week-1", topics: ["ai"] },
};

async function pickAll(topic?: string | null): Promise<Set<string>> {
  const { get_random_page_url } = await import("../shared");
  const seen = new Set<string>();
  const random = vi.spyOn(Math, "random");
  for (let i = 0; i < 40; i++) {
    random.mockReturnValue(i / 40);
    seen.add(await get_random_page_url(topic));
  }
  random.mockRestore();
  return seen;
}

const everything = new Set(["/ai-post", "/family-post", "/second-family-post", "/no-topic-post", "/stale-index-post"]);

describe("get_random_page_url with a topic", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.fetch = vi.fn().mockResolvedValue({ json: () => Promise.resolve({ url_info: urlInfo }) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("no topic rolls from everything, silently", async () => {
    expect(await pickAll()).toEqual(everything);
    expect(await pickAll(null)).toEqual(everything);
    expect(warn).not.toHaveBeenCalled();
  });

  it("a topic rolls only from its posts", async () => {
    expect(await pickAll("ai")).toEqual(new Set(["/ai-post"]));
    expect(await pickAll("family")).toEqual(new Set(["/family-post", "/second-family-post"]));
    expect(warn).not.toHaveBeenCalled();
  });

  it("a topic never lands on the excluded pages", async () => {
    const seen = await pickAll("ai");
    expect(seen.has("/random")).toBe(false);
    expect(seen.has("/ig66/week-1")).toBe(false);
  });

  it("an unknown topic falls back to everything with a warning", async () => {
    expect(await pickAll("cooking")).toEqual(everything);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("cooking"));
  });

  it("a known topic with no posts falls back to everything with a warning", async () => {
    expect(await pickAll("books")).toEqual(everything);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("books"));
  });

  it("an index built without topics falls back to everything with a warning", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ url_info: { "/a": { url: "/a" }, "/b": { url: "/b" } } }),
    });
    expect(await pickAll("ai")).toEqual(new Set(["/a", "/b"]));
    expect(warn).toHaveBeenCalled();
  });

  it("back-links.json failing to load warns, does not throw, and goes home", async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    expect(await pickAll("ai")).toEqual(new Set(["/"]));
    expect(warn).toHaveBeenCalled();
  });

  it("back-links.json failing with no topic goes home without the topic warning", async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    expect(await pickAll()).toEqual(new Set(["/"]));
    expect(warn).not.toHaveBeenCalled();
  });
});
