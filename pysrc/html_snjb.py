from browser import document, html

# Brython resolves imports relative to this script's directory (pysrc/),
# so import siblings directly instead of via the pysrc package.
import brython_runner_passage as runner
import snjb


def startgame(_=0):
    runner.HtmlRenderer("gamediv", snjb.header).run(snjb.start_game)


document["reset-game"].innerHTML = ""
reset_link = html.A("Restart SNJB")
reset_link.href = "#"
reset_link.bind("click", startgame)
document["reset-game"] <= reset_link
startgame()
