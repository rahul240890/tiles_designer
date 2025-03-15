from pydantic import BaseModel, UUID4
from typing import List, Optional

# ✅ Common schema for all attributes
class AttributeResponse(BaseModel):
    id: UUID4
    name: str

    class Config:
        orm_mode = True  # ✅ Allows conversion from ORM models

# ✅ Individual schemas for creating/updating attributes
class TileSizeCreate(BaseModel):
    name: str

class TileSizeUpdate(BaseModel):
    name: Optional[str] = None

class TileSeriesCreate(BaseModel):
    name: str

class TileSeriesUpdate(BaseModel):
    name: Optional[str] = None

class TileMaterialCreate(BaseModel):
    name: str

class TileMaterialUpdate(BaseModel):
    name: Optional[str] = None

class TileFinishCreate(BaseModel):
    name: str

class TileFinishUpdate(BaseModel):
    name: Optional[str] = None

class TileCategoryCreate(BaseModel):
    name: str

class TileCategoryUpdate(BaseModel):
    name: Optional[str] = None

# ✅ Tile Color Schema (Includes HEX Code)
class TileColorCreate(BaseModel):
    name: str
    hex_code: str  # HEX Code required for colors

class TileColorUpdate(BaseModel):
    name: Optional[str] = None
    hex_code: Optional[str] = None

class TileColorResponse(BaseModel):
    id: UUID4
    name: str
    hex_code: str  # HEX Code response

    class Config:
        orm_mode = True

# ✅ Response schema for `/attributes/all`
class AllAttributesResponse(BaseModel):
    sizes: List[AttributeResponse]
    series: List[AttributeResponse]
    materials: List[AttributeResponse]
    finishes: List[AttributeResponse]
    categories: List[AttributeResponse]
