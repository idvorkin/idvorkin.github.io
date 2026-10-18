---
layout: post
title: "The CHOP Shop, 2024 to 2026: How My AI Coding Setup Evolved"
permalink: /chop-history
ai_default_image: true
tags:
  - ai
  - tools
---

My CHOP page started in August 2024 as a checkpoint file about Cursor's tab completion. Two years later the tools in it were gone, the predictions had due dates that arrived, and a third of the page was history pretending to be advice. This is that third, kept as a timeline: what I used in each era, what I wrote at the time, and what survived. The current ideas are in [The CHOP Shop](/chop); the current setup is in [How Igor CHOPs](/how-igor-chops).

{% include ai-slop.html percent="70" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [2024 H2: The Shop Hand](#2024-h2-the-shop-hand)
- [December 2024: CONVENTIONS.md and the Cookbook](#december-2024-conventionsmd-and-the-cookbook)
- [2025 H1: Cursor as Agent, Chat Logs in the Repo](#2025-h1-cursor-as-agent-chat-logs-in-the-repo)
- [2025 H2: Claude Code Becomes the Present](#2025-h2-claude-code-becomes-the-present)
- [January to April 2026: Mumbling on the Couch](#january-to-april-2026-mumbling-on-the-couch)
- [May to July 2026: Claws and Cities](#may-to-july-2026-claws-and-cities)
- [August to October 2026: The Herd Gets Tooling](#august-to-october-2026-the-herd-gets-tooling)
- [What I Was Reading](#what-i-was-reading)
- [The 2024 Predictions, Graded in 2026](#the-2024-predictions-graded-in-2026)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

Each era ends with what survived. The prose I wrote at the time is under the fold, unedited, because it's the primary source.

## 2024 H2: The Shop Hand

Cursor's tab completion was the hot thing: complete the code before and after the cursor, jump to the next edit, complete a comment into working code. I tried [Aider](https://github.com/paul-gauthier/aider) on the command line and [Avante](https://github.com/yetone/avante.nvim) in nvim the same month. Steve Yegge published [The Death of the Stubborn Developer](https://gist.github.com/idvorkin/694561bfe1fcc89a0e911255b5183e76) and gave the thing a name, and I started this page on 2024-08-26 with a three-stage story: AI as the shop hand, then the apprentice, then the master mechanic.

The first real CHOP win was a bug in an nvim plugin I use for tables of contents. I filed [the issue](https://github.com/hedyhli/markdown-toc.nvim/issues/8), cloned the repo, asked Cursor to [fix it](https://gist.github.com/idvorkin/f8d67556fca16d776133a7a7c949f16c), had it build a test system the repo didn't have, and sent [the PR](https://github.com/hedyhli/markdown-toc.nvim/pull/9).

**Survived:** the word CHOP, and the habit of sending the PR.

<details markdown="1">
<summary>What I wrote at the time</summary>

**The Evolution of AI Coding**

1. **Code Completion (The Tool Fetcher)**: simple autocomplete suggestions, syntax error detection, basic snippet generation
2. **Interactive Chat (The Apprentice)**: contextual code suggestions, problem-solving assistance, documentation help, bug diagnosis
3. **Full Code Generation (The Master Mechanic)**: complete feature implementation, codebase-aware changes, convention-driven development, architectural suggestions

**Cursor: From Amazing Tab Completion to the best agent**

Their tab completion revolutionized how we interact with code: complete code before and after your cursor position, complete natural language descriptions into working code, jump to the next edit point (very awesome when doing rename refactoring, even across multiple variables). Pretty funny - they wanted to do tab completion, but found the VS Code extension model was too limiting for their AI ambitions. Their solution? Fork the entire VS Code codebase!

**Aider**: a command-line CHOP tool. Creates individual commits for each change (can be noisy), so work on a separate branch and squash commits, and let it help create unit tests. [See this Aider-driven change](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf).

**Avante**: a promising Vim plugin for CHOP. Excellent inline changes and merging, transparent [coding prompts](https://github.com/yetone/avante.nvim/blob/main/lua/avante/llm.lua), integrates well with the Vim workflow.

</details>

## December 2024: CONVENTIONS.md and the Cookbook

The idea that outlived every tool on this page showed up on 2024-12-29: instead of repeating yourself in every prompt, keep one `CONVENTIONS.md` the AI reads first, and treat it as a living document the AI itself maintains. Cursor read it through a `.cursorrules` pointer. The page got its `/chop` permalink on New Year's Eve, and the predictions section went in over the following weeks: artisanal commits gone by the end of 2026, AI rule packs, new languages built for AIs to read. Scored [below](#the-2024-predictions-graded-in-2026).

**Survived:** conventions compound. `CONVENTIONS.md` became `CLAUDE.md`, then `AGENTS.md` with `CLAUDE.md` as a symlink, plus a [shared repo of them](https://github.com/idvorkin/chop-conventions). The current version is [Rules of Engagement](/chop#rules-of-engagement-dry-chop).

<details markdown="1">
<summary>What I wrote at the time</summary>

**Core Concepts**

1. **Natural Language Interface**: express programming goals in plain English, iterative refinement through dialogue, context-aware responses
2. **Codebase Understanding**: AI reads and understands your entire project, follows established patterns and conventions, maintains consistency with existing code
3. **Convention-Driven Development**: uses CONVENTIONS.md as a knowledge base, learns from project-specific rules, maintains consistent coding standards

**DRY CHOP: Your AI's Cookbook**

Think of your AI assistant as an eager junior developer who can learn and retain knowledge - but only if you teach them properly. Instead of repeating the same instructions in every prompt, establish a single source of truth through your CONVENTIONS.md file. You can see [an example of this evolution here](https://gist.github.com/idvorkin/6f506f47bf6c4c57a1ff5a2d24e345dd#conventionsmd). Cursor IDE implements this concept using a `.cursorrules` file that points to your CONVENTIONS.md ([see example](https://github.com/idvorkin/idvorkin.github.io/commit/332e43c7e211640f55da9be858164e6aa003ab9e)). A worked example: [permalink management](https://github.com/idvorkin/idvorkin.github.io/commit/4c36f25adf3a0e99024aa7c925383e3321a66976), where AI helped establish a clear permalink change process and standardized `redirect_from` in front matter.

**Integration Tips**: create separate branches for CHOP-generated code, use commit messages that indicate CHOP assistance, review CHOP-generated changes with extra scrutiny, keep track of prompt patterns that work well.

**The Art of Prompt Engineering**: be specific but not too specific; reference existing components and patterns in your codebase; use AI-generated code as a foundation, not a final product. (Contradicted a month later by "prompt engineering not that important." The later me was right.)

</details>

## 2025 H1: Cursor as Agent, Chat Logs in the Repo

Cursor grew a Composer-Agent mode and I turned on YOLO for tests: let it run `pytest` without asking. MCP servers arrived, and I used one to [manage GitHub issues from the chat](https://github.com/idvorkin/idvorkin.github.io/blob/583d3c07ea12c5f131d5e8e11aa561b56ee288c8/zz-chop-logs/2025-05-17_15-26-github-issues-inquiry.md). The habit I'm fondest of from this era: [SpecStory](https://docs.specstory.com/features) exported every chat, a shell function copied the latest one into `zz-chop-logs/`, and the log was committed with the change, so the commit carried the conversation that produced it. In June the conventions moved out of the blog into their own [chop-conventions](https://github.com/idvorkin/chop-conventions) repo, and the page got a section called "Congrats, you've been promoted: AI Squad Manager," which was a header and a hunch.

**Survived:** ship the transcript. The chat-log habit became [published session logs](/published-chop-logs/2025-10-09-religion-exploration.html) and, later, the receipts under every gag in [The Den](/the-den). YOLO became the default inside a disposable machine. Context7 for fresh docs became the `docs` skill and a standing rule: check the docs before guessing.

<details markdown="1">
<summary>What I wrote at the time</summary>

**Cursor Tips**

1. **YOLO Mode for Tests**: enable "run shell commands without confirmation," perfect for running tests frequently, only enable for safe commands like tests.
2. **Composer-Agent Mode**: more structured, task-focused interactions, better for complex multi-step tasks, great for refactoring and architecture discussions.
3. **Enable Large Context**: Settings -> Features -> "Large Context"; dramatically improves AI's ability to understand your entire codebase at once.
4. **Using MCP Tools in Cursor**: MCP lets AI interact with external systems via the chat interface (browser control, file operations, API interactions). Careful, it affects the real system, no undos! My [tool list](https://github.com/idvorkin/Settings/blob/master/config/cursor/mcp.json).
5. **Claude Code MCP Servers**: a GitHub server (`claude mcp add github …`) for issues and PRs, and [Context7](https://mcp.context7.com/mcp) so current docs land in the prompt instead of outdated APIs or hallucinated functions.

**Maintain Chat History with your commits**

1. Install [SpecStory](https://docs.specstory.com/features); it exports your chat history.
2. A zsh function, [chop-git-latest](https://github.com/idvorkin/settings/blob/7e9e90984dba2650b2cd4ee3a6c9511993ed73f4/shared/zsh_include.sh?plain=1#L708), copies the latest chat to `zz-chop-logs` and adds it to the commit.
3. Have the AI write the commit message, but [skip commenting on the logs](https://github.com/idvorkin/nlp/blob/2d804345426c211f34fd6990b61d9d550cbc1cd7/commit.py?plain=1#L23).
4. Because the log directory sorts last, it shows up after the real change, and because the chat is linked to the commit it's easy to track. Example: [a tig configuration, with its chat](https://github.com/idvorkin/Settings/commit/9b73588eb304addf6e1ae8257251d39c93f740c3?short_path=cac8bdd#diff-cac8bdd2c7d1bef00dddc15e01d81bbc2030f9ec8789d2307c7bde1ce0b2c58a).

![Terminal screenshot showing git workflow with chop-git-latest command that copies AI collaboration session files to staging area and tracks changes for version control](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250225_093946.webp)

**Using latest docs**: Cursor has native support for indexing docs; some projects even have an `llm.txt` to teach the LLM what it needs to know ([FastHTML is an example](https://www.answer.ai/posts/2024-09-03-llmstxt)).

</details>

## 2025 H2: Claude Code Becomes the Present

The worktree-and-draft-PR workflow went in on 2025-07-30, the first version of [the loop](/chop#the-loop): a worktree per feature, a draft PR as the shared context, commit often, convert to ready. Two weeks later I wrote the multi-agent stress section: don't run four agents, default to one strong agent with clear specs and tests. In October, smart versus fast. In November, the YOLO containers section: Docker containers on a desktop, each with its own Tailscale hostname and the agent's own GitHub identity, cattle not pets. And in the same month Gemini, the new Codex, and Opus 4.5 leapfrogged each other three days apart, which is when I stopped switching and standardized on Claude Code.

**Survived:** nearly all of it, with the shapes changed. Worktrees became a worktree per agent from a pre-warmed pool. The containers became [OrbStack VMs](/how-igor-chops#vm-setup-cattle-not-pets) with the same principles. "Don't run four agents" is the one that reversed; see [the scorecard](#the-2024-predictions-graded-in-2026).

<details markdown="1">
<summary>What I wrote at the time</summary>

**Worktree and PR Workflow** (2025-07-30)

1. Start with a worktree: `git worktree add ../feature-branch feature-name`. Keeps your main workspace clean, isolates AI experiments from stable code.
2. Create a draft PR early: `gh pr create --draft --title "WIP: …"`. Establishes scope and intent, a place to track progress and chat history.
3. Use the PR description as AI context: background, related issues, the approach you want AI to take.
4. Commit frequently with descriptive messages; include CHOP session logs.
5. Convert to ready for review with `gh pr ready`; clean up history; include a summary of the AI assistance used.

**Multi-agent orchestration stress** (2025-08-13)

- Don't feel the need to run four agents. More agents increase cognitive load and coordination overhead.
- When interventions per hour are high, adding agents makes confusion worse: parallel edits, re-explanations, and merge pain.
- Default to one strong agent with clear specs and tests; let it run longer between interventions.
- Scale cautiously to two agents only when ownership is cleanly separated and a single "conductor" coordinates.
- Prefer sequential pipelines and handoffs (spec → tests → implementation → review) over a concurrent free-for-all.
- Rule of thumb: reduce agents until stress drops and throughput rises.

**How to be fast when AI is slow** (2025-06-07): Once you crack the interventions per hour, your next issue is how you task swap between projects. I predict source control and multi windows are part of the solution.

**YOLO Containers: Safe Full Autonomy** (2025-11-16): Run AI in disposable, fully isolated Docker containers. The container has no access to your host filesystem; the AI uses its own GitHub credentials (`idvorkin-ai-tools`) and can only push to PRs, never to main; named volumes persist across restarts; each container gets a stable Tailscale hostname (`c-5001`), so `ssh c-5001` drops into tmux and `chrome c-5001:4000` opens the preview from any device. Setup: [container configuration](https://github.com/idvorkin/Settings/blob/master/claude-docker/README.md) and [management script](https://github.com/idvorkin/Settings/blob/master/claude-docker/claude-docker.py).

**claude-code-log and claude-code-transcripts**: [claude-code-log](https://github.com/daaain/claude-code-log) converts Claude Code conversation logs to publishable HTML (`uv tool install claude-code-log`); Simon Willison's [claude-code-transcripts](https://github.com/simonw/claude-code-transcripts) does the same with pagination and gist upload.

</details>

## January to April 2026: Mumbling on the Couch

[How Igor CHOPs](/how-igor-chops) was written on New Year's Day 2026, by voice, partly on a treadmill, and the vibe-coding page folded into it the next day. Yegge's 8 stages diagram went in on 2026-01-23 with my position marked between stages 6 and 7. In February the control-panel section became its own post, [The AI Cockpit](/ai-cockpit), with voice as the primary interface. April brought [The AI Operator](/ai-operator) (thinking tokens, on the loop versus in the loop), [eval-driven hill climbing](/hill-climbing), the OrbStack core cap and cpu-watchdog after a runaway agent, and the Flow Question.

**Survived:** all of it; this is the base of the current pages.

## May to July 2026: Claws and Cities

[The Psychology of Vibing](/vibing) named the dopamine and the drain. [Igor's Three Claws](/igors-claws) gave the agents names and jobs, and [Larry](/larry) became a working chief of staff over Telegram. In June I stood up my first [Gas City](/gas-city-home), and [The Dark Factory](/dark-factory) argued about how far unattended code can go. The token juggling started here too: [the \$230 week](/ai-journal#the-230-week-when-cheap-coding-isnt) was the first time a subscription ran out before the month did.

**Survived:** the claws and the city. The budget problem became [How I Manage AI Tokens](/token-management).

## August to October 2026: The Herd Gets Tooling

[Herdr replaced the tmux duct tape](/ai-journal#herdr-the-agent-multiplexer-my-tmux-rig-was-trying-to-become) on 2026-08-02. [The Den](/the-den) started shipping its transcripts under the gags. In September the loop got its gates: a `pr-checks` skill and the [no-mistakes](https://github.com/kunchenguid/no-mistakes) gate on the blog, every background agent in its own worktree with the model picked by task shape, Codex and Muse driven as sub-agents through Herdr, Lavish boards for review, [Gas City folded into one hub](/gas-city), and Opus 5.5, which [brought the joy back](/interaction-model) after a model that talked like a ticket system. The ring I use as a voice remote landed in October.

**Survived:** this is now. [A Typical CHOP Session](/how-igor-chops#a-typical-chop-session) is the loop with these parts in it, dated.

## What I Was Reading

The reading notes that used to live on the CHOP page, with the date I read them. Each one marked an era.

<details markdown="1">
<summary>How might AI change programming? (December 2024)</summary>

[A fascinating essay](https://gist.github.com/idvorkin/f1a4f1ccd2c9c8496101de7633d5aafc). Read path vs write path: [data systems](/td/data-systems#write-path-vs-read-path) went through this, where you used to materialize writes to a DB and read from it; programs are like that too, instructions in, a program saved, a program run. But what if, in a world where models keep getting better, you store the instructions and write the code on the fly? Short term: compilers and linters designed to give LLMs more context, more small single-file programs, better decoupling because LLMs can't keep everything in their head. On new programming languages: the existing corpus doesn't matter, because models generate their own synthetic data, and the new languages will be of two forms, high-level ones like English to instruct the AI and AI languages optimized for AIs to read and write. New forms of technical debt: code optimized for current models that becomes a problem as models advance.

</details>

<details markdown="1">
<summary>The 70% problem, and the stubborn developer (December 2024)</summary>

[The 70% AI coding problem](https://gist.github.com/idvorkin/bf72b861c826e67ad460f06f1ccb9afc): AI tools dramatically increase coding speed but don't necessarily improve quality; the last 30% of functionality is disproportionately hard; experienced developers benefit more than beginners; "bootstrappers" use AI for MVPs and "iterators" for daily work; seniors constantly refactor AI output while juniors accept it with less review.

[The death of the stubborn developer](https://gist.github.com/idvorkin/694561bfe1fcc89a0e911255b5183e76): LLMs handle the repetitive leaf-node tasks; higher-level planning and coordination remain for humans but are harder to learn; the junior-to-senior pipeline is disrupted because the simple tasks juniors learned on are gone. CHOP boosts productivity by at least 30%, has a steep learning curve and no established teaching, and the author is skeptical that fully autonomous agents take over soon. Measuring the effectiveness of CHOP in enterprises remains unsolved.

</details>

<details markdown="1">
<summary>Research assistant vs code writer (January 2025)</summary>

Two ways to use AI. Getting help: AI as the interactive replacement for Stack Overflow, documentation, and Reddit, instant and personalized. Writing code: efficient, but should we let it take over the tasks we enjoy? The DHH clip that framed it for me is on [the current page](/chop#will-chop-kill-the-joy-of-coding).

</details>

<details markdown="1">
<summary>The last programmers (September 2025)</summary>

[xipu.li on the future of coding](https://www.xipu.li/posts/the-last-programmers) (via [a summary](https://gist.github.com/idvorkin/4e7c9a91b54d58e23168da0b750d6ce2#file-summary_gpt-5-md)). Coders divide into Experimenters, who embrace AI and push abstraction up, and Guardians, who value deep understanding and robustness; Experimenters become the majority. As implementation commoditizes, the questions become "should we build this" and "how do we get people to use it," and the non-automatable skills are understanding users, product taste, and distribution. The design doc becomes the primary artifact: edit prose to drive code changes rather than editing code directly, with parallel agents each owning a feature. (My note at the time: this is very painful. A year later, the pain is what the herd tooling fixed.)

</details>

## The 2024 Predictions, Graded in 2026

| Prediction (when)                                                                          | Grade in October 2026                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No artisanal hand-crafted commits by the end of 2026 (Yegge, 2024; I agreed)               | True in my repos. Every recent commit on this blog carries a model's co-author trailer, and people write code by hand the way they do woodworking. I'm still skeptical anyone buys artisanal code.             |
| AI rule packs will be super valuable (Feb 2025)                                            | True. A [conventions repo](https://github.com/idvorkin/chop-conventions) with a couple dozen skills, and a plugin list every machine installs.                                                                 |
| New programming languages optimized for AIs to read and write (Feb 2025)                   | Not yet. The high-level AI language turned out to be English, in a `CLAUDE.md`.                                                                                                                                |
| What takes AI longer: regulation, legacy code, hard-to-verify, volume debugging (Feb 2025) | Holds. Hard-to-verify is where I spend my time; it's why [the eval is the job](/chop#verification-is-the-job).                                                                                                 |
| We'll give up on understanding AI's solution (Feb 2025)                                    | Partly. I [review more than I make](/ai-operator#you-review-more-than-you-make), and the line past which I stop understanding has a name now: the [discernment horizon](/ai-native-vocab#discernment-horizon). |
| Prompt engineering isn't that important (Feb 2025)                                         | Still my view. Conventions matter; the alchemy doesn't.                                                                                                                                                        |
| Source control and multi windows will solve "fast when AI is slow" (Jun 2025)              | True: a worktree per agent and a multiplexer that knows what an agent is.                                                                                                                                      |
| Don't run four agents (Aug 2025)                                                           | Reversed, by tooling rather than discipline. The ladder is in [The Herd](/chop#the-herd-one-agent-to-a-city).                                                                                                  |
| CHOP is a 30% productivity boost (Yegge, 2024)                                             | An undercount. The right unit stopped being my output and became [how many projects I'm willing to start](/how-igor-chops#command-line-pwas-and-now-apps).                                                     |
