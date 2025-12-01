---
layout: post
title: Time off X-mas 2022
permalink: /timeoff-2022-12
imagefeaturelocal: raccoon-vaccation.png
---

It's X-mas 2022, quite the fall excitement edition! and I've got 1 and change weeks off in an attempt to maximize my personal development and satisfaction during my time off, by staying balanced, and minimizing my vegetation. I'm going to pre-write what I want to get done, and adjust it as I go.

This is a combination of [time off](/time-off), and all the stuff for [happiness](/happy), which I guess gets tangled up with half of my evergreen notes.

Humorously, I can just copy much of my todo from last year as it's pretty similar!

I didn't create enough moments (that's a great learning).

## My top priorities

### Health and Habits

My habits and balance have been strong, just keep my streaks running!

- End the year at and honest 180 (even better a lying 175)
- Keep up the daily gym, magic and ballooning
- Create moments with the family (and take Selfies of them)
- Build the TGU and swing habit

## Moments

{%include summarize-page.html src="/moments" %}

- Amelia's Holiday Party (Deaf kid, coming back seeing everyone)
- TBD Jumped in the lake 2021
- Doing programming with Zach

## Success Stories

- Hit the gym like every day!
- Got daily kettle bell swings and TGUs!
- Got a tonne of time to play with the new AI stuff
- Got Zach to program every day
- Supported Tori in working when she needed to work

## Top Learnings

