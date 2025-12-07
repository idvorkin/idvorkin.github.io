# Workflow Recommendations

This directory captures workflow improvements discovered during AI-assisted coding sessions.

## File Naming

Use `YYYY-MM-DD-HHMMSS-XXXX.md` where XXXX is random characters (prevents merge conflicts).

## When to Create

At session end (when Igor signals done, or says "workflow review"):

1. Review session for patterns: repeated corrections, friction, missing context
2. Create timestamped recommendation file
3. Ask Igor if they want to merge any immediately into CLAUDE.md

## Template

```markdown
# Session: YYYY-MM-DD (project-name)

## Recommendations

### [Short title]

- **Pattern**: [What kept happening]
- **Recommendation**: [Specific text to add]
- **Target**: CLAUDE.md | chop-conventions
- **Status**: pending | merged | rejected
```
