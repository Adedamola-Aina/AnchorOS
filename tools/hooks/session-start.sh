#!/bin/bash
# SessionStart hook — resets workflow locks and prints mandatory GATHER checklist.
# Runs at the start of every Claude Code session.

# ── Reset session locks ───────────────────────────────────────────────────────
# Every session starts locked. The agent must actively complete GATHER + PLAN
# to unlock file writes. This prevents jumping straight to code.
mkdir -p .claude
rm -f .claude/gather.lock .claude/plan.lock 2>/dev/null || true

# ── Print mandatory checklist ─────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║  ANCHOR OS — SESSION STARTED                                        ║"
echo "║  Workflow: GATHER → PLAN → [OWNER APPROVAL] → BUILD → CLOSE        ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📅 $(date '+%Y-%m-%d %H:%M %Z')"
echo ""
echo "⛔ STATUS: ALL FILE WRITES ARE BLOCKED"
echo "   gather.lock: missing  (required for any write)"
echo "   plan.lock:   missing  (required for src/ and functions/src/ writes)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "MANDATORY FIRST ACTIONS — complete ALL before touching any file:"
echo ""
echo "  1. curl -s http://localhost:3001/api/command-center | head -100"
echo "         (or: get_project_state via MCP)"
echo "  2. Read .anchor/INDEX.md"
echo "  3. Read .anchor/WORKFLOW.md"
echo "  4. Check for duplicate work  (get_bugs / get_features)"
echo "  5. Read relevant docs/ for your task domain"
echo "  6. Classify risk class       (.anchor/skills/risk-classification.md)"
echo "  7. touch .claude/gather.lock"
echo "         ↑ This unlocks file writes. Do NOT run this before steps 1–6."
echo ""
echo "  Then for src/ and functions/src/ writes:"
echo "  8. Output the Task Plan template (WORKFLOW.md § PHASE 2)"
echo "  9. STOP. Wait for owner approval."
echo " 10. touch .claude/plan.lock"
echo "         ↑ Run this ONLY after owner says APPROVED."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Dashboard state (non-blocking) ────────────────────────────────────────────
DASHBOARD=$(curl -s --max-time 3 http://localhost:3001/api/command-center 2>/dev/null || true)
if [ -n "$DASHBOARD" ]; then
  echo "📊 Dashboard state:"
  echo "$DASHBOARD" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    alerts = d.get('alerts', {})
    work = d.get('work', {})
    envs = d.get('environments', {})

    crit = alerts.get('critical', 0)
    warn = alerts.get('warning', 0)
    info = alerts.get('info', 0)
    in_prog = work.get('inProgress', 0)

    prod = envs.get('versions', {}).get('production', 'unknown')
    staging = envs.get('versions', {}).get('staging', 'unknown')

    print(f'   Alerts: {crit} critical, {warn} warning, {info} info')
    print(f'   In progress: {in_prog} items')
    print(f'   Production: {prod}  |  Staging: {staging}')

    # Print critical alerts
    for item in alerts.get('items', []):
        if item.get('severity') == 'critical':
            print(f'   🚨 CRITICAL: {item[\"title\"]} — {item[\"description\"]}')
except Exception as e:
    # If parsing fails, just show raw (truncated)
    sys.stdout.buffer.write(sys.stdin.buffer.read(500))
" 2>/dev/null || echo "$DASHBOARD" | head -8
else
  echo "⚠️  Dashboard unreachable (localhost:3001) — proceed from docs/"
fi

echo ""
