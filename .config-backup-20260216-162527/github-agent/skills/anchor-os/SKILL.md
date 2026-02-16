---
name: anchor-os-context
description: Deep domain context for Anchor OS. Load for architecture decisions, complex features, or project background.
---

# Anchor OS

Self-hosted personal finance and commitment tracking system. Used daily by real people.

For stack, mandates, and directory layout see `.github/.agent/rules/02-TECHNICAL.md`.

## Family Sharing Architecture

- Invitations via Cloud Functions with out-of-band verification codes
- `sharedWith` array on accounts — provides VISIBILITY, not ownership
- Each account has ONE owner whose net worth includes that account
- Shared viewers can see transactions but don't count the balance in their net worth
- Permission-aware Firestore queries via security rules

## Fabric (Suggestion System)

- `src/features/fabric/FabricSuggestionManager.tsx` — orchestrates suggestions
- `src/hooks/useFabricSuggestions.ts` — generates contextual suggestions
- Dependency fabric: features only appear when prerequisites are met

## Dashboard Integration

The Internal PM Dashboard at `tools/dashboard/` (localhost:3001) is the single source of truth:
- Parses git commit history for bug/feature/deployment tracking
- `roadmap.json` defines planned work, git detects progress
- 10 MCP tools wrap the API for native agent access
- Auto-archival after 30 days
