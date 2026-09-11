#!/usr/bin/env bash
#
# Workhorse v1 completion-verification entry point (local completion gate).
#
# Classifies the changed files (using the existing repository classifier),
# runs the relevant verification sequentially, and records a machine-readable
# result in worktree-local Git metadata for receipt.sh to consume.
#
# GitHub Actions remains the authoritative CI system. This is only the local
# completion gate. Playwright/E2E and dependency installation are never run.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib.sh"

die() { echo "verify-change: $*" >&2; exit 2; }

ROOT="$(workhorse_git_root "$PWD")"
[ -n "$ROOT" ] || die "not inside a git repository"

BRANCH="$(workhorse_branch "$ROOT")"
[ "$BRANCH" != "master" ] || die "refusing to run on master"

HEAD_SHA="$(git -C "$ROOT" rev-parse HEAD)"

BASE_SHA="$(workhorse_read_base_sha "$ROOT")"
[ -n "$BASE_SHA" ] || die "no recorded Workhorse base SHA; create the task with scripts/agent/start-task.sh"
git -C "$ROOT" cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null || die "recorded base SHA $BASE_SHA is not present"

mapfile -t CHANGED < <(workhorse_changed_files "$ROOT" "$BASE_SHA")
[ "${#CHANGED[@]}" -gt 0 ] || die "no changed files against base $BASE_SHA"

# ---------------------------------------------------------------------------
# diff hygiene + classification
# ---------------------------------------------------------------------------

DIFF_CHECK_OUT="$(git -C "$ROOT" diff --check "$BASE_SHA" 2>&1)"
DIFF_CHECK_CODE=$?
if [ "$DIFF_CHECK_CODE" -eq 0 ]; then DIFF_CHECK_STATUS="pass"; else DIFF_CHECK_STATUS="fail"; fi
if [ -n "$DIFF_CHECK_OUT" ]; then echo "$DIFF_CHECK_OUT" >&2; fi

CLASSIFY_JSON="$(node "$ROOT/scripts/ci/classify-changes.js" --files "${CHANGED[@]}" 2>/dev/null)"
CATEGORY="$(printf '%s' "$CLASSIFY_JSON" | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d;}).on("end",()=>{process.stdout.write(JSON.parse(s).category);});')"
RELEASE="$(printf '%s' "$CLASSIFY_JSON" | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d;}).on("end",()=>{process.stdout.write(String(JSON.parse(s).release));});')"

echo "classification: $CATEGORY (release=$RELEASE)"
echo "changed files (${#CHANGED[@]}):"
printf '  %s\n' "${CHANGED[@]}"

RESULTS="$(mktemp)"
CHANGED_FILE="$(mktemp)"
trap 'rm -f "$RESULTS" "$CHANGED_FILE"' EXIT
printf '%s\n' "${CHANGED[@]}" > "$CHANGED_FILE"

# Record the diff hygiene check as part of the verification history.
if [ "$DIFF_CHECK_STATUS" = "pass" ]; then
    printf '%s\t%s\t%s\t%s\t%s\t\n' "git diff --check" "git diff --check $BASE_SHA" "0" "pass" "0" >> "$RESULTS"
else
    printf '%s\t%s\t%s\t%s\t%s\t\n' "git diff --check" "git diff --check $BASE_SHA" "$DIFF_CHECK_CODE" "fail" "0" >> "$RESULTS"
fi

run_cmd() {
    local name="$1"; shift
    local cmd="$*"
    local start end dur code status
    start="$(date +%s%3N)"
    echo "==> ${name}: ${cmd}"
    ( cd "$ROOT" && eval "$cmd" )
    code=$?
    end="$(date +%s%3N)"
    dur=$(( end - start ))
    if [ "$code" -eq 0 ]; then status="pass"; else status="fail"; fi
    printf '%s\t%s\t%s\t%s\t%s\t\n' "$name" "$cmd" "$code" "$status" "$dur" >> "$RESULTS"
    return "$code"
}

record_unverified() {
    local name="$1"
    local reason="$2"
    reason="$(printf '%s' "$reason" | tr '\t' ' ')"
    echo "==> ${name}: UNVERIFIED (${reason})"
    printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$name" "" "0" "unverified" "0" "$reason" >> "$RESULTS"
}

have_npm_script() {
    node -e 'const p=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));process.exit(p.scripts&&p.scripts[process.argv[2]]?0:1);' "$ROOT/package.json" "$1"
}

# ---------------------------------------------------------------------------
# Surface detection
# ---------------------------------------------------------------------------

has_frontend=false
has_functions=false
has_rules=false
has_query=false
has_agent=false

