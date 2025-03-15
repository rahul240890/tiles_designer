from pydantic import BaseModel, UUID4
from datetime import datetime

class SuitablePlaceBase(BaseModel):
    name: str

class SuitablePlaceCreate(SuitablePlaceBase):
    pass

class SuitablePlaceResponse(SuitablePlaceBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True
