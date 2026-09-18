# September 2026 Whole-Product Audit — HISTORICAL EVIDENCE

Remediation evidence for the September 2026 whole-product audit (105 raw findings → 89 canonical roots, 2 release blockers).

- **Read-on-demand**: not part of the default engineering context; do not load these files during ordinary work.
- **Immutable record**: findings are preserved as written; never rewrite, close, or re-grade findings here.
- **Traceability**: `MASTER-FINDING-REGISTER.md` maps every canonical finding ID (A-*, C-*, F-*, FB-*, SN-*, FS-*, AM-* …) with severity, status, and bundle mapping; `12-FINAL-SYNTHESIS-REMEDIATION-PLAN.md` is the remediation plan. Raw domain-discovery reports live in Git history (audit documentation commits).

## Current remediation state (condensed from the audit HANDOFF, 2026-09-09)

- **Audit discovery phase: COMPLETE.** No further feature-domain audits; next work is remediation only.
- **B1** (release blockers, Wave 1): FS-01, FS-01b, FS-04 — family revocation containment: status-aware `isConnectedFamilyMember` (or AM-3 connection-doc deletion fallback), one-way `scope:'family'` reset + stale `accountShares` index strip on disconnect, transactional disconnect, idempotent cleanup migration. Rollout: **rules first** (containment), then functions, then client; dry-run migration count queries before the migration PR merges.
- **B2**: SN-01 + SN-03 + SN-08 (notification token lifecycle / toggle-delivery divergence / 2-code-only token cleanup) — must wait for B1.
- **Wave 3 / deferred**: FS-02 (legacy `shares`), FS-03 (dual households), notification/device SN-* items beyond B2.
- **Stop/rollback conditions**: rules `get()` cost on `isConnectedFamilyMember` unacceptable → AM-3(b) fallback; zero `scope:'family'` docs in production (V1) → ship rules fix without data migration.
- **Re-audit addendum (2026-09-17 → 2026-09-18)**: twenty additional canonical roots (RA-01…RA-10, then RA-11…RA-17, then RA-18…RA-20) discovered outside the 2026-09 corpus. RA-01…RA-11 and RA-13…RA-20 are remediated and merged; RA-12 (saved goals are never surfaced anywhere in the product) remains open. See the `RA-*` addendum in [`2026-09-whole-product/MASTER-FINDING-REGISTER.md`](2026-09-whole-product/MASTER-FINDING-REGISTER.md) and §20 of the synthesis. The 2026-09 findings and counts above are unchanged.
- **Contract correction (2026-09-18)**: Mono authenticates webhooks with a shared `mono-webhook-secret` header compared directly against the configured secret — **not** an HMAC over the body. The original FI-02 row and the INV-5 wording assumed an HMAC over `req.rawBody`; both are corrected additively in the register and the synthesis (findings are preserved, not rewritten).
- **Merged, awaiting staging (2026-09-18)**: FS-01/FS-01b/FS-04 (PR #119), SN-01/SN-03/SN-08 (PR #127) and FI-01/FI-02 (PR #180) are merged to `master` and close on the staging rollout — see the *merged-awaiting-staging* table in the register.
- Canonical engineering contract: [`../../AGENTS.md`](../../AGENTS.md); architecture/operations: [`../ARCHITECTURE.md`](../ARCHITECTURE.md), [`../OPERATIONS.md`](../OPERATIONS.md).
