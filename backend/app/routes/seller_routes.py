from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.seller_schema import SellerCreate, SellerUpdate, SellerResponse
from app.services.seller_service import (
    create_seller, delete_seller, get_sellers, get_seller_by_id, update_seller, update_seller_status
)
from app.core.database import get_db

router = APIRouter(prefix="/sellers", tags=["Sellers"])

# ✅ Create a new Seller
@router.post("/", response_model=SellerResponse)
def create_seller_route(seller: SellerCreate, db: Session = Depends(get_db)):
    return create_seller(db, seller)

# ✅ Get all Sellers
@router.get("/", response_model=list[SellerResponse])
def get_all_sellers(db: Session = Depends(get_db)):
    return get_sellers(db)

# ✅ Get Seller by ID
@router.get("/{seller_id}", response_model=SellerResponse)
def get_seller_by_id_route(seller_id: UUID, db: Session = Depends(get_db)):
    seller = get_seller_by_id(db, seller_id)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    return seller

# ✅ Update Seller Details
@router.put("/{seller_id}", response_model=SellerResponse)
def update_seller_route(seller_id: UUID, seller_data: SellerUpdate, db: Session = Depends(get_db)):
    return update_seller(db, seller_id, seller_data)

# ✅ Delete a Seller
@router.delete("/{seller_id}")
def delete_seller_route(seller_id: UUID, db: Session = Depends(get_db)):
    return delete_seller(db, seller_id)

# ✅ Activate a Seller
@router.put("/{seller_id}/activate")
def activate_seller_route(seller_id: UUID, db: Session = Depends(get_db)):
    return update_seller_status(db, seller_id, "Active")

# ✅ Deactivate a Seller
@router.put("/{seller_id}/deactivate")
def deactivate_seller_route(seller_id: UUID, db: Session = Depends(get_db)):
    return update_seller_status(db, seller_id, "Inactive")
