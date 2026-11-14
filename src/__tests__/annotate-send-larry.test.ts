// ABOUTME: The annotate tool's "Send to Larry" (_includes/annotate.html) on a tailnet or localhost host:
// ABOUTME: a status dot from the Cockpit on the same hostname, one POST per page, buffer cleared only on 2xx.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TAILNET = "box.example-tail.ts.net";

const loadAnnotate = () => {
  const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
  const start = include.lastIndexOf("<script>");
  new Function(include.slice(start + "<script>".length, include.lastIndexOf("</script>")))();
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

type Call = { url: string; init?: RequestInit };

function stubFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      return handler(url, init);
    }),
  );
  return calls;
}

function note(permalink: string, quote: string, comment: string, origin: string) {
  return {
    permalink,
    origin,
    title: `Title of ${permalink}`,
    quote,
    prefix: "before ",
    suffix: " after",
    comment,
    intent: "fix",
    ts: `2026-11-10T10:00:00.000Z${quote}`,
  };
}

const buffer = () => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]");
const dot = () => document.getElementById("blog-annot-larry-dot") as HTMLElement | null;
const api = () => (window as any).blogAnnotate;

function boot(hostname: string, port = "8445") {
  window.location.hostname = hostname;
  window.location.port = port;
  window.location.pathname = "/foo";
  document.body.innerHTML =
    '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" hidden></div>' +
    '<div id="content-holder"><p>The quick brown fox.</p></div>';
  localStorage.setItem("blogAnnotate", "1");
  loadAnnotate();
}

describe("Send to Larry", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
    localStorage.clear();
    (window as any).__GIT_BRANCH__ = "tighten-intro";
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
    (window as any).blogAnnotate = undefined;
    (window as any).__GIT_BRANCH__ = undefined;
    document.documentElement.classList.remove("blog-annot-off");
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.location.hostname = "localhost";
    window.location.pathname = "/";
  });

  it("never polls or posts to a Cockpit on the production host", () => {
    const calls = stubFetch(() => json({}));
    boot("idvork.in", "");
    expect(document.getElementById("blog-annot-pill")).not.toBeNull();
    expect(document.getElementById("blog-annot-send")?.textContent).toBe("Send to Larry");
    expect(dot()).toBeNull();
    expect(api().refreshLarry).toBeUndefined();
    vi.advanceTimersByTime(120000);
    expect(calls).toHaveLength(0);
  });

  it("asks the Cockpit on the same hostname, https, default port, and colors the dot", async () => {
    const calls = stubFetch(() => json({ ok: true, state: "idle", queued: 0 }));
    boot(TAILNET);
    expect(document.getElementById("blog-annot-send")?.textContent).toBe("Send to Larry");
    await api().refreshLarry();
    expect(calls[0].url).toBe(`https://${TAILNET}/larry/status`);
    expect(dot()?.getAttribute("data-state")).toBe("idle");
  });

  it("shows busy with the queue, down with the reason, and red when unreachable", async () => {
    let reply: () => Response | Promise<Response> = () => json({ state: "busy", queued: 3 });
    stubFetch(() => reply());
    boot(TAILNET);
    await api().refreshLarry();
    expect(dot()?.getAttribute("data-state")).toBe("busy");
    expect(dot()?.title).toBe("Larry: busy, 3 queued");

    reply = () => json({ state: "down", why: "no agent pane" });
    await api().refreshLarry();
    expect(dot()?.getAttribute("data-state")).toBe("down");
    expect(dot()?.title).toBe("Larry: down (no agent pane)");

    reply = () => Promise.reject(new TypeError("Failed to fetch"));
    await api().refreshLarry();
    expect(dot()?.getAttribute("data-state")).toBe("down");
    expect(dot()?.title).toContain("not on the tailnet");
  });

  it("works on localhost too", async () => {
    const calls = stubFetch(() => json({ state: "idle" }));
    boot("localhost", "4000");
    await api().refreshLarry();
    expect(calls[0].url).toBe("https://localhost/larry/status");
  });

  it("posts one batch per page and clears the buffer on 2xx", async () => {
    const origin = `http://${TAILNET}:8445`;
    const posts: any[] = [];
    stubFetch((url, init) => {
      if (url.endsWith("/blog-review")) posts.push(JSON.parse(String(init?.body)));
      return json({ ok: true, state: "idle" });
    });
    boot(TAILNET);
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([
        note("/foo", "brown fox", "tighten", origin),
        note("/bar", "other page", "", origin),
        note("/foo", "quick", "why?", origin),
      ]),
    );
    await api().sendToLarry();
    expect(posts).toHaveLength(2);
    expect(posts[0]).toMatchObject({
      permalink: "https://blog.example/foo",
      page_url: `${origin}/foo`,
      branch: "tighten-intro",
      title: "Title of /foo",
      annotations: [
        { quote: "brown fox", prefix: "before ", suffix: " after", intent: "fix", note: "tighten" },
        { quote: "quick", intent: "fix", note: "why?" },
      ],
    });
    expect(posts[0].id).toMatch(/^blog-[0-9a-f]{8}$/);
    expect(posts[1].page_url).toBe(`${origin}/bar`);
    expect(posts[1].id).not.toBe(posts[0].id);
    expect(buffer()).toEqual([]);
    expect(document.getElementById("blog-annot-count")?.textContent).toBe("Review (0)");
    expect(document.getElementById("blog-annot-send")?.textContent).toBe("Sent ✓");
  });

  it("keeps what failed and opens the gist/clipboard fallback", async () => {
    const origin = `http://${TAILNET}:8445`;
    stubFetch((url, init) => {
      if (url.endsWith("/blog-review")) {
        const body = JSON.parse(String(init?.body));
        return json({ ok: false }, body.page_url.endsWith("/bar") ? 502 : 200);
      }
      return json({ state: "idle" });
    });
    boot(TAILNET);
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([note("/foo", "a", "x", origin), note("/bar", "b", "y", origin)]),
    );
    await api().sendToLarry();
    expect(buffer().map((a: any) => a.quote)).toEqual(["b"]);
    expect(document.getElementById("blog-annot-gist")).not.toBeNull();
    expect(document.getElementById("blog-annot-note")?.textContent).toContain("Cockpit returned 502");
  });

  it("keeps everything when the Cockpit cannot be reached", async () => {
    stubFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    boot(TAILNET);
    const list = [note("/foo", "a", "x", `http://${TAILNET}:8445`)];
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify(list));
    await api().sendToLarry();
    expect(buffer()).toEqual(list);
    expect(document.getElementById("blog-annot-note")?.textContent).toContain("Your notes are kept");
  });
});
