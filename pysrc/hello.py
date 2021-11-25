from browser import document, window, markdown, html
from browser.widgets.dialog import InfoDialog
import random
from pysrc import snjb

# This is pretty darn darn slow to load put it an a click handler
import pysrc.brython_runner_passage as runner

def get_content_of_file(filename):
    filename_w_cachebreak = f"/pysrc/{filename}?break_cache={random.random()}"
    return open(filename_w_cachebreak,'r').read()

def brython_main():
    # bind event 'click' on button to function echo
    # document["echo"].bind("click", click)

    # InfoDialog("Hello", f"Hello, Page Loaded From Brython !")
    document["bry-out"] <= html.DIV("Hello World!")
    document["bry-out"] <= html.DIV("Hello World!")

    document["py-source-code"].text = get_content_of_file("hello.py")
    # Highlight JS is installed on the page - call highlight
    window.hljs.highlightAll()
    render = runner.HtmlRenderer("gamediv", snjb.header).run(snjb._the_start)


brython_main()

