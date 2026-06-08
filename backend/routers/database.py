from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3, os

router = APIRouter()

class QueryBody(BaseModel):
    db_path: str
    query: str

def get_conn(db_path: str):
    if not os.path.exists(db_path):
        raise HTTPException(404, "DB file not found")
    return sqlite3.connect(db_path)

@router.get("/tables")
def list_tables(db_path: str):
    conn = get_conn(db_path)
    cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cur.fetchall()]
    conn.close()
    return {"tables": tables}

@router.get("/schema")
def get_schema(db_path: str, table: str):
    conn = get_conn(db_path)
    cur = conn.execute(f"PRAGMA table_info({table})")
    schema = [{"cid": r[0], "name": r[1], "type": r[2]} for r in cur.fetchall()]
    conn.close()
    return {"schema": schema}

@router.get("/rows")
def get_rows(db_path: str, table: str, page: int = 1, page_size: int = 50):
    conn = get_conn(db_path)
    offset = (page - 1) * page_size
    cur = conn.execute(f"SELECT * FROM {table} LIMIT {page_size} OFFSET {offset}")
    cols = [d[0] for d in cur.description]
    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
    conn.close()
    return {"columns": cols, "rows": rows}

@router.post("/query")
def run_query(body: QueryBody):
    conn = get_conn(body.db_path)
    try:
        cur = conn.execute(body.query)
        cols = [d[0] for d in cur.description] if cur.description else []
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        conn.close()
        return {"columns": cols, "rows": rows}
    except Exception as e:
        raise HTTPException(400, str(e))