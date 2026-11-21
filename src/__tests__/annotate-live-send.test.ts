// ABOUTME: The annotate tool on the live site (_includes/annotate.html): the open-PR badge matched by source path,
// ABOUTME: Send posting to a Cockpit address saved once (prompt or #larry-cockpit=), else one secret gist per page.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const REPO_API = "https://api.github.com/repos/idvorkin/idvorkin.github.io";
const LIVE = "https://idvork.in";
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
const badge = () => document.getElementById("blog-annot-prs") as HTMLElement;
const buffer = () => JSON.parse(localStorage.getItem("blogAnnotateBuffer") || "[]");

function boot(sourcePath = "_d/foo.md") {
  window.location.hostname = "idvork.in";
  window.location.port = "";
  window.location.pathname = "/foo";
  const meta = `<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" data-source-path="${sourcePath}" hidden></div>`;
  document.body.innerHTML = `${meta}<div id="content-holder"><p>The quick brown fox.</p></div>`;
  localStorage.setItem("blogAnnotate", "1");
  loadAnnotate();
}

// Two open PRs: #1082 edits _d/foo.md, #900 edits something else.
function githubPrs(url: string): Response {
  if (url === `${REPO_API}/pulls?state=open&per_page=100`)
    return json([
      { number: 1082, title: "Tighten foo", html_url: "https://github.com/idvorkin/idvorkin.github.io/pull/1082" },
      { number: 900, title: "Other", html_url: "https://github.com/idvorkin/idvorkin.github.io/pull/900" },
    ]);
  if (url === `${REPO_API}/pulls/1082/files?per_page=100`)
    return json([{ filename: "_d/foo.md" }, { filename: "assets/x.png" }]);
  if (url === `${REPO_API}/pulls/900/files?per_page=100`) return json([{ filename: "_d/bar.md" }]);
  return json({ message: "unexpected" }, 404);
}

function note(permalink: string, quote: string, comment: string, source: string) {
  return {
    permalink,
    origin: LIVE,
    title: `Title of ${permalink}`,
    source,
    quote,
    prefix: "before ",
    suffix: " after",
    comment,
    intent: "cut",
    ts: `2026-11-14T10:00:00.000Z${quote}`,
    version: { url: `${LIVE}${permalink}`, contentDigest: "abcd1234" },
  };
}

