---
layout: post
title: "Stock Concentration Risk: Managing Your Tech Wealth"
author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: /stock-concentration
imagefeature: https://raw.githubusercontent.com/idvorkin/ipaste/main/20250803_104012.webp
redirect_from:
  - /concentration-risk
  - /rsu-risk
---

When you work at a tech company and receive RSUs, it's easy to accidentally become dangerously concentrated in your company's stock. This guide explains the risks and strategies for managing concentrated stock positions.

<img
  src="https://raw.githubusercontent.com/idvorkin/ipaste/main/20250803_104012.webp"
  alt="Market concentration treemap showing the dominance of AAPL, NVDA, MSFT, AMZN, GOOG, META, and TSLA in the index"
  class="img-fluid float-end w-50 ms-3 mb-3"
/>

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [The RSU Trap: How You Became Overweight on Company Stock](#the-rsu-trap-how-you-became-overweight-on-company-stock)
- [You're more concentrated than you think](#youre-more-concentrated-than-you-think)
- [Watering down your concentration](#watering-down-your-concentration)
- [Risk Management Strategies](#risk-management-strategies)
  - [Buying Put Options for Protection](#buying-put-options-for-protection)
  - [Collars: Making Protection Affordable](#collars-making-protection-affordable)
  - [Exchange Funds for Diversification](#exchange-funds-for-diversification)

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

## You're more concentrated than you think

If you work at a FANG company (Meta, Amazon, Apple, Netflix, Google/Alphabet) or other major tech firms, diversifying into index funds provides less diversification than you might think. The market concentration treemap above shows the uncomfortable truth:

**Example portfolio showing tech concentration:**

| Ticker | Company | Portfolio % |
|--------|---------|------------|
| AAPL | Apple | 9.27% |
| NVDA | Nvidia | 7.78% |
| MSFT | Microsoft | 7.78% |
| AMZN | Amazon | 5.83% |
| AVGO | Broadcom | 4.86% |
| GOOG | Alphabet Class C | 3.89% |
| META | Meta Platforms | 3.89% |
| **Total** | **Top 7 Tech Holdings** | **43.30%** |

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

| Income /Salary | Cap Gain Sales | Average Tax Rate on Cap Gains | Marginal Tax Rate on Cap Gains | Comments                                                                                                                              |
| -------------: | -------------: | ----------------------------: | -----------------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|       $600,000 |       $200,000 |                         23.8% |   23.8% (20% LTCG + 3.8% NIIT) | High salary, gains are LTCG but taxed at top LTCG+NIIT rates due to income stacking                                                   |
|        $50,000 |       $120,000 |                          8.8% |                            15% | $50K ordinary income uses up part of 0% LTCG bracket; only ~$70K of gains at 0%, rest at 15%                                          |
|        $50,000 |       $200,000 |                         11.3% |                            15% | $50K ordinary income uses up 0% LTCG bracket; first ~$70K of gains at 0%, next $130K at 15% (federal), all below WA exemption         |
|        $50,000 |       $300,000 |                         13.2% |      15% Fed, 7% WA over $270K | $50K ordinary income uses up 0% LTCG bracket; first ~$70K of gains at 0%, next $230K at 15% (federal), $30K above WA exemption at 7%  |
|        $50,000 |       $400,000 |                         15.4% |      15% Fed, 7% WA over $270K | $50K ordinary income uses up 0% LTCG bracket; first ~$70K of gains at 0%, next $330K at 15% (federal), $130K above WA exemption at 7% |

_Average Tax Rate on Cap Gains: Total tax paid (federal + WA) divided by cap gains sold. Marginal Tax Rate on Cap Gains: Highest rate applied to the last dollar of cap gains (federal and/or WA). All scenarios assume long-term capital gains (LTCG); however, with high salary, LTCG are taxed at the top LTCG rate (20%) plus 3.8% NIIT due to income stacking. The $50K income scenarios show how ordinary income reduces the amount of cap gains eligible for the 0% LTCG rate._

_In the $600K salary scenario, the $200K of gains are LTCG, but are taxed at 20% plus 3.8% NIIT ($47,600). Adjust for your actual bracket and NIIT applicability._

## Risk Management Strategies

When you're sitting on a concentrated position, you have several tools beyond just "sell it all and pay the taxes." Here are sophisticated strategies that can help manage risk while controlling tax timing:

### Buying Put Options for Protection

**TL;DR**: Pay ~3-5% annually to guarantee you can sell your stock at a minimum price, protecting against crashes while keeping upside potential.

*NOTE: This will still be a taxable event, but you'll feel better knowing you didn't lose it all*

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

*NOTE: Exercising the options will still be a taxable event, but you'll feel better knowing you didn't lose it all*

**How it works**: Combine buying a put (protection) with selling a call (give up some upside) to reduce or eliminate the net cost.

**Example**: Same $400 stock. Buy a $350 put for $15, sell a $450 call for $16. Net cost: -$1 (you actually receive $1). You're now protected below $350 but give up gains above $450.

**The sweet spot**: You keep gains between $350-$450 while being protected from major losses and paying almost nothing for the protection.

**Variations:**
- **Zero-cost collar**: Adjust strikes so call premium exactly pays for put premium
- **Partial collar**: Only collar a portion of your holdings
- **Rolling collar**: Renew with new strikes as stock price moves

**Tax considerations**: Generally doesn't trigger immediate taxes, but complex rules apply for collars lasting more than 30 days.

### Exchange Funds for Diversification

**TL;DR**: Trade your single stock for a diversified portfolio without triggering taxes, but you're locked in for 7 years and pay 1% annually.

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

* [Cache Exchange Funds](https://usecache.com/product/exchange-funds) is one provider offering exchange funds for concentrated stock positions, with quarterly fund launches and professional diversification strategies. Note: 1% management fee + $100K minimum (most other providers require $1M+)

**Management fees vs capital gains tax - the math:**

Exchange funds charge management fees on your entire position, while taxes are only on gains. Here's how they compare:

**Assumptions:** Married filing jointly, NIIT starts at $270K total income (simplified), 2024 tax rates

**Example 1: $100K position with $10K cost basis ($90K unrealized gain) - assumes varying income levels**

| Your Income Level | Management Fees (7yr) | Capital Gains Tax | Tax Breakdown |
|---------------------|----------------------|-------------------|---------------|
| **Under $270K income** | $7,000 | $13,500 | 15% federal only |
| **$270K-$553K income** | $7,000 | $19,800 | 15% fed + 3.8% NIIT + 7% WA |
| **$553K-$600K income** | $7,000 | $19,800 | 15% fed + 3.8% NIIT + 7% WA |
| **Over $600K income** | $7,000 | $27,720 | 20% fed + 3.8% NIIT + 7% WA |

**Example 2: $1M position with $100K cost basis ($900K unrealized gain) - assumes no other income**

| Capital Gains Amount | Management Fees (7yr) | Capital Gains Tax | Tax Breakdown |
|---------------------|----------------------|-------------------|---------------|
| **First $270K** | $70,000 | $40,500 | 15% federal only |
| **$270K - $553K** | $70,000 | $95,600 | 15% fed + 3.8% NIIT + 7% WA |
| **$553K - $900K** | $70,000 | $202,100 | 20% fed + 3.8% NIIT + 7% WA |

**Key insights:**
- At $100K position: Cache allows entry at $100K (most others require $1M), making exchange funds accessible for smaller positions
- Your income dramatically affects tax on gains: $90K gain costs $13.5K to $27.7K depending on income
- High earners (>$600K) pay double the tax rate of low earners on the same gains
- At $1M position with $900K gains: Exchange funds save ~$130K ($70K fees vs $202K tax)
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