from sqlalchemy.orm import Session, joinedload
from app.models.collection_model import FavoriteCollection, TileCollection
from uuid import UUID
from fastapi import HTTPException

def favorite_collection(db: Session, seller_id: UUID, collection_id: UUID):
    """ Adds a collection to a seller's favorite list """

    collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    existing_favorite = db.query(FavoriteCollection).filter(
        FavoriteCollection.seller_id == seller_id,
        FavoriteCollection.collection_id == collection_id
    ).first()
    if existing_favorite:
        raise HTTPException(status_code=409, detail="Collection already favorited")

    new_favorite = FavoriteCollection(seller_id=seller_id, collection_id=collection_id)
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    return {"message": "Collection added to favorites"}

def unfavorite_collection(db: Session, seller_id: UUID, collection_id: UUID):
    """ Removes a collection from a seller's favorite list """

    favorite = db.query(FavoriteCollection).filter(
        FavoriteCollection.seller_id == seller_id,
        FavoriteCollection.collection_id == collection_id
    ).first()

    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite entry not found")

    db.delete(favorite)
    db.commit()

    return {"message": "Collection removed from favorites"}

def get_favorites(db: Session, seller_id: UUID):
    """ Fetches all favorite collections for a seller """

    favorites = db.query(FavoriteCollection).options(joinedload(FavoriteCollection.collection)).filter(
        FavoriteCollection.seller_id == seller_id
    ).all()

    return favorites  # ✅ Returns list directly

def toggle_favorite_collection(db: Session, seller_id: UUID, collection_id: UUID):
    """ Toggles favorite status for a collection """

    collection = db.query(TileCollection).filter(
        TileCollection.id == collection_id,
        TileCollection.deleted_at.is_(None)  # ✅ Ensure collection is not deleted
    ).first()

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found or has been deleted")

    # ✅ Check if the collection is already favorited
    existing_favorite = db.query(FavoriteCollection).filter(
        FavoriteCollection.seller_id == seller_id,
        FavoriteCollection.collection_id == collection_id
    ).first()

    if existing_favorite:
        # ✅ If already favorited, remove from favorites
        db.delete(existing_favorite)
        db.commit()
        return {"message": "Collection removed from favorites", "is_favorite": False}
    else:
        # ✅ If not favorited, add to favorites
        new_favorite = FavoriteCollection(seller_id=seller_id, collection_id=collection_id)
        db.add(new_favorite)
        db.commit()
        db.refresh(new_favorite)
        return {"message": "Collection added to favorites", "is_favorite": True}
