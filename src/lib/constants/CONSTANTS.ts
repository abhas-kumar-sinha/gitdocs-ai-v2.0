import { Template } from "@/app/pages/TemplatePage";

const params = {slug: "params.slug"};
const user = {name: "user.name"};

export type TemplateType = 'minimal' | 'standard' | 'api' | 'data-science' | 'documentation' | 'monorepo' | 'hackathon';

export const TEMPLATE_PROMPTS: Record<TemplateType, string> = {
  minimal: `Create a MINIMALIST README with:
- Brief description (1-2 sentences)
- Quick installation (one command)
- Basic usage example
- License`,

  standard: `Create a STANDARD OPEN SOURCE README with:
- Project badges (build, version, license)
- Clear description with key features
- Installation instructions
- Usage examples with code blocks
- Contributing guidelines
- License`,

  api: `Create a BACKEND API SERVICE README with:
- API endpoint documentation
- Authentication setup
- Environment variables
- Request/response examples
- Docker deployment
- Database schema`,

  'data-science': `Create a DATA SCIENCE README with:
- Problem statement
- Dataset description
- Dependencies with versions
- Model architecture
- Training instructions
- Results and metrics`,

  documentation: `Create a DOCUMENTATION README with:
- Table of contents
- Architecture overview
- Detailed API reference
- Multiple usage examples
- Configuration options
- Troubleshooting section`,

  monorepo: `Create a MONOREPO README with:
- Repository architecture
- Package listing
- Shared dependencies
- Development workflow
- Build commands per package`,

  hackathon: `Create a HACKATHON README with:
- Eye-catching name and tagline
- Problem statement
- Screenshots/GIFs
- Tech stack badges
- Quick start (<5 min)
- Demo link
- Team credits`
};

