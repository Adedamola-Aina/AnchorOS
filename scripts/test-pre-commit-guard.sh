#!/usr/bin/env bash
# Test suite for the pre-commit test-coverage guard
# Usage: bash scripts/test-pre-commit-guard.sh

set -euo pipefail

PASS=0
FAIL=0
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GUARD_SCRIPT="$SCRIPT_DIR/pre-commit-test-guard.sh"

assert_passes() {
    local desc="$1"; shift
    if "$@" > /dev/null 2>&1; then
        PASS=$((PASS + 1))
        echo "  ✅ $desc"
    else
        FAIL=$((FAIL + 1))
        echo "  ❌ $desc (expected pass, got fail)"
    fi
}

assert_fails() {
    local desc="$1"; shift
    if "$@" > /dev/null 2>&1; then
        FAIL=$((FAIL + 1))
        echo "  ❌ $desc (expected fail, got pass)"
    else
        PASS=$((PASS + 1))
        echo "  ✅ $desc"
    fi
}

echo "🧪 Pre-commit test guard — unit tests"
echo ""

# Test 1: src/ file changed with no test file → should FAIL
echo "Test 1: src/ change without test → blocks"
assert_fails "blocks src-only change" \
    bash "$GUARD_SCRIPT" "src/utils/sanitize.ts"

# Test 2: src/ file changed WITH a test file → should PASS
echo "Test 2: src/ change with matching test → allows"
assert_passes "allows src + test change" \
    bash "$GUARD_SCRIPT" "src/utils/sanitize.ts src/utils/__tests__/sanitize.test.ts"

# Test 3: src/ file changed with a .spec.ts file → should PASS
echo "Test 3: src/ change with .spec file → allows"
assert_passes "allows src + spec change" \
    bash "$GUARD_SCRIPT" "src/utils/seeder.ts src/utils/seeder.spec.ts"

# Test 4: Only non-src files changed (docs, config, tools) → should PASS (no gate)
echo "Test 4: non-src change → no gate applied"
assert_passes "allows docs-only change" \
    bash "$GUARD_SCRIPT" "docs/README.md tools/dashboard/server/index.js"

# Test 5: Only test files changed → should PASS
echo "Test 5: test-only change → allows"
assert_passes "allows test-only change" \
    bash "$GUARD_SCRIPT" "src/__tests__/App.test.tsx"

# Test 6: e2e test counts as a test
echo "Test 6: src/ change with e2e test → allows"
assert_passes "allows src + e2e change" \
    bash "$GUARD_SCRIPT" "src/features/auth/AuthView.tsx e2e/auth.spec.ts"

# Test 7: Multiple src files, one test → should PASS
echo "Test 7: multiple src files with one test → allows"
assert_passes "allows multi-src + one test" \
    bash "$GUARD_SCRIPT" "src/utils/a.ts src/utils/b.ts src/__tests__/a.test.ts"

# Test 8: chore files (package.json, configs) with src → still needs test
echo "Test 8: src + config but no test → blocks"
assert_fails "blocks src + config without test" \
    bash "$GUARD_SCRIPT" "src/App.tsx package.json config/vite.config.ts"

echo ""
echo "Results: $PASS passed, $FAIL failed out of $((PASS + FAIL))"

if [[ $FAIL -gt 0 ]]; then
    exit 1
fi
echo "✅ All tests passed"
