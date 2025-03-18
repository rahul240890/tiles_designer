# backend/app/ai/processing/depth_estimation.py

import torch
import torchvision.transforms as T
from PIL import Image
import cv2
import numpy as np
import os
import uuid

# Load MiDaS model from Torch Hub (choose the large or small model)
model_type = "DPT_Large"  # Change to "MiDaS_small" if desired
midas = torch.hub.load("intel-isl/MiDaS", model_type)
midas.eval()
midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")

if model_type == "DPT_Large":
    transform = midas_transforms.dpt_transform
else:
    transform = midas_transforms.small_transform

def generate_depth_map(image_path: str, output_dir: str) -> str:
    """
    Generate a depth map using MiDaS from the input image.
    Returns the file path of the depth map image.
    """
    input_image = Image.open(image_path).convert("RGB")
    input_tensor = transform(input_image).unsqueeze(0)

    with torch.no_grad():
        prediction = midas(input_tensor)
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=input_image.size[::-1],
            mode="bicubic",
            align_corners=False,
        ).squeeze()

    depth_map = prediction.cpu().numpy()
    # Normalize to 0-255
    depth_map = cv2.normalize(depth_map, None, 0, 255, norm_type=cv2.NORM_MINMAX)
    depth_map = depth_map.astype(np.uint8)

    depth_map_path = os.path.join(output_dir, f"depth_{uuid.uuid4().hex}.png")
    cv2.imwrite(depth_map_path, depth_map)
    return depth_map_path
