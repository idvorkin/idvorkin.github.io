// ABOUTME: The annotate tool's chat panel (_includes/annotate.html, Cockpit story 171): a message posts to
// ABOUTME: /page-chat on the page's thread, replies come in by polling while open, and nothing runs while closed.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TAILNET = "box.example-tail.ts.net";
const COCKPIT = `https://${TAILNET}`;

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

const api = () => (window as any).blogAnnotate;
const panel = () => document.getElementById("blog-annot-chat") as HTMLElement;
const bubbles = () =>
  Array.from(document.querySelectorAll("#blog-annot-chat .bac-msg")).map((el) => [
    el.getAttribute("data-who"),
    el.textContent,
  ]);
const chatCalls = (calls: Call[]) => calls.filter((c) => c.url.includes("/page-chat"));

function boot(hostname: string, port = "8445") {
  window.location.hostname = hostname;
  window.location.port = port;
  window.location.pathname = "/foo";
  document.body.innerHTML =
    '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" data-source-path="_d/foo.md" hidden></div>' +
    '<div id="content-holder"><p>The quick brown fox.</p></div>';
  localStorage.setItem("blogAnnotate", "1");
  loadAnnotate();
}

describe("Chat panel", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
    (window as any).blogAnnotate = undefined;
    document.documentElement.classList.remove("blog-annot-off");
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.location.hostname = "localhost";
    window.location.pathname = "/";
  });

  it("is closed and silent until opened", () => {
    const calls = stubFetch(() => json({ ok: true, state: "idle" }));
    boot(TAILNET);
    expect(document.getElementById("blog-annot-chat-toggle")?.textContent).toBe("Chat");
    expect(panel().hidden).toBe(true);
    vi.advanceTimersByTime(60000);
    expect(chatCalls(calls)).toHaveLength(0);
  });

  it("opens with the page's thread, read by permalink", async () => {
    const calls = stubFetch((url) =>
      url.includes("/page-chat")
        ? json({ ok: true, thread: "t-1", messages: [{ id: "m1", who: "larry", text: "<b>hi</b>" }] })
        : json({ state: "idle" }),
    );
    boot(TAILNET);
    await api().chat.open();
    expect(panel().hidden).toBe(false);
    expect(chatCalls(calls)[0].url).toBe(`${COCKPIT}/page-chat?page=${encodeURIComponent("https://blog.example/foo")}`);
    // text, never markup
    expect(bubbles()).toEqual([["larry", "<b>hi</b>"]]);
    expect(document.querySelector("#blog-annot-chat b.bac-msg, #blog-annot-chat .bac-msg b")).toBeNull();
  });

  it("sends a message naming the page and its file, then shows the reply from the next poll", async () => {
    let thread: { id: string; who: string; text: string }[] = [];
    const calls = stubFetch((url, init) => {
      if (!url.includes("/page-chat")) return json({ state: "idle" });
      if (init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        thread.push({ id: body.id, who: "igor", text: body.text });
        return json({ ok: true, thread: "t-1", messages: [thread[thread.length - 1]] });
      }
      const after = new URL(url).searchParams.get("after");
      const i = after ? thread.findIndex((m) => m.id === after) + 1 : 0;
      return json({ ok: true, thread: "t-1", messages: thread.slice(i) });
    });
    boot(TAILNET);
    await api().chat.open();
    const ta = document.getElementById("blog-annot-chat-text") as HTMLTextAreaElement;
    ta.value = "  Is the second paragraph too long?  ";
    await api().chat.send();
    const post = chatCalls(calls).find((c) => c.init?.method === "POST");
    expect(post?.url).toBe(`${COCKPIT}/page-chat`);
    const body = JSON.parse(String(post?.init?.body));
    expect(body).toMatchObject({
      text: "Is the second paragraph too long?",
      page_url: expect.stringMatching(/^https?:\/\/[^/]+\/foo$/), // ORIGIN + permalink
      permalink: "https://blog.example/foo",
      title: "Foo",
      source_repo: "idvorkin/idvorkin.github.io",
      source_path: "_d/foo.md",
    });
    expect(body.id).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
    expect(ta.value).toBe("");
    expect(bubbles()).toEqual([["igor", "Is the second paragraph too long?"]]);

    thread.push({ id: "m2", who: "larry", text: "Yes, cut it." });
    await vi.advanceTimersByTimeAsync(4000);
    expect(bubbles()).toEqual([
      ["igor", "Is the second paragraph too long?"],
      ["larry", "Yes, cut it."],
    ]);
    thread = [];
  });

  it("keeps the text and says so when the send fails, including an old Cockpit", async () => {
    stubFetch((url, init) => (init?.method === "POST" ? json({ ok: false }, 404) : json({ ok: true, messages: [] })));
    boot(TAILNET);
    await api().chat.open();
    const ta = document.getElementById("blog-annot-chat-text") as HTMLTextAreaElement;
    ta.value = "hello";
    await api().chat.send();
    expect(ta.value).toBe("hello");
    expect(bubbles()).toEqual([]);
    expect(document.getElementById("blog-annot-chat-status")?.textContent).toContain("no page chat yet");
  });

  it("stops polling when closed or when comment mode is turned off", async () => {
    const calls = stubFetch(() => json({ ok: true, messages: [] }));
    boot(TAILNET);
    await api().chat.open();
    await vi.advanceTimersByTimeAsync(4000);
    const n = chatCalls(calls).length;
    expect(n).toBe(2);
    api().chat.close();
    await vi.advanceTimersByTimeAsync(20000);
    expect(chatCalls(calls)).toHaveLength(n);

    await api().chat.open();
    api().set(false);
    expect(panel().hidden).toBe(true);
    await vi.advanceTimersByTimeAsync(20000);
    expect(chatCalls(calls)).toHaveLength(n + 1);
  });

  it("off the tailnet with no saved address, a cancelled prompt leaves the chat off", async () => {
    const calls = stubFetch(() => json({ ok: true, messages: [] }));
    vi.stubGlobal(
      "prompt",
      vi.fn(() => null),
    );
    boot("idvork.in", "");
    await api().chat.open();
    expect(document.getElementById("blog-annot-chat-status")?.textContent).toContain("No Cockpit address");
    await vi.advanceTimersByTimeAsync(20000);
    expect(calls).toHaveLength(0);
  });
});
