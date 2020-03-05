---
layout: post
title: "Igor's book of manager"
date: "2020-03-05 00:56:07 +0000"
tags:
  - manager
  - job-hunt
---

Managing is hard. Lessons are hard earned, and should be cherished. This series of posts is designed to draw out my opinions on management. It reminds me how to behave, and encourages others to poke into my reasoning and help me improve. I'm using an interview format for this post, as that's an easy way to start.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Part #1: What does a manager do](#part-1-what-does-a-manager-do)
    - [What are a managers responsibilities](#what-are-a-managers-responsibilities)
    - [How do you measure your success?](#how-do-you-measure-your-success)
    - [How do you describe your job to people outside the industry?](#how-do-you-describe-your-job-to-people-outside-the-industry)
    - [How do you build a team?](#how-do-you-build-a-team)
        - [People boot strap.](#people-boot-strap)
        - [Charter/Execution boot strap](#charterexecution-boot-strap)
    - [Why is management attractive to you?](#why-is-management-attractive-to-you)
    - [Hardest part about being a manager](#hardest-part-about-being-a-manager)
    - [What do you do in the first 90 days?](#what-do-you-do-in-the-first-90-days)
    - [Should managers code?](#should-managers-code)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Part #1: What does a manager do

### What are a managers responsibilities

### How do you measure your success?

Success of a manager is the success of the team. This manifest in 4 dimensions:

<!--
An acid test:

- People love their team.
- People have clear understanding of career growth/progression and how their work supports it.
-->

4 Dimensions:

- Business Results: Ultimately the team delivers business value for our customers and organization. I define success (KPI), and help team understand and deliver it.
- People Growing in a high performance team: The team is well gelled with team members helping each other. Everyone has growth plans which fit their needs and they are execution them.
- Engineering Efficiency and Process: Our engineering systems ensure a pit of success where things which can be automated have been, and we have high velocity releases with minimal risk.
- Technical Assets: Are systems are extensible in the ways that support the business. Our operational burden is minimal (side bar: to help me prioritize I'm on the pages), and our technical debt is applied judiciously (like take debt if you might be able to write off the asset)

### How do you describe your job to people outside the industry?

I run a factory which produces widgets and has employees. For those in the industry this translates to:

- Widget == Business Results
- Factory Workers == Team health and growing, leaders who make software
- Worker Operating procedures == Software Design Life Cycle,
- Factory machines - architecture, tech assets

My role:

- Business Results: I work with the business to help figure out the best "widgets we can make", by understanding what people want to buy, and explaining how our factory runs.
- People growing in a high performing team: I am responsible for the workers in the factory: Are they healthy, learning, wanting to come to work every day, getting along with co-workers.
- Engineering Efficiency and Process: I am responsible for the efficiency of the factory: Is production good and improving? Are widgets coming out consistently and on schedule? Do new employees know what to do? Does everyone know what to do if there's an emergency?
- Technical Assets I am responsible for the machines we build and maintain: Can the machines in the factory be adjusted for the different types of widets we need to build? Do the machines mostly work or do they need constant adjustment? Are the machines we bought used to high efficiency?

Top metrics:

- Business Resutls: Did we make the right widgets on time and budget?
- People Growing: Are the works happy based on surveys
- Egineering Efficiency and Technical Assets: Is our factory solid and able to make new stuff quickly and maintain production?

### How do you build a team?

#### People boot strap.

In the ideal world:

- Start with a high level view of the business
- Put in places the senior developers to build out the architecture and process
- Start working by getting your SDE-IIs and SDE-Is

In the real world:

- Vague Idea
- Add people as you find them (however, hard stop when too many juniors)
- Pick some easy wins, and get those started, ready to pick up debt to see what we can do.
- As you wait to hire more experienced folks try to borrow folks from other teams ideally for a rotation or at least for bar raising designs, architecture and mentorship

#### Charter/Execution boot strap

- North star vision
- First experiments in tech and market
- Find the first wins to tune
- Build out early roadmap and product.
- Continuous improvement as people join.

### Why is management attractive to you?

- On deathbed, the product I want is people who grew
  - Cliche: Love your people, want to see them thrive and grow
  - Want to save folks from unsustainable jobs, and treat folks as people not resources.
- Get shit done
  - Clear roadblocks
  - Ship
- Skill, clarifying, building consensus, sharing the story and meaning.
- Leader Ownership, but not a good enough PM, and very strong tech
- Lead and inspire
- Servant leadership
- On top of best practices

### Hardest part about being a manager

- Surprisingly: People think it's firing it's not.
- Greedy: telling team I'm quitting, tears, ride bike, etc.
- Actual: When need to surprise folks, abrupt direction change or killing projects.
- Expected: Layoffs, when know and can't tell.

### What do you do in the first 90 days?

_First 90 days is the book_

Outputs:

- Early Win: Figure out the situation, and deliver a win.
- Trust: Relationships with team, and peers, and partners.
- Knowledge: Know critical parts of business, tech, org.

<!--
**Learn**

Learning as an investment process. Planning to learn. Figuring out the best sources of insight. Using structured methods to accelerate learning.

**Build Trust and Relationship**

Build Your Team Inheriting a team and changing it. Managing the tension between short-term and long-term goals. Working team restructuring and organizational architecture issues in parallel. Putting in place new team processes.

Create Alliances The trap of thinking that authority is enough. Identifying whose support is critical. Mapping networks of influence and patterns of deference. Altering perceptions of interests and alternatives.

**Diagnose, agree, and find 90 day win**

Match Strategy to Situation The dangers of “one-best-way” thinking. Diagnosing the situation to develop the right strategy. The STARS model of types of transitions. Using the model to analyze portfolios, and lead change.

Negotiate Success Building a productive working relationship with a new boss. The five-conversations framework. Defining expectations. Agreeing on a diagnosis of the situation. Figuring out how to work together. Negotiating for resources. Putting together your 90-day plan.

Achieve Alignment The role of the leader as organizational architect. Identifying the root causes of poor performance. Aligning strategy, structure, systems, skills, and culture.

Secure Early Wins Avoiding common traps. Figuring out A-item priorities. Creating a compelling vision. Building personal credibility. Getting started on improving organizational performance. Plan-then-implement change versus collective learning.
-->

### Should managers code?

Managers should read code on specific occasions, but they can't be on critical path because their time is often needed to deal with urgent situations. Thus, they can only write low importance code usually something you'd assign to an SDE-I. At that point, you have a very expensive priority inversion.

That said, SDMs need to use their product just like their customers do to be able to better understand and meet the customer need. Like wise, SDMs need to use their development tools periodically, which should include the code/test/deploy cycle, so they are better able to understand and meet their team's (aka other big customer) need.

SDMs should be reading code occasionally:

1. Spot checking - SDMs should have a good "something is fishy" intuition, and should be able to independently and discreetly prove or disprove their intuition.
1. Assessing people - Code is a major deliverable for developers and should be inspected as part of people assessment.
1. Deep dive during major outages - In high risk, time critical situations like outages, you want your best people reviewing the changes, and this includes SDMs. If an SDM can't understand a high risk time sensitive code change, it can be, and should be simplified.
