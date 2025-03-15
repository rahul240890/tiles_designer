from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum

# ✅ Enum for Seller Type
class SellerType(str, Enum):
    RETAILER = "Retailer"
    DISTRIBUTOR = "Distributor"
    MANUFACTURER = "Manufacturer"

# ✅ Enum for Seller Status
class SellerStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"

# ✅ Base Seller Schema
class SellerBase(BaseModel):
    seller_name: str
    seller_mobile: str
    owner_name: str
    email: EmailStr
    address: str
    city: str
    gst_number: Optional[str] = None
    logo_url: Optional[str] = None
    seller_type: SellerType
    status: SellerStatus = SellerStatus.ACTIVE
    max_users_allowed: Optional[int] = None

# ✅ Schema for Creating a Seller (Requires Password)
class SellerCreate(SellerBase):
    plan_type: Optional[str] = None
    plan_price: Optional[float] = None
    payment_status: str
    subscribed_date: datetime
    renew_date: datetime
    next_billing_date: datetime
    trial_period_end: Optional[datetime] = None
    last_payment_date: Optional[datetime] = None
    documents: Optional[dict] = None
    notes: Optional[str] = None

    # ✅ Password is required only for creating a new seller
    password: constr(min_length=8)  # type: ignore

# ✅ Schema for Updating a Seller (Password is Optional)
class SellerUpdate(BaseModel):
    seller_name: Optional[str] = None
    seller_mobile: Optional[str] = None
    owner_name: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    gst_number: Optional[str] = None
    logo_url: Optional[str] = None
    seller_type: Optional[SellerType] = None
    status: Optional[SellerStatus] = None
    max_users_allowed: Optional[int] = None
    plan_type: Optional[str] = None
    plan_price: Optional[float] = None
    payment_status: Optional[str] = None
    subscribed_date: Optional[datetime] = None
    renew_date: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    trial_period_end: Optional[datetime] = None
    last_payment_date: Optional[datetime] = None
    documents: Optional[dict] = None
    notes: Optional[str] = None

    # ✅ Password is optional when updating
    password: Optional[constr(min_length=8)] = None  # type: ignore

# ✅ Schema for Returning a Seller Response (Includes All Fields)
class SellerResponse(SellerBase):
    id: UUID  # ✅ Updated to UUID
    plan_type: Optional[str] = None
    plan_price: Optional[float] = None
    payment_status: Optional[str] = None
    subscribed_date: Optional[datetime] = None
    renew_date: Optional[datetime] = None
    next_billing_date: Optional[datetime] = None
    trial_period_end: Optional[datetime] = None
    last_payment_date: Optional[datetime] = None
    documents: Optional[dict] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
