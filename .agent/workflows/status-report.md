---
description: Generate a quick status report of current work and project state.
---

# Quick Status Report

## Gather Information:

1. Check Project Status (Dashboard):
   `curl -s http://localhost:3001/api/command-center | python3 -m json.tool`
2. Check Bugs (Dashboard):
   `curl -s http://localhost:3001/api/bugs | python3 -m json.tool`
3. Check Environment Parity (Git Status):
   `curl -s http://localhost:3001/api/parity-git | python3 -m json.tool`

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
