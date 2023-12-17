#!python3

import os
from icecream import ic
import typer
import re
import requests


app = typer.Typer()


def content_type_to_extension(ct):
    if ct == "image/jpeg":
        return "jpg"
    if ct == "image/png":
        return "png"
    if ct == "application/zip":
        return "zip"
    else:
        raise 0


@app.command()
def default(album_url):
    # download the file
    request = requests.get(album_url)
    text = request.text

    # ("99218341":[[1,["my string"]]],)
    #  Regexp notes:  \ escapes the [ and ] the trailing ? (e.g. *?0)  makes non greedy matches
    pattern = """"99218341":\[\[1,\["(.*?)"\]\]\],"""
    matches = re.findall(pattern, text)
    print(len(matches))
    for i in matches:
        print(i)

    url_extract_pattern = "[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"
    url_matches = re.findall(url_extract_pattern, text)
    img_count = 0
    for i, u in enumerate(url_matches):
        if "googleusercontent" not in u:
            continue

        img_count += 1

        url = "https://" + u
        print(url)
        r = requests.get(url)
        content_type = r.headers["Content-Type"]
        if "html" in content_type:
            # something weird.
            ic(content_type, url)
            continue
        extension = content_type_to_extension(content_type)

        filename = os.path.expanduser(f"~/tmp/out/img_{img_count}.{extension}")
        print(filename)
        f = open(filename, "wb")
        f.write(r.content)


if __name__ == "__main__":
    app()
