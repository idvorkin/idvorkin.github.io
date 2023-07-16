#!python3
from langchain.llms import OpenAI
from langchain.docstore.document import Document
import requests
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.prompts import PromptTemplate
import pathlib
import subprocess
import tempfile

from rich.console import Console
from icecream import ic
import typer
import os
from loguru import logger

console = Console()
app = typer.Typer()


def chunk_documents(documents, chunk_size=1024, chunk_overlap=0):
    splitter = CharacterTextSplitter(
        separator=" ", chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    for document in documents:
        for chunk in splitter.split_text(document.page_content):
            yield Document(page_content=chunk, metadata=document.metadata)


def get_blog_content(path):
    with tempfile.TemporaryDirectory() as d:
        repo_path = pathlib.Path(os.exanduser(path))
        markdown_files = list(repo_path.glob("*/*.md"))
        for markdown_file in markdown_files:
            ic(markdown_file)
            with open(markdown_file, "r") as f:
                yield Document(
                    page_content=f.read(), metadata={"source": markdown_file}
                )


@app.command()
def build():
    docs = get_blog_content("~/blog")
    chunks = chunk_documents(docs)
    ic(chunks[4])


@logger.catch()
def app_wrap_loguru():
    app()


if __name__ == "__main__":
    app_wrap_loguru()
