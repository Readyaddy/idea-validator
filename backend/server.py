import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json
from graph import graph
import os
from dotenv import load_dotenv
import database as db

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── REST Endpoints for Session History ─────────────────────────────────────────

@app.get("/api/sessions")
async def list_sessions():
    """List all saved idea validation sessions."""
    sessions = db.list_sessions()
    return JSONResponse(content=sessions)


@app.get("/api/sessions/{thread_id}")
async def get_session(thread_id: str):
    """Get a specific session's full state by thread_id."""
    session = db.get_session(thread_id)
    if session:
        return JSONResponse(content=session)
    return JSONResponse(content={"error": "Session not found"}, status_code=404)


@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: int):
    """Delete a session by its database ID."""
    deleted = db.delete_session(session_id)
    if deleted:
        return JSONResponse(content={"status": "deleted"})
    return JSONResponse(content={"error": "Session not found"}, status_code=404)


# ─── WebSocket Endpoint ─────────────────────────────────────────────────────────

@app.websocket("/ws/{thread_id}")
async def websocket_endpoint(websocket: WebSocket, thread_id: str):
    await websocket.accept()
    config = {"configurable": {"thread_id": thread_id}}
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")
            
            if action == "start":
                raw_input = payload.get("raw_input")
                state_update = {"raw_input": raw_input}
                
                # Persist: create session in database
                db.create_session(thread_id, raw_input)
                
                try:
                    async for event in graph.astream(state_update, config, stream_mode="updates"):
                        # event is {node_name: state_diff}
                        node_name = list(event.keys())[0]
                        state_diff = event[node_name]
                        
                        # Persist: save state after each node completes
                        db.update_session_state(thread_id, state_diff, node_name)
                        
                        await websocket.send_text(json.dumps({"type": "update", "data": event}))
                except Exception as e:
                    db.fail_session(thread_id)
                    await websocket.send_text(json.dumps({"type": "error", "message": f"Graph error: {str(e)}"}))
                
                # Check if it stopped at interrupt
                state = graph.get_state(config)
                if state.next:
                    await websocket.send_text(json.dumps({"type": "interrupt", "node": state.next[0]}))
                else:
                    # Extract decision if available for the session record
                    full_state = graph.get_state(config).values
                    decision = full_state.get("decision", None)
                    db.complete_session(thread_id, decision)
                    await websocket.send_text(json.dumps({"type": "done"}))
                    
            elif action == "answer":
                answers = payload.get("answers")
                state_update = {"vision_answers": answers}
                graph.update_state(config, state_update, as_node="vision_aligner")
                
                # Persist: save the user's answers
                db.update_session_state(thread_id, state_update, "vision_aligner_answers")
                
                try:
                    async for event in graph.astream(None, config, stream_mode="updates"):
                        node_name = list(event.keys())[0]
                        state_diff = event[node_name]
                        
                        # Persist: save state after each node completes
                        db.update_session_state(thread_id, state_diff, node_name)
                        
                        await websocket.send_text(json.dumps({"type": "update", "data": event}))
                except Exception as e:
                    db.fail_session(thread_id)
                    await websocket.send_text(json.dumps({"type": "error", "message": f"Graph error: {str(e)}"}))
                
                state = graph.get_state(config)
                if state.next:
                    await websocket.send_text(json.dumps({"type": "interrupt", "node": state.next[0]}))
                else:
                    full_state = graph.get_state(config).values
                    decision = full_state.get("decision", None)
                    db.complete_session(thread_id, decision)
                    await websocket.send_text(json.dumps({"type": "done"}))
                    
    except WebSocketDisconnect:
        print(f"Client {thread_id} disconnected")
    except Exception as e:
        print(f"Socket error: {e}")
        try:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        except:
            pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
