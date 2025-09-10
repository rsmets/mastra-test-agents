import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { VercelDeployer } from "@mastra/deployer-vercel";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { financialAgent } from "./agents/financial-agent";
import { memoryAgent } from "./agents/memory-agent";
import { travelAgent } from "./agents/travel-agent";
import { travelAgentWorkflow } from "./workflows/travel-agent-workflow";

export const mastra = new Mastra({
  workflows: { weatherWorkflow, travelAgentWorkflow },
  agents: {
    weatherAgent,
    financialAgent,
    memoryAgent,
    travelAgent,
  },
  // Removed LibSQLStore for serverless compatibility
  // Use in-memory storage or external database for production
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  // Add Vercel deployer for easy deployment
  deployer: new VercelDeployer({
    projectName: "mastra-course",
    env: {
      NODE_ENV: "production",
    },
  }),
});
