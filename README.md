# Gitdocs AI

[![version](https://img.shields.io/badge/version-2.2.0-blue.svg)]() [![license](https://img.shields.io/badge/license-Unlicensed-lightgrey.svg)]() [![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js&logoColor=white)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org) [![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io) [![tRPC](https://img.shields.io/badge/tRPC-11.8.0-0EA5A4?logo=trpc&logoColor=white)](https://trpc.io) [![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org) [![PostgreSQL](https://img.shields.io/badge/Postgres-13%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)

Generate, improve, and maintain production-quality README files for GitHub repositories using AI. Connect your GitHub repositories, run background syncs, and automatically generate README content with a friendly UI.

Key features
- GitHub App integration: install on repositories, sync repository metadata and README changes.
- AI-driven README generation & improvement with usage tracking and rate-limiting.
- Full-stack TypeScript: Next.js (app router) frontend, tRPC API, Prisma + PostgreSQL database.
- Background processing with Inngest for repository syncs and readme-generation workflows.
- Auth via Clerk and GitHub App (appId / private key), cloud storage (Cloudinary), and Redis caching.

Table of contents
- [Quickstart](#quickstart)
- [Environment variables](#environment-variables)
- [Database & Migrations](#database--migrations)
- [Run locally](#run-locally)
- [Usage examples](#usage-examples)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

Quickstart

Prerequisites
- Node.js 18+ (recommended)
- PostgreSQL (for development: a local DB or a dev container)
- GitHub account to create a GitHub App (for full GitHub integrations)
- (Optional) Redis, Cloudinary account, Inngest keys for background jobs

1. Clone the repository
```bash
git clone https://github.com/abhas-kumar-sinha/gitdocs-ai-v2.0.git
cd gitdocs-ai-v2.0
```

2. Install dependencies
```bash
npm ci
```
Note: package.json contains a postinstall script that runs `prisma generate`.

3. Create environment file
Create a `.env` file at the repo root (see the example below). The app reads environment variables for database connection, GitHub app auth, Clerk, Inngest, etc.

Environment variables (example)
Create `.env` and fill the values appropriate for your environment:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gitdocs_ai_dev

# Clerk (auth)
CLERK_FRONTEND_API=your-clerk-frontend-api
CLERK_API_KEY=your-clerk-api-key

# GitHub App
GITHUB_APP_ID=12345
GITHUB_APP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Inngest / background jobs (if used)
INNGEST_API_KEY=your_inngest_api_key
INNGEST_WEBHOOK_SECRET=your_inngest_webhook_secret

# Cloudinary (optional, file uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Redis (optional; used by ioredis usage in the app)
REDIS_URL=redis://localhost:6379

# Other
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Database & Migrations

This project uses Prisma. There are migration files under `prisma/migrations` and a schema at `prisma/schema.prisma`.

Generate the Prisma client (postinstall runs this automatically):
```bash
npx prisma generate
```

Run migrations (development):
```bash
npx prisma migrate dev --name init
```

Apply migrations in production:
```bash
npx prisma migrate deploy
```

Inspect the database:
```bash
npx prisma studio
```

Run locally

Start the Next.js dev server:
```bash
npm run dev
# Open http://localhost:3000
```

Build and run production mode locally:
```bash
npm run build
npm start
```

Notes:
- The project uses Next 16, React 19 and the app router. If deploying to Vercel, the platform is recommended for automatic handling of Next features.
- Prisma client is generated into `src/generated/prisma` by config in `prisma/schema.prisma`.

Background workers (Inngest)

This repository uses Inngest functions for background jobs (see `src/inngest/functions/*`), for example:
- `processInstallation` (processes GitHub app installs and triggers repository sync)
- `syncRepositories` (syncs repos accessible to an installation)

To run or deploy Inngest functions:
- If you use the Inngest hosted platform, set `INNGEST_API_KEY` and deploy functions via the Inngest CLI / platform.
- To run locally, consult the Inngest docs and the repository `src/inngest/client.ts` for configuration.

Usage examples

1) Start the GitHub install flow (redirect)
The app provides an endpoint that creates an installation process and redirects to the GitHub App install page:

Open in browser:
```
GET /api/auth/github?permissions=write
```

This route creates a pending installation process and redirects the browser to the GitHub App install URL.

2) Webhook receiver (verify signature & queue events)
GitHub webhooks should be configured to point to:
```
POST https://<your-domain>/api/webhooks/github
```
The webhook handler expects header `x-hub-signature-256` and uses `GITHUB_WEBHOOK_SECRET` to validate requests (see `src/app/api/webhooks/github/route.ts`).

Example curl to simulate a webhook (replace signature with valid HMAC for production):
```bash
curl -X POST "http://localhost:3000/api/webhooks/github" \
  -H "Content-Type: application/json" \
  -H "x-github-event: push" \
  -H "x-hub-signature-256: sha256=..." \
  -d '{"repository": {"id": 123, "full_name": "owner/repo"}, "installation": {"id": 999}, "commits": [{"added": [], "modified": ["README.md"]}]}' 
```

3) tRPC endpoint route
tRPC API is served at:
```
/api/trpc
```
The router is defined in `src/trpc/routers/_app.ts`, exposing modules such as `user`, `project`, `installation`, `message`, `repository`, `aiUsage`, etc. The frontend uses a typed TRPC client wrapped by `TRPCReactProvider`.

Architecture (high level)

- Frontend (Next.js app)
  - pages / app router in `src/app/*`
  - UI components in `src/components/*`
  - Auth via Clerk (client + server)
  - TRPC client for typed API calls

- API / Server
  - tRPC server mounted at `/api/trpc`
  - Next.js route handlers for GitHub auth and webhooks
  - Prisma connects to PostgreSQL (client in `src/generated/prisma`)
  - GitHub integration: Octokit App auth helpers (`src/lib/github/appAuth.ts`)

- Background jobs
  - Inngest functions in `src/inngest/functions/*` handle long-running tasks (sync repositories, readme operations)

- Storage & caching
  - Cloudinary for image uploads (see `src/app/api/upload/*`)
  - Redis (ioredis) for caching/state if configured

Contributing

Thanks for your interest! We welcome contributions.

Steps to contribute
1. Fork the repository and create a branch:
```bash
git checkout -b feat/your-feature
```
2. Install dependencies and set up your `.env`.
3. Implement changes and add tests where applicable.
4. Run linters, formatters and tests:
```bash
npm run format   # runs Prettier
npm run lint     # runs ESLint
# If repository defines tests: npm test
```
5. Commit with clear messages and open a Pull Request against the main branch.

Code style
- Format with Prettier (repo includes Prettier config).
- Follow existing TypeScript and React patterns.
- Keep UI components under `src/components`, pages under `src/app/*`, and server logic under `src/lib` and `src/modules/*`.

Development tips
- Prisma: run `npx prisma generate` after schema changes.
- To debug GitHub app flows, use a public tunneling tool (ngrok) and configure the GitHub App webhook URL to point to the tunnel.
- Use `NEXT_PUBLIC_APP_URL` to configure callback URLs for Clerk / GitHub if needed.

Common tasks
- Sync repositories (background job triggered by webhook or installation processing).
- View webhook events table: `WebhookEvent` model in Prisma stores raw payloads (use Prisma Studio or query via TRPC).

Security & environment notes
- Never commit private keys (GitHub App private key) or production secrets to the repo.
- Use environment-specific secrets management in production (Vercel secrets, AWS Parameter Store, Vault, etc.).
- The webhook endpoint validates signatures — ensure `GITHUB_WEBHOOK_SECRET` is set identically in GitHub.

Acknowledgements
- Built with Next.js, Prisma, tRPC, Inngest, Clerk, Octokit, Cloudinary, Redis, and many open-source libraries.
- See `package.json` for a full list of dependencies.

Contact / Support
- Repo: https://github.com/abhas-kumar-sinha/gitdocs-ai-v2.0
- For major changes or questions, open an issue or a discussion on GitHub.

Enjoy contributing and building better READMEs with AI!
