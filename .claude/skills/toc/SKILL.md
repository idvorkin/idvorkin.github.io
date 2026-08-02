---
name: toc
description: Regenerate, validate, or compute kramdown slugs for markdown TOCs. Same rules as idvorkin/markdown-toc.nvim (`:Mtoc update`) so this tool and the nvim plugin produce identical output. Use when asked to update a TOC, fix a broken deep link, check for duplicate section headings, or compute an anchor slug for a heading. Works on any markdown file in the blog — not just `_d/changelog.md`.
allowed-tools: Bash, Read, Edit
---

# TOC Regeneration + Validation

Stdlib Python implementation of the `idvorkin/markdown-toc.nvim` plugin's algorithm. The same fence markers and kramdown slugification rules apply, so `toc.py regenerate` and `:Mtoc update` produce byte-identical output against the same input — either one can edit any blog post's TOC.

## When to use

- **User says "update the TOC"** after editing headings in a blog post or the changelog.
- **User reports a broken deep link** like `/ai-relationships#foo` — confirm the anchor via `toc.py slug "Foo"`.
- **A changelog run added new themes** — regenerate `_d/changelog.md`'s TOC rather than hand-editing.
- **Before committing an edit that added/renamed `### headings`** — validate that no two share the same text (which would produce collision-suffixed anchors like `#other-projects-1` that break deep links).

This skill is called by the `changelog` skill's Step 4/Update-TOC phase and is also usable directly on any blog post.

## Commands

```bash
# Regenerate the TOC block between <!-- vim-markdown-toc-start --> and -end -->
.claude/skills/toc/toc.py regenerate _d/ai-relationships.md

# Restrict to specific heading levels (default is 2..3)
.claude/skills/toc/toc.py regenerate _d/changelog.md --min 2 --max 3

# Preview without writing
.claude/skills/toc/toc.py regenerate _d/some-post.md --dry-run

# Validate: fail if any ### heading repeats (duplicate anchors = broken deep links)
.claude/skills/toc/toc.py validate _d/changelog.md
.claude/skills/toc/toc.py validate _d/some-post.md --level 2

# Compute the kramdown slug for a heading — useful when writing deep links by hand
.claude/skills/toc/toc.py slug "A Private Language of One (Cryptophasia)"
# → a-private-language-of-one-cryptophasia
```

### Exit codes

| Code | Meaning                                                                 |
| ---- | ----------------------------------------------------------------------- |
| 0    | No change / validation passed / slug printed                            |
| 1    | TOC was updated (or would be, in dry-run) / validation found duplicates |
| 2    | Error — fence markers missing, file not found, or similar               |

## Slug algorithm (GFM-style, from mtoc)

Ported from `lua/mtoc/toc.lua` (`link_formatters.gfm`). This is **GFM-style**, not kramdown. For the English-heading cases the blog actually uses, kramdown produces the same slugs at render time, so TOC deep links remain valid. Divergence risk is in headings with leading digits/punctuation or underscores — those are rare on this blog.

1. Strip inline `[text](url)` links → `text`. Emphasis markers (`*`, `` ` ``) are NOT special-cased — they get dropped by the char whitelist in step 4. Underscores are **kept**.
2. Lowercase.
3. Strip **leading AND trailing** `_+`.
4. Char whitelist: `[a-z0-9 _-]` plus Latin-Ext, Cyrillic, CJK, Hiragana, Katakana, Hangul. Everything else is removed.
5. Spaces → hyphens.
6. **Duplicate disambiguation:** within one TOC render, track a `seen` dict. The first occurrence of a slug is bare; the second gets `-1`, third `-2`, etc. Matches mtoc's `existing_headings` counter.

**Consecutive hyphens are preserved.** This is how `"AI & Machine"` becomes `#ai--machine` — the `&` is dropped in step 4, leaving two spaces, which become two hyphens in step 5.

Worked examples:

| Heading                                           | Slug                                     |
| ------------------------------------------------- | ---------------------------------------- |
| `AI & Machine Learning`                           | `ai--machine-learning`                   |
| `A Private Language of One (Cryptophasia)`        | `a-private-language-of-one-cryptophasia` |
| `The $230 Week: When Cheap Coding Isn't`          | `the-230-week-when-cheap-coding-isnt`    |
| `partial — through Thu 2026-04-16`                | `partial--through-thu-2026-04-16`        |
| `What do we want our AI friends to do?`           | `what-do-we-want-our-ai-friends-to-do`   |
| `$230 Week` (leading non-alpha kept, `$` dropped) | `230-week`                               |
| `Infrastructure & CI` (1st, 2nd, 3rd in same doc) | `infrastructure--ci`, `-1`, `-2`         |
| `_italic_ middle` (leading/trailing `_` stripped) | `italic_-middle`                         |

**CLI `slug` is single-shot (no duplicate context)** — if you need the actually-rendered slug for a duplicate heading, run `regenerate` and read the TOC.

## Fence markers

The tool looks for exactly these markers and replaces only the lines between them:

```markdown
<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Existing TOC](#existing-toc)
  - [Sub-bullet](#sub-bullet)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->
```

The `prettier-ignore` wrapping is blog-convention (keeps Prettier from re-indenting the TOC) — the tool doesn't require it but it's fine if present.

**Do NOT use the `vim-markdown-toc GFM` / `vim-markdown-toc` markers from the unrelated `mzlogin/vim-markdown-toc` plugin** — this tool looks for `vim-markdown-toc-start` / `-end` specifically, matching `idvorkin/markdown-toc.nvim`.

## Headings inside code fences are ignored

The parser skips everything between matched ` ``` ` or `~~~` fences, so example markdown blocks in SKILL.md, `## Week of 2026-01-25`-style examples in prose, etc., don't pollute the TOC.

## Install-on-other-machines

This skill lives in `blog6/.claude/skills/toc/` — it's project-scoped. If you want it globally available, symlink:

```bash
ln -s ~/gits/blog6/.claude/skills/toc ~/.claude/skills/toc
```

## Tests

```bash
cd .claude/skills/toc && python3 -m unittest test_toc
```

Covers kramdown slug edge cases (em-dash, currency, leading punctuation, link stripping), fenced-code-block skipping, duplicate-heading detection, and regenerate round-trips.
