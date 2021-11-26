---
layout: post
title: Welcome to Steve's jungle and bar!
permalink: /snjb
notitle: true
---

Zach built Steve's Night Jungle and Bar in twee, here's our [port to python](https://github.com/idvorkin/idvorkin.github.io/blob/master/pysrc/snjb.py)!

<script>
    window.addEventListener('load', (_) => brython() )
</script>
<link rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>

<script type="text/python">

def startgame(_=0):
    runner.HtmlRenderer("gamediv", snjb.header).run(snjb.start_game)

from browser import document, window, markdown, html
from pysrc import snjb
import pysrc.brython_runner_passage as runner
document['reset-game'].innerHTML=""
reset_link = html.A("Restart SNJB")
reset_link.href = "#"
reset_link.bind('click',startgame)
document['reset-game'] <= reset_link
startgame()
</script>

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
