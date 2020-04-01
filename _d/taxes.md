---
layout: post
title: "Tax and Saving"
author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: money
redirect_from:
  - /money
  - /savings
  - /taxes
  - /saving
---

Most of the tax information on the web is a mess. It's confusing as it tries to apply to everyone, with varying situations, and is often written by non-engineers for non-engineers. I think my tax situation is common to people who have been in software engineering companies for most of their careers, and here are my notes

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc GFM -->

- [Assumptions and Hannah](#assumptions-and-hannah)
- [IRAs Non-Taxable Saving Accounts](#iras-non-taxable-saving-accounts)
    - [Taxable income, and capital gains.](#taxable-income-and-capital-gains)
    - [Should I hold my high risk/high return investments in my taxable or non-taxable accounts?](#should-i-hold-my-high-riskhigh-return-investments-in-my-taxable-or-non-taxable-accounts)
    - [My high risk investments are already in non-taxable, should I sell them and swap them with my taxable account?](#my-high-risk-investments-are-already-in-non-taxable-should-i-sell-them-and-swap-them-with-my-taxable-account)
    - [IRAs vs 401Ks](#iras-vs-401ks)
    - [IRA vs Roth IRA](#ira-vs-roth-ira)
    - [IRA and Roth IRA contribution limits.](#ira-and-roth-ira-contribution-limits)
    - [Back door Roth.](#back-door-roth)
    - [The pro-Rata rule.](#the-pro-rata-rule)
- [Useful topics](#useful-topics)
    - [No load index funds](#no-load-index-funds)
    - [Marginal vs Average Tax Rate](#marginal-vs-average-tax-rate)
    - [Short vs Long term capital gains](#short-vs-long-term-capital-gains)
    - [Cash positions and high yield savings.](#cash-positions-and-high-yield-savings)
    - [529s](#529s)
    - [Unexpected expenses](#unexpected-expenses)
- [Philosophy](#philosophy)
    - [The point of money](#the-point-of-money)
        - [What would you do for less money?](#what-would-you-do-for-less-money)
        - [Making more vs spending more](#making-more-vs-spending-more)
    - [Believing the market only goes up](#believing-the-market-only-goes-up)
    - [Keeping a mortgage you can pay of since interest rates are low](#keeping-a-mortgage-you-can-pay-of-since-interest-rates-are-low)
    - [Timing the markets](#timing-the-markets)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Assumptions and Hannah

You're in the same boat as Hannah. A normal software engineer at big companies with the standard setup. Her company has a 401k. She makes more then she can contribute to a Roth IRA and Tax law is accurate to circa 2019.

**Hannah** assumptions:

    * Has a 401k with her company which she maxes annually
    * Ineligible for Roth deductions
    * Marginal tax rate of 35%
    * Long Term Capital Gains  Rates of 15%

## IRAs Non-Taxable Saving Accounts

An IRA is an account that grows tax free. The critical value of the IRA is the tax free growth. With money not in an IRA you have to pay tax twice 1) when you make the money 2) when the money grows.

IRAs have contribution limits, X, Y, Z

IRAs early withdrawal penalties

IRAs hardship withdrawal

TODO show calculation for Roth growth

TODO show calculation for IRA growth

### Taxable income, and capital gains.

Income is the money you make. That starts by being your wages, but as you get assets like stocks, bonds and houses, things get a big more complex. Let start with easy sources of income:

Wages + Bonus: What you're paid at work, you pay the marginal tax rate.
Interest on Savings and Bonds and Stock Dividends: What you're paid to hold an investment (to assume the risk), you pay the marginal tax rate.

Capital Gains: If you have assets (houses, shares of companies), you may not get interest, but the asset can appreciate. You need to pay tax on those gains. In general capital gains can be short (STCG) or long term (LTCG), with short term being at the marginal tax rate, and long term having a tax benefits (Hannah: 15% LTCG, vs 34% marginal tax rate).

When retired, you need to get money out of your savings, which you can do by taking interest/dividends or by selling assets. When selling assets, you pay capital gains. This begs a questions, should you keep your capital gains inside or outside your IRAs (where they have tax free growth). Turns out

### Should I hold my high risk/high return investments in my taxable or non-taxable accounts?

### My high risk investments are already in non-taxable, should I sell them and swap them with my taxable account?

### IRAs vs 401Ks

A 401k is a special IRA that is setup by your employee that has matching (good thing) but usually less choices of what you can invest in (bad thing). Otherwise, its a regular IRA.

### IRA vs Roth IRA

IRA you pay no tax on the way in, but you pay tax on the way out. By contrast with Roth you pay tax before making a contribution, but then pay no tax on the way out.

Assuming your tax rate is the same, it doesn't matter which you choose. If your tax rate goes up post retirement, you're better off with a Roth, and if your tax rate goes down, you're better off with an IRA. A few notes:

1. Your tax rate can go up by moving to a state with higher state taxes (e.g. From WA w/0% state tax to HI w/TK% state tax).
2. If you've saved a lot, your marginal tax rate might be the same, but your average tax rate (which will be on your retirement withdrawals) is most likely lower.

### IRA and Roth IRA contribution limits.

You're limited to how much you can put in your IRA and Roth. Odds are you can't put money into your Roth IRA because you make to much.

### Back door Roth.

Tax law is goofy. You can't deposit money into a ROTH since you're over the limit, but you can take money from your IRA and convert into a Roth IRA. But there's a rub - the Pro-Rata rule.

### The pro-Rata rule.

Even though you are using after tax dollars to transfer money to the Roth IRA, you can't do the math like that. The rules (arbitrary) state that the money you take over is in the ratio of your IRA before and after tax contribution.

## Useful topics

### No load index funds

Funds with zero fees. Usually a broad index fund like Fidelity Zero FZROX and FZILX. Could be a Mutual Fund or ETF (but you don't care so long as it's no load and no fees).

### Marginal vs Average Tax Rate

Taxes are like a step function. From 0 - K1 you pay rate t1, From K1 - K2 you pay rate t2, etc. The marginal tax rate is how much tax you pay on every extra dollar make, E.g. the tax rate in the maximum step. By contrast, your average tax rate is the total taxes/total income, which can be significantly less then the marginal tax rate depending on how far over the step function you are.

### Short vs Long term capital gains

### Cash positions and high yield savings.

Often, we think about holding cash, and think about holding it in a place with no interest. Keep this money in high yield bank accounts, which can give [close to 2% (as of Dec '19)](https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts)
At Fidelity you can keep your core cash in a liquid low risk mutual fund [SPAXX](https://fundresearch.fidelity.com/mutual-funds/summary/31617H102), however this has a 0.42% expense ratio, which will eat 25% - 50% of your earned interest.

### 529s

An education only after tax savings account. You put in money after tax, get tax free growth, and can use distributions for your kid or grand kids education.

### Unexpected expenses

## Philosophy

### The point of money

When seeing a financial planner, they asked me - what is the point of your savings? I said the point was making a big pile of money so I'd feel safe.

Yeah that was a mistake. Money is a tool. Use it to make your life better. Great uses are experiences with your children, investments in your health, and things that avoid a fight.

#### What would you do for less money?

If you wouldn't take a job for a pay cut, you probably shouldn't take the job.

#### Making more vs spending more

See Parkinson's law, which applies to both time and money. The task you have will expand to all the money (or time) available to it.

### Believing the market only goes up

### Keeping a mortgage you can pay of since interest rates are low

### Timing the markets

Think you have a strategy or know something professional traders don't? I'm skeptical, and the base rates are against you. This is especially confusing when the markets are out performing.

The correct strategy is buying no load broad spectrum index funds.

Remember:

> Time in market beats timing the market.
