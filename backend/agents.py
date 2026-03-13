import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools import DuckDuckGoSearchResults
from pydantic import BaseModel, Field
from state import AgentState

# Prompt imports
from prompts import vision_aligner as va_prompt
from prompts import idea_expander as ie_prompt
from prompts import data_gatherer as dg_prompt
from prompts import market_analyst as ma_prompt
from prompts import historian_researcher as hr_prompt
from prompts import the_scoper as ts_prompt
from prompts import cfo_calculator as cfo_prompt
from prompts import target_user as tu_prompt
from prompts import seed_investor as si_prompt
from prompts import growth_strategist as gs_prompt
from prompts import compliance_officer as co_prompt
from prompts import devils_advocate as da_prompt
from prompts import validator_optimist as vo_prompt
from prompts import the_refiner as tr_prompt
from prompts import the_judge as tj_prompt


def get_llm(temperature=0.7):
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=temperature)


# ─── Phase 1: Inception & Alignment ────────────────────────────────────────────

class VisionQuestions(BaseModel):
    questions: list[str] = Field(description="3 to 5 piercing questions to eliminate ambiguity")


def vision_aligner(state: AgentState):
    raw_prompt = state.get("raw_input", "")
    prompt = va_prompt.build_prompt(raw_prompt)
    structured_llm = get_llm(0.4).with_structured_output(VisionQuestions)
    res = structured_llm.invoke(prompt)
    return {"vision_questions": res.questions}


def idea_expander(state: AgentState):
    raw_prompt = state.get("raw_input", "")
    qs = state.get("vision_questions", [])
    ans = state.get("vision_answers", [])
    prompt = ie_prompt.build_prompt(raw_prompt, qs, ans)
    res = get_llm().invoke(prompt)
    return {"v1_concept": res.content}


# ─── Phase 2: Data & Market Engine ─────────────────────────────────────────────

search = DuckDuckGoSearchResults(num_results=3)


def data_gatherer(state: AgentState):
    concept = state.get("v1_concept", "")
    search_query = get_llm().invoke(
        f"Extract a concise 3-5 word search query to find competitors and existing solutions for this concept: {concept[:500]}"
    ).content.strip()
    try:
        search_results = search.invoke(search_query)
    except Exception:
        search_results = "Search unavailable right now."
    prompt = dg_prompt.build_prompt(concept, search_results)
    res = get_llm().invoke(prompt)
    return {"competitor_matrix": res.content}


def market_analyst(state: AgentState):
    concept = state.get("v1_concept", "")
    prompt = ma_prompt.build_prompt(concept)
    res = get_llm().invoke(prompt)
    return {"market_trend_report": res.content}


def historian_researcher(state: AgentState):
    concept = state.get("v1_concept", "")
    prompt = hr_prompt.build_prompt(concept)
    res = get_llm().invoke(prompt)
    return {"graveyard_lessons": res.content}


def the_scoper(state: AgentState):
    concept = state.get("v1_concept", "")
    matrix = state.get("competitor_matrix", "")
    prompt = ts_prompt.build_prompt(concept, matrix)
    res = get_llm().invoke(prompt)
    return {"mvp_scope": res.content}


def cfo_calculator(state: AgentState):
    mvp = state.get("mvp_scope", state.get("v1_concept", ""))
    prompt = cfo_prompt.build_prompt(mvp)
    res = get_llm().invoke(prompt)
    return {"unit_economics": res.content}


# ─── Phase 3: Stakeholder Reality Check ────────────────────────────────────────

def target_user(state: AgentState):
    mvp = state.get("mvp_scope", "")
    matrix = state.get("competitor_matrix", "")
    prompt = tu_prompt.build_prompt(mvp, matrix)
    res = get_llm().invoke(prompt)
    return {"ux_friction_report": res.content}


def seed_investor(state: AgentState):
    mvp = state.get("mvp_scope", "")
    market = state.get("market_trend_report", "")
    econ = state.get("unit_economics", "")
    prompt = si_prompt.build_prompt(mvp, market, econ)
    res = get_llm().invoke(prompt)
    return {"investment_report": res.content}


def growth_strategist(state: AgentState):
    econ = state.get("unit_economics", "")
    ux = state.get("ux_friction_report", "")
    prompt = gs_prompt.build_prompt(econ, ux)
    res = get_llm().invoke(prompt)
    return {"distribution_plan": res.content}


def compliance_officer(state: AgentState):
    mvp = state.get("mvp_scope", "")
    prompt = co_prompt.build_prompt(mvp)
    res = get_llm().invoke(prompt)
    return {"compliance_report": res.content}


# ─── Phase 4: The Crucible (MAD Loop) ──────────────────────────────────────────

def devils_advocate(state: AgentState):
    graveyard = state.get("graveyard_lessons", "")
    ux = state.get("ux_friction_report", "")
    inv = state.get("investment_report", "")
    comp = state.get("compliance_report", "")
    prompt = da_prompt.build_prompt(graveyard, ux, inv, comp)
    res = get_llm().invoke(prompt)
    loop_count = state.get("loop_count", 0) + 1
    return {"attack_vector": res.content, "loop_count": loop_count}


def validator_optimist(state: AgentState):
    concept = state.get("v1_concept", "")
    attack = state.get("attack_vector", "")
    prompt = vo_prompt.build_prompt(concept, attack)
    res = get_llm().invoke(prompt)
    return {"v1_concept": res.content}


# ─── Phase 5: Synthesis & Execution ────────────────────────────────────────────

class FinalVerdict(BaseModel):
    decision: str = Field(description="Go / No-Go / Pivot")
    golden_features: list[str] = Field(description="2-3 validated things making this unique and profitable")
    unmitigated_risks: list[str] = Field(description="Top 3 threats not solved")


def the_refiner(state: AgentState):
    concept = state.get("v1_concept", "")
    prompt = tr_prompt.build_prompt(concept)
    res = get_llm().invoke(prompt)
    return {"prd": res.content}


def the_judge(state: AgentState):
    prd = state.get("prd", "")
    prompt = tj_prompt.build_prompt(prd)
    structured_llm = get_llm(0.2).with_structured_output(FinalVerdict)
    res = structured_llm.invoke(prompt)
    return {
        "decision": res.decision,
        "golden_features": res.golden_features,
        "unmitigated_risks": res.unmitigated_risks
    }
