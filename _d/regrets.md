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

Regrets, both ours and others, are a powerful tools to shape our present and future. four main types: foundation regrets related to not laying a proper base for life; boldness regrets stemming from missed opportunities and risks; moral regrets from not doing the right thing; and connection regrets from neglecting or damaging relationships. May you fin dinsights into how we can better navigate our choices to minimize regret and enhance our sense of fulfillment.

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Regrets, for the future, not the past](#regrets-for-the-future-not-the-past)
    - [Concerns, Control and Influence](#concerns-control-and-influence)
    - [Be compassionate to yourself - forgive](#be-compassionate-to-yourself---forgive)
- [The Four Regrets](#the-four-regrets)
    - [Foundational - If only I'd done the work](#foundational---if-only-id-done-the-work)
    - [Boldness - If only I'd taken the risk/opportunity](#boldness---if-only-id-taken-the-riskopportunity)
    - [Moral - If only I done the right thing](#moral---if-only-i-done-the-right-thing)
    - [Connection - If only I'd reached out](#connection---if-only-id-reached-out)
    - [Regrets over time](#regrets-over-time)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Regrets, for the future, not the past

Before we delve into regrets, we should remember a critical concept from the 7 habits "Focus on your circle of influence, not your circle of

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

### Moral - If only I done the right thing

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

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js" integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<canvas id="chart-regrets-over-time" style="height: 400px;"></canvas>

<script>
defer(() => {
  const canvas = document.getElementById("chart-regrets-over-time");
  if (!canvas) {
    console.error("Chart canvas not found");
    return;
  }
  
  const myChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['20s', '30s', '40s', '50s', '60s', '70s+'],
      datasets: [
        {
          label: 'Foundational',
          data: [15, 20, 25, 20, 15, 10],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Boldness',
          data: [35, 30, 25, 20, 15, 10],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Moral',
          data: [25, 20, 20, 30, 35, 40],
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
        {
          label: 'Connection',
          data: [25, 30, 30, 30, 35, 40],
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Regret Distribution by Age Group (%)',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: false,
            boxWidth: 20,
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 45,
          title: {
            display: true,
            text: 'Percentage (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Age Decade',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        }
      },
      elements: {
        bar: {
          borderWidth: 1
        }
      }
    }
  });
});
</script>
