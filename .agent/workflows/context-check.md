---
description: Force a full context check. Use when you want to verify current project state.
---

# Full Context Check

## Execute These Steps:

### 1. Check Project Focus (Dashboard)
```bash
curl -s http://localhost:3001/api/command-center | python3 -m json.tool
# Look for 'currentFocus' and 'tasks'
```

### 2. Check Active Bugs
```bash
curl -s http://localhost:3001/api/bugs | python3 -m json.tool
# Look for P0/P1 items
```

### 3. Check Roadmap Status
```bash
curl -s http://localhost:3001/api/roadmap | python3 -m json.tool
# Look for 'in-progress' items
```

### 4. Check Deployment Status
```bash
curl -s http://localhost:3001/api/parity-git | python3 -m json.tool
# Check versions for production/staging/development
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
