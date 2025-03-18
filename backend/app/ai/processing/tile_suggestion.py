# backend/app/ai/processing/tile_suggestion.py

import numpy as np
from app.core.database import SessionLocal
from app.models.tile_designs_model import TileDesign
from app.models.attribute_models import TileColor
import uuid

def hex_to_rgb(hex_code: str) -> np.ndarray:
    """
    Convert a hex color code to an RGB numpy array.
    """
    hex_code = hex_code.lstrip('#')
    return np.array([int(hex_code[i:i+2], 16) for i in (0, 2, 4)])

def suggest_matching_tiles(selected_tile_design_id, top_n=5):
    """
    Suggest matching tiles based on color similarity.
    Returns a list of tuples (tile_design_id, match_score) where a lower score indicates a closer match.
    """
    db = SessionLocal()
    selected_tile = db.query(TileDesign).filter(TileDesign.id == selected_tile_design_id).first()
    if not selected_tile:
        db.close()
        return []

    selected_color = db.query(TileColor).filter(TileColor.id == selected_tile.color_id).first()
    if not selected_color:
        db.close()
        return []

    selected_rgb = hex_to_rgb(selected_color.hex_code)
    suggestions = []

    # Fetch all other tile designs
    other_tiles = db.query(TileDesign).filter(TileDesign.id != selected_tile_design_id).all()
    for tile in other_tiles:
        color = db.query(TileColor).filter(TileColor.id == tile.color_id).first()
        if not color:
            continue
        rgb = hex_to_rgb(color.hex_code)
        score = np.linalg.norm(selected_rgb - rgb)
        suggestions.append((tile.id, score))
    # Sort suggestions by match score (lower is better)
    suggestions.sort(key=lambda x: x[1])
    db.close()
    return suggestions[:top_n]
