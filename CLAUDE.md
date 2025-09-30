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

## Git & PR Workflow

### Basic Workflow Rules
- Always work on a PR, never on main directly
- Use main branch (not master)
- Start with fetch/rebase to get latest main
- All PRs should target main branch
- Before starting work, make sure you have the latest main branch

### Commit Guidelines
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

- Use `/home/developer/gits/idvorkin.github.io/repo_tmp/` for all temporary files instead of `/tmp/`
- This directory is gitignored and stays within the repo for easier access
- Always use full paths when creating temp files: `/home/developer/gits/idvorkin.github.io/repo_tmp/filename.ext`
- Examples:
  - Screenshots: `/home/developer/gits/idvorkin.github.io/repo_tmp/screenshot.png`
  - Test output: `/home/developer/gits/idvorkin.github.io/repo_tmp/test-output.txt`
  - Jekyll logs: `/home/developer/gits/idvorkin.github.io/repo_tmp/jekyll.log`

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