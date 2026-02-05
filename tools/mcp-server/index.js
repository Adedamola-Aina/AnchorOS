#!/usr/bin/env node

/**
 * Anchor OS Dashboard MCP Server
 * 
 * Wraps the Internal PM Dashboard (localhost:3001) as MCP tools
 * so AI agents can query project state natively instead of using curl.
 * 
 * Tools exposed:
 *   - get_project_state     → /api/command-center
 *   - get_bugs              → /api/git/bugs
 *   - get_roadmap           → /api/git/roadmap
 *   - get_environment_parity → /api/parity
 *   - get_features          → /api/git/features
 *   - search_git            → /api/git/search/:keyword
 *   - get_next_id           → /api/intake/next-id
 *   - get_kanban            → /api/git/kanban
 *   - get_velocity          → /api/velocity/stats
 *   - get_changelog         → /api/git/changelog
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3001";

// Helper to fetch from dashboard
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

// Define all tools
const TOOLS = [
  {
    name: "get_project_state",
    description: "Get the full project state from the command center. Use this FIRST before any work to understand current bugs, roadmap, velocity, deployment status, and alerts. This is the single source of truth.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/command-center"),
  },
  {
    name: "get_bugs",
    description: "Get all tracked bugs from git history. Use to check for duplicates before logging new bugs, and to understand what's currently broken.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/git/bugs"),
  },
  {
    name: "get_roadmap",
    description: "Get the feature roadmap with auto-detected progress from git. Shows planned, in-progress, and completed work with priorities.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/git/roadmap"),
  },
  {
    name: "get_environment_parity",
    description: "Check what's deployed to Dev, Staging, and Production. Shows git-ancestry-based parity to know which environments have which fixes.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/parity"),
  },
  {
    name: "get_features",
    description: "Get all tracked features from git history. Use to check for duplicates before logging new feature requests.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/git/features"),
  },
  {
    name: "search_git",
    description: "Search git commit history for a keyword or bug ID. Use to check if something was already fixed or implemented.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Keyword or ID to search for (e.g., 'BUG-008', 'dark mode', 'transaction')" },
      },
      required: ["keyword"],
    },
    handler: (args) => dashboardFetch(`/api/git/search/${encodeURIComponent(args.keyword)}`),
  },
  {
    name: "get_next_id",
    description: "Get the next available ID for a given type (bug, feature, gap, ux, reg). Use when logging new items to avoid ID collisions.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Item type: bug, feature, gap, ux, or reg", enum: ["bug", "feature", "gap", "ux", "reg"] },
      },
      required: ["type"],
    },
    handler: (args) => dashboardFetch(`/api/intake/next-id?type=${args.type}`),
  },
  {
    name: "get_kanban",
    description: "Get the Kanban board view of all work items with their current status (planned, in-progress, completed, deferred).",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/git/kanban"),
  },
  {
    name: "get_velocity",
    description: "Get development velocity statistics — items completed per week, cycle time, and trends.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/velocity/stats"),
  },
  {
    name: "get_changelog",
    description: "Get the auto-generated changelog from git history.",
    inputSchema: { type: "object", properties: {}, required: [] },
    handler: () => dashboardFetch("/api/git/changelog"),
  },
];

// Create MCP server
const server = new Server(
  { name: "anchor-dashboard", version: "1.0.0" },
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
  console.error("Anchor Dashboard MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
