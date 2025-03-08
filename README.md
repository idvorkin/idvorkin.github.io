# Igor's Enabling Environment and Ever green notes

[![idvork.in](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/s7659o&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/s7659o/runs)

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
    - [Author: Markdown based editing and version control](#author-markdown-based-editing-and-version-control)
    - [Author: Permalinks](#author-permalinks)
    - [Author: Table of Contents](#author-table-of-contents)
    - [Author: Back Links](#author-back-links)
    - [Author: Search](#author-search)
    - [Author: No broken links](#author-no-broken-links)
    - [Author: Keyboard shortcuts](#author-keyboard-shortcuts)
- [Technical Wizardry](#technical-wizardry)
    - [Typescript - Reduce the easy Javascript Errors](#typescript---reduce-the-easy-javascript-errors)
    - [Cypress - E2E and Unit Testing](#cypress---e2e-and-unit-testing)
    - [Vitest - Unit Testing](#vitest---unit-testing)
    - [Useful scripts](#useful-scripts)
    - [Re-writing from scratch](#re-writing-from-scratch)
    - [Compilation workflow](#compilation-workflow)
    - [Jekyll setup](#jekyll-setup)

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

### Author: Markdown based editing and version control

A Jekyll blog stored in markdown

### Author: Permalinks

Standard markdown feature

### Author: Table of Contents

### Author: Back Links

### Author: Search

Uses algolia:

- bi.sh - Build index for algolia search

### Author: No broken links

I use a [python script](https://github.com/idvorkin/LinqPadSnippets/blob/master/python/linkchecker.py)

    ~/gits/linqpadsnippets/python(master⚡) » ./checklinks.sh

### Author: Keyboard shortcuts

## Technical Wizardry

This blog also serves as a home to let me experiment with fun tech. Here's some of it:

### Typescript - Reduce the easy Javascript Errors

### Cypress - E2E and Unit Testing

Cypress is used for end-to-end testing and some unit testing. The tests are located in the `cypress/e2e` directory.

### Vitest - Unit Testing

Vitest is used for unit testing TypeScript code. The tests are located in the `src/__tests__` directory.

To run the tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Useful scripts

- js.sh - Run the development server with live reload and excluding spurious Jekyll warnings
- prettier - Opinionated consistent formatting, auto run on git commit
- vim-toc-generator - Auto generate TOCs, auto run on save
- checklinks.sh- Check for [broken links](https://github.com/idvorkin/LinqPadSnippets/blob/master/python/checklinks.sh) - Runs manaully from other repro

### Re-writing from scratch

See some of my notes at [https://github.com/idvorkin/idvorkin.github.io/blob/master/_td/hack-web.md]

### Compilation workflow

It's pretty complicated, rendered with [excalidraw](/tools#excalidraw):

![Build workflow](/images/build-workflow.png)

### Jekyll setup

What a PITA

```bash
# at runtime
export LD_LIBRARY_PATH=/home/linuxbrew/.linuxbrew/lib

# at compile time
brew install rbenv libffi
brew link libffi

export RUBY_CONFIGURE_OPTS="--with-openssl-dir=$(brew --prefix openssl@1.1)"                                                                                                                                             1 ↵
rbenv install  2.7.3
```
