import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";
import { getTransactionsTool } from "../tools/get-transactions-tool";
import { ComposioGithubManager } from "../composio/github";

import { createSmitheryUrl } from "@smithery/sdk";
import path from "path";
import z from "zod";
import { TokenLimiter } from "@mastra/memory/processors";

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
    hackernews: {
      command: "npx",
      args: ["-y", "@devabdultech/hn-mcp-server"],
    },
  },
});

const mcpTools = await mcp.getTools();

const userProfileSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  interests: z.string().optional(),
  preferences: z
    .object({
      communicationStyle: z.string().optional(),
      travel: z.string().optional(),
      accommodation: z.string().optional(),
    })
    .optional(),
});

// Enhanced Memory Configuration
const memory = new Memory({
  processors: [
    // ref: https://mastra.ai/en/docs/memory/memory-processors
    // Example 1: Remove all tool calls/results
    // new ToolCallFilter(),

    // always place this last
    new TokenLimiter(120000), // limit to 120k tokens
  ],
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    // Keep last 20 messages in context
    lastMessages: 20,
    // Enable semantic search to find relevant past conversations
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
      scope: "resource", // Search across all threads for this user
    },
    // Enable working memory to remember user information
    workingMemory: {
      enabled: true,
      scope: "resource", // Memory persists across all user threads
      // schema: userProfileSchema, // can only specify schema or template
      // ref: https://mastra.ai/en/docs/memory/working-memory#example-multi-step-retention
      template: `
      # USER PROFILE

      ## PERSONAL INFO
      - name:
      - location:

      ## PREFERENCES
      - travel preferences:
      - accommodation preferences:
      - conversation style:

      ## INTERESTS
      - likes:
      - dislikes:

      --- After user says "My name is **Sam** and I'm from **Berlin**" ---
      # USER PROFILE

      ## PERSONAL INFO
      - name: Sam
      - location: Berlin

      ## PREFERENCES
      - travel preferences:
      - accommodation preferences:
      - conversation style:

      ## INTERESTS
      - likes:
      - dislikes:

      --- After user says "I like **street food** and I don't like **pizza**" ---
      # USER PROFILE

      ## PERSONAL INFO
      - name: Sam
      - location: Berlin

      ## PREFERENCES
      - travel preferences:
      - accommodation preferences:
      - conversation style:

      ## INTERESTS
      - likes: street food
      - dislikes: pizza
      `,
    },
    threads: {
      generateTitle: {
        model: openai("gpt-4.1-nano"),
        instructions:
          "Generate a concise title for this conversation based on the first user message.",
      },
    },
  },
});

// Agent Configuration
export const travelAgent = new Agent({
  name: "Travel Assistant Agent",
  model: openai("gpt-4o"),
  tools: { ...mcpTools },
  memory,
  instructions: `ROLE DEFINITION
- You are a travel assistant that helps users identifier new destinations and activities based on their travel preferences.
- You can help with booking flights, hotels, and activities.
- Primary users are travelers seeking to plan their next adventure.

CORE CAPABILITIES
- Help users find new destinations and activities based on their travel preferences.
- Answer questions about specific destinations or activities.
- Help with email and travel booking management.

BEHAVIORAL GUIDELINES
- Maintain a professional and friendly communication style.
- Keep responses concise but informative.
- Always clarify if you need more information to answer a question.
- Ensure user privacy and data security.
- Remember user preferences and past interactions to provide personalized service.

MEMORY CAPABILITIES
- You can remember details about users across conversations. 
- When I user states "I like" or "I don't like" something, store that in your working memory.
- Store and recall user preferences, interests, and conversation style.
- Reference past interactions to provide contextually relevant responses.
- Use semantic search to find relevant information from previous conversations.
- Do NOT ever completely clear the working memory. Also just update or remove specific parts of the working memory.

CONSTRAINTS & BOUNDARIES
- Avoid discussing topics outside of travel, bookings, and recent events in localized areas.

SUCCESS CRITERIA
- Achieve high user satisfaction through clear and helpful responses.
- Maintain user trust by ensuring data privacy and security.
- Accurately remember user preferences and past interactions.
- Provide personalized experiences based on user history and preferences.

TOOLS: GMAIL
- Read and process emails related to travel and bookings.
- Identify action items and summarize email content.
- Send or draft emails when requested.

TOOLS: HACKER NEWS
- Allows for searching for latest apps and gadgets
- Can help provide recommendations for new tools, apps, gadgets, and technologies for travel.


`,
});
