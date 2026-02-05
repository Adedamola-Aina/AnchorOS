---
description: Query the Internal PM Dashboard for current project state. Use for comprehensive status checks.
---

# Dashboard Query Workflow

**Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ (browser) | http://localhost:3001 (API)

## Full Project State Query

Execute these API calls to get complete project state:

### 1. Command Center (Master View)
```bash
curl http://localhost:3001/api/command-center
```
Returns: Sprint focus, alerts, health metrics, velocity

### 2. Bug Status
```bash
curl http://localhost:3001/api/git/bugs
```
Returns: All bugs from git history (BUG-XXX, REG-XXX)

### 3. Feature Backlog
```bash
curl http://localhost:3001/api/git/features
```
Returns: All features from git history

### 4. Kanban Board
```bash
curl http://localhost:3001/api/git/kanban
```
Returns: Kanban board from git (todo/in-progress/staging/done)

### 5. Environment Parity
```bash
curl http://localhost:3001/api/parity
```
Returns: What's deployed in Dev/Staging/Production (git ancestry)

### 6. Alerts
```bash
curl http://localhost:3001/api/alerts
```
Returns: Proactive warnings and issues

---

## Report Format

```
📊 Dashboard Status Report
Generated: [timestamp]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CURRENT FOCUS
[From command-center]

📋 SPRINT STATUS
- In Progress: [count]
- Completed: [count]
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Quick Queries

### Check if bug exists
```bash
curl http://localhost:3001/api/bugs | grep -i "keyword"
```

### Check if feature exists
```bash
curl http://localhost:3001/api/features | grep -i "keyword"
```

### Search commits for fix
```bash
curl http://localhost:3001/api/git/search/keyword
```

### Get deployment status
```bash
curl http://localhost:3001/api/parity
```
