# ABOUTME: Sorts a post's tags into the topics /random?topic=<slug> can roll from.
# ABOUTME: Rules are derived from the tags in topics.json and post front matter.
"""A post is in a topic when any of its tags falls in that topic.

Tags come from two places with different spellings ("emotional intelligence" in
front matter, "emotional-intelligence" in topics.json), so they are normalized
first. A rule matches on a whole hyphen-separated word of the tag, or on the
exact tag. Word matches cover the long tail (topics.json has 1,700+ tags, most
used once). Exact tags cover the words too ambiguous to match alone: "self" also
finds self-hosting, "health" also finds team-health. Front matter's "how igor
ticks" stays out of every topic: it is on 66 posts, from sleep to the AI policy.
"""

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List

POST_TAGS_PATH = Path(__file__).parent / "topics.json"


@dataclass(frozen=True)
class TopicRule:
    words: frozenset = frozenset()
    tags: frozenset = frozenset()
    not_tags: frozenset = frozenset()

    def matches(self, tag: str) -> bool:
        if tag in self.not_tags:
            return False
        return tag in self.tags or bool(self.words & set(tag.split("-")))


def _rule(words: str = "", tags: str = "", not_tags: str = "") -> TopicRule:
    return TopicRule(
        frozenset(words.split()), frozenset(tags.split()), frozenset(not_tags.split())
    )


# The slugs are a contract with the Grabber app's hold-to-pick menu. The rules
# live in topic_rules.json so tools/backlinks (Rust) reads the same ones.
TOPIC_RULES_PATH = Path(__file__).parent / "topic_rules.json"
TOPIC_RULES: Dict[str, TopicRule] = {
    slug: _rule(rule.get("words", ""), rule.get("tags", ""), rule.get("not_tags", ""))
    for slug, rule in json.loads(TOPIC_RULES_PATH.read_text(encoding="utf-8")).items()
}


def normalize_tag(tag: str) -> str:
    return re.sub(r"\s+", "-", tag.strip().lower())


def topics_for_tags(tags: Iterable[str]) -> List[str]:
    """The topic slugs these tags fall in, sorted so the output is stable."""
    normalized = {normalize_tag(tag) for tag in tags}
    return sorted(
        slug
        for slug, rule in TOPIC_RULES.items()
        if any(rule.matches(tag) for tag in normalized)
    )


def load_post_tags(path: Path = POST_TAGS_PATH) -> Dict[str, List[str]]:
    """Map post URL to its topics.json tags; {} when the file is missing or bad."""
    try:
        posts = json.loads(Path(path).read_text(encoding="utf-8"))["posts"]
        return {url: post.get("tags", []) for url, post in posts.items()}
    except (OSError, ValueError, KeyError, AttributeError) as e:
        print(f"WARNING: no topics.json tags for random topics ({path}): {e}")
        return {}
