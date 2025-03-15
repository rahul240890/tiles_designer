from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.seller_user_schema import SellerUserCreate, SellerUserResponse
from app.services.seller_user_service import (
    create_seller_user,
    delete_seller_user,
    get_seller_users,
    get_seller_user_by_id,
)
from app.core.database import get_db

router = APIRouter(prefix="/users/seller", tags=["Seller Users"])

# ✅ Create a new Seller User
@router.post("/", response_model=SellerUserResponse)
def create_seller_user_route(user: SellerUserCreate, db: Session = Depends(get_db)):
    return create_seller_user(db, user)

# ✅ Get all Seller Users
@router.get("/", response_model=list[SellerUserResponse])
def get_all_seller_users(db: Session = Depends(get_db)):
    return get_seller_users(db)

# ✅ Get Seller User by ID
@router.get("/{seller_user_id}", response_model=SellerUserResponse)
def get_seller_user_by_id_route(seller_user_id: UUID, db: Session = Depends(get_db)):
    seller_user = get_seller_user_by_id(db, seller_user_id)
    if not seller_user:
        raise HTTPException(status_code=404, detail="Seller User not found")
    return seller_user

# ✅ Delete a Seller User
@router.delete("/{seller_user_id}")
def delete_seller_user_route(seller_user_id: UUID, db: Session = Depends(get_db)):
    return delete_seller_user(db, seller_user_id)
