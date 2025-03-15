from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from enum import Enum
from uuid import UUID

# ✅ Enum for User Role
class UserRole(str, Enum):
    ADMIN = "admin"
    SELLER = "seller"
    RETAILER = "retailer"
    CUSTOMER = "customer"

# ✅ Base User Schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole
    seller_id: Optional[UUID] = None  # ✅ Updated to UUID

# ✅ Schema for Creating a User
class UserCreate(UserBase):
    password: constr(min_length=8) # type: ignore

# ✅ Schema for Returning a User Response
class UserResponse(UserBase):
    id: UUID  # ✅ Updated to UUID

    class Config:
        from_attributes = True
