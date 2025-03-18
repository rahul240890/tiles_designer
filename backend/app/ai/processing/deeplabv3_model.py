# backend/app/ai/processing/deeplabv3_model.py

import torch
import torchvision.transforms as T
from PIL import Image
import cv2
import numpy as np
import os
import uuid
from datetime import datetime
from app.core.database import SessionLocal
from app.models.ai.room_segmentation import RoomSegmentation
from app.ai.processing.detect_room_type import detect_room_type

# Load a pre-trained DeepLabV3+ model from Torch Hub
model = torch.hub.load('pytorch/vision:v0.10.0', 'deeplabv3_resnet101', pretrained=True)
model.eval()

# Define the transformation pipeline
transform = T.Compose([
    T.Resize(520),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def segment_image(image_path: str, output_dir: str) -> dict:
    """
    Runs DeepLabV3+ segmentation to detect wall and floor sections.
    If the detected room type is "Living Room", "Bedroom", or "Dining Room", wall detection is disabled.
    """
    room_type = detect_room_type(image_path)

    # ✅ Disable Wall Detection for Living Room, Bedroom, and Dining Room
    disable_wall_detection = room_type in ["Living Room", "Bedroom", "Dining Room"]

    # ✅ Run DeepLabV3+ segmentation
    input_image = Image.open(image_path).convert("RGB")
    input_tensor = transform(input_image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)['out'][0]
    output_predictions = output.argmax(0).byte().cpu().numpy()

    h, w = output_predictions.shape
    wall_mask = np.zeros((h, w), dtype=np.uint8) if disable_wall_detection else output_predictions
    floor_mask = output_predictions if disable_wall_detection else np.zeros((h, w), dtype=np.uint8)

    # ✅ Save Masked Images
    wall_mask_path = os.path.join(output_dir, f"wall_mask_{uuid.uuid4().hex}.png")
    floor_mask_path = os.path.join(output_dir, f"floor_mask_{uuid.uuid4().hex}.png")
    cv2.imwrite(wall_mask_path, wall_mask)
    cv2.imwrite(floor_mask_path, floor_mask)

    return {"wall_mask": wall_mask_path, "floor_mask": floor_mask_path, "room_type": room_type}

def save_segmentation_to_db(user_id: str, original_image_url: str, wall_mask_url: str, floor_mask_url: str):
    """
    Save the segmentation result into the database.
    """
    db = SessionLocal()
    segmentation = RoomSegmentation(
        id=uuid.uuid4(),
        user_id=user_id,
        original_image_url=original_image_url,
        wall_mask_url=wall_mask_url,
        floor_mask_url=floor_mask_url,
        created_at=datetime.utcnow()
    )
    db.add(segmentation)
    db.commit()
    db.refresh(segmentation)
    db.close()
    return segmentation
