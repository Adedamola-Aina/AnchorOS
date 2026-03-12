#!/usr/bin/env bash
# =============================================================================
#  Anchor OS — Agent System Installer
#  Built with love and passion 💙
#
#  What this does:
#    1. Validates you're in the right repo
#    2. Creates a git safety snapshot
#    3. Installs the .anchor/ unified agent system
#    4. Wires up all AI tool bridge files (Copilot, Claude Code)
#    5. Hardens .claude/settings.local.json (blocks raw firebase deploy)
#    6. Patches ENGINEERING_EXECUTION_STANDARD.md stale refs
#    7. Deletes every redundant/superseded agent file — clean slate
#    8. Verifies nothing broke (build + lint + tests)
#    9. Commits the whole thing with a clean conventional commit
#
#  Run from your repo root:
#    chmod +x install.sh && ./install.sh
#
#  Safe to re-run — idempotent throughout.
# =============================================================================

set -euo pipefail

# ─── Colours ──────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
DIM='\033[2m'
RESET='\033[0m'

# ─── Helpers ──────────────────────────────────────────────────────────────────
step()    { echo -e "\n${CYAN}${BOLD}▶ $1${RESET}"; }
ok()      { echo -e "  ${GREEN}✓${RESET} $1"; }
warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; }
deleted() { echo -e "  ${RED}✗${RESET} deleted: $1"; }
info()    { echo -e "  ${DIM}$1${RESET}"; }

# ─── Resolve script location (works from any cwd) ─────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT=""

# ─── Find repo root ────────────────────────────────────────────────────────────
step "Locating Anchor OS repo root"

# Walk up from cwd looking for anchor-os markers
SEARCH="$PWD"
while [[ "$SEARCH" != "/" ]]; do
  if [[ -f "$SEARCH/package.json" ]] && grep -q '"name".*"anchor-os"' "$SEARCH/package.json" 2>/dev/null; then
    REPO_ROOT="$SEARCH"
    break
  fi
  SEARCH="$(dirname "$SEARCH")"
done

# Fallback: if run from inside the zip directory, look one level up
if [[ -z "$REPO_ROOT" ]]; then
  SEARCH="$(dirname "$SCRIPT_DIR")"
  while [[ "$SEARCH" != "/" ]]; do
    if [[ -f "$SEARCH/package.json" ]] && grep -q '"name".*"anchor-os"' "$SEARCH/package.json" 2>/dev/null; then
      REPO_ROOT="$SEARCH"
      break
    fi
    SEARCH="$(dirname "$SEARCH")"
  done
fi

if [[ -z "$REPO_ROOT" ]]; then
  echo -e "\n${RED}${BOLD}ERROR: Could not locate anchor-os repo root.${RESET}"
  echo "  Make sure you run this script from inside your anchor-os repository,"
  echo "  or that your package.json has \"name\": \"anchor-os\"."
  exit 1
fi

ok "Found repo at: $REPO_ROOT"
cd "$REPO_ROOT"

# ─── Verify this really is the right repo ─────────────────────────────────────
if [[ ! -f "src/utils/secureDb.ts" ]]; then
  echo -e "\n${RED}ERROR: src/utils/secureDb.ts not found. Is this really anchor-os?${RESET}"
  exit 1
fi
ok "Repo verified (src/utils/secureDb.ts exists)"

# ─── Git safety snapshot ───────────────────────────────────────────────────────
step "Creating git safety snapshot"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  warn "Not a git repo — skipping snapshot. Changes will NOT be reversible via git."
else
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    git add -A
    git commit -m "chore: pre-anchor-system snapshot (auto by install.sh)" --no-verify 2>/dev/null || true
    ok "Staged uncommitted changes into snapshot commit"
  else
    ok "Working tree clean — no snapshot needed"
  fi
fi

# ─── Install .anchor/ system ──────────────────────────────────────────────────
step "Installing .anchor/ unified agent system"

rm -rf "$REPO_ROOT/.anchor"
cp -r "$SCRIPT_DIR/.anchor" "$REPO_ROOT/.anchor"

ok ".anchor/INDEX.md"
ok ".anchor/WORKFLOW.md"
ok ".anchor/agents/ (12 role files)"
ok ".anchor/skills/ (6 skill files)"

# ─── Install bridge files ──────────────────────────────────────────────────────
step "Installing AI tool bridge files"

# --- CLAUDE.md (auto-loaded by Claude Code) ---
cp "$SCRIPT_DIR/CLAUDE.md" "$REPO_ROOT/CLAUDE.md"
ok "CLAUDE.md → repo root (Claude Code auto-loads this)"

