---
name: Anchor OS Git Tracking
description: Standards for Git commit messages to ensure Dashboard visibility
---

# Anchor OS Git Tracking Skill

This skill defines the **MANDATORY** git commit standards. The Internal Dashboard (https://anchor.tail2fa2e.ts.net:3443/) relies 100% on parsing these commit messages to track progress, parity, and deployments.

Local API: `http://localhost:3001`

## 🎯 The Golden Rule

**"If it's not in the commit message, it didn't happen."**

## 📝 Commit Message Formats

### 1. Features (Updates Parity & Roadmap)
Use `feat` type and include feature ID if available.

```bash
# Best - With ID (Matches Roadmap)
git commit -m "feat(ui): UX-023 - Account Transaction History UI Harmonization"

# Good - Without ID (Auto-detected by Keyword)
git commit -m "feat(mobile): Add swipe gestures to transaction list"
```

### 2. Bug Fixes (Updates Known Issues)
Use `fix` type and include Bug ID.

```bash
# Best - Resolves specific bug
git commit -m "fix(auth): BUG-022 - Prevent modal keyboard event bubbling"

# Good - General fix
git commit -m "fix(api): Handle 502 errors gracefully"
```

### 3. Deployments (Critical for Parity)
The dashboard tracks "Environment Parity" by looking for these EXACT deployment markers.
**You MUST create an empty commit after deploying.**

```bash
# Staging Deployment Marker
git commit --allow-empty -m "deploy(staging): v1.5.0 to anchor-os-staging"

# Production Deployment Marker
git commit --allow-empty -m "deploy(production): v1.5.0 to anchor-os"
```

**Note**: Development environment is tracked automatically (latest commit = dev).

### 4. Documentation
```bash
git commit -m "docs: Update CLAUDE.md for git workflow"
```

## 🔍 Validation Checklist

Before pushing, ask:
1. [ ] Does this commit start with `feat`, `fix`, `docs`, `deploy`, `test`, `refactor`?
2. [ ] If it's a feature, is the Ticket ID (e.g., `UX-123`) included?
3. [ ] If it's a deployment, did I use the `--allow-empty` marker?

## 🚫 Common Mistakes

- ❌ `Updated documentation` (Use `docs: ...`)
- ❌ `Fixed the bug` (Use `fix: ...`)
- ❌ `Deploying to prod` (Use `deploy(production): ...`)
