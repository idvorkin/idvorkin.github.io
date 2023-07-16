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
def ask(
    question: Annotated[
        str, typer.Argument()
    ] = "What are the roles from Igor's Eulogy, answer in bullet form",
    u4: bool = typer.Option(False),
    debug: bool = typer.Option(True),
):
    model = "gpt-4" if u4 else "gpt-3.5-turbo-16k"
    model, max_tokens = choose_model(u4)
    openai = OpenAI(model=model)
    verbose = False
    if debug:
        ic(model)
        verbose = True
    # load chroma from DB
    blog_content_db = Chroma(
        persist_directory=chroma_db_dir, embedding_function=embeddings
    )
    history = []
    facts = blog_content_db.similarity_search(question, max_results=5)
    # set_trace()
    # set_trace()
    for f in facts:
        ic(f.metadata["source"])

    facts_for_prompt = ""
    for i, f in enumerate(facts):
        facts_for_prompt += f"""---(Fact {i})---
SOURCE:
    {f.metadata["source"]}
FACT:
    {f.page_content}
---
"""

    prompt = f"""
    Use the following document snippets to answer the following questions. After you answer, return the list of sources that you used to answer the question in a markdown list.
    :
    ### Facts:
{facts_for_prompt}
    ### Question
        {question}
    """
    resp = base_query(prompt_to_gpt=prompt, debug=debug, u4=u4)
    ic(resp)
    # ic(prompt)

    return """
        qa = ConversationalRetrievalChain.from_llm(llm=openai, chain_type="map_reduce", retriever=blog_content_db.as_retriever(), return_source_documents=True, verbose=verbose, )
        # answer = qa.run(question)
        answer = qa({"question": question,
                    "chat_history":history,
                    })
        print (f"Answer: {answer['result']}")
        print ("Sources:")
        for doc in answer["source_documents"]:
            print(doc.metadata["source"])
        ic(history)
    """


# @logger.catch()
def app_wrap_loguru():
    app()


if __name__ == "__main__":
    app_wrap_loguru()
