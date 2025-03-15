from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import create_admin, delete_admin, get_admins, get_admin_by_id
from app.core.database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

# ✅ Create a new Admin
@router.post("/admin", response_model=UserResponse)
def create_admin_route(user: UserCreate, db: Session = Depends(get_db)):
    return create_admin(db, user)

# ✅ Get all Admins
@router.get("/admin", response_model=list[UserResponse])
def get_all_admins(db: Session = Depends(get_db)):
    return get_admins(db)

# ✅ Get Admin by ID
@router.get("/admin/{admin_id}", response_model=UserResponse)
def get_admin_by_id_route(admin_id: UUID, db: Session = Depends(get_db)):
    admin = get_admin_by_id(db, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

# ✅ Delete an Admin
@router.delete("/admin/{admin_id}")
def delete_admin_route(admin_id: UUID, db: Session = Depends(get_db)):
    return delete_admin(db, admin_id)
