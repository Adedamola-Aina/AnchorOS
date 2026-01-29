---
description: Force a full context check. Use when you want to verify current project state.
---

# Full Context Check

## Execute These Steps:

### 1. Read PROJECT_STATUS.md
```
Open: docs/PROJECT_STATUS.md

Report:
- Current Sprint Focus: [what you find]
- In Progress Tasks: [list]
- Blockers: [any found]
- Last Updated: [date]
```

### 2. Read KNOWN_ISSUES.md
```
Open: docs/KNOWN_ISSUES.md

Report:
- P0 Bugs: [count and list]
- P1 Bugs: [count]
- Recently Fixed: [list last 3]
```

### 3. Read ROADMAP.md
```
Open: docs/ROADMAP.md

Report:
- Current Priority: [what's next]
- Blocked Items: [any]
- Dependencies: [any to be aware of]
```

### 4. Read DEPLOYMENT_STATUS.md
```
Open: docs/DEPLOYMENT_STATUS.md

Report:
- Staging Version: [version]
- Production Version: [version]
- Last Deploy: [date]
```

---

## Summary Format

```
📋 Full Context Check Complete

**Sprint**: [current focus]
**Tasks In Progress**: [count]
**Blockers**: [none/list]

**Bugs**:
- P0 (Critical): [count]
- P1 (High): [count]

**Deployment**:
- Staging: v[X.X.X]
- Production: v[X.X.X]

**Next Priority**: [from roadmap]

Ready for new work: [Yes/No + reason]
```
