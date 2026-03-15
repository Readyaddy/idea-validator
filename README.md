# 🚀 Idea Validator

**Subject your startup idea to a brutal gauntlet of AI agents before you write a single line of code.**

Idea Validator is a full-stack application that runs your startup idea through a rigorous 5-phase validation pipeline powered by 15 specialized AI agents. Each agent simulates a real-world stakeholder — from seed investors and growth strategists to devil's advocates and compliance officers — stress-testing your idea from every angle.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_AI-FF6B35)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-Google_AI-4285F4?logo=google&logoColor=white)

---

## 🎥 Demo

Watch the Idea Validator pipeline in action, featuring the phase-grouped Execution Engine, agent-attributed concept documents, and the MAD Loop adversarial dashboard.

![Idea Validator UI Demo](assets/demo.webp)

---

## ✨ Features

- **15 Specialized AI Agents** — Each with expert-level prompts, unique personas, and structured output schemas
- **5-Phase Validation Pipeline** — Vision Alignment → Market Research → Stakeholder Review → Adversarial Debate → Final Verdict
- **Real-time Streaming** — Watch agents think and produce results live via WebSockets
- **MAD Loop (Mutually Assured Destruction)** — A Devil's Advocate attacks your idea while a Validator defends and pivots, iterating 3 times until only the strongest version survives
- **Structured Outputs** — TAM/SAM/SOM sizing, competitor matrices, unit economics, feature triage tables, investment scorecards, and more
- **Session Persistence** — SQLite database auto-saves progress after every agent. Crash? No problem — your work survives.
- **Idea History** — Browse, revisit, and compare all past validations with GO / NO-GO / PIVOT verdict badges
- **Modern Dark UI** — Glassmorphism design with neon accents, smooth animations, and a tabbed dashboard

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              React + TypeScript + Tailwind CSS                │
│         Vite Dev Server (http://localhost:5173)               │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  ┌─────────┐│
│  │  Input   │→ │  Q&A Form    │→ │ Dashboard │  │ History ││
│  │  Phase   │  │ (Vision      │  │ (4 Tabs)  │  │  Page   ││
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

## 🤖 The 15 AI Agents

| # | Agent | Role | Key Output |
|---|-------|------|------------|
| 1 | **Vision Aligner** | Startup Advisor | 3-5 piercing questions to eliminate ambiguity |
| 2 | **Idea Expander** | Product Strategist | V1 Concept Document with problem/solution/audience |
| 3 | **Data Gatherer** | Competitive Intel Analyst | Competitor matrix, moat analysis, white space |
| 4 | **Market Analyst** | Gartner-style Researcher | TAM/SAM/SOM, 5-trend analysis, timing window |
| 5 | **Historian Researcher** | Post-Mortem Analyst | Failed startup case studies, pattern map, survival playbook |
| 6 | **The Scoper** | Ruthless PM | Feature triage (✅❌⚠️), core loop, kill criteria |
| 7 | **CFO Calculator** | Startup CFO | ARPU/CAC/LTV, 3-scenario burn rate, break-even |
| 8 | **Target User** | UX Researcher (as user) | Day-in-life narrative, friction table, adoption score |
| 9 | **Seed Investor** | VC Partner | 6-criterion scorecard, bull/base/bear returns |
| 10 | **Growth Strategist** | Growth Hacker | 7-channel analysis, 4-phase GTM, viral coefficient |
| 11 | **Compliance Officer** | Regulatory Counsel | Compliance checklist, 🚨 landmine analysis, IP strategy |
| 12 | **Devil's Advocate** | Red-Team Analyst | ⚔️ ranked attack vectors, convergence analysis |
| 13 | **Validator Optimist** | Battle-Tested CTO | 🛡️ defense matrix, V2 concept evolution |
| 14 | **The Refiner** | Technical Writer | 10-section professional PRD |
| 15 | **The Judge** | Chief Decision Officer | GO / NO-GO / PIVOT verdict |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

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

# Add your API key
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

## 📁 Project Structure

```
idea-validator/
├── backend/
│   ├── prompts/              # 15 expert-level prompt files
│   │   ├── vision_aligner.py
│   │   ├── idea_expander.py
│   │   ├── data_gatherer.py
│   │   ├── market_analyst.py
│   │   ├── historian_researcher.py
│   │   ├── the_scoper.py
│   │   ├── cfo_calculator.py
│   │   ├── target_user.py
│   │   ├── seed_investor.py
│   │   ├── growth_strategist.py
│   │   ├── compliance_officer.py
│   │   ├── devils_advocate.py
│   │   ├── validator_optimist.py
│   │   ├── the_refiner.py
│   │   └── the_judge.py
│   ├── agents.py             # Agent node functions (LLM calls)
│   ├── graph.py              # LangGraph pipeline definition
│   ├── state.py              # State schema (TypedDict)
│   ├── server.py             # FastAPI + WebSocket server
│   ├── database.py           # SQLite persistence layer
│   ├── requirements.txt
│   └── .env                  # GEMINI_API_KEY (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputPhase.tsx
│   │   │   ├── QuestionPhase.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── History.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── start.ps1                 # One-click launcher (Windows)
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

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

## ⚠️ Notes

- **Free Tier Limits**: The Gemini free tier allows ~15 requests/minute. Since the pipeline runs 15+ sequential LLM calls, it may hit rate limits. A paid API key is recommended for smooth operation.
- **Local Only**: This app runs locally on your machine. No login system needed — all data is stored in a local SQLite database.

---

## 📄 License

MIT

---

Built with ❤️ and a lot of AI agents.
