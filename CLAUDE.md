# Blog Development Guidelines for Claude

## IMPORTANT: Read First

Before starting any work, read and follow the instructions in:
`~/gits/chop-conventions/dev-inner-loop/a_readme_first.md`

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

## Development Workflow

- Run `just js-build` after TypeScript changes
- Create isolated test cases for complex components
- Use the blog's existing structure for new features
- Check Jekyll at http://localhost:4000 when developing
- When running e2e tests, always use headless mode (the default) and NOT `--debug` mode

### Running Jekyll Server and Opening Pages

- **Start Jekyll server**: `just jekyll-serve` (default port 4000) or `just jekyll-serve 4002` (custom port)
- **Run in background**: `just jekyll-serve 4002 > /tmp/jekyll-worktree.log 2>&1 &`
- **Open page in browser**: `open http://localhost:4002/page-name`
- **Open specific section**: `open http://localhost:4002/page-name#section-anchor`
- **Example for worktrees**: When working in a worktree, use a different port to avoid conflicts:
  ```bash
  # In worktree directory
  just jekyll-serve 4002 > /tmp/jekyll-worktree.log 2>&1 &
  open http://localhost:4002/igor-gap-year
  # To jump to a specific section
  open http://localhost:4002/igor-gap-year#battling-loneliness
  ```

## Git Commit Guidelines

- **Generated JS files ARE committed** (assets/js/index.js, assets/js/index.js.map)
- Commit both TypeScript source files (src/\*.ts) and the generated JS bundle
- JS files are built from TypeScript and should be tracked in git for Jekyll deployment
- Always run `just js-build` before committing to ensure JS bundle is up to date

## Git Workflow Guidelines

- Always start by creating a new PR for a task, don't update main directly
- Before starting work, make sure you have the latest main branch

## PR Management Guidelines

- When updating a PR, prompt the user asking if they want you to open the PR for them
- When starting work on an issue, update the issue with the linked PR
- All PR's should go to main please
- On startup, ask user if they want to continue a pr, list the PR's in the subdirectories (named after their pbranches)

## Commit Best Practices

- Before updating a file, start by linting it via pre-commit hooks and commit that, so that the file is clean before you edit so we can see just the relevant changes in the PR
- Never bypass commit hooks

## Development Hints

- You can always assume a server running on 4000
- Always do work on a PR, never on main
- Break commits into logical changes
- Before editing a file run pre-commit to keep reformats separate from changes
- After update pr, open in the webbrowser
- We use main, not master. Always start with a fetch rebase to make sure we're starting with latest main

## Post-PR Merge Workflow

After a PR is merged, always:

1. First verify the PR is actually merged: `gh pr view <pr-number> --json state,merged`
2. Switch to main: `git checkout main`
3. Pull latest changes: `git pull`
4. Delete local branch: `git branch -d <branch-name>`
5. Delete remote branch: `git push origin --delete <branch-name>`

This keeps the repository clean and ensures you're always working with the latest code.

## PR Feedback Resolution

When resolving PR feedback:

1. Always commit and push changes after implementing feedback
2. Check for uncommitted changes before starting or finishing work
3. If uncommitted changes exist, ask the user before discarding them
4. The pr-feedback-resolver agent should always push changes to remote
   EOF < /dev/null

## Commit Memory Hints

- Put changes to claude and agents into their own commit
- Always commit after making changes to claude config (agents or claude config)

## Development Setup

- If NPM tools are not installed, install them

## Parent Directory Workflow for Git Worktrees

When working with git worktrees, Claude must be run from the parent directory to access both the main repository and worktrees:

### Setup

1. Run `./setup-claude-parent.sh` from the parent directory to create symlinks to Claude configuration
2. This creates symlinks to CLAUDE.md and .claude directory from cc_main

### Workflow

- Always run Claude from the parent directory (not from cc_main or worktrees)
- When working in a specific worktree, use full paths for all operations since `cd` commands don't work properly
- Example: `pre-commit run --files igor-gap-year-updates/_d/file.md` instead of `cd igor-gap-year-updates && pre-commit run --files _d/file.md`
- For multi-command operations, use subshells: `(cd worktree && command1 && command2)`
- Reference files using relative paths: `cc_main/file.txt` or `cc_blog_worktree/file.txt`
- Claude configurations remain centralized in cc_main
- Create worktrees from cc_main: `cd cc_main && git worktree add ../feature-branch`

### Why This Setup?

- Claude cannot change to sibling directories (e.g., can't `cd ../other-dir`)
- The `cd` command has issues in the shell environment
- Configuration files must be in Claude's working directory
- This allows working on multiple worktrees while maintaining consistent Claude settings

## Server and Page Navigation

- To run server: `just jekyll-serve`
- Server typically runs at: http://localhost:4000
- To open specific section, append the section anchor (e.g., http://localhost:4000#section-name)

## Use builtin for 'cd' command

- Use builtin commands for cd, since it's normally pointing to zoxide
