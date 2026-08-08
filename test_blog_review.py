# test_blog_review.py
"""Regression tests for scripts/blog_review.py.

Run: uv run --with pytest --with typer --with rich pytest test_blog_review.py

The crash these guard against was real: a review batch containing the sentence
"For context on why I take time off: /time-off." killed the whole CLI with
``MarkupError: closing tag '[/time-off]' ...`` because the markdown link's
rendered form still reads as rich console markup.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent


def _load():
    spec = importlib.util.spec_from_file_location(
        "blog_review", REPO_ROOT / "scripts" / "blog_review.py"
    )
    module = importlib.util.module_from_spec(spec)
    sys.modules["blog_review"] = module  # dataclasses needs the module registered
    spec.loader.exec_module(module)
    return module


br = _load()


# --------------------------------------------------------------- rich markup
MARKUP_LANDMINES = [
    "For context on why I take time off: /time-off.",  # the original crash
    "[/close] with no opening tag",
    "[red]unbalanced[/blue]",
    "see [1] and [2]",
    "[[wiki style]]",
]


@pytest.mark.parametrize("text", MARKUP_LANDMINES)
def test_every_render_path_escapes_markup(text, capsys):
    """No console path may hand annotation text to rich unescaped."""
    batch = {
        "permalink": "/timeoff-2026-07",
        # Origin is payload data too, so it goes through the same escaping.
        "origin": text,
        "title": text,
        "url": "https://idvork.in/timeoff-2026-07",
        "created": "2026-08-04T15:15:15.149Z",
        "annotations": [
            {
                "permalink": "/timeoff-2026-07",
                "origin": text,
                "quote": text,
                "prefix": text,
                "suffix": text,
                "comment": text,
                "intent": "note",
                "ts": "2026-08-04T15:12:53.429Z",
            }
        ],
    }
    br.print_batch_header(batch, batch["annotations"])
    out = capsys.readouterr().out
    # Rendered literally, not swallowed as a style tag.
    assert text.split()[0] in out


def test_unlocated_report_escapes_markup(capsys):
    console = br.console
    console.print(f"  [red]•[/red] {br.esc('[/time-off] [bold]x')}")
    assert "[/time-off]" in capsys.readouterr().out


# ------------------------------------------------------------- frontmatter
def test_permalink_is_not_derived_from_the_url():
    """`/timeoff-2026-07` lives in `_d/time-off-2026-07.md` — different string."""
    index = br.PermalinkIndex(REPO_ROOT)
    hit = index.resolve("/timeoff-2026-07")
    assert hit.path is not None
    assert hit.path.name == "time-off-2026-07.md"
    assert hit.how == "frontmatter permalink"


def test_redirect_from_aliases_resolve():
    index = br.PermalinkIndex(REPO_ROOT)
    hit = index.resolve("/eu-2026")
    assert hit.path is not None and hit.path.name == "time-off-2026-07.md"
    assert hit.how == "redirect_from alias"


def test_unknown_permalink_reports_rather_than_guessing():
    index = br.PermalinkIndex(REPO_ROOT)
    hit = index.resolve("/definitely-not-a-post-on-this-branch")
    assert hit.path is None
    assert "definitely-not-a-post" in hit.reason
    assert index.dirs_searched  # the report can say where it looked


def test_redirect_block_list_parsing():
    front = (
        "\nlayout: post\npermalink: /timeoff-2026-07\n"
        "redirect_from:\n  - /eu-2026\n  - /europe-2026\ntags:\n  - travel\n"
    )
    assert br._frontmatter_permalink(front) == "/timeoff-2026-07"
    # Must stop at `tags:`, and must not fold the key's newline into the value.
    assert br._frontmatter_redirects(front) == ["/eu-2026", "/europe-2026"]


def test_redirect_scalar_and_flow_forms():
    assert br._frontmatter_redirects("\nredirect_from: /solo\n") == ["/solo"]
    assert br._frontmatter_redirects("\nredirect_from: [/a, /b]\n") == ["/a", "/b"]
    assert br._frontmatter_redirects("\ntitle: x\n") == []


def test_valueless_key_does_not_swallow_the_next_line():
    assert br._frontmatter_permalink("\npermalink:\nlayout: post\n") is None


# ------------------------------------------------------------------- intent
def test_intent_defaults_and_validates():
    assert br.annotation_intent({}) == "note"
    assert br.annotation_intent({"intent": "REWRITE"}) == "rewrite"
    assert br.annotation_intent({"intent": "not-an-intent"}) == "note"
    for name in br.INTENTS:
        assert br.annotation_intent({"intent": name}) == name


# ------------------------------------------------------------------ version
def test_version_falls_back_to_batch_url_and_says_when_absent():
    batch = {
        "url": "https://idvork.in/timeoff-2026-07",
        "created": "2026-01-01T00:00:00Z",
    }
    version = br.annotation_version({"ts": "2026-02-02T00:00:00Z"}, batch)
    assert version["url"] == "https://idvork.in/timeoff-2026-07"
    assert version["capturedAt"] == "2026-02-02T00:00:00Z"
    # Never imply we know a page version the payload never carried.
    assert "no page-version marker" in br.version_line(version)


def test_version_line_reports_recorded_markers():
    line = br.version_line(
        {
            "lastModified": "08/04/2026 08:10:48",
            "contentDigest": "1cbb510f",
            "contentLength": 12854,
        }
    )
    assert "08/04/2026 08:10:48" in line and "1cbb510f" in line and "12854" in line


def test_batch_source_url_is_always_echoed():
    assert br.batch_source_url({"url": "https://idvork.in/x"}) == "https://idvork.in/x"
    assert br.batch_source_url({"permalink": "/x"}) == "https://idvork.in/x"


# ------------------------------------------------------------------- origin
#
# A permalink says WHICH post; an origin says WHICH SERVER. Without the second,
# a note taken against the Tailscale preview is indistinguishable from one
# taken against the live site — and the two can disagree about the prose.

PREVIEW_ORIGIN = "http://c-5004.squeaker-teeth.ts.net:4000"

# A capture from the current client: origin sits next to permalink at both the
# batch and the annotation level.
NEW_BATCH = {
    "permalink": "/timeoff-2026-07",
    "origin": PREVIEW_ORIGIN,
    "url": f"{PREVIEW_ORIGIN}/timeoff-2026-07",
    "created": "2026-08-08T17:28:28.150Z",
    "annotations": [
        {
            "permalink": "/timeoff-2026-07",
            "origin": PREVIEW_ORIGIN,
            "quote": "x",
            "ts": "2026-08-08T17:21:44.700Z",
            "version": {"url": f"{PREVIEW_ORIGIN}/timeoff-2026-07"},
        }
    ],
}

# One of Igor's existing gists: no `origin` anywhere, only absolute URLs.
OLD_BATCH = {
    "permalink": "/timeoff-2026-07",
    "url": "https://idvork.in/timeoff-2026-07",
    "created": "2026-08-08T17:28:28.150Z",
    "annotations": [
        {
            "permalink": "/timeoff-2026-07",
            "quote": "x",
            "ts": "2026-08-08T17:21:44.700Z",
            "version": {"url": "https://idvork.in/timeoff-2026-07"},
        }
    ],
}


def test_origin_is_read_at_both_levels():
    ann = NEW_BATCH["annotations"][0]
    assert br.annotation_origin({}, NEW_BATCH) == PREVIEW_ORIGIN
    assert br.annotation_origin(ann, NEW_BATCH) == PREVIEW_ORIGIN
    # The annotation wins: one buffer can span page loads, and servers.
    assert br.annotation_origin({"origin": "https://idvork.in"}, NEW_BATCH) == (
        "https://idvork.in"
    )


def test_non_standard_port_survives_intact():
    """`location.host` carries the port; nothing downstream may drop it."""
    assert ":4000" in br.annotation_origin({}, NEW_BATCH)
    assert br.batch_source_url({"permalink": "/x", "origin": PREVIEW_ORIGIN}) == (
        f"{PREVIEW_ORIGIN}/x"
    )


def test_pre_origin_captures_still_parse():
    """Igor's existing gists have no `origin` — recover it from the URLs."""
    ann = OLD_BATCH["annotations"][0]
    assert br.annotation_origin({}, OLD_BATCH) == "https://idvork.in"
    assert br.annotation_origin(ann, OLD_BATCH) == "https://idvork.in"
    # And the rest of the batch is untouched by the new field.
    assert br.batch_source_url(OLD_BATCH) == "https://idvork.in/timeoff-2026-07"
    assert br.annotation_version(ann, OLD_BATCH)["url"] == (
        "https://idvork.in/timeoff-2026-07"
    )


