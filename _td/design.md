---
layout: post
no-render-title: true
title: Design
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/design.md)_

# Design

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Design and architecture](#design-and-architecture)
  - [Business Logic, Platforms and Goop](#business-logic-platforms-and-goop)
  - [Minimize your investment in goop.](#minimize-your-investment-in-goop)
  - [Picking the right level of abstraction for your business logic.](#picking-the-right-level-of-abstraction-for-your-business-logic)
  - [Is Fault Free possible](#is-fault-free-possible)
- [Design Patterns](#design-patterns)
- [Architecture Patterns](#architecture-patterns)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Design and architecture

### Business Logic, Platforms and Goop

**Business logic** is stuff your business would do even if we didn't have computers. "E.g. Pay the employees, keep track of library books that have been rented out".

**Implementation details** is stuff that is created to achieve the business logic. Implantation details, are composed of building blocks, the lowest of level of which are composable platforms.

**Platforms** are pre-existing building blocks from which you can assemble with goop to implement your business logic.

**Goop** You need goop to cover the gap between the business logic and the platforms you use. The advantage of goop is that it perfectly matches your use cases. However, the downside is 1) you need to build and maintain it and you are resource constrained 2) once the platform does your goop, it'll do a better job of it then you would because 1) they are the domain expects 2) you can't afford to make awesome goop.

### Minimize your investment in goop.

Developers love building complex technically challenging systems - makes them feel like they're doing hard things.

### Picking the right level of abstraction for your business logic.

Today's "too low level of abstraction" is yesterday's "too high level of abstraction". E.g. assembly lanaguage, c and c# and javascript.

### Is Fault Free possible

Nope, you already need an "apology workflow".

## Design Patterns

## Architecture Patterns

## Other Resources

- [Building Microservices: Designing Fine-Grained Systems](https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1491950358)
- [Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=AZ1QGMVFB2K45MWY14X0)
