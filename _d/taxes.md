---
layout: post
title: "Tax and Saving"
author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: /money
imagefeaturelocal: raccoon-money.webp
redirect_from:
  - /saving
  - /savings
---

Most of the tax information on the web is a mess. It's confusing as it tries to apply to everyone, with varying situations, and is often written by non-engineers for non-engineers. I think my tax situation is common to people who have been in software engineering companies for most of their careers, and here are my notes.

{% include local_image_float_right.html src="raccoon-money.webp" %}

For the tax-only slice — capital gains, Washington State cap-gains mechanics, step-up in basis, QSBS, plus IRAs, 401(k)s, Roth mechanics, and 529s — see the companion [taxes post](/taxes).

<script>
// Redirect old anchors that moved to /taxes during the 2026-04-18 split.
// External links (other sites, old tweets, bookmarks) pointing at
// /money#<tax-anchor> land here and auto-forward to /taxes#<same-anchor>.
(function () {
  var moved = {
    "taxable-income-and-capital-gains": 1,
    "short-vs-long-term-capital-gains": 1,
    "marginal-vs-average-tax-rate": 1,
    "washington-state-capital-gains-tax": 1,
    "step-up-in-basis-at-death---the-ultimate-tax-escape": 1,
    "no-load-index-funds-and-etfs": 1,
    "rates-taxes-and-savings": 1,
    "iras-non-taxable-saving-accounts": 1,
    "iras-vs-401ks": 1,
    "rmds-required-minimum-distributions": 1,
    "ira-vs-roth-ira": 1,
    "ira-and-roth-ira-contribution-limits": 1,
    "back-door-roth": 1,
    "the-pro-rata-rule": 1,
    "529s": 1
  };
  var hash = window.location.hash.replace(/^#/, "");
  if (hash && moved[hash]) {
    window.location.replace("/taxes#" + hash);
  }
})();
</script>

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [Assumptions and Hannah](#assumptions-and-hannah)
- [This one small trick can save half your net worth.](#this-one-small-trick-can-save-half-your-net-worth)
- [Retirement accounts](#retirement-accounts)
- [RSUs and Stock Concentration Risk](#rsus-and-stock-concentration-risk)
- [Tracking](#tracking)
  - [Daily Expenses](#daily-expenses)
  - [Retirement Planning](#retirement-planning)
- [Taxes](#taxes)
- [Saving and Spending](#saving-and-spending)
  - [Cash positions and high yield savings](#cash-positions-and-high-yield-savings)
  - [Health Insurance](#health-insurance)
  - [Stock options](#stock-options)
- [Metrics](#metrics)
  - [NPV (Net Present Value), ARR (Annualized Rate of Return), and IRR (Internal Rate of Return)](#npv-net-present-value-arr-annualized-rate-of-return-and-irr-internal-rate-of-return)
  - [Stock Market Metrics - P/E Ratio and Market Cap](#stock-market-metrics---pe-ratio-and-market-cap)
- [Philosophy](#philosophy)
  - [The point of money](#the-point-of-money)
  - [Retirement Ideas](#retirement-ideas)
  - [What would you do for less money?](#what-would-you-do-for-less-money)
  - [Making more vs spending more](#making-more-vs-spending-more)
  - [Does money make you happy?](#does-money-make-you-happy)
  - [Believing the market only goes up](#believing-the-market-only-goes-up)
  - [Keeping a mortgage you can pay off since interest rates are low](#keeping-a-mortgage-you-can-pay-off-since-interest-rates-are-low)
  - [Generational wealth and camels](#generational-wealth-and-camels)
  - [Timing the markets](#timing-the-markets)
  - [The 3 types of rich](#the-3-types-of-rich)
  - [How to trade money for happiness](#how-to-trade-money-for-happiness)
  - [The unquenchable thirst](#the-unquenchable-thirst)
  - [Financial Diabetes: Managing Financial Health](#financial-diabetes-managing-financial-health)
  - [Financial Diabetes Complications](#financial-diabetes-complications)
- [Appendix](#appendix)
  - [Q&A to develop](#qa-to-develop)
  - [How much is 1%](#how-much-is-1)
  - [Blast From the Past — My Budget as a College Student](#blast-from-the-past--my-budget-as-a-college-student)
  - [Other Resources](#other-resources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Assumptions and Hannah

You're in the same boat as Hannah. A normal software engineer at big companies with the standard setup. Her company has a 401k. She makes more than she can contribute to a Roth IRA and Tax law is accurate to circa 2019.

**Hannah** assumptions:

- Has a 401k with her company which she maxes annually
- Ineligible for Roth deductions
- Marginal tax rate of 35%
- Long Term Capital Gains Rates of 15%

## This one small trick can save half your net worth.

Marriage counseling. Let's be honest, a divorce can cost you half your net worth or more. Studies show that divorced individuals experience an average wealth decline of 77% compared to those who remain married. Beyond the direct division of assets, there are additional costs:

Investing in quality marriage counseling ($150-250 per session) is a bargain compared to these costs. Even an expensive counseling program at $5,000 represents just a fraction of potential divorce expenses. More importantly, counseling can help preserve not just your wealth but the relationship that matters to you.

The financial return on investment for successful marriage counseling might be the highest of any financial decision you'll ever make. And unlike other financial strategies, this one likely has the highest impact on your wellbeing.

{%include summarize-page.html src="/partner-trouble"%}

## Retirement accounts

For IRAs, 401(k)s, Roth mechanics, and 529s, see the [taxes post](/taxes#iras-non-taxable-saving-accounts).

## RSUs and Stock Concentration Risk

If you work at a tech company and receive RSUs, you're likely facing concentration risk - when too much of your net worth is tied up in one company's stock. This creates significant financial risk, especially when your job, health insurance, and investments all depend on the same company's performance.

{%include summarize-page.html src="/stock-concentration"%}

For detailed strategies on managing concentrated stock positions, including tax-efficient diversification techniques, protective options strategies, and exchange funds, see the full guide on [RSUs and Stock Concentration Risk](/stock-concentration).

## Tracking

### Daily Expenses

Back in the day mint was great, but now, I use [Monarch Money](https://www.monarchmoney.com/). Took me a couple days to setup, and so far it's been great!

I use:

- Monarch Money
- It can sync to my apple card
- Monarch now has an Amazon Importer

I also pay all my credit cards and mortgages from a single account - so that's my source of truth to make sure I'm not missing major stuff (and boy I often am).

### Retirement Planning

Check out Boldin

## Taxes

For capital gains, Washington State cap-gains mechanics, step-up in basis, QSBS, and the ETF-vs-MF tax distinction, see the dedicated [taxes post](/taxes).

## Saving and Spending

### Cash positions and high yield savings

Often, we think about holding cash, and think about holding it in a place with no interest. Keep this money in high yield bank accounts, which can give [close to 2% (as of Dec '19)](https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts)
At Fidelity you can keep your core cash in a liquid low risk mutual fund [SPAXX](https://fundresearch.fidelity.com/mutual-funds/summary/31617H102), however this has a 0.42% expense ratio, which will eat 25% - 50% of your earned interest.

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

## Metrics

Metrics help you compare different investments and understand their true value. Here are the key ones you'll encounter:

| Metric  | What It Measures                                      | Considers Timing?                  | Best For                                                |
| ------- | ----------------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| **NPV** | Present value of future cash flows in today's dollars | Yes (you choose discount rate)     | Answering "Is this worth more than $X today?"           |
| **ARR** | Simple average annual return                          | No (all cash treated equally)      | Quick comparisons of total returns                      |
| **IRR** | Annualized return that accounts for timing            | Yes (solves for the discount rate) | Comparing investments with different cash flow patterns |

### NPV (Net Present Value), ARR (Annualized Rate of Return), and IRR (Internal Rate of Return)

**NPV (Net Present Value):** A somewhat awkward metric that tells you what future money is worth today - but you have to pick a discount rate, which makes it subjective.

Example: If you assume 8% discount rate (inflation + opportunity cost), then $100 in 3 years is worth only $100 ÷ (1.08)³ = $79 today. But if you picked 5% instead, it would be worth $86. The whole answer depends on your assumption, which is why NPV is less useful than IRR for comparing investments.

**Comparing Three Investment Options:**
Let's say you have $100,000 to invest for 7 years. Here are your options:

**Option 1: Corporate Bond**

- 7-year bond paying 6% annually
- You receive $6,000/year in interest payments
- Get your $100,000 back at maturity
- Total cash received: $142,000
- **ARR = 6%** (bonds state their ARR upfront)
- **IRR = 6%** (same as ARR since payments are regular)

**Option 2: Growth Stock**

- Buy stock for $100,000
- No dividends (growth company reinvests everything)
- Stock price after 7 years: $180,000

**Common Mistake:** You might think "80% gain ÷ 7 years = 11.4% per year." This is wrong - that's simple interest, not compound interest. Returns compound, so you need the 7th root.

- **ARR = ($180,000 ÷ $100,000)^(1/7) - 1 = 8.75%** (the correct calculation)
- **IRR = 8.75%** (same as ARR since there's only one future cash flow)

To verify: $100,000 × (1.0875)^7 = $180,000 ✓

**Option 3: Rental Property**

- Buy property for $100,000 cash
- Rental income: $3,000/year (3% gross yield - lower rent area)
- Sell after 7 years for $178,000 (78% appreciation!)
- Total cash received: $21,000 (rent) + $178,000 (sale) = $199,000

**Common Mistake:** "I get 3% annually from rent. The property appreciates 78% over 7 years, which is 78% ÷ 7 = 11.14% per year. So my total return is 3% + 11.14% = 14.14% per year!"

**Why this is spectacularly wrong:**

1. The 78% appreciation doesn't compound to 11.14% annually
2. The correct 78% appreciation over 7 years = (1.78)^(1/7) - 1 = only 8.6% annualized
3. You can't just add 3% + 8.6% = 11.6% either!

- **ARR = ($199,000 ÷ $100,000)^(1/7) - 1 = 10.32%** (correct: uses total ending value)
- **IRR = 10.15%** (slightly lower because big gains come at year 7)

**The Winner?**

| Investment  | Simple Interest (Wrong!) | ARR    | IRR    | Cash Flow          |
| ----------- | ------------------------ | ------ | ------ | ------------------ |
| Bond        | 6.00%                    | 6.00%  | 6.00%  | Steady yearly      |
| Stock       | 11.43% (80% ÷ 7)         | 8.75%  | 8.75%  | Nothing until sale |
| Real Estate | 14.14% (3% + 11.14%)     | 10.32% | 10.15% | Steady + lump sum  |

Real estate wins on returns, but requires active management. The stock is simpler but riskier. The bond is safest but has the lowest return. IRR helps you compare them fairly despite their different cash flow patterns.

**Key Takeaways:**

- Never use simple interest math for multi-year investments - it massively overstates returns
- ARR shows your true annualized return using compound interest
- IRR is slightly lower than ARR when you get big gains at the end (like real estate appreciation)
- The "obvious" math is often wrong - always use the compound formulas

### Stock Market Metrics - P/E Ratio and Market Cap

**Market Cap (Market Capitalization):** The total value of a company = Share Price × Number of Shares

Example:

- Apple: $190 per share × 15.5 billion shares = $2.9 trillion market cap
- Small startup: $10 per share × 10 million shares = $100 million market cap

Market cap tells you the company's size, not whether it's expensive or cheap!

**P/E Ratio (Price-to-Earnings):** How much you pay for each dollar of earnings

P/E = Stock Price ÷ Earnings Per Share

Example:

- Company A: $100 stock, $5 earnings per share → P/E = 20
- Company B: $10 stock, $0.50 earnings per share → P/E = 20

Both have the same P/E despite different stock prices! They're equally "expensive" relative to earnings.

**The Clever Part:** P/E works regardless of company size:

- P/E = Price per share ÷ Earnings per share
- P/E = (Market Cap ÷ Shares) ÷ (Total Earnings ÷ Shares)
- P/E = Market Cap ÷ Total Earnings

The "per share" cancels out! So you can compare tiny companies to giants.

**What P/E Tells You:**

- P/E = 10: You pay $10 for each $1 of annual earnings (10 years to "earn back" your investment)
- P/E = 30: You pay $30 for each $1 of annual earnings (market expects high growth)
- P/E = 100+: Market expects explosive growth (or it's a bubble)

**Common Confusion:**

- High stock price ≠ Expensive company (need to check P/E)
- Large market cap ≠ Expensive company (Apple at $3T might have lower P/E than a $100M startup)
- P/E ignores debt, cash, and growth rate (see PEG ratio for growth-adjusted version)

**Real Example:**

- Amazon P/E = 45 (market expects continued growth)
- Coca-Cola P/E = 25 (mature, steady company)
- Bank of America P/E = 12 (banks typically have lower multiples)

A "cheap" P/E of 10 might be expensive if earnings are about to collapse. A "rich" P/E of 40 might be cheap if the company doubles earnings next year. Context matters!

**Top S&P 500 Companies Across Industries: Complete Metrics (2024):**

| #   | Company      | Industry     | Market Cap | P/E  | 1-Yr  | Dividend | What It Tells You                  |
| --- | ------------ | ------------ | ---------- | ---- | ----- | -------- | ---------------------------------- |
| 1   | Apple        | Tech         | $3,785B    | 32   | +31%  | 0.4%     | Biggest company, premium valuation |
| 2   | Nvidia       | Chips        | $3,289B    | 58   | +171% | 0.02%    | AI gold rush, extreme growth       |
| 3   | Microsoft    | Software     | $3,134B    | 34   | +14%  | 0.7%     | Mature tech, steady dividends      |
| 4   | Alphabet     | Search/AI    | $2,331B    | 22   | +20%  | 0.2%\*   | Cheapest Big Tech by P/E           |
| 5   | Amazon       | E-commerce   | $2,307B    | 44   | +45%  | 0%       | Pure growth, no dividends          |
| 6   | Meta         | Social       | $1,478B    | 27   | +65%  | 0.5%\*   | Comeback story, new dividend       |
| 7   | Tesla        | Auto/EV      | $1,296B    | 200+ | +63%  | 0%       | Priced for perfection              |
| 8   | Broadcom     | Semis        | $1,087B    | N/A  | +110% | 1.3%     | M&A machine, best tech yield       |
| 9   | Berkshire    | Conglomerate | $977B      | 17   | +28%  | 0%       | Buffett's value fortress           |
| 10  | Eli Lilly    | Pharma       | $733B      | 45   | +35%  | 1.0%     | Ozempic winner                     |
| 11  | Walmart      | Retail       | $726B      | 39   | +55%  | 1.0%     | Retail dominance, AI shopper       |
| 12  | JPMorgan     | Banking      | $675B      | 12   | +40%  | 2.5%     | Best big bank, solid yield         |
| 13  | Visa         | Payments     | $612B      | 32   | +25%  | 0.7%     | Toll booth on spending             |
| 17  | UnitedHealth | Healthcare   | $466B      | 32   | -20%  | 1.5%     | Insurance giant under pressure     |
| 20  | Home Depot   | Retail       | $386B      | 27   | +15%  | 2.3%     | Housing play, good dividend        |
| 25  | J&J          | Pharma       | $345B      | 25   | +5%   | 3.0%     | Defensive dividend aristocrat      |

\*Started paying dividends in 2024

**Industry Patterns You Can See:**

- **Tech dominates:** Top 8 are all tech/tech-adjacent ($19 trillion combined!)
- **P/E varies by industry:** Banks (12), Tech (30s), Tesla (200+), Pharma (25-45)
- **Dividend patterns:**
  - Old economy (Banks, Pharma): 2-3% yields
  - Big Tech: 0-0.7% (growth > dividends)
  - Retail: Mixed (Walmart 1%, Home Depot 2.3%)
- **2024 winners:** Nvidia (+171%), Broadcom (+110%), Meta (+65%), Walmart (+55%)
- **2024 losers:** J&J (+5%), Microsoft (+14%), UnitedHealth (-20%)

**Key Insights by Sector:**

- **Banking (JPMorgan):** P/E 12, Dividend 2.5% = Value + Income
- **Tech (Apple/MSFT):** P/E 30s, tiny dividends = Growth focus
- **Pharma (J&J):** P/E 25, Dividend 3% = Defensive income play
- **Retail (Walmart):** P/E 39 (high!) = Market pricing in AI transformation
- **Healthcare (UNH):** Down 20% = Regulatory fears, policy uncertainty

**The Big Picture:**

- Market cap ≠ Good investment (Apple biggest but +31%, Nvidia #2 but +171%)
- Traditional value sectors (banks, pharma) offer 2-3% dividends
- Tech offers growth but little income (except Broadcom)
- P/E over 40 = market expects something special (Tesla autonomous, Walmart AI)

## Philosophy

### The point of money

When seeing a financial planner, they asked me - what is the point of your savings? I said the point was making a big pile of money so I'd feel safe.

Yeah that was a mistake. Money is a tool. Use it to make your life better. Great uses are experiences with your children, investments in your health, and things that avoid a fight.

### Retirement Ideas

- [Why don't you retire already](https://medium.com/@docjamesw/why-dont-you-fucking-retire-already-3c47a039897c) - An interesting take that you should retire as a sign of goodwill to the future generation.
- Don't focus on retirement, focus on financial independence (FI). FI gives you freedom and comfort regardless of your job.

### What would you do for less money?

If you wouldn't take a job for a pay cut, you probably shouldn't take the job.

### Making more vs spending more

See [Parkinson's law](/parkinson), which applies to both time and money. The task you have will expand to all the money (or time) available to it.

### Does money make you happy?

Famous study, saying after 75K (maybe 200K now), extra money doesn't make you happy. However, turns out that was flawed. The better model, which I buy, is that money is log-linear to happiness.

E.g., every 10x increase in money doubles happiness. So going from 100K to 1M only doubles your happiness.

Fascinating, the impact of log linear money depends on your happiness [paper](https://github.com/idvorkin/blob/blob/master/papers/money-vs-happiness.pdf)

### Believing the market only goes up

{%include blob_image.html src="gdp-delta-1960-2020.png" %}

### Keeping a mortgage you can pay off since interest rates are low

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

1. Money can lower unhappiness

Above that. Buying crap won't make you happy

5 things you can do

1. Buy stuff - brings least happiness
2. Buy time - time to spend with people you love
3. Buy experiences - experiences with people you love.
4. Give it away to others
5. Save it - Makes you feel secure (limited)

### The unquenchable thirst

For the philisophicaly minded, from the [Prophet](https://poets.org/poem/giving-0):

_For what are your possessions but things you keep and guard for fear you may need them tomorrow?_

_And tomorrow, what shall tomorrow bring to the overprudent dog burying bones in the trackless sand?_

_And what is fear of need by need itself? Is not dread of thirst when your well is full, the thirst that is unquenchable?_

### Financial Diabetes: Managing Financial Health

Diabetes is a huge problem in this country, but for kids who grow up privileged, there is another risky disease—**financial diabetes**. Imagine spending as your blood sugar: every extravagant purchase is a sugary spike. **Insulin** as your financial discipline—a built-in sense of the value of money. Those growing up with modest means develop this natural insulin early on, learning to budget and save, keeping their financial sugar levels in check.

Unfortunately, children born into wealth often miss out on this early training, leaving them prone to wild spending binges that spike their financial sugar without the natural regulatory mechanism.

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

## Appendix

### Q&A to develop

- How long should I hold my RSUs before selling?
- If I have a pile of cash from selling RSUs, do I invest immediately or dollar cost average?
- Should I hold any bonds?
- Where should I keep my emergency fund and how much?

For tax-placement questions (high-risk investments in taxable vs. non-taxable accounts), see the [taxes post](/taxes#tax-placement-qa).

### How much is 1%

From [ChatGPT](https://gist.github.com/idvorkin/df0ec94f8bbadb26d99ebd54b55b6358)

Absolute

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

### Blast From the Past — My Budget as a College Student

<img src="https://raw.githubusercontent.com/idvorkin/ipaste/main/20250809_193602.webp" class="float-right-img" alt="College budget spreadsheet from 1998 showing monthly expenses" />

Wow — as a college student in Canada in 1998, I was living on $1,063 per month (CAD). Inflation‑adjusted to 2025, that's about $1,920 per month.

### Other Resources

[Visualizing the worlds money](https://www.visualcapitalist.com/all-of-the-worlds-money-and-markets-in-one-visualization-2020/)

For the standard-deduction + 0% LTCG interaction, see the [taxes post](/taxes#standard-deduction--0-ltcg).
