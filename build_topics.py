#!uv run
# /// script
# requires-python = ">=3.9"
# dependencies = ["typer", "rich", "numpy", "google-genai"]
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


@app.command()
def embed(threshold: float = 0.75, k: int = 8, out: str = "topics.json"):
    """Embed every post with Gemini, compute related posts + cross-link gaps,
    merge into topics.json. Caches by content hash (re-embeds only changed posts)."""
    import os

    import numpy as np

    from topics_embed import (
        GEMINI_DIM,
        GEMINI_MODEL,
        GEMINI_TASK,
        TEXT_CAP,
        content_hash,
        embed_texts,
        gap_candidates,
        knn,
        normalize_rows,
    )
    from topics_graph import load_graph

    key = os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise typer.BadParameter("GOOGLE_API_KEY not set")
    corpus = json.loads((ROOT / "tmp/topics/corpus.json").read_text(encoding="utf-8"))
    cache_path = ROOT / "tmp/topics/embeddings.json"
    cache = (
        json.loads(cache_path.read_text(encoding="utf-8"))
        if cache_path.exists()
        else {}
    )

    capped = {u: t[:TEXT_CAP] for u, t in corpus.items()}
    hashes = {u: content_hash(t) for u, t in capped.items()}
    todo = [u for u in corpus if cache.get(u, {}).get("hash") != hashes[u]]
    if todo:
        console.print(f"[cyan]embedding {len(todo)} posts via {GEMINI_MODEL}...[/cyan]")
        vecs = embed_texts([capped[u] for u in todo], key)
        for u, v in zip(todo, vecs):
            cache[u] = {"hash": hashes[u], "vec": v}
        cache_path.write_text(json.dumps(cache), encoding="utf-8")
    else:
        console.print("[green]embedding cache hit — nothing to re-embed[/green]")

    urls = [u for u in corpus if u in cache]
    mat = normalize_rows(np.array([cache[u]["vec"] for u in urls], dtype=np.float64))
    knn_res = knn(urls, mat, k=k)
    graph = load_graph(BACKLINKS)
    gaps = gap_candidates(knn_res, graph, threshold=threshold)

    idx = TopicsIndex.from_json((ROOT / out).read_text(encoding="utf-8"))
    for u, nbrs in knn_res.items():
        if u in idx.posts:
            idx.posts[u].related = [{"url": w, "score": round(s, 4)} for w, s in nbrs]
    idx.embedder = {
        "model": GEMINI_MODEL,
        "dim": GEMINI_DIM,
        "task": GEMINI_TASK,
        "source": "google-genai",
    }
    idx.crosslink_gaps = gaps
    (ROOT / out).write_text(idx.to_json(), encoding="utf-8")
    console.print(
        f"[green]related for {len(knn_res)} posts, {len(gaps)} cross-link gaps -> {out}[/green]"
    )


if __name__ == "__main__":
    app()
