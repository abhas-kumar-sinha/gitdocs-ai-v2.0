export interface MarkdownComponent {
  id: string;
  name: string;
  description: string;
  category: 'Structure' | 'Content' | 'Advanced';
  template: string; // The raw generic markdown
  iconName: string; // Key for Lucide icon
}

export enum TabOption {
  EDITOR = 'EDITOR',
  COMPONENTS = 'COMPONENTS'
}

export interface AIGenerateRequest {
  template: string;
  instruction: string;
}

export interface GeneratedResponse {
  markdown: string;
}

export const DEFAULT_MARKDOWN = `# Welcome to Gitdocs AI 🚀

Hi! You're inside **Gitdocs AI** — an AI-powered documentation platform built for developers, teams, and modern engineering workflows.

Gitdocs AI helps you **write, manage, sync, and publish documentation effortlessly** — with AI automation, cloud sync, and deep GitHub integration.

Whether you're building README files, project docs, product documentation, or knowledge bases — Gitdocs AI is your **all-in-one documentation OS**.


# ✨ Core Features

Gitdocs AI is more than a markdown editor — it's a **developer-first documentation platform**.

## 🧠 AI-Powered Writing
- Generate README files from repositories
- Improve existing documentation
- Auto-structure markdown
- Smart formatting & cleanup
- Context-aware suggestions
- Code-aware explanations
- Auto summaries
- Content optimization
- AI documentation agents

> AI understands your repo, codebase, and project structure.


## 📁 Smart File System
- Create files & folders
- Nested folder structure
- Fast navigation
- Tree-based explorer
- Instant search
- Rename, delete, move files
- Versioned documents
- Conflict-safe edits


## 📝 Live Markdown Editor
- Real-time markdown preview
- GitHub-flavored markdown
- Mermaid diagrams
- Code blocks
- Tables
- Alerts & callouts
- Math (KaTeX)
- UML diagrams
- Syntax highlighting
- Custom markdown extensions


# 🔐 Authentication & Accounts

Gitdocs AI supports secure, industry-standard authentication:

- Email/Password login
- Google Sign-in
- GitHub Sign-in
- OAuth 2.0 flows
- Token-based sessions (JWT)
- Secure cloud sessions
- Encrypted identity storage

### Benefits of Signing In
- Cloud sync
- Multi-device access
- Backup & recovery
- Cross-device editing
- Version history
- AI personalization
- Project linking
- GitHub integration
- Repository access


# ☁️ Cloud Sync (Auto Sync)

Gitdocs AI automatically syncs your data securely:

- Documents
- Folders
- Settings
- AI preferences
- Projects
- Repositories
- Metadata
- Versions

> Your workspace stays synced across devices in real-time.

### Sync Types
- **Workspace Sync**  
  Syncs your entire workspace automatically when logged in.

- **Document Sync**  
  Sync individual files across devices & sessions.


### 🔁 Cloud Sync Flow

\`\`\`mermaid
flowchart LR
User[User Device] --> Editor[Gitdocs Editor]
Editor --> LocalDB[Local Cache]
LocalDB --> SyncEngine[Sync Engine]
SyncEngine --> Cloud[Gitdocs Cloud]
Cloud --> SyncEngine
SyncEngine --> Editor
\`\`\`


# 🔗 GitHub Integration

Gitdocs AI deeply integrates with GitHub:

- Connect repositories
- Read existing README.md
- Analyze repo structure
- AI-based README generation
- Commit changes directly
- Auto PR creation
- Versioned docs
- Multi-repo support
- Branch-based docs
- Repo documentation pipelines

### 🔗 GitHub Integration Flow

\`\`\`mermaid
flowchart TD
User --> Gitdocs
Gitdocs --> GitHubAuth[GitHub OAuth]
GitHubAuth --> RepoAccess[Repo Access]
RepoAccess --> AIEngine[AI Analyzer]
AIEngine --> DocGen[Doc Generator]
DocGen --> Editor
Editor --> Commit[Commit Engine]
Commit --> GitHub
\`\`\`


# 📤 Publishing

Publish documentation instantly:

- GitHub
- GitHub Pages
- Markdown export
- HTML export
- PDF export
- Static site generators
- Custom templates
- Docs portals

Formats:
- Markdown
- HTML
- PDF

> One-click publish with AI-optimized structure.


# 🧩 Plugins & Extensions

Gitdocs AI supports advanced extensions:

- Mermaid diagrams
- UML diagrams
- KaTeX math rendering
- Alerts system
- Smart quotes
- Auto formatting
- Code preview
- Syntax engines
- Custom plugins
- AI tools
- Enterprise plugins


# 🤝 Real-Time Collaboration (Coming Soon 🚧)

> Industry-grade collaborative editing — built for teams.

**Planned Features:**
- Live multi-user editing
- Cursor presence
- Real-time sync
- Comments & mentions
- Inline discussions
- Role-based access
- Team workspaces
- Shared folders
- Org-level projects
- Conflict-free merges (CRDT)

\`\`\`mermaid
sequenceDiagram
UserA->>Gitdocs: Edit Document
UserB->>Gitdocs: Edit Same Document
Gitdocs->>SyncEngine: Merge Changes
SyncEngine->>UserA: Live Update
SyncEngine->>UserB: Live Update
\`\`\`


# ⚡ Performance

- Offline-first support
- Fast local storage
- Cloud backup
- IndexedDB caching
- Versioning system
- Conflict resolution
- Auto recovery
- Zero data loss design
- Incremental sync
- Smart caching


# 🔒 Security

- Encrypted storage
- Secure tokens
- Auth-protected APIs
- Cloud isolation
- User-based workspaces
- Private repositories
- Scoped access
- Permission control
- Secure pipelines
- Zero-trust architecture


# 🏗 Platform Architecture

\`\`\`mermaid
graph TD
UI[Frontend Editor] --> API[API Gateway]
API --> Auth[Auth Service]
API --> AI[AI Engine]
API --> Sync[Sync Service]
API --> Storage[Cloud Storage]
AI --> Models[AI Models]
Storage --> DB[Database]
Sync --> Cache[Local Cache]
\`\`\`


# 🛠 Developer Experience

Gitdocs AI is built for devs:

- API-first architecture
- Modular system
- AI agents
- Repo analyzers
- Markdown engines
- Plugin system
- Custom pipelines
- SaaS-ready
- Enterprise-ready
- Webhook support
- SDK support
- CI/CD integrations


# 🌍 Vision

Gitdocs AI aims to become:

> **The Notion + GitHub + AI for developers**

One platform for:
- Docs
- Code
- AI
- Collaboration
- Publishing
- Knowledge
- Automation
- Documentation OS


# 🚀 Get Started

1. Sign in to Gitdocs AI
2. Create your workspace
3. Connect your GitHub
4. Import your repo
5. Generate documentation
6. Edit with AI
7. Sync to cloud
8. Publish anywhere


---

> Gitdocs AI is not just a markdown editor.  
> It's an **AI Documentation Platform**.

Build. Document. Sync. Publish. Scale.  
All in one place.

**Welcome to Gitdocs AI.** 💙
`;

