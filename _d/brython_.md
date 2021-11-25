---
layout: post
title: A playground for brython and pystory
permalink: /brython
---

This page is built with [brython](https://brython.info/gallery/gallery_en.html), a python running in browser via WASM.

<div class="alert alert-primary" id="sunburst_text">
    Click in the circle for a suggestion
</div>

<script>
    console.log("brython at script time")
    window.addEventListener('load', (event) => {
        console.log("brython at window load time")
        brython()
        });
</script>

<script type="text/python">
from browser import document, window
from browser.widgets.dialog import InfoDialog

InfoDialog("Hello", f"Hello, Page Loaded From Brython !")
def click(ev):
    InfoDialog("Hello", f"Hello, {document['zone'].value} !")

    # bind event 'click' on button to function echo
    document["echo"].bind("click", click)
document["bry-out"].text = "Hello World From Brything"
window.console.log('hello from brython')
</script>

Render UX to:

<script type="text/python" src='pysrc/hello.py'>
</script>

<div id='bry-ux' class='border>
</div>

Write to id=bry-out

<div id='bry-out' class='border'>

</div>
