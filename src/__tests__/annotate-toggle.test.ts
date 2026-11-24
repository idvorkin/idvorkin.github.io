// ABOUTME: The 💬 toggle and GitHub source link every reader gets from _includes/annotate.html:
// ABOUTME: no request until used, live on/off, and a reader's Send ends in "Copy for Igor", never a prompt.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const loadAnnotate = () => {
  const include = readFileSync(resolve(__dirname, "../../_includes/annotate.html"), "utf8");
  const start = include.lastIndexOf("<script>");
  new Function(include.slice(start + "<script>".length, include.lastIndexOf("</script>")))();
};

const api = () => (window as any).blogAnnotate;
const toggle = () => document.getElementById("blog-annot-toggle") as HTMLButtonElement;
const pill = () => document.getElementById("blog-annot-pill");

function boot(sourcePath = "_d/foo.md") {
  window.location.hostname = "idvork.in";
  window.location.port = "";
  window.location.pathname = "/foo";
  document.body.innerHTML = `<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://idvork.in" data-source-path="${sourcePath}" hidden></div><div id="content-holder"><p>The quick brown fox.</p></div>`;
  const fetched: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      fetched.push(String(url));
      return new Response("[]", { status: 200 });
    }),
  );
  const prompted = vi.fn(() => null);
  vi.stubGlobal("prompt", prompted);
  loadAnnotate();
  return { fetched, prompted };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  sessionStorage.clear();
  (window as any).blogAnnotate = undefined;
  document.documentElement.classList.remove("blog-annot-off");
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  window.location.hostname = "localhost";
  window.location.pathname = "/";
});

describe("the toggle a reader sees", () => {
  it("shows the toggle (off) and a link to the post's markdown, with no request", () => {
    const { fetched } = boot("_d/foo.md");
    expect(toggle()).not.toBeNull();
    expect(toggle().getAttribute("aria-pressed")).toBe("false");
    expect(toggle().title).toContain("/foo");
    expect((document.getElementById("blog-annot-src") as HTMLAnchorElement).href).toBe(
      "https://github.com/idvorkin/idvorkin.github.io/blob/main/_d/foo.md",
    );
    expect(pill()).toBeNull();
    expect(fetched).toEqual([]);
  });

  it("joins the navbar right after its GitHub link when the layout has one, adding no second link", () => {
    window.location.hostname = "idvork.in";
    window.location.pathname = "/foo";
    document.body.innerHTML =
      '<nav class="navbar"><a id="gh" href="https://github.com/idvorkin/idvorkin.github.io/blob/main/_d/foo.md">gh</a><a id="about" href="/about">i</a></nav>' +
      '<div id="blog-annot-meta" data-permalink="/foo" data-source-path="_d/foo.md" hidden></div><p>x</p>';
    loadAnnotate();
    expect(document.getElementById("gh")?.nextElementSibling).toBe(toggle());
    expect(document.getElementById("blog-annot-src")).toBeNull();
    expect(document.getElementById("blog-annot-bar")).toBeNull();
    toggle().click();
    expect(toggle().getAttribute("aria-pressed")).toBe("true");
  });

  it("leaves the link out when the page has no source path", () => {
    boot("");
    expect(document.getElementById("blog-annot-src")).toBeNull();
    expect(toggle()).not.toBeNull();
  });

  it("turns Comments on and off live, without asking GitHub for open PRs or marking the reader as owner", () => {
    const { fetched } = boot();
    toggle().click();
    expect(api().enabled()).toBe(true);
    expect(toggle().getAttribute("aria-pressed")).toBe("true");
    expect(pill()).not.toBeNull();
    toggle().click();
    expect(api().enabled()).toBe(false);
    expect(toggle().getAttribute("aria-pressed")).toBe("false");
    expect(document.documentElement.classList.contains("blog-annot-off")).toBe(true);
    expect(fetched).toEqual([]);
    expect(localStorage.getItem("blogAnnotateOwner")).toBeNull();
  });

  it("does not make a reader the owner on the next page load either", () => {
    boot();
    toggle().click(); // on, and persisted
    (window as any).blogAnnotate = undefined;
    const { fetched } = boot();
    expect(api().enabled()).toBe(true);
    expect(fetched).toEqual([]); // no open-PR badge: that is the owner's
  });

  it("sends a reader's notes to the Copy for Igor card: no prompt, no request, no gist button", async () => {
    const { fetched, prompted } = boot();
    toggle().click();
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([
        {
          permalink: "/foo",
          origin: "https://idvork.in",
          title: "Foo",
          quote: "quick brown",
          comment: "tighten",
          intent: "cut",
          ts: "t1",
        },
      ]),
    );
    await api().sendToLarry();
    expect(prompted).not.toHaveBeenCalled();
    expect(fetched).toEqual([]);
    expect(document.getElementById("blog-annot-copy")?.textContent).toBe("Copy for Igor");
    expect(document.getElementById("blog-annot-gist")).toBeNull();
    expect(document.getElementById("blog-annot-note")?.textContent).toContain("Larry isn't connected");
  });

  it("copies readable text led by the page URL", async () => {
    boot();
    toggle().click();
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([
        {
          permalink: "/foo",
          origin: "https://idvork.in",
          title: "Foo",
          quote: "quick brown",
          comment: "tighten",
          intent: "cut",
          ts: "t1",
        },
      ]),
    );
    let copied = "";
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: {
        writeText: async (t: string) => {
          copied = t;
        },
      },
    });
    await api().sendToLarry();
    document.getElementById("blog-annot-copy")?.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(copied).toBe('Comments on https://idvork.in/foo (Foo)\n\n1. [cut] "quick brown"\n   tighten');
  });

  it("uses a reader's saved token for the gist without prompting", async () => {
    const { fetched, prompted } = boot();
    toggle().click();
    localStorage.setItem("blogAnnotateToken", "tok");
    localStorage.setItem(
      "blogAnnotateBuffer",
      JSON.stringify([
        {
          permalink: "/foo",
          origin: "https://idvork.in",
          title: "Foo",
          quote: "q",
          comment: "",
          intent: "note",
          ts: "t1",
        },
      ]),
    );
    await api().sendToLarry();
    expect(prompted).not.toHaveBeenCalled();
    expect(fetched).toEqual(["https://api.github.com/gists"]);
  });

  it("still treats a flag set before the toggle shipped as the owner's", () => {
    localStorage.setItem("blogAnnotate", "1");
    const { fetched } = boot();
    expect(api().enabled()).toBe(true);
    expect(fetched.some((u) => u.includes("api.github.com"))).toBe(true); // open-PR badge
  });
});
