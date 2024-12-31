---
layout: post
title: Testing and Quality
permalink: /testing
---

If it's not tested, it doesn't work. When your tests passing lets you deploy without any concerns, your tests are good enough. Otherwise, you've got more work to do.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Why test?](#why-test)
- [Types of tests](#types-of-tests)
  - [Smoke Testing](#smoke-testing)
  - [Acceptance Tests - Validation that requirements are met](#acceptance-tests---validation-that-requirements-are-met)
  - [End To End Tests - Expensive but critical](#end-to-end-tests---expensive-but-critical)
  - [Integration Tests - Correct interactions with external world](#integration-tests---correct-interactions-with-external-world)
  - [Snapshot Tests - Validating UX](#snapshot-tests---validating-ux)
  - [External Dependency Testing - The Humble Object](#external-dependency-testing---the-humble-object)
  - [Unit Tests - The code does what the developer wants](#unit-tests---the-code-does-what-the-developer-wants)
  - [Compiler and static analysis based testing](#compiler-and-static-analysis-based-testing)
- [Non-functional testing](#non-functional-testing)
  - [Load Testing](#load-testing)
  - [Stress Testing](#stress-testing)
  - [Security Testing](#security-testing)
  - [Fuzz Testing](#fuzz-testing)
  - [Performance](#performance)
  - [Thread safety](#thread-safety)
- [Testing in production and monitoring](#testing-in-production-and-monitoring)
  - [A/B Testing](#ab-testing)
  - [Operational Monitoring](#operational-monitoring)
  - [Inside out/Canary Testings](#inside-outcanary-testings)
- [To be categorized](#to-be-categorized)
  - [The role of a QA team](#the-role-of-a-qa-team)
  - [Cost of tests vs cost of development](#cost-of-tests-vs-cost-of-development)
  - [Cost to change the tests](#cost-to-change-the-tests)
  - [AI Testing](#ai-testing)
- [Great books](#great-books)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Why test?

Software needs to work, and if it's not tested, it doesn't work. In the rare event it works today, I assure you it'll stop working after you make a change. If you can't make a change safely, your system will go to shit instantly.

Making code testable forces better design:
- Small, focused functions with clear inputs and outputs
- Separation of concerns - business logic separate from UI/database/external services
- Dependency injection instead of global state
- Clear interfaces between components
- Reduced coupling between modules
- Better documentation through tests as examples

Very related to [design](/design)

- SOLID designs (OO joke there, haha!)
- Safe to refactor
- Always safe to deploy
- System is well documented

## Types of tests

### Smoke Testing

- **Purpose**: Verify basic functionality works after deployment
- **Scope**: Core system paths and critical features
- **Written by**: Developers or QA team
- **Maintenance**: Low - focuses on stable core paths
- **Example**: Verifying login flow, basic API endpoints respond, database connections work
- **Regression Role**: Quick detection of major system failures

### Acceptance Tests - Validation that requirements are met

- **Purpose**: Validate that requirements are met
- Creates a test plan based on functional requirements
- Compares actual results with expected results
- Focuses on business value and user scenarios
- Often written in collaboration with product/business stakeholders

### End To End Tests - Expensive but critical

- **Purpose**: Validate entire system works together
- **Scope**: Full system testing from user perspective
- **Configurations**: Multiple environments and setups
  - Different devices
  - Different browsers
  - Different screen orientations
  - Different operating systems
- **Cost**: Most expensive tests to maintain
- **Value**: Critical for ensuring full system functionality
- **Quantity**: Keep these minimal but strategic

### Integration Tests - Correct interactions with external world

- **Purpose**: Verify correct interactions between components
- **Scope**:
  - Service-to-service communication
  - API interactions
  - Data transmission between components
  - Database interactions
- **Focus Areas**:
  - API contract testing
  - Data consistency
  - Error handling between services
  - Network resilience
- **Value**: Catches integration issues before end-to-end testing

#### The Humble Object Pattern
When dealing with external dependencies that are hard to test (like UI, hardware, etc.):

1. Extract all logic from the hard-to-test component into a testable service
2. Leave only the bare minimum code in the "humble" component that interfaces with the external dependency
3. The humble component becomes a thin adapter that's so simple it may not need tests

**Example**:
- Instead of testing UI rendering directly, extract business logic into a testable view model
- UI component becomes a simple "humble" translator between view model and screen

**Common uses**:
- UI rendering
- Hardware interfaces
- File system operations
- Network calls
- Database access


### Snapshot Tests - Validating UX

- **Purpose**: Validate UI/UX remains consistent
- **How it works**: 
  - Takes a "snapshot" of UI output (HTML, JSON, etc.)
  - Compares future runs against saved snapshot
  - Flags any unexpected changes
- **Best for**:
  - UI components
  - API responses
  - Configuration files
  - Generated code
- **Benefits**:
  - Quick to write
  - Catches unintended UI changes
  - Documents expected behavior
- **Challenges**:
  - Can be brittle
  - Need regular maintenance
  - Must carefully review changes
- **Best practices**:
  - Keep snapshots focused and small
  - Review diffs carefully
  - Update intentionally, not blindly


### Unit Tests - The code does what the developer wants

- **Purpose**: Verify individual components work as designed
- **Scope**: Single functions/classes in isolation
- **Written by**: Developers
- **Maintenance**: Changes with code implementation
- **Example**: Testing a function that calculates tax on an order
- **Regression Role**: Catches regressions in component logic

Back in the 2000s, "amazing developers" walked through all their code in the debugger to make sure it was doing what was expected. But like all manual activities, this gets dreary, error-prone, and skipped. Instead, write unit tests to ensure your code works as you expect.

### Compiler and static analysis based testing

If you use a strongly typed language, and use types as much as you can, you get lots of testing for free from the compiler!
Similarly, if you can have automated code analysis, you get testing for free through analysis. See [AWS Code Guru](https://aws.amazon.com/codeguru/), and [some bugs it detects](https://noise.getoto.net/2021/09/07/finding-code-inconsistencies-using-amazon-codeguru-reviewer/).

_These bugs are the kinds of errors that developers can unknowingly introduce in the course of their day-to-day work. Introducing bugs is easy, but tracking down their root causes can be hard. Some of the bugs even found issues that went against the official documentation. One team found a race condition with the Java `ConcurrentHashMap` type; the documentation said it was thread-safe, but if two threads picked up the process at the same time, the values of instantiated `ConcurrentHashMap` objects could be overwritten._

_The first involved key derivation and password hashing using the Argon2 algorithm. Chan knew about password hashing, but not with the fairly new Argon2 algorithm. The second came from invoking a shell command with `subprocess.Popen([cmd], shell=True)`, which could risk unwanted privilege escalation in the shell. Instead, he used the `shlex.split()` and `shlex.quote()` commands to avoid invoking a shell at all._

From Programming with types:

_Although a weak type system is easier to work with in the short term, as it doesn’t force programmers to explicitly convert values between types, it does not provide the same guarantees we get from a stronger type system. Most of the benefits described in this chapter and the techniques employed in the rest of this book lose their effectiveness if they are not properly enforced._

Examples:

- Making types for primitive types, like encoding units - E.g. a type for meters vs inches (space catastrophe)
- A type for velocity vs volume.
- Rust for borrow
- JS to TS
- Python type system
- Implicit Typing vs Duck Typing
- It's hard to make it compile, but once compiles it works.

## Non-functional testing

### Load Testing

Tests applications’ performance by simulating different loads. Then we can calculate the capacity of the application.

### Stress Testing

We deliberately create high loads to the APIs and test if the APIs are able to function normally.

### Security Testing

This tests the APIs against all possible external threats.

### Fuzz Testing

This injects invalid or unexpected input data into the API and tries to crash the API. In this way, it identifies the API vulnerabilities.

### Performance

### Thread safety

## Testing in production and monitoring

### A/B Testing

### Operational Monitoring

### Inside out/Canary Testings

## To be categorized

### The role of a QA team

### Cost of tests vs cost of development

### Cost to change the tests

### AI Testing

{% include summarize-page.html src="/ai-testing" %}

## Great books

{% include amazon.html asin="B09782L692;B095C16LSW;1492052205" %}
