#!/usr/bin/env node

/**
 * AnchorOS Engineering Console MCP Server
 *
 * Optional, read-only telemetry tools for environment/release investigations.
 * The dashboard is NOT the source of truth — Git, GitHub Issues/PRs, tests,
 * CI and the deployed environments are authoritative. Do not use these tools
 * as a mandatory step before coding work; query them only when a task needs
 * environment parity, delivery, quality or release-health telemetry.
 *
 * Tools (read-only, no dashboard/project state is mutated):
 *   - get_environment_state → /api/environment + /api/parity
 *   - get_release_health    → /api/overview
 *   - get_quality_health    → /api/quality
 *   - get_recent_delivery   → /api/delivery + /api/git/timeline
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3001";

// Helper to fetch from the dashboard (read-only GETs only)
async function dashboardFetch(path) {
  try {
    const response = await fetch(`${DASHBOARD_URL}${path}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return { error: `Dashboard returned ${response.status}: ${response.statusText}` };
    }
    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      return { error: "Dashboard timeout — is it running? Start with: ./tools/dashboard/dashboard.sh start" };
    }
    return { error: `Dashboard unreachable at ${DASHBOARD_URL} — ${error.message}` };
  }
}

// Read-only telemetry tools. Optional: use only for release/environment work.
const TOOLS = [
  {
    name: "get_environment_state",
    description:
      "Optional telemetry: get deployed versions/SHAs and git-ancestry-based parity for development, staging, and production. Useful during environment-parity or deployment investigations. Read-only; not a source of truth.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: async () => ({
      environment: await dashboardFetch("/api/environment"),
      parity: await dashboardFetch("/api/parity"),
    }),
  },
  {
    name: "get_release_health",
    description:
      "Optional telemetry: get a concise evidence-based release-health summary (candidate version, environment versions, parity, quality signals). Advisory only — it does not approve or perform releases. Read-only; not a source of truth.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/overview"),
  },
  {
    name: "get_quality_health",
    description:
      "Optional telemetry: get quality snapshots (coverage, dependency health, secureDb compliance, code quality, bundle size, E2E, Functions coverage). Missing reports appear as unavailable. Read-only; not a source of truth.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/quality"),
  },
  {
    name: "get_recent_delivery",
    description:
      "Optional telemetry: get recent git activity and deployment-relevant delivery history (branch, pending changes, deployment summary). Read-only; not a source of truth.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: async () => ({
      delivery: await dashboardFetch("/api/delivery"),
      timeline: await dashboardFetch("/api/git/timeline?days=14"),
    }),
  },
];

// Create MCP server
const server = new Server(
  { name: "anchoros-engineering-console", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  })),
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = TOOLS.find((t) => t.name === request.params.name);
  if (!tool) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
      isError: true,
    };
  }

  const result = await tool.handler(request.params.arguments || {});

  return {
    content: [
      {
        type: "text",
        text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AnchorOS Engineering Console MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
