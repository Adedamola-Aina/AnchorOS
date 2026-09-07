# AnchorOS Engineering Console

The console (formerly the Internal PM Dashboard) is an optional, read-mostly engineering observability console. It answers: what code is where, what is deployed, what passed/failed, are environments in sync, and is a release healthy.

It is **not** a project manager, task tracker, roadmap authority, agent orchestrator, or approval system. Git, GitHub Issues/PRs, tests, CI, and the deployed environments are authoritative. Agents should query the console only when a task needs its telemetry.

## Tabs

- **Overview** — current git SHA/branch, environment versions, parity and quality summary.
- **Environments** — dev/staging/production versions, SHAs, and git-ancestry parity/drift.
- **Delivery** — recent git activity and deployment-relevant history.
- **Quality** — coverage, dependency health, secureDb compliance, code quality, bundle size, E2E, Functions coverage. Missing reports show as unavailable.
- **Release** — evidence-based release readiness (advisory only; no automatic deployment decisions).

## API

`GET /api/overview`, `/api/environment`, `/api/parity`, `/api/parity-git`, `/api/delivery`, `/api/git/commits|timeline|stats|search/:id`, `/api/quality`, `/api/code-health`, `/api/coverage`, `/api/dependencies`, `/api/health`. `POST /api/refresh` clears server caches (the only mutating endpoint).

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
