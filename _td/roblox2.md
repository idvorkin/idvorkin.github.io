---
layout: post
title: Developing on roblox
permalink: /roblox-dev
---

Zach and Amelia are roblox fans, so it's fun to be able to create things in there playgrounds. With Zach (and maybe Amelia in a while) it's even more fun to get to program. Here's some stuff I've learned about programming robolox.

<!-- prettier-ignore-start -->


<!-- vim-markdown-toc-start -->

- [Roblox Environment](#roblox-environment)
- [Tool Chain](#tool-chain)
    - [The language - Lua (you get used to it)](#the-language---lua-you-get-used-to-it)
    - [The editor and tools - VS Code and plugins](#the-editor-and-tools---vs-code-and-plugins)
    - [Package managers](#package-managers)
        - [Foreman - Install Tools](#foreman---install-tools)
        - [Wally - Install Packages](#wally---install-packages)
- [Libraries](#libraries)
    - [Roblox](#roblox)
- [Testing](#testing)
- [My games](#my-games)
- [Philosophy](#philosophy)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Roblox Environment

## Tool Chain

### The language - Lua (you get used to it)

Oddly, Roblox scripting is done via Lua. Lua is verbose in syntax and has oddites (indexing starts at 1 - blashemy). At first this was overwhelming to me, but thanks to a very strong tool chain, you stop worrying about it.

### The editor and tools - VS Code and plugins

I love VIM, but as is often the case, the tooling in VS Code is better. Most of the following tools integrate into VS.Code. The vs.code plugins will often have both a VS Code plugin and a roblox studio plugin, make sure to install both

See [them in my project](https://github.com/idvorkin/cat-lady-2/blob/main/.vscode/extensions.json)

- Amazing Autocompletion - Microsoft Co-Pilot
- Edit roblox files outside studio - Rojo
- Lint your files - Selene
  - With Selene - enable roblox mode
- Good Code Completion - Roblox LSP
- Better Debugging in VS.Code - Roblox Output Sync
- Language Support - Lua Plugin

Not Sure I use this:

- Robolox Lua Autocomplete

### Package managers

1. crates install foreman
2. ~/.cargo/bin/foreman install

#### Foreman - Install Tools

3. ~/.foreman/bin/wally install
4. [https://wally.run/](https://wally.run/)

#### Wally - Install Packages

## Libraries

### Roblox

## Testing

## My games

## Philosophy
