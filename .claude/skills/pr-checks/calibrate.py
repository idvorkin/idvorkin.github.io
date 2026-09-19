#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = []
# ///
"""Calibrate the Jev thresholds in pr_checks.py against real prose.

Three groups:
  human      — posts Igor wrote before LLMs existed (`_posts/` dated ≤ 2019)
  ai-assist  — recent posts that self-declare `ai-slop.html percent >= 50`
  synthetic  — deliberately AI-patterned paragraphs written as negative fixtures

A threshold is only defensible if the human group sits below it and the
synthetic group sits above it. If the two overlap, the check cannot
discriminate and must ship advisory — say so rather than picking a number.

    ./calibrate.py            # all three groups
    ./calibrate.py --limit 5  # cheaper pass

Costs about half a cent for the full run. Sends post bodies to Jev, so this is
public-blog content only.
"""

import argparse
import json
import re
import statistics
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from pr_checks import (  # noqa: E402
    JEV_KEYS,
    JEV_QUESTIONS,
    chunk_text,
    jev_ask,
    jev_key,
    split_post,
    worst,
)

# Written for this calibration: each paragraph is built from the patterns
# `content_guidelines.md` tells writers to avoid. They are fixtures, not prose
# anyone should imitate.
SYNTHETIC = {
    "synthetic-emphasis": """
Journaling stands as one of the most powerful tools in the modern productivity
landscape. It's important to note that the practice serves as a foundation for
self-awareness, highlighting the importance of reflection in our daily lives.
Additionally, research underscores its significance for mental clarity.
Furthermore, the habit plays a vital role in helping individuals navigate the
complexities of an increasingly demanding world. Moreover, it captivates both
beginners and seasoned practitioners alike.
""",
    "synthetic-promotional": """
Nestled within the breathtaking world of personal development, habit tracking
has emerged as a truly remarkable hidden gem. This must-try approach boasts a
wide array of benefits, offering a rich tapestry of insights for anyone looking
to delve into their routines. It's worth mentioning that the system is very
unique, particularly noteworthy for its highly significant impact on long-term
outcomes, demonstrating the value of consistency and showcasing the importance
of small wins.
""",
    "synthetic-hedged": """
In today's fast-paced world, we must consider three key dimensions of rest:
physical, mental, and emotional. Notably, each dimension plays a crucial role in
overall wellbeing. Importantly, the interplay between them is significant.
Significantly, one cannot overstate the importance of balance. This underscores
the need for a holistic framework, emphasizing the value of intentionality and
highlighting the fact that sustainable progress requires deliberate attention to
all three areas simultaneously.
""",
}


def git_lines(*args: str) -> list[str]:
    out = subprocess.run(
        ["git", *args], capture_output=True, text=True, check=False
    ).stdout
    return [line for line in out.split("\n") if line]


def human_posts(root: Path, limit: int) -> list[Path]:
    """Posts dated 2019 or earlier — written before LLM assistance existed."""
    paths = [
        p
        for p in sorted((root / "_posts").glob("*.md"))
        if re.match(r"20(1[0-9])-", p.name)
    ]
    return paths[:limit]


def ai_assisted_posts(root: Path, limit: int) -> list[Path]:
    out = []
    for path in sorted((root / "_d").glob("*.md")):
        m = re.search(
            r"ai-slop\.html\s+percent=\"(\d+)\"", path.read_text(errors="replace")
        )
        if m and int(m.group(1)) >= 50:
            out.append(path)
    return out[-limit:]


def strip_headings(body: str) -> str:
    """Defect injection for `headers`: same prose, no section headers."""
    return "\n".join(
        line for line in body.split("\n") if not re.match(r"#{1,6}\s", line)
    )


def mix_pronouns(body: str) -> str:
    """Defect injection for `voice`: second half switches from 'I' to 'we'."""
    half = len(body) // 2
    tail = body[half:]
    tail = re.sub(r"\bI\b", "we", tail)
    tail = re.sub(r"\bmy\b", "our", tail)
    tail = re.sub(r"\bme\b", "us", tail)
    return body[:half] + tail


