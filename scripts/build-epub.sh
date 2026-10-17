#!/usr/bin/env bash
# build-epub.sh — convert blog markdown (_d/ + _posts/) into a single EPUB.
#
# Output: dist/idvork-collected.epub
#
# Design notes:
#   - Additive. Touches no Jekyll build path. Safe to delete dist/ at any time.
#   - Chronological order, oldest-first, so the reader gets the arc of thought.
#   - Strips Jekyll Liquid tags ({% ... %} and {{ ... }}) before handing markdown
#     to pandoc — pandoc doesn't speak Liquid, and raw tags render as noise.
#   - Honors `inprogress: true` as "draft-ish but still on the site", matching
#     how Jekyll treats these files. We include them. (True hide flag would be
#     `published: false`, which the blog doesn't use.)
#   - Derives a per-post date from:
#       1. `date:` frontmatter, if present
#       2. filename leading YYYY-M[M]-D[D]- (Jekyll _posts convention)
#       3. fallback: zero-date, sorts to the top
#
# Requires: pandoc, python3 (stdlib only), bash.

set -euo pipefail

# --- preflight --------------------------------------------------------------
# Fail fast with a helpful hint if required tools are missing, rather than
# erroring out mid-pipeline with a cryptic "command not found".
missing=()
for tool in pandoc python3; do
    if ! command -v "${tool}" >/dev/null 2>&1; then
        missing+=("${tool}")
    fi
done
if [ "${#missing[@]}" -gt 0 ]; then
    echo "error: missing required tool(s): ${missing[*]}" >&2
    echo "       install with: apt install ${missing[*]}   (or 'brew install ${missing[*]}' on macOS)" >&2
    exit 127
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="${ROOT}/dist"
BUILD="${DIST}/epub-build"
OUT="${DIST}/idvork-collected.epub"

