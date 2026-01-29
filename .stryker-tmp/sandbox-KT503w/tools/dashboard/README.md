# Anchor OS - Internal PM Dashboard

Internal project management dashboard for the Anchor OS development team.

## 🎯 Purpose

This dashboard provides:
- **Environment Parity**: See what features are deployed where (Dev/Staging/Prod)
- **Documentation Health**: Track freshness of project docs
- **Kanban Board**: Visual task tracking from PROJECT_BOARD.md
- **Git Timeline**: Commit history and deployment activity
- **Sprint Progress**: Auto-calculated from Kanban

## 🚀 Quick Start

### Development Mode

**Terminal 1: Start API Server**
```bash
cd tools/dashboard/server
npm install
npm run dev
```

**Terminal 2: Start React Client**
```bash
cd tools/dashboard/client
npm install
npm run dev
```

Open: http://localhost:5174

### Production Mode (Always Running)

The dashboard uses **PM2** for process management with:
- ✅ **Auto-restart** on crash
- ✅ **Boot persistence** - starts when server reboots
- ✅ **Port conflict handling** - graceful error messages
- ✅ **Logging** - all output saved to `logs/`

**Control Script:**
```bash
# Start dashboard
./tools/dashboard/dashboard.sh start

# Stop dashboard  
./tools/dashboard/dashboard.sh stop

# Restart dashboard
./tools/dashboard/dashboard.sh restart

# Check status
./tools/dashboard/dashboard.sh status

# View logs
./tools/dashboard/dashboard.sh logs
```

**Manual PM2 Commands:**
```bash
pm2 status              # Check if running
pm2 restart anchor-dashboard  # Restart
pm2 logs anchor-dashboard     # View logs
```

Access: http://localhost:3001

## 📁 Structure

```
tools/dashboard/
├── server/
│   ├── index.js          # Express server (port 3001)
│   ├── docReader.js      # Parses docs/*.md files
│   ├── gitAnalyzer.js    # Git history analysis
│   ├── envChecker.js     # Environment parity checker
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.tsx       # Main dashboard
│   │   └── components/   # UI components
│   ├── package.json
│   └── vite.config.ts
├── ecosystem.config.js   # PM2 config
└── README.md
```

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/summary` | Combined dashboard data |
| `GET /api/status` | PROJECT_STATUS.md parsed |
| `GET /api/bugs` | KNOWN_ISSUES.md parsed |
| `GET /api/roadmap` | ROADMAP.md parsed |
| `GET /api/docs` | All docs with freshness |
| `GET /api/board` | PROJECT_BOARD.md (Kanban) |
| `GET /api/parity` | Feature parity across envs |
| `GET /api/git/commits` | Recent git commits |
| `GET /api/git/timeline` | Commits grouped by day |
| `GET /api/git/stats` | Repo status |
| `POST /api/refresh` | Manual data refresh |

## 🔐 Security

- **Internal only** - Not exposed publicly
- **Tailscale access** - LAN/VPN only
- **Read-only** - Doesn't modify any files
- **No auth required** - Developer tool

## 📊 Features

### Environment Parity View
Shows each feature and where it's deployed:
```
Feature                  Dev      Staging   Production
Mobile Navigation        ✅       ❌        ❌
Family Mode Fix          ✅       ✅        ✅
```

### Documentation Health
Tracks doc freshness:
- 🟢 Fresh (< 24 hours)
- 🟡 Recent (1-7 days)
- 🔴 Stale (> 7 days)

### Auto-Refresh
- Data refreshes every 5 minutes
- Manual refresh button available
- Last update timestamp shown

## 🛠️ Development

### Adding New Data Sources

1. Create parser in `server/` (e.g., `myParser.js`)
2. Add API endpoint in `server/index.js`
3. Create React component in `client/src/components/`
4. Add tab in `client/src/App.tsx`

### Customizing Parsers

Edit `server/docReader.js` to modify how markdown files are parsed.

## 📝 Notes

- This is a developer tool, NOT part of the main Anchor OS app
- Located in `tools/` folder, not `src/`
- Uses separate dependencies from main app
- Runs on different port (3001 vs 5173)
