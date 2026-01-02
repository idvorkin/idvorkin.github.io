# Content Guidelines by Post Type

## Core Consistency Rules

### Style Consistency Principle

**If you choose to deviate from the recommended style guidelines below, maintain that deviation consistently throughout the entire piece.** Mixing styles within a single post creates jarring reader experiences.

**Examples of acceptable consistent deviations:**

- Using "we" throughout an entire post (but never mixing "we" and "I")
- Writing in third person for a specific piece (but maintaining it throughout)
- Using formal academic tone for technical content (but not switching to conversational mid-post)
- Adopting a specific narrative voice for storytelling posts

### Inconsistency Warnings

**AI assistants and editors should flag these inconsistencies:**

- ❌ Switching between "I" and "we" within the same post
- ❌ Mixing formal and conversational tones randomly
- ❌ Starting personal then becoming impersonal
- ❌ Inconsistent use of headers, bullet styles, or formatting
- ❌ Switching between metaphorical frameworks mid-post
- ❌ Changing target audience assumptions (expert → beginner → expert)

**The goal:** Readers should feel like they're having one coherent conversation, not multiple conversations stitched together.

---

## Universal Writing Style (All Content)

### Voice and Perspective

- **Always use "I"** for personal perspective, never "we"
- **Direct and concise** - avoid flowery language where it obscures meaning
- **Personal but pragmatic** tone
- **Conversational vulnerability** - write like you're having coffee with a thoughtful friend who shares real struggles
- **Vulnerable but authoritative** - show uncertainty alongside expertise
- **Systems thinking approach** - naturally build frameworks and structured approaches
- **Metaphorical thinking** - use consistent metaphors (dragons, mountains, rivers) to explain complex concepts

### Language Patterns

- **Questions to engage readers** and introduce new sections
- **Concrete examples** over abstract concepts
- **"Here's what I learned"** rather than "You should do this"
- **Strategic use of rich metaphors** when they enhance understanding
- **Self-deprecating humor** with phrases like "completely aspirational" and acknowledgment of personal flaws
- **Vulnerability as strength** - openly discussing fears, failures, and contradictions
- **Research integration** - heavy citing of books, studies, and external sources
- **Avoid marketing speak and buzzwords** - no "revolutionary," "game-changing," or corporate jargon

### Avoiding AI Writing Patterns

**These patterns make writing feel generic and machine-generated. Avoid them:**

_Reference: [Wikipedia: Signs of AI Writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)_

**❌ Undue emphasis phrases:**

- "stands as", "serves as", "plays a vital role in"
- "underscores its significance", "highlights the importance"
- "captivates both X and Y alike"
- Instead: Be direct and specific about what something does or means

**❌ Promotional/tourism language:**

- "nestled within the breathtaking", "rich cultural heritage"
- "must-visit", "hidden gem", "boasts a wide array"
- Instead: Use concrete, sensory details and personal experience

**❌ Editorializing phrases:**

- "it's important to note that", "it's worth mentioning"
- "notably", "importantly", "significantly"
- Instead: Just state the point directly - if it's in your post, it's already important

**❌ Superficial -ing phrase overuse:**

- "highlighting the fact that", "showcasing the importance"
- "demonstrating the value of", "emphasizing the need for"
- Instead: Use active verbs and direct statements

**❌ Formulaic conjunctions:**

- Starting many sentences with "Additionally", "Furthermore", "Moreover"
- Essay-like synthesis language that sounds academic rather than conversational
- Instead: Use natural transitions and vary sentence structure

**❌ Vague intensifiers:**

- "very unique", "extremely important", "highly significant"
- "truly remarkable", "particularly noteworthy"
- Instead: Show don't tell - use specific examples that demonstrate importance

**✅ Better approaches:**

- Use specific numbers, names, and details over vague descriptions
- Write like you're explaining to a friend, not composing an essay
- Let the content speak for itself rather than emphasizing its importance
- Replace abstract analysis with concrete observations
- Use plain, direct language over formal academic phrasing

