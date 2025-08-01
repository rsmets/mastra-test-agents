import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { getTransactionsTool } from "../tools/get-transactions-tool";

const mcp = new MCPClient({
  servers: {
    // We'll add servers in the next steps
  },
});

// Initialize MCP tools
const mcpTools = await mcp.getTools();

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

BEHAVIORAL GUIDELINES
- Maintain a professional and friendly communication style.
- Keep responses concise but informative.
- Always clarify if you need more information to answer a question.
- Format currency values appropriately.
- Ensure user privacy and data security.

CONSTRAINTS & BOUNDARIES
- Do not provide financial investment advice.
- Avoid discussing topics outside of the transaction data provided.
- Never make assumptions about the user's financial situation beyond what's in the data.

SUCCESS CRITERIA
- Deliver accurate and helpful analysis of transaction data.
- Achieve high user satisfaction through clear and helpful responses.
- Maintain user trust by ensuring data privacy and security.

TOOLS
- Use the getTransactions tool to fetch financial transaction data.
- Analyze the transaction data to answer user questions about their spending.`,
  model: openai("gpt-4o"), // You can use "gpt-3.5-turbo" if you prefer
  tools: { getTransactionsTool, ...mcpTools }, // Add our tool and MCP tools here
  memory: new Memory({
    options: {
      // ref: https://mastra.ai/en/docs/memory/overview#thread-title-generation
      threads: {
        generateTitle: {
          model: openai("gpt-4.1-nano"), // Use cheaper model for titles
          instructions:
            "Generate a concise title for this conversation based on the first user message.",
        },
      },
    },
    storage: new LibSQLStore({
      url: "file:../../memory.db", // local file-system database. Location is relative to the output directory `.mastra/output`
    }),
  }), // Add memory here
});
