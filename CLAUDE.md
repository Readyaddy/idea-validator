# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend
```bash
cd backend
# Activate venv (Windows)
.\venv\Scripts\Activate.ps1
# or (bash on Windows)
source venv/Scripts/activate

# Run dev server
python -m uvicorn server:app --reload
# Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm run dev       # Dev server on http://localhost:5173
npm run build     # TypeScript compile + Vite bundle → dist/
npm run lint      # ESLint
```

### One-click launcher (Windows)
```powershell
.\start.ps1       # Opens backend and frontend in separate terminals
```

## Architecture

**Full-stack idea validation pipeline** — user submits a startup idea, which flows through 15 specialized AI agents in a LangGraph pipeline, with real-time results streamed to the React frontend via WebSocket.

### Flow

1. User submits idea → `vision_aligner` generates 3–5 clarifying questions
2. Pipeline pauses (LangGraph interrupt before `idea_expander`) to collect user answers
3. Remaining 14 agents run sequentially, each contributing fields to shared state
4. `devils_advocate` ↔ `validator_optimist` loop runs up to 3 times (MAD Loop) — controlled by `check_loop_count` in `graph.py`
5. `the_judge` outputs final GO/NO-GO/PIVOT verdict

### Backend (`backend/`)

| File | Role |
|------|------|
| `server.py` | FastAPI app; WebSocket `/ws/{thread_id}` for streaming; REST `/api/sessions/*` for history |
| `graph.py` | LangGraph `StateGraph` wiring all 15 nodes + conditional MAD Loop edges |
| `state.py` | `AgentState` TypedDict — single shared state passed through every node |
| `agents.py` | 15 agent functions; each calls Gemini, reads from state, writes back to state |
| `database.py` | SQLite persistence; state snapshot saved after every node completes |
| `prompts/` | One `build_prompt()` per agent (15 files); contains the expert system instructions |

All agents use **Google Gemini 2.5 Flash** via `langchain-google-genai`. `GEMINI_API_KEY` must be in `backend/.env`.

Rate limiting: agents include 2-second sleeps to stay within Gemini free tier (~15 req/min). The full pipeline makes 15+ sequential LLM calls.

### Frontend (`frontend/src/`)

Single-page app with four stages managed in `App.tsx`:

| Stage | Component | Purpose |
|-------|-----------|---------|
| `input` | `InputPhase.tsx` | Idea submission form |
| `questions` | `QuestionPhase.tsx` | Displays vision questions, captures answers |
| `dashboard` | `Dashboard.tsx` | Real-time agent execution with 4 tabs |
| `history` | `History.tsx` | Browse/load/delete past validations from SQLite |

WebSocket messages drive stage transitions. `App.tsx` owns the WebSocket connection and all state.

### Data persistence

SQLite (`backend/idea_validator.db`) stores every session. `database.py` snapshots the full `AgentState` as JSON after each node, enabling crash recovery and history browsing.

## Key conventions

- Adding a new agent: (1) create `prompts/<name>.py` with `build_prompt()`, (2) add node function in `agents.py`, (3) wire into `graph.py` with `add_node` + `add_edge`
- `AgentState` fields are typed in `state.py` — add new fields there when agents need new outputs
- Each agent should call `generate_summary()` from `agents.py` and store the result in `state["summaries"]` for the dashboard overview tab
