---
description: Generate a quick status report of current work and project state.
---

# Quick Status Report

## Gather Information:

1. Check `docs/PROJECT_STATUS.md` for current tasks
2. Check `docs/KNOWN_ISSUES.md` for bug counts
3. Check `docs/DEPLOYMENT_STATUS.md` for versions

---

## Report Format

```
📊 Anchor OS Status Report
Generated: [current date/time]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CURRENT SPRINT
[Sprint name/focus from PROJECT_STATUS.md]

📝 TASKS
- In Progress: [count]
- Completed This Sprint: [count]
- Blocked: [count]

🐛 BUGS
- P0 (Critical): [count] 
- P1 (High): [count]
- P2 (Medium): [count]

🚀 DEPLOYMENT
- Production: v[X.X.X] ([date])
- Staging: v[X.X.X] ([date])

⚠️ BLOCKERS
[List any blockers or "None"]

📋 NEXT UP
[Top priority from ROADMAP.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
