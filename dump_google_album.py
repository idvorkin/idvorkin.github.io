#!python3

import os
import openai
import json
from icecream import ic
import typer
import sys
from rich import print as rich_print
import rich
import re
from typeguard import typechecked


app = typer.Typer()


@app.command()
def default():
    text = open(os.path.expanduser("~/tmp/data")).read()

    # ("99218341":[[1,["my string"]]],)
    #  Regexp notes:  \ escapes the [ and ] the trailing ? (e.g. *?0)  makes non greedy matches
    pattern = """"99218341":\[\[1,\["(.*?)"\]\]\],"""
    matches = re.findall(pattern, text)
    print(len(matches))
    for i in matches:
        print(i)


if __name__ == "__main__":
    app()
