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
