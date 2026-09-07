# AnchorOS Internal Engineering Dashboard

The dashboard is an optional, read-only engineering observability console. It is useful for seeing environment parity, recent Git/deployment activity, coverage/test snapshots, and release health in one place.

It is **not** the source of truth for normal coding work and is no longer a mandatory agent bootstrap step. Git, the repository, tests, GitHub issues/PRs, and the deployed environments are authoritative. Agents should query the dashboard only when the current task needs its telemetry.

## Useful roles

- Compare dev/staging/production environment state.
- Inspect recent commit and deployment activity.
- Surface test, coverage, bundle, dependency, and code-quality snapshots exposed by the server.
- Provide a human-friendly release/engineering overview over Tailscale.

The historical PM/task-tracking and agent-orchestration features may remain for compatibility, but new engineering workflows should not depend on them.

## Start/stop

```bash
./tools/dashboard/dashboard.sh start
./tools/dashboard/dashboard.sh status
./tools/dashboard/dashboard.sh restart
./tools/dashboard/dashboard.sh stop
./tools/dashboard/dashboard.sh logs
```

Local access: `http://localhost:3001`

The existing Tailscale endpoint can be used when its local service configuration is enabled.

## Development

Server:

```bash
cd tools/dashboard/server
npm install
npm run dev
```

Client:

```bash
cd tools/dashboard/client
npm install
npm run dev
```

## MCP adapter

`tools/mcp-server/` can expose selected dashboard endpoints as MCP tools when that integration is useful. It should be enabled deliberately for dashboard/release-state work, not loaded into every coding session.

## Security

- Internal only; do not expose publicly.
- Keep it on LAN/Tailscale.
- Treat it as read-only telemetry unless a future change is explicitly designed and reviewed otherwise.
- Do not store secrets or production user data in dashboard fixtures/cache files.
