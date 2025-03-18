from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.room_template import RoomTemplate
from app.schemas.room_template_schemas import RoomTemplateResponse

router = APIRouter(prefix="/room-templates", tags=["Room Templates"])

@router.get("/", response_model=list[RoomTemplateResponse])
async def get_room_templates(db: Session = Depends(get_db)):
    """
    Fetch all available predefined room templates.
    """
    templates = db.query(RoomTemplate).all()
    return templates

@router.get("/{template_id}", response_model=RoomTemplateResponse)
async def get_room_template_by_id(template_id: str, db: Session = Depends(get_db)):
    """
    Fetch a specific room template by its ID.
    """
    template = db.query(RoomTemplate).filter(RoomTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Room template not found")
    return template
