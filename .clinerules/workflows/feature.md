# /feature — normal feature workflow

1. Define the user-visible outcome and explicit non-goals.
2. Search the existing feature/service patterns before proposing new abstractions.
3. Write a short plan: affected modules, data/security implications, tests, and rollout concerns.
4. Read only the relevant architecture/domain docs referenced by `AGENTS.md`.
5. Implement the smallest coherent vertical slice; reuse existing boundaries and types.
6. Add tests proportional to the risk. Security/data paths require stronger coverage than presentation-only work.
7. Run targeted verification and report what passed, what was not run, and why. Do not deploy production without explicit owner approval.
