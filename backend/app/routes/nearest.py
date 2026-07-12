from fastapi import APIRouter, Query
from app.state import state

router = APIRouter()

ZONE_NEAREST = {
    "A": {"washroom": "W1",  "food": "F1",  "parking": "P1", "gate": "G1", "first_aid": "FA1", "security": "SP1"},
    "B": {"washroom": "W3",  "food": "F3",  "parking": "P2", "gate": "G3", "first_aid": "FA2", "security": "SP2"},
    "C": {"washroom": "W4",  "food": "F4",  "parking": "P2", "gate": "G4", "first_aid": "FA2", "security": "SP3"},
    "D": {"washroom": "W6",  "food": "F6",  "parking": "P3", "gate": "G5", "first_aid": "FA3", "security": "SP4"},
    "E": {"washroom": "W8",  "food": "F7",  "parking": "P3", "gate": "G6", "first_aid": "FA4", "security": "SP5"},
    "F": {"washroom": "W10", "food": "F9",  "parking": "P4", "gate": "G7", "first_aid": "FA4", "security": "SP6"},
    "G": {"washroom": "W2",  "food": "F2",  "parking": "P1", "gate": "G2", "first_aid": "FA5", "security": "SP8"},
    "H": {"washroom": "W5",  "food": "F5",  "parking": "P1", "gate": "G8", "first_aid": "FA6", "security": "SP8"},
}

def seat_to_zone(seat: str) -> str:
    if not seat:
        return "G"
    prefix = seat[0].upper()
    return prefix if prefix in ZONE_NEAREST else "G"

def get_facility(layout_key: str, facility_id: str):
    for item in state["layout"].get(layout_key, []):
        if item.get("id") == facility_id:
            return item
    return None

@router.get("/{facility_type}")
def nearest(facility_type: str, seat: str = Query("A1")):
    zone = seat_to_zone(seat)
    mapping = ZONE_NEAREST.get(zone, ZONE_NEAREST["G"])

    if facility_type == "washroom":
        fid = mapping["washroom"]
        data = get_facility("washrooms", fid)
        return {"zone": zone, "facility_type": "washroom", "id": fid, "data": data, "walk_minutes": 2}
    elif facility_type == "food":
        fid = mapping["food"]
        data = get_facility("food_counters", fid)
        return {"zone": zone, "facility_type": "food", "id": fid, "data": data, "walk_minutes": 3}
    elif facility_type == "parking":
        fid = mapping["parking"]
        data = get_facility("parking_zones", fid)
        return {"zone": zone, "facility_type": "parking", "id": fid, "data": data}
    elif facility_type == "gate":
        fid = mapping["gate"]
        data = get_facility("gates", fid)
        return {"zone": zone, "facility_type": "gate", "id": fid, "data": data}
    elif facility_type == "first_aid":
        fid = mapping["first_aid"]
        data = get_facility("first_aid", fid)
        return {"zone": zone, "facility_type": "first_aid", "id": fid, "data": data}
    elif facility_type == "security":
        fid = mapping["security"]
        data = get_facility("security_points", fid)
        return {"zone": zone, "facility_type": "security", "id": fid, "data": data}
    else:
        return {"error": f"Unknown facility type: {facility_type}"}
