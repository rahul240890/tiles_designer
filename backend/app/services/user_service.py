from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.utils.security import hash_password
from uuid import UUID

# ✅ Create a new Admin
def create_admin(db: Session, user: UserCreate):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hash_password(user.password)
    new_admin = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role="admin"
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

# ✅ Get all Admins
def get_admins(db: Session):
    return db.query(User).filter(User.role == "admin").all()

# ✅ Get Admin by ID
def get_admin_by_id(db: Session, admin_id: UUID):
    admin = db.query(User).filter(User.id == admin_id, User.role == "admin").first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

# ✅ Delete an Admin
def delete_admin(db: Session, admin_id: UUID):
    admin = db.query(User).filter(User.id == admin_id, User.role == "admin").first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    db.delete(admin)
    db.commit()
    return {"message": "Admin deleted successfully"}
