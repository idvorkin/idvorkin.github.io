---
layout: post
title: "Tax and Saving"
author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: /money
imagefeaturelocal: raccoon-money.webp
redirect_from:
  - /taxes
  - /saving
  - /savings
---

Most of the tax information on the web is a mess. It's confusing as it tries to apply to everyone, with varying situations, and is often written by non-engineers for non-engineers. I think my tax situation is common to people who have been in software engineering companies for most of their careers, and here are my notes

{% include local_image_float_right.html src="raccoon-money.webp" %}

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Assumptions and Hannah](#assumptions-and-hannah)
- [This one small trick can save half your net worth.](#this-one-small-trick-can-save-half-your-net-worth)
- [IRAs Non-Taxable Saving Accounts](#iras-non-taxable-saving-accounts)
  - [Taxable income, and capital gains](#taxable-income-and-capital-gains)
  - [Should I hold my high risk/high return investments in my taxable or non-taxable accounts?](#should-i-hold-my-high-riskhigh-return-investments-in-my-taxable-or-non-taxable-accounts)
  - [My high risk investments are already in non-taxable, should I sell them and swap them with my taxable account?](#my-high-risk-investments-are-already-in-non-taxable-should-i-sell-them-and-swap-them-with-my-taxable-account)
  - [IRAs vs 401Ks](#iras-vs-401ks)
  - [RMDs Required Minimum Distributions](#rmds-required-minimum-distributions)
  - [IRA vs Roth IRA](#ira-vs-roth-ira)
  - [IRA and Roth IRA contribution limits](#ira-and-roth-ira-contribution-limits)
  - [Back door Roth](#back-door-roth)
  - [The pro-Rata rule](#the-pro-rata-rule)
  - [529s](#529s)
- [Stock Concentration Risk and Strategies](#stock-concentration-risk-and-strategies)
  - [The RSU Trap: How You Became Overweight on Company Stock](#the-rsu-trap-how-you-became-overweight-on-company-stock)
  - [Dealing with a Concentrated Meta Stock Position: Timing Your Capital Gains](#dealing-with-a-concentrated-meta-stock-position-timing-your-capital-gains)
  - [Risk Management Strategies](#risk-management-strategies)
    - [Buying Put Options for Protection](#buying-put-options-for-protection)
    - [Collars: Making Protection Affordable](#collars-making-protection-affordable)
    - [Exchange Funds for Diversification](#exchange-funds-for-diversification)
- [Weird things](#weird-things)
- [Tracking](#tracking)
  - [Daily Expenses](#daily-expenses)
  - [Retirment Planning](#retirment-planning)
- [Rates Taxes and Savings](#rates-taxes-and-savings)
  - [Marginal vs Average Tax Rate](#marginal-vs-average-tax-rate)
  - [Short vs Long term capital gains](#short-vs-long-term-capital-gains)
  - [Washington State Capital Gains Tax](#washington-state-capital-gains-tax)
  - [Cash positions and high yield savings](#cash-positions-and-high-yield-savings)
  - [No load index funds and ETFs](#no-load-index-funds-and-etfs)
  - [Health Insurance](#health-insurance)
    - [ACA Marketplace](#aca-marketplace)
    - [COBRA](#cobra)
    - [Medicare](#medicare)
  - [Stock options](#stock-options)
    - [Sell a Put Option](#sell-a-put-option)
    - [Buy a Put Option](#buy-a-put-option)
    - [Uncovered vs Covered](#uncovered-vs-covered)
    - [Selling your options early](#selling-your-options-early)
    - [Put vs Call](#put-vs-call)
    - [Play safe - Guaranteed minimum value of unvested stock awards - buy a put](#play-safe---guaranteed-minimum-value-of-unvested-stock-awards---buy-a-put)
    - [The company can't go up that high - sell a put](#the-company-cant-go-up-that-high---sell-a-put)
    - [Summary](#summary)
- [Philosophy](#philosophy)
  - [The point of money](#the-point-of-money)
  - [Retirment Ideas](#retirment-ideas)
  - [What would you do for less money?](#what-would-you-do-for-less-money)
  - [Making more vs spending more](#making-more-vs-spending-more)
  - [Does money make you happy?](#does-money-make-you-happy)
  - [Believing the market only goes up](#believing-the-market-only-goes-up)
  - [Keeping a mortgage you can pay of since interest rates are low](#keeping-a-mortgage-you-can-pay-of-since-interest-rates-are-low)
  - [Generational wealth and camels](#generational-wealth-and-camels)
  - [Timing the markets](#timing-the-markets)
  - [The 3 types of rich](#the-3-types-of-rich)
  - [How to trade money for happiness](#how-to-trade-money-for-happiness)
  - [The unquenchable thirst](#the-unquenchable-thirst)
  - [Financial Diabetes: Managing Financial Health](#financial-diabetes-managing-financial-health)
  - [Financial Diabetes Complications](#financial-diabetes-complications)
- [Other questions](#other-questions)
  - [How much is 1%](#how-much-is-1)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Assumptions and Hannah

You're in the same boat as Hannah. A normal software engineer at big companies with the standard setup. Her company has a 401k. She makes more then she can contribute to a Roth IRA and Tax law is accurate to circa 2019.

**Hannah** assumptions:

- Has a 401k with her company which she maxes annually
- Ineligible for Roth deductions
- Marginal tax rate of 35%
- Long Term Capital Gains Rates of 15%

## This one small trick can save half your net worth.

Marriage counseling. Let's be honest, a divorce can cost you half your net worth or more. Studies show that divorced individuals experience an average wealth decline of 77% compared to those who remain married. Beyond the direct division of assets, there are additional costs:

Investing in quality marriage counseling ($150-250 per session) is a bargain compared to these costs. Even an expensive counseling program at $5,000 represents just a fraction of potential divorce expenses. More importantly, counseling can help preserve not just your wealth but the relationship that matters to you.

The financial return on investment for successful marriage counseling might be the highest of any financial decision you'll ever make. And unlike other financial strategies, this one likley has the highest impact on your wellbeing.

{%include summarize-page.html src="/partner-trouble"%}

## IRAs Non-Taxable Saving Accounts

An IRA is an account that grows tax free. The critical value of the IRA is the tax free growth. With money not in an IRA you have to pay tax twice 1) when you make the money 2) when the money grows.

IRAs have contribution limits, X, Y, Z

IRAs early withdrawal penalties

IRAs hardship withdrawal

TODO show calculation for Roth growth

TODO show calculation for IRA growth

### Taxable income, and capital gains

Income is the money you make. That starts by being your wages, but as you get assets like stocks, bonds and houses, things get a big more complex. Let start with easy sources of income:

Wages + Bonus: What you're paid at work, you pay the marginal tax rate.
Interest on Savings and Bonds and Stock Dividends: What you're paid to hold an investment (to assume the risk), you pay the marginal tax rate.

Capital Gains: If you have assets (houses, shares of companies), you may not get interest, but the asset can appreciate. You need to pay tax on those gains. In general capital gains can be short (STCG) or long term (LTCG), with short term being at the marginal tax rate, and long term having a tax benefits (Hannah: 15% LTCG, vs 34% marginal tax rate).

When retired, you need to get money out of your savings, which you can do by taking interest/dividends or by selling assets. When selling assets, you pay capital gains. This begs a questions, should you keep your capital gains inside or outside your IRAs (where they have tax free growth). Turns out

### Should I hold my high risk/high return investments in my taxable or non-taxable accounts?

### My high risk investments are already in non-taxable, should I sell them and swap them with my taxable account?

### IRAs vs 401Ks

A 401k is a special IRA that is setup by your employee that has matching (good thing) but usually less choices of what you can invest in (bad thing). Otherwise, its a regular IRA.

### RMDs Required Minimum Distributions

Once you turn 73, the IRS requires you to start taking Required Minimum Distributions (RMDs) each year from traditional retirement accounts like IRAs and 401(k)s. Your RMD is calculated by dividing your account balance at the end of the previous year by a life expectancy factor from IRS tables. For example, at age 73, the divisor is 26.5, so a $5 million balance would result in a required withdrawal of about $188,679 ($5,000,000 / 26.5). Failing to take your RMD on time can lead to steep penalties, so it's essential to plan ahead and integrate RMDs into your overall retirement income strategy.

### IRA vs Roth IRA

IRA you pay no tax on the way in, but you pay tax on the way out. By contrast with Roth you pay tax before making a contribution, but then pay no tax on the way out.

Assuming your tax rate is the same, it doesn't matter which you choose. If your tax rate goes up post retirement, you're better off with a Roth, and if your tax rate goes down, you're better off with an IRA. A few notes:

1. Your tax rate can go up by moving to a state with higher state taxes (e.g. From WA w/0% state tax to HI w/TK% state tax).
2. If you've saved a lot, your marginal tax rate might be the same, but your average tax rate (which will be on your retirement withdrawals) is most likely lower.

### IRA and Roth IRA contribution limits

You're limited to how much you can put in your IRA and Roth. Odds are you can't put money into your Roth IRA because you make to much.

### Back door Roth

Tax law is goofy. You can't deposit money into a ROTH since you're over the limit, but you can take money from your IRA and convert into a Roth IRA. But there's a rub - the Pro-Rata rule.

### The pro-Rata rule

Even though you are using after tax dollars to transfer money to the Roth IRA, you can't do the math like that. The rules (arbitrary) state that the money you take over is in the ratio of your IRA before and after tax contribution.

### 529s

An education only after tax savings account. You put in money after tax, get tax free growth, and can use distributions for your kid or grand kids education.

## Stock Concentration Risk and Strategies

### The RSU Trap: How You Became Overweight on Company Stock

Here's how it happens: You join a tech company. Every quarter, you get RSUs that vest. The stock price goes up 2x, 3x, maybe 5x over a few years. You're sitting on a goldmine, so you hold. "Why sell a winner?" you think. Fast forward a few years, and suddenly 60-80% of your net worth is tied up in one company's stock.

This is the **RSU trap** - a situation that feels great when the stock is rising but creates enormous concentration risk. You didn't intend to put all your eggs in one basket, but market appreciation made the decision for you.

**Why this is dangerous:**

- **Single point of failure**: Your job, your health insurance, your stock options, and your savings are all tied to one company
- **Volatility amplification**: A 30% stock drop doesn't just hurt your portfolio - it devastates your net worth
- **Career correlation**: If the company struggles, you might face both job cuts AND portfolio losses simultaneously
- **Opportunity cost**: Money locked in one stock can't be diversified into other investments

**The psychology working against you:**

- **Loss aversion**: Selling feels like "locking in" gains and missing future upside
- **Anchoring bias**: You anchor to the highest price you've seen ("It was $400, now it's only $350")
- **Endowment effect**: You feel like you "own" this stock and it's special
- **Tax avoidance**: The capital gains bill feels painful, so you delay

**The math that matters:**

Let's say you have $2M in company stock that cost you $200K (a 10x gain). The capital gains tax on $1.8M might be $400K. That sounds enormous, but consider:

- **Diversified $1.6M** (after taxes) in a broad market portfolio has historically been less risky than **$2M concentrated** in one stock
- You're trading a 20% tax hit for an 80% reduction in concentration risk
- If the stock drops 50%, your $2M becomes $1M - worse than paying the $400K tax

### Dealing with a Concentrated Meta Stock Position: Timing Your Capital Gains

Suppose you have a large amount of Meta stock, and nearly all of it is unrealized capital gains. This is a classic tech employee problem: you've accumulated a big position, but now you have to decide when to sell and realize those gains.

The core dilemma:

- **Sell now** while you're working, earning a high salary, and in the top tax bracket (federal + WA state capital gains)?
- **Wait until you retire** (or take a break), when your ordinary income drops and you can control how much capital gains you realize each year?

If long-term capital gains are your only income, you can use the standard deduction to further reduce your taxable income. For 2024, the standard deduction for married filing jointly is $29,200. The 0% federal long-term capital gains rate applies up to $94,050 of taxable income (after the standard deduction). This means you could sell over $120,000 of appreciated stock and pay no federal tax on those gains if you have no other income.

However, in practice, most people will have at least some dividend or interest income from fixed income positions (like bonds, CDs, or high-yield savings). These count toward your taxable income and reduce the amount of capital gains that can be taxed at the 0% rate. Be sure to include all sources of income when planning your withdrawals and tax strategy.

The raw numbers - total taxes paid

| Income /Salary | Cap Gain Sales | Average Tax Rate on Cap Gains | Marginal Tax Rate on Cap Gains | Comments                                                                                                                              |
| -------------: | -------------: | ----------------------------: | -----------------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|       $600,000 |       $200,000 |                         23.8% |   23.8% (20% LTCG + 3.8% NIIT) | High salary, gains are LTCG but taxed at top LTCG+NIIT rates due to income stacking                                                   |
|        $50,000 |       $120,000 |                          8.8% |                            15% | $50K ordinary income uses up part of 0% LTCG bracket; only ~$70K of gains at 0%, rest at 15%                                          |
|        $50,000 |       $200,000 |                         11.3% |                            15% | $50K ordinary income uses up 0% LTCG bracket; first ~$70K of gains at 0%, next $130K at 15% (federal), all below WA exemption         |
|        $50,000 |       $300,000 |                         13.2% |      15% Fed, 7% WA over $270K | $50K ordinary income uses up 0% LTCG bracket; first ~$70K of gains at 0%, next $230K at 15% (federal), $30K above WA exemption at 7%  |
|        $50,000 |       $400,000 |                         15.4% |      15% Fed, 7% WA over $270K | $50K ordinary income uses up 0% LTCG bracket; first ~$70K of gains at 0%, next $330K at 15% (federal), $130K above WA exemption at 7% |

_Average Tax Rate on Cap Gains: Total tax paid (federal + WA) divided by cap gains sold. Marginal Tax Rate on Cap Gains: Highest rate applied to the last dollar of cap gains (federal and/or WA). All scenarios assume long-term capital gains (LTCG); however, with high salary, LTCG are taxed at the top LTCG rate (20%) plus 3.8% NIIT due to income stacking. The $50K income scenarios show how ordinary income reduces the amount of cap gains eligible for the 0% LTCG rate._

_In the $600K salary scenario, the $200K of gains are LTCG, but are taxed at 20% plus 3.8% NIIT ($47,600). Adjust for your actual bracket and NIIT applicability._

### Risk Management Strategies

When you're sitting on a concentrated position, you have several tools beyond just "sell it all and pay the taxes." Here are sophisticated strategies that can help manage risk while controlling tax timing:

#### Buying Put Options for Protection

**How it works**: Buy put options on your company stock to create a "floor" - a guaranteed minimum sale price even if the stock crashes.

**Example**: You own $2M in company stock currently trading at $400/share. You buy put options with a $350 strike price expiring in 6 months for $15/share. If the stock drops to $300, you can exercise your put and sell at $350, limiting your loss to $50/share plus the $15 option cost.

**Pros:**
- Caps your downside risk while maintaining upside potential
- No immediate tax consequences
- Can be renewed or adjusted as needed

**Cons:**
- Costs money upfront (premium decay if stock doesn't drop)
- Only provides protection for the option duration
- May trigger "constructive sale" rules if strike is too close to current price

#### Collars: Making Protection Affordable

**How it works**: Combine buying a put (protection) with selling a call (give up some upside) to reduce or eliminate the net cost.

**Example**: Same $400 stock. Buy a $350 put for $15, sell a $450 call for $16. Net cost: -$1 (you actually receive $1). You're now protected below $350 but give up gains above $450.

**The sweet spot**: You keep gains between $350-$450 while being protected from major losses and paying almost nothing for the protection.

**Variations:**
- **Zero-cost collar**: Adjust strikes so call premium exactly pays for put premium
- **Partial collar**: Only collar a portion of your holdings
- **Rolling collar**: Renew with new strikes as stock price moves

**Tax considerations**: Generally doesn't trigger immediate taxes, but complex rules apply for collars lasting more than 30 days.

#### Exchange Funds for Diversification

**How it works**: Pool your concentrated single stock with other investors' concentrated positions to create instant diversification without triggering capital gains.

**Requirements:**
- Min Investment: $1 million in a single stock
- Min Hold Time: 7 years to avoid triggering taxes
- Must be publicly traded stock with sufficient liquidity

**The process:**
1. Contribute your stock to the exchange fund
2. Receive partnership units representing a diversified basket
3. After 7 years, you can withdraw a diversified portfolio
4. Your original cost basis is preserved and spread across the basket

**Pros:**
- Immediate diversification without tax hit
- Professional management during the holding period
- Maintains cost basis for future tax planning

**Cons:**
- Long 7-year lockup period
- High minimum investment
- Management fees (typically 1-2% annually)
- Limited liquidity during holding period
- Fund performance may lag concentrated position if your stock outperforms

**When it makes sense**: Best for very large positions ($2M+) where the concentration risk outweighs the lockup constraints and fees.

## Weird things

## Tracking

### Daily Expenses

Back in the day mint was great, but now, I use [Monarch Money](https://www.monarchmoney.com/). Took me a couple days to setup, and so far it's been great!

I use:

- Monarch Money
- It can sync to my apple card
- Monarch now has an Amazon Importer

I also pay all my credit cards and mortgages from a single account - so that's my source of truth to make sure I'm not missing major stuff (and boy I often am).

### Retirment Planning

Check out Boldin

## Rates Taxes and Savings

### Marginal vs Average Tax Rate

Taxes are like a step function. From 0 - K1 you pay rate t1, From K1 - K2 you pay rate t2, etc. The marginal tax rate is how much tax you pay on every extra dollar make, E.g. the tax rate in the maximum step. By contrast, your average tax rate is the total taxes/total income, which can be significantly less then the marginal tax rate depending on how far over the step function you are.

{%include blob_image.html src="taxrate.jpeg" %}

### Short vs Long term capital gains

Short term capital gains are the same as income, but long term capital gains (assets held longer then a year) are taxed at a lower rate:

Below is tax rate by income in 2020.

| Tax Rate | Married Filing Joiningly |
| -------- | ------------------------ |
| 15%      | Up to 488K               |
| 20%      | Above 488K               |

### Washington State Capital Gains Tax

Annoyingly for me, WA has a state capital gains tax:

- The first $270,000 of annual long-term capital gains is exempt from the tax.
- Gains between $270,001 and $1,270,000 are taxed at 7%.
- Gains exceeding $1,270,000 are taxed at 9.9%, which includes a new 2.9% surtax on gains over $1 million above the exemption.

This tax applies to individuals, including those with ownership interests in pass-through or disregarded entities that sell or exchange long-term capital assets. However, several types of assets are exempt from this tax, including:

- Real estate
- Retirement accounts

### Cash positions and high yield savings

Often, we think about holding cash, and think about holding it in a place with no interest. Keep this money in high yield bank accounts, which can give [close to 2% (as of Dec '19)](https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts)
At Fidelity you can keep your core cash in a liquid low risk mutual fund [SPAXX](https://fundresearch.fidelity.com/mutual-funds/summary/31617H102), however this has a 0.42% expense ratio, which will eat 25% - 50% of your earned interest.

### No load index funds and ETFs

Funds with zero or almost zero fees. Usually a broad index fund like Fidelity's FZROX and FZILX or an ETF like VTI and ITOT (Note these ETFs have a 0.03% fee, or 300/1,000,000).

ETFs and Mutual Funds (MF) differ primarily in how they handle [Capital Gains and Dividends](https://www.bogleheads.org/forum/viewtopic.php?t=296821).

With an ETF, you pay all capital gains when you sell, meaning you have control to avoid short term capital gains, and potentially long term capital gains when you're at 20% (vs 15%).

With MFs they need to have a capital gains distribution annually as they re-balance the fund. This matters because you need to pay the capital gains on behalf of the mutual fund at distribution time. The capital gains might be short term depending on when the fund bought and sold individual stocks.

Digging a bit deeper, it seems like there are Mutal Fund strategies to [avoid capital gains distributions](https://www.bloomberg.com/graphics/2019-vanguard-mutual-fund-tax-dodge/), but I didn't make the time to understand how effective they are. If I understand this correctly, its possible FZROX is using a similar strategy as there were [no capital gains distributions in 2020](https://www.wsj.com/market-data/quotes/mutualfund/FZROX), though there were in 2018-2019.

It seems both ETFs and MFs need to distribute dividends, which are often taxed as income. I don't understand why they can't directly re-invest it.

### Health Insurance

TL;DR: If you're computing expenses for when you're not working, you probably skipped health care. Add $35k/year for your family of 4.

At Meta, my health insurance is 40k (Meta puts up 35K, I put up 5k). I can probably get that lowered to mid 30s by switching to a silver plan - but this is still one of my top expenses

Health insurance is one of those things you probably don't think much about—until you have to. If you've always had a job with benefits, it's easy to assume your coverage is just another line on your paycheck. But the reality is, health insurance is one of the biggest (and most invisible) expenses in your financial life. Lose your job, go independent, or retire early, and suddenly you're staring at the full sticker price—and it's a shocker.

Most people underestimate how much their employer is actually paying for their coverage behind the scenes. Understanding the true cost of health insurance is crucial for anyone planning a career break, early retirement, or just wanting to get a handle on their real financial picture.

#### ACA Marketplace

The ACA Marketplace ("Obamacare") is where you go if you need to buy your own health insurance. Plans are grouped into metal tiers (Bronze, Silver, Gold, Platinum), with Silver being the benchmark for subsidies.

**Example: Family of 4, both adults age 50, living in Washington (2025):**

- Sticker price for a Silver plan: ~$28,000/year ($2,350/month)

But most people pay much less, thanks to income-based subsidies:

- **$150K income:** ~$8,500/year ($710/month)
- **$250K income:** ~$17,000/year ($1,420/month)
- **$350K income:** ~$25,000/year ($2,080/month)

(These are estimates; actual costs vary by county and plan. Use the [KFF calculator](https://www.kff.org/interactive/subsidy-calculator/) for your situation.)

- If your income is under 150% FPL, you may pay $0 for a Silver plan.
- If your income is over $350K, you'll likely pay full price (no subsidy).

**But it's not just about the premium.** ACA plans also have:

- **Deductibles:** The amount you pay out-of-pocket before insurance starts covering most costs. For Silver plans, this can be $5,000–$10,000 per year for a family.
- **Co-pays:** Fixed amounts you pay for certain services (e.g., $30 for a doctor visit, $50 for a specialist).
- **Co-insurance:** A percentage you pay for care after the deductible (e.g., 20% of the bill).
- **Out-of-pocket maximum:** The most you'll pay in a year (often $15,000–$18,000 for a family on a Silver plan). After you hit this, insurance covers 100% of covered services.

If you have frequent care needs—like regular physiotherapy, psychiatry, or ongoing prescriptions—your total annual cost can be much higher than just the premium. It's important to look at all these numbers, not just the monthly payment, when budgeting for health care.

#### COBRA

COBRA lets you keep your employer's health plan for up to 18 months after you leave your job. The catch? You pay the full cost—your part plus your employer's—plus a 2% admin fee. For many tech jobs, this means $2,000–$3,500/month for a family plan. It's expensive, but it's the easiest way to avoid a coverage gap if you're between jobs or waiting for a new plan to start.

- COBRA is usually best for short transitions (e.g., between jobs, or if you're in the middle of treatment and want to keep your doctors).
- For longer gaps, compare COBRA to ACA Marketplace plans—Marketplace is often much cheaper, especially if your income drops.

#### Medicare

Medicare is the federal health insurance program for people 65+ (and some younger people with disabilities). It's not free, but it's much cheaper than private insurance at that age.

**2025 Medicare costs:**

- **Part A (hospital):** Free for most (if you or your spouse worked 10+ years). Otherwise, up to $518/month.
- **Part B (doctor/outpatient):** $185/month standard premium (higher if your income is above $106K single/$212K married). Annual deductible: $257.
- **Part D (prescription drugs):** Varies by plan, but most pay $30–$50/month. Higher-income folks pay a surcharge.
- **Medicare Advantage (Part C):** Bundled plans with varying costs and coverage; you still pay Part B premium.
- **Medigap:** Optional supplemental insurance to cover what Medicare doesn't; cost varies by plan and location.

Medicare doesn't cover everything (e.g., dental, vision, long-term care), so most people buy a supplemental plan (Medigap or Advantage). If you're approaching 65, plan ahead for the transition—there are deadlines and penalties for late enrollment.

### Stock options

I keep getting these words confused, here are my notes in case they are helpful to others. For these examples assume today a stock is 100\$, and your options are for 30 days. In our example we'll buy 1 option, but the standard size is 100 options.

#### Sell a Put Option

You guarantee to "buy at a particular price". You will be given a low amount of money to guarantee you'll buy at a particular price. This lets you make money if a stock rises.

Imagine you sell a put for 1$, for a strike price of 100$.

If the stock goes to 90$ in 30 days, the "put will be exercised", and you'll need to buy the stock for 100$. As a result, you'll end buying the stock for 100$ instead of 90$ which is the market price. This means you bought stock for an extra 10$ (recall the stock is worth 90$ today), but since you were paid 1$ for the put it ended up \*\*costing you 9$\*\*.

If the stock goes up to 120$, the buyer won't want to sell you the stock at 100$ (they'd lose 20$), so they let the put expire. This lets you **gain 1$\*\* over the price of the stock.

#### Buy a Put Option

Allow you to "sell at a particular price". You spend a low amount of money to be able to sell at a price. This protects you from a price drop.

Imagine you buy a put for 1$, for a strike price of 100$.

If the stock goes to 90$ in 30 days, you can "exercise the put" and sell the stock for 100$, making you 10$, for a price of 1$, **netting you 9\$**.

If the stock goes up to 110$, you don't want to sell at 100$ (you'd lose 10$), so you let the put expire. This lets you ensure you won't lose any money (recall the option was at the strike price) **costing you 1$\*\*

NOTE: You don't need to own the stock to be able to make money in a put, in our example where the stock drops to 90$, you'd buy the stock at 90 for market price, and sell it for 100$, again **netting you 9\$**

#### Uncovered vs Covered

As with buying a put option, you don't need to own the stock to sell the option (this is an uncovered put), however this can cost you a lot of money. Imagine you sold a put option for 1$, but the stock drops 85$ to 15$, at this point you need to buy the stock for 15$, and then sell it for 100$, when this happens you'll lose 85, and gain 1$, giving a **net loss of 84\$**.

#### Selling your options early

You don't need hold a put or call option for the entire duration, you can sell it early. This lets you tune your risk for reward early.

#### Put vs Call

Call is the inverse of puts, where you buy the right to "buy", and sell the right to "sell". see the table below.

#### Play safe - Guaranteed minimum value of unvested stock awards - buy a put

Imagine you have an grant of 100 stock awards, vesting in a year, for which you had a 10$ strike price - you then have 1000$ in paper money. You'll need that money for your kids education, so you need to guarantee you don't lose money, in that case, but a put.

#### The company can't go up that high - sell a put

Imagine you have an grant of 100 stock awards, vesting in a year, for which you had a 10$ strike price - you then have 1000$ in paper money. You know the CEO and even though you think the stock will go up, you're sure it won't go up above 15$, in that case you can sell a put at 15$, and take some profit.

#### Summary

Imagine a 100$ stock, for which you buy/sell a put/call for 1$ with a strike price of 100\$.

| Type | Direction | You       | Price = 110 | Price = 90 |
| ---- | --------- | --------- | ----------- | ---------- |
| Sell | Put       | Must Sell | Gain 1\$    | Lose 9\$\* |
| Buy  | Put       | Can Sell  | Lose 1\$    | Gain 9\$\* |
| Sell | Call      | Must Buy  | Lose 9\$    | Gain 1\$   |
| Buy  | Call      | Can Buy   | Gain 9\$    | Lose 1\$   |

(\*) Even though these are listed at 10$, the loss/gain is unbounded, so if the stock went up 99$ or down 99\$ that would be what you need to pay.

## Philosophy

### The point of money

When seeing a financial planner, they asked me - what is the point of your savings? I said the point was making a big pile of money so I'd feel safe.

Yeah that was a mistake. Money is a tool. Use it to make your life better. Great uses are experiences with your children, investments in your health, and things that avoid a fight.

### Retirment Ideas

- [Why don't you retire already](https://medium.com/@docjamesw/why-dont-you-fucking-retire-already-3c47a039897c) - An interesting take that you should retire as a sign of goodwill to the future generation.
- Don't focus on retirement, focus on financial independance (FI). FI gives you freedom and comfort regardless of your job.

### What would you do for less money?

If you wouldn't take a job for a pay cut, you probably shouldn't take the job.

### Making more vs spending more

See [Parkinson's law](/parkinson), which applies to both time and money. The task you have will expand to all the money (or time) available to it.

### Does money make you happy?

Famous study, saying after 75K (maybe 200K now), extra money doesn't make you happy. However, turns out that was flawed, the better model, whci I buy is more money is log linear to happiness.

E.g. every 10x inecease in money 2x in happiness. So going from 100K to 1M only doubles your happiness.

Fascinating, the impact of log linear money depends on your happiness [paper](https://github.com/idvorkin/blob/blob/master/papers/money-vs-happiness.pdf)

### Believing the market only goes up

{%include blob_image.html src="gdp-delta-1960-2020.png" %}

### Keeping a mortgage you can pay of since interest rates are low

### Generational wealth and camels

_My grandfather rode a camel, my father rode a camel, I drive a Mercedes, my son drives a Land Rover, his son will drive a Land Rover, but his son will ride a camel - Sheikh Rashid bin Saeed Al Maktoum_

What a great line. Difficulty breeds strength, which translates to an easy time for the kids, which leads to weakness, which leads to the cycle. Not sure the best way to handle this.

### Timing the markets

Think you have a strategy or know something professional traders don't? I'm skeptical, and the base rates are against you. This is especially confusing when the markets are out performing.

The correct strategy is buying no load broad spectrum index funds.

Remember:

> Time in market beats timing the market.

### The 3 types of rich

1. Rich enough you don't care the price of groceries
1. Rich enough you don't care the price of vacation
1. Rich enough you don't care the price of a car

### How to trade money for happiness

1. Money can lower the unhappiness

Above that. Buying crap won't make you happy

5 things you can do

1. Buy stuff - bringes least happine
2. Buy time - time to spend with people love
3. Buy expeiernces - experiences with people you love.
4. Give it away to others
5. Save it - Makes you feel secure (limited)

### The unquenchable thirst

For the philisophicaly minded, from the [Prophet](https://poets.org/poem/giving-0):

_For what are your possessions but things you keep and guard for fear you may need them tomorrow?_

_And tomorrow, what shall tomorrow bring to the overprudent dog burying bones in the trackless sand?_

_And what is fear of need by need itself? Is not dread of thirst when your well is full, the thirst that is unquenchable?_

### Financial Diabetes: Managing Financial Health

Diabetes is a huge problem in this country, but for kids who grow up privileged, there is another risky disease—**financial diabetes**. Imagine spending as your blood sugar: every extravagant purchase is a sugary spike. **Insulin** as your financial discipline—a built-in sense of the value of money. Those growing up with modest means develop this natural insulin early on, learning to budget and save, keeping their financial sugar levels in check.

Unfortuantely, children born into wealth often miss out on this early training, leaving them prone to wild spending binges that spike their financial sugar without the natural regulatory mechanism.

Over time, these unchecked spikes can lead to serious complications—a credit score crash, dwindling savings, and even a legacy of money mismanagement passed on to the next generation. Yet, unlike actual insulin-dependent diabetes, this financial condition can remain hidden as long as external cash keeps flowing, masking the underlying imbalance. In other words, while a lavish lifestyle may temporarily cover up the symptoms, the absence of a natural fiscal insulin means that when the cash flow stops, the financial consequences can be just as severe.

### Financial Diabetes Complications

Like medical diabetes, financial diabetes leads to numerous complications if left untreated:

1. **Financial Neuropathy**: Just as diabetes can cause nerve damage, financial diabetes leads to a numbing of financial sensitivity. Big purchases no longer register as significant, making it harder to feel the impact of spending decisions.

2. **Lifestyle Creep Hyperglycemia**: Similar to how untreated diabetes leads to chronically high blood sugar, financial diabetes causes "lifestyle creep" where baseline expenses continuously rise, requiring ever-increasing income to maintain.

3. **Inheritance Insulin Resistance**: When wealth passes to the next generation without financial education, children develop resistance to financial discipline, requiring increasingly dramatic interventions to correct spending habits.

4. **Emergency Fund Ketoacidosis**: Just as diabetic ketoacidosis is a dangerous complication of uncontrolled diabetes, the absence of emergency savings creates a dangerous vulnerability where any financial shock can lead to catastrophic consequences.

5. **Delayed Diagnosis Syndrome**: Like undiagnosed diabetes, financial diabetes often remains hidden until a major life event (job loss, retirement) reveals the severity of the condition, when treatment becomes much more difficult.

6. **Financial Retinopathy**: The inability to see long-term financial consequences clearly, similar to how diabetes can damage vision. This manifests as an inability to project how today's spending affects tomorrow's security.

7. **Wealth Wound Healing**: Just as diabetics struggle with wound healing, those with financial diabetes struggle to recover from financial setbacks, taking much longer to rebuild savings after unexpected expenses.

8. **Intergenerational Transmission**: Financial diabetes can be "hereditary" in the sense that parents who never developed financial discipline often fail to instill it in their children, creating a cycle that's difficult to break.

9. **Hedonic Adaptation Hypoglycemia**: The financial equivalent of low blood sugar crashes - when spending no longer provides the same emotional high, leading to increasingly extravagant purchases to achieve the same feeling of satisfaction.

10. **Financial Education Therapy**: Just as diabetes management requires education and lifestyle changes, overcoming financial diabetes requires intentional financial education and the development of new habits - essentially a form of "financial therapy."

## Other questions

- How long should I hold my RSUs before selling?
- If I have a pile of cash from selling RSUs, do I invest immediately or dollar cost average? -
- Should I hold any bonds?
- Where should I keep my emergency fund and how much?

### How much is 1%

From [ChatGPT](https://gist.github.com/idvorkin/df0ec94f8bbadb26d99ebd54b55b6358)

Absoulte

| Year | Top 1% | Top 5% | Top 20% | Top 50% |
| ---- | ------ | ------ | ------- | ------- |
| 2000 | $280K  | $125K  | $65K    | $42K    |
| 2004 | $300K  | $140K  | $72K    | $45K    |
| 2008 | $345K  | $155K  | $78K    | $47K    |
| 2012 | $394K  | $173K  | $91K    | $51K    |
| 2016 | $450K  | $195K  | $100K   | $58K    |
| 2020 | $531K  | $220K  | $110K   | $68K    |
| 2024 | $632K  | $250K  | $120K   | $81K    |

Relative

| Year | % Gain 1%      | % Gain 5%     | % Gain 20%    | % Gain 50%    |
| ---- | -------------- | ------------- | ------------- | ------------- |
| 2000 | —              | —             | —             | —             |
| 2004 | 7.1% (7.1%)    | 12.0% (12.0%) | 10.8% (10.8%) | 7.1% (7.1%)   |
| 2008 | 15.0% (23.2%)  | 10.7% (24.7%) | 8.3% (20.1%)  | 4.4% (11.8%)  |
| 2012 | 14.2% (41.0%)  | 11.9% (39.3%) | 16.9% (40.0%) | 8.5% (21.3%)  |
| 2016 | 14.2% (62.5%)  | 12.4% (55.6%) | 9.7% (52.7%)  | 12.9% (37.7%) |
| 2020 | 18.0% (94.8%)  | 12.8% (74.0%) | 10.0% (67.9%) | 17.2% (61.7%) |
| 2024 | 18.9% (134.3%) | 13.6% (98.5%) | 9.1% (82.2%)  | 19.4% (91.1%) |

## Other Resources

[Visualizing the worlds money](https://www.visualcapitalist.com/all-of-the-worlds-money-and-markets-in-one-visualization-2020/)

If long-term capital gains are your only income, you can use the standard deduction to further reduce your taxable income. For 2024, the standard deduction for married filing jointly is $29,200. The 0% federal long-term capital gains rate applies up to $94,050 of taxable income (after the standard deduction). This means you could sell over $120,000 of appreciated stock and pay no federal tax on those gains if you have no other income.

However, in practice, most people will have at least some dividend or interest income from fixed income positions (like bonds, CDs, or high-yield savings). These count toward your taxable income and reduce the amount of capital gains that can be taxed at the 0% rate. Be sure to include all sources of income when planning your withdrawals and tax strategy.
