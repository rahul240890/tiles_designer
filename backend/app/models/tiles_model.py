from sqlalchemy import Column, String, ForeignKey, Numeric, Integer, Text, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Tile(Base):
    __tablename__ = "tiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    collection_id = Column(UUID(as_uuid=True), ForeignKey("tile_collections.id", ondelete="CASCADE"), nullable=False, index=True)
    tile_design_id = Column(UUID(as_uuid=True), ForeignKey("tile_designs.id", ondelete="SET NULL"), nullable=True, index=True)

    price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, nullable=True)
    batch_number = Column(String(50), nullable=True)
    thickness = Column(Numeric(5,2), nullable=True)

    priority = Column(Integer, default=5, nullable=True)
    usage_count = Column(Integer, default=0, nullable=True)
    last_used = Column(TIMESTAMP, default=None, nullable=True)
    description = Column(Text, nullable=True)

    status = Column(Enum("active", "inactive", name="tile_status"), default="active", nullable=False)
    deleted_at = Column(TIMESTAMP, default=None, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    collection = relationship("TileCollection", back_populates="tiles")
    design = relationship("TileDesign", back_populates="tiles")
