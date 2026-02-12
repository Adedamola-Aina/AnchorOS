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
| Frontend | React 19, TypeScript 5.9 (strict), Vite 7 |
| Styling | Tailwind CSS 3.4, custom design tokens |
| Backend | Firebase Auth, Firestore, Cloud Functions v2, Hosting |
| Testing | Vitest (unit), Playwright (E2E), Stryker (mutation) |
| CI/CD | GitHub Actions, Lighthouse CI gates |

See [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md) for the full system architecture diagram.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Java 21+ (Firebase emulator)
- Access to the team's Firebase projects (request via Jira `INFRA-*` ticket)

### Setup

```bash
git clone git@github.com:Adedamola-Aina/AnchorOS.git
cd AnchorOS
npm install

# Copy environment config (get values from 1Password vault "AnchorOS")
cp .env.example .env.development

# Start dev server
npm run dev
```

Dev server runs at `http://localhost:5173`.

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
├── features/
│   ├── commitments/  # Goal tracking
│   ├── dashboard/    # Main dashboard
│   ├── finance/      # Accounts, transactions, net worth
│   ├── onboarding/   # New user setup flow
│   └── settings/     # Preferences, security, family management
├── hooks/            # Custom React hooks (34)
├── services/         # Firebase services, audit logging
└── types/            # Shared TypeScript types
config/               # Build, test, and lint configuration
e2e/                  # Playwright E2E tests
functions/            # Firebase Cloud Functions (16)
docs/                 # Architecture docs, ADRs, specifications
scripts/              # Deploy pipeline, emulator helpers
```

## CI/CD

Every push triggers: lint → type check → unit tests → E2E tests.

Production deploys additionally require mutation tests, Firestore rules tests, Lighthouse CI, and manual approval.

See [docs/CI_CD_TESTING.md](docs/CI_CD_TESTING.md) for pipeline details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branching strategy, code review requirements, and task linking.

## Author

**Adedamola Aina**
