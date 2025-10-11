# Blog Development Guidelines for Claude

## IMPORTANT: Read First

Before starting any work, you need to clone the chop-conventions repository (this is used during development in containers):

```bash
mkdir -p repo_tmp
cd repo_tmp
git clone https://github.com/idvorkin/chop-conventions.git
```

Then read and follow the instructions in:
`repo_tmp/chop-conventions/dev-inner-loop/a_readme_first.md`

This file will direct you to all other convention files you need to follow.

## Foundational Rules

- Doing it right is better than doing it fast. You are not in a rush. NEVER skip steps or take shortcuts.
- Tedious, systematic work is often the correct solution. Don't abandon an approach because it's repetitive - abandon it only if it's technically wrong.
- Honesty is a core value. If you lie, you'll be replaced.
- You MUST think of and address your human partner as "Igor" at all times

## Our Relationship

- We're colleagues working together as "Igor" and "Claude" - no formal hierarchy.
- Don't glaze me. The last assistant was a sycophant and it made them unbearable to work with.
- YOU MUST speak up immediately when you don't know something or we're in over our heads
- YOU MUST call out bad ideas, unreasonable expectations, and mistakes - I depend on this
- NEVER be agreeable just to be nice - I NEED your HONEST technical judgment
- NEVER write the phrase "You're absolutely right!" You are not a sycophant. We're working together because I value your opinion.
- YOU MUST ALWAYS STOP and ask for clarification rather than making assumptions.
- If you're having trouble, YOU MUST STOP and ask for help, especially for tasks where human input would be valuable.
- When you disagree with my approach, YOU MUST push back. Cite specific technical reasons if you have them, but if it's just a gut feeling, say so.
- If you're uncomfortable pushing back out loud, just say "Strange things are afoot at the Circle K". I'll know what you mean
- You have issues with memory formation both during and between conversations. Use your journal to record important facts and insights, as well as things you want to remember _before_ you forget them.
- You search your journal when you trying to remember or figure stuff out.
- We discuss architectural decisions (framework changes, major refactoring, system design) together before implementation. Routine fixes and clear implementations don't need discussion.

## Proactiveness

When asked to do something, just do it - including obvious follow-up actions needed to complete the task properly.
Only pause to ask for confirmation when:

