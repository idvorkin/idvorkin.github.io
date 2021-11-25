---
layout: post
title: A playground for brython and pystory
permalink: /brython
---

This page is built with [brython](https://brython.info/gallery/gallery_en.html), a python running in browser via WASM. This is my playground to try interesting things with brython.

<script>
    window.addEventListener('load', (_) => brython() )
</script>
<link rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>

<script type="text/python" src='pysrc/hello.py'>
</script>

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Brython DOM Manipulation](#brython-dom-manipulation)
    - [Steve's jungle and Bar](#steves-jungle-and-bar)
- [Source code](#source-code)
    - [Python code](#python-code)
    - [Brython loader, and Python include](#brython-loader-and-python-include)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

### Brython DOM Manipulation

#### Steve's jungle and Bar

<div id="gamediv">
</div>

Render UX to:

<div id='bry-ux' class='border'>
</div>

Write to id=bry-out

<div id='bry-out' class='border'>
</div>

### Source code

For my tech friends, here's what the code looks like.

#### Python code

The python code block is read at run time, from the python code.

<pre><code id="py-source-code" class="language-python">
    Replaced by python code
    </code></pre>

#### Brython loader, and Python include

<pre> <code class="language-html">&lt;script&gt;
    window.addEventListener('load', (_) => brython() )
&lt;/script&gt;

&lt;script type="text/python" src='pysrc/hello.py'&gt;&lt;/script&gt;</code> </pre>
