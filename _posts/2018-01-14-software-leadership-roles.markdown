---
layout: post
title: "Tech leads, software architects and engineering managers - oh my!"
date: "2018-01-14 05:14:37 Pacific Standard Time"
tags:
    - software engineering
---


The line between a technical lead and architect (and product manager and engineering manager) is fuzzy and subjective. The best articulation of difference I've found is below copied from Quora. In this classification I like to run a team small enough that I have time to be both an engineering manager and software architect.

Copied (with slight editing) from [Kartik Ayya's](https://www.quora.com/profile/Kartik-Ayya) excellent [answer](https://www.quora.com/What-are-the-key-differences-between-a-technical-architect-and-a-lead-software-engineer)
Logically in a software organization needs to fill 4 roles. These roles are often "physically implemented" by various degrees in different team members.

**The tech lead:** The person who leads the team that actually builds it.

**The architect:** The person who translates a ideas that a product manager wants into ideas that can be implemented.

**The product manager:** The person who figures out what to build to satisfy customers.

**The engineering manager:** The person who makes sure the organization is [getting the most out of the team](/being-a-great-manager) and fills in the gaps.

**Lets dive deep into the differences between architect and technical lead**

The architects primary value is they design a cohesively implementable system in the face of many competing demands.

They focus on the big picture, and a large part of their job is to both have and drive the vision of what needs to be done.

The lead engineers job is to ensure that things get built.

**Technical skills:**

The lead engineer needs to be highly detail oriented, has to be able to write high quality code, review the code of engineers and is in general ultimately responsible for shipping code. They spend part of their time coding, and the rest of their time guiding other engineers to write code.

An architect, on a day to day basis, they will typically neither write or debug code. However, they must have an intimate understanding of software to do their job. Having an architect who isn't technically strong enough will mean they will come up with suboptimal or mediocre solutions to the problem, which over time will just lead them to losing the trust of engineers working on the implementation.

It is usually an extremely poor decision to make someone an architect who hasn't been a highly seasoned implementer.

They need to understand for example what parts of the product you are building need to be extremely high performance or mission critical and use that knowledge to propose designs that are sound.

**Leadership skills**

Both roles lead, though in slightly different ways.

The lead engineer leads by inspiring and setting the bar for code quality for the engineering team, and cracking the hard problems.

The architect leads by building consensus, particularly in the face of competing design requirements. It is typically up to the architect to make  good solid judgement calls around figuring out things like "Okay, these 4 code paths are really the ones to typically optimize around and must run in constant time, and everything else isn't something we need to worry about too much.", and so on.

Typically the architect is former implementer.

**Communication skills:**

In general the architect needs to be an excellent communicator given their primary role of bringing otherwise sound though perhaps disjoint ideas together. The same isn't necessarily true of lead engineers. You can be a relatively good lead engineer despite having average communication skills.

**Summary:**

At the end of the day what really matters in both cases is the individuals in both roles are technically sound and work on tasks that they are good at. I've seen individuals who are exceptionally good at one of the spectrum who probably would be underutilized in the other role.

I've seen engineering manager take on all of the aforementioned roles depending on the gaps in the team. 

Given that there is often enough of an overlap in the core technical competencies, many organizations don't formalize the distinction between the two roles in terms of an actual title and just let individuals gravitate towards what they do best.




