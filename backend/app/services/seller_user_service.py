from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.seller_user_schema import SellerUserCreate
from app.utils.security import hash_password
from uuid import UUID

# ✅ Create a new Seller User
def create_seller_user(db: Session, user: SellerUserCreate):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hash_password(user.password)
    new_seller_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role="seller",
        seller_id=user.seller_id
    )

    db.add(new_seller_user)
    db.commit()
    db.refresh(new_seller_user)
    return new_seller_user

# ✅ Get all Seller Users (Join with Seller)
def get_seller_users(db: Session):
    return db.query(User).filter(User.role == "seller").all()

# ✅ Get Seller User by ID
def get_seller_user_by_id(db: Session, seller_user_id: UUID):
    seller_user = db.query(User).filter(User.id == seller_user_id, User.role == "seller").first()
    if not seller_user:
        raise HTTPException(status_code=404, detail="Seller User not found")
    return seller_user

# ✅ Delete a Seller User
def delete_seller_user(db: Session, seller_user_id: UUID):
    seller_user = db.query(User).filter(User.id == seller_user_id, User.role == "seller").first()
    if not seller_user:
        raise HTTPException(status_code=404, detail="Seller User not found")

    db.delete(seller_user)
    db.commit()
    return {"message": "Seller User deleted successfully"}
