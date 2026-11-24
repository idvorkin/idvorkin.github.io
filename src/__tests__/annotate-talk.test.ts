// ABOUTME: Talk while pointing (_includes/annotate.html, Cockpit story 317): the mic and the pointer trace on one
// ABOUTME: clock, posted once to /point-review; nothing listens until Talk, and Comments off stops the mic unsent.

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

// A recorder the test drives: start() fires onstart with an event on the
// page's own event clock; stop() hands over one chunk and fires onstop.
class FakeRecorder {
  static made: FakeRecorder[] = [];
  static isTypeSupported = (t: string) => t.startsWith("audio/webm");
  state = "inactive";
  mimeType: string;
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstart: ((e: Event) => void) | null = null;
  onstop: (() => void) | null = null;
  constructor(
    public stream: FakeStream,
    opts?: { mimeType?: string },
  ) {
    this.mimeType = opts?.mimeType || "";
    FakeRecorder.made.push(this);
  }
  start() {
    this.state = "recording";
    this.onstart?.(new Event("start"));
  }
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["webm-bytes"], { type: this.mimeType }) });
    this.onstop?.();
  }
}

class FakeStream {
  stopped = 0;
  getTracks() {
    return [{ stop: () => this.stopped++ }];
  }
}

const api = () => (window as any).blogAnnotate;
const byId = (id: string) => document.getElementById(id) as HTMLElement;
const talkBtn = () => document.getElementById("blog-annot-talk") as HTMLButtonElement;
const posts = (calls: Call[]) => calls.filter((c) => c.url.endsWith("/point-review"));

function boot(hostname = TAILNET) {
  window.location.hostname = hostname;
  window.location.port = "";
  window.location.pathname = "/foo";
  document.body.innerHTML =
    '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" data-source-path="_d/foo.md" hidden></div>' +
    '<div id="content-holder"><h2 id="setup">Setup</h2><p id="fox">The quick brown fox.</p>' +
    '<img id="chart" alt="accuracy chart" src="/a.png"><p>Off <span id="deep">deep inside</span> here.</p></div>';
  localStorage.setItem("blogAnnotate", "1");
  loadAnnotate();
}

function point(id: string, type = "pointermove", pointerType = "mouse", extra: Record<string, unknown> = {}) {
  const el = byId(id);
  const e = new MouseEvent(type, { bubbles: true, clientX: 10, clientY: 20, ...extra });
  Object.defineProperty(e, "pointerType", { value: pointerType });
  el.dispatchEvent(e);
}

// FileReader and fetch settle on later macrotasks: wait until the button
// leaves "sending" (or a few turns pass, for paths that send nothing).
async function flush() {
  for (let i = 0; i < 50; i++) {
    await new Promise((r) => setTimeout(r, 2));
    const state = document.getElementById("blog-annot-talk")?.getAttribute("data-state");
    if (i > 3 && state !== "sending") return;
  }
}

