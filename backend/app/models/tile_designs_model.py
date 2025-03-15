from sqlalchemy import Column, String, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class TileDesign(Base):
    __tablename__ = "tile_designs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tile_name = Column(String(255), nullable=False)
    tile_code = Column(String(20), nullable=True)
    color_id = Column(UUID(as_uuid=True), ForeignKey("tile_colors.id", ondelete="SET NULL"), nullable=True)
    image_url = Column(String(500), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

# ✅ Add relationship to Tile (One-To-Many)
    tiles = relationship("Tile", back_populates="design")  # ✅ This fixes the error
    color = relationship("TileColor", backref="tile_designs")
