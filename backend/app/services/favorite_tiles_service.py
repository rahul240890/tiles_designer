from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.favorite_tiles_model import FavoriteTile
from app.models.tiles_model import Tile
from app.schemas.favorite_tiles_schema import FavoriteTileCreate
from fastapi import HTTPException
from uuid import UUID
from datetime import datetime


def toggle_favorite_tile(db: Session, seller_id: UUID, tile_id: UUID):
    """Toggle a tile as favorite or remove from favorites"""
    favorite = db.query(FavoriteTile).filter(
        FavoriteTile.seller_id == seller_id,
        FavoriteTile.tile_id == tile_id
    ).first()

    if favorite:
        db.delete(favorite)
        db.commit()
        return {"message": "Tile removed from favorites", "status": "removed"}

    new_favorite = FavoriteTile(seller_id=seller_id, tile_id=tile_id, created_at=datetime.utcnow())
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return {"message": "Tile added to favorites", "status": "added"}

def get_favorite_tiles(db: Session, seller_id: UUID):
    """ Get all favorite tiles for a seller """
    favorites = db.query(FavoriteTile).filter(FavoriteTile.seller_id == seller_id).all()
    return favorites
