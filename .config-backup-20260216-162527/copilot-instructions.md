# Anchor OS — Copilot Agent Instructions

**Canonical source: `CLAUDE.md` (project root)**

All agent rules, workflows, and mandates are defined in `CLAUDE.md` and `.github/.agent/rules/`. This file exists for Copilot discovery. If this file and `CLAUDE.md` ever diverge, `CLAUDE.md` is authoritative.

## Quick Reference

1. **Every task starts with Phase 1 (GATHER)** — run `get_project_state`, check `get_bugs` + `get_features`
2. **Phase 2 (PLAN)** — present plan, wait for user confirmation
3. **Phase 3 (BUILD)** — TDD: red → green → refactor (state exception if TDD doesn't apply)
4. **Phase 4 (CLOSE)** — run tests + lint, commit with correct prefix, verify dashboard

## Rules Index

| File | Content |
|------|---------|
| `CLAUDE.md` | Master agent instructions and mandatory workflow |
| `.github/.agent/rules/00-WORKFLOW.md` | 4-phase sequence with checklists and gates |
| `.github/.agent/rules/01-IDENTITY.md` | 7 thinking perspectives, delegation framework, push-back philosophy |
| `.github/.agent/rules/02-TECHNICAL.md` | Stack, mandates, environments, commit prefixes |
| `.github/.agent/rules/03-DOCUMENTS.md` | Dashboard API reference, docs index |
| `.github/.agent/rules/04-ANTI-PATTERNS.md` | 13 real failures to never repeat |
