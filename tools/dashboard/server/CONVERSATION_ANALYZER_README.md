# Conversation Analyzer - Auto-Documentation System

Automatically detects and documents bugs, features, tasks, gaps, and regressions from user conversations.

## Features

- **5 Issue Types**: BUG, REGRESSION, FEATURE, GAP, TASK
- **Auto-Classification**: Keyword-based detection with AI-like patterns
- **Priority Detection**: P0 (Critical) to P3 (Low)
- **Component Detection**: Finance, Auth, Commitments, Dashboard, etc.
- **Auto-Documentation**: Routes to correct markdown files
- **Auto-Commit**: Git commits with structured messages

## Usage

### Test the Analyzer

```bash
node tools/dashboard/server/analyze-message.js "your message here"
```

### Examples

**Bug Detection:**
```bash
node tools/dashboard/server/analyze-message.js "the modal isn't accepting keyboard input"
# Type: BUG, Priority: P1, Component: UI/UX
```

**Feature Request:**
```bash
node tools/dashboard/server/analyze-message.js "can we add budget tracking?"
# Type: FEATURE, Priority: P2, Component: Finance
```

**Regression:**
```bash
node tools/dashboard/server/analyze-message.js "after deploying v1.5.6, transfers stopped working"
# Type: REGRESSION, Priority: P1, Component: Finance
```

**Gap:**
```bash
node tools/dashboard/server/analyze-message.js "there's no way to export transactions to CSV"
# Type: GAP, Priority: P2, Component: Finance
```

**Task:**
```bash
node tools/dashboard/server/analyze-message.js "we should refactor the finance hooks"
# Type: TASK, Priority: P2, Component: Architecture
```

## Classification Rules

### Issue Types

| Type | Keywords | Example |
|------|----------|---------|
| **BUG** | not working, broken, error, clears, fails | "Modal isn't working" |
| **REGRESSION** | used to work, stopped working, after deploying | "Broke after v1.5.6" |
| **FEATURE** | can we add, would be nice, suggestion | "Add budget tracking" |
| **GAP** | missing, no way to, doesn't have | "No CSV export" |
| **TASK** | refactor, optimize, improve | "Refactor hooks" |

### Priority Levels

| Priority | Triggers | Example |
|----------|----------|---------|
| **P0** | data loss, security, crash, clears all | "Clears all account data" |
| **P1** | major, blocks, prevents, all users | "Blocks user login" |
| **P2** | minor, sometimes, cosmetic | "Button misaligned" |
| **P3** | eventually, someday, nice to have | "Would be nice to have" |

### Components

Detected from keywords in message:
- **Finance**: transaction, account, balance, transfer
- **Auth**: login, signup, password, MFA
- **Commitments**: task, commitment, streak
- **Dashboard**: dashboard, widget, overview
- **Family**: family, spouse, sharing
- **Settings**: settings, preferences, profile
- **UI/UX**: button, modal, form, layout
- **Architecture**: performance, refactor, optimization

## Documentation Routing

| Issue Type | Destination File |
|------------|------------------|
| BUG | `docs/KNOWN_ISSUES.md` |
| REGRESSION | `docs/KNOWN_ISSUES.md` (Regressions section) |
| GAP | `docs/KNOWN_ISSUES.md` (Gaps section) |
| FEATURE | `docs/FEATURE_SUGGESTIONS.md` |
| TASK | `docs/PROJECT_STATUS.md` |

## Files

- **conversationAnalyzer.js**: Core classification logic
- **autoDocumenter.js**: Markdown file updater
- **analyze-message.js**: CLI testing tool

## Integration

To integrate with the dashboard, add to `server/index.js`:

```javascript
const { analyzeMessage } = require('./conversationAnalyzer');
const { documentIssue, autoCommit } = require('./autoDocumenter');

// In your conversation monitoring endpoint
app.post('/api/analyze-conversation', async (req, res) => {
    const { message } = req.body;
    const issue = await analyzeMessage(message, PROJECT_ROOT);
    
    if (issue) {
        await documentIssue(issue, PROJECT_ROOT);
        await autoCommit(issue, PROJECT_ROOT);
    }
    
    res.json({ issue });
});
```

## Future Enhancements

- [ ] Real-time conversation monitoring
- [ ] LLM integration for better classification
- [ ] Slack/Discord notifications
- [ ] GitHub issue creation
- [ ] Duplicate detection
- [ ] Context awareness (track recent deployments, files edited)
