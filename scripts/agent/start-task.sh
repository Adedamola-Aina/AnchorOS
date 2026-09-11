#!/usr/bin/env bash
#
# Workhorse v1 task-start entry point.
#
# Creates one deterministic, isolated task worktree from the exact current
# origin/master SHA and records the base SHA in worktree-local Git metadata.
#
# Usage:
#   scripts/agent/start-task.sh <branch-name> [worktree-name]
#
# Environment:
#   WORKHORSE_WORKTREE_ROOT  Override the worktree root directory
#                            (default: sibling anchor-worktrees/ of the repo).
#
# This script only creates the worktree. It does not install dependencies,
# start Cline, commit, push, or mutate GitHub.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib.sh"

usage() {
    cat >&2 <<'EOF'
Usage: scripts/agent/start-task.sh <branch-name> [worktree-name]

  branch-name    New branch to create from origin/master (not "master").
  worktree-name  Optional worktree directory name.
                 Default: the final path segment of branch-name.
EOF
}

die() { echo "start-task: $*" >&2; exit 1; }

BRANCH="${1:-}"
WORKTREE_NAME="${2:-}"

if [ -z "$BRANCH" ]; then
    usage
    exit 2
fi

if [ "$BRANCH" = "master" ]; then
    die "refusing to create a task on the master branch"
fi

# Locate the AnchorOS git root (this script lives inside the repository).
ROOT="$(workhorse_git_root "$SCRIPT_DIR")" || true
if [ -z "$ROOT" ]; then
    die "could not locate the AnchorOS git root from $SCRIPT_DIR"
fi

# Always resolve the task base from the live origin/master.
echo "start-task: fetching origin master ..." >&2
git -C "$ROOT" fetch --quiet origin master

BASE_SHA="$(git -C "$ROOT" rev-parse --verify 'origin/master^{commit}')"
[ -n "$BASE_SHA" ] || die "could not resolve origin/master"

# Refuse to silently reuse an existing branch.
if git -C "$ROOT" show-ref --verify --quiet "refs/heads/$BRANCH"; then
    die "branch '$BRANCH' already exists; choose a new task branch"
fi

WT_NAME="${WORKTREE_NAME:-${BRANCH##*/}}"
[ -n "$WT_NAME" ] || die "could not derive a worktree name from '$BRANCH'"

WT_ROOT="${WORKHORSE_WORKTREE_ROOT:-$(dirname "$ROOT")/anchor-worktrees}"
WT_PATH="$WT_ROOT/$WT_NAME"

# Refuse to silently reuse an existing worktree directory.
if [ -e "$WT_PATH" ]; then
    die "worktree path '$WT_PATH' already exists; choose a different worktree-name"
fi
if git -C "$ROOT" worktree list --porcelain | grep -Fxq "worktree $WT_PATH"; then
    die "a worktree is already registered at '$WT_PATH'"
fi

mkdir -p "$WT_ROOT"

# Create the task worktree from the resolved origin/master SHA. This never
# checks out, stashes, cleans or resets the main working tree.
git -C "$ROOT" worktree add -b "$BRANCH" "$WT_PATH" "$BASE_SHA" >&2

# Record task metadata in worktree-local Git metadata (not a tracked file).
workhorse_write_meta "$WT_PATH" "$WORKHORSE_BASE_KEY" "$BASE_SHA"
workhorse_write_meta "$WT_PATH" "workhorse.branch" "$BRANCH"
workhorse_write_meta "$WT_PATH" "workhorse.createdAt" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"

cat <<EOF
worktree: $WT_PATH
branch:   $BRANCH
base_sha: $BASE_SHA
EOF
