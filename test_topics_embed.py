# test_topics_embed.py
import numpy as np

from topics_embed import content_hash, gap_candidates, knn, normalize_rows, same_series
from topics_graph import LinkGraph


def test_same_series_detects_dated_and_numbered_series():
    assert same_series("/timeoff-2021-12", "/timeoff-2022-02") is True
    assert same_series("/y24", "/y25") is True
    assert same_series("/7h-c1", "/7h-c3") is True
    assert same_series("/depression", "/anxiety") is False
    assert same_series("/22", "/42") is False  # both strip to "/", guarded out


def test_content_hash_stable_and_prefixed():
    h = content_hash("hello")
    assert h.startswith("sha256:")
    assert h == content_hash("hello")
    assert h != content_hash("world")


def test_normalize_rows_unit_length():
    m = normalize_rows(np.array([[3.0, 4.0], [0.0, 0.0]]))
    assert abs(np.linalg.norm(m[0]) - 1.0) < 1e-6
    assert np.linalg.norm(m[1]) == 0.0  # zero vector stays zero, no div-by-zero


def test_knn_orders_by_cosine():
    # a and b nearly identical; c orthogonal-ish
    urls = ["/a", "/b", "/c"]
    mat = normalize_rows(np.array([[1.0, 0.0], [0.99, 0.01], [0.0, 1.0]]))
    res = knn(urls, mat, k=2)
    assert res["/a"][0][0] == "/b"  # nearest to a is b
    assert res["/a"][0][1] > res["/a"][1][1]  # sorted descending


def test_gap_candidates_skips_linked_and_respects_threshold():
    knn_result = {
        "/a": [("/b", 0.95), ("/c", 0.60)],
        "/b": [("/a", 0.95), ("/c", 0.85)],
        "/c": [("/b", 0.85), ("/a", 0.60)],
    }
    graph = LinkGraph(
        {
            "/a": {"outgoing_links": ["/b"]},  # a-b already linked -> excluded
            "/b": {"outgoing_links": []},
            "/c": {"outgoing_links": []},
        }
    )
    gaps = gap_candidates(knn_result, graph, threshold=0.80)
    pairs = {tuple(sorted((g["from"], g["to"]))) for g in gaps}
    assert ("/b", "/c") in pairs  # 0.85, unlinked -> kept
    assert ("/a", "/b") not in pairs  # already linked -> dropped
    assert ("/a", "/c") not in pairs  # 0.60 < threshold -> dropped
    assert len(gaps) == 1  # deduped (b-c appears once, not twice)
