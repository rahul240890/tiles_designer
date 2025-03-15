from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import os
from app.services.pdf_service import process_pdf
from app.services.progress_service import reset_progress
from app.utils.file_storage import delete_temp_file
from app.core.database import get_db

router = APIRouter(prefix="/pdf", tags=["PDF Processing"])


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), thickness: float = 0.0, db: Session = Depends(get_db)):
    """ Upload PDF & Extract Tile Images with Real-Time Progress """
    return await process_pdf(db, file, thickness)  # ✅ FIXED: Pass thickness correctly


@router.delete("/temp-delete/{image_path}")
def delete_temp_image(image_path: str):
    """ Delete a temporary tile image """
    temp_folder = "tiles_storage/temp/"
    file_path = os.path.join(temp_folder, image_path)
    
    if delete_temp_file(file_path):
        return {"message": "Tile image deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Tile image not found or could not be deleted.")

@router.delete("/cancel-extraction")
def cancel_extraction():
    """ Cancel ongoing extraction process and clear progress """
    reset_progress()
    return {"message": "Extraction process canceled and progress reset."}
