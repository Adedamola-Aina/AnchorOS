---
description: Task completion workflow - triggered by /master when finishing work
---

# Task Completion Workflow

// turbo-all

When completing ANY task, run this command:

```bash
./scripts/complete-task.sh "TASK-ID" "Brief summary"
```

## What the Script Does

1. **Updates ROADMAP.md**
   - Adds to ✅ Completed section
   - Updates Last Updated date

2. **Updates FEATURE_SUGGESTIONS.md** (if applicable)
   - Adds to COMPLETED FEATURES table

## Example

```bash
./scripts/complete-task.sh "ARCH-001" "22 files refactored, pre-commit hook enforces rule"
```

## Manual Steps After Script

1. Update CHANGELOG.md if needed
2. Verify dashboard at http://localhost:3001
3. Commit changes
