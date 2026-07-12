from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.state import state

router = APIRouter()

# Rule-based evacuation logic — NOT AI
ZONE_GATE_MAP = {
    "A": {"primary": "G1", "secondary": "G2"},
    "B": {"primary": "G3", "secondary": "G2"},
    "C": {"primary": "G4", "secondary": "G3"},
    "D": {"primary": "G5", "secondary": "G6"},
    "E": {"primary": "G6", "secondary": "G7"},
    "F": {"primary": "G7", "secondary": "G8"},
    "G": {"primary": "G2", "secondary": "G1"},
    "H": {"primary": "G8", "secondary": "G7"},
}
EVACUATION_GATE_CAPACITY = {
    "G1": 1000, "G2": 800, "G3": 900, "G4": 900,
    "G5": 1000, "G6": 800, "G7": 700, "G8": 600,
}

def get_evacuation_gate(zone: str) -> str:
    """Deterministic, rule-based gate assignment — no LLM."""
    mapping = ZONE_GATE_MAP.get(zone, ZONE_GATE_MAP["G"])
    # In production, check live gate crowd counts from state
    return mapping["primary"]  # simplified for demo

class BroadcastRequest(BaseModel):
    reason: str = "General emergency"

@router.post("/broadcast")
def trigger_broadcast(body: BroadcastRequest):
    zones = ["A","B","C","D","E","F","G","H"]
    assignments = {z: get_evacuation_gate(z) for z in zones}
    state["emergency_mode"] = True
    state["gate_assignments"] = assignments
    return {
        "success": True,
        "emergency_mode": True,
        "gate_assignments": assignments,
        "message": "Emergency broadcast triggered. All fans will receive personalized exit instructions.",
    }

@router.delete("/broadcast")
def clear_emergency():
    state["emergency_mode"] = False
    state["gate_assignments"] = {}
    return {"success": True, "emergency_mode": False}

@router.get("/exit")
def fan_exit(fan_id: str = Query(""), seat: str = Query("A1")):
    zone = seat[0].upper() if seat else "G"
    if state["emergency_mode"]:
        gate = state["gate_assignments"].get(zone, get_evacuation_gate(zone))
    else:
        gate = ZONE_GATE_MAP.get(zone, {}).get("primary", "G1")
    return {
        "zone": zone,
        "assigned_gate": gate,
        "emergency_mode": state["emergency_mode"],
        "gate_assignments": state["gate_assignments"] if state["emergency_mode"] else {},
    }

@router.get("/status")
def emergency_status():
    return {
        "emergency_mode": state["emergency_mode"],
        "gate_assignments": state["gate_assignments"],
    }
