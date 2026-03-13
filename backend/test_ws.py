import asyncio
import websockets
import json

async def test_ws():
    uri = "ws://localhost:8000/ws/123"
    async with websockets.connect(uri) as websocket:
        print("Connected to WS.")
        
        # Send start command
        payload = {"action": "start", "raw_input": "An AI robotic barista"}
        await websocket.send(json.dumps(payload))
        print("Sent idea...")
        
        # Listen for events
        while True:
            response = await websocket.recv()
            data = json.loads(response)
            if data["type"] == "update":
                print(f"Update from node: {list(data['data'].keys())[0]}")
            elif data["type"] == "interrupt":
                print(f"INTERRUPT REACHED at node: {data['node']}")
                break
            elif data["type"] == "error":
                print(f"SERVER ENCOUNTERED ERROR: {data['message']}")
                break
            elif data["type"] == "done":
                print("SERVER FINISHED.")
                break

asyncio.run(test_ws())
