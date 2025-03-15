from sqlalchemy.orm import Session
from app.models.collection_model import SuitablePlace
from app.schemas.suitable_place import SuitablePlaceCreate
import uuid
from datetime import datetime

def get_suitable_places(db: Session):
    return db.query(SuitablePlace).filter(SuitablePlace.deleted_at.is_(None)).all()  # ✅ Only Active Places

def create_suitable_place(db: Session, suitable_place_data: SuitablePlaceCreate):
    suitable_place = SuitablePlace(
        id=uuid.uuid4(),
        name=suitable_place_data.name,
    )
    db.add(suitable_place)
    db.commit()
    db.refresh(suitable_place)
    return suitable_place

def soft_delete_suitable_place(db: Session, place_id: uuid.UUID):
    suitable_place = db.query(SuitablePlace).filter(SuitablePlace.id == place_id, SuitablePlace.deleted_at.is_(None)).first()
    if suitable_place:
        suitable_place.deleted_at = datetime.utcnow()  # ✅ Soft Delete by updating timestamp
        db.commit()
        return True
    return False
