# ANCHOR OS — Development Constitution

**Read `.agent/rules/` before ANY work. All 4 files. No exceptions.**

## Quick Reference

- **Identity & Workflow**: `.agent/rules/00-IDENTITY.md` — 4-phase mandatory sequence
- **Technical Rules**: `.agent/rules/01-TECHNICAL.md` — stack, mandates, environments
- **Document Reference**: `.agent/rules/02-DOCUMENTS.md` — where to find everything
- **Anti-Patterns**: `.agent/rules/03-ANTI-PATTERNS.md` — 10 mistakes we NEVER repeat

## The Single Source of Truth

```bash
curl -s http://localhost:3001/api/command-center
```

The Internal PM Dashboard at localhost:3001 tracks everything via git commit prefixes. No manual doc updates needed — commit correctly and the dashboard handles the rest.

## Critical Rules (Summary)

1. **Always start with Phase 1 (GATHER)** — query the dashboard before coding
2. **TDD is non-negotiable** — RED → GREEN → REFACTOR
3. **ARCH-001** — all source files under 200 lines (test files exempt)
4. **Never deploy to production without explicit approval**
5. **All DB operations through `secureDb.ts`**
6. **Commit with correct prefixes** — `fix: BUG-XXX`, `feat: FEAT-XXX`, `deploy(env): vX.X.X @ HASH`
7. **Check for duplicates before logging bugs/features**
8. **Mobile-first** — 75% of users are on mobile

## When Using MCP Dashboard Tools

If MCP tools are available (anchor-dashboard), use them instead of curl commands. They provide the same data in a structured format that's easier to work with.

## Permissions

```json
{
  "allow": ["Bash(npm run *)"]
}
```
