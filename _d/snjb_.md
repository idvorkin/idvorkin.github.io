---
layout: post
title: Welcome to Steve's jungle and bar!
permalink: /snjb
notitle: true
---

My son Zach wrote Steve's Night Jungle and Bar, his own choose-your-own-adventure game, in [Twine](https://twinery.org)'s twee format. I loved it so much I [ported it to Python](https://github.com/idvorkin/idvorkin.github.io/blob/master/pysrc/snjb.py) so it could live here on the blog, running in your browser via [Brython](https://brython.info). Play it below.

<script src="https://cdn.jsdelivr.net/npm/brython@3/brython.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/brython@3/brython_stdlib.js"></script>

<script>
    window.addEventListener('load', (_) => brython() )
</script>
<div style='visibility:hidden'>
    <script type="text/python" src='pysrc/html_snjb.py'></script>
</div>

<div id='reset-game' class="alert alert-info">
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        Trying to find Steve
        <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
</div>

<div class='border'>
    <div id="gamediv">
    </div>
</div>
