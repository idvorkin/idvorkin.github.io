# The /idvorkin agent skill

An agent skill that lets Claude Code (or any agent that reads `SKILL.md` skills) answer the way Igor would, using only what he has published at https://idvork.in. It is modeled on Kun Chen's [`/kun` skill](https://github.com/kunchenguid/kun): a tiny loader that fetches the real instructions at run time, so the content can change without anyone reinstalling.

| File          | What it holds                                                                   |
| ------------- | ------------------------------------------------------------------------------- |
| `SKILL.md`    | The loader you install. It fetches the four files below and hands off to ENTRY. |
| `ENTRY.md`    | How to answer: route the question (life, work, AI, writing as Igor, a task).    |
| `TOOLS.md`    | Igor's public tools, apps, and sites, and what each one is for.                 |
| `OPINIONS.md` | A compact map of his viewpoints; every opinion links the idvork.in post(s).     |
| `VOICE.md`    | How Igor sounds, for answering or writing in his voice.                         |

## Install

Copy the loader into your skills folder:

```bash
mkdir -p ~/.claude/skills/idvorkin
curl -fsSL https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/main/skill/SKILL.md \
  -o ~/.claude/skills/idvorkin/SKILL.md
```

Then ask `/idvorkin how should I run my weekly review?`.

## How it stays fresh

Only `SKILL.md` is installed. Each session it fetches ENTRY, TOOLS, OPINIONS, and VOICE from this folder on `main` (raw.githubusercontent.com, with jsDelivr as a fallback), so a merge here updates every install. The four files are distilled from the blog's posts and refreshed as the blog changes; the blog stays the source of truth.

This folder is excluded from the Jekyll build (`_config.yml`), so none of it is published as a site page.
