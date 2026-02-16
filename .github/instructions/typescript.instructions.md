---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Conventions for Anchor OS

- Strict mode enabled — no `any` type
- No `console.log` in production code (use proper error handling)
- All database operations through `src/utils/secureDb.ts` — never import Firestore directly
- Source files under 200 lines (ARCH-001) — if approaching limit, extract to separate file
- Use ES module imports, destructure when possible
- Prefer functional components with hooks for React
- Error boundaries required on all major views (ARCH-002)
- Mobile-first: touch targets ≥44px, test on 375px viewport (ARCH-004)
