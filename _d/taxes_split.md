---
layout: post
title: "Taxes — Capital Gains, WA State, Step-Up, and QSBS"
author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: /taxes
imagefeaturelocal: raccoon-money.webp
---

Most of the tax information on the web is a mess. It's confusing because it tries to apply to everyone, and it's often written by non-engineers for non-engineers. This post is the taxes-only slice of my notes — capital gains, Washington State cap-gains mechanics, step-up in basis, retirement-account mechanics (IRAs, 401(k)s, Roth, 529s), and related tax-code levers for a software engineer's life.

{% include local_image_float_right.html src="raccoon-money.webp" %}

For RSUs, stock options, metrics, health insurance, and money philosophy, see the companion [money post](/money).

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Hannah — assumptions](#hannah--assumptions)
- [Taxable income, and capital gains](#taxable-income-and-capital-gains)
- [Rates Taxes and Savings](#rates-taxes-and-savings)
  - [Marginal vs Average Tax Rate](#marginal-vs-average-tax-rate)
  - [Short vs Long term capital gains](#short-vs-long-term-capital-gains)
  - [Washington State Capital Gains Tax](#washington-state-capital-gains-tax)
  - [Step-Up in Basis at Death - The Ultimate Tax Escape](#step-up-in-basis-at-death---the-ultimate-tax-escape)
  - [No load index funds and ETFs](#no-load-index-funds-and-etfs)
- [IRAs Non-Taxable Saving Accounts](#iras-non-taxable-saving-accounts)
  - [IRAs vs 401Ks](#iras-vs-401ks)
  - [RMDs Required Minimum Distributions](#rmds-required-minimum-distributions)
  - [IRA vs Roth IRA](#ira-vs-roth-ira)
  - [IRA and Roth IRA contribution limits](#ira-and-roth-ira-contribution-limits)
  - [Back door Roth](#back-door-roth)
  - [The pro-Rata rule](#the-pro-rata-rule)
  - [529s](#529s)
- [Tax-placement Q&A](#tax-placement-qa)
- [Standard deduction + 0% LTCG](#standard-deduction--0-ltcg)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Hannah — assumptions

Everything here assumes you're roughly in Hannah's shoes: a software engineer at a big company, maxing a 401k, earning too much to deduct a Roth, with a 35% federal marginal rate and 15% long-term capital gains rate. Retirement-account mechanics (IRAs, 401(k)s, Roth rules, 529s) are covered below — the RSU grants, stock-option strategy, and money philosophy live on the [money post](/money).

## Taxable income, and capital gains

Income is the money you make. That starts by being your wages, but as you get assets like stocks, bonds and houses, things get a big more complex. Let start with easy sources of income:

Wages + Bonus: What you're paid at work; you pay the marginal tax rate.
Interest on Savings and Bonds and Stock Dividends: What you're paid to hold an investment (to assume the risk); you pay the marginal tax rate.

Capital Gains: If you have assets (houses, shares of companies), you may not get interest, but the asset can appreciate. You need to pay tax on those gains. In general capital gains can be short (STCG) or long term (LTCG), with short term being at the marginal tax rate, and long term having a tax benefits (Hannah: 15% LTCG, vs 34% marginal tax rate).

When retired, you need to get money out of your savings, which you can do by taking interest/dividends or by selling assets. When selling assets, you pay capital gains. This raises a question: should you keep your capital gains inside or outside your IRAs (where they have tax-free growth)?

## Rates Taxes and Savings

### Marginal vs Average Tax Rate

Taxes are like a step function. From 0 - K1 you pay rate t1, From K1 - K2 you pay rate t2, etc. The marginal tax rate is how much tax you pay on every extra dollar make, E.g. the tax rate in the maximum step. By contrast, your average tax rate is the total taxes/total income, which can be significantly less then the marginal tax rate depending on how far over the step function you are.

{%include blob_image.html src="taxrate.jpeg" %}

### Short vs Long term capital gains

Short-term capital gains are the same as income, but long-term capital gains (assets held longer than a year) are taxed at a lower rate:

Below is tax rate by income in 2020.

| Tax Rate | Married Filing Jointly |
| -------- | ---------------------- |
| 15%      | Up to 488K             |
| 20%      | Above 488K             |

### Washington State Capital Gains Tax

Washington has a state-level long-term capital gains tax, enacted by [ESSB 5096 (2021)](https://lawfilesext.leg.wa.gov/biennium/2021-22/Pdf/Bills/Session%20Laws/Senate/5096-S.SL.pdf) and upheld as an excise tax — not an income tax — by the WA Supreme Court in [Quinn v. State (2023)](https://www.courts.wa.gov/opinions/pdf/1004200.pdf). The 2.9% surcharge tier was added by [ESSB 5813 (2025)](https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bill%20Reports/Senate/5813-S.E%20SBR%20FBR%2025.pdf), retroactive to Jan 1, 2025. Current schedule (2026, indexed annually):

| Annual LTCG (after exemption)      | WA rate                    |
| ---------------------------------- | -------------------------- |
| $0 – $278,000 (standard deduction) | 0%                         |
| $278,001 – $1,278,000              | 7%                         |
| $1,278,001+                        | 9.9% (7% + 2.9% surcharge) |

Authority: [RCW 82.87](https://app.leg.wa.gov/RCW/default.aspx?cite=82.87) · [WA DOR — Capital Gains Tax](https://dor.wa.gov/taxes-rates/other-taxes/capital-gains-tax) · [WA DOR — Tiered rates special notice](https://dor.wa.gov/forms-publications/publications-subject/special-notices/new-tiered-rates-washingtons-capital-gains-tax).

The tax applies to individuals, including those with ownership interests in pass-through or disregarded entities that sell or exchange long-term capital assets. Key exemptions:

- Real estate (separately covered by the real-estate excise tax)
- Retirement accounts (IRAs, 401(k)s) and assets held inside them
- Some family-owned small business stock, timber, livestock, commercial fishing privileges

Note: WA does **not** conform to the federal [§1202 QSBS exclusion](https://www.irs.gov/pub/irs-drop/rr-98-41.pdf) — qualifying small-business-stock gains are federally excluded but still fully WA-taxable.

**Hypothetical worked example** — a married-filing-jointly household already above the [$250K NIIT threshold](https://www.irs.gov/individuals/net-investment-income-tax) on wages, so NIIT applies to the full gain. Federal LTCG at 20% (top bracket, MFJ > [$613,700 taxable income](https://www.irs.gov/taxtopics/tc409)) + 3.8% NIIT = 23.8%. Realizations chosen to sit **at or just past the WA step-function kinks** so the marginal bite is visible:

| LTCG realized | Where it sits                                       | Federal (23.8%) | WA state                            | Total    | Effective | Marginal at this tier |
| ------------- | --------------------------------------------------- | --------------- | ----------------------------------- | -------- | --------- | --------------------- |
| $278,000      | At the WA exemption ceiling — last dollar free      | $66,164         | $0                                  | $66,164  | 23.8%     | 23.8%                 |
| $300,000      | $22K past the first kink — 7% bites on the excess   | $71,400         | ($300K − $278K) × 7% = $1,540       | $72,940  | 24.3%     | **30.8%** (+7% WA)    |
| $1,278,000    | At the 9.9% surcharge threshold — last dollar at 7% | $304,164        | ($1,278K − $278K) × 7% = $70,000    | $374,164 | 29.3%     | **30.8%**             |
| $1,300,000    | $22K past the surcharge — 9.9% bites on the excess  | $309,400        | $70,000 + ($22K × 9.9%) = $72,178   | $381,578 | 29.4%     | **33.7%** (+9.9% WA)  |
| $2,000,000    | Well past the surcharge — 9.9% sustained over $722K | $476,000        | $70,000 + ($722K × 9.9%) = $141,478 | $617,478 | 30.9%     | **33.7%**             |

Two step-functions to notice:

- **NIIT 3.8% at $250K MAGI (MFJ)** — unindexed since enactment, so it triggers for any meaningful LTCG once household MAGI is above the threshold. Baked into the 23.8% federal column above.
- **WA goes 0 → 7% → 9.9%** at $278K and $1.278M. The jump from 23.8% to 30.8% total marginal at the first kink, then 30.8% to 33.7% at the second, is what makes realization-year planning matter.

**Planning implication.** Splitting a $2M realization into two $1M tax years saves the 2.9% surcharge on the ~$722K above $1.278M — roughly $21K/yr. Every dollar above the surcharge kink pays nearly 10% more than the dollar just below it. See [installment sales under IRC §453](https://www.irs.gov/publications/p537) for the standard mechanism to spread across tax years.

**Coming in 2028 — millionaires' income tax.** [ESSB 6346](https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/Session%20Laws/Senate/6346-S.SL.pdf) (signed March 30, 2026) layers a 9.9% state income tax on household income above $1M/yr, effective Jan 1, 2028. MFJ couples share a single $1M deduction (not doubled). Credits against WA cap-gains tax and other states' income tax prevent stacking. A legal challenge is in progress; monitor before 2028 planning.

Sources at the federal layer: [IRS Topic 409 — Capital Gains and Losses](https://www.irs.gov/taxtopics/tc409) · [IRS Topic 559 — Net Investment Income Tax](https://www.irs.gov/individuals/net-investment-income-tax) · [Kiplinger 2026 federal LTCG brackets](https://www.kiplinger.com/taxes/capital-gains-tax/602224/capital-gains-tax-rates).

### Step-Up in Basis at Death - The Ultimate Tax Escape

**TL;DR**: When you die, your heirs inherit assets at current market value with ZERO capital gains tax on all appreciation during your lifetime.

This is one of the most powerful provisions in the U.S. tax code. Your beneficiaries receive a "stepped-up basis" - the tax basis resets to market value on your date of death, completely eliminating capital gains.

**Example:**

- You bought stock for $100K
- Worth $5M at death
- Heirs inherit with $5M basis
- They sell for $5M = **$0 capital gains tax**
- Tax savings: ~$1M vs. selling while alive

**Special Benefits for Spouses in Washington State:**

As a community property state, Washington provides a massive advantage - **BOTH halves** of community property get stepped up when one spouse dies. Your surviving spouse can immediately diversify the entire position tax-free.

- Joint purchase: $200K
- Current value: $2M
- First spouse dies: Entire $2M gets new basis
- Surviving spouse sells: **$0 tax** (saves ~$400K)

**When This Makes Sense:**

- You're 65+ or have health issues
- Have other assets for living expenses
- Estate under $13.61M (2024 exemption)
- Can manage concentration risk

**The "Buy, Borrow, Die" Strategy:**

1. Hold appreciated assets
2. Borrow against them for expenses (loans aren't taxable)
3. Die holding assets (heirs get step-up, sell to repay loans)

**Important Caveats:**

- Estate tax applies over $13.61M
- Doesn't apply to retirement accounts (401k, IRA)
- Stock could crash before death
- Opportunity cost of holding vs. diversifying

Remember: Balance tax optimization with actually living your life. Your heirs would prefer you alive and happy over any tax savings.

### No load index funds and ETFs

Funds with zero or almost zero fees. Usually a broad index fund like Fidelity's FZROX and FZILX or an ETF like VTI and ITOT (Note these ETFs have a 0.03% fee, or 300/1,000,000).

ETFs and Mutual Funds (MF) differ primarily in how they handle [Capital Gains and Dividends](https://www.bogleheads.org/forum/viewtopic.php?t=296821).

With an ETF, you pay all capital gains when you sell, meaning you have control to avoid short term capital gains, and potentially long term capital gains when you're at 20% (vs 15%).

With MFs they need to have a capital gains distribution annually as they re-balance the fund. This matters because you need to pay the capital gains on behalf of the mutual fund at distribution time. The capital gains might be short term depending on when the fund bought and sold individual stocks.

Digging a bit deeper, it seems like there are Mutual Fund strategies to [avoid capital gains distributions](https://www.bloomberg.com/graphics/2019-vanguard-mutual-fund-tax-dodge/), but I didn't make the time to understand how effective they are. If I understand this correctly, its possible FZROX is using a similar strategy as there were [no capital gains distributions in 2020](https://www.wsj.com/market-data/quotes/mutualfund/FZROX), though there were in 2018-2019.

It seems both ETFs and MFs need to distribute dividends, which are often taxed as income. I don't understand why they can't directly re-invest it.

## IRAs Non-Taxable Saving Accounts

An IRA is an account that grows tax-free. The critical value of the IRA is the tax-free growth. With money not in an IRA you have to pay tax twice 1) when you make the money 2) when the money grows.

IRAs have contribution limits, X, Y, Z

IRAs early withdrawal penalties

IRAs hardship withdrawal

TODO show calculation for Roth growth

TODO show calculation for IRA growth

### IRAs vs 401Ks

A 401k is a special IRA that is set up by your employer that has matching (good thing) but usually fewer choices of what you can invest in (bad thing). Otherwise, it's a regular IRA.

### RMDs Required Minimum Distributions

Once you turn 73, the IRS requires you to start taking Required Minimum Distributions (RMDs) each year from traditional retirement accounts like IRAs and 401(k)s. Your RMD is calculated by dividing your account balance at the end of the previous year by a life expectancy factor from IRS tables. For example, at age 73, the divisor is 26.5, so a $5 million balance would result in a required withdrawal of about $188,679 ($5,000,000 / 26.5). Failing to take your RMD on time can lead to steep penalties, so it's essential to plan ahead and integrate RMDs into your overall retirement income strategy.

### IRA vs Roth IRA

IRA you pay no tax on the way in, but you pay tax on the way out. By contrast with Roth you pay tax before making a contribution, but then pay no tax on the way out.

Assuming your tax rate is the same, it doesn't matter which you choose. If your tax rate goes up post retirement, you're better off with a Roth, and if your tax rate goes down, you're better off with an IRA. A few notes:

1. Your tax rate can go up by moving to a state with higher state taxes (e.g. From WA w/0% state tax to HI w/TK% state tax).
2. If you've saved a lot, your marginal tax rate might be the same, but your average tax rate (which will be on your retirement withdrawals) is most likely lower.

### IRA and Roth IRA contribution limits

You're limited to how much you can put in your IRA and Roth. Odds are you can't put money into your Roth IRA because you make too much.

### Back door Roth

Tax law is goofy. You can't deposit money into a ROTH since you're over the limit, but you can take money from your IRA and convert into a Roth IRA. But there's a rub - the Pro-Rata rule.

### The pro-Rata rule

Even though you are using after-tax dollars to transfer money to the Roth IRA, you can't do the math like that. The rules (arbitrary) state that the money you transfer is in the ratio of your IRA before and after-tax contributions.

### 529s

An education-only after-tax savings account. You put in money after tax, get tax-free growth, and can use distributions for your kids' or grandkids' education.

## Tax-placement Q&A

- Should I hold my high risk/high return investments in my taxable or non-taxable accounts?
- My high risk investments are already in non-taxable, should I sell them and swap them with my taxable account?

## Standard deduction + 0% LTCG

If long-term capital gains are your only income, you can use the standard deduction to further reduce your taxable income. For 2024, the standard deduction for married filing jointly is $29,200. The 0% federal long-term capital gains rate applies up to $94,050 of taxable income (after the standard deduction). This means you could sell over $120,000 of appreciated stock and pay no federal tax on those gains if you have no other income.

However, in practice, most people will have at least some dividend or interest income from fixed income positions (like bonds, CDs, or high-yield savings). These count toward your taxable income and reduce the amount of capital gains that can be taxed at the 0% rate. Be sure to include all sources of income when planning your withdrawals and tax strategy.
