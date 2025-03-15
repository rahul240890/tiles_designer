from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas.collection_schema import (
    TileCollectionCreate, TileCollectionUpdate, TileCollectionResponse
)
from app.services.collection_service import (
    create_collection, filter_collections, duplicate_collection, get_collections_by_seller, toggle_collection_status, get_collections, get_collection, search_collections, sort_collections, update_collection, delete_collection
)
from app.core.database import get_db
from typing import List, Optional
from uuid import UUID

router = APIRouter(prefix="/collections", tags=["Tile Collections"])

# ✅ Create a new Collection
# ✅ Create a new Collection with Suitable Places
@router.post("/", response_model=TileCollectionResponse)
def create_new_collection(collection_data: TileCollectionCreate, db: Session = Depends(get_db)):
    return create_collection(db, collection_data)

# ✅ Route to Fetch All Collections (Optimized)
@router.get("/", response_model=List[TileCollectionResponse])
def list_collections(seller_id: UUID, db: Session = Depends(get_db)):
    return get_collections(db, seller_id)

@router.get("/seller/{seller_id}", response_model=List[dict])
def fetch_collections_by_seller(seller_id: UUID, db: Session = Depends(get_db)):
    """ Fetch collections for a specific seller, returning only ID, Name, and Status """
    return get_collections_by_seller(db, seller_id)

# ✅ Duplicate a Collection
@router.post("/duplicate/{collection_id}", response_model=TileCollectionResponse)
def duplicate_existing_collection(collection_id: UUID, db: Session = Depends(get_db)):
    return duplicate_collection(db, collection_id)

# ✅ Get Collection by ID
@router.get("/{collection_id}", response_model=TileCollectionResponse)
def retrieve_collection(collection_id: UUID, db: Session = Depends(get_db)):
    collection = get_collection(db, collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

# ✅ Update Collection
@router.put("/{collection_id}", response_model=TileCollectionResponse)
def modify_collection(collection_id: UUID, collection_data: TileCollectionUpdate, db: Session = Depends(get_db)):
    return update_collection(db, collection_id, collection_data)

# # ✅ Delete Collection
# @router.delete("/{collection_id}")
# def remove_collection(collection_id: UUID, db: Session = Depends(get_db)):
#     return delete_collection(db, collection_id)

# ✅ Soft Delete Collection API
@router.delete("/{collection_id}", response_model=dict)
def remove_collection(collection_id: UUID, db: Session = Depends(get_db)):
    return delete_collection(db, collection_id)

# ✅ Toggle Collection Status API
@router.patch("/{collection_id}/toggle-status", response_model=dict)
def toggle_status(collection_id: UUID, db: Session = Depends(get_db)):
    return toggle_collection_status(db, collection_id)

# ✅ Search Collections
@router.get("/search", response_model=List[TileCollectionResponse])
def search_collections_route(query: str, db: Session = Depends(get_db)):
    return search_collections(db, query)

# ✅ Filter Collections
@router.get("/filter", response_model=List[TileCollectionResponse])
def filter_collections_route(
    size_id: Optional[UUID] = None,
    material_id: Optional[UUID] = None,
    finish_id: Optional[UUID] = None,
    category_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
):
    return filter_collections(db, size_id, material_id, finish_id, category_id)

# ✅ Sort Collections
@router.get("/sort", response_model=List[TileCollectionResponse])
def sort_collections_route(
    sort_by: str = Query("date", enum=["size", "material", "date"]),
    order: str = Query("asc", enum=["asc", "desc"]),
    db: Session = Depends(get_db),
):
    return sort_collections(db, sort_by, order)
