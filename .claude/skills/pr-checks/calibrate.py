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
import time
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import jev_judge as jev  # noqa: E402
import pr_checks as pc  # noqa: E402

JEV_KEYS = jev.JUDGMENT_KEYS

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
    return jev.judge(text, key).scores


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


# --- doubled checks: Jev against the code checks it duplicates ----------------


# Each mutation introduces exactly the failure its code check looks for, so a
# check with too few natural failures in the corpus still gets measured.
def inject_front_matter(doc: str) -> str:
    return re.sub(r"(?m)^tags:\s*$\n(?:\s+-\s+.*\n)+", "", doc, count=1)


def inject_internal_links(doc: str) -> str:
    return re.sub(r"\]\(/([a-z0-9-]+)\)", r"](https://idvork.in/\1)", doc, count=1)


def inject_opening(doc: str) -> str:
    head, sep, body = doc.partition("\n---\n")
    return f"{head}{sep}\n## Straight into a heading\n\n{body.lstrip()}"


def inject_alerts(doc: str) -> str:
    head, sep, body = doc.partition("\n---\n")
    return f'{head}{sep}\n{{% include alert.html content="Heads up" style="warning" %}}\n\n{body.lstrip()}'


def inject_ai_slop(doc: str) -> str:
    head, sep, body = doc.partition("\n---\n")
    return f'{head}{sep}\n{{% include ai-slop.html percent="70" %}}\n\n{body.lstrip()}'


def inject_images(doc: str) -> str:
    return doc.rstrip() + (
        "\n\n![a raccoon](https://github.com/idvorkin/blob/raw/master/blog/racoon.webp)\n"
    )


def inject_books(doc: str) -> str:
    return (
        doc.rstrip()
        + "\n\nI read [Essentialism](https://www.amazon.com/dp/0804137382).\n"
    )


INJECTIONS = {
    "front-matter": inject_front_matter,
    "internal-links": inject_internal_links,
    "opening": inject_opening,
    "alerts": inject_alerts,
    "ai-slop": inject_ai_slop,
    "images": inject_images,
    "books": inject_books,
}


def code_verdict(
    path: Path, root: Path, maps, text: str | None = None
) -> dict[str, str]:
    """Run the code checks over `path`, optionally against substituted text."""
    permalinks, redirects = maps
    if text is None:
        post = pc.split_post(path)
    else:
        tmp = root / ".pr-checks-calibrate.md"
        tmp.write_text(text)
        try:
            post = pc.split_post(tmp)
            post.path = path  # collection carve-outs key off the directory
        finally:
            tmp.unlink()
    if post is None:
        return {}
    return {
        "front-matter": pc.check_front_matter(post).status,
        "internal-links": pc.check_internal_links(post, permalinks, redirects).status,
        "opening": pc.check_opening(post).status,
        "alerts": pc.check_alerts(post).status,
        "images": pc.check_images(post).status,
        "books": pc.check_books(post).status,
        "ai-slop": pc.check_ai_slop(post).status,
    }


def ask_doubled(
    document: str, key: str, extra: dict | None = None
) -> tuple[dict, float]:
    questions = {**jev.DOUBLED_QUESTIONS, **(extra or {})}
    answers = []
    cost = 0.0
    for piece in jev.chunk(document):
        response = jev.ask(piece, questions, key)
        answers.append(response["answers"])
        cost += float(response.get("usage", {}).get("cost", 0) or 0)
    out = {}
    for k in questions:
        pool = answers[:1] if k in jev.POSITIONAL else answers
        out[k] = jev.worst(pool, k, "noul")
    return out, cost


def redirect_table(root: Path) -> str:
    _, redirects = pc.site_url_maps(root)
    return ", ".join(sorted(redirects))


REDIRECT_QUESTION = {
    "internal-links-with-table": {
        "type": "noul",
        "instructions": (
            "The header lists this blog's redirect URLs. Does this post link to any of "
            "them, instead of to the page's own permalink? Also answer yes if a link "
            "writes out the full https://idvork.in hostname."
        ),
    }
}


