---
layout: post
no-render-title: true
title: Decentralized Finance
permalink: /defi
---

Finance has existed for as long as civilization. And like most things before the Internet age was based on the trust of centralized law and authority (like banks and governments). Decentralized Finance (DeFi) is the movement that asks could we perform our financial transaction with out centralized trust. Finance has evolved many instruments to meet the needs of civilization, all of which are based on trust (store of value, currency, loans), de-fi will search for equivalences of each of these.

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc GFM -->

- [The jobs of finance](#the-jobs-of-finance)
    - [Representing and storing value](#representing-and-storing-value)
    - [Fungible Entities - Sheep](#fungible-entities---sheep)
    - [Non Fungible Entities - The Shaman's crown](#non-fungible-entities---the-shamans-crown)
    - [Exchanging value - Markets](#exchanging-value---markets)
    - [Liquidity - When is the market open, and who is there?](#liquidity---when-is-the-market-open-and-who-is-there)
    - [Compensating Risk - Interest](#compensating-risk---interest)
    - [Capitalizing an entity - Rent](#capitalizing-an-entity---rent)
    - [Insurance - Paying to redue risk](#insurance---paying-to-redue-risk)
    - [Hedging - Derrivatives](#hedging---derrivatives)
    - [Speculations - Derrivatives](#speculations---derrivatives)
    - [Market Makers -](#market-makers--)
    - [Auctions -](#auctions--)
    - [Loans with collatoral -](#loans-with-collatoral--)
    - [Loans w/o collatoral -](#loans-wo-collatoral--)
    - [Market Makers -](#market-makers---1)
    - [Speculations - Derrivatives](#speculations---derrivatives-1)
    - [Market Makers -](#market-makers---2)
    - [Auctions -](#auctions---1)
    - [Loans with collatoral -](#loans-with-collatoral---1)
    - [Loans w/o collatoral -](#loans-wo-collatoral---1)
    - [Market Makers -](#market-makers---3)
- [From TradFi to DeFi](#from-tradfi-to-defi)
- [DeFi 101](#defi-101)
    - [Store Of value - Bitcoin](#store-of-value---bitcoin)
    - [Currency - ERC20](#currency---erc20)
    - [Identity](#identity)
    - [The ledger for store of value](#the-ledger-for-store-of-value)
    - [What is the actual trust model here?](#what-is-the-actual-trust-model-here)
- [Ethereum and Smart Contracts](#ethereum-and-smart-contracts)
    - [More then a ledger](#more-then-a-ledger)
    - [Transaction costs](#transaction-costs)
    - [Ethereum Virtual Machine](#ethereum-virtual-machine)
    - [Smart Contracts, DAPPS](#smart-contracts-dapps)
    - [Smart Contrats, DAPPS](#smart-contrats-dapps)
    - [Fungible Tokens ERC20](#fungible-tokens-erc20)
    - [Non Fungible Tokens ER721](#non-fungible-tokens-er721)
    - [Interacting with off chain state](#interacting-with-off-chain-state)
    - [Oracles to keep offstate on state](#oracles-to-keep-offstate-on-state)
- [Building your own contracts](#building-your-own-contracts)
    - [Tool chains](#tool-chains)
    - [Poly - the default language](#poly---the-default-language)
    - [Vyper - the simpler programming language for python programmers](#vyper---the-simpler-programming-language-for-python-programmers)
    - [Ganache - a personal etherium ledger and VM](#ganache---a-personal-etherium-ledger-and-vm)
- [Risks](#risks)
    - [Taking over the chain, the 51% attack](#taking-over-the-chain-the-51-attack)
    - [Buggy Software - Yam](#buggy-software---yam)
    - [MEV](#mev)
    - [Salmonella Attack](#salmonella-attack)
    - [Sandwich Attack](#sandwich-attack)
    - [Cost of consensus - Proof of Work](#cost-of-consensus---proof-of-work)
    - [Cost of consensus - Proof of Stake](#cost-of-consensus---proof-of-stake)
- [Policy Questions](#policy-questions)
    - [What's wrong with centralized finance](#whats-wrong-with-centralized-finance)
    - [Is it just drug dealers](#is-it-just-drug-dealers)
- [To be categorized](#to-be-categorized)
    - [Identity Providers - Certificate Authority to Web Of Trust](#identity-providers---certificate-authority-to-web-of-trust)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## The jobs of finance

I spent some time thinking about finance. I'm guessig there's some truth here, but a finance guy would probably help me get a better grip on it.

### Representing and storing value

### Fungible Entities - Sheep

### Non Fungible Entities - The Shaman's crown

### Exchanging value - Markets

### Liquidity - When is the market open, and who is there?

### Compensating Risk - Interest

### Capitalizing an entity - Rent

### Insurance - Paying to redue risk

### Hedging - Derrivatives

### Speculations - Derrivatives

### Market Makers -

### Auctions -

### Loans with collatoral -

### Loans w/o collatoral -

### Market Makers -

### Speculations - Derrivatives

### Market Makers -

### Auctions -

### Loans with collatoral -

### Loans w/o collatoral -

### Market Makers -

## From TradFi to DeFi

| Representing and storing value             | Traditional Instrument                     | DeFi Instrument     |
| ------------------------------------------ | ------------------------------------------ | ------------------- |
| Representing and storing value             | Concept                                    | Concept             |
| Fungible Entities                          | Sheep                                      | Bitcoin/ ERC20      |
| Non Fungible Entities - The Shaman's crown | Shaman's Crown                             | ERC721              |
| Exchanging value - Markets                 | Concept                                    | Concept             |
| Markets - Order Book                       | NASDAQ                                     |                     |
| Liquidity                                  | When is the market open, and who is there? | Uniswap             |
| Compensating Risk                          | Interest                                   |                     |
| Compensating For use of an entity          | Rent                                       | Rent                |
| Hedging                                    | Derrivatives                               | dx/dy               |
| Speculation                                | Derrivatives                               | dx/dy               |
| Loans w/Collatoratal                       | Mortgage                                   | BlockFi             |
| Loans w/o Collatoral                       | Bookie; Mafia (bodily harm is collatoral)  | Flashloans ERC 3156 |
| Reducing Risk                              | Insurance                                  |                     |

## DeFi 101

### Store Of value - Bitcoin

### Currency - ERC20

### Identity

### The ledger for store of value

Imagine we're a parent of young kids Alice and Bob. Instead of giving them cash you keep track of how much money they have on a piece of paper. That piece of paper is a ledger so:

At the start of time Alice has 100\$

- T0: Initialize: 100\$ to Alice

Now Bob does the dishes for Alice, and she gives him 20\$

- T1: Alice gives 20\$ to BOB

At this point if we look at the ledger we know Alice has 80$ and Bob has 20$

### What is the actual trust model here?

Easy to say we don't trust anyone, but we must trust something. Here is our requirements to have a trust worthy system.

Lets start with the bitcoin model which is easier:

1. There is one public ledger and it is the source of truth.
1. The ledger can only be updated with valid transactions
1. Valid transactions imply the sender and receiver both both consent to the transaction.

## Ethereum and Smart Contracts

### More then a ledger

### Transaction costs

### Ethereum Virtual Machine

### Smart Contracts, DAPPS

### Smart Contrats, DAPPS

### Fungible Tokens ERC20

### Non Fungible Tokens ER721

### Interacting with off chain state

### Oracles to keep offstate on state

## Building your own contracts

### Tool chains

### Poly - the default language

The default language

### Vyper - the simpler programming language for python programmers

### Ganache - a personal etherium ledger and VM

https://www.trufflesuite.com/ganache

## Risks

### Taking over the chain, the 51% attack

https://www.investopedia.com/terms/1/51-attack.asp

The attackers would be able to prevent new transactions from gaining confirmations, allowing them to halt payments between some or all users. They would also be able to reverse transactions that were completed while they were in control of the network, meaning they could double-spend coins.

### Buggy Software - Yam

Great Story

### MEV

[Miner extractable value (MEV)](https://medium.com/flashbots/frontrunning-the-mev-crisis-40629a613752) is a measure to study the profit of a miner (or validator, sequencer, or other privileged protocol actor) can make through their ability to arbitrarily include, exclude, or re-order transactions from the blocks they produce. MEV includes both ‘conventional’ profits from transaction fees and block rewards, and ‘unconventional’ profits from transaction reordering, transaction insertion, and transaction censorship within the block a miner is producing.

### Salmonella Attack

https://github.com/Defi-Cartel/salmonella

### Sandwich Attack

### Cost of consensus - Proof of Work

### Cost of consensus - Proof of Stake

You "vouch" for valid transaction getting paid if they are valid, and losing your money if you attest to invalid transactions. Way less computing power required.

https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/

Unlike proof-of-work, validators don't need to use significant amounts of computational power because they're selected at random and aren't competing. They don't need to mine blocks, they just need to create blocks when chosen and validate proposed blocks when they're not. This validation is known as attesting. You can think of attesting as saying "this block looks good to me". Validators get rewards for proposing new blocks and for attesting to ones they've seen.

If you attest to malicious blocks, you lose your stake.

## Policy Questions

### What's wrong with centralized finance

### Is it just drug dealers

## To be categorized

### Identity Providers - Certificate Authority to Web Of Trust
