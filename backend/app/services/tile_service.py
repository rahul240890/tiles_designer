from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc, asc, func
from app.models.tiles_model import Tile
from app.schemas.tile_schema import ExistingTileSelection, FinalTileSubmission, TileCreate, TileDesignResponse, TileUpdate
from fastapi import HTTPException
from uuid import UUID
from datetime import datetime, timedelta
import random
import string
from app.models.attribute_models import TileCategory, TileColor, TileFinish, TileMaterial, TileSeries, TileSize
import cv2
import numpy as np
from app.utils.color_detection import extract_dominant_color, get_closest_color_name
from app.models.tiles_model import Tile
from app.models.attribute_models import TileColor
from app.utils.file_storage import move_file_to_storage
from uuid import uuid4
from datetime import datetime
import os
from app.services.progress_service import update_progress
from app.models.collection_model import TileCollection
from app.models.favorite_tiles_model import FavoriteTile
from sqlalchemy.orm import joinedload

from app.models.tile_designs_model import TileDesign


# ✅ Generate Unique Tile Code
def generate_tile_code(db: Session) -> str:
    """ Generates a unique tile code (auto-generated if not provided by seller) """
    while True:
        tile_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not db.query(Tile).filter(Tile.tile_code == tile_code).first():
            return tile_code

# ✅ Create a New Tile
# ✅ Create Tile with AI Color Detection
def create_tile(db: Session, tile_data: TileCreate, image_path: str):
    """ Creates a tile with AI-detected color. """

    try:
        color_id = get_or_create_color(db, image_path)  # ✅ Assign color_id automatically

        new_tile = Tile(**tile_data.dict(), color_id=color_id)
        db.add(new_tile)
        db.commit()
        db.refresh(new_tile)

        return new_tile

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating tile: {str(e)}")


# ✅ Fetch Tiles by Collection (Including `TileDesign` and `TileColor`)
# ✅ Fetch Tiles by Collection (Including `TileDesign` and `TileColor`)
def get_tiles_by_collection(
    db: Session, 
    collection_id: UUID, 
    seller_id: Optional[UUID] = None,
    last_id: Optional[UUID] = None,
    limit: int = 10, 
    status: Optional[str] = None,
    priority: Optional[str] = None,
    favorite: Optional[bool] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = "desc"
):
    """ Fetch Tiles with Proper `tiles_design` and `tile_colors` Joining """

    query = db.query(Tile).options(
        joinedload(Tile.design).joinedload(TileDesign.color),  # ✅ Fetch TileDesign & Color
        joinedload(Tile.collection)  # ✅ Fetch Collection details
    ).filter(Tile.collection_id == collection_id)

    # ✅ Apply Filters
    if status:
        query = query.filter(Tile.status == status)
    
    if priority:
        priority_map = {"high": 3, "medium": 2, "low": 1}
        if priority in priority_map:
            query = query.filter(Tile.priority == priority_map[priority])

    # ✅ Filter by Favorite (If seller_id is provided)
    if favorite and seller_id:
        query = query.join(FavoriteTile, Tile.id == FavoriteTile.tile_id) \
                     .filter(FavoriteTile.seller_id == seller_id)

    # ✅ Sorting Options
    sort_options = {
        "usage_count": Tile.usage_count,
        "created_at": Tile.created_at,
        "priority": Tile.priority
    }
    if sort_by in sort_options:
        order_func = desc if order == "desc" else asc
        query = query.order_by(order_func(sort_options[sort_by]))

    # ✅ Infinite Scroll (Fetching tiles after last_id)
    if last_id:
        query = query.filter(Tile.id > last_id)

    tiles = query.limit(limit).all()

    # ✅ Fetch Collection Details
    collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    # ✅ Return Updated Tile Data with `tile_colors`
    return {
        "collection": {
            "id": collection.id,
            "name": collection.name,
            "size": collection.size.name if collection.size else None,
            "series": collection.series.name if collection.series else None,
            "material": collection.material.name if collection.material else None,
            "finish": collection.finish.name if collection.finish else None,
            "category": collection.category.name if collection.category else None
        },
        "tiles": [
            {
                "id": tile.id,
                "tile_code": tile.design.tile_code if tile.design else "N/A",
                "name": tile.design.tile_name if tile.design else "Unnamed Tile",
                "image_url": tile.design.image_url if tile.design else "N/A",
                "stock_quantity": tile.stock_quantity,
                "batch_number": tile.batch_number,
                "thickness": tile.thickness,
                "usage_count": tile.usage_count,
                "priority": tile.priority,
                "status": tile.status,
                "color_name": tile.design.color.name if tile.design and tile.design.color else None,  # ✅ Fetch color name correctly
            }
            for tile in tiles
        ]
    }

