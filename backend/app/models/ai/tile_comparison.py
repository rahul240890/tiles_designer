from sqlalchemy import Column, ForeignKey, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.core.database import Base

class TileComparison(Base):
    __tablename__ = "tile_comparisons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    segmentation_id = Column(UUID(as_uuid=True), ForeignKey("room_segmentations.id", ondelete="CASCADE"), nullable=False)
    
    layout_1_url = Column(String(500), nullable=False)  # AI-generated image for Layout 1
    layout_2_url = Column(String(500), nullable=True)   # AI-generated image for Layout 2
    layout_3_url = Column(String(500), nullable=True)   # AI-generated image for Layout 3
    layout_4_url = Column(String(500), nullable=True)   # AI-generated image for Layout 4

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