export const templates: Template[] = [
  {
    id: 'minimal',
    title: "Minimalist",
    description: "Clean and simple. Perfect for small utilities, scripts, or personal configurations.",
    tags: ["Scripts", "Config", "Small Libs"],
    content: `
# Project Title

> A brief, one-line description of what this project does and why it matters.

## What is this?

A short paragraph explaining the purpose of this project. Keep it focused and clear. For example: "This is a lightweight utility that converts CSV files to JSON format with automatic type detection. It's designed for quick data transformation tasks in Node.js environments."

## Installation

\`\`\`bash
# If it's a package
npm install your-package-name

# Or if it's a script
git clone https://github.com/username/repo.git
cd repo
\`\`\`

## Usage

### Basic Example

\`\`\`bash
# Command-line usage
node script.js input.txt

# Or as a module
npm run start
\`\`\`

### Example with Options

\`\`\`javascript
const myTool = require('./tool');

// Simple usage
myTool.process('input.txt');

// With configuration
myTool.process('input.txt', { format: 'json', pretty: true });
\`\`\`

## Configuration

If there are any simple settings, list them here:

- **Option A**: What this option controls (default: value)
- **Option B**: What this option controls (default: value)
- **Option C**: What this option controls (default: value)

### Configuration File Example

\`\`\`json
{
  "optionA": true,
  "optionB": "value",
  "timeout": 5000
}
\`\`\`

## Common Use Cases

- **Use Case 1**: Brief description of when you'd use this
- **Use Case 2**: Another practical application
- **Use Case 3**: Yet another scenario

## Troubleshooting

**Problem**: Common issue description
**Solution**: How to fix it

**Problem**: Another common issue
**Solution**: The fix for this one

## Requirements

- Node.js 14+ / Python 3.8+ / etc.
- Any other dependencies

## License

MIT - Feel free to use this however you'd like.
`
  },
  {
    id: 'standard',
    title: "Standard Open Source",
    description: "The gold standard. Includes installation, usage, badges, and contribution guidelines.",
    tags: ["NPM Packages", "Libraries", "Tools"],
    content: `
# Project Name

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Downloads](https://img.shields.io/npm/dm/package-name)

A comprehensive description of the library that clearly explains what problem it solves. For example: "A type-safe HTTP client for TypeScript that provides automatic request/response validation, intelligent caching, and seamless error handling. Built for modern web applications that need reliability and developer experience."

## Why Use This?

Explain the key value propositions:

- **Problem it solves**: Traditional HTTP clients require extensive boilerplate for type safety
- **How it's different**: Automatic TypeScript inference and runtime validation
- **Who it's for**: Teams building production TypeScript applications

## Features

- 🚀 **Fast**: Optimized for performance with intelligent request batching
- 📦 **Lightweight**: Zero dependencies, only 4KB gzipped
- 🔧 **Fully Typed**: Written in TypeScript with comprehensive type definitions
- 🛡️ **Safe**: Runtime validation using Zod schemas
- 🔄 **Smart Caching**: Automatic response caching with configurable TTL
- 🎯 **Intuitive API**: Fluent interface design for better DX
- 📱 **Universal**: Works in Node.js, browsers, and edge environments

## Installation

\`\`\`bash
# npm
npm install my-cool-package

# yarn
yarn add my-cool-package

# pnpm
pnpm add my-cool-package
\`\`\`

## Quick Start

Here's a 30-second introduction to get you up and running:

\`\`\`typescript
import { createClient } from 'my-cool-package';

// Create a client instance
const client = createClient({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// Make a request
const data = await client.get('/users/123');
console.log(data);
\`\`\`

## Detailed Usage

### Basic Requests

\`\`\`typescript
// GET request
const user = await client.get('/users/123');

// POST request
const newUser = await client.post('/users', {
  body: { name: 'John Doe', email: 'john@example.com' }
});

// PUT request
const updated = await client.put('/users/123', {
  body: { name: 'Jane Doe' }
});

// DELETE request
await client.delete('/users/123');
\`\`\`

### Advanced Configuration

\`\`\`typescript
const client = createClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer token',
    'Custom-Header': 'value'
  },
  retry: {
    attempts: 3,
    delay: 1000
  },
  cache: {
    enabled: true,
    ttl: 60000 // 1 minute
  }
});
\`\`\`

### Type-Safe Requests with Validation

\`\`\`typescript
import { z } from 'zod';

// Define your schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
});

// Type-safe request
const user = await client.get('/users/123', {
  schema: UserSchema
});
// user is now typed as { id: number; name: string; email: string }
\`\`\`

### Error Handling

\`\`\`typescript
try {
  const data = await client.get('/users/123');
} catch (error) {
  if (error.isNetworkError) {
    console.error('Network failed:', error.message);
  } else if (error.isValidationError) {
    console.error('Response validation failed:', error.details);
  } else {
    console.error('Request failed:', error.status, error.message);
  }
}
\`\`\`

## API Reference

### \`createClient(config: ClientConfig): Client\`

Creates a new HTTP client instance.

**Parameters:**
- \`config.baseURL\` (string): Base URL for all requests
- \`config.timeout\` (number, optional): Request timeout in milliseconds (default: 30000)
- \`config.headers\` (object, optional): Default headers for all requests
- \`config.retry\` (object, optional): Retry configuration
- \`config.cache\` (object, optional): Cache configuration

**Returns:** Client instance

### \`client.get(path: string, options?: RequestOptions)\`

Performs a GET request.

**Parameters:**
- \`path\` (string): Request path (relative to baseURL)
- \`options.schema\` (Schema, optional): Validation schema
- \`options.headers\` (object, optional): Request-specific headers
- \`options.params\` (object, optional): Query parameters

**Returns:** Promise resolving to the response data

### \`client.post(path: string, options?: RequestOptions)\`

Performs a POST request with the same options as GET, plus:
- \`options.body\` (any): Request body (automatically serialized)

## Examples

### Real-World Example: User Management API

\`\`\`typescript
import { createClient } from 'my-cool-package';
import { z } from 'zod';

// Define schemas
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
});

const UsersListSchema = z.array(UserSchema);

// Create client
const api = createClient({
  baseURL: 'https://api.myapp.com',
  headers: {
    'Authorization': \`Bearer \${process.env.API_TOKEN}\`
  }
});

// Fetch all users
async function getUsers() {
  return await api.get('/users', {
    schema: UsersListSchema,
    params: { limit: 100, sort: 'name' }
  });
}

// Create a new user
async function createUser(name: string, email: string) {
  return await api.post('/users', {
    schema: UserSchema,
    body: { name, email, role: 'user' }
  });
}

// Update user
async function updateUser(id: number, updates: Partial<User>) {
  return await api.put(\`/users/\${id}\`, {
    schema: UserSchema,
    body: updates
  });
}
\`\`\`

## Comparison with Alternatives

| Feature | my-cool-package | axios | fetch | ky |
|---------|----------------|-------|-------|-----|
| TypeScript Support | ✅ Built-in | ⚠️ Via types | ⚠️ Via types | ✅ Built-in |
| Runtime Validation | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Auto Retry | ✅ Yes | ⚠️ Via plugin | ❌ No | ✅ Yes |
| Bundle Size | 4KB | 14KB | 0KB (native) | 3KB |
| Browser Support | ✅ Modern | ✅ All | ✅ Modern | ✅ Modern |

## Performance

Benchmarks on M1 Mac, Node.js 20:
- Simple GET: ~2ms
- With validation: ~3ms
- Cached request: ~0.1ms

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Node.js 14+

## Migration Guide

### From Axios

\`\`\`typescript
// Before (axios)
const response = await axios.get('https://api.example.com/users');
const data = response.data;

// After (my-cool-package)
const client = createClient({ baseURL: 'https://api.example.com' });
const data = await client.get('/users');
\`\`\`

### From Fetch

\`\`\`typescript
// Before (fetch)
const response = await fetch('https://api.example.com/users');
const data = await response.json();

// After (my-cool-package)
const client = createClient({ baseURL: 'https://api.example.com' });
const data = await client.get('/users');
\`\`\`

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork and clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/my-cool-package.git
   cd my-cool-package
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Run tests
   \`\`\`bash
   npm test
   \`\`\`

4. Start development mode
   \`\`\`bash
   npm run dev
   \`\`\`

### Pull Request Process

1. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
2. Make your changes and add tests
3. Ensure all tests pass (\`npm test\`)
4. Update documentation if needed
5. Commit your changes (\`git commit -m 'Add amazing feature'\`)
6. Push to your fork (\`git push origin feature/amazing-feature\`)
7. Open a Pull Request

### Code Style

We use ESLint and Prettier. Run \`npm run lint\` to check your code.

## FAQ

**Q: Can I use this in a browser?**
A: Yes! It works in all modern browsers.

**Q: Does it support authentication?**
A: Yes, through headers and interceptors.

**Q: Is it production-ready?**
A: Yes, used by 500+ companies in production.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/user/repo/issues)
- 📖 Docs: [Full Documentation](https://docs.example.com)

## Acknowledgments

- Inspired by [axios](https://github.com/axios/axios) and [ky](https://github.com/sindresorhus/ky)
- Built with [Zod](https://github.com/colinhacks/zod)
- Thanks to all our [contributors](https://github.com/user/repo/graphs/contributors)!
`
  },
  {
    id: 'api',
    title: "Backend API Service",
    description: "Focuses on API endpoints, authentication, environment variables, and deployment.",
    tags: ["REST", "GraphQL", "Docker"],
    content: `
# Backend API Service

A production-ready RESTful API service built with modern best practices. This service provides user authentication, data management, and integrates with third-party services. Designed for scalability, security, and maintainability.

## 🎯 Overview

This is a comprehensive backend API that handles:
- **User Management**: Registration, authentication, profile management
- **Data Operations**: CRUD operations with validation and authorization
- **File Uploads**: Secure file handling with S3 storage
- **Real-time Updates**: WebSocket support for live data
- **Background Jobs**: Queue-based task processing
- **Monitoring**: Health checks, metrics, and logging

**Live API**: https://api.example.com  
**Documentation**: https://api.example.com/docs  
**Status Page**: https://status.example.com

## 🏗 Architecture

\`\`\`
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  API Server  │────▶│  Database   │
│  (React)    │     │  (Node.js)   │     │ (Postgres)  │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ├────▶ Redis Cache
                            ├────▶ S3 Storage
                            └────▶ Queue (Bull)
\`\`\`

## 🛠 Tech Stack

### Core
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.18 / NestJS 10
- **Language**: TypeScript 5.0

### Database & Caching
- **Primary Database**: PostgreSQL 15
- **ORM**: Prisma / TypeORM
- **Caching**: Redis 7
- **Search**: Elasticsearch (optional)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **Cloud**: AWS / GCP / DigitalOcean

### Development
- **Testing**: Jest, Supertest
- **Linting**: ESLint, Prettier
- **CI/CD**: GitHub Actions
- **API Docs**: Swagger/OpenAPI

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: v20.0.0 or higher ([Download](https://nodejs.org/))
- **Docker**: v24.0+ and Docker Compose v2.20+ ([Install](https://docs.docker.com/get-docker/))
- **PostgreSQL**: v15+ (or use Docker)
- **Redis**: v7+ (or use Docker)

Optional:
- **Make**: For convenience commands
- **AWS CLI**: If deploying to AWS

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourorg/api-service.git
cd api-service
\`\`\`

### 2. Environment Configuration

Copy the example environment file and configure it:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your settings (see [Environment Variables](#environment-variables) section).

### 3. Start Dependencies with Docker

\`\`\`bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Verify services are running
docker-compose ps
\`\`\`

### 4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 5. Database Setup

\`\`\`bash
# Run migrations
npm run migrate

# Seed database with sample data
npm run seed
\`\`\`

### 6. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

API should now be running at http://localhost:3000

Visit http://localhost:3000/docs for interactive API documentation.

## 🔐 Environment Variables

Create a \`.env\` file in the root directory:

### Server Configuration
\`\`\`bash
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
\`\`\`

### Database
\`\`\`bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/mydb?schema=public
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=supersecretpassword

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
\`\`\`

### Authentication
\`\`\`bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
\`\`\`

### Redis
\`\`\`bash
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false
\`\`\`

### External Services
\`\`\`bash
# AWS (for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@example.com

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### Security
\`\`\`bash
# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3001,https://app.example.com
\`\`\`

## 📁 Project Structure

\`\`\`
api-service/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── types/             # TypeScript types
│   └── app.ts             # Express app setup
├── tests/
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Migration files
│   └── seeds/             # Seed data
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docs/                  # Additional documentation
├── scripts/               # Utility scripts
├── .env.example
├── package.json
└── tsconfig.json
\`\`\`

## 🌐 API Endpoints

### Authentication

| Method | Endpoint              | Description                    | Auth Required |
|:-------|:---------------------|:-------------------------------|:--------------|
| POST   | \`/api/v1/auth/register\` | Register new user            | No            |
| POST   | \`/api/v1/auth/login\`    | User login                   | No            |
| POST   | \`/api/v1/auth/logout\`   | User logout                  | Yes           |
| POST   | \`/api/v1/auth/refresh\`  | Refresh access token         | No            |
| POST   | \`/api/v1/auth/forgot-password\` | Request password reset | No    |
| POST   | \`/api/v1/auth/reset-password\` | Reset password       | No            |

### Users

| Method | Endpoint              | Description                    | Auth Required |
|:-------|:---------------------|:-------------------------------|:--------------|
| GET    | \`/api/v1/users\`        | List all users (paginated)   | Yes (Admin)   |
| GET    | \`/api/v1/users/:id\`    | Get user by ID               | Yes           |
| PUT    | \`/api/v1/users/:id\`    | Update user profile          | Yes (Owner)   |
| DELETE | \`/api/v1/users/:id\`    | Delete user account          | Yes (Owner)   |
| GET    | \`/api/v1/users/me\`     | Get current user profile     | Yes           |

### Posts

| Method | Endpoint              | Description                    | Auth Required |
|:-------|:---------------------|:-------------------------------|:--------------|
| GET    | \`/api/v1/posts\`        | List all posts               | No            |
| GET    | \`/api/v1/posts/:id\`    | Get post by ID               | No            |
| POST   | \`/api/v1/posts\`        | Create new post              | Yes           |
| PUT    | \`/api/v1/posts/:id\`    | Update post                  | Yes (Owner)   |
| DELETE | \`/api/v1/posts/:id\`    | Delete post                  | Yes (Owner)   |
| POST   | \`/api/v1/posts/:id/like\` | Like a post                | Yes           |

### Files

| Method | Endpoint              | Description                    | Auth Required |
|:-------|:---------------------|:-------------------------------|:--------------|
| POST   | \`/api/v1/files/upload\` | Upload file to S3            | Yes           |
| GET    | \`/api/v1/files/:id\`    | Get file metadata            | Yes           |
| DELETE | \`/api/v1/files/:id\`    | Delete file                  | Yes (Owner)   |

### Health & Monitoring

| Method | Endpoint          | Description                    | Auth Required |
|:-------|:-----------------|:-------------------------------|:--------------|
| GET    | \`/health\`         | Basic health check           | No            |
| GET    | \`/health/ready\`   | Readiness probe              | No            |
| GET    | \`/health/live\`    | Liveness probe               | No            |
| GET    | \`/metrics\`        | Prometheus metrics           | No            |

## 🔍 Example Requests

### Register a New User

\`\`\`bash
curl -X POST http://localhost:3000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
\`\`\`

### Login

\`\`\`bash
curl -X POST http://localhost:3000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
\`\`\`

### Create a Post (Authenticated)

\`\`\`bash
curl -X POST http://localhost:3000/api/v1/posts \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post",
    "tags": ["tutorial", "api"]
  }'
\`\`\`

### Get Posts with Pagination

\`\`\`bash
curl -X GET "http://localhost:3000/api/v1/posts?page=1&limit=10&sort=createdAt:desc"
\`\`\`

## 🧪 Testing

### Run All Tests

\`\`\`bash
npm test
\`\`\`

### Run Specific Test Suites

\`\`\`bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# With coverage
npm run test:coverage
\`\`\`

### Watch Mode (Development)

\`\`\`bash
npm run test:watch
\`\`\`

### Test Example

\`\`\`typescript
describe('POST /api/v1/auth/register', () => {
  it('should create a new user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('test@example.com');
    expect(response.body.data.tokens).toHaveProperty('accessToken');
  });
});
\`\`\`

## 🐳 Docker Deployment

### Build and Run with Docker Compose

\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
\`\`\`

### Production Docker Build

\`\`\`bash
# Build production image
docker build -t myapi:latest -f docker/Dockerfile .

# Run production container
docker run -d \\
  --name myapi \\
  -p 3000:3000 \\
  --env-file .env.production \\
  myapi:latest
\`\`\`

## 🚀 Deployment

### AWS Elastic Beanstalk

\`\`\`bash
# Initialize EB
eb init -p node.js-20 my-api

# Create environment
eb create production

# Deploy
eb deploy
\`\`\`

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: \`npm run build\`
4. Set run command: \`npm start\`

### Heroku

\`\`\`bash
# Create app
heroku create myapi

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
\`\`\`

### VPS (Ubuntu 22.04)

\`\`\`bash
# Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql redis nginx

# Setup app
cd /var/www/myapi
npm install
npm run build

# Setup PM2
pm2 start dist/index.js --name myapi
pm2 startup
pm2 save

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/myapi
\`\`\`

## 📊 Monitoring & Logging

### Health Checks

\`\`\`bash
# Basic health
curl http://localhost:3000/health

# Database connectivity
curl http://localhost:3000/health/ready

# Liveness probe
curl http://localhost:3000/health/live
\`\`\`

### Logs

\`\`\`bash
# Development logs
npm run dev

# Production logs with PM2
pm2 logs myapi

# Docker logs
docker-compose logs -f api
\`\`\`

### Metrics

Access Prometheus metrics at: http://localhost:3000/metrics

## 🔒 Security

### Implemented Security Measures

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ SQL injection prevention (ORM)
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Input validation with Joi/Zod
- ✅ File upload restrictions

### Security Best Practices

1. **Never commit \`.env\` files**
2. **Rotate secrets regularly**
3. **Use HTTPS in production**
4. **Enable 2FA for admin accounts**
5. **Regular dependency audits**: \`npm audit\`

## 🛠 Development Commands

\`\`\`bash
# Development
npm run dev              # Start dev server with hot reload
npm run dev:debug        # Start with Node debugger

# Building
npm run build            # Compile TypeScript to JavaScript
npm run build:watch      # Watch mode

# Database
npm run migrate          # Run migrations
npm run migrate:rollback # Rollback last migration
npm run seed             # Seed database

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report

# Production
npm start                # Start production server
\`\`\`

## 📚 Additional Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Authentication Flow](./docs/AUTH.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 👥 Team

- **Tech Lead**: @username
- **Backend**: @developer1, @developer2
- **DevOps**: @devops1

## 📞 Support

- 📧 Email: dev-support@example.com
- 💬 Slack: #api-support
- 🐛 Issues: [GitHub Issues](https://github.com/org/repo/issues)
`
  },
  {
    id: 'data-science',
    title: "Data Science / ML",
    description: "Tailored for notebooks, model descriptions, dataset sources, and analysis results.",
    tags: ["Python", "Jupyter", "Research"],
    content: `
# Customer Churn Prediction using Machine Learning

A comprehensive data science project that analyzes customer behavior patterns and predicts churn probability using ensemble methods (Random Forest, XGBoost, LightGBM). This project includes full exploratory data analysis, feature engineering, model comparison, and deployment-ready prediction pipeline.

**Project Status**: ✅ Completed | 📊 Accuracy: 86.3% | 🎯 AUC-ROC: 0.91

## 📋 Table of Contents

- [Overview](#overview)
- [Business Problem](#business-problem)
- [Dataset](#dataset)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Methodology](#methodology)
- [Results](#results)
- [Model Deployment](#model-deployment)
- [Future Work](#future-work)

## 🎯 Overview

### What is This Project About?

Customer churn (the rate at which customers stop doing business with a company) is a critical metric for subscription-based businesses. This project builds a machine learning solution to:

1. **Predict** which customers are likely to churn in the next month
2. **Identify** key factors driving customer churn
3. **Provide** actionable insights for retention strategies
4. **Enable** proactive customer outreach programs

### Key Achievements

- Achieved **86.3% accuracy** in predicting customer churn
- Identified top 5 churn drivers: contract type, tenure, monthly charges, tech support, payment method
- Reduced false negatives by 35% compared to logistic regression baseline
- Built production-ready prediction pipeline with FastAPI

### Technologies Used

- **Languages**: Python 3.10
- **ML Libraries**: scikit-learn, XGBoost, LightGBM, CatBoost
- **Data Processing**: pandas, NumPy
- **Visualization**: matplotlib, seaborn, plotly
- **Notebooks**: Jupyter Lab
- **Model Tracking**: MLflow
- **Deployment**: FastAPI, Docker

## 💼 Business Problem

### Context

TelcoConnect (fictional company) is experiencing a **27% annual churn rate**, which is costing the company $12M annually in lost revenue. The business needs to:

- Identify at-risk customers before they churn
- Understand why customers are leaving
- Implement targeted retention campaigns

### Project Goals

1. **Primary**: Build a model with >85% accuracy for churn prediction
2. **Secondary**: Achieve precision >0.80 to minimize wasted retention efforts
3. **Tertiary**: Provide interpretable results for business stakeholders

### Success Metrics

- **Model Performance**: Accuracy >85%, Precision >0.80, Recall >0.75
- **Business Impact**: Enable retention campaigns targeting top 10% at-risk customers
- **ROI**: Each correct prediction saves avg $1,200 in customer lifetime value

## 📊 Dataset

### Source

**Dataset**: [Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn)  
**License**: CC0: Public Domain  
**Size**: 7,043 rows × 21 columns

### Dataset Overview

The dataset contains customer information for a telecommunications company:

- **Customers**: 7,043 unique customer records
- **Time Period**: Q2 2020 to Q3 2020 (simulated)
- **Churn Rate**: 26.5% (1,869 churned customers)

### Features

#### Demographic Features
- \`gender\`: Customer gender (Male, Female)
- \`SeniorCitizen\`: Whether customer is 65+ (0, 1)
- \`Partner\`: Whether customer has a partner (Yes, No)
- \`Dependents\`: Whether customer has dependents (Yes, No)

#### Service Features
- \`tenure\`: Number of months as customer (0-72)
- \`PhoneService\`: Phone service subscription (Yes, No)
- \`MultipleLines\`: Multiple phone lines (Yes, No, No phone service)
- \`InternetService\`: Type of internet (DSL, Fiber optic, No)
- \`OnlineSecurity\`: Online security add-on (Yes, No, No internet service)
- \`OnlineBackup\`: Online backup add-on (Yes, No, No internet service)
- \`DeviceProtection\`: Device protection add-on (Yes, No, No internet service)
- \`TechSupport\`: Tech support add-on (Yes, No, No internet service)
- \`StreamingTV\`: TV streaming service (Yes, No, No internet service)
- \`StreamingMovies\`: Movie streaming service (Yes, No, No internet service)

#### Account Features
- \`Contract\`: Contract type (Month-to-month, One year, Two year)
- \`PaperlessBilling\`: Paperless billing (Yes, No)
- \`PaymentMethod\`: Payment method (Electronic check, Mailed check, Bank transfer, Credit card)
- \`MonthlyCharges\`: Current monthly charge ($18.25 - $118.75)
- \`TotalCharges\`: Total amount charged to date

#### Target Variable
- \`Churn\`: Whether customer churned (Yes, No)

### Data Quality

| Issue | Count | Resolution |
|:------|:------|:-----------|
| Missing Values | 11 in TotalCharges | Imputed with median |
| Duplicates | 0 | None found |
| Outliers | 3% in MonthlyCharges | Retained (legitimate high-spend customers) |
| Class Imbalance | 73.5% / 26.5% | SMOTE applied |

## 📁 Project Structure

\`\`\`
customer-churn-prediction/
│
├── data/
│   ├── raw/                      # Original dataset
│   │   └── WA_Fn-UseC_-Telco-Customer-Churn.csv
│   ├── processed/                # Cleaned and engineered data
│   │   ├── train.csv
│   │   ├── test.csv
│   │   └── validation.csv
│   └── external/                 # External reference data
│
├── notebooks/
│   ├── 01_EDA.ipynb             # Exploratory Data Analysis
│   ├── 02_Data_Cleaning.ipynb   # Data cleaning and preprocessing
│   ├── 03_Feature_Engineering.ipynb  # Feature creation
│   ├── 04_Baseline_Models.ipynb      # Simple model benchmarks
│   ├── 05_Model_Training.ipynb       # Full model training
│   ├── 06_Model_Evaluation.ipynb     # Model comparison & selection
│   └── 07_Model_Interpretation.ipynb # SHAP analysis
│
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── load_data.py         # Data loading utilities
│   │   ├── preprocess.py        # Preprocessing functions
│   │   └── feature_engineering.py
│   ├── models/
│   │   ├── train.py             # Training scripts
│   │   ├── predict.py           # Prediction scripts
│   │   └── evaluate.py          # Evaluation metrics
│   ├── visualization/
│   │   └── plots.py             # Plotting functions
│   └── utils/
│       ├── config.py            # Configuration
│       └── helpers.py           # Helper functions
│
├── models/
│   ├── random_forest_v1.pkl     # Saved model files
│   ├── xgboost_v1.pkl
│   ├── lightgbm_v1.pkl
│   └── final_model.pkl          # Best performing model
│
├── api/
│   ├── main.py                  # FastAPI application
│   ├── schemas.py               # Request/response models
│   └── requirements.txt
│
├── tests/
│   ├── test_preprocessing.py
│   ├── test_models.py
│   └── test_api.py
│
├── reports/
│   ├── figures/                 # Generated plots
│   ├── results.md               # Model results summary
│   └── business_insights.pdf    # Executive summary
│
├── deployment/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── kubernetes/
│
├── .gitignore
├── environment.yml              # Conda environment
├── requirements.txt             # Python dependencies
├── README.md
└── LICENSE
\`\`\`

## 🛠 Installation

### Prerequisites

- Python 3.10 or higher
- Anaconda or Miniconda (recommended)
- Jupyter Lab
- Git

### Option 1: Conda Environment (Recommended)

\`\`\`bash
# Clone the repository
git clone https://github.com/username/customer-churn-prediction.git
cd customer-churn-prediction

# Create conda environment
conda env create -f environment.yml

# Activate environment
conda activate churn-analysis

# Verify installation
python -c "import sklearn, xgboost, lightgbm; print('All packages installed!')"
\`\`\`

### Option 2: Virtual Environment (venv)

\`\`\`bash
# Clone the repository
git clone https://github.com/username/customer-churn-prediction.git
cd customer-churn-prediction

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

### Dependencies

Key packages (full list in requirements.txt):

\`\`\`txt
pandas==2.0.3
numpy==1.24.3
scikit-learn==1.3.0
xgboost==2.0.0
lightgbm==4.0.0
catboost==1.2
matplotlib==3.7.2
seaborn==0.12.2
plotly==5.15.0
jupyter==1.0.0
shap==0.42.1
imbalanced-learn==0.11.0
mlflow==2.5.0
fastapi==0.100.0
uvicorn==0.23.0
\`\`\`

## 🚀 Usage

### 1. Download the Dataset

\`\`\`bash
# Create data directory
mkdir -p data/raw

# Download from Kaggle (requires kaggle API setup)
kaggle datasets download -d blastchar/telco-customer-churn -p data/raw

# Unzip
unzip data/raw/telco-customer-churn.zip -d data/raw
\`\`\`

### 2. Run Notebooks in Order

\`\`\`bash
# Start Jupyter Lab
jupyter lab

# Navigate to notebooks/ folder and run in sequence:
# 01_EDA.ipynb → 02_Data_Cleaning.ipynb → ... → 07_Model_Interpretation.ipynb
\`\`\`

### 3. Train Models via Scripts

\`\`\`bash
# Preprocess data
python src/data/preprocess.py --input data/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv --output data/processed/

# Train models
python src/models/train.py --model random_forest --data data/processed/train.csv

# Train all models with hyperparameter tuning
python src/models/train.py --model all --tune --cv 5
\`\`\`

### 4. Make Predictions

\`\`\`bash
# Predict on new data
python src/models/predict.py --model models/final_model.pkl --input data/new_customers.csv --output predictions.csv
\`\`\`

### 5. Run API Server (for production predictions)

\`\`\`bash
cd api
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test the API
curl -X POST "http://localhost:8000/predict" \\
  -H "Content-Type: application/json" \\
  -d '{
    "gender": "Female",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "Dependents": "No",
    "tenure": 12,
    "PhoneService": "Yes",
    "InternetService": "Fiber optic",
    "Contract": "Month-to-month",
    "MonthlyCharges": 70.5
  }'
\`\`\`

## 🔬 Methodology

### 1. Exploratory Data Analysis (EDA)

**Key Findings**:
- Customers with month-to-month contracts churn **42%** vs 11% for long-term contracts
- Fiber optic customers churn **41%** vs 19% for DSL customers
- Customers without tech support churn **41%** vs 15% with tech support
- Churn rate inversely correlates with tenure (strong relationship)

**Visualizations Created**:
- Churn distribution by contract type
- Correlation heatmap of numerical features
- Box plots for monthly charges by churn status
- Tenure distribution for churned vs retained

### 2. Data Preprocessing

**Steps Taken**:

1. **Missing Value Treatment**: 
   - Imputed 11 missing TotalCharges with median grouped by tenure
   
2. **Feature Encoding**:
   - Binary features (Yes/No) → 0/1
   - Multi-class features → One-Hot Encoding
   - Ordinal features preserved order

3. **Feature Scaling**:
   - StandardScaler for tree-based models (optional)
   - MinMaxScaler for neural networks (future work)

4. **Class Imbalance**:
   - Applied SMOTE (Synthetic Minority Over-sampling)
   - Balanced to 60/40 split

### 3. Feature Engineering

**New Features Created**:

1. **tenure_months_binned**: Categorized tenure (0-12, 13-24, 25-48, 49+)
2. **avg_monthly_spend**: TotalCharges / tenure
3. **service_count**: Total number of services subscribed
4. **has_premium_services**: Binary flag for any premium add-ons
5. **charge_tenure_ratio**: MonthlyCharges * tenure interaction
6. **contract_value**: Indicator combining contract and payment method

**Feature Importance (Top 10)**:

| Rank | Feature | Importance | Description |
|:-----|:--------|:-----------|:------------|
| 1 | tenure | 0.185 | Months as customer |
| 2 | MonthlyCharges | 0.162 | Current monthly bill |
| 3 | Contract_Month-to-month | 0.143 | Short-term contract |
| 4 | TotalCharges | 0.109 | Lifetime spending |
| 5 | InternetService_Fiber | 0.087 | Fiber internet |
| 6 | PaymentMethod_Electronic | 0.076 | Auto-pay method |
| 7 | TechSupport_No | 0.068 | No tech support |
| 8 | OnlineSecurity_No | 0.054 | No online security |
| 9 | service_count | 0.049 | Total services |
| 10 | PaperlessBilling_Yes | 0.041 | Paperless billing |

### 4. Model Training & Selection

**Models Evaluated**:

| Model | Description | Use Case |
|:------|:-----------|:---------|
| Logistic Regression | Baseline linear model | Interpretable baseline |
| Decision Tree | Simple tree-based model | Feature importance |
| Random Forest | Ensemble of trees | Robust predictions |
| XGBoost | Gradient boosting | High performance |
| LightGBM | Fast gradient boosting | Large datasets |
| CatBoost | Handles categorical data | Categorical-heavy data |

**Hyperparameter Tuning**:
- Method: Randomized Search CV (5-fold)
- Metric: ROC-AUC Score
- Iterations: 100 per model
- Computing: 12-core CPU, 4 hours

### 5. Model Evaluation

**Cross-Validation Strategy**:
- 5-Fold Stratified Cross-Validation
- Train/Val/Test Split: 60% / 20% / 20%
- Stratified to maintain class balance

**Evaluation Metrics**:
- Accuracy, Precision, Recall, F1-Score
- ROC-AUC, PR-AUC
- Confusion Matrix
- Classification Report

## 📈 Results

### Model Performance Comparison

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Training Time |
|:------|:---------|:----------|:-------|:---------|:--------|:-------|:--------------|
| Logistic Regression | 80.1% | 0.68 | 0.62 | 0.65 | 0.82 | 0.71 | 2s |
| Decision Tree | 78.5% | 0.63 | 0.71 | 0.67 | 0.79 | 0.68 | 5s |
| Random Forest | **85.3%** | 0.82 | 0.71 | 0.76 | **0.91** | **0.84** | 45s |
| XGBoost | **86.3%** | **0.84** | 0.73 | 0.78 | 0.90 | 0.83 | 38s |
| LightGBM | 84.7% | 0.80 | **0.75** | **0.77** | 0.90 | 0.82 | 12s |
| CatBoost | 85.1% | 0.81 | 0.72 | 0.76 | 0.90 | 0.83 | 95s |

**🏆 Best Model**: XGBoost
- **Why**: Highest accuracy (86.3%) and precision (0.84) with competitive training time
- **Runner-up**: Random Forest (more interpretable, nearly as good)

### Detailed XGBoost Results

\`\`\`
Classification Report:
              precision    recall  f1-score   support

  Not Churned       0.88      0.95      0.91      1038
      Churned       0.84      0.73      0.78       371

     accuracy                           0.86      1409
    macro avg       0.86      0.84      0.85      1409
weighted avg       0.87      0.86      0.86      1409

ROC-AUC Score: 0.9037
PR-AUC Score: 0.8291
\`\`\`

### Confusion Matrix (Test Set)

\`\`\`
                 Predicted
                 Not Churn  Churn
Actual Not Churn    987      51
       Churn        100     271
\`\`\`

**Interpretation**:
- **True Negatives**: 987 (correctly identified non-churners)
- **False Positives**: 51 (incorrectly flagged as churners)
- **False Negatives**: 100 (missed churners - **business cost**)
- **True Positives**: 271 (correctly identified churners)

### Feature Importance (SHAP Analysis)

![SHAP Summary Plot](reports/figures/shap_summary.png)

**Top Drivers of Churn**:
1. **Contract Type**: Month-to-month contracts increase churn probability by 42%
2. **Tenure**: Each additional year reduces churn risk by 15%
3. **Tech Support**: Lack of tech support increases churn by 28%
4. **Monthly Charges**: Charges >$70 increase churn by 22%
5. **Internet Type**: Fiber optic increases churn by 18% (likely due to price)

### Business Impact Simulation

Based on model predictions on 1,000 customers:

| Metric | Value | Financial Impact |
|:-------|:------|:-----------------|
| At-risk customers identified | 268 | - |
| True churners caught | 195 (73% recall) | $234,000 saved |
| False alarms | 73 | $14,600 wasted effort |
| **Net benefit** | - | **$219,400** |

**Assumption**: Retention campaign costs $200 per customer, saves $1,200 if successful

## 🚀 Model Deployment

### Local Prediction API

A FastAPI service for real-time churn predictions:

\`\`\`bash
# Start the API server
cd api
uvicorn main:app --reload --port 8000

# Server runs at: http://localhost:8000
# Docs available at: http://localhost:8000/docs
\`\`\`

**API Endpoints**:

1. **POST /predict** - Single customer prediction
2. **POST /predict/batch** - Batch predictions (up to 1000)
3. **GET /health** - Health check
4. **GET /model/info** - Model metadata

**Example Request**:

\`\`\`python
import requests

customer_data = {
    "gender": "Female",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "Dependents": "No",
    "tenure": 12,
    "PhoneService": "Yes",
    "MultipleLines": "No",
    "InternetService": "Fiber optic",
    "OnlineSecurity": "No",
    "OnlineBackup": "No",
    "DeviceProtection": "No",
    "TechSupport": "No",
    "StreamingTV": "No",
    "StreamingMovies": "No",
    "Contract": "Month-to-month",
    "PaperlessBilling": "Yes",
    "PaymentMethod": "Electronic check",
    "MonthlyCharges": 70.35,
    "TotalCharges": 844.2
}

response = requests.post(
    "http://localhost:8000/predict",
    json=customer_data
)

print(response.json())
# Output: {"churn_probability": 0.78, "prediction": "Churn", "risk_level": "High"}
\`\`\`

### Docker Deployment

\`\`\`bash
# Build image
docker build -t churn-prediction-api:v1 .

# Run container
docker run -d -p 8000:8000 churn-prediction-api:v1

# Test
curl http://localhost:8000/health
\`\`\`

### Production Considerations

For production deployment:

1. **Model Versioning**: Use MLflow for model registry
2. **Monitoring**: Track prediction drift with Evidently
3. **A/B Testing**: Compare model versions in production
4. **Logging**: Log all predictions for audit trail
5. **Rate Limiting**: Implement rate limits for API
6. **Authentication**: Add API key authentication

## 📊 Notebooks Overview

### 01_EDA.ipynb - Exploratory Data Analysis
**Duration**: ~30 minutes  
**Output**: 15 visualizations, statistical summaries

**Key Sections**:
- Data loading and inspection
- Missing value analysis
- Distribution plots for all features
- Churn rate by demographic segments
- Correlation analysis
- Statistical tests (Chi-square, t-tests)

**Key Insights**:
- Month-to-month contracts have 3.8x higher churn
- Fiber optic customers churn 2.1x more than DSL
- Tech support reduces churn by 63%

### 02_Data_Cleaning.ipynb - Data Preprocessing
**Duration**: ~20 minutes  
**Output**: Cleaned dataset saved to \`data/processed/\`

**Cleaning Steps**:
1. Handle missing TotalCharges (11 rows)
2. Fix data type inconsistencies
3. Remove duplicates (none found)
4. Validate ranges and constraints
5. Create train/test split (80/20)

### 03_Feature_Engineering.ipynb - Feature Creation
**Duration**: ~25 minutes  
**Output**: 6 new engineered features

**Features Created**:
- \`tenure_group\`: Binned tenure categories
- \`avg_monthly_charges\`: TotalCharges / tenure
- \`service_count\`: Number of subscribed services
- \`has_premium\`: Flag for premium services
- \`contract_payment\`: Interaction feature
- \`charge_ratio\`: MonthlyCharges / median ratio

### 04_Baseline_Models.ipynb - Initial Models
**Duration**: ~15 minutes  
**Output**: Baseline performance benchmarks

Establishes performance baselines:
- Majority class baseline: 73.5% accuracy
- Logistic Regression: 80.1% accuracy
- Simple Decision Tree: 78.5% accuracy

### 05_Model_Training.ipynb - Advanced Models
**Duration**: ~2 hours (with hyperparameter tuning)  
**Output**: 6 trained models with optimized hyperparameters

Trains and tunes:
- Random Forest (100 trees)
- XGBoost (200 rounds)
- LightGBM (fast training)
- CatBoost (categorical handling)

### 06_Model_Evaluation.ipynb - Model Comparison
**Duration**: ~30 minutes  
**Output**: Comprehensive evaluation metrics and plots

**Evaluation Includes**:
- Performance metrics table
- ROC curves (all models)
- Precision-Recall curves
- Confusion matrices
- Cross-validation results
- Model selection justification

### 07_Model_Interpretation.ipynb - Explainability
**Duration**: ~40 minutes  
**Output**: SHAP plots, feature importance, partial dependence plots

**Analysis Includes**:
- SHAP summary plot (global feature importance)
- SHAP waterfall plots (individual predictions)
- Partial dependence plots
- Feature interaction analysis
- Business recommendations

## 💡 Business Insights & Recommendations

### Top 3 Actionable Insights

#### 1. Contract Strategy 🎯
**Finding**: Month-to-month customers churn at 42% vs 11% for contract customers

**Recommendations**:
- Offer 10-15% discount for 1-year contracts
- Implement "contract transition" campaigns at months 8-10
- Provide loyalty bonuses for contract renewals
- Create hybrid "flex contracts" with lower early termination fees

**Expected Impact**: 25% reduction in month-to-month churn

#### 2. Tech Support Matters 🛠️
**Finding**: Customers without tech support churn 63% more often

**Recommendations**:
- Include 3 months free tech support for new customers
- Proactive outreach to customers who call support >2 times
- Create self-service knowledge base to reduce friction
- Train support staff in retention techniques

**Expected Impact**: 18% reduction in overall churn

#### 3. Fiber Optic Pricing 💰
**Finding**: Fiber customers churn 2.1x more despite premium service

**Recommendations**:
- Review fiber optic pricing strategy (currently 40% more than DSL)
- Bundle fiber with premium features (security, backup)
- Implement "price lock" guarantees for fiber customers
- Create competitive matching program

**Expected Impact**: 15% reduction in fiber optic churn

### Retention Campaign Strategy

**Target Segment**: Top 10% churn risk (based on model scores)

**Campaign Elements**:
1. **Personalized Outreach**: Email + phone call within 48 hours
2. **Custom Offers**: Based on customer's service usage
3. **Save Desk**: Dedicated retention specialists
4. **Win-back**: Re-engagement campaign for recent churners

**Budget**: $200 per customer in campaign
**Expected ROI**: 3.5x (save $1,200 per successful retention)

## 🔮 Future Work

### Short-term (Next 3 Months)
- [ ] Implement A/B testing framework for retention campaigns
- [ ] Add demographic data (location, income) if available
- [ ] Build customer lifetime value (CLV) prediction model
- [ ] Create interactive dashboard for stakeholders (Streamlit)
- [ ] Set up automated model retraining pipeline

### Medium-term (3-6 Months)
- [ ] Deep learning model (LSTM for temporal patterns)
- [ ] Causal inference analysis (why do interventions work?)
- [ ] Survival analysis for time-to-churn predictions
- [ ] Multi-model ensemble with stacking
- [ ] Real-time prediction streaming with Kafka

### Long-term (6-12 Months)
- [ ] Prescriptive analytics (optimal intervention timing)
- [ ] Customer segmentation with clustering
- [ ] Integration with CRM system (Salesforce)
- [ ] AutoML pipeline for continuous improvement
- [ ] Cost-sensitive learning (different costs for FP vs FN)

## 🐛 Troubleshooting

### Common Issues

**Issue**: "TotalCharges cannot be converted to float"
\`\`\`python
# Solution: Convert with error handling
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)
\`\`\`

**Issue**: ImportError with XGBoost
\`\`\`bash
# Solution: Install with conda instead of pip
conda install -c conda-forge xgboost
\`\`\`

**Issue**: Kernel dying during model training
\`\`\`python
# Solution: Reduce hyperparameter search space
param_grid = {
    'n_estimators': [50, 100],  # Reduced from [50, 100, 200]
    'max_depth': [3, 5],        # Reduced from [3, 5, 7, 10]
}
\`\`\`

**Issue**: API returns 422 validation error
\`\`\`bash
# Solution: Check that all required fields are included
# See api/schemas.py for complete field list
\`\`\`

## 📚 Additional Resources

### Learning Materials
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [SHAP Library Guide](https://shap.readthedocs.io/)
- [Kaggle Churn Prediction Tutorial](https://www.kaggle.com/learn/intro-to-machine-learning)

### Research Papers
- Chen & Guestrin (2016): "XGBoost: A Scalable Tree Boosting System"
- Lundberg & Lee (2017): "A Unified Approach to Interpreting Model Predictions"

### Related Projects
- [Customer Segmentation with K-Means](https://github.com/example/segmentation)
- [Time Series Churn Prediction with LSTM](https://github.com/example/lstm-churn)

## 🤝 Contributing

Contributions welcome! Areas for improvement:

1. **Feature Engineering**: Propose new features
2. **Model Experimentation**: Try neural networks, ensemble methods
3. **Visualization**: Create new plots for insights
4. **Documentation**: Improve explanations
5. **Testing**: Add unit tests for preprocessing pipeline

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 Citation

If you use this project in your research or work, please cite:

\`\`\`bibtex
@misc{churn_prediction_2024,
  author = {Your Name},
  title = {Customer Churn Prediction using Machine Learning},
  year = {2024},
  publisher = {GitHub},
  url = {https://github.com/username/customer-churn-prediction}
}
\`\`\`

## 📧 Contact

**Author**: Your Name  
**Email**: your.email@example.com  
**LinkedIn**: [Your Profile](https://linkedin.com/in/yourprofile)  
**GitHub**: [@yourusername](https://github.com/yourusername)

## 📜 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Dataset provided by IBM Watson Analytics
- Kaggle community for inspiration and notebooks
- Open-source ML community for amazing tools
- My university advisor for project guidance

---

**Last Updated**: December 2024  
**Project Status**: ✅ Complete and Deployed  
**Maintained**: Yes, active development
`
  },
  {
    id: 'documentation',
    title: "Documentation Heavy",
    description: "Features a table of contents, deep API references, and extensive examples.",
    tags: ["Frameworks", "Complex Apps", "SaaS"],
    content: `
# MegaFramework Documentation

**The Modern Web Framework for Building Scalable Enterprise Applications**

Welcome to MegaFramework - a next-generation full-stack framework that combines the best of React, server-side rendering, and edge computing. Built for teams that need to ship fast without sacrificing performance, security, or developer experience.

**Version**: 3.0.0 | **License**: MIT | **Status**: Stable ✅

## 🚀 Quick Links

- 📖 [Full Documentation](https://docs.megaframework.com)
- 🎓 [Interactive Tutorial](https://megaframework.com/tutorial)
- 💬 [Community Discord](https://discord.gg/megaframework)
- 📺 [Video Courses](https://megaframework.com/learn)
- 🐛 [Issue Tracker](https://github.com/mega/framework/issues)

## 📑 Table of Contents

### Getting Started
- [What is MegaFramework?](#what-is-megaframework)
- [Why MegaFramework?](#why-megaframework)
- [Installation](#installation)
- [Your First App](#your-first-app)
- [Project Structure](#project-structure)

### Core Concepts
- [Routing](#routing)
- [Data Fetching](#data-fetching)
- [State Management](#state-management)
- [Styling](#styling)
- [API Routes](#api-routes)

### Advanced Topics
- [Server-Side Rendering (SSR)](#server-side-rendering)
- [Static Site Generation (SSG)](#static-site-generation)
- [Edge Functions](#edge-functions)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [Caching Strategies](#caching-strategies)
- [Internationalization (i18n)](#internationalization)

### API Reference
- [CLI Commands](#cli-commands)
- [Configuration](#configuration)
- [Core APIs](#core-apis)
- [Plugins](#plugins)

### Deployment
- [Vercel](#deploy-to-vercel)
- [Netlify](#deploy-to-netlify)
- [AWS](#deploy-to-aws)
- [Docker](#deploy-with-docker)

### Additional Resources
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Migration Guides](#migration-guides)
- [Community Plugins](#community-plugins)

---

## What is MegaFramework?

MegaFramework is a **full-stack React framework** that provides everything you need to build production-ready web applications:

### Key Features

✅ **Hybrid Rendering**: Mix SSR, SSG, and CSR in one app  
✅ **File-Based Routing**: Routes from your file system  
✅ **API Routes**: Build your backend alongside your frontend  
✅ **Edge Functions**: Run code at the edge for lowest latency  
✅ **TypeScript First**: Full type safety from database to UI  
✅ **Zero Config**: Sensible defaults, configure only what you need  
✅ **Optimized Builds**: Automatic code splitting and lazy loading  
✅ **Developer Experience**: Hot reload, error overlay, time-travel debugging

### What Can You Build?

- 🛍️ **E-commerce Sites**: High-performance storefronts with SEO
- 📱 **SaaS Applications**: Full-stack apps with auth and payments
- 📰 **Content Sites**: Blogs, documentation, marketing pages
- 🎮 **Interactive Apps**: Dashboards, tools, games
- 🌐 **Multi-tenant Platforms**: Enterprise apps with customization

## Why MegaFramework?

### vs Next.js
- ✅ Simpler data fetching APIs
- ✅ Built-in state management
- ✅ Better edge function support
- ✅ Native TypeScript (no compilation needed)

### vs Remix
- ✅ More flexible rendering options
- ✅ Established ecosystem (5+ years)
- ✅ Better static site generation

### vs SvelteKit
- ✅ Larger React ecosystem
- ✅ More enterprise adoption
- ✅ Richer tooling and IDE support

### The Numbers

- **1.2M** weekly downloads
- **45K** GitHub stars
- **2,500+** companies in production
- **99.9%** uptime on framework CDN
- **<100ms** p50 response time

## Installation

### Requirements

- Node.js 18.17 or later
- macOS, Windows, or Linux

### Create a New App

The fastest way to get started:

\`\`\`bash
# Using npx (npm 5.2+)
npx create-mega-app my-app

# Using yarn
yarn create mega-app my-app

# Using pnpm
pnpm create mega-app my-app

# With TypeScript (recommended)
npx create-mega-app my-app --typescript

# With a template
npx create-mega-app my-app --template blog
# Available templates: blog, e-commerce, dashboard, docs, landing
\`\`\`

### Manual Installation

Add to an existing project:

\`\`\`bash
npm install megaframework react react-dom

# Peer dependencies
npm install --save-dev @types/react @types/react-dom typescript
\`\`\`

Create \`mega.config.ts\`:

\`\`\`typescript
import { defineConfig } from 'megaframework';

export default defineConfig({
  // Your config here
});
\`\`\`

Add scripts to \`package.json\`:

\`\`\`json
{
  "scripts": {
    "dev": "mega dev",
    "build": "mega build",
    "start": "mega start",
    "lint": "mega lint"
  }
}
\`\`\`

## Your First App

### 1. Create a Page

Create \`pages/index.tsx\`:

\`\`\`typescript
export default function Home() {
  return (
    <div>
      <h1>Welcome to MegaFramework!</h1>
      <p>Build something amazing.</p>
    </div>
  );
}
\`\`\`

### 2. Add Styling

MegaFramework supports CSS Modules, Tailwind, Styled Components, and more.

Using CSS Modules (\`index.module.css\`):

\`\`\`css
.container {
  min-height: 100vh;
  padding: 4rem;
  text-align: center;
}

.title {
  font-size: 3rem;
  color: #0070f3;
}
\`\`\`

\`\`\`typescript
import styles from './index.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome!</h1>
    </div>
  );
}
\`\`\`

### 3. Fetch Data

\`\`\`typescript
import { getServerData } from 'megaframework';

export default function Blog({ posts }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// Runs on the server
export const getData = getServerData(async () => {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return { props: { posts } };
});
\`\`\`

### 4. Add Dynamic Routes

Create \`pages/blog/[slug].tsx\`:

\`\`\`typescript
import { useRouter } from 'megaframework/router';
import { getServerData } from 'megaframework';

export default function BlogPost({ post }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export const getData = getServerData(async ({ params }) => {
  const post = await fetch('https://api.example.com/posts/${params.slug}');
  
  return {
    props: { post: await post.json() },
    revalidate: 60 // ISR: Revalidate every 60 seconds
  };
});

// Generate static paths at build time
export const getPaths = getServerData(async () => {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: true // Enable ISR for new paths
  };
});
\`\`\`

### 5. Create an API Route

Create \`pages/api/hello.ts\`:

\`\`\`typescript
import { NextApiRequest, NextApiResponse } from 'megaframework';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ 
    message: 'Hello from MegaFramework!',
    timestamp: new Date().toISOString()
  });
}
\`\`\`

Advanced API route with database:

\`\`\`typescript
import { db } from '@/lib/database';
import { withAuth } from '@/middleware/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await db.user.findMany();
    return res.status(200).json(users);
  }
  
  if (req.method === 'POST') {
    const user = await db.user.create({
      data: req.body
    });
    return res.status(201).json(user);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler); // Protected route
\`\`\`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000 🎉

## Project Structure

Recommended structure for a MegaFramework app:

\`\`\`
my-mega-app/
├── pages/              # File-based routes
│   ├── index.tsx       # / route
│   ├── about.tsx       # /about route
│   ├── blog/
│   │   ├── index.tsx   # /blog route
│   │   └── [slug].tsx  # /blog/:slug route
│   ├── api/            # API routes
│   │   └── users.ts    # /api/users endpoint
│   ├── _app.tsx        # Custom App component
│   └── _document.tsx   # Custom Document
│
├── components/         # Reusable components
│   ├── Button.tsx
│   ├── Header.tsx
│   └── Layout.tsx
│
├── lib/                # Utility functions
│   ├── database.ts
│   ├── auth.ts
│   └── api.ts
│
├── styles/             # Global styles
│   ├── globals.css
│   └── variables.css
│
├── public/             # Static files
│   ├── images/
│   └── favicon.ico
│
├── middleware/         # Custom middleware
│   └── auth.ts
│
├── types/              # TypeScript types
│   └── index.ts
│
├── mega.config.ts      # Framework configuration
├── tsconfig.json       # TypeScript configuration
├── package.json
└── .env.local          # Environment variables
\`\`\`

## Routing

### File-Based Routing

MegaFramework uses your file system as the API for routes:

| File Path | URL |
|:----------|:----|
| \`pages/index.tsx\` | \`/\` |
| \`pages/about.tsx\` | \`/about\` |
| \`pages/blog/index.tsx\` | \`/blog\` |
| \`pages/blog/first-post.tsx\` | \`/blog/first-post\` |
| \`pages/blog/[slug].tsx\` | \`/blog/:slug\` |
| \`pages/posts/[...all].tsx\` | \`/posts/*\` (catch-all) |
| \`pages/[[...slug]].tsx\` | \`/*\` (optional catch-all) |

### Dynamic Routes

\`\`\`typescript
// pages/posts/[id].tsx
import { useRouter } from 'megaframework/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>Post: {id}</div>;
}
\`\`\`

### Nested Dynamic Routes

\`\`\`typescript
// pages/shop/[category]/[product].tsx
export default function Product() {
  const router = useRouter();
  const { category, product } = router.query;
  
  return <div>{category} - {product}</div>;
}
// URL: /shop/electronics/laptop
\`\`\`

### Catch-All Routes

\`\`\`typescript
// pages/docs/[...slug].tsx
export default function Docs() {
  const router = useRouter();
  const { slug } = router.query; // slug is an array
  
  return <div>Docs: {slug?.join(' / ')}</div>;
}
// URL: /docs/getting-started/installation
// slug: ['getting-started', 'installation']
\`\`\`

### Programmatic Navigation

\`\`\`typescript
import { useRouter } from 'megaframework/router';
import Link from 'megaframework/link';

export default function Navigation() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/about');
    // Or with query params
    router.push({
      pathname: '/blog',
      query: { page: '2' }
    });
  };
  
  return (
    <div>
      <Link href="/about">About</Link>
      <button onClick={handleClick}>Go to About</button>
    </div>
  );
}
\`\`\`

## Data Fetching

MegaFramework offers multiple data fetching strategies:

### Server-Side Rendering (SSR)

Fetch data on every request:

\`\`\`typescript
import { getServerData } from 'megaframework';

export const getData = getServerData(async (context) => {
  const { req, res, params, query } = context;
  
  // Access request headers
  const userAgent = req.headers['user-agent'];
  
  // Fetch data
  const data = await fetch('https://api.example.com/data');
  
  return {
    props: {
      data: await data.json(),
      userAgent
    }
  };
});

export default function Page({ data, userAgent }) {
  return <div>{data.title}</div>;
}
\`\`\`

### Static Site Generation (SSG)

Generate pages at build time:

\`\`\`typescript
import { getStaticData } from 'megaframework';

export const getData = getStaticData(async () => {
  const posts = await fetchPosts();
  
  return {
    props: { posts },
    revalidate: 3600 // ISR: Regenerate every hour
  };
});
\`\`\`

### Incremental Static Regeneration (ISR)

Update static pages after deployment:

\`\`\`typescript
export const getData = getStaticData(async () => {
  return {
    props: { data: await fetchData() },
    revalidate: 10 // Regenerate every 10 seconds
  };
});
\`\`\`

### Client-Side Fetching

For dynamic data that doesn't need SEO:

\`\`\`typescript
import { useState, useEffect } from 'react';
import { useSWR } from 'megaframework/data';

// With SWR (recommended)
export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  return <div>Hello {data.name}!</div>;
}

// With useEffect
export default function Dashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return data ? <div>{data.stats}</div> : <div>Loading...</div>;
}
\`\`\`

## State Management

MegaFramework includes built-in state management:

### Local Component State

\`\`\`typescript
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

### Global State (Atoms)

\`\`\`typescript
// lib/store.ts
import { atom, useAtom } from 'megaframework/state';

export const userAtom = atom({
  key: 'user',
  default: null
});

export const themeAtom = atom({
  key: 'theme',
  default: 'light'
});

// components/Profile.tsx
import { useAtom } from 'megaframework/state';
import { userAtom } from '@/lib/store';

export default function Profile() {
  const [user, setUser] = useAtom(userAtom);
  
  return (
    <div>
      {user ? 'Welcome ${user.name}!' : 'Please log in'}
    </div>
  );
}
\`\`\`

### Derived State (Selectors)

\`\`\`typescript
import { selector, useValue } from 'megaframework/state';
import { userAtom } from '@/lib/store';

const userNameSelector = selector({
  key: 'userName',
  get: ({ get }) => {
    const user = get(userAtom);
    return user?.name ?? 'Guest';
  }
});

export default function Greeting() {
  const userName = useValue(userNameSelector);
  return <h1>Hello, {userName}!</h1>;
}
\`\`\`

## API Reference

### CLI Commands

\`\`\`bash
# Development
mega dev              # Start dev server (hot reload)
mega dev --port 4000  # Custom port
mega dev --turbo      # Enable turbopack (faster)

# Production
mega build            # Build for production
mega start            # Start production server
mega export           # Export static HTML

# Utilities
mega lint             # Run ESLint
mega lint --fix       # Auto-fix issues
mega analyze          # Analyze bundle size
mega info             # Show system info
\`\`\`

### Configuration API

\`\`\`typescript
// mega.config.ts
import { defineConfig } from 'megaframework';

export default defineConfig({
  // Server
  port: 3000,
  hostname: 'localhost',
  
  // Build
  outDir: 'dist',
  typescript: {
    strict: true,
    paths: {
      '@/*': ['./src/*']
    }
  },
  
  // Optimization
  experimental: {
    turbo: true,
    serverComponents: true
  },
  
  // SEO
  meta: {
    title: 'My App',
    description: 'My awesome app'
  },
  
  // Plugins
  plugins: [
    'mega-plugin-mdx',
    ['mega-plugin-sitemap', { domain: 'https://example.com' }]
  ]
});
\`\`\`

For the complete API reference, visit: https://docs.megaframework.com/api

## FAQ

### Q: How does MegaFramework compare to Next.js?

**A**: MegaFramework is similar to Next.js but focuses on simplicity and developer experience. Key differences:
- Simpler data fetching API
- Built-in state management
- Native TypeScript support (no build step)
- More flexible rendering options

### Q: Can I use MegaFramework with my existing React app?

**A**: Yes! MegaFramework can be adopted incrementally. Start by migrating one route at a time.

### Q: Does MegaFramework support TypeScript?

**A**: Yes, TypeScript is a first-class citizen. All APIs are fully typed, and \`.tsx\` files work out of the box.

### Q: How do I deploy a MegaFramework app?

**A**: Deploy anywhere Node.js runs: Vercel, Netlify, AWS, DigitalOcean, etc. See our [deployment guide](#deployment).

### Q: Is MegaFramework production-ready?

**A**: Absolutely. It's used by 2,500+ companies including Fortune 500 enterprises.

### Q: Can I use my preferred CSS solution?

**A**: Yes. MegaFramework supports CSS Modules, Tailwind, styled-components, Emotion, and vanilla CSS.

---

**Need more help?**
- 📖 [Full Documentation](https://docs.megaframework.com)
- 💬 [Discord Community](https://discord.gg/megaframework)
- 🐦 [Twitter Updates](https://twitter.com/megaframework)
- 📧 Email: support@megaframework.com
`
  },
  {
    id: 'monorepo',
    title: "Monorepo / Workspace",
    description: "Structured for multiple packages with links to sub-directories and shared architecture.",
    tags: ["Turborepo", "Yarn Workspaces"],
    content: `
# ACME Corp Monorepo

A high-performance monorepo containing all ACME Corp's web properties, shared libraries, and internal tools. Built with **Turborepo**, **pnpm workspaces**, and modern tooling for maximum developer productivity.

**🚀 Apps**: 3 production apps | **📦 Packages**: 8 shared libraries | **👥 Team**: 45 developers

## 🎯 What is This Monorepo?

This repository is the single source of truth for ACME Corp's web ecosystem. It contains:

- **Customer-Facing Apps**: Marketing site, product dashboard, mobile app API
- **Internal Tools**: Admin dashboard, analytics platform
- **Shared Libraries**: UI components, utilities, configs, API clients
- **Documentation**: Technical docs, API references, style guides

### Why a Monorepo?

✅ **Single Source of Truth**: One repo, one version, one deploy  
✅ **Code Sharing**: Share components, utils, and configs effortlessly  
✅ **Atomic Changes**: Update shared code and all consumers in one PR  
✅ **Unified Tooling**: One linting config, one testing setup  
✅ **Better Collaboration**: See the whole picture, review across apps  
✅ **Faster CI/CD**: Smart caching with Turborepo (up to 85% faster builds)

## 📊 Repository Statistics

- **Total Lines of Code**: ~850,000
- **Active Contributors**: 45 developers
- **Monthly Deploys**: ~280
- **Test Coverage**: 87%
- **Build Time** (with cache): 3.2 minutes
- **Build Time** (cold): 18 minutes

## 🏗 Monorepo Structure

\`\`\`text
acme-monorepo/
│
├── apps/                        # Production applications
│   ├── web/                     # Next.js marketing website
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── dashboard/               # React SaaS dashboard
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── docs/                    # Documentation site (Docusaurus)
│   │   ├── docs/
│   │   ├── blog/
│   │   └── docusaurus.config.js
│   │
│   ├── mobile-api/              # Node.js API for mobile apps
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                   # Internal admin panel
│       ├── src/
│       └── package.json
│
├── packages/                    # Shared packages
│   ├── ui/                      # Shared React component library
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── utils/                   # Shared utility functions
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   └── validation.ts
│   │   └── package.json
│   │
│   ├── api-client/              # Shared API client
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── eslint-config/           # Shared ESLint configuration
│   │   ├── index.js
│   │   ├── react.js
│   │   └── package.json
│   │
│   ├── tsconfig/                # Shared TypeScript configs
│   │   ├── base.json
│   │   ├── react.json
│   │   ├── node.json
│   │   └── package.json
│   │
│   ├── tailwind-config/         # Shared Tailwind config
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── database/                # Prisma database client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   └── package.json
│   │
│   └── auth/                    # Authentication library
│       ├── src/
│       └── package.json
│
├── tooling/                     # Development tools
│   ├── scripts/                 # Automation scripts
│   │   ├── setup.sh
│   │   └── deploy.sh
│   └── github/                  # GitHub actions
│       └── workflows/
│
├── .github/                     # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── release.yml
│   └── CODEOWNERS
│
├── turbo.json                   # Turborepo configuration
├── package.json                 # Root package.json
├── pnpm-workspace.yaml          # pnpm workspaces config
├── .npmrc                       # npm configuration
├── tsconfig.json                # Base TypeScript config
├── .eslintrc.js                 # Root ESLint config
├── .prettierrc                  # Prettier config
└── README.md
\`\`\`

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v20.0.0 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8.0.0 or higher (\`npm install -g pnpm\`)
- **Git**: Latest version

### Initial Setup

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/acme/monorepo.git
cd monorepo

# 2. Install all dependencies (for all apps and packages)
pnpm install

# 3. Build all packages
pnpm build

# 4. Run development servers for all apps
pnpm dev
\`\`\`

That's it! All apps should now be running:

- 🌐 Marketing Site: http://localhost:3000
- 📊 Dashboard: http://localhost:3001
- 📖 Docs: http://localhost:3002
- 🔧 Admin: http://localhost:3003
- 🚀 API: http://localhost:4000

### Environment Setup

Copy environment files for each app:

\`\`\`bash
# Marketing site
cp apps/web/.env.example apps/web/.env.local

# Dashboard
cp apps/dashboard/.env.example apps/dashboard/.env.local

# API
cp apps/mobile-api/.env.example apps/mobile-api/.env
\`\`\`

Fill in your environment variables (see individual app READMEs for details).

## 📦 Applications

### 1. Marketing Website (\`apps/web\`)

**Tech Stack**: Next.js 14, React 18, Tailwind CSS  
**URL**: https://acme.com  
**Purpose**: Public-facing marketing and SEO-optimized content

**Key Features**:
- Static generation for landing pages (99 Lighthouse score)
- Blog with MDX support
- Multi-language support (English, Spanish, French)
- Contact forms with Resend integration
- Analytics with Vercel Analytics

**Local Development**:
\`\`\`bash
cd apps/web
pnpm dev
\`\`\`

[📖 Full README](./apps/web/README.md)

### 2. Dashboard (\`apps/dashboard\`)

**Tech Stack**: React 18, Vite, TanStack Query, Zustand  
**URL**: https://app.acme.com  
**Purpose**: Customer-facing SaaS dashboard

**Key Features**:
- Real-time data updates with WebSockets
- Complex data tables with virtualization
- Charts and analytics (Recharts)
- Multi-tenant architecture
- Role-based access control (RBAC)

**Local Development**:
\`\`\`bash
cd apps/dashboard
pnpm dev
\`\`\`

[📖 Full README](./apps/dashboard/README.md)

### 3. Documentation Site (\`apps/docs\`)

**Tech Stack**: Docusaurus 3, React, Algolia  
**URL**: https://docs.acme.com  
**Purpose**: Developer documentation and API references

**Key Features**:
- Interactive code examples
- API reference auto-generated from OpenAPI
- Versioned documentation
- Full-text search with Algolia
- Dark mode support

**Local Development**:
\`\`\`bash
cd apps/docs
pnpm dev
\`\`\`

[📖 Full README](./apps/docs/README.md)

### 4. Mobile API (\`apps/mobile-api\`)

**Tech Stack**: Node.js, Express, PostgreSQL, Redis  
**URL**: https://api.acme.com  
**Purpose**: REST API for mobile applications

**Key Features**:
- RESTful API with OpenAPI spec
- JWT authentication
- Rate limiting and caching
- Background jobs with Bull
- Monitoring with Sentry

**Local Development**:
\`\`\`bash
cd apps/mobile-api
pnpm dev
\`\`\`

[📖 Full README](./apps/mobile-api/README.md)

### 5. Admin Panel (\`apps/admin\`)

**Tech Stack**: React, Material-UI, React Admin  
**URL**: https://admin.acme.com (internal)  
**Purpose**: Internal admin tools for customer support and ops

**Key Features**:
- User management
- Analytics dashboards
- Feature flags management
- System health monitoring

**Local Development**:
\`\`\`bash
cd apps/admin
pnpm dev
\`\`\`

[📖 Full README](./apps/admin/README.md)

## 📦 Shared Packages

### UI Component Library (\`packages/ui\`)

Shared React components used across all applications.

**Components** (50+):
- Buttons, Cards, Modals, Tooltips
- Forms (Input, Select, Checkbox, Radio)
- Data Display (Tables, Lists, Badge)
- Feedback (Alert, Toast, Progress)
- Navigation (Tabs, Breadcrumb, Pagination)

**Usage**:
\`\`\`typescript
import { Button, Card, Modal } from '@acme/ui';

export default function MyComponent() {
  return (
    <Card>
      <Button variant="primary" size="lg">
        Click Me
      </Button>
    </Card>
  );
}
\`\`\`

**Storybook**: http://localhost:6006 (\`pnpm storybook\`)

[📖 Full Docs](./packages/ui/README.md) | [🎨 Storybook](https://storybook.acme.com)

### Utilities (\`packages/utils\`)

Shared utility functions and helpers.

**Categories**:
- **Date/Time**: \`formatDate\`, \`parseDate\`, \`timeAgo\`
- **String**: \`truncate\`, \`slugify\`, \`capitalize\`
- **Validation**: \`isEmail\`, \`isURL\`, \`isPhoneNumber\`
- **Array**: \`groupBy\`, \`unique\`, \`sortBy\`
- **Object**: \`deepMerge\`, \`pick\`, \`omit\`
- **Number**: \`formatCurrency\`, \`formatNumber\`, \`clamp\`

**Usage**:
\`\`\`typescript
import { formatDate, truncate, isEmail } from '@acme/utils';

const date = formatDate(new Date(), 'MMM DD, YYYY');
const excerpt = truncate(longText, 100);
const valid = isEmail('user@example.com');
\`\`\`

[📖 Full Docs](./packages/utils/README.md)

### API Client (\`packages/api-client\`)

Type-safe API client for communicating with backend services.

**Features**:
- Automatic TypeScript types from OpenAPI
- Built-in authentication
- Request/response interceptors
- Retry logic and error handling

**Usage**:
\`\`\`typescript
import { createClient } from '@acme/api-client';

const client = createClient({
  baseURL: process.env.API_URL,
  token: session.accessToken
});

// Fully typed requests
const user = await client.users.get('123');
const posts = await client.posts.list({ page: 1, limit: 10 });
\`\`\`

[📖 Full Docs](./packages/api-client/README.md)

### Database (\`packages/database\`)

Prisma database client shared across backend services.

**Schema**: PostgreSQL with Prisma ORM  
**Models**: Users, Organizations, Posts, Comments, etc.

**Usage**:
\`\`\`typescript
import { prisma } from '@acme/database';

const users = await prisma.user.findMany({
  where: { active: true },
  include: { posts: true }
});
\`\`\`

**Migrations**:
\`\`\`bash
cd packages/database
pnpm prisma migrate dev
pnpm prisma generate
\`\`\`

[📖 Full Docs](./packages/database/README.md)

### Configuration Packages

#### ESLint Config (\`packages/eslint-config\`)
\`\`\`json
{
  "extends": ["@acme/eslint-config/react"]
}
\`\`\`

#### TypeScript Config (\`packages/tsconfig\`)
\`\`\`json
{
  "extends": "@acme/tsconfig/react.json"
}
\`\`\`

#### Tailwind Config (\`packages/tailwind-config\`)
\`\`\`javascript
module.exports = {
  presets: [require('@acme/tailwind-config')],
}
\`\`\`

## 🛠 Development Workflows

### Working on a Single App

\`\`\`bash
# Run only the dashboard
pnpm --filter dashboard dev

# Run dashboard with dependencies
pnpm --filter dashboard... dev

# Build only the marketing site
pnpm --filter web build
\`\`\`

### Working on Multiple Apps

\`\`\`bash
# Run specific apps
pnpm --filter "{web,dashboard}" dev

# Run all apps except docs
pnpm --filter "!docs" dev
\`\`\`

### Working on Shared Packages

\`\`\`bash
# Watch mode for UI package
cd packages/ui
pnpm dev  # Rebuilds on file changes

# Apps importing @acme/ui will auto-reload
\`\`\`

### Adding Dependencies

\`\`\`bash
# Add to a specific app
pnpm --filter web add lodash

# Add to a package
pnpm --filter @acme/utils add date-fns

# Add to root (dev dependencies)
pnpm add -D -w prettier
\`\`\`

### Creating a New App

\`\`\`bash
# Use the generator
pnpm generate:app

# Or manually
mkdir apps/new-app
cd apps/new-app
pnpm init
# Add to pnpm-workspace.yaml
\`\`\`

### Creating a New Package

\`\`\`bash
# Use the generator
pnpm generate:package

# Or manually
mkdir packages/new-package
cd packages/new-package
pnpm init
\`\`\`

## 🏗 Build System (Turborepo)

### How Turborepo Works

Turborepo intelligently caches build outputs and only rebuilds what changed.

**Benefits**:
- ⚡ **85% faster** builds with caching
- 🎯 **Smart scheduling** of parallel tasks
- 🔄 **Remote caching** shared across team
- 📊 **Build visualization** to debug slowness

### Turbo Configuration

\`\`\`json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"]
    }
  }
}
\`\`\`

### Common Turbo Commands

\`\`\`bash
# Build everything
pnpm build

# Build with remote caching
pnpm build --remote-cache

# Force rebuild (ignore cache)
pnpm build --force

# Dry run (see what would run)
pnpm build --dry-run

# See dependency graph
pnpm turbo run build --graph

# Clear cache
pnpm turbo prune
\`\`\`

### Pipeline Visualization

\`\`\`bash
# Generate visual graph
pnpm turbo run build --graph=graph.html
\`\`\`

Opens an interactive graph showing:
- Build dependencies
- Parallel vs sequential tasks
- Cache hits/misses
- Execution time per task

## 🧪 Testing

### Test Strategy

| Type | Tool | Coverage |
|:-----|:-----|:---------|
| Unit Tests | Vitest | 87% |
| Component Tests | React Testing Library | 82% |
| E2E Tests | Playwright | Critical paths |
| Visual Tests | Chromatic | UI components |
| API Tests | Supertest | 91% |

### Running Tests

\`\`\`bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter dashboard test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
\`\`\`

### Writing Tests

\`\`\`typescript
// packages/ui/src/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
\`\`\`

## 🚀 Deployment

### CI/CD Pipeline

**GitHub Actions** workflow runs on every push:

1. ✅ **Lint** - ESLint, Prettier
2. ✅ **Type Check** - TypeScript compilation
3. ✅ **Test** - Unit, integration, E2E
4. ✅ **Build** - All apps and packages
5. ✅ **Deploy** - Vercel (preview) or Production

### Deployment Targets

| App | Platform | URL |
|:----|:---------|:----|
| Marketing | Vercel | https://acme.com |
| Dashboard | Vercel | https://app.acme.com |
| Docs | Vercel | https://docs.acme.com |
| API | Railway | https://api.acme.com |
| Admin | Vercel | https://admin.acme.com |

### Manual Deployment

\`\`\`bash
# Deploy all apps
pnpm deploy

# Deploy specific app
pnpm --filter web deploy

# Deploy to staging
pnpm deploy:staging

# Deploy to production (requires approval)
pnpm deploy:production
\`\`\`

### Environment Variables

Each app has its own environment variables:

\`\`\`bash
# Marketing site
apps/web/.env.local

# Dashboard
apps/dashboard/.env.local

# API
apps/mobile-api/.env
\`\`\`

**Never commit \`.env\` files!** Use Vercel/Railway secret management.

## 📊 Monitoring & Observability

### Tools Used

- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **Uptime**: Better Uptime
- **Logs**: Datadog
- **APM**: New Relic (API only)

### Health Checks

\`\`\`bash
# Check all services
pnpm health:check

# Output:
# ✅ web: https://acme.com (200 OK)
# ✅ dashboard: https://app.acme.com (200 OK)
# ✅ api: https://api.acme.com/health (200 OK)
\`\`\`

## 🔧 Troubleshooting

### Common Issues

**Problem**: "Cannot find module '@acme/ui'"
\`\`\`bash
# Solution: Build packages first
pnpm build
# Or run in watch mode
cd packages/ui && pnpm dev
\`\`\`

**Problem**: "Port 3000 already in use"
\`\`\`bash
# Solution: Kill process or use different port
pnpm --filter web dev -- --port 3001
\`\`\`

**Problem**: "Out of memory during build"
\`\`\`bash
# Solution: Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
\`\`\`

**Problem**: "Changes in package not reflecting in app"
\`\`\`bash
# Solution: Clear Turborepo cache
pnpm turbo prune
pnpm build
\`\`\`

### Getting Help

1. Check the [internal wiki](https://wiki.acme.com)
2. Ask in #eng-help Slack channel
3. Open an issue with \`[HELP]\` prefix
4. Ping @platform-team for urgent issues

## 📚 Documentation

- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Security**: [SECURITY.md](./SECURITY.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- **Release Process**: [docs/RELEASES.md](./docs/RELEASES.md)

## 🤝 Contributing

### Development Process

1. **Create a branch**: \`git checkout -b feature/amazing-feature\`
2. **Make changes**: Follow our [coding standards](./docs/CODING_STANDARDS.md)
3. **Write tests**: Maintain or improve coverage
4. **Run checks**: \`pnpm lint && pnpm test && pnpm build\`
5. **Commit**: Use [conventional commits](https://conventionalcommits.org)
6. **Push**: \`git push origin feature/amazing-feature\`
7. **Open PR**: Fill out the PR template
8. **Get reviews**: At least 2 approvals required
9. **Merge**: Squash and merge to main

### Commit Convention

\`\`\`bash
# Format: type(scope): message

feat(dashboard): add user analytics chart
fix(ui): resolve button hover state bug
docs(readme): update installation steps
chore(deps): upgrade react to v18.3
test(utils): add date formatting tests
\`\`\`

### Code Review Guidelines

- ✅ Keep PRs small (<500 lines)
- ✅ Write descriptive PR titles
- ✅ Add screenshots for UI changes
- ✅ Update relevant documentation
- ✅ Ensure CI passes before requesting review

## 📊 Repository Metrics

### Code Quality

![Test Coverage](https://img.shields.io/badge/coverage-87%25-brightgreen)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Type Safety](https://img.shields.io/badge/typescript-100%25-blue)

### Dependencies

\`\`\`bash
# Check for outdated packages
pnpm outdated

# Update all dependencies
pnpm update -r

# Check for vulnerabilities
pnpm audit
\`\`\`

### Bundle Sizes

| App | Initial JS | Total Size | Lighthouse |
|:----|:-----------|:-----------|:-----------|
| Marketing | 85 KB | 320 KB | 99/100 |
| Dashboard | 210 KB | 890 KB | 94/100 |
| Docs | 120 KB | 450 KB | 98/100 |

## 🛡 Security

- **Dependency Scanning**: Dependabot (weekly)
- **Secret Scanning**: GitHub Advanced Security
- **SAST**: SonarCloud
- **Penetration Testing**: Quarterly audits
- **Security Policy**: [SECURITY.md](./SECURITY.md)

## 📄 License

This monorepo is proprietary and confidential.  
© 2024 ACME Corporation. All rights reserved.

Unauthorized copying, distribution, or use is strictly prohibited.

## 👥 Team & Ownership

### Platform Team (@platform-team)
- **Lead**: @alice (alice@acme.com)
- **Members**: @bob, @carol, @dave
- **Responsibilities**: Infrastructure, CI/CD, monorepo tooling

### Product Teams

**Marketing** (@marketing-team)
- Owner: @emily
- Apps: \`web\`, \`docs\`

**Product** (@product-team)
- Owner: @frank
- Apps: \`dashboard\`

**API** (@api-team)
- Owner: @grace
- Apps: \`mobile-api\`

**Internal Tools** (@tools-team)
- Owner: @henry
- Apps: \`admin\`

## 🔗 Useful Links

- **Internal Wiki**: https://wiki.acme.com
- **Design System**: https://design.acme.com
- **Component Storybook**: https://storybook.acme.com
- **Status Page**: https://status.acme.com
- **Metrics Dashboard**: https://metrics.acme.com
- **Slack**: #engineering channel

---

**Questions?** Ask in #eng-help or email platform@acme.com

**Last Updated**: December 2024  
**Maintainers**: @platform-team
`
  },
  {
    id: 'hackathon',
    title: "Hackathon / MVP",
    description: "High energy, visual-first. Focuses on screenshots, the 'pitch', and how to run it fast.",
    tags: ["Prototype", "Demo", "Event"],
    content: `
# 🚀 Project SuperNova

### *The Social Network for Cats. Finally.*

> 🏆 **Winner** - Best Use of AI, Global Hackathon 2025  
> ⏱️ Built in 24 hours by a team of 4 sleep-deprived developers  
> 🐱 Currently connecting 127 cats across 3 continents

---

## 🎯 The Problem We're Solving

### Every cat owner knows this struggle:

- 😿 **Cats are lonely** when their owners are at work
- 📦 **They LOVE cardboard boxes** but have no one to share their finds with
- 🕐 **3 AM zoomies** happen in isolation
- 🐾 **No way to find feline friends** with compatible personalities

**The result?** Unhappy cats, stressed owners, and a lot of knocked-over water glasses.

### The Impact

- 📊 **73% of cat owners** report their cats exhibit signs of loneliness
- 💰 **$2B spent annually** on toys that cats ignore after 5 minutes
- 😢 **Millions of cats** living in single-cat households without companionship

---

## ✨ Meet SuperNova: The Solution

SuperNova is a **mobile-first social platform** that matches cats based on:

🎯 **Personality Compatibility**
- Morning bird vs night owl
- Box enthusiast vs bag lover
- Social butterfly vs independent spirit

🍽️ **Dietary Preferences**
- Favorite treat brands (we all know this matters)
- Wet food vs dry food loyalty
- Tendency to steal human food

🎮 **Activity Levels**
- Zoomie frequency and intensity
- Climbing vs floor-dwelling preference
- Toy sophistication (string vs electronic mice)

💬 **AI-Powered Translation**
- Meow to text using GPT-4
- Purr sentiment analysis
- Hiss detection and conflict resolution

---

## 📸 Screenshots & Demo

### Main Feed - "Trending Boxes"
![Main Dashboard](https://via.placeholder.com/1200x600/4A90E2/FFFFFF?text=📦+Trending+Boxes+Feed)

*See what boxes are popular in your area. This cardboard apartment complex got 847 paws up!*

### Matching Algorithm
![Matching Screen](https://via.placeholder.com/1200x600/7B68EE/FFFFFF?text=💕+Find+Your+Purrfect+Match)

*Swipe right for cats that share your love of 3 AM parkour. Swipe left on dogs (obvious).*

### Live Chat with AI Translation
![Chat Interface](https://via.placeholder.com/1200x600/50C878/FFFFFF?text=💬+Meow+Translator)

*"Meow meow meow" → "I found an excellent sunbeam. Come immediately."*

### Activity Tracking
![Analytics Dashboard](https://via.placeholder.com/1200x600/FF6B9D/FFFFFF?text=📊+Zoomie+Analytics)

*Track your cat's daily zoomies, box time, and nap quality. Export reports for your vet.*

---

## 🎬 Live Demo

🌐 **[Try it now!](https://supernova-cats.vercel.app)** *(Demo credentials: cat@example.com / password123)*

📹 **[Watch the video demo](https://youtube.com/watch?v=dQw4w9WgXcQ)** (2 min)

🎤 **[Pitch deck](https://docs.google.com/presentation/d/example)** (if you prefer slides)

---

## 🛠 Tech Stack

We went FULL STACK in 24 hours:

### Frontend 🎨
- **React 18** with TypeScript (for that sweet type safety)
- **Vite** (because life's too short for slow builds)
- **Tailwind CSS** (we're not designers, don't judge our gradients)
- **Framer Motion** (animations make everything better)
- **React Query** (data fetching that doesn't make you cry)

### Backend ⚙️
- **Supabase** (PostgreSQL database + Auth + Real-time)
  - User profiles (for the humans)
  - Cat profiles (the real users)
  - Matches and messages
  - Real-time chat
- **Edge Functions** (for the AI stuff)

### AI & ML 🤖
- **OpenAI GPT-4** (meow translation and personality analysis)
- **Whisper API** (for purr audio analysis)
- **Stable Diffusion** (generate AI art of cats in boxes)

### Infrastructure 🚀
- **Vercel** (deployment in 30 seconds, we timed it)
- **Cloudinary** (cat photos in the cloud, ironically)
- **Sentry** (because things break at 3 AM during demos)

### Honorable Mentions
- **Copilot** (wrote 40% of this code, we're not ashamed)
- **ChatGPT** (pair programming buddy at 2 AM)
- **Stack Overflow** (saved us countless times)
- **Coffee** (the real MVP ☕)

---

## 🏃‍♂️ Quick Start

### ⚠️ Warning: This is Hackathon Code™

Expect:
- ❌ No tests (who has time for that?)
- ❌ Hardcoded API keys (we'll fix it "later")
- ❌ TODO comments everywhere
- ❌ Variable names like \`data2\` and \`finalFinal\`
- ✅ But it WORKS! (mostly)

### Prerequisites

- Node.js 18+ (anything older and you're on your own)
- A Supabase account (free tier is fine)
- OpenAI API key ($5 credit will last you a while)
- A sense of humor about code quality

### Installation (5 Minutes)

\`\`\`bash
# 1. Clone this beautiful mess
git clone https://github.com/yourteam/supernova.git
cd supernova

# 2. Install dependencies (grab a coffee)
npm install

# 3. Set up environment variables
cp .env.example .env
# NOW EDIT .env WITH YOUR KEYS! (don't skip this)
\`\`\`

### Environment Variables You Need

Create a \`.env\` file:

\`\`\`bash
# Supabase (get from https://supabase.com/dashboard)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI (get from https://platform.openai.com/api-keys)
VITE_OPENAI_API_KEY=sk-your-key-here

# Optional but recommended
VITE_SENTRY_DSN=your-sentry-dsn  # Catch those 3 AM bugs
\`\`\`

### Run It! 🚀

\`\`\`bash
# Development server
npm run dev

# Should open at http://localhost:5173
# If not, we probably hardcoded localhost:3000 somewhere 🤦‍♂️
\`\`\`

### Build for Production (if you dare)

\`\`\`bash
npm run build
npm run preview

# Deploy to Vercel
npm i -g vercel
vercel --prod
\`\`\`

---

## 🎯 Features Implemented ✅

What we ACTUALLY built in 24 hours:

### Core Features (The Stuff That Works)
- ✅ User authentication (login/signup)
- ✅ Create cat profiles with photos
- ✅ Matching algorithm (50% AI, 50% random, 100% fun)
- ✅ Real-time chat between cat owners
- ✅ Meow translation using GPT-4
- ✅ Photo feed of boxes and cats
- ✅ "Paw" (like) system
- ✅ Push notifications (sort of)

### Stretch Goals (We're Amazed These Work)
- ✅ Activity tracking dashboard
- ✅ Trending boxes map
- ✅ Cat personality quiz
- ✅ Dark mode (because we coded at night)

### Known Issues 🐛
- ⚠️ Chat sometimes shows messages twice (refresh fixes it)
- ⚠️ Meow translation occasionally returns "I am a large language model"
- ⚠️ Profile photos upload slowly (we'll optimize... eventually)
- ⚠️ The app crashes if you name your cat "null" (JavaScript things)
- ⚠️ Mobile layout is "responsive-ish"
- ⚠️ No tests because YOLO

---

## 🎨 Design Decisions

### Why These Choices?

**Supabase over custom backend**
- ⚡ Auth, database, and real-time in one package
- 🚀 Zero config, just works™
- 💰 Free tier = perfect for MVP

**React over [insert other framework]**
- 🤷‍♂️ It's what we know
- 📚 Huge ecosystem when you get stuck at 2 AM
- 🔧 Easy to find help on Discord

**OpenAI API over training our own model**
- ⏰ Training takes weeks, we had hours
- 🧠 GPT-4 is honestly scary good at cat analysis
- 💸 Pay-per-use beats AWS bills

**Tailwind over custom CSS**
- 🎨 No time for design systems
- 📱 Responsive by default
- 🚫 Zero naming conflicts

---

## 🏗 Architecture

\`\`\`typescript
┌─────────────────┐
│   React App     │  ← You are here
└────────┬────────┘
         │
    ┌────┴────────────────┐
    │                     │
┌───▼──────┐      ┌──────▼───────┐
│ Supabase │      │ OpenAI API   │
│          │      │              │
│ • Auth   │      │ • GPT-4      │
│ • DB     │      │ • Whisper    │
│ • Real   │      │ • DALL-E     │
│   -time  │      └──────────────┘
└──────────┘
\`\`\`

### Data Model (Simplified)

\`\`\`typescript
// users table
{
  id: uuid,
  email: string,
  name: string,
  created_at: timestamp
}

// cats table  
{
  id: uuid,
  owner_id: uuid,  // FK to users
  name: string,
  photo_url: string,
  personality: json,  // {playful: 8, social: 6, ...}
  favorite_treats: string[],
  zoomie_time: time
}

// matches table
{
  cat_a: uuid,  // FK to cats
  cat_b: uuid,  // FK to cats
  compatibility_score: number,
  matched_at: timestamp
}

// messages table
{
  from_cat: uuid,
  to_cat: uuid,
  message: string,
  translated: boolean,
  created_at: timestamp
}
\`\`\`

---

## 📊 Metrics & Impact

### Hackathon Weekend Results

- 👥 **127 users** signed up during demo
- 🐱 **214 cat profiles** created
- 💬 **1,847 messages** sent (mostly "meow")
- 📦 **93 boxes** posted to the feed
- ⭐ **4.7/5** average user rating
- 🏆 **Winner** - Best Use of AI category

### If We Had More Time (The Dream)

- 📱 Native mobile apps (iOS + Android)
- 🎮 Cat games you can play together
- 📍 Real-world meetup coordination
- 💰 Monetization (premium treats marketplace?)
- 🌍 Multi-language support
- 🧪 Actual user testing
- 📈 Analytics dashboard
- 🔐 Proper security audit
- ♿ Accessibility improvements
- 🧹 Clean up the code (LOL)

---

## 👥 The Team

### Meet the Sleep-Deprived Developers

**🧙‍♂️ Alex "Frontend Wizard" Chen** ([@alexchen](https://github.com/alexchen))
- *Role*: React magician, UI/UX
- *Superpower*: Making things pretty at 4 AM
- *Cats*: Whiskers (Maine Coon), Mittens (Tabby)

**⚙️ Jamie "Backend Boss" Rodriguez** ([@jrodriguez](https://github.com/jrodriguez))
- *Role*: Supabase whisperer, API design
- *Superpower*: Deploying without reading docs
- *Cats*: Shadow (Black cat), Luna (Siamese)

**🤖 Sam "AI Overlord" Kim** ([@samkim](https://github.com/samkim))
- *Role*: OpenAI integration, ML magic
- *Superpower*: Prompt engineering wizardry
- *Cats*: Pixel (Orange tabby)

**🎨 Morgan "Design Guru" Taylor** ([@mtaylor](https://github.com/mtaylor))
- *Role*: UI design, cat psychology
- *Superpower*: Color theory + cat behavior
- *Cats*: Smokey (Russian Blue), Gizmo (Mixed)

**Combined Stats:**
- ☕ 47 cups of coffee consumed
- 🍕 14 pizzas ordered
- 😴 8 hours of sleep total (for all 4 of us)
- 🐛 283 bugs fixed
- 💻 6,247 lines of code
- 😂 Countless laughs

---

## 🙏 Acknowledgments

### Built With Help From

- **The Organizers** - For the free pizza and Red Bull
- **Stack Overflow** - For existing
- **GitHub Copilot** - Our 5th team member
- **Our Cats** - For being the inspiration (and test users)
- **Our Families** - For understanding the 24-hour silence
- **Caffeine** - The true MVP

### Open Source Libraries We Abused
- React, Vite, Tailwind, Supabase client, OpenAI SDK
- Framer Motion, React Query, React Router, Zustand
- Day.js, Zod, React Hook Form, Lucide Icons
- *And like 50 more we installed and forgot about*

---

## 📜 License

MIT License - Use it, abuse it, ship it to prod (but please don't)

We built this in 24 hours. It's a beautiful disaster. Use at your own risk.

---

## 🚀 What's Next?

### Post-Hackathon Plans

1. **Week 1**: Sleep. Lots of sleep.
2. **Week 2**: Refactor the worst code (if we remember what it does)
3. **Week 3**: Add tests (jk, who are we kidding)
4. **Week 4**: Launch beta on Product Hunt

### Want to Contribute?

Sure! Here's what needs work:
- [ ] Literally everything
- [ ] Tests (anyone? no?)
- [ ] Security review (probably important)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Documentation (this README doesn't count)
- [ ] Code comments (// TODO: fix this)

Just open a PR! We'll merge almost anything at this point.

---

## 💬 Contact & Support

**Found a bug?** Of course you did. There are probably hundreds.
- Open an issue: https://github.com/yourteam/supernova/issues
- Or DM us, we're always online (help)

**Want to chat?**
- 📧 Email: team@supernova-cats.com
- 🐦 Twitter: [@supernovacats](https://twitter.com/supernovacats)
- 💬 Discord: [Join our server](https://discord.gg/supernova)

**Press inquiries:**
- We have a press kit! (it's just screenshots)
- Email: press@supernova-cats.com

---

## 🎉 Final Thoughts

We built this in 24 hours fueled by caffeine, pizza, and the collective stress of 4 developers who should have been sleeping.

Is it perfect? **No.**  
Does it work? **Mostly.**  
Are we proud? **Absolutely.**

If you made it this far in the README, you're either:
1. Actually interested in using this (amazing!)
2. One of the judges (please be kind)
3. Procrastinating on your own hackathon project (we feel you)

Thanks for checking out SuperNova! May your cats find their purrfect matches. 🐱💕

---

**⭐ If you like this project, give us a star on GitHub!**  
**🐛 If you find bugs, please tell us gently, our egos are fragile**  
**🚀 If you want to help, PRs welcome!**

Built with 💙, 😴, and an unhealthy amount of ☕ by Team SuperNova

---

*"In space, no one can hear you meow."* - Team SuperNova, 2025

**Project Status:** 🔥 On fire (in a good way... we think)  
**Code Quality:** 🎢 It's a roller coaster  
**Cat Approval Rating:** 🐱🐱🐱🐱 (4/5 cats)  
**Would Build Again:** Maybe with more sleep
`
  }
];