from sqlalchemy import Column, String, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.core.database import Base

class RoomTemplate(Base):
    __tablename__ = "room_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False, unique=True)  # Room Template Name (e.g., Modern Living Room)
    category = Column(Enum("Modern", "Classic", "Minimalist", "Industrial", name="room_category"), nullable=False)
    image_url = Column(String(500), nullable=False)  # Predefined room template image
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