// jsdom has no prompt(); a cancelled one is the default (address prompt -> gist path).
beforeEach(() => {
  vi.stubGlobal("prompt", () => null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.location.hash = "";
  localStorage.clear();
  sessionStorage.clear();
  (window as any).blogAnnotate = undefined;
  document.documentElement.classList.remove("blog-annot-off");
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  window.location.hostname = "localhost";
  window.location.pathname = "/";
});

describe("prsTouchingPath", () => {
  beforeEach(() => {
    stubFetch(() => json([]));
    boot("");
  });

  const prs = [
    { number: 1, files: ["_d/foo.md", "README.md"] },
    { number: 2, files: ["_d/foobar.md"] },
    { number: 3, files: ["_d/foo.md"] },
  ];

  it("returns the PRs that change exactly this source file", () => {
    expect(
      api()
        .prsTouchingPath(prs, "_d/foo.md")
        .map((p: any) => p.number),
    ).toEqual([1, 3]);
  });

  it("ignores a leading ./ or /", () => {
    expect(api().prsTouchingPath(prs, "/_d/foo.md")).toHaveLength(2);
    expect(api().prsTouchingPath(prs, "./_d/foo.md")).toHaveLength(2);
  });

  it("matches nothing for an empty path, an unknown file, or a bad list", () => {
    expect(api().prsTouchingPath(prs, "")).toEqual([]);
    expect(api().prsTouchingPath(prs, "_d/nope.md")).toEqual([]);
    expect(api().prsTouchingPath(null, "_d/foo.md")).toEqual([]);
  });
});

describe("open-PR badge", () => {
  it("names the open PRs that change this page, with links, unauthenticated", async () => {
    const calls = stubFetch(githubPrs);
    boot("_d/foo.md");
    await api().refreshOpenPrs();
    expect(badge().hidden).toBe(false);
    expect(badge().textContent).toBe("This page has 1 open PR: #1082");
    const link = badge().querySelector("a") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://github.com/idvorkin/idvorkin.github.io/pull/1082");
    expect(link.title).toBe("Tighten foo");
    for (const c of calls) {
      expect(c.url.startsWith(REPO_API)).toBe(true);
      expect((c.init?.headers as Record<string, string>)?.Authorization).toBeUndefined();
    }
  });

  it("shows nothing for a page no open PR touches", async () => {
    stubFetch(githubPrs);
    boot("_d/quiet.md");
    await api().refreshOpenPrs();
    expect(badge().hidden).toBe(true);
    expect(badge().textContent).toBe("");
  });

  it("reuses the session cache instead of asking GitHub again", async () => {
    const calls = stubFetch(githubPrs);
    boot("_d/foo.md");
    await api().refreshOpenPrs();
    const first = calls.length;
    expect(first).toBe(3);
    document.head.innerHTML = "";
    boot("_d/foo.md");
    await api().refreshOpenPrs();
    expect(calls).toHaveLength(first);
  });

  it("fails silent on a rate limit and does not retry on the next page load", async () => {
    const calls = stubFetch(() => json({ message: "API rate limit exceeded" }, 403));
    boot("_d/foo.md");
    await expect(api().refreshOpenPrs()).resolves.toBeUndefined();
    expect(badge().hidden).toBe(true);
    const after = calls.length;
    boot("_d/foo.md");
    await api().refreshOpenPrs();
    expect(calls).toHaveLength(after);
  });

  it("never touches GitHub for a reader without the flag", () => {
    const calls = stubFetch(githubPrs);
    window.location.hostname = "idvork.in";
    document.body.innerHTML = '<div id="blog-annot-meta" data-source-path="_d/foo.md" hidden></div>';
    loadAnnotate();
    expect(document.getElementById("blog-annot-pill")).toBeNull();
    expect(calls).toHaveLength(0);
  });
});

describe("Send to Larry on the collapsed pill", () => {
  const send = () => document.getElementById("blog-annot-send") as HTMLButtonElement;
  const preload = (list: unknown[]) => localStorage.setItem("blogAnnotateBuffer", JSON.stringify(list));

  it("sits next to Open, greyed out with no notes", () => {
    stubFetch(githubPrs);
    boot("_d/foo.md");
    const pill = document.getElementById("blog-annot-pill") as HTMLElement;
    expect(send().parentElement).toBe(pill);
    expect(document.getElementById("blog-annot-open")?.nextElementSibling).toBe(send());
    expect(send().disabled).toBe(true);
  });

  it("is live with notes, sends straight from the pill, and greys out once all are sent", async () => {
    const gists: unknown[] = [];
    stubFetch((url, init) => {
      if (url === "https://api.github.com/gists") {
        gists.push(init?.body);
        return json({ id: "g" }, 201);
      }
      return githubPrs(url);
    });
    preload([note("/foo", "a", "x", "_d/foo.md")]);
    localStorage.setItem("blogAnnotateToken", "test-token");
    boot("_d/foo.md");
    expect(send().disabled).toBe(false);
    send().click();
    expect(send().textContent).toBe("Sending…");
    expect(send().disabled).toBe(true);
    await vi.waitFor(() => expect(send().textContent).toBe("Sent ✓"));
    expect(gists).toHaveLength(1);
    expect(send().disabled).toBe(true);
  });

  it("stays live when a send fails, so it can be retried", async () => {
    stubFetch((url) => (url === "https://api.github.com/gists" ? json({}, 502) : githubPrs(url)));
    preload([note("/foo", "a", "x", "_d/foo.md")]);
    localStorage.setItem("blogAnnotateToken", "test-token");
    boot("_d/foo.md");
    await api().sendToLarry();
    expect(send().disabled).toBe(false);
    expect(send().textContent).toBe("Send to Larry");
  });
});

describe("Send to Larry from the live site", () => {
  it("writes one secret gist per page in the blog-review-batch/1 shape and clears the buffer", async () => {
    const gists: any[] = [];
    const calls = stubFetch((url, init) => {
      if (url === "https://api.github.com/gists") {
        gists.push({ headers: init?.headers, body: JSON.parse(String(init?.body)) });
        return json({ id: `g${gists.length}`, html_url: `https://gist.github.com/g${gists.length}` }, 201);
      }
      return githubPrs(url);
    });
    boot("_d/foo.md");
    localStorage.setItem("blogAnnotateToken", "test-token");
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([
        note("/foo", "brown fox", "tighten", "_d/foo.md"),
        note("/bar", "other page", "", "_d/bar.md"),
        note("/foo", "quick", "why?", "_d/foo.md"),
      ]),
    );
    await api().sendToLarry();

    expect(calls.some((c) => c.url.includes("/blog-review") || c.url.includes("/larry/"))).toBe(false);
    expect(gists).toHaveLength(2);
    expect(gists[0].headers.Authorization).toBe("Bearer test-token");
    expect(gists[0].body.public).toBe(false);
    expect(gists[0].body.description).toBe("blog-review: /foo");
    expect(Object.keys(gists[0].body.files)).toEqual(["review.json"]);

    const batch = JSON.parse(gists[0].body.files["review.json"].content);
    expect(batch).toMatchObject({
      schema: "blog-review-batch/1",
      via: "send",
      permalink: "/foo",
      origin: LIVE,
      title: "Title of /foo",
      url: `${LIVE}/foo`,
      page_url: `${LIVE}/foo`,
      site_url: "https://blog.example/foo",
      source_path: "_d/foo.md",
      version: { url: `${LIVE}/foo`, contentDigest: "abcd1234" },
    });
    expect(batch.batch_id).toMatch(/^blog-[0-9a-f]{8}$/);
    expect(new Date(batch.created).toISOString()).toBe(batch.created);
    expect(batch.annotations.map((a: any) => [a.quote, a.comment, a.intent])).toEqual([
      ["brown fox", "tighten", "cut"],
      ["quick", "why?", "cut"],
    ]);

    const other = JSON.parse(gists[1].body.files["review.json"].content);
    expect(gists[1].body.description).toBe("blog-review: /bar");
    expect(other.source_path).toBe("_d/bar.md");
    expect(other.batch_id).not.toBe(batch.batch_id);

    expect(buffer()).toEqual([]);
    expect(document.getElementById("blog-annot-send")?.textContent).toBe("Sent ✓");
  });

  it("gives the same batch_id to a resend of the same notes, so a watcher can dedupe", async () => {
    const ids: string[] = [];
    stubFetch((url, init) => {
      if (url === "https://api.github.com/gists") {
        ids.push(JSON.parse(JSON.parse(String(init?.body)).files["review.json"].content).batch_id);
        return json({ id: "g" }, 201);
      }
      return githubPrs(url);
    });
    boot("_d/foo.md");
    localStorage.setItem("blogAnnotateToken", "test-token");
    const list = [note("/foo", "brown fox", "tighten", "_d/foo.md")];
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify(list));
    await api().sendToLarry();
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify(list));
    await api().sendToLarry();
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBe(ids[1]);
  });

  it("keeps the page whose gist failed and opens the fallback card", async () => {
    stubFetch((url, init) => {
      if (url === "https://api.github.com/gists") {
        const desc = JSON.parse(String(init?.body)).description;
        return desc.endsWith("/bar") ? json({}, 502) : json({ id: "g" }, 201);
      }
      return githubPrs(url);
    });
    boot("_d/foo.md");
    localStorage.setItem("blogAnnotateToken", "test-token");
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([note("/foo", "a", "x", "_d/foo.md"), note("/bar", "b", "y", "_d/bar.md")]),
    );
    await api().sendToLarry();
    expect(buffer().map((a: any) => a.quote)).toEqual(["b"]);
    expect(document.getElementById("blog-annot-note")?.textContent).toContain("GitHub returned 502");
  });

  it("sends nothing and keeps the notes when no token is given", async () => {
    const calls = stubFetch(githubPrs);
    vi.stubGlobal("prompt", () => null);
    boot("_d/foo.md");
    await api().refreshOpenPrs();
    const before = calls.length;
    const list = [note("/foo", "a", "x", "_d/foo.md")];
    localStorage.setItem("blogAnnotateBuffer", JSON.stringify(list));
    await api().sendToLarry();
    expect(calls).toHaveLength(before);
    expect(buffer()).toEqual(list);
    expect(document.getElementById("blog-annot-note")?.textContent).toContain("No GitHub token");
  });

  it("records the page's source path on every saved note", () => {
    stubFetch(githubPrs);
    boot("_d/foo.md");
    const p = document.querySelector("#content-holder p") as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(p);
    const sel = window.getSelection() as Selection;
    sel.removeAllRanges();
    sel.addRange(range);
    document.dispatchEvent(new MouseEvent("mouseup"));
    return new Promise<void>((done) =>
      setTimeout(() => {
        (document.getElementById("blog-annot-btn") as HTMLElement).click();
        (document.getElementById("blog-annot-text") as HTMLTextAreaElement).value = "hm";
        (document.getElementById("blog-annot-save") as HTMLElement).click();
        expect(buffer()[0]).toMatchObject({ source: "_d/foo.md", comment: "hm", permalink: "/foo" });
        done();
      }, 30),
    );
  });
});

