from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import uuid
from app.state import state

router = APIRouter()

STAFF_ZONES = {
    "STF002": "A", "STF003": "C", "STF004": "E", "STF005": "D"
}

def find_nearest_staff(zone: str) -> str | None:
    # Simple: find staff in same zone, then adjacent
    for sid, z in STAFF_ZONES.items():
        if z == zone:
            return sid
    return list(STAFF_ZONES.keys())[0]  # fallback

class SOSRequest(BaseModel):
    type: str  # sos_medical | sos_security | sos_general | women_safety | missing_person
    fan_id: str = ""
    fan_name: str = "Fan"
    seat: str
    zone: str
    description: str = ""

@router.post("")
def create_sos(body: SOSRequest):
    staff_id = find_nearest_staff(body.zone)
    incident = {
        "incident_id": f"INC_{uuid.uuid4().hex[:8].upper()}",
        "type": body.type,
        "label": body.type.replace("_", " ").title(),
        "fan_id": body.fan_id,
        "fan_name": body.fan_name,
        "seat": body.seat,
        "zone": body.zone,
        "status": "open",
        "assigned_staff_id": staff_id,
        "timestamp": datetime.utcnow().isoformat(),
        "description": body.description or f"{body.type} from seat {body.seat}",
    }
    state["incidents"].append(incident)
    return {
        "success": True,
        "incident": incident,
        "message": "Help is on the way. Estimated response: 2–4 minutes.",
        "assigned_staff": staff_id,
    }
