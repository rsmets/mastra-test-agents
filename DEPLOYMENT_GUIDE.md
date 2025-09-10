# Mastra Course Deployment Guide

## Problem Analysis

Your Render deployment failed because:
1. **Missing Build Step**: Render wasn't running `mastra build` before starting the server
2. **LibSQLStore Incompatibility**: File-based storage doesn't work in serverless environments

## ✅ Fixed Issues

I've fixed your project by:
- ✅ Removed file-based `LibSQLStore` from main configuration
- ✅ Updated memory agent to use in-memory storage (`:memory:`)
- ✅ Added Vercel deployer for easy deployment
- ✅ Verified build process works correctly

## 🚀 Recommended Deployment Options

### 1. Vercel (Recommended) ⭐

**Why Vercel is the best choice:**
- Native Mastra support with dedicated deployer
- Automatic builds and deployments
- Built-in environment variable management
- Excellent developer experience
- Free tier available
- Global edge deployment

**Deployment Steps:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy your project
vercel --prod
```

**Or use GitHub integration:**
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### 2. Railway (Great Alternative) 🚂

**Why Railway is excellent:**
- Persistent file system (solves LibSQLStore issues)
- Easy database integration
- Simple deployment process
- Good pricing
- Supports long-running processes

**Deployment Steps:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy your project
railway up
```

### 3. DigitalOcean App Platform 🌊

**Why DigitalOcean works well:**
- Persistent file system
- Good performance
- Reasonable pricing
- Simple deployment

**Deployment Steps:**
1. Connect your GitHub repository
2. Set build command: `pnpm run build`
3. Set start command: `node .mastra/output/index.mjs`
4. Configure environment variables

### 4. Fly.io (For Advanced Users) ✈️

**Why Fly.io is powerful:**
- Global edge deployment
- Persistent volumes
- Docker-based (more control)
- Good performance

**Deployment Steps:**
```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login to Fly
fly auth login

# 3. Deploy your project
fly deploy
```

## 🔧 Environment Variables

Make sure to set these environment variables in your chosen platform:

```bash
# Required API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional API Keys (if using these services)
SMITHERY_API_KEY=your_smithery_api_key
SMITHERY_PROFILE=your_smithery_profile
ZAPIER_MCP_URL=your_zapier_mcp_url

# Environment
NODE_ENV=production
```

## 📊 Platform Comparison

| Platform | Ease of Use | Performance | Cost | File System | Mastra Support |
|----------|-------------|-------------|------|-------------|----------------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ Ephemeral | ⭐⭐⭐⭐⭐ |
| **Railway** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Persistent | ⭐⭐⭐⭐ |
| **DigitalOcean** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Persistent | ⭐⭐⭐ |
| **Fly.io** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ Persistent | ⭐⭐⭐ |
| **Render** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ❌ Ephemeral | ⭐⭐ |

## 🎯 My Recommendation

**Go with Vercel** because:
1. It has the best Mastra integration
2. Your project is now configured for it
3. It's the most developer-friendly
4. It handles the build process automatically
5. It has excellent documentation and community support

## 🚀 Quick Start with Vercel

1. **Push your code to GitHub** (if not already done)
2. **Go to [vercel.com](https://vercel.com)** and sign up
3. **Import your GitHub repository**
4. **Set environment variables** in the Vercel dashboard
5. **Deploy!** Vercel will automatically build and deploy your app

Your app will be available at `https://your-project-name.vercel.app`

## 🔍 Troubleshooting

### If you get build errors:
- Make sure all environment variables are set
- Check that your `package.json` has the correct build script
- Verify that all dependencies are installed

### If you get runtime errors:
- Check the Vercel function logs
- Ensure all API keys are valid
- Verify that your agents are properly configured

## 📝 Next Steps

1. Choose your deployment platform (I recommend Vercel)
2. Set up your environment variables
3. Deploy your application
4. Test your agents and workflows
5. Set up a custom domain (optional)

## 🆘 Need Help?

If you encounter any issues:
1. Check the platform-specific documentation
2. Review the Mastra deployment docs
3. Check the Vercel/Railway/DigitalOcean logs
4. Make sure all environment variables are set correctly

Your project is now ready for deployment! 🎉
