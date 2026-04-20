# Anchor OS — Privacy Policy

**Last updated: April 20, 2026**
**Effective date: April 20, 2026**

> **Hosted at:** https://anchor-os.web.app/privacy  
> **Contact:** privacy@anchoros.app  
> **Apple App Store / TestFlight:** This document satisfies the Apple App Store privacy policy requirement.  
> **Google Play Store:** This document satisfies the Google Play Store privacy policy requirement.

---

## 1. Who We Are

Anchor OS ("we", "our", "the app") is a personal finance and commitment tracking platform available as a Progressive Web App (PWA), iOS native app, and Android native app. We take your financial data seriously — it is yours, always.

---

## 2. What We Collect

### 2.1 Data You Provide
| Category | Examples | Purpose |
|---|---|---|
| Account data | Email, display name, profile photo URL | Identity + personalisation |
| Financial data | Account balances, transaction amounts, merchant names, categories | Core app functionality |
| Commitment data | Goals, task descriptions, due dates, completion status | Core app functionality |
| Family sharing | Invited member emails, share permissions | Family Mode feature |
| Feedback | Support messages, in-app feedback text | Product improvement |

### 2.2 Data Collected Automatically
| Category | Examples | Purpose |
|---|---|---|
| Usage analytics | Screen views, feature interactions (no PII) | Product improvement |
| Performance data | App load times, error reports (Sentry, anonymised) | Stability |
| Device metadata | iOS/Android version, app version, locale | Compatibility |
| Auth tokens | Firebase Auth JWT (stored in secure keychain/keystore) | Session management |

### 2.3 Data We Do NOT Collect
- We do **not** collect or store bank credentials or passwords
- We do **not** sell your data to third parties
- We do **not** use your financial data for advertising
- We do **not** use tracking pixels, fingerprinting, or cross-app tracking
- We do **not** access your contacts, microphone, camera, or location

---

## 3. How We Use Your Data

- **Provide and improve the service** — your data powers the app's features
- **Anchor AI (Fabric)** — on-device pattern analysis of your own financial data to generate personalised insights; no raw financial data leaves your device for AI processing
- **Push notifications** — reminders you configure (bill due dates, commitment streaks); you can disable these at any time
- **Family sharing** — data shared with family members is governed by the permissions you set; you can revoke at any time
- **Security** — detect unusual access patterns (rate limiting, App Check); never for profiling

---

## 4. Data Storage and Security

- All data is stored in **Google Firebase / Firestore** with end-to-end security rules that enforce per-user and per-family access
- Data is encrypted **in transit** (TLS 1.3) and **at rest** (AES-256 via Firebase)
- Firestore security rules are audited on every change and stored in `config/firestore.rules`
- Authentication tokens are stored in the device's secure keychain (iOS) or keystore (Android) — never in plain storage
- We enforce **Firebase App Check** to prevent unauthorised API access

---

## 5. Data Sharing

We share data only with the following categories of service providers, strictly for the purposes listed:

| Provider | Purpose | Data shared |
|---|---|---|
| Google Firebase | Database, Auth, Cloud Functions, Hosting | All app data (under your account) |
| Sentry | Crash reporting | Anonymised error traces (no financial data) |
| Resend | Transactional email (family invites, reminders) | Your email address only |

We do not share data with advertisers, data brokers, or analytics companies.

---

## 6. Your Rights

Depending on your location, you may have the following rights:

- **Access** — request a copy of all data we hold about you
- **Correction** — update inaccurate data via the app settings
- **Deletion** — delete your account and all associated data from Settings → Account → Delete Account (permanent, within 30 days)
- **Export** — export your financial data as CSV from Settings → Data Export
- **Portability** — your data is exportable in open formats (CSV, JSON)
- **Opt-out of analytics** — disable from Settings → Privacy

To exercise any right not available in-app, email **privacy@anchoros.app**.

**GDPR (EU/UK users):** You have the right to lodge a complaint with your local supervisory authority.  
**CCPA (California users):** We do not sell personal information. You have the right to know, delete, and opt out.

---

## 7. Data Retention

- **Active accounts:** data retained as long as account is active
- **Deleted accounts:** all data permanently deleted within 30 days of deletion request
- **Backups:** Firestore automated backups are purged after 90 days
- **Analytics:** anonymised usage data retained for 24 months

---

## 8. Children's Privacy

Anchor OS is not directed at children under 13 (or under 16 in the EU). We do not knowingly collect personal data from children. If you believe a child has provided data, contact **privacy@anchoros.app** and we will delete it immediately.

---

## 9. Changes to This Policy

We will notify you of material changes via an in-app notification and by updating the "Last updated" date above. Continued use after notification constitutes acceptance.

---

## 10. Contact

**Email:** privacy@anchoros.app  
**Web:** https://anchor-os.web.app/privacy  
**Response time:** Within 72 hours for privacy-related requests.
