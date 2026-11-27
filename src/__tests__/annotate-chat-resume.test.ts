// ABOUTME: The chat panel's poll never gives up (_includes/annotate.html, blog-qxt7): it backs off on failure,
// ABOUTME: resumes on visible/pageshow/online/"Try again", recovers on success, and its error line carries the facts.

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

const api = () => (window as any).blogAnnotate;
const statusText = () => document.getElementById("blog-annot-chat-status")?.textContent || "";
const at = (h: number, m: number, s: number) => new Date(2026, 10, 27, h, m, s).getTime();

describe("chat poll backoff and error line (pure)", () => {
  beforeEach(() => loadAnnotate());
  afterEach(() => {
    (window as any).blogAnnotate = undefined;
  });

  it("doubles from the base interval to the cap", () => {
    const d = (n: number) => api().chatPollDelay(n, 4000, 60000);
    expect([0, 1, 2, 3, 4, 5, 50].map(d)).toEqual([4000, 8000, 16000, 32000, 60000, 60000, 60000]);
  });

  it("formats a network failure with times, retry, host and hidden tab", () => {
    expect(
      api().chatFailLine({
        kind: "network",
        status: 0,
        error: "Load failed",
        lastOkAt: at(11, 0, 25),
        lastTryAt: at(11, 0, 29),
        fails: 2,
        nextMs: 16000,
        cockpit: "https://c-5004.example.ts.net",
        hidden: true,
      }),
    ).toBe(
      "Can't reach Larry: network refused (Load failed) · last ok 11:00:25, tried 11:00:29 · " +
        "retry 2 in 16 s · c-5004.example.ts.net · tab was hidden",
    );
  });

  it("formats an HTTP status, a timeout, and a Cockpit never reached", () => {
    const base = { lastOkAt: 0, lastTryAt: at(9, 5, 7), fails: 0, nextMs: 0, cockpit: COCKPIT, hidden: false };
    expect(api().chatFailLine({ ...base, kind: "http", status: 404, error: "" })).toBe(
      `Can't reach Larry: HTTP 404 (no page chat) · last ok never, tried 09:05:07 · ${TAILNET}`,
    );
    expect(api().chatFailLine({ ...base, kind: "http", status: 502, error: "x" })).toMatch(
      /^Can't reach Larry: HTTP 502 · /,
    );
    expect(api().chatFailLine({ ...base, kind: "timeout", error: "signal timed out", fails: 1, nextMs: 8000 })).toBe(
      `Can't reach Larry: timeout (signal timed out) · last ok never, tried 09:05:07 · retry 1 in 8 s · ${TAILNET}`,
    );
  });

  it("formats poll log lines and adds them to the Check report", () => {
    const polls = [
      { at: at(11, 0, 25), ok: true, status: 200, ms: 84, hidden: false },
      { at: at(11, 0, 29), ok: false, kind: "network", status: 0, error: "Load failed", ms: 3, hidden: true },
    ];
    expect(polls.map((p) => api().chatPollLogLine(p))).toEqual([
      "11:00:25 ok 200 84 ms",
      "11:00:29 ✗ network refused (Load failed) 3 ms (tab hidden)",
    ]);
    const report = api().connectionReport(
      { steps: [{ name: "Cockpit status", status: "pass", detail: "HTTP 200" }] },
      "T",
      polls,
    );
    expect(report.split("\n")).toEqual([
      "Connection check, T",
      "✓ Cockpit status: HTTP 200",
      "Recent page-chat polls (oldest first):",
      "11:00:25 ok 200 84 ms",
      "11:00:29 ✗ network refused (Load failed) 3 ms (tab hidden)",
    ]);
    expect(api().connectionReport({ steps: [] }, "T", []).split("\n")).toEqual(["Connection check, T"]);
  });
});

