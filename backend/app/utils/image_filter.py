import cv2
import numpy as np

def is_tile_image(image_path):
    """Improves filtering logic to remove unwanted non-tile images"""
    
    try:
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        
        if image is None:
            print(f"Skipping {image_path}: Image not found")
            return False

        # ✅ Step 1: Check Image Size
        height, width = image.shape
        if height < 200 or width < 200:  # Skip very small images
            print(f"Skipping {image_path}: Image too small")
            return False

        # ✅ Step 2: Check Edge Detection (Tiles have structured edges)
        edges = cv2.Canny(image, 50, 150)
        edge_density = np.sum(edges) / (height * width)
        
        if edge_density < 0.02:  # If too few edges, it's likely not a tile
            print(f"Skipping {image_path}: Low edge density (not a tile)")
            return False

        return True  # ✅ Image is a tile

    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False
