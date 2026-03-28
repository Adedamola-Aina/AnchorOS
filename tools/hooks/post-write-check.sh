#!/bin/bash
# PostToolUse hook — ARCH-001 line count enforcement after Write.
# Warns (does not block) if a TypeScript source file exceeds 200 lines.
# Blocking happens in pre-write-check.sh. This is the retrospective safety net.

FILE="${CLAUDE_FILE_PATH:-}"

if [ -z "$FILE" ]; then
  exit 0
fi

# Only check TypeScript/TSX source files, not test files
if [[ "$FILE" != *.ts && "$FILE" != *.tsx ]]; then
  exit 0
fi

if [[ "$FILE" == *.test.* || "$FILE" == *.spec.* ]]; then
  exit 0
fi

LINES=$(wc -l < "$FILE" 2>/dev/null || echo 0)

if [ "$LINES" -gt 200 ]; then
  echo ""
  echo "⚠️  ARCH-001 VIOLATION — $FILE"
  echo "   $LINES lines written (limit: 200)"
  echo ""
  echo "   This file MUST be split before this work is considered done."
  echo "   Refactor approach:"
  echo "     • Extract pure logic → separate utility file"
  echo "     • Extract sub-components → separate component file"
  echo "     • Extract hooks → separate hook file"
  echo ""
  echo "   See .anchor/agents/02-architect.md for guidance."
  echo ""
elif [ "$LINES" -gt 175 ]; then
  echo "⚡ ARCH-001 WARNING — $FILE is approaching the 200-line limit ($LINES / 200)."
  echo "   Split proactively before adding more code."
fi
