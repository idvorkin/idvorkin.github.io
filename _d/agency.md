---
layout: post
title: "Agency trumps Intelligence"
permalink: /agency
tags:
  - how igor ticks
  - book-notes
---

Two engineers, same IQ, same tools. One ships weekly. One is "researching the best approach.", or "Waiting for someone to tell them what to do". In six months, the gap between them will be insurmountable. Why? Not intelligence—agency. And in the AI era, this gap is about to become exponential.

**Your agency is your value proposition.**

{% include ai-slop.html percent="95" %}

{% include alert.html content="**Clarification:** 'Intelligence' in the title is a bit of clickbait. This post is really about how **accumulated technical domain knowledge** (the kind that used to take years to build) is being commoditized by AI. General intelligence, problem-solving ability, and judgment remain critical—but deep technical expertise matters much less in the prototyping/early stages than it used to." style="info" %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The Paradox](#the-paradox)
- [The Old World: Technical Knowledge Was the Bottleneck](#the-old-world-technical-knowledge-was-the-bottleneck)
- [The New World: AI Handles Technical Execution](#the-new-world-ai-handles-technical-execution)
- [Intelligence Without Agency = Zero](#intelligence-without-agency--zero)
  - [Why the Smart Trap Is Worse With AI](#why-the-smart-trap-is-worse-with-ai)
  - [The Brutal Math](#the-brutal-math)
- [Agency as the New Multiplier](#agency-as-the-new-multiplier)
  - [The Agency Flywheel (AI-Powered)](#the-agency-flywheel-ai-powered)
- [The Technologist vs Entrepreneur Shift](#the-technologist-vs-entrepreneur-shift)
- [The "When Do You Need a Technologist?" Curve](#the-when-do-you-need-a-technologist-curve)
  - [What This Chart Shows](#what-this-chart-shows)
  - [Where Deep Technologists Become Critical](#where-deep-technologists-become-critical)
  - [The Strategic Implication](#the-strategic-implication)
- [Case Studies: Agency vs Intelligence with AI](#case-studies-agency-vs-intelligence-with-ai)
- [The New Intelligence Ceiling](#the-new-intelligence-ceiling)
- [Why This Changes Everything](#why-this-changes-everything)
- [Practical Recovery: Building Your Agency Muscle](#practical-recovery-building-your-agency-muscle)
- [For Junior Engineers and College Kids](#for-junior-engineers-and-college-kids)
- [The Call to Action](#the-call-to-action)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The Paradox

The smartest people often accomplish the least—and AI is about to make this gap exponential.

Think about your network. How many brilliant people do you know who are stuck in analysis paralysis? How many high-IQ colleagues spend months "researching the right approach" while others ship imperfect solutions and iterate?

The uncomfortable truth: in the AI era, your intelligence is increasingly commoditized. Your agency is your moat.

## The Old World: Technical Knowledge Was the Bottleneck

**The Computer Development Analogy:**

- **Planning phase:** Product manager defines "build a payment system"
- **Execution phase:** Required **deep technical domain knowledge** (database design, security, API contracts, error handling, testing)
- **Bottleneck:** You needed someone who spent years learning these technical details
- **Result:** Deep technical expertise = value

**Important clarification:** We're not talking about general intelligence or problem-solving ability. We're talking about the **accumulated technical domain knowledge** that used to take years to build.

To ship anything meaningful, you needed to understand:

- OAuth flows and security models
- Database normalization and indexing strategies
- Distributed systems and eventual consistency
- Performance profiling and optimization
- Deployment pipelines and infrastructure

This deep technical knowledge was the barrier to execution. You could have all the agency in the world, but if you didn't understand these systems, you weren't shipping anything production-ready.

**In this world:** Intelligence mattered enormously. The person who understood distributed systems, concurrency, security models—that person was invaluable.

## The New World: AI Handles Technical Execution

**Same analogy, AI era:**

- **Planning phase:** "Build a payment system"
- **AI execution:** Claude/GPT can scaffold the database, implement OAuth, write tests, handle edge cases
- **New bottleneck:** Knowing what to build and actually starting
- **Result:** Agency × AI capability = value

**The shift:** Technical knowledge became **queryable** instead of **required**.

You don't need to memorize OAuth flows—you need to **decide** to build the feature and **keep going** when the first attempt fails.

You still need:

- Baseline problem-solving ability
- Ability to break down problems
- Judgment about what to build
- Learning from feedback

You increasingly DON'T need:

- 5 years of backend engineering experience to build a backend
- Deep knowledge of OAuth to implement authentication
- Understanding of database internals to design a schema
- Expertise in React to ship a frontend

## The "When Do You Need a Technologist?" Curve

**The key shift:** It's not that technologists are obsolete—it's that the threshold for needing one has moved dramatically.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
  <div>
    <canvas id="chart-pre-ai"></canvas>
  </div>
  <div>
    <canvas id="chart-ai-era"></canvas>
  </div>
</div>

<script>
defer(() => {
  const stages = ['Idea', 'Prototype', 'MVP', '100 Users', '1K Users', '10K Users', '100K Users', 'Scale'];

  // Pre-AI data: Entrepreneur capability drops sharply, technologist need rises quickly
  const preAIData = {
    entrepreneurCapability: [60, 40, 20, 10, 5, 0, 0, 0],
    technologistNeed: [40, 60, 80, 90, 95, 100, 100, 100]
  };

  // AI Era data: Entrepreneur stays capable much longer, technologist needed later
  const aiEraData = {
    entrepreneurCapability: [90, 85, 75, 65, 50, 35, 20, 10],
    technologistNeed: [10, 15, 25, 35, 50, 65, 80, 90]
  };

  const createChart = (ctx, title, data, isPreAI) => {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: stages,
        datasets: [
          {
            label: 'Entrepreneur Can Handle',
            data: data.entrepreneurCapability,
            borderColor: 'rgba(75, 192, 192, 0.8)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Technologist Required',
            data: data.technologistNeed,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 14, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          subtitle: {
            display: true,
            text: isPreAI ? '❌ Hit the wall at MVP stage' : '✅ Capable through 1K+ users',
            font: { size: 11 },
            color: isPreAI ? '#e74c3c' : '#27ae60'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Capability (%)' }
          },
          x: {
            title: { display: true, text: 'Product Maturity →' }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  };

  const preAIChart = createChart('chart-pre-ai', 'Pre-AI World', preAIData, true);
  const aiEraChart = createChart('chart-ai-era', 'AI Era', aiEraData, false);

  console.log('chart-pre-ai', preAIChart);
  console.log('chart-ai-era', aiEraChart);
});
</script>

**The critical insight:**

**Pre-AI gap:** Entrepreneur could only go from Idea → basic Prototype alone. That's maybe weeks of work.

**Post-AI gap:** Entrepreneur can go from Idea → MVP → 1K users alone. That's months or even years of work, and more importantly, enough to **validate the idea**.

### Where Deep Technologists Become Critical

1. **Performance optimization at scale**
   - Pre-AI: Needed at 100 users
   - Post-AI: Needed at 10K+ users

2. **Complex system architecture**
   - Pre-AI: Needed for MVP
   - Post-AI: Needed when you're actually scaling

3. **Security hardening**
   - Pre-AI: Needed before shipping
   - Post-AI: Needed before significant scale

4. **Database optimization**
   - Pre-AI: Needed to handle any real data
   - Post-AI: Needed when queries slow down at scale

5. **Infrastructure/DevOps**
   - Pre-AI: Needed to deploy anything
   - Post-AI: Needed when uptime becomes critical

### The Strategic Implication

**Old world sequence:**

1. Have idea
2. Find/become technologist (years or $$$)
3. Build prototype
4. Learn it's wrong
5. Rebuild
6. Maybe validate

**Bottleneck:** Getting to step 3 was so expensive that most ideas died at step 2.

**New world sequence:**

1. Have idea
2. Build prototype with AI (days)
3. Learn it's wrong
4. Rebuild with AI (days)
5. Iterate 10x
6. Validate (or invalidate and move on)
7. When validated and scaling, bring in technologist

**The key unlock:** You can validate your idea BEFORE paying the technologist tax (in time or money).

**Real-world examples:**

**Pre-AI startup:**

- Months fundraising or learning to code
- Build MVP
- Launch to find out users want something different
- Need to rebuild from scratch or pivot (expensive)

**Post-AI startup:**

- Week prototyping with AI
- Launch rough version
- Get feedback
- Pivot 3x in the time it took pre-AI to build v1
- Find product-market fit
- THEN hire technologist to scale it properly

Cross-link to [Igor's Gap Year](/igor-gap-year): Self-directed energy can now produce production-quality work, not just learning projects. The gap between "practicing" and "producing" has collapsed.

## Intelligence Without Agency = Zero

**Important distinction:**

- **NOT saying:** General intelligence doesn't matter
- **IS saying:** Deep technical domain knowledge matters MUCH LESS in the **prototyping/early stage**

The most important clarification: we're talking about the shift from needing years of accumulated technical expertise to being able to execute with AI assistance.

### Why the Smart Trap Is Worse With AI

**Analysis paralysis on steroids:**

AI can generate 10 different approaches instantly. Smart people get stuck comparing them forever.

- **Low agency:** "Let me research which approach is theoretically optimal..."
- **High agency:** "Claude, implement approach #1. We'll learn if it's wrong."

**Perfectionism with infinite options:**

- **Old world:** Limited by your knowledge (built-in forcing function)
- **AI world:** No forcing function. You can always ask for "one more revision"
- Smart people use AI to polish turds instead of shipping

**The illusion of productivity:**

- Chatting with AI feels like work
- Generating code feels like progress
- But without agency to actually run it, integrate it, deploy it—it's just expensive procrastination

### The Brutal Math

Intelligence × 0 Agency = 0 Output

Even with AI as a multiplier: Intelligence × AI × 0 Agency = Still 0

## Agency as the New Multiplier

**Why agency compounds exponentially with AI:**

**Formula:** Impact = Agency² × AI × Intelligence

- Agency is squared because it determines: (1) how many attempts you make, AND (2) how fast you iterate based on feedback
- Intelligence and AI are linear multipliers
- But they multiply zero if agency is zero

### The Agency Flywheel (AI-Powered)

1. **Start** → Ship rough version with AI's help
2. **Learn** → Get real user feedback (not theoretical analysis)
3. **Iterate** → Use AI to implement fixes quickly
4. **Compound** → Each cycle takes less time (you + AI both learn)

**Without agency:** Stuck at step 0, debating with AI about the "right" architecture

**With agency:** 10 iterations deep while others are still planning

## The Technologist vs Entrepreneur Shift

**Two different operating modes:**

**The Technologist** (deep technical mastery):

- Optimizes performance and scalability
- Understands systems deeply
- Builds for scale and reliability
- Masters technical domain knowledge
- **Critical when:** You're at scale, production matters, users depend on uptime

**The Entrepreneur** (bias for action, learning through shipping):

- Ships to learn what to build
- Iterates based on real feedback
- Focuses on value before optimization
- Learns technical details as needed
- **Critical when:** You're prototyping, testing ideas, finding product-market fit

**The old world required this sequence:**

1. Spend years becoming a Technologist (learn deep technical knowledge)
2. Then you could execute Entrepreneur ideas

**The AI world enables this sequence:**

1. Start as Entrepreneur (ship with AI's technical help)
2. Bring in Technologist skills as you scale (or use AI for that too)

Cross-link to [My Dream Job](/my-perfect-job): The Autonomy, Mastery, Purpose framework still matters, but the PATH to mastery has changed. You can now achieve autonomy and purpose WHILE building mastery, instead of needing mastery first.

**Why this matters:**

- **Prototyping phase:** Agency + AI beats Deep Technical Knowledge alone
- **Scaling phase:** You need both (or a team that has both)
- **Most ideas die in prototyping:** So the bottleneck is shipping fast to learn, not building perfectly

**The new leverage point:** Use AI to operate in Entrepreneur mode longer, validate faster, and only dive deep on technical mastery where it actually matters.

## Case Studies: Agency vs Intelligence with AI

**High Agency, Medium Intelligence:**

- Uses ChatGPT to build side project in weekend
- Ships buggy version, gets users
- Iterates based on feedback
- 6 months later: profitable product, deep domain expertise

**High Intelligence, Low Agency:**

- Spends weeks prompting AI for "the optimal architecture"
- Generates hundreds of files, never integrates them
- Worried about edge cases that don't matter yet
- 6 months later: Nothing shipped, learned nothing

**Tie to existing content:**

- [Circle of Influence](/7h-c1): AI expands your circle of influence (you can now execute on more), but only if you focus there instead of circle of concern (perfect architecture)
- [Bias for Action](/amazon): Amazon's LP is now even MORE important because speed of iteration matters more than initial quality
- [Victim mentality](/mental-pain): "AI will replace me" vs "AI lets me execute on ideas I couldn't before"

## The New Intelligence Ceiling

**Where intelligence still matters:**

- **Judgment:** Deciding what's worth building (AI can't tell you this)
- **Integration:** Seeing how pieces fit together (AI is local, you're global)
- **Taste:** Knowing when "good enough" is actually good enough
- **Learning:** Extracting patterns from attempts (AI gives you feedback, you extract wisdom)

**But notice:** These are all in service of **agency**. Intelligence helps you make better decisions, but only when you're actively deciding and executing.

## Why This Changes Everything

**The old equation:**

- Technical knowledge was scarce → high value
- You could coast on being smart
- Learning was the hard part, doing was relatively easier once you knew how

**The new equation:**

- Technical knowledge is abundant (queryable via AI) → low value
- You can't coast on being smart anymore
- Doing is the hard part, learning happens through doing

**The existential question:**

If AI can handle the technical details, what's your actual value?

**Answer:** Your agency is your value proposition. Your ability to:

- Start without perfect information
- Persist through failures
- Ship despite uncertainty
- Learn from real-world feedback
- Iterate faster than others

## Practical Recovery: Building Your Agency Muscle

**Micro-habits for high-intelligence people recovering from analysis paralysis:**

1. **The 2-hour rule:** If you've been researching/planning for 2 hours, you must ship something (even if broken)
   - Use AI to ship faster, not to research more

2. **Bias for "good enough + action":**
   - AI can generate code instantly → your job is to run it, not perfect it
   - Ship first draft. Let reality teach you what needs improving

3. **Count attempts, not quality:**
   - How many times did you try something this week?
   - High agency: 20 failed experiments
   - Low agency: 1 perfect plan

4. **Circle of Influence audit:**
   - What can you execute on TODAY with AI's help?
   - Stop debating theoretical approaches, start testing real ones

5. **Recover from learned helplessness:**
   - "I don't know how to X" is no longer an excuse (AI knows)
   - New excuse-killer: "I haven't tried X yet"

Cross-link to [Be Proactive](/7h-c1): Focus your energy on your circle of influence, not your circle of concern. AI has radically expanded your circle of influence—are you using it?

Cross-link to [Regrets](/regrets): Stop dwelling on backward-looking regrets ("I should have learned to code years ago") and start using forward-looking regret avoidance ("What should I ship next?").

## For Junior Engineers and College Kids

{% include alert.html content="TODO: This section needs expansion with specific tactical advice for people just entering the field. Consider adding real-world examples, portfolio strategies, and how to position yourself in the AI-enhanced job market." style="warning" %}

**The paradox you're entering:**

- Your professors/bootcamp taught you: "Learn deeply, then build"
- The market is increasingly rewarding: "Build to learn"

**The old playbook (2010-2020):**

1. Spend 2-4 years learning fundamentals (data structures, algorithms, system design)
2. Get hired as junior engineer
3. Spend 3-5 years building deep technical expertise
4. Then you can build your own ideas

**The new playbook (2024+):**

1. Learn fundamentals (still important for problem-solving)
2. Start building immediately with AI help
3. Build deep technical expertise in areas that matter through doing
4. Ship 10x more in your first year than previous generation

**The trap to avoid:**

- Thinking you need to "learn everything" before you can build anything
- Using AI to help you research more instead of ship more
- Waiting until you're "ready" (you never will be)

**The opportunity:**

- You're entering the job market at the PERFECT time to leverage high agency
- Companies are desperate for people who ship, not people who know
- Your ability to use AI to execute quickly is more valuable than your depth in any specific framework

**Specific tactical advice:**

- Build a portfolio of shipped projects (imperfect is fine)
- Count your attempts/iterations, not your quality
- Use AI to fill your knowledge gaps, not delay your shipping
- Focus on entrepreneur skills first, technologist skills as needed

Cross-link to [My Dream Job](/my-perfect-job): Your autonomy comes from ability to execute, not ability to know. AI gives you execution capability on day 1.

**Questions to ask yourself:**

- How many things have you shipped this month? (Not "how much have you learned")
- Are you using AI to ship faster or research longer?
- When you don't know something, do you study it or prototype it?

**The brutal truth:**

Your classmates with lower GPAs but higher agency will likely out-earn you in 5 years if they're shipping with AI while you're still "learning the right way."

**The encouragement:**

This is actually GOOD news. You don't need to spend 10 years accumulating knowledge anymore. You can start creating value immediately. The question is: will you?

## The Call to Action

**The uncomfortable truth:**

In the AI era, your intelligence is increasingly commoditized. **Your agency is your value proposition.** Your agency is your moat.

**The opportunity:**

AI doesn't replace high-agency people. It makes them 10x more powerful.

**The choice:**

- Use AI to plan more perfectly (low agency trap)
- Use AI to execute more quickly (high agency leverage)

**The question:**

Six months from now, what will separate you from others with access to the same AI?

**Answer:** Not what you know. What you shipped.

Cross-link to [Anxiety](/anxiety): The paradox of control—by accepting you can't control outcomes and focusing on what you can influence (shipping, iterating, learning), you become more effective.

Cross-link to [Essentialism](/essentialism): Choose deliberately where to apply your agency. Say no to perfect plans. Say yes to imperfect action.

**Start now:** What's one thing you can ship today with AI's help? Not perfect. Not polished. Just shipped.

See also: [AI FAQ](/ai-faq) - More open questions about AI's impact on expertise, thinking, and society.