export const COMPONENT_LIBRARY: MarkdownComponent[] = [
  // --- EXISTING / CORE ---
  {
    id: 'hero-header',
    name: 'Hero Header',
    description: 'A large prominent header section.',
    category: 'Structure',
    iconName: 'LayoutTemplate',
    template: `# [Project Name]

> [Short Catchy Tagline]

[Brief description of the project goes here. Keep it punchy.]

---
`,
  },
  {
    id: 'title-desc',
    name: 'Title & Description',
    description: 'Standard project title with badges and text.',
    category: 'Structure',
    iconName: 'LayoutTemplate',
    template: `
# Project Title

A brief description of what this project does and who it's for.
`,
  },
  {
    id: 'badges',
    name: 'Badges',
    description: 'Status badges for build, license, version.',
    category: 'Content',
    iconName: 'Info',
    template: `[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://example.com)
[![Platform](https://img.shields.io/badge/Platform-Web-blue)](https://example.com)
`,
  },
  {
    id: 'screenshots',
    name: 'Screenshots',
    description: 'Image gallery for project demo.',
    category: 'Content',
    iconName: 'Info',
    template: `## Screenshots

![App Screenshot](https://via.placeholder.com/600x400?text=App+Screenshot)
`,
  },
  {
    id: 'demo',
    name: 'Demo',
    description: 'Link to live demo.',
    category: 'Content',
    iconName: 'MousePointerClick',
    template: `## Demo

Insert gif or link to demo

[Live Demo](https://example.com)
`,
  },
  
  // --- DOCUMENTATION SECTIONS ---
  {
    id: 'tech-stack',
    name: 'Tech Stack',
    description: 'List technologies used.',
    category: 'Content',
    iconName: 'Code2',
    template: `## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express

**Database:** MongoDB
`,
  },
  {
    id: 'features',
    name: 'Features',
    description: 'Detailed list of features.',
    category: 'Content',
    iconName: 'ListChecks',
    template: `## Features

- [x] Live Previews
- [x] Fullscreen mode
- [x] Cross platform
- [ ] Cloud Sync
`,
  },
  {
    id: 'env-vars',
    name: 'Environment Variables',
    description: 'Variables required to run the project.',
    category: 'Content',
    iconName: 'Code2',
    template: `## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

\`API_KEY\`

\`ANOTHER_VARIABLE\`
`,
  },
  {
    id: 'installation',
    name: 'Installation',
    description: 'How to install the project.',
    category: 'Content',
    iconName: 'Code2',
    template: `## Installation

Install my-project with npm

\`\`\`bash
  npm install my-project
  cd my-project
\`\`\`
`,
  },
  {
    id: 'run-locally',
    name: 'Run Locally',
    description: 'Steps to run locally.',
    category: 'Content',
    iconName: 'Code2',
    template: `## Run Locally

Clone the project

\`\`\`bash
  git clone https://link-to-project
\`\`\`

Go to the project directory

\`\`\`bash
  cd my-project
\`\`\`

Install dependencies

\`\`\`bash
  npm install
\`\`\`

Start the server

\`\`\`bash
  npm run start
\`\`\`
`,
  },
  {
    id: 'deployment',
    name: 'Deployment',
    description: 'Deployment instructions.',
    category: 'Content',
    iconName: 'Code2',
    template: `## Deployment

To deploy this project run

\`\`\`bash
  npm run deploy
\`\`\`
`,
  },
  {
    id: 'running-tests',
    name: 'Running Tests',
    description: 'How to run tests.',
    category: 'Content',
    iconName: 'ListChecks',
    template: `## Running Tests

To run tests, run the following command

\`\`\`bash
  npm run test
\`\`\`
`,
  },
  {
    id: 'api-ref',
    name: 'API Reference',
    description: 'API endpoint documentation.',
    category: 'Advanced',
    iconName: 'Code2',
    template: `## API Reference

#### Get all items

\`\`\`http
  GET /api/items
\`\`\`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| \`api_key\` | \`string\` | **Required**. Your API key |

#### Get item

\`\`\`http
  GET /api/items/\${id}
\`\`\`

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| \`id\`      | \`string\` | **Required**. Id of item to fetch |
`,
  },
  {
    id: 'color-ref',
    name: 'Color Reference',
    description: 'Design system colors.',
    category: 'Advanced',
    iconName: 'Table',
    template: `## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Example Color | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) #0a192f |
| Secondary Color | ![#f8f8f8](https://via.placeholder.com/10/f8f8f8?text=+) #f8f8f8 |
`,
  },
  
  // --- META & COMMUNITY ---
  {
    id: 'authors',
    name: 'Authors',
    description: 'Project authors.',
    category: 'Content',
    iconName: 'Info',
    template: `## Authors

- [@octocat](https://www.github.com/octocat)
`,
  },
  {
    id: 'acknowledgements',
    name: 'Acknowledgements',
    description: 'Credits and resources.',
    category: 'Content',
    iconName: 'ListChecks',
    template: `## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
`,
  },
  {
    id: 'contributing',
    name: 'Contributing',
    description: 'Contribution guidelines.',
    category: 'Content',
    iconName: 'Info',
    template: `## Contributing

Contributions are always welcome!

See \`contributing.md\` for ways to get started.

Please adhere to this project's \`code of conduct\`.
`,
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Support information.',
    category: 'Content',
    iconName: 'Info',
    template: `## Support

For support, email fake@fake.com or join our Slack channel.
`,
  },
  {
    id: 'feedback',
    name: 'Feedback',
    description: 'Feedback link.',
    category: 'Content',
    iconName: 'Info',
    template: `## Feedback

If you have any feedback, please reach out to us at fake@fake.com
`,
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Frequently Asked Questions.',
    category: 'Content',
    iconName: 'ListChecks',
    template: `## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2
`,
  },
  {
    id: 'license',
    name: 'License',
    description: 'License information.',
    category: 'Content',
    iconName: 'Info',
    template: `## License

[MIT](https://choosealicense.com/licenses/mit/)
`,
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    description: 'Future plans.',
    category: 'Structure',
    iconName: 'ListChecks',
    template: `## Roadmap

- [x] Feature 1
- [ ] Feature 2
`,
  },
  {
    id: 'used-by',
    name: 'Used By',
    description: 'Companies using this project.',
    category: 'Content',
    iconName: 'Info',
    template: `## Used By

This project is used by the following companies:

- Company 1
- Company 2
`,
  },
  
  // --- DIAGRAMS & MATH ---
  {
    id: 'mermaid-flow',
    name: 'Mermaid Flowchart',
    description: 'A standard flowchart diagram.',
    category: 'Advanced',
    iconName: 'Code2',
    template: `\`\`\`mermaid
graph TD;
    Start --> Stop;
\`\`\`
`,
  },
  {
    id: 'mermaid-seq',
    name: 'Mermaid Sequence',
    description: 'Sequence diagram.',
    category: 'Advanced',
    iconName: 'Code2',
    template: `\`\`\`mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
\`\`\`
`,
  },
  {
    id: 'math-katex',
    name: 'Math Equation',
    description: 'KaTeX Math block.',
    category: 'Advanced',
    iconName: 'Code2',
    template: `$$
\\int_0^\\infty x^2 dx
$$
`,
  },
  
  // --- GITHUB PROFILE SPECIALS ---
  {
    id: 'gh-intro',
    name: 'GH Profile: Intro',
    description: 'Intro section for Github Profile.',
    category: 'Structure',
    iconName: 'LayoutTemplate',
    template: `# Hi, I'm ! 👋
`,
  },
  {
    id: 'gh-about',
    name: 'GH Profile: About',
    description: 'About me section.',
    category: 'Content',
    iconName: 'Info',
    template: `## 🚀 About Me
I'm a full stack developer...
`,
  },
  {
    id: 'gh-skills',
    name: 'GH Profile: Skills',
    description: 'Skills list.',
    category: 'Content',
    iconName: 'Code2',
    template: `## 🛠 Skills
Javascript, HTML, CSS...
`,
  },
  {
    id: 'gh-links',
    name: 'GH Profile: Links',
    description: 'Social links.',
    category: 'Content',
    iconName: 'MousePointerClick',
    template: `## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)
`,
  },
  {
    id: 'gh-other',
    name: 'GH Profile: Other',
    description: 'Other common profile sections.',
    category: 'Content',
    iconName: 'Info',
    template: `## Other Common Sections

👩‍💻 I'm currently working on...

🧠 I'm currently learning...

👯‍♀️ I'm looking to collaborate on...

🤔 I'm looking for help with...

💬 Ask me about...

mailbox_with_mail: How to reach me...

⚡️ Fun fact...
`,
  },
];
