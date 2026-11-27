// ABOUTME: Connection check (_includes/annotate.html, blog-qxt7): the pill's Check runs address, status,
// ABOUTME: page-chat and browser steps and reports each as pass/fail/info with the error text.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const COCKPIT = "https://c-5004.squeaker-teeth.ts.net"; // DEFAULT_COCKPIT, published
const SAVED = "https://box.example-tail.ts.net";

const loadAnnotate = () => {
  const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
  const start = include.lastIndexOf("<script>");
  new Function(include.slice(start + "<script>".length, include.lastIndexOf("</script>")))();
};

type Step = { name: string; status: "pass" | "fail" | "info"; detail: string };
type Result = { steps: Step[]; cockpit: string; answered: boolean; statusOk: boolean };
type Env = Record<string, unknown>;
const api = () =>
  (window as any).blogAnnotate as {
    connectionCheck: (env: Env) => Promise<Result>;
    connectionReport: (r: Result, at: string) => string;
    check: () => Promise<Result>;
  };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function env(over: Env): Env {
  let t = 1000;
  return {
    stored: null,
    sameHost: false,
    host: "idvork.in",
    fallback: COCKPIT,
    page: "https://idvork.in/foo",
    pageOrigin: "https://idvork.in",
    userAgent: "TestUA/1.0",
    storage: { persisted: async () => true },
    now: () => {
      t += 25;
      return t;
    },
    timeoutMs: 8000,
    fetch: async () => json({ ok: true, state: "idle" }),
    ...over,
  };
}

const step = (r: Result, name: string) => r.steps.find((s) => s.name === name) as Step;

