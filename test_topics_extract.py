# test_topics_extract.py
from topics_extract import clean_markdown_text


def test_strips_frontmatter_includes_links_and_comments():
    md = (
        "---\n"
        "title: X\n"
        "tags:\n  - a\n"
        "---\n\n"
        "Your daughter isn't breaking.\n\n"
        '{% include amazon.html asin="123" %}\n\n'
        "<!-- a comment -->\n"
        "These are my notes from [Untangled](/untangled), filtered.\n"
    )
    out = clean_markdown_text(md)
    assert "title: X" not in out
    assert "{%" not in out
    assert "<!--" not in out
    assert "/untangled" not in out  # URL dropped
    assert "Untangled" in out  # link text kept
    assert "Your daughter isn't breaking." in out
    assert "These are my notes from Untangled, filtered." in out


def test_strips_vim_toc_block():
    md = (
        "Intro para.\n\n"
        "<!-- vim-markdown-toc-start -->\n"
        "- [Heading](#heading)\n"
        "<!-- vim-markdown-toc-end -->\n\n"
        "Body para.\n"
    )
    out = clean_markdown_text(md)
    assert "#heading" not in out
    assert "Intro para." in out
    assert "Body para." in out