describe("chat poll loop", () => {
  let up = true;
  let hang = false;
  let hidden = false;
  let chatGets = 0;

  function boot() {
    window.location.hostname = TAILNET;
    window.location.pathname = "/foo";
    document.body.innerHTML =
      '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" data-source-path="_d/foo.md" hidden></div>' +
      '<div id="content-holder"><p>The quick brown fox.</p></div>';
    localStorage.setItem("blogAnnotate", "1");
    loadAnnotate();
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"] });
    vi.setSystemTime(at(11, 0, 0));
    localStorage.clear();
    up = true;
    hang = false;
    hidden = false;
    chatGets = 0;
    Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/page-chat")) {
          chatGets++;
          if (hang) return new Promise<Response>(() => {});
          if (!up) throw new TypeError("Load failed");
          return json({ ok: true, thread: null, messages: [] });
        }
        if (!up) throw new TypeError("Load failed");
        return json({ ok: true, state: "idle" });
      }),
    );
  });

  afterEach(() => {
    // Each boot leaves its window/document listeners behind; turning it off makes them inert.
    api()?.set(false);
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
    (window as any).blogAnnotate = undefined;
    Reflect.deleteProperty(document, "hidden");
    document.documentElement.classList.remove("blog-annot-off");
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.location.hostname = "localhost";
    window.location.pathname = "/";
  });

  it("keeps polling through failures with backoff, then recovers without a reload", async () => {
    up = false; // before boot, so the boot's status read sees it down too
    boot();
    await api().chat.open();
    expect(chatGets).toBe(1);
    expect(statusText()).toMatch(/^Can't reach Larry: network refused \(Load failed\) · last ok never, tried 11:00:00/);
    expect(statusText()).toMatch(/retry 1 in 8 s/);
    expect(document.getElementById("blog-annot-larry-dot")?.getAttribute("data-state")).toBe("down");
    // 8 s, 16 s, 32 s, 60 s, 60 s: never stops.
    for (const wait of [8000, 16000, 32000, 60000, 60000]) {
      const before = chatGets;
      await vi.advanceTimersByTimeAsync(wait - 1);
      expect(chatGets).toBe(before);
      await vi.advanceTimersByTimeAsync(1);
      expect(chatGets).toBe(before + 1);
    }
    expect(statusText()).toMatch(/retry 6 in 60 s/);
    up = true;
    await vi.advanceTimersByTimeAsync(60000);
    expect(statusText()).toBe("");
    expect(document.getElementById("blog-annot-larry-dot")?.getAttribute("data-state")).toBe("idle");
    // back to the 4 s cadence
    const before = chatGets;
    await vi.advanceTimersByTimeAsync(4000);
    expect(chatGets).toBe(before + 1);
  });

  it("polls at once when the tab becomes visible, on a bfcache pageshow, and when back online", async () => {
    boot();
    up = false;
    await api().chat.open();
    await vi.advanceTimersByTimeAsync(8000); // 2 failures: next try is 16 s away
    up = true;
    let before = chatGets;
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(0);
    expect(chatGets).toBe(before + 1);
    expect(statusText()).toBe("");

    before = chatGets;
    const show = new Event("pageshow") as Event & { persisted?: boolean };
    Object.defineProperty(show, "persisted", { value: true });
    window.dispatchEvent(show);
    await vi.advanceTimersByTimeAsync(0);
    expect(chatGets).toBe(before + 1);

    before = chatGets;
    window.dispatchEvent(new Event("online"));
    await vi.advanceTimersByTimeAsync(0);
    expect(chatGets).toBe(before + 1);
  });

  it("does not poll while hidden, and resumes when shown", async () => {
    boot();
    await api().chat.open();
    hidden = true;
    const before = chatGets;
    await vi.advanceTimersByTimeAsync(20000);
    expect(chatGets).toBe(before);
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(0);
    expect(chatGets).toBe(before + 1);
  });

  it("Try again polls now, and Details opens the Check card", async () => {
    boot();
    up = false;
    await api().chat.open();
    const before = chatGets;
    up = true;
    (document.getElementById("blog-annot-chat-retry") as HTMLElement).click();
    await vi.advanceTimersByTimeAsync(0);
    expect(chatGets).toBe(before + 1);
    expect(statusText()).toBe("");
    up = false;
    await vi.advanceTimersByTimeAsync(4000);
    (document.getElementById("blog-annot-chat-details") as HTMLElement).click();
    await vi.advanceTimersByTimeAsync(0);
    expect(document.getElementById("blog-annot-check-list")).not.toBeNull();
  });

  it("a request that never settles is capped, logged, and the loop carries on", async () => {
    boot();
    hang = true;
    void api().chat.open();
    await vi.advanceTimersByTimeAsync(12000);
    expect(statusText()).toMatch(/^Can't reach Larry: timeout \(no answer in 12 s, request hung\)/);
    hang = false;
    const before = chatGets;
    await vi.advanceTimersByTimeAsync(8000);
    expect(chatGets).toBe(before + 1);
    expect(statusText()).toBe("");
  });

  it("the Check report carries the recent polls, at most 20", async () => {
    boot();
    up = false;
    await api().chat.open();
    for (let i = 0; i < 25; i++) {
      (document.getElementById("blog-annot-chat-retry") as HTMLElement).click();
      await vi.advanceTimersByTimeAsync(0);
    }
    up = true;
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await api().check();
    (document.getElementById("blog-annot-check-copy") as HTMLElement).click();
    await vi.advanceTimersByTimeAsync(0);
    const text = String((writeText.mock.calls[0] as unknown[])[0]);
    const polls = text.split("Recent page-chat polls (oldest first):\n")[1].split("\n");
    expect(polls).toHaveLength(20);
    expect(polls[0]).toMatch(/^11:00:00 ✗ network refused \(Load failed\) \d+ ms$/);
    expect(document.getElementById("blog-annot-check-polls")?.textContent).toContain("✗ network refused");
  });
});
