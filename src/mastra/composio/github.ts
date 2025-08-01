import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";

export class ComposioGithubManager {
  private composio: Composio<MastraProvider>;
  private userId: string;

  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      provider: new MastraProvider(),
    });
    this.userId = "rsmets";
  }

  private validateApiKey(): boolean {
    if (!process.env.COMPOSIO_API_KEY) {
      console.warn("COMPOSIO_API_KEY not found. Skipping Composio tools.");
      return false;
    }
    return true;
  }

  private async findGitHubAuthConfig() {
    const authConfigs = await this.composio.authConfigs.list({
      toolkit: "GITHUB",
    });

    if (authConfigs.items.length === 0) {
      console.warn("No GitHub auth configs found. Create one at https://app.composio.dev");
      return null;
    }

    return authConfigs.items[0];
  }

  private async checkExistingConnection(authConfigId: string) {
    const connections = await this.composio.connectedAccounts.list({
      userIds: [this.userId],
    });

    return connections.items.find(
      (conn) => conn.authConfig.id === authConfigId && conn.status === "ACTIVE"
    );
  }

  private async establishConnection(authConfigId: string): Promise<boolean> {
    try {
      console.log("Initiating GitHub connection...");
      
      const connectionRequest = await this.composio.connectedAccounts.initiate(
        this.userId,
        authConfigId
      );

      console.log(`Visit this URL to authenticate: ${connectionRequest.redirectUrl}`);
      
      await connectionRequest.waitForConnection(60);
      console.log("GitHub connection successful!");
      return true;
    } catch (error) {
      console.warn("GitHub connection failed. Continuing without GitHub tools.");
      return false;
    }
  }

  async initialize(): Promise<Record<string, any>> {
    try {
      if (!this.validateApiKey()) {
        return {};
      }

      const authConfig = await this.findGitHubAuthConfig();
      if (!authConfig) {
        return {};
      }

      const existingConnection = await this.checkExistingConnection(authConfig.id);
      
      if (!existingConnection) {
        const connected = await this.establishConnection(authConfig.id);
        if (!connected) {
          return {};
        }
      } else {
        console.log("GitHub already connected!");
      }

      return await this.composio.tools.get(this.userId, {
        toolkits: ["GITHUB"],
      });
    } catch (error) {
      console.error("Error initializing Composio:", error);
      return {};
    }
  }
}