describe("Talk while pointing", () => {
  let stream: FakeStream;
  let getUserMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    FakeRecorder.made = [];
    stream = new FakeStream();
    getUserMedia = vi.fn(async () => stream);
    vi.stubGlobal("MediaRecorder", FakeRecorder);
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });
  });

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

  it("is a button, with no mic and no request until pressed", async () => {
    const calls = stubFetch(() => json({ state: "idle" }));
    boot();
    expect(talkBtn().hidden).toBe(false);
    expect(talkBtn().textContent).toBe("🎙 Talk");
    point("fox");
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(posts(calls)).toHaveLength(0);
  });

  it("is hidden with no Cockpit", () => {
    stubFetch(() => json({ state: "idle" }));
    boot("blog.example"); // off the tailnet, nothing saved
    expect(talkBtn().hidden).toBe(true);
  });

  it("is hidden where the browser cannot record", () => {
    stubFetch(() => json({ state: "idle" }));
    vi.stubGlobal("MediaRecorder", undefined);
    boot();
    expect(talkBtn().hidden).toBe(true);
  });

  it("records what is pointed at on the recorder's clock and posts it once with the audio", async () => {
    const calls = stubFetch((url) =>
      url.endsWith("/point-review") ? json({ ok: true, thread: "t-1", segments: 2 }) : json({ state: "idle" }),
    );
    boot();
    await api().talk.start();
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(talkBtn().getAttribute("data-state")).toBe("rec");
    point("fox", "pointermove", "pen");
    expect(byId("fox").classList.contains("blog-annot-pointing")).toBe(true);
    point("fox", "pointermove", "pen"); // same block, same word, at once: dropped
    point("chart", "pointerdown", "pen", { buttons: 1 });
    point("deep", "pointermove", "touch");
    talkBtn().click(); // Stop
    await flush();
    expect(stream.stopped).toBe(1);
    expect(document.querySelector(".blog-annot-pointing")).toBeNull();

    const sent = posts(calls);
    expect(sent).toHaveLength(1);
    expect(sent[0].url).toBe(`${COCKPIT}/point-review`);
    const body = JSON.parse(String(sent[0].init?.body));
    expect(body).toMatchObject({
      page_url: expect.stringMatching(/\/foo$/),
      permalink: "https://blog.example/foo",
      title: "Foo",
      source_repo: "idvorkin/idvorkin.github.io",
      source_path: "_d/foo.md",
      mime: "audio/webm;codecs=opus",
    });
    expect(body.id).toMatch(/^pt-[A-Za-z0-9_-]{8,60}$/);
    expect(atob(body.audio)).toBe("webm-bytes");
    expect(body.targets).toEqual([
      { tag: "p", heading: "Setup", quote: "The quick brown fox.", id: "fox" },
      { tag: "img", heading: "Setup", quote: "accuracy chart", id: "chart" },
      { tag: "p", heading: "Setup", quote: "Off deep inside here." },
    ]);
    // pen hover (no buttons) is "hover"; a pen down on the image is "down"
    expect(body.trace.map((s: any) => [s.k, s.p, s.i])).toEqual([
      ["hover", "pen", 0],
      ["down", "pen", 1],
      ["move", "touch", 2],
    ]);
    const ts = body.trace.map((s: any) => s.t);
    expect(ts.every((t: number) => t >= 0 && t < 5000)).toBe(true);
    expect([...ts].sort((a, b) => a - b)).toEqual(ts);
    expect(talkBtn().textContent).toBe("✓ Sent");
  });

  it("records the word under the point, from the caret at that point", async () => {
    const calls = stubFetch((url) => (url.endsWith("/point-review") ? json({ ok: true }) : json({ state: "idle" })));
    boot();
    const text = byId("fox").firstChild as Text; // "The quick brown fox."
    (document as any).caretRangeFromPoint = () => ({ startContainer: text, startOffset: 12 });
    try {
      await api().talk.start();
      point("fox");
      talkBtn().click();
      await flush();
    } finally {
      (document as any).caretRangeFromPoint = undefined;
    }
    const body = JSON.parse(String(posts(calls)[0].init?.body));
    expect(body.trace[0]).toMatchObject({ i: 0, w: "brown", x: 10, y: 20 });
  });

  it("listens to nothing once stopped", async () => {
    stubFetch(() => json({ ok: true }));
    boot();
    await api().talk.start();
    talkBtn().click();
    await flush();
    const before = FakeRecorder.made.length;
    point("fox");
    expect(FakeRecorder.made.length).toBe(before);
    expect(document.querySelector(".blog-annot-pointing")).toBeNull();
    expect(api().talk.state()).toBeNull();
  });

  it("turning Comments off mid-recording stops the mic and sends nothing", async () => {
    const calls = stubFetch(() => json({ ok: true }));
    boot();
    await api().talk.start();
    point("fox");
    api().set(false);
    await flush();
    expect(stream.stopped).toBe(1);
    expect(posts(calls)).toHaveLength(0);
    expect(document.querySelector(".blog-annot-pointing")).toBeNull();
  });

  it("keeps a failed recording for Retry, with the same id", async () => {
    let up = false;
    const calls = stubFetch((url) => {
      if (!url.endsWith("/point-review")) return json({ state: "idle" });
      return up ? json({ ok: true }) : json({ ok: false, error: "deepgram: down; groq: down" }, 502);
    });
    boot();
    await api().talk.start();
    point("fox");
    talkBtn().click();
    await flush();
    expect(talkBtn().getAttribute("data-state")).toBe("retry");
    expect(talkBtn().title).toContain("groq: down");
    up = true;
    talkBtn().click(); // Retry, not a new recording
    await flush();
    expect(getUserMedia).toHaveBeenCalledTimes(1);
    const sent = posts(calls).map((c) => JSON.parse(String(c.init?.body)).id);
    expect(sent).toHaveLength(2);
    expect(sent[0]).toBe(sent[1]);
    expect(talkBtn().getAttribute("data-state")).toBe("idle");
  });

  it("a mic refusal says so and records nothing", async () => {
    getUserMedia.mockRejectedValueOnce(new Error("Permission denied"));
    const calls = stubFetch(() => json({ state: "idle" }));
    boot();
    await api().talk.start();
    expect(talkBtn().textContent).toBe("🎙 No mic");
    expect(talkBtn().title).toContain("Permission denied");
    expect(api().talk.state()).toBeNull();
    expect(posts(calls)).toHaveLength(0);
  });
});

describe("pointTrace", () => {
  afterEach(() => {
    (window as any).blogAnnotate = undefined;
    document.body.innerHTML = "";
  });

  it("dedupes targets, ignores the tool's own UI, and keeps a word change", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ state: "idle" })),
    );
    boot();
    const tr = api().pointTrace();
    const fox = document.getElementById("fox");
    tr.add("move", "mouse", 1, 2, 0, fox, "quick");
    tr.add("move", "mouse", 1, 2, 10, fox, "quick"); // dropped
    tr.add("move", "mouse", 5, 2, 20, fox, "fox"); // new word: kept
    tr.add("move", "mouse", 5, 2, 400, fox, "fox"); // after TALK_MOVE_MS: kept
    tr.add("move", "mouse", 9, 9, 500, document.getElementById("blog-annot-pill"), "");
    expect(tr.targets).toHaveLength(1);
    expect(tr.samples.map((s: any) => [s.t, s.i, s.w])).toEqual([
      [0, 0, "quick"],
      [20, 0, "fox"],
      [400, 0, "fox"],
      [500, null, ""],
    ]);
    vi.unstubAllGlobals();
  });

  it("takes a text-holding div when no block holds it, never the body", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ state: "idle" })),
    );
    boot();
    byId("content-holder").insertAdjacentHTML(
      "beforeend",
      '<div class="card"><b id="b">Card</b> text</div><div id="empty"><span id="s"></span></div>',
    );
    const tr = api().pointTrace();
    tr.add("down", "touch", 1, 1, 0, document.getElementById("b"), "");
    tr.add("down", "touch", 1, 1, 10, document.getElementById("s"), "");
    expect(tr.targets).toEqual([{ tag: "div", heading: "Setup", quote: "Card text" }]);
    expect(tr.samples.map((x: any) => x.i)).toEqual([0, null]);
    vi.unstubAllGlobals();
  });

  it("names a heading without a heading above it", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ state: "idle" })),
    );
    boot();
    expect(api().talkDescribe(document.getElementById("setup"))).toEqual({
      tag: "h2",
      heading: "",
      quote: "Setup",
      id: "setup",
    });
    vi.unstubAllGlobals();
  });
});
