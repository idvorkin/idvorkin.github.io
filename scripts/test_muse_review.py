# ABOUTME: Exercises the Muse reviewer without calling GitHub or model providers.
# ABOUTME: Covers safe diff filtering, comment updates, configuration, and retries.
from __future__ import annotations

from typing import Any

import muse_review
import pytest


class FakeResponse:
    def __init__(self, payload: Any = None, content: bytes = b""):
        self.payload = payload
        self.content = content

    def raise_for_status(self) -> None:
        pass

    def json(self) -> Any:
        return self.payload


def _provider(
    name: str = "meta",
    *,
    model: str | None = None,
    fallback_from: str | None = None,
) -> muse_review.ProviderConfig:
    return muse_review.ProviderConfig(
        name=name,
        base_url=(
            muse_review.META_BASE_URL
            if name == "meta"
            else muse_review.OPENROUTER_BASE_URL
        ),
        api_key=f"{name}-key",
        model=model or muse_review.DEFAULT_MODELS[name],
        fallback_from=fallback_from,
    )


def _config(provider: muse_review.ProviderConfig | None = None, **kwargs):
    values = {
        "github_token": "github-token",
        "repository": "owner/repo",
        "pr_number": 3,
        "provider": provider or _provider(),
    }
    values.update(kwargs)
    return muse_review.Config(**values)


def _set_required_env(monkeypatch, **values):
    for name in (
        "GITHUB_TOKEN",
        "GITHUB_REPOSITORY",
        "PR_NUMBER",
        "MUSE_PROVIDER",
        "MUSE_API_KEY",
        "OPENROUTER_API_KEY",
        "MUSE_BASE_URL",
        "MUSE_MODEL",
        "MUSE_DRY_RUN",
    ):
        monkeypatch.delenv(name, raising=False)
    base = {
        "GITHUB_TOKEN": "github-token",
        "GITHUB_REPOSITORY": "owner/repo",
        "PR_NUMBER": "3",
    }
    base.update(values)
    for name, value in base.items():
        monkeypatch.setenv(name, value)


def test_filter_diff_drops_lockfiles_generated_assets_and_binary_files():
    diff = """diff --git a/app.py b/app.py
--- a/app.py
+++ b/app.py
@@ -1 +1 @@
-old
+new
diff --git a/package-lock.json b/package-lock.json
--- a/package-lock.json
+++ b/package-lock.json
@@ -1 +1 @@
-{}
+{"lock": true}
diff --git a/assets/js/site.js b/assets/js/site.js
--- a/assets/js/site.js
+++ b/assets/js/site.js
@@ -1 +1 @@
-old
+built
diff --git a/static/site.min.css b/static/site.min.css
--- a/static/site.min.css
+++ b/static/site.min.css
@@ -1 +1 @@
-a
+b
diff --git a/static/site.js.map b/static/site.js.map
--- a/static/site.js.map
+++ b/static/site.js.map
@@ -1 +1 @@
-a
+b
diff --git a/photo.png b/photo.png
new file mode 100644
Binary files /dev/null and b/photo.png differ
"""

    filtered = muse_review.filter_diff(diff)

    assert "app.py" in filtered
    assert "package-lock.json" not in filtered
    assert "assets/js/site.js" not in filtered
    assert "site.min.css" not in filtered
    assert "site.js.map" not in filtered
    assert "photo.png" not in filtered


def test_filter_diff_drops_blog_outputs_images_and_oversized_file_sections():
    oversized = "+" + ("x" * (60 * 1024))
    diff = f"""diff --git a/src/main.ts b/src/main.ts
--- a/src/main.ts
+++ b/src/main.ts
@@ -1 +1 @@
-old
+new
diff --git a/_site/index.html b/_site/index.html
--- a/_site/index.html
+++ b/_site/index.html
@@ -1 +1 @@
-old
+built
diff --git a/back-links.json b/back-links.json
--- a/back-links.json
+++ b/back-links.json
@@ -1 +1 @@
-{{}}
+{{"built": true}}
diff --git a/images/photo.webp b/images/photo.webp
--- a/images/photo.webp
+++ b/images/photo.webp
@@ -1 +1 @@
-old
+new
diff --git a/assets/js/site.js b/assets/js/site.js
--- a/assets/js/site.js
+++ b/assets/js/site.js
@@ -1 +1 @@
-old
+built
diff --git a/topics.json b/topics.json
--- a/topics.json
+++ b/topics.json
@@ -1 +1 @@
-{{}}
+{{"built": true}}
diff --git a/icons/logo.svg b/icons/logo.svg
--- a/icons/logo.svg
+++ b/icons/logo.svg
@@ -1 +1 @@
-old
+new
diff --git a/_d/huge.md b/_d/huge.md
--- a/_d/huge.md
+++ b/_d/huge.md
@@ -0,0 +1 @@
{oversized}
"""

    result = muse_review.filter_diff_with_stats(diff)

    assert "src/main.ts" in result.diff
    assert "_site/index.html" not in result.diff
    assert "back-links.json" not in result.diff
    assert "images/photo.webp" not in result.diff
    assert "assets/js/site.js" not in result.diff
    assert "topics.json" not in result.diff
    assert "icons/logo.svg" not in result.diff
    assert "_d/huge.md" not in result.diff
    assert result.skipped_files == 7


