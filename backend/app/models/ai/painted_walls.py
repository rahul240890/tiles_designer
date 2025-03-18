from sqlalchemy import Column, ForeignKey, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.core.database import Base

class PaintedWall(Base):
    __tablename__ = "painted_walls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    segmentation_id = Column(UUID(as_uuid=True), ForeignKey("room_segmentations.id", ondelete="CASCADE"), nullable=False)
    paint_color = Column(String(7), nullable=False)  # HEX Color Code
    painted_image_url = Column(String(500), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
