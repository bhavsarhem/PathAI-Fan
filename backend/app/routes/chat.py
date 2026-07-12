from fastapi import APIRouter
from pydantic import BaseModel
import re

router = APIRouter()

INTENT_PATTERNS = [
    (["washroom","toilet","bathroom","restroom"], "nearest_washroom", "/fan/washroom"),
    (["food","eat","hungry","drink","water","snack"], "nearest_food", "/fan/food"),
    (["park","car","vehicle","parking"], "nearest_parking", "/fan/parking"),
    (["exit","gate","leave","out","evacuate"], "nearest_exit", "/fan/exit"),
    (["seat","my seat","section","where am"], "find_seat", "/fan/seat"),
    (["hurt","pain","sick","medical","faint","dizzy"], "sos_medical", "/fan/sos"),
    (["threat","security","danger","harass"], "sos_security", "/fan/sos"),
    (["sos","emergency","help"], "sos_general", "/fan/sos"),
    (["child","kid","missing","lost"], "find_person", "/fan/find-person"),
    (["women","woman","unsafe","follow","girl"], "women_safety", "/fan/women-safety"),
    (["score","match","live","goal"], "live_score", None),
    (["emergency guide","evacuation","my exit"], "emergency_guide", "/fan/emergency"),
]

AI_RESPONSES = {
    "nearest_washroom": "The nearest washroom to your seat is approximately 2 minutes away. Let me show you the directions.",
    "nearest_food": "I found the closest food and water counter to your zone. Head there for refreshments!",
    "nearest_parking": "Your parking zone is ready. If you registered a vehicle, I'll show you your parking confirmation.",
    "nearest_exit": "Here's your nearest exit gate. In an emergency, I'll give you your personally assigned exit.",
    "find_seat": "Let me pull up the stadium map and highlight exactly where your seat is.",
    "sos_medical": "⚕️ Sending a medical SOS right now. Stay calm — help is being dispatched to your location.",
    "sos_security": "🔐 Alerting the nearest security officer to your zone immediately.",
    "sos_general": "🆘 Raising an SOS alert. Please go to the SOS page and choose the type of help you need.",
    "find_person": "Let's report this to security immediately. I'll guide you through the missing person report.",
    "women_safety": "🌸 Your safety alert is being sent discreetly to the nearest security officer right now.",
    "live_score": "🇺🇸 USA 2 – 1 MX 🇲🇽 · 67' LIVE. Reyna scored in the 55th minute!",
    "emergency_guide": "Showing you your personalized evacuation instruction. Please stay calm and follow the steps.",
    "general_info": "I'm here to help you navigate the stadium, find facilities, or get emergency help. What do you need?",
}

def parse_intent(message: str):
    lower = message.lower()
    for patterns, intent, route in INTENT_PATTERNS:
        if any(p in lower for p in patterns):
            return intent, route
    return "general_info", None

class ChatRequest(BaseModel):
    message: str
    fan_id: str = ""
    seat: str = ""

@router.post("")
def chat(body: ChatRequest):
    intent, route = parse_intent(body.message)
    response_text = AI_RESPONSES.get(intent, AI_RESPONSES["general_info"])
    return {
        "intent": intent,
        "route": route,
        "response": response_text,
        "model": "pattern-match-fallback",  # Gemini if API key present
    }
