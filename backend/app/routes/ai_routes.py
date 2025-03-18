# backend/app/routes/ai_routes.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import uuid
import os
from app.core.database import get_db
from app.schemas.ai_schemas import (
    ImageUploadSchema, SegmentedImageResponse, TileReplacementRequest, TileReplacementResponse,
    TileComparisonRequest, TileComparisonResponse, TileSuggestionRequest, TileSuggestionResponse
)
from app.services.ai_service import (
    segment_image, replace_tiles, suggest_matching_tiles
)
from app.models.ai.room_segmentation import RoomSegmentation
from app.models.ai.processed_image import ProcessedImage
from app.models.ai.tile_comparison import TileComparison

router = APIRouter(prefix="/ai", tags=["AI Processing"])

UPLOAD_DIR = "uploads/"  # Ensure this directory exists

# ✅ 1️⃣ Image Upload & AI Segmentation
@router.post("/upload-image", response_model=SegmentedImageResponse)
async def upload_and_segment_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts an image, runs DeepLabV3+ segmentation, and stores wall & floor masks.
    Detects the room type before enabling wall segmentation.
    """
    file_ext = file.filename.split(".")[-1]
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}.{file_ext}")

    with open(file_path, "wb") as f:
        f.write(await file.read())

    segmentation_result = segment_image(file_path, UPLOAD_DIR)

    segmentation = RoomSegmentation(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),  # Replace with actual user ID
        original_image_url=file_path,
        wall_mask_url=segmentation_result["wall_mask"],
        floor_mask_url=segmentation_result["floor_mask"],
        room_type=segmentation_result["room_type"]
    )
    db.add(segmentation)
    db.commit()
    db.refresh(segmentation)

    return {
        "segmentation_id": segmentation.id,
        "original_image_url": segmentation.original_image_url,
        "wall_mask_url": segmentation.wall_mask_url,
        "floor_mask_url": segmentation.floor_mask_url,
        "room_type": segmentation.room_type,
        "created_at": segmentation.created_at
    }


# ✅ 2️⃣ Apply Tile Replacement to Segmented Image
@router.post("/apply-tiles", response_model=TileReplacementResponse)
async def apply_tiles(request: TileReplacementRequest, db: Session = Depends(get_db)):
    """
    Applies selected wall and floor tiles to the segmented image and returns the processed image.
    """
    segmentation = db.query(RoomSegmentation).filter(RoomSegmentation.id == request.segmentation_id).first()
    if not segmentation:
        raise HTTPException(status_code=404, detail="Segmentation data not found")

    processed_image_url = replace_tiles(request.segmentation_id, "wall_texture.png", "floor_texture.png", UPLOAD_DIR)

    if not processed_image_url:
        raise HTTPException(status_code=500, detail="Tile replacement failed")

    return TileReplacementResponse(
        processed_image_url=processed_image_url,
        applied_tiles={"wall": request.wall_tile_id, "floor": request.floor_tile_id}
    )

# ✅ 3️⃣ Multi-View Tile Layout Comparison
@router.post("/compare-layouts", response_model=TileComparisonResponse)
async def compare_tile_layouts(request: TileComparisonRequest, db: Session = Depends(get_db)):
    """
    Generates multiple tile layouts for comparison (up to 4 variations).
    """
    segmentation = db.query(RoomSegmentation).filter(RoomSegmentation.id == request.segmentation_id).first()
    if not segmentation:
        raise HTTPException(status_code=404, detail="Segmentation data not found")

    layout_images = []
    for layout in request.layout_options:
        processed_image_url = replace_tiles(
            request.segmentation_id, "wall_texture.png", "floor_texture.png", UPLOAD_DIR
        )
        layout_images.append(processed_image_url)

    comparison = TileComparison(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),  # Replace with actual user ID from session/auth
        segmentation_id=request.segmentation_id,
        layout_1_url=layout_images[0],
        layout_2_url=layout_images[1] if len(layout_images) > 1 else None,
        layout_3_url=layout_images[2] if len(layout_images) > 2 else None,
        layout_4_url=layout_images[3] if len(layout_images) > 3 else None
    )
    db.add(comparison)
    db.commit()
    db.refresh(comparison)

    return TileComparisonResponse(
        comparison_id=comparison.id,
        layout_1_url=comparison.layout_1_url,
        layout_2_url=comparison.layout_2_url,
        layout_3_url=comparison.layout_3_url,
        layout_4_url=comparison.layout_4_url,
        created_at=comparison.created_at
    )

# ✅ 4️⃣ AI-Based Tile Suggestions
@router.post("/suggest-tiles", response_model=TileSuggestionResponse)
async def get_tile_suggestions(request: TileSuggestionRequest, db: Session = Depends(get_db)):
    """
    Returns AI-based suggested tile matches based on color and design similarity.
    """
    suggestions = suggest_matching_tiles(request, db)
    if not suggestions:
        raise HTTPException(status_code=404, detail="No matching tiles found")

    return TileSuggestionResponse(recommended_tiles=suggestions)
