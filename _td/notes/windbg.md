---
layout: post
no-render-title: true
title: WinDBG notes
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/notes/windbg.md)_

# WinDBG notes

Set breakpoint when runtime loads (e.g exception when loading clr)

    sxe ld:clr

Load SOS

    sxe ld:clr

Dump callstack

    !clrstack
