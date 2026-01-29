---
description: Query the Internal PM Dashboard for current project state. Use for comprehensive status checks.
---

# Dashboard Query Workflow

## Full Project State Query

Execute these API calls to get complete project state:

### 1. Command Center (Master View)
```bash
curl http://localhost:3001/api/command-center
```
Returns: Sprint focus, alerts, health metrics, velocity

### 2. Bug Status
```bash
curl http://localhost:3001/api/bugs
```
Returns: All bugs by priority (P0, P1, P2)

### 3. Feature Backlog
```bash
curl http://localhost:3001/api/features
```
Returns: Feature requests and suggestions

### 4. Kanban Board
```bash
curl http://localhost:3001/api/kanban-enhanced
```
Returns: Combined bugs + features board

### 5. Environment Parity
```bash
curl http://localhost:3001/api/parity
```
Returns: What's deployed in Dev/Staging/Production

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
