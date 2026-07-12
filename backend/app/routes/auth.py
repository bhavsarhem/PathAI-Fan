from fastapi import APIRouter
from pydantic import BaseModel
import random, time

router = APIRouter()

class OTPRequest(BaseModel):
    mobile: str

class OTPVerify(BaseModel):
    mobile: str
    otp: str

class ProfileUpdate(BaseModel):
    name: str = ""
    vehicle_number: str = ""
    seat_number: str = ""
    gate: str = "G1"

@router.post("/request-otp")
def request_otp(body: OTPRequest):
    # Simulated — always succeeds in demo
    return {"status": "sent", "mobile": body.mobile, "demo": True, "message": "OTP sent (demo: any 4-6 digit code accepted)"}

@router.post("/verify-otp")
def verify_otp(body: OTPVerify):
    if len(body.otp) < 4:
        return {"success": False, "message": "OTP too short"}
    # Demo: any OTP accepted
    token = f"demo_jwt_{body.mobile}_{int(time.time())}"
    return {"success": True, "token": token, "mobile": body.mobile}

@router.post("/profile")
def update_profile(body: ProfileUpdate):
    return {"success": True, "profile": body.dict()}
