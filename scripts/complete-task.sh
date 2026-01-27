#!/bin/bash
# Task Completion Script - Automates moving completed items in ROADMAP.md
# Usage: ./scripts/complete-task.sh "TASK-ID" "Summary"
# Example: ./scripts/complete-task.sh "ARCH-001" "22 files refactored, pre-commit hook enforces rule"

set -e

TASK_ID="$1"
SUMMARY="$2"
DATE=$(date +"%b %d, %Y" | sed 's/ 0/ /')  # Format: Jan 27, 2026

if [ -z "$TASK_ID" ] || [ -z "$SUMMARY" ]; then
    echo "Usage: ./scripts/complete-task.sh \"TASK-ID\" \"Summary\""
    echo "Example: ./scripts/complete-task.sh \"ARCH-001\" \"22 files refactored\""
    exit 1
fi

ROADMAP="docs/ROADMAP.md"

if [ ! -f "$ROADMAP" ]; then
    echo "Error: $ROADMAP not found"
    exit 1
fi

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Task Completion: $TASK_ID"
echo "╚══════════════════════════════════════════════════════════════╝"

# 1. Update last modified date
sed -i "s/\*\*Last Updated\*\*:.*/\*\*Last Updated\*\*: $(date +%Y-%m-%d)/" "$ROADMAP"

# 2. Remove from In Progress (any line containing task ID and - [ ] or - [/])
sed -i "/$TASK_ID/,/^-/{/$TASK_ID/d}" "$ROADMAP" 2>/dev/null || true

# 3. Add to Completed section (after the ### ✅ Completed line)
# Find the completed section and add the new item
sed -i "/### ✅ Completed/a\\- [x] **$TASK_ID** ($(date +"%b %d" | sed 's/ 0/ /')) - $SUMMARY" "$ROADMAP"

echo "✅ $TASK_ID marked complete in $ROADMAP"
echo "   Summary: $SUMMARY"
echo ""

# 5. Also update FEATURE_SUGGESTIONS.md if task exists there
BACKLOG="docs/FEATURE_SUGGESTIONS.md"
if [ -f "$BACKLOG" ] && grep -q "$TASK_ID" "$BACKLOG"; then
    # Add to completed table
    sed -i "/## ✅ COMPLETED FEATURES/,/^---/{/^|.*|$/!b;/ID.*Feature.*Completed/!{/^|.*|.*|.*|$/a\| $TASK_ID | Completed | $(date +%Y-%m-%d) | $SUMMARY |
}}" "$BACKLOG" 2>/dev/null || true
    echo "✅ $TASK_ID also updated in $BACKLOG"
fi

echo ""
echo "Next steps:"
echo "  1. git add $ROADMAP $BACKLOG"
echo "  2. git commit -m \"docs: mark $TASK_ID complete\""
echo ""

# 4. Auto-commit if in git repo and flag passed
if [ "$3" == "--commit" ]; then
    git add "$ROADMAP" "$BACKLOG" 2>/dev/null || git add "$ROADMAP"
    git commit -m "docs: mark $TASK_ID complete - $SUMMARY"
    echo "✅ Committed!"
fi
