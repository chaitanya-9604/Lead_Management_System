from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from datetime import date

app = FastAPI()

# Frontend (Vite - localhost:5173) ko backend se baat karne de
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = "leads.db"

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def startup():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            company TEXT,
            source TEXT,
            status TEXT DEFAULT 'New',
            created TEXT
        )
    """)
    conn.commit()
    conn.close()

class LeadIn(BaseModel):
    name: str
    email: str
    phone: str
    company: str = ""
    source: str = "Website"
    status: str = "New"

def row_to_dict(row):
    return dict(row)

@app.get("/leads")
def get_leads():
    conn = get_db()
    rows = conn.execute("SELECT * FROM leads").fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

@app.post("/leads")
def create_lead(lead: LeadIn):
    if "@" not in lead.email:
        raise HTTPException(status_code=422, detail="Invalid email")
    conn = get_db()
    try:
        cur = conn.execute(
            "INSERT INTO leads (name, email, phone, company, source, status, created) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (lead.name, lead.email, lead.phone, lead.company, lead.source, lead.status, date.today().isoformat())
        )
        conn.commit()
        new_id = cur.lastrowid
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already exists")
    row = conn.execute("SELECT * FROM leads WHERE id = ?", (new_id,)).fetchone()
    conn.close()
    return row_to_dict(row)

@app.put("/leads/{lead_id}")
def update_lead(lead_id: int, lead: LeadIn):
    conn = get_db()
    cur = conn.execute(
        "UPDATE leads SET name=?, email=?, phone=?, company=?, source=?, status=? WHERE id=?",
        (lead.name, lead.email, lead.phone, lead.company, lead.source, lead.status, lead_id)
    )
    conn.commit()
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Lead not found")
    row = conn.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
    conn.close()
    return row_to_dict(row)

@app.delete("/leads/{lead_id}")
def delete_lead(lead_id: int):
    conn = get_db()
    cur = conn.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted"}
