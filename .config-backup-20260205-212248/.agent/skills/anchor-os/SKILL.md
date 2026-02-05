---
name: anchor-os-context
description: Deep context about Anchor OS project. Load when working on architecture, complex features, or needing project background.
---

# Anchor OS Project Skill

## Project Overview

**Anchor OS** is a self-hosted personal finance and productivity management system.

### Tech Stack
- **Frontend**: TypeScript, React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Functions, Hosting)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Infrastructure**: LXC 107 on Proxmox, Tailscale-only access

### Key Features
- Multi-user authentication
- Custom commitment/habit tracking
- Multi-currency transaction support
- Family sharing with privacy controls
- Analytics with GitHub-style heatmaps

---

## Architecture Principles

### 1. Mobile-First
- 75% of users are on mobile
- Design for touch, test on mobile first
- Minimum touch targets: 44px

### 2. Security-First (Zero Trust)
- All database operations through `secureDb.ts`
- Firestore security rules enforced
- No hardcoded credentials
- Tailscale-only access

### 3. Test-First (TDD)
- No implementation without failing test
- 80% coverage target
- E2E for critical user flows

---

## Key Files Reference

### Configuration
- `firebase.json` - Firebase config
- `firestore.rules` - Security rules
- `firestore.indexes.json` - Database indexes

### Documentation
- `docs/ARCHITECTURE_OVERVIEW.md` - System design
- `docs/FIRESTORE_SCHEMA.md` - Database schema
- `docs/TESTING_STRATEGY.md` - Testing approach
- `docs/SECURITY.md` - Security model

### Tracking (Git-Automated)
- **Dashboard**: `curl http://localhost:3001/api/command-center`
- **Bugs**: `curl http://localhost:3001/api/git/bugs` (from git history)
- **Roadmap**: `curl http://localhost:3001/api/git/roadmap` (from `roadmap.json` + git)
- **Parity**: `curl http://localhost:3001/api/parity` (git ancestry-based)

### Core Code
- `src/services/` - Business logic services
- `src/hooks/` - React hooks
- `src/features/` - Feature modules
- `src/utils/secureDb.ts` - Secure database wrapper

---

## Family Sharing System

### Current Status
Family Mode is the **highest priority feature** in active development.

### Architecture
- Invitations via Cloud Functions
- Out-of-band verification codes
- Permission-aware Firestore queries
- `sharedWith` array on accounts

### Key Files
- `docs/FAMILY_SHARING_V3_IMPLEMENTATION.md`
- `src/hooks/useFamilySharing.ts`
- `src/hooks/useSharedAccounts.ts`
- `functions/src/index.ts` (Cloud Functions)

---

## Deployment Environments

| Environment | URL | Firebase Project |
|-------------|-----|------------------|
| Development | localhost:5173 | anchor-staging |
| Staging | staging.anchor-os.app | anchor-staging |
| Production | anchor-os.app | anchor-production |

### Access
- All environments: Tailscale-only
- LXC 107 IP: 192.168.0.57
- Tailscale IP: 100.112.129.21

---

## Common Patterns

### Adding a New Feature

1. Create feature folder: `src/features/{feature}/`
2. Write E2E test first: `e2e/{feature}.spec.ts`
3. Implement components with unit tests
4. Update docs when complete

### Firestore Security Pattern

```typescript
// Always use secureDb wrapper
import { secureDb } from '@/utils/secureDb';

// Never raw Firestore access
const account = await secureDb.getAccount(userId, accountId);
```

### Error Handling Pattern

```typescript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error('[operation] Error:', error);
  return { success: false, error: getErrorMessage(error) };
}
```

---

## Resources

For detailed information, read:
- `docs/ARCHITECTURE_OVERVIEW.md` - Full system design
- `docs/TESTING_STRATEGY.md` - Testing approach
- `docs/SECURITY.md` - Security model
- `CLAUDE.md` - Development constitution (for reference)
