# Header GitHub Issue Creation Feature Specification

## Overview
The blog provides an interactive way for readers to report issues with specific sections of content by clicking a GitHub icon that appears when hovering over headers. This feature creates pre-filled GitHub issues with context about the specific section.

## User Experience

### 1. Visual Indicators
When hovering over any header (h1-h6):
- A **copy link icon** appears for copying the section URL
- A **GitHub icon** appears for reporting issues with that section
- Both icons fade in with a smooth transition (0.2s ease)
- Icons are positioned to the right of the header text with 0.5rem spacing

### 2. Issue Creation Workflow

#### Step 1: Click GitHub Icon
- User hovers over a header to reveal the GitHub icon
- Clicking the icon opens an inline popup editor

#### Step 2: Popup Editor
The popup displays:
- **Header**: "Report Issue: [Section Title]"
- **Issue Title Input**: Brief title for the issue (optional)
- **Description Textarea**: Detailed description (optional)
- **Submit Button**: Creates the issue
- **Close Button**: Cancels the action

#### Step 3: GitHub Redirect
When the user clicks submit:
1. A GitHub issue URL is constructed with:
   - Repository: `https://github.com/idvorkin/idvorkin.github.io`
   - Title format: `{page}/{section-id}: {custom-title or default}`
   - Body: Includes section URL and user's description
2. Opens in a new tab using `window.open(issueUrl, "_blank")`
3. The popup closes automatically

## Technical Implementation

### Files Involved
- **TypeScript Module**: `src/header-copy-link.ts`
- **Test Suite**: `tests/e2e/header-copy-link.spec.ts`
- **Unit Tests**: `src/__tests__/header-copy-link.test.ts`

### Key Functions

#### `createGitHubIssueIcon()`
- Creates the GitHub icon element
- Includes Font Awesome fallback detection
- Adds accessibility attributes (role, tabindex, aria-label)
- Returns styled span element with icon

#### `createIssuePopup(headerId, headerText)`
- Creates inline popup without using innerHTML (XSS protection)
- Builds DOM structure programmatically
- Returns fully configured popup element

#### `createGitHubIssueUrl(headerId, headerText, customTitle, customDescription, headerElement)`
Constructs the GitHub issue URL with:
- Base URL: `https://github.com/idvorkin/idvorkin.github.io/issues/new`
- Query parameters:
  - `title`: Formatted as `{page}/{section}: {title}`
  - `body`: Includes section URL and description
  - `labels`: "documentation" (if applicable)

### URL Construction Example
```
https://github.com/idvorkin/idvorkin.github.io/issues/new?
  title=manager-book%2Fteam-dynamics%3A%20Outdated%20example%20code&
  body=**Section%3A**%20Team%20Dynamics%0A
    **URL%3A**%20https%3A%2F%2Fidvork.in%2Fmanager-book%23team-dynamics%0A%0A
    This%20section%20contains%20outdated%20information%20that%20needs%20updating.&
  labels=documentation
```

## Styling

The popup uses CSS classes:
- `.github-issue-popup`: Main popup container
- `.github-issue-popup-content`: Content wrapper
- `.github-issue-popup-header`: Header section
- `.github-issue-popup-body`: Form body
- `.github-issue-popup-footer`: Action buttons
- `.github-issue-title`: Title input field
- `.github-issue-comment`: Description textarea
- `.github-issue-submit`: Submit button
- `.github-issue-popup-close`: Close button

## Accessibility Features

1. **Keyboard Support**:
   - Icons have `tabindex="0"` for keyboard navigation
   - Enter/Space keys trigger icon clicks
   - Escape key closes the popup

2. **ARIA Attributes**:
   - `role="button"` on clickable icons
   - `aria-label` descriptions for screen readers
   - Proper label associations for form inputs

3. **Visual Feedback**:
   - Hover states with opacity transitions
   - Cursor pointer on interactive elements
   - Clear focus indicators

## Security Considerations

1. **XSS Prevention**:
   - No use of `innerHTML` for user content
   - All text content set via `textContent` property
   - URL parameters properly encoded with `encodeURIComponent`

2. **Content Sanitization**:
   - Header text extracted safely via `textContent`
   - User input never interpreted as HTML
   - GitHub URL constructed with proper encoding

## Testing

### E2E Tests (`tests/e2e/header-copy-link.spec.ts`)
Tests verify:
- Icons appear on hover
- Popup opens when GitHub icon clicked
- Form inputs work correctly
- Submit opens new GitHub tab with correct URL
- URL contains proper title and body parameters

### Unit Tests (`src/__tests__/header-copy-link.test.ts`)
Tests verify:
- Icon creation functions
- URL construction logic
- Event handler attachments
- Cleanup on page navigation

## Browser Compatibility

- Uses modern JavaScript (ES6+)
- Font Awesome detection with multiple fallback strategies
- Graceful degradation if Font Awesome unavailable (shows emoji)
- Works with all major browsers supporting ES6

## Configuration

The feature targets:
- Repository: `idvorkin/idvorkin.github.io`
- Default label: "documentation"
- All headers (h1-h6) with IDs
- Excludes headers already processed (prevents duplicates)