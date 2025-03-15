from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from app.models.seller import Seller
from app.models.user import User
from app.schemas.seller_schema import SellerCreate, SellerUpdate
from app.utils.security import hash_password
from fastapi import HTTPException
from uuid import UUID

# ✅ Create a new Seller (Creates Seller + User)
def create_seller(db: Session, seller: SellerCreate):
    try:
        # Check if email exists
        existing_user = db.query(User).filter(User.email == seller.email).first()
        existing_seller = db.query(Seller).filter(Seller.email == seller.email).first()
        
        if existing_user or existing_seller:
            raise HTTPException(status_code=400, detail="Email already exists")

        # Create Seller Entry
        new_seller = Seller(**seller.dict(exclude={"password"}))
        db.add(new_seller)
        db.commit()
        db.refresh(new_seller)

        # Create User Entry for Seller
        hashed_password = hash_password(seller.password)
        new_user = User(
            username=seller.seller_name,
            email=seller.email,
            password_hash=hashed_password,
            role="seller",
            seller_id=new_seller.id
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_seller

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error while creating seller")

# ✅ Get all Sellers (Including Users via JOIN)
def get_sellers(db: Session):
    return db.query(Seller).options(joinedload(Seller.users)).all()

# ✅ Get Seller by ID (JOIN with Users)
def get_seller_by_id(db: Session, seller_id: UUID):
    seller = db.query(Seller).options(joinedload(Seller.users)).filter(Seller.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    return seller

# ✅ Update Seller Details
def update_seller(db: Session, seller_id: UUID, seller_data: SellerUpdate):
    seller = db.query(Seller).filter(Seller.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    for key, value in seller_data.dict(exclude_unset=True).items():
        setattr(seller, key, value)

    db.commit()
    db.refresh(seller)
    return seller

# ✅ Delete a Seller
def delete_seller(db: Session, seller_id: UUID):
    seller = db.query(Seller).filter(Seller.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    db.delete(seller)
    db.commit()
    return {"message": "Seller deleted successfully"}

# ✅ Activate/Deactivate Seller
def update_seller_status(db: Session, seller_id: UUID, status: str):
    seller = db.query(Seller).filter(Seller.id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    seller.status = status
    db.commit()
    db.refresh(seller)
    return {"message": f"Seller {status.lower()} successfully", "seller_id": seller.id}
