---
layout: post
title: "Eval-Driven Hill Climbing: Let the Agent Do the Search"
permalink: /hill-climbing
imagefeature: /images/raccoon-hill-climbing.webp
tags:
  - ai
  - tools
  - how
redirect_from:
  - /eval-hill-climb
  - /hillclimb
---

Hill climbing is the oldest trick in optimization: start somewhere, try a small change, keep it if the score went up, throw it out if it didn't, repeat. In the AI era the algorithm is the same; the interesting shift is who's doing the climbing. If you can write a fitness function sharp enough to separate good from bad, the coding agent will run the loop for you. You set the mountain; the agent walks up it.

{% include ai-slop.html percent="85" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The pattern](#the-pattern)
- [Why this matters now](#why-this-matters-now)
- [Worked examples](#worked-examples)
  - [Chroma-key: clean transparent backgrounds](#chroma-key-clean-transparent-backgrounds)
  - [Soprano: tune a voice prompt with a model-as-judge](#soprano-tune-a-voice-prompt-with-a-model-as-judge)
- [Your other job: build evals](#your-other-job-build-evals)
- [When it works, when it doesn't](#when-it-works-when-it-doesnt)
- [Hill climbing compounds](#hill-climbing-compounds)
- [Close the loop](#close-the-loop)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include local_image_float_right.html src="raccoon-hill-climbing.webp" %}

## The pattern

Four pieces, and three of them are the agent's problem, not yours:

1. **A fitness function.** A small number (or a weighted combination of numbers) that goes up when the output gets better. Cheap to compute. Hard to game. This is the one piece you have to get right.
2. **A baseline.** Whatever you're starting from. Score it. Now you have a number to beat.
3. **A proposal step.** Try a variant — a different prompt, a tighter fuzz, a new parameter. The agent picks the step. Prefer a small diff against the running best over a full rewrite; diffs are easier to reason about when the score moves, and easier to back out when it doesn't.
4. **A keep/reject rule.** Score the new variant. Keep it if it beat the running best; throw it away if it didn't.

Loop until the score plateaus or you run out of budget. That's it. The classical literature calls this greedy local search, and assumes blind perturbation. With an LLM picking the steps, it converges faster than that: the agent reads the eval output and makes an educated guess about what to try next.

**Budget and termination.** "Run out of budget" is doing real work in that sentence. Decide upfront what you'll spend — a token cap, a wall-clock cap, or a max-iterations cap — and decide what counts as a plateau (e.g., three consecutive attempts without improving the running best). Without a stopping rule the agent will keep climbing past the point where it has anything left to gain.

**Log the trajectory.** Each attempt should write its parameters, its score, and the agent's one-line rationale to a file the climb appends to. The climb itself isn't deterministic — same prompt, same eval, different runs will explore different branches — so the log is the only record of how _this_ winner was found. It's also the first thing you read when the climb plateaus below where you expected; the shape of the trajectory usually tells you whether you're stuck on a ridge or whether the eval is measuring the wrong thing.

## Why this matters now

Before agents, hill climbing was a human loop. You'd write the metric, run the experiment, read the result, type the next prompt, run it again. The inner loop ran at human speed — minutes per iteration, and you were on the hook for every step. The cost of being in the loop made you cheap with experiments.

With an agent in the loop, the inner loop runs at agent speed. Ten iterations per minute, all night if you want. Your role collapses to two moments:

- **Upfront:** define the fitness function and seed the first attempt.
- **After:** look at the final result, spot-check the regressions, decide if the plateau is the real ceiling or if you need a different mountain.

Everything in between is the agent's problem. The speedup mostly comes from not paying the context-switching cost of being in the loop, not from the agent thinking faster than you would. An overnight run of fifty attempts isn't exotic; it just requires that you're not the rate-limiter.

## Worked examples

Two live explainers on [the explainers page](/explainers) walk through the full loop end-to-end. Both are short enough to read in a sitting.

### Chroma-key: clean transparent backgrounds

I wanted raccoon characters with transparent backgrounds. The AI image generator I use can't emit transparent PNG images, so I render on magenta and chroma-key it out locally. The naive one-liner (`-fuzz 30% -transparent #FF00FF`) produces images that look clean on a white page but have thousands of invisible holes in the interior.

The fitness function: extract the alpha channel, count residual magenta pixels, count interior holes, weight residual 5× (a pixel of pure magenta is obvious; a transparent pixel in fur isn't). Six attempts later, the score went from 17,385 to 269 — a 65× improvement. The winner was a two-stage `flood4 → tight-fuzz 3%` pipeline.

[**Chroma-key hill-climbing**](https://idvorkin-ai-tools.github.io/chroma-key-explainer/) — the full trajectory table with each step's delta against the running best, per-attempt deep dives, and the moment where a deliberately different algorithm (a "structural detour" — a big, non-incremental change to sanity-check we were climbing the right mountain) failed identically to baseline, which tied the whole story together.

### Soprano: tune a voice prompt with a model-as-judge

I wanted a Gemini TTS prompt that sounds like Tony Soprano. The fitness function is harder here — timbre, pacing, menace, nasal quality don't reduce to pixel counts. The trick: use a different Gemini model (`gemini-3.1-pro-preview`) as the judge. It accepts audio input, scores the result on a dimensional scorecard, and emits directives the generator can act on.

v1 plateaued at 4/10 because the naive loop kept appending new directives without reconciling contradictions between rounds. v2 added a base-voice sweep, single-slot replacement, a regression guard, and early stop. Final: 6/10 — the theoretical ceiling without speaker cloning. Most of the gain came from a base-voice swap _before_ any prompt tuning, which is a reminder that you can't climb above the mountain you're on.

[**Soprano iteration**](https://idvorkin-ai-tools.github.io/larry-voice-samples/soprano-iteration.html) — full score trajectory, the tournament rounds, and the moment the regression guard reverted a candidate that gained nasal quality at the cost of pitch authority.

## Your other job: build evals

The optimization literature calls it a **fitness function** — the scoring rule that turns one output into one number. LLM-land calls it an **eval**, and in practice an eval bundles the scoring rule with a **test set** of representative inputs, so you're scoring across cases, not one-shot. Old-school engineering called the bundle a **test suite**. Building the eval means building both halves — the rule _and_ the cases. Neither half is the job; the bundle is.

Concretely, in the chroma-key example: the fitness function is `residual × 5 + holes` (per image); the test set is the two images (`case-sparse` + `case-dense`); the eval is the function applied to both cases, summed. Drop either half and the whole thing collapses — a rule with no cases has nothing to score; cases with no rule is just vibes.

I've argued the weight of this across the blog already: [Chop](/chop#what-matters-most-is-testingevals) and [how I chop](/how-igor-chops#testing-and-evals) put evals as the bottleneck skill in AI-assisted coding. [AI developer](/ai-developer#3-your-secret-sauce-is-the-evals-then-the-training-data---your-prompt-has-no-economic-value) goes further: the evals are the moat, the prompt has no economic value. [AI testing](/ai-testing#eval-systems) is the practical playbook — PromptFoo, live dashboards, test sets.

A sharp eval has properties on both halves:

**The scoring rule:**

- **Cheap.** Under a second to compute. If you're spending minutes scoring each attempt, the agent can't climb.
- **Unambiguous.** Two runs on the same output return the same score. LLM judges are fine if you've pinned the prompt and the model version.
- **Aligned with what you actually want.** The easy trap: pick a metric that's easy to measure but doesn't predict the real outcome. If residual magenta goes to zero but interior holes explode, the agent will happily hill-climb to a worse result.
- **Weighted the right way.** Residual magenta mattered 5× more than interior holes in the chroma-key case because one failure mode is obvious and the other is invisible. Get the weights wrong and the climb goes to the wrong peak.

**The test set:**

- **Covers the failure modes you care about.** Every distinct way the output can be wrong needs at least one case that provokes it. Case-sparse and case-dense failed differently, so both had to be in the set — tuning on one would have silently regressed the other.
- **Small enough to run every iteration.** If the set takes an hour, the agent doesn't climb. Keep the hot loop tight; run the bigger held-out set only occasionally.
- **Stays stable.** Adding new cases mid-climb resets your baseline. Freeze the set before the climb starts; grow it deliberately between climbs.

If either half is wrong, no amount of agent cleverness will save you. The agent will dutifully climb the hill you described, not the hill you wanted.

The corollary: when the output of a climb disappoints, the first question isn't "did the agent try hard enough?" It's "is my eval measuring the thing I care about, across the cases that actually matter?" Most failures are eval failures, and most eval failures are test-set failures, not rule failures.

**Sanity-check the eval before you burn budget.** Hand-score three outputs — a known-good, a known-bad, and one you're unsure about — then run the eval on the same three. If the rankings don't match yours, the eval is wrong and the climb will go sideways. Fix the eval before the agent spends a single token climbing it.

## When it works, when it doesn't

It works when:

- You can score attempts mechanically (pixel counts, latency, cost, pass/fail on a test set).
- You can score attempts with a model-as-judge where the judge is consistent (voice quality, prose quality, adherence to a style guide).
- The change-per-step is small enough that a merely-plausible direction is good enough. The agent will do better than random, but hill climbing is still local search — it doesn't do structural leaps well, and no amount of agent cleverness changes that.

It stops working when:

- The global optimum is far from the starting point and separated by ridges the climb can't see. Ship a structural detour occasionally (the `cc_border` attempt in the chroma-key climb) to sanity-check you're on the right mountain.
- The fitness function has a local optimum that doesn't match the real goal. Sweep a held-out metric even if you're not optimizing for it — watch for it silently regressing.
- The agent starts reward-hacking the metric. If the score keeps going up but the output looks worse, the metric is what's broken, not the output.

**Worked example — the image at the top of this post.** Generating this page's raccoon illustration ran into all of these. The [flood4 chroma-key recipe](https://idvorkin-ai-tools.github.io/chroma-key-explainer/) assumes every image corner is chroma-background; Gemini rendered a grass hill extending to the bottom image edges, so two corners were grass, not magenta. Flood-fill started from grass at 30% fuzz and ate the raccoon. Alpha-coverage metric: 3%. The instinct "tune the fuzz" was wrong — dropping to 5% still started from grass, just covered less ground. The right moves were (a) fix the input: reprompt for a solid magenta border on all four sides; (b) fix the algorithm: instead of flooding from the four corners blindly, scan the image-border ring and seed the flood only from pixels that are actually near-magenta. The algorithmic fix recovered the original failing image at 66% alpha coverage without touching the prompt. **When the output is bad, check the algorithm's assumptions before tuning its knobs.**

## Hill climbing compounds

[Compound engineering](/ai-operator#youre-a-compound-engineer) is the operator-side version of this post: every session with an AI teaches you something, and the operators who capture those learnings — via retros, CLAUDE.md updates, codified skills — are investing in the operator they'll be next month. The interest compounds.

Hill climbing is the same pattern at the algorithm level. Rejected variants get thrown away — that's greedy local search — but the artifacts that matter accumulate:

- **Within one climb**, the running best is cumulative. Each attempt branches from the current champion and asks "can I beat this?" The losing variants get dropped, but their _lesson_ often survives in the agent's context — a failed attempt rules out a direction for the next one. That's a compounding process, even though most of the individual outputs are discarded.
- **Across climbs**, the fitness function is the reusable asset. Once you have a sharp eval for "good transparent raccoon," you don't re-derive it for the next image-processing problem — you adapt it. The eval is the investment; the climbs are the dividends.
- **Post-climb**, the winner becomes infrastructure. The chroma-key recipe lives in the [`gen-image`](https://github.com/idvorkin/chop-conventions/tree/main/skills/gen-image) skill; the eval runs automatically on every new generation. A problem you solved once keeps solving itself, and every new image arrives pre-verified.

Compound engineering says: **the second time you do something manually, you're leaving compound interest on the table.** Hill climbing says the same thing about algorithms: the second time you tune a parameter by hand, you're running the agent's job yourself. Write the eval, hand it off, and let the interest accrue.

## Close the loop

The climb is the search — but the winning recipe is just a file on disk unless you wire it into your workflow. In the chroma-key case, the winning two-stage pipeline is codified in my [`gen-image` skill](https://github.com/idvorkin/chop-conventions/tree/main/skills/gen-image), and the skill now runs `eval.py` automatically at the end of every generation. Every new image ships with its metrics card; if a future model update regresses interior holes, the alarm fires on the first bad image, not three weeks later when someone notices pinholes in a dark-mode render.

That's the full loop: once the fitness function is sharp, the agent climbs; once the climb finishes, the same fitness function becomes a regression guard on every subsequent output. The human writes the number. The agent does the search. The eval watches the regression. Set it and leave it running.

Related: [AI developer](/ai-developer#3-your-secret-sauce-is-the-evals-then-the-training-data---your-prompt-has-no-economic-value) — why evals are the real moat. [AI testing](/ai-testing#eval-systems) — the practical playbook (PromptFoo, test sets, live dashboards). [Chop](/chop#what-matters-most-is-testingevals) and [how Igor chops](/how-igor-chops#testing-and-evals) — evals as the bottleneck skill in AI-assisted coding. [Explainers](/explainers) — ship an interactive artifact alongside the climb. [AI cockpit](/ai-cockpit) — how the parallel-agent setup makes long climbs cheap. [AI-native manager](/ai-native-manager#appendix-new-words-for-a-new-world) — where this term lives in the glossary.
