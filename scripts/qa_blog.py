#!python3
import requests
import pathlib
import subprocess
import tempfile
import openai
from rich.console import Console
from icecream import ic
import typer
import time
import os
from loguru import logger
from pudb import set_trace
from langchain.chains import ConversationalRetrievalChain
from langchain.llms import OpenAI
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.prompts import PromptTemplate
from typing_extensions import Annotated
from openai_wrapper import choose_model, remaining_response_tokens

app = typer.Typer()
console = Console()

chroma_db_dir = "blog.chroma.db"
embeddings = OpenAIEmbeddings()


# TODO: Use UnstructuredMarkdownParser
# Interesting trade off here, if we make chunks bigger we can have more context
# If we make chunk smaller we can inject more chunks
chunk_size = 1024


def chunk_documents(documents, chunk_size=chunk_size, chunk_overlap=0):
    splitter = CharacterTextSplitter(
        separator=" ", chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    for document in documents:
        for chunk in splitter.split_text(document.page_content):
            yield Document(page_content=chunk, metadata=document.metadata)


def get_blog_content(path):
    # set_trace()
    repo_path = pathlib.Path(os.path.expanduser(path))

    markdown_files = list(repo_path.glob("*/*.md"))
    for markdown_file in markdown_files:
        with open(markdown_file, "r") as f:
            yield Document(
                page_content=f.read(),
                metadata={"source": str(markdown_file.relative_to(repo_path))},
            )


@app.command()
def build():
    docs = list(get_blog_content("~/blog"))
    # ic(docs[1])
    chunks = list(chunk_documents(docs))
    # ic(chunks[3])
    # set_trace()
    search_index = Chroma.from_documents(
        chunks, embeddings, persist_directory=chroma_db_dir
    )
    search_index.persist()


### Todo, move this to openai_wrapper
def base_query(
    tokens: int = 300,
    debug: bool = False,
    prompt_to_gpt="replace_prompt",
    system_prompt="You are a helpful assistant.",
    u4=False,
):
    model, tokens = choose_model(u4, tokens)

    # Define the messages for the chat
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt_to_gpt},
    ]

    output_tokens = remaining_response_tokens(model, system_prompt, prompt_to_gpt)

    if debug:
        ic(system_prompt)
        # ic(prompt_to_gpt)
        ic(model)
        ic(output_tokens)

    start = time.time()
    response_contents = [""]
    first_chunk = True
    for chunk in openai.ChatCompletion.create(
        model=model,
        messages=messages,
        max_tokens=output_tokens,
        temperature=0.7,
        stream=True,
    ):
        if not "choices" in chunk:
            continue

        for elem in chunk["choices"]:  # type: ignore

            if first_chunk:
                if debug:
                    out = f"First Chunk took: {int((time.time() - start)*1000)} ms"
                    ic(out)
                first_chunk = False
            delta = elem["delta"]
            delta_content = delta.get("content", "")
            response_contents[elem["index"]] += delta_content

    text = ""
    for i, content in enumerate(response_contents):
        text = content
        print(text)

    if debug:
        out = f"All chunks took: {int((time.time() - start)*1000)} ms"
        ic(out)


@app.command()
def chunk_md(
    path: Annotated[str, typer.Argument()] = "~/blog/_posts/2020-04-01-Igor-Eulogy.md"
):
    from unstructured.partition.md import partition_md

    elements = partition_md(filename=os.path.expanduser(path))
    ic(elements)


@app.command()
def ask(
    question: Annotated[
        str, typer.Argument()
    ] = "What are the roles from Igor's Eulogy, answer in bullet form",
    facts: Annotated[int, typer.Option()] = 5,
    u4: bool = typer.Option(False),
    debug: bool = typer.Option(True),
):
    model = "gpt-4" if u4 else "gpt-3.5-turbo-16k"
    model, max_tokens = choose_model(u4)
    openai = OpenAI(model=model)
    verbose = False
    if debug:
        ic(model)
        ic(facts)
        verbose = True
    # load chroma from DB
    blog_content_db = Chroma(
        persist_directory=chroma_db_dir, embedding_function=embeddings
    )
    history = []
    facts = blog_content_db.similarity_search(question, k=facts)
    # set_trace()
    for f in facts:
        if debug:
            ic(f.metadata["source"])

    facts_for_prompt = ""
    for i, f in enumerate(facts):
        facts_for_prompt += f"""---(Fact {i})---
SOURCE FILE PATH:
    {f.metadata["source"]}
FACT:
    {f.page_content}
---
"""

    system_prompt = """You are an expert at answering questions. You give output in markdown
Use the following document snippets facts to answer provided questions.
After you answer, return the list of sources and why they were relevant in order of relevance. E.g.


### Question

The question asked

### Answer

your answer answer

### Sources

* source file path - the reason it is relevant (% relevant)

    """

    prompt = f"""
    .
    :
    ### Facts:
{facts_for_prompt}
    ### Question
        {question}
    """
    resp = base_query(
        system_prompt=system_prompt, prompt_to_gpt=prompt, debug=debug, u4=u4
    )


# @logger.catch()
def app_wrap_loguru():
    app()


if __name__ == "__main__":
    app_wrap_loguru()
