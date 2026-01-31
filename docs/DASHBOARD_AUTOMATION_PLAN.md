# DASHBOARD AUTOMATION PLAN

**Created**: 2026-01-31  
**Owner**: Teeto  
**Status**: Planning

---

## 🎯 OBJECTIVE

Automate the Internal PM Dashboard to:
1. **Auto-update** when code changes occur
2. **Auto-document** bugs and feature requests from conversations
3. **Context-aware** classification of user reports

---

## 📋 CURRENT STATE

### What Works ✅
- Dashboard reads from git commits (via `gitAnalyzer.js`)
- Dashboard reads from markdown files (`DEPLOYMENT_STATUS.md`, `CHANGELOG.md`, etc.)
- PM2 keeps dashboard running with auto-restart
- File watchers detect changes to docs

### What's Manual ❌
- Updating `DEPLOYMENT_STATUS.md` after deployments
- Updating `PROJECT_STATUS.md` after completing work
- Updating `CHANGELOG.md` for new versions
- Updating `KNOWN_ISSUES.md` when bugs are reported/fixed
- Classifying user reports as bugs vs features

---

## 🛠️ AUTOMATION STRATEGY

### Phase 1: Git Hook Automation (Quick Win)
**Timeline**: 1-2 hours  
**Impact**: Medium

#### 1.1 Post-Deployment Hook
Create `.git/hooks/post-receive` or use GitHub Actions to:
- Detect when `npm run deploy:*` completes
- Auto-update `DEPLOYMENT_STATUS.md` with:
  - New version number
  - Deployment timestamp
  - Environment (dev/staging/prod)
- Auto-commit the update

**Implementation**:
```bash
# tools/hooks/post-deploy.sh
#!/bin/bash
ENV=$1  # dev, staging, or production
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")

# Update DEPLOYMENT_STATUS.md
sed -i "s/| \*\*${ENV^}\*\* | .* |/| **${ENV^}** | v${VERSION} |/" docs/DEPLOYMENT_STATUS.md

# Commit
git add docs/DEPLOYMENT_STATUS.md
git commit -m "chore: Auto-update ${ENV} deployment status to v${VERSION}"
```

#### 1.2 Post-Commit Hook
Create `.git/hooks/post-commit` to:
- Trigger dashboard restart via `pm2 restart anchor-dashboard`
- Ensure dashboard picks up new commits immediately

**Implementation**:
```bash
# .git/hooks/post-commit
#!/bin/bash
pm2 restart anchor-dashboard --silent
```

---

### Phase 2: AI-Powered Documentation (High Value)
**Timeline**: 4-6 hours  
**Impact**: High

#### 2.1 Conversation Analyzer Service
Create `tools/dashboard/server/conversationAnalyzer.js`:

**Features**:
- Monitor conversation logs in `/root/.gemini/antigravity/brain/`
- Use LLM (Claude/GPT) to classify user messages into 5 categories:

##### Classification Rules

**1. BUG (BUG-XXX)** - Something broken that previously worked or should work
- **Keywords**: "not working", "broken", "error", "issue", "fails", "doesn't work", "can't", "won't"
- **Examples**:
  - "The modal isn't accepting keyboard input"
  - "Pull-to-refresh clears all account data"
  - "Transaction form is unresponsive"

**2. REGRESSION (REG-XXX)** - Something that worked before but broke after a change
- **Keywords**: "used to work", "stopped working", "broke after", "since the update", "after deploying"
- **Context**: Recent deployment or code change mentioned
- **Examples**:
  - "After deploying v1.5.5, the modal stopped working"
  - "This used to work yesterday but now it's broken"
  - "Since we updated the finance module, transfers fail"

**3. FEATURE (FEAT-XXX)** - New functionality request
- **Keywords**: "would be nice", "can we add", "suggestion", "feature request", "could we have", "I wish"
- **Examples**:
  - "Can we add a budget tracking feature?"
  - "Would be nice to have dark mode"
  - "Suggestion: Add export to CSV"

**4. GAP (GAP-XXX)** - Missing functionality or technical debt
- **Keywords**: "missing", "doesn't have", "no way to", "can't find", "should have", "needs"
- **Context**: Expected functionality that doesn't exist
- **Examples**:
  - "There's no way to filter transactions by category"
  - "The app doesn't have offline support"
  - "Missing validation on email input"

**5. TASK (TASK-XXX)** - Work item or improvement (not user-facing)
- **Keywords**: "refactor", "optimize", "improve", "update", "upgrade", "clean up"
- **Context**: Internal improvements, code quality, performance
- **Examples**:
  - "Refactor the finance hooks to reduce duplication"
  - "Optimize the transaction search performance"
  - "Update dependencies to latest versions"

##### Priority Detection

**P0 (Critical)** - Immediate action required
- Data loss
- Security vulnerability
- App crashes
- Complete feature failure
- **Keywords**: "data loss", "security", "crash", "can't use", "completely broken"

**P1 (High)** - Important, affects core functionality
- Major feature broken
- Poor UX
- Affects multiple users
- **Keywords**: "major", "important", "blocks", "prevents", "all users"

