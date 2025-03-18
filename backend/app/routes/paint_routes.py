from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.paint_schemas import PaintRequestSchema, PaintResponseSchema
from app.ai.processing.apply_paint import apply_wall_paint

router = APIRouter(prefix="/paint", tags=["Wall Painting"])

@router.post("/apply", response_model=PaintResponseSchema)
async def paint_wall(request: PaintRequestSchema, db: Session = Depends(get_db)):
    """
    Apply selected wall paint color to the detected wall sections.
    """
    painted_image_url = apply_wall_paint(request.segmentation_id, request.paint_color, "tiles_storage")
    if not painted_image_url:
        raise HTTPException(status_code=500, detail="Wall painting failed")

    return {"painted_image_url": painted_image_url, "paint_color": request.paint_color}
