# AnchorOS — Claude Code

Read and follow `AGENTS.md`; it is the single canonical engineering contract.

Do not use the retired `.anchor/` role system, lock-file workflow, or mandatory dashboard bootstrap. Read additional docs only when the current task requires them.

Claude-specific safety remains configured in `.claude/settings.json`. Never read secrets, run raw `firebase deploy`, or deploy production without explicit owner approval.
