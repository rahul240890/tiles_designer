from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.suitable_place import SuitablePlaceCreate, SuitablePlaceResponse
from app.services.suitable_place_service import get_suitable_places, create_suitable_place, soft_delete_suitable_place
import uuid

router = APIRouter(prefix="/suitable-places", tags=["Suitable Places"])

@router.get("/", response_model=list[SuitablePlaceResponse])
def fetch_suitable_places(db: Session = Depends(get_db)):
    return get_suitable_places(db)

@router.post("/", response_model=SuitablePlaceResponse)
def add_suitable_place(suitable_place_data: SuitablePlaceCreate, db: Session = Depends(get_db)):
    return create_suitable_place(db, suitable_place_data)

@router.delete("/{place_id}")
def remove_suitable_place(place_id: uuid.UUID, db: Session = Depends(get_db)):
    success = soft_delete_suitable_place(db, place_id)
    if not success:
        raise HTTPException(status_code=404, detail="Suitable Place not found or already deleted")
    return {"message": "Suitable Place soft deleted successfully"}
