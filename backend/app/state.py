"""In-memory state for demo (replaces DB in hackathon mode)."""
import json
from pathlib import Path

# Load stadium layout
_layout_path = Path(__file__).parent.parent.parent / "src" / "data" / "stadium_layout.json"
try:
    with open(_layout_path) as f:
        STADIUM_LAYOUT = json.load(f)
except FileNotFoundError:
    STADIUM_LAYOUT = {"zones": [], "gates": [], "washrooms": [], "food_counters": [], "parking_zones": [], "first_aid": [], "security_points": []}

INCIDENTS = []
CROWD_COUNTS = {
    "A": {"current": 980, "capacity": 1200},
    "B": {"current": 840, "capacity": 1100},
    "C": {"current": 1100, "capacity": 1300},
    "D": {"current": 950, "capacity": 1200},
    "E": {"current": 720, "capacity": 1100},
    "F": {"current": 890, "capacity": 1100},
    "G": {"current": 2200, "capacity": 3000},
    "H": {"current": 380, "capacity": 500},
}
EMERGENCY_MODE = False
GATE_ASSIGNMENTS = {}

state = {
    "layout": STADIUM_LAYOUT,
    "incidents": INCIDENTS,
    "crowd_counts": CROWD_COUNTS,
    "emergency_mode": EMERGENCY_MODE,
    "gate_assignments": GATE_ASSIGNMENTS,
}
