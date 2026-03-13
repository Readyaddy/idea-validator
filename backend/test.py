import sys
import traceback
from graph import graph
from dotenv import load_dotenv

load_dotenv()

config = {"configurable": {"thread_id": "1"}}
state_update = {"raw_input": "An AI powered robotic barista"}

try:
    print("Starting graph test...")
    for event in graph.stream(state_update, config, stream_mode="updates"):
        print(f"Event: {event}")
except Exception as e:
    print(f"FAILED WITH EXCEPTION:")
    traceback.print_exc()
