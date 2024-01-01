#!/usr/bin/env python3
import typer
import json
from pathlib import Path
import subprocess

app = typer.Typer()


@app.command()
def dump_eulogy(voice="igor"):
    eulogy = Path.home() / "blog/eulogy.json"
    eulogy_roles = json.loads(eulogy.read_text())
    for role in eulogy_roles["roles"]:
        print(role["title"])
        print(role["summary"])
        role_filename = f"{role['title']}.mp3"
        process = subprocess.Popen(
            [
                "tts",
                "say",
                f"--voice={voice}",
                "--no-speak",
                f"--outfile={role_filename}",
            ],
            stdin=subprocess.PIPE,
        )
        # Write the summary directly to the tts command's stdin
        process.communicate(input=role["summary"].encode("utf-8"))
        print(f"TTS command for {role['title']} executed.")

    #


if __name__ == "__main__":
    app()
