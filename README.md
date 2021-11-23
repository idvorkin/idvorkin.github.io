# Igor's collection of ever green notes

This [blog](https://idvork.in) contains my [evergreen notes](https://notes.andymatuschak.org/z4SDCZQeRo4xFEQ8H4qrSqd68ucpgE6LU155C), and an [enabling environment](https://notes.andymatuschak.org/z3DaBP4vN1dutjUgrk3jbEeNxScccvDCxDgXe) to interact with them. These are currently intermingled, but

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Key user features](#key-user-features)
    - [Permalink](#permalink)
    - [Table of Contents](#table-of-contents)
    - [Back Links](#back-links)
    - [Search](#search)
    - [No broken links](#no-broken-links)
    - [Select a Random Page](#select-a-random-page)
    - [Keyboard features](#keyboard-features)
    - [Comments](#comments)
- [Key authoring features](#key-authoring-features)
    - [Markdown based editing and version control](#markdown-based-editing-and-version-control)
    - [Permalinks](#permalinks)
    - [Table of Contents](#table-of-contents-1)
    - [Back Links](#back-links-1)
    - [Search](#search-1)
    - [No broken links](#no-broken-links-1)
    - [Keyboard shortcuts](#keyboard-shortcuts)
- [Technical Wizardry](#technical-wizardry)
    - [Typescript - Reduce the easy Javascript Errors](#typescript---reduce-the-easy-javascript-errors)
    - [Cypress - E2E and Unit Testing](#cypress---e2e-and-unit-testing)
    - [Useful scripts](#useful-scripts)
    - [Re-writing from scratch](#re-writing-from-scratch)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Key user features

### Permalink

### Table of Contents

### Back Links

### Search

### No broken links

- A script validates no broken links keeping everythign nice

### Select a Random Page

- Click the monkey on this page!

### Keyboard features

- ? - See help while in a post
- t - Toggle ToC

### Comments

Not yet implemented, however a few things I tried that I disliked:

- Disquis
- Gitter
- hackmd

Something that seems good (for developers), is direct linking to the page on GitHub master so you can comment. However this [isn't supported](https://github.com/isaacs/github/issues/284)

## Key authoring features

### Markdown based editing and version control

A Jekyll blog stored in markdown

### Permalinks

Standard markdown feature

### Table of Contents

### Back Links

### Search

Uses algolia:

- bi.sh - Build index for algolia search

### No broken links

I use a [python script](https://github.com/idvorkin/LinqPadSnippets/blob/master/python/linkchecker.py)

    ~/gits/linqpadsnippets/python(master⚡) » ./checklinks.sh

### Keyboard shortcuts

## Technical Wizardry

This blog also serves as a home to let me experiment with fun tech. Here's some of it:

### Typescript - Reduce the easy Javascript Errors

### Cypress - E2E and Unit Testing

Install Dependancies for running on AWS VM's (And maybe CI packages):

    yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib

Need to do a coverage run

    npm run coverage

Note you can debug slow cypress tests via:

    set DEBUG=cypress*
    npm run cypress:run

### Useful scripts

- js.sh - Run the development server with live reload and excluding spurious Jekyll warnings
- prettier - Opinionated consistent formatting, auto run on git commit
- vim-toc-generator - Auto generate TOCs, auto run on save
- checklinks.sh- Check for [broken links](https://github.com/idvorkin/LinqPadSnippets/blob/master/python/checklinks.sh) - Runs manaully from other repro

### Re-writing from scratch

See some of my notes at [https://github.com/idvorkin/idvorkin.github.io/blob/master/_td/hack-web.md]
