from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from enum import Enum

# ✅ Enum for User Role
class UserRole(str, Enum):
    ADMIN = "admin"
    SELLER = "seller"
    RETAILER = "retailer"
    CUSTOMER = "customer"

# ✅ Base Schema for Seller User
class SellerUserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole = UserRole.SELLER  # Default role is Seller
    seller_id: Optional[UUID] = None  # ✅ Updated to UUID

# ✅ Schema for Creating a Seller User
class SellerUserCreate(SellerUserBase):
    password: str  # Ensure password is required

# ✅ Schema for Returning a Seller User Response
class SellerUserResponse(SellerUserBase):
    id: UUID  # ✅ Updated to UUID

    class Config:
        from_attributes = True  # ✅ Ensures SQLAlchemy model compatibility
