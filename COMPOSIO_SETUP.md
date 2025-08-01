# Composio Setup Guide

## Prerequisites

1. **Get a Composio API Key**
   - Visit [https://app.composio.dev](https://app.composio.dev)
   - Sign up or log in to your account
   - Navigate to your API keys section
   - Create a new API key

2. **Create a GitHub Auth Configuration**
   - In the Composio dashboard, go to "Auth Configs"
   - Create a new auth configuration for GitHub
   - Follow the setup wizard to configure GitHub OAuth

## Environment Setup

Create a `.env` file in your project root with:

```bash
COMPOSIO_API_KEY=your_actual_api_key_here
```

## How the Code Works

The updated `financial-agent.ts` now uses a clean `ComposioManager` class that:

1. **Validates API Key**: Checks that `COMPOSIO_API_KEY` is set
2. **Finds Auth Configs**: Discovers available GitHub auth configurations
3. **Checks Existing Connections**: Verifies if you're already connected to GitHub
4. **Establishes Connection**: If not connected, initiates the OAuth flow
5. **Retrieves Tools**: Gets GitHub tools once connected
6. **Handles Errors**: Gracefully manages missing configurations or connection failures

The code is now organized into clear, single-responsibility methods that are easy to understand and maintain.

## Troubleshooting

### "Auth config not found" Error
- Make sure you've created a GitHub auth configuration in the Composio dashboard
- Verify your API key is correct
- Check that the auth config is enabled

### "COMPOSIO_API_KEY not found" Warning
- Create a `.env` file with your API key
- Make sure the environment variable is loaded

### Connection Timeout
- The code waits 60 seconds for you to complete the OAuth flow
- Visit the provided URL and authorize the application
- If it times out, restart the application and try again

## Next Steps

1. Set up your `.env` file with the API key
2. Create a GitHub auth configuration in Composio dashboard
3. Run your application
4. Follow the OAuth flow when prompted
5. Your agent will then have access to GitHub tools! 