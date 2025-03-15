from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.attribute_schemas import *
from app.services.attribute_service import *
from app.core.database import get_db
from typing import List
from uuid import UUID
from app.services.attribute_service import get_sizes, get_series, get_materials, get_finishes, get_categories
from app.schemas.attribute_schemas import AllAttributesResponse

router = APIRouter(prefix="/attributes", tags=["Attributes"])

@router.get("/filters", response_model=dict)
def get_sidebar_filters(seller_id: UUID, db: Session = Depends(get_db)):
    """Fetch unique filtering options for the current seller's tiles, including colors with hex codes"""
    return get_unique_sidebar_filters(db, seller_id)

# ✅ GET: Fetch all attributes
@router.get("/sizes", response_model=List[AttributeResponse])
def get_sizes_api(db: Session = Depends(get_db)):
    return get_sizes(db)

@router.get("/materials", response_model=List[AttributeResponse])
def get_materials_api(db: Session = Depends(get_db)):
    return get_materials(db)

@router.get("/finishes", response_model=List[AttributeResponse])
def get_finishes_api(db: Session = Depends(get_db)):
    return get_finishes(db)

@router.get("/categories", response_model=List[AttributeResponse])
def get_categories_api(db: Session = Depends(get_db)):
    return get_categories(db)

@router.get("/series", response_model=List[AttributeResponse])
def get_series_api(db: Session = Depends(get_db)):
    return get_series(db)

@router.get("/colors", response_model=List[TileColorResponse])
def get_colors_api(db: Session = Depends(get_db)):
    return get_colors(db)

# ✅ POST: Create attribute
@router.post("/sizes", response_model=AttributeResponse)
def create_size_api(data: TileSizeCreate, db: Session = Depends(get_db)):
    return create_size(db, data)

@router.post("/materials", response_model=AttributeResponse)
def create_material_api(data: TileMaterialCreate, db: Session = Depends(get_db)):
    return create_material(db, data)

@router.post("/finishes", response_model=AttributeResponse)
def create_finish_api(data: TileFinishCreate, db: Session = Depends(get_db)):
    return create_finish(db, data)

@router.post("/categories", response_model=AttributeResponse)
def create_category_api(data: TileCategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, data)

@router.post("/series", response_model=AttributeResponse)
def create_series_api(data: TileSeriesCreate, db: Session = Depends(get_db)):
    return create_series(db, data)

@router.post("/colors", response_model=TileColorResponse)
def create_color_api(data: TileColorCreate, db: Session = Depends(get_db)):
    return create_color(db, data)

# ✅ PUT: Update attributes
@router.put("/sizes/{id}", response_model=AttributeResponse)
def update_size_api(id: UUID, data: TileSizeUpdate, db: Session = Depends(get_db)):
    return update_size(db, id, data)

@router.put("/materials/{id}", response_model=AttributeResponse)
def update_material_api(id: UUID, data: TileMaterialUpdate, db: Session = Depends(get_db)):
    return update_material(db, id, data)

@router.put("/finishes/{id}", response_model=AttributeResponse)
def update_finish_api(id: UUID, data: TileFinishUpdate, db: Session = Depends(get_db)):
    return update_finish(db, id, data)

@router.put("/categories/{id}", response_model=AttributeResponse)
def update_category_api(id: UUID, data: TileCategoryUpdate, db: Session = Depends(get_db)):
    return update_category(db, id, data)

@router.put("/series/{id}", response_model=AttributeResponse)
def update_series_api(id: UUID, data: TileSeriesUpdate, db: Session = Depends(get_db)):
    return update_series(db, id, data)

@router.put("/colors/{id}", response_model=TileColorResponse)
def update_color_api(id: UUID, data: TileColorUpdate, db: Session = Depends(get_db)):
    return update_color(db, id, data)

# ✅ DELETE: Remove attributes
@router.delete("/sizes/{id}")
def delete_size_api(id: UUID, db: Session = Depends(get_db)):
    return delete_size(db, id)

@router.delete("/materials/{id}")
def delete_material_api(id: UUID, db: Session = Depends(get_db)):
    return delete_material(db, id)

@router.delete("/finishes/{id}")
def delete_finish_api(id: UUID, db: Session = Depends(get_db)):
    return delete_finish(db, id)

@router.delete("/categories/{id}")
def delete_category_api(id: UUID, db: Session = Depends(get_db)):
    return delete_category(db, id)

@router.delete("/series/{id}")
def delete_series_api(id: UUID, db: Session = Depends(get_db)):
    return delete_series(db, id)

@router.delete("/colors/{id}")
def delete_color_api(id: UUID, db: Session = Depends(get_db)):
    return delete_color(db, id)

# ✅ GET: Fetch all attributes in a single request
@router.get("/all", response_model=AllAttributesResponse)
def get_all_attributes(db: Session = Depends(get_db)):
    return {
        "sizes": get_sizes(db),
        "series": get_series(db),
        "materials": get_materials(db),
        "finishes": get_finishes(db),
        "categories": get_categories(db),
    }
