---
layout: post
title: "Software Rot"
date: "2017-09-10 07:25:12 Pacific Daylight Time"
tags:
  - software engineering
---

After a year of not working on one of my hobby software projects, I decided it'd be fun to make a minor change - should only be few lines of code. Should be easier still since I followed all the project best practices: I had full unit tests, and a fully automated command line build but boy was I wrong.

Much of the tool chain was now using "prehistoric" versions. Upgrading should have been simple, but of course each "current" version had its own backwards compatibility blockers, quirks, and incompatibilities with the other parts of the tool chain. Of course, when you look at the [change](https://github.com/idvorkin/onom/commit/b105f5079737806a88b970f1d5c8754e30409352) it seems easy, but it's expensive to find which changes to be made.

Now that project was building, it was time to make my few lines of changes. When I went to implement the code something wasn't right. I was digging around and couldn't find quite the right way to implement the feature. After more code splunking, I realized I'd already made the change I wanted a year ago.

Oh well, at least I'll be ready to make the next change.