# """Fetch filtered, sorted, and paginated tiles with required fields"""
def get_filtered_tiles(
    db: Session,
    seller_id,
    collection_id=None,
    category_id=None,
    series_id=None,
    finish_id=None,
    size_id=None,
    material_id=None,
    color_id=None,
    priority=None,
    status=None,
    favorite=None,
    sort_by="created_at",
    order="desc",
    search=None,
    page=1,
    limit=20
):
    """Fetch filtered, sorted, and paginated tiles with required fields"""
    query = db.query(
        Tile.id,
        TileDesign.tile_name.label("name"),
        TileDesign.image_url,
        TileColor.name.label("color_name"),
        TileColor.hex_code,
        Tile.price,
        Tile.stock_quantity,
        Tile.batch_number,
        Tile.thickness,
        Tile.usage_count,
        Tile.priority,
        Tile.status
    ).join(TileDesign, Tile.tile_design_id == TileDesign.id, isouter=True) \
     .join(TileColor, TileDesign.color_id == TileColor.id, isouter=True) \
     .join(TileCollection, Tile.collection_id == TileCollection.id) \
     .filter(TileCollection.seller_id == seller_id)

    # ✅ Apply ALL selected filters correctly
    def apply_filter(query, column, values):
        if values:
            return query.filter(column.in_(values)) if isinstance(values, list) else query.filter(column == values)
        return query

    query = apply_filter(query, Tile.collection_id, collection_id)
    query = apply_filter(query, TileCollection.category_id, category_id)
    query = apply_filter(query, TileCollection.series_id, series_id)
    query = apply_filter(query, TileCollection.finish_id, finish_id)
    query = apply_filter(query, TileCollection.size_id, size_id)
    query = apply_filter(query, TileCollection.material_id, material_id)
    query = apply_filter(query, TileDesign.color_id, color_id)

    if priority:
        query = query.filter(Tile.priority == priority)
    if status:
        query = query.filter(Tile.status == status)
    if favorite:
        query = query.join(FavoriteTile).filter(FavoriteTile.seller_id == seller_id)
    if search:
        query = query.filter(TileDesign.tile_name.ilike(f"%{search}%"))

    # ✅ Debugging SQL Query
    print("Generated SQL Query:", str(query))

    # Sorting
    sort_fields = {
        "created_at": Tile.created_at,
        "usage_count": Tile.usage_count,
        "priority": Tile.priority
    }
    if sort_by in sort_fields:
        query = query.order_by(desc(sort_fields[sort_by]) if order == "desc" else asc(sort_fields[sort_by]))

    # Pagination
    tiles = query.offset((page - 1) * limit).limit(limit).all()

    return tiles




# ✅ Get Tile by ID
def get_tile_by_id(db: Session, tile_id: UUID):
    tile = db.query(Tile).filter(Tile.id == tile_id).first()
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found")
    return tile

# ✅ Update Tile
def update_tile(db: Session, tile_id: UUID, tile_data: TileUpdate):
    tile = db.query(Tile).filter(Tile.id == tile_id).first()
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found")

    try:
        for key, value in tile_data.dict(exclude_unset=True).items():
            setattr(tile, key, value)
        db.commit()
        db.refresh(tile)
        return tile
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating tile: {str(e)}")


def toggle_tile_status(db: Session, tile_id: UUID):
    """Activate or Deactivate a Tile"""
    tile = db.query(Tile).filter(Tile.id == tile_id, Tile.deleted_at.is_(None)).first()

    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found or already deleted")

    tile.status = "inactive" if tile.status == "active" else "active"  # ✅ Toggle status
    db.commit()
    return {"message": f"Tile status updated to {tile.status}"}


# ✅ Soft Delete Tile
# ✅ Soft Delete Tile
def delete_tile(db: Session, tile_id: UUID):
    """Soft delete a tile by updating the `deleted_at` timestamp."""
    tile = db.query(Tile).filter(Tile.id == tile_id, Tile.deleted_at.is_(None)).first()
    
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found or already deleted")

    tile.deleted_at = datetime.utcnow()  # ✅ Mark as soft deleted
    db.commit()
    return {"message": "Tile soft deleted successfully"}

# Update Tile Priority: High (3), Medium (2), Low (1)
def update_tile_priority(db: Session, tile_id: UUID, priority: int):
    """Update Tile Priority: High (3), Medium (2), Low (1)"""
    if priority not in [1, 2, 3]:
        raise HTTPException(status_code=400, detail="Invalid priority level. Allowed values: 1 (Low), 2 (Medium), 3 (High)")

    tile = db.query(Tile).filter(Tile.id == tile_id, Tile.deleted_at.is_(None)).first()
    
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found or already deleted")

    tile.priority = priority
    db.commit()
    return {"message": f"Tile priority updated to {priority}"}

# ✅ Get or Create Color in Database
def get_or_create_color(db: Session, image_path: str):
    """ Detects tile color from image and ensures it exists in the database. """

    detected_hex = extract_dominant_color(image_path)
    detected_name = get_closest_color_name(detected_hex)

    color = db.query(TileColor).filter(TileColor.hex_code == detected_hex).first()
    if color:
        return color.id  # ✅ Use existing color_id

    # ✅ If color not found, create a new color
    new_color = TileColor(name=detected_name, hex_code=detected_hex)
    db.add(new_color)
    db.commit()
    db.refresh(new_color)
    return new_color.id  # ✅ Return new color_id

