from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.lighting_schemas import LightingRequestSchema, LightingResponseSchema
from app.ai.processing.apply_lighting import apply_lighting

router = APIRouter(prefix="/lighting", tags=["Lighting Adjustments"])

@router.post("/apply", response_model=LightingResponseSchema)
async def adjust_lighting(request: LightingRequestSchema, db: Session = Depends(get_db)):
    """
    Adjusts lighting for the tile preview based on the selected mode.
    """
    lighting_image_url = apply_lighting(request.image_path, request.mode, request.brightness, request.contrast, "tiles_storage")
    if not lighting_image_url:
        raise HTTPException(status_code=500, detail="Lighting adjustment failed")

    return {"lighting_image_url": lighting_image_url, "mode": request.mode}
