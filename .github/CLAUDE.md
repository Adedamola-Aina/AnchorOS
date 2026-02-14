# ANCHOR OS — Development Constitution

**Read `.github/.agent/rules/` before ANY work. All 4 files. No exceptions.**

## Quick Reference

- **Identity & Thinking**: `.github/.agent/rules/00-IDENTITY.md` — 7 role perspectives, 4-phase sequence
- **Technical Rules**: `.github/.agent/rules/01-TECHNICAL.md` — stack, mandates, environments
- **Document Reference**: `.github/.agent/rules/02-DOCUMENTS.md` — dashboard API, docs index
- **Anti-Patterns**: `.github/.agent/rules/03-ANTI-PATTERNS.md` — 13 mistakes we NEVER repeat

## The Single Source of Truth

The Internal PM Dashboard at localhost:3001 tracks everything via git commit prefixes. Use MCP tools when available (`get_project_state` first), or:

```bash
curl -s http://localhost:3001/api/command-center
```

## Critical Rules (Summary)

1. **GATHER before coding** — query dashboard, check duplicates, report findings
2. **PLAN and wait for confirmation** — list files, tests, risks, deploy target
3. **TDD** — RED → GREEN → REFACTOR, no code without failing test
4. **ARCH-001** — source files under 200 lines
5. **All DB through `secureDb.ts`**
6. **Mobile-first** — 75% mobile users
7. **Never deploy to production without explicit approval**
8. **Use `npm run deploy:{env}`** — never raw `firebase deploy`
9. **Commit with correct prefixes** — dashboard auto-detects everything

## Permissions

```json
{
  "allow": ["Bash(npm run *)"]
}
```
