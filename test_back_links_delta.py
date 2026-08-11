# test_back_links_delta.py
from types import SimpleNamespace

from build_back_links import rebuild_incoming_links, update_page_fields


def _data(redirects, url_info):
    return {"redirects": redirects, "url_info": url_info}


def _page(outgoing):
    return SimpleNamespace(
        title="T", description="D", outgoing_links=outgoing, doc_size=1
    )


def test_delta_stores_outgoing_links_canonicalized():
    """Delta must store outgoing links the same shape the full build does.

    LinkBuilder.canonicalize_outgoing_pages resolves aliases before writing, so
    a delta run that stored the authored form would flip /timeoff back to
    /time-off on every commit and leave the two paths disagreeing.
    """
    old_page = {"outgoing_links": ["/timeoff"]}

    updates = update_page_fields(
        old_page,
        _page(["/time-off"]),
        dry_run=False,
        threshold_minutes=60,
        current_time="2026-08-11T00:00:00+00:00",
        redirects={"/time-off": "/timeoff"},
    )

    assert old_page["outgoing_links"] == ["/timeoff"]
    assert updates["outgoing_links"] is False  # canonical form is unchanged


def test_delta_outgoing_links_without_redirects_are_untouched():
    old_page = {"outgoing_links": []}

    update_page_fields(
        old_page,
        _page(["/b", "/a"]),
        dry_run=False,
        threshold_minutes=60,
        current_time="2026-08-11T00:00:00+00:00",
    )

    assert old_page["outgoing_links"] == ["/a", "/b"]


def test_alias_linker_survives_alongside_a_canonical_linker():
    """The real-world drop: a page linked both ways loses the alias edge.

    /timeoff is reachable as /time-off. /canonical-linker links it directly,
    so /timeoff is a key in the rebuilt bucket and its incoming list gets
    overwritten. Without canonicalizing, /alias-linker's edge is missing from
    that bucket and is silently erased on every delta run -- which is exactly
    what happened to /timeoff-2026-07 in practice.
    """
    data = _data(
        {"/time-off": "/timeoff"},
        {
            "/timeoff": {
                "outgoing_links": [],
                "incoming_links": ["/alias-linker", "/canonical-linker"],
            },
            "/alias-linker": {"outgoing_links": ["/time-off"], "incoming_links": []},
            "/canonical-linker": {"outgoing_links": ["/timeoff"], "incoming_links": []},
        },
    )

    rebuild_incoming_links(data)

    assert data["url_info"]["/timeoff"]["incoming_links"] == [
        "/alias-linker",
        "/canonical-linker",
    ]


def test_alias_edge_is_credited_to_the_canonical_page():
    """An alias-only linker still lands on the canonical page's list."""
    data = _data(
        {"/habits": "/d/habits"},
        {
            "/d/habits": {"outgoing_links": [], "incoming_links": ["/seed"]},
            "/seed": {"outgoing_links": ["/d/habits"], "incoming_links": []},
            "/timeoff-2026-07": {"outgoing_links": ["/habits"], "incoming_links": []},
        },
    )

    rebuild_incoming_links(data)

    assert data["url_info"]["/d/habits"]["incoming_links"] == [
        "/seed",
        "/timeoff-2026-07",
    ]


def test_canonical_links_are_unaffected():
    data = _data(
        {"/time-off": "/timeoff"},
        {
            "/timeoff": {"outgoing_links": [], "incoming_links": []},
            "/trip": {"outgoing_links": ["/timeoff"], "incoming_links": []},
        },
    )

    rebuild_incoming_links(data)

    assert data["url_info"]["/timeoff"]["incoming_links"] == ["/trip"]


def test_missing_redirects_key_is_tolerated():
    """Older back-links.json files predate the serialized redirect map."""
    data = {
        "url_info": {
            "/timeoff": {"outgoing_links": [], "incoming_links": []},
            "/trip": {"outgoing_links": ["/timeoff"], "incoming_links": []},
        }
    }

    rebuild_incoming_links(data)

    assert data["url_info"]["/timeoff"]["incoming_links"] == ["/trip"]
