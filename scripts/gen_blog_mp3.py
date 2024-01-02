#!/usr/bin/env python3
import typer
import json
from pathlib import Path
import subprocess
from icecream import ic


app = typer.Typer()


@app.command()
def dump_blog(voice="igor"):
    path_data = Path.home() / "blog/back-links.json"
    json_data = json.loads(path_data.read_text())
    url_info_map = json_data["url_info"]
    for url_info in url_info_map.values():
        text = url_info["description"]
        url = url_info["url"]
        # convert slashes to _
        filename = Path(f"{url.replace('/','_')}.mp3")
        ic(filename)
        tts(voice, text, filename)


@app.command()
def dump_eulogy(voice="igor"):
    eulogy = Path.home() / "blog/eulogy.json"
    eulogy_roles = json.loads(eulogy.read_text())
    for role in eulogy_roles["roles"]:
        text = role["summary"]
        role_filename = Path(f"{role['title']}.mp3")
        tts(voice, text, role_filename)


def tts(voice, text, filename: Path):
    process = subprocess.Popen(
        [
            "tts",
            "say",
            f"--voice={voice}",
            "--no-speak",
            "--no-fast",
            f"--outfile={filename}",
        ],
        stdin=subprocess.PIPE,
    )
    # Write the summary directly to the tts command's stdin
    process.communicate(input=text.encode("utf-8"))


if __name__ == "__main__":
    app()
