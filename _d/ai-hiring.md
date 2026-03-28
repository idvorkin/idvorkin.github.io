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
- [What I Actually Look For](#what-i-actually-look-for)
- [Testing How People Use Agents](#testing-how-people-use-agents)
- [Testing for Skills That Matter More](#testing-for-skills-that-matter-more)
- [The Parenting Test](#the-parenting-test)
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

## What I Actually Look For

Before AI changed everything, I had a simple [hiring formula](/manager-book#hiring): **Smart, Gets Things Done, Not an Asshole.** Most companies dress this up in elaborate competency frameworks, but it boils down to those three things.

Turns out AI didn't change the formula — it just made it sharper:

**Smart** — This used to mean "deep technical knowledge." Now it means something closer to curiosity and judgment. Can you figure out what's actually going on? Can you tell when AI is giving you garbage vs gold? The person who deeply understands systems and tradeoffs gets _more_ leverage from AI, not less. All that experience becomes the judgment layer that makes AI-assisted work actually good instead of just fast.

**Gets Things Done** — This got a [fancy new word: Agency](/agency). But it's the same thing it always was: seeing what needs to happen and making it happen. When AI handles the boilerplate, the gap between someone with agency and someone coasting on busy work becomes enormous. The person with agency sees the problem, figures out the approach, and ships. The person without it waits for a ticket.

**Not an Asshole (EQ)** — If anything, this matters more now. When AI handles more of the technical execution, what's left is the human stuff — communication, trust, collaboration, self-awareness. The person who can't work with others doesn't get saved by being technically brilliant anymore, because AI narrows the technical gap.

The fundamentals haven't changed. What changed is the weight distribution — agency and EQ matter more, raw technical knowledge matters less.

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

Maybe the answer isn't testing _with_ AI, but testing for skills that matter more when AI handles the coding.

When AI commoditizes syntax and boilerplate, what's left?

**Skills that matter more now:**

- **[Agency](/agency)** - taking initiative, seeing problems, owning outcomes
- **Relentlessness** - AI makes the first 90% easy; the last 10% is where everything that matters gets built
- **Problem decomposition** - breaking down ambiguous requirements
- **Judgment and taste** - knowing what "good" looks like
- **Communication** - explaining to humans, not machines
- **Heart** - building trust, making people feel seen, creating relationships that aren't transactional
- **Domain expertise** - understanding constraints AI doesn't know

**Amazon has been focused on this in the pre-AI era as well:** [Behavioral interviews](/amazon) testing leadership principles matter as much as technical skills.

## The Parenting Test

Here's something that clicked for me: [Michael Bloch wrote about raising kids](https://michaelxbloch.substack.com/p/raising-kids-for-a-world-i-cant-predict) for a world he can't predict. He landed on four traits: **agency, relentlessness, curiosity, and heart.** Not what his kids should study or what career to aim for — who they should become.

Read that list again. It's the same list we should be hiring for.

That's not a coincidence. Bloch's insight is that when the world changes fast enough, credentials and specific skills have a shorter shelf life every year. What doesn't expire is character. And the traditional education system — compliance, memorization, performing on command — trains for exactly the skills AI replaces first.

The same is true in hiring. Leetcode measures memorization and pattern matching under pressure. That's... exactly what AI does. We should be testing for the things AI can't do:

- **Agency** — Do they take action without being told?
- **Relentlessness** — Do they push through the hard last 10% that AI can't finish?
- **Curiosity** — Do they pull the thread until they actually understand, or stop at the surface?
- **Heart** — Can they build trust and make people feel seen? Do teams work better with them in the room?

One commenter on Bloch's post nailed it: _"These are basically the same exact four traits on my company's hiring scorecard."_ We're all converging on the same answer from different directions — parents, hiring managers, the [AI-native manager](/ai-native-manager) world. When AI commoditizes execution, character is what's left.

My old formula — Smart, Gets Things Done, Not an Asshole — maps almost perfectly onto Bloch's parenting framework. Smart is curiosity. Gets Things Done is agency plus relentlessness. Not an Asshole is heart. We've been selecting for the same traits all along. AI just made them impossible to ignore.

## Related

{% include summarize-page.html src="/ai-developer" %}

{% include summarize-page.html src="/chop" %}

{% include summarize-page.html src="/amazon" %}

{% include summarize-page.html src="/ai-native-manager" %}

---

_I'll update this as I see more data on what actually works._

## Sources

- [Meta's AI-Enabled Coding Interview Guide](https://www.coditioning.com/blog/13/meta-ai-enabled-coding-interview-guide)
- [Canva: Yes, You Can Use AI in Our Interviews](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
- [State of Interviewing 2025: How AI Rewired Tech Interviews](https://www.interviewquery.com/p/ai-interview-trends-tech-hiring-2025)
- [AI Interview Copilot Tools](https://www.finalroundai.com/interview-copilot)
- [Raising Kids For A World I Can't Predict](https://michaelxbloch.substack.com/p/raising-kids-for-a-world-i-cant-predict) - Michael Bloch
