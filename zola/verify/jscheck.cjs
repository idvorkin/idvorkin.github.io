// Inline <script> blocks that parse in the Jekyll build but not in the Zola
// one. Markdown conversion breaks scripts quietly (a blank line ends an HTML
// block, smart quotes rewrite strings) and the page still renders, so this
// is checked on its own, without a browser.
//
//   node jscheck.cjs <jekyll _site> <zola out>      exit 1 when any page got worse
const fs = require("node:fs");
const path = require("node:path");
const [J, Z] = process.argv.slice(2);
const SCRIPT =
  /<script(?![^>]*\bsrc=)(?![^>]*type=["']?(?:module|application\/json|application\/ld\+json|text\/template|text\/plain|importmap))[^>]*>([\s\S]*?)<\/script>/g;

function broken(file) {
  const out = [];
  for (const m of fs.readFileSync(file, "utf8").matchAll(SCRIPT)) {
    try {
      new Function(m[1]);
    } catch (e) {
      out.push(String(e).slice(0, 80));
    }
  }
  return out;
}

function pages(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "pagefind") pages(p, out);
    } else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

let worse = 0;
for (const f of pages(J)) {
  const rel = path.relative(J, f);
  const z = path.join(Z, rel);
  if (!fs.existsSync(z)) continue;
  const a = broken(f);
  const b = broken(z);
  if (b.length > a.length) {
    worse++;
    console.log(`${rel}: ${b.find((x) => !a.includes(x)) || b[0]}`);
  }
}
console.log(`${worse} pages with an inline script that Jekyll's build parses and Zola's does not`);
process.exit(worse ? 1 : 0);
