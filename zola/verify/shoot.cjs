// Render every page of two builds in ONE browser session and record what a
// reader would see: a full-page screenshot at each width, plus the DOM facts
// that explain a pixel difference (heights, where each heading sits, text,
// links, ids, images that loaded, JS errors).
//
//   URLS=urls.json SITES='{"jekyll":"http://127.0.0.1:4472","zola":"http://127.0.0.1:4471"}' \
//   OUT=dir [WIDTHS=390,1200] [JOBS=2] [MAXH=12000] node shoot.cjs
//
// Writes OUT/<site>/<width>/<slug>.png and OUT/shots.json. Resumable: a page
// whose PNG and record exist is skipped.
//
// Everything that makes two renders of the SAME html differ is pinned:
// clock, Math.random, animations, lazy images, device scale. Requests that
// leave the two local servers go through one on-disk cache, so both builds
// get byte-identical images and scripts; embeds that render differently on
// every load (YouTube, Instagram, analytics, cursor-party) are blocked.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const OUT = process.env.OUT;
const SITES = JSON.parse(process.env.SITES);
const WIDTHS = (process.env.WIDTHS || "390,1200").split(",").map(Number);
const JOBS = Number(process.env.JOBS || 2);
const MAXH = Number(process.env.MAXH || 12000);
const urls = JSON.parse(fs.readFileSync(process.env.URLS, "utf8"));
const CACHE = path.join(OUT, "net-cache");
const BLOCK =
  /youtube\.com|youtu\.be|ytimg\.com|instagram\.com|google-analytics|googletagmanager|doubleclick|cursor-party|partykit|twitter\.com|x\.com\/|platform\.|facebook\.|asciinema\.org|giscus|disqus/;
const slug = (u) => (u === "/" ? "_root" : u.replace(/^\/|\/$/g, "").replace(/[^\w.-]/g, "__"));

const PIN = () => {
  const T = 1795521600000; // 2026-11-24T12:00:00Z
  const RealDate = Date;
  class FixedDate extends RealDate {
    constructor(...a) {
      super(...(a.length ? a : [T]));
    }
    static now() {
      return T;
    }
  }
  window.Date = FixedDate;
  let s = 42;
  Math.random = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
const CSS = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}
video,iframe{visibility:hidden!important}`;

(async () => {
  fs.mkdirSync(CACHE, { recursive: true });
  const shotsFile = path.join(OUT, "shots.json");
  const shots = fs.existsSync(shotsFile) ? JSON.parse(fs.readFileSync(shotsFile, "utf8")) : {};
  const browser = await chromium.launch();
  const locals = Object.values(SITES);
  const jobs = [];
  for (const u of urls) for (const w of WIDTHS) for (const site of Object.keys(SITES)) jobs.push([u, w, site]);
  let next = 0;
  let done = 0;

  async function worker() {
    const ctx = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: "reduce" });
    await ctx.addInitScript(PIN);
    await ctx.route("**/*", async (route) => {
      const url = route.request().url();
      if (locals.some((b) => url.startsWith(b)) || url.startsWith("data:")) return route.continue();
      if (BLOCK.test(url) || route.request().method() !== "GET") return route.abort();
      const key = path.join(CACHE, crypto.createHash("sha1").update(url).digest("hex"));
      try {
        if (!fs.existsSync(`${key}.json`)) {
          const r = await route.fetch({ timeout: 15000 });
          fs.writeFileSync(`${key}.bin`, await r.body());
          fs.writeFileSync(`${key}.json`, JSON.stringify({ status: r.status(), headers: r.headers() }));
        }
        const meta = JSON.parse(fs.readFileSync(`${key}.json`, "utf8"));
        meta.headers["content-encoding"] = undefined;
        meta.headers["content-length"] = undefined;
        return route.fulfill({ status: meta.status, headers: meta.headers, body: fs.readFileSync(`${key}.bin`) });
      } catch {
        fs.writeFileSync(`${key}.json`, JSON.stringify({ status: 504, headers: {} }));
        fs.writeFileSync(`${key}.bin`, "");
        return route.abort();
      }
    });
    const page = await ctx.newPage();
    let errs = [];
    page.on("pageerror", (e) => errs.push(`pageerror: ${String(e).slice(0, 160)}`));
    page.on("response", (r) => {
      if (r.status() >= 400 && locals.some((b) => r.url().startsWith(b)))
        errs.push(`http ${r.status()}: ${new URL(r.url()).pathname}`);
    });
    while (next < jobs.length) {
      const [u, w, site] = jobs[next++];
      const key = `${u}|${w}|${site}`;
      const png = path.join(OUT, site, String(w), `${slug(u)}.png`);
      if (shots[key] && !shots[key].fail && fs.existsSync(png)) continue;
      errs = [];
      try {
        await page.setViewportSize({ width: w, height: 900 });
        await page.goto(SITES[site] + u, { waitUntil: "load", timeout: 30000 });
        await page.addStyleTag({ content: CSS });
        await page.evaluate(async () => {
          for (const i of document.images) i.loading = "eager";
          await document.fonts.ready;
          await Promise.race([
            Promise.all(
              [...document.images].map((i) =>
                i.complete
                  ? 0
                  : new Promise((r) => {
                      i.onload = r;
                      i.onerror = r;
                    }),
              ),
            ),
            new Promise((r) => setTimeout(r, 6000)),
          ]);
        });
        await page.waitForTimeout(700);
        const info = await page.evaluate(() => {
          const holder = document.querySelector("#content-holder") || document.body;
          const top = (e) => Math.round(e.getBoundingClientRect().top + window.scrollY);
          const clone = holder.cloneNode(true);
          for (const t of clone.querySelectorAll("script,style,noscript,template")) t.remove();
          return {
            h: document.documentElement.scrollHeight,
            marks: [...document.querySelectorAll("h1[id],h2[id],h3[id],h4[id]")].map((e) => [e.id, top(e)]),
            ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
            links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
            text: clone.textContent.replace(/\s+/g, " ").trim(),
            imgs: document.images.length,
            imgs_ok: [...document.images].filter((x) => x.complete && x.naturalWidth > 0).length,
            backlinks: document.querySelectorAll("#links-to-page a").length,
          };
        });
        fs.mkdirSync(path.dirname(png), { recursive: true });
        await page.screenshot({
          path: png,
          fullPage: true,
          clip: { x: 0, y: 0, width: w, height: Math.min(info.h, MAXH) },
        });
        shots[key] = { ...info, errs, png: path.relative(OUT, png) };
      } catch (e) {
        shots[key] = { fail: String(e).slice(0, 200), errs };
      }
      if (++done % 40 === 0) {
        fs.writeFileSync(shotsFile, JSON.stringify(shots));
        console.log(`${done} shots (${next}/${jobs.length} jobs)`);
      }
    }
    await ctx.close();
  }
  await Promise.all(Array.from({ length: JOBS }, worker));
  fs.writeFileSync(shotsFile, JSON.stringify(shots));
  await browser.close();
  console.log(`done: ${done} new shots, ${Object.values(shots).filter((s) => s.fail).length} failed`);
})();
