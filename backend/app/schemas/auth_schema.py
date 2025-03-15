from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional

# ✅ Request Schema for Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ✅ Response Schema for Login
class LoginResponse(BaseModel):
    access_token: str
    role: str
    seller_id: Optional[UUID] = None  # Updated to UUID
    seller_name: Optional[str] = None
    seller_logo: Optional[str] = None
