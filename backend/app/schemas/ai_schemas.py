# backend/app/schemas/ai_schemas.py

from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional, List, Dict

# ✅ Image Upload Schema
class ImageUploadSchema(BaseModel):
    user_id: UUID4 = Field(..., description="User ID who uploads the image")
    image_url: str = Field(..., description="URL of the uploaded image")

# ✅ Segmentation Response Schema
class SegmentedImageResponse(BaseModel):
    segmentation_id: UUID4
    original_image_url: str
    wall_mask_url: str
    floor_mask_url: str
    room_type: str  # ✅ Added Room Type
    created_at: datetime


# ✅ Tile Replacement Request Schema
class TileReplacementRequest(BaseModel):
    segmentation_id: UUID4
    wall_tile_id: Optional[UUID4] = None
    floor_tile_id: Optional[UUID4] = None

# ✅ Tile Replacement Response Schema
class TileReplacementResponse(BaseModel):
    processed_image_url: str
    applied_tiles: Dict[str, UUID4]  # {"wall": tile_id, "floor": tile_id}

# ✅ Multi-View Tile Comparison Schema
class TileComparisonRequest(BaseModel):
    segmentation_id: UUID4
    layout_options: List[Dict[str, UUID4]]  # [{"wall": tile_id, "floor": tile_id}, ...]

class TileComparisonResponse(BaseModel):
    comparison_id: UUID4
    layout_1_url: str
    layout_2_url: Optional[str]
    layout_3_url: Optional[str]
    layout_4_url: Optional[str]
    created_at: datetime

# ✅ AI-Based Tile Suggestion Schema
class TileSuggestionRequest(BaseModel):
    selected_tile_id: UUID4
    top_n: Optional[int] = 5  # Number of recommendations to return

class TileSuggestionResponse(BaseModel):
    recommended_tiles: List[Dict[str, str]]  # [{"tile_id": "UUID", "match_score": 95.3}]

