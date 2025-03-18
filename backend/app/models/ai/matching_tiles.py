from sqlalchemy import Column, ForeignKey, Numeric, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.core.database import Base

class MatchingTile(Base):
    __tablename__ = "matching_tiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tile_id = Column(UUID(as_uuid=True), ForeignKey("tiles.id", ondelete="CASCADE"), nullable=False)
    recommended_tile_id = Column(UUID(as_uuid=True), ForeignKey("tiles.id", ondelete="CASCADE"), nullable=False)
    match_score = Column(Numeric(5, 2), default=0.00)  # AI-generated match confidence score (0-100%)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
