#!/usr/bin/env bash
#
# Workhorse v1 completion receipt.
#
# Emits a concise JSON receipt for the current task worktree and stores the
# latest receipt in worktree-local Git metadata. Receipts are never committed.
#
# PASS requires: non-master branch, recorded base, clean worktree, no forbidden
# paths changed, local verification succeeded (or is explicitly deferred to CI),
# a branch upstream, and upstream HEAD == local HEAD.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib.sh"

die() { echo "receipt: $*" >&2; exit 2; }

ROOT="$(workhorse_git_root "$PWD")"
[ -n "$ROOT" ] || die "not inside a git repository"

BRANCH="$(workhorse_branch "$ROOT")"
HEAD_SHA="$(git -C "$ROOT" rev-parse HEAD)"
BASE_SHA="$(workhorse_read_base_sha "$ROOT")"

BASE_ANCESTOR=0
if [ -n "$BASE_SHA" ] && git -C "$ROOT" merge-base --is-ancestor "$BASE_SHA" HEAD 2>/dev/null; then
    BASE_ANCESTOR=1
fi

UPSTREAM_REF="$(git -C "$ROOT" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
UPSTREAM_SHA=""
HAS_UPSTREAM=0
HEAD_EQUALS_UPSTREAM=0
if [ -n "$UPSTREAM_REF" ]; then
    HAS_UPSTREAM=1
    UPSTREAM_SHA="$(git -C "$ROOT" rev-parse "$UPSTREAM_REF" 2>/dev/null || true)"
    if [ -n "$UPSTREAM_SHA" ] && [ "$UPSTREAM_SHA" = "$HEAD_SHA" ]; then
        HEAD_EQUALS_UPSTREAM=1
    fi
fi

if [ -z "$(git -C "$ROOT" status --porcelain 2>/dev/null)" ]; then
    CLEAN=1
else
    CLEAN=0
fi

# Changed files against the recorded base (committed + working tree + untracked).
CHANGED_FILE="$(mktemp)"
FORBIDDEN_FILE="$(mktemp)"
VERIFICATION_FILE="$(mktemp)"
RECEIPT_COMPACT_FILE="$(mktemp)"
trap 'rm -f "$CHANGED_FILE" "$FORBIDDEN_FILE" "$VERIFICATION_FILE" "$RECEIPT_COMPACT_FILE"' EXIT

if [ -n "$BASE_SHA" ]; then
    workhorse_changed_files "$ROOT" "$BASE_SHA" > "$CHANGED_FILE"
else
    : > "$CHANGED_FILE"
fi

# Forbidden paths: .env, .env.*, e2e/.auth/**
: > "$FORBIDDEN_FILE"
while IFS= read -r f; do
    [ -n "$f" ] || continue
    base="${f##*/}"
    case "$base" in
        .env|.env.*) printf '%s\n' "$f" >> "$FORBIDDEN_FILE"; continue ;;
    esac
    case "$f" in
        e2e/.auth|e2e/.auth/*) printf '%s\n' "$f" >> "$FORBIDDEN_FILE" ;;
    esac
done < "$CHANGED_FILE"

VERIFICATION_JSON="$(workhorse_read_meta "$ROOT" "$WORKHORSE_VERIFICATION_KEY")"
printf '%s' "$VERIFICATION_JSON" > "$VERIFICATION_FILE"

node --input-type=module -e '
import fs from "node:fs";
const [compactOut, changedPath, forbiddenPath, verificationPath, base, head, branch, upstreamRef, upstreamSha, hasUpstream, headEqualsUpstream, clean, baseAncestor] = process.argv.slice(1);
const changed = fs.readFileSync(changedPath, "utf8").split("\n").filter(Boolean);
const violations = fs.readFileSync(forbiddenPath, "utf8").split("\n").filter(Boolean);
const rawVerification = fs.readFileSync(verificationPath, "utf8");
let verification = null;
try { if (rawVerification.trim()) verification = JSON.parse(rawVerification); } catch { verification = null; }
const checks = verification && Array.isArray(verification.checks) ? verification.checks : [];
const unverified = verification && Array.isArray(verification.unverified) ? verification.unverified : [];
const failedChecks = checks.filter((c) => c.status === "fail");
const unverifiedWithoutReason = unverified.filter((u) => !u.reason || !String(u.reason).trim());
const setEqual = (a, b) => {
    const sa = [...new Set(a)].sort();
    const sb = [...new Set(b)].sort();
    return sa.length === sb.length && sa.every((value, index) => value === sb[index]);
};
const conditions = {
    non_master_branch: branch !== "master",
    base_recorded: Boolean(base),
    clean_worktree: clean === "1",
    no_forbidden_paths: violations.length === 0,
    verification_available: verification !== null,
    verification_ok: verification !== null && failedChecks.length === 0 && unverifiedWithoutReason.length === 0,
    verification_base_matches: verification !== null && verification.base_sha === base,
    verification_head_matches: verification !== null && verification.head_sha === head,
    base_is_ancestor: baseAncestor === "1",
    changed_files_match: verification !== null && Array.isArray(verification.changed_files) && setEqual(verification.changed_files, changed),
    has_upstream: hasUpstream === "1",
    head_equals_upstream: headEqualsUpstream === "1"
};
const failedReasons = Object.entries(conditions).filter(([, v]) => !v).map(([k]) => k);
const receipt = {
    base_sha: base || null,
    head_sha: head,
    branch,
    upstream_sha: upstreamSha || null,
    upstream_ref: upstreamRef || null,
    changed_files: changed,
    worktree_status: clean === "1" ? "clean" : "dirty",
    verification: checks,
    unverified,
    verification_base_sha: verification ? verification.base_sha ?? null : null,
    verification_head_sha: verification ? verification.head_sha ?? null : null,
    failed_verification: failedChecks.map((c) => ({ name: c.name, command: c.command, exit_code: c.exit_code })),
    forbidden_path_violations: violations,
    head_equals_upstream: headEqualsUpstream === "1",
    conditions,
    status: failedReasons.length === 0 ? "PASS" : "FAIL",
    failed_conditions: failedReasons
};
fs.writeFileSync(compactOut, JSON.stringify(receipt));
console.log(JSON.stringify(receipt, null, 2));
' "$RECEIPT_COMPACT_FILE" "$CHANGED_FILE" "$FORBIDDEN_FILE" "$VERIFICATION_FILE" \
    "$BASE_SHA" "$HEAD_SHA" "$BRANCH" "$UPSTREAM_REF" "$UPSTREAM_SHA" \
    "$HAS_UPSTREAM" "$HEAD_EQUALS_UPSTREAM" "$CLEAN" "$BASE_ANCESTOR"

RECEIPT_JSON="$(cat "$RECEIPT_COMPACT_FILE")"
workhorse_write_meta "$ROOT" "$WORKHORSE_RECEIPT_KEY" "$RECEIPT_JSON"