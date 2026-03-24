# Idea Validator

**Subject your startup idea to a brutal gauntlet of AI agents before you write a single line of code.**

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_AI-FF6B35)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-Google_AI-4285F4?logo=google&logoColor=white)

---

## What is Idea Validator?

Idea Validator is a free, open-source tool that stress-tests your startup idea before you invest time and money building it. Think of it as a panel of 15 expert advisors — investors, market researchers, growth strategists, devil's advocates — all powered by AI, reviewing your idea from every angle.

Most startup ideas fail not because the product was bad, but because nobody validated the idea early enough. Getting honest feedback from real investors, analysts, and users costs time and social capital. This tool gives you that brutal honesty **instantly, for free** — before you write a single line of code.

You describe your idea, answer a few clarifying questions, and then 15 AI agents analyze it across market viability, competition, unit economics, user experience, regulatory risks, and more. At the end, a Judge delivers a final **GO**, **NO-GO**, or **PIVOT** verdict.

---

## How It Works

Your idea goes through a **5-phase pipeline** with **15 specialized AI agents**:

### Phase 1 — Vision Alignment
You submit your idea. The Vision Aligner asks 3–5 pointed questions to truly understand what you're building, who it's for, and why it matters. Your answers feed every agent that follows.

### Phase 2 — Market Research
Five agents dig into the data: competitors and existing solutions, total market size (TAM/SAM/SOM), startups that tried something similar and failed, what the absolute minimum viable product looks like, and whether the numbers actually work (unit economics, burn rate, break-even).

### Phase 3 — Stakeholder Review
Four agents simulate key stakeholders: a target user walks through your product and flags friction points, a seed investor scores your idea on a 10-point scale, a growth strategist maps out distribution channels, and a compliance officer checks for regulatory landmines.

### Phase 4 — The MAD Loop
**Mutually Assured Destruction** — inspired by nuclear deterrence theory. Two AI agents go head-to-head: the **Devil's Advocate** finds every weakness, flaw, and reason your idea will fail, while the **Validator Optimist** defends it and evolves the concept to be stronger. This repeats **3 rounds**. After this battle, your idea is either battle-tested or exposed.

