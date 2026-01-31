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
- Use LLM (Claude/GPT) to classify user messages:
  - **Bug Report**: "not working", "broken", "error", "issue"
  - **Feature Request**: "would be nice", "can we add", "suggestion"
  - **Question**: "how do I", "what is", "why"
- Extract structured data:
  - Title
  - Description
  - Priority (P0/P1/P2) based on keywords
  - Affected component (Finance, Auth, Commitments, etc.)

**Example Classification**:
```javascript
// User says: "the pull to refresh on transaction history clears all account data"
{
  type: "bug",
  title: "Pull-to-Refresh Clears Account Data",
  component: "Finance",
  priority: "P1",  // Data loss = high priority
  description: "Pull-to-refresh gesture on transaction history clears all account data, requiring full app reload"
}
```

#### 2.2 Auto-Documentation
When a bug/feature is detected:
1. **Generate Bug ID**: `BUG-023`, `FEAT-001`, etc.
2. **Update `KNOWN_ISSUES.md`**:
   ```markdown
   ### [BUG-023] Pull-to-Refresh Clears Account Data
   - **Reported**: 2026-01-31
   - **Reporter**: User (via conversation)
   - **Impact**: Data loss, requires app reload
   - **Priority**: P1
   - **Status**: Reported
   ```
3. **Update `FEATURE_SUGGESTIONS.md`** (for features)
4. **Create GitHub Issue** (optional, if using GitHub)
5. **Notify dashboard** to refresh

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
