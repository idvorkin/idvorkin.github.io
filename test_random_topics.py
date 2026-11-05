# ABOUTME: Tests that back-links.json tells each page which /random topics it is in.
# ABOUTME: Runs the real rules, the real topics.json, and LinkBuilder on real HTML.
import json

import pytest

from build_back_links import LinkBuilder
from random_topics import TOPIC_RULES, load_post_tags, normalize_tag, topics_for_tags


def _html(url, keywords=None):
    meta = (
        "" if keywords is None else f'<meta property="keywords" content="{keywords}"/>'
    )
    return f"""<html><head><title>T</title>
    <link rel="canonical" href="https://idvork.in{url}"/>{meta}</head><body></body></html>"""


def _build(tmp_path, pages, post_tags=None, redirects=None):
    """Run LinkBuilder over HTML pages; pages maps URL to its keywords meta."""
    tags_path = tmp_path / "topics.json"
    if post_tags is not None:
        tags_path.write_text(
            json.dumps({"posts": {u: {"tags": t} for u, t in post_tags.items()}})
        )
    lb = LinkBuilder(post_tags_path=tags_path)
    for i, (url, keywords) in enumerate(pages.items()):
        path = tmp_path / f"page{i}.html"
        path.write_text(_html(url, keywords))
        lb.update(str(path))
    lb.redirects.update(redirects or {})
    output = tmp_path / "back-links.json"
    lb.print_json(str(output))
    return json.loads(output.read_text())["url_info"]


def test_slugs_are_exactly_what_the_grabber_app_opens():
    assert set(TOPIC_RULES) == {
        "ai",
        "tech",
        "family",
        "health",
        "mind",
        "work",
        "books",
    }


def test_front_matter_and_topics_json_spellings_match():
    assert normalize_tag("Emotional Intelligence") == "emotional-intelligence"
    assert topics_for_tags(["emotional intelligence"]) == ["mind"]
    assert topics_for_tags(["emotional-intelligence"]) == ["mind"]


@pytest.mark.parametrize(
    "tag,topic",
    [
        ("ai", "ai"),
        ("agent-orchestration", "ai"),
        ("machine-learning", "ai"),
        ("software engineering", "tech"),
        ("developer-tooling", "tech"),
        ("family-travel", "family"),
        ("parenting", "family"),
        ("physical health", "health"),
        ("sleep", "health"),
        ("mental health", "mind"),
        ("meditation", "mind"),
        ("manager", "work"),
        ("job-hunt", "work"),
        ("book-notes", "books"),
    ],
)
def test_tag_falls_in_topic(tag, topic):
    assert topic in topics_for_tags([tag])


@pytest.mark.parametrize(
    "tag,topic",
    [
        ("self-hosting", "mind"),  # "self" alone is not a mind word
        ("team-health", "health"),
        ("mental-health", "health"),
        ("fitness-functions", "health"),
        ("mental-models", "mind"),
        ("resilience-patterns", "mind"),
        ("ai-tooling", "tech"),
        ("writing-prompts", "ai"),
        ("how igor ticks", "mind"),
    ],
)
def test_tag_stays_out_of_topic(tag, topic):
    assert topic not in topics_for_tags([tag])


def test_post_can_be_in_several_topics_or_none():
    assert topics_for_tags(["ai", "parenting"]) == ["ai", "family"]
    assert topics_for_tags(["seattle"]) == []
    assert topics_for_tags([]) == []


def test_every_topic_has_posts_in_the_real_topics_json():
    post_tags = load_post_tags()
    assert len(post_tags) > 300
    counts = {slug: 0 for slug in TOPIC_RULES}
    for tags in post_tags.values():
        for slug in topics_for_tags(tags):
            counts[slug] += 1
    assert all(count >= 10 for count in counts.values()), counts


def test_new_post_counts_through_its_front_matter_alone(tmp_path):
    info = _build(tmp_path, {"/new-post": "ai, parenting"}, post_tags={})
    assert info["/new-post"]["topics"] == ["ai", "family"]


def test_old_post_counts_through_its_topics_json_tags(tmp_path):
    info = _build(tmp_path, {"/old": None}, post_tags={"/old": ["meditation"]})
    assert info["/old"]["topics"] == ["mind"]


def test_front_matter_and_topics_json_tags_combine(tmp_path):
    info = _build(tmp_path, {"/both": "book-notes"}, post_tags={"/both": ["sleep"]})
    assert info["/both"]["topics"] == ["books", "health"]


def test_topics_json_entry_under_a_redirected_url_reaches_the_canonical_page(tmp_path):
    info = _build(
        tmp_path,
        {"/health": None},
        post_tags={"/four-healths": ["sleep"]},
        redirects={"/four-healths": "/health"},
    )
    assert info["/health"]["topics"] == ["health"]


def test_page_with_empty_tags_has_no_topics(tmp_path):
    info = _build(tmp_path, {"/journal": ""}, post_tags={})
    assert info["/journal"]["topics"] == []


def test_missing_topics_json_still_builds_from_front_matter(tmp_path):
    info = _build(tmp_path, {"/p": "health"}, post_tags=None)
    assert info["/p"]["topics"] == ["health"]


def test_corrupt_topics_json_is_not_fatal(tmp_path):
    bad = tmp_path / "bad.json"
    bad.write_text("{not json")
    assert load_post_tags(bad) == {}
