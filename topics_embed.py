"""Gemini embeddings + kNN + cross-link gap detection for the topics index.

The Gemini API call (`embed_texts`) is integration; the rest — content
hashing, kNN over normalized vectors, and gap detection against the existing
link graph — is pure and unit-tested.
"""

import hashlib
import re

import numpy as np

GEMINI_MODEL = "gemini-embedding-001"
GEMINI_DIM = 1536  # MRL-truncated from 3072; must L2-normalize ourselves
GEMINI_TASK = "SEMANTIC_SIMILARITY"
# gemini-embedding-001 caps input at 2048 tokens (~8k chars); stay well under.
TEXT_CAP = 6000


def content_hash(text: str) -> str:
    return "sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest()


def normalize_rows(matrix: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return matrix / norms


def knn(urls: list, matrix: np.ndarray, k: int = 8) -> dict:
    """Cosine kNN. `matrix` rows must be L2-normalized and aligned with `urls`."""
    sims = matrix @ matrix.T
    np.fill_diagonal(sims, -1.0)
    out = {}
    for i, u in enumerate(urls):
        order = np.argsort(-sims[i])[:k]
        out[u] = [(urls[j], float(sims[i][j])) for j in order]
    return out


def series_stem(url: str) -> str:
    """Strip a trailing date/number/chapter token so series posts share a stem.
    /timeoff-2022-02 -> /timeoff, /y25 -> /y, /7h-c3 -> /7h, /22 -> / (guarded)."""
    s = re.sub(r"-\d{4}-\d{2}(-\d{2})?$", "", url)  # -2024-04(-01)
    s = re.sub(r"-\d{4}$", "", s)  # -2024
    s = re.sub(r"-?c?\d+$", "", s)  # -c3, -2, trailing 24
    return s


def same_series(a: str, b: str) -> bool:
    """True if two URLs are entries in the same dated/numbered series."""
    sa, sb = series_stem(a), series_stem(b)
    return sa == sb and sa not in ("", "/")


def gap_candidates(
    knn_result: dict,
    graph,
    threshold: float,
    max_per_post: int = 5,
    skip_series: bool = True,
) -> list:
    """Pairs that are semantically close (cosine >= threshold) but NOT already
    linked either direction. Same-series template pairs are skipped by default.
    Deduped on the unordered pair, sorted by score."""
    seen = set()
    gaps = []
    for a, neighbors in knn_result.items():
        picked = 0
        for b, score in neighbors:
            if score < threshold:
                break
            if graph.has_link(a, b):
                continue
            if skip_series and same_series(a, b):
                continue
            key = tuple(sorted((a, b)))
            if key in seen:
                continue
            seen.add(key)
            gaps.append({"from": a, "to": b, "score": round(score, 4)})
            picked += 1
            if picked >= max_per_post:
                break
    gaps.sort(key=lambda g: g["score"], reverse=True)
    return gaps


def embed_texts(
    texts: list,
    api_key: str,
    model: str = GEMINI_MODEL,
    dim: int = GEMINI_DIM,
    task: str = GEMINI_TASK,
    batch: int = 20,
) -> list:
    """Embed texts via Gemini. Batches; falls back to one-at-a-time on a batch
    error so one oversized doc can't sink the whole run."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    cfg = types.EmbedContentConfig(task_type=task, output_dimensionality=dim)
    out: list = []
    for i in range(0, len(texts), batch):
        chunk = texts[i : i + batch]
        try:
            r = client.models.embed_content(model=model, contents=chunk, config=cfg)
            out.extend([e.values for e in r.embeddings])
        except Exception:
            for one in chunk:
                r = client.models.embed_content(model=model, contents=[one], config=cfg)
                out.append(r.embeddings[0].values)
    return out
