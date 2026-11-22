// ABOUTME: Connect to Larry (_includes/annotate.html, Cockpit story 196): a browser with no Cockpit pairs by a
// ABOUTME: challenge from /pair/start and the 6-digit number the Cockpit shows, sent only in a POST body.

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

type Call = { url: string; init?: RequestInit };

function stubFetch(handler: (url: string, init?: RequestInit) => Response) {
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

const flush = async () => {
  for (let i = 0; i < 20; i++) await Promise.resolve();
};
const $ = (id: string) => document.getElementById(id) as HTMLInputElement;

function boot(hostname: string) {
  window.location.hostname = hostname;
  window.location.pathname = "/foo";
  document.body.innerHTML =
    '<div id="blog-annot-meta" data-permalink="/foo" data-title="Foo" data-site-url="https://blog.example" data-source-path="_d/foo.md" hidden></div>' +
    '<div id="content-holder"><p>The quick brown fox.</p></div>';
  localStorage.setItem("blogAnnotate", "1");
  loadAnnotate();
}

function pairingCockpit(code = "482913") {
  return stubFetch((url, init) => {
    if (url === `${COCKPIT}/pair/start`) return json({ ok: true, challenge: "K7QX" });
    if (url === `${COCKPIT}/pair/redeem`) {
      const body = JSON.parse(String(init?.body));
      return body.code === code && body.challenge === "K7QX"
        ? json({ ok: true, cockpit: COCKPIT })
        : json({ ok: false, error: "wrong or expired number" }, 403);
    }
    return json({}, 404);
  });
}

async function connectWith(code: string) {
  $("blog-annot-connect").click();
  $("blog-annot-pair-origin").value = "box.example-tail.ts.net";
  $("blog-annot-pair-go").click();
  await flush();
  expect($("blog-annot-pair-ch").textContent).toBe("K7QX");
  $("blog-annot-pair-code").value = code;
  $("blog-annot-pair-go").click();
  await flush();
}

describe("Connect to Larry", () => {
  beforeEach(() => localStorage.clear());

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

  it("is offered only off the tailnet with no saved Cockpit", () => {
    stubFetch(() => json({ ok: true, state: "idle" }));
    boot("box.example-tail.ts.net");
    expect($("blog-annot-connect")).toBeNull();
  });

  it("saves the address once the right number redeems, sent only in the body", async () => {
    const calls = pairingCockpit();
    boot("blog.example");
    await connectWith("482 913");
    expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
    expect($("blog-annot-connect")).toBeNull();
    const redeem = calls.find((c) => c.url.endsWith("/pair/redeem"));
    expect(redeem?.url).not.toContain("482913");
    expect(JSON.parse(String(redeem?.init?.body))).toEqual({ challenge: "K7QX", code: "482913" });
  });

  it("saves nothing on a wrong number", async () => {
    pairingCockpit();
    boot("blog.example");
    await connectWith("111111");
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
    expect($("blog-annot-note").textContent).toMatch(/Wrong or expired/);
    expect($("blog-annot-connect")).not.toBeNull();
  });
});
