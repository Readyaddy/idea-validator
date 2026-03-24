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


def get_llm(temperature=0.7, api_key=None):
    # max_retries helps when we hit the 15 requests per minute limit on free tier
    kwargs = dict(model="gemini-2.5-flash", temperature=temperature, max_retries=10)
    if api_key:
        kwargs["api_key"] = api_key
    return ChatGoogleGenerativeAI(**kwargs)


def generate_summary(content: str, api_key=None) -> str:
    """Generate a concise 1-2 sentence executive summary of an agent's output."""
    import time
    # Sleep briefly to avoid hitting the 15 RPM rate limit since each node makes 2 requests
    time.sleep(2)
    try:
        llm = get_llm(0.2, api_key=api_key)
        res = llm.invoke(
            f"Summarize the following analysis in exactly 1-2 concise sentences. "
            f"Be direct, specific, and capture the single most important takeaway. "
            f"No preamble, no labels, just the summary:\n\n{content[:3000]}"
        )
        return res.content.strip()
    except Exception:
        return ""


# ─── Phase 1: Inception & Alignment ────────────────────────────────────────────

class VisionQuestions(BaseModel):
    questions: list[str] = Field(description="3 to 5 piercing questions to eliminate ambiguity")


def vision_aligner(state: AgentState):
    api_key = state.get("api_key")
    raw_prompt = state.get("raw_input", "")
    prompt = va_prompt.build_prompt(raw_prompt)
    structured_llm = get_llm(0.4, api_key=api_key).with_structured_output(VisionQuestions)
    res = structured_llm.invoke(prompt)
    return {"vision_questions": res.questions}


def idea_expander(state: AgentState):
    api_key = state.get("api_key")
    raw_prompt = state.get("raw_input", "")
    qs = state.get("vision_questions", [])
    ans = state.get("vision_answers", [])
    prompt = ie_prompt.build_prompt(raw_prompt, qs, ans)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"v1_concept": res.content, "summaries": {"idea_expander": summary}}


# ─── Phase 2: Data & Market Engine ─────────────────────────────────────────────

search = DuckDuckGoSearchResults(num_results=3)


def data_gatherer(state: AgentState):
    api_key = state.get("api_key")
    concept = state.get("v1_concept", "")
    search_query = get_llm(api_key=api_key).invoke(
        f"Extract a concise 3-5 word search query to find competitors and existing solutions for this concept: {concept[:500]}"
    ).content.strip()
    try:
        search_results = search.invoke(search_query)
    except Exception:
        search_results = "Search unavailable right now."
    prompt = dg_prompt.build_prompt(concept, search_results)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"competitor_matrix": res.content, "summaries": {"data_gatherer": summary}}


def market_analyst(state: AgentState):
    api_key = state.get("api_key")
    concept = state.get("v1_concept", "")
    prompt = ma_prompt.build_prompt(concept)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"market_trend_report": res.content, "summaries": {"market_analyst": summary}}


def historian_researcher(state: AgentState):
    api_key = state.get("api_key")
    concept = state.get("v1_concept", "")
    prompt = hr_prompt.build_prompt(concept)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"graveyard_lessons": res.content, "summaries": {"historian_researcher": summary}}


def the_scoper(state: AgentState):
    api_key = state.get("api_key")
    concept = state.get("v1_concept", "")
    matrix = state.get("competitor_matrix", "")
    prompt = ts_prompt.build_prompt(concept, matrix)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"mvp_scope": res.content, "summaries": {"the_scoper": summary}}


def cfo_calculator(state: AgentState):
    api_key = state.get("api_key")
    mvp = state.get("mvp_scope", state.get("v1_concept", ""))
    prompt = cfo_prompt.build_prompt(mvp)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"unit_economics": res.content, "summaries": {"cfo_calculator": summary}}


# ─── Phase 3: Stakeholder Reality Check ────────────────────────────────────────

def target_user(state: AgentState):
    api_key = state.get("api_key")
    mvp = state.get("mvp_scope", "")
    matrix = state.get("competitor_matrix", "")
    prompt = tu_prompt.build_prompt(mvp, matrix)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"ux_friction_report": res.content, "summaries": {"target_user": summary}}


def seed_investor(state: AgentState):
    api_key = state.get("api_key")
    mvp = state.get("mvp_scope", "")
    market = state.get("market_trend_report", "")
    econ = state.get("unit_economics", "")
    prompt = si_prompt.build_prompt(mvp, market, econ)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"investment_report": res.content, "summaries": {"seed_investor": summary}}


def growth_strategist(state: AgentState):
    api_key = state.get("api_key")
    econ = state.get("unit_economics", "")
    ux = state.get("ux_friction_report", "")
    prompt = gs_prompt.build_prompt(econ, ux)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"distribution_plan": res.content, "summaries": {"growth_strategist": summary}}


def compliance_officer(state: AgentState):
    api_key = state.get("api_key")
    mvp = state.get("mvp_scope", "")
    prompt = co_prompt.build_prompt(mvp)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"compliance_report": res.content, "summaries": {"compliance_officer": summary}}


# ─── Phase 4: The Crucible (MAD Loop) ──────────────────────────────────────────

def devils_advocate(state: AgentState):
    api_key = state.get("api_key")
    graveyard = state.get("graveyard_lessons", "")
    ux = state.get("ux_friction_report", "")
    inv = state.get("investment_report", "")
    comp = state.get("compliance_report", "")
    prompt = da_prompt.build_prompt(graveyard, ux, inv, comp)
    res = get_llm(api_key=api_key).invoke(prompt)
    loop_count = state.get("loop_count", 0) + 1
    summary = generate_summary(res.content, api_key=api_key)
    return {"attack_vector": res.content, "loop_count": loop_count, "summaries": {"devils_advocate": summary}}


def validator_optimist(state: AgentState):
    api_key = state.get("api_key")
    concept = state.get("v1_concept", "")
    attack = state.get("attack_vector", "")
    prompt = vo_prompt.build_prompt(concept, attack)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"v1_concept": res.content, "summaries": {"validator_optimist": summary}}


# ─── Phase 5: Synthesis & Execution ────────────────────────────────────────────

class FinalVerdict(BaseModel):
    decision: str = Field(description="Go / No-Go / Pivot")
    golden_features: list[str] = Field(description="2-3 validated things making this unique and profitable")
    unmitigated_risks: list[str] = Field(description="Top 3 threats not solved")


def the_refiner(state: AgentState):
    api_key = state.get("api_key")
    concept = state.get("v1_concept", "")
    prompt = tr_prompt.build_prompt(concept)
    res = get_llm(api_key=api_key).invoke(prompt)
    summary = generate_summary(res.content, api_key=api_key)
    return {"prd": res.content, "summaries": {"the_refiner": summary}}


def the_judge(state: AgentState):
    api_key = state.get("api_key")
    prd = state.get("prd", "")
    prompt = tj_prompt.build_prompt(prd)
    structured_llm = get_llm(0.2, api_key=api_key).with_structured_output(FinalVerdict)
    res = structured_llm.invoke(prompt)
    return {
        "decision": res.decision,
        "golden_features": res.golden_features,
        "unmitigated_risks": res.unmitigated_risks
    }
