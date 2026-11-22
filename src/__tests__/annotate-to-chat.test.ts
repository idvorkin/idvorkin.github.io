// ABOUTME: Notes straight to chat (_includes/annotate.html): with a Cockpit, a note saved with "Send straight to chat"
// ABOUTME: ticked (the default) posts at once to the page's thread; unticked or unreachable, it waits on the Review list.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const COCKPIT = "https://box.example-tail.ts.net";

const loadAnnotate = () => {
  const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
  const start = include.lastIndexOf("<script>");
  new Function(include.slice(start + "<script>".length, include.lastIndexOf("</script>")))();
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const flush = async () => {
  for (let i = 0; i < 30; i++) await Promise.resolve();
};
const el = (id: string) => document.getElementById(id) as HTMLInputElement;
const buffer = () => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]");
const api = () => (window as any).blogAnnotate;

let up = true; // does the Cockpit answer?
let posts: any[] = [];

function boot() {
  posts = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (!up) throw new TypeError("Load failed");
      if (url === `${COCKPIT}/blog-review`) {
        posts.push(JSON.parse(String(init?.body)));
        return json({ ok: true });
      }
      if (url === `${COCKPIT}/larry/status`) return json({ ok: true, state: "idle" });
      if (url.startsWith(`${COCKPIT}/page-chat`)) return json({ ok: true, messages: [] });
      return json([]); // GitHub open PRs
    }),
  );
  window.location.hostname = "idvork.in";
  window.location.pathname = "/foo";
  document.body.innerHTML =
    '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://idvork.in" data-source-path="_d/foo.md" hidden></div>' +
    '<div id="content-holder"><p>The quick brown fox.</p></div>';
  localStorage.setItem("blogAnnotate", "1");
  loadAnnotate();
}

async function openNote() {
  const range = document.createRange();
  range.selectNodeContents(document.querySelector("#content-holder p") as HTMLElement);
  const sel = window.getSelection() as Selection;
  sel.removeAllRanges();
  sel.addRange(range);
  document.dispatchEvent(new MouseEvent("mouseup"));
  await new Promise((r) => setTimeout(r, 30));
  el("blog-annot-btn").click();
  el("blog-annot-text").value = "too strong";
}

describe("Notes straight to chat", () => {
  beforeEach(() => {
    localStorage.clear();
    up = true;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    (window as any).blogAnnotate = undefined;
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.location.hostname = "localhost";
    window.location.pathname = "/";
  });

  it("posts a note to the page's thread at once when the box is ticked, as it is by default", async () => {
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    boot();
    await flush();
    await openNote();
    expect(el("blog-annot-tochat").checked).toBe(true);
    el("blog-annot-save").click();
    await flush();
    expect(posts).toHaveLength(1);
    expect(posts[0].permalink).toBe("https://idvork.in/foo"); // the page's thread
    expect(posts[0].annotations[0]).toMatchObject({ quote: "The quick brown fox.", note: "too strong" });
    expect(buffer()).toEqual([]);
    expect(el("blog-annot-send").textContent).toBe("Sent to chat ✓");
  });

  it("unticked, the note waits on the Review list and the choice is remembered", async () => {
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    boot();
    await flush();
    await openNote();
    el("blog-annot-tochat").checked = false;
    el("blog-annot-tochat").dispatchEvent(new Event("change"));
    el("blog-annot-save").click();
    await flush();
    expect(posts).toHaveLength(0);
    expect(buffer()).toHaveLength(1);
    expect(localStorage.getItem("blogAnnotateToChat")).toBe("0");
    await openNote();
    expect(el("blog-annot-tochat").checked).toBe(false);
  });

  it("unreachable, saves to the list and says so, then sends it when the Cockpit answers again", async () => {
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    up = false;
    boot();
    await flush();
    await openNote();
    el("blog-annot-save").click();
    await flush();
    expect(buffer()).toHaveLength(1);
    expect(el("blog-annot-send").textContent).toMatch(/Chat unreachable: saved to Review/);
    expect(el("blog-annot-connect").hidden).toBe(false);
    up = true;
    await api().refreshLarry();
    await flush();
    expect(posts).toHaveLength(1);
    expect(buffer()).toEqual([]);
  });

  it("a reconnect leaves notes saved for the Review list alone", async () => {
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    const listed = { permalink: "/foo", quote: "q", comment: "c", ts: "2026-11-22T00:00:00Z" };
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify([listed]));
    boot();
    await flush();
    await api().refreshLarry();
    await flush();
    expect(posts).toHaveLength(0);
    expect(buffer()).toEqual([listed]);
  });

  it("with no Cockpit there is no box and the note is listed", async () => {
    boot();
    await openNote();
    expect(el("blog-annot-tochat")).toBeNull();
    el("blog-annot-save").click();
    await flush();
    expect(buffer()).toHaveLength(1);
  });
});
