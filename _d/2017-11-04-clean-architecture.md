---
layout: post
title: "Clean Architecture"
date: "2017-11-04 10:28:05 Pacific Daylight Time"
inprogress: true
tags:
  - book-notes
  - software engineering
---

Architecture is the highest level of abstraction that models a software system. The architecture is composed from modules, which are composed of objects, which are composed of functions. Design is applied to each of these layers, and when executed successfully results in a system that is easy to build and maintain. Clean architecture discusses designs at a high level, which like architecture is highly useful. On the topic of architecture, the software industry's use of the word architect is confusing. The construction analog of a "software architect" is a "structural engineer" and the software equivalent of a "construction architect" is a product manager.

<!-- TOC -->

- [II.Object Oriented design principles](#iiobject-oriented-design-principles)
  - [7. srp: the single responsibility principle](#7-srp-the-single-responsibility-principle)
    - [Symptom 1: accidental duplication](#symptom-1-accidental-duplication)
    - [Symptom 2: merges](#symptom-2-merges)
    - [Solutions](#solutions)
    - [Conclusion](#conclusion)
  - [8. ocp: the open-closed principle](#8-ocp-the-open-closed-principle)
    - [A thought experiment](#a-thought-experiment)
    - [Directional control](#directional-control)
    - [Information hiding](#information-hiding)
    - [Conclusion](#conclusion-1)
  - [9. lsp: the liskov substitution principle](#9-lsp-the-liskov-substitution-principle)
    - [Guiding the use of inheritance](#guiding-the-use-of-inheritance)
    - [The square/rectangle problem](#the-squarerectangle-problem)
    - [Lsp and architecture](#lsp-and-architecture)
    - [Example lsp violation](#example-lsp-violation)
    - [Conclusion](#conclusion-2)
  - [10. isp: the interface segregation principle](#10-isp-the-interface-segregation-principle)
    - [Isp and language](#isp-and-language)
    - [Isp and architecture](#isp-and-architecture)
    - [Conclusion](#conclusion-3)
  - [11. dip: the dependency inversion principle](#11-dip-the-dependency-inversion-principle)
    - [Stable abstractions](#stable-abstractions)
    - [Factories](#factories)
    - [Concrete components](#concrete-components)
    - [Conclusion](#conclusion-4)
  - [IV Component principles](#iv-component-principles)
  - [12. components](#12-components)
    - [A brief history of components](#a-brief-history-of-components)
    - [Relocatability](#relocatability)
    - [Linkers](#linkers)
    - [Conclusion](#conclusion-5)
  - [13. component cohesion](#13-component-cohesion)
    - [The reuse/release equivalence principle](#the-reuserelease-equivalence-principle)
    - [The common closure principle](#the-common-closure-principle)
      - [Similarity with srp](#similarity-with-srp)
    - [The common reuse principle](#the-common-reuse-principle)
      - [Relation to isp](#relation-to-isp)
    - [The tension diagram for component cohesion](#the-tension-diagram-for-component-cohesion)
    - [Conclusion](#conclusion-6)
  - [14. component coupling](#14-component-coupling)
    - [The acyclic dependencies principle](#the-acyclic-dependencies-principle)
      - [The weekly build](#the-weekly-build)
      - [Eliminating dependency cycles](#eliminating-dependency-cycles)
      - [The effect of a cycle in the component dependency graph](#the-effect-of-a-cycle-in-the-component-dependency-graph)
      - [Breaking the cycle](#breaking-the-cycle)
      - [The 'jitters'](#the-jitters)
    - [Top-down design](#top-down-design)
    - [The stable dependencies principle](#the-stable-dependencies-principle)
      - [Stability](#stability)
      - [Stability metrics](#stability-metrics)
      - [Not all components should be stable](#not-all-components-should-be-stable)
        - [Abstract components](#abstract-components)
    - [The stable abstractions principle](#the-stable-abstractions-principle)
      - [Where do we put the high-level policy?](#where-do-we-put-the-high-level-policy)
      - [Introducing the stable abstractions principle](#introducing-the-stable-abstractions-principle)
      - [Measuring abstraction](#measuring-abstraction)
      - [The main sequence](#the-main-sequence)
        - [The zone of pain](#the-zone-of-pain)
        - [The zone of uselessness](#the-zone-of-uselessness)
      - [Avoiding the zones of exclusion](#avoiding-the-zones-of-exclusion)
      - [Distance from the main sequence](#distance-from-the-main-sequence)
    - [Conclusion](#conclusion-7)
- [Architecture Principles](#architecture-principles)
  - [15. what is architecture?](#15-what-is-architecture)
    - [Development](#development)
    - [Deployment](#deployment)
    - [Operation](#operation)
    - [Maintenance](#maintenance)
    - [Keeping options open](#keeping-options-open)
    - [Device independence](#device-independence)
    - [Junk mail](#junk-mail)
    - [Physical addressing](#physical-addressing)
    - [Conclusion](#conclusion-8)
  - [16. independence](#16-independence)
    - [Use cases](#use-cases)
    - [Operation](#operation-1)
    - [Development](#development-1)
    - [Deployment](#deployment-1)
    - [Leaving options open](#leaving-options-open)
    - [Decoupling layers](#decoupling-layers)
    - [Decoupling use cases](#decoupling-use-cases)
    - [Decoupling mode](#decoupling-mode)
    - [Independent develop-ability](#independent-develop-ability)
    - [Independent deployability](#independent-deployability)
    - [Duplication](#duplication)
    - [Decoupling modes (again)](#decoupling-modes-again)
    - [Conclusion](#conclusion-9)
  - [17. boundaries: drawing lines](#17-boundaries-drawing-lines)
    - [A couple of sad stories](#a-couple-of-sad-stories)
    - [Fitnesse](#fitnesse)
    - [Which lines do you draw, and when do you draw them?](#which-lines-do-you-draw-and-when-do-you-draw-them)
    - [What about input and output?](#what-about-input-and-output)
    - [Plugin architecture](#plugin-architecture)
    - [The plugin argument](#the-plugin-argument)
    - [Conclusion](#conclusion-10)
  - [18. boundary anatomy](#18-boundary-anatomy)
    - [Boundary crossing](#boundary-crossing)
    - [The dreaded monolith](#the-dreaded-monolith)
    - [Deployment components](#deployment-components)
    - [Threads](#threads)
    - [Local processes](#local-processes)
    - [Services](#services)
    - [Conclusion](#conclusion-11)
  - [19. policy and level](#19-policy-and-level)
    - [Level](#level)
    - [Conclusion](#conclusion-12)
  - [20. business rules](#20-business-rules)
    - [Entities](#entities)
    - [Use cases](#use-cases-1)
    - [Request and response models](#request-and-response-models)
    - [Conclusion](#conclusion-13)
  - [21. screaming architecture](#21-screaming-architecture)
    - [The theme of an architecture](#the-theme-of-an-architecture)
    - [The purpose of an architecture](#the-purpose-of-an-architecture)
    - [But what about the web?](#but-what-about-the-web)
    - [Frameworks are tools, not ways of life](#frameworks-are-tools-not-ways-of-life)
    - [Testable architectures](#testable-architectures)
    - [Conclusion](#conclusion-14)
  - [22. the clean architecture](#22-the-clean-architecture)
    - [The dependency rule](#the-dependency-rule)
      - [Entities](#entities-1)
      - [Use cases](#use-cases-2)
      - [Interface adapters](#interface-adapters)
      - [Frameworks and drivers](#frameworks-and-drivers)
      - [Only four circles?](#only-four-circles)
      - [Crossing boundaries](#crossing-boundaries)
      - [Which data crosses the boundaries](#which-data-crosses-the-boundaries)
    - [A typical scenario](#a-typical-scenario)
    - [Conclusion](#conclusion-15)
  - [23. presenters and humble objects](#23-presenters-and-humble-objects)
    - [The humble object pattern](#the-humble-object-pattern)
    - [Presenters and views](#presenters-and-views)
    - [Testing and architecture](#testing-and-architecture)
    - [Database gateways](#database-gateways)
    - [Data mappers](#data-mappers)
    - [Service listeners](#service-listeners)
    - [Conclusion](#conclusion-16)
  - [24. partial boundaries](#24-partial-boundaries)
    - [Skip the last step](#skip-the-last-step)
    - [One-dimensional boundaries](#one-dimensional-boundaries)
    - [Facades](#facades)
    - [Conclusion](#conclusion-17)
  - [25. layers and boundaries](#25-layers-and-boundaries)
    - [Hunt the wumpus](#hunt-the-wumpus)
    - [Clean architecture?](#clean-architecture)
    - [Crossing the streams](#crossing-the-streams)
    - [Splitting the streams](#splitting-the-streams)
    - [Conclusion](#conclusion-18)
  - [26. the main component](#26-the-main-component)
    - [The ultimate detail](#the-ultimate-detail)
    - [Conclusion](#conclusion-19)
  - [27. services: great and small](#27-services-great-and-small)
    - [Service architecture?](#service-architecture)
    - [Service benefits?](#service-benefits)
      - [The decoupling fallacy](#the-decoupling-fallacy)
      - [The fallacy of independent development and deployment](#the-fallacy-of-independent-development-and-deployment)
    - [The kitty problem](#the-kitty-problem)
    - [Objects to the rescue](#objects-to-the-rescue)
    - [Component-based services](#component-based-services)
    - [Cross-cutting concerns](#cross-cutting-concerns)
    - [Conclusion](#conclusion-20)
  - [28. the test boundary](#28-the-test-boundary)
    - [Tests as system components](#tests-as-system-components)
    - [Design for testability](#design-for-testability)
    - [The testing api](#the-testing-api)
      - [Structural coupling](#structural-coupling)
      - [Security](#security)
    - [Conclusion](#conclusion-21)
  - [29. clean embedded architecture](#29-clean-embedded-architecture)
    - [App-titude test](#app-titude-test)
    - [The target-hardware bottleneck](#the-target-hardware-bottleneck)
      - [A clean embedded architecture is a testable embedded architecture](#a-clean-embedded-architecture-is-a-testable-embedded-architecture)
        - [Layers](#layers)
        - [The hardware is a detail](#the-hardware-is-a-detail)
      - [Don&#8217;t reveal hardware details to the user of the hal](#don8217t-reveal-hardware-details-to-the-user-of-the-hal)
        - [The processor is a detail](#the-processor-is-a-detail)
        - [The operating system is a detail](#the-operating-system-is-a-detail)
      - [Programming to interfaces and substitutability](#programming-to-interfaces-and-substitutability)
      - [Dry conditional compilation directives](#dry-conditional-compilation-directives)
    - [Conclusion](#conclusion-22)
  - [Videtails](#videtails)
  - [30. the database is a detail](#30-the-database-is-a-detail)
    - [Relational databases](#relational-databases)
    - [Why are database systems so prevalent?](#why-are-database-systems-so-prevalent)
    - [What if there were no disk?](#what-if-there-were-no-disk)
    - [Details](#details)
    - [But what about performance?](#but-what-about-performance)
    - [Anecdote](#anecdote)
    - [Conclusion](#conclusion-23)
  - [31. the web is a detail](#31-the-web-is-a-detail)
    - [The endless pendulum](#the-endless-pendulum)
    - [The upshot](#the-upshot)
    - [Conclusion](#conclusion-24)
  - [32. frameworks are details](#32-frameworks-are-details)
    - [Framework authors](#framework-authors)
    - [Asymmetric marriage](#asymmetric-marriage)
    - [The risks](#the-risks)
    - [The solution](#the-solution)
    - [I now pronounce you &#8230;](#i-now-pronounce-you-8230)
    - [Conclusion](#conclusion-25)
  - [33. case study: video sales](#33-case-study-video-sales)
    - [The product](#the-product)
    - [Use case analysis](#use-case-analysis)
    - [Component architecture](#component-architecture)
    - [Dependency management](#dependency-management)
    - [Conclusion](#conclusion-26)
  - [34. the missing chapter](#34-the-missing-chapter)
    - [Package by layer](#package-by-layer)
    - [Package by feature](#package-by-feature)
    - [Ports and adapters](#ports-and-adapters)
    - [Package by component](#package-by-component)
    - [The devil is in the implementation details](#the-devil-is-in-the-implementation-details)
    - [Organization versus encapsulation](#organization-versus-encapsulation)
    - [Other decoupling modes](#other-decoupling-modes)
    - [Conclusion: the missing advice](#conclusion-the-missing-advice)
  - [Viiappendix](#viiappendix)
  - [Aarchitecture archaeology](#aarchitecture-archaeology)
    - [Union accounting system](#union-accounting-system)
    - [Laser trim](#laser-trim)
    - [Aluminum die-cast monitoring](#aluminum-die-cast-monitoring)
    - [4-tel](#4-tel)
    - [The service area computer](#the-service-area-computer)
      - [Dispatch determination](#dispatch-determination)
      - [Architecture](#architecture)
      - [The grand redesign in the sky](#the-grand-redesign-in-the-sky)
      - [Europe](#europe)
      - [Sac conclusion](#sac-conclusion)
    - [C language](#c-language)
      - [C](#c)
    - [Boss](#boss)
    - [Pccu](#pccu)
      - [The schedule trap](#the-schedule-trap)
    - [Dlu/dru](#dludru)
      - [Architecture](#architecture-1)
    - [Vrs](#vrs)
      - [The name](#the-name)
      - [Architecture](#architecture-2)
      - [Vrs conclusion](#vrs-conclusion)
    - [The electronic receptionist](#the-electronic-receptionist)
      - [Er demise](#er-demise)
    - [Craft dispatch system](#craft-dispatch-system)
    - [Clear communications](#clear-communications)
      - [The setup](#the-setup)
      - [Uncle bob](#uncle-bob)
      - [The phone call](#the-phone-call)
    - [Rose](#rose)
      - [The debates continued](#the-debates-continued)
      - [... by any other name](#-by-any-other-name)
    - [Architects registry exam](#architects-registry-exam)
    - [Conclusion](#conclusion-27)
  - [Stuff that didn't fit nicely elsewhere:](#stuff-that-didnt-fit-nicely-elsewhere)

<!-- /TOC -->

See notes on [design and architecture](/design)

## II.Object Oriented design principles

### 7. srp: the single responsibility principle

#### Symptom 1: accidental duplication

#### Symptom 2: merges

#### Solutions

#### Conclusion

### 8. ocp: the open-closed principle

#### A thought experiment

#### Directional control

#### Information hiding

#### Conclusion

### 9. lsp: the liskov substitution principle

#### Guiding the use of inheritance

#### The square/rectangle problem

#### Lsp and architecture

#### Example lsp violation

#### Conclusion

### 10. isp: the interface segregation principle

#### Isp and language

#### Isp and architecture

#### Conclusion

### 11. dip: the dependency inversion principle

#### Stable abstractions

#### Factories

#### Concrete components

#### Conclusion

### IV Component principles

### 12. components

#### A brief history of components

#### Relocatability

#### Linkers

#### Conclusion

### 13. component cohesion

#### The reuse/release equivalence principle

#### The common closure principle

##### Similarity with srp

#### The common reuse principle

##### Relation to isp

#### The tension diagram for component cohesion

#### Conclusion

### 14. component coupling

#### The acyclic dependencies principle

##### The weekly build

##### Eliminating dependency cycles

##### The effect of a cycle in the component dependency graph

##### Breaking the cycle

##### The 'jitters'

#### Top-down design

#### The stable dependencies principle

##### Stability

##### Stability metrics

##### Not all components should be stable

###### Abstract components

#### The stable abstractions principle

##### Where do we put the high-level policy?

##### Introducing the stable abstractions principle

##### Measuring abstraction

##### The main sequence

###### The zone of pain

###### The zone of uselessness

##### Avoiding the zones of exclusion

##### Distance from the main sequence

#### Conclusion

## Architecture Principles

### 15. what is architecture?

#### Development

#### Deployment

#### Operation

#### Maintenance

#### Keeping options open

#### Device independence

#### Junk mail

#### Physical addressing

#### Conclusion

### 16. independence

#### Use cases

#### Operation

#### Development

#### Deployment

#### Leaving options open

#### Decoupling layers

#### Decoupling use cases

#### Decoupling mode

#### Independent develop-ability

#### Independent deployability

#### Duplication

#### Decoupling modes (again)

#### Conclusion

### 17. boundaries: drawing lines

#### A couple of sad stories

#### Fitnesse

#### Which lines do you draw, and when do you draw them?

#### What about input and output?

#### Plugin architecture

#### The plugin argument

#### Conclusion

### 18. boundary anatomy

#### Boundary crossing

#### The dreaded monolith

#### Deployment components

#### Threads

#### Local processes

#### Services

#### Conclusion

### 19. policy and level

#### Level

#### Conclusion

### 20. business rules

#### Entities

#### Use cases

#### Request and response models

#### Conclusion

### 21. screaming architecture

#### The theme of an architecture

#### The purpose of an architecture

#### But what about the web?

#### Frameworks are tools, not ways of life

#### Testable architectures

#### Conclusion

### 22. the clean architecture

#### The dependency rule

##### Entities

##### Use cases

##### Interface adapters

##### Frameworks and drivers

##### Only four circles?

##### Crossing boundaries

##### Which data crosses the boundaries

#### A typical scenario

#### Conclusion

### 23. presenters and humble objects

#### The humble object pattern

#### Presenters and views

#### Testing and architecture

#### Database gateways

#### Data mappers

#### Service listeners

#### Conclusion

### 24. partial boundaries

#### Skip the last step

#### One-dimensional boundaries

#### Facades

#### Conclusion

### 25. layers and boundaries

#### Hunt the wumpus

#### Clean architecture?

#### Crossing the streams

#### Splitting the streams

#### Conclusion

### 26. the main component

#### The ultimate detail

#### Conclusion

### 27. services: great and small

#### Service architecture?

#### Service benefits?

##### The decoupling fallacy

##### The fallacy of independent development and deployment

#### The kitty problem

#### Objects to the rescue

#### Component-based services

#### Cross-cutting concerns

#### Conclusion

### 28. the test boundary

#### Tests as system components

#### Design for testability

#### The testing api

##### Structural coupling

##### Security

#### Conclusion

### 29. clean embedded architecture

#### App-titude test

#### The target-hardware bottleneck

##### A clean embedded architecture is a testable embedded architecture

###### Layers

###### The hardware is a detail

##### Don&#8217;t reveal hardware details to the user of the hal

###### The processor is a detail

###### The operating system is a detail

##### Programming to interfaces and substitutability

##### Dry conditional compilation directives

#### Conclusion

### Videtails

### 30. the database is a detail

#### Relational databases

#### Why are database systems so prevalent?

#### What if there were no disk?

#### Details

#### But what about performance?

#### Anecdote

#### Conclusion

### 31. the web is a detail

#### The endless pendulum

#### The upshot

#### Conclusion

### 32. frameworks are details

#### Framework authors

#### Asymmetric marriage

#### The risks

#### The solution

#### I now pronounce you &#8230;

#### Conclusion

### 33. case study: video sales

#### The product

#### Use case analysis

#### Component architecture

#### Dependency management

#### Conclusion

### 34. the missing chapter

#### Package by layer

#### Package by feature

#### Ports and adapters

#### Package by component

#### The devil is in the implementation details

#### Organization versus encapsulation

#### Other decoupling modes

#### Conclusion: the missing advice

### Viiappendix

### Aarchitecture archaeology

#### Union accounting system

#### Laser trim

#### Aluminum die-cast monitoring

#### 4-tel

#### The service area computer

##### Dispatch determination

##### Architecture

##### The grand redesign in the sky

##### Europe

##### Sac conclusion

#### C language

##### C

#### Boss

#### Pccu

##### The schedule trap

#### Dlu/dru

##### Architecture

#### Vrs

##### The name

##### Architecture

##### Vrs conclusion

#### The electronic receptionist

##### Er demise

#### Craft dispatch system

#### Clear communications

##### The setup

##### Uncle bob

##### The phone call

#### Rose

##### The debates continued

##### ... by any other name

#### Architects registry exam

#### Conclusion

### Stuff that didn't fit nicely elsewhere:

Notice that software is like physical laws in that they can not be proven, but can be falsified. Thus, tests can't prove software is correct, they can only prove it is broken. The best approximation of correctness is failing to prove software is broken.
