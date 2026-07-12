from fastapi import APIRouter, HTTPException
from app.state import state

router = APIRouter()

@router.get("")
def list_incidents(status: str = "all", zone: str = ""):
    incidents = state["incidents"]
    if status != "all":
        incidents = [i for i in incidents if i["status"] == status]
    if zone:
        incidents = [i for i in incidents if i["zone"] == zone]
    return {"incidents": incidents, "total": len(incidents)}

@router.patch("/{incident_id}/claim")
def claim_incident(incident_id: str, staff_id: str = ""):
    for i in state["incidents"]:
        if i["incident_id"] == incident_id:
            if i["status"] != "open":
                raise HTTPException(400, "Incident already claimed or resolved")
            i["status"] = "claimed"
            i["assigned_staff_id"] = staff_id
            return {"success": True, "incident": i}
    raise HTTPException(404, "Incident not found")

@router.patch("/{incident_id}/resolve")
def resolve_incident(incident_id: str):
    for i in state["incidents"]:
        if i["incident_id"] == incident_id:
            i["status"] = "resolved"
            return {"success": True, "incident": i}
    raise HTTPException(404, "Incident not found")
