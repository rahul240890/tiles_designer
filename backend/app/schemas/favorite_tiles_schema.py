from pydantic import BaseModel, UUID4
from datetime import datetime

class FavoriteTileCreate(BaseModel):
    seller_id: UUID4
    tile_id: UUID4

class FavoriteTileResponse(BaseModel):
    id: UUID4
    seller_id: UUID4
    tile_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True
