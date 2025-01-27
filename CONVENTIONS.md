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

# Blog Post File Naming Conventions

1. **File Names**:

   - Blog post files should have descriptive names without dates.
   - Example: `advice.md`, `how-to-learn.md`, `productivity-tips.md`.

2. **Drafts**:

   - Place new blog posts in the `_d` directory for drafts.
   - Example: `_d/advice.md`.

3. **Front Matter**:
   - Ensure the `permalink` field in the front matter is unique and descriptive.
   - Example:
     ```yaml
     permalink: /advice
     ```

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

# Terminal Command Conventions

1. For ANY commands that would use a pager or require user interaction, you should append ` | /bin/cat` to the command (NOT just `cat` as it's aliased to `bat`). Otherwise, the command will break. You MUST do this for: git, less, head, tail, more, etc.
2. For commands that are long running/expected to run indefinitely until interruption, run them in the background.

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
     - /old-url # ✅ correct way
   aliases: ["/old-url"] # ❌ wrong way - doesn't work
   ---
   ```
5. Check existing links to the post in other content and update if needed
6. The redirects are handled by Jekyll, no need to modify back-links.json

Note: See \_posts/2018-01-01-fuck-pride.md for a good example of permalink redirection

# WHEN USER IS DOING BLOG CONTENT

1. Get an overeview of the blog by making this read on

READ: back-links.json

2. Get good example blog posts to immitate

READ: \_posts/2020-04-01-Igor-Eulogy.md \_d/pride.md back-links.json

- We are not going to write code, so ignore all coding conventions
- Before adding a blog post, always check if it exists, add it if it does.
- If the blog post is reference, add it as readonly

3. This project also contains a jekyll blog, you'll often be expected to edit the blog content

- `_d` is drafts, by default put stuff in drafts folder so it's a simpler filename
- Always include a markdown table of contents, and a nice permalink title
- Ask user what are good tags for the post
- Before creating a new entry, see if an entry already exists by running `qa_blog where "your exact question in quotes"`
- Ask the user where they want to add the blog content. Do this by running:
  `qa_blog where "your exact question in quotes"`
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

Note: Many posts use this format for the TOC section:

```markdown
<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->
[TOC content]
<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->
```

# List Replacements in Tables

When using lists that should be inserted into tables:

1. In the table, use the format `[lXX](lXX)` where:

   - The link text and href must both match exactly (e.g., `[l31](l31)`)
   - XX is the list number (e.g., 31, 32, etc.)
   - **IMPORTANT**: List numbers must be unique across the entire file
   - If adding a new list, check existing lists in the file and use a new unique number

2. Below the table, structure the lists like this:

   ```markdown
   <div/>

   - lXX
   - List item 1
   - List item 2

   <div/>
   ```

3. Important formatting rules:
   - Each list must start with `<div/>`
   - First list item must be the list identifier (e.g., `l31`)
   - List must end with `<div/>`
   - The list identifier in the table link must match exactly
   - Never reuse list numbers within the same file

Example:

```markdown
| Day | Activity   |
| --- | ---------- |
| Sa  | [l31](l31) |

<div/>

- l31
- Item 1
- Item 2

<div/>
```

Note: If you have multiple tables in the same file, ensure each uses different list numbers. For example:

- First table: `l31`, `l32`
- Second table: `l33`, `l34`
- Third table: `l35`, `l36`

# Link Conventions

When adding links in markdown documents:

1. Always check `back-links.json` to find the correct redirect URL
2. Use the format `[visible text](/redirect-url)`
3. Example: For meditation content, use `[meditation](/siy)` since meditation redirects to the Search Inside Yourself page

# Chat Oriented Programming (CHOP)

CHOP is the practice of using AI chat to assist with programming tasks. When making CHOP changes:

1. Document all changes in this conventions file
2. Follow consistent patterns for similar types of changes
3. Use the chat history to maintain context and consistency

# Chat Oriented Writing (CHOW)

CHOW is the practice of using AI chat to assist with writing and content creation. Similar to CHOP but focused on prose and documentation rather than code.

# Using summarize-page Includes

When you want to include a summary of another page's content:

1. Use the `summarize-page` include with the format:
   ```markdown
   {% include summarize-page.html src="/page-url" %}
   ```
2. Before adding the include:
   - Always check `back-links.json` to confirm the correct permalink
   - The src should match the permalink, not the filename
   - Example: Use `/siy` for meditation content, not `/meditation`
3. The include will automatically:
   - Pull in the description from the target page
   - Add a link attribution to the source
   - Format it with proper styling
4. Common usage patterns:
   - After introducing a concept that's detailed elsewhere
   - When listing related topics
   - In sections that reference other content
5. Example:

   ```markdown
   **Affirmations**
   Reinforcing positive beliefs and mindsets I want to cultivate.

   {% include summarize-page.html src="/affirmations" %}
   ```

# Writing Style and Formatting

1. **No Emojis**
   - Do not use emojis in blog posts or documentation
   - This includes titles, headers, and content
   - Keep the writing style clean and professional
