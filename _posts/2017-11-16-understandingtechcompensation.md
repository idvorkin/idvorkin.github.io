---
layout: post
title: "Care about Total Compensation"
date: "2019-01-09 07:25:17 Pacific Daylight Time"
imagefeature: https://github.com/idvorkin/blob/raw/master/icon_compensation.png
tags:
  - job-hunt
permalink: /comp
redirect_from:
  - /compensation
  - /pay
---

Different companies use different compensation models. To compare models, use total compensation, not salary. The compensation models are arbitrary and complicated. For example, Amazon caps salary at 160K\$/yr and doesn't have bonuses. Google vests stocks monthly. Facebook bonuses have a company performance multiplier. At some companies, signing bonuses can be over 100% of salary!

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Total Compensation - It gets complicated](#total-compensation---it-gets-complicated)
    - [Initial Grant Models - By Company](#initial-grant-models---by-company)
    - [Steady State Comp Approaches - Independent vs Total Comp](#steady-state-comp-approaches---independent-vs-total-comp)
    - [Assumptions](#assumptions)
- [FAQ](#faq)
    - [Why do I feel so bad?](#why-do-i-feel-so-bad)
    - [I compared salaries and now I feel awful](#i-compared-salaries-and-now-i-feel-awful)
    - [Wow, I had no idea, how do I get a new high-paying job?](#wow-i-had-no-idea-how-do-i-get-a-new-high-paying-job)
    - [Should you include stock appreciation in total compensation?](#should-you-include-stock-appreciation-in-total-compensation)
    - [How do I translate job levels between companies?](#how-do-i-translate-job-levels-between-companies)
    - [I read on the internet company Foo pays Bar. Is that true?](#i-read-on-the-internet-company-foo-pays-bar-is-that-true)
    - [Is it fair that promotions pay at the bottom of the pay scale, and new hires tend to be at the top?](#is-it-fair-that-promotions-pay-at-the-bottom-of-the-pay-scale-and-new-hires-tend-to-be-at-the-top)
    - [What is the four-year cliff?](#what-is-the-four-year-cliff)
    - [Example of Four-Year Cliff at Meta](#example-of-four-year-cliff-at-meta)
    - [Explanation](#explanation)
    - [Should I negotiate?](#should-i-negotiate)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Total Compensation - It gets complicated

Understand your total compensation, which is a combination of salary, cash bonus, and equity. For example, imagine making a steady-state total compensation of 200\$/year (see assumptions below). For this example, imagine this breakdown (each company has a different model):

- Base salary: 150\$/year, paid out bi-weekly.
- Cash Bonus: 25\$/year, paid out annually.
- Equity Grant: 25\$/year, paid out annually, vesting over 5 years.
- Equity at 5th year: 25\$ paid out annually.
- Equity at 1st year: 5\$ paid out the first year.

Imagine you switch companies right after the cash and equity have been rewarded and negotiate a total compensation of 200\$/year, with the same salary/cash/stock ratio.

The first year your comp will only be your salary - 150$. This means you're losing 50$ in the first year. The second year, you'll get salary, cash bonus, and some equity, BUT your equity hasn't fully vested, so you'll only make salary and bonus of 180, meaning you still lose 20\$ in the second year. In table form:

| Year | Base | Bonus | Stock             | Total | Lost |
| ---- | ---- | ----- | ----------------- | ----- | ---- |
| 0    | 150  | 0     | 0                 | 150   | 50   |
| 1    | 150  | 25    | 5 (yr 0)          | 180   | 20   |
| 2    | 150  | 25    | 10 (yr 0,1)       | 185   | 15   |
| 3    | 150  | 25    | 15 (yr 0,1,2)     | 190   | 10   |
| 4    | 150  | 25    | 20 (yr 0,1,2,3)   | 195   | 5    |
| 5    | 150  | 25    | 25 (yr 0,1,2,3,4) | 200   | 0    |
| 6    | 150  | 25    | 25 (yr 1,2,3,4,5) | 200   | 0    |

Continuing the math, you'll actually need a signing bonus of 100\$ to just cover your lost income from the previous years. Suddenly, your 100% of salary signing bonus of 100\$ doesn't seem nearly as awesome.

### Initial Grant Models - By Company

Each company has a different comp model. I'll list the ones I've been told. This data is likely stale.

| Company   | Salary            | Cash Bonus                | Stock Model                                                                      |
| --------- | ----------------- | ------------------------- | -------------------------------------------------------------------------------- |
| Amazon    | Yes, Maximum 160K | Only in the first 2 years | 4-year grant. Per year 5%,15%, 40%, 40%                                          |
| Google    | Yes               | Yes                       | 4-year grant vests monthly                                                       |
| Facebook  | Yes               | Yes                       | 4-year grant vests quarterly                                                     |
| Indeed    | Yes               | Yes                       | It's a private company and uses something like stocks called LTIPs; very complex |
| Microsoft | Yes               | Yes                       | Unknown                                                                          |

### Steady State Comp Approaches - Independent vs Total Comp

The details get complex, so these are simplified models to build a mental model, not accurate models to compute compensation.

For example, imagine you have a base salary of 50$ and because of your performance, you should be paid 100$. To simplify, we'll say the compensation is paid in cash (but in reality, it's probably stock with a vesting schedule).

**Independent Comp** This is the Microsoft model, it's very simple. You should be paid 100$, you currently get a salary of 50$, therefore you'll get an extra 50\$. This is completely independent of previous years.

**Total Comp** At Amazon, they do payout based on expected total comp. This means to compute this year's bonus, you need to know how much you're making as a result of previous years' stock (often unvested). In the simple case, imagine you have no compensation from the previous years' stock contribution (doesn't happen in practice). In that case, Amazon will be identical to Microsoft and pay you 50\$.

However, imagine due to stock appreciation, you're already making 150\$ this year in total comp. Amazon will give you zero extra dollars for this year as you're already paid beyond the current compensation. They will pay into future years (I know it's complicated).

A question that comes up in a total comp model is will Amazon make you whole. E.g., if due to stock depreciation you've lost 30$, so your current compensation is 20$, will Amazon give you 50$ or 80$? I don't know. Luckily for Amazon, this has never happened.

### Assumptions

Bonus and equity often vary based on performance. This article assumes you always perform to the same target performance.

Equity-based compensation is a function of stock price, and this article assumes a stable stock market price. This can be a bad assumption; for example, Amazon increased 375% and Microsoft increased 200% over the 4 years from June 2014 to June 2018.

## FAQ

### Why do I feel so bad?

### I compared salaries and now I feel awful

There's an old joke - when 2 people compare salaries, one of them is going to walk away feeling ecstatic, and the other miserable. Be cautious when comparing salaries, as [your pride can start messing with you](/pride).

### Wow, I had no idea, how do I get a new high-paying job?

Job hunts are really stressful. If you decide to change jobs, check out [reducing job hunt stress](/job-hunt-stress).

### Should you include stock appreciation in total compensation?

NO! If you are doing this, you're assuming you can "predict the market."

If you have that skill, that's the optimum way to make money. Skip your job hunt, and buy stocks today!

### How do I translate job levels between companies?

Compensation is often a function of "job level" which varies by company. This site translates [ladder levels](https://www.levels.fyi/) between the big tech companies nicely (but not the compensation levels).

### I read on the internet company Foo pays Bar. Is that true?

Maybe, but I doubt it. Don't forget the old joke when 2 people compare salaries, one of them is going to walk away feeling ecstatic, and the other miserable. Be cautious when comparing salaries, as [your pride can start messing with you](/pride).

### Is it fair that promotions pay at the bottom of the pay scale, and new hires tend to be at the top?

First, how do companies determine pay? Usually, companies seek to be fair, which they do by establishing a pay range for a level and then pegging that range to a percentile of the industry. A fictitious example, the industry pay range for a Senior is 100$ to 200$, 75th percentile at 175$. A company wants to set their comp at p75 of the industry, so they set their senior pay band from 170$ to 180\$.

Now people want to get raises every year, so companies would give someone promoted into senior 170$, and as years go by they get raises till they rise to 180$.

For new hires, offers tend to be at the top of (if not over) the pay range but fairness continues to be the doctrine.

The industry range for offers is higher because 1) you don't want to lose a good candidate due to a higher competing offer 2) you tend to hire people who are already well experienced in the band. 3) As a result of the high level of experience, you can be optimistic that the person will be promoted shortly, and if they don't, the extra compensation will be corrected by the 4-year cliff.

You hire people who tend to be high in the band because it ensures they'll be successful. Changing companies has significant headwinds (new culture, new tech, new process, no network). If someone is at the bottom of the band when they interview, they tend to be down-leveled to avoid them failing at the higher level.

### What is the four-year cliff?

Often, if you don't get a promotion in the 4 years after you've been hired, your pay will drop. This is because many tech companies give an initial stock grant over four years. This grant is often really good at the 4-year mark because 1) the job market was competitive and you were at your best when you were hired, so you got a great offer 2) your stock has had 4 years to appreciate!

### Example of Four-Year Cliff at Meta

The four-year cliff is larger at Meta because Meta is **incredibly generous**, in that you start receiving your annual stock refreshers while you are vesting your initial stock grant. While compensation is arbitrary, of course, it's arguable this is double pay, and as a Meta employee, I have no qualms with it :)

| Year | Salary + Bonus | Initial Stock Vesting | Stock Refreshers Vesting | Total Compensation | Comments                                                     |
| ---- | -------------- | --------------------- | ------------------------ | ------------------ | ------------------------------------------------------------ |
| 1    | $100           | $100                  | $0                       | $200               | $400 initial grant, vesting $100 annually.                   |
| 2    | $100           | $100                  | $25                      | $225               | Refreshers granted at $100, vesting $25 annually.            |
| 3    | $100           | $100                  | $50                      | $250               | Increasing vesting from initial and refreshers.              |
| 4    | $100           | $100                  | $75                      | $275               | Peak compensation; both grants contributing.                 |
| 5    | $100           | $0                    | $100                     | $200               | Initial grant fully vested; refreshers continue at $25/year. |
| 6    | $100           | $0                    | $100                     | $200               | Sustained compensation with refreshers at $25/year.          |

Zooming in on the stock compensation by contribution:

| Year | Total Stock Compensation | Initial Grant | Year 1 Refresher | Year 2 Refresher | Year 3 Refresher | Year 4 Refresher | Year 5 Refresher | Comments                                          |
| ---- | ------------------------ | ------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ------------------------------------------------- |
| 1    | $100                     | $100          | $0               | $0               | $0               | $0               | $0               | $400 initial grant, vesting $100 annually.        |
| 2    | $125                     | $100          | $25              | $0               | $0               | $0               | $0               | Refreshers granted at $100, vesting $25 annually. |
| 3    | $150                     | $100          | $25              | $25              | $0               | $0               | $0               | Increasing vesting from initial and refreshers.   |
| 4    | $175                     | $100          | $25              | $25              | $25              | $0               | $0               | Peak compensation; both grants contributing.      |
| 5    | $100                     | $0            | $25              | $25              | $25              | $25              | $0               | Initial grant fully vested; refreshers continue.  |
| 6    | $100                     | $0            | $0               | $25              | $25              | $25              | $25              | Sustained compensation with refreshers.           |

### Explanation

- **Year 1:** You receive a salary and bonus of $100, and the initial stock grant contributes an additional $100, totaling $200.

- **Years 2-4:** The initial stock grant continues to vest at $100 annually. Refreshers, granted each year at $100 and vesting at $25 annually, add to your total compensation, peaking at $275 in Year 4.

- **Years 5-6:** With the initial stock grant fully vested, the refreshers continue, each contributing $25 annually. This maintains your total compensation at $200, demonstrating the effectiveness of Meta's overlapping vesting strategy.

This expanded table highlights how Meta’s approach to stock compensation strategically supports higher total compensation, providing a strong incentive for employees to stay with the company over the long term.

### Should I negotiate?

As of 2019, I've never seen an offer retracted due to negotiation (OK, with one very unlikely exception which has happened to me). This is true at the big tech companies and the middle-sized tech companies, not sure about small tech companies. The best way to negotiate is to have competing offers.
