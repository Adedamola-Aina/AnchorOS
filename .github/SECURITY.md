# Security Policy

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's private vulnerability reporting (Repository → Security → "Report a vulnerability"), or contact the Product Owner (Adedamola Aina) directly. Include reproduction steps and affected surfaces.

## Scope

- Firebase security rules (`config/firestore.rules`, `config/storage.rules`)
- Cloud Functions (`functions/src/`) — auth, family sharing, financial operations, migrations
- Client auth flows (TOTP MFA, passkeys, session handling)
- Data isolation between households and shared accounts

## Response

Confirmed vulnerabilities are triaged by the Product Owner, tracked privately, and fixed via the normal PR process with explicit disclosure coordinated with the reporter.

## Security model

The full security architecture (rules design, App Check enforcement, data isolation, secrets handling) is documented in [docs/SECURITY.md](../docs/SECURITY.md).
