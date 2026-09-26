# BusiAI — AI Decision Engine for Business Data

> **From data to decisions. With proof.**

BusiAI is an AI-powered business investigation tool that goes beyond generic AI answers. Upload your business data, ask questions in natural language, and get evidence-backed insights with full transparency into how every number was calculated.

## Key Features

- **Auto Insights** — Automatically discovers important changes in your data before you ask
- **Evidence Layer** — Every claim is backed by verifiable calculations and source data
- **What-If Simulation** — Explore data-grounded business scenarios with confidence scores
- **Decision Graph** — Visual reasoning chain from question to evidence to action

## Architecture

```
LLM (reasoning) → Validation → Python/DuckDB (calculations) → Evidence-backed UI
```

**Golden rule:** The LLM decides *what* to analyze. It never decides *what the answer is numerically*.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, React Flow |
| Backend | Python 3.12+, FastAPI, Pydantic, DuckDB |
| AI | Gemini / Groq (configurable provider abstraction) |
| Analysis | Pandas, NumPy, SciPy, DuckDB |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- npm

### Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### Verify

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Health: http://localhost:8000/health

## Project Structure

```
busiai/
├── frontend/          # Next.js application
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities
│   ├── hooks/         # Custom hooks
│   └── types/         # TypeScript types
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── main.py    # Entry point
│   │   ├── core/      # Config
│   │   ├── ingestion/ # Data upload
│   │   ├── profiling/ # Data profiling
│   │   ├── analysis/  # Analysis operations
│   │   ├── investigation/ # AI investigation
│   │   ├── evidence/  # Evidence layer
│   │   ├── simulation/ # What-If engine
│   │   ├── recommendations/ # Action recommendations
│   │   ├── graph/     # Decision graph
│   │   └── llm/       # LLM provider abstraction
│   └── tests/
├── sample_data/       # Demo datasets
├── docs/              # Documentation
├── PROJECT_SPEC.md    # Full specification
└── PROJECT_STATUS.md  # Current build status
```

## Development Phases

- [x] Phase 0 — Foundation
- [ ] Phase 1 — Ingestion + Profiling + Auto Insights
- [ ] Phase 2 — Deterministic Analysis Engine
- [ ] Phase 3 — AI Investigation + Evidence Layer
- [ ] Phase 4 — Recommendations + Decision Graph
- [ ] Phase 5 — What-If Simulation
- [ ] Phase 6 — Dashboard & UX
- [ ] Phase 7 — Reliability + Testing
- [ ] Phase 8 — Deployment + Demo

## License

MIT
