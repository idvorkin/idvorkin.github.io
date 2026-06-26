---
layout: post
title: "Trusts in Washington: Living Trust & Credit Shelter Trust"
author: "Igor Dvorkin"
description: "How a married Washington couple uses a credit shelter trust to capture both ~$3M state estate-tax exemptions (WA has no portability) — plus living trusts, QTIP, QDOT for non-citizen spouses, the basis tradeoff, and worked examples."
mathjax: true
inprogress: true
comments: true
permalink: /trusts
---

Most estate-planning advice on the web is either lawyer-jargon written for other lawyers, or generic "everyone needs a trust!" content that ignores where you actually live. This post is the trusts slice of my notes — what a plain revocable living trust actually does, what a credit shelter trust is, and why Washington's own estate tax (a low ~$3M exemption and, critically, **no spousal portability**) is the difference between your family keeping one exemption or two. It also covers the "qualified" trusts people half-remember (QTIP, and QDOT for a non-citizen / green-card spouse), the income-tax and step-up tradeoffs, and worked examples — including the break-even math on when a trust _isn't_ worth it.

For capital gains, step-up in basis, and retirement-account mechanics, see the companion [taxes post](/taxes). _Not legal or tax advice — see the disclaimer at the end. Figures are current as of June 2026, and Washington's rules just changed, so confirm specifics with a WA estate attorney + CPA._

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc-start -->

