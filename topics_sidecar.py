"""Schema + JSON (de)serialization for the regenerable topics.json sidecar."""

import json
from dataclasses import asdict, dataclass, field
from typing import Optional


@dataclass
class PostEntry:
    title: str
    summary: str = ""
    tags: list = field(default_factory=list)
    entities: list = field(default_factory=list)
    related: list = field(default_factory=list)  # [{"url":..., "score":...}]
    content_hash: str = ""


@dataclass
class TopicsIndex:
    generated_at: str
    embedder: Optional[dict] = None
    vocab: list = field(default_factory=list)  # [{"tag","aliases","count"}]
    clusters: list = field(default_factory=list)
    posts: dict = field(default_factory=dict)  # url -> PostEntry
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
