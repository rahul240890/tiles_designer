from typing import List
import uuid
from sqlalchemy.orm import Session, joinedload
from app.models.collection_model import CollectionSuitablePlace, SuitablePlace, TileCollection
from app.schemas.collection_schema import TileCollectionCreate, TileCollectionUpdate
from uuid import UUID
from sqlalchemy import asc, desc
from fastapi import HTTPException
from datetime import datetime
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import exists
from sqlalchemy import desc
from app.models.collection_model import TileCollection, FavoriteCollection
from app.schemas.collection_schema import TileCollectionResponse, Attribute
from app.models.collection_model import TileCollection, FavoriteCollection
from app.models.attribute_models import TileCategory, TileFinish, TileMaterial, TileSeries, TileSize  # ✅ Import models
from app.schemas.collection_schema import TileCollectionResponse, Attribute
from uuid import UUID
from sqlalchemy.orm import joinedload


# ✅ Create a new Collection
def create_collection(db: Session, collection_data: TileCollectionCreate):
    """ Create a new collection with suitable places, ensuring unique names per seller """

    # ✅ Check if Collection Name Already Exists for this Seller (Ignoring Deleted)
    existing_collection = db.query(TileCollection).filter(
        TileCollection.seller_id == collection_data.seller_id,
        TileCollection.name == collection_data.name,
        TileCollection.deleted_at.is_(None)  # ✅ Exclude deleted collections
    ).first()

    if existing_collection:
        raise HTTPException(status_code=400, detail="Collection name already exists for this seller.")

    # ✅ Create the Collection
    new_collection = TileCollection(
        id=uuid.uuid4(),
        seller_id=collection_data.seller_id,
        name=collection_data.name,
        size_id=collection_data.size_id,
        series_id=collection_data.series_id,
        material_id=collection_data.material_id,
        finish_id=collection_data.finish_id,
        category_id=collection_data.category_id,
        description=collection_data.description,
        status="active"
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    # ✅ Add Suitable Places
    if collection_data.suitable_places:
        new_suitable_places = [
            CollectionSuitablePlace(collection_id=new_collection.id, place_id=place_id)
            for place_id in collection_data.suitable_places
        ]
        db.add_all(new_suitable_places)
        db.commit()

    # ✅ Fetch & Format Suitable Places for the Response
    formatted_suitable_places = [
        {"id": place.place.id, "name": place.place.name}
        for place in db.query(CollectionSuitablePlace).filter(CollectionSuitablePlace.collection_id == new_collection.id).all()
    ]

    # ✅ Return collection with properly formatted Suitable Places
    return {
        "id": new_collection.id,
        "seller_id": new_collection.seller_id,
        "name": new_collection.name,
        "size": {"id": new_collection.size_id, "name": collection_data.name} if new_collection.size_id else None,
        "series": {"id": new_collection.series_id, "name": collection_data.name} if new_collection.series_id else None,
        "material": {"id": new_collection.material_id, "name": collection_data.name} if new_collection.material_id else None,
        "finish": {"id": new_collection.finish_id, "name": collection_data.name} if new_collection.finish_id else None,
        "category": {"id": new_collection.category_id, "name": collection_data.name} if new_collection.category_id else None,
        "suitable_places": formatted_suitable_places,  # ✅ Correctly formatted
        "description": new_collection.description,
        "status": new_collection.status,
        "created_at": new_collection.created_at,
        "updated_at": new_collection.updated_at,
        "deleted_at": new_collection.deleted_at,
        "is_favorite": False,
    }

def get_collections_by_seller(db: Session, seller_id: UUID) -> List[dict]:
    """ Fetch collections for a specific seller, returning only ID, Name, and Status """
    collections = db.query(
        TileCollection.id, TileCollection.name, TileCollection.status
    ).filter(
        TileCollection.seller_id == seller_id,
        TileCollection.deleted_at.is_(None)  # ✅ Exclude deleted collections
    ).all()

    return [{"id": col.id, "name": col.name, "status": col.status} for col in collections]

def get_collections(db: Session, seller_id: UUID):
    """ Fetch all collections for a seller, including suitable places """
    collections_query = (
        db.query(
            TileCollection.id,
            TileCollection.seller_id,
            TileCollection.name,
            TileCollection.size_id,
            TileCollection.series_id,
            TileCollection.material_id,
            TileCollection.finish_id,
            TileCollection.category_id,
            TileCollection.description,
            TileCollection.status,
            TileCollection.created_at,
            TileCollection.updated_at,
            TileCollection.deleted_at,
            TileSize.name.label("size_name"),
            TileSeries.name.label("series_name"),
            TileMaterial.name.label("material_name"),
            TileFinish.name.label("finish_name"),
            TileCategory.name.label("category_name"),
        )
        .join(TileSize, TileCollection.size_id == TileSize.id, isouter=True)
        .join(TileSeries, TileCollection.series_id == TileSeries.id, isouter=True)
        .join(TileMaterial, TileCollection.material_id == TileMaterial.id, isouter=True)
        .join(TileFinish, TileCollection.finish_id == TileFinish.id, isouter=True)
        .join(TileCategory, TileCollection.category_id == TileCategory.id, isouter=True)
        .filter(
            TileCollection.seller_id == seller_id,
            TileCollection.deleted_at.is_(None)
        )
        .order_by(TileCollection.created_at.desc())
        .all()
    )

    # ✅ Fetch Suitable Places for Each Collection
    suitable_places_mapping = {}
    suitable_places_data = (
        db.query(CollectionSuitablePlace.collection_id, SuitablePlace.id, SuitablePlace.name)
        .join(SuitablePlace, CollectionSuitablePlace.place_id == SuitablePlace.id)
        .all()
    )
    for collection_id, place_id, place_name in suitable_places_data:
        if collection_id not in suitable_places_mapping:
            suitable_places_mapping[collection_id] = []
        suitable_places_mapping[collection_id].append({"id": place_id, "name": place_name})

    # ✅ Convert Results to Pydantic Models
    result = [
        TileCollectionResponse(
            id=row.id,
            seller_id=row.seller_id,
            name=row.name,
            size=Attribute(id=row.size_id, name=row.size_name) if row.size_id else None,
            series=Attribute(id=row.series_id, name=row.series_name) if row.series_id else None,
            material=Attribute(id=row.material_id, name=row.material_name) if row.material_id else None,
            finish=Attribute(id=row.finish_id, name=row.finish_name) if row.finish_id else None,
            category=Attribute(id=row.category_id, name=row.category_name) if row.category_id else None,
            suitable_places=suitable_places_mapping.get(row.id, []),  # ✅ Add Suitable Places
            description=row.description or "",
            status=row.status,
            created_at=row.created_at,
            updated_at=row.updated_at,
            deleted_at=row.deleted_at,
            is_favorite=False,
        )
        for row in collections_query
    ]

    return result


# ✅ Get Collection by ID (Include Related Attributes)


def get_collection(db: Session, collection_id: UUID):
    """ Fetch a single collection, including related suitable places """
    collection = (
        db.query(TileCollection)
        .options(
            joinedload(TileCollection.seller),
            joinedload(TileCollection.size),
            joinedload(TileCollection.series),
            joinedload(TileCollection.material),
            joinedload(TileCollection.finish),
            joinedload(TileCollection.category),
            joinedload(TileCollection.suitable_places).joinedload(CollectionSuitablePlace.place),  # ✅ Load Suitable Places
        )
        .filter(TileCollection.id == collection_id)
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    # ✅ Fetch Suitable Places & Format Correctly
    suitable_places = [
        {"id": place.place.id, "name": place.place.name}  # ✅ Ensure correct format
        for place in collection.suitable_places
    ]

    # ✅ Return collection with Suitable Places in correct format
    return {
        "id": collection.id,
        "seller_id": collection.seller_id,
        "name": collection.name,
        "size": {"id": collection.size.id, "name": collection.size.name} if collection.size else None,
        "series": {"id": collection.series.id, "name": collection.series.name} if collection.series else None,
        "material": {"id": collection.material.id, "name": collection.material.name} if collection.material else None,
        "finish": {"id": collection.finish.id, "name": collection.finish.name} if collection.finish else None,
        "category": {"id": collection.category.id, "name": collection.category.name} if collection.category else None,
        "suitable_places": suitable_places,  # ✅ Correct format
        "description": collection.description,
        "status": collection.status,
        "created_at": collection.created_at,
        "updated_at": collection.updated_at,
        "deleted_at": collection.deleted_at,
        "is_favorite": False,  # ✅ Ensure favorite status is included
    }



# ✅ Update Collection Details
def update_collection(db: Session, collection_id: UUID, collection_data: TileCollectionUpdate):
    """ Update collection details, including suitable places """

    collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    print(f"Received collection_id: {collection_id}")  # ✅ Debugging
    print(f"Received suitable_places: {collection_data.suitable_places}")  # ✅ Debugging

    # ✅ Update Basic Fields
    for key, value in collection_data.dict(exclude_unset=True).items():
        if key != "suitable_places":  # Skip suitable_places for now
            setattr(collection, key, value)

    # ✅ Handle Suitable Places Update
    if collection_data.suitable_places is not None:
        # ✅ Remove Existing Suitable Places
        db.query(CollectionSuitablePlace).filter(CollectionSuitablePlace.collection_id == collection_id).delete()
        db.commit()

        # ✅ Fetch SuitablePlace instances using the UUIDs
        suitable_places_instances = (
            db.query(SuitablePlace)
            .filter(SuitablePlace.id.in_(collection_data.suitable_places))
            .all()
        )

        if len(suitable_places_instances) != len(collection_data.suitable_places):
            raise HTTPException(status_code=400, detail="One or more Suitable Places not found")

        # ✅ Create Correct `CollectionSuitablePlace` Instances
        new_suitable_places = [
            CollectionSuitablePlace(collection_id=collection.id, place_id=place.id) for place in suitable_places_instances
        ]
        db.add_all(new_suitable_places)
        db.commit()

    db.commit()
    db.refresh(collection)

    # ✅ Fetch Suitable Places & Format Properly for Response
    formatted_suitable_places = [
        {"id": place.place.id, "name": place.place.name} for place in collection.suitable_places
    ]

    # ✅ Return collection with Suitable Places in correct format
    return {
        "id": collection.id,
        "seller_id": collection.seller_id,
        "name": collection.name,
        "size": {"id": collection.size.id, "name": collection.size.name} if collection.size else None,
        "series": {"id": collection.series.id, "name": collection.series.name} if collection.series else None,
        "material": {"id": collection.material.id, "name": collection.material.name} if collection.material else None,
        "finish": {"id": collection.finish.id, "name": collection.finish.name} if collection.finish else None,
        "category": {"id": collection.category.id, "name": collection.category.name} if collection.category else None,
        "suitable_places": formatted_suitable_places,  # ✅ Now properly formatted
        "description": collection.description,
        "status": collection.status,
        "created_at": collection.created_at,
        "updated_at": collection.updated_at,
        "deleted_at": collection.deleted_at,
        "is_favorite": False,  # ✅ Ensure favorite status is included
    }


# ✅ Delete Collection
# def delete_collection(db: Session, collection_id: UUID):
#     collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
#     if not collection:
#         raise HTTPException(status_code=404, detail="Collection not found")

#     db.delete(collection)
#     db.commit()
#     return {"message": "Collection deleted successfully"}

# ✅ Soft Delete Collection
def delete_collection(db: Session, collection_id: UUID):
    collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    collection.deleted_at = datetime.utcnow()  # ✅ Soft delete by setting deleted_at
    db.commit()
    return {"message": "Collection soft deleted successfully"}

# ✅ Toggle Active/Inactive Status
def toggle_collection_status(db: Session, collection_id: UUID):
    collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    collection.status = "inactive" if collection.status == "active" else "active"  # ✅ Toggle status
    db.commit()
    return {"message": f"Collection status updated to {collection.status}"}

# ✅ Search Collections by Name
def search_collections(db: Session, query: str):
    return db.query(TileCollection).filter(TileCollection.name.ilike(f"%{query}%")).all()

# ✅ Filter Collections by Size, Material, Finish, Category
def filter_collections(db: Session, size_id: UUID = None, material_id: UUID = None, finish_id: UUID = None, category_id: UUID = None):
    query = db.query(TileCollection)

    if size_id:
        query = query.filter(TileCollection.size_id == size_id)
    if material_id:
        query = query.filter(TileCollection.material_id == material_id)
    if finish_id:
        query = query.filter(TileCollection.finish_id == finish_id)
    if category_id:
        query = query.filter(TileCollection.category_id == category_id)

    return query.all()

# ✅ Sort Collections by Size, Material, Date
def sort_collections(db: Session, sort_by: str, order: str):
    if order == "asc":
        order_func = asc
    else:
        order_func = desc

    order_by = order_func(TileCollection.created_at)  # Default sorting by date

    if sort_by == "size":
        order_by = order_func(TileCollection.size_id)
    elif sort_by == "material":
        order_by = order_func(TileCollection.material_id)

    return db.query(TileCollection).order_by(order_by).all()

# ✅ Duplicate Collection
def duplicate_collection(db: Session, collection_id: UUID):
    """ Duplicate a collection along with its suitable places """

    # ✅ Fetch the Existing Collection
    existing_collection = db.query(TileCollection).filter(TileCollection.id == collection_id).first()
    if not existing_collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    # ✅ Generate a New Collection Name
    new_collection_name = f"Copy of {existing_collection.name}"

    # ✅ Create a New Collection
    new_collection = TileCollection(
        id=uuid.uuid4(),
        seller_id=existing_collection.seller_id,
        name=new_collection_name,
        size_id=existing_collection.size_id,
        series_id=existing_collection.series_id,
        material_id=existing_collection.material_id,
        finish_id=existing_collection.finish_id,
        category_id=existing_collection.category_id,
        description=existing_collection.description,
        status="active"
    )
    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    # ✅ Duplicate Suitable Places
    existing_suitable_places = db.query(CollectionSuitablePlace).filter(
        CollectionSuitablePlace.collection_id == collection_id
    ).all()

    new_suitable_places = [
        CollectionSuitablePlace(collection_id=new_collection.id, place_id=place.place_id)
        for place in existing_suitable_places
    ]

    db.add_all(new_suitable_places)
    db.commit()

    # ✅ Fetch & Format Suitable Places for the Response
    formatted_suitable_places = [
        {"id": place.place_id, "name": place.place.name} for place in new_suitable_places
    ]

    # ✅ Return Collection with Suitable Places in Correct Format
    return {
        "id": new_collection.id,
        "seller_id": new_collection.seller_id,
        "name": new_collection.name,
        "size": {"id": new_collection.size_id, "name": existing_collection.size.name} if new_collection.size_id else None,
        "series": {"id": new_collection.series_id, "name": existing_collection.series.name} if new_collection.series_id else None,
        "material": {"id": new_collection.material_id, "name": existing_collection.material.name} if new_collection.material_id else None,
        "finish": {"id": new_collection.finish_id, "name": existing_collection.finish.name} if new_collection.finish_id else None,
        "category": {"id": new_collection.category_id, "name": existing_collection.category.name} if new_collection.category_id else None,
        "suitable_places": formatted_suitable_places,  # ✅ Correctly formatted
        "description": new_collection.description,
        "status": new_collection.status,
        "created_at": new_collection.created_at,
        "updated_at": new_collection.updated_at,
        "deleted_at": new_collection.deleted_at,
        "is_favorite": False,  # ✅ Ensure favorite status is included
    }