describe("Cockpit address validation", () => {
  beforeEach(() => {
    stubFetch(() => json([]));
    boot("");
  });

  it("accepts an https tailnet or localhost origin and keeps only the origin", () => {
    expect(api().cockpitOrigin(`${COCKPIT}/blog-review?x=1#y`)).toBe(COCKPIT);
    expect(api().cockpitOrigin(`${COCKPIT}:8443`)).toBe(`${COCKPIT}:8443`);
    expect(api().cockpitOrigin(`  ${TAILNET}  `)).toBe(COCKPIT);
    expect(api().cockpitOrigin("https://localhost")).toBe("https://localhost");
  });

  it("rejects other schemes, other hosts and suffix tricks", () => {
    for (const bad of [
      "",
      "not a url",
      `http://${TAILNET}`,
      "https://idvork.in",
      `https://${TAILNET}.evil.com`,
      `https://${TAILNET}@evil.com`,
      `https://evil.com/${TAILNET}`,
      `javascript:alert(1)//${TAILNET}`,
    ])
      expect(api().cockpitOrigin(bad)).toBe("");
  });
});

describe("Send to Larry from the live site with a saved Cockpit", () => {
  const preload = (list: unknown[]) => localStorage.setItem("blogAnnotateBuffer", JSON.stringify(list));

  it("posts each page to the saved origin, polls its status, and never touches a gist", async () => {
    const posts: any[] = [];
    const calls = stubFetch((url, init) => {
      if (url === `${COCKPIT}/blog-review`) {
        posts.push(JSON.parse(String(init?.body)));
        return json({ ok: true });
      }
      if (url === `${COCKPIT}/larry/status`) return json({ state: "idle" });
      return githubPrs(url);
    });
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    preload([note("/foo", "a", "x", "_d/foo.md"), note("/bar", "b", "y", "_d/bar.md")]);
    boot("_d/foo.md");
    expect(document.getElementById("blog-annot-larry-dot")).not.toBeNull();
    await api().refreshLarry();
    expect(document.getElementById("blog-annot-larry-dot")?.getAttribute("data-state")).toBe("idle");

    await api().sendToLarry();
    expect(posts.map((p) => p.page_url)).toEqual([`${LIVE}/foo`, `${LIVE}/bar`]);
    expect(calls.some((c) => c.url.startsWith("https://api.github.com/gists"))).toBe(false);
    expect(buffer()).toEqual([]);
    expect(document.getElementById("blog-annot-send")?.textContent).toBe("Sent ✓");
  });

  it("ignores a saved value that fails validation", () => {
    const calls = stubFetch(githubPrs);
    localStorage.setItem("blogLarryCockpit", "https://evil.example");
    boot("_d/foo.md");
    expect(document.getElementById("blog-annot-larry-dot")).toBeNull();
    expect(calls.some((c) => c.url.includes("evil"))).toBe(false);
  });

  it("falls back to one gist per page when the Cockpit cannot be reached, asking for the token only then", async () => {
    let cockpitTries = 0;
    const gists: any[] = [];
    stubFetch((url, init) => {
      if (url === `${COCKPIT}/blog-review`) {
        cockpitTries++;
        return Promise.reject(new TypeError("Failed to fetch"));
      }
      if (url === "https://api.github.com/gists") {
        gists.push(JSON.parse(String(init?.body)));
        return json({ id: "g" }, 201);
      }
      if (url === `${COCKPIT}/larry/status`) return Promise.reject(new TypeError("Failed to fetch"));
      return githubPrs(url);
    });
    const asked: string[] = [];
    vi.stubGlobal("prompt", (msg: string) => {
      asked.push(msg);
      return "test-token";
    });
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    preload([note("/foo", "a", "x", "_d/foo.md"), note("/bar", "b", "y", "_d/bar.md")]);
    boot("_d/foo.md");
    expect(asked).toHaveLength(0);

    await api().sendToLarry();
    expect(cockpitTries).toBe(1);
    expect(gists.map((g) => g.description)).toEqual(["blog-review: /foo", "blog-review: /bar"]);
    expect(asked).toHaveLength(1);
    expect(asked[0]).toContain("GitHub personal access token");
    expect(buffer()).toEqual([]);
    expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
  });

  it("keeps the notes when the Cockpit is down and no token is given", async () => {
    stubFetch((url) =>
      url === `${COCKPIT}/blog-review` ? Promise.reject(new TypeError("Failed to fetch")) : githubPrs(url),
    );
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    const list = [note("/foo", "a", "x", "_d/foo.md")];
    preload(list);
    boot("_d/foo.md");
    await api().sendToLarry();
    expect(buffer()).toEqual(list);
    const msg = document.getElementById("blog-annot-note")?.textContent || "";
    expect(msg).toContain("Failed to fetch");
    expect(msg).toContain("no GitHub token");
  });

  it("asks for the address on the first Send, saves the origin, and posts there", async () => {
    const posts: string[] = [];
    stubFetch((url) => {
      if (url.endsWith("/blog-review")) posts.push(url);
      return url.startsWith(COCKPIT) ? json({ ok: true }) : githubPrs(url);
    });
    const asked: string[] = [];
    vi.stubGlobal("prompt", (msg: string) => {
      asked.push(msg);
      return `${COCKPIT}/some/path`;
    });
    preload([note("/foo", "a", "x", "_d/foo.md")]);
    boot("_d/foo.md");
    await api().sendToLarry();
    expect(asked).toHaveLength(1);
    expect(asked[0]).toContain("Cockpit address");
    expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
    expect(posts).toEqual([`${COCKPIT}/blog-review`]);
    expect(buffer()).toEqual([]);
  });

  it("sends nothing and saves nothing when the typed address is invalid", async () => {
    const calls = stubFetch(githubPrs);
    vi.stubGlobal("prompt", () => "http://idvork.in");
    const list = [note("/foo", "a", "x", "_d/foo.md")];
    preload(list);
    boot("_d/foo.md");
    await api().refreshOpenPrs();
    const before = calls.length;
    await api().sendToLarry();
    expect(calls).toHaveLength(before);
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
    expect(buffer()).toEqual(list);
    expect(document.getElementById("blog-annot-note")?.textContent).toContain("Not a Cockpit address");
  });
});

