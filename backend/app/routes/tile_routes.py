import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from pydantic import UUID4
from sqlalchemy.orm import Session
from app.schemas.tile_schema import StoreExistingTilesRequest, TileCreate, TileDesignResponse, TileUpdate, TileResponse
from app.services.tile_service import (
    create_tile, get_existing_tile_designs, get_filtered_tiles, get_tile_by_id, get_tiles_by_collection, store_existing_tiles,
    update_tile, delete_tile, toggle_tile_status, update_tile_priority
)
from app.core.database import get_db
from typing import Collection, List, Optional
from uuid import UUID, uuid4
from app.services.tile_service import store_final_tiles
from app.schemas.tile_schema import FinalTileSubmission
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.tile_schema import ExistingTileSelection
from app.models.tiles_model import Tile
from app.core.database import get_db

router = APIRouter(prefix="/tiles", tags=["Tiles"])


from typing import List, Optional
from fastapi import Query
from uuid import UUID

# ✅ Fetch all tiles with filters, sorting, and pagination
@router.get("/all", response_model=List[TileResponse])
def get_all_tiles(
    seller_id: UUID,
    collection_id: Optional[List[str]] = Query(None),
    category_id: Optional[List[str]] = Query(None),
    series_id: Optional[List[str]] = Query(None),
    finish_id: Optional[List[str]] = Query(None),
    size_id: Optional[List[str]] = Query(None),
    material_id: Optional[List[str]] = Query(None),
    color_id: Optional[List[str]] = Query(None),
    priority: Optional[int] = None,
    status: Optional[str] = None,
    favorite: Optional[bool] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Fetch all tiles for the current seller with filtering, sorting, and pagination"""
    
    return get_filtered_tiles(
        db, seller_id, collection_id, category_id, series_id, finish_id, size_id,
        material_id, color_id, priority, status, favorite, sort_by, order, search, page, limit
    )


# ✅ Fetch Tiles by Collection (For Collection View)

@router.get("/collection/{collection_id}")
def list_tiles_by_collection(
    collection_id: UUID, 
    seller_id: Optional[UUID] = None,
    offset: int = 0, 
    limit: int = 10, 
    status: Optional[str] = None,
    priority: Optional[str] = None,
    favorite: Optional[bool] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    """
    Fetch tiles from a collection with infinite scrolling, filtering, and sorting.
    Filters: Status, Priority, Favorite.
    Sorting: Price, Usage, Created Date, Priority.
    """
    return get_tiles_by_collection(db, collection_id, seller_id, offset, limit, status, priority, favorite, sort_by, order)

# ✅ Fetc Existing Tile Designs (Filtered by Collection & Seller)
@router.get("/designs", response_model=List[TileDesignResponse])
def fetch_existing_tile_designs(
   seller_id: UUID = Query(..., description="Seller ID"),  
    collection_id: Optional[UUID] = Query(None, description="Collection ID"), 
    db: Session = Depends(get_db)
):
    """ Fetch all existing tile designs uploaded by the seller (filtered by collection if selected) """
    return get_existing_tile_designs(db, seller_id, collection_id)

# ✅ Store Selected Tiles into Collection
@router.post("/collections/{collection_id}/add-tiles")
def add_existing_tiles(
    collection_id: UUID, 
    request: StoreExistingTilesRequest, 
    db: Session = Depends(get_db)
):
    """ Add existing tile designs to a collection """
    return store_existing_tiles(db, collection_id, request.tiles)


@router.post("/store-final")
def store_tiles(final_tiles: List[FinalTileSubmission], db: Session = Depends(get_db)):
    """ Store finalized tiles in the database and move images to permanent storage. """
    return store_final_tiles(db, final_tiles)

@router.post("/store-final-multiple")
def store_tiles(final_tiles: List[FinalTileSubmission], db: Session = Depends(get_db)):
    """ Store finalized tiles in the database and move images to permanent storage. """
    return store_final_tiles(db, final_tiles)

# ✅ Create a New Tile
@router.post("/", response_model=TileResponse)
def create_new_tile(tile_data: TileCreate, db: Session = Depends(get_db)):
    return create_tile(db, tile_data)

# ✅ Soft Delete Tile
@router.delete("/{tile_id}")
def remove_tile(tile_id: UUID, db: Session = Depends(get_db)):
    return delete_tile(db, tile_id)

# ✅ Update Tile Priority (1 = Low, 2 = Medium, 3 = High)
@router.patch("/{tile_id}/priority")
def update_tile_priority_route(tile_id: UUID, priority: int, db: Session = Depends(get_db)):
    return update_tile_priority(db, tile_id, priority)

# ✅ Toggle Tile Status (Active/Inactive)
@router.patch("/{tile_id}/toggle-status")
def toggle_tile_status_route(tile_id: UUID, db: Session = Depends(get_db)):
    return toggle_tile_status(db, tile_id)

# ✅ Add Selected Existing Tiles to a Collection
@router.post("/collections/{collection_id}/add-tiles")
def add_existing_tiles_to_collection(collection_id: str, tiles: List[ExistingTileSelection], db: Session = Depends(get_db)):
    """ Add existing tile designs to a collection """
    stored_tiles = []

    for tile in tiles:
        new_tile = Tile(
            id=uuid4(),
            collection_id=collection_id,
            tile_design_id=tile.tile_design_id,
            name=tile.name,
            thickness=tile.thickness,
            color_id=tile.color_id,
            priority=2,
            status="active",
            created_at=datetime.utcnow()
        )
        db.add(new_tile)
        stored_tiles.append(new_tile)

    db.commit()
    return {"message": "Tiles added successfully!", "stored_tiles": stored_tiles}


