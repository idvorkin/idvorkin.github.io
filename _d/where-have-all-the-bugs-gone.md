---
layout: post
title: "Where have all the bugs gone"
date: "2012-07-13 08:24:30 -0700"
---

I've been a software developer since 2001, and back then we used to have lots of bugs. Nowadays, it seems we don't have bugs, and I've wondered why. Now we have tickets which we get from our systems running in production, but that's quite different. What's going on?

There are two things:

1. Code reviews and all manner of automated testing is now commonplace

2. We don't have an intermediate time frame where software was 'done', but not shipped.

Back when working on Windows in the 2000s (yeah, I'm that old), the ship cycle was 6 months to 2 years, which meant you'd write code and it'd sit around with minimal use for a while. Unit tests didn't exist and code reviews were reviewed for complex parts of code, and at the time we treated testing as a separate function, and had testers. Those testers would "look for bugs" and then file bugs.

Nowadays the ship cycle is much shorter, and we've converged on the idea that engineers own the quality of their product. As a result, we do code reviews and unit tests, this lets defects become a thing that's addressed during development, and not a bug.

The first time your product is really used is once it hits production, which due to continuous integration, happens in low days, and when production has a defect, you don't get a bug, you get a ticket that the system isn't working.