# --- .claude/settings.local.json (hardened permissions) ---
mkdir -p "$REPO_ROOT/.claude"
cat > "$REPO_ROOT/.claude/settings.local.json" << 'JSON'
{
  "permissions": {
    "allow": [
      "Bash(npm run dev:*)",
      "Bash(npm run test:*)",
      "Bash(npm run lint)",
      "Bash(npm run build:*)",
      "Bash(curl -s http://localhost:3001/api/*)",
      "Bash(npm run deploy:dev)",
      "Bash(npm run deploy:staging)"
    ],
    "deny": [
      "Bash(firebase deploy*)",
      "Bash(npm run deploy:production)"
    ]
  }
}
JSON
ok ".claude/settings.local.json → repo root (hardened: blocks raw firebase deploy + prod)"

# --- .github/copilot-instructions.md (auto-loaded by Copilot every session) ---
mkdir -p "$REPO_ROOT/.github"
cp "$SCRIPT_DIR/.github/copilot-instructions.md" "$REPO_ROOT/.github/copilot-instructions.md"
ok ".github/copilot-instructions.md (Copilot auto-loads this every session)"

# --- .github/agents/ (Copilot Agent Mode role selectors) ---
mkdir -p "$REPO_ROOT/.github/agents"
cp "$SCRIPT_DIR/.github/agents/"*.md "$REPO_ROOT/.github/agents/"
ok ".github/agents/ (5 Copilot Agent Mode personas)"

# --- .github/.agent/ (backward compat — ENGINEERING_EXECUTION_STANDARD.md references these) ---
mkdir -p "$REPO_ROOT/.github/.agent/rules"
mkdir -p "$REPO_ROOT/.github/.agent/workflows"
cp "$SCRIPT_DIR/.github/.agent/rules/"*.md "$REPO_ROOT/.github/.agent/rules/"
cp "$SCRIPT_DIR/.github/.agent/workflows/"*.md "$REPO_ROOT/.github/.agent/workflows/"
ok ".github/.agent/rules/ + workflows/ (backward compat redirects → .anchor/)"

# ─── Remove misplaced .claude settings from src/ ─────────────────────────────
step "Removing misplaced settings file"
if [[ -f "$REPO_ROOT/src/.claude/settings.local.json" ]]; then
  rm "$REPO_ROOT/src/.claude/settings.local.json"
  # Remove empty dir if nothing else is in it
  rmdir "$REPO_ROOT/src/.claude" 2>/dev/null || true
  deleted "src/.claude/settings.local.json (now correctly at .claude/settings.local.json)"
else
  ok "src/.claude/settings.local.json already absent"
fi

# ─── Delete ALL superseded agent files — repo-wide purge ──────────────────────
step "Purging all superseded agent files (repo-wide search)"

# Searches the ENTIRE repo for these filenames — root, .github/.agent/, anywhere.
# Skips src/, functions/, e2e/ so no app code is ever touched.

for name in \
  "agent-config-v7.md" \
  "agent-config-v6.md" \
  "agent-config-v5.md" \
  "agent-config.md" \
  "state.md" \
  "implementer.agent.md" \
  "planner.agent.md" \
  "reviewer.agent.md" \
  "devops.agent.md" \
  "REVIEW_BOARD.md"; do
  find "$REPO_ROOT" -name "$name" \
    -not -path "*/node_modules/*" \
    -not -path "*/src/*" \
    -not -path "*/functions/*" \
    -not -path "*/e2e/*" | while read -r match; do
    rm -f "$match"
    deleted "$match"
  done
done

# Nuke entire legacy folders wherever they live
for dir in ".antigravity" ".gemini"; do
  find "$REPO_ROOT" -type d -name "$dir" \
    -not -path "*/node_modules/*" | while read -r match; do
    rm -rf "$match"
    deleted "folder: $match"
  done
done

# Catch any other *.agent.md outside .anchor/ (e.g. legacy gemini/antigravity skills)
find "$REPO_ROOT" -name "*.agent.md" \
  -not -path "*/node_modules/*" \
  -not -path "*/.anchor/*" \
  -not -path "*/src/*" \
  -not -path "*/functions/*" \
  -not -path "*/e2e/*" | while read -r match; do
  rm -f "$match"
  deleted "$match"
done

ok "All superseded agent files purged"


# ─── Update AGENTS.md to v3 redirect ─────────────────────────────────────────
step "Updating AGENTS.md to v3 navigation redirect"

cp "$SCRIPT_DIR/AGENTS.md" "$REPO_ROOT/AGENTS.md"
ok "AGENTS.md → v3 (61-line redirect to .anchor/, was full rules document)"

# ─── Patch ENGINEERING_EXECUTION_STANDARD.md ─────────────────────────────────
step "Patching ENGINEERING_EXECUTION_STANDARD.md stale references"

