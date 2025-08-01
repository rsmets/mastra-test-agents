# Composio GitHub MCP Server Setup Guide

This guide will walk you through setting up Composio's GitHub integration to use GitHub tools in your Mastra agents.

## Prerequisites

1. **Composio Account**: Sign up at [https://app.composio.dev](https://app.composio.dev)
2. **GitHub Account**: You'll need access to the GitHub repositories you want to work with
3. **Node.js Project**: Your Mastra project should be set up and running

## Step 1: Get Your Composio API Key

1. **Login to Composio Dashboard**
   - Visit [https://app.composio.dev](https://app.composio.dev)
   - Sign in to your account

2. **Create API Key**
   - Navigate to "API Keys" in the project's settings dashboard
   - Click "Create New API Key"
   - Give it a descriptive name (e.g., "Mastra GitHub Integration")
   - Copy the generated API key (you won't be able to see it again)

3. **Add to Environment**
   ```bash
   # Add this to your .env file
   COMPOSIO_API_KEY=your_actual_api_key_here
   ```

## Step 2: Create GitHub Auth Configuration

1. **Navigate to Auth Configs**
   - In the Composio dashboard, go to "Auth Configs"
   - Click "Create New Auth Config"

2. **Configure GitHub Integration**
   - Select "GitHub" as the toolkit
   - Give it a name (e.g., "GitHub for Mastra")
   - Configure the OAuth settings:
     - **Redirect URI**: Use the default or your custom domain
     - **Scopes**: Select the permissions you need (for example):
       - `public_repo` - Read public repo data
       - `user` - Read user profile

3. **Save Configuration**
   - Click "Create" to save your auth configuration
   - Note the Auth Config ID (you'll see it in the URL or dashboard)

## Step 3: Set Up Your Code

```typescript
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new MastraProvider(),
});

const userId = "your_user_id";

// Get auth configs
const authConfigs = await composio.authConfigs.list({
  toolkit: "GITHUB",
});

if (authConfigs.items.length > 0) {
  const authConfigId = authConfigs.items[0].id;
  
  // Check existing connections
  const connections = await composio.connectedAccounts.list({
    userIds: [userId],
  });
  
  const existingConnection = connections.items.find(
    (conn) => conn.authConfig.id === authConfigId && conn.status === "ACTIVE"
  );

  if (!existingConnection) {
    // Initiate connection
    const connectionRequest = await composio.connectedAccounts.initiate(
      userId,
      authConfigId
    );
    
    console.log(`Visit: ${connectionRequest.redirectUrl}`);
    await connectionRequest.waitForConnection(60);
  }

  // Get tools
  const githubTools = await composio.tools.get(userId, {
    toolkits: ["GITHUB"],
  });
}
```

## Step 4: First-Time Authentication

When you run your application for the first time:

1. **Start your application**:
   ```bash
   npm run dev
   ```

2. **Look for the authentication URL** in your console output:
   ```
   Visit this URL to authenticate: https://app.composio.dev/auth/...
   ```

3. **Complete the OAuth flow**:
   - Click the URL or copy it to your browser
   - Authorize Composio to access your GitHub account
   - Select the repositories you want to grant access to
   - Complete the authorization

4. **Verify connection**:
   - You should see "GitHub connection successful!" in your console
   - Your agent now has access to GitHub tools

## Step 5: Available GitHub Tools

Once connected, your agent will have access to these GitHub tools:

- **Repository Management**: Create, update, delete repositories
- **Issues & PRs**: Create, update, comment on issues and pull requests
- **Code Operations**: View files, create commits, manage branches
- **User Management**: Get user information, manage collaborators
- **Organization Tools**: Access organization data and settings

## Troubleshooting

### "Auth config not found" Error
- **Solution**: Make sure you've created a GitHub auth configuration in the Composio dashboard
- **Check**: Verify your API key is correct and the auth config is enabled

### "COMPOSIO_API_KEY not found" Warning
- **Solution**: Add your API key to the `.env` file
- **Format**: `COMPOSIO_API_KEY=your_actual_key_here`

### Connection Timeout
- **Solution**: The OAuth flow has a 60-second timeout
- **Action**: Visit the authentication URL quickly and complete the flow
- **Retry**: Restart your application and try again

### "No GitHub auth configs found" Warning
- **Solution**: Create a GitHub auth configuration in the Composio dashboard
- **URL**: https://app.composio.dev → Auth Configs → Create New

### Permission Errors
- **Solution**: Check that your auth config has the necessary scopes
- **Common scopes**: `repo`, `read:org`, `read:user`, `user:email`

## Environment Variables Reference

```bash
# Required
COMPOSIO_API_KEY=your_composio_api_key

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Limit OAuth scopes** to only what you need
5. **Monitor usage** in the Composio dashboard

## Next Steps

1. **Test the integration** by asking your agent to perform GitHub operations
2. **Explore available tools** in the Composio documentation
3. **Set up additional toolkits** like Gmail, Slack, or Notion
4. **Monitor usage** and adjust permissions as needed

## Support

- **[Composio Documentation]((https://docs.composio.dev)**:
- **[GitHub Integration Guide](https://docs.composio.dev/tools/github)**
- **[Mastra Provider Documentation](https://docs.composio.dev/providers/mastra) **: 