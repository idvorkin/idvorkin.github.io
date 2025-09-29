---
layout: post
title: "How to EM: Be the manager everyone wants"
imagefeature: https://github.com/idvorkin/blob/raw/master/idvorkin-manager-book-1200-628.png
tags:
  - manager
  - search-featured
  - manager-book
permalink: /manager-book
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/racoon-manager.webp
redirect_from:
  - /the-manager-book
sort_order: 100
---

Being an engineering manager is hard. Supporting people well is harder. Lessons are hard earned and should be cherished. This post is designed to make explicit, and improve behaviors and practices. It reminds me how to behave and encourages my own continuous improvement.

This post uses the word manager, but many topics apply to all job functions, regardless of seniority or number of direct reports, zero direct reports included.

{%include blob_image_float_right.html src="blog/racoon-manager.webp" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What does a manager do](#what-does-a-manager-do)
  - [What are a manager's responsibilities](#what-are-a-managers-responsibilities)
  - [How do you measure their success](#how-do-you-measure-their-success)
  - [What is a manager accountable for](#what-is-a-manager-accountable-for)
  - [How do you describe your job to people outside the industry](#how-do-you-describe-your-job-to-people-outside-the-industry)
  - [Hardest part about being a manager](#hardest-part-about-being-a-manager)
  - [The Impact Pyramid](#the-impact-pyramid)
  - [What do you do in the first 90 days](#what-do-you-do-in-the-first-90-days)
  - [What do managers do all day](#what-do-managers-do-all-day)
  - [Should managers be technical](#should-managers-be-technical)
  - [Should managers code](#should-managers-code)
  - [What engineering efficiency metrics should a manager monitor?](#what-engineering-efficiency-metrics-should-a-manager-monitor)
- [Managing and Developing People](#managing-and-developing-people)
  - [How do you coach](#how-do-you-coach)
  - [What mechanisms do you have to ensure career development](#what-mechanisms-do-you-have-to-ensure-career-development)
  - [How do you support folks with their career growth plans (CGPs)](#how-do-you-support-folks-with-their-career-growth-plans-cgps)
  - [How do you support folks by pre-writing self assessments](#how-do-you-support-folks-by-pre-writing-self-assessments)
  - [How do you give fast, frequent, feedback](#how-do-you-give-fast-frequent-feedback)
  - [What do you recommend for folks who just joined the team](#what-do-you-recommend-for-folks-who-just-joined-the-team)
  - [How do you think about situational leadership](#how-do-you-think-about-situational-leadership)
  - [What are the level specific career expectations and growth strategies](#what-are-the-level-specific-career-expectations-and-growth-strategies)
  - [How do you get engineers promoted, and to understand their path to promo?](#how-do-you-get-engineers-promoted-and-to-understand-their-path-to-promo)
  - [How do you help people switch jobs](#how-do-you-help-people-switch-jobs)
  - [How do you keep people motivated](#how-do-you-keep-people-motivated)
  - [How to motivate through personal experience](#how-to-motivate-through-personal-experience)
  - [How to motivate through team environment](#how-to-motivate-through-team-environment)
  - [How do you handle task overload](#how-do-you-handle-task-overload)
  - [How do you give challenging feedback](#how-do-you-give-challenging-feedback)
  - [What's the point of 1:1s](#whats-the-point-of-11s)
  - [What do you do in 1:1s](#what-do-you-do-in-11s)
  - [How do you handle communication problems](#how-do-you-handle-communication-problems)
  - [How do you identify and help eng decide if management is right for them](#how-do-you-identify-and-help-eng-decide-if-management-is-right-for-them)
  - [How do you grow new EMs](#how-do-you-grow-new-ems)
  - [How do you grow top talent](#how-do-you-grow-top-talent)
  - [How do I help people raise concerns/give constructive feedback?](#how-do-i-help-people-raise-concernsgive-constructive-feedback)
  - [Recall career is just one part of your life](#recall-career-is-just-one-part-of-your-life)
  - [How do you have a difficult conversation](#how-do-you-have-a-difficult-conversation)
  - [Should employees game the system to optimize for the review process?](#should-employees-game-the-system-to-optimize-for-the-review-process)
- [Culture](#culture)
  - [What is your ideal culture](#what-is-your-ideal-culture)
  - [How do you help a team gel](#how-do-you-help-a-team-gel)
  - [What order would you introduce culture](#what-order-would-you-introduce-culture)
  - [How do you make a good culture](#how-do-you-make-a-good-culture)
  - [How do you think about ad-hoc insights/questions from others, even if you've already thought of and maybe presented the doc/plan/answer already?](#how-do-you-think-about-ad-hoc-insightsquestions-from-others-even-if-youve-already-thought-of-and-maybe-presented-the-docplananswer-already)
  - [How do you handle Remote Work](#how-do-you-handle-remote-work)
  - [What about Work Life Balance](#what-about-work-life-balance)
  - [How do you deal with a team that disagrees with the leadership](#how-do-you-deal-with-a-team-that-disagrees-with-the-leadership)
  - [Agency and Psychological Safety](#agency-and-psychological-safety)
  - [Kudos Boards - Appreciations](#kudos-boards---appreciations)
  - [How do you like being questioned/micromanaged?](#how-do-you-like-being-questionedmicromanaged)
  - [How do you transition from mercenaries to missionaries](#how-do-you-transition-from-mercenaries-to-missionaries)
- [Process and Mechanism](#process-and-mechanism)
  - [Theory of Process](#theory-of-process)
  - [The dark side of process](#the-dark-side-of-process)
  - [On Change](#on-change)
  - [That sounds like good intentions - Factories and Artisans](#that-sounds-like-good-intentions---factories-and-artisans)
  - [Never have a human do what a computer can do](#never-have-a-human-do-what-a-computer-can-do)
  - [Rich communication - Team meeting](#rich-communication---team-meeting)
  - [Continuous Learning - Deep Dives, Knowledge Transfer and Guest Speakers](#continuous-learning---deep-dives-knowledge-transfer-and-guest-speakers)
  - [Engineering Excellence - Operational Review and Correction of Errors](#engineering-excellence---operational-review-and-correction-of-errors)
  - [Data Driven - Customer and Business Metric Reviews](#data-driven---customer-and-business-metric-reviews)
  - [Continuous Improvement - Retrospectives](#continuous-improvement---retrospectives)
  - [Team Participation and Feedback - Surveys and Polls](#team-participation-and-feedback---surveys-and-polls)
  - [Quality and Technical Growth Design+Arch Reviews](#quality-and-technical-growth-designarch-reviews)
  - [Code reviews](#code-reviews)
- [Planning, Roadmaps and Resource Allocation](#planning-roadmaps-and-resource-allocation)
  - [Start with why, end with who: The execution order framework](#start-with-why-end-with-who-the-execution-order-framework)
  - [Define success: Setting effective goals](#define-success-setting-effective-goals)
  - [Build the roadmap: Planning and sequencing](#build-the-roadmap-planning-and-sequencing)
  - [Create the schedule: Timeline and milestones](#create-the-schedule-timeline-and-milestones)
  - [Allocate resources: Matching people and projects](#allocate-resources-matching-people-and-projects)
  - [Understand roles: The road building analogy](#understand-roles-the-road-building-analogy)
  - [Prioritize work: Making tough trade-offs](#prioritize-work-making-tough-trade-offs)
  - [Estimate effort: Using SWAG and T-shirt sizing](#estimate-effort-using-swag-and-t-shirt-sizing)
  - [Be wary the planning trap](#be-wary-the-planning-trap)
- [Hiring](#hiring)
  - [What are you looking for when you recruit](#what-are-you-looking-for-when-you-recruit)
  - [Do they prefer to hire only experienced folks](#do-they-prefer-to-hire-only-experienced-folks)
  - [Are they more comfortable with generalists or specialists](#are-they-more-comfortable-with-generalists-or-specialists)
  - [How do you think about hiring](#how-do-you-think-about-hiring)
  - [How do you think about the hiring funnel](#how-do-you-think-about-the-hiring-funnel)
  - [What about structured vs free form interview loops](#what-about-structured-vs-free-form-interview-loops)
  - [What are better kinds of interviews](#what-are-better-kinds-of-interviews)
  - [What do you do when someone says they are quitting](#what-do-you-do-when-someone-says-they-are-quitting)
  - [What is a tribe?](#what-is-a-tribe)
- [Performance Management](#performance-management)
  - [Performance Reviews: Calibrations PSC, OLR, Connections](#performance-reviews-calibrations-psc-olr-connections)
  - [Translating Performance Ratings Between Companies](#translating-performance-ratings-between-companies)
  - [Best Practices For Performance Reviews](#best-practices-for-performance-reviews)
  - [The pain and the suffering of performance reviews](#the-pain-and-the-suffering-of-performance-reviews)
  - [Some definitions for low performers](#some-definitions-for-low-performers)
  - [Performance Management for low performers](#performance-management-for-low-performers)
  - [The types of URA](#the-types-of-ura)
  - [URA doesn't mean the person sucks - it means they are not compatible.](#ura-doesnt-mean-the-person-sucks---it-means-they-are-not-compatible)
  - [What if a URA isn't "fair"?](#what-if-a-ura-isnt-fair)
  - [The who and how of performance management](#the-who-and-how-of-performance-management)
  - [How do you coach employee back to success](#how-do-you-coach-employee-back-to-success)
  - [How do handle poor communication, ESL, ineffective communication in some modalities](#how-do-handle-poor-communication-esl-ineffective-communication-in-some-modalities)
- [Cross Org Influence](#cross-org-influence)
  - [How do you think about escalations?](#how-do-you-think-about-escalations)
- [Team Insecurity](#team-insecurity)
  - [How do you nudge engineers who won't ask you for help?](#how-do-you-nudge-engineers-who-wont-ask-you-for-help)
  - [Everyone wants to feel supported](#everyone-wants-to-feel-supported)
  - [Maintain perspective](#maintain-perspective)
- [Charters, Re-orgs and Bootstrapping](#charters-re-orgs-and-bootstrapping)
  - [The genesis: When you start from scratch](#the-genesis-when-you-start-from-scratch)
  - [The split: When a team outgrows a manager](#the-split-when-a-team-outgrows-a-manager)
    - [Horizontal vs Vertical Splitting](#horizontal-vs-vertical-splitting)
  - [The merge: When a manager leaves](#the-merge-when-a-manager-leaves)
  - [The flip: When charter changes](#the-flip-when-charter-changes)
  - [The Double down vs Pivot: When there is insufficient progress](#the-double-down-vs-pivot-when-there-is-insufficient-progress)
    - [Space can be successful, just hasn't yet - hold the course](#space-can-be-successful-just-hasnt-yet---hold-the-course)
    - [Space can not be successful, or can't be successful in a reasonable time frame](#space-can-not-be-successful-or-cant-be-successful-in-a-reasonable-time-frame)
    - [How long should you keep a "To Be Pivotted" project](#how-long-should-you-keep-a-to-be-pivotted-project)
  - [Telling the team about reorg/recharter](#telling-the-team-about-reorgrecharter)
    - [The FAQ](#the-faq)
  - [How to handle Layoffs](#how-to-handle-layoffs)
    - [What's the best way to execute layoff announcements?](#whats-the-best-way-to-execute-layoff-announcements)
- [Personal Motivations](#personal-motivations)
  - [Why do you find management attractive](#why-do-you-find-management-attractive)
  - [What is your dream job](#what-is-your-dream-job)
  - [What are your career aspirations](#what-are-your-career-aspirations)
  - [Why do you think you're a good coach](#why-do-you-think-youre-a-good-coach)
  - [Why do you prefer being a manager to an IC](#why-do-you-prefer-being-a-manager-to-an-ic)
- [Questions managers get](#questions-managers-get)
  - [What does a manager do in a day](#what-does-a-manager-do-in-a-day)
  - [What's the best/worst part of your job](#whats-the-bestworst-part-of-your-job)
  - [How do you get anything done with all of those meetings](#how-do-you-get-anything-done-with-all-of-those-meetings)
  - [What do you think developers do](#what-do-you-think-developers-do)
  - [What can engineers do to make manager's jobs easier](#what-can-engineers-do-to-make-managers-jobs-easier)
  - [Why do managers always say coding is part of their job but we all know it isn't](#why-do-managers-always-say-coding-is-part-of-their-job-but-we-all-know-it-isnt)
- [Product Development and Product Management](#product-development-and-product-management)
- [Business Acumen and Strategy](#business-acumen-and-strategy)
- [Appendix](#appendix)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What does a manager do

<a id="l-what-managers-do"></a>

### What are a manager's responsibilities

### How do you measure their success

### What is a manager accountable for

The success of a manager is the success of the team. This manifests in 4 dimensions:

<!--
An acid test:

- People love their team.
- People have clear understanding of career growth/progression and how their work supports it.
-->

| Dimension                          | Success Means                                                                                                                                                                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business Results                   | Team delivers business value for our customers and organization. I define success (KPI), and help the team understand and deliver it.                                                                                                              |
| High performance people and teams  | Team is well gelled and team members help each other. Everyone has growth plans which fit their needs and they are executing them.                                                                                                                 |
| Engineering Efficiency and Process | Engineering systems and protocols ensure a pit of success. Process is automated, and releases have high velocity and minimal risk.                                                                                                                 |
| Technical Assets                   | Systems are extensible in the ways that support the business. Operational burden is minimal (side bar: to help me prioritize I'm on the pages), and technical debt is applied judiciously (take debt if you might be able to write off the asset). |

### How do you describe your job to people outside the industry

I run a factory which produces widgets and has employees. For those in the industry this translates to:

| Dimension                          | Analog               | Metrics and Measures | Success Means                                                                                                                                                                           |
| ---------------------------------- | -------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business Results                   | Produced Widgets     | [l20](l20)           | I work with the business to help figure out the best "widgets we can make", by understanding what people want to buy and explaining how our factory runs.                               |
| High performance people and teams  | Factory Workers      | [l21](l21)           | Workers in the factory are healthy, learning, want to come to work every day, and getting along with co-workers.                                                                        |
| Engineering Efficiency and Process | Operating procedures | [l22](l22)           | The factory is efficient: Production is good and improving. Widgets come out consistently and on schedule. New employees know what to do. Everyone knows what to do during emergencies. |
| Technical Assets                   | Factory machines     | [l23](l23)           | Machines in the factory adjust quickly for the different types of widgets we build. Machines require minimal maintenance and have high efficiency.                                      |

<div> </div>

- l20
- Are wanted by customers
- Are produced on time and on budget.

<div> </div>

- l21
- Are happy based on surveys
- Are getting promotions frequently
- Recommend joining the factory to their friends
- Work at the factory for several years

<div> </div>

- l22
- Workers are efficient and safe with minimal effort
- Mistakes are learned once, and never repeated?
- Continuous improvement is occurring
- Variance is low
- Over time work is not required

<div> </div>

- l23
- Support a wide range of widgets
- Can be extended to build new widgets at low cost
- Have high availability
- Operate at low cost

### Hardest part about being a manager

- Firing: People think it's firing but it's not, see that section
- Personally: Telling team I'm quitting, tears, ride bike, etc.
- Actual: When need to surprise folks, abrupt direction change or killing projects.
- Likely, but I haven't done it: Layoffs, when know and can't tell.

### The Impact Pyramid

Thanks to [Andrew Wilkin](https://www.linkedin.com/in/andywilkin/) for this great model!

As an EM, your impact grows as you move from focusing on your immediate team to influencing the broader organization. This growth can be visualized as a pyramid, with each level building upon the foundation below it.

**1. Team Health: The Foundation**

The base of the pyramid is **Team Health**. A healthy team is a productive team. Focus on these key areas:

- **Core Skills:** Ensure the team possesses the necessary skills and expertise. Provide opportunities for professional development, mentorship, and knowledge sharing. Address skill gaps through targeted training or hiring.
- **Attrition:** Aim for low, manageable attrition. Understand the reasons behind departures and address any systemic issues contributing to turnover. Support departing team members in their transitions.
- **Morale and Culture:** Foster a positive and supportive team environment. Celebrate successes, acknowledge challenges, and address concerns promptly. Encourage open communication and psychological safety.
- **Hiring:** Continuously build a strong team through effective hiring practices. Focus on attracting and retaining top talent.

**2. Team Impact: Delivering Value**

The second level is **Team Impact**. A healthy team is positioned to deliver value, but it requires focused execution. Key aspects include:

- **Clear Goals and Priorities:** Ensure the team understands the "why" behind their work and has clear, measurable objectives. Align team goals with business priorities.
- **Efficient Processes:** Implement processes that streamline development, reduce bottlenecks, and promote quality. Encourage automation and continuous improvement.
- **Effective Collaboration:** Facilitate smooth communication and collaboration within the team and with external partners. Remove roadblocks and foster a collaborative spirit.
- **Consistent Delivery:** Establish a track record of delivering high-quality work on time and within budget. Build trust and credibility through consistent performance.

**3. Organizational Impact: Expanding Influence**

The top of the pyramid is **Organizational Impact**. Once your team is healthy and delivering consistent value, you can leverage your experience and insights to contribute to the broader organization. This might involve:

- **IC Team (Internal Consulting):** Since your team is running smoothly, dedicate some of your time to addressing organizational challenges outside your immediate team. This could include process improvements, mentorship programs, or cross-functional initiatives.
- **Mentorship and Coaching:** Share your knowledge and experience with other managers and individual contributors. Help others grow and develop their skills.
- **Cross-Functional Collaboration:** Build strong relationships with teams in other departments. Identify opportunities for collaboration and synergy.
- **Strategic Initiatives:** Contribute to the development and execution of organizational strategies. Provide insights and recommendations based on your team's experience and expertise.

By focusing on building a strong foundation of Team Health, driving Team Impact through efficient execution, and expanding your influence through Organizational Impact, you can maximize your effectiveness as an Engineering Manager and contribute significantly to the success of your team and the wider organization.

### What do you do in the first 90 days

First 90 days is [the bible here](/90days)

Outputs:

- Early Win: Figure out the situation, and deliver a win.
- Trust: Relationships with team, and peers, and partners.
- Knowledge: Know critical parts of business, tech, org.

### What do managers do all day

<a id="l-what-managers-schedule"></a>

_For non-managers, recall a manager's purpose is supporting others, not making stuff. As a result they have a [manager schedule, not a maker schedule](http://www.paulgraham.com/makersschedule.html)._

In a typical 44 hours week, 24 hours are standing commitments with others, and 20 hours vary based on the time of year, and needs of the team, business, and partners. Vivek Garg has a good post on his [manager of manager's calendar if you want more insights](https://istn.substack.com/p/rush-hour-go-inside-the-calendar).

| Hours | Time Allocation                                              |
| ----- | ------------------------------------------------------------ |
| 20    | Variable Time - depends on season and team need              |
| 8     | Team 1:1s - See the [1:1 questions](#l-one-on-one)           |
| 6     | Partner 1:1s - PM, Design, Partner EMs, Other Developers     |
| 6     | Reviews - Project, Engineering, Staff, Initiative            |
| 4     | Recruiting/Networking - Coffee chats, sell calls, interviews |

Depending on time of year, and experience of my team and partners, I'm doing 1 or 2 of the following with my discretionary time:

**People Development:**

- Stack Ranking/Performance Reviews/Career Growth Plans
- Low performers
- Complex people situations (more often then you'd expect)
- Extra recruiting

**Product:**

- Strategy development
- Road mapping
- Pitching
- Data Analysis

**Execution**

- Escalations
- Unblocking the team
- Negotiating/Finding win/wins with other teams
- Re-balancing projects and engineer allocation
- Inter and Intra team conflict.

**Tech/Organization**

- Generating content for a talk/program (e.g. D&I, Recruiting, People Development)
- Architecture/Design/Engineering Excellence brainstorming, and review
- RCA Analysis

<a id="l-technical"></a> <a id="l-technical"></a>

### Should managers be technical

Yes they are ultimately responsible for the outcomes of the team and that requires them to understand, confirm and nudge the team and partners. They should ensure the team is making correct architectural decisions and engineering excellence improves due to best practices.

They need to represent the team in technical forums, swag costs, represent laws of physics, bring back best practices, and catch upcoming incompatibilities and challenges.

- Attend architecture and design reviews
- Be on every page the team gets
- Have strong relationships w/technical leaders like principal engineers
- Follow major tech trends and product launches (keynotes, major tech blog posts)
- Read seminal books on topics ([ML](/td/machine-learning), [Cloud Native Apps](/td/cloud-first-applications), [Data Systems](td/data-systems), [etc](/td))
- Have Side projects in assorted tech and ideas (ML, PWA, FaaS)

They also need to be experts at working with data systems and analysis, as much of their time will be analyzing customer, business, operational, and technical data.

Once developers become managers they have little time to use their technical muscle, and their technical Aptitude declines due to lack of use. Therefore I recommend before switching they are:

- A very experienced engineer (MSFT L65, AMZN L6, FB E6).
- A expert in at multiple languages (for me python, and C#)
- An expert in multiple technical domains (for me networking and security).

<a id="l-code"></a> <a id="l-code"></a>

### Should managers code

Managers should read code on specific occasions, but they can't be on critical path because their time is often needed to deal with urgent situations. Thus, they can only write low importance code usually something you'd assign to an SDE-I. At that point, you have a very expensive priority inversion.

That said, SDMs need to use their product just like their customers do to be able to better understand and meet the customer need. Likewise, SDMs need to use their development tools periodically, which should include the code/test/deploy cycle, so they are better able to understand and meet their team's (aka other big customer) need.

SDMs should be reading code occasionally:

1. Spot checking - SDMs should have a good "something is fishy" intuition, and should be able to independently and discreetly prove or disprove their intuition.
1. Assessing people - Code is a major deliverable for developers and should be inspected as part of people assessment.
1. Deep dive during major outages - In high risk, time critical situations like outages, you want your best people reviewing the changes, and this includes SDMs. If an SDM can't understand a high risk time sensitive code change, it can be, and should be simplified.

### What engineering efficiency metrics should a manager monitor?

Lots, but these 3 are probably high on the list:

1. How much time is spent in outages/livesite/maintenance (don't forget to include time that should be but isn't due to lack of monitoring).
2. How often can developers check in?
3. How long does it take for a change to get to production.

## Managing and Developing People

### How do you coach

Coaching is a major part of the job, and covered in my [coaching post](/coaching):

_Coaching is like midwifery. A midwife can not give birth to the baby, she facilitates the birth. Similarly, a coach can not give a solution, she must give birth to the insight from within the coachee. Coaching is asking questions, guiding, and facilitating understanding, and this post collects my studies on the topic._

### What mechanisms do you have to ensure career development

**Principles for career development**

- Peeps have an accurate, clear understanding of their interests, strengths, weakness, and next career steps.
- Peeps have a clear understanding of level and role expectations for the current and next career stage.
- Peeps understand how their work "ladders up" in impact and career development.
- Peeps get frequent feedback on in progress work
- Peeps and managers have a consistent understanding of the above.
- Manager actually uses the process himself with her own manager.

To achieve these principles there are several tools:

| Tool                      | Time Horizon    | Checkin Frequency |
| ------------------------- | --------------- | ----------------- |
| Career Growth Plan        | 6m to 2y        | 3m                |
| Pre Write Self Assessment | 1m to 6m        | 4w to 8w          |
| Frequent Feedback         | Immediate       | As Needed         |
| Situational Leadership    | Stage Dependent | Stage Dependent   |

### How do you support folks with their career growth plans (CGPs)

CGPs are Forward looking and a good place to discuss what opportunities are required, and what major development areas should be tackled, and what's required to meet the next career level. [I.M.Wright gives some excellent insights](https://imwrightshardcode.com/2021/11/whats-your-career-plan/)

Each employee has a career growth plan (CGP). This is a document with open ended questions like:

- What are you most proud of?
- What is most draining?
- What are your short, medium and long term career goals?
- What are the steps to get there?
- What are your gaps between now and the next step?

To help with the last two questions, this document has the list of expectations for the current level, and next level. For each expectation, you fill in your self assessment of where you are at on the expectations relative to level, sometimes it's below, at or above. This is great tool to ensure you and those supporting you are in sync, and that they can best support you.

### How do you support folks by pre-writing self assessments

Think through what will be delivered in the next 1-6 months, and how it will be delivered.

Most companies have a performance program - At MSFT it's connects, at FB it's PSCs and Amazon it's Forte. As part of this process, an employee writes a self assessment for the work that happened in the last 6 months - 1 year, and then the manager uses that as a basis of the review they'll write.

There are several advantages to pre-writing these documents:

- The peep and manager can be deliberate about what work is done, and discuss if projects make sense, and if they are the right projects.
- The peep and manager understand the impact provided by the work.
- The peep has a record of what they've done in the performance period, instead of only having a crisp memory of the last few months, and can use that to write the self assessment.
- The manager can calibrate the work to be done so there are no scope surprises.

Good self assessments are concise, focus on impact, and then how you delivered the impact. More details at [I.M Wright](https://imwrightshardcode.com/2018/06/connects-with-impact/):

- _[Clearly measurable impact]_ by _[work you've done yourself and/or with others]._
  - Relevant artifacts, or quote from others validating the claim.

Here are some fictitious examples modeled on my own career:

- Improved Azure virtual machine boot time from 12 minutes to 2 minutes at P90 by investigating end to end system behavior, understanding end 2 end system operation, creating and driving agreement to all up goal, and then working with teams to establish budgets, and holding them accountable to delivering them.

  - > At first my team was skeptical that the performance improvements could be achieved and were hesitant to invest, but once we saw the organizational support and monthly meetings of progress we found it inspiring and made sure we contributed to the goal.

- Drove XXX\$ to charities, and increased Alexa Shopping DAU XXX % (XXX to YYY) to by proposing a charity giving feature and implementing it in 5 months. Complexity, 20 eng/months, supporting work from 5 teams, across multiple divisions

- Delivered XYZ, required to deliver TLS support on windows phone at very high quality. Complexity 1 engineer, 4 months - however required ramping up on complex error prone C++ code base, and no bugs found

  - > Igor's delivery was on time and of high quality. The feature had no bugs in production, due to high test coverage, which was impressive given the high complexity of the C++ code.

- Increased team morale and cross group collaboration by proposing weekly team lunches, and monthly lunches with the broader organization.
  - The monthly lunches were great. At one of them, I learned Bob on the other team was building a similar feature to mine and so we collaborated and were able to save 3 weeks of coding time.

You should be observing the key to these self assessments is impact. The goal isn't motion, it's impact. If you don't know the impact, you should ask yourself (and your manager) why you are doing the work. Pre-writing self assessments is a great way to do this.

### How do you give fast, frequent, feedback

I aspire to provide immediate observed feedback, for something that is about to happen (like reviewing a document), or a de-brief after a critical meeting or review.

I keep my eyes open for opportunities for feedback from my observations, and from soliciting feedback from peers and partners. I take the feedback and figure out the best way to give it.

My priority is "catching employees doing something right", so I can re-enforce positive behavior. Even better, with positive behaviors I can provide them in public which not only benefits the employee, but also re-enforces that goodness with the team.

### What do you recommend for folks who just joined the team

- Consider the first 90 days
- Ensure you get coffee with everyone on the team
- Get them checking in as soon as possible
- Get them a mentor

### How do you think about situational leadership

More details are in my [coaching post](/coaching). Here's a preview:

As people learn new skills they experience a learning curve, which requires different support at different points on the curve. [Situational leadership](https://en.wikipedia.org/wiki/Situational_leadership_theory) describes this in detail, but in a nutshell, while learning new things, people go through this grid from 1 to 4.

{% include quadrant-matrix.html
    title="Learning Stages Matrix"
    subtitle="The journey from novice to expert"
    x_label="Confidence →"
    y_label="Competence →"
    x_low="Scared" x_high="Confident"
    y_low="Incompetent" y_high="Competent"
    q1_name="4. EXPERT"
    q1_subtitle="Competent + Confident"
    q1_traits="Know they can do it<br>And they're right<br>Ready to teach others"
    q1_color="rgba(232,244,234,0.5)"
    q2_name="3. JOURNEYMAN"
    q2_subtitle="Competent + Scared"
    q2_traits="Think they can't do it<br>But actually they can<br>Need confidence boost"
    q2_color="rgba(255,229,180,0.5)"
    q3_name="2. NOVICE"
    q3_subtitle="Incompetent + Scared"
    q3_traits="Know they can't do it<br>Feel bad about it<br>Need encouragement"
    q3_color="rgba(230,230,250,0.5)"
    q4_name="1. FOOLISH NOVICE"
    q4_subtitle="Incompetent + Confident"
    q4_traits="Think they can do it<br>But really can't<br>Need reality check"
    q4_color="rgba(255,224,224,0.5)"
%}

In each of these stages different support is required.

{% include quadrant-matrix.html
    title="Leadership Support Matrix"
    subtitle="How to support people at each learning stage"
    x_label="Confidence →"
    y_label="Competence →"
    x_low="Scared" x_high="Confident"
    y_low="Incompetent" y_high="Competent"
    q1_name="4. EMPOWER"
    q1_subtitle="For Experts"
    q1_traits="Explain why not<br>Remove obstacles<br>Give autonomy"
    q1_color="rgba(232,244,234,0.5)"
    q2_name="3. FACILITATE"
    q2_subtitle="For Journeymen"
    q2_traits="Explain why<br>Build confidence<br>Provide context"
    q2_color="rgba(255,229,180,0.5)"
    q3_name="2. GUIDE & ENCOURAGE"
    q3_subtitle="For Novices"
    q3_traits="Show them how<br>Provide support<br>Celebrate progress"
    q3_color="rgba(230,230,250,0.5)"
    q4_name="1. INSTRUCT & EXPLAIN"
    q4_subtitle="For Foolish Novices"
    q4_traits="Tell them what to do<br>Set clear expectations<br>Provide structure"
    q4_color="rgba(255,224,224,0.5)"
%}

### What are the level specific career expectations and growth strategies

Depends on the skill level (E.g. [levels](https://www.levels.fyi/) ): SDE-I is a junior developer, SDE-II intermediate, and SDE-III senior and above. Also see my post on the differences between [Tech Lead, Architects and Managers](/software-leadership-roles).

| Level        | Approach                                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Junior       | Not a lot of variance. Have a rubric for junior SDE skills and make sure they are getting the opportunity to learn and execute each box. Make sure they have a solid mentor, and opportunity after opportunity to round out their knowledge.                                                                                                                                          |
| Intermediate | Now it's about how are you helping the team, growing your contributions. Bigger experiences, maybe out side the org, both to build your skills, and increase your org visibility. Double down on super powers, close red flags and blockers. Very satisfying to watch people "blossom" into leaders.                                                                                  |
| Senior/Staff | Here you're getting people that are at a career level and are happy with a lot of what they're doing. Now it's helping folks decide how much they want to grow, and where they want to improve. Here it's finding mentors, and how we want to split responsibility and cover each other. Also opportunities for what they own for the group (30-60+) e.g. security or process or etc. |

My approach, and frequent peep questions.

| Level        | Things I repeat and repeat |
| ------------ | -------------------------- |
| Junior       | [l10](l10)                 |
| Intermediate | [l11](l11)                 |
| Senior/Staff | [l12](l12)                 |

- l10
- We hired you because you're smart+really good. If you can't understand something, it's probably the presenter doesn't understand it well, as opposed to you not understanding.
- You are new, and need to learn and need to spend a bunch of time asking for help and guidance. I have one rule - you must come with a bad idea (which will start becoming good ideas). You fail when you bring nothing, you ace it when you bring a bad idea. We'll help you develop that bad idea, and help sharpen your thinking skill.
- "You have a fresh perspective - If something doesn't make sense ask, for us, we're like fish in water, so challenge our assumptions".
- I'm here to help you close gaps, sharpen their understanding by teaching it to you

<div> </div>
- l11
- How do you make the team better?
- What are you gonna be known for?
- You're the owner, you'll do everything and I work for you. What help do you need
- Do shadow coaching, where I might be writing/pr-doing work but they do the send/take the credit

<div> </div>
- l12
- [Fantastic Video on Being a Staff Eng](https://youtube.com/watch?v=l-oCDQGH3EU&si=SDZXgQJgmUzV1aJQ)
- [Amazon's Principle Engineer Roles](https://www.linkedin.com/pulse/principal-engineer-roles-framework-mai-lan-tomsen-bukovec-142df/)
- Great post on being a [staff + level engineer](https://lethain.com//staff-plus-eng-resources/)
- Are you clear on [Tech Lead, Architects and Managers](/software-leadership-roles).
- Great articulation of [How to find the problems vs just solving them](https://www.instagram.com/p/DPAjDxxjUEf/)
- What are you driving for our larger organization?
- How are you maximizing our benefit?
- How do we make sure we compliment each other?

### How do you get engineers promoted, and to understand their path to promo?

Most engineers care deeply about being promoted, and I care deeply about engineer growth, so our motivations are aligned.

Before going into the process, remember that surprises are **BAD** - especially with promotions. Surprises usually mean I haven't set clear expectations, requiring me to do a mini-RCA.

For promotions, my goals are:

- Engineer aspires to promotion and feels on track
- Engineer gets new opportunities/support needed
- Shared understanding of promo gaps and plan
- Engineer feels they reached conclusions themselves
- Engineer doesn't want to be over-leveled

How I approach this:

Assume engineer's self-assessment is right - review criteria together:

- Skim level expectations, deep dive in next 1:1
- Ask for self-evaluation
- Align on assessment, noting any differences
- Review examples together
- Ask "How would you compare your behavior to others?"
- Ask "What gaps do you see?"

Create shared plan to close gaps:

- Identify stretch projects/opportunities
- Find mentors to help in key areas
- Review Quarterly

As we get closer, pre-write the promotion document:

- Write the document we'll present at the promotion
- Include projects/behaviors that are completed/demonstrated already, and also those that need to be done to be eligible for promo
- Review the promotion document with other managers to align that it's sufficient.

Promotion fever sometimes occurs when engineers fixate on promotions. Common cases:

- Not ready
- New hire who feels under-leveled
- Ready but missed promotion due to circumstances

In each of these cases, we go through the promotion preparation process above.

### How do you help people switch jobs

My goal is to find people the right job, not the job on my team. I coach a lot of people through this, and here are my most popular posts:

- [Reducing Job Hunt Stress](/job-hunt-stress)
- [Only care about total compensation](/comp)
- [What I wish I knew at 22](/twentytwo)

### How do you keep people motivated

<a id="l-motivation"></a> <a id="l-motivate"></a>

Classically, motivation is comprised of carrots and sticks, where carrots focus on extrinsic motivation like compensation. Turns out sticks and extrinsic motivations fail for creative tasks. Instead I focus on the following dimensions

Motivation has 2 dimensions, personal experience and team environment. Personal experience is based on the book Drive, and is about encouraging Autonomy, Mastery and Purpose. The team environment is about the culture in which you experience the personal dimension.

Another lens of motivation is [satisfaction and dissatisfaction](/dsat):

_Satisfaction (SAT) is not a lack of dissatisfaction (DSAT). SAT and DSAT are orthogonal experiences. DSAT is the reason you can't sleep well at night, and SAT is reason you set your alarm for 5am so you can get an early start tackling your favorite problems_

### How to motivate through personal experience

I use Daniel Pink's [DRIVE model](https://youtu.be/t9wDmRMtPnA). TL;DR: Extrinsic motivation doesn't work, you need intrinsic motivation, which is driven by Autonomy mastery purpose.

**Autonomy: Direct thy self**

- You choose what you work on (Link: How does resource allocation work)
- You are the end to end owner.
- You make the decisions, though I'm here to support. Even if I disagree, it's your call.
- We collaborate on the definition of success, and then you choose how it gets done.
- I support you in private, by helping you understand success, sharing how I'd do it, helping you see around corners, and bringing up signals and context you may be missing.
- I support you in public by re-inforcing your message and needs, and nudging where nudges are required.
- You know the team has your back
- I protect you from harmful rays of upper management and business
- Hack-a-thons

**Mastery: Become the best you can be**

- (Link: Managing and developing people)
- I help you brainstorm what skill you want (or need) to master.
- I remind you that building mastery is painful, and that's OK. (Link: Situational Leadership)
- I encourage frequent feedback by encouraging sharing [small increments, spikes, small diffs, etc](https://www.thezbook.com/the-biggest-mistake-i-see-engineers-make-2)
- I encourage continuous improvement, retros, and mentorship and menteeship
- I'll push you to 110% of your capacity, but I tell you when you're at 90,100, or 110.
- As you build your skills, I help you find bigger and bigger opportunities and/or Exposure
- I am on the lookout for projects that help you find what makes sense for you.

**Purpose: Make the world a little bit better**

- Focus on the why
- Call out the impact
- Call out the small wins
- Share the success with the team
- Share success with partners and boss
- Remind you putting the team first, and supporting others is a very strong purpose in and of itself

People also care deeply about coaching and career growth:

- Catching people doing things right.
- 110% of capability but clarify doing 110% vs 80%

### How to motivate through team environment

I focus significant energy nurturing the [team culture](#l-culture):

_As a team we all aspire to a culture where coming to work is fun, the team members put the team needs ahead of their own, the team gelled and by people being vulnerable we built a strong sense of psychological safety_

I spend significant energy generating [Moments](/moments-at-work):

_Of all the places we spend our time, work is the one that dominates. However, when we look back on our lives, work is often the thing we remember least. Why? Because we remember our lives through peak moments, and there are few of those, especially positive peak moments, at work. Luckily, peak moments can be created and leaders can be taught how to create them. This post explores opportunities and techniques to create these moments._

Some moments like:

- Constant celebrating people doing stuff
- Hack-a-thons
- Playing cards for appreciation (Link: Playing cards for appreciation)
- Managers making breakfast

### How do you handle task overload

First, I remind folks of our culture:

- We trust each other—feel safe, be vulnerable, support each other.
- We put the team first, always—greater than the sum of our parts.
- We know we can't win if the team loses, and we can't lose if the team wins.

Then I remind them when the going gets tough, more hours doesn't fix it, prioritize does.

{%include summarize-page.html src="/overload"%}

### How do you give challenging feedback

Why is feedback challenging?

1. It's a surprise
2. Folks don't want to hear it
3. Folks don't think you have their best interests in mind.

Deep diving on what makes conversations hard:

1. Surprise - see around corners, and bring up anything I see ASAP, and foreshadow. Meet frequently, know what people care about.
2. Attack the messenger - High Trust, Know how and when the person likes to hear stuff. Address what they care about.
3. Don't want to hear it - Self Aware, Think I have their best interest in mind, Put it in terms they want to hear it.
4. Over dramatize - Anticipate what they'll care about, pre-address.

Types of tough conversations to flesh out:

Performance, Charter, Re-org, Team mates leaving, Lay Offs.

### What's the point of 1:1s

<a id="l-one-on-one"></a>

1:1's are the highest ROI activity and the most expensive. They take 100% of both parties attention in a non-scalable manner. At the same time:

- If on average 1:1s gives an 0.25% performance improvement, you get a 12% per performance improvement per year, which equates to 300% in ten years.
- If there isn't a forum for discussion, many concerns and bottlenecks will be ignored. Those ignored concerns and bottlenecks are lost opportunities in the best case, inefficiency in the median case, and catastrophe in the worst case. (Using an exception handler analogy, the default exception handler is ignore all, and we know how that works out)

My goal for 1:1's is to:

- Build trust and relationships
- [Coach and be coached strategically and tactically](/coaching)
- Teach and Learn context
- Have confidential, [awkward discussions](https://medium.com/@mrabkin/the-art-of-the-awkward-1-1-f4e1dcbd1c5c) ([part 2](https://medium.com/@mrabkin/the-art-of-the-awkward-1-1-f4e1dcbd1c5c))
- Allow others to express emotions and let off steam in a safe space

(Again with that programming analogy, the 1:1 is a debugger attached catch all exception handler. This allow all concerns to be discussed, understood, rethrown, reprogrammed or ignored. I know - the analogy needs work, help me make it better)

### What do you do in 1:1s

My favorite opening is "What's on your mind", then I focus on asking ([coaching questions](/coaching)) and end with "what can I do immediately to help you?"

I push for awkward conversations. When my peeps have nothing to talk about I ask some of my [favorite prompts](/prompts)
A few things I don't do:

- **No public status reports** I discourage using 1:1 to share the public news and weather "status report" - we can read that offline ourselves. A valuable use of time is the "inner and private stories" on the status - What is hard, what is most fun, where do you want to improve?
- **No deep dives when I could just do offline homework** I think 1:1 off the cuff deep dives are an anti-pattern, an indication that there's a missing artifact that'd be valuable to a wider audience. I'll often say can I get a TL;DR and "How would I go about learning X,Y or Z"? If the answer is "ask me", I'll often recommend a low quality on paper brain dump we can review together. This lets us efficiently have an async discussion which captures Q&A in a durable form. Once we've done the easy async discussion in the doc, we review the comments together with more complex questions, and more private context, and more discussion.

<!--

**Giving Feedback** Lots of contextual feedback can be given in "coaching moments" as soon as you've observed things. Other feedback is best delivered through follow up questions during the "what's on your mind" induced discussions.

**Getting Feedback** I try not to 'spend' my peeps 1:1 time, but I will both ask them generic feedback - what do you think I should stop/continue doing? And specific feedback - I'm thinking of X,Y,Z what's your reaction? Or, I did X,Y,Z last week, what did you observe?
-->

I have less frequent, but extremely important 1:1 types like:

- **Career discussions** A discussion around what we should be focused on for the next 6-18 months.
- **Promo preparation meetings** - Help ensure we're on the same page about what needs to happen for career trajectory and promo.
- **Performance Review Feedback**
- **Leadership card evaluation exercise** (so good, needs its own post)

Other thoughts:

- I aspire to be accessible - I encourage folks to come to me any time (but most don't).
- I "manage by walking around", just seeing what people are up to and working on.
- I group my 1:1's on the same day (or over 2 days) because 1:1 is a special frame of mind, and it's hard to stay in that zone.
- I wish I used a 1:1 document, as that seems to be a best practice for most domains.
- The current norm is 30 minute 1:1's but I enjoyed the old days when an hour was the norm. I often wonder if we've sacrificed effectiveness for efficiency in the 30 minute 1:1 culture.

### How do you handle communication problems

High order bits:

1. Success is not "communication style", but ability to influence. Influence comes in many forms and mediums.
1. Some things labeled communication problems, but they are much more serious and need to be handled differently. E.g. Lack of clarity of thought/intellectual horse power and being a jerk.
1. Focus on strengths is 3x as effective as shoring up weaknesses. Leverage strengths and partner with others to maximize influence.

There are different types of communication problems each needing a different strategy:

- Verbal diarrhea
- Dominates Conversations
- Abrasive communication style
- Not listening to others
- Unclearn writing (too verbose, not enough context)
- Verbal/ESL/Not comfortable with in-person verbal communications
  - Pre-write thoughts
  - Toast masters
  - Use pictures
  - Say not great on my feet, follow up with a document
- Uncomfortable in group settings

### How do you identify and help eng decide if management is right for them

Engineers that are interested in reading this post make good manager candidates. The path usually start with getting an intern, then being a tech lead with heavy mentoring. Then having them take over as many as people issues as people are comfortable with them tracking.

**Help them preview as much as they can - for example**

- Intern
- Mentor
- Volunteer to do jobs for the manager
- As a technical lead do some proto managing on behalf of the real Manager.

**Be a strong IC first**

Make sure you're a senior enough engineer before becoming a manager (AMZN - L6; FB - E6; MSFT - L65). Once you become a manager, your technical skill drops as most of your energy is focused on other tasks. So, if you don't have a strong enough base, you'll lose your ability to help assess and provide input on technical tasks.

Read this:

[90 days as a manager](https://review.firstround.com/this-90-day-plan-turns-engineers-into-remarkable-managers) - Great insights to what's different and how to assess if it's right for you.

### How do you grow new EMs

_Personal note: I've never managed EMs, but I find mentoring them especially satisfying_

I've done this a fair number of times now, here are some topics that are usually surprising that they need to get on top of instantly:

- Calibrations: Do you have any promos or low performers, what is your plan for them.
- Job Shifting: Read the first [90 days](/90-days)
- Recruiting: As soon as they can hire.
- Strategic vs Tactical thinking, Shifting the time horizon
- Low performers: How to deal with them.
- Setup a new hire mentoring ring

- Mentoring Rings
- Good HBR articles [1](https://hbr.org/2002/04/saving-your-rookie-managers-from-themselves),

### How do you grow top talent

### How do I help people raise concerns/give constructive feedback?

There tend to be two things that hold people back:

**1/ It feels like throwing someone under the bus**

- **Concerns are an act of care.** Noticing something doesn't mean someone messed up—it means you care enough to keep things running smoothly.
- **You don't have to be sure.** If something feels off or unclear, it's still worth surfacing. I'll help figure out if it needs action or just acknowledgment.
- **It's not about blame.** Raising concerns isn't betrayal—it's like pointing out a wobbly wheel so no one crashes.
- **It's a shared responsibility.** We all help each other see around corners.
- **I'll walk with you.** You don't need a perfect story—just a gut feeling. I'll help you sort out what matters and what to do next.

**2/ It's hard to get the words right**

I remind folks not to waste time polishing every word or making sure their evidence is bulletproof—this isn't a performance or a criminal trial.

Just jot down a few rough thoughts and grab some face-to-face time with me. We'll talk it through. Here's what to expect:

- **I keep it confidential.** Unless you say otherwise, your name doesn't travel.
- **I ask precise questions.** I'm trained to spot signal in fuzzy stories and I often have more context—I'll help clarify what you saw and get the details I need to dig deeper.
- **I seek other input.** If needed, I'll check quietly with others to see if it's a pattern or a one-off.
- **I stay with you.** Sometimes I'll tackle the concern myself; other times I'll support you in giving feedback (if you'd like). Either way, you're putting the team first, and I've got your back.

### Recall career is just one part of your life

Often, when folks think of career development, they fixate on their job title and compensation. Those aspects are important, but I encourage folks I support that career is only [one aspect of life](https://bit.ly/igor-wlb-manifesto), and they should look at their life holistically

{%include blob_image.html src="blog/career-convo.png" %}

### How do you have a difficult conversation

From Simon Sinek, a great script:

- I need to have a difficult conversation
- I'm afraid to have this conversation,
- I'm afraid to say something wrong, and accidentally trigger someone
- I know having this conversation is more important than my fears against it
- Please work with me to struggle through this.
- Because want us to tackle this subject

### Should employees game the system to optimize for the review process?

The point of the review process is to reward the highest impact behaviors, so if the review process is designed properly, optimizing for it should align with maximizing your impact and value to the company.

On the management side, there's an art and science to designing a review process that accurately measures and rewards impactful work. For employees, many of the things you might do to "game" the review system - like documenting your accomplishments, quantifying your impact, and taking on highly visible projects - are actually valuable behaviors that increase your contributions.

For the cynically-minded, this article humorously argues that optimizing for reviews often means doing genuinely impactful work:

[A fun article that comes to that conclusion](https://gieseanw.wordpress.com/2024/10/24/why-that-one-coworker-got-fired-for-no-reason/)

The key is to focus on maximizing your real impact and value, not just appearances. A well-designed review process should recognize and reward that genuine impact.

## Culture

<a id="l-culture"></a>

### What is your ideal culture

Tough question. I need to put more thinking and polish into this.

Culture has 3 components: The team, The execution model, and the Growth mindset

Part 1: The Team: Enjoy the Ride

- We spend 80% of our waking hours together—let's make it fun.
- We trust each other—feel safe, be vulnerable, support each other.
- We put the team first, always—greater than the sum of our parts.
- We know we can't win if the team loses, and we can't lose if the team wins.
- We celebrate wins, share kudos, create memorable moments.

Part 2: The Execution Model: Imagination Executed Sustainably

- We ship fast—speed without sacrificing quality.
- We test early, test cheap, test often.
- We pay down tech debt—keep moving forward.
- We never get stuck—find creative ways forward.
- We bring ideas, even half-baked ones—care, collaborate, solve together.

Part 3: The Growth Mindset: Relentless Improvement

- We see feedback as a gift—continuous improvement at our core - we give and receive it
- We view mistakes as opportunities—always better tomorrow than today.
- We commit to growth—career, technical, personal.
- We believe retros are great—but action is everything.

### How do you help a team gel

- Team lunches
- Moral Events
- Help people see each other as 3 dimensional humans - talk about personal stuff.
- Encourage people to think of the team as an entity, and how to improve the team, not themselves.
- Encourage people to vocalize their appreciation publicly
- Encourage people to ask for help, and get help
- Remind people it's intimidating to ask for help, and they can take a stand to make it happen.
- Have the team focus on success of the team, ahead of personal success.
- Encourage people to improve the team at every opportunity.

### What order would you introduce culture

When I joined FB we were full remote, and started with only 1 30 min team meeting every 2 weeks.
Here's what I worked with the team to establish

- 1 x week team meeting w/demos
- 1 x week team meeting
  - replaces 1x week demo and team meeting:
- 2 x week stand up
- 1 x week tech talk/deep dive
  - deep dive sessions, guest speakers, TIL sessions
- 1 x 2 week demos
- 1 x 2 week retro
- 3 x week lunch

### How do you make a good culture

- Model myself
  - On All the Pages
  - If team is working I'm working
  - When I make mistakes I apologize
  - If I drop the ball I make it clear.
  - When someone does well I celebrate and call out.
- Catch people doings things right
  - Coaching stuff
  - Put it front and center
  - Let team take ownership of it.
  - Incite pride and purpose
- Repeat/Repeat/Repeat

### How do you think about ad-hoc insights/questions from others, even if you've already thought of and maybe presented the doc/plan/answer already?

_(others == peers, VP, interns, doesn't matter)_

**Concise answer:** I **really, really** appreciate it.

**Robot answer:** The return on investment (ROI) is fantastic. Let's do the math.

- For the other person - They already thought of something, the cost for them to bring it up is **super cheap**.
- On my side there are two cases:
  - I've already thought of the answer/insight, explaining it should be **super cheap**
  - I haven't thought of it, now it's not cheap, but could be a huge saving down the road, great ROI.
  - Bonus: I have thought about it, but explaining it again with the twist brought on by that person adds a new insight and improves my understanding or explanation.

**Human Answer:** When I get these questions/insights, I don't feel questioned/seconded guessed, I feel honored. The other person is super busy and has spent their precious energy thinking through an issue I care about, which is essentially caring about my success. The other person has a tonne of experiences and perspective different from my own, and it's a real gift when they spend their energy on me.

### How do you handle Remote Work

I'm writing this stuff [my rough outline](/remote-work)

### What about Work Life Balance

Work Life Balance is so important to me that I wrote a [manifesto](https://bit.ly/igor-wlb-manifesto) - the opening paragraph:

_I don't want to die knowing I spent too much time at work and I bet you don't either. As a result I want to work with people who value a culture encouraging them to balance their family, health, hobbies, and work - aka work-life balance. To make a culture real leaders needs to walk the talk, and I'll describe how I model a work-life balance, and the mechanisms I use to help team members achieve their own balance._

In the rare event you do want to die knowing you spent too much time at work, try to remember more hours rarely helps. In XKCD format:

{%include blob_image.html src="blog/more-hours.svg" %}

Equally important, when folks consider their career, I remind them there are more dimensions to their life, and they should think about their balance. There are some years and halves where they want to focus on their career, and others where the focus will be family and health.

{%include blob_image.html src="blog/career-convo.svg" %}

### How do you deal with a team that disagrees with the leadership

Step 1: Believe and deeply understand it. Either I believe in it, or I deeply understand the decision and have disagreed and committed. As part of committing, I'm all in, and will share that.

Step 2: Listen to the team. The team has concerns, hopefully I can predict them ahead of time and be prepared for the easy ones, then truly listen to new concerns, and address them.

Step 3: Focus on the win/win, and talk through a ripcord.

### Agency and Psychological Safety

I gave a talk on [lies we tell ourselves](https://docs.google.com/presentation/d/1u8kswf7qUDdKgMlxBVRUXilwECv9sVWJtM6IMTuP5hQ/)

### Kudos Boards - Appreciations

Both helpful for a short period of time, and for a longer period of time, kuddos boards let the team get together and celebrate what they appreciate from their co-workers. This has many benefits:

- People are appreciated for their contributions
- People are reminded how impactful their work is
- Good behaviors are recognized and reinforced
- The team bonds and grows

A nice format for this is a "clock" with everyone's name on it, and the center of the clock having great prompts like:

### How do you like being questioned/micromanaged?

This applies to me, and I need to think about if this is a good part of culture. I like to tell people:

Never worry, I'll think you're "questioning me". I like sanity checks.

If you already had the thought, it's free for you to say it. If I've already thought about it, it's free for me to share my reasoning.

Catching a bad assumption on my part, or even more important, something I haven't thought about - priceless.

### How do you transition from mercenaries to missionaries

Mercenary - A hired gun who does exactly what you tell them without question
Missionary - A person who believes in the mission and will do what they believe is best

When there's too much top-down direction, a team can turn into mercenaries. They stop thinking and just do what they are told. Not good.

What you want is missionaries, people that deeply believe in what they are doing.

TBD: TODO add specific things here.

## Process and Mechanism

### Theory of Process

Why:

- Turn input into outputs
- Reduce variance and setup a pit of success.
- Scale
- The human equivalent of great tools (source control, linters, bug management systems)
- Don't waste "mental juice" on solved problems - see ([checklist manifesto](https://www.amazon.com/dp/B086XF436Z/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1))

How:

- How to measure success of the process, what will you inspect, when will you adjust?
- What other process is this similar to, can we co-coalesce with something else?
- How will you get buy in from up, out and down?
  - (Bright spot, then land and expand)
- Who is the owner?
- Ownership lifetime, per quarter, or forever.

Thoughts:

- The organizational equivalent of [habits](/habits)
- Culture vs Process

### The dark side of process

The upside of process is that we can do things without thinking. The downside is that we stop paying attention to process cost, small errors, and become resistant to change, which is often positive at a minimum and often required.

This can be especially true when process is created high in the org chart to solve a specific problem in another part of the org chart, and then applied universally, even where the problem does not exist.

**The antidote** - A review of process is essential to ensure it's still getting the maximum value with minimum cost.

**Toxic process** - Bad process will disenfranchise ownership and stifle passion. It'll slow down things that can be fast. There is nothing more powerful than a motivated engineer, don't let process take that away.

Funny article on [how good oranizations should be like slime mold](https://komoroske.com/slime-mold/)

### On Change

There are a few kinds of changes.

One way door changes should start with -100 points because:

1. There is only so much change a team can handle
1. Change has unexpected consequences,
1. Before the change, many problems, most of which you don't know about, have been solved by evolution, and will re-appear after the change.
1. Many solutions, are like a 4 sided rug in a 5 sided room, no matter the solution, you still end up with a problem, the devil you know vs the devil you don't.

Two way door changes are much safer when performed well:

1. Start with a pilot
1. Let the larger group adopt it if they feel it has value.
1. Come up with a criteria to roll back the change
1. Setup guard rails to monitor to roll back.

### That sounds like good intentions - Factories and Artisans

- Process vs Good Intentions
- Toyota Assembly line vs Artisan
- The inconsistency from passionate projects

### Never have a human do what a computer can do

- Use auto style for code review styles
- Gather data from bug systems instead of having humans do it.
- Automated tests vs human execution
- Multiple copies of the same data

### Rich communication - Team meeting

### Continuous Learning - Deep Dives, Knowledge Transfer and Guest Speakers

### Engineering Excellence - Operational Review and Correction of Errors

There should always be an on-call, an engineering excellence work stream, and a periodic review meeting and a [correction of errors](/coe) process.

1. How do we know our customer is having a good day?
2. How do we maximize our velocity
3. How do we keep our developers happy.
4. How do we sleep well at night?
5. How do we get max learning from outages?

By the way, I think a manager should be on all pages and outages. This is a great way to get a strong appreciation for boots on the ground reality.

- Write up for all outages, [Correction Of Errors](/coe) for major outages
- Maximize value of mistakes, don't make them twice.
- For all customer impacting events, review w/Customer Impact, root cause understood, and commitment when to address.
- Observability
  - How do we get a page next time?
  - How do we see what's going on?
- Testing systems.
  - Very high leverage activity

### Data Driven - Customer and Business Metric Reviews

### Continuous Improvement - Retrospectives

### Team Participation and Feedback - Surveys and Polls

It's very easy to "think" the team is getting what they want, or has gotten what they want. A fast, easy way to validate this is having polls before something happens, and surveys after.

Some examples where we use polls:

- Should we move this meeting to another time?
- Where should we go for lunch
- What questions should we focus our limited time on?

Some examples where we use surveys:

- Which meetings are a good use of time (special survey)
- How are we doing on XYZ
- How helpful was this presentation, what could have gone better (TODO: link to a useful survey)

Pro tip for surveys - use part of a meeting to complete a fast survey. This ensures completion isn't just another thing that needs to be done.

### Quality and Technical Growth Design+Arch Reviews

- Really a preview, not a review.
- Ensure that tech assets are high quality and require minimal re-work.
- Ensure team gets cross trained.
- Catch stuff as early as possible
- Get developers used to being on the whiteboard

### Code reviews

Code reviews have evolved into a method to catch errors. I'm not a fan, I think instead they are a way to train and knowledge share. [This post](https://www.aviator.co/blog/how-not-to-do-code-reviews/) summarizes it well.

> Code reviews should be done in a way to foster collaboration and continuous learning. This feedback and discussion are no longer mainly meant to improve the current code—it's to grow a team that can build a healthy codebase in the long term.

Quality still needs to be enforced but there are much better approaches:

- Things like style/lint should be handled by opinionated linters
- Automated Tests should be the way errors are caught
- Soon, AI error detectors
  {%include summarize-page.html src="/testing" %}

When looking at code reviews as a teaching tool:

- Pair programming is like code reviews but way better.

- You can strategically pair more experienced domain experts with less experienced reviewers to accelerate learning and reduce knowledge silos. Less experienced engineers gain exposure to expert feedback and best practices, while seniors benefit from fresh perspectives and must clearly articulate their reasoning.

- The emphasis should still be on discussing and explaining issues and concepts rather than just pointing out issues that need fixing. Other engineers not involved in the review process can also read through these discussions at a later stage to understand why certain changes were made and how they fit into the big picture.

## Planning, Roadmaps and Resource Allocation

### Start with why, end with who: The execution order framework

When planning execution, follow this order:

1. **Why** - Start with the purpose and impact

   - What problem are we solving?
   - What's the business value?
   - Why is this important now?

2. **What** - Define Success

   - What does success look like?
   - What are we building?
   - What are the key requirements?
   - What are the constraints?

3. **When** - Establish timeline and milestones

   - When do we need this by?
   - What are the key dependencies?
   - What's the critical path?
   - What are our checkpoints?

4. **Who** - Assign people last
   - Who has the right skills?
   - Who needs growth in this area?
   - Who is available?
   - Who is interested?

The order is important because:

- Starting with "who" leads to solutions constrained by current team skills
- People get attached to projects before viability is confirmed
- Resource constraints can artificially limit thinking about solutions
- Team members may feel personally rejected if project gets cancelled
- Keeping "who" last maintains flexibility and objectivity

This approach helps ensure:

- Solutions are driven by business needs not current capabilities
- Discussions stay objective longer
- Team can think more creatively about solutions
- Resource discussions happen after project viability is confirmed

### Define success: Setting effective goals

The goal is to maximize the impact of the team.

Small companies and insulated teams can do bottom up goal settings, but as companies get larger, it's hard to have sufficient insight into the company priorities, and hard to align goals across teams, which lessens the impact.

Larger teams require a top down business strategy intersected with a bottom up execution recommendation.

Ideally Engineering Excellence (EE) is built as part of a feature as it is in part of the feature costs. NOTE: It's OK to defer some of the engineering tasks till after shipping but it's not OK to say a project is complete till the engineering excellence costs are paid.

Systems rot over time, so EE should have a standing budget, usually 10%-20% of team capacity. The team should be empowered to spend this budget as required.

For major projects, a large EE project is required (like a technology migration). This should be outside the standing 10-20% EE allocation. Such projects should be agreed to by the business and have explicit goals.

Technical Debt is often a bad thing, but like debt it is a good thing if there is a good chance a project will be abandoned and you won't need to pay the interest. Examples here are speculative projects which may be rolled back, and bridges to a future technology.

### Build the roadmap: Planning and sequencing

6 step process

1. Define Tracks
1. Find "boulders" in each track
1. Break boulders into projects, cost and analyze and order by ROI
1. Determine cut lines
1. Resource allocate
1. Execute (It's 1% inspiration and 99% perception)

The only time when the 5 step process should occur simultaneously across all tracks is when a team is forming, or taking a major pivot. At all other times this series of steps should be occurring continuously and asynchronously.

The full process is expensive and the team should be shielded from some of it but here's some engagement that should happen:

- **Product Manager** - Fully engaged in every step.
- **Data Science** - Impact analysis and sizing
- **Projects and costing** - Senior and Staff engineers, because they have higher accuracy and this ensures their buy in.
- **Interested Parties** - The process should be transparent, and anyone wants to, including junior engineers, are welcome to see how the process works. However, given they aren't required for the process, this shouldn't come at the expense of their day jobs

[TODO Picture]

### Create the schedule: Timeline and milestones

NOTE: Even though plans tend to be reviewed at a half year cadence, it's important that the dates below are relative for the health of the team.

Great schedules and roadmaps can solve many problems, based on people's levels and the time granularity.

- Team feels inspired knowing they're doing great things, and senior folks see career opportunities
  - By having a roadmap that stretches out at very course low precision/accuracy projects for +6-12 months
- Intermediate folks feels career opportunities by seeing opportunities that interest them.
  - By having a roadmap with lightly scoped projects for +2-6 months
- Team feels comfortable re-jiggering ordering and ownership by knowing hard vs soft deadlines
  - By having a roadmap with clear deliverables and dependencies for 0-3 months
- Junior folks (and senior) build their estimation muscles and has a sense of their own personal velocity by creating and reviewing granular estimates
  - (The more senior folks help junior folks do this, and also build their coarse estimation muscles)
  - By having granular estimates down to he 1-2 weeks, and having someone help create and review the estimates

### Allocate resources: Matching people and projects

Resource allocation is maximizing the intersection in the Venn diagram - "Personal Preference", "Business Need" and "Probability of Success" for the business, team and individuals.

<!--
{%include mpl_render_float_right.html name="what-to-work-on" %}
-->

{%include blob_image_float_right.html src="blog/who-works-on-what.svg" %}

The success metric for a manager is supporting the team so that they know the constraints, and can self organize to maximize the business, team and individual Venn diagram coverage.

This process gets harder then it sounds based on the state and ambiguity of the tracks, balancing juniors and seniors, career development desires, and future hires and business ambiguity and reorgs.

There are some more concepts I need to flesh out:

**Personal growth and career development** People should strive for projects that stretch them and make them grow. This is always a business priority (to make the team better), and usually a personal preference. There are times when people have other things going on, and don't want to grow, and that must be honored at a high priority.

**Opportunity cost** - If a senior developer is doing something a junior developer is doing, then you have turned your senior developer into a junior developer and no-one is doing the work of a senior developer. This is also why teams need a blend of junior, intermediate and senior developers.

**Right sizing projects, and support** When people are growing, stuff is going to be hard, and it's important they don't take on more then they can chew (see ability to succeed), even when the project is the right size, it's important the person has the dynamic support and mentorship they need.

**Keeping slack in the system** Anxiety is the difference between reality and expectations. Slack is the tool that helps us better model reality, and keep stress under control.

### Understand roles: The road building analogy

Imagine we want to build a new road.

1. Start of time: PM figures out there's a market for a road, and the needs of the customer, and comes up with a rough idea of where the road needs to be between.
1. Slightly After: EM starts surveying broadly, and discovers can't go some places because there's a giant mountain, or somewhere else as other folks have tried digging there, but fell through, and that someone has started making a path from the other side, so if we meet at the middle it'll be cheaper.
1. After: Senior Engineers come in and start figuring out where they'll build, what's the safest path, and what's a realistic schedule
1. After: Intermediate dev's are assigned a chunk of the road and start building it.
1. After: Junior devs are given very clear tasks, and start doing them.

### Prioritize work: Making tough trade-offs

A great mantra for life, individual contributors, and especially folks supporting more junior folks. A great article that deep dives into the topic [here](https://alexturek.com/2022-03-07-How-to-do-less/).

### Estimate effort: Using SWAG and T-shirt sizing

- **T-Shirt size** - This is a word for creating coarse cost estimates that use sizes (S, M, L, XL) to correspond with cost. T-Shirt sizes don't have a standardized map to time units so I recommend using actual time units. To avoid "false precision", limit yourself to a small set of coarse time units e.g. (1 quarter, 2 quarter, 4 quarter, 4+ quarter).

- **SWAG (Scientific Wild Ass Guess)** - This is another word for cost estimation. In this context, it's synonymous with T-Shirt size.

When asked to provide a SWAG, the main goal is to stack rank projects. This is done by computing the return on investment (ROI), where the Return is based on DS Impact Sizing, and the Investment is based on the Engineering cost.

For half-level planning, we'll estimate the cost in a coarse manner (in engineering quarters) to understand two things:

1. If we have enough capacity, which is calculated by multiplying the number of engineers by the number of quarters.
2. The fastest possible shipment time, calculated by the critical path assuming all engineers are available from the start.

For example:

Suppose it takes 1 quarter for backend, 1 for Android, and 3 for iOS, but the tasks need to be completed n series (one after another). This would have a t-shirt size of 5 engineering quarters (a swag of 4+). With the critical path, or the longest sequence of tasks, being 3 quarters.

### Be wary the planning trap

- _xref: [Begin with the end in mind](/7h-c2)_
- _Copied from this [tweet](https://x.com/Devon_Eriksen_/status/1910314718998192537)\_

This is a valuable lesson for our own lives. If there's something you want to do, something you want to try, some goal you have, it's easy to dip a toe in the water, test the temperature, and plan. A lot.

Planning makes us feel good if we're afraid. Because it provides us with the illusion of security. Never mind that we don't know which scenarios are actually going to happen, never mind that we're planning for the wrong thing, planning makes us feel safe. And if we're nervous, we can plan forever.

But the difference between the expert and the novice isn't theory or intelligence or plans. It's relevant domain knowledge. Gathered from empirical observation and experience.

So the trick is to get into that feedback loop as soon as possible, and run it as fast as possible. Give yourself the most possible opportunities to learn, per unit time.

We only learn while we are moving.

## Hiring

### What are you looking for when you recruit

Most companies have their "competencies" they test for. But I abstract it down to:

- Smart (Can code, understands, sees critical paths)
  - Teach me something you deeply understand
  - Walk through X, and Y, how do you, explain the tradeoffs.
- Get things done (wants to ship, owns it):
  - What matters to you?
  - Tell me something hard you did?
  - Tell me your favorite parts?
- EQ: (Not an asshole, Continuous Learning, Sees impact off his action, self aware, Team First )
  - Tell me a time you got in a fight
  - Tell me the hardest feedback you received
  - Tell me the hardest feedback you gave

### Do they prefer to hire only experienced folks

I need a pipeline of developers for mentorship, fan out, and succession planning.

Need a Principal per 30 people.

Ratio Senior: SDE-II: SDE-I (1,2,2) => ten person team: 2, 4, 4.

- Everyone grows by learning and teaching.
- A crappy job for an SDE Level-X is a growth opportunity for SDE Level-(X-1).
- SDE-IIIs want to think hard and lead.
- SDE-IIs do the bulk of the work, and are fully independent.
- SDE-I bring energy and excitement, but still dependent.

(Bad analogy) A team is like a "conveyor belt", people continually improve and mature and want larger scope, requiring a constant flow of incoming college hires.

### Are they more comfortable with generalists or specialists

Generalists - 99% of time

1. Industry changes too much.
2. Mostly about Architecture/Design and SDL and coding, domain and language are easy to learn.

Specialist - 1% on very specific teams.

1. File system
2. Distributed system transaction processing
3. Firmware engineers

Want full stack teams:

- FE -> Learn the customer empathy through user interactions
- BE -> Learn the tech chops of complex system.

### How do you think about hiring

My priority list:

1. A full blown site outage where the product is hard down and I'm actively getting it back online.
2. Recruiting
3. Everything else

Recruiting is ultimately product sales, where you're selling the team you support. Sales breaks down into the following:

1. Meeting the candidate's needs: Great salespeople don't sell their product, they understand and solve their customer's needs.
   Start by understanding what the candidate values and needs. If that's on your team, fantastic, if not help them find the team that's right for them.
2. Your solution: The product you're building, the culture and people on the team, and yourself.
3. The Funnel: Inbound Marketing, Referrals, high touch, post sales support (see next question)

### How do you think about the hiring funnel

- Before even thinking of funnels
  - Strive to be a class act and do your best.
  - It's a small world. [People will learn what you value, and how you work](/static/idvorkin-linked-in-feedback-lastest.pdf)
  - Create [public artifacts](https://bitly.com/igor-wlb-manifesto)
- Top of Funnel
  - Interview events
  - Internal Talks
  - LinkedIn Posts
  - LinkedIn Appreciation
  - LinkedIn Articles
  - Always help recruiting
  - Connect to warm candidates
  - Go grab coffee with them
  - Mentorship of folks, volunteer for mentorship
  - Intern Talk
- Mid Funnel
  - Post interview - magic trick, after interview lets make time to chat
  - Push to get interviews done ASAP
  - Push to get results to candidate ASAP
  - Walk out of interview connect on LinkedIn and chat with them
- Bottom of the Funnel
  - Focus on the needs of the candidate, then talk about how job can solve their needs
  - Beer/Coffee/Call
  - Share artifacts, and evidence of my team's operations
  - Invite them to talk with the team I support
  - Invite them to have lunch with the team
  - Help them build and evaluate their [dream job, and job switching decision making matrix](/job).

### What about structured vs free form interview loops

- External Structured

  - Leadership skills - most important
  - Self aware - a [critical part of being a leader](/what-makes-a-leader)
  - Design
  - Coding

- Internal, Structured but Different

  - Review internal code/design/documentation artifacts. Ask candidate for artifacts they're proud of.
  - Go on a whiteboard to have them explain one of their systems, or help you on yours. No need for the candidate to practice, this is just them doing their day job.
  - Talk about hard situations they've had. Listen for the criteria smart/gets things done/emotionally intelligent

### What are better kinds of interviews

I've heard the tech interview model described as the second worst kind of assessment strategy, it's only better than everything else we know.

That might be true, but I've also seen some novel ideas for interviews (Indeed uses these), and I'd be interested to try using them:

- Do a code review
- Do a mock interview + debrief
- Review their public work (like Github)

### What do you do when someone says they are quitting

I always start with "Happy for you, sad for us".
My goal is to find the right role for an employee, not to have them on the team.
Ask if you want me to talk you out of it or to reinforce your choice.
Help you think through decisions.
TODO: Add story of Neha
Teams should be like rivers, not lakes. Rivers are fresh and move, lakes are stagnant which is bad.

<!--
- ### Best hire of your career
-->

### What is a tribe?

Rarely you'll find a group of folks that follows each other even as they change organizations and companies. Usually a senior person will show up in a new place, and before you know it much of the organization will have joined her. I'll call this a tribe. If you find a tribe you gel with, I strongly recommend following the tribe.

Tribes are awesome because

How to form a tribe: - TBD

What to do if a tribe appears around you: - Decide if you are aligned with the head of the tribe, if you're not, you probably want to go.

How to join a tribe: - TBD

## Performance Management

### Performance Reviews: Calibrations PSC, OLR, Connections

[Performance reviews](https://imwrightshardcode.com/2021/06/discussing-rewards-for-people/) exist at most companies (I've been through Connects at MSFT, OLR at AMZN and PSC at FB), and for good reason they:

- Ensure performance is evaluated consistently and
- Force feedback
- Distribute compensation in accordance to impact
- Validate growth plans and find opportunities across the organization
- Assess bottom performers and ensure action is taken

### Translating Performance Ratings Between Companies

Different companies use different rating systems/labels, making it challenging to compare ratings across organizations. However, the goal of these systems is to provided differentiated compensation based on performance, and the easiest way to do that is to group engineers into 3-7 buckets, with each bucket getting a different amount of compensation. So to compare, compare the % of target compensation received.

Here's a likely wrong/outdated example (made up by GPT, please provide me updates if you know them) of those companies and buckets:

| Company   | Top Rating      | Above Average    | Meeting Expectations | Somewhat Below     | Very Concerning          |
| --------- | --------------- | ---------------- | -------------------- | ------------------ | ------------------------ |
| Meta      | Greatly Exceeds | Exceeds-         | Meets All            | Meets Most         | Meets Some/Does Not Meet |
| Amazon    | Top Tier        | HV-2             | HV-3                 | HV-3/LV-1          | LV-2                     |
| Microsoft | Exceeded        | Achieved         | Partially Achieved   | Not Achieved       | -                        |
| Google    | Superb          | Strongly Exceeds | Exceeds              | Consistently Meets | Partially Meets          |
| Apple     | Outstanding     | Excellent        | Very Good            | Good               | Needs Improvement        |

- Define meeting expectation label as 100% compensation
- The Top ratings label (Greatly Exceeds, Top Tier, etc.) is typically significantly more, often in the 150-200% compensation
- Above and below are usually somewhere in the 125%-75% of target.
- Very concerning ratings typically result in no increase and often trigger performance improvement plans
- There is usually a "super top rating", limited to 3-5% of the company

Remember that ratings are relative to level and expectations, so a "Meets All" for a senior engineer might represent higher absolute performance than an "Exceeds" for a junior engineer.

Also good to refresh yourself on total compensation vs salary. It's important to understand how total compensation works:

{% include summarize-page.html src="/comp" %}

### Best Practices For Performance Reviews

- Before Calibrations:

  - Continue seeking feedback for team members, and anonymizing and providing feedback
  - Continue explaining how tracking is occurring
  - Do mid-point checkins and peer manager review for hard situations (e.g. bottom performers and pending promotions)
  - Consistent presentation template - this makes it easy for everyone to assess the presentation of people
  - Remind engineers you might find new data late, and what you do that could change their assessment

- At the start of every calibration session. Reminder that:

  - Confidentiality is critical - Amazon says breaking confidentiality is a firing offense, which is great.
  - Reminder of the importance of catching unconscious bias.
  - Point is to calibrate the assessment process so it's fair.
  - Include senior engineers - this helps the engineers trust the process is fair, and provides critical input.

- After Calibrations:
  - No surprises to the engineers, they should already be aware of their rating as it's been provided consistently.
  - Provide as much feedback to engineers after the process, owning the message.
  - Focus on growth plans (see above sections)

Your role when representing people:

- Gather data on what happened through the evaluation period. Gather more data on things that surprise you (like peer feedback, or accomplishments you wer enot aware of)
- Present it as well as possible
- Ensure the presentation is evaluated fairly by seeking feedback and focusing on fairness.
- Calibrate yourself to ensure

a post on preparing for calibrations

### The pain and the suffering of performance reviews

_I'm calling Performance reviews PSCs below, translate to your own company's process_

For managers, PSCs are the super bowl, tight timelines, high stress, and high stakes. This leads to pain and suffering. First, a quick note on pain and suffering. Pain is a signal telling you need to act/pay attention. Suffering is the story you tell yourself, with such unhelpful attributes like practicing failure in advance and judging yourself from the past.

The pains of the PSC - _Pain is a good thing, it tells you to pay attention, and act_

- Take a lot of time to write
- Have very high consequences for the individuals involved
- One slip can cause big issues

The things I suffer about during PSCs - _Suffering is unhelpful, try to avoid it_

- Someone gets a bad outcome because I :

  - didn't give them the right opportunity or sufficient feedback
  - missed something critical during the year that I should have caught
  - wrote the packet poorly, or presented the packet poorly (or both)
  - found new information while presenting the packet
  - procrastinated and didn't get everything done

- As a result I am:
  - screwing over the people who trust me most
  - bad manager
  - getting a well deserved bad review

How to reduce pain and suffering. _Have no confusion, I rarely do these, but I wish I did_

- Treat your own packet, just like those of your employees.
  - Yes, that means you're writing your own review.
  - Leave place holders that you'll fill in when you get data from what the folks you support did.
  - It helps your boss know what you did, present it easier, and see expectations miss matches (likely needing more data from you).
  - All the rules below also apply.
- Update packets through the year. No wordsmithing.
  - At least quarterly, monthly is better.
  - Otherwise you won't remember.
  - Quickly course correct.
  - Include feedback you're getting.
  - Bonus point for including what you plan to do.
- Block your calendar at work, and tell your family you're working nights and weekends
  - Set expectation this will take 110% of your energy.
  - Ensure your family knows and can support you.
  - Remove all other stressors from your life at this time.
- Prioritize packets by difficulty and impact
  - Don't spend much time on mid-band no debate packets.
  - Spend a lot of time on borderline packets.
  - Spend a lot of time on promo packets, especially at the higher levels.
  - Spend lots of time when there are misses.
- Only think about a person's packet and calibrations when writing their packet.
  - You can lose so much energy by ruminating on the suffering above.
  - It's super hard, but if you catch yourself, tell yourself if I want to think about packets, I need to have my editor open and looking at a packet. Otherwise I need to think about something else.
- Only work on one packet at a time
  - Need to have a sense of progress/completion.
  - No switching mid section/person.
  - Only work on one section at a time.
  - You are allowed to copy good sections from other packets.
- Do 3 versions of a packet
  - Need to have a sense of progress/completion.
  - Spinning on wording early is pointless. And it's stressful.
  - Wordsmithing something you won't keep is just procrastination.
  - First version gather all the evidence, relevant ideas, ask folks you support for more evidence here.
  - Second version: put it into rough sentences; go over it with another manager.
  - Third version: make this one good. It's near final. Get a final review with other managers.
- Make a very granular schedule, including when you're talking to people
  - I schedule 3 blocks a day, including who's packet, what section and what draft.
  - I schedule time to get feedback from the people you support.
  - I schedule time to get feedback from other providers.
  - I schedule time to review with tech leads.
  - I schedule time to do mock calibrations.
- Get support from other EMs
  - Everyone can see our situations better then we can.
  - It helps make us objective
  - It gets us over some things we're stuck on by drawing out our reasoning and correcting our faultly logic.
  - It'll remind you of your responsibilities and the employee's contibutions to situations

### Some definitions for low performers

You'll often find the following words used in these discussions.

- Performance Management - the general process of ensuring the team is high performing. Usually refers to having no low performers on the team.
- Managing out - Going through the PIP process with an employee.
- Up or Out - The term indicating the employee either improves, or will be managed out.
- URA - UnRegretted Attrition. A person who is no longer at the company, and that's not regrettable
- PIP - Process improvement plan. The formal final process of performance management. Performance expectations are clearly documented for employee and manager, and if the employee does not improve, they will be terminated.

### Performance Management for low performers

TL;DR: Performance Management is a good thing. There is a natural percent of people who are URA, and left to their own discretion many managers will not let go the full set of these people. At a large scale (100's of employees), and for periods of time (like during times of massive hiring), setting a URA ratio is a good thing. The key is enforcing it at a large scale, and having guard rails to make it objectively fair, and giving employees the ability to improve.

_And now the long version for non-managers_

If you've ever worked with a low performer who couldn't do their job, it's draining. They drag down the team due to missing commitments, and needing to be bailed out as unexpected work from the team. It's even a drag on the low performer as doing poorly in your job is a miserable experience, and they'll feel way better off in a place they are successful.

All of this is to say managing out lower performers is a good thing.

And so the question becomes who should be managed out? Given career expectations it should be clear when someone is not meeting expectations, and thus who managers should manage out and when. It also turns out at large numbers statistics can help.

At the scale of 100's of employees there will be low performers unable to do their job. The exact value varies depending on how aggressive companies hire and deal with low performers, but I'd guess 1%-5%.

For a while, Amazon was getting terrible press, so they got rid of URA ratios. You know what happened? Way less than 1% of people were fired, meaning the manager's good judgment wasn't working well enough.

As a result Amazon re-instated its URA ratios.

### The types of URA

I've observed two categories of URA, those with a skill gap, and those with consistency gap.

Skill Gaps are usually the result of a mismatch hire, an over leveled hire, or a premature promotion (the reason promos should be lagging not leading). Skill gaps often manifest as a lack of a core competency, lack of communication skill, lack of collaboration skill, or a quality gap.

These problems usually show up quickly, and can be assessed looking at artifacts objectively, and are the easier performance management case. You explain expectations, provide coaching/mentoring/opportunity and if improvement is not seen the PIP will be very straight forward.

Consistency is the harder PIP for a few reasons. First, the employee will have periods of acceptable performance, sometimes above expectations, and then they'll have misses, so the PIP needs to capture a time period when there is a performance gap. Simultaneously, it can be difficult to root cause inconsistencies, is it really an employment consistency issue, or is it a structural/situational issue.

### URA doesn't mean the person sucks - it means they are not compatible.

Being URA feels terrible, and likely elicits some shame. I know it's hard to believe, but it should not. At the end of the day, a URA just means you and the company were not compatible. I'm certain just because it didn't work out at your current company, the URA will be very successful elsewhere, and where ever that is, they'll probably feel a lot better for it.

### What if a URA isn't "fair"?

I've seen a few variants:

1. The person wasn't assessed fairly - pissed someone off, got unfair bad feedback.
2. The person got contextually/structurally unlucky - cancelled projects, multi-reorgs.
3. Distribution driven URA, a non-organic bottom of the stack.

It's not comforting, but that's the way of large numbers. If you take a big enough sample, there will be a long tail that's unfair, on both sides of the fence - e.g. some people get unfair rewards, and others unfair punishments.

This applies to work, and to life. You could buy a lemon of a car, get brain cancer. It sucks, but that's the way of large numbers. Same in the other direction for winning the lottery and having bought NVIDIA in 2022.

### The who and how of performance management

Three "Players" in this situation:

- The struggling employee

  - Remember being in the wrong role SUCKS. Employee is going home after long day, and feeling like shit (rinse and repeat)
  - Once in right role - will feel great. Seen lots of times this happens.

  - Let employee 'self discover' gaps and judge, but you must set down the truth.
  - Should not be a surprise. Should have already gone through role guidelines and gaps.
  - Clear set of gaps, and expectation for required improvement.
  - Progressively lay out process, so they know where they're at and what happens next.
  - Help them know it's the wrong role, but they have lots of strengths (look we hired you), and you'll be well loved elsewhere.
  - Help them with how to find change, mock interview, job changing guidance

- The team
  - Weak performer means others on team have to cover both in mentoring, and picking up dropped ball.
  - Sets a bad example for the team
  - Team knows the weak, and dislikes it.
  - Need to mitigate impact of weak employee.
- The manager.
  - Emotionally draining. But you own giving them an opportunity not their success.
  - When they're in the wrong role, best thing that can happen is getting them to a place where they are successful.
  - Can be time and energy intensive, robs the team and good employees of your energy.
  - Ensure criteria for demonstrating employees recovery is sufficient. Get pre-agreement on criteria with your organizational leaders.
  - Remember, all employees getting into this process will improve because they are being chased. Ensure their improvement isn't temporary

Most companies have a well laid out process, that you follow.

First there's a "zone of concern", when the manager focuses carefully on the employee, without scaring the employee with the seriousness of the situation:

- Set employee up for max success
- Ensure clear expectations
- Get mentorship
- Explain to employee you believe in them.

Then there's an official pre-PIP. Which is the same as above, but really clear with employee.

- Document everything, and share with the employee so there is no miscommunication
- Ensure clear criteria for PIP removal.
- Ensure org agrees removal criteria is sufficient
- Meet weekly for formal review.

Then there's a formal PIP. Depends on your company but very similar to above, but with clear legal terminology.

### How do you coach employee back to success

- Really depends on the employee
- Generally:
  - Re-enforce the person is good.
  - Remind person the team is there to help them
  - Clarify expectations
  - Provide a short term lowering of expectations
  - Consider LOA or accommodations as appropriate

### How do handle poor communication, ESL, ineffective communication in some modalities

Poor communication is often quoted as a performance gap, but requires a deep dive. Is the issue frustrating employees/being a jerk, having a thick accent, having good written but poor spoken communication.

Being a jerk is not a communication gap, it's a toxic behavior that needs to be addressed immediately.

The other communication issues need to be examined carefully. The question is not do they have a clear accent, or do they engage vocally in meetings, the question is can the employee influence to the expectations for their level. If they can great! If not, there are many alternative communication methods/coaching to improve.

Some tools I've seen used:

Examples for employees who don't like being vocal in a meeting can be to provide feedback before/after the meeting.

For folks who can get flustered representing their work in standups, pre-write their updates and read them during the meeting.

## Cross Org Influence

- Through process build relationships and earn trust
- "Start with why" and seek first to understand,
  - As many touch points as possible EM/PM/TLS
  - Maintain EM/EM ad-hoc channel for risks and concerns
  - Periodic meetings with key players, tell them you want to listen
- Next up "What" - Win/Win or No deal, Getting to Yes
  - Balance short and long term goals
  - Find growth opportunities for folks executing from both teams
  - Agree on shared goals
    -Common Currency
- Agree on Shared Goals
- Exec Buy-In on Shared Goals
- How, When, and Who (in that order) - Approach, Dates, People allocation
- All plans change when you're punched in the face
  - Execution Tracking
  - Flex funding cross org

### How do you think about escalations?

I think they'd be a lot less stressful/dramatic if they were called by the more appropriate term — priority alignment!

Escalations aren't about someone being wrong—they're about two teams or individuals pursuing locally correct goals that happen to conflict. In those moments, there isn't a clear "right" answer at the current level. The solution is to align on which priority matters more, and that often requires bringing in the next level of leadership to make the call.

Priority alignment is not a failure—it's a sign of healthy systems working. The alternatives: stalemates, resentment, unresolved tension, flip flopping, those are the failures.

Here's what healthy priority alignment looks like:

Understand both perspectives clearly. What is each side trying to achieve? What goals are in tension?

Lay out the trade-offs explicitly. How does each proposed solution affect each goal?

Don't escalate the problem—escalate the decision. Come with options and context. Recommend a path forward,

Pro tip: I always remind folks—if the priorities were obvious, they wouldn't be having this conversation.

## Team Insecurity

- Very common situation
- Team feels nothing they/EM can do about - but that's completely wrong!

### How do you nudge engineers who won't ask you for help?

Too many engineers make the same mistake: working in silos instead of teaming up with their manager. Going dark on an enormously important, languishing problem is the worst thing you can do. Managers exist to pair with their team on the hardest challenges, bringing the resources and experience of the entire group. Engineers have the time and context to go deep, while managers can contribute breadth and unblock progress. Often folks hesitate out of fear that struggling will be noticed, but your peers and manager are usually already aware because the issue impacts others. Collaborating openly with your manager resolves problems faster and more effectively. If you're a manager, insist on that partnership.

### Everyone wants to feel supported

Happiness is a choice!

Every day I walk past a beggar. He only has 1 leg, and like 6 teeth, but he's always smiling. Whether it's wet or dry, snow or sun, always a toothless smile. One day I asked him "Hey man, I gotta ask, why are you always so positive?" And he answered:

"Look, every day I have a choice, I can be happy or miserable - why would I choose miserable?"

As a team, we want to support each other, so let be help each other by reminding each other of these things and the importance of choosing happiness.

### Maintain perspective

- When there's mental pain, our time bound shrinks, as does everything else
- Share all the good stuff and big pictures.
- Extra focus on appreciation.
- Increase time ranges.
- Be patient.

## Charters, Re-orgs and Bootstrapping

Reorgs have two dimensions, staffing and charter, both of these need to be addressed and communicated.

There are several types of reorgs. Here are some of the ones I've executed:

### The genesis: When you start from scratch

Building a team from a greenfield of 0 has two aspects: hiring from 0 to staffed and building out a new charter and vision.

In an ideal world, you'd execute the following hiring plan:

- Start with a high level view of the business
- Put in places the senior developers to build out the architecture and process
- Start working by getting your SDE-IIs and SDE-Is

In the real world, you'll most likely:

- Have a vague idea
- Add people as you find them (hard stop when too many juniors - see below)
- Pick some easy wins, and get those started, ready to pick up debt to see what we can do.

Note: It's usually easy to hire junior people, and when there's pressure to start, you'll be tempted to just keep adding junior folks. However, there's a world of hurt here. If you're planning on starting with too many junior folks (or getting pressured to) borrow more experienced folks from other teams. Ideally borrow them full time for a few quarters, but at least borrow them for brainstorming, design, architecture and mentorship.

Hopefully, early in your hiring process, you've been thinking about your charter. Charters and such are hard. Here's the strategy I tackle:

- Come up with a north star vision.
- Start your first experiments in tech and market.
- Find the first wins to be able to inspire the team, excite the investors, and really partners.
- Build out an early roadmap and products.
- Keep learning and improving as people join.

### The split: When a team outgrows a manager

_I need to add content here about the mechanics and process of splitting teams, but here's some theory:_

**Theory: Team splitting happens for several reasons:**

- **Span of control**: A manager can effectively support 6-8 people. Beyond that, individual attention and coaching quality degrades.
- **Cognitive load**: Managers need to understand the technical and business complexity their team handles. Too much scope creates blind spots.
- **Career growth**: Senior engineers need ownership opportunities that come with smaller, more focused teams.

**Types of splits:**

There are two fundamental ways to split teams when you have multiple products/features and multiple technical domains:

#### Horizontal vs Vertical Splitting

When you have multiple teams, and multiple user scenarios you decide to organize horizontally (each team owns tech solutions, spanning multiple user scenarios), or vertically (each team owns user scenarios, spanning tech solutions).

This is hard, a few thoughts I've gathered:

Deciding if you split horizontally vs vertically is at the highest level asking what you want care more about:

- customer metrics vs engineering metrics and efficiency.
- what's best for the customer vs what's best for the platform.

Depending on how much tech needs to be build and how much specialization is required you will need horizontal teams. For example, the operating system, the networking stack, the hardware are all horizontals.

**Horizontal Split (by technical domain):**

- Team A: Backend services across all products
- Team B: Frontend across all products
- Team C: Mobile across all products

**Vertical Split (by product/customer journey):**

- Team A: User onboarding (full stack)
- Team B: Core product experience (full stack)
- Team C: Admin and billing (full stack)

TODO: Table of pros and cons

### The merge: When a manager leaves

### The flip: When charter changes

There are two categories of flips: A) Flip to new domain (genesis) or B) Flip to take over another teams space. Genesis is mostly covered above, so here we'll focus on taking over another teams, or another teams partial charter.

In general when this happens there are a few common reactions

**The new charter is too small**

A common reason for this is the old team that had the charter, likely only planned out for 120% of there engineers. So, if they had 2 engineers available, they planned for 3 engineers of work. A new incoming team having 10 people, will think there's only work for 3 people, and be sad.

**The new charter is much simpler then expected**
**The new charter isn't as interesting**

It's common to oversimplify from a distance. Once the team gets into the details, they'll either see it's true, and they'll find new good stuff to do, or, far more likely they'll find much more nuance, subtlety and ambiguity in the new space.

**Playbook and antidotes**

This is pretty similar to the whole team getting a new job, and [the first 90 days applies](/90days):

- Early Win: Figure out the situation, and deliver a win.
- Trust: Relationships with team, and peers, and partners.
- Knowledge: Know critical parts of business, tech, org.

A great way to do this is set the team up to do spikes on the major work items, this will overcome the above concerns, building knowledge and motivating the early wins.

### The Double down vs Pivot: When there is insufficient progress

When progress is insufficient, there are two situations, both painful, with overlapping symptoms, and some shared requirements.

1. You believe the charter can still be successful, but needs more time due to execution gaps/insufficient progress/insufficient resources.
2. You no longer believe the space can be successful.

Both situations can be subjective. There will be disagreement, often passionate disagreement as so much of the teams identity can be invested in the product. An objective criteria will help.

**Symptoms:**

1. Progress towards goals is slower than expected.
2. Team is demotivated - the team knows the goals, and they know they aren't making progress.

**Communications:**

1. Surprises are bad - you need a plan, and to let your leadership and partners know what is going on, and time till you'll have a plan.
2. You need to let the team know what is going on, and that a plan of action is happening to make it right.

#### Space can be successful, just hasn't yet - hold the course

This is often a result of execution difficulties, or underestimating the difficulties of progress in a space. Action depends on the situation.

If there are sufficient resources, and there is high probability success is likely - this section is in roadmapping and execution.

If there are insufficient resources, or resources are blocked - consider the space can not be successful playbook.

#### Space can not be successful, or can't be successful in a reasonable time frame

This will be a painful situation. The team has invested significantly: emotionally and through their work and a drastic change is required. The team and the manager will have a desire for wishful thinking, but that must be avoided as additional investment is waste of resources, often the sunk cost fallacy.

In these situations, you need to "declare success", wrap up the work and move on.

In the best case, this decision will be made as part of the normal rhythm of business with sufficient lead time so a clear set of new projects to transition onto are found, and the team can wrap up their current work, and switch to the new work on their roadmap without any disruption except for feeling bad their previous work didn't work out as well as they had hoped.

In a common case, the decision will be sudden, often with an edict from leadership to take immediate action. In this case, the priorities are:

- Manage comms with the team - decide when to tell folks, see some of the re-org discussions
- Negotiate a transition period with leadership.
- Figure out an interim roadmap till longer term work can be found
- Figure out how to wrap up work, and ensure fair credit attributed to work in progress.
- This is a highly emotional situation support the team, and yourself.

#### How long should you keep a "To Be Pivotted" project

Finding a new charter is hard, it takes longer then you'd expect, and then once you "have it" it takes even more time to get it engineer ready. It's very tempting to let the "walking dead" project continue consuming resources as you are stalling to find new charter. This **is a mistake** you are wasting the business's resources, and the engineer's time. **Pick a pivot date, and hit that date even if there is no new charter** Use the date as leverage to influence the priority for your leadership and XFN partners. Also ensure you have a backup for the team, helping other teams, better engineering projects, hack-a-thon ideas, etc.

NOTES: - How to know if you're in a [dip](/dip) or a cul-de-sac for the project.

### Telling the team about reorg/recharter

Assume this will be very hard on the team. It's critical they hear it from you first. It shows respect, and lets you reduce the largest anxieties. This will be emotional for a lot of people, and the team will be deeply influenced by your emotions. While you should acknowledge the loss, and the potential uncertainty and upcoming bumpiness, you **must be positive about the future**.

To ensure everyone hears from you first I recommend the following:

The days before:

1. Write an FAQ for the questions you expect.
1. Practice your story the day before with people you trust, review and tune your FAQ

The day of:

1. Clear your day of all meetings.
1. Schedule team meeting at the end of the day.
1. Make a list of everyone on the team and when you'll be telling them:
   - Check your timing to make sure you can get everyone done, taking into consideration when people come in.
   - Write out what you think their top concerns will be, to ensure you focus on them
   - After every meeting take notes about their concerns, and good talking points for future meetings.
1. Meet folks ad-hoc first starting first thing in the morning to have enough time.
1. Plan to grab people ad-hoc, and give them as much time as they need. This ensures - You'll be on time to this high impact meeting. - You'll not be in a rush, you can give people as much time as they need. - You have time to take notes after the meetings and tune your message, and re-charge your positivity
1. When deciding the order, start with the folks that'll take it best.
   - This will let you have some "easier sessions" to tune your message
   - This will give you new talking points, and get new questions
1. When talking to people
   - Make sure you have high energy reserves, but keep your energy low and caring, talk slowly like this is the first time you've told anyone.
   - Warn people it's gonna be a big surprise
   - Remind people they matter and that's why you made sure they heard it from you first.
   - Let them know who you've told and who they can talk to.
   - Remind them it's essential not to talk to anyone else till the team meeting so everyone hears it from you.
   - If they are in shock, and don't know what to talk about, ask them if they'd like you to tell them about your experience, and common questions others have
   - Tell them they'll have lots more questions, you'll talk through them at the team meeting, and they'll have more questions in the coming days, and that you'll book time with them over the next few days.
   - Make a note of how they took it, and if you get more talking points
   - Tell the people that are more positive how they can help make it easier on the team, think about when they can jump in during the team meeting.
   - Use silence to let people digest and come up with questions
1. In the team meeting
   - Tell people you'll recap what you talked about, and give a more complete story
   - Hit all your FAQs, including the hard ones
   - Prompt the people that can add positive ideas (who you already asked) to share the positive parts
   - Be available after the meeting, and offer to talk to anyone
   - Remind people you don't have all the answers yet but you'll figure them out together.
   - Give people as much autonomy as possible, tell them they should tell you the best way to wrap up their projects.
1. In the next few days:
   - Be around a lot, offer to talk to anyone anytime.
   - Schedule meetings with everyone in case they have more questions. If they don't, you can leave early.

#### The FAQ

- How does this impact my review?
- How long till we stabilize?
- Why did this happen?
- Did we do something wrong
- What choices do we have? Can we follow the re-org
- What happens to my existing/ongoing project
- How is their existing work evidence of greatness
- Is it just gonna happen again in 6 months
- What are the exciting opportunities, and why are they better then the old ones
- Why is this re-org designed the way it, why would you have done the re-org this way.
- Will more people be hired
- Answer how to motivate them:
  - Autonomy - Let them recommend the transition plan.
  - Mastery - Remind them how good they are and how the team will succeed on the next project
  - Purpose - Remind them of the continuity of purpose and
  - [Motivation Deep Dive](#l-motivation)
- What am I working on next
- How long till we have more clarity
- Why is this a good thing (people, tech, purpose)
- How long have you known
- How long till you felt good about it
- Domain specific questions

### How to handle Layoffs

(Some of this is copied from [Ashish](https://www.linkedin.com/pulse/being-leadermanager-hard-during-layoffs-ashish-singh?trk=public_post_feed-article-content) )

Before:

- Be careful about telling people you don't know anything; at some point, you will, and you can and will be trapped in a lie. (I don't know the best thing to do here).
- Remind people if they can't control something, don't focus on it. Focus on what they can influence.
- Do not tell people they will not be laid off. Unless you know, don't.

Day Of:

Life suddenly seems to have slapped you hard and slowed down the day you find out your team is impacted. These are folks you have worked with in some cases for years; they came over to your team because they believed in you and your vision. The news makes you feel so small and helpless. While your heart is sinking and you are still trying to convince yourself that this is really happening, you are still expected to run the show, business as usual.

The folks you support still trust you and want you to help them navigate through the situation, get them the answers they are looking for, and you may not have any clue of what to do next.

- Get up early and get ready.
- This will be a very emotionally draining day.
- Excellent chance you won't know what's going on.
- Remind people it's a tough day and take care of themselves.
- Discourage people from speculating what and why.

Next days:

- Mental health experts recommend against group meetings. Keep everything 1:1.
- Reduced productivity for days.
- Possible re-org, with potential for lots of uncertainty.
- It's easy to "mourn" the people who were impacted. However, they are not dead.
- Ask impacted folks if they'd like to get together; it probably means a lot to them to get closure.

General

- If your team/other people aren't directly impacted, remind them it can be a very hard day for others, so be empathetic.
- There will be pain; people may say negative stuff from a place of deep emotions, and that's a function of pain.
- Some people need to make jokes to relieve pressure (I'm one of them). Remind them, and yourself, to be respectful of others at the same time.
- Everyone processes this differently; offer to meet folks and have 1:1s privately, some will want them, others will not, honor their wishes.

I try to send this just before if date is known, or after if it's more of a surprise.

I will never speak about the performance issues of others, so this is a completely context free message:

On %DATE% there will be fewer people in the office than today. You don't know who will be impacted by this directly or indirectly, so please make an effort to be sensitive. Even if you personally use humor to diffuse situations, others might find this very hurtful (and likely won't say anything), so please be cautious.

As always, supporting y'all is always my top priority, so if there's anything you want to talk about - reach out.

#### What's the best way to execute layoff announcements?

When Zuck did a particular round of layoffs, he set a date in 3 months, and said we'll do them on this day. A lot of people complained, and said this is an awful way to do it.

When asked about the mechanics, Zuck said: Yes, this really sucks, I think regardless of how we setup the layoffs up they will suck: my only hope is this setup will sucks less.

I think Reed Hastings (of Nextfix) has an interesting take here. [You want to give people good severance](https://www.instagram.com/reel/DD7Z1ptT_w0/) so they feel great leaving at any time they want instead of hanging around to get paid.

## Personal Motivations

I guess the whole post is personal, as these are my opinions. The questions below can't be "evaluated" as they deal with internal motivations, however they can be questioned to determine if these are really my motivations, and if I"m being consistent between my actions and motivations.

### Why do you find management attractive

Few things make me prouder then this [public feedback on LinkedIn](/static/idvorkin-linked-in-feedback-lastest.pdf) from people who worked with me over several years.

On my deathbed, the product I will be most proud of is the people who I watched blossom and grow. It's cliche, but when you love your people they know it, they thrive, and do their best work. It's not just about the work, I want to make sure people think of their lives as well, because, well, that's even more important.

I'm also energized by getting shit done. The thought of shipping, clearing roadblocks, and never being blocked puts a smile on my face.

Speaking of smiling, nothing brings me back up like reading this kind of feedback that I got when I left a team.

_Goodbye Igor! Thank you for helping me reach the next level both physically and mentally. I cherish the moments when we ground through challenges like peak days, when I was in trouble and you said "That's why I'm here, give it to me I'll make it happen", and of course, when you show your magic at happy hour! You are a great boss and great teacher._

Lastly, I love understanding what is going on, coming up with win/win solutions, and framing those solutions into a meaningful story that people rally behind and deliver. Some more words that bring me up.

_Igor - Your passion, energy, intellect, and sheer force of will -- so intense, so inspiring, so powerful we still feel it 3 years after you left the team._

<!--

- Skill, clarifying, building consensus, sharing the story and meaning.
- Leader Ownership, but not a good enough PM, and very strong tech
- Lead and inspire
- Servant leadership
- On top of best practices
-->

### What is your dream job

{%include summarize-page.html src="/job" %}

### What are your career aspirations

{%include summarize-page.html src="/being-a-great-manager" %}

### Why do you think you're a good coach

When I explained to someone coaching it the most important aspect of management, they asked why I thought I was a good coach. Took me a while to answer, but here you go:

- I believe you can't be efficient with people, you can only be effective. And it always pays off.
- People are not 'resources', they are 3 dimensional humans, with [lives outside work](https://bit.ly/igor-wlb-manifesto), emotions(like [pride](/pride)), and desires.
- I've read and digested slews of [self help books](/books) which while often mocked, are filled with great models.
- I actively study and practice [coaching](/coach) and effective [decision making](/decide)

### Why do you prefer being a manager to an IC

I think as a manager, the day-to-day sucks. People problems, managing by spreadsheet, fire fighting, policy violations, etc. But, those days when you look at the team, and see them helping each other, and growing, and when you catch people after a few years and they tell you how impactful you were to their career, and how working on the team was the most fun they ever had - it feels superb.

As an IC, it's almost backwards, the day-to-day is fun. Coding, design, debugging, even fire fighting an outage trying to get the site back up, it's very satisfying in the moment. But, as an IC, when you look at the software you built, and you realize it's long deprecated, and replaced by something better, it's a pretty meh feeling.

So, in a nutshell, for me those moments of intense satisfaction make it worth the loss of the day-to-day joy of being an engineer.

At each stage of road productions things go wrong and we learn new stuff. TODO Come up with more examples

An excellent articulation of the trade off is [here](https://jamie.ideasasylum.com/2024/06/21/the-manager-s-unbearable-lack-of-endorphins)

## Questions managers get

### What does a manager do in a day

See [the manager's schedule](#l-what-managers-schedule) section.

### What's the best/worst part of your job

See [what do managers do](#l-what-managers-do) section.

### How do you get anything done with all of those meetings

The majority of the things I do are about amplifying, de-risking, and unblocking people. Much of that works best when there's someone else in the room. Furthermore, many of those meetings, especially 1:1s and small groups energize me, making me able to tackle the rest of my work with gusto.

For tasks that require me to be heads down and [write/think](/write), I try to get that done crazy early in the morning when I have zero interruptions and maximum intellectual horsepower.

### What do you think developers do

### What can engineers do to make manager's jobs easier

**Realize you and the team are a domain expert**

Due to positional authority, manager's statements can be overweighted. However, managers by not being immersed in the problem know the least. Remind the team, and yourself, that the manager knows the least about the tech, and their words should not be overweighted.

**No surprises**

- If stuff goes wrong, share it ASAP, the manager would love to do the same
- Discuss what you want and need, and if you're getting it

**Give insight into places manager has no visibility**

- When people are upset/demoralized/angry, often ICs know before managers as people don't tell managers. Sharing this with a manager is great so they can take action.
- Give feedback, especially hard feedback.

**Maximize your impact, and the team's impact**

The evaluation criteria for a manager are the success of the team, maximize your impact (and that of the team), and that's the best way to help your manager.

### Why do managers always say coding is part of their job but we all know it isn't

I don't think managers should code with a minor exception ([More details](#l-code)). A related question might be:

Why do we assess manager's ability to code - no clue, but a few enlightened companies do not.

## Product Development and Product Management

My notes on [Product](/product), often the domain of the product manager, but EMs wear many hats

{%include summarize-page.html src="/product" %}

## Business Acumen and Strategy

My notes on [Strategy](/strategy), including the strategic positions of various companies:

{%include summarize-page.html src="/strategy" %}

## Appendix

{%include summarize-page.html src="/manager-book-appendix" %}