- [TL;DR](#tldr)
- [The "Regular" Trust: Revocable Living Trust](#the-regular-trust-revocable-living-trust)
- [What a Credit Shelter Trust Is (Plain English)](#what-a-credit-shelter-trust-is-plain-english)
- [Why It Matters Specifically in Washington](#why-it-matters-specifically-in-washington)
  - [Washington has its own estate tax — with a low exemption](#washington-has-its-own-estate-tax--with-a-low-exemption)
  - [Washington rates: 10% up to a 20% top rate](#washington-rates-10-up-to-a-20-top-rate)
  - [The killer fact: Washington has NO portability](#the-killer-fact-washington-has-no-portability)
  - [Federal is usually not the binding constraint](#federal-is-usually-not-the-binding-constraint)
- [How to Start One](#how-to-start-one)
  - [The document that creates it](#the-document-that-creates-it)
  - [Funding and titling during life](#funding-and-titling-during-life)
  - [Washington community-property considerations](#washington-community-property-considerations)
  - [The flexible alternative: a disclaimer trust](#the-flexible-alternative-a-disclaimer-trust)
  - [Process and rough cost](#process-and-rough-cost)
- [How to Fund the Trust (Adding Assets)](#how-to-fund-the-trust-adding-assets)
- [Tax Implications and Tradeoffs](#tax-implications-and-tradeoffs)
  - [The estate-tax savings (upside)](#the-estate-tax-savings-upside)
  - [The basis tradeoff (key downside)](#the-basis-tradeoff-key-downside)
  - [Trust income tax while the CST runs](#trust-income-tax-while-the-cst-runs)
  - [When a CST makes sense — and when it doesn't](#when-a-cst-makes-sense--and-when-it-doesnt)
- [Related "Qualified" Trusts (QTIP & Friends)](#related-qualified-trusts-qtip--friends)
- [Green Card Holders & Non-Citizen Spouses](#green-card-holders--non-citizen-spouses)
  - [Exemption & scope — unchanged](#exemption--scope--unchanged)
  - [The key issue — the marital deduction](#the-key-issue--the-marital-deduction)
  - [Which spouse dies first decides whether it bites](#which-spouse-dies-first-decides-whether-it-bites)
  - [QDOT mechanics](#qdot-mechanics)
  - [What a QDOT costs you (the tradeoffs)](#what-a-qdot-costs-you-the-tradeoffs)
  - [Gifts to a non-citizen spouse (lifetime)](#gifts-to-a-non-citizen-spouse-lifetime)
  - [Portability nuance](#portability-nuance)
  - [Washington takeaway](#washington-takeaway)
- [FAQ: Getting Money Out, Conversion & When Gains Are Taxed](#faq-getting-money-out-conversion--when-gains-are-taxed)
- [Worked Examples](#worked-examples)
  - [A — No planning (everything to the survivor outright, no CST)](#a--no-planning-everything-to-the-survivor-outright-no-cst)
  - [B — With a credit shelter trust](#b--with-a-credit-shelter-trust)
  - [C — The retirement-account twist (the part people get wrong)](#c--the-retirement-account-twist-the-part-people-get-wrong)
  - [D — Bottom line](#d--bottom-line)
  - [E — Break-even: how much growth makes the CST not worth it?](#e--break-even-how-much-growth-makes-the-cst-not-worth-it)
- [DIY (Self-Serve Tools) vs. an Attorney](#diy-self-serve-tools-vs-an-attorney)
- [Bottom Line for Someone in WA](#bottom-line-for-someone-in-wa)
- [Sources](#sources)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## TL;DR

**In one breath:** In Washington a married couple loses the first-to-die spouse's ~$3M state estate-tax exemption unless they use a **credit shelter trust** — WA has no spousal portability. On a $10M estate that's roughly **$550K saved**. A plain **living trust** is just the container that holds this and skips probate; it saves no tax by itself. If either spouse is a **non-citizen** (green-card holder), add a **QDOT** so the marital deduction still works. The big catch is **basis**: CST assets skip the second step-up, so you trade estate tax saved against possible future capital-gains tax. **Talk to a WA estate attorney + CPA** — the worked numbers below are illustrative.

- A **revocable living trust ("regular trust")** is the everyday estate-planning trust: you create it now, keep full control, and it mainly **avoids probate**, keeps things **private**, and handles **incapacity** — but gives **no tax savings** by itself. It's usually the _container_ that holds the credit-shelter provisions below.
- A **credit shelter trust (CST)** — a.k.a. bypass trust, "B" trust, or family trust — is an irrevocable trust funded at the **first spouse's death** with up to one estate-tax exemption. The surviving spouse can still benefit (income + principal for health/education/maintenance/support), but the trust assets are **excluded from the surviving spouse's taxable estate at the second death** — so the first spouse's exemption isn't wasted.
- **Why it matters in WA:** Washington has its **own** estate tax with a low exemption (**$3,000,000 per person, 2026**) and, critically, **Washington does NOT allow portability** between spouses. A CST is the main way a married couple uses **both** WA exemptions — without one, the first-to-die spouse's ~$3M WA exemption is simply lost.
- **WA top rate:** progressive, up to a **20%** top marginal rate (over ~$9M of WA taxable estate). The exclusion is **frozen** going forward (no longer inflation-indexed), so it won't keep rising.
- **Federal is usually NOT the binding constraint for WA couples:** The 2026 **federal** exemption is **$15,000,000 per person** (made permanent + inflation-indexed by the 2025 "One Big Beautiful Bill"), with federal portability. A couple can shield ~$30M federally. For most WA high earners, the **WA state** estate tax — not federal — is what a CST targets.
- **The big tradeoff:** CST assets get a step-up in basis at the **first** death but **no second step-up** at the surviving spouse's death — heirs may owe more **capital-gains** tax than if assets had passed outright. You're trading WA estate tax saved (up to ~20% of one exemption) against potential future cap-gains cost.
- **Non-citizen spouse?** If either spouse is a **green-card holder** (not a U.S. citizen), the unlimited marital deduction only works when the **survivor is a citizen**. If the survivor is the non-citizen, you need a **QDOT** to defer the tax — drafted as a "contingent QDOT" it covers both orders of death, and the CST math is otherwise unchanged. Naturalizing before the first death removes the issue entirely.
- **Action:** If your combined estate exceeds (or will exceed) ~$3M, a CST or the more flexible **disclaimer trust** is worth a serious look. **Talk to a WA estate-planning attorney + a CPA** — fact-specific, and the WA rules just changed.

## The "Regular" Trust: Revocable Living Trust

When most people say "a trust" or "a living trust," they mean a **revocable living trust (RLT)** — the foundation of a typical estate plan. Its purpose is different from the credit shelter trust below.

**What it is:** A trust you create during your lifetime and can **change or revoke anytime**. You're usually your own **trustee and beneficiary** while alive, so you keep **full control** — buy, sell, and spend as before. A **successor trustee** you name takes over if you become incapacitated or die.

**What it's for (the real benefits):**

- **Avoids probate** — assets titled in the trust pass to your heirs **without** the court probate process (in WA: slow, public, costly). The #1 reason people set one up.
- **Privacy** — probate is public record; a trust keeps your estate and beneficiaries private.
- **Incapacity planning** — if you're disabled/incapacitated, your successor trustee manages everything seamlessly, no court guardianship.
- **Smoother for out-of-state property** — avoids a second probate in another state.

**What it does NOT do:** A revocable trust gives **no estate-tax or income-tax savings while you're alive**. The IRS treats it as a "grantor trust" — its income is taxed to you, and its assets are still **fully in your taxable estate**. (That's the price of keeping control.) It also provides **no creditor protection** while revocable.

**Revocable vs. irrevocable (the key distinction):**

- **Revocable** (the "regular" living trust) = you keep control; flexible; no tax or creditor benefit.
- **Irrevocable** (like the **credit shelter trust** below) = you give up control over the assets; in exchange you can get **estate-tax savings, creditor protection, or Medicaid planning**.

**How it relates to the credit shelter trust:** Not either/or — they work **together**. The revocable living trust is usually the **container**. You set up the RLT now (to avoid probate + manage incapacity), and **inside** it you embed the **A/B / credit-shelter instructions** that automatically activate at the first spouse's death (turning part of it irrevocable to capture the WA exemption). So a married couple typically has **one** revocable living trust that **becomes** a credit shelter (B) + marital (A) trust at the first death. **Most people need the "regular" trust; the CST is a feature added for those with estate-tax exposure.**

**Funding:** Same critical point — you must **re-title assets into the trust** during life (house, accounts), or it doesn't avoid probate. An unfunded trust is a common, expensive mistake.

**Cost:** Part of a standard WA estate-planning package (commonly a flat fee in the low-thousands), usually bundled with a **pour-over will**, powers of attorney, and a health-care directive.

## What a Credit Shelter Trust Is (Plain English)

A credit shelter trust is an **irrevocable trust created at the death of the first spouse**. When the first spouse dies, an amount up to the available estate-tax exemption is funneled into this trust instead of passing outright to the survivor.

The point is to **use the first spouse's exemption before it disappears.** Mechanism:

- The surviving spouse can still **benefit** during life — typically receiving **income**, and **principal** as needed under a "**HEMS**" standard (health, education, maintenance, support). They can be the trustee in many designs.
- Because the survivor doesn't **own** the trust outright and access is limited to that ascertainable standard, the trust assets are **not counted in the survivor's taxable estate** when the survivor later dies.
- Result: those assets — and their growth — **bypass** estate tax at the second death. Hence "bypass trust" / "credit shelter trust."

The classic structure is an "**A/B trust**": at the first death, the estate splits into the **"A" trust** (marital trust — to/for the survivor, qualifies for the unlimited marital deduction, **is** in the survivor's estate) and the **"B" trust** (credit shelter — funded with one exemption, **not** in the survivor's estate).

## Why It Matters Specifically in Washington

### Washington has its own estate tax — with a low exemption

Washington is one of the few states with a **standalone estate tax**, separate from federal. As of 2026 (WA DOR):

- **Exclusion amount:** **$3,000,000** per person (2026). It's **frozen** going forward (the CPI index it relied on no longer exists), so it's **not** scheduled to keep rising.
- The exclusion is a **deduction**: WA taxes the Washington taxable estate = gross estate minus deductions minus the exclusion. Only the amount **above** ~$3M is taxed.

That ~$3M threshold is low enough that **a Seattle home + retirement + brokerage + life insurance can blow past it** for a high-income couple — especially the survivor's combined estate after one spouse dies.

### Washington rates: 10% up to a 20% top rate

- Progressive **10% → 20%**, with the **20%** top marginal rate applying over **$9M** of WA taxable estate.
- Full graduated table on the WA DOR estate-tax-tables page.

### The killer fact: Washington has NO portability

- **Federal allows portability:** the first spouse's **unused** federal exemption (DSUE) can transfer to the survivor by filing a federal estate-tax return — no trust required.
- **Washington allows NO portability.** If the first spouse leaves everything outright to the survivor (unlimited marital deduction), that spouse's ~$3M WA exemption is **gone forever**. At the second death, the family gets **only one** ~$3M WA exemption.

A CST is the **workaround**: routing ~$3M into the B trust at the first death **uses the first spouse's WA exemption**, and the survivor's own exemption is still available at the second death — sheltering roughly **two** WA exemptions (~$6M+) instead of one.

### Federal is usually not the binding constraint

2026 federal exclusion is **$15,000,000 per person** (IRS; made permanent + indexed by the 2025 OBBB). A couple shields ~$30M federally, and federal portability means no trust is even required to combine the two. For a typical Seattle couple worth $5M–$20M, **federal estate tax is a non-issue — the WA estate tax is the binding constraint** (low, non-portable ~$3M exemption). That mismatch is exactly what a WA CST attacks.

## How to Start One

### The document that creates it

A CST is a **provision baked into your foundational documents** that springs up at the first death:

- **Via a will**, or — more commonly/smoothly — **via a revocable living trust (RLT)** drafted as an **A/B structure** (avoids probate, cleaner funding split).
- During life the RLT is fully revocable and you control everything. At the **first death**, it **divides**: one exemption into the now-irrevocable credit shelter (B) trust; the rest to the marital (A) share.

### Funding and titling during life

The mechanics only work if assets are actually **in** the RLT. **Re-title assets into the RLT during life** (house, brokerage, business interests) and coordinate beneficiary designations. An **unfunded trust** is a common, expensive mistake.

### Washington community-property considerations

WA is a **community-property state** (most marital assets owned 50/50):

- **Funding the B trust:** generally the deceased spouse's **half** of community property (+ their separate property) funds the CST — couples need enough on the first-to-die's side to fully use the exemption. Attorneys sometimes use a **community property agreement** or titling to ensure each spouse "owns" enough.
- **Basis upside (a WA bonus):** federally, when one spouse dies, **both halves** of community property get a **full step-up** (not just the decedent's half). A real WA advantage.

### The flexible alternative: a disclaimer trust

- At the first death, **everything is set to pass to the survivor**, but a **disclaimer trust** waits in the wings.
- The survivor has a window (generally **9 months**) to **disclaim** up to one exemption's worth, which then flows into the credit shelter trust.
- **Why attractive:** defers the decision to when the actual numbers, the survivor's needs, and the then-current law are known. **Catch:** relies on the survivor to execute a **qualified disclaimer** correctly and on time (and not having accepted benefits first). A mandatory CST removes that human-error risk but loses the flexibility.

### Process and rough cost

A married-couple A/B (or disclaimer) RLT plan from a WA estate-planning attorney is typically a **flat fee**, commonly **low-thousands to ~$5,000+** depending on complexity (confirm with the firm). Process: intake → draft will + RLT + POAs + health directives → sign → **fund the trust** (re-titling). Given the 2025–2026 WA law churn, a review is timely.

## How to Fund the Trust (Adding Assets)

"Funding" = changing the **owner/title** of each asset from you personally to **your trust** (e.g., _"Jane Doe, Trustee of the Doe Family Living Trust dated 1/1/2026"_). You do it **asset by asset**. An **unfunded trust does nothing** — funding is what actually avoids probate. Note: you fund the **revocable living trust** now; the **credit shelter trust isn't funded during life** — it springs from the living trust at the first death, and the trust's **funding formula** directs ~$3M into it then.

By asset type:

- **Home / real estate:** record a new **deed** transferring title from you to the trust, filed with the county recorder. (WA real-estate excise tax is generally **exempt** for a transfer to your own revocable trust; federal law exempts revocable-trust transfers from mortgage **due-on-sale** clauses — but notify your lender/title company.)
- **Bank & brokerage (taxable) accounts:** **re-title** the account into the trust's name (or open new trust-titled accounts and move assets in-kind — no tax, since you're not selling). The institution will want a **Certificate of Trust**.
- **Business interests (LLC / shares):** **assign** your membership interest/shares to the trust and update the operating agreement / cap table / stock ledger.
- **Retirement accounts (IRA / 401(k) / Roth):** **Do NOT retitle these into the trust** — that triggers a full taxable distribution. Handle them via **beneficiary designation** instead (usually spouse → then kids; a see-through trust only if intentional and properly drafted). _(This is the retirement twist from the worked example.)_
- **Life insurance:** update the **beneficiary** (you can name the revocable trust; a separate **ILIT** is used when you want the proceeds out of your taxable estate).
- **Vehicles / valuables:** can be titled to the trust; many people skip cars and rely on the pour-over will + small-estate rules.

Two backstops:

- **Certificate of Trust** — a short summary you hand banks/title companies to prove the trust exists and your authority **without** revealing the full private terms.
- **Pour-over will** — the safety net: anything you forget to title into the trust "pours over" into it at death (but goes through **probate** first — which is exactly why you fund it **now** rather than rely on the pour-over).

**Going forward:** title **new** assets in the trust's name from the start (open accounts as the trust, buy property as trustee). The attorney usually handles the **initial** funding (deed, certificate of trust); **ongoing** funding is on you.

## Tax Implications and Tradeoffs

### The estate-tax savings (upside)

A CST shelters up to **one WA exemption (~$3M)** — plus all **future growth** — from WA estate tax at the second death. Sheltering ~$3M that would otherwise be taxed at WA's **20% top marginal rate** saves on the order of **$400K–$500K+** (more if the sheltered assets appreciate). A published WA worked example (Consilio's "John & Sue") put the saving at **~$492,120**.

### The basis tradeoff (key downside)

- Assets get a **step-up in basis at the FIRST death** when funded into the CST (basis resets to date-of-death value). Good.
- But CST assets get **NO SECOND step-up** at the survivor's death — because they're deliberately kept **out** of the survivor's estate (the whole point).
- By contrast, assets left **outright to the survivor** (or in the marital "A" trust) **are** in the survivor's estate → they **do** get a **second step-up** at the second death.

So heirs of CST assets may inherit a **low basis** and owe **capital-gains tax** when they sell. **But it's not a simple 20%-vs-20% wash** — the two taxes hit **different bases:**

- **Estate tax is on the asset's FULL value.** The lost step-up only costs **capital gains on the growth since the FIRST death** — everything already gets a step-up at the first death, so the CST's basis cost bites only on appreciation _after_ that.
- Net it out and the **CST comes out ahead by roughly 20% × (first-death value)**, no matter how much the asset later grows. Sheltering ~$3M is the ~$550K saving; the cap-gains drag is a smaller, separate number (worked through in **Example E** below).
- **Cap gains is also deferrable and escapable** — heirs can hold until **their** death for a fresh step-up, harvest losses, or donate appreciated assets. Estate tax is mandatory, ~9 months after death.
- You also **fund the CST with high-basis / low-gain assets** (cash, bonds, Roth) to shrink the basis drag toward zero.

**The one case it flips to a real loss:** if the estate is **under the ~$3M WA exemption**, there's **no estate tax to save**, so the CST just adds basis cost for nothing. That's when you skip it — or use a **disclaimer trust** to decide later.

### Trust income tax while the CST runs

Once irrevocable, the CST is a **separate taxpayer**:

- Files its own federal fiduciary return, **Form 1041**.
- **Undistributed** income is taxed at the **compressed trust brackets** — 2026: 10% to $3,150, 24% to $11,450, 35% to $15,650, and **37% over $15,650** (+ 3.8% NIIT ≈ 40.8% at the top). A trust hits the top rate at ~$15.6K; an individual not until ~$640K. **Distributed** income is deducted by the trust and taxed to the beneficiary (usually lower rates) — so trustees often distribute.
- **WA has no state income tax** → no WA income tax on the trust. (Note: a separate WA **capital-gains excise tax** can apply to certain large gains — distinct from an income tax; a CPA should check.)

### When a CST makes sense — and when it doesn't

**Leans toward a CST (or disclaimer trust):** combined estate comfortably over ~$3M (or projected to be); assets expected to grow; want creditor/remarriage protection for the first spouse's share.

**Leans against (or use a disclaimer trust):** estate at/below ~$3M (one exemption already covers it); highly appreciated assets likely held for life (lost second step-up could cost heirs more than WA tax saved); you value simplicity and the numbers are borderline; federal exposure is irrelevant (far under $30M) so don't over-engineer.

## Related "Qualified" Trusts (QTIP & Friends)

You may have heard of a "qualified" trust — a few show up in this space:

- **QTIP — Qualified Terminable Interest Property trust.** This is the **marital ("A") trust** that commonly pairs with the credit shelter ("B") trust. It qualifies for the **unlimited marital deduction** (no estate tax at the first death on what goes in), the **surviving spouse receives all its income for life**, but — the key feature — **the first spouse controls who ultimately inherits** what's left after the survivor dies. Powerful in **blended families** (make sure your kids inherit, not the survivor's future new spouse). Tradeoff: QTIP assets **are** in the survivor's estate (that's how they earn the marital deduction), so they don't dodge WA estate tax at the second death the way the CST does — but they **do** get a **second step-up** in basis. A typical plan uses the **CST to shelter one exemption** and a **QTIP for the rest**.
- **Qualified disclaimer** — the 9-month disclaimer that funds a **disclaimer trust** (covered above) — the flexible "decide later" version.
- **QDOT — Qualified Domestic Trust** — only relevant if a spouse is **not a U.S. citizen** (preserves the marital deduction for a non-citizen surviving spouse).
- **QFOBI — Qualified Family-Owned Business Interest** — a **Washington-specific deduction** (up to a cap) for a qualifying closely-held family business, on top of the WA exclusion.

_(If you half-remember a specific "qualified" term in A/B planning, it's most likely the **QTIP** — the marital-trust half.)_

## Green Card Holders & Non-Citizen Spouses

> Not legal or tax advice — confirm specifics with a WA estate attorney + CPA before acting.

A green card creates one specific wrinkle in this plan: the **marital deduction**. Everything else (the credit shelter trust, the exemption math) is unchanged. Tell your estate attorney about green-card status up front — this is a standard, well-known adjustment, not an exotic problem.

### Exemption & scope — unchanged

A green-card holder who is a U.S. **domiciliary** (lives here permanently, intends to stay) is taxed exactly like a citizen:

- Subject to U.S. estate & gift tax on **worldwide assets**.
- Gets the **full federal exemption — $15,000,000 per person (2026)**, indexed and now permanent.
- WA estate tax applies to WA residents **regardless of citizenship** — same **~$3M WA exclusion (2026)**, still **no portability** at the state level.

_(Contrast: a non-resident, non-domiciled alien gets only a **$60,000** federal estate exemption on U.S.-situs assets — not this situation. The estate-tax test is **domicile**, not the card itself — a green-card holder living abroad with intent to leave could be treated as a non-resident alien.)_

**→ The credit shelter trust / exemption planning is UNCHANGED for a domiciliary green-card holder.**

### The key issue — the marital deduction

The unlimited estate-tax **marital deduction** is available only if the **surviving spouse is a U.S. CITIZEN**. If the surviving spouse is a non-citizen (e.g., a green-card holder), assets passing to them outright do **NOT** qualify for the unlimited marital deduction — you need a **QDOT (Qualified Domestic Trust)** to get the deferral.

### Which spouse dies first decides whether it bites

The QDOT problem only triggers when the **surviving** spouse is the non-citizen. In a mixed-citizenship couple (one citizen, one green-card holder):

- **Citizen-spouse dies first / non-citizen survives** — the _hard_ case. The deceased's estate can't use the unlimited marital deduction to pass assets to the non-citizen survivor outright. Anything above the deceased's exemption ($3M WA / $15M fed) that they want to pass tax-deferred must go through a **QDOT**, or WA estate tax is due at the first death on the excess. The credit shelter trust still captures the first $3M.
- **Non-citizen dies first / citizen survives** — the _easy_ case. The surviving spouse is a citizen, so the **unlimited marital deduction applies normally** — no QDOT needed. Works exactly like a citizen couple; the CST still captures the first-to-die's WA exemption.

**The fix covers both orders of death:** draft the marital ("A") trust as **QDOT-able** ("contingent QDOT") — it springs into QDOT mode **only if** the survivor is a non-citizen at the first death. If the citizen survives, it never triggers; if the non-citizen survives, it activates. Standard drafting for mixed-citizenship couples.

**Clean lever:** if the non-citizen spouse **naturalizes** (becomes a U.S. citizen) before the first death, the QDOT issue disappears entirely — both directions become the easy case.

### QDOT mechanics

The non-citizen survivor's marital share goes into a QDOT → the marital deduction is allowed → estate tax is **deferred**, not erased. The deferred tax is later imposed on:

- **Principal distributions** during the survivor's life (hardship distributions can be excepted; **income distributions are exempt**), and
- whatever **remains at the survivor's death**.

Requirements (2026):

- At least one **U.S. trustee**.
- If QDOT assets exceed **$2,000,000**, one trustee must be a **U.S. bank** — or the trustee posts a **bond / letter of credit equal to 65%** of trust value. (Under $2M, no bank/bond needed if ≤35% of assets are foreign real estate.)
- The survivor can **become a U.S. citizen** later; under §2056A(b)(12) this can end the QDOT estate tax on the remaining principal (conditions: U.S. resident throughout, or no taxable distributions taken first, plus written trustee certification to the IRS).

### What a QDOT costs you (the tradeoffs)

A QDOT is a **deferral tool, not a tax-saver** — that distinction drives every tradeoff:

- **It postpones the tax, doesn't erase it.** Unlike the credit shelter trust (which permanently removes assets from the taxable estate), a QDOT only **defers** the first death's estate tax on the marital share. The bill comes due later — at the **first decedent's** estate-tax rates.
- **Principal distributions to the survivor are taxed.** The survivor takes **income freely** (and **hardship** distributions of principal), but any **discretionary principal** they pull out **triggers the deferred estate tax** on that amount. The survivor's access to principal is restricted in a way a citizen spouse's outright inheritance is not.
- **Remaining principal is taxed at the survivor's death.** Whatever is left in the QDOT when the survivor dies gets hit with the deferred estate tax. Net effect: roughly the tax that would have been due at the first death, just postponed — you bought **time and growth**, not forgiveness.
- **Ongoing cost and rigidity.** Needs a **U.S. trustee** (a **U.S. bank** trustee or a **65% bond** once assets exceed **$2M**) → institutional trustee fees. The trust is **irrevocable**, bound by QDOT rules, and files **Form 706-QDT** when taxable events occur.
- **Possible basis downside.** QDOT principal generally is **not** included in the surviving spouse's own gross estate, so it may **not** get a **second step-up** at the second death (similar to the CST) — confirm with the CPA for your asset mix.

**Why do it anyway?** The alternative is **paying the estate tax in full at the first death** — exactly when the surviving spouse needs the assets to live on. The QDOT lets the money **stay invested and keep working** for the survivor's lifetime instead of being liquidated to pay the IRS up front. And the **naturalization escape hatch** can convert the deferral into actual savings: if the survivor becomes a citizen (meeting §2056A(b)(12) conditions), the remaining QDOT estate tax can be **eliminated**, not just deferred.

### Gifts to a non-citizen spouse (lifetime)

The unlimited **gift** marital deduction also does not apply. Instead there's an indexed annual exclusion: **$194,000 (2026)** of gifts to a non-citizen spouse per year are excluded (vs. the $19,000 (2026) general annual exclusion). Gifts _from_ the non-citizen spouse _to_ a citizen spouse remain unlimited.

### Portability nuance

DSUE/portability interacts with the QDOT — the deceased spouse's DSUE amount is generally **not finalized until the QDOT terminates** (last distribution or survivor's death), so the survivor can't fully rely on it until then.

### Washington takeaway

WA conforms on the marital deduction, so the **QDOT applies for WA estate tax too** — same deferral mechanism on the state side. Bottom line: the **CST is unaffected**; you simply add a **QDOT on the marital ("A") side**, and whether it actually triggers depends on the surviving spouse's citizenship and who dies first.

## FAQ: Getting Money Out, Conversion & When Gains Are Taxed

**Does a revocable living trust convert into a credit shelter trust at death?**
Yes — that's the standard design. Your RLT holds the A/B instructions; at the **first spouse's death**, the RLT (or a defined share) becomes **irrevocable** and **funds the credit shelter (B) trust** (plus a marital/QTIP "A" trust for the rest). You don't create a separate CST today — it's baked into the living trust and **springs into being at death**.

**What can you pull out of each trust?**

- **Revocable living trust:** Everything, anytime. You control it — spend, move assets, change terms, or revoke entirely. **No restrictions** while you're alive.
- **Credit shelter trust:** Limited, by design. The surviving spouse can receive **income** and **principal under the HEMS standard** (health, education, maintenance, support) — an **"ascertainable standard."** They generally **cannot** take unlimited principal or revoke the trust. **That restriction is the whole point** — give the survivor too much control and the IRS pulls the assets back into their estate, defeating the shelter. An independent trustee, trustee discretion, or specific trust terms govern exactly how much comes out.

**Does the CST pay capital-gains tax only when assets are "removed"?**
Close — the trigger is **a sale (realization)**, not removal. The trust pays cap-gains tax **only when it sells an appreciated asset** and realizes the gain. **Mere appreciation isn't taxed** — a stock or property that's grown but is still held inside the trust generates **no tax until sold**. And if the trust **distributes an asset in-kind** to a beneficiary instead of selling, that generally **doesn't trigger gain either** — the beneficiary takes the trust's **carryover cost basis** and pays cap-gains only when **they** later sell. Remember the catch: CST assets get **no second step-up** at the surviving spouse's death, so that built-in gain rides along until someone finally sells (vs. assets in the marital/QTIP trust or owned outright, which **do** get the second step-up).

**Does WA estate tax apply to my IRA / Roth / 401(k)?**
**Yes — in full.** The WA estate tax is levied on your **gross estate** (everything you own at death) and **ignores income-tax character.** The entire date-of-death value of a **Traditional IRA, Roth IRA, or 401(k)** counts toward the ~$3M WA exemption and the 20% tax. What differs is the **income-tax** layer on top: Traditional IRA/401(k) withdrawals are **ordinary income** to heirs (income in respect of a decedent, "IRD"), while **Roth** withdrawals are **income-tax-free**. So a Traditional IRA is effectively **double-taxed** (estate + income); a Roth is **estate-taxed once, then tax-free.** That's why the worked examples leave the **Roth to the kids** and fund the **CST with the taxable brokerage**, not the IRA. _(There's a federal income-tax deduction under §691(c) for the federal estate tax paid on IRA money — but it's a federal-income-tax interplay; WA has no income tax, so it doesn't soften the WA side.)_

## Worked Examples

> **These numbers are made up — not anyone's real balance sheet.** A round $10M split into clean buckets just to make the math legible. (I wish I had this much.) Use the _structure_, not the figures.

**Assumptions (state these explicitly).** A married couple, both U.S. citizens and Washington residents, with **$10,000,000** combined:

- **$5,000,000** — regular **taxable** brokerage account (non-retirement, holds appreciated stock with a cost basis well below market)
- **$3,000,000** — **Traditional (pre-tax) IRA**
- **$2,000,000** — **Roth IRA**

We assume the assets are held (or, via community property, attributable) so that a credit shelter trust (CST) can actually be funded at the first death. _If "non-taxable accounts" meant something else, the structure still applies — adjust the bucket._

We use the current **Washington schedule** (DOR "Schedule 1," top marginal rate **20%**) and a clean **$3,000,000** WA exclusion per person. Federal exclusion is $15M/person in 2026 and **portable** — not the binding constraint here; **Washington is** (no portability).

_(WA bracket math per DOR estate-tax tables, Schedule 1; figures approximate — confirm with a CPA.)_

Relevant slice of the WA Schedule 1 graduated table:

| WA taxable estate | Marginal rate | Tax = base + excess                |
| ----------------- | ------------- | ---------------------------------- |
| $3M–$4M           | 16%           | $390,000 + 16% over $3,000,000     |
| $4M–$6M           | 18%           | $550,000 + 18% over $4,000,000     |
| $6M–$7M           | 19%           | $910,000 + 19% over $6,000,000     |
| $7M–$9M           | 19.5%         | $1,100,000 + 19.5% over $7,000,000 |

### A — No planning (everything to the survivor outright, no CST)

First spouse leaves everything to the survivor. The **unlimited marital deduction** means **$0 tax at the first death** — but the first spouse's **~$3M WA exclusion is wasted** (no WA portability).

At the **second death**, the survivor's estate is the full **~$10M**, minus the survivor's single **~$3M** exclusion → **$7,000,000 WA taxable**.

```
$910,000 + 19% × ($7,000,000 − $6,000,000) = $910,000 + $190,000 = $1,100,000
```

**Example A WA estate tax ≈ $1,100,000.**

### B — With a credit shelter trust

At the **first death**, **~$3M** funds the CST (using the first spouse's exclusion that would otherwise be lost) — still $0 tax. The survivor has HEMS access, but that ~$3M is **out of their taxable estate**.

At the **second death**, the survivor's estate is **~$7M**, minus their own **~$3M** exclusion → **$4,000,000 WA taxable**.

```
$390,000 + 16% × ($4,000,000 − $3,000,000) = $390,000 + $160,000 = $550,000
```

**Example B WA estate tax ≈ $550,000.**

#### Savings

```
$1,100,000 (A) − $550,000 (B) = $550,000 saved
```

The CST uses **both** spouses' ~$3M exclusions instead of one. **Growth inside the CST also escapes WA tax:** if the $3M grows to $5M by the second death, that extra **$2M** passes WA-estate-tax-free (vs. ~$360K–$390K more tax if it sat in the survivor's estate).

### C — The retirement-account twist (the part people get wrong)

The three buckets are **not** interchangeable for funding the CST.

**$5M taxable brokerage — the natural CST funding source.** Can be **retitled into the revocable living trust during life**; gets a **basis step-up at the first death** (in WA community property, often a _full_ step-up on the whole account). **Basis tradeoff:** assets in the CST get that first step-up but **forgo the SECOND step-up** at the survivor's death — if the CST's ~$3M appreciates ~$1M, heirs eventually owe cap-gains on that ~$1M (~$238K federal at 23.8% + ~7% WA). That's almost always **smaller than the ~$550K estate-tax saved**, and you can blunt it by funding the CST with **higher-basis** lots and leaving the most-appreciated stock in the survivor's estate to catch the second step-up.

**$3M Traditional IRA — do NOT put this in the trust mechanically.** Passes by **beneficiary designation**, not the will/trust. **Never retitle a live IRA into a revocable trust** — it's a **full taxable distribution** (a $3M ordinary-income event). It's **IRD: no step-up ever**; heirs owe **ordinary income tax** as they withdraw. Naming a **trust** as IRA beneficiary needs a see-through conduit/accumulation trust, and post-**SECURE Act (2020)** most non-spouse beneficiaries must **empty it within 10 years**; an accumulation trust traps that income at **compressed trust rates (37% over ~$15,650 in 2026)** + NIIT. **Usual move:** name the **surviving spouse** (spousal rollover = best income-tax result) and fund the CST with the brokerage. The IRA's full **$3M still counts in the WA taxable estate** either way.

**$2M Roth IRA — leave this to the kids.** After-tax; **tax-free to heirs**. Also passes by beneficiary designation and is subject to the SECURE 10-year rule for non-spouse heirs — but the drain is painless (tax-free, no annual RMDs; let it grow and pull it in year 10). **Best asset to leave directly to the children.** Its $2M still counts in the WA taxable estate.

### D — Bottom line

| Asset                     | Fund into CST?        | Step-up at death?                        | Income tax on heirs?             | Counts in WA estate? |
| ------------------------- | --------------------- | ---------------------------------------- | -------------------------------- | -------------------- |
| **$5M taxable brokerage** | **Yes** — best source | Yes (1st death); **loses 2nd if in CST** | Cap-gains on post-step-up growth | Yes                  |
| **$3M Traditional IRA**   | **No** — name spouse  | **Never** (IRD)                          | **Ordinary income** as withdrawn | Yes                  |
| **$2M Roth IRA**          | **No** — name kids    | N/A (already after-tax)                  | **None** (tax-free)              | Yes                  |

**What this couple should probably explore:** fund the **CST with ~$3M of the taxable brokerage** (higher-basis lots) to capture both ~$3M exclusions → save **~$550,000** WA estate tax + shelter future CST growth; name the **surviving spouse** as Traditional IRA beneficiary (spousal rollover) and the **children** as Roth beneficiaries (tax-free legacy). Revisit when balances/basis/the WA schedule shift — and have a **WA estate attorney + CPA** handle the CST drafting and the basis-vs-estate-tax modeling.

> **Community-property note.** This assumes assets are titled/characterized so the CST can be funded at the first death. In WA each spouse generally owns half the community estate, so a ~$3M CST is normally achievable — but the **account titling and funding formula must line up** (a detail for the attorney).

### E — Break-even: how much growth makes the CST not worth it?

The lost second step-up only costs anything if the CST assets **appreciate between the two deaths** (the window with no step-up). Here's the break-even.

Let:

- **tₑ** = WA estate-tax rate (**20%**)
- **t_g** = capital-gains rate on the heirs' eventual sale
- **g** = how much a CST asset grows between the **first** and **second** deaths

The CST stops being worth it when the cap-gains cost on the inter-death growth exceeds the estate tax it saved:

<p>
$$t_g \times (g - 1) > t_e \times g$$
</p>

Solving, the **break-even growth multiple** is:

<p>
$$g^* = \frac{t_g}{t_g - t_e}$$
</p>

If **t_g ≤ tₑ**, the denominator vanishes — there's **no break-even, the CST always wins**. The lost step-up can only catch up when the cap-gains rate is _higher_ than the estate rate, and even then only after large growth:

| Heirs' cap-gains rate | What it includes             | Break-even growth between the two deaths |
| --------------------- | ---------------------------- | ---------------------------------------- |
| **20%**               | = estate rate                | **never** — CST always wins              |
| **23.8%**             | fed LTCG 20% + 3.8% NIIT     | **~6.3×** (≈ +525%)                      |
| **~30.8%**            | + WA 7% capital-gains excise | **~2.85×** (≈ +185%)                     |

Annualized — how fast the CST assets must grow, by years between the two deaths:

| Years between deaths | Break-even @ 23.8% | Break-even @ 30.8% |
| -------------------- | ------------------ | ------------------ |
| **10 yrs**           | ~20% / yr          | ~11% / yr          |
| **20 yrs**           | ~9.6% / yr         | ~5.4% / yr         |

**Read:** at the plain federal cap-gains rate, a CST asset would have to grow **~6×** (≈ 10–20% / yr) between the deaths before the lost step-up outweighs the estate-tax saving — very unlikely for a balanced estate. Only with the **WA cap-gains excise** stacked on **and** a long gap between deaths (e.g. 20 yrs at >5% / yr) does it get close. Two levers keep you on the winning side: **fund the CST with low-growth, high-basis assets** (cash, bonds — pushes _g_ down), and remember heirs can **defer or avoid** the cap gains entirely (hold to their own death, donate) while the estate tax is mandatory.

_(The 30.8% row is a conservative worst case — WA's capital-gains excise has a ~$270K annual standard deduction and exempts real estate and retirement accounts.)_

## DIY (Self-Serve Tools) vs. an Attorney

**Yes — you can DIY a _simple_ trust.** Tools like **Trust & Will, LegalZoom, Quicken WillMaker (Nolo), FreeWill, Rocket Lawyer** generate a valid revocable living trust for ~$100–500, and they're genuinely fine for a **simple** estate (basic living trust, "everything to spouse then kids," no estate-tax exposure).

**But the estate-tax planning is exactly what you _don't_ DIY.** The parts that matter for a $10M+ WA estate are where self-serve templates are weakest:

- The **credit shelter / A-B planning** (the ~$550K WA-tax play) — most templates don't draft a proper A/B split + **funding formula**; a botched one **wastes the exemption** or accidentally pulls assets back into the survivor's estate.
- **IRA/Roth beneficiary coordination** and any **see-through-trust** (SECURE Act) language — easy to get wrong, costly when you do.
- **WA community-property funding** so the CST can actually be filled.
- **Funding** itself — the tool gives you the _document_, but you still re-title every asset (including recording a **deed**); the tool doesn't do that.

**The math:** a flat-fee WA estate-planning attorney is typically **~$2,000–$5,000**. Against ~$550K of estate tax at stake (plus the cost of a drafting mistake), that's cheap insurance — and the estate-tax piece is precisely the thing not to DIY. Some services (e.g., Trust & Will) offer **attorney-assisted** tiers as a middle ground; for a CST + a mixed asset profile, use a real attorney for drafting and a **CPA** for the basis-vs-estate-tax modeling.

## Bottom Line for Someone in WA

For a high-income, married Seattle/WA couple with kids: **the federal estate tax almost certainly isn't your problem** (you'd need ~$30M, and federal portability has your back). **The Washington estate tax is** — it kicks in around **$3M per person**, hits up to **20%** going forward, and uniquely **has no portability**, so without planning your family forfeits one spouse's entire ~$3M WA exemption. A **credit shelter trust** (or the flexible **disclaimer trust**) is the standard fix: captures both spouses' WA exemptions and shelters ~$3M+ of growth from WA estate tax at the second death. The price of admission is the **lost second step-up in basis** — a potential cap-gains cost to your heirs — so the right answer depends on estate size, built-in gains, and how long the survivor is likely to live. Given WA changed its estate tax twice (2025 increase, 2026 rollback), **now is a good time to review.**

**This is general information, not legal or tax advice.** Estate planning is highly fact-specific and the WA rules are in flux. **Engage a Washington estate-planning attorney and a CPA** before acting — they can run your actual numbers (estate-tax saved vs. cap-gains cost), draft the documents, and make sure the trust is actually funded.

## Sources

- [WA DOR — Estate tax tables](https://dor.wa.gov/taxes-rates/other-taxes/estate-tax-tables) (exclusion $3,000,000; top marginal rate 20%) — accessed June 2026
- [WA DOR — Estate tax (main)](https://dor.wa.gov/taxes-rates/other-taxes/estate-tax) — accessed June 2026
- [IRS — Tax inflation adjustments for 2026 (incl. OBBB)](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill) (federal exclusion $15,000,000 for 2026) — accessed June 2026
- [Stokes Lawrence — WA estate tax: rates rolled back, exemption frozen](https://www.stokeslaw.com/news-insights/washington-state-adjusts-estate-tax-rates-rolled-back-exemption-frozen/) (SB 6347) — 2026
- [Mercer Advisors — WA estate tax rates roll back in 2026](https://www.merceradvisors.com/personal-finance/washington-estate-tax-rates-roll-back-in-2026/) — 2026
- [Beresford Booth — Three changes to WA estate tax as of July 1, 2025](https://beresfordlaw.com/three-big-changes-to-washington-estate-tax-laws-as-of-july-1-2025/) — 2025
- [Navigate Law Group — Reduce WA estate tax with credit shelter trusts](https://navigatelawgroup.com/reduce-washington-estate-tax-with-estate-tax-credit-shelter-trusts/) — 2025/2026
- [Consilio Wealth — Bypass trusts (worked WA example, ~$492,120 saved)](https://www.consiliowealth.com/insights/bypass-trusts-estate-planning-tool-belt) — 2025/2026
- [Jensen Estate Law — Disclaimer trust in Washington](https://jensenestatelaw.com/anita/maximizing-estate-tax-benefits-with-a-disclaimer-trust-in-washington-state/) — 2025/2026
- [Realized — Does a credit shelter trust get a step-up in basis?](https://www.realized1031.com/blog/does-a-credit-shelter-trust-get-a-step-up-in-basis) — 2025
- [Brotman Law — Trust tax rates 2026 (Form 1041)](https://sambrotman.com/trust-tax-rates/) — 2026

_Compiled 2026-06-26. Tax figures change — reconfirm with a WA estate-planning attorney and CPA before relying on them._
