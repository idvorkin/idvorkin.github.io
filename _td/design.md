---
layout: post
title: Software Design And Architecture
permalink: /design
---Software design is important. Here are my notes

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Design and architecture](#design-and-architecture)
    - [Software - Use cases and Malleability](#software---use-cases-and-malleability)
    - [Business Logic, Platforms and Goop](#business-logic-platforms-and-goop)
    - [Minimize your investment in goop.](#minimize-your-investment-in-goop)
    - [Picking the right level of abstraction for your business logic.](#picking-the-right-level-of-abstraction-for-your-business-logic)
    - [Is Fault Free possible](#is-fault-free-possible)
    - [Paradigms: Structured, Object Oriented, Functional](#paradigms-structured-object-oriented-functional)
- [Testing](#testing)
- [Design Patterns](#design-patterns)
    - [Architecture Patterns](#architecture-patterns)
    - [OO Patterns](#oo-patterns)
- [Other Resources](#other-resources)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Design and architecture

### Software - Use cases and Malleability

Software is measured in two dimensions: use cases (end user behavior) and malleability. End user behavior is the delivery of use cases, while malleability is the ease with which the software can modify the existing use cases, or add new ones. Software malleability is the evaluation function for an architecture. Malleability is the more important of these dimensions because over time there will be far more changes to the software then the original use case (e.g. the cost of maintenance far exceeds the software writing cost).

Product managers don't understand software enough to understand the notion of malleability, and thus don't have the ability to prioritize architecture. It's the role of the software engineers (and software architects) to continually prioritize the architecture.

> On the topic of architecture, the software industry's use of the word architect is confusing. The construction analog of a "software architect" is a "structural engineer" and the software equivalent of a "construction architect" is a product manager.

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

### Paradigms: Structured, Object Oriented, Functional

Software has evolved from unstructured, to structured, to object-oriented to functional paradigms. Each paradigm, adds constraints, improving productivity. Paradigms are programming models, more then language constraints as each paradigm can be implemented in assembly code (which is what compilers do)

Structured program provide functional decomposition and constrained flow control, e.g. decomposable functions with constrained flow control (if/for/foreach) are the lowest level of our software systems. A key value of functions is 1) Letting the programmer understand the program a high level without knowing all the details a 2) allowing a small unit which can be tested independently.

Object oriented provides encapsulation (bundling data with functions - e.g. classes and objects), and polymorphism (interfaces which can be instantiated with various types).

Polymorphism gives programmers the most power, decoupling the source code dependency from the flow of control dependency. E.g. main only depends on the plugin interfaces, where modules must implement those interfaces (often with a simple adapter or facade). This is such a powerful difference from structured programming that it’s called the dependency inversion principle (DIP). This power enables the programmer to understand much more complex programs at a high level without knowing all the details. These low level details can be developed and deployed individually.

Functional programming provides functions with no side effects, functional composition and currying. These tools reduce error, remove concurrency errors, and transform problems to be embarrassingly parallel. Some mutation is always required, but it should be isolated as much as possible. However, less mutation is required then you think. In [event sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) use store transaction records instead of updates and compute current state from the sum of previous updates we can remove mutation even from storage (e.g. CRUD becomes CR). If this sounds crazy you already use it daily when using source control, and is becoming very popular in react-redux applications and time travel debugging.

## Testing

From [Testing and Quality](/testing)

_If it’s not tested, it doesn’t work’.’ When your tests passing lets you deploy without any concerns, your tests are good enough. Otherwise you’ve got more work to do_

## Design Patterns

### Architecture Patterns

Good list [here](https://orkhanscience.medium.com/software-architecture-patterns-5-mins-read-e9e3c8eb47d2)

- Layered
- Event Driven
- MicroKernal (Plugin Based)
- Micro Service (Service instead of plugin)
- [Cloud Architecture](/td/cloud-first-applications)

### OO Patterns

- Single Responsibliity Principle - Classes Should Only Do 1 thing.
- Open Closed Principle - Classes should be open to extension but closed to modification.
- Liskov Substitution Principle - Any instantiation of an interface should work properly
- Interface Segregation Principle - Break up complex Interfaces
- Dependency Inversion Principle - A class should not depend on it's implementaiton details
  - Business Logic should not have a dependency on goop/platform, but should interfaces to them.
  - Goop should implement the binding between the Business Logic Interfaces and the platform.
  - Ideally handled by a Dependency Injection (DI) system

## Other Resources

- See [Clean Architecture](/d/2017-11-04-clean-architecture)
- [Building Microservices: Designing Fine-Grained Systems](https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1491950358)
- [Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321/ref=pd_lpo_sbs_14_t_0?_encoding=UTF8&psc=1&refRID=AZ1QGMVFB2K45MWY14X0)
