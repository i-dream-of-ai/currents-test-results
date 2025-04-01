import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CURRENTS_API_BASE = "https://api-staging.currents.dev/v1";
const USER_AGENT = "currents-app/1.0";

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
    "Authorization": "Bearer FlLFehSQxlNkBlh7C2X2E1RT43IiHNpF3vD578vVzQJUWHHuvsifXHkkQgTz3mtg"
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making Currents request:", error);
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

// Register weather tools
server.tool(
  "get-run",
  "Get run details for a defined run ID",
  {
    runId: z.string(),
  },
  async ({ runId }) => {
    const runsUrl = `${CURRENTS_API_BASE}/runs/${runId}`;
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Currents MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
