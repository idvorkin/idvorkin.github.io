---
layout: post
title: "Vim For Writing"
author: "Igor Dvorkin"
comments: true
inprogress: true

tags:
  - vim
  - writing
---

VIM is great at lots of things, but free form writing has a few gaps in 'line wrapping' and 'distraction free visual beauty'. These gaps can be closed with the plugins Pencil, Goyo and LimeLight.

{% include alert.html content="Note: I've since switched to Neovim, but the concepts in this post still apply. For my latest Neovim setup, check out my nvim configuration notes." style="info" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [General](#general)
    - [Line wrapping](#line-wrapping)
    - [Distraction Free Visual Beauty](#distraction-free-visual-beauty)
    - [Focus on current paragraph](#focus-on-current-paragraph)
    - [Spelling and Thesaurus.](#spelling-and-thesaurus)
- [Markdown](#markdown)
    - [Auto Linting](#auto-linting)
    - [Table of Contents](#table-of-contents)
    - [Quick switchting via FZF on files, tags and history](#quick-switchting-via-fzf-on-files-tags-and-history)
    - [Tags and tagbar while writing, better then Toc](#tags-and-tagbar-while-writing-better-then-toc)
    - [Installation](#installation)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## General

### Line wrapping

Pencil makes the motion commands 'just work' when you're in :wrap. When writing paragraphs, you likely want to enable this. Best of all, it doesn't add pagination to the source file.

```
:PencilSoft " A works as expected wrapped mode.
:PencilHard " When you want :nowrap behavior.
```

### Distraction Free Visual Beauty

Goyo makes your buffer pretty by centering the writing and getting rid of the status bar. For me, a much more focused experience.

    :Goyo   " Toggle Distraction Free mode

### Focus on current paragraph

Lime light fades out the background paragraphs. For me, a much more focused experience.

    :LimeLight
    :LimeLight 0.9 "0.9 -> Make foreground contrast 90%

### Spelling and Thesaurus.

You can run the built in spell checker with:

    :spell
    " ]s,  [s  to jump to next,prev mispelling.
    " z= Fix word.

I gotta say, I prefer the aspell checker as it's faster to replace misspellings:

    brew install aspell

You can run the thesaurus with:

    \ts (normally \cs if you dont' have nerd commenter)

## Markdown

### Auto Linting

Use prettier to make your markdown consistent. I execute it as a git [precommit hook via husky](https://github.com/idvorkin/idvorkin.github.io/commit/170ef805e458eac9eb7260ee9319fccb074d1f6b):

### Table of Contents

Use vim-markdown-toc-end and prettier gaurds as prettier messes with it. See the markdown headers. I also do a ToC sidebar on the viewer (make this page).

### Quick switchting via FZF on files, tags and history

See my .vimrc

### Tags and tagbar while writing, better then Toc

Super cool - use tagbar and mdctags (see vimrc), way better then :Toc

### Installation

Add the following to your \_vimrc:

    Bundle 'reedes/vim-pencil'
    Bundle 'junegunn/goyo.vim'
    Bundle 'junegunn/limelight.vim'
    Bundle 'Ron89/thesaurus_query.vim'

Happy Vimming