describe("connectionCheck (the step logic)", () => {
  beforeEach(() => {
    localStorage.clear();
    loadAnnotate();
  });
  afterEach(() => {
    (window as any).blogAnnotate = undefined;
    localStorage.clear();
  });

  it("runs the steps in order", async () => {
    const r = await api().connectionCheck(env({ stored: SAVED }));
    expect(r.steps.map((s) => s.name)).toEqual([
      "Cockpit address",
      "Cockpit status",
      "Local network access",
      "Page chat",
      "Page origin",
      "Storage",
      "Browser",
    ]);
  });

  it("a saved address passes and is the one tested", async () => {
    const urls: string[] = [];
    const r = await api().connectionCheck(
      env({
        stored: SAVED,
        fetch: async (url: string) => {
          urls.push(url);
          return url.includes("/page-chat") ? json({ thread: "t1", messages: [{}, {}] }) : json({ state: "busy" });
        },
      }),
    );
    expect(step(r, "Cockpit address")).toEqual({ name: "Cockpit address", status: "pass", detail: `saved: ${SAVED}` });
    expect(urls[0]).toBe(`${SAVED}/larry/status`);
    expect(urls[1]).toBe(`${SAVED}/page-chat?page=${encodeURIComponent("https://idvork.in/foo")}`);
    expect(step(r, "Cockpit status").detail).toBe("HTTP 200 in 25 ms, Larry busy");
    expect(step(r, "Page chat").detail).toBe("HTTP 200 in 25 ms, 2 messages on this page's thread");
    expect(r).toMatchObject({ cockpit: SAVED, answered: true, statusOk: true });
  });

  it("not paired: says so and tests the published address", async () => {
    const urls: string[] = [];
    const r = await api().connectionCheck(
      env({
        fetch: async (url: string) => {
          urls.push(url);
          return url.includes("/page-chat") ? json({ thread: null, messages: [] }) : json({ state: "idle" });
        },
      }),
    );
    expect(step(r, "Cockpit address").status).toBe("fail");
    expect(step(r, "Cockpit address").detail).toBe(`not paired; testing the published address ${COCKPIT}`);
    expect(urls[0]).toBe(`${COCKPIT}/larry/status`);
    expect(step(r, "Page chat").detail).toMatch(/no thread for this page yet$/);
  });

  it("a stored value the validator rejects is shown raw, not read as unpaired", async () => {
    const r = await api().connectionCheck(env({ stored: "http://evil.example" }));
    expect(step(r, "Cockpit address").status).toBe("fail");
    expect(step(r, "Cockpit address").detail).toMatch(/^saved value "http:\/\/evil.example" is not a Cockpit address/);
    expect(r.cockpit).toBe(COCKPIT);
  });

  it("on the tailnet uses this host and names an unused saved address", async () => {
    const r = await api().connectionCheck(env({ sameHost: true, host: "c-5004.squeaker-teeth.ts.net", stored: SAVED }));
    expect(step(r, "Cockpit address").detail).toBe(`this host, ${COCKPIT} (saved address ${SAVED} is not used here)`);
    expect(r.cockpit).toBe(COCKPIT);
  });

  it("a refused fetch is a network error with the browser's text, and page chat is skipped", async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    const r = await api().connectionCheck(env({ stored: SAVED, fetch }));
    const s = step(r, "Cockpit status");
    expect(s.status).toBe("fail");
    expect(s.detail).toMatch(/^network error after 25 ms: Failed to fetch\. /);
    expect(s.detail).toMatch(/Tailscale.*certificate, CORS, or a Local Network Access block/);
    expect(step(r, "Page chat")).toEqual({
      name: "Page chat",
      status: "info",
      detail: "skipped: the Cockpit did not answer",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(r).toMatchObject({ answered: false, statusOk: false });
  });

  it("a hang past the timeout is reported as no answer, not a network error", async () => {
    const hang = (_url: string, init?: RequestInit) =>
      new Promise<Response>((_res, rej) => {
        init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError")));
      });
    const r = await api().connectionCheck(env({ stored: SAVED, fetch: hang, timeoutMs: 20 }));
    expect(step(r, "Cockpit status").detail).toBe("no answer in 0.02 s (the usual sign of being off Tailscale)");
    expect(r.answered).toBe(false);
  });

  it("an HTTP error is reported with its status and still checks page chat", async () => {
    const r = await api().connectionCheck(
      env({
        stored: SAVED,
        fetch: async (url: string) => (url.includes("/page-chat") ? json({}, 404) : json({ error: "boom" }, 500)),
      }),
    );
    expect(step(r, "Cockpit status")).toEqual({ name: "Cockpit status", status: "fail", detail: "HTTP 500 in 25 ms" });
    expect(step(r, "Page chat")).toEqual({
      name: "Page chat",
      status: "fail",
      detail: "HTTP 404: this Cockpit has no page chat",
    });
    expect(r).toMatchObject({ answered: true, statusOk: false });
  });

  it("reports storage persistence: yes, no, and no API", async () => {
    const yes = await api().connectionCheck(env({ stored: SAVED }));
    expect(step(yes, "Storage").detail).toBe("persistent");
    const no = await api().connectionCheck(env({ stored: SAVED, storage: { persisted: async () => false } }));
    expect(step(no, "Storage").detail).toMatch(/^not persistent/);
    const none = await api().connectionCheck(env({ stored: SAVED, storage: null }));
    expect(step(none, "Storage").detail).toBe("unknown");
  });

  it("reports Chrome's Local Network Access permission, and unknown where it isn't known", async () => {
    const perm = (state: string) => ({ query: async ({ name }: { name: string }) => ({ name, state }) });
    const granted = await api().connectionCheck(env({ stored: SAVED, permissions: perm("granted") }));
    expect(step(granted, "Local network access")).toEqual({
      name: "Local network access",
      status: "pass",
      detail: "granted",
    });
    const denied = await api().connectionCheck(env({ stored: SAVED, permissions: perm("denied") }));
    expect(step(denied, "Local network access").status).toBe("fail");
    expect(step(denied, "Local network access").detail).toMatch(/^denied, so this page cannot reach a tailnet address/);
    const prompt = await api().connectionCheck(env({ stored: SAVED, permissions: perm("prompt") }));
    expect(step(prompt, "Local network access").detail).toMatch(/^not decided yet/);
    const queried: string[] = [];
    await api().connectionCheck(
      env({
        stored: SAVED,
        permissions: {
          query: async ({ name }: { name: string }) => {
            queried.push(name);
            return { state: "granted" };
          },
        },
      }),
    );
    expect(queried).toEqual(["local-network-access", "local-network-access"]);
    const rejects = await api().connectionCheck(
      env({
        stored: SAVED,
        permissions: {
          query: () => {
            throw new TypeError("not a valid PermissionName");
          },
        },
      }),
    );
    expect(step(rejects, "Local network access").detail).toBe("not reported by this browser");
    const none = await api().connectionCheck(env({ stored: SAVED, permissions: null }));
    expect(step(none, "Local network access")).toMatchObject({
      status: "info",
      detail: "not reported by this browser",
    });
  });

  it("reports the permission as it stands after the request, which may have raised the prompt", async () => {
    const states = ["prompt", "granted"];
    const r = await api().connectionCheck(
      env({ stored: SAVED, permissions: { query: async () => ({ state: states.shift() || "granted" }) } }),
    );
    expect(step(r, "Local network access")).toEqual({
      name: "Local network access",
      status: "pass",
      detail: "granted (was prompt before this check's request)",
    });
  });

  it("a timeout while the prompt was pending names the prompt as a cause", async () => {
    const hang = (_url: string, init?: RequestInit) =>
      new Promise<Response>((_res, rej) => {
        init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError")));
      });
    const r = await api().connectionCheck(
      env({ stored: SAVED, fetch: hang, timeoutMs: 20, permissions: { query: async () => ({ state: "prompt" }) } }),
    );
    expect(step(r, "Cockpit status").detail).toBe(
      "no answer in 0.02 s (the usual sign of being off Tailscale), " +
        "or the browser's Local network access prompt was left unanswered",
    );
  });

  it("names the page origin and user agent", async () => {
    const r = await api().connectionCheck(env({ stored: SAVED }));
    expect(step(r, "Page origin")).toEqual({ name: "Page origin", status: "info", detail: "https://idvork.in" });
    expect(step(r, "Browser").detail).toBe("TestUA/1.0");
  });

  it("calls onStep as each line lands", async () => {
    const seen: string[] = [];
    await api().connectionCheck(env({ stored: SAVED, onStep: (s: Step) => seen.push(s.name) }));
    expect(seen).toHaveLength(7);
    expect(seen[0]).toBe("Cockpit address");
  });

  it("the report is a timestamp line then one marked line per step", async () => {
    const r = await api().connectionCheck(env({ stored: SAVED, storage: null }));
    const text = api().connectionReport(r, "2026-11-27T18:00:00.000Z");
    expect(text.split("\n")).toEqual([
      "Connection check, 2026-11-27T18:00:00.000Z",
      `✓ Cockpit address: saved: ${SAVED}`,
      "✓ Cockpit status: HTTP 200 in 25 ms, Larry idle",
      "· Local network access: not reported by this browser",
      "✓ Page chat: HTTP 200 in 25 ms, no thread for this page yet",
      "· Page origin: https://idvork.in",
      "· Storage: unknown",
      "· Browser: TestUA/1.0",
    ]);
  });
});

describe("the Check card", () => {
  const flush = async () => {
    for (let i = 0; i < 30; i++) await Promise.resolve();
  };
  const $ = (id: string) => document.getElementById(id) as HTMLButtonElement;

  function boot(saved: string | null) {
    window.location.hostname = "blog.example";
    window.location.pathname = "/foo";
    document.body.innerHTML =
      '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" data-source-path="_d/foo.md" hidden></div>' +
      '<div id="content-holder"><p>The quick brown fox.</p></div>';
    localStorage.setItem("blogAnnotate", "1");
    if (saved) localStorage.setItem("blogLarryCockpit", saved);
    loadAnnotate();
  }

  function stub(handler: (url: string, init?: RequestInit) => Response) {
    const calls: { url: string; init?: RequestInit }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push({ url, init });
        return handler(url, init);
      }),
    );
    return calls;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    (window as any).blogAnnotate = undefined;
    document.documentElement.classList.remove("blog-annot-off");
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.location.hostname = "localhost";
    window.location.pathname = "/";
  });

  it("is in the pill even with no saved Cockpit", () => {
    stub(() => json({}));
    boot(null);
    expect($("blog-annot-check")).not.toBeNull();
  });

  it("lists every step and sends the report to the saved Cockpit's page chat", async () => {
    const calls = stub((url) =>
      url.includes("/page-chat") ? json({ thread: null, messages: [] }) : json({ state: "idle" }),
    );
    boot(SAVED);
    await flush();
    $("blog-annot-check").click();
    await flush();
    const lines = Array.from(document.querySelectorAll("#blog-annot-check-list li"));
    expect(lines).toHaveLength(7);
    expect(lines[0].getAttribute("data-status")).toBe("pass");
    expect($("blog-annot-check-send").disabled).toBe(false);
    $("blog-annot-check-send").click();
    await flush();
    const post = calls.find((c) => c.init?.method === "POST");
    expect(post?.url).toBe(`${SAVED}/page-chat`);
    const body = JSON.parse(String(post?.init?.body));
    expect(body.text).toMatch(/^Connection check, /);
    expect(body.text).toContain(`✓ Cockpit address: saved: ${SAVED}`);
    expect(body.page_url).toMatch(/\/foo$/);
    expect(document.getElementById("blog-annot-note")?.textContent).toBe("Sent to this page's thread.");
  });

  it("a bogus saved origin fails, and Send stays off while Copy works", async () => {
    stub(() => {
      throw new TypeError("Failed to fetch");
    });
    boot("https://nobody.bogus-tail.ts.net");
    await flush();
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    $("blog-annot-check").click();
    await flush();
    const status = document.querySelectorAll("#blog-annot-check-list li")[1];
    expect(status.getAttribute("data-status")).toBe("fail");
    expect(status.textContent).toMatch(/network error/);
    expect($("blog-annot-check-send").disabled).toBe(true);
    $("blog-annot-check-copy").click();
    await flush();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(String((writeText.mock.calls[0] as unknown[])[0])).toContain("✗ Cockpit status: network error");
  });

  it("an unpaired browser never sends the report to the published address", async () => {
    const calls = stub(() => json({ state: "idle" }));
    boot(null);
    $("blog-annot-check").click();
    await flush();
    expect($("blog-annot-check-send").disabled).toBe(true);
    expect(calls.some((c) => c.init?.method === "POST")).toBe(false);
  });
});
