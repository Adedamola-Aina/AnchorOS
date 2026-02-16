#!/bin/bash
# ============================================================================
# Anchor OS — Agent Config v7 Installer
# Research-backed unified configuration for Claude Code + VS Code Copilot
# ============================================================================
set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ANCHOR OS — Agent Config v7 Installer                ║${NC}"
echo -e "${BLUE}║   Universal: Claude Code + VS Code Copilot + Any LLM   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Must run from project root
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}❌ Run this from the Anchor OS project root${NC}"
    exit 1
fi

# ── Step 1: Backup ──────────────────────────────────────────────────────────
BACKUP_DIR=".config-backup-$(date +%Y%m%d-%H%M%S)"
echo -e "${YELLOW}📦 Step 1: Backing up old config to ${BACKUP_DIR}/${NC}"
mkdir -p "$BACKUP_DIR"

[ -f "CLAUDE.md" ] && cp CLAUDE.md "$BACKUP_DIR/" && echo "  Backed up CLAUDE.md"
[ -f "AGENTS.md" ] && cp AGENTS.md "$BACKUP_DIR/" && echo "  Backed up AGENTS.md"
[ -f ".github/copilot-instructions.md" ] && cp .github/copilot-instructions.md "$BACKUP_DIR/" && echo "  Backed up copilot-instructions.md"
[ -d ".github/.agent" ] && cp -r .github/.agent "$BACKUP_DIR/github-agent" && echo "  Backed up .github/.agent/"
[ -d ".claude" ] && cp -r .claude "$BACKUP_DIR/claude" && echo "  Backed up .claude/"
[ -f ".vscode/settings.json" ] && cp .vscode/settings.json "$BACKUP_DIR/vscode-settings.json" && echo "  Backed up .vscode/settings.json"
[ -f ".vscode/mcp.json" ] && cp .vscode/mcp.json "$BACKUP_DIR/vscode-mcp.json" && echo "  Backed up .vscode/mcp.json"
[ -f "docs/AGENT_WORKFLOW_COMMITMENT.md" ] && cp docs/AGENT_WORKFLOW_COMMITMENT.md "$BACKUP_DIR/" && echo "  Backed up AGENT_WORKFLOW_COMMITMENT.md"

echo -e "${GREEN}  ✅ Backup complete${NC}"
echo ""

# ── Step 2: Remove old config ──────────────────────────────────────────────
echo -e "${YELLOW}🗑️  Step 2: Removing old config files${NC}"

# Remove the .github/.agent directory (Antigravity-specific, replaced by AGENTS.md)
rm -rf .github/.agent
echo "  Removed .github/.agent/ (rules, workflows, skills — consolidated into AGENTS.md)"

# Remove old .claude directory if it exists without skills
rm -rf .claude
echo "  Removed .claude/ (will recreate with skills + hooks)"

# Remove redundant docs
rm -f docs/AGENT_WORKFLOW_COMMITMENT.md
echo "  Removed docs/AGENT_WORKFLOW_COMMITMENT.md (merged into AGENTS.md)"

# Remove CLAUDE_INSTRUCTIONS_ADDON.md if it exists
rm -f CLAUDE_INSTRUCTIONS_ADDON.md 2>/dev/null
echo "  Removed CLAUDE_INSTRUCTIONS_ADDON.md (if existed)"

echo -e "${GREEN}  ✅ Cleanup complete${NC}"
echo ""

# ── Step 3: Install AGENTS.md (universal) ──────────────────────────────────
echo -e "${YELLOW}📝 Step 3: Installing AGENTS.md (universal source of truth)${NC}"

# The AGENTS.md file should be in the same directory as this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$SCRIPT_DIR/root-files/AGENTS.md" ./AGENTS.md
echo "  ✅ AGENTS.md installed ($(wc -c < AGENTS.md) bytes)"

cp "$SCRIPT_DIR/root-files/CLAUDE.md" ./CLAUDE.md
echo "  ✅ CLAUDE.md installed (pointer to AGENTS.md)"

echo ""

# ── Step 4: Install VS Code Copilot config ─────────────────────────────────
echo -e "${YELLOW}📝 Step 4: Installing VS Code Copilot configuration${NC}"

cp "$SCRIPT_DIR/.github/copilot-instructions.md" .github/copilot-instructions.md
echo "  ✅ .github/copilot-instructions.md"

# Custom agents
mkdir -p .github/agents
cp "$SCRIPT_DIR/.github/agents/planner.agent.md" .github/agents/
cp "$SCRIPT_DIR/.github/agents/implementer.agent.md" .github/agents/
cp "$SCRIPT_DIR/.github/agents/reviewer.agent.md" .github/agents/
cp "$SCRIPT_DIR/.github/agents/devops.agent.md" .github/agents/
echo "  ✅ .github/agents/ (4 custom agents: planner, implementer, reviewer, devops)"

