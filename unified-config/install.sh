#!/bin/bash
set -e

# ============================================================================
# ANCHOR OS — UNIFIED AGENT CONFIG INSTALLER
# ============================================================================
# This script:
# 1. Backs up your old config files
# 2. Installs the new unified .agent/ rules (v5)
# 3. Replaces the bloated CLAUDE.md with a compact pointer
# 4. Installs the MCP server for dashboard integration
# 5. Removes redundant files
# ============================================================================

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ANCHOR OS — Unified Agent Config Installer    ║${NC}"
echo -e "${BLUE}║   From 85KB → 12KB | 3 files → 1 source        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Must run from project root
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}❌ Run this from the Anchor OS project root${NC}"
    exit 1
fi

# Step 1: Backup
BACKUP_DIR=".config-backup-$(date +%Y%m%d-%H%M%S)"
echo -e "${YELLOW}📦 Step 1: Backing up old config to ${BACKUP_DIR}/${NC}"

mkdir -p "$BACKUP_DIR"
[ -f "CLAUDE.md" ] && cp CLAUDE.md "$BACKUP_DIR/"
[ -f "CLAUDE_INSTRUCTIONS_ADDON.md" ] && cp CLAUDE_INSTRUCTIONS_ADDON.md "$BACKUP_DIR/"
[ -d ".agent" ] && cp -r .agent "$BACKUP_DIR/"
echo -e "${GREEN}   ✅ Backup complete${NC}"

# Step 2: Remove old config
echo -e "${YELLOW}🗑️  Step 2: Removing old config files${NC}"

rm -f CLAUDE_INSTRUCTIONS_ADDON.md
echo -e "${GREEN}   ✅ Removed CLAUDE_INSTRUCTIONS_ADDON.md${NC}"

# Step 3: Install new .agent/ rules
echo -e "${YELLOW}📝 Step 3: Installing v5 agent rules${NC}"

# Remove old rules and workflows (keep skills data if any custom)
rm -rf .agent/rules .agent/workflows
mkdir -p .agent/rules .agent/workflows .agent/skills/anchor-os

# Copy new rules
cp unified-config/.agent/rules/00-IDENTITY.md .agent/rules/
cp unified-config/.agent/rules/01-TECHNICAL.md .agent/rules/
cp unified-config/.agent/rules/02-DOCUMENTS.md .agent/rules/
cp unified-config/.agent/rules/03-ANTI-PATTERNS.md .agent/rules/
echo -e "${GREEN}   ✅ 4 rule files installed ($(du -sh .agent/rules/ | cut -f1) total)${NC}"

# Copy workflow
cp unified-config/.agent/workflows/deploy.md .agent/workflows/
echo -e "${GREEN}   ✅ Deploy workflow installed${NC}"

# Copy skill
cp unified-config/.agent/skills/anchor-os/SKILL.md .agent/skills/anchor-os/
echo -e "${GREEN}   ✅ Skill file updated${NC}"

# Copy MCP config for Antigravity
cp unified-config/.agent/mcp.json .agent/mcp.json 2>/dev/null || true
echo -e "${GREEN}   ✅ Antigravity MCP config installed${NC}"

# Step 4: Install compact CLAUDE.md
echo -e "${YELLOW}📝 Step 4: Installing compact CLAUDE.md (was 39KB → now ~1.5KB)${NC}"
cp unified-config/CLAUDE.md ./CLAUDE.md
echo -e "${GREEN}   ✅ CLAUDE.md replaced${NC}"

# Step 5: Install MCP server
echo -e "${YELLOW}🔌 Step 5: Installing Dashboard MCP Server${NC}"

mkdir -p tools/mcp-server
cp unified-config/tools/mcp-server/index.js tools/mcp-server/
cp unified-config/tools/mcp-server/package.json tools/mcp-server/

# Install MCP server dependencies
cd tools/mcp-server
npm install --production 2>/dev/null
cd ../..
echo -e "${GREEN}   ✅ MCP server installed at tools/mcp-server/${NC}"

# Step 6: Install VS Code MCP config
echo -e "${YELLOW}🔧 Step 6: Installing VS Code MCP config${NC}"
mkdir -p .vscode
cp unified-config/.vscode/mcp.json .vscode/mcp.json
echo -e "${GREEN}   ✅ VS Code MCP config at .vscode/mcp.json${NC}"

# Step 7: Remove redundant old files
echo -e "${YELLOW}🧹 Step 7: Cleaning up redundant files${NC}"

# Remove old git-tracking skill (merged into main skill)
rm -f .agent/skills/anchor-os-git-tracking/SKILL.md
rmdir .agent/skills/anchor-os-git-tracking 2>/dev/null || true

# Remove old CURRENT_STATE.md (dashboard is the source of truth)
rm -f .agent/skills/anchor-os/CURRENT_STATE.md

# Remove old dashboard integration doc (MCP server replaces it)
rm -f .agent/skills/anchor-os/DASHBOARD_INTEGRATION.md

# Remove old workflow files (merged into rules)
rm -f .agent/workflows/versioning-standard.md
rm -f .agent/workflows/dashboard_sync.md
rm -f .agent/workflows/dashboard-query.md
rm -f .agent/workflows/context-check.md
rm -f .agent/workflows/post-implementation.md
rm -f .agent/workflows/status-report.md

echo -e "${GREEN}   ✅ Redundant files removed${NC}"

# Summary
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 INSTALLATION COMPLETE            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}New structure:${NC}"
echo ""
echo "  CLAUDE.md                         (~1.5KB — pointer to .agent/)"
echo "  .agent/"
echo "  ├── rules/"
echo "  │   ├── 00-IDENTITY.md            (WHO you are + 4-phase sequence)"
echo "  │   ├── 01-TECHNICAL.md           (Stack, mandates, environments)"
echo "  │   ├── 02-DOCUMENTS.md           (Where to find everything)"
echo "  │   └── 03-ANTI-PATTERNS.md       (10 mistakes we NEVER repeat)"
echo "  ├── workflows/"
echo "  │   └── deploy.md                 (Deployment with checklist)"
echo "  ├── skills/anchor-os/"
echo "  │   └── SKILL.md                  (Deep project context)"
echo "  └── mcp.json                      (Antigravity MCP config)"
echo "  .vscode/"
echo "  │   └── mcp.json                  (VS Code MCP config)"
echo "  tools/mcp-server/"
echo "  │   ├── index.js                  (Dashboard MCP server)"
echo "  │   └── package.json"
echo ""

# Size comparison
OLD_SIZE="87,546"
NEW_RULES=$(du -sb .agent/rules/ | cut -f1)
NEW_CLAUDE=$(wc -c < CLAUDE.md)
NEW_TOTAL=$((NEW_RULES + NEW_CLAUDE))
echo -e "  ${RED}Old total: ~${OLD_SIZE} bytes (85KB)${NC}"
echo -e "  ${GREEN}New total: ~${NEW_TOTAL} bytes (~$((NEW_TOTAL / 1024))KB)${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Restart VS Code / Antigravity to pick up new config"
echo "  2. Ensure dashboard is running: ./tools/dashboard/dashboard.sh start"
echo "  3. Test MCP server: cd tools/mcp-server && npm run inspect"
echo "  4. Old config backed up to: ${BACKUP_DIR}/"
echo ""
echo -e "${GREEN}Done! Your agents now have a unified, 12KB instruction set${NC}"
echo -e "${GREEN}with MCP-native dashboard access. No more forgotten rules.${NC}"
