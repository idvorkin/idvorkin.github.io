#!python3
# Remove line too long
# pep8: disable=E501

from typing import List
from bs4 import BeautifulSoup
import jsonpickle  # richer json libray
import typer
from loguru import logger
from attrs import define, asdict

app = typer.Typer()

eulogy_file_path = "_site/eulogy.html"


@define
class Role:
    title: str = "title"
    summary: str = "summary"
    full_text: str = "full text"


@define
class Roles:
    roles: List[Role]


def printjson(out: List[Role]):
    jsonpickle.set_encoder_options("json", ensure_ascii=False)
    print(jsonpickle.encode(asdict(Roles(out)), indent=4))


def h3_to_summary(h3):
    next_p = h3.find_next("p")
    if next_p:
        return "".join([str(c) for c in next_p.contents])
    else:
        return "not Found"


def h3_to_role(h3):
    return Role(title=h3.text, summary=h3_to_summary(h3))


def eulogy_html_to_roles(path) -> List[Role]:
    with open(path, "r", encoding="utf-8") as f:
        contents = f.read()
        soup = BeautifulSoup(contents, features="html.parser")
        roles = soup.find_all("h3")
        return [h3_to_role(r) for r in roles]


@app.command()
def dump_roles():
    printjson(eulogy_html_to_roles(eulogy_file_path))


@logger.catch
def main():
    app()


if __name__ == "__main__":
    main()
