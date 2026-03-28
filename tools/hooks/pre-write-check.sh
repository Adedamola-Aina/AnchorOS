#!/bin/bash
# PreToolUse hook — enforces GATHER → PLAN locks before any file write or edit.
# Exit 1 = BLOCKS the tool call. Claude Code shows stdout as feedback to the agent.
# Exit 0 = allows the tool call to proceed.

set -euo pipefail

# ── Resolve file path ─────────────────────────────────────────────────────────
# Claude Code sets CLAUDE_FILE_PATH for file tools. Fallback: parse stdin JSON.
FILE="${CLAUDE_FILE_PATH:-}"

if [ -z "$FILE" ]; then
  STDIN_DATA=$(cat 2>/dev/null || true)
  if [ -n "$STDIN_DATA" ]; then
    FILE=$(echo "$STDIN_DATA" | python3 -c "
import sys, json
try:
    d = json.loads(sys.stdin.read())
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")
  fi
fi

# If we cannot determine the file path, allow the write (fail open — not fail closed).
# This prevents blocking legitimate writes due to environment variance.
if [ -z "$FILE" ]; then
  exit 0
fi

# Normalize: strip absolute project prefix if present (makes patterns consistent)
FILE="${FILE#/root/anchor-os/}"

# ── Always-allow exceptions ───────────────────────────────────────────────────
# Lock files themselves must be writable, otherwise the workflow is self-defeating.
if [[ "$FILE" == .claude/gather.lock || "$FILE" == .claude/plan.lock ]]; then
  exit 0
fi

# ── GATE 1: GATHER lock ───────────────────────────────────────────────────────
# Every file write in any directory requires GATHER to be complete.
if [ ! -f ".claude/gather.lock" ]; then
  echo ""
  echo "⛔  BLOCKED — GATHER PHASE NOT COMPLETE"
  echo "════════════════════════════════════════════════════════════════"
  echo ""
  echo "  You cannot write or edit ANY file until GATHER is complete."
  echo ""
  echo "  Required steps (in order):"
  echo "    1. curl -s http://localhost:3001/api/command-center | head -100"
  echo "       — OR — get_project_state (MCP)"
  echo "    2. Read .anchor/INDEX.md"
  echo "    3. Read .anchor/WORKFLOW.md"
  echo "    4. Check for duplicate bugs/features (get_bugs / get_features)"
  echo "    5. Read relevant docs/ for this task domain"
  echo "    6. Classify risk class (.anchor/skills/risk-classification.md)"
  echo "    7. Run: touch .claude/gather.lock   ← this unblocks file writes"
  echo ""
  echo "  See .anchor/WORKFLOW.md § PHASE 1 for the full definition."
  echo "════════════════════════════════════════════════════════════════"
  exit 1
fi

# ── GATE 2: PLAN approval lock ────────────────────────────────────────────────
# Writing to src/ or functions/src/ also requires owner plan approval.
# (Test files are included — you must have an approved plan before writing any code.)
if [[ "$FILE" == src/* || "$FILE" == functions/src/* ]]; then
  if [ ! -f ".claude/plan.lock" ]; then
    echo ""
    echo "⛔  BLOCKED — PLAN NOT APPROVED"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "  Writing to src/ or functions/src/ requires owner plan approval."
    echo "  File attempted: $FILE"
    echo ""
    echo "  Required steps:"
    echo "    1. Output the Task Plan template (.anchor/WORKFLOW.md § PHASE 2)"
    echo "    2. Wait for owner to respond: APPROVED"
    echo "    3. Run: touch .claude/plan.lock   ← this unblocks src/ writes"
    echo ""
    echo "  Plan template (copy and fill):"
    echo "  ─────────────────────────────────────────────────────────────"
    echo "  ## Task Plan: [FEAT-XXX / BUG-XXX]"
    echo "  Risk Class: A / B / C"
    echo "  Success Metric: [one measurable outcome]"
    echo "  Guardrail Metrics: [up to 3 non-regression constraints]"
    echo "  Rollout Plan: dev → staging → prod"
    echo "  Rollback Plan: [trigger + action, executable in < 5 min]"
    echo "  Observability: [what telemetry confirms it is working]"
    echo "  Files to modify: [list]"
    echo "  Tests to write: [list]"
    echo "  Roles reviewed: [list of role sign-offs]"
    echo "  ─────────────────────────────────────────────────────────────"
    echo ""
    echo "  EXCEPTION: If owner explicitly says 'skip plan' or 'proceed':"
    echo "    touch .claude/plan.lock"
    echo ""
    echo "  See .anchor/WORKFLOW.md § PHASE 2 for the full definition."
    echo "════════════════════════════════════════════════════════════════"
    exit 1
  fi
fi

exit 0
