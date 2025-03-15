from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import verify_password
from uuid import UUID
from fastapi import HTTPException

# ✅ Authenticate User
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return user
