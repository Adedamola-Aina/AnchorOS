# /release — release workflow

1. Confirm the intended version/changeset and current branch/commit. Use Git history instead of reading the full `CHANGELOG.md`.
2. Run the repository's release-appropriate typecheck, lint, unit/integration, rules, and E2E gates.
3. Review security-sensitive/config/environment changes and verify no secrets are present.
4. Deploy through the repository's environment-specific scripts only. Never run raw `firebase deploy`.
5. Stage and verify before production.
6. Production deployment requires explicit owner approval in the current task.
7. Record the deployed commit/version and any rollback action needed if verification fails.
