# Anchor OS

**Household finance management and commitment tracking platform.**

---

## Overview

Anchor OS is a multi-tenant web application for managing shared household finances, tracking financial commitments, and coordinating family accounts. It provides real-time account aggregation, transaction categorization, net-worth tracking, and goal-based commitment management with role-based access controls.

### Core Modules

| Module | Description |
|--------|-------------|
| **Finance** | Account management, transactions, transfers, net-worth dashboard, CSV export |
| **Commitments** | Goal tracking with progress rings, accountability metrics, status workflows |
| **Family** | Multi-member households, permission controls (read-only / read-write), invitation flows |
| **Onboarding** | Guided setup — MFA enrollment, profile creation, account linking |
| **Dashboard** | Aggregated financial overview, recent activity, quick actions |
| **Settings** | User preferences, security (TOTP MFA), notification controls, profile management |
| **Notifications** | Per-category controls, quiet hours, push notifications via FCM |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript (strict), Vite |
| Styling | Tailwind CSS 4, semantic design tokens |
| Platform | Installable PWA (service worker, install prompt, app badge) |
| Backend | Firebase Auth, Firestore, Cloud Functions v2, Hosting |
| Testing | Vitest (unit/integration), Playwright (E2E), Stryker (mutation) |
| CI/CD | GitHub Actions, Lighthouse CI gates |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system architecture.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Java 21+ (Firebase emulator)
- Access to the team's Firebase projects (request from Product Owner)

### Setup

```bash
git clone git@github.com:Adedamola-Aina/AnchorOS.git
cd AnchorOS
npm install

# Copy environment config (values are provided by the Product Owner)
cp .env.example .env.development

# Terminal 1 — start the Firebase Emulator Suite
npm run emulator:start

# Terminal 2 — start the dev server (uses the emulators)
npm run dev
```

Dev server runs at `http://localhost:5173`.

### Development environment model

Local development is **local app + Firebase Emulator Suite**. There is no deployable development cloud environment; the former dev cloud project is retired under the Foundation Reset, and legacy executable dev-project references are being retired (Foundation Phase 2) — developers must not target them.

### Testing

```bash
npm test                # Unit tests (Vitest)
npm run test:run        # Single run (CI mode)
npm run test:e2e        # E2E tests (Playwright)
npm run test:mutation   # Mutation tests (Stryker)
npm run test:rules      # Firestore security rules
```

### Build

```bash
npm run build              # Development build
npm run build:staging      # Staging build
npm run build:production   # Production build
```

## Project Structure

```
src/
├── components/       # Shared UI components
├── config/           # Firebase initialization, environment setup
├── context/          # React contexts (Auth, App, Notifications)
├── features/         # Vertical slices: auth, finance, commitments,
│                     # family, dashboard, onboarding, settings, fabric
├── hooks/            # Custom React hooks
├── services/         # Firebase services, Fabric engine, audit logging
├── styles/           # App-shell (installed PWA) styles
└── types/            # Shared TypeScript types
config/               # Build, test, and lint configuration
e2e/                  # Playwright E2E tests
functions/            # Firebase Cloud Functions
packages/ui/          # Shared @anchor-os/ui component package
public/               # Static assets, manifest, service worker
docs/                 # Architecture, data model, design system, operations
scripts/              # Deploy pipeline, emulator helpers
```

## CI/CD

Every push triggers: lint → type check → unit tests → E2E tests.

Production deploys additionally require mutation tests, Firestore rules tests, Lighthouse CI, and manual approval.

See [docs/OPERATIONS.md](docs/OPERATIONS.md) for the release pipeline and environment model.

## Contributing

Branch from `master` and land every change through a PR — no direct pushes. Use Conventional
Commits (`fix:`, `feat:`, `refactor:`, `test:`, `docs:`, `chore:`); commitlint is enforced by Husky.
High-risk surfaces (auth, Firestore rules/schema, family permissions, financial integrity,
deployment) need a short risk plan in the PR. Production deploys and migration applies require
explicit Product Owner approval. See [AGENTS.md](AGENTS.md) for the canonical engineering contract.

## Product Ownership & Support

| Contact | Channel |
|---------|---------|
| Product Owner | Adedamola Aina |
| Engineering Support | GitHub Issue using `bug_report` or `feature_request` template |
| Infrastructure | Contact Product Owner for environment access or Firebase IAM changes |
| Security Issues | GitHub Issue using `bug_report` template with `[Security]` prefix |
