from sqlalchemy import Column, String, DateTime, Numeric, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
import enum

class SellerType(str, enum.Enum):
    RETAILER = "Retailer"
    DISTRIBUTOR = "Distributor"
    MANUFACTURER = "Manufacturer"

class SellerStatus(str, enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"

class Seller(Base):
    __tablename__ = "sellers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    seller_name = Column(String(255), nullable=False)
    seller_mobile = Column(String(15), nullable=False)
    owner_name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)  
    address = Column(String, nullable=False)
    city = Column(String(100), nullable=False)
    gst_number = Column(String(20), nullable=True)
    logo_url = Column(String(255), nullable=True)
    seller_type = Column(String, nullable=False)
    plan_type = Column(String(50), nullable=True)
    plan_price = Column(Numeric(10, 2), nullable=True)
    payment_status = Column(String, nullable=False, default="Pending")
    subscribed_date = Column(DateTime, server_default=func.now())
    renew_date = Column(DateTime, nullable=False)
    next_billing_date = Column(DateTime, nullable=False)
    trial_period_end = Column(DateTime, nullable=True)
    last_payment_date = Column(DateTime, nullable=True)
    max_users_allowed = Column(Numeric(10, 2), nullable=True)
    documents = Column(JSON, nullable=True)
    notes = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Active")

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # ✅ Add relationship to collections
    collections = relationship("TileCollection", back_populates="seller", cascade="all, delete")
    users = relationship("User", back_populates="seller")  # Links seller to users
