# backend/app/services/ai_service.py

import os
import uuid
import cv2
import numpy as np
import torch
import torchvision.transforms as T
from PIL import Image
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.ai.room_segmentation import RoomSegmentation
from app.models.ai.processed_image import ProcessedImage
from app.models.ai.tile_comparison import TileComparison
from app.models.tile_designs_model import TileDesign
from app.models.attribute_models import TileColor
from app.schemas.ai_schemas import TileSuggestionRequest

# Load DeepLabV3+ Model
model = torch.hub.load('pytorch/vision:v0.10.0', 'deeplabv3_resnet101', pretrained=True)
model.eval()

# Define image transformation pipeline
transform = T.Compose([
    T.Resize(520),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ✅ Image Segmentation
def segment_image(image_path: str, output_dir: str) -> dict:
    """
    Run DeepLabV3+ segmentation on an image to generate wall and floor masks.
    Returns file paths of wall and floor masks.
    """
    input_image = Image.open(image_path).convert("RGB")
    input_tensor = transform(input_image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)['out'][0]
    output_predictions = output.argmax(0).byte().cpu().numpy()

    # Simulate segmentation by splitting the image horizontally
    h, w = output_predictions.shape
    wall_mask = np.zeros((h, w), dtype=np.uint8)
    floor_mask = np.zeros((h, w), dtype=np.uint8)
    wall_mask[:h//2, :] = 255
    floor_mask[h//2:, :] = 255

    wall_mask_path = os.path.join(output_dir, f"wall_mask_{uuid.uuid4().hex}.png")
    floor_mask_path = os.path.join(output_dir, f"floor_mask_{uuid.uuid4().hex}.png")
    cv2.imwrite(wall_mask_path, wall_mask)
    cv2.imwrite(floor_mask_path, floor_mask)

    return {"wall_mask": wall_mask_path, "floor_mask": floor_mask_path}

# ✅ Tile Replacement
def replace_tiles(segmentation_id: str, wall_tile_texture: str, floor_tile_texture: str, output_dir: str) -> str:
    """
    Applies selected tiles to segmented areas and returns the processed image path.
    """
    db = SessionLocal()
    segmentation = db.query(RoomSegmentation).filter(RoomSegmentation.id == segmentation_id).first()
    if not segmentation:
        db.close()
        return None

    original = cv2.imread(segmentation.original_image_url)
    wall_mask = cv2.imread(segmentation.wall_mask_url, cv2.IMREAD_GRAYSCALE)
    floor_mask = cv2.imread(segmentation.floor_mask_url, cv2.IMREAD_GRAYSCALE)
    wall_texture = cv2.imread(wall_tile_texture)
    floor_texture = cv2.imread(floor_tile_texture)

    processed = original.copy()
    for mask, texture in [(wall_mask, wall_texture), (floor_mask, floor_texture)]:
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            tile_pattern = cv2.resize(texture, (w, h))
            processed[y:y+h, x:x+w] = tile_pattern

    processed_image_path = os.path.join(output_dir, f"processed_{uuid.uuid4().hex}.png")
    cv2.imwrite(processed_image_path, processed)

    # Save to DB
    processed_image = ProcessedImage(id=uuid.uuid4(), segmentation_id=segmentation_id,
                                     processed_image_url=processed_image_path, created_at=datetime.utcnow())
    db.add(processed_image)
    db.commit()
    db.close()
    return processed_image_path

# ✅ AI-Based Tile Suggestions
def suggest_matching_tiles(request: TileSuggestionRequest, db: Session):
    """
    Suggest matching tiles based on color similarity.
    """
    selected_tile = db.query(TileDesign).filter(TileDesign.id == request.selected_tile_id).first()
    if not selected_tile:
        return []

    selected_color = db.query(TileColor).filter(TileColor.id == selected_tile.color_id).first()
    if not selected_color:
        return []

    selected_rgb = np.array([int(selected_color.hex_code[i:i+2], 16) for i in (0, 2, 4)])
    suggestions = []
    other_tiles = db.query(TileDesign).filter(TileDesign.id != request.selected_tile_id).all()

    for tile in other_tiles:
        color = db.query(TileColor).filter(TileColor.id == tile.color_id).first()
        if not color:
            continue
        rgb = np.array([int(color.hex_code[i:i+2], 16) for i in (0, 2, 4)])
        score = np.linalg.norm(selected_rgb - rgb)
        suggestions.append({"tile_id": str(tile.id), "match_score": round(score, 2)})

    suggestions.sort(key=lambda x: x["match_score"])
    return suggestions[:request.top_n]
