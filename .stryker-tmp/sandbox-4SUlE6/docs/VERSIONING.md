# ANCHOR OS VERSIONING POLICY

**Last Updated**: 2026-01-26  
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
| **Production** | v1.4.0 | Stable |
| **Staging** | v1.4.0 | Testing |
| **Development** | v1.5.0-dev | Active |

---

## 🚫 What Does NOT Get Its Own Version

**All features are part of the unified app version.**

❌ **WRONG**: "Family Mode v2.0", "Fabric AI v1.5", "Finance Module v3"
✅ **CORRECT**: "Anchor OS v1.5.0" (contains Family Mode, Fabric AI, Finance, etc.)

Features do not have independent version numbers. They ship together as part of the cohesive product.

---

## 📝 Version Changelog

All version changes are documented in [CHANGELOG.md](file:///root/anchor-os/CHANGELOG.md).

Each version entry includes:
- **Added**: New features
- **Changed**: Enhancements to existing features  
- **Fixed**: Bug fixes
- **Removed**: Deprecated features
- **Security**: Security-related changes

---

## 🔄 Release Process

1. **Development**: Work on `development` branch (v1.x.x-dev)
2. **Staging**: Deploy to staging for testing
3. **Version Bump**: Update `package.json` version
4. **Changelog**: Add release notes to CHANGELOG.md
5. **Production**: Deploy to production
6. **Tag**: Git tag with version (e.g., `v1.5.0`)

---

**Related Docs**:
- [CHANGELOG.md](file:///root/anchor-os/CHANGELOG.md) - Version history
- [DEPLOYMENT_STATUS.md](file:///root/anchor-os/docs/DEPLOYMENT_STATUS.md) - Environment versions
- [ROADMAP.md](file:///root/anchor-os/docs/ROADMAP.md) - Planned versions