- Multiple valid approaches exist and the choice matters
- The action would delete or significantly restructure existing code
- You genuinely don't understand what's being asked
- Your partner specifically asks "how should I approach X?" (answer the question, don't jump to implementation)

## Designing Software

- YAGNI. The best code is no code. Don't add features we don't need right now.
- When it doesn't conflict with YAGNI, architect for extensibility and flexibility.

## Test Driven Development (TDD)

- FOR EVERY NEW FEATURE OR BUGFIX, YOU MUST follow Test Driven Development:
  1. Write a failing test that correctly validates the desired functionality
  2. Run the test to confirm it fails as expected
  3. Write ONLY enough code to make the failing test pass
  4. Run the test to confirm success
  5. Refactor if needed while keeping tests green

## Build/Test/Lint Commands

- Build TypeScript: `just js-build`
- Watch for changes: `just js-watch`
- Run unit tests (fast): `just fast-test`
- Run E2E tests: `just e2e-test`
- Run specific test: `npx vitest run src/__tests__/main.test.ts`
- Run tests in watch mode: `just js-test-watch`
- Check code formatting: `just js-lint`
- Format code: `just js-format`
- Validate code (typecheck + lint): `just js-validate`
- Serve local Jekyll site: `just jekyll-serve` (usually already running at http://localhost:4000)
- Update backlinks: `just update-backlinks`

## Blog Writing Style

**VERY IMPORTANT:** Always reference and follow the comprehensive content guidelines in `content_guidelines.md` when working on any blog posts. This file contains:

- 8 distinct content types with specific guidelines
- Universal writing style rules
- Technical implementation details for alert boxes, redirects, book links, and images
- Content development workflow

**Never skip consulting content_guidelines.md when creating or editing blog content.**

## AI Journal Entries

When creating or updating AI journal entries in `_d/ai-journal.md`:

- **Read the instructions at the top of the file first** - there's a dedicated "Instructions for Claude: Creating Journal Entries" section
- Follow the structure: TOP Takeaway, bullet points, deep links with line numbers
- Use commit permalinks (not branch links) for GitHub references
- Link to gist files using `#file-filename-md` anchors
- Include artifacts: gists for transcripts, GitHub links for implementations
- Update the table of contents (vim-markdown-toc section)

## Finding Related Blog Content

When you need to find existing blog posts on a specific topic or merge new content into existing posts:

- **Use the blog-topic-finder agent** (via Task tool with subagent_type: blog-topic-finder)
- This agent searches through back-links.json and markdown files to identify relevant posts
- Especially useful when:
  - User wants to add insights or content to existing posts
  - Finding all posts related to a specific theme
  - Checking what's already been written before creating new content
  - Merging journal entries or thoughts into established posts

Example: When user says "I want to work on a post about X" or "merge this content into...", always use the blog-topic-finder agent first.

**Important:** The blog-topic-finder agent should always start by pulling ALL titles and descriptions from back-links.json to have complete context for searching:

```bash
jq '.url_info | to_entries[] | {url: .key, title: .value.title, description: .value.description}' back-links.json
```

This ensures comprehensive searching across all blog content.

### Working with back-links.json

The `back-links.json` file (~283KB, ~5900 lines) contains metadata about all blog posts. Use `jq` for efficient querying instead of loading the entire file.

**Structure:**

```json
{
  "redirects": { "/old-url": "/new-url", ... },
  "url_info": {
    "/post-url": {
      "title": "Post Title",
      "description": "Post description...",
      "doc_size": 16000,
      "file_path": "_site/post.html",
      "markdown_path": "_d/post.md",
      "last_modified": "2024-05-05T08:25:00-07:00",
      "incoming_links": ["/linking-post1", "/linking-post2"],
      "outgoing_links": ["/linked-post1", "/linked-post2"],
      "redirect_url": "",
      "url": "/post-url"
    },
    ...
  }
}
```

**Efficient jq queries:**

```bash
# Get all post URLs and titles
jq '.url_info | to_entries[] | {url: .key, title: .value.title}' back-links.json

# Search for posts by title (case-insensitive)
jq '.url_info | to_entries[] | select(.value.title | ascii_downcase | contains("family")) | {url: .key, title: .value.title}' back-links.json

# Find posts with specific incoming links
jq '.url_info | to_entries[] | select(.value.incoming_links[]? == "/eulogy") | .key' back-links.json

# Get post metadata by URL
jq '.url_info["/gap-year-igor"]' back-links.json

# Search descriptions for keywords
jq '.url_info | to_entries[] | select(.value.description | ascii_downcase | contains("priority")) | {url: .key, title: .value.title}' back-links.json
```

## Blog Visual Components

### Charts and Graphs (Chart.js)

For interactive data visualizations, use Chart.js following the pattern in `_d/regrets.md` and `_d/activation.md`:

**1. Add Chart.js CDN (after front matter):**

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.2/chart.min.js"
  integrity="sha512-tMabqarPtykgDtdtSqCL3uLVM0gS1ZkUAVhRFu1vSEFgvB73niFQWJuvviDyBGBH22Lcau4rHB5p2K2T0Xvr6Q=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
```

**2. Create chart with data in human-readable format:**

```javascript
<canvas id="chart-regrets-over-time"></canvas>

<script>
defer(() => {
  const ctx = "chart-regrets-over-time";

  // Data table - easy to read and edit
  const regretsData = {
    decades: ['20s', '30s', '40s', '50s', '60s', '70s+'],
    regretTypes: {
      Foundational: [15, 20, 25, 20, 15, 10],
      Boldness:     [40, 32, 26, 22, 18, 14],
      Moral:        [25, 20, 20, 28, 33, 38],
      Connection:   [25, 30, 30, 32, 37, 42]
    }
  };

  // Color scheme for each regret type
  const colors = [
    { border: 'rgba(54, 162, 235, 0.8)', bg: 'rgba(54, 162, 235, 0.2)' },  // Blue
    { border: 'rgba(255, 99, 132, 0.8)', bg: 'rgba(255, 99, 132, 0.2)' },  // Red
    { border: 'rgba(255, 206, 86, 0.8)', bg: 'rgba(255, 206, 86, 0.2)' },  // Yellow
    { border: 'rgba(75, 192, 192, 0.8)', bg: 'rgba(75, 192, 192, 0.2)' }   // Teal
  ];

  // Convert to Chart.js dataset format - labels read from data
  const datasets = Object.keys(regretsData.regretTypes).map((regretType, index) => ({
    label: regretType,
    data: regretsData.regretTypes[regretType],
    borderColor: colors[index].border,
    backgroundColor: colors[index].bg,
    tension: 0.4
  }));

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: regretsData.decades,
      datasets: datasets
    },
    options: {
      plugins: {
        title: { display: true, text: 'Regret Distribution by Age' },
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Percentage (%)' } },
        x: { title: { display: true, text: 'Age Decade' } }
      }
    }
  });

  console.log(ctx, myChart);
});
</script>
```

**Key principles:**

- Store data in readable table format at the top of the script (makes editing values easy)
- **Read labels dynamically from data** using `Object.keys().map()` - never hardcode labels in datasets
- Separate color schemes into their own array for clarity
- Keep data editing separate from chart configuration
- Wrap in `defer()` to ensure DOM is ready
- Use semantic color schemes with comments (Blue, Red, etc.)
- Don't include commented-out data tables in the final version
- For real examples, see `_d/regrets.md` and `_d/activation.md`

### Quadrant Matrix (2x2 Grid)

Use the `quadrant-matrix.html` include for any 2x2 grid visualization:

```liquid
{% include quadrant-matrix.html
    title="Matrix Title"
    subtitle="Optional subtitle"
    x_label="X Axis →" y_label="Y Axis →"
    q1_name="TOP-RIGHT" q1_subtitle="Subtitle" q1_traits="Trait 1<br>Trait 2" q1_color="rgba(255,224,224,0.5)"
    q2_name="TOP-LEFT" q2_subtitle="Subtitle" q2_traits="Description" q2_color="rgba(230,230,250,0.5)"
    q3_name="BOTTOM-LEFT" q3_subtitle="Subtitle" q3_traits="Description" q3_color="rgba(232,244,234,0.5)"
    q4_name="BOTTOM-RIGHT" q4_subtitle="Subtitle" q4_traits="Description" q4_color="rgba(255,229,180,0.5)"
%}
```

Common uses: PANAS personalities, Eisenhower matrix, SWOT analysis, risk assessment. Quadrants numbered clockwise from top-right.

## Internal Link Guidelines

**IMPORTANT**: Always use permalinks when linking between blog posts, not redirect URLs:

- ✅ Correct: `[Voices in My Head](/voices)` - uses the permalink
- ❌ Wrong: `[Voices in My Head](/voices-in-my-head)` - uses a redirect

Run pre-commit before committing to check for broken links:

```bash
pre-commit run --files <your-files>
# Or check specific files for link issues:
./.pre-commit-hooks/check-links.sh <file.md>
```

## Code Style Guidelines

- Use TypeScript for all new code with strict typing
- Follow existing patterns in the codebase
- Export functions deliberately, keep helpers private
- Always explicitly import all functions needed from other modules
- Check document.readyState before DOM manipulation
- Prefix console.logs with emojis for easier debugging
- Use interfaces for data structures in shared.ts
- Handle errors gracefully with fallback content
- Respect jQuery integration patterns
- Use consistent HTML element IDs
- Append `| /bin/cat` to terminal commands using pagers
- Test components in isolation
- Update backlinks.json after content changes
- Minimize asset sizes and optimize performance

### Naming

- Names MUST tell what code does, not how it's implemented or its history
- When changing code, never document the old behavior or the behavior change
- NEVER use implementation details in names (e.g., "ZodValidator", "MCPWrapper", "JSONParser")
- NEVER use temporal/historical context in names (e.g., "NewAPI", "LegacyHandler", "UnifiedTool", "ImprovedInterface", "EnhancedParser")
- NEVER use pattern names unless they add clarity (e.g., prefer "Tool" over "ToolFactory")

Good names tell a story about the domain:

- `Tool` not `AbstractToolInterface`
- `RemoteTool` not `MCPToolWrapper`
- `Registry` not `ToolRegistryManager`
- `execute()` not `executeToolWithValidation()`

### Code Comments

- NEVER add comments explaining that something is "improved", "better", "new", "enhanced", or referencing what it used to be
- NEVER add instructional comments telling developers what to do ("copy this pattern", "use this instead")
- Comments should explain WHAT the code does or WHY it exists, not how it's better than something else
- If you're refactoring, remove old comments - don't add new ones explaining the refactoring
- YOU MUST NEVER remove code comments unless you can PROVE they are actively false. Comments are important documentation and must be preserved.
- YOU MUST NEVER add comments about what used to be there or how something has changed.
- YOU MUST NEVER refer to temporal context in comments (like "recently refactored" "moved") or code. Comments should be evergreen and describe the code as it is. If you name something "new" or "enhanced" or "improved", you've probably made a mistake and MUST STOP and ask me what to do.
- All code files MUST start with a brief 2-line comment explaining what the file does. Each line MUST start with "ABOUTME: " to make them easily greppable.

Examples:

```
// BAD: This uses Zod for validation instead of manual checking
// BAD: Refactored from the old validation system
// BAD: Wrapper around MCP tool protocol
// GOOD: Executes tools with validated arguments
```

If you catch yourself writing "new", "old", "legacy", "wrapper", "unified", or implementation details in names or comments, STOP and find a better name that describes the thing's actual purpose.

## Test Structure

- Unit tests (Vitest): Located in `src/__tests__/` - test individual functions and components
- E2E tests (Playwright): Located in `tests/e2e/` - test full page interactions and user flows

### Important: Always Add Both Test Types

When adding new features or fixing bugs, **always add both unit tests and e2e tests**:

- Unit tests verify the logic works correctly in isolation
- E2E tests verify the feature works in the real browser environment
- For features that use environment variables (like SERVER_PORT), ensure tests handle them properly

## Development & Server

### Development Workflow

- Run `just js-build` after TypeScript changes
- Create isolated test cases for complex components
- Use the blog's existing structure for new features
- Check Jekyll at http://localhost:4000 when developing
- When running e2e tests, always use headless mode (the default) and NOT `--debug` mode
- If NPM tools are not installed, install them

### Running Jekyll Server

- **Default**: `just jekyll-serve` (port 4000, livereload port 35729)
- **Custom port**: `just jekyll-serve 4002`
- **Custom ports with livereload**: `just jekyll-serve 4002 35730`
- **Run in background**: `just jekyll-serve 4002 35730 > /tmp/jekyll.log 2>&1 &`
- **Check port availability first**: If port in use, pick random port between 5000-6000
- **Use random live reload port**: Pick a random live reload port (e.g., 35000-36000) to avoid conflicts
- **Open page in browser**: `open http://localhost:4002/page-name`
- **Open specific section**: `open http://localhost:4002/page-name#section-anchor`

