---
layout: post
title: "Regrets"
permalink: /regrets
redirect_from:
  - /regret
tags:
  - emotion
  - emotional intelligence
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>

Regrets, both ours and others, are a powerful tools to shape our present and future. four main types: foundation regrets related to not laying a proper base for life; boldness regrets stemming from missed opportunities and risks; moral regrets from not doing the right thing; and connection regrets from neglecting or damaging relationships. May you find insights into how we can better navigate our choices to minimize regret and enhance our sense of fulfillment.

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Regrets, for the future, not the past](#regrets-for-the-future-not-the-past)
    - [Concerns, Control and Influence](#concerns-control-and-influence)
    - [Be compassionate to yourself - forgive](#be-compassionate-to-yourself---forgive)
- [The Four Regrets](#the-four-regrets)
    - [Foundational - If only I'd done the work](#foundational---if-only-id-done-the-work)
    - [Boldness - If only I'd taken the risk/opportunity](#boldness---if-only-id-taken-the-riskopportunity)
    - [Moral - If only I'd done the right thing](#moral---if-only-id-done-the-right-thing)
    - [Connection - If only I'd reached out](#connection---if-only-id-reached-out)
    - [Regrets over time](#regrets-over-time)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Regrets, for the future, not the past

Before we delve into regrets, we should remember a critical concept from the 7 habits "Focus on your circle of influence, not your circle of concern."

### Concerns, Control and Influence

In the [The first of the 7 habits, be proactive](/7h-c1) requires focusing your energy on your circle of influence, not your circle of control. If you've forgotten, the past is completely outside your ability to influence, regardless of how much you think it's your concern.

A frequent source of [anxiety](/mental-pain), is trying to control something, with the antidote being how to maximize your influence.

The future and present are where you can influence. Think through future regrets (both yours and others) to focus your behaviors. For example, I frequently remind myself that [no one ever uttered "God, I wish I spent more time at work" on their deathbed](/wlb-manifesto).

Avoid future regrets: Anticipate the types of regrets that could stem from a choice and weigh that against potential positives.
Learn and Grow: Regret about past actions can motivate you to be more responsible, take healthy risks, make amends, and prioritize the connections that truly matter.

### Be compassionate to yourself - forgive

Compassion is about removing suffering, and accepting people as they are. This applies both to others and to yourself.

When someone throws a rock at you, you don't get mad at the rock, you get mad at the person. But no one wants to throw a rock at you, they likely did it due to their suffering. So, just as you don't get mad at the rock, don't get mad at the person, get mad at their suffering.

Compassion can be broken down with a time dimension.

| Time | Behavior    | Practice | Behavior Definition            |
| ---- | ----------- | -------- | ------------------------------ |
| Past | Forgiveness | Humility | Give up hope for a better past |

- When people behave poorly (in your mind), it is due to their suffering.
- Compassion clarifies the person’s suffering, not the person, is the source of the problem. Suffering is unacceptable. The person is acceptable (see [getting to yes, hard on problems soft on people](/gty)).
- Sounds like the fundamental attribution error: When you do something wrong, you attribute it to circumstance, when others do things wrong you attribute to malice/incompetence/personality.

{%include summarize-page.html src="/compassion" %}

## The Four Regrets

### Foundational - If only I'd done the work

- Not saving enough money for retirement or emergencies
- Not prioritizing health and wellness
- Neglecting education and opportunities for self-improvement

### Boldness - If only I'd taken the risk/opportunity

- Not asking someone out on a date
- Not starting that business you always dreamed of
- Not traveling or exploring new experiences

### Moral - If only I'd done the right thing

Examples:

- Cheating on a partner or in a competition
- Lying or intentionally deceiving someone
- Acting selfishly at the expense of others

### Connection - If only I'd reached out

Examples:

- Not staying in touch with friends and family.
- Not making amends after an argument.
- Taking loved ones for granted.

### Regrets over time

As we can see, regret distribution varies across age groups. People tend to have the most boldness regrets in their 20s, which may be due to feeling like they haven't taken enough chances or pursued their dreams. Regret about foundation choices tends to increase with age, possibly due to a greater awareness of long-term consequences. Connection regrets also tend to rise with age, perhaps as people reflect on lost relationships or missed opportunities for connection.

It's important to note that this is just a general trend, and individual experiences may vary.

<canvas id="chart-regrets-over-time"></canvas>

<script>
defer(() => {
  const ctx = "chart-regrets-over-time";

  // Data table - easy to read and edit
  const regretsData = {
    decades: ['20s', '30s', '40s', '50s', '60s', '70s+'],
    regretTypes: {
      Foundational: [15, 20, 25, 20, 15, 10],
      Boldness:     [40, 32, 26, 22, 18, 14],
      Moral:        [25, 20, 20, 28, 33, 38],
      Connection:   [25, 30, 30, 32, 37, 42]
    }
  };

  // Color scheme for each regret type
  const colors = [
    { border: 'rgba(54, 162, 235, 0.8)', bg: 'rgba(54, 162, 235, 0.2)' },  // Blue
    { border: 'rgba(255, 99, 132, 0.8)', bg: 'rgba(255, 99, 132, 0.2)' },  // Red
    { border: 'rgba(255, 206, 86, 0.8)', bg: 'rgba(255, 206, 86, 0.2)' },  // Yellow
    { border: 'rgba(75, 192, 192, 0.8)', bg: 'rgba(75, 192, 192, 0.2)' }   // Teal
  ];

  // Convert to Chart.js dataset format - labels read from data
  const datasets = Object.keys(regretsData.regretTypes).map((regretType, index) => ({
    label: regretType,
    data: regretsData.regretTypes[regretType],
    borderColor: colors[index].border,
    backgroundColor: colors[index].bg,
    tension: 0.4
  }));

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: regretsData.decades,
      datasets: datasets
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Regret Distribution by Age'
        },
        legend: {
          display: true
        },
        datalabels: {
          align: 'top',
          font: {
            size: 10
          },
          formatter: function(value) {
            return value + '%';
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Percentage (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Age Decade'
          }
        }
      },
      elements: {
        point: {
          radius: 4
        }
      }
    }
  });

  console.log(ctx, myChart);
});
</script>