# Path-specific instructions
mkdir -p .github/instructions
cp "$SCRIPT_DIR/.github/instructions/typescript.instructions.md" .github/instructions/
cp "$SCRIPT_DIR/.github/instructions/tests.instructions.md" .github/instructions/
echo "  ✅ .github/instructions/ (TypeScript + testing rules)"

echo ""

# ── Step 5: Install Claude Code skills + hooks ─────────────────────────────
echo -e "${YELLOW}📝 Step 5: Installing Claude Code skills + hooks${NC}"

mkdir -p .claude/skills/anchor-architecture
mkdir -p .claude/skills/family-mode
mkdir -p .claude/skills/deployment
mkdir -p .claude/skills/dashboard
mkdir -p .claude/skills/testing

cp "$SCRIPT_DIR/.claude/skills/anchor-architecture/SKILL.md" .claude/skills/anchor-architecture/
cp "$SCRIPT_DIR/.claude/skills/family-mode/SKILL.md" .claude/skills/family-mode/
cp "$SCRIPT_DIR/.claude/skills/deployment/SKILL.md" .claude/skills/deployment/
cp "$SCRIPT_DIR/.claude/skills/dashboard/SKILL.md" .claude/skills/dashboard/
cp "$SCRIPT_DIR/.claude/skills/testing/SKILL.md" .claude/skills/testing/
echo "  ✅ .claude/skills/ (5 skills: architecture, family-mode, deployment, dashboard, testing)"

cp "$SCRIPT_DIR/.claude/settings.json" .claude/settings.json
echo "  ✅ .claude/settings.json (hooks: ARCH-001 checker + session start context)"

echo ""

# ── Step 6: Install VS Code settings ───────────────────────────────────────
echo -e "${YELLOW}📝 Step 6: Updating VS Code settings${NC}"

mkdir -p .vscode
cp "$SCRIPT_DIR/.vscode/settings.json" .vscode/settings.json
cp "$SCRIPT_DIR/.vscode/mcp.json" .vscode/mcp.json
echo "  ✅ .vscode/settings.json (AGENTS.md enabled, instruction files enabled)"
echo "  ✅ .vscode/mcp.json (dashboard MCP with correct Copilot format)"

echo ""

# ── Step 7: Verify ─────────────────────────────────────────────────────────
echo -e "${YELLOW}🔍 Step 7: Verification${NC}"
echo ""

echo "  File sizes:"
echo "    AGENTS.md:                $(wc -c < AGENTS.md) bytes"
echo "    CLAUDE.md:                $(wc -c < CLAUDE.md) bytes"
echo "    copilot-instructions.md:  $(wc -c < .github/copilot-instructions.md) bytes"

TOTAL_AGENTS=$(wc -c .github/agents/*.agent.md 2>/dev/null | tail -1 | awk '{print $1}')
echo "    Custom agents (4):        ${TOTAL_AGENTS} bytes"

TOTAL_INSTRUCTIONS=$(wc -c .github/instructions/*.instructions.md 2>/dev/null | tail -1 | awk '{print $1}')
echo "    Path instructions (2):    ${TOTAL_INSTRUCTIONS} bytes"

TOTAL_SKILLS=$(find .claude/skills -name "SKILL.md" -exec cat {} \; | wc -c)
echo "    Skills (5):               ${TOTAL_SKILLS} bytes"
echo "    settings.json (hooks):    $(wc -c < .claude/settings.json) bytes"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Agent Config v7 installed successfully!            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}What changed:${NC}"
echo "  • AGENTS.md is the universal source of truth (all platforms read it)"
echo "  • CLAUDE.md is a tiny pointer (imports AGENTS.md + permissions)"
echo "  • .github/.agent/ REMOVED (replaced by AGENTS.md + .github/agents/)"
echo "  • 4 custom agents for Copilot (planner, implementer, reviewer, devops)"
echo "  • 2 path-specific instruction files (TypeScript, tests)"
echo "  • 5 Claude Code skills (load on demand, not always-on)"
echo "  • Hooks enforce ARCH-001 (200-line limit) and inject session context"
echo "  • VS Code settings enable AGENTS.md + instruction file discovery"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. git add -A && git commit -m 'chore: agent config v7 — universal AGENTS.md, skills, hooks, custom agents'"
echo "  2. In VS Code: verify Settings > chat.useAgentsMdFile is true"
echo "  3. Test: ask any agent 'What is the current project state?'"
echo "  4. Optional: install Claude Code plugins:"
echo "     /plugin install security-guidance@anthropics/claude-code"
echo "     /plugin install frontend-design@anthropics/claude-code"
echo "     /plugin install commit-commands@anthropics/claude-code"
echo "     /plugin install feature-dev@anthropics/claude-code"
echo "     /plugin install code-review@anthropics/claude-code"
echo ""
echo -e "${BLUE}Backup saved to: ${BACKUP_DIR}/${NC}"
