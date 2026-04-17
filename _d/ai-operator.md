---
layout: post
title: "The AI Operator: Learning to Drive the Machine"
permalink: /ai-operator
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-operator.webp
tags:
  - ai
  - how
redirect_from:
  - /operator
---

Using AI well is a skill, like driving a car or operating heavy machinery. Nobody hands you the keys to a forklift and says "figure it out." There's a license, training, and hard-won intuition about what the machine can and can't do. AI is the same — except most of us skipped the training, there is no manual, and we're writing the rules as we go.

The meta-skill is _always be learning and improving_. Operating AI is a new skill, and like any new skill it feels slower than the old way at first. The first time you drove a stick shift, you stalled at every light and your old automatic felt like a dream. Operating AI is the same: in the moment it feels slower, and for the task in front of you it often _is_ slower. The win isn't in this task — it's in the next hundred, when you've built the intuition and you're running three agents in parallel while your old self would still be on task one.

The operators who get better aren't the ones who just practice. They're the ones who capture what they learned, fold it into how they work, and show up tomorrow a little sharper than yesterday. The rest of this post is the methods I use to do that.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [You Have a Finite Number of Thinking Tokens](#you-have-a-finite-number-of-thinking-tokens)
- [You Need to Get On the Loop](#you-need-to-get-on-the-loop)
- [You Pick the Review Gate](#you-pick-the-review-gate)
- [You Need to Use Voice](#you-need-to-use-voice)
- [You Can Throw It Away](#you-can-throw-it-away)
- [You Ship Good Enough, Then Hill-Climb](#you-ship-good-enough-then-hill-climb)
- [You're a Compound Engineer](#youre-a-compound-engineer)
- [Where Learnings Live](#where-learnings-live)
- [Writing Prompts That Don't Leak Thinking](#writing-prompts-that-dont-leak-thinking)
- [The Skills I Use](#the-skills-i-use)
- [A Note on Companion AIs](#a-note-on-companion-ais)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include blob_image_float_right.html src="blog/raccoon-operator.webp" %}

{% include ai-slop.html percent="85" %}

## You Have a Finite Number of Thinking Tokens

_Skills: [things you love](/balloon) · [things good for you](/four-healths) · [`delegate-to-other-repo`](https://github.com/idvorkin/chop-conventions/blob/main/skills/delegate-to-other-repo/SKILL.md)_

You've had this happen. You're in the middle of making changes — momentum, focus, real progress — and the AI hits its token limit. "Start a new conversation," it says. The context you'd been building together is gone. You're stuck until the window resets.

Now imagine that's your brain. Because it is. You wake up with a finite budget of deep thinking — your own context window — and every hard decision, every careful code review, every "wait, is this actually right?" burns through it. By 10am you're sharp. By 3pm the model in your skull starts forgetting context, repeating itself, missing things it would have caught in the morning. By evening you're done. You're stuck until sleep resets you.

Simon Willison [said it plainly](https://simonwillison.net/2026/Apr/2/lennys-podcast/): running four agents in parallel left him "wiped out by 11 AM." _"There's a limit on human cognition regardless of how fast agents work."_ AI is supposed to make us more productive, but the people most AI-pilled are working harder than ever.

The point of AI is to extend what you can get done in a day. If you spend your thinking tokens _supervising_ the AI instead of _directing_ it, you haven't saved anything — you've traded one kind of exhaustion for another. The rest of this post is how to actually spend them right.

## You Need to Get On the Loop

_Skills: [`show-your-work`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/show-your-work/SKILL.md) · [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md) · [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md)_

Working with an AI agent always looks the same: there's a loop. The AI tries something. Something checks whether it worked. If not, adjust and try again. Repeat until it's good. Coding, writing, anything — every interaction with an agent is some version of try → check → fix → try.

The question is who's doing the checking. When you're _in_ the loop, that's you. You're reading every line, running the tests yourself, watching each step, deciding whether to keep going or course-correct. When you're _on_ the loop, the AI does the checking — it runs its own tests, validates its own output, decides what to fix — and you do the final review when it hits a checkpoint you defined.

Pay attention to which mode you're in. That's the whole game. The military has real doctrine for this: [DoD Directive 3000.09](https://en.wikipedia.org/wiki/Human-in-the-loop) on autonomous weapons defines ["human in the loop"](https://en.wikipedia.org/wiki/Human-in-the-loop) (a person approves each action) versus "human on the loop" (the system acts, a person monitors and can intervene). Every moment as an AI operator, one of those is true. Most of us have no idea which.

**The goal is to get on the loop.** In-the-loop is a zillion times slower, and it burns your thinking tokens on the _process_ instead of the _output_. You're not in the loop because you want to be — you're in the loop because you haven't figured out how to get out yet. That's the real job: figure out how to get out.

You start in the loop when you have no choice:

- High-stakes decisions (deploying to prod, sending to customers)
- Novel problems where the AI might go sideways
- Bootstrapping work where you lack degrees of freedom — getting auth working, nailing down a specific integration, anything where the AI can't iterate without your input

Fine. Be fully in. Read every line. But while you're in, your real job isn't just to ship the task — it's to learn enough to climb out. What does "good" look like here? What are the guardrails? What checkpoints can I define? Once you can answer those, move up to on-the-loop: check results, not process. Define your checkpoints, let go between them, come back when the AI hits one. That's when the economics start working in your favor — parallel agents, delegated drafting, you directing instead of typing.

The trap: it's easy to slip into the loop without noticing. You'll think you're on the loop (efficient, trusting), but you're actually _neither_ — half-watching, catching nothing, burning thinking tokens on anxiety instead of judgment. You pay the cost of supervision without the benefit of attention. So keep checking which side you're on. If you can't answer it instantly, you've already drifted.

The operator skill: always know which mode you're in, and always be working your way up. If you're in, be fully in — and look for your exit. If you're on, define your checkpoints and actually let go. Never hover.

## You Pick the Review Gate

_Skills: [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md)_

On-the-loop doesn't mean the same thing for every task. You pick _where_ the review happens, based on what's at risk and where the check is cheapest. Three gates:

| Gate                                  | When it fits                                                                                                  | How the check happens                                                                                                                                           | Real examples                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Output** — the product is the check | Artifact renders its own errors. Regeneration is cheap. No side effects on my machine.                        | Render, look, re-run if off. Throw-away is free.                                                                                                                | [Explainers](/explainers) (chroma-key, monitor, dolt). Generated images. Most blog prose.                                                                                                                                                                                                                                                                                                                                                                                    |
| **Code** — every line before it runs  | Code runs on my machine or in my name. Privileges, secrets, network, anything hard to undo.                   | Branch protection on `idvorkin/*`. My merge is the gate. Async triage on `idvorkin-ai-tools/*` via [GitHub Views](/ai-cockpit#github-views---the-triage-queue). | Skills in `chop-conventions` ([`toc`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/toc/SKILL.md), [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md), [`learn-from-session`](https://github.com/idvorkin/chop-conventions/blob/main/skills/learn-from-session/SKILL.md)). [`y.py`](https://github.com/idvorkin/settings/blob/main/py/y.py) yabai helper. Jekyll plugins for this blog. |
| **Plan** — design, not implementation | Bugs are cheap at the design layer and expensive after. Novel problems, big refactors, high-commitment infra. | [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md) iterates the spec until it converges. Then code.  | [`/hill-climbing`](/hill-climbing) (spec iterated before the post was written). The [`pick-links` scrollback plan](https://github.com/idvorkin/settings/blob/main/docs/superpowers/plans/2026-04-12-scrollback-link-picker.md).                                                                                                                                                                                                                                              |

**Output gate — the product is the check.** Work where the artifact surfaces errors just by rendering: explainers, generated images, most blog prose. Iteration is cheap, rollback is a delete. I ship, I look, I re-run if it's off. You're on the loop the moment you see the output.

**Code gate — review every line before it runs.** Code that executes on my machine with side effects I can't easily undo: skills, scripts, tools, anything touching `~/.claude/`. Here the gate is _built into GitHub's permission model, not my discipline_. Two repo modes, two behaviors:

- **Human-owned (`idvorkin/*`)** — branch protection requires review and passing CI. The agent pushes to its fork, opens a PR, can't merge. My merge click is the gate.
- **Agent-owned (`idvorkin-ai-tools/*`)** — no protection. The agent ships directly. I catch up asynchronously via the [GitHub Views triage queue](/ai-cockpit#github-views---the-triage-queue).

Where a new repo lives is a vote on the gate. Under `idvorkin-ai-tools/*` means "agent ships, I triage async." Under `idvorkin/*` means "I review every PR." The decision happens at `gh repo create` time, not at ship time. "I'll remember to review it" is a promise you break at 10pm on a Tuesday; branch protection is the button you can't turn off when tired.

Skills get this for free. They live in `idvorkin/chop-conventions` — edits go through PR, merged versions install via symlink into `~/.claude/skills/`. The gate fires **once per change at authoring time**, not once per invocation. Cheaper than re-reading the same skill every time an agent fires it.

**Plan gate — review the design, not the implementation.** Work where bugs are cheap at the design layer and expensive afterward: novel problems, big refactors, high-commitment infrastructure. Spec gets iterated until [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md) converges, _then_ implementation begins. Reviewing 200 lines of spec to catch a missing requirement beats reviewing 2000 lines of code to find the same bug shipped.

**The failure mode is picking the wrong gate.** Code-gating a 400-line AI generation (you'll skim, miss things — should have been output-gate with a throwaway policy). Output-gating code that runs on your machine (it already ran; you're reading it post-hoc as forensics). Match the gate to the blast radius. "Review everything" isn't on-the-loop — it's in-the-loop wearing a tie.

## You Need to Use Voice

_Skills: [Wispr Flow & SuperWhisper](/ai-cockpit#voice-input---the-primary-interface)_

You've had this moment. You're typing out a long email to get someone to do something — explaining the request for the third time after some back-and-forth, watching the miscommunication compound — and you stop and think: _oh, I should just call them._ Two minutes on the phone solves what twenty minutes of email couldn't.

The same thing happens with AI agents. Voice changes how you communicate. When you talk you ramble, you backfill, you mention the constraint that "obviously" doesn't matter — and half the time it's the constraint that mattered most. Writing makes you compress, edit, prune. The result: when you type, the AI is solving the problem you wrote down; when you talk, the AI is solving the problem you actually have.

Three things to do every time:

- **Use voice.** Don't type. Hit the mic and brain dump.
- **Share intent.** Not just the immediate ask — what you're actually trying to accomplish, and why.
- **Share success criteria.** How will you know it landed? What does "done right" look like?

Do those three and the AI stops guessing at the constraints you forgot to mention. You spend less time course-correcting in the loop because you gave the AI the right shape to start with. Next time you're stuck staring at an empty prompt, don't try harder to write it. Talk it out.

## You Can Throw It Away

_Skills: [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md) · [`image-explore`](https://github.com/idvorkin/chop-conventions/blob/main/skills/image-explore/SKILL.md)_

When the AI drives off course, throw it away. Start over. You already got the expensive part — the _learning_ — and the code itself was basically free to generate. The next attempt will be better because you know more now.

This is harder than it sounds, because we're all trained on the old economics. In the old world, code was precious. You wrote every line yourself, you debugged it for an hour, you argued about it in a PR. Of course you got attached. Throwing away two hours of work hurt because those two hours were _expensive_ — you burned real thinking tokens on them.

In AI land, the economics flipped. The code is cheap; the thinking is expensive. If the AI spent 30 seconds generating 400 lines that went sideways, those 400 lines cost you almost nothing to produce — but they'll cost you a _lot_ to untangle. Delete them. Re-prompt with what you learned. The new attempt, informed by what went wrong, will usually land faster than the salvage operation would have.

Worse, rescuing a bad generation is a trap: it pulls you line-by-line back into the loop, burning thinking tokens you can't afford on code the AI could regenerate for free.

Watch for the sunk cost reflex. When you catch yourself trying to rescue a bad generation instead of re-running it, that's the old economics talking. Throw it away. It's free.

## You Ship Good Enough, Then Hill-Climb

_Skills: [`hill-climbing`](/hill-climbing)_

Perfect is the baseline's enemy. You can't hill-climb from nothing — you need a bad version, scored, before there's a hill to walk up. Every minute you spend polishing before that baseline exists is a minute not climbing.

The trap: perfectionism _feels_ like work, but it functions like procrastination. The output is the same — hours disappear, no frog gets eaten, the deadline stays where it was. [Eat That Frog](/frog) is the playbook, same strategies:

- **Slice and dice.** Ship v1 ugly. Then v2. Then v3. The agent only climbs between concrete versions — a ship every iteration beats one perfect release.
- **One oil barrel at a time.** "Done" isn't the finish line. "Done" is the next baseline the agent can score. Aim for the next milestone, not the summit.
- **Single-handle the task.** Don't fork your attention between drafting and polishing. Draft. Ship. Polish gets its own pass after the baseline exists.

Agents make procrastination worse, not better. They run while you stall — so the perfectionist isn't just delaying their own work, they're idling the agent. Eat the frog. Ship ugly. Let the raccoon climb.

## You're a Compound Engineer

_Skills: [`learn-from-session`](https://github.com/idvorkin/chop-conventions/blob/main/skills/learn-from-session/SKILL.md) · [`claude-md-improver`](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management) · [`show-your-work`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/show-your-work/SKILL.md) · [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md)_

Every session with the AI teaches you something — a prompt shape that worked, a constraint you forgot to specify, a place the AI kept going sideways until you spelled out the obvious thing. The operators who get better over time are the ones who _capture_ those learnings instead of letting them evaporate. The ones who don't are running the same mistakes on loop.

This is compound engineering. You're not just shipping the task in front of you; you're investing in the operator you'll be next month. Every retro, every updated CLAUDE.md, every new skill, every workflow you codify is a deposit, and the interest compounds. Six months in, the gap between an operator who keeps a logbook and one who doesn't is enormous.

**Do retros.** At the end of a session — or at least a week — look back and ask one question: _where did I get stuck in the loop?_ What did I have to re-explain three times before the AI got it? Where did I hover because I didn't trust the output? Those moments are pointing at exactly what your next iteration should fix.

**Update your CLAUDE.md.** Whatever you had to re-explain three times, put it in the instructions so you never have to explain it again. [Mine lives in `chop-conventions`](https://github.com/idvorkin/chop-conventions), and it grows every week.

**Upgrade your skills and workflows.** A prompt you ran twice is a prompt that should become a skill. A checklist you followed by hand is a workflow. Two examples from my own stack: [`show-your-work`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/show-your-work/SKILL.md) started as "screenshot the changed blog pages and host them on a gist for the PR description," which I kept typing by hand. [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md) started as "do a full visual walkthrough of the blog to catch regressions." Both used to be 10-minute manual chores. Now they're one word. The second time you do something manually, you're leaving compound interest on the table.

The operator skill: treat every in-the-loop moment as a signal, not a setback. The place you got stuck today is the place you're about to automate away tomorrow — and _that_ is how you climb out of the loop for good.

The same compounding logic applies to algorithms, not just operator skills. [Eval-driven hill climbing](/hill-climbing) lets an agent climb on top of its own previous best run after run; the winning recipe then becomes infrastructure, and the eval becomes a regression guard on every future output. You do the compounding; the agent does the climbing.

## Where Learnings Live

_Skills: [`learn-from-session`](https://github.com/idvorkin/chop-conventions/blob/main/skills/learn-from-session/SKILL.md)_

Every learning belongs in one of three places. Getting the routing right is half the value — a rule filed as memory never fires, a skill filed as a rule is a wall of text the model skims past.

- **Memory** (`~/.claude/projects/<repo>/memory/`) — facts about you, feedback you've already given, project state, pointers to external systems. Things that should color the next conversation but don't need to fire as a rule. "Igor prefers single quotes in this include." "The bd database lives here." Reference material, not instructions.
- **CLAUDE.md** — rules that fire on every session. `global.md` for things true on every machine ("don't use `claude-agent-sdk` for batch extraction — 17× the cost"). Project `CLAUDE.md` for repo-specific rules ("always use permalinks, not redirect URLs"). One-liners. If it has steps, it's not a rule — it's a skill.
- **Skills** (`~/.claude/skills/` for personal, `chop-conventions/skills/` for shared) — executable recipes with steps, scripts, flags. The thing that would take three bash commands and two judgment calls. The [`toc`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/toc/SKILL.md) skill regenerates a TOC matching my nvim plugin's slug rules. A rule can't do that. A recipe can.

Don't trust yourself to remember. The [`learn-from-session`](https://github.com/idvorkin/chop-conventions/blob/main/skills/learn-from-session/SKILL.md) skill reads the transcript at the end of a session, classifies what's worth keeping, and asks permission before writing.

## Writing Prompts That Don't Leak Thinking

_Skills: [`delegate-to-other-repo`](https://github.com/idvorkin/chop-conventions/blob/main/skills/delegate-to-other-repo/SKILL.md) · [`bulk`](https://github.com/idvorkin/chop-conventions/blob/main/skills/bulk/SKILL.md)_

When you dispatch an agent, the prompt should prove _you_ understood the problem. If it doesn't, you're pushing the synthesis onto the agent and hoping its summary matches reality. Two common failure modes:

- **"Based on your findings, fix the bug."** You haven't read the findings. The agent's summary describes what it _intended_ to do, not what it did.
- **"Implement the plan."** You haven't internalized the plan. The agent is about to execute a design you can't defend.

The fix is specifics. File paths, line numbers, what to change, how you'll know it worked. If you can't write those, you haven't understood the problem yet — don't dispatch.

Bad:

```
Fix the caching bug we talked about.
```

Good:

```
In src/cache.ts:42, the TTL check uses `Date.now() - stored`
instead of `stored + ttl < Date.now()`. Fix the comparison and
add a test case for a stored timestamp within the TTL window.
```

The subagent starts with none of your context. Brief it like a smart colleague who just walked into the room.

## The Skills I Use

_Skills: the whole kit, grouped below_

Operators like to compare models and IDEs. The real leverage is the kit of named recipes you reach for every day. Here's mine this quarter, grouped by when I use them.

**Every session (bookends):**

- [`/up-to-date`](https://github.com/idvorkin/chop-conventions/blob/main/skills/up-to-date/SKILL.md) — sync the repo with upstream before I start. Avoids stale-branch merge pain.
- [`learn-from-session`](https://github.com/idvorkin/chop-conventions/blob/main/skills/learn-from-session/SKILL.md) — at the end, extract durable lessons and route them to the right CLAUDE.md or skill.
- [`/changelog`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/changelog/SKILL.md) — weekly rollup across repos with deep links.

**In-session movement:**

- [`/content`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/content/SKILL.md) and [`/ai-content`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/ai-content/SKILL.md) — load blog writing guidelines and wire up the branch and server.
- `side-edit` — open a file in a side nvim pane so I can watch the agent edit without leaving the conversation.
- [`delegate-to-other-repo`](https://github.com/idvorkin/chop-conventions/blob/main/skills/delegate-to-other-repo/SKILL.md) — hand off work in another repo without dragging its context into this session.
- [`bulk`](https://github.com/idvorkin/chop-conventions/blob/main/skills/bulk/SKILL.md) — fan out N similar CLI calls (gh, bd, git) as one parallel step instead of N sequential turns.

**Verification:**

- [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md) — visual walkthrough of the blog to catch regressions.
- [`show-your-work`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/show-your-work/SKILL.md) — screenshot the changed pages and host them on a gist for the PR body.
- [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md) — iterate a design spec until the review passes stabilize.
- `verification-before-completion` — one last pass before I claim something is done. Evidence before assertions.

**Generation:**

- [`gen-image`](https://github.com/idvorkin/chop-conventions/blob/main/skills/gen-image/SKILL.md) — illustrations via Gemini image API.
- [`gen-tts`](https://github.com/idvorkin/chop-conventions/blob/main/skills/gen-tts/SKILL.md) and [`gen-stt`](https://github.com/idvorkin/chop-conventions/blob/main/skills/gen-stt/SKILL.md) — speech synthesis and transcription for voice-in / voice-out loops.
- [`image-explore`](https://github.com/idvorkin/chop-conventions/blob/main/skills/image-explore/SKILL.md) — brainstorm several visual directions in parallel and compare.
- [`explainers`](https://github.com/idvorkin/chop-conventions/blob/main/skills/explainers/SKILL.md) — scaffold a standalone interactive explainer page for a concept.

**Debugging:**

- [`machine-doctor`](https://github.com/idvorkin/chop-conventions/blob/main/skills/machine-doctor/SKILL.md) — diagnose rogue processes, runaway agents, stale dev servers.
- [`docs`](https://github.com/idvorkin/chop-conventions/blob/main/skills/docs/SKILL.md) — fetch fresh library docs via Context7 instead of guessing from stale training data.
- `systematic-debugging` — the discipline of forming a hypothesis before I change a line.

**One-shot specialists:**

- [`toc`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/toc/SKILL.md) — regenerate or validate a TOC using the same slug rules as my nvim plugin.
- [Hill climbing](/hill-climbing) — the pattern, not a skill. Let an agent climb on top of its own previous best, with an eval as the regression guard.

None of these existed a year ago. In a year, half will be gone and the rest will be better. The kit is a living thing — that's the point.

## A Note on Companion AIs

_Related: [Larry the Life Coach](/larry) · [AI Relationships](/ai-relationships)_

Everything above assumes your AI is a _tool_ — pick it up, use it, put it down. Persistent companion AIs are different. They stick around. They remember. They learn you. That flips the operator problem: frictionlessness, the thing you're optimizing for with tool-AI, becomes the trap with companion-AI. You drift into a private dialect with your AI, humans understand you less, and you retreat further into the AI.

I work through this failure mode in depth — the cryptophasia analogy, the unbundling of "known" from "understood," bidirectional atrophy, and [what to ask your AI friend to do about it](/ai-relationships#what-do-we-want-our-ai-friends-to-do) — in **[A Private Language of One](/ai-relationships#a-private-language-of-one-cryptophasia)** over on [AI Relationships](/ai-relationships). If you run a companion AI, read that section. The operator lesson is the inverse of this post: with a companion, engineered friction is a feature, not a bug.
