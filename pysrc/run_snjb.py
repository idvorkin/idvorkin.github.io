#!python3 run_snjb.py
from console_runner_passage import ConsoleRender
from snjb import start_game, header
from icecream import ic
ConsoleRender(header).run(start_game)
