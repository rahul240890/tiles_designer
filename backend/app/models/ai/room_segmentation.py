from sqlalchemy import Column, ForeignKey, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.core.database import Base

class RoomSegmentation(Base):
    __tablename__ = "room_segmentations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_image_url = Column(String(500), nullable=False)
    wall_mask_url = Column(String(500), nullable=False)
    floor_mask_url = Column(String(500), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
