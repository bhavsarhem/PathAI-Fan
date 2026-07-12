from fastapi import APIRouter
from app.state import state

router = APIRouter()

@router.get("/crowd-counts")
def crowd_counts():
    return {"crowd_counts": state["crowd_counts"]}

@router.get("/profile/{staff_id}")
def staff_profile(staff_id: str):
    # Demo: return mock profiles
    profiles = {
        "STF001": {"staff_id": "STF001", "name": "Marcus Johnson", "role": "organizer"},
        "STF002": {"staff_id": "STF002", "name": "Lena Fischer", "role": "security", "zone": "A"},
        "STF003": {"staff_id": "STF003", "name": "Carlos Mendez", "role": "volunteer", "zone": "C"},
        "STF004": {"staff_id": "STF004", "name": "Aisha Okonkwo", "role": "security", "zone": "E"},
        "STF005": {"staff_id": "STF005", "name": "James Park", "role": "volunteer", "zone": "D"},
    }
    return profiles.get(staff_id, {"error": "Staff not found"})
