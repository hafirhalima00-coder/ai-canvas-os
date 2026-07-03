# AI Canvas OS

> **Beyond the Chatbot — A visual AI-native workspace for orchestrating agents, tools, and workflows.**

<video src="https://github.com/hafirhalima00-coder/ai-canvas-os/raw/master/public/demo.mp4" controls width="100%" style="max-width: 720px; border-radius: 12px;"></video>

[![CI](https://github.com/hafirhalima00-coder/ai-canvas-os/actions/workflows/ci.yml/badge.svg)](https://github.com/hafirhalima00-coder/ai-canvas-os/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-vercel-blue)](https://ai-canvas-os.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)

---

## 🧠 What Replaces the Dashboard?

Traditional dashboards are passive. Chatbots are isolated. **AI Canvas OS** introduces a third paradigm — a visual, collaborative workspace where you:

- 🎨 **Design** workflows by dragging AI blocks onto an infinite canvas
- 🔗 **Connect** blocks into executable pipelines
- 🤖 **Orchestrate** AI agents (Research, Writer, Analyst, Coder, CRM, Email, Image Generator)
- 👁️ **Watch** execution animate in real-time with status updates
- ✅ **Approve** human-in-the-loop blocks that pause until reviewed
- 📊 **Analyze** performance with built-in analytics

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Infinite Canvas** | Pan, zoom, and arrange blocks freely using React Flow |
| **8 AI Blocks** | Research, Writer, Analyst, Coder, CRM, Email, Image Generator, Human Approval |
| **Drag & Drop** | Searchable block library with drag-to-canvas interaction |
| **Workflow Execution** | Topological sort pipeline execution with real-time animation |
| **Human Approval** | Blocks that pause execution until manually approved/denied |
| **Memory Panel** | Context, variables, and document management sidebar |
| **Version History** | Snapshot-based versioning with restore capability |
| **Analytics Dashboard** | Execution time, cost estimates, success rates, run history |
| **Command Palette** | `Ctrl+K` for quick actions (VSCode-style) |
| **Templates** | 4 pre-built workflow templates (Content, Data, Code, Marketing) |
| **Export / Import** | Share workflows as JSON files |
| **Dark Mode** | Full dark theme with smooth toggle |
| **Keyboard Shortcuts** | Power-user keyboard navigation |
| **Notification Center** | Real-time workflow event notifications |
| **Responsive** | Mobile-friendly layout |

---

## 🏗️ Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with ThemeProvider + Navbar
│   ├── page.tsx                  # Landing page with hero + feature cards
│   ├── canvas/page.tsx           # Infinite canvas workspace
│   └── dashboard/page.tsx        # Analytics dashboard
├── components/
│   ├── blocks/                   # AI block node components
│   │   ├── AIBlockNode.tsx       # React Flow custom node (8 types)
│   │   └── BlockConfigPanel.tsx  # Per-block configuration side panel
│   ├── canvas/                   # Canvas components
│   │   ├── Canvas.tsx            # Main React Flow canvas (DnD, toolbar)
│   │   ├── BlockPalette.tsx      # Searchable block library (4 categories)
│   │   └── CommandPalette.tsx    # Ctrl+K command palette (14 commands)
│   ├── dashboard/                # Dashboard widgets (stats, history, timeline)
│   ├── layout/                   # UI shell components
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── CollapsibleSidebar.tsx# Resizable block palette sidebar
│   │   └── ThemeProvider.tsx     # next-themes wrapper (dark default)
│   ├── panels/                   # Side panels
│   │   ├── MemoryPanel.tsx       # Context / Variables / Documents tabs
│   │   ├── NotificationCenter.tsx# Bell dropdown with read/unread
│   │   ├── VersionHistory.tsx    # Snapshot create, restore, delete
│   │   └── WorkflowTemplates.tsx # Template browser (4 templates)
│   └── ui/                       # 16 shadcn/ui primitives
│       ├── avatar, badge, button, card, dialog, dropdown-menu
│       ├── input, label, scroll-area, select, separator
│       ├── switch, tabs, textarea, toast, tooltip
├── lib/
│   ├── services/                 # Business logic services
│   │   ├── workflow-engine.ts    # Topological sort + block executors
│   │   ├── version-history.ts    # Snapshot CRUD (localStorage)
│   │   └── analytics.ts          # Run analytics (localStorage)
│   ├── stores/                   # Zustand state management (5 stores)
│   │   ├── canvas-store.ts       # Blocks, edges, selection, snapshots
│   │   ├── workflow-store.ts     # Execution state + analytics store
│   │   ├── memory-store.ts       # Memory panel (3 seeded items)
│   │   ├── notification-store.ts # Notification queue (max 50)
│   │   └── template-store.ts     # 4 pre-seeded workflow templates
│   ├── types.ts                  # All TypeScript types + BLOCK_REGISTRY
│   └── utils.ts                  # cn(), generateId(), formatDuration(), etc.
├── __tests__/                    # Vitest unit tests
│   ├── setup.ts                  # jest-dom matchers
│   └── utils.test.ts             # Utility function tests
├── docker/                       # Docker deployment
│   ├── Dockerfile                # Multi-stage (deps → build → runner)
│   ├── docker-compose.yml        # App service + nginx reverse proxy
│   └── nginx.conf                # Static asset caching + compression
└── .github/workflows/ci.yml      # CI: lint → build → test
```

### Data Flow

```
User Drags Block → BlockPalette → Canvas Store (Zustand)
                                      ↓
                              React Flow renders nodes
                                      ↓
                      User connects blocks with edges
                                      ↓
                      Run Workflow → Workflow Engine
                                      ↓
                  Topological Sort → Execute Blocks in Order
                                      ↓
            ┌──────────────────── Block Status Updates ────────────────┐
            ↓                    ↓                    ↓                 ↓
        Research              Writer              Approval          Image Gen
      (web search)       (content gen)        (pause/await)       (generate)
            ↓                    ↓                    ↓                 ↓
                      ┌─── Results propagate to next block ───┐
                      ↓                                      ↓
              Memory Store                            Analytics Store
              (context panel)                     (dashboard widgets)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- **npm 9+** (or pnpm / yarn)

### Installation

```bash
git clone https://github.com/hafirhalima00-coder/ai-canvas-os.git
cd ai-canvas-os
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
docker compose -f docker/docker-compose.yml up --build
```

---

## 🧩 Block Types

| Block | Icon | Color | Description | Inputs | Outputs |
|-------|------|-------|-------------|--------|---------|
| Research | 🔍 | Blue `#3b82f6` | Search the web and gather information | 1 | 1 |
| Writer | ✍️ | Purple `#8b5cf6` | Generate content with AI | 1 | 1 |
| Analyst | 📊 | Amber `#f59e0b` | Analyze data and generate insights | 1 | 2 |
| Coder | 💻 | Green `#10b981` | Generate and review code | 1 | 1 |
| CRM | 👥 | Pink `#ec4899` | Query customer data and interactions | 1 | 1 |
| Email | 📧 | Red `#ef4444` | Send emails via connected service | 1 | 1 |
| Image Gen | 🖼️ | Teal `#14b8a6` | Generate images with AI | 1 | 1 |
| Approval | ✅ | Orange `#f97316` | Pause execution until approved/denied | 1 | 2 |

### Block Categories

| Category | Blocks |
|----------|--------|
| **Core AI** | Research, Writer, Analyst, Coder |
| **Integrations** | CRM, Email |
| **Media** | Image Generator |
| **Workflow Control** | Human Approval |

---

## 🧩 Workflow Templates

| Template | Description | Blocks |
|----------|-------------|--------|
| **Content Pipeline** | Research → Write → Review → Publish | 4 |
| **Data Analysis Pipeline** | Extract → Analyze → Visualize → Report | 4 |
| **Code Review Pipeline** | Generate → Review → Approve → Deploy | 4 |
| **CRM Outreach Campaign** | Query → Personalize → Review → Send | 4 |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open command palette |
| `Delete` / `Backspace` | Remove selected node |
| `Ctrl+S` | Save snapshot |
| `Ctrl+Shift+E` | Export workflow JSON |
| `Ctrl+Shift+I` | Import workflow JSON |
| `Ctrl+M` | Toggle memory panel |
| `Space` + drag | Pan canvas |
| `Ctrl+Scroll` | Zoom in/out |

### Command Palette Commands

| Category | Commands |
|----------|----------|
| **Add Block** | All 8 block types |
| **Workflow** | Run, Stop, Clear Canvas, Save Snapshot |
| **File** | Export JSON, Import JSON |
| **Navigation** | Open Dashboard |
| **Preferences** | Toggle Dark Mode |

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_OLLAMA_URL` | Ollama API endpoint | `http://localhost:11434` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

### Ollama Integration

AI Canvas OS can integrate with local Ollama models for private AI execution:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2

# The canvas will automatically connect to localhost:11434
```

---

## 🧪 Running Tests

```bash
npm test                # Run all tests (Vitest)
npm run test:watch      # Watch mode
npm run lint            # ESLint
npm run build           # Type-check + production build
```

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hafirhalima00-coder/ai-canvas-os)

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

The multi-stage `Dockerfile` produces a minimal production image (~120 MB) using `output: "standalone"` mode.

---

## 🛣️ Roadmap

- [ ] **Real-time Collaboration** — Multi-user canvas editing via WebSockets
- [ ] **Ollama Integration** — Connect to local LLMs for private execution
- [ ] **Custom Block SDK** — Build and register custom AI blocks
- [ ] **Sub-workflows** — Nest workflows inside workflow blocks
- [ ] **API Gateway** — Expose workflows as REST endpoints
- [ ] **Plugin System** — Third-party block marketplace
- [ ] **Mobile Companion** — React Native app for approval/status

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © hafirhalima00-coder

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) — React framework
- [React Flow (@xyflow/react)](https://reactflow.dev) — Node-based UI library
- [shadcn/ui](https://ui.shadcn.com) — UI component system
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [Lucide Icons](https://lucide.dev) — Icon library
- [next-themes](https://github.com/pacocoursey/next-themes) — Theme switching
- [Vitest](https://vitest.dev) — Unit testing
- [Ollama](https://ollama.ai) — Local AI execution

---

> **built by Halima Hafir**

