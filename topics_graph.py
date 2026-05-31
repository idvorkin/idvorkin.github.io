"""Read back-links.json's url_info into a link graph for gap detection."""

import json
from pathlib import Path


class LinkGraph:
    def __init__(self, url_info: dict):
        self._out = {u: set(d.get("outgoing_links") or []) for u, d in url_info.items()}

    def urls(self) -> set:
        return set(self._out)

    def has_link(self, a: str, b: str) -> bool:
        """True if a links to b OR b links to a (a link either way = 'connected')."""
        return b in self._out.get(a, set()) or a in self._out.get(b, set())


def load_graph(backlinks_path) -> LinkGraph:
    data = json.loads(Path(backlinks_path).read_text(encoding="utf-8"))
    return LinkGraph(data["url_info"])
