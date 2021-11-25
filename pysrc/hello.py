from browser import document, window
from browser.widgets.dialog import InfoDialog
import random

# This is pretty darn darn slow to load put it an a click handler
import pysrc.snjb
import pysrc.brython_runner_passage as runner

def get_content_of_file(filename):
    filename_w_cachebreak = f"/pysrc/{filename}?break_cache={random.random()}"
    return open(filename_w_cachebreak,'r').read()

def brython_main():
    # bind event 'click' on button to function echo
    # document["echo"].bind("click", click)

    # InfoDialog("Hello", f"Hello, Page Loaded From Brython !")
    document["bry-out"].text = "Hello World From Brything"
    document["py-source-code"].text = get_content_of_file("hello.py")
    # Highlight JS is installed on the page - call highlight
    window.hljs.highlightAll()
    print (pysrc.snjb._the_start())
    render = runner.HtmlRenderer("gamediv")


brython_main()

