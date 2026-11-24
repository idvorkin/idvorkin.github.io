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

  it("an unreachable Cockpit keeps the text, and the resend reuses the message's id", async () => {
    let down = true;
    const calls = stubFetch((url, init) => {
      if (init?.method === "POST" && down) return Promise.reject(new TypeError("Failed to fetch"));
      return json({ ok: true, messages: [] });
    });
    boot(TAILNET);
    await api().chat.open();
    const ta = document.getElementById("blog-annot-chat-text") as HTMLTextAreaElement;
    ta.value = "hello";
    await api().chat.send();
    expect(ta.value).toBe("hello");
    expect(document.getElementById("blog-annot-chat-status")?.textContent).toContain(
      "can't reach the Cockpit, or it has no page chat yet",
    );
    down = false;
    await api().chat.send();
    const ids = chatCalls(calls)
      .filter((c) => c.init?.method === "POST")
      .map((c) => JSON.parse(String(c.init?.body)).id);
    expect(ids).toHaveLength(2);
    expect(ids[1]).toBe(ids[0]);
    expect(bubbles()).toEqual([["igor", "hello"]]);
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

describe("Chat panel: receipt marks (Cockpit story 195)", () => {
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

  const marks = () =>
    Array.from(document.querySelectorAll("#blog-annot-chat .bac-msg")).map((el) => [
      el.getAttribute("data-who"),
      el.getAttribute("data-mark"),
    ]);

  it("moves the mark on a drawn message 👀 → 🫡 → 🏆 from the poll's receipts, never on Larry's", async () => {
    const thread: { id: string; who: string; text: string }[] = [];
    const receipts: Record<string, string> = {};
    let withReceipts = true;
    stubFetch((url, init) => {
      if (!url.includes("/page-chat")) return json({ state: "idle" });
      if (init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        thread.push({ id: body.id, who: "igor", text: body.text });
        receipts[body.id] = "received";
        return json({ ok: true, messages: [{ ...thread[thread.length - 1], receipt: "received" }] });
      }
      const after = new URL(url).searchParams.get("after");
      const i = after ? thread.findIndex((m) => m.id === after) + 1 : 0;
      return json(
        withReceipts ? { ok: true, messages: thread.slice(i), receipts } : { ok: true, messages: thread.slice(i) },
      );
    });
    boot(TAILNET);
    thread.push({ id: "m0", who: "larry", text: "Page: Foo" });
    await api().chat.open();
    const ta = document.getElementById("blog-annot-chat-text") as HTMLTextAreaElement;
    ta.value = "Is this right?";
    await api().chat.send();
    const mine = thread[1].id;
    expect(marks()).toEqual([
      ["larry", null],
      ["igor", "👀"],
    ]);
    thread.push({ id: "m2", who: "larry", text: "Looking." });
    await vi.advanceTimersByTimeAsync(4000);
    receipts[mine] = "seen";
    await vi.advanceTimersByTimeAsync(4000);
    expect(marks()).toEqual([
      ["larry", null],
      ["igor", "🫡"],
      ["larry", null],
    ]);
    // a stale "received" never moves it back
    receipts[mine] = "received";
    await vi.advanceTimersByTimeAsync(4000);
    expect(marks()[1]).toEqual(["igor", "🫡"]);
    receipts[mine] = "done";
    await vi.advanceTimersByTimeAsync(4000);
    expect(marks()[1]).toEqual(["igor", "🏆"]);
    expect(document.querySelectorAll("#blog-annot-chat .bac-msg")[1].getAttribute("title")).toBe("Done");
    expect(document.querySelectorAll("#blog-annot-chat .bac-msg")[1].textContent).toBe("Is this right?");
    // an older Cockpit sends no receipts: the mark stays, nothing errors
    withReceipts = false;
    await vi.advanceTimersByTimeAsync(4000);
    expect(marks()[1]).toEqual(["igor", "🏆"]);
    expect(document.getElementById("blog-annot-chat-status")?.textContent).toBe("");
  });

  it("draws no mark when the Cockpit sends no receipt state", async () => {
    const thread: { id: string; who: string; text: string }[] = [{ id: "m1", who: "igor", text: "hi" }];
    stubFetch((url) => (url.includes("/page-chat") ? json({ ok: true, messages: thread }) : json({ state: "idle" })));
    boot(TAILNET);
    await api().chat.open();
    expect(marks()).toEqual([["igor", null]]);
    expect(document.querySelector("#blog-annot-chat [data-mark]")).toBeNull();
  });
});

describe("Chat panel: links, a new thread's opener, and a reader without Larry", () => {
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

  it("puts the Cockpit's opener above the first message on a new thread, with its URL as a link", async () => {
    const thread: { id: string; who: string; text: string }[] = [];
    stubFetch((url, init) => {
      if (init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        if (!thread.length) thread.push({ id: "m0", who: "larry", text: `Page: Foo\nURL: ${body.page_url}` });
        thread.push({ id: body.id, who: "igor", text: body.text });
        return json({ ok: true });
      }
      if (url.includes("/page-chat")) {
        const after = new URL(url).searchParams.get("after");
        const i = after ? thread.findIndex((m) => m.id === after) + 1 : 0;
        return json({ ok: true, messages: thread.slice(i) });
      }
      return json({ ok: true, state: "idle" });
    });
    boot(TAILNET);
    await api().chat.open();
    const ta = document.getElementById("blog-annot-chat-text") as HTMLTextAreaElement;
    ta.value = "see https://example.com/x. <b>bold</b>";
    await api().chat.send();
    expect(bubbles().map((b) => b[0])).toEqual(["larry", "igor"]);
    const links = Array.from(document.querySelectorAll("#blog-annot-chat .bac-msg a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(links).toHaveLength(2); // the opener's page URL, then the one in the message
    expect(links[0]).toMatch(/^https?:\/\//);
    expect(links[1]).toBe("https://example.com/x"); // trailing "." left out
    expect(document.querySelector("#blog-annot-chat .bac-msg b")).toBeNull();
  });

  it("gives a reader without Larry no prompt and no request, only Copy", async () => {
    const calls = stubFetch(() => json({ ok: true }));
    const prompted = vi.fn(() => null);
    vi.stubGlobal("prompt", prompted);
    window.location.hostname = "idvork.in";
    window.location.port = "";
    window.location.pathname = "/foo";
    document.body.innerHTML =
      '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://idvork.in" data-source-path="_d/foo.md" hidden></div><p>x</p>';
    loadAnnotate();
    (document.getElementById("blog-annot-toggle") as HTMLButtonElement).click();
    await api().chat.open();
    expect(prompted).not.toHaveBeenCalled();
    expect((document.getElementById("blog-annot-chat-send") as HTMLButtonElement).disabled).toBe(true);
    expect(document.getElementById("blog-annot-chat-copy")).not.toBeNull();
    expect(document.getElementById("blog-annot-chat-status")?.textContent).toContain("Copy and send it to Igor");
    expect(calls).toHaveLength(0);
  });
});
