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
    assert g.has_link("/a", "/b") is True  # a -> b
    assert g.has_link("/b", "/a") is True  # reverse counts as linked
    assert g.has_link("/a", "/c") is False
    assert g.urls() == {"/a", "/b", "/c"}


def test_load_graph_reads_url_info(tmp_path: Path):
    p = tmp_path / "back-links.json"
    p.write_text(
        json.dumps(
            {
                "url_info": {
                    "/x": {"outgoing_links": ["/y"], "incoming_links": []},
                    "/y": {"outgoing_links": [], "incoming_links": ["/x"]},
                }
            }
        )
    )
    g = load_graph(p)
    assert g.has_link("/x", "/y") is True