def test_marker_upsert_creates_comment_when_missing():
    calls = []

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        if method == "GET":
            return FakeResponse([])
        return FakeResponse({"id": 12})

    client = muse_review.GitHubClient("token", "owner/repo", request=request)
    action = client.upsert_comment(7, f"{muse_review.MARKER}\nreview")

    assert action == "created"
    assert [call[0] for call in calls] == ["GET", "POST"]
    assert calls[-1][1].endswith("/repos/owner/repo/issues/7/comments")


def test_marker_upsert_edits_existing_comment():
    calls = []

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        if method == "GET":
            return FakeResponse([{"id": 42, "body": muse_review.MARKER}])
        return FakeResponse({"id": 42})

    client = muse_review.GitHubClient("token", "owner/repo", request=request)
    action = client.upsert_comment(7, f"{muse_review.MARKER}\nnew review")

    assert action == "updated"
    assert [call[0] for call in calls] == ["GET", "PATCH"]
    assert calls[-1][1].endswith("/repos/owner/repo/issues/comments/42")


def test_size_skip_posts_short_comment_without_calling_muse():
    calls = []

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        if "/pulls/3" in url and kwargs["headers"]["Accept"].endswith("+json"):
            return FakeResponse({"draft": False, "labels": [], "title": "Large PR"})
        if "/pulls/3" in url:
            return FakeResponse(content=b"12345")
        if method == "GET":
            return FakeResponse([])
        return FakeResponse({"id": 1})

    config = _config(max_diff_bytes=4)

    assert muse_review.run(config, request=request) == 0
    assert all("/chat/completions" not in call[1] for call in calls)
    posted = calls[-1][2]["json"]["body"]
    assert posted.startswith(muse_review.MARKER)
    assert "5 bytes" in posted
    assert "4-byte limit" in posted


def test_comment_rendering_uses_reported_cost():
    rendered = muse_review.render_comment(
        "Summary one.\nSummary two.\n\nNo blocking issues.",
        _provider("openrouter"),
        {"prompt_tokens": 41_000, "completion_tokens": 1_200, "cost": 0.0045},
    )

    assert rendered.startswith(muse_review.MARKER)
    assert "Summary one.\nSummary two." in rendered
    assert "No blocking issues." in rendered
    assert (
        "meta/muse-spark-1.3-contributor via openrouter · "
        "41k in / 1.2k out · $0.0045" in rendered
    )


def test_comment_rendering_reports_filtered_file_count():
    rendered = muse_review.render_comment(
        "No blocking issues.",
        _provider(),
        {"prompt_tokens": 10, "completion_tokens": 20},
        skipped_files=2,
    )

    assert "_2 files skipped as generated/binary._" in rendered


def test_skip_rendering_reports_filtered_file_count():
    rendered = muse_review.render_skip(
        "diff is empty after filtering generated, lock, and binary files",
        skipped_files=2,
    )

    assert "_2 files skipped as generated/binary._" in rendered


def test_comment_rendering_computes_known_model_cost_and_reasoning_tokens():
    rendered = muse_review.render_comment(
        "No blocking issues.",
        _provider(fallback_from="openrouter"),
        {
            "prompt_tokens": 42_000,
            "completion_tokens": 1_000,
            "completion_tokens_details": {"reasoning_tokens": 900},
        },
    )

    assert (
        "muse-spark-1.3-contributor via meta (fallback from openrouter) · "
        "42k in / 1k out (900 reasoning) · $0.0044" in rendered
    )


def test_comment_rendering_omits_cost_for_unknown_model():
    rendered = muse_review.render_comment(
        "No blocking issues.",
        _provider(model="future-model"),
        {"prompt_tokens": 10, "completion_tokens": 20},
    )

    footer = rendered.rsplit("\n", 1)[-1]
    assert "future-model via meta · 10 in / 20 out" in footer
    assert "$" not in footer


def test_config_defaults_to_meta(monkeypatch):
    _set_required_env(
        monkeypatch,
        MUSE_API_KEY="meta-key",
        OPENROUTER_API_KEY="openrouter-key",
        MUSE_BASE_URL="https://meta.example/v1/",
    )

    config = muse_review.config_from_env()

    assert config.provider == muse_review.ProviderConfig(
        name="meta",
        base_url="https://meta.example/v1/",
        api_key="meta-key",
        model="muse-spark-1.3-contributor",
    )