### Structure Elements

- **Extensive use of headers** for easy scanning
- **Bullet points** to chunk information
- **Table of contents** for longer pieces (auto-generated via vim-markdown-toc)
- **Heavy cross-referencing** using `{% include summarize-page.html %}` for internal linking
- **Progressive disclosure** - start with simple concepts, then drill deeper
- **Iterative development** - posts evolve over time with update notes
- **Framework building** - most posts end with practical application methods

### Engagement Techniques

- **Rhetorical questions** as section breaks
- **Direct reader address** ("I bet you don't either")
- **Dialog format** for internal conflicts and decision-making (real and imagined conversations)
- **Real-time authenticity** - admit uncertainty and show work in progress
- **Meta-commentary** on your own writing and thinking process
- **Personal anecdotes as teaching tools** - stories that illustrate broader principles
- **Pre-mortem/scenario planning** - regular use of "what if" thinking

---

## Content Type Guidelines

### 1. Book Summaries/Reviews

**Purpose:** Process learning and share insights from books that shaped your thinking

**Structure:**

- Always include book cover image and Amazon affiliate link
- Use chapter-by-chapter breakdown for systematic books
- Include "Why this book matters" section
- End with "How this applies to you" practical takeaways

**Voice:** Analytical teacher - "Here's what I learned and how you can apply it"

**Key Elements:**

- Heavy use of structured outlines and bullet points
- Personal application examples throughout
- Quote key passages that resonated
- Connect to your existing frameworks and other books

**Length:** 300-600 lines typically

**Tags:** `book-notes`, plus relevant topic tags

### 2. Personal Philosophy/Identity Posts

**Purpose:** Work through fundamental life questions while creating frameworks others can use

**Structure:**

- Start with personal stakes - why this matters to you
- Use creative metaphors consistently throughout (dragons, circles, etc.)
- Include both emotional and logical analysis
- Create memorable frameworks with clear components

**Voice:** Vulnerable philosopher - "Here's how I think about life"

**Key Elements:**

- **Dialog format** for internal conflicts ("Dragon:" conversations)
- **Extensive personal anecdotes** as proof points
- **Alert boxes** for important caveats
- **Visual elements** (images, diagrams) to break up text
- **Cross-references** to related life frameworks

**Length:** 400-1000+ lines for major pieces

**Tags:** `how igor ticks`, plus relevant topics

### 3. Professional/Management Content

**Purpose:** Share hard-won workplace wisdom and practical frameworks

**Structure:**

- Start with the problem/challenge
- Provide systematic framework or approach
- Include specific workplace examples
- Link to deeper reference materials
- Include "what doesn't work" sections

**Voice:** Experienced practitioner - "Here's what works in practice"

**Key Elements:**

- **Tactical advice** with concrete steps
- **War stories** from actual management experience
- **References to "Igor's book of..."** deeper materials
- **Quantified examples** where possible
- **Team scenarios** and people stories

**Length:** 150-300 lines typically

**Tags:** `manager`, `software engineering`, `emotional intelligence`

### 4. Reference/Framework Content

**Purpose:** Create comprehensive, living documents for personal and public use

**Structure:**

- Comprehensive table of contents
- Clear section headers for easy navigation
- "Quick reference" sections for immediate use
- Update logs showing evolution over time

**Voice:** Systematic organizer - "Here's a complete framework"

**Key Elements:**

- **Heavy cross-linking** between related concepts
- **Actionable sections** with specific steps
- **Examples and scenarios** for each major point
- **Regular updates** with new insights
- **Multiple entry points** for different use cases

**Length:** 500-1000+ lines for comprehensive guides

**Tags:** `framework`, `reference`, plus topic-specific tags

### 5. Major Life Decision Documentation

**Purpose:** Work through significant choices while creating reusable decision-making frameworks

**Structure:**

