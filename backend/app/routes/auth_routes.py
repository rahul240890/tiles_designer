from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginRequest, LoginResponse
from app.services.auth_service import authenticate_user
from app.core.database import get_db
from uuid import UUID
from app.utils.security import create_access_token


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=LoginResponse)
def login_user(user_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.email, user_data.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    access_token = create_access_token({"sub": str(user.id), "role": user.role})

    # Prepare response
    response_data = {
        "access_token": access_token,
        "role": user.role
    }

    # If user is a seller, include additional seller-specific details
    if user.role == "seller" and user.seller:
        response_data.update({
            "seller_id": str(user.seller.id),
            "seller_name": user.seller.seller_name,
            "seller_logo": user.seller.logo_url
        })

    return response_data
