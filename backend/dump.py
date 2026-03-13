import sys
import traceback
from graph import graph

config = {"configurable": {"thread_id": "1"}}
state_update = {"raw_input": "An AI powered robotic barista"}

try:
    for event in graph.stream(state_update, config, stream_mode="updates"):
        pass
except Exception as e:
    with open('error.txt', 'w', encoding='utf-8') as f:
        traceback.print_exc(file=f)
