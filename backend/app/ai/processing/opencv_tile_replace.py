# backend/app/ai/processing/opencv_tile_replace.py

import cv2
import numpy as np
import os
import uuid
from datetime import datetime
from app.core.database import SessionLocal
from app.models.ai.processed_image import ProcessedImage

def create_tile_pattern(width: int, height: int, texture: np.ndarray) -> np.ndarray:
    """
    Create a repeating tile pattern that fills the region defined by width and height.
    """
    texture_h, texture_w, _ = texture.shape
    cols = int(np.ceil(width / texture_w))
    rows = int(np.ceil(height / texture_h))
    pattern = np.tile(texture, (rows, cols, 1))
    return pattern[:height, :width]

def replace_tiles(original_image_path: str, wall_mask_path: str, floor_mask_path: str,
                  wall_tile_texture: str, floor_tile_texture: str, output_dir: str) -> str:
    """
    Replace the detected wall and floor regions in the original image with the provided tile textures.
    Returns the file path of the final processed image.
    """
    # Read images
    original = cv2.imread(original_image_path)
    wall_mask = cv2.imread(wall_mask_path, cv2.IMREAD_GRAYSCALE)
    floor_mask = cv2.imread(floor_mask_path, cv2.IMREAD_GRAYSCALE)
    wall_texture = cv2.imread(wall_tile_texture)
    floor_texture = cv2.imread(floor_tile_texture)

    # Resize textures to a standard tile size (e.g., 100x100 pixels)
    tile_size = (100, 100)
    wall_texture = cv2.resize(wall_texture, tile_size)
    floor_texture = cv2.resize(floor_texture, tile_size)

    processed = original.copy()

    # Process wall mask: replace regions with wall tile texture
    contours, _ = cv2.findContours(wall_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        tile_pattern = create_tile_pattern(w, h, wall_texture)
        processed[y:y+h, x:x+w] = tile_pattern

    # Process floor mask: replace regions with floor tile texture
    contours, _ = cv2.findContours(floor_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        tile_pattern = create_tile_pattern(w, h, floor_texture)
        processed[y:y+h, x:x+w] = tile_pattern

    # Save the processed image
    processed_image_path = os.path.join(output_dir, f"processed_{uuid.uuid4().hex}.png")
    cv2.imwrite(processed_image_path, processed)
    return processed_image_path

def save_processed_image_to_db(segmentation_id: str, applied_tiles_data: dict, processed_image_url: str):
    """
    Save the processed image details into the database.
    """
    from datetime import datetime
    import uuid
    db = SessionLocal()
    processed = ProcessedImage(
        id=uuid.uuid4(),
        segmentation_id=segmentation_id,
        applied_tiles_data=str(applied_tiles_data),  # Store JSON as string
        processed_image_url=processed_image_url,
        created_at=datetime.utcnow()
    )
    db.add(processed)
    db.commit()
    db.refresh(processed)
    db.close()
    return processed
