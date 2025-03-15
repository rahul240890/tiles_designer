from datetime import datetime
from pydantic import BaseModel, UUID4
from typing import Optional
from typing import Optional, List


class TileCollectionBase(BaseModel):
    name: str
    size_id: UUID4
    series_id: Optional[UUID4] = None
    material_id: Optional[UUID4] = None
    finish_id: Optional[UUID4] = None
    category_id: Optional[UUID4] = None
    description: Optional[str] = None

class TileCollectionCreate(TileCollectionBase):
    seller_id: UUID4  # ✅ Changed from int to UUID4 for consistency
    suitable_places: Optional[List[UUID4]] = []  # ✅ Add Suitable Places Field


class TileCollectionUpdate(BaseModel):
    name: Optional[str] = None
    size_id: Optional[UUID4] = None
    series_id: Optional[UUID4] = None
    material_id: Optional[UUID4] = None
    finish_id: Optional[UUID4] = None
    category_id: Optional[UUID4] = None
    description: Optional[str] = None
    status: Optional[str] = None  # "active" or "inactive"
    suitable_places: Optional[List[UUID4]] = []  # ✅ Allow Updating Suitable Places


# ✅ Attribute Type
class Attribute(BaseModel):
    id: UUID4
    name: str

class TileCollectionResponse(BaseModel):
    id: UUID4
    seller_id: UUID4
    name: str
    size: Attribute  # ✅ Now returns actual Size object
    series: Optional[Attribute] = None
    material: Optional[Attribute] = None
    finish: Optional[Attribute] = None
    category: Attribute
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    is_favorite: bool = False  # ✅ Ensures favorite status is always included
    suitable_places: List[Attribute] = []  # ✅ Add Suitable Places

    class Config:
        from_attributes = True
