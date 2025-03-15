# CLAUDE.md - Project Guidelines for idvorkin.github.io

## Build & Test Commands

- Build: `just js-build` (TypeScript compilation + bundling with Parcel)
- TypeCheck: `just js-typecheck` (TypeScript type validation)
- Lint: `just js-lint` (Prettier check of TS/JS files)
- Format: `just js-format` (Fix formatting)
- Test (all): `just js-test` or `npx vitest run`
- Test (specific): `npx vitest run src/path/to/file.test.ts`
- Test (watch): `just js-test-watch` or `npx vitest`
- E2E Tests: `just pw-test-e2e` (Playwright)
- Local Jekyll: `just jekyll-serve`
- Update Backlinks: `just update-backlinks`

## Code Style Guidelines

- **TypeScript**: Use TypeScript for all new code with strict types
- **DOM Ready**: Always check `document.readyState` before DOM manipulation
- **Error Handling**: Implement proper error handling for all async operations
- **Interfaces**: Use interfaces for data structures, check `shared.ts` first
- **Exports**: Only export functions needed by other modules
- **Components**: Keep UI components isolated with own lifecycle
- **Debugging**: Use console.log with emoji prefixes (🔴 for errors)
- **Testing**: Create minimal test cases for complex components
- **Dependency**: Minimize external dependencies, validate all packages
- **jQuery**: Use jQuery patterns consistently when needed

For detailed guidance, see rules in `.cursor/rules/` directory.
