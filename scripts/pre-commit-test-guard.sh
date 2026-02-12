#!/usr/bin/env bash
# pre-commit-test-guard.sh
#
# Enforces that any commit touching src/ files also includes at least one
# test file (.test.*, .spec.*, or files under __tests__/ or e2e/).
#
# Called two ways:
#   1. From .husky/pre-commit (no args) — reads git staged files
#   2. From test suite (args = space-separated file list) — uses args as file list

set -euo pipefail

# Get file list: from args (test mode) or git (real mode)
if [[ $# -gt 0 ]]; then
    FILES="$*"
else
    FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)
fi

# Check if any src/ production files are staged (exclude test files within src/)
HAS_SRC=false
HAS_TEST=false

for file in $FILES; do
    # Check if it's a test file (anywhere)
    if [[ "$file" =~ \.(test|spec)\.(ts|tsx|js|jsx)$ ]] || \
       [[ "$file" =~ __tests__/ ]] || \
       [[ "$file" =~ ^e2e/ ]]; then
        HAS_TEST=true
    # Check if it's a src/ production file
    elif [[ "$file" =~ ^src/ ]]; then
        HAS_SRC=true
    fi
done

# Gate: if src/ files changed but no test files, block the commit
if $HAS_SRC && ! $HAS_TEST; then
    echo ""
    echo "⛔ PRE-COMMIT GUARD: src/ files changed but no test files included."
    echo ""
    echo "   Changed src/ files require at least one test file:"
    echo "   • src/__tests__/*.test.ts(x)"
    echo "   • src/**/*.spec.ts(x)"
    echo "   • e2e/*.spec.ts"
    echo ""
    echo "   To bypass (emergencies only): git commit --no-verify"
    echo ""
    exit 1
fi

exit 0
