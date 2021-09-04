---
layout: post
title: "Writing is Thinking"
imagefeature: https://github.com/idvorkin/blob/raw/master/noun_writing.png
permalink: /writing
redirect_from:
  - write
  - thinking
  - think
---

Useful writing tells people something true and important that they didn't already know in a way that leaves no doubt. Most writing is bad. Not due to spelling, punctuation or grammer, but due to lack of critical thinking. Critical thinking like analysis, synthesis, simplification, and presentation.

<!-- prettier-ignore-start -->


<!-- vim-markdown-toc GFM -->

- [Why](#why)
    - [Writing to understand, writing to be understood.](#writing-to-understand-writing-to-be-understood)
    - [Amazon's Writing Culture](#amazons-writing-culture)
    - [Sucking till you don't](#sucking-till-you-dont)
    - [Building Knowledge - Evergreen notes](#building-knowledge---evergreen-notes)
- [Writing to understand](#writing-to-understand)
    - [All Mental models are wrong.](#all-mental-models-are-wrong)
    - [SWOT and SOAR - Exploring the space](#swot-and-soar---exploring-the-space)
    - [MECE - How you know you're done.](#mece---how-you-know-youre-done)
    - [Minto's Pyramid Principle](#mintos-pyramid-principle)
    - [Elon's First Principles](#elons-first-principles)
    - [Five Whys](#five-whys)
    - [Diagrams](#diagrams)
    - [Stories and actions not just data](#stories-and-actions-not-just-data)
- [Writing to be Understood](#writing-to-be-understood)
    - [The journey or the recommendation](#the-journey-or-the-recommendation)
    - [The detective formula: Situation, Complication, Resolution](#the-detective-formula-situation-complication-resolution)
    - [The Pixar Formula:](#the-pixar-formula)
    - [The Hero's Journey Formula:](#the-heros-journey-formula)
    - [The feedback formula: Situation, Behavior, Impact](#the-feedback-formula-situation-behavior-impact)
    - [The crappy modern business book](#the-crappy-modern-business-book)
- [Pen to paper](#pen-to-paper)
    - [Madman, Architect, Carpenter, Judge](#madman-architect-carpenter-judge)
    - [On essay's and writing:](#on-essays-and-writing)
    - [How to write effectively](#how-to-write-effectively)
    - [How to tell a great story](#how-to-tell-a-great-story)
    - [Writers head to readers head, like an army through a choke point](#writers-head-to-readers-head-like-an-army-through-a-choke-point)
    - [My 80 hours on an outage document](#my-80-hours-on-an-outage-document)
    - [Writing Software and Tools](#writing-software-and-tools)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Why

### Writing to understand, writing to be understood.

You write to understand a topic, and to help others understand.

**Writing to understand** is capturing and categorizing lots of information. You don't know what you're looking for as your trying to build your own coherent, complete, mental models.

**Writing to be understood** is figuring out what a reader (sometimes you!) needs to understand, and focusing and simplifying your understanding to optimize presentation.

When you're in the writing to provide understanding, you start by understanding what it is the reader want to understand, and you build them a mental model of the content optimized to match their needs.

TODO: XREF - Mental models.
TODO: XREF - Stages of writing

### Amazon's Writing Culture

{%include blob_image_float_right.html src="noun_writing.svg?sanitize=1" %}

My favorite thing about [Amazon](/amazon) is the writing culture. Every 60 minute meeting starts with the presenter handing out a 6 page document, and asking if anyone needs a pen. The next 30 minutes is spent reading, with the silence barely puncuated with the sound of a pen underlining a key figure. At around the 30 minute mark, the presenter will ask, does anyone need more time? Which signals to the stragglers to start skimming as the discussion will start.

On my second day at [Amazon](/amazon) I had my first meeting. After we went around the room introducing the new guy (me), a stapled 6 page printout was handed out and silence descended on the room. I went throught the document in 5 minutes. I didn't understand much of it, after all I was new and didn't know what these guys worked on. I then had to sit in silence fidgetting for the next 25 minutes. At the 30 minute mark, people started discussion. "I understand your reasoning, but did you consider the new market trends?", "How do you imagine things will change if we don't complete this within a month?" I was really surprised. I didn't notice any of these things in the document. How did these folks get this deep understanding of the document? They must have had a deep knowledge of the domain I thought. Nope.

Turns out, to build a clear writing muscle, you must build a critical thinking muscle, which requires a critical reading muscle. After 3 years at Amazon, my skills had increased drastically, but I was still weak at these by Amazon standards.

To get a sense for Amazon documents, check out Jeff Bezos's Shareholder letter for ([2020](https://s2.q4cdn.com/299287126/files/doc_financials/2021/are/Amazon-2020-Shareholder-Letter-and-1997-Shareholder-Letter.pdf)) or a a [root cause analysis](/coe) for the [Kennis Service](https://aws.amazon.com/message/11201/).

These documents are "easy" compared to Amazon internal documents, but even still a few things to notice:

- Are well written and clear. Amazonians pride themselves in being readable.
- Are context free, e.g. They don't require a lot of external knowledge.
- Are dense. You need to be a good reader to grind through the details.
- Are number heavy, having few adverbs and adjectives (weasel words in Amazon lingo)

### Sucking till you don't

You're going to suck till you don't. I could never explain it as well as Ira Glass (the host of this america life), so watch his video:

<div class="embed-responsive embed-responsive-16by9">
  <iframe
    class="embed-responsive-item"
    src="https://player.vimeo.com/video/176325518?color=1fc9a2&portrait=0"
    allowfullscreen
  ></iframe>
</div>

### Building Knowledge - Evergreen notes

[Evergreen notes](https://notes.andymatuschak.org/z4SDCZQeRo4xFEQ8H4qrSqd68ucpgE6LU155C), are a concept brilliantly articulated by Andy Matuschak. Worth a read in its entirety, but I'll inline his definiton:

Evergreen notes are written and organized to evolve, contribute, and accumulate over time, across projects. This is an unusual way to think about writing notes: Most people take only transient notes. That’s because these practices aren’t about writing notes; they’re about effectively developing insight: “Better note-taking” misses the point; what matters is “better thinking”. When done well, these notes can be quite valuable: Evergreen note-writing as fundamental unit of knowledge work.

It’s hard to write notes that are worth developing over time. These principles help.

Evergreen notes should be:

- atomic
- concept-oriented
- densely linked
- interlinked (like the web), as opposed to hierarchal (like file folders).

You'll note, this blog is my implementaiton of evergreen notes.

## Writing to understand

### All Mental models are wrong.

Mental models are simplifications of reality, and mental models conflict, and classifacation at the edges is painful.

This is required as the world is infinitly complex, and we need simpler models to understand what is going on.

Imagine you want to describe the real world, or the physical terrain to someone, so you give them a map. The type of map you provide depends on what you are trying to understand. Say you want to drive from point A to point B then you'd want a map of streets. Now say you wanted to install a wind turbine, in that case you wouldn't care much about streets, but you'd want a map of average winds.

Because the map is not the terrain, the map is wrong, and classifying the edges is hard.

Wrong Section - An example of misinterpration - the [5 blind men and the elephant](https://en.wikisource.org/wiki/The_poems_of_John_Godfrey_Saxe/The_Blind_Men_and_the_Elephant)

### SWOT and SOAR - Exploring the space

SWOT:

| Axis         | Tailwinds   | Headwinds |
| ------------ | ----------- | --------- |
| **Internal** | Strength    | Weakeness |
| **External** | Opportunity | Threats   |

SOAR:

| Axis         | Value Proposition | Goal        |
| ------------ | ----------------- | ----------- |
| **Today**    | Strength          | Opportunity |
| **Tomorrow** | Aspiration        | Results     |

### MECE - How you know you're done.

Mutually Exclusive, Collectively Exhausted (MECE), is two distint ideas.

“Mutually exclusive” is a concept from probability theory that says two events cannot occur at the same time. For example, if you roll a six-sided die, the outcomes of a six or a three are mutually exclusive. When applied to information, mutually exclusive ideas would be distinctly separate and not overlapping.

“Collectively exhaustive” means that the set of ideas is inclusive of all possible options. Going back to the six-sided dice example, the set {1,2,3,4,5,6} is mutually exclusive AND collectively exhaustive.

More details: https://strategyu.co/wtf-is-mece-mutually-exclusive-collectively-exhaustive/

### Minto's Pyramid Principle

A [rare book](https://www.amazon.com/Pyramid-Principle-Logic-Writing-Thinking/dp/0273710516/) on how to write well. Sadly long out of print, but worth picking up a copy

{%include amazon.html asin="0273710516;" %}

### Elon's First Principles

### Five Whys

_TODO: Move to COE post_

Ask why 5 times till you get to a root understanding. Exactly 5 why's doesn't matter, getting no deep then why does. Also forks in the answers usually happen. Lets dig in...

**1 - Why am I bad shape?**

Because I stopped exercising

**2 - Why did I stop exercising?**

Because it's a lot of effort.

**3 - Why is a lot of effort?**

Because the gym closed
Because I'm not prioritizing it enough

**3.1 Why is the gym closed?**

Because of Corona Virus

**3.2 Why aren't you prioritizing exercise enough**

Because it doesn't feel urgent in the moment.

You know you have your Five Why's right when you can reverse the answers joined by "therefore", and it's coherent

- Because of Corona Virus
  - Therefore the gym is closed
- Because it doesn't feel urgent in the moment
  - therefore I'm not prioritizing exercise enough
- Therefore I stopped going to the gym
- Therefore it's a lot of effort.
- Therefore I stopped exercising

### Diagrams

Diagrams are a vocabulary until themselves. My notes on [visual vocubulary](/td/visual-vocabulary). But a few notable links:

- [The noun project](http://thenounproject.com) - open source icons for everything.

### Stories and actions not just data

A fantastic diagram to explain the idea

{%include blob_image.html src="blog/data-story.jpg" %}

And a great primer on what to convery to graph

- [Decide what you want to express - then pick the graph](https://towardsdatascience.com/5-quick-and-easy-data-visualizations-in-python-with-code-a2284bae952f)

## Writing to be Understood

### The journey or the recommendation

Sometimes you want to share your journey, the twists and turns and helping readers empathize or be trained. By contrast there are times you want to provide a recommendation and reasoning. The time element, and your experiences are noise in this case.

**The Journey**

Consider using the Hero's formula, or the pixar formula below.

**The Recommendation**

- Here's what we should do
- Here's why
- Here's the tradeoffs and what we considered
- Here's our assumptions and supporting data

### The detective formula: Situation, Complication, Resolution

### The Pixar Formula:

https://startuppitch.substack.com/p/nail-your-startup-pitch-use-pixars

- Situation/Context:
  - Once upon a time there was [details]
  - Every day, [details]
- Complication/Problem:
  - One day [details]
  - Because of that, [details]
- Resolution/Solution
  - Because of that, [details]
  - Until finally [details]

### The Hero's Journey Formula:

### The feedback formula: Situation, Behavior, Impact

Very useful in giving feedback and [coaching](/coaching)

- When [details] happened
- I experienced [details]
- As a result [details]

### The crappy modern business book

The modern business/self-help book formula is:

- Long Introduction
  - A few stories and personal engagmenet
- Introduce 3 point model, with sub points
  - Includes a picture or acronym
- 1 section per point model
  - 1 chapter per sub point
    - Several stories per sub point
- Weak summary

Generally, these books can be summarized in a short 5 page essay. In fact they often have an HBR (Harvard Business Review) article from the auther which does exactly that.

Business book don't have to be crappy by laws of physics, some are excellent like the [first 90 days](/90days). I highly recommend reading both for the content, and the structure. The structure is awesome because

## Pen to paper

### Madman, Architect, Carpenter, Judge

From [my full post](https://ig2600.blogspot.com/2015/07/soft-skills-writing-as-madman-architect.html)
Writing breaks down into 4 distinct phases: brainstorming, organization, writing and editing. To reinforce the distinctness of these phases, think of writing as four distinct jobs: Madman, Architect, Carpenter and Judge. Maximize your efficiency by doing each job, distinctly, deliberately and serially.

Each job has a specific goal, and that goal should be your sole focus during while doing that job. Do not do the next job, and do not go back to previous jobs. To reinforce the distinctness of each job, consider using a different tool, and physical reminders of each job.

### On essay's and writing:

Paul Graham

http://www.paulgraham.com/useful.html

_I've never tried to count how many times I proofread essays, but I'm sure there are sentences I've read 100 times before publishing them. When I proofread an essay, there are usually passages that stick out in an annoying way, sometimes because they're clumsily written, and sometimes because I'm not sure they're true. The annoyance starts out unconscious, but after the tenth reading or so I'm saying "Ugh, that part" each time I hit it. They become like briars that catch your sleeve as you walk past. Usually I won't publish an essay till they're all gone — till I can read through the whole thing without the feeling of anything catching._

Jeff Bezos:

Read Jeff's [letters to shareholders](https://drive.google.com/file/d/1SpgDsIpC_cAS0O4cBz4Sb_GJcEIBhUtA/view), imagine how long he spends writing them.

### How to write effectively

{%include youtube.html src="vtIzMaLkCaM" %}

Haven't watched this one yet ...

{%include youtube.html src="aFwVf5a3pZM" %}

### How to tell a great story

Doesn't really fit, but I do enjoy this story

{%include youtube.html src="KxDwieKpawg" %}

### Writers head to readers head, like an army through a choke point

### My 80 hours on an outage document

When something goes wrong at amazon you write a [correction of errors(COE)](/coe) document. In my last few months of Amazon I wrote a COE on an Alexa outage which was a result of poor interaction between the system that turns "speech into text"(ASR) and the system that turns "text into meaning" (NLU).

This was some deeply technical stuff, but needed to be clear so non-domain experts could understand what happened. I ended up spending over 80 hours on this, and even enlisted the help of a marketing person who had no idea how Alexa worked to ensure my writing was crystal clear.

Some people might be appled. 80 hours is 2 strait weeks of work, (which I stretched out over 4 weeks). I think it was time well spent for two reasons.

First, I was muscle building. I'm pretty sure if my writing muscle was fully matured, and I had already understood the ASR and NLU space, I could have written this document in 20 hours, meaning 60 hours was just training, which is always worth it.

Second, outage is expensive, as is incorrect action,

### Writing Software and Tools

I need to minimize distractions, so I try to write distraction free on my iPad

- My iPad [writing tools](/td/ios-nomad)
- My [iPad Setup](/td/ios)
- I write in [vim](/vim-for-writing)