for f in "${CHANGED[@]}"; do
    case "$f" in
        functions/*) has_functions=true ;;
    esac
    case "$f" in
        firestore.rules|storage.rules|config/firestore.rules|config/storage.rules|firestore.indexes.json|config/firestore.indexes.json) has_rules=true ;;
    esac
    case "$f" in
        src/services/fabric/query/*|src/services/fabric/QueryEngine.ts) has_query=true ;;
    esac
    case "$f" in
        src/*|public/*|packages/*|index.html) has_frontend=true ;;
    esac
    case "$f" in
        scripts/agent/*|.clinerules/hooks/*) has_agent=true ;;
    esac
done

ROOT_DEPS=false; [ -d "$ROOT/node_modules" ] && ROOT_DEPS=true
FN_DEPS=false; [ -d "$ROOT/functions/node_modules" ] && FN_DEPS=true

run_functions_checks() {
    if [ "$FN_DEPS" = true ]; then
        run_cmd "functions build" "npm --prefix functions run build"
        if [ -f "$ROOT/functions/vitest.config.ts" ]; then
            run_cmd "functions tests" "cd functions && npx vitest --run --config vitest.config.ts"
        else
            record_unverified "functions tests" "functions vitest config not found; deferred to CI"
        fi
    else
        record_unverified "functions build" "functions/node_modules missing; run npm ci in functions (deferred to CI)"
        record_unverified "functions tests" "functions/node_modules missing (deferred to CI)"
    fi
}

run_rules_checks() {
    if ! command -v firebase >/dev/null 2>&1 || ! command -v java >/dev/null 2>&1; then
        record_unverified "rules tests" "firebase CLI or Java runtime unavailable for the emulator (deferred to CI)"
    else
        run_cmd "rules tests" "npm run test:rules"
    fi
}

run_frontend_checks() {
    if [ "$ROOT_DEPS" = true ]; then
        run_cmd "lint" "npm run lint"
        run_cmd "unit tests" "npm run test:run"
    else
        record_unverified "lint" "root node_modules missing; run npm ci (deferred to CI)"
        record_unverified "unit tests" "root node_modules missing; run npm ci (deferred to CI)"
    fi
    if [ "$has_query" = true ]; then
        if [ "$ROOT_DEPS" = true ]; then
            run_cmd "query coverage gate" "npm run test:coverage:query-gate"
        else
            record_unverified "query coverage gate" "root node_modules missing (deferred to CI)"
        fi
    fi
}

# ---------------------------------------------------------------------------
# Relevant verification only — sequential, never concurrent.
# ---------------------------------------------------------------------------

case "$CATEGORY" in
    CI_INFRA)
        if have_npm_script "test:ci-infra"; then
            run_cmd "CI infrastructure" "npm run test:ci-infra"
        else
            record_unverified "CI infrastructure" "package.json has no test:ci-infra script; running repository CI self-tests instead"
            run_cmd "CI self-tests" "node --test scripts/ci"
        fi
        ;;
    ENGINEERING_ONLY)
        echo "engineering-only change: product suite intentionally not run"
        ;;
    PRODUCT_RUNTIME)
        run_frontend_checks
        [ "$has_functions" = true ] && run_functions_checks
        [ "$has_rules" = true ] && run_rules_checks
        ;;
    BACKEND_RUNTIME)
        [ "$has_functions" = true ] && run_functions_checks
        [ "$has_rules" = true ] && run_rules_checks
        [ "$has_frontend" = true ] && run_frontend_checks
        ;;
    *)
        record_unverified "classification" "unrecognised classification $CATEGORY; deferred to CI"
        ;;
esac

# The Workhorse harness's own self-tests run whenever the harness is touched,
# regardless of classification, without waking the product suite.
if [ "$has_agent" = true ]; then
    run_cmd "Workhorse self-tests" "node --test scripts/agent/workhorse.node-suite.mjs"
fi

# ---------------------------------------------------------------------------
# Machine-readable record (worktree-local Git metadata, never a tracked file).
# ---------------------------------------------------------------------------

FAIL_COUNT="$(awk -F'\t' '$4=="fail"{c++} END{print c+0}' "$RESULTS")"
UNVERIFIED_COUNT="$(awk -F'\t' '$4=="unverified"{c++} END{print c+0}' "$RESULTS")"

VERIFICATION_JSON="$(node --input-type=module -e '
import fs from "node:fs";
const [resultsPath, changedPath, base, head, branch, category, release, diffStatus] = process.argv.slice(1);
const lines = fs.readFileSync(resultsPath, "utf8").split("\n").filter(Boolean);
const checks = lines.map((line) => {
    const c = line.split("\t");
    return { name: c[0], command: c[1] || null, exit_code: Number(c[2]), status: c[3], duration_ms: Number(c[4]), reason: c[5] || undefined };
});
const unverified = checks.filter((c) => c.status === "unverified").map((c) => ({ name: c.name, reason: c.reason || "unverified" }));
const changed = fs.readFileSync(changedPath, "utf8").split("\n").filter(Boolean);
const record = { base_sha: base, head_sha: head, branch, classification: category, release: release === "true", changed_files: changed, diff_check: { command: "git diff --check " + base, status: diffStatus }, checks, unverified };
process.stdout.write(JSON.stringify(record));
' "$RESULTS" "$CHANGED_FILE" "$BASE_SHA" "$HEAD_SHA" "$BRANCH" "$CATEGORY" "$RELEASE" "$DIFF_CHECK_STATUS")"

workhorse_write_meta "$ROOT" "$WORKHORSE_VERIFICATION_KEY" "$VERIFICATION_JSON"

echo "verification record:"
printf '%s' "$VERIFICATION_JSON" | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d;}).on("end",()=>{console.log(JSON.stringify(JSON.parse(s),null,2));});'

echo "verify-change: ${FAIL_COUNT} failed, ${UNVERIFIED_COUNT} unverified"
if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0