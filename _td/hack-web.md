---
layout: post
no-render-title: true
title: Hacking the web for fun and profit
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/hack-web.md)_

# Hacking the web for fun and profit

Now a days javascript and HTML are the assembly language of the web (I first [said this in 2012](http://ig2600.blogspot.com/2012/05/assembly-to-javascript-tsrs-to.html)). While still stuff is fun, it's very brittle because 1) the approach is brittle, and 2) everytime the code changes, which it will everything will break.

<!-- vim-markdown-toc GFM -->

- [Script Injection](#script-injection)
  - [Bookmarklets](#bookmarklets)
  - [Grease Monkey](#grease-monkey)
- [Console Tricks](#console-tricks)
  - [Load Jquery](#load-jquery)
- [Debugging 101](#debugging-101)
  - [Chrome Keyboard shortcuts](#chrome-keyboard-shortcuts)
  - [Force reloading](#force-reloading)
  - [Capturing an object for later use](#capturing-an-object-for-later-use)
  - [Black boxing](#black-boxing)
  - [Event Handlers](#event-handlers)
- [Real life examples](#real-life-examples)
  - [Automating todo item creation in omnifocus for web](#automating-todo-item-creation-in-omnifocus-for-web)
  - [Screen Size Previews](#screen-size-previews)
  - [Open graph preview Facebook](#open-graph-preview-facebook)
  - [Web Site Preview Debugger](#web-site-preview-debugger)
- [Fly out TOC](#fly-out-toc)
  - [CSS](#css)
  - [Javscript Reverse Engineering Fly out TOC](#javscript-reverse-engineering-fly-out-toc)
- [CSS - Styling a web page low level abstraction.](#css---styling-a-web-page-low-level-abstraction)
  - [CSS selectors](#css-selectors)
- [Bootstrap - A higher level abstraction over css.](#bootstrap---a-higher-level-abstraction-over-css)
- [Other resources](#other-resources)

<!-- vim-markdown-toc -->

## Script Injection

### Bookmarklets

Turns out you can stick javascript in the address bar, that's a bookmarklet. Here it is from the [way back machine](http://ig2600.blogspot.com/2012/05/assembly-to-javascript-tsrs-to.html))

### Grease Monkey

Called Taper Monkey for chrome, it autoloads a script when you enter a webpage. Useful to personalize websites via css and javascript.

## Console Tricks

### Load Jquery

## Debugging 101

### Chrome Keyboard shortcuts

https://developers.google.com/web/tools/chrome-devtools/shortcuts

| Key   | Command                       |
| ----- | ----------------------------- |
| C-S-I | Enter dev tools               |
| C-S-M | Toggle Mobile Emulator        |
| C-S-R | Hard reload (breaking cache)  |
| C-S-P | Command Pallette (super cool) |

### Force reloading

Often needed for CSS -

- A) C-S-R
- Network Tab -> Disable caching

### Capturing an object for later use

Often there's a useful object, that's only available in the closure. You can always assign a refernce on window e.g.

    window.foo = foo_from_within_a_closure_found_from_debugging

### Black boxing

### Event Handlers

## Real life examples

These should break all the time, and be of minimal interst to anyone but Igor, but it's my blog so there.

### Automating todo item creation in omnifocus for web

**Too painful - got into some react/redux sync model, gave up**

Ominfocus doesn't supprot APIs, so we need to automate the web.

In omnifocus, you can add a task by pressing the 'c' key, which brings up a dialog. We can "hook that", by setting a breakpoing on global keypress events.

From there, we get into a closure that has an interesting object. Copy that to global scope.

### Screen Size Previews

https://www.duplichecker.com/screen-resolution-simulator.php#

### Open graph preview Facebook

https://developers.facebook.com/tools/debug/

### Web Site Preview Debugger

https://metatags.io/

## Fly out TOC

I started by trying to create this myself, but as with most "build" vs "buy", you're better off stealing and buying. Looks like this exists in:

### CSS

- Foundation - called [magellon](https://get.foundation/sites/docs/magellan.html)
- Bootstrap - called [scroll spy](https://getbootstrap.com/docs/4.4/components/scrollspy/)

### Javscript Reverse Engineering Fly out TOC

Looks like the CSS needs to have the data setup correctly. I found some javascript to do this in [hackmd](https://github.com/hackmdio/codimd/search?q=generateToc&unscoped_q=generateToc), and started putzing with it. Looks like that gets me the DOM in the form I need.

## CSS - Styling a web page low level abstraction.

CSS is stying for the web. CSS is very complex. I recommend using a higher level framework like Bootstrap in general, however abstractions are leaky so you also need to understand some core CSS concepts.

### CSS selectors

I always forget these, but it matters as that's how you select elements in jquery

A full [summary](https://www.w3schools.com/cssref/css_selectors.asp), below are some I often use.

- \$(.class)
- \$(#id)
- \$(element) #e.g. h1

When nesting selectors here are the [operators](https://techbrij.com/css-selector-adjacent-child-sibling)

- space - decendant at any level
- > - immediate decendant
- - - Adjecent (e.g. sibling)
- ~ - Not Adjecent (e.g. not sibling)

## Bootstrap - A higher level abstraction over css.

If you're using styles directly, you're probably doing it wrong. Bootstrap is designed to handle different operations at different view ports, very helpful.
For example, you can hide an element if you're not on an extra large screen.

## Other resources
