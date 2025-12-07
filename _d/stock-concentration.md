---
layout: post
title: "Stock Concentration: How I Learned to Stop Worrying and Love the Capital Gains Tax"

author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: /stock-concentration
imagefeature: https://raw.githubusercontent.com/idvorkin/ipaste/main/20250803_104012.webp
redirect_from:
  - /concentration-risk
  - /rsu-risk
---

When you work at a tech company and receive RSUs, it's easy to accidentally become dangerously concentrated in your company's stock. You didn't mean to bet your entire future on one company, but here you are - watching every earnings call with your stomach in knots because a 30% drop would devastate your net worth. This guide explains the risks and strategies for managing concentrated stock positions - from tax-efficient selling strategies to protective options that cost you nothing, and exchange funds that diversify without triggering taxes.

<div class="alert alert-info" role="alert">
<strong>Tax Assumptions:</strong> All tax calculations in this guide assume married filing jointly and Washington State residency. Your actual rates will vary based on filing status, state of residence, and individual circumstances. Consult a tax professional for personalized advice.
</div>

<div class="alert alert-info" role="alert">
<strong>Interactive Calculator:</strong> Use the <a href="https://tax-calculator-mu-nine.vercel.app/" target="_blank">Tax Calculator</a> to plug in your actual numbers and get personalized tax estimates for your specific situation!
</div>

<figure class="float-end w-50 ms-3 mb-3">
  <img
    src="https://raw.githubusercontent.com/idvorkin/ipaste/main/20250803_104012.webp"
    alt="Market concentration treemap showing the dominance of AAPL, NVDA, MSFT, AMZN, GOOG, META, and TSLA in the index"
    class="img-fluid"
  />
  <figcaption class="text-center small text-muted">S&P 500 market cap allocation - 7 tech stocks dominate nearly 1/3 of the index</figcaption>
