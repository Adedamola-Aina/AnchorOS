#!/usr/bin/env bash
# Workhorse v1 shared shell helpers.
#
# Source this file from the scripts/agent/*.sh entry points. It contains only
# small, deterministic helpers that would otherwise be duplicated across
# start-task.sh, verify-change.sh and receipt.sh.
#
# The task's base SHA and verification/receipt records are stored in
# worktree-local Git metadata (git config --worktree), never in tracked files.

# Config key holding the task's base SHA (recorded at task start).
WORKHORSE_BASE_KEY="workhorse.baseSha"
# Config key holding the latest verification record (JSON).
WORKHORSE_VERIFICATION_KEY="workhorse.verification"
# Config key holding the latest completion receipt (JSON).
WORKHORSE_RECEIPT_KEY="workhorse.receipt"

# Absolute path to the git root that owns $1 (defaults to $PWD).
workhorse_git_root() {
    git -C "${1:-$PWD}" rev-parse --show-toplevel 2>/dev/null
}

# Current branch name for the worktree at $1.
workhorse_branch() {
    git -C "$1" rev-parse --abbrev-ref HEAD 2>/dev/null
}

# Read the recorded Workhorse base SHA for the worktree at $1.
# Prints nothing (and returns success) when no base is recorded.
workhorse_read_base_sha() {
    git -C "$1" config --get "$WORKHORSE_BASE_KEY" 2>/dev/null || true
}

# Read an arbitrary worktree-local workhorse.* metadata key for the worktree at $1.
workhorse_read_meta() {
    git -C "$1" config --get "$2" 2>/dev/null || true
}

# Write an arbitrary worktree-local workhorse.* metadata key for the worktree at $1.
# Enables extensions.worktreeConfig so the value lives in the worktree's private
# git dir (git config --worktree), not in the shared repository config.
workhorse_write_meta() {
    git -C "$1" config extensions.worktreeConfig true
    git -C "$1" config --worktree "$2" "$3"
}

# Changed files for the worktree at $1 relative to base $2.
# Includes committed, staged, unstaged and untracked (non-ignored) files.
workhorse_changed_files() {
    {
        git -C "$1" diff --name-only "$2"
        git -C "$1" ls-files --others --exclude-standard
    } | sed '/^[[:space:]]*$/d' | sort -u
}

# True (0) when the git root at $1 is a linked worktree (i.e. not the primary
# working tree). Harness-created task worktrees are always linked worktrees.
workhorse_is_linked_worktree() {
    local root="$1"
    local git_dir common_dir
    git_dir="$(cd "$root" && git rev-parse --git-dir 2>/dev/null)" || return 1
    common_dir="$(cd "$root" && git rev-parse --git-common-dir 2>/dev/null)" || return 1
    [ "$git_dir" != "$common_dir" ]
}
