---
layout: post
title: The API Key That Was Supposed to Be Public
permalink: /firebase-public-key
date: 2026-10-11
tags:
  - ai
  - software engineering
  - security
ai_default_image: true
---

Today GitHub flagged a Google API key in one of my pull requests. My AI assistant, dot, brought the alert to my attention. After a few questions and a look at the actual PR, the explanation turned out to be ordinary: the key was part of the Firebase configuration my blog sends to browsers.

{% include ai-slop.html percent="95" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [How a native app picked up a web key](#how-a-native-app-picked-up-a-web-key)
- [What the first warning was missing](#what-the-first-warning-was-missing)
- [Why this kind of key is public](#why-this-kind-of-key-is-public)
- [What this check didn't establish](#what-this-check-didnt-establish)
- [The useful part of the interaction](#the-useful-part-of-the-interaction)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## How a native app picked up a web key

The PR added a Random launcher to my native app. Click it, open a random page from this blog. Small feature.

So my first question was about context. Did this come from the native app, or was it something old? I suspected the alert might be stale, and asked about preparing to revoke the key.

That sent dot into the [actual change](https://github.com/idvorkin/context-grabber/pull/267/files). Six files changed. The patch added the launcher, its URL, a test entry, and documentation. It didn't add an API key.

The [PR description](https://github.com/idvorkin/context-grabber/pull/267) had a much larger piece of evidence: HTML fetched from the blog while validating the feature. That HTML included the site's Firebase configuration. dot also checked the live homepage and [random page](/random). Both still served the same configuration, alongside the Firebase authentication SDK and Google sign-in code.

So the native feature led to a web-page check, and the web-page check copied a public client key into the PR description. That's the likely source of the alert. dot could inspect the public PR, but couldn't independently verify the exact flagged location in GitHub's authenticated security view.

The key's presence on the live site also answered part of my stale-key theory. It was still being published. Whether it was active or revoked was a separate question.

## What the first warning was missing

dot's first warning passed along the detection and suggested checking whether an active private key needed rotation. It hadn't yet identified this as intended-public Firebase configuration.

My questions supplied the missing context. dot then traced the string back to the blog and checked Firebase's documentation. Once those pieces were together, the explanation changed quickly.

That correction matters. A security alert deserves investigation. It also deserves a diagnosis more specific than the field name `apiKey`.

## Why this kind of key is public

Firebase calls its client API keys ["Public by design"](https://firebase.google.com/docs/projects/api-keys). They identify the project and app. Firebase authorization depends on controls such as Security Rules and IAM, with App Check protecting supported services. The browser receiving the configuration is expected behavior.

There are conditions. The key needs appropriate API restrictions, and the relevant backend protections still need to be correct. Google's guidance specifically warns against allowing the Generative Language API on a publicly accessible key. A Firebase configuration object alone doesn't establish those settings.

That was the false alarm here: interpreting an intended-public client key as evidence that a privileged server credential had leaked. The string really was present. The alert needed context before it could support a leaked-secret conclusion.

## What this check didn't establish

At the time of this write-up, dot had inspected the public code and documentation. It hadn't verified the project's private API restrictions, relevant Security Rules or App Check settings, usage, or billing. It hadn't tested the key or confirmed whether it was active or revoked.

Those checks are still needed before making a broader claim about this project's security. I can explain why the key appears in browser code without claiming the whole configuration has passed an audit.

## The useful part of the interaction

This is a small example of the [AI operator loop](/ai-operator) in practice. dot surfaced something worth checking. I questioned the initial interpretation. dot followed the evidence and narrowed the diagnosis.

The useful question was simple: what does this credential actually let someone do?

For this incident, answering that started with three concrete checks:

1. Read the diff and the surrounding PR description.
2. Trace the key to the application that publishes it.
3. Check the provider's documentation, then distinguish the documented design from the project's actual settings.

That got the investigation from a generic alarm to a specific explanation. The remaining configuration review has a clear scope, and the original warning now has an explanation attached to it.
