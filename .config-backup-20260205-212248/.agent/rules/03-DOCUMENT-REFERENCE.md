# ANCHOR OS - DOCUMENT REFERENCE

> Quick lookup for project documents. The MASTER-SEQUENCE tells you WHEN to read these.

---

## 📁 Key Data Sources (Check on EVERY task)

| Source | Purpose | How to Access |
|--------|---------|---------------|
| **Command Center** | Unified project view, alerts, velocity | `curl http://localhost:3001/api/command-center` |
| **Bugs** | All tracked bugs from git history | `curl http://localhost:3001/api/git/bugs` |
| **Roadmap** | Feature plan, priorities (auto-detected) | `curl http://localhost:3001/api/git/roadmap` |
| **Changelog** | Auto-generated release history | `curl http://localhost:3001/api/git/changelog` |
| **Environment Parity** | What's deployed where | `curl http://localhost:3001/api/parity` |

> **Note**: `PROJECT_STATUS.md`, `KNOWN_ISSUES.md`, `ROADMAP.md`, `CHANGELOG.md`, and `DEPLOYMENT_STATUS.md` have been **deleted**. All tracking is now git-automated via the dashboard.

---

## 📁 Reference Documents (Read when relevant)

| Document | When to Read | Location |
|----------|--------------|----------|
| **Architecture** | Complex changes, new features | `docs/ARCHITECTURE_OVERVIEW.md` |
| **Schema** | Database work | `docs/FIRESTORE_SCHEMA.md` |
| **Security** | Auth, permissions, data access | `docs/SECURITY.md` |
| **Testing** | Writing tests | `docs/TESTING_STRATEGY.md` |
| **Family Sharing** | Family mode work | `docs/FAMILY_SHARING_V3_*.md` |
| **Finance Spec** | Finance module work | `docs/ANCHOR_FINANCE_SPEC.md` |

---

## 📁 Style Guides (Read for UI work)

| Document | Location |
|----------|----------|
| Design Philosophy | `docs/DESIGN_PHILOSOPHY.md` |
| Design Tokens | `docs/DESIGN_TOKENS.md` |
| Button Guidelines | `docs/BUTTON_GUIDELINES.md` |
| Icon Guidelines | `docs/ICON_GUIDELINES.md` |
| Typography | `docs/TYPOGRAPHY_GUIDE.md` |

---

## 📁 Operations (Read for deployment/setup)

| Document | Location |
|----------|----------|
| Environment Setup | `docs/ENVIRONMENT_SETUP.md` |
| Deployment Parity | Dashboard `/api/parity` (git-based) |
| Error Handling | `docs/ERROR_HANDLING.md` |
