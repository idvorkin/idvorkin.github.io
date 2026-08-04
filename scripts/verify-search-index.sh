#!/usr/bin/env bash
#
# Verifies the built site before it is deployed.
#
# The check that matters: the family journal (_ig66) must not be searchable.
# Under Algolia this was a query-time filter, so a client-side bug could leak it.
# Pagefind only indexes pages carrying `data-pagefind-body`, so the guarantee is
# now structural — and this script asserts the structure actually holds, because
# a Liquid typo in _includes/pagefind-attrs.html would silently start indexing
# every family journal entry with no other visible symptom.
#
# Run against _site/ after `jekyll build` + `pagefind`.

set -euo pipefail

SITE="${1:-_site}"
fail=0

err() {
    echo "✗ $*" >&2
    fail=1
}
ok() { echo "✓ $*"; }

if [ ! -d "$SITE" ]; then
    echo "✗ $SITE not found. Run 'bundle exec jekyll build' first." >&2
    exit 1
fi

# --- 1. Pagefind index exists ------------------------------------------------
if [ ! -d "$SITE/pagefind" ]; then
    err "$SITE/pagefind/ missing — the Pagefind build step did not run"
else
    fragments=$(find "$SITE/pagefind/fragment" -type f 2>/dev/null | wc -l | tr -d ' ')
    if [ "$fragments" -lt 100 ]; then
        err "only $fragments indexed fragments — expected 100+ (index looks truncated)"
    else
        ok "Pagefind index present ($fragments fragments)"
    fi
fi

# --- 2. Family journal must NOT be indexed -----------------------------------
# Every _ig66 page must carry data-pagefind-ignore and must NOT carry
# data-pagefind-body.
if [ -d "$SITE/ig66" ]; then
    leaked=$(grep -rl "data-pagefind-body" "$SITE/ig66" 2>/dev/null | head -5 || true)
    if [ -n "$leaked" ]; then
        err "family journal pages are marked indexable:"
        echo "$leaked" >&2
    else
        ok "family journal (_ig66) is excluded from the index"
    fi

    total_fj=$(find "$SITE/ig66" -name '*.html' | wc -l | tr -d ' ')
    ignored_fj=$(grep -rl "data-pagefind-ignore" "$SITE/ig66" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$total_fj" -gt 0 ] && [ "$ignored_fj" -lt "$total_fj" ]; then
        err "only $ignored_fj/$total_fj family journal pages carry data-pagefind-ignore"
    fi
else
    echo "  (no $SITE/ig66 directory — skipping family journal check)"
fi

# --- 3. Explicitly excluded permalinks ---------------------------------------
excluded_ok=1
for slug in changelog positive-mitzvahs negative-mitzvahs; do
    for candidate in "$SITE/$slug.html" "$SITE/$slug/index.html"; do
        if [ -f "$candidate" ] && grep -q "data-pagefind-body" "$candidate" 2>/dev/null; then
            err "/$slug is marked indexable but is in site.search.exclude_permalinks"
            excluded_ok=0
        fi
    done
done
# if-form, not `[ ... ] && ok`: under set -e a false test in an AND-list
# aborts the script before checks 4-6 run.
if [ "$excluded_ok" -eq 1 ]; then
    ok "explicitly excluded permalinks are not indexable"
fi

# --- 4. Real content IS indexed (guards against excluding everything) --------
indexable=$(grep -rl "data-pagefind-body" "$SITE" --include='*.html' 2>/dev/null | wc -l | tr -d ' ')
if [ "$indexable" -lt 100 ]; then
    err "only $indexable pages marked indexable — expected 100+ (over-exclusion?)"
else
    ok "$indexable pages marked indexable"
fi

# --- 5. Title index for typo tolerance ---------------------------------------
titles="$SITE/search-titles.json"
if [ ! -f "$titles" ]; then
    err "$titles missing — typo-tolerant title search will not work"
else
    if ! python3 -c "
import json,sys
d=json.load(open('$titles'))
assert isinstance(d,list), 'not a list'
assert len(d)>200, f'only {len(d)} titles'
assert all('t' in x and 'u' in x for x in d), 'malformed entry'
bad=[x for x in d if '/ig66/' in x['u']]
assert not bad, f'family journal in title index: {bad[:3]}'
print(f'  {len(d)} titles')
" 2>&1; then
        err "title index failed validation"
    else
        ok "title index valid"
    fi
fi

# --- 6. Custom domain survived the build ------------------------------------
if [ -f CNAME ] && [ ! -f "$SITE/CNAME" ]; then
    err "CNAME missing from $SITE — the custom domain would break on deploy"
elif [ -f "$SITE/CNAME" ]; then
    ok "CNAME present ($(cat "$SITE/CNAME"))"
fi

echo
if [ "$fail" -ne 0 ]; then
    echo "✗ search index verification FAILED" >&2
    exit 1
fi
echo "✅ search index verification passed"