# //BULK UPLOADING...SAVING
def store_final_tiles(db: Session, final_tiles: list[FinalTileSubmission]):
    """ Stores finalized tiles in the database and moves images to permanent storage. """
    
    stored_tiles = []
    
    for tile in final_tiles:
        tile_id = uuid4()  # Generate Unique Tile ID

        # ✅ Step 1: Check if Color Exists, Otherwise Create It
        color = db.query(TileColor).filter(TileColor.name == tile.detected_color_name).first()
        if not color:
            # ✅ Insert the new color and get its ID
            color = TileColor(id=uuid4(), name=tile.detected_color_name, hex_code=tile.detected_color_hex)
            db.add(color)
            db.commit()
            db.refresh(color)

        # ✅ Step 2: Move Image to Permanent Folder
        final_image_path = move_file_to_storage(tile.temp_image_path, tile.collection_id, tile_id, "tile.jpg")

        # ✅ Step 3: Store Tile Design with the Correct `color_id`
        new_design = TileDesign(
            id=uuid4(),
            tile_name=tile.name,
            color_id=color.id,  # ✅ Storing the foreign key reference
            image_url=final_image_path,
            created_at=datetime.utcnow()
        )
        db.add(new_design)
        db.commit()
        db.refresh(new_design)
        tile_design_id = new_design.id  # ✅ Use New Design ID
        
        # ✅ Step 4: Store Tile in Database
        new_tile = Tile(
            id=tile_id,
            collection_id=tile.collection_id,
            tile_design_id=tile_design_id,
            thickness=tile.thickness,
            priority=2,  # ✅ Default Priority
            status="active",  # ✅ Default Status
            created_at=datetime.utcnow()
        )
        db.add(new_tile)
        stored_tiles.append(new_tile)

    db.commit()
    return {"message": "Tiles stored successfully", "stored_tiles": stored_tiles}


TEMP_STORAGE = "tiles_storage/temp/"

async def process_multiple_tiles(db: Session, file_paths: list):
    """ Processes multiple uploaded tiles, detects colors, and sends progress updates. """
    try:
        if not file_paths:
            raise HTTPException(status_code=400, detail="No files provided.")

        extracted_tiles = []
        total_files = len(file_paths)

        for index, file_path in enumerate(file_paths):
            # ✅ Debugging: Log file paths before processing
            print("Processing file:", file_path)

            # ✅ Check if file exists before processing
            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                raise HTTPException(status_code=400, detail=f"File not found: {file_path}")

            # ✅ Extract Color
            hex_color = extract_dominant_color(file_path)
            color_name = get_closest_color_name(hex_color)

            # ✅ Return Preview Data
            extracted_tiles.append({
                "temp_image_path": file_path,
                "detected_color_name": color_name,
                "detected_color_hex": hex_color
            })

            # ✅ Update Real-Time Progress
            progress = int(((index + 1) / total_files) * 100)
            await update_progress(progress)

        return {"tiles": extracted_tiles}

    except Exception as e:
        print("Error processing tiles:", str(e))  # ✅ Debugging
        raise HTTPException(status_code=500, detail=f"Error processing tiles: {str(e)}")
    



    # for existing from current collection
    # ✅ Fetch Existing Tile Designs with Color Name
def get_existing_tile_designs(db: Session, seller_id: UUID, collection_id: Optional[UUID] = None):
    """ Fetch all existing tile designs uploaded by the seller (filtered by collection if selected) """

    query = (
        db.query(TileDesign.id, TileDesign.tile_name, TileDesign.image_url, TileColor.name.label("color_name"))
        .join(Tile, Tile.tile_design_id == TileDesign.id)
        .join(TileCollection, Tile.collection_id == TileCollection.id)
        .join(TileColor, TileDesign.color_id == TileColor.id)
        .filter(TileCollection.seller_id == seller_id)
    )

    if collection_id:
        query = query.filter(TileCollection.id == collection_id)

    tile_designs = query.all()

    return [
        TileDesignResponse(
            tile_design_id=design.id,
            name=design.tile_name,
            color_name=design.color_name,
            image_url=design.image_url,
            thickness="10mm"  # ✅ Default thickness, user can edit before saving
        )
        for design in tile_designs
    ]

# ✅ Store Selected Existing Tiles into Collection
def store_existing_tiles(db: Session, collection_id: UUID, tiles: List[ExistingTileSelection]):
    stored_tiles = []

    for tile in tiles:
        new_tile = Tile(
            id=uuid4(),
            collection_id=collection_id,
            tile_design_id=tile.tile_design_id,  # ✅ Link to existing design
            thickness=tile.thickness,  # ✅ Keep thickness
            priority=2,  # ✅ Default priority
            status="active",  # ✅ Default status
            created_at=datetime.utcnow()
        )
        db.add(new_tile)
        stored_tiles.append(new_tile)

    db.commit()
    
    return {"message": "Existing tiles added successfully!", "stored_tiles": stored_tiles}