**P2 (Medium)** - Nice to have, minor issues
- Minor bugs
- Edge cases
- Cosmetic issues
- **Keywords**: "minor", "sometimes", "occasionally", "cosmetic"

**P3 (Low)** - Future consideration
- Enhancement ideas
- Nice-to-haves
- **Keywords**: "eventually", "someday", "nice to have"

##### Component Detection

Automatically detect affected component from context:
- **Finance**: "transaction", "account", "balance", "transfer", "pay bill"
- **Auth**: "login", "signup", "password", "MFA", "authentication"
- **Commitments**: "task", "commitment", "streak", "daily", "weekly"
- **Dashboard**: "dashboard", "widget", "overview", "home"
- **Family**: "family", "spouse", "sharing", "invitation"
- **Settings**: "settings", "preferences", "profile"
- **UI/UX**: "button", "modal", "form", "layout", "design"
- **Architecture**: "performance", "bundle", "optimization", "refactor"

**Example Classification**:
```javascript
// User says: "the pull to refresh on transaction history clears all account data"
{
  type: "BUG",
  id: "BUG-023",
  title: "Pull-to-Refresh Clears Account Data",
  component: "Finance",
  priority: "P0",  // Data loss = critical
  description: "Pull-to-refresh gesture on transaction history clears all account data, requiring full app reload",
  keywords: ["data loss", "clears", "transaction history"],
  reportedAt: "2026-01-31T01:41:00Z",
  reporter: "User"
}

// User says: "after deploying v1.5.6, the modal stopped accepting input"
{
  type: "REGRESSION",
  id: "REG-004",
  title: "Modal Input Stopped Working After v1.5.6",
  component: "UI/UX",
  priority: "P1",
  description: "Modal inputs became unresponsive after v1.5.6 deployment",
  keywords: ["stopped working", "after deploying", "modal"],
  triggerVersion: "v1.5.6",
  reportedAt: "2026-01-31T01:41:00Z",
  reporter: "User"
}

// User says: "can we add budget tracking to the finance module?"
{
  type: "FEATURE",
  id: "FEAT-001",
  title: "Budget Tracking",
  component: "Finance",
  priority: "P2",
  description: "Add budget tracking functionality to finance module",
  keywords: ["can we add", "budget tracking"],
  reportedAt: "2026-01-31T01:41:00Z",
  reporter: "User"
}

// User says: "there's no way to export transactions to CSV"
{
  type: "GAP",
  id: "GAP-005",
  title: "Missing Transaction Export",
  component: "Finance",
  priority: "P2",
  description: "No functionality to export transactions to CSV format",
  keywords: ["no way to", "export"],
  reportedAt: "2026-01-31T01:41:00Z",
  reporter: "User"
}

// User says: "we should refactor the finance hooks to reduce duplication"
{
  type: "TASK",
  id: "TASK-001",
  title: "Refactor Finance Hooks",
  component: "Architecture",
  priority: "P2",
  description: "Refactor finance hooks to reduce code duplication and improve maintainability",
  keywords: ["refactor", "reduce duplication"],
  reportedAt: "2026-01-31T01:41:00Z",
  reporter: "Agent"
}
```

#### 2.2 Auto-Documentation
When an issue is detected, route to appropriate documentation:

##### BUG → KNOWN_ISSUES.md
```markdown
### [BUG-023] Pull-to-Refresh Clears Account Data
- **Reported**: 2026-01-31
- **Reporter**: User (via conversation)
- **Component**: Finance
- **Impact**: Data loss, requires app reload
- **Priority**: P0
- **Status**: Reported
```

##### REGRESSION → KNOWN_ISSUES.md (Regressions Section)
```markdown
## 🔵 REGRESSIONS

### [REG-004] Modal Input Stopped Working After v1.5.6
- **Reported**: 2026-01-31
- **Trigger**: v1.5.6 deployment
- **Component**: UI/UX
- **Impact**: Modal inputs unresponsive
- **Priority**: P1
- **Status**: Investigating
```

##### FEATURE → FEATURE_SUGGESTIONS.md
```markdown
### FIN-004: Budget Tracking
- **Category**: Finance
- **Priority**: Medium
- **Effort**: High (3-5 days)
- **Impact**: High (frequently requested)
- **Description**: Add budget tracking functionality to finance module
- **User Story**: As a user, I want to set monthly budgets per category so I can track spending against goals
- **Requested By**: User (2026-01-31)
```

##### GAP → KNOWN_ISSUES.md (Gaps Section)
```markdown
## 🟡 HIGH (P1)

### [GAP-005] Missing Transaction Export
- **Reported**: 2026-01-31
- **Component**: Finance
- **Impact**: Users cannot export data for external analysis
- **Fix**: Implement CSV/Excel export functionality
- **Priority**: P2
- **Status**: Backlog
```

##### TASK → PROJECT_STATUS.md (This Week's Priorities)
```markdown
## 🎯 THIS WEEK'S PRIORITIES

| Priority | Task | Owner | Target | Status |
|----------|------|-------|--------|--------|
| **P2** | TASK-001: Refactor Finance Hooks | Agent | 2026-02-07 | ⬜ Not Started |
```

