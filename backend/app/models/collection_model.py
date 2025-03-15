from sqlalchemy import Column, String, ForeignKey, Text, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base
from sqlalchemy.types import Enum as SQLAlchemyEnum


COLLECTION_STATUS_ENUM = SQLAlchemyEnum("active", "inactive", name="collectionstatus")


class TileCollection(Base):
    __tablename__ = "tile_collections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("sellers.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, unique=False)

    size_id = Column(UUID(as_uuid=True), ForeignKey("tile_sizes.id", ondelete="SET NULL"), nullable=False, index=True)
    series_id = Column(UUID(as_uuid=True), ForeignKey("tile_series.id", ondelete="SET NULL"), nullable=True, index=True)
    material_id = Column(UUID(as_uuid=True), ForeignKey("tile_materials.id", ondelete="SET NULL"), nullable=True, index=True)
    finish_id = Column(UUID(as_uuid=True), ForeignKey("tile_finishes.id", ondelete="SET NULL"), nullable=True, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("tile_categories.id", ondelete="SET NULL"), nullable=True, index=True)

    description = Column(Text, nullable=True)
    status = Column(COLLECTION_STATUS_ENUM, default="active")  # ✅ Use explicitly defined ENUM
    deleted_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    seller = relationship("Seller", back_populates="collections")
    size = relationship("TileSize", lazy="joined")
    series = relationship("TileSeries", lazy="joined")
    material = relationship("TileMaterial", lazy="joined")
    finish = relationship("TileFinish", lazy="joined")
    category = relationship("TileCategory", lazy="joined")
    tiles = relationship("Tile", back_populates="collection", cascade="all, delete")

    suitable_places = relationship("CollectionSuitablePlace", back_populates="collection", cascade="all, delete")
    # ✅ Define the relationship using a STRING reference
    tiles = relationship("Tile", back_populates="collection", cascade="all, delete")

# ✅ Import at the END to prevent circular dependency
from app.models.tile_designs_model import TileDesign

class SuitablePlace(Base):
    __tablename__ = "suitable_places"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    deleted_at = Column(TIMESTAMP, nullable=True)  # ✅ Soft Delete

class CollectionSuitablePlace(Base):
    __tablename__ = "collection_suitable_places"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    collection_id = Column(UUID(as_uuid=True), ForeignKey("tile_collections.id", ondelete="CASCADE"), nullable=False, index=True)
    place_id = Column(UUID(as_uuid=True), ForeignKey("suitable_places.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    collection = relationship("TileCollection", back_populates="suitable_places")
    place = relationship("SuitablePlace")


class FavoriteCollection(Base):
    __tablename__ = "favorite_collections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("sellers.id", ondelete="CASCADE"), nullable=False)
    collection_id = Column(UUID(as_uuid=True), ForeignKey("tile_collections.id", ondelete="CASCADE"), nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