- Establish stakes and timeline
- Map out all considerations systematically
- Use creative metaphors to explore emotional aspects
- Document decision-making process in real-time
- Include uncertainty and evolution of thinking

**Voice:** Thoughtful decision-maker - "Here's how I'm working through this"

**Key Elements:**

- **Real-time processing** with timestamps
- **Both rational and emotional analysis**
- **Creative frameworks** (dragons, councils, etc.)
- **Progress tracking** and milestone documentation
- **Honest uncertainty** and course corrections

**Length:** 700+ lines for major decisions

**Tags:** `decision-making`, plus relevant life area tags

### 6. Practical Hobby/Lifestyle Posts

**Purpose:** Share what works in daily life - products, approaches, systems

**Structure:**

- Problem or need statement
- Solution overview
- Specific recommendations with reasoning
- Personal experience and results
- Alternative options and trade-offs

**Voice:** Helpful enthusiast - "Here's what works for me"

**Key Elements:**

- **Product links** and specific model numbers
- **Personal experience** with timeline
- **Comparison with alternatives**
- **Practical setup tips**
- **Cost/benefit analysis**

**Length:** 50-200 lines typically

**Tags:** `toys`, `biking`, `health`, plus specific categories

### 7. Journal/Exploration Content

**Purpose:** Think through emerging topics and capture evolving insights

**Structure:**

- Date-based entries showing progression
- Stream-of-consciousness exploration
- Questions and uncertainties
- Links to related reading/research
- Periodic synthesis and pattern identification

**Voice:** Curious explorer - "Here's what I'm figuring out"

**Key Elements:**

- **Experimental thinking** without predetermined conclusions
- **Question collections** and research notes
- **Pattern recognition** across different inputs
- **Regular synthesis** attempts
- **Links to external sources** and influences

**Length:** Variable, grows over time

**Tags:** `exploration`, `journal`, plus topic tags

### 8. Personal Narrative/Story Posts

**Purpose:** Use personal stories and experiences as teaching tools to illustrate broader principles

**Structure:**

- Set scene with personal context
- Develop story with specific details and dialogue
- Extract universal principles or lessons
- Connect to broader frameworks or life philosophy
- Invite reader reflection or application

**Voice:** Reflective storyteller - "Here's what this experience taught me"

**Key Elements:**

- **AI conversations** with Tony (life coach) showing real-time processing
- **Family adventures and moments** that illustrate larger principles
- **Life transition narratives** about major changes and decisions
- **Identity conflict stories** (bike vs car, work vs family, etc.)
- **Dialogue format** showing internal or external conversations
- **Specific sensory details** that make stories vivid and memorable

**Length:** 200-800 lines typically

**Tags:** `story`, `narrative`, plus relevant life area tags

---

## Content Development Workflow

### 1. Start with Purpose

- **Personal processing** - What am I trying to figure out?
- **Public value** - How can this help others?
- **Framework building** - What systematic approach am I developing?

### 2. Choose Content Type

- Match your purpose to the appropriate content type above
- Consider hybrid approaches for complex topics
- Plan for potential evolution (exploration → framework → published advice)

### 3. Apply Type-Specific Guidelines

- Use the voice and structure patterns for your chosen type
- Include all key elements relevant to that content type
- Follow the suggested length guidelines

### 4. Cross-Link and Connect

- Reference related content throughout
- Build connections between different frameworks
- Update existing content with new insights

### 5. Tag and Organize

- Use consistent tagging system
- Include type-specific tags plus topic tags
- Consider searchability and future discovery

---

## Special Considerations

### Dual-Purpose Content

Most substantial content should serve both personal processing AND public teaching. This is your superpower - turning personal work into valuable public content.

### Living Documents

Many pieces should be treated as living documents that get updated over time with new insights, examples, and refinements.

### Authentic Vulnerability

Your willingness to show uncertainty, mistakes, and work-in-progress thinking is what makes the content uniquely valuable. Maintain this across all content types.

### Framework Thinking

You naturally build systematic approaches to complex topics. Lean into this strength by making frameworks explicit and reusable.

