from fastapi import APIRouter
from app.state import state

router = APIRouter()

@router.get("")
def get_layout():
    return state["layout"]

@router.put("")
def update_layout(update: dict):
    # Organizer-only in production — for demo, accept any update
    state["layout"].update(update)
    return {"success": True, "layout": state["layout"]}
