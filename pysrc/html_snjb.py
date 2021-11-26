from browser import document, window, markdown, html
from browser.widgets.dialog import InfoDialog
from pysrc import snjb

def startgame(_=0):
    runner.HtmlRenderer("gamediv", snjb.header).run(snjb.start_game)

from pysrc import snjb
import pysrc.brython_runner_passage as runner
document['reset-game'].innerHTML=""
reset_link = html.A("Restart SNJB")
reset_link.href = "#"
reset_link.bind('click',startgame)
document['reset-game'] <= reset_link
startgame()