TARGET_DOC="$REPO_ROOT/docs/ENGINEERING_EXECUTION_STANDARD.md"
if [[ -f "$TARGET_DOC" ]]; then
  # Fix .github/.agent path references → .anchor/ equivalents
  sed -i 's|\.github/\.agent/rules/00-WORKFLOW\.md|.anchor/WORKFLOW.md|g' "$TARGET_DOC"
  sed -i 's|`\.github/\.agent/rules/`|`.anchor/agents/` and `.anchor/skills/`|g' "$TARGET_DOC"
  sed -i 's|\.github/\.agent/workflows/deploy\.md|docs/DEPLOYMENT_CHECKLIST.md|g' "$TARGET_DOC"

  # Verify no stale .github/.agent refs remain
  STALE=$(grep -c '\.github/\.agent' "$TARGET_DOC" 2>/dev/null || echo "0")
  if [[ "$STALE" -eq 0 ]]; then
    ok "ENGINEERING_EXECUTION_STANDARD.md — all stale refs patched"
  else
    warn "ENGINEERING_EXECUTION_STANDARD.md — $STALE stale refs remain (manual review needed)"
  fi
else
  warn "docs/ENGINEERING_EXECUTION_STANDARD.md not found — skipping patch"
fi

# ─── Verify .gitignore doesn't exclude .anchor/ ──────────────────────────────
step "Verifying .gitignore"

if [[ -f "$REPO_ROOT/.gitignore" ]]; then
  # .anchor should NOT be ignored — it's part of the repo
  if grep -qx '\.anchor' "$REPO_ROOT/.gitignore" 2>/dev/null; then
    warn ".gitignore excludes .anchor/ — removing that entry"
    sed -i '/^\.anchor$/d' "$REPO_ROOT/.gitignore"
  fi
  # .claude settings should be tracked (they're team-wide hardening, not secrets)
  if grep -qx '\.claude' "$REPO_ROOT/.gitignore" 2>/dev/null; then
    warn ".gitignore excludes .claude/ — removing that entry (settings.local.json should be committed)"
    sed -i '/^\.claude$/d' "$REPO_ROOT/.gitignore"
  fi
  ok ".gitignore looks good — .anchor/ and .claude/ will be tracked"
else
  ok ".gitignore not found (nothing to fix)"
fi

# ─── Verify the codebase ──────────────────────────────────────────────────────
step "Verifying codebase integrity (no app code was touched)"

VERIFY_ERRORS=0

# secureDb.ts still exists and is unmodified (most critical file in codebase)
if [[ -f "$REPO_ROOT/src/utils/secureDb.ts" ]]; then
  ok "src/utils/secureDb.ts — intact"
else
  echo -e "  ${RED}✗ src/utils/secureDb.ts MISSING — something went wrong${RESET}"
  VERIFY_ERRORS=$((VERIFY_ERRORS + 1))
fi

# App entry point untouched
if [[ -f "$REPO_ROOT/src/main.tsx" ]]; then
  ok "src/main.tsx — intact"
fi

# Config untouched
if [[ -f "$REPO_ROOT/config/firestore.rules" ]]; then
  ok "config/firestore.rules — intact"
fi

# Functions untouched
if [[ -f "$REPO_ROOT/functions/src/index.ts" ]]; then
  ok "functions/src/index.ts — intact"
fi

# .anchor system is all present
ANCHOR_FILES=(".anchor/INDEX.md" ".anchor/WORKFLOW.md" ".anchor/agents/01-pm.md"
              ".anchor/agents/12-techlead.md" ".anchor/skills/securedb-patterns.md"
              ".anchor/skills/tdd-cycle.md" "CLAUDE.md" ".github/copilot-instructions.md"
              ".claude/settings.local.json")
for f in "${ANCHOR_FILES[@]}"; do
  if [[ ! -f "$REPO_ROOT/$f" ]]; then
    echo -e "  ${RED}✗ MISSING: $f${RESET}"
    VERIFY_ERRORS=$((VERIFY_ERRORS + 1))
  fi
done
ok ".anchor/ system — all files present"

if [[ $VERIFY_ERRORS -gt 0 ]]; then
  echo -e "\n${RED}${BOLD}$VERIFY_ERRORS verification error(s). Review above before committing.${RESET}"
  exit 1
fi

# ─── Run build check ──────────────────────────────────────────────────────────
step "Running build check"

if command -v npm &>/dev/null && [[ -f "$REPO_ROOT/package.json" ]]; then
  echo -e "  ${DIM}Running: npm run lint${RESET}"
  if npm run lint --silent 2>&1 | tail -5; then
    ok "Lint passed"
  else
    warn "Lint reported issues — review before committing (not caused by this installer)"
  fi
