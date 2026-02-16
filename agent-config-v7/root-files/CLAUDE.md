# Anchor OS

See @AGENTS.md for all project conventions, workflow, and rules.

## Claude Code Permissions

Allowed without asking: Read, Glob, Grep, Search, ListDir
Allowed without asking: Bash(npm run test*), Bash(npm run lint*), Bash(npx tsc*), Bash(git *)
Allowed without asking: Bash(curl -s http://localhost:3001/*)

Requires approval: Bash(npm run deploy:production*), Write(.env*)
