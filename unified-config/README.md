# Anchor OS — Unified Agent Configuration v5

## What This Solves

Your agents keep forgetting rules, repeating mistakes, and performing like junior devs because:

1. **85KB of overlapping instructions** across 3 files (CLAUDE.md, ADDON, .agent/) — agents can't prioritize when everything is "critical"
2. **No identity framing** — agents don't know WHO they are or what standard they're held to
3. **No anti-patterns** — agents repeat the same 10 mistakes because nobody told them not to
4. **Dashboard access via curl** — agents forget to run curl commands; MCP tools are automatic

## What Changed

| Before | After |
|--------|-------|
| CLAUDE.md (39KB) | CLAUDE.md (1.5KB pointer) |
| CLAUDE_INSTRUCTIONS_ADDON.md (8KB) | **Deleted** (merged into rules) |
| .agent/rules/ (13KB, 4 files) | .agent/rules/ (7KB, 4 files — rewritten) |
| .agent/workflows/ (12KB, 7 files) | .agent/workflows/ (1KB, 1 file) |
| .agent/skills/ (14KB, 4 files) | .agent/skills/ (2KB, 1 file) |
| No MCP server | MCP server with 10 dashboard tools |
| **Total: 87KB** | **Total: ~12KB + MCP** |

## How It Works

### For VS Code (Claude Code / Any Agent)

```
CLAUDE.md ──→ Points to .agent/rules/
                     ↓
              00-IDENTITY.md     ← WHO you are, 4-phase sequence
              01-TECHNICAL.md    ← Stack, mandates, environments  
              02-DOCUMENTS.md    ← Where to find everything
              03-ANTI-PATTERNS.md ← 10 mistakes we NEVER repeat
                     ↓
              .vscode/mcp.json   ← MCP server auto-starts
                     ↓
              tools/mcp-server/  ← Dashboard tools available natively
```

Claude Code reads `CLAUDE.md` → sees it must read `.agent/rules/` → loads the 4 compact files → has MCP tools for the dashboard → performs as top 1%.

### For Google Antigravity

```
.agent/rules/        ← Auto-loaded on every request
.agent/mcp.json      ← MCP server auto-starts  
.agent/workflows/    ← Available via /deploy command
.agent/skills/       ← Loaded when relevant
```

Antigravity reads `.agent/rules/` automatically → identity framing activates → has MCP tools for the dashboard → performs as top 1%.

### Both Platforms, Same Config

The key insight: **both VS Code and Antigravity read `.agent/rules/`**. CLAUDE.md is just a pointer for Claude Code specifically. The actual intelligence lives in the 4 rule files that both platforms share.

## The MCP Server (Game Changer)

Instead of hoping agents remember to run `curl http://localhost:3001/api/command-center`, they now have **native MCP tools** that show up in their tool picker:

| MCP Tool | Dashboard Endpoint | Purpose |
|----------|-------------------|---------|
| `get_project_state` | /api/command-center | Full project state — use FIRST |
| `get_bugs` | /api/git/bugs | Check for duplicate bugs |
| `get_roadmap` | /api/git/roadmap | Feature plan + priorities |
| `get_environment_parity` | /api/parity | What's deployed where |
| `get_features` | /api/git/features | Check for duplicate features |
| `search_git` | /api/git/search/:keyword | Search commit history |
| `get_next_id` | /api/intake/next-id | Next available bug/feature ID |
| `get_kanban` | /api/git/kanban | Visual task board |
| `get_velocity` | /api/velocity/stats | Development speed metrics |
| `get_changelog` | /api/git/changelog | Auto-generated release notes |

When agents have MCP tools, they **use them automatically** — no reminding needed.

## Installation

### On LXC 107 (your dev server)

```bash
# 1. SSH into the server
ssh root@100.112.129.21

# 2. Go to project root
cd /root/anchor-os

# 3. Copy the unified-config folder here (upload or scp)
# scp -r unified-config/ root@100.112.129.21:/root/anchor-os/

# 4. Run the installer
chmod +x unified-config/install.sh
./unified-config/install.sh

# 5. Verify MCP server works
cd tools/mcp-server && npm run inspect
# This opens the MCP Inspector — you should see 10 tools

# 6. Verify dashboard is running
curl -s http://localhost:3001/api/command-center | head -5

# 7. Clean up
cd /root/anchor-os
rm -rf unified-config/  # Installer already copied everything
```

### In VS Code (your Mac)

1. Open the project via SSH remote (as you already do)
2. VS Code will auto-detect `.vscode/mcp.json`
3. Claude Code will see the MCP tools in its tool list
4. Test: ask Claude Code "What's the current project state?"
   - It should use `get_project_state` MCP tool automatically

### In Antigravity

1. Open the project folder
2. Antigravity will auto-detect `.agent/rules/` and `.agent/mcp.json`
3. The agent will have the MCP tools available
4. Test: create a new task and verify the agent starts with Phase 1 (GATHER)

## Why This Works Better

### Identity-First Framing
The old config started with checklists. The new config starts with "You are the top 1% engineering team." Research shows identity framing activates deeper reasoning in LLMs — they perform to the standard they're told they represent.

### Anti-Patterns as Memory
LLMs don't have persistent memory. The anti-patterns file IS their memory of past failures. Without it, they'll repeat the production incident, the double-counting bug, and the 200-line violations every single time.

### MCP Over Curl
Agents are trained to use tools. They're NOT trained to remember curl commands from a markdown file. MCP tools show up in their native tool picker — they use them as naturally as they use file read/write.

### 12KB Over 85KB
LLMs have limited attention. At 85KB of instructions, everything blurs together. At 12KB, every word matters and actually gets followed.

## Testing the Setup

After installation, run this quick verification:

```bash
# Rules are installed and compact
find .agent/rules -name "*.md" -exec wc -c {} + | tail -1
# Should be ~7,000 bytes total

# CLAUDE.md is compact
wc -c CLAUDE.md
# Should be ~1,500 bytes

# Old addon is gone
ls CLAUDE_INSTRUCTIONS_ADDON.md 2>/dev/null || echo "✅ Addon removed"

# MCP server starts
cd tools/mcp-server && node index.js &
# Should print "Anchor Dashboard MCP Server running on stdio"
kill %1

# Dashboard is reachable
curl -s http://localhost:3001/api/command-center | head -3
# Should return JSON
```

## Troubleshooting

**Agent still not following rules?**
- In Antigravity: Restart the workspace. Check `.agent/rules/` exists.
- In VS Code: Restart Claude Code. Check `CLAUDE.md` points to `.agent/rules/`.

**MCP tools not appearing?**
- Check dashboard is running: `./tools/dashboard/dashboard.sh status`
- Check MCP config: `.vscode/mcp.json` (VS Code) or `.agent/mcp.json` (Antigravity)
- Test manually: `cd tools/mcp-server && npm run inspect`

**Dashboard unreachable?**
```bash
./tools/dashboard/dashboard.sh start
# Wait 5 seconds
curl http://localhost:3001/api/command-center
```
