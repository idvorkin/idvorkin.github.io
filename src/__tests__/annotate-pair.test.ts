// ABOUTME: Connect to Larry (_includes/annotate.html, Cockpit story 196): a browser with no Cockpit pairs by a
// ABOUTME: challenge from /pair/start and the 6-digit number the Cockpit shows, sent only in a POST body.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const COCKPIT = "https://c-5004.squeaker-teeth.ts.net"; // DEFAULT_COCKPIT, published

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
  // The published address starts pairing on the click: no address to type.
  $("blog-annot-connect").click();
  await flush();
  expect($("blog-annot-pair-ch").textContent).toBe("K7QX");
  $("blog-annot-pair-code").value = code;
  $("blog-annot-pair-go").click();
  await flush();
}

describe("Connect to Larry", () => {
  beforeEach(() => {
    localStorage.clear();
    (window.location as any).reload = vi.fn();
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
    expect(window.location.reload).toHaveBeenCalledTimes(1);
    const redeem = calls.find((c) => c.url.endsWith("/pair/redeem"));
    expect(redeem?.url).not.toContain("482913");
    expect(JSON.parse(String(redeem?.init?.body))).toEqual({ challenge: "K7QX", code: "482913" });
  });

  it("off the tailnet says so instead of hanging", async () => {
    stubFetch(() => {
      throw new TypeError("Failed to fetch");
    });
    boot("blog.example");
    $("blog-annot-connect").click();
    await flush();
    expect($("blog-annot-note").textContent).toMatch(/Tailscale/);
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
  });

  it("saves nothing on a wrong number", async () => {
    pairingCockpit();
    boot("blog.example");
    await connectWith("111111");
    expect(localStorage.getItem("blogLarryCockpit")).toBeNull();
    expect($("blog-annot-note").textContent).toMatch(/Wrong or expired/);
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  // igor2-88g.1652: a phone with a saved address that no longer answers showed a red dot and
  // "can't reach the Cockpit", with Connect hidden because an address was saved.
  describe("with a saved Cockpit that doesn't answer", () => {
    const DEAD = "https://old-box.example-tail.ts.net";
    const deadThenPairing = () =>
      stubFetch((url) => {
        if (url.startsWith(DEAD)) throw new TypeError("Load failed"); // Safari's failed fetch
        if (url === `${COCKPIT}/pair/start`) return json({ ok: true, challenge: "K7QX" });
        if (url === `${COCKPIT}/pair/redeem`) return json({ ok: true, cockpit: COCKPIT });
        return json({}, 404);
      });

    it("brings Connect back in the pill and pairs with the published Cockpit", async () => {
      deadThenPairing();
      localStorage.setItem("blogLarryCockpit", DEAD);
      boot("blog.example");
      await flush();
      expect($("blog-annot-connect").hidden).toBe(false);
      $("blog-annot-connect").click();
      await flush();
      expect($("blog-annot-pair-ch").textContent).toBe("K7QX");
      $("blog-annot-pair-code").value = "482913";
      $("blog-annot-pair-go").click();
      await flush();
      expect(localStorage.getItem("blogLarryCockpit")).toBe(COCKPIT);
    });

    it("offers Connect in the chat panel when the chat can't reach it", async () => {
      deadThenPairing();
      localStorage.setItem("blogLarryCockpit", DEAD);
      boot("blog.example");
      await flush();
      await (window as any).blogAnnotate.chat.open();
      await flush();
      expect($("blog-annot-chat-status").textContent).toMatch(/can't reach the Cockpit/);
      expect($("blog-annot-chat-connect").hidden).toBe(false);
      $("blog-annot-chat-connect").click();
      await flush();
      expect($("blog-annot-pair-ch").textContent).toBe("K7QX");
    });
  });

  it("keeps Connect hidden while the saved Cockpit answers", async () => {
    stubFetch(() => json({ ok: true, state: "idle", messages: [] }));
    localStorage.setItem("blogLarryCockpit", COCKPIT);
    boot("blog.example");
    await flush();
    expect($("blog-annot-connect").hidden).toBe(true);
    await (window as any).blogAnnotate.chat.open();
    await flush();
    expect($("blog-annot-chat-connect").hidden).toBe(true);
  });

  it("offers Connect in the chat panel with no Cockpit at all", async () => {
    stubFetch(() => json({}, 404));
    boot("blog.example");
    vi.stubGlobal("prompt", () => null); // the owner's address prompt, cancelled
    await (window as any).blogAnnotate.chat.open();
    expect($("blog-annot-chat-connect").hidden).toBe(false);
  });
});