def test_config_selects_openrouter(monkeypatch):
    _set_required_env(
        monkeypatch,
        MUSE_PROVIDER="openrouter",
        MUSE_API_KEY="meta-key",
        OPENROUTER_API_KEY="openrouter-key",
    )

    config = muse_review.config_from_env()

    assert config.provider == muse_review.ProviderConfig(
        name="openrouter",
        base_url=muse_review.OPENROUTER_BASE_URL,
        api_key="openrouter-key",
        model="meta/muse-spark-1.3-contributor",
    )


@pytest.mark.parametrize(
    ("requested", "available_key", "expected"),
    [
        ("meta", {"OPENROUTER_API_KEY": "openrouter-key"}, "openrouter"),
        ("openrouter", {"MUSE_API_KEY": "meta-key"}, "meta"),
    ],
)
def test_config_falls_back_when_selected_provider_key_is_missing(
    monkeypatch, requested, available_key, expected
):
    _set_required_env(monkeypatch, MUSE_PROVIDER=requested, **available_key)

    config = muse_review.config_from_env()

    assert config.provider.name == expected
    assert config.provider.fallback_from == requested
    assert config.provider.model == muse_review.DEFAULT_MODELS[expected]


def test_main_posts_skip_and_exits_zero_when_provider_keys_are_missing(
    monkeypatch, capsys
):
    _set_required_env(monkeypatch)
    calls = []

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        if "/pulls/3" in url:
            return FakeResponse({"draft": False, "labels": [], "title": "Change"})
        if method == "GET":
            return FakeResponse([])
        return FakeResponse({"id": 1})

    monkeypatch.setattr(muse_review.requests, "request", request)

    assert muse_review.main() == 0
    assert [call[0] for call in calls] == ["GET", "GET", "POST"]
    assert calls[-1][2]["json"]["body"] == (
        f"{muse_review.MARKER}\nMuse review skipped: MUSE_API_KEY not set."
    )
    assert "created on PR #3" in capsys.readouterr().out


def test_no_ai_review_label_skips_without_provider_credentials():
    calls = []

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        return FakeResponse(
            {
                "draft": False,
                "labels": [{"name": "no-ai-review"}],
                "title": "Opted out",
            }
        )

    config = muse_review.Config(
        github_token="github-token",
        repository="owner/repo",
        pr_number=3,
        provider=None,
    )

    assert muse_review.run(config, request=request) == 0
    assert len(calls) == 1
    assert "/pulls/3" in calls[0][1]


def test_meta_empty_content_retries_once_with_a_larger_cap():
    calls = []
    responses = iter(
        [
            FakeResponse(
                {
                    "choices": [{"message": {"content": None}}],
                    "usage": {"prompt_tokens": 10, "completion_tokens": 20},
                }
            ),
            FakeResponse(
                {
                    "choices": [{"message": {"content": "No blocking issues."}}],
                    "usage": {"prompt_tokens": 10, "completion_tokens": 30},
                }
            ),
        ]
    )

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        return next(responses)

    review, usage = muse_review.call_muse(
        _config(), {"title": "Change"}, "diff --git a/a b/a", request=request
    )

    assert review == "No blocking issues."
    assert usage["completion_tokens"] == 30
    assert [call[2]["json"]["max_tokens"] for call in calls] == [4_000, 8_000]
    assert all(call[1] == "https://api.meta.ai/v1/chat/completions" for call in calls)
    assert all("usage" not in call[2]["json"] for call in calls)


def test_openrouter_request_keeps_usage_include_and_uses_blog_title():
    calls = []

    def request(method, url, **kwargs):
        calls.append((method, url, kwargs))
        return FakeResponse(
            {
                "choices": [{"message": {"content": "No blocking issues."}}],
                "usage": {
                    "prompt_tokens": 10,
                    "completion_tokens": 20,
                    "cost": 0.001,
                },
            }
        )

    muse_review.call_muse(
        _config(_provider("openrouter")),
        {"title": "Change"},
        "diff --git a/a b/a",
        request=request,
    )

    assert calls[0][1] == "https://openrouter.ai/api/v1/chat/completions"
    assert calls[0][2]["json"]["usage"] == {"include": True}
    assert calls[0][2]["headers"]["X-Title"] == "blog muse review"


def test_reviewer_prompt_covers_blog_specific_risks():
    prompt = muse_review.REVIEWER_PROMPT

    assert "Jekyll blog" in prompt
    assert "_d/*.md" in prompt
    assert "front matter" in prompt
    assert "redirect_from" in prompt
    assert "broken anchors" in prompt
    assert "alt text" in prompt
    assert "image sizes" in prompt
    assert "src/" in prompt
    assert "_includes/" in prompt
    assert ".pre-commit-hooks/" in prompt
