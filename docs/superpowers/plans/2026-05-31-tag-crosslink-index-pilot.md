# Tag & Cross-Link Index — Pilot (P0+P1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic Python foundations (corpus extraction, link-graph access, sidecar schema) and run an LLM-tagging pilot on 20 posts that produces a canonical tag vocabulary for Igor to review — before scaling to all 341 posts.

**Architecture:** `back-links.json`'s `url_info` already provides per-post title, description, markdown path, and the full incoming/outgoing link graph. P0 adds three small, stdlib-only modules (`topics_extract`, `topics_graph`, `topics_sidecar`) that mirror the flat root-script + colocated-test convention of `build_back_links.py`. P1 is a `Workflow` that fans out one agent per pilot post to emit a structured topic card (summary, ~10 proposed tags, entities), then a consolidation pass that merges raw proposals + the existing 68 frontmatter tags into a canonical vocabulary. The pilot ends at a human review gate.

**Tech Stack:** Python 3 (stdlib only for the pilot — `re`, `json`, `pathlib`, `dataclasses`), `uv` for execution, `pytest` for tests, `typer` for the CLI, the `Workflow` tool for the agent fan-out. No `fastembed`/`sqlite-vec` in the pilot — embeddings are deferred to the P2 plan.

**Spec:** `docs/superpowers/specs/2026-05-31-tag-and-crosslink-index-design.md`

---

## Scope

This plan covers **P0 (foundations)** and **P1 (pilot)** only. P2 (embeddings at scale + clustering + gap detection + fusion + refresh script) gets its **own plan** after the pilot's vocabulary is approved — because the spec stages a human-eyeball gate at the end of P1 whose outcome (the canonical vocab, cluster thresholds) directly shapes P2.

## File Structure

