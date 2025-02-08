---
layout: post
title: "Igors Vim Tips"
permalink: /vim
redirect_from:
  - /nvim
---

I used Vim for years, but have now transitioned to Neovim. While most of these tips work in both editors, some are Neovim-specific. Here's my collection of tips I want to practice and remember.

{% include summarize-page.html src="/neovim" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Code Changes](#code-changes)
- [Git integration](#git-integration)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

### Code Changes

- <space>rn - Rename
- yaf (yank a function) - Via TreeSitter+TreeSitter Motions
- \xX -> Open Diagnostics - Via Trouble
- <space>ai auo import
- <space>code action
- <space>gd - go to definition - Via LSP
- <space>gt - go to type
- \cc - Comment or uncomment

### Git integration

- NeoGit (Gosh I can't figure this out)
- DiffViewOpen
- Telescope git_status
- Telescope git_files

Nice Telescope - Telescope git_status
