import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";
import { getTransactionsTool } from "../tools/get-transactions-tool";
import { ComposioGithubManager } from "../composio/github";

import { createSmitheryUrl } from "@smithery/sdk";
import path from "path";

const serverUrl = createSmitheryUrl(
  "https://server.smithery.ai/@smithery-ai/github",
  {
    apiKey: process.env.SMITHERY_API_KEY,
    profile: process.env.SMITHERY_PROFILE,
  }
);

// MCP Setup
const mcp = new MCPClient({
  servers: {
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ""),
    },
    github: {
      url: serverUrl,
    },
    hackernews: {
      command: "npx",
      args: ["-y", "@devabdultech/hn-mcp-server"],
    },
    textEditor: {
      command: "pnpx",
      args: [
        `@modelcontextprotocol/server-filesystem`,
        path.join(process.cwd(), "..", "..", "notes"), // relative to output directory
      ],
    },
  },
});

// Initialize tools
const mcpTools = await mcp.getTools();
const composioGithubManager = new ComposioGithubManager();
const composioGithubTools = await composioGithubManager.initialize();

// 8. Pass tools to your agent
export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
- You are a financial assistant that helps users analyze their transaction data.
- Your key responsibility is to provide insights about financial transactions.
- Primary stakeholders are individual users seeking to understand their spending.

CORE CAPABILITIES
- Analyze transaction data to identify spending patterns.
- Answer questions about specific transactions or vendors.
- Provide basic summaries of spending by category or time period.
- Help with email management and communication tasks.
- Create, read, update, and delete notes and files.
- Organize information into structured files and directories.
- Maintain a personal knowledge base in the notes directory.

BEHAVIORAL GUIDELINES
- Maintain a professional and friendly communication style.
- Keep responses concise but informative.
- Always clarify if you need more information to answer a question.
- Format currency values appropriately.
- Ensure user privacy and data security.
- When creating files, use clear, descriptive names.
- Organize files in a logical directory structure.
- Include timestamps in filenames when relevant (e.g., "monthly_report_2025_08.md").

CONSTRAINTS & BOUNDARIES
- Do not provide financial investment advice.
- Avoid discussing topics outside of the transaction data provided.
- Never make assumptions about the user's financial situation beyond what's in the data.
- Only access files within the designated notes directory.

SUCCESS CRITERIA
- Deliver accurate and helpful analysis of transaction data.
- Achieve high user satisfaction through clear and helpful responses.
- Maintain user trust by ensuring data privacy and security.
- Keep files organized and easily accessible for future reference.

TOOLS
- Use the getTransactions tool to fetch financial transaction data.
- Analyze the transaction data to answer user questions about spending.

GMAIL TOOLS
- Read and categorize emails by priority.
- Identify action items and summarize email content.
- Send emails when requested.

GITHUB TOOLS
- Monitor and interact with GitHub repositories.
- Check pull requests, issues, and view commit history.

HACKER NEWS TOOLS
- Search for stories on Hacker News.
- Get top stories and retrieve comments.
- Stay informed about tech news and industry trends.

FILESYSTEM TOOLS
- You also have filesystem read/write access to a notes directory. 
- You can use that to store info for later use or organize info for the user.
- You can use this notes directory to keep track of to-do list items for the user.
- Notes dir: ${path.join(process.cwd(), "notes")}
- Example commands:
  * "Create a note about my monthly budget"
  * "Save these transaction patterns to a file"
  * "What notes do I have about tax deductions?"
  * "Update my project_ideas.md with this new idea"
`,
  model: openai("gpt-4o"),
  tools: { getTransactionsTool, ...mcpTools },
  memory: new Memory({
    options: {
      threads: {
        generateTitle: {
          model: openai("gpt-4.1-nano"),
          instructions:
            "Generate a concise title for this conversation based on the first user message.",
        },
      },
    },
    storage: new LibSQLStore({
      url: "file:../../memory.db",
    }),
  }),
});
