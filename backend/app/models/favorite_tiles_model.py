from sqlalchemy import Column, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class FavoriteTile(Base):
    __tablename__ = "favorite_tiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("sellers.id", ondelete="CASCADE"), nullable=False)
    tile_id = Column(UUID(as_uuid=True), ForeignKey("tiles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    tile = relationship("Tile", lazy="joined")
