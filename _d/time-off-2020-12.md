---
layout: post
title: Time off X-mas 2020
permalink: /timeoff-2020-12
no-render-title: true
---

It's Corona virus X-mas, and I've got 2 weeks off. In an attempt to maximize my personal development and satisfaction during my timeoff, by staying balanced, and minimizing my vegetation I'm going to pre-write what I want to get done, and adjust it as I go.

This is a combination of [time off](/time-off), and all the stuff for [happiness](/happy), which I guess gets tangled up with half of my evergreen notes.

I took the first 2 days to vegitate, which wasn't a conscious decision, it was just what happened when I didn't think about it. And boy did I vegitate. I think all I did on Sunday was consume media on my iPad and TV.

## Moments

## Success Stories

I've used this time to restart the flywheel on magic, and diet, re-enforce my discipline, and keep a balance with my family.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Top Learnings](#top-learnings)
- [Relationships](#relationships)
    - [Friends](#friends)
    - [Tori](#tori)
    - [Zach](#zach)
    - [Amelia](#amelia)
- [Identity Health](#identity-health)
    - [Magic](#magic)
    - [Tech Guru](#tech-guru)
        - [DENY LIST: Shell + Enabling Environment + Python in VIM](#deny-list-shell--enabling-environment--python-in-vim)
        - [Data Analysis - Pandas](#data-analysis---pandas)
        - [CUT: Ranking Systems](#cut-ranking-systems)
- [Cognitive Health](#cognitive-health)
- [Emotional Health](#emotional-health)
    - [Meditation](#meditation)
    - [750 words](#750-words)
- [Physical Health](#physical-health)
    - [Statistics](#statistics)
    - [Diet](#diet)
    - [Sleep](#sleep)
    - [Energy](#energy)
- [House and goods](#house-and-goods)
- [Mental quicksand](#mental-quicksand)
    - [Spending vacation days when it's "fun time at work"](#spending-vacation-days-when-its-fun-time-at-work)
    - [January is going to be a tough month at work.](#january-is-going-to-be-a-tough-month-at-work)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Top Learnings

## Relationships

### Friends

- ☑ Catch up with Slava
- ☐ Catch up with Manish
- ☐ Catch up with Bob

### Tori

Private

### Zach

Private

### Amelia

- ☐ Spend time with her in the hottub 8/10 days
- ☐ Read with her 8/10 days - finish dog on a log book 3 and book 4 (books to help her learn to read)
- ☐ JOY: Watching her start catching words from TV and books I'm reading to her
- ☐ 4/10 days going for a bike ride

## Identity Health

### Magic

Magic used to bring me great pleasure, and I really have been ignoring it under the guise that it's not fun doing magic without an audience during CV-19. This is a lie though - as I get a lot of meditative pleasure from doing magic, and in 6 months once lockdown is over, I'll be thrilled to have new tools in my tool box.

- ☐ Learn a new rubber band - the gift
- ☐ Practice my rubber band stuff daily
- ☐ Figure out how to get that looking good on camera - study Joe - ☐ Carry rubber bands on my wrist
- ☐ Practice the magic board 5/10 days

### Tech Guru

#### DENY LIST: Shell + Enabling Environment + Python in VIM

It's something that I'm over invested in, and need to put an upper bound on to let me focus on other things.

Sigh, I couldn't help myself and did this beauty to figure out what files I'm changing in a time period [coded up in zsh](https://github.com/idvorkin/Settings/commit/6271f383995ecd95405c11193213ea5b2da5e083):

```
function gstatdaterange() {
    # $1 - start
    # $2 - end
    # can be days ago
    # glogdate '30 days ago' '1 day ago'
    # or absolute dates
    # glogdate '12/01/2020'

    # output all git commits since until, pretty print to just have the commit
    git_output=`git log --since "$1" --until "$2" --pretty="%H"`

    # diff between first commit to last commit, and sort the output by size
    #sort params -k=second column; -t=with delimiter as |; -n=sort as numeric -r sort as reversed
    git diff --stat `echo $git_output | tail -n 1` `echo $git_output | head -n 1` |  sort -k2 -t'|' -n -r
}
```

#### Data Analysis - Pandas

See [pandas](/pandas), and update my [sleep](https://nbviewer.jupyter.org/github/idvorkin/jupyter/blob/master/SleepAnalysis.ipynb) and weight analysis jupyter pages.

- ☑ Find the "theory" of data shapes, and use it to your advantage
- ☑ Get better at pivot tables and learning new graphing libraries (altair!)
- ☑ Read Pandas for everyone
- ☑ See if there are new tools for Jupyter

#### CUT: Ranking Systems

I checked this out briefly as it's a place I have little context, I think I'll wait till I'm back at work though, as I don't have any personal projects that require it - though perhaps I should find some.

## Cognitive Health

- ☐ Summarize [7 habits](/7-habits)
  - ☑ Break existing contenit into separate chapters for easy extension
  - ☐ STRETCH: Update concepts page
  - ☐ STRETCH: Update first things first page
  - ☐ STRETCH: Update Seek first to understand

## Emotional Health

- ☑ Read VSI: Happiness
- ☑ Wrote up some ideas on [mental pain](/mental-pain) from Dr. Raph
- ☐ Write up my engineering manager quick sands
- Even though work related, these quick sands are probably the biggest assault on my inner peace, and I want to spend some time maximizing the cognative force I can apply to these situations.

### Meditation

I've been doing daily 20 minute breathe meditation for 3 months and it is now a habit. I also "catch my breath" throughout the day, catching my monkey mind.

I'm considering my next steps here, perhaps doing it in the hottub, and or trying to include joy meditation and contemlative meditation.

It's interesting that even though I can catch ad-hoc or new kinds of meditation, I want to keep that 20 minute core meditation, as just like physical ativity, you may have activity but your routine is still the core.

### 750 words

This has been spotty throughout Decemeber, given I've got no other time commitments, restarting this should be easy.

- ☐ 10/10 days

## Physical Health

I've got a trainer now, which sets not just a lower bound to my activity, but in fact an optimal progress bound to my activity.

- ☐ 4 non trainer days, do my rolling, dynamic stretches and turkish get up.

I was able to 'level up' in a few domains:

- I can now plank for 90s
- I can now do Turkish get up (TGU) at 30lbs.

### Statistics

Weight: 229
Gym Days:

### Diet

My diet discipline has been week. I'll take some structural "additive" attempts to make it better.

- ☐ CONTINUE: Daily breakfast miso soup
- ☐ NEW: Daily Afternoon Popcorn
- ☐ NEW: Lunch include miso soup

### Sleep

- ☐ 10/10 wake up at 4:30.

### Energy

- ☐ GOAL: High

## House and goods

I think the hero of my good is my hot-tub - get in there every day, and come up with good ideas for maximizing my pleasure by doing things in the hottub to get twofers:

- ☑ Read in the hottub
- ☑ Meditate in the hottub
- ☐ Practice magic in the hottub
- ☑ Figure out outdoor lighting

Getting ready for the re-model is important too

☑ Complete all paper work for the re-fi

Random small suff

- ☑ Swap out Wi-Fi routers

Wow - that nighthark router really sucked, my new TP-Link A1700 (?) seems fantastic so far!!

## Mental quicksand

### Spending vacation days when it's "fun time at work"

It's a trade off taking time off during the holidays.

The pro of working during x-mas break:

- Most folks have taken off so there are no meetings, and you can spend the time on fun projects

The pro of time off during x-max break:

- The kids are also off, so an optimal time to spend with them
- There are naturally 4 holiday days so spending 6 days, you get a solid 14 days off.

### January is going to be a tough month at work.

January will be my first calibration at FB, I've got multiple people onboarding, and planning and all the normal manager complexities simultaneously. All of these situations occur naturally while being a manager, but it is hard when they all happen at the same time. I'll spend some time during holidays writing out reasonable expectations and best practices for dealing with these.
