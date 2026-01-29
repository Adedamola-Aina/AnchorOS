# 1. Shared Component Library (@anchor-os/ui)

Date: 2026-01-29
Status: Accepted

## Context

Anchor OS has grown to include multiple UI components spread across `src/components/ui/` and `src/components/shared/`. These components (Button, Badge, Card, Skeleton) are fundamental building blocks used throughout the application.

As we consider future products (marketing site, internal dashboard), sharing these components becomes valuable. Additionally, clear separation makes testing and maintenance easier.

## Decision

Create an internal package alias `@anchor-os/ui` that maps to `src/libs/ui/`. This provides:

1. **Namespace clarity**: Imports like `import { Button } from '@anchor-os/ui'` clearly indicate shared UI components.
2. **Future extraction path**: If we ever need a true npm package, the imports won't need to change.
3. **Bundler efficiency**: Vite/TypeScript aliases are zero-cost at build time.

### Implementation

- Move core atoms: `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Skeleton.tsx` to `src/libs/ui/`
- Configure `tsconfig.json` and `vite.config.ts` with the `@anchor-os/ui` alias
- Update imports throughout the codebase

## Consequences

### Positive
- Clear ownership of shared vs. feature-specific components
- Easier to enforce consistency
- Path to true package extraction if needed
- Better IDE autocomplete experience

### Negative
- Two locations for "components" (`src/components/`, `src/libs/ui/`)
- Initial migration effort
- Need to document which components belong where