def doubled_report(root: Path, key: str, limit: int) -> int:
    posts = sorted(
        [p for d in pc.POST_DIRS for p in (root / d).glob("*.md")], key=lambda p: p.name
    )
    maps = pc.site_url_maps(root)

    # Stratify: keep posts the code fails on, so natural failures are represented.
    natural, seen_fail = [], set()
    for path in posts:
        verdict = code_verdict(path, root, maps)
        fails = {k for k, v in verdict.items() if v == "fail"}
        if (fails - seen_fail) or len(natural) < limit:
            natural.append((path, verdict))
            seen_fail |= fails
        if len(natural) >= limit * 2:
            break

    rows: dict[str, dict[str, int]] = {
        k: dict.fromkeys(("tp", "fp", "tn", "fn"), 0) for k in jev.DOUBLED_KEYS
    }
    cost = 0.0
    started = time.time()
    calls = 0
    seen_nouls: dict[Path, dict[str, float]] = {}
    print(f"== natural corpus sample (n={len(natural)}), one call per post")
    for path, verdict in natural:
        document = f"File: {path.relative_to(root)}\n" + path.read_text(
            errors="replace"
        )
        nouls, c = ask_doubled(document, key)
        cost += c
        calls += len(jev.chunk(document))
        seen_nouls[path] = nouls
        for k in jev.DOUBLED_KEYS:
            code_fail = verdict[k] == "fail"
            jev_fail = nouls[k] >= jev.THRESHOLDS[k]
            rows[k][
                "tp"
                if code_fail and jev_fail
                else "fn"
                if code_fail
                else "fp"
                if jev_fail
                else "tn"
            ] += 1

    print("\n== defect injection into clean posts")
    clean = [p for p, v in natural if not any(x == "fail" for x in v.values())][:5]
    if len(clean) < 5:
        clean = [p for p, _ in natural][:5]
    for check, mutate in INJECTIONS.items():
        hits = broke = 0
        for path in clean:
            text = mutate(path.read_text(errors="replace"))
            if code_verdict(path, root, maps, text).get(check) != "fail":
                continue  # the mutation did not actually break the code check
            broke += 1
            document = f"File: {path.relative_to(root)}\n" + text
            nouls, c = ask_doubled(document, key)
            cost += c
            calls += 1
            caught = nouls[check] >= jev.THRESHOLDS[check]
            hits += caught
            rows[check]["tp" if caught else "fn"] += 1
        print(f"   {check:16} injected defect caught {hits}/{broke}")

    print("\n== agreement with the code check (code is ground truth)")
    print(f"   {'check':16}{'agree':>8}{'miss (FN)':>12}{'false alarm (FP)':>19}")
    for k in jev.DOUBLED_KEYS:
        r = rows[k]
        n = sum(r.values())
        fails, passes = r["tp"] + r["fn"], r["fp"] + r["tn"]
        agree = (r["tp"] + r["tn"]) / n if n else 0
        fn = r["fn"] / fails if fails else float("nan")
        fp = r["fp"] / passes if passes else float("nan")
        print(
            f"   {k:16}{agree:>7.0%}{fn:>11.0%} ({r['fn']}/{fails}){fp:>13.0%} ({r['fp']}/{passes})"
        )

    table = redirect_table(root)
    print(
        f"\n== internal-links, with the redirect table handed to Jev ({len(table)} chars)"
    )
    subset = [(p, v) for p, v in natural if v["internal-links"] in ("fail", "pass")][
        :10
    ]
    without = sum(
        (seen_nouls[p]["internal-links"] >= 0.5) == (v["internal-links"] == "fail")
        for p, v in subset
    )
    right = 0
    for path, verdict in subset:
        document = (
            f"File: {path.relative_to(root)}\nRedirect URLs on this blog: {table}\n"
            + path.read_text(errors="replace")
        )
        nouls, c = ask_doubled(document, key, extra=REDIRECT_QUESTION)
        cost += c
        calls += len(jev.chunk(document))
        jev_fail = nouls["internal-links-with-table"] >= 0.5
        right += jev_fail == (verdict["internal-links"] == "fail")
    print(
        f"   agrees with code on {right}/{len(subset)} — same posts without it: {without}/{len(subset)}"
    )

    print(f"\n== {calls} calls, ${cost:.4f} total, {time.time() - started:.0f}s wall")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=12, help="posts per repo group")
    parser.add_argument("--json", action="store_true")
    parser.add_argument(
        "--doubled",
        action="store_true",
        help="Instead: score Jev against the code checks it duplicates.",
    )
    args = parser.parse_args()

    key = jev.api_key()
    if key is None:
        print(
            "no key: set OPENROUTER_API_KEY, or SECRET_BOX to a json holding OPEN_ROUTER_KEY"
        )
        return 2
    root = Path(git_lines("rev-parse", "--show-toplevel")[0])
    if args.doubled:
        return doubled_report(root, key, args.limit)

    groups: dict[str, list[tuple[str, str]]] = {
        "human (pre-LLM _posts)": [
            (p.name, pc.split_post(p).body)
            for p in human_posts(root, args.limit)
            if pc.split_post(p)
        ],
        "ai-assisted (ai-slop >= 50%)": [
            (p.name, pc.split_post(p).body)
            for p in ai_assisted_posts(root, args.limit)
            if pc.split_post(p)
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
        (p.name, pc.split_post(p).body)
        for p in human_posts(root, 6)
        if pc.split_post(p)
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
