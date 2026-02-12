# ANCHOR OS VERSIONING POLICY

**Last Updated**: 2026-02-05  
**Maintained By**: Teeto

---

## 📦 Version Format

Anchor OS follows [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes, hotfixes, security patches
  │     └──────── New features, enhancements
  └────────────── Breaking changes, major platform shifts
```

---

## 🔢 When to Bump Versions

| Component | When to Bump | Example |
|-----------|--------------|---------|
| **MAJOR** | Breaking changes, data model changes, major redesigns | v1.x → v2.0 |
| **MINOR** | New features, enhancements, sprint completions | v1.4 → v1.5 |
| **PATCH** | Bug fixes, security patches, hotfixes | v1.4.0 → v1.4.1 |

---

## 🧭 Decision Framework

```
Is it a BREAKING CHANGE?
(API changes, data model changes, major UX shift)
  │
  ├─ YES → Bump MAJOR (v1.x → v2.0)
  │
  └─ NO ↓

Is it a NEW FEATURE or ENHANCEMENT?
  │
  ├─ YES → Bump MINOR (v1.4 → v1.5)
  │
  └─ NO ↓

Is it a BUG FIX or HOTFIX?
  │
  └─ YES → Bump PATCH (v1.4.0 → v1.4.1)
```

---

## 📋 Version Release Events

| Event | Version Action | Example |
|-------|----------------|---------|
| Sprint completion with new features | Bump MINOR | v1.4.0 → v1.5.0 |
| Critical bug hotfix to production | Bump PATCH | v1.4.0 → v1.4.1 |
| Complete redesign / breaking changes | Bump MAJOR | v1.5.0 → v2.0.0 |
| Internal tools (dashboard, scripts) | No version bump | Internal only |
| Documentation updates only | No version bump | Docs only |

---

## 🎯 Current Version Status

| Environment | Version | Deployed Commit | Status |
|-------------|---------|-----------------|--------|
| **Production** | v1.6.0 | bfbafe1 | Stable |
| **Staging** | v1.7.0 | 5db16df | Cloud Functions v2 + CSP headers |
| **Development** | v1.7.0 | 5db16df | Cloud Functions v2 + CSP headers |

**Last Updated**: 2025-07-18

**Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ (live environment parity)

---

## 🏷️ Deploy Marker Format

Deploy markers are git commits that tell the dashboard what's deployed where.

**Standard Format:**
```
deploy(environment): vX.X.X
```

**With Deployed Commit Hash (recommended for reverts/manual deploys):**
```
deploy(environment): vX.X.X @ COMMIT_HASH
```

**Examples:**
```bash
# Normal deploy
git commit --allow-empty -m "deploy(production): v1.5.12"

# Revert or deploy from different commit
git commit --allow-empty -m "deploy(staging): v1.5.11-revert @ 82e3d43"
```

**Version Suffixes (supported):**
- `-revert` - Rolled back to previous code
- `-hotfix` - Emergency fix
- `-dev` - Development build

The dashboard extracts the `@ HASH` to show the ACTUAL deployed code, not just the marker commit.

---

## 🚫 What Does NOT Get Its Own Version

**All features are part of the unified app version.**

❌ **WRONG**: "Family Mode v2.0", "Fabric AI v1.5", "Finance Module v3"
✅ **CORRECT**: "Anchor OS v1.5.0" (contains Family Mode, Fabric AI, Finance, etc.)

Features do not have independent version numbers. They ship together as part of the cohesive product.

---

## 📝 Version Changelog

~~CHANGELOG.md~~ **Deleted** - Git commits are the source of truth.

View changelog via:
- **Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ → Git Timeline tab
- **API**: `curl http://localhost:3001/api/git/changelog`

Each version entry includes:
- **Added**: New features (`feat:` commits)
- **Changed**: Enhancements (`refactor:`, `perf:` commits)
- **Fixed**: Bug fixes (`fix:` commits)
- **Security**: Security-related changes (`SEC-` commits)

---

## 🔄 Release Process

**Automated (CI/CD)**:
1. Commit with conventional commit format (enforced by commitlint)
2. Push to `master` branch
3. CI runs tests → auto-bumps version based on commit type:
   - `feat:` → MINOR bump (v1.4.0 → v1.5.0)
   - `fix:`, `perf:`, `refactor:` → PATCH bump (v1.4.0 → v1.4.1)
   - `BREAKING CHANGE` or `!` → MAJOR bump (v1.x → v2.0.0)
4. CI creates git tag, updates CHANGELOG.md, deploys to staging
5. Production deploy requires manual approval in GitHub

**Manual Deploy** (if needed):
1. `./scripts/DEPLOY_PIPELINE.sh --env=staging` or `--env=production`
2. Create deploy marker: `git commit --allow-empty -m "deploy(env): vX.X.X"`

**Conventional Commit Types**:
| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `perf` | Performance improvement | PATCH |
| `refactor` | Code restructuring | PATCH |
| `docs` | Documentation only | none |
| `style` | Formatting changes | none |
| `test` | Test changes | none |
| `chore` | Maintenance | none |
| `ci` | CI/CD changes | none |
| `build` | Build system | none |
| `deploy` | Deploy markers | none |

---

**Related Docs**:
- **Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ - Live version status
- [DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) - Deploy procedures
- **Git commit history** - Source of truth for changelog and roadmap