### Phase 5 — Final Verdict
The Refiner writes a professional Product Requirements Document (PRD) from everything gathered. Then the Judge delivers the final call: **GO** (build it), **NO-GO** (don't), or **PIVOT** (change direction).

All of this happens in real-time — you can watch each agent produce results live in the dashboard.

---

## Demo

![Idea Validator UI Demo](assets/demo.webp)

---

## Features

- **15 Specialized AI Agents** — Each with expert-level prompts, unique personas, and structured output schemas
- **5-Phase Validation Pipeline** — Vision Alignment → Market Research → Stakeholder Review → Adversarial Debate → Final Verdict
- **Real-time Streaming** — Watch agents think and produce results live via WebSockets
- **MAD Loop (Mutually Assured Destruction)** — A Devil's Advocate attacks your idea while a Validator defends and pivots, iterating 3 times
- **Structured Outputs** — TAM/SAM/SOM sizing, competitor matrices, unit economics, feature triage tables, investment scorecards, and more
- **Session Persistence** — SQLite database auto-saves progress after every agent. Crash? No problem — your work survives
- **Idea History** — Browse, revisit, and compare all past validations with GO / NO-GO / PIVOT verdict badges
- **Bring Your Own Key** — Paste your Gemini API key directly in the UI, or use a server-side `.env` file
- **Modern Dark UI** — Glassmorphism design with neon accents, smooth animations, and a tabbed dashboard

---

## The 15 AI Agents

| # | Agent | Role | Key Output |
|---|-------|------|------------|
| 1 | **Vision Aligner** | Startup Advisor | 3-5 piercing questions to eliminate ambiguity |
| 2 | **Idea Expander** | Product Strategist | V1 Concept Document with problem/solution/audience |
| 3 | **Data Gatherer** | Competitive Intel Analyst | Competitor matrix, moat analysis, white space |
| 4 | **Market Analyst** | Gartner-style Researcher | TAM/SAM/SOM, 5-trend analysis, timing window |
| 5 | **Historian Researcher** | Post-Mortem Analyst | Failed startup case studies, pattern map, survival playbook |
| 6 | **The Scoper** | Ruthless PM | Feature triage, core loop, kill criteria |
| 7 | **CFO Calculator** | Startup CFO | ARPU/CAC/LTV, 3-scenario burn rate, break-even |
| 8 | **Target User** | UX Researcher (as user) | Day-in-life narrative, friction table, adoption score |
| 9 | **Seed Investor** | VC Partner | 6-criterion scorecard, bull/base/bear returns |
| 10 | **Growth Strategist** | Growth Hacker | 7-channel analysis, 4-phase GTM, viral coefficient |
| 11 | **Compliance Officer** | Regulatory Counsel | Compliance checklist, landmine analysis, IP strategy |
| 12 | **Devil's Advocate** | Red-Team Analyst | Ranked attack vectors, convergence analysis |
| 13 | **Validator Optimist** | Battle-Tested CTO | Defense matrix, V2 concept evolution |
| 14 | **The Refiner** | Technical Writer | 10-section professional PRD |
| 15 | **The Judge** | Chief Decision Officer | GO / NO-GO / PIVOT verdict |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/Readyaddy/idea-validator.git
cd idea-validator
```

### 2. Setup Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1     # Windows (PowerShell)
# source venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

**API Key** — You have two options:
- **Option A (UI):** Skip the `.env` file entirely. Paste your API key directly in the app when you open it.
- **Option B (.env):** Create a `.env` file in the backend folder:
  ```bash
  echo GEMINI_API_KEY=your_key_here > .env
  ```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

### 4. Run the App

**Option A: One-click start (Windows PowerShell)**
```powershell
.\start.ps1
```

**Option B: Manual (two terminals)**

Terminal 1 — Backend:
```bash
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn server:app --reload
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

### 5. Open in Browser

Navigate to **http://localhost:5173** and enter your startup idea!

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              React + TypeScript + Tailwind CSS                │
│         Vite Dev Server (http://localhost:5173)               │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  ┌─────────┐│
│  │  Input   │→ │  Q&A Form    │→ │ Dashboard │  │ History ││
│  │  Phase   │  │ (Vision      │  │ (6 Tabs)  │  │  Page   ││
│  │          │  │  Alignment)  │  │           │  │         ││
│  └──────────┘  └──────────────┘  └───────────┘  └─────────┘│
└─────────────────────┬────────────────────────────────────────┘
                      │ WebSocket
┌─────────────────────▼────────────────────────────────────────┐
│                        BACKEND                                │
│              FastAPI + LangGraph + Gemini 2.5 Flash           │
│         Uvicorn Server (http://localhost:8000)                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   LangGraph Pipeline                     │  │
│  │                                                          │  │
│  │  Phase 1: Vision Aligner → Idea Expander                │  │
│  │  Phase 2: Data Gatherer → Market Analyst → Historian    │  │
│  │           → Scoper → CFO Calculator                     │  │
│  │  Phase 3: Target User → Seed Investor                   │  │
│  │           → Growth Strategist → Compliance Officer      │  │
│  │  Phase 4: Devil's Advocate ⇄ Validator Optimist (x3)   │  │
│  │  Phase 5: Refiner → Judge (Final Verdict)               │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  prompts/   │  │  database.py │  │  DuckDuckGo Search   │ │
│  │  (15 files) │  │  (SQLite)    │  │  (Web Research)      │ │
│  └─────────────┘  └──────────────┘  └──────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
idea-validator/
├── backend/
│   ├── prompts/              # 15 expert-level prompt files
│   ├── agents.py             # Agent node functions (LLM calls)
│   ├── graph.py              # LangGraph pipeline definition
│   ├── state.py              # State schema (TypedDict)
│   ├── server.py             # FastAPI + WebSocket server
│   ├── database.py           # SQLite persistence layer
│   ├── requirements.txt
│   └── .env                  # GEMINI_API_KEY (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/       # InputPhase, QuestionPhase, Dashboard, History
│   │   ├── App.tsx           # Main app with stage routing
│   │   ├── index.css         # Design system (CSS variables, glassmorphism)
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── start.ps1                 # One-click launcher (Windows)
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **LLM** | Google Gemini 2.5 Flash |
| **Agent Framework** | LangGraph |
| **Backend** | FastAPI, Uvicorn, Python |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Framer Motion |
| **Database** | SQLite (built-in, zero config) |
| **Search** | DuckDuckGo (free, no API key needed) |
| **Communication** | WebSockets (real-time streaming) |

---

## Notes

- **Free Tier Limits**: The Gemini free tier allows ~15 requests/minute. Since the pipeline runs 15+ sequential LLM calls, it may hit rate limits. A paid API key is recommended for smooth operation.
- **Local Only**: This app runs entirely on your machine. No login system, no cloud — all data is stored in a local SQLite database. Your ideas never leave your computer.

---

## License

MIT

---

Built with a lot of AI agents by [Addy](https://github.com/Readyaddy).
