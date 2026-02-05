---
description: Generate a quick status report of current work and project state.
---

# Quick Status Report

**Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ (browser) | http://localhost:3001 (API)

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
[From /api/command-center work section]

📝 TASKS
- In Progress: [count]
- Completed This Sprint: [count]
- Blocked: [count]

🐛 BUGS
- P0 (Critical): [count] [list if any]
- P1 (High): [count]
- P2 (Medium): [count]

✨ FEATURE BACKLOG
- High Priority: [count]
- Medium Priority: [count]
- Low Priority: [count]

🚀 ENVIRONMENT PARITY
| Feature      | Dev | Staging | Prod |
|--------------|-----|---------|------|
| [feature 1]  | ✅  | ✅      | ❌   |
| [feature 2]  | ✅  | ❌      | ❌   |

⚠️ ALERTS
[List any critical or warning alerts]

📈 VELOCITY
- This Week: [X] items completed
- Average: [Y] items/week
- Trend: [Up/Down/Stable]

📋 NEXT UP
[Top priority from /api/command-center upcoming items]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