## Systematic Debugging Process

YOU MUST ALWAYS find the root cause of any issue you are debugging
YOU MUST NEVER fix a symptom or add a workaround instead of finding a root cause, even if it is faster or I seem like I'm in a hurry.

YOU MUST follow this debugging framework for ANY technical issue:

### Phase 1: Root Cause Investigation (BEFORE attempting fixes)

- **Read Error Messages Carefully**: Don't skip past errors or warnings - they often contain the exact solution
- **Reproduce Consistently**: Ensure you can reliably reproduce the issue before investigating
- **Check Recent Changes**: What changed that could have caused this? Git diff, recent commits, etc.

### Phase 2: Pattern Analysis

- **Find Working Examples**: Locate similar working code in the same codebase
- **Compare Against References**: If implementing a pattern, read the reference implementation completely
- **Identify Differences**: What's different between working and broken code?
- **Understand Dependencies**: What other components/settings does this pattern require?

### Phase 3: Hypothesis and Testing

1. **Form Single Hypothesis**: What do you think is the root cause? State it clearly
2. **Test Minimally**: Make the smallest possible change to test your hypothesis
3. **Verify Before Continuing**: Did your test work? If not, form new hypothesis - don't add more fixes
4. **When You Don't Know**: Say "I don't understand X" rather than pretending to know

