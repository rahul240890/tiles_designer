from sqlalchemy import Column, ForeignKey, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.core.database import Base

class ProcessedImage(Base):
    __tablename__ = "processed_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    segmentation_id = Column(UUID(as_uuid=True), ForeignKey("room_segmentations.id", ondelete="CASCADE"), nullable=False)
    applied_tiles_data = Column(String, nullable=False)  # JSON (which tile applied to which section)
    processed_image_url = Column(String(500), nullable=False)  # URL of the final processed image
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
