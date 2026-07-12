from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(
    title="PathAI Fan Navigator API",
    description="FIFA World Cup 2026 — Smart Stadium Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-memory state (demo) ───────────────────────────────────────────────────
from app.state import state

# ─── Routes ──────────────────────────────────────────────────────────────────
from app.routes import auth, chat, nearest, sos, incidents, staff, layout, emergency

app.include_router(auth.router,      prefix="/auth",      tags=["Auth"])
app.include_router(chat.router,      prefix="/chat",      tags=["Chat"])
app.include_router(nearest.router,   prefix="/nearest",   tags=["Nearest"])
app.include_router(sos.router,       prefix="/sos",       tags=["SOS"])
app.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])
app.include_router(staff.router,     prefix="/staff",     tags=["Staff"])
app.include_router(layout.router,    prefix="/layout",    tags=["Layout"])
app.include_router(emergency.router, prefix="/emergency", tags=["Emergency"])


@app.get("/health")
def health():
    return {"status": "ok", "app": "PathAI Fan Navigator", "event": "FIFA World Cup 2026"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