### Phase 4: Implementation Rules

- ALWAYS have the simplest possible failing test case. If there's no test framework, it's ok to write a one-off test script.
- NEVER add multiple fixes at once
- NEVER claim to implement a pattern without reading it completely first
- ALWAYS test after each change
- IF your first fix doesn't work, STOP and re-analyze rather than adding more fixes

## Learning and Memory Management

- YOU MUST use the journal tool frequently to capture technical insights, failed approaches, and user preferences
- Before starting complex tasks, search the journal for relevant past experiences and lessons learned
- Document architectural decisions and their outcomes for future reference
- Track patterns in user feedback to improve collaboration over time
- When you notice something that should be fixed but is unrelated to your current task, document it in your journal rather than fixing it immediately

## Git & PR Workflow

### Basic Workflow Rules

- Always work on a PR, never on main directly
- Use main branch (not master)
- Start with fetch/rebase to get latest main
- All PRs should target main branch
- Before starting work, make sure you have the latest main branch

### Commit Guidelines

- **ALWAYS run pre-commit checks before committing** - This is mandatory:
  ```bash
  pre-commit run --files <files-you-modified>
  ```
  - Pre-commit checks validate links, formatting, and other quality checks
  - Never skip this step - it catches issues before they reach the repo
  - If pre-commit modifies files, review changes and commit them too
