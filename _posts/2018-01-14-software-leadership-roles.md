---
layout: post
title: "Tech leads, software architects and engineering managers - oh my!"
date: "2018-01-14 05:14:37 Pacific Standard Time"
tags:
  - software engineering
---

The line between a technical lead and architect (and product manager and engineering manager) is fuzzy and subjective. The best articulation of the difference I've found is inline from Quora. In this classification I like to run a team small enough that I can be the engineering manager and step in as the software architect as required.

Copied (with slight editing) from [Kartik Ayya's](https://www.quora.com/profile/Kartik-Ayya) excellent [answer](https://www.quora.com/What-are-the-key-differences-between-a-technical-architect-and-a-lead-software-engineer)

### Leads, Architects, and Multiple Managers

A software organization needs to fill 4 leadership roles. These roles are often "physically implemented" by various degrees in different team members.

**The tech lead:** The person who leads the team that actually builds it.

**The architect:** The person who translates ideas that a product manager wants into ideas that can be implemented.

**The product manager:** The person who figures out what to build to satisfy customers.

**The engineering manager:** The person who makes sure the organization is [getting the most out of the team](/manager-book) and filling any gaps.

### Four roles, or four dimensions?

Reading this back years later, I don't think these are four kinds of person. They're four dimensions of one job, and every team divides them up differently. Two of the four are technical and pull in opposite directions — implementing the thing, and deciding what the thing should be — which is exactly why the line between tech lead and architect never stays put.

So on the chart below the architect doesn't get a bar. Setting technical direction is a _row_, and all three of the other roles carry some of it. That's the honest version of what I said above about running a team small enough that I can be the engineering manager and step into the architect seat when it needs filling.

{% include role-energy-depth.html %}

The second measure is what I'd add to Kartik's answer. Energy is where your calendar goes. Depth is what you actually understand. Those come apart, and they come apart in both directions.

The reserve is why I've seen engineering managers cover any of these roles when the team had a gap — the understanding was already there, it just wasn't on the calendar. The stretch is the failure mode I list at the bottom of this post: _people think they are filling a role but they are not, or can not._ Most of the friction I've watched between these roles lives in that gap, not in the org chart.

### The Tech Lead vs the Architect

The architect's primary value is they design a cohesively implementable system in the face of many competing demands.

They focus on the big picture, and a large part of their job is to both have and drive the vision of what needs to be done.

The tech lead's primary value is ensuring that things get built with high quality on time.

They focus on delivering projects, and a large part of their job is executing and overseeing the planning, design, and implementation of the project.

### The 3 skills

#### Technical skills

The lead engineer needs to be highly detail oriented, has to be able to write high quality code, review the code of engineers and is in general ultimately responsible for shipping code. They spend part of their time coding, and the rest of their time guiding other engineers to write code.

An architect, on a day to day basis, will typically neither write or debug code. However, they must have an intimate understanding of software to do their job. Having an architect who isn't technically strong will result in sub optimal solutions which will result in a loss of trust from the engineers working on the implementation.

#### Leadership skills

Both architects and tech leads lead, though in slightly different ways.

The lead engineer leads by inspiring and setting the bar for code quality for the engineering team, and cracking the hard problems.

The architect leads by building consensus, particularly in the face of competing design requirements. It is typically up to the architect to make good solid judgment calls around figuring out things like "Okay, these 4 code paths are really the ones to typically optimize around and must run in constant time, and everything else isn't something we need to worry about too much.", and so on.

#### Communication skills

In general the architect needs to be an excellent communicator given their primary role of bringing otherwise sound though perhaps disjoint ideas together. The same isn't necessarily true of lead engineers. You can be a relatively good lead engineer despite having average communication skills.

### Summary

At the end of the day what really matters is the architect and tech lead are technically sound and work on tasks that they are good at. I've seen individuals who are exceptionally good at one role who would be underutilized in the other role.

Many organizations don't formalize the distinction between tech lead and architect through title and let the individuals gravitate towards what they do best.

I've also seen engineering managers take on all of the aforementioned roles depending on the gaps in the team.

### When the system doesn't work as well as it should

(Thanks to my wise colleagues for bringing up these questions, looking forward to getting folks opinions on the answers)

- People are filling the same role, and keep stepping on each others toes
- People think they are filling a role but they are not, or can not
- The power imbalance between manager and other roles due to positional authority.
