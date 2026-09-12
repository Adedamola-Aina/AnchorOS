#!/usr/bin/env bash
#
# Workhorse v1 completion-verification entry point (local completion gate).
#
# Consumes the canonical repository change classifier
# (scripts/ci/classify-changes.js) surface booleans directly and runs the
# relevant verification sequentially. If the classifier cannot run or its
# JSON cannot be parsed, verification FAILS (never downgraded to "unverified").
#
# GitHub Actions remains authoritative. Dependency installation, Playwright
# and E2E are never run here.

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

# Workhorse-specific surface: the only path classification this script keeps.
has_agent=false
for f in "${CHANGED[@]}"; do
    case "$f" in
        scripts/agent/*|.clinerules/hooks/*) has_agent=true ;;
    esac
done

RESULTS="$(mktemp)"
CHANGED_FILE="$(mktemp)"
trap 'rm -f "$RESULTS" "$CHANGED_FILE"' EXIT
printf '%s\n' "${CHANGED[@]}" > "$CHANGED_FILE"

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

# ---------------------------------------------------------------------------
# Diff hygiene
# ---------------------------------------------------------------------------

DIFF_CHECK_OUT="$(git -C "$ROOT" diff --check "$BASE_SHA" 2>&1)"
DIFF_CHECK_CODE=$?
if [ "$DIFF_CHECK_CODE" -eq 0 ]; then DIFF_CHECK_STATUS="pass"; else DIFF_CHECK_STATUS="fail"; fi
if [ -n "$DIFF_CHECK_OUT" ]; then echo "$DIFF_CHECK_OUT" >&2; fi
printf '%s\t%s\t%s\t%s\t%s\t\n' "git diff --check" "git diff --check $BASE_SHA" "$DIFF_CHECK_CODE" "$DIFF_CHECK_STATUS" "0" >> "$RESULTS"

# ---------------------------------------------------------------------------
# Canonical classifier (required). Failure to run/parse is a hard failure.
# ---------------------------------------------------------------------------

CLASSIFY_JSON=""
CLASSIFY_OK=true
if ! CLASSIFY_JSON="$(node "$ROOT/scripts/ci/classify-changes.js" --files "${CHANGED[@]}" 2>/dev/null)"; then
    CLASSIFY_OK=false
fi

CLS_CATEGORY=""
CLS_RELEASE=""
CLS_FRONTEND_CHANGED=false
CLS_BACKEND_CHANGED=false
CLS_FUNCTIONS_CHANGED=false
CLS_RULES_CHANGED=false
CLS_QUERY_CHANGED=false
CLS_SMOKE_REQUIRED=false
CLS_CI_INFRA_CHANGED=false
CLS_ENGINEERING_ONLY_CHANGED=false
CLS_ENGINEERING_CODE_CHANGED=false

if [ "$CLASSIFY_OK" = true ]; then
    CLASSIFY_EVAL="$(printf '%s' "$CLASSIFY_JSON" | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d;}).on("end",()=>{try{const r=JSON.parse(s);const b=["frontend_changed","backend_changed","functions_changed","rules_changed","query_changed","smoke_required","ci_infra_changed","engineering_only_changed","engineering_code_changed"];const out=["CLS_CATEGORY="+JSON.stringify(String(r.category)),"CLS_RELEASE="+(r.release===true?"true":"false")];for(const k of b){out.push("CLS_"+k.toUpperCase()+"="+(r[k]===true?"true":"false"));}process.stdout.write(out.join("\n"));}catch(e){process.exit(1);}})')" || CLASSIFY_OK=false
fi

if [ "$CLASSIFY_OK" = true ]; then
    eval "$CLASSIFY_EVAL"
else
    echo "verify-change: canonical classifier failed to run or return parseable surface JSON" >&2
    printf '%s\t%s\t%s\t%s\t%s\t\n' "classifier" "node scripts/ci/classify-changes.js --files <changed files>" "1" "fail" "0" >> "$RESULTS"
fi

# ---------------------------------------------------------------------------
# Mapping (additive, mirrors CI semantics). Existing local tooling only.
# ---------------------------------------------------------------------------

ROOT_DEPS=false; [ -d "$ROOT/node_modules" ] && ROOT_DEPS=true
FN_DEPS=false; [ -d "$ROOT/functions/node_modules" ] && FN_DEPS=true
LOCAL_VITEST="$ROOT/node_modules/.bin/vitest"

run_functions_checks() {
    if [ "$FN_DEPS" = true ] && [ -x "$LOCAL_VITEST" ]; then
        run_cmd "functions build" "npm --prefix functions run build"
        run_cmd "functions tests" "cd functions && \"$LOCAL_VITEST\" --run --config vitest.config.ts"
    else
        record_unverified "functions build" "functions deps or local vitest binary missing; deferred to CI"
        record_unverified "functions tests" "functions deps or local vitest binary missing; deferred to CI"
    fi
}

run_rules_checks() {
    if [ "$ROOT_DEPS" = true ] && [ -x "$LOCAL_VITEST" ] && command -v firebase >/dev/null 2>&1 && command -v java >/dev/null 2>&1; then
        run_cmd "rules tests" "npm run test:rules"
    else
        record_unverified "rules tests" "root deps, local vitest, firebase CLI or Java unavailable; deferred to CI"
    fi
}

if [ "$CLASSIFY_OK" = true ]; then
    echo "classification: $CLS_CATEGORY (release=$CLS_RELEASE)"
    echo "surfaces: frontend=$CLS_FRONTEND_CHANGED backend=$CLS_BACKEND_CHANGED functions=$CLS_FUNCTIONS_CHANGED rules=$CLS_RULES_CHANGED query=$CLS_QUERY_CHANGED ci_infra=$CLS_CI_INFRA_CHANGED engineering_code=$CLS_ENGINEERING_CODE_CHANGED engineering_only=$CLS_ENGINEERING_ONLY_CHANGED"

    LINT_NEEDED=false
    TEST_RUN_NEEDED=false
    if [ "$CLS_ENGINEERING_CODE_CHANGED" = true ]; then LINT_NEEDED=true; fi
    if [ "$CLS_FRONTEND_CHANGED" = true ]; then LINT_NEEDED=true; TEST_RUN_NEEDED=true; fi

    if [ "$CLS_CI_INFRA_CHANGED" = true ]; then
        run_cmd "CI infrastructure" "npm run test:ci-infra"
    fi
    if [ "$LINT_NEEDED" = true ]; then
        if [ "$ROOT_DEPS" = true ]; then
            run_cmd "lint" "npm run lint"
        else
            record_unverified "lint" "root node_modules missing; run npm ci (deferred to CI)"
        fi
    fi
    if [ "$TEST_RUN_NEEDED" = true ]; then
        if [ "$ROOT_DEPS" = true ]; then
            run_cmd "unit tests" "npm run test:run"
        else
            record_unverified "unit tests" "root node_modules missing; run npm ci (deferred to CI)"
        fi
    fi
    if [ "$CLS_QUERY_CHANGED" = true ]; then
        if [ "$ROOT_DEPS" = true ]; then
            run_cmd "query coverage gate" "npm run test:coverage:query-gate"
        else
            record_unverified "query coverage gate" "root node_modules missing; run npm ci (deferred to CI)"
        fi
    fi
    if [ "$CLS_FUNCTIONS_CHANGED" = true ]; then run_functions_checks; fi
    if [ "$CLS_RULES_CHANGED" = true ]; then run_rules_checks; fi
fi

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
const [resultsPath, changedPath, base, head, branch, category, release, diffStatus, classifyJson] = process.argv.slice(1);
const lines = fs.readFileSync(resultsPath, "utf8").split("\n").filter(Boolean);
const checks = lines.map((line) => {
    const c = line.split("\t");
    return { name: c[0], command: c[1] || null, exit_code: Number(c[2]), status: c[3], duration_ms: Number(c[4]), reason: c[5] || undefined };
});
const unverified = checks.filter((c) => c.status === "unverified").map((c) => ({ name: c.name, reason: c.reason || "unverified" }));
const changed = fs.readFileSync(changedPath, "utf8").split("\n").filter(Boolean);
let surfaces = null;
if (classifyJson && classifyJson.trim()) {
    try {
        const parsed = JSON.parse(classifyJson);
        const keys = ["frontend_changed","backend_changed","functions_changed","rules_changed","query_changed","smoke_required","ci_infra_changed","engineering_only_changed","engineering_code_changed"];
        surfaces = {};
        for (const key of keys) surfaces[key] = parsed[key] === true;
    } catch { surfaces = null; }
}
const record = { base_sha: base, head_sha: head, branch, classification: category, release: release === "true", surfaces, changed_files: changed, diff_check: { command: "git diff --check " + base, status: diffStatus }, checks, unverified };
process.stdout.write(JSON.stringify(record));
' "$RESULTS" "$CHANGED_FILE" "$BASE_SHA" "$HEAD_SHA" "$BRANCH" "$CLS_CATEGORY" "$CLS_RELEASE" "$DIFF_CHECK_STATUS" "$CLASSIFY_JSON")"

workhorse_write_meta "$ROOT" "$WORKHORSE_VERIFICATION_KEY" "$VERIFICATION_JSON"

echo "verification record:"
printf '%s' "$VERIFICATION_JSON" | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d;}).on("end",()=>{console.log(JSON.stringify(JSON.parse(s),null,2));});'

echo "verify-change: ${FAIL_COUNT} failed, ${UNVERIFIED_COUNT} unverified"
if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
