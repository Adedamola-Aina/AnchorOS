# Skill: Risk Classification
# Assign before any work begins. Determines which roles activate.

---

## The Three Classes

### Class A — High Risk
**Definition**: Any change that touches data models, authentication, shared financial data,
production infrastructure, or the Fabric AI behavioral engine core.

**Required gates**: All 12 roles must review. Full 7-phase standard (ENGINEERING_EXECUTION_STANDARD.md).

**Examples**:
- New Firestore collection or document structure change
- Changes to `config/firestore.rules`
- Changes to `src/utils/secureDb.ts`
- Family Mode sharing logic (V3 architecture)
- Firebase Auth or MFA flow changes
- `src/services/fabric/BehavioralEngine.ts` or `FabricService.ts`
- `functions/src/familySharing.ts` or `familyTriggers.ts`
- Net worth calculation logic (double-counting risk)
- Production infrastructure (Proxmox, Tailscale, Firebase projects)
- Any change affecting `ownerId` / `sharedWith` semantics on accounts

### Class B — Medium Risk
**Definition**: New features, Cloud Functions, UI that touches financial data, new hooks or services.

**Required gates**: Roles 01–09, plus Role 10 if UI is involved.

**Examples**:
- New transaction category or account type
- New Cloud Function (reminders, scheduled jobs)
- New Fabric AI card (briefing, mood, insights)
- New onboarding step
- Dashboard new widget
- New E2E test suite
- Capacitor plugin addition
- New React Query hook for financial data

### Class C — Low Risk
**Definition**: Visual polish, copy changes, config updates, doc additions, test additions
for already-implemented behavior.

**Required gates**: Roles 01 (confirm worth doing), 03 (if UI), 05 (test quality), 07 (quick check).

**Examples**:
- Button text or color change
- Error message wording update
- New unit test for existing function
- README or docs update
- ESLint config change
- Tailwind class adjustment
- Icon swap

---

## Classification Decision Tree

```
Does it change how data is stored or accessed in Firestore?
  YES → Class A

Does it change authentication, permissions, or security rules?
  YES → Class A

Does it touch the Fabric AI engine (BehavioralEngine, patterns, predictions)?
  YES → Class A

Does it change how shared accounts or family access works?
  YES → Class A
  
Is it a new Cloud Function or scheduled job?
  YES → Class B

Is it a new feature with its own UI, state, and data path?
  YES → Class B

Does it touch financial calculation logic (balances, net worth, transfers)?
  YES → Class B minimum (A if schema involved)

Is it purely cosmetic, copy, config, or test additions?
  YES → Class C

When in doubt → promote to the next higher class.
```

---

## Recording the Classification

Every task plan doc must open with:

```markdown
**Risk Class**: A / B / C
**Rationale**: [one sentence explaining why]
```

And every PR description must include it per `docs/SHIP_GATES.md` Gate 2.