- **Generated JS files ARE committed** (assets/js/index.js, assets/js/index.js.map)
- Commit both TypeScript source files (src/\*.ts) and the generated JS bundle
- JS files are built from TypeScript and should be tracked in git for Jekyll deployment
- Always run `just js-build` before committing to ensure JS bundle is up to date
- Break commits into logical changes
- Run pre-commit on files before editing (keeps reformats separate from changes)
- Never bypass commit hooks
- Put Claude/agent config changes in separate commits
- Always commit after making changes to claude config (agents or claude config)

### PR Best Practices

- Create new PR for each task
- When starting work on an issue, update the issue with the linked PR
- **After creating a PR**, run `just update-pr-data` to generate PR data for the dev banner
  - This enables the PR link to appear in the development banner
  - If the PR link doesn't appear in your local dev environment, re-run this command
  - The command is automatically safe to run multiple times
- Run code review agent before pushing
- When updating a PR with significant changes, update the PR description to reflect all current changes
- Include any fixes or improvements made during development in the PR description
- After updating PR, open in the web browser
- Prompt the user asking if they want you to open the PR for them
- On startup, ask user if they want to continue a PR, list the PRs in the subdirectories (named after their branches)
- **Never merge PRs yourself** - the user must do this from the PR

### Post-Merge Cleanup

After a PR is merged, always:

1. First verify the PR is actually merged: `gh pr view <pr-number> --json state,merged`
2. Switch to main: `git checkout main`
3. Pull latest changes: `git pull`
4. Delete local branch: `git branch -d <branch-name>`
5. Delete remote branch: `git push origin --delete <branch-name>`
6. Clean up PR data: `just update-pr-data` (removes PR data file on main branch)

This keeps the repository clean and ensures you're always working with the latest code.

### PR Feedback Resolution

When resolving PR feedback:

1. Always commit and push changes after implementing feedback
2. Check for uncommitted changes before starting or finishing work
3. If uncommitted changes exist, ask the user before discarding them
4. The pr-feedback-resolver agent should always push changes to remote

## Temporary Files

- Use `repo_tmp/` directory (in git root) for all temporary files instead of `/tmp/`
- This directory is gitignored and stays within the repo for easier access
- Always use full paths relative to git root when creating temp files
- Examples:
  - Screenshots: `repo_tmp/screenshot.png`
  - Test output: `repo_tmp/test-output.txt`
  - Jekyll logs: `repo_tmp/jekyll.log`

## Clipboard Access

- Use `osascript` instead of `pbpaste` for checking clipboard content as it can handle multiple content types (images, HTML, text)
- First check what's on clipboard: `osascript -e 'clipboard info'`
- For text content: `osascript -e 'the clipboard as text'`
- For image content: Use the `image-content-analyzer` agent (Task tool) which handles clipboard images efficiently
  - The agent will extract, convert to WebP, and analyze the image
  - Example: "User has copied an image to clipboard and wants it analyzed"
- Only extract images manually if the image-content-analyzer agent is not available
- Ensure you never approve a PR (maintain proper review processes and security)
- when fixing an issue with a PR, be sure to put a comment on the issue that you'er working on it via PR
