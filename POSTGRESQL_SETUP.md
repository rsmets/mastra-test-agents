# PostgreSQL Setup for Mastra Course

## ✅ What's Been Configured

I've successfully updated your Mastra project to use PostgreSQL for persistent memory storage across all agents:

- ✅ **Weather Agent**: Now uses PostgreSQL for memory storage
- ✅ **Financial Agent**: Now uses PostgreSQL for memory storage  
- ✅ **Travel Agent**: Now uses PostgreSQL for memory storage
- ✅ **Memory Agent**: Now uses PostgreSQL for memory storage
- ✅ **Build Process**: Verified to work with PostgreSQL configuration

## 🗄️ Database Requirements

Your PostgreSQL database needs to support:
- **pgvector extension** for vector embeddings
- **Standard PostgreSQL tables** for memory storage

## 🚀 Quick Setup Options

### Option 1: Supabase (Recommended) ⭐

**Why Supabase:**
- Free tier available
- Built-in pgvector support
- Easy setup
- Great for development and production

**Setup Steps:**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database
3. Copy the connection string
4. Add it to your environment variables as `DATABASE_URL`

**Connection String Format:**
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Option 2: Neon (Great Alternative) 🌟

**Why Neon:**
- Serverless PostgreSQL
- Built-in pgvector support
- Generous free tier
- Auto-scaling

**Setup Steps:**
1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string
3. Add it to your environment variables as `DATABASE_URL`

**Connection String Format:**
```
postgresql://[user]:[password]@[neon-hostname]/[dbname]?sslmode=require
```

### Option 3: Railway (Simple & Reliable) 🚂

**Why Railway:**
- One-click PostgreSQL setup
- Built-in pgvector support
- Simple deployment
- Good pricing

**Setup Steps:**
1. Go to [railway.app](https://railway.app) and create a project
2. Add PostgreSQL service
3. Copy the connection string
4. Add it to your environment variables as `DATABASE_URL`

### Option 4: Local PostgreSQL (Development) 💻

**For local development only:**

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb mastra_memory

# Install pgvector extension
psql -d mastra_memory -c "CREATE EXTENSION vector;"

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/mastra_memory"
```

## 🔧 Environment Variables

Add this to your `.env` file:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Your existing API keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# ... other API keys
```

## 🚀 Deployment Platforms

### Vercel (Recommended)
1. Set `DATABASE_URL` in Vercel dashboard
2. Deploy your project
3. Vercel will automatically handle the database connection

### Railway
1. Add PostgreSQL service to your Railway project
2. Railway automatically sets `DATABASE_URL`
3. Deploy your project

### DigitalOcean App Platform
1. Add managed PostgreSQL database
2. Set `DATABASE_URL` in environment variables
3. Deploy your project

## 🔍 Testing Your Setup

### 1. Test Database Connection
```bash
# Set your DATABASE_URL
export DATABASE_URL="your_postgresql_connection_string"

# Test the build
pnpm run build

# Test locally (optional)
pnpm run dev
```

### 2. Verify Vector Extension
Connect to your database and run:
```sql
-- Check if pgvector extension is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

-- If not installed, install it
CREATE EXTENSION vector;
```

## 🎯 Benefits of PostgreSQL Setup

1. **Persistent Memory**: Agent conversations persist across deployments
2. **Vector Search**: Semantic search through past conversations
3. **Scalability**: Handles multiple concurrent users
4. **Reliability**: No data loss on serverless function restarts
5. **Production Ready**: Suitable for production deployments

## 🆘 Troubleshooting

### Common Issues:

**1. "pgvector extension not found"**
- Make sure your PostgreSQL instance supports pgvector
- Install the extension: `CREATE EXTENSION vector;`

**2. "Connection refused"**
- Check your `DATABASE_URL` format
- Verify the database is running and accessible
- Check firewall settings

**3. "Authentication failed"**
- Verify username and password
- Check if the user has proper permissions
- Ensure SSL settings are correct

**4. "Database does not exist"**
- Create the database: `CREATE DATABASE mastra_memory;`
- Update your connection string

## 📊 Database Schema

Mastra will automatically create these tables:
- `mastra_messages` - Stores conversation messages
- `mastra_vectors` - Stores vector embeddings for semantic search
- `mastra_threads` - Stores conversation threads

## 🎉 Next Steps

1. **Choose a PostgreSQL provider** (I recommend Supabase)
2. **Set up your database** and get the connection string
3. **Add `DATABASE_URL`** to your environment variables
4. **Deploy your project** to your chosen platform
5. **Test your agents** to ensure memory persistence works

Your Mastra project is now ready for production with persistent PostgreSQL storage! 🚀
