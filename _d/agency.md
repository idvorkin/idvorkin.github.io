---
layout: post
title: "Agency trumps Intelligence"
permalink: /agency
tags:
  - how igor ticks
  - book-notes
---

Two engineers, same IQ, same tools. One ships weekly. The other is "researching the best approach" or waiting for someone to tell them what to do. Six months later the gap between them is huge, and it isn't intelligence. "Intelligence" in the title is a bit of clickbait: I mean the accumulated technical knowledge that used to take years to build. AI made that knowledge queryable, so the bottleneck moved to agency: deciding to build the thing, and keeping going when the first attempt fails.

{% include ai-slop.html percent="85" %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Knowledge became queryable](#knowledge-became-queryable)
- [The technologist threshold moved](#the-technologist-threshold-moved)
- [The smart trap gets worse with AI](#the-smart-trap-gets-worse-with-ai)
- [What intelligence is still for](#what-intelligence-is-still-for)
- [Building the agency muscle](#building-the-agency-muscle)
- [Related](#related)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Knowledge became queryable

Agency is the old "gets things done" with a fancy new word: seeing what needs to happen and making it happen.

It used to lose to knowledge. To ship a payment system you needed someone who understood OAuth, schema design, indexing, deployment pipelines and failure handling, and that took years to learn. You could have all the drive in the world, but without that knowledge you weren't shipping anything real.

Now Claude can scaffold the database, wire up auth and write the tests. You still need to break a problem down, judge what's worth building and learn from what happens. You no longer need five years of backend experience to build a backend.

## The technologist threshold moved

Technologists aren't obsolete. The point where you need one has moved much later.

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
});
</script>

Before AI, someone without deep technical skills could get from idea to a rough prototype alone, and that was it. Now they can get to an MVP with real users, which is far enough to find out whether the idea is any good. The expertise isn't gone, it's delayed:

| You need a deep technologist for | Before AI          | With AI                       |
| -------------------------------- | ------------------ | ----------------------------- |
| Architecture                     | The MVP            | Actually scaling              |
| Security hardening               | Shipping at all    | Significant scale             |
| Database work                    | Any real data      | Queries slowing down at scale |
| Performance                      | ~100 users         | 10K+ users                    |
| Infrastructure                   | Deploying anything | Uptime becoming critical      |

That changes the order of operations. The old path was: find or become a technologist (years or money), build, discover you were wrong, rebuild. Most ideas died before the first build. Now you prototype in days, pivot three times in the time v1 used to take, and bring in the technologist once the idea has earned it.

## The smart trap gets worse with AI

Intelligence times zero agency is zero, and multiplying by AI doesn't help. AI makes it easier than ever to look busy:

- It generates ten approaches instantly, and smart people can compare them forever. The move is "implement #1, we'll learn if it's wrong."
- Your own knowledge used to be a forcing function: you shipped what you knew how to build. Now you can always ask for one more revision.
- Chatting with AI feels like work and generated code feels like progress. Code you never run, integrate or deploy is expensive procrastination.

## What intelligence is still for

Judgment about what's worth building, seeing how the pieces fit together, the taste to know when good enough is good enough, and pulling lessons out of each attempt. Experience doesn't stop mattering either: the person who understands systems and tradeoffs can [tell when AI is giving them garbage](/ai-hiring), so they get _more_ leverage from it. All of that pays off only when you're already deciding and shipping.

## Building the agency muscle

- **The 2-hour rule.** After two hours of researching or planning, ship something, even if it's broken. Use AI to ship faster, not to research more.
- **Count attempts, not quality.** Twenty failed experiments beat one perfect plan.
- **Change the excuse.** "I don't know how to X" doesn't hold up when AI knows. The honest version is "I haven't tried X yet."
- **Audit your circle of influence.** AI has made it [much bigger](/7h-c1). What can you execute on today?

If you're just entering the field, the old playbook was learn deeply for years, then build. The new one is learn the fundamentals, then build to learn, and go deep where the work demands it. The trap is using AI to study longer instead of ship sooner. When you don't know something, prototype it.

Six months from now, what separates you from everyone else with the same AI? Not what you know. What you shipped.

## Related

- [Bias for Action](/amazon): Amazon's leadership principle matters more when iteration is cheap.
- [Igor's Gap Year](/igor-gap-year): self-directed energy can now produce real work, not just learning projects.
- [My Dream Job](/my-perfect-job): autonomy and purpose no longer have to wait for mastery.
- [Regrets](/regrets): "I should have learned to code years ago" is the backward-looking version; "what do I ship next?" is the forward one.
- [Essentialism](/essentialism): choose deliberately where to spend your agency.
- [AI FAQ](/ai-faq): more open questions about AI, expertise and thinking.
