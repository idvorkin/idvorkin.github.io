#!uv run
# /// script
# requires-python = ">=3.9"
# dependencies = ["typer", "rich"]
# ///
"""Build the tag/cross-link topics index. Pilot scope: extract + sample."""

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import typer
from rich.console import Console

from topics_extract import clean_markdown_text
from topics_sidecar import PostEntry, TopicsIndex

app = typer.Typer(add_completion=False)
console = Console()
ROOT = Path(__file__).resolve().parent
BACKLINKS = ROOT / "back-links.json"

# Only treat real post collections as the corpus — keeps docs/, scratch, and
# other markdown that happens to be in url_info out of the index.
POST_DIRS = ("_d/", "_td/", "_posts/")


def _posts() -> dict:
    ui = json.loads(BACKLINKS.read_text(encoding="utf-8"))["url_info"]
    return {
        u: i
        for u, i in ui.items()
        if (i.get("markdown_path") or "").startswith(POST_DIRS)
    }


@app.command()
def extract(out: str = "tmp/topics/corpus.json"):
    """Clean every post's markdown into prose; write {url: text}."""
    corpus = {}
    for url, info in _posts().items():
        p = ROOT / info["markdown_path"]
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
    items = list(_posts().items())
    # deterministic: sort by (has_tags, -doc_size, url) then stride-sample
    items.sort(
        key=lambda kv: (
            bool(kv[1].get("tags")),  # untagged first (need them most)
            -int(kv[1].get("doc_size") or 0),  # bigger posts first
            kv[0],
        )
    )
    step = max(1, len(items) // n)
    picked = [items[i][0] for i in range(0, len(items), step)][:n]
    outp = ROOT / out
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text(json.dumps(picked, indent=2), encoding="utf-8")
    console.print(f"[green]sampled {len(picked)} pilot posts -> {out}[/green]")


@app.command("build-sidecar")
def build_sidecar(
    cards: str = "tmp/topics/all_cards.json",
    out: str = "topics.json",
):
    """Join topic cards + titles + content hashes into the topics.json sidecar.

    Deep-dive stage: per-post summary/tags/entities, no canonical vocab yet
    (consolidation is a later step). Tags here are the raw proposed tags.
    """
    cards_data = json.loads((ROOT / cards).read_text(encoding="utf-8"))
    ui = json.loads(BACKLINKS.read_text(encoding="utf-8"))["url_info"]
    corpus = json.loads((ROOT / "tmp/topics/corpus.json").read_text(encoding="utf-8"))
    posts = {}
    for c in cards_data:
        url = c["url"]
        text = corpus.get(url, "")
        posts[url] = PostEntry(
            title=(ui.get(url) or {}).get("title", url),
            summary=c.get("summary", ""),
            tags=c.get("tags", []),
            entities=c.get("entities", []),
            content_hash="sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest(),
        )
    idx = TopicsIndex(
        generated_at=datetime.now(timezone.utc).isoformat(),
        embedder=None,
        posts=posts,
    )
    (ROOT / out).write_text(idx.to_json(), encoding="utf-8")
    console.print(f"[green]wrote {len(posts)} posts -> {out}[/green]")


if __name__ == "__main__":
    app()
