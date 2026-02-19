---
description: "Test blog includes and components with Playwright: test pages, e2e tests, screenshots"
allowed-tools: ["Bash", "Read", "Edit", "Write", "Glob", "Grep"]
---

# Testing Blog Includes & Components

**Always test includes and components with Playwright before claiming work is complete.**

## Test Pages

Test pages live in the `_test/` collection (excluded from search/algolia). Create isolated test pages for each include component.

**Pattern:** `_test/include-{component-name}.md`

**Example** (`_test/include-amazon.md`):

```markdown
---
layout: post
title: Test - Amazon Include
permalink: /test/include-amazon
---

# Test Page: Amazon Include

## Single ASIN
{% include amazon.html asin="B07ZWK2TQT" %}

## Multiple ASINs
{% include amazon.html asin="B07ZWK2TQT;B01JA6HG88;B0FGN9GC2G" %}
```

## Playwright E2E Tests

Create corresponding e2e tests in `tests/e2e/test-include-{name}.spec.ts`:

1. **Screenshot tests** — Visual verification
2. **Structure tests** — Verify DOM structure, classes, attributes
3. **Integration tests** — Test component behavior

Run tests:

```bash
npx playwright test tests/e2e/test-include-amazon.spec.ts --project=chromium
```

## Checklist Before Marking Work Complete

- Create test page in `_test/`
- Write Playwright test with screenshots
- Run test and verify screenshots look correct
- Commit test page and test spec