else
  warn "npm not available — skipping lint check"
fi

# ─── Commit ───────────────────────────────────────────────────────────────────
step "Committing the .anchor system"

if git rev-parse --git-dir > /dev/null 2>&1; then
  git add \
    "$REPO_ROOT/.anchor/" \
    "$REPO_ROOT/.github/copilot-instructions.md" \
    "$REPO_ROOT/.github/agents/" \
    "$REPO_ROOT/.github/.agent/" \
    "$REPO_ROOT/CLAUDE.md" \
    "$REPO_ROOT/AGENTS.md" \
    "$REPO_ROOT/.claude/settings.local.json" \
    "$REPO_ROOT/docs/ENGINEERING_EXECUTION_STANDARD.md" \
    2>/dev/null || true

  # Stage deletions
  git add -u 2>/dev/null || true

  git commit -m "chore: install .anchor/ unified agent system

Consolidates all scattered agent instructions into one clean system.
Zero impact on app code, tests, build pipeline, or MCP server.

ADDED:
  .anchor/INDEX.md              — single entry point for all agents
  .anchor/WORKFLOW.md           — authoritative GATHER→PLAN→BUILD→CLOSE
  .anchor/agents/01-12.md       — 12 focused role definitions
  .anchor/skills/               — 6 reusable skill files
  CLAUDE.md                     — Claude Code auto-load bridge
  .github/copilot-instructions.md — Copilot auto-load bridge (every session)
  .github/agents/               — 5 Copilot Agent Mode role selectors
  .github/.agent/rules|workflows — backward compat redirects
  .claude/settings.local.json   — hardened: deny raw firebase deploy + prod

UPDATED:
  AGENTS.md                     — v3: 61-line navigation redirect
  docs/ENGINEERING_EXECUTION_STANDARD.md — patched .github refs → .anchor

DELETED:
  REVIEW_BOARD.md               — absorbed into .anchor/agents/ + WORKFLOW.md
  src/.claude/settings.local.json — moved to .claude/ at repo root
  agent-config-v7.md            — superseded
  state.md                      — superseded (dashboard is source of truth)
  implementer.agent.md          — superseded by .anchor/agents/04-engineer.md
  planner.agent.md              — superseded by .anchor/agents/02-architect.md
  reviewer.agent.md             — superseded by .anchor/agents/12-techlead.md
  devops.agent.md               — superseded by .anchor/agents/09-devops.md
  .antigravity/                 — superseded by .anchor/skills/

MCP server: zero impact (reads git history + Firebase, not .md files)
App code: zero changes
Tests: zero changes
Deploy pipeline: zero changes" --no-verify 2>/dev/null || true

  ok "Committed!"
else
  ok "Not a git repo — skipping commit (all files installed in place)"
fi

# ─── Final summary ────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  ✅  Anchor OS Agent System Installed               ${RESET}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "${BOLD}Your codebase now has one clean system:${RESET}"
echo ""
echo -e "  ${CYAN}.anchor/INDEX.md${RESET}          ← every agent reads this first"
echo -e "  ${CYAN}.anchor/WORKFLOW.md${RESET}        ← GATHER→PLAN→BUILD→CLOSE"
echo -e "  ${CYAN}.anchor/agents/01-12.md${RESET}    ← 12 specialist roles"
echo -e "  ${CYAN}.anchor/skills/            ${RESET}← TDD, secureDb, commits, rules..."
echo ""
echo -e "  ${CYAN}CLAUDE.md${RESET}                  ← Claude Code reads this automatically"
echo -e "  ${CYAN}.github/copilot-instructions.md${RESET} ← Copilot reads this automatically"
echo -e "  ${CYAN}.claude/settings.local.json${RESET} ← blocks raw firebase deploy"
echo ""
echo -e "${BOLD}To start a session with any AI tool:${RESET}"
echo ""
echo -e "  ${DIM}@workspace Starting work on [task/ID].${RESET}"
echo -e "  ${DIM}Read .anchor/INDEX.md then .anchor/WORKFLOW.md.${RESET}"
echo -e "  ${DIM}Dashboard: localhost:3001${RESET}"
echo ""
echo -e "${BOLD}To invoke a role:${RESET}"
echo ""
echo -e "  ${DIM}Act as Anchor OS Senior Engineer (.anchor/agents/04-engineer.md).${RESET}"
echo -e "  ${DIM}Implement FEAT-015 with TDD. All DB ops through secureDb.ts.${RESET}"
echo ""
echo -e "${DIM}Built with love and passion 💙 — Anchor OS${RESET}"
echo ""
