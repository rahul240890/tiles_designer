from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.services.tile_service import process_multiple_tiles
from app.core.database import get_db
from app.utils.file_storage import save_temp_files
import os

router = APIRouter(prefix="/tiles", tags=["Tile Upload"])

@router.post("/upload-multiple")
async def upload_tiles(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    """ Upload multiple tile images, save them, detect colors, and return preview data with real-time updates. """
    try:
        saved_paths = await save_temp_files(files)  # ✅ Save files before processing
        if not saved_paths:
            raise HTTPException(status_code=400, detail="No valid files were saved!")

        # ✅ Confirm that files exist before processing
        for path in saved_paths:
            if not os.path.exists(path):
                raise HTTPException(status_code=500, detail=f"File not found after saving: {path}")

        return await process_multiple_tiles(db, saved_paths)

    except Exception as e:
        print("Error in upload:", str(e))  # ✅ Debugging
        return {"error": str(e)}
