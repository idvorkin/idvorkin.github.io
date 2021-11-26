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
    runner.HtmlRenderer("gamediv", snjb.header).run(snjb._the_start)

from browser import document, window, markdown, html
from pysrc import snjb
import pysrc.brython_runner_passage as runner
document['reset-game'].bind('click',startgame)
startgame()
</script>

<div class='border' style="min-height:30em">
    <div id="gamediv">
        <div> Good things come to those that wait - see you soon! </div>
        <div class="d-flex">
            <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
        </div>
    </div>
</div>
<div class="d-grid gap-2 d-md-block">
    <button id='reset-game' type="button" class="btn-info btn-block">Restart the game</button>
</div>
