#!python3
import requests
import pathlib
import subprocess
import tempfile
from rich.console import Console
from icecream import ic
import typer
import os
from loguru import logger
from pudb import set_trace
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.prompts import PromptTemplate
from typing_extensions import Annotated

# ++ openai_wrapper
text_model_gpt_4 = "gpt-4-0613"
gpt_4_tokens = 7800
text_model_gpt35 = "gpt-3.5-turbo-16k-0613"
gpt_3_5_tokens = 16000
code_model_best = "code-davinci-003"


def model_to_max_tokens(model):
    model_to_tokens = {text_model_gpt_4: gpt_4_tokens, text_model_gpt35: gpt_3_5_tokens}
    return model_to_tokens[model]


def choose_model(u4, tokens=0):
    model = "SPECIFY_MODEL"
    if u4:
        model = text_model_gpt_4
    else:
        model = text_model_gpt35

    is_token_count_the_default = tokens == 0  # TBD if we can do it without hardcoding.
    if is_token_count_the_default:
        tokens = model_to_max_tokens(model)

    return model, tokens


# -- openai_wrapper

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


@app.command()
def ask(
    question: Annotated[
        str, typer.Argument()
    ] = "What are the roles from Igor's Eulogy, answer in bullet form",
    u4: bool = typer.Option(True),
    debug: bool = typer.Option(1),
):
    model = "gpt-4" if u4 else "gpt-3.5-turbo-16k"
    model, max_tokens = choose_model(u4)
    openai = OpenAI(model=model)
    # load chroma from DB
    blog_content_db = Chroma(
        persist_directory=chroma_db_dir, embedding_function=embeddings
    )
    qa = RetrievalQA.from_chain_type(
        llm=OpenAI(),
        chain_type="map_reduce",
        retriever=blog_content_db.as_retriever(),
        return_source_documents=True,
    )
    # answer = qa.run(question)
    answer = qa({"query": question})
    print(f"Answer: {answer['result']}")
    print("Sources:")
    for doc in answer["source_documents"]:
        print(doc.metadata["source"])


# @logger.catch()
def app_wrap_loguru():
    app()


if __name__ == "__main__":
    app_wrap_loguru()
