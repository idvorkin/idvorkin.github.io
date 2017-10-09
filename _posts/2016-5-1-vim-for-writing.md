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

You can run the spell checker with: 

    :spell
    " ]s,  [s  to jump to next,prev mispelling.
    " z= Fix word.

You can run the thesaurus with: 

    \ts (normally \cs if you dont' have nerd commenter)


### Installation
Add the following to your _vimrc:

    Bundle 'reedes/vim-pencil'
    Bundle 'junegunn/goyo.vim'
    Bundle 'junegunn/limelight.vim'
    Bundle 'Ron89/thesaurus_query.vim'

Happy Vimming
