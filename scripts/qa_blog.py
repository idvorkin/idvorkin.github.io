#!python3
import requests
from functools import lru_cache
import pathlib
from langchain_openai.chat_models import ChatOpenAI
from pydantic import BaseModel
from rich.console import Console
from icecream import ic
import typer
import os
from rich import print
from langchain.docstore.document import Document
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from typing_extensions import Annotated
from openai_wrapper import choose_model
from fastapi import FastAPI
from openai_wrapper import setup_gpt, get_model
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain.schema.output_parser import StrOutputParser
from langchain_core.runnables import RunnablePassthrough


gpt_model = setup_gpt()
server = FastAPI()

app = typer.Typer()
console = Console()

chroma_db_dir = "blog.chroma.db"
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
# embeddings = OpenAIEmbeddings()


# TODO: Use UnstructuredMarkdownParser
# Interesting trade off here, if we make chunks bigger we can have more context
# If we make chunk smaller we can inject more chunks
chunk_size = 2048


def chunk_documents(documents, chunk_size=chunk_size, chunk_overlap=50):
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
    # db = Path(chroma_db_dir)
    # erase the db directory

    # db.rmdir(
    # ic(docs[1])
    chunks = list(chunk_documents(docs))
    # ic(chunks[3])
    # set_trace()
    search_index = Chroma.from_documents(
        chunks, embeddings, persist_directory=chroma_db_dir
    )
    search_index.persist()


@app.command()
def chunk_md(
    path: Annotated[str, typer.Argument()] = "~/blog/_posts/2020-04-01-Igor-Eulogy.md",
):
    from unstructured.partition.md import partition_md

    elements = partition_md(filename=os.path.expanduser(path))
    ic(elements)


class Fact(BaseModel):
    source: str
    content: str

    def to_prompt(self):
        return f"""---(FACT)---
SOURCE FILE PATH:
{self.source}
FACT:
{self.content}
---"""


def facts_to_prompt(facts):
    return "\n".join([f.to_prompt() for f in facts])


# We built the file_path from source markdown
def fixup_markdown_path_to_url(src):
    markdown_to_url = build_markdown_to_url_map()
    for md_file_path, url in markdown_to_url.items():
        # url starts with a /
        url = url[1:]
        md_link = f"[{url}](https://idvork.in/{url})"
        src = src.replace(md_file_path, md_link)
    return src


def fixup_ig66_path_to_url(src):
    for i in range(100 * 52):
        src = src.replace(
            f"_ig66/{i}.md", f"[Family Journal {i}](https://idvork.in/ig66/{i})"
        )
    return src


@app.command()
def ask_eulogy(
    question: Annotated[
        str, typer.Argument()
    ] = "What are the roles from Igor's Eulogy, answer in bullet form",
    facts: Annotated[int, typer.Option()] = 5,
    u4: bool = typer.Option(False),
    debug: bool = typer.Option(True),
):
    model, max_tokens = choose_model(u4)
    if debug:
        ic(model)
        ic(facts)

    # load chroma from DB
    blog_content_db = Chroma(
        persist_directory=chroma_db_dir, embedding_function=embeddings
    )

    nearest_documents = blog_content_db.similarity_search(question, k=facts)

    # set_trace()
    for f in nearest_documents:
        if debug:
            ic(f.metadata["source"])

    thefacts = [
        Fact(source=f.metadata["source"], content=f.page_content)
        for f in nearest_documents
    ]

    # explain what you want
    system_instructions = """
You are an expert at answering questions.
Use the passed in facts from Igor's blog to answer provided questions.

You give output in markdown
Before your answer, repeat the question as an H2 header

After you answer, return the list of sources and why they were relevant in order of relevance.
Be sure to include the % relvanace of each source
'_' is a valid part of the source file path, do not remove it
If there are multiple facts with the same source, combine them with indented bullet points
    """

    # give an example instead of trying to describe everything.
    system_example = """
E.g.

## the question the user asked here

### Answer

your answer here

### Sources

* source file path - Your reasoning on why it's  relevant (% relevance,  e.g. 20%)
    """

    system_prompt = system_instructions + system_example

    prompt = f"""
    ### Facts
{facts_to_prompt(thefacts)}
    ### Question
        {question}
    """

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(system_prompt),
            HumanMessagePromptTemplate.from_template(prompt),
        ],
    )
    model_name = get_model(u4=True)
    model = ChatOpenAI(model=model_name)
    ic(model_name)

    chain = prompt | model | StrOutputParser()
    response = chain.invoke({})

    out = fixup_markdown_path_to_url(response)
    out = fixup_ig66_path_to_url(out)
    print(out)


# cache this so it's memoized
@lru_cache
def build_markdown_to_url_map():
    source_file_to_url = {}
    # read the json file From Github, slightly stale, but good enough
    backlinks_url = "https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json"
    d = requests.get(backlinks_url).json()
    url_infos = d["url_info"]
    # "url_info": {
    # "/40yo": {
    # "markdown_path": "_d/40-yo-programmer.md",
    # "doc_size": 14000
    # },
    # convert the url_infos into a source_file_to_url map
    source_file_to_url = {v["markdown_path"]: k for k, v in url_infos.items()}
    return source_file_to_url


@server.get("/remap/{source_file}")
def remap_to_url(source_file):
    return {"url": source_file_to_url(source_file)}
    # return {"url":"It works"}


@app.command()
@server.get("/remap/{source_file}")
def source_file_to_url(source_file):
    source_file_to_url = build_markdown_to_url_map()
    blog_base = "https://idvork.in"
    return blog_base + source_file_to_url[source_file]


def format_docs(docs):
    ic(len(docs))
    return "\n\n".join(doc.page_content for doc in docs)


@app.command()
def ask(
    question: Annotated[
        str, typer.Argument()
    ] = "What are the roles from Igor's Eulogy, answer in bullet form",
    facts: Annotated[int, typer.Option()] = 5,
    u4: bool = typer.Option(True),
    debug: bool = typer.Option(True),
):
    model, _ = choose_model(u4)
    if debug:
        ic(model)
        ic(facts)
    # load chroma from DB
    blog_content_db = Chroma(
        persist_directory=chroma_db_dir, embedding_function=embeddings
    )

    prompt = ChatPromptTemplate.from_template(
        """
    You are an assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question.
    The content is all from Igor's blog
    If you don't know the answer, just say that you don't know. Keep the answer under 10 lines
    Question: {question}
    Context: {context}

## the question the user asked here

### Answer

your answer here

### Sources

* source file path - Your reasoning on why it's  relevant (% relevance,  e.g. 20%)
    """
    )

    model_name = get_model(u4=True)
    llm = ChatOpenAI(model=model_name)
    simple_retriever = blog_content_db.as_retriever(search_kwargs={"k": facts})
    included_facts = simple_retriever.get_relevant_documents(question)

    chain = (
        {
            "context": simple_retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    response = chain.invoke(question)
    print(response)
    print("Source Documents")
    for doc in included_facts:
        # Remap metadata to url
        ic(doc.metadata)
        path = fixup_markdown_path_to_url(doc.metadata["source"])
        ic(path)


# @logger.catch()
def app_wrap_loguru():
    app()


if __name__ == "__main__":
    app_wrap_loguru()
