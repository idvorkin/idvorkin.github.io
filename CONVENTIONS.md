# Every time working on blog posts.

Ask the user to add these files as read only for good examples

- Eulogy (_posts/2020-04-01-Igor-Eulogy.md)
- Pride (_d/pride.md)

# Coding conventions used in this project

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

# Blog Editting

This project also contains a jekyll blog, you'll often be expected to edit the blog content

- \_d is drafts, but default put stuff in drafts folder so it's a simpler filename.
- Always include a markdown talbe of contents, and a nice permalink title
- Ask user what are good tags for the post


# Writing style

- Fun and quirky
- Technical, but not boring
