import cv2
import numpy as np
import os
import uuid

def apply_lighting(image_path: str, mode: str, brightness: int, contrast: int, output_dir: str) -> str:
    """
    Adjusts the lighting of the given image.
    """
    image = cv2.imread(image_path)

    # ✅ Apply Predefined Lighting Modes
    if mode == "daylight":
        adjusted = cv2.convertScaleAbs(image, alpha=1.2, beta=20)
    elif mode == "warm":
        adjusted = cv2.applyColorMap(image, cv2.COLORMAP_AUTUMN)
    elif mode == "cool":
        adjusted = cv2.applyColorMap(image, cv2.COLORMAP_OCEAN)
    elif mode == "dimmed":
        adjusted = cv2.convertScaleAbs(image, alpha=0.8, beta=-30)
    else:  # ✅ Custom brightness & contrast
        adjusted = cv2.convertScaleAbs(image, alpha=brightness / 50.0, beta=contrast - 50)

    # ✅ Save Adjusted Image
    lighting_image_path = os.path.join(output_dir, f"lighting_{uuid.uuid4().hex}.png")
    cv2.imwrite(lighting_image_path, adjusted)
    return lighting_image_path
