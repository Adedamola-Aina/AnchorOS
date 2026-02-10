# Anchor OS

**Personal finance and commitment tracking for families.**

Anchor OS helps households manage shared finances, track commitments, and build better money habits together. Built for mobile-first use with a clean, nautical-themed interface.

![Version](https://img.shields.io/badge/version-1.7.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![CI](https://github.com/Adedamola-Aina/AnchorOS/actions/workflows/ci-cd.yml/badge.svg)

---

## What it does

- **Shared finance dashboard** — track accounts, transactions, and net worth across the household
- **Commitment tracking** — set financial goals with accountability and progress rings
- **Family sharing** — invite family members, share accounts with permission controls (read-only or read-write)
- **Onboarding flow** — guided setup with MFA recommendation, profile creation, and account linking
- **Offline-ready PWA** — works on mobile with service worker caching and background sync
- **Notifications** — per-category controls, quiet hours, push notifications

## Screenshots

*Coming soon — app is in active development.*

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript (strict), Vite |
| Styling | Tailwind CSS, custom design tokens |
| Backend | Firebase (Auth, Firestore, Cloud Functions, Hosting) |
| Testing | Vitest (unit), Playwright (E2E), Stryker (mutation) |
| CI/CD | GitHub Actions → Firebase Hosting (staging + production) |
| Performance | Lighthouse CI gates |

## Getting started

### Prerequisites

- Node.js 20+
- npm 9+
- Java 21+ (for Firebase emulator)

### Install and run

```bash
# Clone the repo
git clone https://github.com/Adedamola-Aina/AnchorOS.git
cd AnchorOS

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests

```bash
# Unit tests
npm test

# E2E tests (requires Playwright browsers)
npx playwright install --with-deps chromium
npm run test:e2e

# Mutation tests
npm run test:mutation
```

### Build for production

```bash
npm run build:production
npm run preview    # Preview the build locally
```

## Project structure

```
src/
├── components/       # Shared UI components
├── config/           # Firebase config, environment setup
├── context/          # React contexts (Auth, App, Notifications)
├── features/
│   ├── commitments/  # Goal tracking
│   ├── dashboard/    # Main dashboard
│   ├── finance/      # Accounts, transactions, net worth
│   ├── onboarding/   # New user setup flow
│   └── settings/     # User preferences, security, family
├── hooks/            # Custom React hooks
├── services/         # Firebase services, audit logging
└── utils/            # Helpers, error handling, secure DB wrapper
e2e/                  # Playwright end-to-end tests
functions/            # Firebase Cloud Functions
docs/                 # Architecture docs, design tokens, specs
```

## Environments

| Environment | URL | Deploy trigger |
|-------------|-----|----------------|
| Development | `localhost:5173` | `npm run dev` |
| Staging | [anchor-os-staging.web.app](https://anchor-os-staging.web.app) | Push to `staging` or `develop` |
| Production | [anchor.tail2fa2e.ts.net](https://anchor.tail2fa2e.ts.net) | Push to `master` + manual approval |

## CI/CD pipeline

Every push runs: lint → unit tests → E2E tests.

Production deploys additionally require: mutation tests, Firestore rules tests, Lighthouse CI, and manual approval.

See [docs/CI_CD_TESTING.md](docs/CI_CD_TESTING.md) for details.

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Write tests first (red → green → refactor)
4. Keep source files under 200 lines
5. Commit with conventional prefixes: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
6. Open a PR against `master`

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

## License

[MIT](LICENSE)

## Author

**Adedamola Aina** — [GitHub](https://github.com/Adedamola-Aina)
