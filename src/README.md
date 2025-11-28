# JavaScript Development Guide

This document outlines the JavaScript/TypeScript development practices for the blog.

## Project Structure

```
src/
├── __tests__/       # Unit tests
├── utils/           # Utility functions
├── vendor/          # Third-party code
├── index.ts         # Main entry point (imports all other modules)
├── shared.ts        # Shared utilities and types
├── main.ts          # Main functionality (being phased out)
├── search.ts        # Search functionality (being phased out)
└── ...
```

## Single Entry Point Architecture

We use a single entry point architecture where:

1. `index.ts` is the main entry point that imports and initializes everything
2. `shared.ts` contains utility functions and types used across the application
3. All functionality is initialized in the document ready handler

This approach provides:

- Simpler builds (one input → one output)
- Reduced complexity (no need to manage module conflicts)
- Better dependency management
- Cleaner initialization

## Build System

We use Vite for bundling and TypeScript for type checking. The build process is configured in the project's `justfile`, `vite.config.ts`, and `tsconfig.json`.

### Available Commands

All JavaScript/TypeScript commands are managed through the justfile. **Do not use npm scripts** - look in the justfile instead.

```bash
# Build for production
just js-build

# Watch for changes during development
just js-watch

# Run tests
just js-test

# Type check without emitting files
just js-typecheck

# Format code
just js-format

# Lint code
just js-lint

# Clean build artifacts
just js-clean

# Run type checking and linting
just js-validate
```

## Why Vite and TypeScript?

We use both tools with clear separation of responsibilities:

1. **Vite** handles bundling, asset processing, and development workflow
2. **TypeScript** provides type checking for code quality

This separation allows us to leverage the strengths of both tools while maintaining a simple workflow.

## Module System

We use ES modules for code organization. Each file should export only what's needed by other modules.

Example:

```typescript
// shared.ts
export function toggleClass(element, className) { ... }

// index.ts
import { toggleClass } from './shared';
```

## Testing

We use Vitest for unit testing. Tests are located in the `__tests__` directory.

To run tests:

```bash
just js-test
```

## Code Style

We use Prettier for code formatting and follow these conventions:

- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use descriptive names
- Add JSDoc comments for public functions
- Prefer const over let when possible
- Avoid any type when possible

## Migrating Legacy Code

When migrating legacy code:

1. Move global functions to appropriate modules
2. Add proper type definitions
3. Add unit tests
4. Update imports in dependent files

## Debugging

For debugging:

1. Use browser developer tools
2. Check the console for initialization messages
3. Add console.log statements when needed (but remove before committing)

## Deployment

The build process outputs to `assets/js/index.js`. This file is then included in the Jekyll build.
