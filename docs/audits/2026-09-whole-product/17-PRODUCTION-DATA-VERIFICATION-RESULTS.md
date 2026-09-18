# §17 — Production data verification: RESULTS (executed 2026-09-18)

Status: **EXECUTED** (the plan in `12-FINAL-SYNTHESIS-REMEDIATION-PLAN.md` §17 was previously
*"plan only, NOT executed"*). Read-only, authorized, aggregate counts only — no document
values, ids or PII were read or recorded, per the §17 precautions.

## Method

- Instrument: `scripts/ci/audit-verify.mjs` (Firestore REST, read-only).
- Auth: `gcloud auth print-access-token` (the local ADC refresh token is unusable —
  `invalid_grant` — so the REST path avoids an interactive re-login).
- Date: 2026-09-18.
- Result hash (sha256 of the JSON report, for reproducibility):

| Project | Generated (UTC) | sha256 |
|---|---|---|
| `anchor-os` (production) | 2026-09-18T20:42:25Z | `88e7771f61275d5a665c41ee4b32bba761a4c35a0d4b46e7e321f55162c2ded8` |
| `anchor-os-staging` | 2026-09-18T20:43:19Z | `e3baab4ea0367cc809b9f5563b91af967100fbf96a3b131b47952de03c52ebb0` |

## Results

| # | Question (decision impact) | Production (`anchor-os`) | Staging (`anchor-os-staging`) |
|---|---|---|---|
| V1 | Accounts carrying `scope:'family'` — sizes the FS-01 cleanup migration (AM-3) | **4 / 32** | 2 / 52 |
| V2 | Accounts with a non-empty legacy `shares` map — AM-2 rules-branch removal timing | **0 / 32** | 2 / 52 |
| V3 | Finance rows carrying a stale `accountShares` snapshot — FS-01b migration size | **0 / 152** | 24 / 391 |
| V4 | Owners with more than one ACTIVE connection — FS-03 / AM-1 | **0** (3 connections: 1 active, 2 disconnected) | 0 (1 connection, disconnected) |
| V5 | Accounts missing `ownerId` — FI-10 ownerless-branch exploitability | **0 / 32** | 0 / 52 |
| V8 | Push-token documents retained | **0** | 3 |
| V9 | Users without `notificationPreferences` / malformed — SN-09 urgency | 27 / 29 without, **0 malformed** | 23 / 25 without, **0 malformed** |
| V11 | Firebase extensions installed — UH-SN03 (flagged "potentially HIGH") | **none** | **none** |
| V12 | `fabric_settings/state.enabled` prevalence — FB-06/FB-17 scale | 2 docs, 2 enabled | 1 doc, 1 enabled |

Totals: production 29 users / 32 accounts / 152 finance rows; staging 25 users / 52 accounts / 391 finance rows.

## Decisions this resolves

1. **FS-02 (legacy `shares`) — production is clean.** `0/32` accounts carry a legacy `shares`
   map, so the legacy rules branch is dead code in production and can be retired once staging's
   2 test-fixture accounts are cleaned. (Staging's 2 hits are seeded test data.)
2. **FS-01b (stale `accountShares`) — no production migration needed.** `0/152`; the staging
   figure (24) is fixture data, so the cleanup path is exercised only there.
3. **FS-01 (AM-3 stop condition) — the data migration IS required.** The audit's stop condition
   was "zero `scope:'family'` docs in production → ship the rules fix without a data migration".
   Production has **4**, so the scope/index cleanup migration must be applied (staging: 2).
4. **FS-03 / AM-1 — single-active-household holds today.** 0 owners with >1 active connection in
   either environment, so the new guard (PR #206) is preventive, with nothing to repair.
5. **FI-10 (ownerless accounts) — not exploitable.** 0 in both environments.
6. **SN-09 (malformed preferences) — no live malformation.** 0 in both; the hardening remains
   worthwhile but has no current data to repair.
7. **UH-SN03 / V11 — CONFIRMED GAP (the "potentially HIGH" item is real).** No Firebase
   extensions are installed in **either** project, so there is no consumer for the `mail`
   queue: security-alert and welcome emails written to `mail` are never delivered.

## Not executable by this instrument (recorded, not silently skipped)

- V6 (Mono volume / page truncation), V7 (webhook signature real-world behaviour), V10
  (production App Check enforcement) and V13/V14 (streak heuristics, timezone probes) need
  provider metrics or config review rather than Firestore counts.
- UH-SN04/UH-SN05 (iOS standalone PWA push, OS-level permission revocation) require real
  devices.