Flat root scripts with a `topics_` prefix, matching `build_back_links.py` (the repo's established convention — ~15 root `.py` scripts, colocated `test_*.py`). Running `uv run ./build_topics.py` puts the repo root on `sys.path`, so `from topics_extract import ...` resolves with zero packaging.

| File                                                                         | Responsibility                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `topics_extract.py`                                                          | Clean a post's markdown into plain prose for tagging/embedding.          |
| `topics_graph.py`                                                            | Load `back-links.json` → link graph; answer "is A already linked to B?". |
| `topics_sidecar.py`                                                          | Dataclasses + JSON round-trip for `topics.json`.                         |
| `build_topics.py`                                                            | uv entry + typer CLI: `extract`, `pilot-sample`.                         |
| `test_topics_extract.py` / `test_topics_graph.py` / `test_topics_sidecar.py` | Colocated pytest tests.                                                  |

Pilot intermediates live in gitignored `tmp/topics/` (per the repo's scratch-file convention): `tmp/topics/pilot_urls.json`, `tmp/topics/cards/*.json`, `tmp/topics/vocab_pilot.json`.

Run tests with: `uv run --with pytest pytest test_topics_extract.py -v` (from repo root).

---

## Task 1: `topics_extract.py` — clean markdown into prose

**Files:**

- Create: `topics_extract.py`
- Test: `test_topics_extract.py`

- [ ] **Step 1: Write the failing test**

```python
# test_topics_extract.py
from topics_extract import clean_markdown_text


def test_strips_frontmatter_includes_links_and_comments():
    md = (
        "---\n"
        "title: X\n"
        "tags:\n  - a\n"
        "---\n\n"
        "Your daughter isn't breaking.\n\n"
        "{% include amazon.html asin=\"123\" %}\n\n"
        "<!-- a comment -->\n"
        "These are my notes from [Untangled](/untangled), filtered.\n"
    )
    out = clean_markdown_text(md)
    assert "title: X" not in out
    assert "{%" not in out
    assert "<!--" not in out
    assert "/untangled" not in out          # URL dropped
    assert "Untangled" in out               # link text kept
    assert "Your daughter isn't breaking." in out
    assert "These are my notes from Untangled, filtered." in out


def test_strips_vim_toc_block():
    md = (
        "Intro para.\n\n"
        "<!-- vim-markdown-toc-start -->\n"
        "- [Heading](#heading)\n"
        "<!-- vim-markdown-toc-end -->\n\n"
        "Body para.\n"
    )
    out = clean_markdown_text(md)
    assert "#heading" not in out
    assert "Intro para." in out
    assert "Body para." in out
```

- [ ] **Step 2: Run test to verify it fails**

Run: `uv run --with pytest pytest test_topics_extract.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'topics_extract'`

- [ ] **Step 3: Write minimal implementation**

```python
# topics_extract.py
"""Clean a blog post's markdown source into plain prose for tagging/embedding."""
import re

_FRONTMATTER = re.compile(r"\A---\n.*?\n---\n", re.S)
_VIM_TOC = re.compile(
    r"<!--\s*vim-markdown-toc-start\s*-->.*?<!--\s*vim-markdown-toc-end\s*-->",
    re.S,
)
_HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)
_JEKYLL_TAG = re.compile(r"\{%.*?%\}", re.S)
_JEKYLL_VAR = re.compile(r"\{\{.*?\}\}", re.S)
_MD_LINK = re.compile(r"\[([^\]]+)\]\([^)]*\)")        # [text](url) -> text
_MD_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)")          # ![alt](url) -> ""
_HTML_TAG = re.compile(r"<[^>]+>")
_MULTISPACE = re.compile(r"[ \t]{2,}")
_MULTINEWLINE = re.compile(r"\n{3,}")


def clean_markdown_text(md: str) -> str:
    md = _FRONTMATTER.sub("", md)
    md = _VIM_TOC.sub("", md)          # before generic comment strip
    md = _HTML_COMMENT.sub("", md)
    md = _MD_IMAGE.sub("", md)
    md = _JEKYLL_TAG.sub("", md)
    md = _JEKYLL_VAR.sub("", md)
    md = _MD_LINK.sub(r"\1", md)
    md = _HTML_TAG.sub("", md)
    md = _MULTISPACE.sub(" ", md)
    md = _MULTINEWLINE.sub("\n\n", md)
    # collapse stray blank lines left by removed includes/comments
    lines = [ln.rstrip() for ln in md.splitlines()]
    md = "\n".join(lines)
    md = _MULTINEWLINE.sub("\n\n", md)
    return md.strip()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `uv run --with pytest pytest test_topics_extract.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add topics_extract.py test_topics_extract.py
SKIP=anchor-checker git commit -m "feat(topics): markdown-to-prose extractor for tag pilot"
```

(Skip `anchor-checker` — it fails on 6 pre-existing permalink-rename false positives in unrelated posts; a Python file cannot affect markdown anchors. Confirm the `[branch sha]` line printed before continuing.)

---

## Task 2: `topics_graph.py` — existing-link lookup from back-links.json

**Files:**

- Create: `topics_graph.py`
- Test: `test_topics_graph.py`

- [ ] **Step 1: Write the failing test**

```python
# test_topics_graph.py
import json
from pathlib import Path
from topics_graph import LinkGraph, load_graph


def test_has_link_is_bidirectional():
    url_info = {
        "/a": {"outgoing_links": ["/b"], "incoming_links": []},
        "/b": {"outgoing_links": [], "incoming_links": ["/a"]},
        "/c": {"outgoing_links": [], "incoming_links": []},
    }
    g = LinkGraph(url_info)
    assert g.has_link("/a", "/b") is True   # a -> b
    assert g.has_link("/b", "/a") is True   # reverse counts as linked
    assert g.has_link("/a", "/c") is False
    assert g.urls() == {"/a", "/b", "/c"}


def test_load_graph_reads_url_info(tmp_path: Path):
    p = tmp_path / "back-links.json"
    p.write_text(json.dumps({"url_info": {
        "/x": {"outgoing_links": ["/y"], "incoming_links": []},
        "/y": {"outgoing_links": [], "incoming_links": ["/x"]},
    }}))
    g = load_graph(p)
    assert g.has_link("/x", "/y") is True
```

- [ ] **Step 2: Run test to verify it fails**

Run: `uv run --with pytest pytest test_topics_graph.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'topics_graph'`

- [ ] **Step 3: Write minimal implementation**

```python
# topics_graph.py
"""Read back-links.json's url_info into a link graph for gap detection."""
import json
from pathlib import Path


class LinkGraph:
    def __init__(self, url_info: dict):
        self._out = {
            u: set(d.get("outgoing_links") or []) for u, d in url_info.items()
        }

    def urls(self) -> set:
        return set(self._out)

    def has_link(self, a: str, b: str) -> bool:
        """True if a links to b OR b links to a (a link either way = 'connected')."""
        return b in self._out.get(a, set()) or a in self._out.get(b, set())


def load_graph(backlinks_path) -> LinkGraph:
    data = json.loads(Path(backlinks_path).read_text(encoding="utf-8"))
    return LinkGraph(data["url_info"])
```

- [ ] **Step 4: Run test to verify it passes**

Run: `uv run --with pytest pytest test_topics_graph.py -v`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add topics_graph.py test_topics_graph.py
SKIP=anchor-checker git commit -m "feat(topics): link-graph lookup from back-links.json"
```

---

## Task 3: `topics_sidecar.py` — topics.json schema round-trip

**Files:**

- Create: `topics_sidecar.py`
- Test: `test_topics_sidecar.py`

- [ ] **Step 1: Write the failing test**

```python
# test_topics_sidecar.py
from topics_sidecar import PostEntry, TopicsIndex


def test_round_trips_through_json():
    idx = TopicsIndex(
        generated_at="2026-05-31T00:00:00Z",
        embedder=None,
        vocab=[],
        posts={
            "/untangled": PostEntry(
                title="Untangled",
                summary="Notes on raising a teenage girl.",
                tags=["parenting", "book-notes"],
                entities=["Lisa Damour"],
                content_hash="sha256:abc",
            )
        },
    )
    blob = idx.to_json()
    back = TopicsIndex.from_json(blob)
    assert back.posts["/untangled"].tags == ["parenting", "book-notes"]
    assert back.posts["/untangled"].entities == ["Lisa Damour"]
    assert back.generated_at == "2026-05-31T00:00:00Z"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `uv run --with pytest pytest test_topics_sidecar.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'topics_sidecar'`

- [ ] **Step 3: Write minimal implementation**

```python
# topics_sidecar.py
"""Schema + JSON (de)serialization for the regenerable topics.json sidecar."""
import json
from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class PostEntry:
    title: str
    summary: str = ""
    tags: list = field(default_factory=list)
    entities: list = field(default_factory=list)
    related: list = field(default_factory=list)   # [{"url":..., "score":...}]
    content_hash: str = ""


@dataclass
class TopicsIndex:
    generated_at: str
    embedder: Optional[dict] = None
    vocab: list = field(default_factory=list)      # [{"tag","aliases","count"}]
    clusters: list = field(default_factory=list)
    posts: dict = field(default_factory=dict)       # url -> PostEntry
    crosslink_gaps: list = field(default_factory=list)

    def to_json(self, indent: int = 2) -> str:
        payload = asdict(self)
        payload["posts"] = {u: asdict(p) for u, p in self.posts.items()}
        return json.dumps(payload, indent=indent, ensure_ascii=False)

    @classmethod
    def from_json(cls, blob: str) -> "TopicsIndex":
        raw = json.loads(blob)
        posts = {u: PostEntry(**p) for u, p in raw.pop("posts", {}).items()}
        return cls(posts=posts, **raw)
```

Note: `asdict` recurses into the `PostEntry` values already, so the explicit `posts` re-map in `to_json` is belt-and-suspenders for clarity; keep it.

- [ ] **Step 4: Run test to verify it passes**

Run: `uv run --with pytest pytest test_topics_sidecar.py -v`
Expected: PASS (1 passed)

- [ ] **Step 5: Commit**

```bash
git add topics_sidecar.py test_topics_sidecar.py
SKIP=anchor-checker git commit -m "feat(topics): topics.json sidecar schema"
```

---

## Task 4: `build_topics.py` — CLI: `extract` + `pilot-sample`

**Files:**

- Create: `build_topics.py`
- Test: manual smoke (no unit test — it's thin I/O glue over tested modules)

- [ ] **Step 1: Write the CLI**

```python
#!uv run
# /// script
# requires-python = ">=3.9"
# dependencies = ["typer", "rich"]
# ///
"""Build the tag/cross-link topics index. Pilot scope: extract + sample."""
import json
from pathlib import Path
import typer
from rich.console import Console
from topics_graph import load_graph
from topics_extract import clean_markdown_text

app = typer.Typer(add_completion=False)
console = Console()
ROOT = Path(__file__).resolve().parent
BACKLINKS = ROOT / "back-links.json"


def _url_info() -> dict:
    return json.loads(BACKLINKS.read_text(encoding="utf-8"))["url_info"]


@app.command()
def extract(out: str = "tmp/topics/corpus.json"):
    """Clean every post's markdown into prose; write {url: text}."""
    ui = _url_info()
    corpus = {}
    for url, info in ui.items():
        mp = info.get("markdown_path")
        if not mp:
            continue
        p = ROOT / mp
        if not p.exists():
            continue
        corpus[url] = clean_markdown_text(p.read_text(encoding="utf-8"))
    outp = ROOT / out
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text(json.dumps(corpus, ensure_ascii=False, indent=0), encoding="utf-8")
    console.print(f"[green]extracted {len(corpus)} posts -> {out}[/green]")


@app.command("pilot-sample")
def pilot_sample(n: int = 20, out: str = "tmp/topics/pilot_urls.json"):
    """Pick N thematically-diverse posts: stratify tagged vs untagged, vary size."""
    ui = _url_info()
    items = [
        (url, info) for url, info in ui.items() if info.get("markdown_path")
    ]
    # deterministic: sort by (has_no_tags, -doc_size, url) then stride-sample
    items.sort(
        key=lambda kv: (
            bool(kv[1].get("tags")),          # untagged first (need them most)
            -int(kv[1].get("doc_size") or 0), # bigger posts first
            kv[0],
        )
    )
    step = max(1, len(items) // n)
    picked = [items[i][0] for i in range(0, len(items), step)][:n]
    outp = ROOT / out
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text(json.dumps(picked, indent=2), encoding="utf-8")
    console.print(f"[green]sampled {len(picked)} pilot posts -> {out}[/green]")


if __name__ == "__main__":
    app()
```

- [ ] **Step 2: Smoke-test `extract`**

Run: `uv run ./build_topics.py extract`
Expected: `extracted 3xx posts -> tmp/topics/corpus.json`. Verify: `python3 -c "import json; d=json.load(open('tmp/topics/corpus.json')); print(len(d)); print(d['/untangled'][:120])"` prints a count near 341 and clean prose (no `---`, no `{%`).

- [ ] **Step 3: Smoke-test `pilot-sample`**

Run: `uv run ./build_topics.py pilot-sample --n 20`
Expected: `sampled 20 pilot posts -> tmp/topics/pilot_urls.json`. Open it; confirm ~20 permalinks spanning different themes (some untagged, varied sizes).

- [ ] **Step 4: Commit**

```bash
git add build_topics.py
SKIP=anchor-checker git commit -m "feat(topics): CLI extract + pilot-sample commands"
```

---

## Task 5: P1 pilot tagging `Workflow`

Not TDD — this is an LLM fan-out. Author and run it with the `Workflow` tool. The deterministic inputs (`tmp/topics/pilot_urls.json`, `tmp/topics/corpus.json`) come from Task 4.

- [ ] **Step 1: Author the workflow**

Pass `args = { urls: <contents of tmp/topics/pilot_urls.json> }`. Script outline:

```javascript
export const meta = {
  name: "tag-pilot",
  description: "Tag 20 pilot posts and consolidate a canonical vocabulary",
  phases: [{ title: "Tag" }, { title: "Consolidate" }],
};

const CARD = {
  type: "object",
  required: ["url", "summary", "tags", "entities"],
  properties: {
    url: { type: "string" },
    summary: {
      type: "string",
      description: "1-2 sentences, what the post is about",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      minItems: 6,
      maxItems: 12,
      description: "lowercase-hyphenated topic tags",
    },
    entities: {
      type: "array",
      items: { type: "string" },
      description: "named books, people, tools, concepts",
    },
  },
};

phase("Tag");
const cards = await parallel(
  args.urls.map(
    url => () =>
      agent(
        `Read the blog post at markdown for permalink ${url} (find it under _d/, _td/, or _posts/ via its permalink frontmatter; the cleaned prose is in tmp/topics/corpus.json under key "${url}"). ` +
          `Return a topic card: a 1-2 sentence summary, 6-12 lowercase-hyphenated topic tags, and named entities (books/people/tools/concepts).`,
        { label: `tag:${url}`, phase: "Tag", schema: CARD }
      )
  )
).then(rs => rs.filter(Boolean));

phase("Consolidate");
const EXISTING = `existing frontmatter tags (with counts): how-igor-ticks(45), emotional-intelligence(43), book-notes(33), ai(26), tools(10), manager(9), health(8), strategy(7), productivity(6), ... (full set passed inline)`;
const vocab = await agent(
  `Here are ${cards.length} topic cards (JSON): ${JSON.stringify(cards)}. ` +
    `And the existing frontmatter tag vocabulary: ${EXISTING}. ` +
    `Consolidate all proposed tags + existing tags into a clean CANONICAL vocabulary of ~30-50 lowercase-hyphenated tags. ` +
    `Merge synonyms/casing (e.g. "emotional intelligence"/"emotion"/"eq" -> one canonical tag). ` +
    `Return {vocab:[{tag, aliases:[...], example_urls:[...]}], reassigned:{url:[canonical-tags]}}.`,
  { phase: "Consolidate", schema: VOCAB_SCHEMA } // define VOCAB_SCHEMA inline
);
return { cards, vocab };
```

- [ ] **Step 2: Run it and persist outputs**

Run the `Workflow`. Save its return to `tmp/topics/vocab_pilot.json` and the per-post cards to `tmp/topics/cards/`.

- [ ] **Step 3: Sanity-check output**

Confirm: ~20 cards present, vocab has 30-50 tags, every pilot url appears in `reassigned`, no tag is obviously duplicated (e.g. both `emotion` and `emotional-intelligence` surviving).

---

## Task 6: Pilot review gate (STOP)

- [ ] **Step 1: Present to Igor**

Show: (a) the canonical vocabulary (~30-50 tags, with the synonym merges made explicit), (b) 3-4 sample posts with their assigned canonical tags, (c) any tags that were hard to place. Ask: does the vocabulary match how he thinks about his blog's topics? Adjust per his feedback (re-run consolidation with constraints if needed).

- [ ] **Step 2: Gate**

Do NOT proceed to P2 (scale to 341 + embeddings + fusion) until Igor approves the vocabulary. On approval, write the P2 plan (`docs/superpowers/plans/2026-05-31-tag-crosslink-index-scale.md`).

---

## Self-Review

**Spec coverage (pilot scope):** corpus extraction ✓ (Task 1/4), link-graph access ✓ (Task 2), sidecar schema ✓ (Task 3), LLM topic cards ✓ (Task 5), canonical-vocab consolidation ✓ (Task 5), human eyeball gate ✓ (Task 6). Embeddings / clustering / gap detection / fusion / refresh script — **intentionally deferred to the P2 plan** (out of pilot scope; gated on vocab approval).

**Placeholder scan:** `VOCAB_SCHEMA` in Task 5 is named but not spelled out — define it inline at authoring time mirroring `CARD` (properties: `vocab` array of `{tag, aliases, example_urls}`, `reassigned` object of url→tag-array). The `EXISTING` string passes the full 68-tag set (from `git grep` aggregation) inline, not the truncated sample shown.

**Type consistency:** `PostEntry`/`TopicsIndex` fields (Task 3) match the spec's `topics.json` sketch. `LinkGraph.has_link` (Task 2) is the bidirectional check the P2 gap detector will call. `clean_markdown_text` (Task 1) is the single text path used by `build_topics.py extract` (Task 4).
