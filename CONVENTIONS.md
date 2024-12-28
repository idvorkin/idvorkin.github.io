# 2. IMPORTANT: IF I want to add blog content, or a blog



# 3. Coding conventions used in this project

For CLIs, use a Typer app.
Use `ic` for logging.
Use Rich for pretty printing.
Use Loguru for logging.
Use Typer for CLI apps.
Use Pydantic for data validation.
Use types; when using types, prefer using built-ins like `foo | None` vs `foo: Optional[str]`.
When using Typer, use the latest syntax for arguments and options.

```python
    name: Annotated[Optional[str], typer.Argument()] = None
    def main(name: Annotated[str, typer.Argument()] = "Wade Wilson"):
    lastname: Annotated[str, typer.Option(help="Last name of person to greet.")] = "",
    formal: Annotated[bool, typer.Option(help="Say hi formally.")] = False,
```

Prefer returning from a function vs nesting ifs.
Prefer descriptive variable names over comments.

# WHEN USER IS DOING BLOG CONTENT

1. Get an overeview of the blog by making this read on

READ: back-links.json

2. Get good example blog posts to immitate

READ: _posts/2020-04-01-Igor-Eulogy.md  _d/pride.md  back-links.json

- We are not going to write code, so ignore all coding conventions
- Before adding a blog post, always check if it exists, add it if it does.
- If the blog post is reference, add it as readonly


3. This project also contains a jekyll blog, you'll often be expected to edit the blog content

- \_d is drafts, but default put stuff in drafts folder so it's a simpler filename.
- Always include a markdown talbe of contents, and a nice permalink title
- Ask user what are good tags for the post
- Before creating a new entry, see if an entryalread exists by running ```qa_blog where```
- Ask the users where they want to add the blog content. Do this by running:
     qa_blog where {topic to add}
- Then inspect the output, and suggest what files to edit, and which should be readonly


# Writing style

- Fun and quirky
- Technical, but not boring
