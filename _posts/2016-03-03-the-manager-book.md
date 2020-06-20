---
layout: post
title: "Igor's Book of Management"
date: "2016-03-05 00:56:07 +0000"
tags:
  - manager
redirect_from:
  - /manager-book
---

Managing is hard. Lessons are hard earned and should be cherished. This series of posts is designed to draw out my opinions on management. It reminds me how to behave, and encourages others to poke into my reasoning and help me improve. I'm using an interview format for this post, as that's an easy way to start.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [What does a manager do?](#what-does-a-manager-do)
    - [What are a managers responsibilities?](#what-are-a-managers-responsibilities)
    - [How do you measure their success?](#how-do-you-measure-their-success)
    - [How do you describe your job to people outside the industry?](#how-do-you-describe-your-job-to-people-outside-the-industry)
    - [Hardest part about being a manager](#hardest-part-about-being-a-manager)
    - [What do you do in the first 90 days?](#what-do-you-do-in-the-first-90-days)
    - [Should managers code?](#should-managers-code)
- [Managing and Developing People](#managing-and-developing-people)
    - [How do you coach?](#how-do-you-coach)
    - [How do you develop careers?](#how-do-you-develop-careers)
    - [How do you help people switch jobs?](#how-do-you-help-people-switch-jobs)
    - [How do you keep people motivated?](#how-do-you-keep-people-motivated)
    - [How do you give challenging feedback:](#how-do-you-give-challenging-feedback)
    - [How do you do 1:1s](#how-do-you-do-11s)
    - [How do you handle communication problems?](#how-do-you-handle-communication-problems)
    - [How do you handle promotion fever?](#how-do-you-handle-promotion-fever)
    - [How do you identify and grow potential managers?](#how-do-you-identify-and-grow-potential-managers)
    - [How did you grow top talent](#how-did-you-grow-top-talent)
- [Culture](#culture)
    - [What is your ideal culture?](#what-is-your-ideal-culture)
    - [How do you make a good culture?](#how-do-you-make-a-good-culture)
    - [How do you handle Remote Work?](#how-do-you-handle-remote-work)
    - [How do you think about work life balance](#how-do-you-think-about-work-life-balance)
    - [How you deal with team disagrees with the leadership](#how-you-deal-with-team-disagrees-with-the-leadership)
    - [Agency and Psychological Safety](#agency-and-psychological-safety)
- [Process and Mechanism](#process-and-mechanism)
    - [Theory of Process](#theory-of-process)
    - [Never have a human do what a computer can do.](#never-have-a-human-do-what-a-computer-can-do)
    - [Team meeting](#team-meeting)
    - [Deep Dives and Guest Speakers](#deep-dives-and-guest-speakers)
    - [Engineering Excellence + Operational Review](#engineering-excellence--operational-review)
    - [Business Reviews](#business-reviews)
    - [Design+Arch Reviews](#designarch-reviews)
    - [Group Bonding](#group-bonding)
- [Hiring](#hiring)
    - [What are you looking for when you recruit?](#what-are-you-looking-for-when-you-recruit)
    - [Do they prefer to hire only experienced folks?](#do-they-prefer-to-hire-only-experienced-folks)
    - [Are they more comfortable with generalists or specialists?](#are-they-more-comfortable-with-generalists-or-specialists)
    - [How do you think about hiring?](#how-do-you-think-about-hiring)
    - [How do you think about the hiring funnel.](#how-do-you-think-about-the-hiring-funnel)
    - [What about structured vs free form interview loops?](#what-about-structured-vs-free-form-interview-loops)
    - [What are better kinds of interviews?](#what-are-better-kinds-of-interviews)
    - [Best hire of your career](#best-hire-of-your-career)
- [Firing and Performance Management](#firing-and-performance-management)
    - [Firing Ratios](#firing-ratios)
    - [The Process](#the-process)
- [Charters, Re-orgs and Bootstrapping](#charters-re-orgs-and-bootstrapping)
    - [The genesis: When you start from scratch](#the-genesis-when-you-start-from-scratch)
    - [The split: When a team outgrows a manager](#the-split-when-a-team-outgrows-a-manager)
    - [The merge: When a manager leaves](#the-merge-when-a-manager-leaves)
- [Personal Motivations](#personal-motivations)
    - [Why is management attractive to you?](#why-is-management-attractive-to-you)
    - [What is your dream job?](#what-is-your-dream-job)
    - [What is your career aspiration?](#what-is-your-career-aspiration)
    - [What are your thoughts on managers memorizing these answers for interviews.](#what-are-your-thoughts-on-managers-memorizing-these-answers-for-interviews)
- [Business Acumen and Strategy](#business-acumen-and-strategy)
    - [The Four](#the-four)
    - [Stratechary](#stratechary)
    - [By company](#by-company)
- [Other resources](#other-resources)
    - [Great Videos](#great-videos)
    - [Great Posts and Blogs](#great-posts-and-blogs)
    - [Great books](#great-books)
    - [Igor's other manager post](#igors-other-manager-post)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## What does a manager do?

### What are a managers responsibilities?

### How do you measure their success?

The success of a manager is the success of the team. This manifest in 4 dimensions:

<!--
An acid test:

- People love their team.
- People have clear understanding of career growth/progression and how their work supports it.
-->

| Dimension                          |                                                                                                                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Business Results                   | Team delivers business value for our customers and organization. I define success (KPI), and help team understand and deliver it.                                                                                                                      |
| High performance people and teams  | Team is well gelled with team members helping each other. Everyone has growth plans which fit their needs and they are execution them.                                                                                                                 |
| Engineering Efficiency and Process | Engineering systems ensure a pit of success where things which can be automated have been, and we have high velocity releases with minimal risk.                                                                                                       |
| Technical Assets                   | Systems are extensible in the ways that support the business. Operational burden is minimal (side bar: to help me prioritize I'm on the pages), and technical debt is applied judiciously (like take debt if you might be able to write off the asset) |

### How do you describe your job to people outside the industry?

I run a factory which produces widgets and has employees. For those in the industry this translates to:

| Dimension                          | Analog                      | Details                                                                                                                                                                                                                                                                        | Metrics                                                                          |
| ---------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Business Results                   | Widgets                     | I work with the business to help figure out the best "widgets we can make", by understanding what people want to buy, and explaining how our factory runs.                                                                                                                     | Did we make the right widgets on time and budget?                                |
| High performance people and teams  | Factory Workers             | I am responsible for the workers in the factory: Are they healthy, learning, wanting to come to work every day, getting along with co-workers.                                                                                                                                 | Are the workers happy based on surveys, and getting promos                       |
| Engineering Efficiency and Process | Worker operating procedures | I am responsible for the efficiency of the factory: Is production good and improving? Are widgets coming out consistently and on schedule? Do new employees know what to do? Does everyone know what to do if there's an emergency?                                            | Is our factory solid and able to make new stuff quickly and maintain production? |
| Technical Assets                   | Factory machines            | I am responsible for the machines we build and maintain: Can the machines in the factory be adjusted for the different types of widgets we need to build? Do the machines mostly work or do they need constant adjustment? Are the machines we bought used to high efficiency? | Is our factory solid and able to make new stuff quickly and maintain production? |

### Hardest part about being a manager

- Firing: People think it's firing but it's not, see that section
- Personally: Telling team I'm quitting, tears, ride bike, etc.
- Actual: When need to surprise folks, abrupt direction change or killing projects.
- Likely, but I haven't done it: Layoffs, when know and can't tell.

### What do you do in the first 90 days?

First 90 days is [the bible here](/90days)

Outputs:

- Early Win: Figure out the situation, and deliver a win.
- Trust: Relationships with team, and peers, and partners.
- Knowledge: Know critical parts of business, tech, org.

### Should managers code?

Managers should read code on specific occasions, but they can't be on critical path because their time is often needed to deal with urgent situations. Thus, they can only write low importance code usually something you'd assign to an SDE-I. At that point, you have a very expensive priority inversion.

That said, SDMs need to use their product just like their customers do to be able to better understand and meet the customer need. Like wise, SDMs need to use their development tools periodically, which should include the code/test/deploy cycle, so they are better able to understand and meet their team's (aka other big customer) need.

SDMs should be reading code occasionally:

1. Spot checking - SDMs should have a good "something is fishy" intuition, and should be able to independently and discreetly prove or disprove their intuition.
1. Assessing people - Code is a major deliverable for developers and should be inspected as part of people assessment.
1. Deep dive during major outages - In high risk, time critical situations like outages, you want your best people reviewing the changes, and this includes SDMs. If an SDM can't understand a high risk time sensitive code change, it can be, and should be simplified.

## Managing and Developing People

### How do you coach?

Coaching is a major part of the job, and covered in my [coaching post](/coaching):

_Coaching is like midwifery. A midwife can not give birth to the baby, she facilitates the birth. Similarly, a coach can not give a solution, she must give birth to the insight from within the coachee. Coaching is asking questions, guiding, and facilitating understanding, and this post collects my studies on the topic._

### How do you develop careers?

Depends on the skill level (Eg. [levels](https://www.levels.fyi/) ): SDE-I is a junior developer, SDE-II intermediate, and SDE-III senior and above . Also see my post on the differences between [Tech Lead, Architects and Managers](/software-leadership-roles).

| Level        | Approach                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Junior       | Not a lot of variance. Have a rubric for junior SDE skills and make sure they are getting the opportunity to learn and execute each box. Make sure they have a solid mentor, and opportunity after opportunity to round out their knowledge.                                                                                                                                     |
| Intermediate | Now it's about how are you helping the team, growing your contributions. Bigger experiences, maybe out side the org, both to build your skills, and increase your org visibility. Double down on super powers, close red flags and blockers. Very satisfying to watch people "blossom" into leaders.                                                                             |
| Senior/Staff | Here you're getting people are at a career level and are happy with a lot of what they're doing. Here they're deciding how much they want to grow, and where they want to improve. Here it's discussing with mentors, and how we want to split responsibility and cover each other. Also opportunities for what they own for the group (30-60+) e.g. security or process or etc. |

My approach, and frequent peep questions.

| Level        | Approach   |
| ------------ | ---------- |
| Junior       | [l10](l10) |
| Intermediate | [l20](l20) |
| Senior/Staff | [l30](l30) |

- l10
- You help them close gaps, sharpen their understanding by teaching it to you
- We hired you because you're smart+really good. If you can't understand something, it's probably the presenter doesn't understand it well, as opposed to you not understanding.
- You are new, and need to learn and need to spend a bunch of time asking for help and guidance. I have one rule - you must come with a bad idea (which will start becoming good ideas). You fail when you bring nothing, you ace it when you bring a bad idea. We'll help you develop that bad idea, and help sharpen your thinking skill.
- "You have a fresh perspective - If something doesn't make sense ask, for us, we're like fish in water, so challenge our assumptions".

<div> </div>
- l20
- How do you make the team better?
- What are you gonna be known for?
- You're the owner, you'll do everything and I work for you. What help do you need
- Do shadow coaching, where I might be writing/pr-doing work but they do the send/take the credit

<div> </div>
- l30
- Are you clear on [Tech Lead, Architects and Managers](/software-leadership-roles).
- What are you driving for our larger organization?
- How are you maximizing our benefit?
- How do we make sure we compliment each other?

### How do you help people switch jobs?

My goal is to find people the right job, not the job on my team. I coach a lot of people through this, and here are my most popular posts:

- [Reducing Job Hunt Stress](/job-hunt-stress)
- [Only care about total compensation](/comp)
- [What I wish I knew at 22](/twentytwo)

### How do you keep people motivated?

I use Danial Pink's DRIVE model, Autonomy, Mastery and Purpose:

- Autonomy
  - You are the owner
  - All decision need your sign off
  - Coach from behind (here's success, here's how I'd say it, what are the consequences, misses)
  - The team has your back.
  - Protecting from harmful rays of upper management and business
  - Only clear out as much as required
- Mastery
  - Career Development todo link it.
  - Training
  - In the dimension we agree to.
  - You can work at 110% of your capacity, but I tell you when you're at 90,100, or 110
  - Bigger and Bigger Opportunities and/or Exposure
- Purpose
  - Focus on the why
  - Call out the impact
  - Share the success with the team
  - Share success with partners and boss

People also care deeply about coaching and career growth:

- Catching people doing things right.
- 110% of capability but clarify doing 110% vs 80%

And I spend a lot of time on generating [Moments](/moments-at-work):

_Of all the places we spend our time, work is the one that dominates. However, when we look back on our lives, work is often the thing we remember least. Why? Because we remember our lives through peak moments, and there are few of those, especially positive peak moments, at work. Luckily, peak moments can be created and managers can be taught how to create them. This post explores opportunities and techniques to create these moments._

Some moments like:

- Constant celebrating people doing stuff fun
- Hack-a-thons
- Playing cards for appreciation
- Managers making breakfast

### How do you give challenging feedback:

Why is feedback challenging? 1) It's a surprise 2) They don't want to hear it 3) They don't think you have their best interests in mind.

Deep diving on what makes conversations hard:

1. Surprise - see around corners, and bring up anything I see ASAP, and foreshadow. Meet frequently, know what people care about.
2. Attack the messenger - High Trust, Know how the person likes to hear stuff. Address what they care about.
3. Don't want to hear it - Self Aware, Think I have their best interest in mind, Put it in terms they want to hear it.
4. Over dramatize - Anticipate what they'll care about, pre-address.

Types of tough conversations:

Performance, Charter, Re-org (me leaving), Lay Offs.

### How do you do 1:1s

Computers produce nothing, developers produce code. Business produce nothing PMs, other functions produce stuff.

I produce nothing, my output is the output of the team, and the team is the sum of the people. My ability to get the most value from my people is through my relationship with the people. If they trust me whole heartily, they'll tell me stuff I need to know, and I'll be able to understand how to give roles that grow them/influence them/inspire them. So, all my 1:1's start with What's on your mind - what ever they have we talk through. based on time and place we'll do X, Y.

For 1:1's for my team, the employees owns the Agenda, however I will nudge them. I like to spend time

- Building relationships
- Providing Larger Context
- Having confidential discussions on concerns and questions.
- Coaching strategically
- Coaching tactically.
- Having [awkward discussions](https://medium.com/@mrabkin/the-art-of-the-awkward-1-1-f4e1dcbd1c5c) and [more details](https://medium.com/@mrabkin/the-art-of-the-awkward-1-1-f4e1dcbd1c5c).

I also have some special 1:1s:

- Leadership card evaluation exercise
- Career discussions - A discussion around what we should be focused on for the next 6-18 months.
- Reviewing role guidelines - to help ensure we're on the same page about tactical gaps.

Other thoughts:

- I try to group my 1:1's on the same day (or over 2 days) because 1:1 is a special frame of mind, and takes a bit to get in the zone.
- With small teams, I like 1 hour 1 on 1s, but some folks prefer 30 minutes.

### How do you handle communication problems?

- High Order: Goal is not "communication style", but ability to influence.

- Types of communication problems
  - Clarity of thought
    - Not communication problem, very concerning .
  - Not listening to others
  - ESL -
  - Written
  - Verbal
    - Toast masters
    - Pre-write thoughts
    - Use pictures
    - Say not great on my feet
  - Slow in situations

### How do you handle promotion fever?

Promotion fever is my word for engineers that are completely focused on promotions above all else. In general they fall into a few categories: 1) Not Ready, 2) Just hired, and believe under levelled 3) Ready, but didn't get promo due to bad luck.

- Surprises are **BAD**:

  - Haven't set clear expectations.
  - Requires mini RCA

- Goal:

  - Engineer is self aware
  - Engineer comes to conclusion himself
  - Engineers feels on track
  - Engineer aspires to get to that level
  - Engineer doesn't want to be over leveled
  - Engineer gets new opportunities/support required.

- Start w assume engineer right - lets look at the criteria together.

  - Skim now and deep dive in next 1:1
  - Ask for self evaluation
  - Review and get on same page, sometimes manager thinks below and above what eng does.
  - Go over with examples together
  - Ask "How would you describe your behavior vs someone else's"
  - Ask what gaps do you see

- Create plan to close the gaps
  - Projects that stretch in those areas
  - Mentors that can help close the gap on those areas
  - Training/etc

### How do you identify and grow potential managers?

Engineers that are interested in reading this post make good manager candidates. The path usually start with getting an intern, then being a tech lead with heavy mentoring. Then having them take over as many as people issues as people are comfortable with them tracking.

### How did you grow top talent

## Culture

### What is your ideal culture?

### How do you make a good culture?

- Model myself
  - On All the Pages
  - If team is working I'm working
  - When I make mistakes I apologies
  - If I drop the ball I make it clear.
  - When someone does well I celebrate and call out.
- Catch people doings things right
  - Coaching stuff
  - Put it front and center
  - Let team take ownership of it.
  - Incite pride and purpose
- Repeat/Repeat/Repeat

### How do you handle Remote Work?

Writing as [we speak](/remote-work)

### How do you think about work life balance

I think it's very important. See my https://bit.ly/igor-wlb-manifesto

### How you deal with team disagrees with the leadership

Step 1: Believe and deeply understand it. Either I believe in it, or I deeply understand the decision and have disagreed and committed. As part of committing, I'm all in, and will share that.

Step 2: Listen to the team. The team has concerns, hopefully I can predict the, ahead of time and be prepared for the easy ones, then truly listen to new concerns, and address them.

Step 3: Focus on the win/win, and talk through a ripcord.

### Agency and Psychological Safety

## Process and Mechanism

### Theory of Process

Why:

- Turn input into outputs
- Reduce variance and setup a pit of success.
- Scale
- The human equivalent of great tools (source control, linters, bug management systems)

How:

- How to measure success of the process, what will you inspect, when will you adjust?
- What other process is this similar to, can we co-coalesce with something else?
- How will you get buy in from up, out and down?
  - (Bright spot, then land and expand)
- Who is the owner?
- Ownership lifetime, per quarter, or forever.

Thoughts:

- Culture vs Process
- Process vs Good Intentions
- Toyota Assembly line vs Artisan
- NEVER: Disenfranchising ownership
  - Nothing more powerful then a motivated engineer, don’t let process take that away.

### Never have a human do what a computer can do.

- Use auto style for code review styles
- Gather data from bug systems instead of having humans do it.
- Automated tests vs human execution
- Multiple copies of the same data

### Team meeting

### Deep Dives and Guest Speakers

### Engineering Excellence + Operational Review

1. How do we know our customer is having a good day?
2. How do we maximize our velocity
3. How do we keep our developers happy.
4. How do we sleep well at night?
5. How do we get max learning from outages?

By the way, I think a manager should be on all pages and outages.

- On all the pages
- Strong appreciation for boots on the ground reality.

Also need to review all outages

- Write up for all outages, [Correction Of Errors](/coe) for major outages -
- Maximize value of mistakes, don't make them twice.
- For all customer impacting event, review w/Customer Impact, root cause understood, and commitment when to address.
- Observability
  - How do we get a page next time.
  - How do we see what's going on.
- Testing systems.
  - Very high leverage active

### Business Reviews

### Design+Arch Reviews

- Really a preview, not a review.
- Ensure that tech assets are high quality and require minimal re-work.
- Ensure team gets cross trained.
- Catch stuff as early as possible
- Get developers used to being on the whiteboard

### Group Bonding

## Hiring

### What are you looking for when you recruit?

Most companies have their “competencies” they test for. But I abstract it down to:

- Smart (Can code, understands)
  - Teach me something
  - Walk through X, and Y, how do you, explain me the trade offs.
- Get things done (wants to ship, owns it):
  - What matters to them
  - Tell me something hard you did.
- EQ: (Not an asshole, Continuous Learning, Sees impact off his action, self aware o how eels)
  - Tell me a time you got in a fight
  - Tell me the hardest feedback you received.

### Do they prefer to hire only experienced folks?

I need a pipeline of developers for mentorship, fan out and succession planning.

Need a Principal per 30 people.

Ratio Senior: SDE-II: SDE-I (1,2,2) => ten person team: 2, 4, 4.

- Everyone grows by learning and teaching. Lots of rules
- A crappy job for an SDE-II is a growth opportunity for SDE-I.
- SDE-IIIs want to think hard and lead.
- SDE-IIs do the bulk of the work, and are fully independent.
- SDE-I bring energy and excitement, but still dependent.

Ideally, people grow from SDE-I -> SDE-III on a team, so much knowledge transfer and opportunity.

### Are they more comfortable with generalists or specialists?

Generalists - 99% of time

1. Industry changes to much.
2. Mostly about Architecture/Design and SDL and coding, domain and language easy to learn.

Specialist - 1% on very specific teams.

1. File system
2. Distributed system transaction processing.
3. Firmware engineers

Want full stack teams:

FE -> Learn the customer empathy through user interactions
BE -> Learn the tech chops of complex system.

### How do you think about hiring?

Priority list 1) Full blown Site Outage 2) Recruiting 3) Everything else.

Recruiting is ultimately product sales, where you're selling your team.

Most important part of sales:

1. The product: Product you're building, team (culture and people), yourself.

2. Funnel: Inbound Marketing, Referrals, high touch, post sales support.

### How do you think about the hiring funnel.

- Top of Funnel
  - Interview events
  - Internal Talks
  - Linked in Posts
  - Linked in Appreciation
  - Linked in Articles
  - Always help recruiting
  - Connect to warm candidates
  - Go grab coffee with them.
  - Mentorship of folks, volunteer for mentorship
  - Intern Talk
- Mid Funnel
  - Post interview - magic trick, after interview lets make time to chat
  - Push to get interview done ASAP
  - Push to get results to candidate ASAP
  - Walk out of interview connect on linked in and chat with them.
- Bottom of the Funnel
  - Focus on the needs of the candidate, then talk about how job can solve their needs.
  - Beer/Coffee/Call
  - Share what I have
  - Talk to my team.
  - Come out and have lunch with my team.
  - Multi Sell job come to my
  - Focus on

### What about structured vs free form interview loops?

- External Structured

  - Coding
  - Design
  - Leadership skills - most important
  - Self aware - earns trust.

- Internal, Structured but Different

  - You better have enough internal code/design/documentation artifacts. Ask candidate for artifacts they're proud of.
  - Go on a whiteboard to have them explain one of their systems, or help you on yours. No need for the candidate to practice, this is just them doing their day job.
  - Talk about hard situations they've had. Listen for the criteria smart/gets shit done/emotionally intelligent

### What are better kinds of interviews?

Novel ideas for interviews (from indeed)

- Do a code review
- Do a mock interview + debrief
- Review their public work (like Github)
- Having them explain their projects to you.

### Best hire of your career

## Firing and Performance Management

### Firing Ratios

### The Process

## Charters, Re-orgs and Bootstrapping

Reorgs have two dimensions, staffing and charter, both of these need to be addressed.

There are several types of re-orgs. Here are some of the ones I've executed:

### The genesis: When you start from scratch

Building a team has two aspects, hiring from 0 to staffed, and building out a new charter and vision.

In an ideal world, you'd execute the following hiring plan:

- Start with a high level view of the business
- Put in places the senior developers to build out the architecture and process
- Start working by getting your SDE-IIs and SDE-Is

In the real world, you'll likely:

- Have a vague idea
- Add people as you find them (hard stop when too many juniors - see below)
- Pick some easy wins, and get those started, ready to pick up debt to see what we can do.

Note: It's usually easy to hire junior people, and when there's pressure to start, you'll be tempted to just keep adding junior folks. However, there's a world of hurt here. If you're planning on starting with too many junior folks (or getting pressured to) borrow more experienced folks from other teams. Ideally borrow them full time for a few quarters, but at least borrow them for brainstorming, design, architecture and mentorship.

Hopefully, early in your hiring process you've been thinking about your charter. Charters and such are hard, here's the strategy I tackle:

- Come up with a north star vision
- Start your first experiments in tech and market
- Find the first wins to be able to inspire the team, excite the investors, and really partners.
- Build out an early roadmap and product.
- Keep learning and improving as people join.

### The split: When a team outgrows a manager

### The merge: When a manager leaves

## Personal Motivations

I guess the whole post is personal, as these are my opinions. The questions below can't be "evaluated" as they deal with internal motivations, however they can be questioned to determine if these are really my motivations, and if I"m being consistent between my actions and motivations.

### Why is management attractive to you?

Few things make me prouder then this [public feedback on LinkedIn](/static/igor-feedback-LinkedIn.pdf) from people who worked with me over several years.

On my deathbed, the product I will be most proud of is the people who I watched blossom and grow. It's cliche, but when you love your people they know it, they thrive, and do their best work. It's not just about the work, I want to make sure people think of their lives as well, because, well, that's even more important.

I'm also energized by getting shit done. The though of shipping, clearing roadblocks, and never being blocked puts a smile on face.

Speaking of smiling, nothing brings me back up like reading this kind of feedback that I got when I left a team:

_Goodbye Igor! Thank you for helping me reach the next level both physically and mentally. I cherish the moments when we ground through challenges like peak days, when I was in trouble and you said "That's why I'm here, give it to me I'll make it happen", and of course, when you show your magic at happy hour! You are a great boss and great teacher._

Lastly, I love understanding what is going on, coming up with win/win solutions, and framing those solutions into a meaningful story that people rally behind and deliver. Some more words that bring me up:

_Igor - Your passion, energy, intellect, and sheer force of will -- so intense, so inspiring, so powerful we still feel it 3 years after you left the team._

And most

<!--

- Skill, clarifying, building consensus, sharing the story and meaning.
- Leader Ownership, but not a good enough PM, and very strong tech
- Lead and inspire
- Servant leadership
- On top of best practices
-->

### What is your dream job?

A preview of [my dream job](/job):

_Jobs have many dimensions and I'll describe my dream job in several dimensions. In my dream job I learn the customer and business needs and focus the team on delivering them in a sustainable manner. Simultaneously, I help team members grow, develop our culture, and build valuable tech. When talking to others I prefer a couch to a table, and when I need a break you might see me juggling, practicing magic, or riding my folding bike - often in the office._

### What is your career aspiration?

A preview of [I want to be the best boss my peeps have ever had](/being-a-great-manager)

_I aspire not only to be a great manager, but to be the best manager my team members will ever have (unless they get to work for a manager I've coached :) ). I hope to have incredibly stiff competition at the top, and I'll often fall short of my goal, but through trying I will get closer. This post will gather my research on being a great manager, enumerate some of my learnings, and inspire me to be my best._

### What are your thoughts on managers memorizing these answers for interviews.

Good interviewees prepare as much as possible, thinking through their experiences and philosophies. If this post helps them, that is fantastic. I'm skeptical that a bad manager will be able to internalize these answers to the point they can provide rich answers.

Good interviewers (and manager interviews better be good) need to be able to differentiate "theoretical knowledge" from "practical experience". They do this with situational questions like "Tell me a time when", and probing questions like "What happened then? What were the unexpected consequences? When did you have the opposite outcome?".

## Business Acumen and Strategy

### The Four

The four is a fantastic book describing the value of the FANG companies.

- Google is the brain
- Amazon is the belly
- Facebook is the heart
- Apple is the sex drive

### Stratechary

- Aggregator theory
- Disruption theory
- Horizontal vs Vertical Integration

### By company

Zillow:

- Mortgage
- Zillow Offers

Facebook:

- AR/VR
- Messengers
- Portal

Google:

- Advertising
- YouTube

Amazon:

- AWS
- Retail
- Alexa

Microsoft:

- Linked In
- Open Source
- Productivity
- Azure
- Windows
- Windows Phone
- Developer Tools

Apple:

- Hardware or Services
- The App Store
- The Physical Store

## Other resources

### Great Videos

- [On Coaching](https://youtu.be/oHDq1PcYkT4?t=431)
- [On making people feeling safe](https://www.youtube.com/watch?v=lmyZMtPVodo)

### Great Posts and Blogs

- [Manager's Playbook](https://github.com/ksindi/managers-playbook/blob/master/README.md) - Cool awesome list for managers
- [How managers get stuck](https://medium.com/@skamille/how-do-managers-get-stuck-b6ec9ecd1da1)
- [The managers path](https://www.amazon.com/Managers-Path-Leaders-Navigating-Growth/dp/1491973897) - This book feels like it lacks "complete" mental models, but it's the only book of it's kind - so it's the best there is!
- [Elided Branches](http://www.elidedbranches.com/) - Blog on engineering management.
- [I.M Wright's Hard Code](https://imwrightshardcode.com) - Engineering Management from Microsoft, covers most topics.

### Great books

- [Technical Recruiting And Hiring](https://www.holloway.com/g/technical-recruiting-hiring/about)
- [Igor's general reading list](/books)
- Lots more coming

### Igor's other manager post

I'm still merging in my original [manager post](/being-a-great-manager)
