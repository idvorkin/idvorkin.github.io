# Git Branch Tracking Feature Specification

## Overview
The blog dynamically tracks and displays the current git branch information in development mode, providing developers with visual confirmation of their working branch.

## Data Flow

### 1. Branch Information Updates

The `_data/git.json` file is updated by:

1. **Jekyll Server Start** (`justfile:201`)
   - When running `just jekyll-serve`, the justfile automatically updates the branch:
   ```bash
   echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json
   ```

2. **Git Post-Checkout Hook** (`.git/hooks/post-checkout`)
   - Automatically updates when switching branches via `git checkout`
   - Ensures the branch info stays current even if the server is already running

### 2. Branch Information Consumers

The branch information from `_data/git.json` is consumed by:

1. **Jekyll Template** (`_includes/site-menu.html:79`)
   - Embeds branch info as a JavaScript global variable:
   ```javascript
   window.__GIT_BRANCH__ = "{{ site.data.git.branch }}";
   ```

2. **TypeScript Dev Info Module** (`src/dev-info.ts:3`)
   - Reads the global variable to get current branch:
   ```typescript
   const branch = (window as any).__GIT_BRANCH__;
   ```

3. **E2E Tests** (`tests/e2e/dev-banner.spec.ts:15`)
   - Tests verify the branch info is correctly displayed:
   ```typescript
   const branchInfo = await page.evaluate(() => (window as any).__GIT_BRANCH__);
   ```

## File Locations

- **Data File**: `_data/git.json`
- **Git Hook**: `.git/hooks/post-checkout`
- **Justfile Command**: `justfile:201` (jekyll-serve)
- **Template Include**: `_includes/site-menu.html`
- **TypeScript Module**: `src/dev-info.ts`
- **Test**: `tests/e2e/dev-banner.spec.ts`

## Important Notes

- The `_data/git.json` file is listed in `.gitignore` since it's environment-specific
- The dev banner is only visible when running in development mode
- Restarting the Jekyll server will always refresh the branch information
- The post-checkout hook ensures branch info stays current during branch switches

## Testing

To verify the feature is working:
1. Start the Jekyll server: `just jekyll-serve`
2. Check that `_data/git.json` contains the current branch
3. Switch branches and verify the file updates automatically
4. The dev banner should display the current branch and port (4000)

## Troubleshooting

If the branch information is incorrect:
1. Restart the Jekyll server to force an update
2. Check that the post-checkout hook is executable: `chmod +x .git/hooks/post-checkout`
3. Manually update: `echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json`