def score(text: str, key: str) -> dict[str, float]:
    answers = [
        jev_ask(chunk, JEV_QUESTIONS, key)["answers"] for chunk in chunk_text(text)
    ]
    return {k: worst(answers, k) for k in JEV_KEYS}


def summarize(name: str, rows: list[tuple[str, dict[str, float]]]) -> dict:
    stats = {}
    for check in JEV_KEYS:
        values = sorted(row[1][check] for row in rows)
        stats[check] = {
            "n": len(values),
            "min": round(values[0], 2),
            "median": round(statistics.median(values), 2),
            "max": round(values[-1], 2),
        }
    print(f"\n== {name} (n={len(rows)})")
    for check, s in stats.items():
        print(
            f"   {check:12} min={s['min']:<5} median={s['median']:<5} max={s['max']:<5}"
        )
    worst_rows = sorted(rows, key=lambda r: -r[1]["ai-patterns"])[:3]
    for label, scores in worst_rows:
        print(
            f"      {label:50} " + " ".join(f"{k}={v:.2f}" for k, v in scores.items())
        )
    return stats


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=12, help="posts per repo group")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    key = jev_key()
    if key is None:
        print(
            "no key: set OPENROUTER_API_KEY, or SECRET_BOX to a json holding OPEN_ROUTER_KEY"
        )
        return 2
    root = Path(git_lines("rev-parse", "--show-toplevel")[0])

    groups: dict[str, list[tuple[str, str]]] = {
        "human (pre-LLM _posts)": [
            (p.name, split_post(p).body)
            for p in human_posts(root, args.limit)
            if split_post(p)
        ],
        "ai-assisted (ai-slop >= 50%)": [
            (p.name, split_post(p).body)
            for p in ai_assisted_posts(root, args.limit)
            if split_post(p)
        ],
        "synthetic AI-patterned": list(SYNTHETIC.items()),
    }

    report = {}
    for name, items in groups.items():
        rows = [(label, score(text, key)) for label, text in items]
        report[name] = summarize(name, rows)
        report[name]["rows"] = {
            label: {k: round(v, 2) for k, v in s.items()} for label, s in rows
        }

    print("\n== ai-patterns separation (human max vs synthetic min)")
    human = report["human (pre-LLM _posts)"]
    synth = report["synthetic AI-patterned"]
    gap = synth["ai-patterns"]["min"] - human["ai-patterns"]["max"]
    print(
        f"   ai-patterns  human_max={human['ai-patterns']['max']} "
        f"synthetic_min={synth['ai-patterns']['min']} gap={gap:+.2f}  "
        f"{'separates' if gap > 0 else 'OVERLAPS — ship advisory'}"
    )

    # `headers` and `voice` have no naturally-labeled positive group, so they
    # get a paired test instead: inject the exact defect into a real post and
    # see whether the score moves.
    print("\n== paired defect injection (same post, before -> after)")
    posts = [
        (p.name, split_post(p).body) for p in human_posts(root, 6) if split_post(p)
    ]
    for check, mutate in (("headers", strip_headings), ("voice", mix_pronouns)):
        deltas = []
        for label, body in posts:
            before = score(body, key)[check]
            after = score(mutate(body), key)[check]
            deltas.append((label, before, after))
            print(
                f"   {check:8} {label:45} {before:5.2f} -> {after:5.2f}  ({after - before:+.2f})"
            )
        moved = sum(1 for _, b, a in deltas if a > b + 0.25)
        clean_max = max(b for _, b, _ in deltas)
        broken_min = min(a for _, _, a in deltas)
        report[f"paired-{check}"] = {
            "moved": moved,
            "n": len(deltas),
            "clean_max": round(clean_max, 2),
            "broken_min": round(broken_min, 2),
        }
        print(
            f"   {check}: score rose on {moved}/{len(deltas)}; clean_max={clean_max:.2f} "
            f"broken_min={broken_min:.2f} -> "
            f"{'separates' if broken_min > clean_max else 'OVERLAPS — ship advisory'}\n"
        )

    if args.json:
        print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
