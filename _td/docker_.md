---
layout: post
title: Docker tools
permalink: /docker
---

Docker has 2 values, isolation and repeatable setup. Here are my notes

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Useful commands and notes](#useful-commands-and-notes)
- [TUI](#tui)
- [Real applications, my blog](#real-applications-my-blog)
    - [Requirements](#requirements)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Useful commands and notes

- **docker stats** - Show how much memory is being used
- docker attach - connect to stdio
- docker run -it image - run image in interactive mode, with a terminal
- docker build -t image_name directory name - build and assign it a tag
- Kill all stopped containers - `docker rm $(docker ps --filter status=exited -q)`
- Erase dangling containers
  docker volume rm \$(docker volume ls -qf dangling=true)

## TUI

- lazydocker

## Real applications, my blog

### Requirements

I work on my blog on multiple machines. But the software execution dependencies are hard, and can be error prone. I will try setting it up so the server and build software runs in a container, but file editing stays on my local machine.