- This year, reads almost [identical to last year](/timeoff-2021-12). Not sure if that means I've solved it, or I'm stuck in a local maximum? I guess regardless I'm not regressing.
- I need to plan more moments, instead of relying on "good intentions", I didn't pre-write many moments, and none happened.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Relationships (3/5)](#relationships-35)
    - [Friends](#friends)
    - [Tori](#tori)
    - [Zach](#zach)
    - [Amelia](#amelia)
- [Identity Health (2/5)](#identity-health-25)
    - [Biking](#biking)
    - [Ballooning](#ballooning)
    - [Joy Activities](#joy-activities)
    - [Magic](#magic)
- [Tech Guru (5/5)](#tech-guru-55)
    - [AI text assisting](#ai-text-assisting)
    - [AI Created Git Commit Writing](#ai-created-git-commit-writing)
    - [AI image assisting, and brand blog with raccoons](#ai-image-assisting-and-brand-blog-with-raccoons)
    - [Finally got clipboard working over ssh/mosh](#finally-got-clipboard-working-over-sshmosh)
    - [Create github links from within VI](#create-github-links-from-within-vi)
    - [Add search to family blog posts](#add-search-to-family-blog-posts)
    - [Performance speed ups to python scripts](#performance-speed-ups-to-python-scripts)
    - [Performance speed ups to manager-book and rest of blog](#performance-speed-ups-to-manager-book-and-rest-of-blog)
    - [Playing with Recommender systems](#playing-with-recommender-systems)
- [Cognitive Health (4/5)](#cognitive-health-45)
    - [7 Habits](#7-habits)
    - [Blog posts](#blog-posts)
- [Emotional Health (4/5)](#emotional-health-45)
    - [Meditation](#meditation)
    - [750 words/Gratefulness](#750-wordsgratefulness)
- [Motivation (4/5)](#motivation-45)
- [Physical Habits (4/5)](#physical-habits-45)
    - [Statistics](#statistics)
    - [Diet](#diet)
    - [Sleep](#sleep)
- [House and goods](#house-and-goods)
- [Inner Peace (5/5)](#inner-peace-55)
    - [General Inner Peace](#general-inner-peace)
    - [Work](#work)
    - [Family](#family)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Relationships (3/5)

### Friends

Dropped the ball on this, but added hanging out with these folks into my goals for next year!

- ☑ Catch up with Slava
- ☐ Catch up with Bob
- ☐ Catch up with Dave

### Tori

Private

### Zach

- Programming every day! Now he's doing it by himself
- Got him to do a few pushups
- Went out for lunch to celebrate programming, visited Tori at work, and walked home (his desire!)

### Amelia

- Helped her setup VR, and get it going with Terra.
- Lots of hugs
- Room for improvement here. Need to make a plan for what I want to do with Amelia explicitly.

## Identity Health (2/5)

### Biking

- Did not bike at all :(

### Ballooning

- Made some great balloons for a co-worker that was in town to visit Seattle with his family
- After that, didn't make any balloons :(

### Joy Activities

- Nothing

### Magic

- Some practice, but not much

## Tech Guru (5/5)

For the last few months I've been blocking myself from being a tech guru, and honestly instead what has been happening is I've been vegetating. I decided I'd be better off doing tech guru stuff, and OMG it's fun!

### AI text assisting

Did a bunch of NLP setup, using it more effectively

- Created [vim convo files](https://github.com/idvorkin/Settings/commit/3664700566d7b96f2428b696d2fe6be64e93f6b0) to emulate ChatGPT but better!

### AI Created Git Commit Writing

- Giving amazing git commit messages (see the above commit message)

        Setup text completion functionality for convo files

        This commit configures text completion for convo files. Setting up a
        match rule, turning off hitting enter indents, and assigning keyboard
        mappings to facilitate completion via the GPTComplete() function. It
        also creates the SetupForConvo() function, which is called when a convo
        buffer is entered. It adds the $put . <cr> command, which adds a new
        line when fs pressed.

- Integrated git commit [creation into vim](https://github.com/idvorkin/Settings/blob/97e9ea51e4ce4b0ce98123900c07fd76836b7bbf/default_vimrc#L898)
- GPT making [commit messages](https://github.com/idvorkin/nlp/blob/acecb9abe617ec09150e5a5c65074f4c3f6e738d/gpt3.py#L235)

### AI image assisting, and brand blog with raccoons

Used GPT to help create images for my blog -- super fun! I went a bit crazy and wanted to make sure when images floated left that text would wrap into the shape, turns out there's a way to do that with modern CSS. But it was wonky as you'd hit CORS errors, so I had to copy images into my blog repo, instead of into blog. What a PITA.

See this [change](https://github.com/idvorkin/idvorkin.github.io/commit/ec431dc1e1a9b3242bbcdb461be09117bb21abc4)

### Finally got clipboard working over ssh/mosh

Holy shit that should not be so hard! Looks like OSC-52 codes are finally working in TMUX latest, which is why it broke the last time. I also have a tunnel working for OSX-based SSH!

<https://github.com/idvorkin/settings/tree/master/pbcopy>

### Create github links from within VI

Turns out I've been going to github and finding files manually like a chump. There's a hub command for that, and now it's integrated with ghlink in [vim](https://github.com/idvorkin/Settings/blob/1adfec7aed775c5055f4784c8582cd15eaad2f07/default_vimrc#L911)

### Add search to family blog posts

My family blog didn't have a search index. Added one and made it accessible when searching on the [family journal page](https://github.com/idvorkin/idvorkin.github.io/commit/0aad61a8db85d5962e976ccfe0117107ca2be11a).

If these git commits look especially good, it's because well AI wrote them!

### Performance speed ups to python scripts

They are slow, sped 'em up w/Tuna and import scripts

### Performance speed ups to manager-book and rest of blog

Also slow, took out almost a MB of unused JS libraries. Damn, they really add up

### Playing with Recommender systems

Looked at it, but walked away since more fun to work on my enabling environment

## Cognitive Health (4/5)

### 7 Habits

- Didn't touch it.

### Blog posts

- Added images to various blog posts (Super fun)

## Emotional Health (4/5)

### Meditation

- ☑ Daily meditation!

### 750 words/Gratefulness

- ☑ Daily Gratefulness journal/750 words!

## Motivation (4/5)

- Pretty high once I went into tech guru mode

## Physical Habits (4/5)

### Statistics

Weight Start: 185
Weight End: 187
Gym Days: 7

OMG - 187, took my foot way off the gas!!! Try again for January

### Diet

Not great, as seen by weight gain.

### Sleep

Like a baby

## House and goods

- ☑ Fix LTC insurance.

## Inner Peace (5/5)

### General Inner Peace

- Crushed it, nothing bugged me.

### Work

Zero stress here, funny given last year ...

**Spending vacation days when it's "fun time at work"** Not a problem at all this year.

**January is going to be a tough month at work.** January is calibration time at Meta. The team is a fair bit smaller then last year so I'm feeling good about this.

### Family

- Frustrated by not doing much as a family. But realized, that's on me. If I don't plan something than I should not be surprised that nothing happened.
- Normal frustration about Zach health is gone, as Zach is self motivated to be healthy
