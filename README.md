# BuildStream

Visual AI workflow builder for designing, deploying, and monitoring LLM-powered automation pipelines.

<!-- Add screenshot here -->

## Features

- **Dashboard** — Overview of workflow statistics, recent runs, and deployment status
- **Visual Workflow Editor** — Drag-and-drop pipeline builder with ReactFlow canvas
- **Workflow Runs** — Execute and monitor workflow runs with real-time status updates
- **Knowledge Base** — Upload and manage documents for RAG-powered workflows
- **Prompt Library** — Create, version, and reuse prompt templates across workflows
- **One-Click Deploy** — Deploy workflows to production with deployment management
- **Monitoring** — Track performance metrics, latency, and error rates
- **Marketplace** — Browse and import community-built workflow templates
- **Settings** — API keys, team management, and project configuration
- **Auth** — User login and signup with session management

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand, Immer
- **Flow Editor:** ReactFlow
- **Charts:** Recharts
- **Code Display:** react-syntax-highlighter
- **File Upload:** react-dropzone
- **Database:** Supabase (with SSR helpers)
- **Notifications:** react-hot-toast
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project

### Installation

```bash
git clone <repo-url>
cd buildstream
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── dashboard/        # Main dashboard
│   ├── workflows/        # Workflow list, editor, and run views
│   ├── knowledge/        # Knowledge base management
│   ├── prompts/          # Prompt template library
│   ├── deploy/           # Deployment management
│   ├── monitoring/       # Performance monitoring
│   ├── marketplace/      # Template marketplace
│   ├── settings/         # Project settings
│   └── auth/             # Login and signup
├── components/           # Shared UI components
└── lib/                  # Store, utilities, Supabase client
```

## License

MIT
