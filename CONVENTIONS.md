# 2. IMPORTANT: Adding Images to Blog Posts

When a user wants to add an image to a blog post:

1. First check if the image already exists:
   ```bash
   ls -R ~/rare_gits/blob/blog/
   ```
   Ask the user: "I see these existing images - is your image already there or do we need to add a new one?"

2. If the image doesn't exist:
   - Ask user: "Would you like me to help you add a new image? If so, please provide the image and I'll help place it in ~/rare_gits/blob/blog/"
   - Images should use .webp format for best performance
   - Use descriptive names that indicate the image content

3. Check if the post has an imagefeature in its front matter:
   - If missing, add it using the first image:
     ```yaml
     imagefeature: https://github.com/idvorkin/blob/raw/master/blog/your-image-name.webp
     ```
   - If already present, leave it unchanged as it's the post's primary image

4. Once we confirm the image exists or after adding it, use one of these includes:
   
   For right-floating images (preferred):
   ```markdown
   {% include blob_image_float_right.html src="blog/raccoon-your-image.webp" %}
   ```

   For centered images:
   ```markdown
   {% include blob_image.html src="blog/raccoon-your-image.webp" %}
   ```

5. Place the include tag:
   - For new posts: After the first paragraph
   - For existing posts: Near relevant content
   - Ensure there's a blank line before and after the include

6. After adding the image:
   - If new image: Commit it to the blob repo
   - Commit the blog post changes

# 3. IMPORTANT: IF I want to add blog content, or a blog



# 4. IMPORTANT: Opening Blog Posts During Development

When working on a blog post:

1. Get the permalink from the post's front matter
2. Use this command to open the post in the default browser:
   ```bash
   open http://localhost:4000{permalink}
   ```

3. If working on a specific section, append the anchor:
   ```bash
   open http://localhost:4000{permalink}#{anchor}
   ```
   
   Example:
   - Full post: `open http://localhost:4000/laws-of-new-skills`
   - Specific section: `open http://localhost:4000/laws-of-new-skills#law-2-practice-makes-permanent`

Note: Jekyll must be running locally (localhost:4000)

# 5. Coding conventions used in this project

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

# Changing Permalinks

When changing a post's permalink:
1. Use the redirect_from front matter to maintain compatibility 
2. This ensures old links continue to work
3. IMPORTANT: Do not use 'aliases' in front matter - it doesn't work. If you see 'aliases', convert it to redirect_from
4. Example format:
   ```yaml
   ---
   permalink: /new-url
   redirect_from:
     - /old-url   # ✅ correct way
   aliases: ["/old-url"]  # ❌ wrong way - doesn't work
   ---
   ```
4. Check existing links to the post in other content and update if needed
5. The redirects are handled by Jekyll, no need to modify back-links.json

Note: See _posts/2018-01-01-fuck-pride.md for a good example of permalink redirection

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

# Table of Contents Management

When modifying markdown headings:
1. Always update the Table of Contents (TOC)
2. The TOC is managed by vim-markdown-toc
3. For new posts: Place TOC immediately after the first paragraph
4. For existing posts: Don't move the TOC location
5. Keep the special markers intact:
   ```markdown
   <!-- vim-markdown-toc-start -->
   [TOC content here]
   <!-- vim-markdown-toc-end -->
   ```

Note: Many posts use this format for the TOC section:
```markdown
<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->
[TOC content]
<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->
```
