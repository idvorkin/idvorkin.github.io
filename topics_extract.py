"""Clean a blog post's markdown source into plain prose for tagging/embedding."""

import re

_FRONTMATTER = re.compile(r"\A---\n.*?\n---\n", re.S)
_VIM_TOC = re.compile(
    r"<!--\s*vim-markdown-toc-start\s*-->.*?<!--\s*vim-markdown-toc-end\s*-->",
    re.S,
)
_HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)
_JEKYLL_TAG = re.compile(r"\{%.*?%\}", re.S)
_JEKYLL_VAR = re.compile(r"\{\{.*?\}\}", re.S)
_MD_LINK = re.compile(r"\[([^\]]+)\]\([^)]*\)")  # [text](url) -> text
_MD_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)")  # ![alt](url) -> ""
_HTML_TAG = re.compile(r"<[^>]+>")
_MULTISPACE = re.compile(r"[ \t]{2,}")
_MULTINEWLINE = re.compile(r"\n{3,}")


def clean_markdown_text(md: str) -> str:
    md = _FRONTMATTER.sub("", md)
    md = _VIM_TOC.sub("", md)  # before generic comment strip
    md = _HTML_COMMENT.sub("", md)
    md = _MD_IMAGE.sub("", md)
    md = _JEKYLL_TAG.sub("", md)
    md = _JEKYLL_VAR.sub("", md)
    md = _MD_LINK.sub(r"\1", md)
    md = _HTML_TAG.sub("", md)
    md = _MULTISPACE.sub(" ", md)
    md = _MULTINEWLINE.sub("\n\n", md)
    # collapse stray blank lines left by removed includes/comments
    lines = [ln.rstrip() for ln in md.splitlines()]
    md = "\n".join(lines)
    md = _MULTINEWLINE.sub("\n\n", md)
    return md.strip()
