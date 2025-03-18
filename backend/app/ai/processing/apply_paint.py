import cv2
import numpy as np
import os
import uuid
from sqlalchemy.orm import Session
from app.models.ai.room_segmentation import RoomSegmentation
from app.models.ai.painted_walls import PaintedWall
from app.core.database import SessionLocal

def hex_to_rgb(hex_color: str):
    """
    Convert HEX color (#RRGGBB) to RGB tuple.
    """
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def apply_wall_paint(segmentation_id: str, hex_color: str, output_dir: str) -> str:
    """
    Apply selected wall paint color to the detected wall sections.
    """
    db = SessionLocal()
    segmentation = db.query(RoomSegmentation).filter(RoomSegmentation.id == segmentation_id).first()
    if not segmentation:
        db.close()
        return None

    # ✅ Convert HEX color to RGB
    rgb_color = hex_to_rgb(hex_color)

    # ✅ Load AI-detected wall mask
    wall_mask = cv2.imread(segmentation.wall_mask_url, cv2.IMREAD_GRAYSCALE)
    original_image = cv2.imread(segmentation.original_image_url)

    # ✅ Create a blank canvas with the selected color
    paint_layer = np.full_like(original_image, rgb_color, dtype=np.uint8)

    # ✅ Apply the paint to the detected wall areas
    mask_inv = cv2.bitwise_not(wall_mask)
    painted_result = cv2.bitwise_and(original_image, original_image, mask=mask_inv)
    painted_result += cv2.bitwise_and(paint_layer, paint_layer, mask=wall_mask)

    # ✅ Save the painted image
    painted_image_path = os.path.join(output_dir, f"painted_{uuid.uuid4().hex}.png")
    cv2.imwrite(painted_image_path, painted_result)

    # ✅ Save painted wall details in DB
    painted_wall = PaintedWall(
        id=uuid.uuid4(),
        segmentation_id=segmentation_id,
        paint_color=hex_color,
        painted_image_url=painted_image_path
    )
    db.add(painted_wall)
    db.commit()
    db.close()

    return painted_image_path