### Meta-Awareness

Your ability to comment on your own thinking process adds depth and authenticity. Include this meta-commentary where it serves the content.

---

## Technical Implementation Guide

### Opening Paragraphs and Excerpts

**CRITICAL: Always start posts with a plain text opening paragraph before any includes, alerts, or special formatting.**

**Why this matters:**

Jekyll automatically generates excerpts (post summaries/previews) for blog indexes, RSS feeds, and social media sharing. The excerpt is typically the first paragraph or first ~150 words of your post. If you place an alert box, image, or other include immediately after the front matter, the excerpt will be broken or empty, resulting in:

- ❌ Broken previews in blog index pages
- ❌ Empty descriptions for social media shares
- ❌ Missing summaries in RSS feeds
- ❌ Poor SEO snippet previews

**What excerpts are:**

Excerpts are automatically extracted text snippets that represent your post in:
- Blog homepage listing pages
- Category/tag archive pages
- RSS/Atom feed readers
- Social media link previews (Twitter, LinkedIn, etc.)
- Search engine result snippets

**Correct structure:**

```markdown
---
title: "Post Title"
permalink: /url
---

Your compelling opening paragraph goes here. This should hook the reader and give them a clear sense of what the post is about. It should be plain text without any Jekyll includes, HTML, or special formatting.

{% include alert.html content="Any alerts or notices go AFTER the opening paragraph" style="warning" %}

Rest of your content...
```

**Wrong structure:**

```markdown
---
title: "Post Title"
permalink: /url
---

{% include alert.html content="Alert immediately after front matter breaks excerpts!" style="warning" %}

Your opening paragraph...
```

**Best practices:**
- Make the opening paragraph 2-4 sentences
- Hook the reader with a personal stake or compelling question
- Give enough context that the excerpt works as a standalone preview
- Keep it conversational and engaging
- No includes, HTML tags, or special formatting in the first paragraph

### Alert Boxes

Use alert boxes to highlight important information, warnings, or construction notices:

**Syntax:**

```liquid
{% include alert.html content="Your message here" style="info" %}
{% include alert.html content="Warning or caution message" style="warning" %}
{% include alert.html content="Work in progress notice" style="danger" %}
```

**Common use cases:**

- Construction/work-in-progress notices
- Important caveats or disclaimers
- Cross-references to related content
- Privilege acknowledgments

**Example:**

```liquid
{% include alert.html content="🚧 Construction Zone 🚧 This post is in heavy progress! 🔨 Check back later for updates ⏳" style="warning" %}
```

### AI Slop Notice

For posts with significant AI-generated content, use the ai-slop include:

**Syntax:**

```liquid
{% include ai-slop.html percent="85" %}
```

**CRITICAL: Place after the first paragraph, not before.** Putting it in the first paragraph breaks page previews/excerpts (see "Lead Paragraph / Post Excerpt" section above).

**Correct placement:**

```markdown
---
[front matter]
---

Your compelling first paragraph that serves as the excerpt...

{% include ai-slop.html percent="85" %}

Rest of post content...
```

### URL Redirects

Set up redirects for shorter, memorable URLs using both `redirect_from` and `alias`:

**Syntax:**

```yaml
redirect_from:
  - /shortname
  - /abbreviation
alias:
  - /shortname
  - /abbreviation
```

**Example:**

```yaml
redirect_from:
  - /7habits
  - /7h
alias:
  - /7habits
  - /7h
```

### Book Links and Amazon Affiliate Integration

Use the Amazon include for book references with ASIN numbers:

**Syntax:**

```liquid
{% include amazon.html asin="ASIN_NUMBER" %}
{% include amazon.html asin="ASIN1;ASIN2;ASIN3" %}
```

**Examples:**

```liquid
{% include amazon.html asin="0071499938" %}
{% include amazon.html asin="B07LDSPRYM;B00506CSDQ;B07C66Z4M4" %}
```

**How it works:**

