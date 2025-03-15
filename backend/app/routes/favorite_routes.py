from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.favorite_service import (
    favorite_collection,
    unfavorite_collection,
    get_favorites,
    toggle_favorite_collection
)
from app.schemas.collection_schema import TileCollectionResponse
from app.core.database import get_db
from typing import List
from uuid import UUID

router = APIRouter(prefix="/collections/favorite", tags=["Favorite Collections"])

# ✅ Add a collection to favorites
@router.post("/{collection_id}")
def add_favorite(collection_id: UUID, seller_id: UUID, db: Session = Depends(get_db)):
    return favorite_collection(db, seller_id, collection_id)

# ✅ Remove a collection from favorites
@router.delete("/{collection_id}")
def remove_favorite(collection_id: UUID, seller_id: UUID, db: Session = Depends(get_db)):
    return unfavorite_collection(db, seller_id, collection_id)

# ✅ Get all favorite collections for a seller
@router.get("/", response_model=List[TileCollectionResponse])
def list_favorites(seller_id: UUID, db: Session = Depends(get_db)):
    return get_favorites(db, seller_id)

@router.post("/toggle/{collection_id}")
def toggle_favorite(collection_id: UUID, seller_id: UUID, db: Session = Depends(get_db)):
    return toggle_favorite_collection(db, seller_id, collection_id)