</figure>

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [The RSU Trap: How You Became Overweight on Company Stock](#the-rsu-trap-how-you-became-overweight-on-company-stock)
- [Don't Confuse a Good Outcome with a Good Decision](#dont-confuse-a-good-outcome-with-a-good-decision)
- [You're Already Concentrated Enough](#youre-already-concentrated-enough)
- [Watering down your concentration](#watering-down-your-concentration)
- [Risk Management Strategies](#risk-management-strategies)
  - [Buying Put Options for Protection](#buying-put-options-for-protection)
  - [Collars: Making Protection Affordable](#collars-making-protection-affordable)
  - [Exchange Funds for Diversification](#exchange-funds-for-diversification)
- [The Ultimate Tax Escape: Step-Up in Basis](#the-ultimate-tax-escape-step-up-in-basis)
- [Related Articles](#related-articles)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The RSU Trap: How You Became Overweight on Company Stock

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

## Don't Confuse a Good Outcome with a Good Decision

**The most dangerous phrase in investing: "But it worked out great!"**

Just because holding your RSUs made you rich doesn't mean it was a good decision. That's like saying drunk driving was smart because you made it home safely. The risk was always there - you just got lucky.

**The right strategy: Sell RSUs automatically on vest date**

Here's what most people don't understand about RSUs:

1. **RSUs are taxed as ordinary income on vest** - The moment they vest, you owe income tax on the full value. The IRS treats it exactly like your company paid you cash and you immediately bought stock.

2. **There are ZERO capital gains if you sell immediately** - Your cost basis is the vest-date price. Selling the same day means no additional tax beyond what you already owe.

3. **The "one-year hold" confusion** - Many people think they need to hold RSUs for a year to get long-term capital gains treatment. This is wrong! The one-year clock for LTCG starts from the vest date, not the grant date. But more importantly, you've already been taxed at ordinary income rates on the full value at vesting.

**Think of it this way**:

- Day 0 (vest): Stock worth $100K vests. You owe ~$35K in income tax regardless of what you do next.
- Option A: Sell immediately for $100K. Total tax: $35K.
- Option B: Hold for a year. Stock drops to $70K. You still owed $35K in tax on the original $100K. You lost $30K hoping to save on taxes you never would have owed anyway.

**The rational approach**: Set up auto-sale on vest with your broker. Treat RSUs as cash compensation that happens to arrive as stock. If you wouldn't use your entire bonus to buy your company's stock, why would you hold all your RSUs?

**Exception**: If you have insider information suggesting the stock is undervalued, or you're intentionally taking a concentrated bet with money you can afford to lose. But that's gambling, not investing.

## You're Already Concentrated Enough

Look, even if you just hold a broad market index fund, you're already heavily exposed to tech stocks. The S&P 500 and NASDAQ are increasingly dominated by the same companies you work for. The market concentration treemap above shows the uncomfortable truth:

**The good news?** If you diversify and tech stocks crush it, your percentage allocation to tech naturally goes up as those stocks outperform. You'll still capture the upside through your index funds - you just won't be ruined if they crash.

**The bad news?** Adding your company stock on top of an already tech-heavy index means you're doubling down on concentration risk, not diversifying.

**Example portfolio showing tech concentration:**

| Ticker    | Company                 | Portfolio % |
| --------- | ----------------------- | ----------- |
| AAPL      | Apple                   | 9.27%       |
| NVDA      | Nvidia                  | 7.78%       |
| MSFT      | Microsoft               | 7.78%       |
| AMZN      | Amazon                  | 5.83%       |
| AVGO      | Broadcom                | 4.86%       |
| GOOG      | Alphabet Class C        | 3.89%       |
| META      | Meta Platforms          | 3.89%       |
| **Total** | **Top 7 Tech Holdings** | **43.30%**  |

This portfolio shows how even a "diversified" portfolio can end up with nearly half its value (43.30%) concentrated in just 7 tech stocks, with the top 3 alone representing almost 25% of total portfolio value.

**The NASDAQ is even worse:**

- Top 10 stocks represent ~50% of the NASDAQ-100
- Your FANG employer could be 5-15% of the index
- Tech correlation approaches 80-90%

## Watering down your concentration

Suppose you have a large amount of Meta stock, and nearly all of it is unrealized capital gains. This is a classic tech employee problem: you've accumulated a big position, but now you have to decide when to sell and realize those gains.

The core dilemma:

- **Sell now** while you're working, earning a high salary, and in the top tax bracket (federal + WA state capital gains)?
- **Wait until you retire** (or take a break), when your ordinary income drops and you can control how much capital gains you realize each year?

If long-term capital gains are your only income, you can use the standard deduction to further reduce your taxable income. For 2024, the standard deduction for married filing jointly is $29,200. The 0% federal long-term capital gains rate applies up to $94,050 of taxable income (after the standard deduction). This means you could sell over $120,000 of appreciated stock and pay no federal tax on those gains if you have no other income.

However, in practice, most people will have at least some dividend or interest income from fixed income positions (like bonds, CDs, or high-yield savings). These count toward your taxable income and reduce the amount of capital gains that can be taxed at the 0% rate. Be sure to include all sources of income when planning your withdrawals and tax strategy.

The raw numbers - total taxes paid

<div class="alert alert-success" role="alert">
💡 <strong>Calculate your own scenario:</strong> Use the <a href="https://tax-calculator-mu-nine.vercel.app/" target="_blank">Tax Calculator</a> to see exactly how much tax you'd owe based on your income, filing status, and capital gains amount.
</div>

**Tax impact on capital gains at different income levels (selling $200K in Washington State):**

| Your Income Level      | Cap Gain Sales | Average Tax Rate | Tax Breakdown                                        |
| ---------------------- | -------------- | ---------------- | ---------------------------------------------------- |
| **Under $270K income** | $200,000       | 15.0%            | 15% federal only                                     |
| **$270K-$553K income** | $200,000       | 18.8%            | 15% fed + 3.8% NIIT (no WA tax on first $270K gains) |
| **$553K-$600K income** | $200,000       | 18.8%            | 15% fed + 3.8% NIIT (no WA tax on first $270K gains) |
| **Over $600K income**  | $200,000       | 23.8%            | 20% fed + 3.8% NIIT (no WA tax on first $270K gains) |

**Tax impact when selling different amounts (assuming $50K ordinary income in Washington State):**

| Capital Gains Sold | Average Tax Rate | Tax Breakdown                                                                             |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------- |
| **$100K**          | 6.5%             | First $70K at 0%, next $30K at 15% federal                                                |
| **$200K**          | 10.8%            | First $70K at 0%, next $130K at 15% federal                                               |
| **$300K**          | 13.5%            | 15% fed on most + 3.8% NIIT on portion over $270K total income + 7% WA on $30K over $270K |
| **$400K**          | 15.9%            | 15% fed + 3.8% NIIT + 7% WA on $130K over $270K                                           |
| **$500K**          | 17.3%            | 15% fed + 3.8% NIIT + 7% WA on $230K over $270K                                           |

_Key thresholds: NIIT starts at $270K total income (married filing jointly). WA state tax applies to capital gains over $270K. Federal LTCG rate jumps from 15% to 20% at $553K taxable income._

## Risk Management Strategies

When you're sitting on a concentrated position, you have several tools beyond just "sell it all and pay the taxes." Here are sophisticated strategies that can help manage risk while controlling tax timing:

### Buying Put Options for Protection

**TL;DR**: Pay ~3-5% annually to guarantee you can sell your stock at a minimum price, protecting against crashes while keeping upside potential.

_NOTE: This will still be a taxable event, but you'll feel better knowing you didn't lose it all_

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

### Collars: Making Protection Affordable

**TL;DR**: Get downside protection for nearly free by giving up some upside - like insurance with a deductible that pays for itself.

_NOTE: Exercising the options will still be a taxable event, but you'll feel better knowing you didn't lose it all_

**How it works**: Combine buying a put (protection) with selling a call (give up some upside) to reduce or eliminate the net cost.

**Example**: Same $400 stock. Buy a $350 put for $15, sell a $450 call for $16. Net cost: -$1 (you actually receive $1). You're now protected below $350 but give up gains above $450.

**The sweet spot**: You keep gains between $350-$450 while being protected from major losses and paying almost nothing for the protection.

**Variations:**

- **Zero-cost collar**: Adjust strikes so call premium exactly pays for put premium
- **Partial collar**: Only collar a portion of your holdings
- **Rolling collar**: Renew with new strikes as stock price moves

**Tax considerations**: Generally doesn't trigger immediate taxes, but complex rules apply for collars lasting more than 30 days.

### Exchange Funds for Diversification

**TL;DR**: Trade your single stock for a diversified portfolio without triggering taxes, but you're locked in for 7 years and pay 1% annually. You still pay capital gains tax when you eventually sell, but on the diversified portfolio's value!

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

**The cool new kid on the block**

- [Cache Exchange Funds](https://usecache.com/product/exchange-funds) is one provider offering exchange funds for concentrated stock positions, with quarterly fund launches and professional diversification strategies. Note: 1% management fee + $100K minimum (most other providers require $1M+)

**Management fees vs capital gains tax - the math:**

Exchange funds charge management fees on your entire position, while taxes are only on gains. Here's how they compare:

**Assumptions:** Married filing jointly, NIIT starts at $270K total income (simplified), 2024 tax rates

**Example 1: $100K position with $10K cost basis ($90K unrealized gain) - assumes varying income levels**

| Your Income Level      | Management Fees (7yr) | Capital Gains Tax | Tax Breakdown       |
| ---------------------- | --------------------- | ----------------- | ------------------- |
| **Under $270K income** | $7,000                | $13,500           | 15% federal only    |
| **$270K-$553K income** | $7,000                | $16,920           | 15% fed + 3.8% NIIT |
| **$553K-$600K income** | $7,000                | $16,920           | 15% fed + 3.8% NIIT |
| **Over $600K income**  | $7,000                | $21,420           | 20% fed + 3.8% NIIT |

**Example 2: $1M position with $100K cost basis ($900K unrealized gain) - assumes married filing jointly with no other income**

| Capital Gains Amount | Management Fees (7yr) | Capital Gains Tax | Tax Breakdown                                   |
| -------------------- | --------------------- | ----------------- | ----------------------------------------------- |
| **First $270K**      | $70,000               | $22,050           | 0% on first $123K, 15% on next $147K            |
| **$270K - $553K**    | $70,000               | $75,254           | 15% fed + 3.8% NIIT                             |
| **$553K - $900K**    | $70,000               | $182,130          | 20% fed + 3.8% NIIT + 7% WA on gains over $270K |

**Key insights:**

- At $100K position: Cache allows entry at $100K (most others require $1M), making exchange funds accessible for smaller positions
- Your income dramatically affects tax on gains: $90K gain costs $13.5K to $21.4K depending on income
- High earners (>$600K) pay 58% more tax than low earners (<$270K) on the same gains
- At $1M position with $900K gains: Exchange funds save ~$112K ($70K fees vs $182K tax)
- Remember: You still owe capital gains tax eventually when exiting the exchange fund

**Key differences:**

- Management fees are paid annually on the **entire position**, not just gains
- Capital gains tax is one-time and only on the **gain portion**
- After 7 years in an exchange fund, you still owe capital gains tax when you eventually sell the diversified portfolio
- Exchange funds preserve your cost basis, allowing continued tax deferral

**When exchange funds make sense despite fees:**

- Your position is so large that concentration risk outweighs the fee drag
- You're in a very high tax bracket now but expect lower rates in retirement
- You value the immediate diversification without triggering a taxable event
- The 7-year lockup aligns with your long-term holding plans anyway

**Break-even analysis:** If your concentrated stock underperforms the diversified fund by more than 1% annually due to company-specific risk, the exchange fund fees are worth it. Given single-stock volatility, this is often a reasonable bet for risk reduction.

## The Ultimate Tax Escape: Step-Up in Basis

When you die, your heirs inherit your appreciated stock at current market value with **zero capital gains tax** on all the appreciation during your lifetime. This "stepped-up basis" can save hundreds of thousands or even millions in taxes.

In Washington State (a community property state), it's even better - when one spouse dies, **both halves** of jointly-owned stock get stepped up, allowing the surviving spouse to immediately diversify tax-free.

For detailed information on step-up in basis, the "Buy, Borrow, Die" strategy, and when this approach makes sense, see the [Step-Up in Basis section in the Tax Guide](/money#step-up-in-basis-at-death---the-ultimate-tax-escape).

## Related Articles

Explore these related topics to build your complete financial independence strategy:

- **[Planning Your Gap Year](/gap-year)** - How to structure time off between jobs or before retirement
- **[Igor's Gap Year Journey](/gap-year-igor)** - Personal reflections and lessons from taking a career break
- **[Retirement Planning](/retire)** - Building towards financial independence and early retirement

These resources complement your stock concentration strategy by addressing the bigger picture of financial planning, tax optimization, and lifestyle design.