- ASINs are looked up in `_data/asins.json` for title, image, and description
- Automatically includes affiliate tag (`ighe-20`)
- Falls back to generic Amazon image if product data not available
- Supports multiple books separated by semicolons
- Images are styled consistently with fallback text if images fail to load

**Best practices:**

- Use ASIN numbers (found in Amazon URLs) rather than direct links
- Group related books together in single include
- Place near relevant text sections
- ASIN data is managed automatically via scripts in `/scripts/` directory

### Images

Use the custom image includes for consistent formatting:

**Right-floating images:**

```liquid
{% include blob_image_float_right.html src="blog/image-name.webp" %}
```

**Standard images:**

```liquid
{% include blob_image.html src="blog/image-name.webp" %}
```

**Small right-floating images (25% width):**

```liquid
{% include blob_image_float_right_w25.html src="blog/image-name.webp" %}
```

**Image best practices:**

- Use WebP format for efficiency
- Store images in the GitHub blob: `https://github.com/idvorkin/blob/raw/master/blog/filename.webp`
- Reference using relative paths in includes: `blog/filename.webp`
- Place floating images near relevant text sections

### Cross-References and Internal Linking

Use the summarize-page include for rich internal linking:

**Syntax:**

```liquid
{% include summarize-page.html src="/page-name" %}
```

**How it works:**

- Automatically pulls title and description from the linked page
- Creates a styled summary box with proper attribution
- Uses data from `back-links.json` for consistent metadata
- Provides rich preview of the linked content

**When to use:**

- Referencing related comprehensive posts
- Building connections between related frameworks
- Providing deeper dive options
- Creating content clusters around themes
- Cross-linking between book summaries and related life posts

**Examples:**

```liquid
{% include summarize-page.html src="/7habits" %}
{% include summarize-page.html src="/death" %}
{% include summarize-page.html src="/gap-year" %}
```

### Matrix Visualizations

#### Quadrant Matrix (2x2 Grid)

Use the quadrant-matrix include for any 2x2 grid visualizations like personality types, decision matrices, or prioritization frameworks:

**Syntax:**

```liquid
{% include quadrant-matrix.html
    title="Main Title"
    subtitle="Optional subtitle"
    x_label="X Axis Label →"
    y_label="Y Axis Label →"
    q1_name="TOP-RIGHT NAME"
    q1_subtitle="Optional subtitle"
    q1_traits="Line 1<br>Line 2<br>Line 3"
    q1_color="rgba(255, 224, 224, 0.5)"
    q2_name="TOP-LEFT NAME"
    q2_subtitle="Optional subtitle"
    q2_traits="Description here"
    q2_color="rgba(230, 230, 250, 0.5)"
    q3_name="BOTTOM-LEFT NAME"
    q3_subtitle="Optional subtitle"
    q3_traits="Description here"
    q3_color="rgba(232, 244, 234, 0.5)"
    q4_name="BOTTOM-RIGHT NAME"
    q4_subtitle="Optional subtitle"
    q4_traits="Description here"
    q4_color="rgba(255, 229, 180, 0.5)"
%}
```

**Parameters:**

- `title`, `subtitle`: Main headings for the matrix
- `x_label`, `y_label`: Axis labels with directional arrows
- `q1-q4`: Quadrants numbered clockwise from top-right
  - `q#_name`: Main heading in quadrant
  - `q#_subtitle`: Optional subtitle
  - `q#_traits`: Description (use `<br>` for line breaks)
  - `q#_color`: Background color (hex or rgba)

**Common use cases:**

- **PANAS Personality Types**: Mad Scientist, Cheerleader, Judge, Poet
- **Eisenhower Matrix**: Urgent/Important task prioritization
- **Risk Assessment**: Probability/Impact matrix
- **SWOT Analysis**: Strengths/Weaknesses/Opportunities/Threats
- **Energy Management**: High/Low energy vs High/Low focus

**Example - PANAS Personality Types:**

