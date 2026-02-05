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

| Environment | Version | Status |
|-------------|---------|--------|
| **Production** | v1.5.12 | Stable |
| **Staging** | v1.5.12 | Reverted (pre-DES-002/WEB-003) |
| **Development** | v1.5.12 | Reverted (pre-DES-002/WEB-003) |

**Last Updated**: 2026-02-05

**Dashboard**: https://anchor.tail2fa2e.ts.net:3443/ (live environment parity)

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

1. **Development**: Work on `master` branch
2. **Staging**: Deploy via `./DEPLOY_PIPELINE.sh --env=staging`
3. **Version Bump**: Update `package.json` version
4. **Deploy Marker**: Commit with `deploy(env): vX.X.X` format
5. **Production**: Deploy via `./DEPLOY_PIPELINE.sh --env=production`

---

**Related Docs**:
- [CHANGELOG.md](file:///root/anchor-os/CHANGELOG.md) - Version history
- [DEPLOYMENT_STATUS.md](file:///root/anchor-os/docs/DEPLOYMENT_STATUS.md) - Environment versions
- [ROADMAP.md](file:///root/anchor-os/docs/ROADMAP.md) - Planned versions
