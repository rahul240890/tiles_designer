from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
import enum

class UserRole(str, enum.Enum):  # ✅ Define Enum for User Roles
    ADMIN = "admin"
    SELLER = "seller"
    RETAILER = "retailer"
    CUSTOMER = "customer"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # ✅ Store role as String to avoid issues

    seller_id = Column(UUID(as_uuid=True), ForeignKey("sellers.id", ondelete="SET NULL"), nullable=True)

    seller = relationship("Seller", back_populates="users")  # ✅ One-to-Many Relationship with Seller
