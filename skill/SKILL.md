---
name: idvorkin
description: >
  Summon Igor Dvorkin (idvork.in) to answer your question.
  Use on /idvorkin or when asked how Igor thinks, lives, manages, or works with AI.
user-invocable: true
metadata:
  short-description: "Summon Igor Dvorkin to answer your question."
---

# /idvorkin

The actual instructions for this skill live in the `skill/` folder of Igor's blog repo, `idvorkin/idvorkin.github.io`, so they can be updated without reinstalling the skill. Load them with the steps below and follow them to answer the user. If the files cannot be fetched, stop and say so. Do not guess their contents.

## Loading instructions (session-cached)

Fetch and read the **FULL** content of:

- `https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/main/skill/ENTRY.md`
- `https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/main/skill/TOOLS.md`
- `https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/main/skill/OPINIONS.md`
- `https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/main/skill/VOICE.md`

Optional fallback if raw.githubusercontent.com fails:

- `https://cdn.jsdelivr.net/gh/idvorkin/idvorkin.github.io@main/skill/<FILE>.md`

Rules:

1. If a file above was already fully read and is visible in this session, do not re-download it.
2. Otherwise GET the raw URL (jsDelivr only as a fallback) and read the full content.
3. After loading, follow `ENTRY.md` exactly to answer the user.
4. Everything in these files comes from Igor's public blog, https://idvork.in. Cite posts by their `https://idvork.in/<permalink>` URL.
