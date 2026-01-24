---
layout: post
title: "AI Hiring: How Should Hiring Change in an AI World?"
permalink: /ai-hiring
redirect_from:
  - /ai-slop
alias:
  - /ai-slop
tags:
  - ai
  - job-hunt
  - exploration
---

Like everything else in the new AI world, hiring is gonna change. I don't know where we'll land, but I'm collecting thoughts as this plays out. The industry is all over the map - some companies now require AI use in interviews, others ban it entirely, most are somewhere in between trying to figure it out. How do we assess working with AI? What new behaviors/skills should we be testing for? I don't have answers, just observations.


{% include ai-slop.html percent="95" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [What Companies Are Actually Doing](#what-companies-are-actually-doing)
- [Handling AI Cheating](#handling-ai-cheating)
- [Testing How People Use Agents](#testing-how-people-use-agents)
- [Testing for Skills That Matter More](#testing-for-skills-that-matter-more)
- [Related](#related)
- [Sources](#sources)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## What Companies Are Actually Doing

The industry is split:

**Embracing AI in interviews:**
- [Meta allows AI tools](https://www.coditioning.com/blog/13/meta-ai-enabled-coding-interview-guide) in coding interviews (Oct 2025) - candidates can use approved AI in CoderPad
- [Canva expects AI use](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/) - Copilot, Cursor, Claude - they say it mirrors real work
- [Anthropic's performance takehome](https://github.com/anthropics/original_performance_takehome/blob/main/perf_takehome.py) tests optimization, not syntax (I'm assuming they expect AI use)

**Avoiding AI entirely:**
- [Google went back to in-person](https://www.interviewquery.com/p/ai-interview-trends-tech-hiring-2025) - in-person rounds rose from 24% (2022) to 38% (2025)
- Proctored environments
- Questions designed to be hard to prompt

I don't know which approach is right.

## Handling AI Cheating

I had one weird interview where the person kept stalling for time. I had no idea what was going on. Afterwards I wondered if he was trying to use AI to cheat - for that person, if that's what they were doing, they failed pretty miserably.

Turns out this is common: [81% of Big Tech interviewers](https://www.interviewquery.com/p/ai-interview-trends-tech-hiring-2025) have suspected AI cheating, 31% caught it definitively.

**The tools are getting sophisticated:**
- [AI interview copilots](https://www.finalroundai.com/interview-copilot) with real-time transcription
- Hidden answer suggestions, off-screen help
- Screen recording detection avoidance
- Audio analysis to feed prompts
- AR glasses with hidden displays

**Companies are responding:**
- More in-person rounds
- Proctored environments
- Questions that can't be easily prompted
- Or just accepting it and testing something else entirely

I don't have a good answer here. Policing feels like an arms race we'll lose.

## Testing How People Use Agents

If we allow AI in interviews, what do we actually test?

Meta and Canva say they're testing "classic coding skills with AI as a tool." But what does that mean? How do you tell who's good with AI vs who's good at hiding behind AI?

**Ideas I'm seeing:**
- Watch them pair program with AI tools
- Give them AI-generated code to review
- Take-home projects with AI allowed
- Debugging challenges with subtle AI-generated bugs

**My personal take:** I love the idea of take-home tests where you bring folks in afterwards to discuss what they've done and modify it with you - very much simulating real work. Of course the issue here is this is pretty expensive for candidates who don't know if they'll get the job.

I genuinely don't know the right answer.

## Testing for Skills That Matter More

Maybe the answer isn't testing *with* AI, but testing for skills that matter more when AI handles the coding.

When AI commoditizes syntax and boilerplate, what's left?

**Skills that matter more now:**
- **[Agency](/agency)** - taking initiative, seeing problems, owning outcomes
- **Problem decomposition** - breaking down ambiguous requirements
- **Stakeholder management** - navigating organizational complexity
- **Judgment and taste** - knowing what "good" looks like
- **Communication** - explaining to humans, not machines
- **Domain expertise** - understanding constraints AI doesn't know

**Amazon has been focused on this in the pre-AI era as well:** [Behavioral interviews](/amazon) testing leadership principles matter as much as technical skills. See more: [Management interviews guide](/d/management_interviews) and [Amazon leadership principles](/amazon)

## Related

{% include summarize-page.html src="/ai-developer" %}

{% include summarize-page.html src="/chop" %}

{% include summarize-page.html src="/amazon" %}

{% include summarize-page.html src="/management-interviews" %}

---

*I'll update this as I see more data on what actually works.*

## Sources

- [Meta's AI-Enabled Coding Interview Guide](https://www.coditioning.com/blog/13/meta-ai-enabled-coding-interview-guide)
- [Canva: Yes, You Can Use AI in Our Interviews](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
- [State of Interviewing 2025: How AI Rewired Tech Interviews](https://www.interviewquery.com/p/ai-interview-trends-tech-hiring-2025)
- [AI Interview Copilot Tools](https://www.finalroundai.com/interview-copilot)
