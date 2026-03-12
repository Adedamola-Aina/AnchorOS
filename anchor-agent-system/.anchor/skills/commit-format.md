# Skill: Commit Format + Dashboard Integration
# Every commit is detected by the dashboard. Format matters.

## The Format

```
<type>(<scope>): <ID> <description>
```

### Types
| Type | When | Dashboard Effect |
|------|------|-----------------|
| `feat` | New feature added | Creates/updates FEAT-XXX |
| `fix` | Bug fixed | Closes/updates BUG-XXX |
| `refactor` | Code restructured, no behavior change | Logged |
| `test` | Tests added/updated | Logged |
| `docs` | Documentation only | Logged |
| `chore` | Build, config, tooling | Logged |
| `deploy` | Deploy to environment | Updates env state |

### Scopes (Use Exactly These)
`finance` · `fabric` · `family` · `mobile` · `auth` · `functions` · `settings` · `onboarding` · `security` · `csp` · `types` · `deploy`

### Examples
```bash
feat(fabric): FEAT-045 proactive daily briefing card
fix(finance): BUG-107 replace native select with button pickers
fix(fabric): BUG-106 show category in AI pattern descriptions
refactor(functions): extract reminder deduplication logic
test(family): add rules tests for V3 sharing model
deploy(staging): v1.10.2 @ be57860
deploy(production): v1.10.2 @ be57860
```

## Deploy Commit Format
```
deploy(env): vX.X.X @ SHORT_HASH
```

```bash
# Get short hash
git rev-parse --short HEAD

# Full deploy commit
git commit -m "deploy(production): v1.10.2 @ be57860"
```

## Dashboard Auto-Detection
The dashboard at `localhost:3001` automatically:
- Detects `fix(scope): BUG-XXX` → marks bug as resolved
- Detects `feat(scope): FEAT-XXX` → marks feature as delivered
- Detects `deploy(env): vX.X.X` → updates environment state
- Detects `deploy(production)` → records release in changelog

Verify after every commit:
```
MCP: get_changelog → confirm dashboard registered the commit
```

## Sign-Off Record Commit
After Tech Lead sign-off, include the sign-off record in the PR description
(not in the commit message — keep commits clean).
