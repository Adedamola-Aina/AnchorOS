---
description: Master workflow for ALL work - MUST follow automatically on every task
---

# Master Project Workflow

// turbo-all

This workflow is **MANDATORY** for all work. Follow automatically without being asked.

---

## When Starting ANY Task

### 1. Check Existing Tracking
```bash
# Check if this task is already tracked
grep -r "TASK_ID" docs/ROADMAP.md docs/FEATURE_SUGGESTIONS.md docs/KNOWN_ISSUES.md 2>/dev/null
```

### 2. Update ROADMAP.md Status
If the task is in ROADMAP.md and not already "In Progress":
- Move from "Planned" to "In Progress"
- Add `[/]` marker
- Update Last Updated date

### 3. Create Implementation Plan
For non-trivial tasks, create/update implementation plan artifact.

---

## When Completing ANY Task

### 1. Run the Completion Script
```bash
./scripts/complete-task.sh "TASK-ID" "Brief summary of what was done"
```

This automatically:
- Moves task to ✅ Completed in ROADMAP.md
- Updates FEATURE_SUGGESTIONS.md if applicable
- Updates Last Updated timestamp

### 2. Update KNOWN_ISSUES.md (if bug fix)
If fixing a bug, follow `/bug-tracking` workflow to update:
- Move to "Recently Fixed" section
- Add resolution details

### 3. Update CHANGELOG.md
Add entry under `[Unreleased]` section:
```markdown
### Fixed/Added/Changed
- **[TASK-ID] Brief description**: What was done
```

### 4. Verify Dashboard Reflects Changes
Check http://localhost:3001 that:
- Overview tab shows correct status
- Feature Backlog shows completion
- No stale "In Progress" items remain

---

## When Reporting to User

### 1. Summarize Concisely
- What was done
- What was updated (files, docs)
- Dashboard status

### 2. Include Proof
- Screenshots of dashboard (if UI work)
- Test results (if code work)

---

## Key Documents to Keep in Sync

| Document | Purpose | Update When |
|----------|---------|-------------|
| `ROADMAP.md` | Sprint tracking | Start/complete tasks |
| `FEATURE_SUGGESTIONS.md` | Feature backlog | Complete features |
| `KNOWN_ISSUES.md` | Bug tracking | Fix bugs |
| `CHANGELOG.md` | Release notes | Any change |

---

## Pre-Commit Checks

Before any git commit:
1. All docs updated
2. Dashboard reflects changes
3. No orphaned "In Progress" items

---

**NEVER leave a task completed without updating ALL relevant tracking documents.**
