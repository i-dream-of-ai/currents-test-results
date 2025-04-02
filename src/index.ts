#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const CURRENTS_API_URL =
  process.env.CURRENTS_API_URL || "https://api.currents.dev/v1";
const USER_AGENT = "currents-app/1.0";
const CURRENTS_API_KEY = process.env.CURRENTS_API_KEY || "";
if (CURRENTS_API_KEY === "") {
  console.error("CURRENTS_API_KEY env variable is not set.");
}

// Create server instance
const server = new McpServer({
  name: "currents",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function for making Currents API requests
async function makeCurrentsRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
    Authorization: "Bearer " + CURRENTS_API_KEY,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error: any) {
    console.error("Error making Currents request:", error.toString());
    return null;
  }
}

interface RunResponse {
  status: string;
  data: {
    runId: string;
    projectId: string;
    createdAt: string;
    tags: string[];
    timeout: {
      isTimeout: boolean;
    };
    groups: Array<{
      instances: {
        overall: number;
        claimed: number;
        complete: number;
        passes: number;
        failures: number;
      };
      tests: {
        overall: number;
        tests: number;
        passes: number;
        failures: number;
        pending: number;
        skipped: number;
        flaky: number;
        retries: number;
      };
      groupId: string;
      platform: {
        osName: string;
        osVersion: string;
        browserName: string;
        browserVersion: string;
      };
      tags: string[];
    }>;
    meta: {
      ciBuildId: string;
      commit: {
        sha: string;
        branch: string;
        authorName: string;
        authorEmail: string;
        message: string;
        remoteOrigin: string;
        defaultBranch: string | null;
      };
      platform: {
        browserName: string;
        browserVersion: string;
        osName: string;
        osVersion: string;
      };
    };
    specs: Array<{
      spec: string;
      groupId: string;
      instanceId: string;
      claimedAt: string;
      completedAt: string;
      tags: string[];
      results: {
        flaky: number;
        stats: {
          overall: number;
          tests: number;
          passes: number;
          failures: number;
          pending: number;
          skipped: number;
          flaky: number;
          retries: number;
          wallClockStartedAt: string;
          wallClockEndedAt: string;
          wallClockDuration: number;
        };
        videoUrl: string | null;
        screenshots: any[]; // You might want to define a more specific type for screenshots
      };
      machineId: string;
      worker: {
        workerIndex: number;
        parallelIndex: number;
      };
    }>;
    completionState: "CANCELED" | "COMPLETE" | "IN_PROGRESS" | "TIMEOUT";
    status: "FAILED" | "FAILING" | "PASSED" | "RUNNING";
  };
}

// Register Currents tools
server.tool(
  "get-run",
  "Get run details for a defined run ID",
  {
    runId: z.string(),
  },
  async ({ runId }) => {
    const runsUrl = `${CURRENTS_API_URL}/runs/${runId}`;
    const runData = await makeCurrentsRequest<RunResponse>(runsUrl);

    if (!runData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve run data",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(runData, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get-api-config",
  "Get Currents API config currently used for Currents API requests",
  () => {
    return {
      content: [
        {
          type: "text",
          text: CURRENTS_API_KEY,
        },
        {
          type: "text",
          text: CURRENTS_API_URL,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Currents MCP Server running on stdio");
  await new Promise(() => {});
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
