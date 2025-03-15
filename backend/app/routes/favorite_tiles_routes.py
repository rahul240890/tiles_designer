from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.favorite_tiles_service import toggle_favorite_tile, get_favorite_tiles
from app.core.database import get_db
from typing import List
from uuid import UUID
from app.schemas.favorite_tiles_schema import FavoriteTileResponse

router = APIRouter(prefix="/favorites", tags=["Favorite Tiles"])

# ✅ Toggle Favorite Tile
@router.post("/toggle/{seller_id}/{tile_id}")
def toggle_favorite(seller_id: UUID, tile_id: UUID, db: Session = Depends(get_db)):
    return toggle_favorite_tile(db, seller_id, tile_id)

@router.get("/{seller_id}", response_model=List[FavoriteTileResponse])
def list_favorite_tiles(seller_id: UUID, db: Session = Depends(get_db)):
    return get_favorite_tiles(db, seller_id)
