# Coding & Development Guidelines

This file contains coding-specific conventions for the blog. For content/writing guidelines, see `CLAUDE.md`.

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

## Test Driven Development (TDD)

FOR EVERY NEW FEATURE OR BUGFIX, follow TDD:

1. Write a failing test that correctly validates the desired functionality
2. Run the test to confirm it fails as expected
3. Write ONLY enough code to make the failing test pass
4. Run the test to confirm success
5. Refactor if needed while keeping tests green

## Test Structure

- Unit tests (Vitest): Located in `src/__tests__/`
- E2E tests (Playwright): Located in `tests/e2e/`

When adding new features or fixing bugs, **always add both unit tests and e2e tests**.

## Code Style Guidelines

- Use TypeScript for all new code with strict typing
- Follow existing patterns in the codebase
- Export functions deliberately, keep helpers private
- Check document.readyState before DOM manipulation
- Prefix console.logs with emojis for easier debugging
- Handle errors gracefully with fallback content
- All code files MUST start with a brief 2-line comment explaining what the file does (prefix: "ABOUTME: ")

### Naming

Names MUST tell what code does, not how it's implemented or its history:

- NEVER use implementation details in names (e.g., "ZodValidator", "MCPWrapper")
- NEVER use temporal context (e.g., "NewAPI", "LegacyHandler", "ImprovedInterface")
- Good: `Tool`, `RemoteTool`, `Registry`, `execute()`
- Bad: `AbstractToolInterface`, `MCPToolWrapper`, `ToolRegistryManager`

### Code Comments

- Comments should explain WHAT the code does or WHY it exists
- NEVER add comments about "improved", "better", "new", or what used to be there
- NEVER remove existing comments unless you can PROVE they are false
- NEVER refer to temporal context in comments ("recently refactored", "moved")

## Development Workflow

- Run `just js-build` after TypeScript changes
- Check Jekyll at http://localhost:4000 when developing
- When running e2e tests, always use headless mode (not `--debug`)

### Running Jekyll Server

- **Default**: `just jekyll-serve` (port 4000, livereload port 35729)
- **Custom port**: `just jekyll-serve 4002`
- **Run in background**: `just jekyll-serve 4002 35730 > /tmp/jekyll.log 2>&1 &`
- **On c-500X machines**: Use `http://c-500X:4000/page-name`

### Checking Running Servers

Use `/serve` to check or start Jekyll servers. Or run `running-servers status` directly.

## Systematic Debugging Process

YOU MUST find the root cause - NEVER fix symptoms or add workarounds.

1. **Read Error Messages Carefully** - they often contain the solution
2. **Reproduce Consistently** before investigating
3. **Check Recent Changes** - git diff, recent commits
4. **Find Working Examples** in the codebase and compare
5. **Form Single Hypothesis** and test minimally
6. **NEVER add multiple fixes at once** - test after each change

## Git & PR Workflow

### Basic Rules

- Always work on a PR, never on main directly
- Start with fetch/rebase to get latest main
- Before starting work, get latest main branch

### Commit Guidelines

- **ALWAYS run pre-commit checks before committing**: `prek run --files <files>`
- **Generated JS files ARE committed** (assets/js/index.js, assets/js/index.js.map)
- Run `just js-build` before committing to ensure JS bundle is up to date
- Break commits into logical changes
- Never bypass commit hooks

### PR Best Practices

- Create new PR for each task
- **After creating a PR**, run `just update-pr-data` for dev banner
- **Never merge PRs yourself** - user must do this
- Before pushing, check PR is still open: `gh pr view <pr-number> --json state --jq '.state'`

### Post-Merge Cleanup

1. Verify PR is merged: `gh pr view <pr-number> --json state,merged`
2. Switch to main: `git checkout main && git pull`
3. Delete local branch: `git branch -d <branch-name>`
4. Delete remote branch: `git push origin --delete <branch-name>`
5. Clean up PR data: `just update-pr-data`

### PR Feedback Resolution

When resolving PR feedback:

1. Always commit and push changes after implementing feedback
2. Check for uncommitted changes before starting or finishing work
3. If uncommitted changes exist, ask user before discarding
4. The pr-feedback-resolver agent should always push changes to remote

## Beads Issue Tracking (Condensed)

Beads (`bd`) tracks work across sessions. Use for multi-session work with complex dependencies.

**Golden rule:** "If I needed to resume this work in 2 weeks with zero conversation history, would I struggle? If yes, use Beads."

**Use Beads when:** Work spans multiple sessions, has complex dependencies, or strategic context would be lost after compaction.

**Use TodoWrite when:** Work completes within current session, tasks are simple and linear.

### Session Start Protocol

At the beginning of EVERY session:

1. Check ready work: `bd ready --json`
2. Check in-progress: `bd list --status in_progress --json`
3. Read the `notes` field - contains session handoff context

### Progress Checkpointing

Update Beads notes at these moments (this is how we survive conversation compaction):

- When approaching 70% token usage (before compaction risk)
- After completing major milestones
- When hitting blockers or awaiting decisions
- At end of session before signing off

**Notes format:**

```
COMPLETED: [specific accomplishments]
IN PROGRESS: [current work state]
NEXT: [concrete next step]
BLOCKERS: [what's blocking, if any]
KEY DECISIONS: [important choices made]
```

### Key Commands

```bash
bd ready --json                    # Find work ready to start
bd list --status in_progress       # Your active work
bd show <id>                       # Issue details
bd update <id> --status in_progress  # Claim work
bd close <id>                      # Mark complete
bd sync                            # Sync with git remote
```

For full beads documentation, run `bd --help` or see the beads skill.

## Utilities

### Temporary Files

Use `repo_tmp/` directory (gitignored) instead of `/tmp/`.

### Opening Files in Neovim

```bash
tmux split-window -h -l 66% "nvim /path/to/file"
tmux split-window -h -l 66% "nvim +42 /path/to/file"  # at line number
```

### Clipboard Access

- Check clipboard: `osascript -e 'clipboard info'`
- Text content: `osascript -e 'the clipboard as text'`
- Image content: Use `image-content-analyzer` agent