describe("#larry-cockpit= fragment", () => {
  function visit(hash: string) {
    window.location.hostname = "idvork.in";
    window.location.pathname = "/foo";
    window.location.hash = hash;
    document.body.innerHTML = '<div id="blog-annot-meta" hidden></div>';
    loadAnnotate();
  }

  it("saves the origin and strips itself in the owner's browser", () => {
    const calls = stubFetch(() => json({}));
    const strip = vi.spyOn(history, "replaceState");
    localStorage.setItem("blogAnnotateOwner", "1");
    visit(`#larry-cockpit=${encodeURIComponent(`${COCKPIT}/x`)}`);
    expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
    expect(strip).toHaveBeenCalledWith(null, "", "/foo");
    expect(document.getElementById("blog-annot-pill")).toBeNull();
    expect(calls).toHaveLength(0);
  });

  it("strips itself but saves nothing in a reader's browser (a crafted link can't route their notes)", () => {
    const strip = vi.spyOn(history, "replaceState");
    visit(`#larry-cockpit=${COCKPIT}`);
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
    expect(strip).toHaveBeenCalledWith(null, "", "/foo");
  });

  it("accepts the address unencoded too, with ?annotate=1 on a new device", () => {
    stubFetch(() => json({ state: "idle" }));
    vi.spyOn(history, "replaceState");
    window.location.search = "?annotate=1";
    visit(`#larry-cockpit=${COCKPIT}`);
    window.location.search = "";
    expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
    expect(localStorage.getItem("blogAnnotateOwner")).toBe("1");
  });

  it("rejects an invalid address but still strips it, silently for a reader", () => {
    const strip = vi.spyOn(history, "replaceState");
    const alerted = vi.fn();
    vi.stubGlobal("alert", alerted);
    visit("#larry-cockpit=Call%20this%20number");
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
    expect(strip).toHaveBeenCalledWith(null, "", "/foo");
    expect(alerted).not.toHaveBeenCalled();
  });

  it("tells Igor (flag on) with fixed text that never echoes the link", () => {
    vi.spyOn(history, "replaceState");
    const alerted = vi.fn();
    vi.stubGlobal("alert", alerted);
    localStorage.setItem("blogAnnotate", "1");
    visit("#larry-cockpit=Call%20this%20number");
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
    expect(alerted).toHaveBeenCalledOnce();
    expect(String(alerted.mock.calls[0][0])).not.toContain("Call this number");
  });

  it("asks before replacing a different saved address", () => {
    vi.spyOn(history, "replaceState");
    localStorage.setItem("blogLarryCockpit", "https://localhost");
    vi.stubGlobal("confirm", () => false);
    visit(`#larry-cockpit=${COCKPIT}`);
    expect(localStorage.getItem("blogLarryCockpit")).toBe("https://localhost");
    vi.stubGlobal("confirm", () => true);
    visit(`#larry-cockpit=${COCKPIT}`);
    expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
  });

  it("leaves other fragments alone", () => {
    const strip = vi.spyOn(history, "replaceState");
    visit("#some-heading");
    expect(strip).not.toHaveBeenCalled();
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
  });
});