mkdir -p "${BUILD}"
rm -f "${BUILD}"/*.md 2>/dev/null || true

# Deterministic build metadata. We freeze the EPUB's modification timestamp
# (pandoc honors SOURCE_DATE_EPOCH) and derive a stable UUID from the staged
# content so re-running `make epub` on the same inputs produces a
# byte-identical artifact — handy for cache keys, attachment dedup, etc.
# Callers can still override either by exporting them beforehand.
if [ -z "${SOURCE_DATE_EPOCH:-}" ]; then
    # Prefer the newest source mtime; fall back to a fixed epoch if the
    # find pipeline fails for any reason.
    SOURCE_DATE_EPOCH="$(
        find "${ROOT}/_d" "${ROOT}/_posts" -maxdepth 1 -name '*.md' -printf '%T@\n' 2>/dev/null \
            | sort -n \
            | tail -1 \
            | cut -d. -f1
    )"
    : "${SOURCE_DATE_EPOCH:=0}"
    export SOURCE_DATE_EPOCH
fi
TODAY="$(date -u -d "@${SOURCE_DATE_EPOCH}" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)"

# Stage 1 — normalize every source file: strip Liquid, extract a sort date,
# rewrite frontmatter with a pandoc-friendly chapter title, emit into BUILD.
python3 - "${ROOT}" "${BUILD}" <<'PYEOF'
import os, re, sys, pathlib, datetime

root = pathlib.Path(sys.argv[1])
build = pathlib.Path(sys.argv[2])

SOURCES = [root / "_d", root / "_posts"]

# Files Jekyll excludes via _config.yml. Mirror the list here so the EPUB
# doesn't ship files that the site itself hides. Keep in sync with the
# `exclude:` block in _config.yml (specifically its `_d/*.md` entries).
JEKYLL_EXCLUDES = {
    "_d/positive-mitzvahs.md",
    "_d/negative-mitzvahs.md",
}

# Liquid tag/expression stripper.
#   {% ... %}   — tag: remove entirely (may span lines for `raw`/`highlight` blocks)
#   {{ ... }}   — expression: remove entirely
# Also strips {% raw %}..{% endraw %} blocks and {% highlight %}..{% endhighlight %}
# block wrappers but keeps their content.
LIQUID_BLOCK_RE = re.compile(
    r"{%\s*(raw|highlight[^%]*)\s*%}(.*?){%\s*end(?:raw|highlight)\s*%}",
    re.DOTALL,
)
LIQUID_TAG_RE = re.compile(r"{%[^%]*%}", re.DOTALL)
LIQUID_EXPR_RE = re.compile(r"{{[^}]*}}", re.DOTALL)
# Rewrite site-absolute image refs (/images/foo.png, /d2/bar.svg, etc.) into
# filesystem-absolute paths rooted at the blog repo, so pandoc can embed them.
# Matches markdown ![alt](/path) and raw <img src="/path">.
SITE_IMG_MD_RE = re.compile(r"(!\[[^\]]*\]\()(/)([^)\s]+)(\))")
SITE_IMG_HTML_RE = re.compile(r'(<img\s+[^>]*src=)(["\'])/([^"\']+)(["\'])', re.IGNORECASE)
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\s*\n", re.DOTALL)
FILENAME_DATE_RE = re.compile(r"^(\d{4})-(\d{1,2})-(\d{1,2})-")
DATE_FIELD_RE = re.compile(r"^date:\s*['\"]?(\d{4}-\d{1,2}-\d{1,2})", re.MULTILINE)
TITLE_FIELD_RE = re.compile(r"^title:\s*['\"]?(.+?)['\"]?\s*$", re.MULTILINE)

def parse_date(s):
    try:
        y, m, d = s.split("-")
        return datetime.date(int(y), int(m), int(d))
    except Exception:
        return None

def strip_liquid(text):
    # First: preserve contents of raw/highlight blocks by keeping their inner text.
    def _unwrap(m):
        return m.group(2)
    text = LIQUID_BLOCK_RE.sub(_unwrap, text)
    text = LIQUID_TAG_RE.sub("", text)
    text = LIQUID_EXPR_RE.sub("", text)
    return text

def rewrite_site_images(text, repo_root):
    # ![alt](/images/foo.png) -> ![alt](<repo_root>/images/foo.png)
    def _md(m):
        rel = m.group(3)
        return f"{m.group(1)}{repo_root}/{rel}{m.group(4)}"
    # <img src="/images/foo.png"> -> <img src="<repo_root>/images/foo.png">
    def _html(m):
        rel = m.group(3)
        return f'{m.group(1)}{m.group(2)}{repo_root}/{rel}{m.group(4)}'
    text = SITE_IMG_MD_RE.sub(_md, text)
    text = SITE_IMG_HTML_RE.sub(_html, text)
    return text

failed = []
entries = []

for src_dir in SOURCES:
    if not src_dir.is_dir():
        continue
    for md in sorted(src_dir.glob("*.md")):
        rel = md.relative_to(root).as_posix()
        if rel in JEKYLL_EXCLUDES:
            continue
        try:
            raw = md.read_text(encoding="utf-8")
        except Exception as e:
            failed.append((str(md), f"read: {e}"))
            continue

        # Extract frontmatter
        fm_match = FRONTMATTER_RE.match(raw)
        if fm_match:
            fm = fm_match.group(1)
            body = raw[fm_match.end():]
        else:
            fm = ""
            body = raw

        # Chapter title
        t = TITLE_FIELD_RE.search(fm) if fm else None
        if t:
            title = t.group(1).strip()
        else:
            title = md.stem
        # Remove surrounding quotes left by naive regex if any
        title = title.strip().strip('"').strip("'")

        # Date for sort
        sort_date = None
        d_field = DATE_FIELD_RE.search(fm) if fm else None
        if d_field:
            sort_date = parse_date(d_field.group(1))
        if sort_date is None:
            fn_match = FILENAME_DATE_RE.match(md.name)
            if fn_match:
                try:
                    sort_date = datetime.date(
                        int(fn_match.group(1)),
                        int(fn_match.group(2)),
                        int(fn_match.group(3)),
                    )
                except ValueError:
                    sort_date = None
        if sort_date is None:
            sort_date = datetime.date(1900, 1, 1)

        # Strip Liquid from body, then rewrite site-absolute image paths.
        clean_body = strip_liquid(body)
        clean_body = rewrite_site_images(clean_body, str(root))

        # Build a minimal pandoc-friendly frontmatter: just a title.
        # This lets pandoc pick up `title:` as the chapter heading.
        out_fm = f"---\ntitle: {title!r}\n---\n\n"

        # Prefix the body with an H1 so pandoc's `--toc-depth=2` finds chapter
        # boundaries reliably even when the source had no top-level H1.
        header = f"# {title}\n\n"

        entries.append((sort_date, md.name, out_fm + header + clean_body))

# Sort oldest-first and write sequential filenames so pandoc preserves order.
entries.sort(key=lambda x: (x[0], x[1]))
for i, (sort_date, name, content) in enumerate(entries):
    out = build / f"{i:04d}__{sort_date.isoformat()}__{name}"
    out.write_text(content, encoding="utf-8")

# Status line
print(f"staged {len(entries)} chapters, {len(failed)} failures")
if failed:
    (build.parent / "epub-build-failures.txt").write_text(
        "\n".join(f"{p}\t{why}" for p, why in failed),
        encoding="utf-8",
    )
PYEOF

CHAPTER_COUNT=$(find "${BUILD}" -maxdepth 1 -name '*.md' | wc -l | tr -d ' ')
echo "==> ${CHAPTER_COUNT} chapters staged in ${BUILD}"

if [ "${CHAPTER_COUNT}" = "0" ]; then
    echo "!! no chapters staged — aborting" >&2
    exit 1
fi

# Stage 2 — single pandoc invocation over all staged chapters.
echo "==> running pandoc ..."
START_TS=$(date +%s)

# Use find+sort for a stable, space-safe list.
mapfile -t CHAPTERS < <(find "${BUILD}" -maxdepth 1 -name '*.md' | sort)

# Derive a stable UUID from the content hash of the staged chapters, so
# identical inputs yield an identical EPUB. Pandoc would otherwise generate
# a fresh random UUID per run. Callers can override via EPUB_IDENTIFIER.
if [ -z "${EPUB_IDENTIFIER:-}" ]; then
    CONTENT_HASH=$(cat "${CHAPTERS[@]}" | sha256sum | cut -c1-32)
    # Format as a UUID-shaped string. Not RFC-4122 v4/v5 strictly, but
    # readers just want a stable unique identifier.
    EPUB_IDENTIFIER="urn:uuid:${CONTENT_HASH:0:8}-${CONTENT_HASH:8:4}-${CONTENT_HASH:12:4}-${CONTENT_HASH:16:4}-${CONTENT_HASH:20:12}"
fi

pandoc \
    --from=markdown \
    --to=epub3 \
    --toc \
    --toc-depth=2 \
    --metadata=title:"idvork.in — collected" \
    --metadata=creator:"Igor Dvorkin" \
    --metadata=author:"Igor Dvorkin" \
    --metadata=language:en \
    --metadata=date:"${TODAY}" \
    --metadata=identifier:"${EPUB_IDENTIFIER}" \
    --output="${OUT}" \
    "${CHAPTERS[@]}"

END_TS=$(date +%s)
echo "==> wrote ${OUT}  (pandoc took $((END_TS - START_TS))s)"
SIZE=$(stat -c '%s' "${OUT}" 2>/dev/null || stat -f '%z' "${OUT}" 2>/dev/null || echo "?")
echo "    size: ${SIZE} bytes"
