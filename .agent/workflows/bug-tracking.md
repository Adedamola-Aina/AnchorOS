---
description: Bug tracking workflow - automatically followed when user reports bugs
---

# Bug Tracking Workflow

## When User Reports a Bug

**MANDATORY STEPS** - Do ALL of these automatically without being asked:

### 1. Add to KNOWN_ISSUES.md FIRST
Before fixing anything, add an entry:

```markdown
### [BUG-XXX] Short description (REPORTED 2026-XX-XX)
- **Reported**: [date]
- **Reporter**: User / Agent / Automated Test
- **Impact**: [what's broken]
- **Root Cause**: TBD (fill after investigation)
- **Fix**: TBD (fill after fixing)
- **Assigned**: [name]
- **Status**: Investigating / In Progress / Fixed
```

### 2. Get Next Bug ID
// turbo
```bash
grep -oP 'BUG-\d+' /root/anchor-os/docs/KNOWN_ISSUES.md | sort -t- -k2 -n | tail -1
```
Increment the number for the new bug.

### 3. Fix the Bug
Do the actual code fix.

### 4. Update KNOWN_ISSUES.md
Move to "Recently Fixed" section with:
- Root Cause filled in
- Fix description
- File(s) changed
- Verified By: Agent
- Deployment status

### 5. Add to CHANGELOG.md
Under `[Unreleased]` → `### Fixed`:
```markdown
- **[BUG-XXX] Short description**: What was fixed
```

### 6. Update Statistics
In KNOWN_ISSUES.md, update:
- "Fixed This Month" count
- Move from appropriate priority section if it was there

## Dashboard Auto-Refresh
Dashboard reads from KNOWN_ISSUES.md automatically - no need to restart.

## Example Flow

User: "The edit button is hidden on mobile"

Agent:
1. ✅ Add [BUG-006] to KNOWN_ISSUES.md under appropriate priority
2. ✅ Investigate and fix
3. ✅ Move [BUG-006] to Recently Fixed
4. ✅ Add to CHANGELOG under [Unreleased]
5. ✅ Confirm dashboard shows it

**NEVER skip adding to KNOWN_ISSUES.md first!**
