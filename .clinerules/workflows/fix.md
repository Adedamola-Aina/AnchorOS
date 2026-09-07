# /fix — focused bug workflow

1. State the observed failure and the expected behavior in one or two sentences.
2. Search for the smallest relevant code path, callers, and existing tests. Do not scan the whole repository.
3. Reproduce the bug with a focused test when practical, especially for business logic, auth, data integrity, or regressions.
4. Make the smallest cohesive fix. Avoid opportunistic refactors unless they are required for correctness.
5. Run the narrowest relevant tests, then TypeScript/lint or broader tests only if the touched surface warrants it.
6. Summarize root cause, changed files, verification, and any residual risk. Do not deploy production.