##### Workflow
1. **Detect issue type** from conversation
2. **Generate unique ID** (BUG-023, REG-004, FEAT-001, GAP-005, TASK-001)
3. **Route to correct file**:
   - BUG/REG/GAP → `KNOWN_ISSUES.md`
   - FEATURE → `FEATURE_SUGGESTIONS.md`
   - TASK → `PROJECT_STATUS.md`
4. **Update dashboard** (auto-refresh via post-commit hook)
5. **Notify user** (optional: Slack/Discord webhook)

---

### Phase 3: Smart Context Awareness (Advanced)
**Timeline**: 6-8 hours  
**Impact**: Very High

#### 3.1 Conversation Context Tracking
Create `tools/dashboard/server/contextTracker.js`:

**Features**:
- Track conversation state:
  - What file is being edited
  - What feature is being worked on
  - What deployment just happened
- Use this context to auto-classify reports

**Example**:
```javascript
// Context: Just deployed v1.5.6 to staging
// User says: "I can't see any changes in the environment parity page"

// AI infers:
{
  type: "bug",
  title: "Dashboard Not Showing v1.5.6 Deployment",
  component: "Internal Dashboard",
  priority: "P2",
  relatedWork: "v1.5.6 deployment",
  suggestedFix: "Restart PM2 dashboard service"
}
```

#### 3.2 Auto-Fix Suggestions
For common issues, suggest fixes:
- "Dashboard not updating" → "Run `pm2 restart anchor-dashboard`"
- "Environment parity missing" → "Add PENDING CHANGES section to DEPLOYMENT_STATUS.md"
- "Tests failing" → "Run `npm test` and check logs"

---

### Phase 4: Deployment Pipeline Integration
**Timeline**: 3-4 hours  
**Impact**: High

#### 4.1 CI/CD Integration
Integrate with deployment scripts:

**`scripts/deploy.sh` Enhancement**:
```bash
#!/bin/bash
ENV=$1

# Existing deployment logic
npm run build:${ENV}
firebase deploy --only hosting:${ENV}

# NEW: Auto-documentation
node tools/automation/update-deployment-status.js ${ENV}
git add docs/DEPLOYMENT_STATUS.md docs/PROJECT_STATUS.md
git commit -m "chore: Auto-update deployment docs for ${ENV}"
git push

# NEW: Trigger dashboard refresh
pm2 restart anchor-dashboard
```

#### 4.2 Version Bump Automation
Create `tools/automation/bump-version.js`:
- Detect changes in `CHANGELOG.md`
- Auto-increment version in `package.json`
- Update `DEPLOYMENT_STATUS.md`
- Create git tag

---

## 🚀 IMPLEMENTATION ROADMAP

### Week 1: Foundation
- [ ] Create `tools/automation/` directory
- [ ] Implement post-deployment hook
- [ ] Implement post-commit hook
- [ ] Test with manual deployments

### Week 2: AI Integration
- [ ] Set up conversation analyzer
- [ ] Implement bug/feature classification
- [ ] Auto-update KNOWN_ISSUES.md
- [ ] Test with sample conversations

### Week 3: Context Awareness
- [ ] Implement context tracker
- [ ] Add auto-fix suggestions
- [ ] Integrate with dashboard UI
- [ ] Test end-to-end workflow

### Week 4: Polish & Deploy
- [ ] Add error handling
- [ ] Create monitoring/logging
- [ ] Write documentation
- [ ] Deploy to production

---

## 📊 SUCCESS METRICS

| Metric | Current | Target |
|--------|---------|--------|
| Manual doc updates per deployment | 5-7 | 0-1 |
| Time to document bug | 5-10 min | < 30 sec |
| Dashboard refresh delay | Manual | < 5 sec |
| Bug classification accuracy | N/A | > 90% |

---

## 🔧 TECHNICAL REQUIREMENTS

### Dependencies
```json
{
  "chokidar": "^3.5.3",  // File watching
  "openai": "^4.0.0",     // AI classification
  "simple-git": "^3.19.0" // Git automation
}
```

### Environment Variables
```bash
OPENAI_API_KEY=sk-...  # For AI classification
DASHBOARD_AUTO_REFRESH=true
CONVERSATION_LOG_PATH=/root/.gemini/antigravity/brain
```

### File Structure
```
tools/
├── automation/
│   ├── update-deployment-status.js
│   ├── bump-version.js
│   ├── classify-conversation.js
│   └── auto-document.js
├── hooks/
│   ├── post-deploy.sh
│   └── post-commit.sh
└── dashboard/
    └── server/
        ├── conversationAnalyzer.js
        └── contextTracker.js
```

---

## 🎯 NEXT STEPS

1. **Immediate** (Today):
   - Create post-commit hook for dashboard auto-refresh
   - Test with current workflow

2. **This Week**:
   - Implement post-deployment hook
   - Create automation scripts directory

3. **Next Week**:
   - Start AI conversation analyzer
   - Test bug classification

---

**Maintained By**: Teeto  
**Review**: Weekly  
**Status**: Planning → Implementation