```liquid
{% include quadrant-matrix.html
    title="Arthur Brooks' PANAS Personality Types"
    subtitle="Based on the Positive and Negative Affect Schedule"
    x_label="Positive Affect →"
    y_label="Negative Affect →"
    q1_name="MAD SCIENTIST"
    q1_subtitle="Creative Intensity"
    q1_traits="Feels deeply<br>Passionate<br>Ride the waves"
    q1_color="rgba(255, 224, 224, 0.5)"
    q2_name="JUDGE"
    q2_subtitle="Critical Thinker"
    q2_traits="Spots problems<br>High standards<br>Practice gratitude"
    q2_color="rgba(230, 230, 250, 0.5)"
    q3_name="POET"
    q3_subtitle="Calm Observer"
    q3_traits="Steady emotions<br>Zen-like presence<br>Cultivate excitement"
    q3_color="rgba(232, 244, 234, 0.5)"
    q4_name="CHEERLEADER"
    q4_subtitle="Natural Optimist"
    q4_traits="Spreads joy<br>Sees bright side<br>Watch for warnings"
    q4_color="rgba(255, 229, 180, 0.5)"
%}
```

#### Six-Cell Matrix (2x3 Grid)

Use the six-cell-matrix include for 2x3 grid visualizations (2 rows × 3 columns). Perfect for models like Influencer 2.0 that have 6 distinct dimensions:

**Syntax:**

```liquid
{% include six-cell-matrix.html
    title="Main Title"
    subtitle="Optional subtitle"
    row1_label="Top Row Label"
    row2_label="Bottom Row Label"
    col1_label="Left Column"
    col2_label="Middle Column"
    col3_label="Right Column"
    c1_name="Cell 1 (Top-Left)" c1_subtitle="Subtitle" c1_traits="Description<br>Line 2" c1_color="rgba(232,244,234,0.5)"
    c2_name="Cell 2 (Top-Middle)" c2_subtitle="Subtitle" c2_traits="Description" c2_color="rgba(255,229,180,0.5)"
    c3_name="Cell 3 (Top-Right)" c3_subtitle="Subtitle" c3_traits="Description" c3_color="rgba(255,224,224,0.5)"
    c4_name="Cell 4 (Bottom-Left)" c4_subtitle="Subtitle" c4_traits="Description" c4_color="rgba(230,230,250,0.5)"
    c5_name="Cell 5 (Bottom-Middle)" c5_subtitle="Subtitle" c5_traits="Description" c5_color="rgba(220,245,245,0.5)"
    c6_name="Cell 6 (Bottom-Right)" c6_subtitle="Subtitle" c6_traits="Description" c6_color="rgba(255,240,220,0.5)"
%}
```

**Parameters:**

- `title`, `subtitle`: Main headings for the matrix
- `row1_label`, `row2_label`: Labels for the two rows
- `col1_label`, `col2_label`, `col3_label`: Labels for the three columns
- `c1-c6`: Cells numbered left-to-right, top-to-bottom
  - `c#_name`: Main heading in cell
  - `c#_subtitle`: Optional subtitle
  - `c#_traits`: Description (use `<br>` for line breaks)
  - `c#_color`: Background color (hex or rgba)

**Common use cases:**

- **Influencer 2.0**: Motivation/Ability × Personal/Social/Structural
- **Project Management**: High/Low priority × Planning/Execution/Review stages
- **Skills Development**: Learn/Practice × Technical/Social/Strategic
- **Any 2×3 framework**: Two categories with three levels each

**Example - Influencer 2.0:**

