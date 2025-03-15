from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.database import Base
import uuid

class TileSize(Base):
    __tablename__ = "tile_sizes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class TileSeries(Base):
    __tablename__ = "tile_series"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class TileMaterial(Base):
    __tablename__ = "tile_materials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class TileFinish(Base):
    __tablename__ = "tile_finishes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class TileCategory(Base):
    __tablename__ = "tile_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class TileColor(Base):
    __tablename__ = "tile_colors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, nullable=False)
    hex_code = Column(String(7), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
