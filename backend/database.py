import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "idea_validator.db")


def get_connection():
    """Get a connection to the SQLite database, creating tables if needed."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")  # Better concurrent read/write
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            thread_id TEXT UNIQUE NOT NULL,
            raw_input TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'running',
            state_snapshot TEXT NOT NULL DEFAULT '{}',
            node_history TEXT NOT NULL DEFAULT '[]',
            decision TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn


def create_session(thread_id: str, raw_input: str) -> dict:
    """Create a new validation session when the user submits an idea."""
    conn = get_connection()
    now = datetime.utcnow().isoformat()
    try:
        conn.execute(
            """INSERT INTO sessions (thread_id, raw_input, status, state_snapshot, node_history, created_at, updated_at)
               VALUES (?, ?, 'running', ?, '[]', ?, ?)""",
            (thread_id, raw_input, json.dumps({"raw_input": raw_input}), now, now)
        )
        conn.commit()
        return {"thread_id": thread_id, "status": "created"}
    except sqlite3.IntegrityError:
        # Session already exists (e.g. page refresh), update it
        conn.execute(
            "UPDATE sessions SET raw_input = ?, status = 'running', updated_at = ? WHERE thread_id = ?",
            (raw_input, now, thread_id)
        )
        conn.commit()
        return {"thread_id": thread_id, "status": "resumed"}
    finally:
        conn.close()


def update_session_state(thread_id: str, state_diff: dict, node_name: str):
    """Update session state after each node completes. Merges state_diff into existing snapshot."""
    conn = get_connection()
    try:
        row = conn.execute("SELECT state_snapshot, node_history FROM sessions WHERE thread_id = ?", (thread_id,)).fetchone()
        if not row:
            return

        current_state = json.loads(row["state_snapshot"])
        current_history = json.loads(row["node_history"])

        # Merge the new state diff into the existing state
        current_state.update(state_diff)
        current_history.append(node_name)

        now = datetime.utcnow().isoformat()
        conn.execute(
            "UPDATE sessions SET state_snapshot = ?, node_history = ?, updated_at = ? WHERE thread_id = ?",
            (json.dumps(current_state), json.dumps(current_history), now, thread_id)
        )
        conn.commit()
    finally:
        conn.close()


def complete_session(thread_id: str, decision: str = None):
    """Mark a session as completed."""
    conn = get_connection()
    try:
        now = datetime.utcnow().isoformat()
        conn.execute(
            "UPDATE sessions SET status = 'completed', decision = ?, updated_at = ? WHERE thread_id = ?",
            (decision, now, thread_id)
        )
        conn.commit()
    finally:
        conn.close()


def fail_session(thread_id: str):
    """Mark a session as failed."""
    conn = get_connection()
    try:
        now = datetime.utcnow().isoformat()
        conn.execute(
            "UPDATE sessions SET status = 'failed', updated_at = ? WHERE thread_id = ?",
            (now, thread_id)
        )
        conn.commit()
    finally:
        conn.close()


def get_session(thread_id: str) -> dict | None:
    """Retrieve a specific session by thread_id."""
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM sessions WHERE thread_id = ?", (thread_id,)).fetchone()
        if row:
            return {
                "id": row["id"],
                "thread_id": row["thread_id"],
                "raw_input": row["raw_input"],
                "status": row["status"],
                "state": json.loads(row["state_snapshot"]),
                "node_history": json.loads(row["node_history"]),
                "decision": row["decision"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
        return None
    finally:
        conn.close()


def list_sessions() -> list[dict]:
    """List all sessions, most recent first."""
    conn = get_connection()
    try:
        rows = conn.execute("SELECT * FROM sessions ORDER BY created_at DESC").fetchall()
        return [
            {
                "id": row["id"],
                "thread_id": row["thread_id"],
                "raw_input": row["raw_input"],
                "status": row["status"],
                "decision": row["decision"],
                "node_count": len(json.loads(row["node_history"])),
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
            for row in rows
        ]
    finally:
        conn.close()


def delete_session(session_id: int) -> bool:
    """Delete a session by its database ID."""
    conn = get_connection()
    try:
        cursor = conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()
