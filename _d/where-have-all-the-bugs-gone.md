---
layout: post
title: "Where have all the bugs gone"
date: "2012-07-13 08:24:30 -0700"
---

I've been a software developer since 2001, and back then we used to have lots of bugs. Now a days, it seems we don't have bugs, and I've wondered why. Now we have tickets which we get from our systems running in operations, but that's quite different. What's going on?

There are two things:

1. Code reviews and all manner of automated testing is now common place
2. We don't have an intermediate time frame where software was 'done', but not shipped.

Back when working on Windows, we'd do development, get things checked in, have testers test it and keep going for 6 months without shipping. Issues found during developement and code review weren't really bugs, as the code wasn't checked in yet.

Now a days, your tests run without delay, and no one uses your product until it's in production. So, by having instants tests, and not having software sitting around unshipped, the only bugs you get are 'tickets' found in production.
