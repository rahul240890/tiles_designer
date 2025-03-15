from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional
from typing import List
from pydantic import BaseModel, UUID4, Field
from typing import Optional, List

from sqlalchemy import UUID


# ✅ Base Schema (Common Fields)
class TileBase(BaseModel):
    tile_code: str = Field(..., min_length=3, max_length=20)  # Mandatory tile code (can be user-entered or auto-generated)
    name: Optional[str] = None  # Tile name is optional
    collection_id: UUID4  # Required collection reference
    color_id: UUID4  # Required color reference
    image_url: str  # Tile image storage path (Cloud URL)
    price: Optional[float] = None  # Optional per-tile price
    stock_quantity: Optional[int] = None  # Optional stock tracking
    batch_number: Optional[str] = None  # Optional batch number for manufacturers
    thickness: Optional[float] = None  # Optional tile thickness in mm
    priority: Optional[int] = 5  # Default priority for AI-based ranking
    description: Optional[str] = None  # Additional tile details
    status: str = "active"  # Active or inactive status

# ✅ Schema for Creating a New Tile
class TileCreate(TileBase):
    pass  # All fields except auto-generated ones are accepted


class TileCreate(BaseModel):
    tile_code: Optional[str] = Field(None, min_length=3, max_length=20)
    name: Optional[str] = None
    collection_id: UUID4
    image_url: str
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    batch_number: Optional[str] = None
    thickness: Optional[float] = None
    priority: Optional[int] = 5
    description: Optional[str] = None
    status: str = "active"

    # ✅ AI Auto-Detected Color Support
    detected_color_name: Optional[str] = None
    detected_color_hex: Optional[str] = None

class BulkTileUpload(BaseModel):
    tiles: List[TileCreate]  # Accepts multiple tile entries

class TilePDFExtract(BaseModel):
    pdf_url: str  # Uploaded PDF file URL
    extracted_tiles: List[TileCreate]  # AI-detected tile data

# ✅ Schema for Updating an Existing Tile
class TileUpdate(BaseModel):
    tile_code: Optional[str] = None
    name: Optional[str] = None
    collection_id: Optional[UUID4] = None
    color_id: Optional[UUID4] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    batch_number: Optional[str] = None
    thickness: Optional[float] = None
    priority: Optional[int] = None
    description: Optional[str] = None
    status: Optional[str] = None  # Active or inactive

# ✅ Response Schema for Returning Tile Data
class TileResponse(TileBase):
    id: UUID4  # Tile unique identifier
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enables conversion from ORM models

# ✅ Schema for Fetching Existing Tile Designs
class TileDesignResponse(BaseModel):
    tile_design_id: UUID4
    name: str
    color_name: str  # ✅ Fetch color name, NOT color_id
    image_url: str
    thickness: Optional[str] = None  # ✅ Default thickness (Editable before saving)

# ✅ Schema for Selecting Existing Tiles for Collection
class ExistingTileSelection(BaseModel):
    tile_design_id: UUID4  # ✅ Required for linking
    collection_id: UUID4  # ✅ Required for linking to collection
    thickness: str  # ✅ Required field
    
# ✅ Schema for Saving Selected Tiles into Collection
class StoreExistingTilesRequest(BaseModel):
    tiles: List[ExistingTileSelection]

# ✅ Schema for Bulk Upload & Final Submission
class FinalTileSubmission(BaseModel):
    collection_id: str
    tile_design_id: Optional[str] = None  # ✅ Used for existing tiles
    name: str
    color_id: Optional[str] = None
    detected_color_name: Optional[str] = None  # ✅ Only needed for new tiles
    detected_color_hex: Optional[str] = None
    temp_image_path: Optional[str] = None  # ✅ Only needed for new tiles
    thickness: str


# Collection vise tiles
class CollectionDetails(BaseModel):
    id: UUID4
    name: str
    size: Optional[str]
    series: Optional[str]
    material: Optional[str]
    finish: Optional[str]
    category: Optional[str]

class TileResponse(BaseModel):
    id: UUID4
    name: Optional[str] = None
    image_url: str
    color_name: Optional[str] = None
    hex_code: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    batch_number: Optional[str] = None
    thickness: Optional[float] = None
    usage_count: int
    priority: int
    status: str

    class Config:
        from_attributes = True  # ✅ Ensures data from ORM is correctly serialized

class TileCollectionResponse(BaseModel):
    collection: CollectionDetails
    tiles: List[TileResponse]

