---
layout: post
no-render-title: true
title: Decentralized Finance
---

Finance has existed for as long as civilization. And like most things before the Internet age was based on the trust of centralized law and authority (like banks and governments). Decentralized Finance (DeFi) is the movement that asks could we perform our financial transaction with out centralized trust. Finance has evolved many instruments to meet the needs of civilization, all of which are based on trust (store of value, currency, loans), de-fi will search for equivalences of each of these.

<!-- prettier-ignore-start -->

<!-- vim-markdown-toc GFM -->

- [Finance 101](#finance-101)
    - [Store of values - Gold](#store-of-values---gold)
    - [Currency - US Dollars](#currency---us-dollars)
    - [Loans -](#loans--)
    - [Auctions -](#auctions--)
    - [Market Makers -](#market-makers--)
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
    - [Non Fungible Tokens ERC20](#non-fungible-tokens-erc20)
- [Other Ledgers](#other-ledgers)
- [Building your own contracts](#building-your-own-contracts)
    - [Tool chains](#tool-chains)
    - [Poly - the default language](#poly---the-default-language)
    - [Vyper - the simpler programming language for python programmers](#vyper---the-simpler-programming-language-for-python-programmers)
- [Unintended consequences](#unintended-consequences)
    - [Forking the ledger](#forking-the-ledger)
    - [Over powering the network](#over-powering-the-network)
    - [MEV](#mev)
    - [Salmonella Attack](#salmonella-attack)
    - [Sandwich Attack](#sandwich-attack)
    - [Cost of consensus - Proof of Work](#cost-of-consensus---proof-of-work)
    - [Cost of consensus - Proof of Share](#cost-of-consensus---proof-of-share)
    - [Ledger take over](#ledger-take-over)
- [Policy Questions](#policy-questions)
    - [What's wrong with centralized finance](#whats-wrong-with-centralized-finance)
    - [Is it just drug dealers](#is-it-just-drug-dealers)
- [To be categorized](#to-be-categorized)
    - [Identity Providers - Certificate Authority to Web Of Trust](#identity-providers---certificate-authority-to-web-of-trust)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Finance 101

### Store of values - Gold

### Currency - US Dollars

### Loans -

### Auctions -

### Market Makers -

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

### Non Fungible Tokens ERC20

## Other Ledgers

## Building your own contracts

### Tool chains

### Poly - the default language

The default language

### Vyper - the simpler programming language for python programmers

## Unintended consequences

### Forking the ledger

### Over powering the network

### MEV

[Miner extractable value (MEV)](https://medium.com/flashbots/frontrunning-the-mev-crisis-40629a613752) is a measure to study the profit of a miner (or validator, sequencer, or other privileged protocol actor) can make through their ability to arbitrarily include, exclude, or re-order transactions from the blocks they produce. MEV includes both ‘conventional’ profits from transaction fees and block rewards, and ‘unconventional’ profits from transaction reordering, transaction insertion, and transaction censorship within the block a miner is producing.

### Salmonella Attack

https://github.com/Defi-Cartel/salmonella

### Sandwich Attack

### Cost of consensus - Proof of Work

### Cost of consensus - Proof of Share

### Ledger take over

## Policy Questions

### What's wrong with centralized finance

### Is it just drug dealers

## To be categorized

### Identity Providers - Certificate Authority to Web Of Trust
