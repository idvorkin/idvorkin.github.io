---
layout: post
title: "Manager Theory and Practice"
comments: true
inprogress: true
tags:
  - manager
  - job-hunt
---

Managing is hard. Lessons are hard earned, and should be cherished. This post is designed to draw out my opinions on management, reminding me how best to manage and help me converge on good anecdotes.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [What does a manager do](#what-does-a-manager-do)
    - [How do you measure your success?](#how-do-you-measure-your-success)
    - [How do you describe your job to people outside the industry?](#how-do-you-describe-your-job-to-people-outside-the-industry)
    - [How do you build a team?](#how-do-you-build-a-team)
        - [People boot strap.](#people-boot-strap)
        - [Charter/Execution boot strap](#charterexecution-boot-strap)
    - [Why is management attractive to you?](#why-is-management-attractive-to-you)
    - [What in your mind are the responsibilities of a manager?](#what-in-your-mind-are-the-responsibilities-of-a-manager)
    - [What do you do in the first 90 days?](#what-do-you-do-in-the-first-90-days)
    - [What specific types of duties would you like to do help with at this company?](#what-specific-types-of-duties-would-you-like-to-do-help-with-at-this-company)
- [Managing and Developing People](#managing-and-developing-people)
    - [How do you keep people motivated?](#how-do-you-keep-people-motivated)
    - [What is the point of a 1:1?](#what-is-the-point-of-a-11)
    - [How do you identify engineers who could make good managers? How do you help them develop?](#how-do-you-identify-engineers-who-could-make-good-managers-how-do-you-help-them-develop)
    - [How do you handle a great engineer with communication problems?](#how-do-you-handle-a-great-engineer-with-communication-problems)
    - [How do you handle someone who really wants a promotion but isn't ready?](#how-do-you-handle-someone-who-really-wants-a-promotion-but-isnt-ready)
    - [Best hire of your career](#best-hire-of-your-career)
    - [How did you grow top talent](#how-did-you-grow-top-talent)
    - [What do you do when a team completely disagrees with the founder/VP on the direction of a product?](#what-do-you-do-when-a-team-completely-disagrees-with-the-foundervp-on-the-direction-of-a-product)
- [Business Acumen](#business-acumen)
    - [Discuss this companies trajectory as you see it. What choices do they think they're good and bad at? Would you have done things differently? What problems do you see coming up in the future?](#discuss-this-companies-trajectory-as-you-see-it-what-choices-do-they-think-theyre-good-and-bad-at-would-you-have-done-things-differently-what-problems-do-you-see-coming-up-in-the-future)
- [Self Assessment and Weakness](#self-assessment-and-weakness)
    - [What was the biggest 'mental model' shift you had from IC to manager?](#what-was-the-biggest-mental-model-shift-you-had-from-ic-to-manager)
    - [Top Weakness](#top-weakness)
    - [Get in a fight with your boss](#get-in-a-fight-with-your-boss)
        - [Co boss](#co-boss)
        - [Shutdown alternate platforms](#shutdown-alternate-platforms)
        - [Break big bang creator studio down into](#break-big-bang-creator-studio-down-into)
    - [Get in a fight technical](#get-in-a-fight-technical)
        - [Service split and shared component](#service-split-and-shared-component)
        - [Need SDE-III to do work that was below him.](#need-sde-iii-to-do-work-that-was-below-him)
        - [Architect won't let us launch without commiting to next release.](#architect-wont-let-us-launch-without-commiting-to-next-release)
    - [Get in a fight PM](#get-in-a-fight-pm)
        - [Creator Portal initial launch - We're acceptable to ship with several gaps.](#creator-portal-initial-launch---were-acceptable-to-ship-with-several-gaps)
    - [Get in a fight with other](#get-in-a-fight-with-other)
        - [Smile w/Legal.](#smile-wlegal)
    - [Think of a mistake or failure you’ve made in the past two years. What did you learn from it and/or do differently in the future?](#think-of-a-mistake-or-failure-youve-made-in-the-past-two-years-what-did-you-learn-from-it-andor-do-differently-in-the-future)
        - [Push GSAT when parent team though it was a bad idea.](#push-gsat-when-parent-team-though-it-was-a-bad-idea)
        - [Launching Creator Portal](#launching-creator-portal)
        - [Over commiting my team](#over-commiting-my-team)
    - [What would a report/peer/manager feedback on you be? Strengths, areas for development, etc.](#what-would-a-reportpeermanager-feedback-on-you-be-strengths-areas-for-development-etc)
    - [How would you assess if someone is a good manager?](#how-would-you-assess-if-someone-is-a-good-manager)
- [Process and Mechanism](#process-and-mechanism)
    - [Process Patterns](#process-patterns)
    - [Process Anti-Patterns:](#process-anti-patterns)
    - [What kind of process have you followed in the past and what has worked well for you?](#what-kind-of-process-have-you-followed-in-the-past-and-what-has-worked-well-for-you)
        - [Design+ Arch Reviews: Minimal rework, high quality assets](#design-arch-reviews-minimal-rework-high-quality-assets)
        - [Team gelling](#team-gelling)
        - [Engineering/Operational Excellence](#engineeringoperational-excellence)
        - [Strategic group alignment](#strategic-group-alignment)
    - [What process hasn't worked?](#what-process-hasnt-worked)
    - [How do you institute the right process at the right time? How do you know when you need something more formal?](#how-do-you-institute-the-right-process-at-the-right-time-how-do-you-know-when-you-need-something-more-formal)
    - [Have they ever removed process? Why or why not?](#have-they-ever-removed-process-why-or-why-not)
- [Hiring](#hiring)
    - [What are you looking for in an engineer when you recruit?](#what-are-you-looking-for-in-an-engineer-when-you-recruit)
    - [Do they prefer to hire only experienced folks?](#do-they-prefer-to-hire-only-experienced-folks)
    - [Are they more comfortable with generalists or specialists?](#are-they-more-comfortable-with-generalists-or-specialists)
    - [How do you think about hiring?](#how-do-you-think-about-hiring)
    - [How have you optimized the recruiting process in the past? Have they thought about the recruiting funnel and how you can optimize different parts of it?](#how-have-you-optimized-the-recruiting-process-in-the-past-have-they-thought-about-the-recruiting-funnel-and-how-you-can-optimize-different-parts-of-it)
    - [What are their thoughts on structured interview loops vs. non-structured free-form loops?](#what-are-their-thoughts-on-structured-interview-loops-vs-non-structured-free-form-loops)
- [Firing and Performance Management](#firing-and-performance-management)
    - [How do you deal with people performance issues?](#how-do-you-deal-with-people-performance-issues)
    - [Coach employee back to success](#coach-employee-back-to-success)
    - [Have you ever had to implement a PIP (performance improvement plan)? What are your thoughts on it?](#have-you-ever-had-to-implement-a-pip-performance-improvement-plan-what-are-your-thoughts-on-it)
- [Random topics](#random-topics)
    - [Should industry have architects](#should-industry-have-architects)
    - [How do you bootstrap technical leadership in an organization that has no public titles?](#how-do-you-bootstrap-technical-leadership-in-an-organization-that-has-no-public-titles)
    - [What are the pros/cons of public vs. private titles?](#what-are-the-proscons-of-public-vs-private-titles)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## What does a manager do

### How do you measure your success?

Success of my team: - People love their team. - People have clear understanding of career growth/progression and how their work supports it.

Inputs and Outputs:

4 Dimensions:

- Business Results: Ultimately the team delivers business value for our customers and organization. Define success (KPI), and help team understand and break it down.
- People Growing in a high performance team: The team is well gelled with team members helping each other. Everyone has growth plans which fit their needs and they are execution them.
- Engineering Efficiency and Process: Our engineering systems ensure a pit of success where things which can be automated have been, and we have high velocity releases with minimal risk.
- Technical Assets: Are systems are extensible in the ways that support the business. Our operational burden is minimal (side bar: to help me prioritize I'm on the pages), and our technical debt is applied judiciously (like take debt if you might be able to write off the asset)

### How do you describe your job to people outside the industry?

I run a factory which produces widgets and has employees. For those in the industry this translates to:

- Widget == Business Results
- Factory Workers == Team health and growing, leaders who make software
- Factory and Operating procedures == Software Design LifeCycle, Architecture, Tech Assets

My role:

- I work with the business to help figure out the best "widgets we can make", by understanding what people want to buy, and explaining how our factory runs.
- I Am Responsible the workers in the factory, are they healthy, learning, wanting to come to work every day, getting along with co-workers.
- I'm also responsible for the efficiency of the factory. Is production good and improving, Can the factory re-tool quickly. Have we built the right scaffolding in the factory to easily change the kinds of widgets we make.

Top metrics:

- Did we make the right widgets on time and budget
- Are the works happy based on surveys
- Is our factory solid and able to make new stuff quickly and maintain production.

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
- Continous improvement as people join.

### Why is management attractive to you?

- On deathbed, the product I want is people who grew
  - Cliche: Love your people, want to see them thrive and grow
  - Want to save folks from unsustainable, and treat folks as people
- Get shit done
  - Clear roadblocks
  - Ship
- Skill, clarifying, building concensous, sharing the story and meaning.
- Leader Ownership, but not a good enough PM, and very strong tech
- Lead and inspire
- Servant leadership
- On top of best practices

### What in your mind are the responsibilities of a manager?

### What do you do in the first 90 days?

*First 90 days is the book*

Outputs:

- Early Win: Figure out the situation, and deliver a win.
- Trust: Relationships with team, and peers, and partners.
- Knowledge: Know critical parts of business, tech, org.

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


### What specific types of duties would you like to do help with at this company?

## Managing and Developing People

### How do you keep people motivated?

- Autonomy
  - You are the owner
  - All decision need your sign off
  - Coach from behind (here's success, here's how I'd say it, what are the consequences, misses)
  - Know team has your back.
  - Protecting from harmful rays of upper management and business
  - Only clear out as much as required
- Mastery
  - Training
  - Bigger and Bigger Opportunities
  - Bigger and bigger exposure
- Purpose
  - Focus on the why
  - Call out the impact
  - Share the success with the team
  - Share success with partners and boss
- Coaching + Career Growth
  - Catching people doing things right.
  - 110% of capability but clarify doing 110% vs 80%
- Moments
  - Contant celebrating people doing stuff fun
  - Hack-a-thons
  - Playing cards for appreciation
  - Managers making breakfast

### What is the point of a 1:1?

I produce nothing, my output is the output of the team, and the team is the sum of the people. My ability to get the most value from my people is through my relationship with the people. If they trust me whole heartily, they'll tell me stuff I need to know, and I'll be able to understand how best to use them/influence them/inspire them. So, all my 1:1's start with What's on your mind - what ever they have we talk through. based on time and place we'll do X, Y.

For 1:1's for my team, the employees owns the Agenda, however I will nudge them. I like to spend time

- Building relationships
- Providing Larger Context
- Having confidential discussions on concerns and questions.
- Coaching strategically
- Coaching tactically.

I also have some special 1:1s:

- Leadership card evaluation exercise
- Career discussions - A discussion around what we should be focused on for the next 6-18 months.
- Reviewing role guidelines - to help ensure we're on the same page about tactical gaps.

### How do you identify engineers who could make good managers? How do you help them develop?

### How do you handle a great engineer with communication problems?

- High Order: Goal is not "communication style", but ability to influence.

- Types of communication problems
  - Clarity of thought
    - Big gap - but doesn't sound like the criteria
  - Not listening to others
  - ESL -
  - Written
  - Verbal
    - Toast masters
    - Pre-write thoughts
    - Use pictures
    - Say not great on my feet
  - Slow in situations

### How do you handle someone who really wants a promotion but isn't ready?

- Surprises are **BAD**:

  - Haven't set clear expectations.
  - Requires mini RCA

- Goal:

  - Engineer comes to conclusion himself
  - Engineers feels on track
  - Engineer aspires to get to that level
  - Engineer doesn't want to be over levelled
  - Engineer is self aware
  - Engineer gets new opportunities/support required.

- Start w assume engineer right - lets look at the criteria together.

  - Now or next 1:1?

- Review role guidelines

  - Ask for self evaluation
  - Go over with examples together
  - Ask "How would you describe your behavior vs someone elses"
  - Ask what gaps do you see

- Call out positive examples from engineers @ Level + 1

### Best hire of your career

### How did you grow top talent

### What do you do when a team completely disagrees with the founder/VP on the direction of a product?

## Business Acumen

### Discuss this companies trajectory as you see it. What choices do they think they're good and bad at? Would you have done things differently? What problems do you see coming up in the future?

**Zillow:**

**Facebook:**

**Google:**

**Amazon:**

**Microsoft:**

**Linked In**

## Self Assessment and Weakness

### What was the biggest 'mental model' shift you had from IC to manager?

* Auditing
* Value of process and checklists
* Team being the peer leads.

### Top Weakness

### Get in a fight with your boss

#### Co boss

#### Shutdown alternate platforms

#### Break big bang creator studio down into

### Get in a fight technical

#### Service split and shared component

#### Need SDE-III to do work that was below him.

#### Architect won't let us launch without commiting to next release.

    * Architect need to save face.
    * Still doing the change, but add a "design" for next release, and we both knew it was dumb.

### Get in a fight PM

#### Creator Portal initial launch - We're acceptable to ship with several gaps.

### Get in a fight with other

#### Smile w/Legal.

### Think of a mistake or failure you’ve made in the past two years. What did you learn from it and/or do differently in the future?

#### Push GSAT when parent team though it was a bad idea.

#### Launching Creator Portal

- Major Feature (still hadn’t established full trust)

  - Upload _heavily tested_
  - No Marketing
  - Easy Turn Off
  - New to Amazon team, all external, no process
  - Super low TPS
  - Launch and Learn
  - OE
  - Complete alignment with my PM
  - Took on tech debt around alarms (Plan to resolve post launch)
  - Deep Understanding of the system, super low TPS
  - Pushing my team to launch for weeks, always coached team to never be blocked

- 2 problems

- How I got into the situation

  - Didn’t realize what I didn’t know.
  - 15 years at MSFT, 1) very high trust 2) very clear on what tech debt org can take 3) operate much slower, more reporting, less surprises.

- How I handled

  - Expect to be blocked/delayed with partner teams because they have less skin in the game.
  - **Felt** like my mgmt chain didn’t have my back, and didn’t trust my judgement.
  - Spent a few days whining at my PM and at others.
  - I pushed back on my boss - telling him how I felt and why “I was right”.
  - Saying look this is inconsistent with Amazon, you made mistakes (as did I) lets proceed with launch.

- A few days in bregrudingly

  - Went thought the critisicims
  - Did a self audit with my self and Senior Engineer.
  - Came up with a moderation plan
    - We’d watch videos as they come in through manual rotation till could get system up.

- Consequences
  - Not being late, but positioning that I don’t “own my mistakes, and blame others”
  - Had to work three times as hard to get that back, but that smell was on me for months.
  - Burned trust took months to get it back

**Learnings - How I got into he situation **

- Even in “bottom up” orgs - test for what your technical freedom is
- When going into “trust me” situations, make sure to advertise more
  _ In new org, assume I don’t know.
  _ No more “Trust Me” \* For risks/tech debt, even ones I think are safe, vet with senior folks, then vet with my boss, and really stress consequences of getting wrong, but why.

- Launching of WAMD by keyword - precision and recall hard.
  - Testing w/None prime traffic, precision high, recall low. Happy with that.
  - Late brought up could have very different traffic pattern for Prime Day (couldn’t pre-test)
  - Came up with Plan
    - Hourly monitoring for gaps
    - 3 types of shutdown switches (all off, blacklist bad, whitelist good)
    - 99% latency.
- Next time
  - Will run same protocol again this year.
  - Come up with an offline computation model for next prime day.

**Learnings - How I handled the “Though shalt not pass” conversation from my VP**

- Launching Charity Giving
  - VP decided we’ll need to do video sharing to FB/Twitter
  - Boss didn’t push back, just pass through.
  - Yup, my mistake. How can we get this working.
  - Decent idea, but My team was 100% booked, and no experience.
  - Begged other leads for an expert in this area. Spent 2 days to see if it was possible, found out it wasn’t possible for 2 days, then got sign off from a VP, made a nice package for my boss, who brought it up the tree.

#### Over commiting my team

- Q4 2018 - Wanted to do charity
  - Committed team to deliver - “Lets take 2 weeks and make sure we can do this” , team agreed. Then we pushed hard, and hot but we’d make it and start converging.
  - As got closer, standard cut stuff.
  - New, requests from other parts of the organization - must do I18N, can’t get it off our plate
  - Must do a new time of coupon (which was already cut)
  - Load testing want completely wrong.
  - **Everything** went wrong
- Team killed themselves till thanksgiving
  - Which they didn’t mind because of the purpose off the launch.
  - HOWEVER: Said we’d get a break post Thanksgiving. And we didn’t, get more stuff put on us I18N and another coupon type.
  - Couldn’t get it negotiated off my team (Amazon — Grr!!)

**Learnings for next time**

- Target done 1.5 months early (will slip to 1 months, and then need the E2E time, or bring new features in)
- Agreement on what features we’d cut if required when we got closer.
- Left in more slack so didn’t get pushed over
- Shared data up with what happened last time w/data and wouldn’t over commit.
- Stopped other teams from over committing.
- Done with 2 weeks to spare.

### What would a report/peer/manager feedback on you be? Strengths, areas for development, etc.

- Report
  - Care, Great Advice, People First, Strong People chops
  - Gaps:
    - Organization - my desk is a mess, and I miss stuff (Mitigate: Push my whole team to audit, constant list of top risks)
- Boss

  - Same as reports
  - Hiring - Wow
  - Impressive handling of complex situations.
  - Commit Faster when you aren’t in agreement
    - Customer -> Team > Business vs Customer > Team > Business
  - Start by assuming I’m right, instead of me being wrong
    - Exact oppposite o what I tell me, I need them to assume I”m wrong due to positional authority
  - Don’t be so harsh and “weak” partners.
    - I stay don’t get blocked and want to ship, people who are in agreement love me. People that don’t I’ll Figure out how to get around.
  - (Less experienced) Be less autonomous.

    - Lots of ideas, change fast, check with me more often.

  - Peer
    - Want to ship
    - How do you pull that offf
  - Good
    - Team loves you
    - Creative
  - Gaps
    - Going to Fast.
    - Keep me in the loop
    - Be more risk averse

### How would you assess if someone is a good manager?

Using the same metrics I apply to myself. For the how I'd:

- Look at "employee surveys"
- Look at their business results (scorecards and KPIs)
- Look at their operational load and tickets/pages/etc
- Interview their employees, PMs, and business partners, and partner teams
- Ask them about their architecture
- Ask them the interview questions

## Process and Mechanism

### Process Patterns

- Turn input into outputs
- How to measure success of the process, what will you inspect, when will you adjust,
- Who is the owner?
- What other process is this similar to, can we co-alsce with something else?
- How will you get buy in
- How to get team to accept
- (Bright spot, then land and expand)
- Sounds like good intentions
- Culture vs Process

### Process Anti-Patterns:

- TODO: Invert this\*
- Disenfrancing ownership

  - Nothing more powerful then a motivated engineer, don’t let process take that away.

- Having humans do what computers can do

  - Only have so much "process execution budget" don't waste it
    - Use auto style for code review styles
    - Gather data from bug systems instead of having humans do it.
    - Automated tests vs human execution
    - Multiple copies of the same data

- Free up developers to not solve known issues - freedom for more stuff
- Someone **owns** a process for a quarter so they can own it and make it better.

### What kind of process have you followed in the past and what has worked well for you?

Process per "output desired"

#### Design+ Arch Reviews: Minimal rework, high quality assets

- Ensure that tech assets are high quality and require minimal re-work.
- Ensure team gets cross trained.
- Catch stuff as early as possible
- Get developers used to being on the whiteboard
- Really a preview, not a review.

#### Team gelling

- Team meetings,
  - Focus on reflection.
  - Focus on what ever is the "mood" of the team.
  - Reflect as people.
  - Someone talks about themselves every time (5m)
- Team lunches.

  - Eat lunch together even if on laptop
  - Share your stuff
  - Have a room booked, and encourage it to happen.

- Include PM and other functions in team meeting.
- Keep calling out peoples strengths (team will copy)

#### Engineering/Operational Excellence

- I”m on all the pages
- For all customer impacting event, review w/Customer Impact, root cause understood, and committment when to address.
- Testing systems.
- Deep dive to do a check-in
- Do it all myself to see what's broken and understand where to invest.

#### Strategic group alignment

- Retrospectives
- PM alignment critical
  - Daily interactions
  - Drag PM desk close to mine
- Leadership weekly priority
  - Are we in sync with PM, and
- Internal Project Status Meeting
  - Everyone knows what is going on, and can audit and help it track.

### What process hasn't worked?

- Leadership all int the room audit mechanism.
  - People want to look good.
  - Can’t guess what leaders want to see
  - Everyone not paying attention unless it’s their turn.
- Web lab Removal
  - You put something in yourself, and it falls apart.
- Cross team design review
  - Too many people in the room.
  - Not clear if the goal is sign off, or if the goal is education.
  - Too many rat holes
  - **Goal is update the bosses**
- Volunteer, distributed ownership on a painful fix:
  - Missing metrics
  - Weblabs
  - No, generate a table and track monthly.
  - Letting tasks not be in our bug tracker - often drop.
  - “I’ll just do it” — no need to get it the past.

### How do you institute the right process at the right time? How do you know when you need something more formal?

I’m usually error on the lack of process. E.g. Let people volunteer to fix and drive. And it doesn’t happen “Best Intentions Don’t Work”

- I try to figure out how to keep it on high ownership, not on letting it drop on the floor.
- When I expect it to work, and it isn’t.
- Force the usage of the bar when not present. E.g. push on that.

### Have they ever removed process? Why or why not?

- Yes, group retros - team hated it, it was too big, and it didn’t make sense to teams were too different.
- IC’s coming to a group status meeting. Reduced to just seniors of the teams, and focused on them.
- Switch from “group status report” to rotating meetings, but that made it worse as they never showed up.

## Hiring

### What are you looking for in an engineer when you recruit?

Most companies have their “competncies” they test for. But I abstract it down to:

- Smart (Can code, understands)
  - Teach me something
  - Walk through X, and Y, how do you, explain me the trade offs.
- Get things done (wants to ship, owns it):
  - What matters to them
  - Tell me something hard you did.
- EQ: (Not an asshole, Continous Learning, Sees impact off his action, self aware o how eels)
  - Tell me a time you got in a fight
  - Tell me the hardest feedback you received.

### Do they prefer to hire only experienced folks?

I need a pipeline of developers for mentorship, fan out and succession planning.

Need a Principal per 30 people.
Ratio Senior: SDE-II: SDE-I (1,2,2) => ten person team: 2, 4, 4.

Everyone grows by learning and teaching. Lots of rules
A crappy job for SDE-K is a growth opportunity for SDE-(K-1)
SDE-IIIs want to think hard and lead
SDE-I bring energy and excitement, but still dependant.
SDE-IIs do the bulk of the work.

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

Priority list 1) Fullblown Site Outage 2) Recruiting 3) Everything else.

Recruiting is ultimetely product sales, where you're selling your team.

Most important part of sales:

1. The product: Product you're building, team (culture and people), yourself.

2. Funnel: Inbound Marketting, Referrels, high touch, post sales support.

### How have you optimized the recruiting process in the past? Have they thought about the recruiting funnel and how you can optimize different parts of it?

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

### What are their thoughts on structured interview loops vs. non-structured free-form loops?

- External Structured
  - Coding
  - Design
  - Leadership skills - most important
  - Self aware - earns trust.

## Firing and Performance Management

### How do you deal with people performance issues?

### Coach employee back to success

- Private

### Have you ever had to implement a PIP (performance improvement plan)? What are your thoughts on it?

Three "Players" in this situation:

- The team
  - Weak performer means others on team have to cover both in mentoring, and picking up dropped ball.
  - Sets a bad example for the team
  - Team knows the weak, and dislikes it.
  - Need to mitigate impact of week employee.
- The struggling employee
  - Should not be a surprise from manager. Should have already gone through role guidelines and gaps.
  - Clear set of gaps, and expectation for required improvement.
  - Let employee 'self discover' gaps and judge, but you must set down the truth.
  - Progressively lay out process, so they know where they're at and what happens next.
  - Remember being in the wrong role SUCKS. Employee is going home after long day, and feeling like shit (rinse and repeat)
  - One in right role - will feel great. Seen lots of times this happens.
  - Help them know it's the wrong role, but they have lots of strengths (look we hired you), and you'll be well loved elsewhere.
  - Help them with how to find change.
- The manager.
  - Emotionally draining. But you own giving them an opportunity not their success.
  - When they're in the wrong role, best thing that happen is getting them to a place where they are successful.
  - Can be time and energy intensive, robs the team and good employees of your energy.
  - Ensure criteria for demonstrating employees recover is sufficient. Get pre-agreement on criteria with your organizational leaders.
  - Remember, all employee's getting into this process will improve because they are being chased. Ensure it's not temporary.

* In general, if you're on PIP, you've been going home and feeling like shit, who wants to do that?
* Get into right role, almost always feels better
* Shouldn’t be a surprise, see it coming from a mile away.
* Help them get a job
* Lay out process, and help w/mock interviews and general interviewing advice.
* Help understand strengths.

## Random topics

### Should industry have architects

- Best discussion on the topic [Tech Lead vs Architect](/software-leadership-roles)
- Physical world vs Software:
  - Structural Engineer
    - MSFT Software Architect
    - Though shall not pass.
    - Enforce "Building Code" - Beam must be 1 foot thick. No variance, no pass. Built for the average.
  - Physical Architect == Convert Customer Desire (Product Owner) into a maintainable buildable system (tech lead, engineering manger).
    - Should be owned by the team.
    - Knows the reality of the system better then Structural Engineer.
- The gaps - inexperienced, (or lazy) teams
  - You give the rope, but the team is accountable (hard w/rotation)
  - Design reviews
- Good use of "Architects"
  - Guidance - not sign off.
  - Technology SME's for advice.
  - Long term vision and industry understanding.
  - Consult on large projects.
  - Mentoring of senior (not PE) employees
- Covered by great TPMs, drive large scale company changes.

### How do you bootstrap technical leadership in an organization that has no public titles?

### What are the pros/cons of public vs. private titles?

- MSFT went through this
- World better w/o title

Public Pro
_ Pride for promotions
_ Signal of organization influence (although you can kind of figure it out) \* Shortcut to find senior folks when don’t know the team.

- Cons
  - When “title” doesn’t match reality.
  - Folks get positional authority
  - Jockying for Promo when doesn’t matter.
  - Frustration in thinking problem is title not blah.
  - Being right, but ignored
