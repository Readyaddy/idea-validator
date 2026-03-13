from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from state import AgentState
import agents

builder = StateGraph(AgentState)

# Add all nodes
node_names = [
    "vision_aligner", "idea_expander", "data_gatherer", "market_analyst",
    "historian_researcher", "the_scoper", "cfo_calculator", "target_user",
    "seed_investor", "growth_strategist", "compliance_officer",
    "devils_advocate", "validator_optimist", "the_refiner", "the_judge"
]

for name in node_names:
    builder.add_node(name, getattr(agents, name))

def check_loop_count(state: AgentState):
    if state.get("loop_count", 0) < 3:
        return "devils_advocate"
    return "the_refiner"

# We will serialize the execution for stability, but conceptually they belong to phases.
# In a production environment with complex fan-in, we would use Map-Reduce.
# Here we serialize to ensure all data is available for each step without race conditions.

# Phase 1
builder.add_edge(START, "vision_aligner")
builder.add_edge("vision_aligner", "idea_expander")

# Phase 2
builder.add_edge("idea_expander", "data_gatherer")
builder.add_edge("data_gatherer", "market_analyst")
builder.add_edge("market_analyst", "historian_researcher")
builder.add_edge("historian_researcher", "the_scoper")
builder.add_edge("the_scoper", "cfo_calculator")

# Phase 3
builder.add_edge("cfo_calculator", "target_user")
builder.add_edge("target_user", "seed_investor")
builder.add_edge("seed_investor", "growth_strategist")
builder.add_edge("growth_strategist", "compliance_officer")

# Phase 4 (MAD Loop)
builder.add_edge("compliance_officer", "devils_advocate")
builder.add_edge("devils_advocate", "validator_optimist")
builder.add_conditional_edges("validator_optimist", check_loop_count)

# Phase 5
builder.add_edge("the_refiner", "the_judge")
builder.add_edge("the_judge", END)

# Compile with interrupt before idea_expander to wait for user answers to vision questions
memory = MemorySaver()
graph = builder.compile(checkpointer=memory, interrupt_before=["idea_expander"])