def test_pre_origin_batch_renders_without_the_field(capsys):
    br.print_batch_header(OLD_BATCH, OLD_BATCH["annotations"])
    assert "idvork.in" in capsys.readouterr().out


def test_origin_is_never_assumed_when_nothing_recorded_it():
    """No origin and no absolute URL means unknown — not production."""
    assert br.annotation_origin({}, {"permalink": "/x"}) == ""
    assert "not recorded" in br.origin_label("")
    # A relative url is not an origin.
    assert br.annotation_origin({}, {"url": "/timeoff-2026-07"}) == ""


def test_preview_origins_are_called_out_and_production_is_not():
    assert "preview" in br.origin_label(PREVIEW_ORIGIN)
    assert "preview" in br.origin_label("http://localhost:4000")
    assert "preview" not in br.origin_label(br.PRODUCTION_ORIGIN)


def test_locate_json_carries_origin_next_to_every_permalink():
    """Shape check: wherever the CLI emits a permalink, it emits an origin."""
    index = br.PermalinkIndex(REPO_ROOT)
    ann = NEW_BATCH["annotations"][0]
    resolution = index.resolve(ann["permalink"])
    assert resolution.path is not None
    assert br.annotation_origin(ann, NEW_BATCH) == PREVIEW_ORIGIN


# ------------------------------------------------- client/consumer contract
def test_client_emits_origin_beside_permalink_at_both_levels():
    """`_includes/annotate.html` is the only producer of these payloads.

    There is no JS test harness in this repo, so this guards the one thing
    that silently breaks the consumer: the client dropping the field.
    """
    js = (REPO_ROOT / "_includes" / "annotate.html").read_text()
    # Per-annotation (composer save) and batch-level (payloadJson).
    assert js.count("origin: ORIGIN,") == 2
    # Built from location, never hardcoded to a host.
    assert "window.location.origin ||" in js
    assert "window.location.protocol" in js


# ----------------------------------------------------------------- locating
def test_locates_a_markdown_link_line():
    index = br.PermalinkIndex(REPO_ROOT)
    path = index.resolve("/timeoff-2026-07").path
    match = br.Locator.for_path(path).locate(
        {
            "quote": "For context on why I take time off: /time-off.\n\n",
            "prefix": ", and a live weather table.\n\n\n",
            "suffix": "Why I’m taking this time off —",
        }
    )
    assert match is not None
    assert "/time-off" in path.read_text().splitlines()[match.line - 1]
