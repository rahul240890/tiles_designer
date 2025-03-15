from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.attribute_models import TileSize, TileSeries, TileMaterial, TileFinish, TileCategory, TileColor
from app.schemas.attribute_schemas import *
from uuid import UUID
from fastapi import HTTPException

from app.models.collection_model import TileCollection
from app.models.tile_designs_model import TileDesign
from app.models.tiles_model import Tile


def get_unique_sidebar_filters(db: Session, seller_id: UUID):
    """Fetch unique filtering values for the seller's tiles, including colors with hex codes"""

    # Fetch unique values from TileCollections related to the seller
    collections = db.query(TileCollection.id, TileCollection.name).filter(TileCollection.seller_id == seller_id).distinct().all()
    categories = db.query(TileCategory.id, TileCategory.name).join(TileCollection).filter(TileCollection.seller_id == seller_id).distinct().all()
    series = db.query(TileSeries.id, TileSeries.name).join(TileCollection).filter(TileCollection.seller_id == seller_id).distinct().all()
    finishes = db.query(TileFinish.id, TileFinish.name).join(TileCollection).filter(TileCollection.seller_id == seller_id).distinct().all()
    sizes = db.query(TileSize.id, TileSize.name).join(TileCollection).filter(TileCollection.seller_id == seller_id).distinct().all()
    materials = db.query(TileMaterial.id, TileMaterial.name).join(TileCollection).filter(TileCollection.seller_id == seller_id).distinct().all()

    # Fetch unique colors with hex codes
    colors = db.query(TileColor.id, TileColor.name, TileColor.hex_code).join(TileDesign).join(Tile).join(TileCollection).filter(TileCollection.seller_id == seller_id).distinct().all()

    return {
        "collections": [{"id": col.id, "name": col.name} for col in collections],
        "categories": [{"id": cat.id, "name": cat.name} for cat in categories],
        "series": [{"id": ser.id, "name": ser.name} for ser in series],
        "finishes": [{"id": fin.id, "name": fin.name} for fin in finishes],
        "sizes": [{"id": size.id, "name": size.name} for size in sizes],
        "materials": [{"id": mat.id, "name": mat.name} for mat in materials],
        "colors": [{"id": col.id, "name": col.name, "hex_code": col.hex_code} for col in colors]  # ✅ Includes hex codes
    }

# ✅ Generic CRUD Functions for Reusability
def create_item(db: Session, model, data, name_field="name"):
    try:
        existing = db.query(model).filter(getattr(model, name_field) == getattr(data, name_field)).first()
        if existing:
            raise HTTPException(status_code=409, detail=f"{model.__name__} already exists")

        new_item = model(**data.dict())
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create {model.__name__}. Possible duplicate or constraint issue.")

def get_items(db: Session, model):
    return db.query(model).all()

def update_item(db: Session, model, item_id: UUID, data):
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, model, item_id: UUID):
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    db.delete(item)
    db.commit()
    return {"message": f"{model.__name__} deleted successfully"}

# ✅ CRUD Functions for Each Attribute
def create_size(db: Session, data: TileSizeCreate): return create_item(db, TileSize, data)
def get_sizes(db: Session): return get_items(db, TileSize)
def update_size(db: Session, item_id: UUID, data: TileSizeUpdate): return update_item(db, TileSize, item_id, data)
def delete_size(db: Session, item_id: UUID): return delete_item(db, TileSize, item_id)

def create_series(db: Session, data: TileSeriesCreate): return create_item(db, TileSeries, data)
def get_series(db: Session): return get_items(db, TileSeries)
def update_series(db: Session, item_id: UUID, data: TileSeriesUpdate): return update_item(db, TileSeries, item_id, data)
def delete_series(db: Session, item_id: UUID): return delete_item(db, TileSeries, item_id)

def create_material(db: Session, data: TileMaterialCreate): return create_item(db, TileMaterial, data)
def get_materials(db: Session): return get_items(db, TileMaterial)
def update_material(db: Session, item_id: UUID, data: TileMaterialUpdate): return update_item(db, TileMaterial, item_id, data)
def delete_material(db: Session, item_id: UUID): return delete_item(db, TileMaterial, item_id)

def create_finish(db: Session, data: TileFinishCreate): return create_item(db, TileFinish, data)
def get_finishes(db: Session): return get_items(db, TileFinish)
def update_finish(db: Session, item_id: UUID, data: TileFinishUpdate): return update_item(db, TileFinish, item_id, data)
def delete_finish(db: Session, item_id: UUID): return delete_item(db, TileFinish, item_id)

def create_category(db: Session, data: TileCategoryCreate): return create_item(db, TileCategory, data)
def get_categories(db: Session): return get_items(db, TileCategory)
def update_category(db: Session, item_id: UUID, data: TileCategoryUpdate): return update_item(db, TileCategory, item_id, data)
def delete_category(db: Session, item_id: UUID): return delete_item(db, TileCategory, item_id)

# ✅ CRUD Functions for Tile Colors
def create_color(db: Session, data: TileColorCreate): return create_item(db, TileColor, data)
def get_colors(db: Session): return get_items(db, TileColor)
def update_color(db: Session, item_id: UUID, data: TileColorUpdate): return update_item(db, TileColor, item_id, data)
def delete_color(db: Session, item_id: UUID): return delete_item(db, TileColor, item_id)
