---
layout: post
title: "Understanding tech compensation and signing bonuses"
date: "2016-11-16 07:00:35 Pacific Standard Time"
tags:
  - job-hunt
permalink: /comp
redirect_from:
  - /compensation
  - /comp
  - /pay
 - /understandingtechcompensation
---
<!-- 
imagefeature: https://thenounproject.com/0a7bdab3-cb97-4cce-9161-d4504ebc88c2
-->

Different companies use different compensation models. To compare between them only compare total compensation, not salary. Also, signing bonuses of 100% of salary aren't uncommon in the tech industry. While this sounds amazing, it's often nothing more then replacement for the otherwise lost income from unvested equity.

_You can add comments to this post [here](https://hackmd.io/AyBTMcncRweMVZEVUWUFCA)_

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Signing Bonus](#signing-bonus)
- [Per company comp models](#per-company-comp-models)
  - [Initial Grant](#initial-grant)
  - [Steady state - Total Comp vs Independent comp](#steady-state---total-comp-vs-independent-comp)
- [Negotiating](#negotiating)
- [Assumptions](#assumptions)
- [Should you include stock appreciation in total compensation?](#should-you-include-stock-appreciation-in-total-compensation)
- [Other resources](#other-resources)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

### Signing Bonus

Understand your total compensation which is a combination of salary, cash bonus, and equity. For example, imagine making a steady state total compensation of 200\$/ year(see assumptions below). For this example, imagine this breakdown:

- Base salary: 150\$/year, paid out bi-weekly.
- Cash Bonus: 25\$/year, paid out annually.
- Equity Grant: 25\$/year, paid out annually vesting over 5 years.
- Equity at 5th year: 25\$ paid out annually.
- Equity at 1st year: 5\$ paid out first year.

Imagine you switch companies right after the cash and equity has been rewarded, and negotiate a total compensation of 200\$/year, with the same salary/cash/stock ratio.

The first year your comp will only be your salary - 150$. This means you're losing 50$ on the first year. The second year, you'll get salary, cash bonus, and some equity, BUT your equity hasn't fully vested, so you'll only make salary and bonus of 180, meaning you still lose 20\$ in the second year. In table form:

| Year | Base | Bonus | Stock             | Total | Lost |
| ---- | ---- | ----- | ----------------- | ----- | ---- |
| 0    | 150  | 0     | 0                 | 150   | 50   |
| 1    | 150  | 25    | 5 (yr 0)          | 180   | 20   |
| 2    | 150  | 25    | 10 (yr 0,1)       | 185   | 15   |
| 3    | 150  | 25    | 15 (yr 0,1,2)     | 190   | 10   |
| 4    | 150  | 25    | 20 (yr 0,1,2,3)   | 195   | 5    |
| 5    | 150  | 25    | 25 (yr 0,1,2,3,4) | 200   | 0    |
| 6    | 150  | 25    | 25 (yr 1,2,3,4,5) | 200   | 0    |

Continuing the math, you'll actually need a signing bonus of 100\$ to just cover your lost income from the previous years.
Suddenly your 100% of salary signing bonus of 100\$ doesn't seem nearly as awesome.

### Per company comp models

Each company does a different comp model. I'll list the ones I've been told. This data is likely often stale.

#### Initial Grant

| Company   | Salary           | Cash Bonus            | Stock Model                                                                      |
| --------- | ---------------- | --------------------- | -------------------------------------------------------------------------------- |
| Amazon    | Yes Maximum 160K | Only in first 2 years | 4 year grant. Per year 5%,15%, 40%, 40%                                          |
| Google    | Yes              | Yes                   | 4 year grant vest monthly                                                        |
| Facebook  | Yes              | Yes                   | 4 year grant vest quarterly                                                      |
| Indeed    | Yes              | Yes                   | It's a private company and using something like stocks called LTIPs very complex |
| Microsoft | Yes              | Yes                   | Unknown                                                                          |

Steady state differences:

#### Steady state - Total Comp vs Independent comp

The details get complex, so these are simplified models to build a mental model, not accurate models to compute compensation.

For example, imagine you have a base salary of 50$ and because of your performance you should be paid 100$. To simplify we'll
say the compensation is paid in cash (but in reality it's probably stock with a vesting schedule).

**Independent Comp** This is the Microsoft model, it's very simple. You should be paid a 100$, you currently get a salary of  50$, therefore you'll get an extra 50\$. This is completely independent of previous years.

**Total Comp** At Amazon, they do payout based on expected total comp. This means to compute this years bonus, you need to know how much you're making as a result of previous years stock (often unvested). In the simple case, imagine you have no compensation from previous years stock contribution (doesn't happen in practice). In that case, Amazon will be identical to Microsoft and pay you 50\$.

However, imagine due to stock appreciation, you're already making 150\$ this year in total comp. Amazon will give you zero extra dollars for this year as you're already paid beyond the current compensation. They will pay into future years (I know it's complicated).

A question that comes up in a total comp model, is will Amazon make you whole. E.g. if due to stock depreciation you've lost 30$, so you current compensation is 20$, will amazon give you 50$ or 80$? I don't know. Luckily for Amazon this has never happened.

### Negotiating

As of 2019, I've never seen an offer redacted due to negotiation (OK, with one very unlikely exception which has happened to me). This is true at the big tech companies, and the middle sized tech companies, not sure about small tech companies. The best way to negotiate is to have competing offers.

### Assumptions

Bonus and equity often vary based on performance. This article assumes you always perform to the same target performance.

Equity based compensation is a function of stock price, and this article assumes a stable stock market price. This can be a bad assumption, for example, Amazon increased 375% and Microsoft increased 200% over the 4 years from June 2014 to June 2018.

### Should you include stock appreciation in total compensation?

NO! If you are doing this, you're assuming you can "predict the market".

If you have that skill, that's the optimum way to make money. Skip your job hunt, and buy stocks today!

### Other resources

Compensation is often a function of "job level" which varies by company. This site translates [ladder levels](https://www.levels.fyi/) between the big tech companies nicely (but not the compensation levels).