```liquid
{% include six-cell-matrix.html
    title="Influencer 2.0: Six Sources of Influence"
    subtitle="Change happens when you influence across all dimensions"
    row1_label="Motivation"
    row2_label="Ability"
    col1_label="Personal"
    col2_label="Social"
    col3_label="Structural"
    c1_name="Personal Motivation"
    c1_subtitle="Self-Regulation"
    c1_traits="Connect to values<br>Build intrinsic motivation"
    c1_color="rgba(232, 244, 234, 0.5)"
    c2_name="Social Motivation"
    c2_subtitle="Peer Influence"
    c2_traits="Harness peer pressure<br>Build accountability"
    c2_color="rgba(255, 229, 180, 0.5)"
    c3_name="Structural Motivation"
    c3_subtitle="Incentives"
    c3_traits="Design reward systems<br>Align incentives"
    c3_color="rgba(255, 224, 224, 0.5)"
    c4_name="Personal Ability"
    c4_subtitle="Skills"
    c4_traits="Build individual skills<br>Provide training"
    c4_color="rgba(230, 230, 250, 0.5)"
    c5_name="Social Ability"
    c5_subtitle="Support"
    c5_traits="Enable group performance<br>Provide coaching"
    c5_color="rgba(220, 245, 245, 0.5)"
    c6_name="Structural Ability"
    c6_subtitle="Environment"
    c6_traits="Provide tools<br>Remove barriers"
    c6_color="rgba(255, 240, 220, 0.5)"
%}
```

### Jekyll Front Matter Essentials

Include these key elements in post front matter:

```yaml
---
title: "Your Post Title"
layout: post
permalink: /url-slug
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/image.webp
tags:
  - relevant-tag
  - category-tag
redirect_from:
  - /short-url
alias:
  - /short-url
---
```

**IMPORTANT IMPLEMENTATION RULE:** Always use these technical elements consistently. Alert boxes for important notices, redirects for memorable URLs, affiliate links for books, proper image includes for formatting, summarize-page includes for internal references, and quadrant-matrix includes for 2x2 visualizations.

---

## PR Review Checklist

At the end of a content PR review, include this summary format. These checks map to the [thinking phases in CHOW](/chow#the-four-thinking-modes).

```
Architect: 🟢 headers 🟢 front-matter 🟢 internal-links
Carpenter: 🟢 opening 🟢 voice 🟢 ai-patterns
Judge: 🟢 alerts 🟢 images ⚪ books ⚪ ai-slop
Workflow: 🟢 rebased 🟢 backlinks

Issues:
- [list any 🔴 items with actionable fix]
```

**Status indicators:**
- 🟢 Pass
- 🔴 Fail (requires fix)
- ⚪ N/A (not applicable to this PR)

**Checklist items by phase:**

**Architect** (structure):

| Key | Check |
|-----|-------|
| `headers` | Headers used for easy scanning |
| `front-matter` | Complete front matter (title, permalink, tags) |
| `internal-links` | Internal links use permalinks (not redirects), relative paths (no hostname), proper format |

**Carpenter** (prose):

| Key | Check |
|-----|-------|
| `opening` | First paragraph is plain text (no includes/alerts) for excerpt generation |
| `voice` | Consistent voice throughout (no "I"/"we" mixing, consistent tone) |
| `ai-patterns` | No AI writing patterns (undue emphasis, "it's important to note", etc.) |

**Judge** (polish):

| Key | Check |
|-----|-------|
| `alerts` | Alert boxes placed AFTER opening paragraph |
| `images` | Images use proper includes (`blob_image.html`, etc.) |
| `books` | Book links use `{% include amazon.html asin="..." %}` |
| `ai-slop` | AI slop notice (if needed) placed after first paragraph |

**Workflow** (process):

| Key | Check |
|-----|-------|
| `rebased` | Branch rebased onto upstream main |
| `backlinks` | Backlinks regenerated (`just back-links`) |

**Example with issues:**

```
Architect: 🟢 headers 🟢 front-matter 🟢 internal-links
Carpenter: 🟢 opening 🟢 voice 🔴 ai-patterns
Judge: 🟢 alerts 🟢 images ⚪ books ⚪ ai-slop
Workflow: 🟢 rebased 🔴 backlinks

Issues:
- ai-patterns — line 42: remove "it's important to note that"
- backlinks — run `just backlinks` to regenerate
```
