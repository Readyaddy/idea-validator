import operator
from typing import TypedDict, Annotated, List, Dict, Any


def merge_dicts(a: dict, b: dict) -> dict:
    """Reducer that merges two dicts together (b overwrites a on key collision)."""
    return {**a, **b}


class AgentState(TypedDict):
    # Phase 1
    raw_input: str
    vision_questions: List[str]
    vision_answers: List[str]
    v1_concept: str
    
    # Phase 2
    competitor_matrix: str
    market_trend_report: str
    graveyard_lessons: str
    mvp_scope: str
    unit_economics: str
    
    # Phase 3
    ux_friction_report: str
    investment_report: str
    distribution_plan: str
    compliance_report: str
    
    # Phase 4
    loop_count: int
    attack_vector: str
    
    # Phase 5
    prd: str
    decision: str
    golden_features: List[str]
    unmitigated_risks: List[str]

    # Summaries (merged across agents)
    summaries: Annotated[Dict[str, str], merge_dicts]
