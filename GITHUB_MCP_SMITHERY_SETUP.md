# GitHub MCP Server Setup with Smithery

This guide shows how to set up a GitHub MCP server using Smithery for your Mastra agents.

## Prerequisites

- **GitHub Account**: You'll need access to the repositories you want to work with
- **Smithery Account**: Sign up at [https://smithery.dev](https://smithery.dev)

## Step 1: Create GitHub MCP Server

1. **Login to Smithery**
   - Visit [https://smithery.dev](https://smithery.dev)
   - Sign in to your account

2. **Create New MCP Server**
   - Click "Create New Server"
   - Select "GitHub" from the available integrations
   - Give it a name (e.g., "GitHub for Mastra")

3. **Configure GitHub OAuth**
   - Click "Configure OAuth"
   - Authorize Smithery to access your GitHub account
   - Select the repositories you want to grant access to
   - Choose the required scopes:
     - `repo` - Full repository access
     - `read:org` - Read organization data
     - `read:user` - Read user profile

4. **Get Your MCP URL**
   - After configuration, copy your unique MCP server URL
   - It will look like: `https://your-server.smithery.dev`

## Step 2: Add to Environment

```bash
# Add this to your .env file
GITHUB_MCP_URL=https://your-server.smithery.dev
```

## Step 3: Update Your Code

```typescript
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    github: {
      url: new URL(process.env.GITHUB_MCP_URL || ""),
    },
  },
});

const mcpTools = await mcp.getTools();

export const yourAgent = new Agent({
  // ... other config
  tools: { ...mcpTools },
});
```

## Available GitHub Tools

Once connected, your agent will have access to:

- **Repository Management**: Create, update, delete repositories
- **Issues & PRs**: Create, update, comment on issues and pull requests  
- **Code Operations**: View files, create commits, manage branches
- **User Management**: Get user information, manage collaborators

## Troubleshooting

### "Invalid MCP URL" Error
- Verify your MCP URL is correct and accessible
- Check that your Smithery server is running

### "Authentication Failed" Error
- Re-authenticate with GitHub in Smithery dashboard
- Check that your OAuth scopes are sufficient

### "Server Not Found" Error
- Ensure your Smithery server is active
- Verify the URL format is correct

## Security Best Practices

1. **Use environment variables** for MCP URLs
2. **Never commit URLs** to version control
3. **Limit OAuth scopes** to only what you need
4. **Monitor usage** in Smithery dashboard

## Support

- **Smithery Documentation**: [https://docs.smithery.dev](https://docs.smithery.dev)
- **GitHub Integration**: [https://docs.smithery.dev/integrations/github](https://docs.smithery.dev/integrations/github)
- **Mastra MCP Guide**: [https://docs.mastra.ai/mcp](https://docs.mastra.ai/mcp) 