---
layout: post
title: The Mystery of the google ads
permalink: /docker
---

Docker has 2 values, isolation and repeatable setup. Here are my notes

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Useful commands and notes](#useful-commands-and-notes)
- [Real applications, my blog](#real-applications-my-blog)
    - [Requirements](#requirements)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Useful commands and notes

- **docker stats** - Show how much memory is being used
- docker attach - connect to stdio

## Real applications, my blog

### Requirements

I work on my blog on multiple machines. But the software execution dependancies are hard, and can be error prone. I will try setting it up so the server and build software runs in a container, but file editing stays on my local machine.
