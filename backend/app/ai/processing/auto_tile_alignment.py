# backend/app/ai/processing/auto_tile_alignment.py

import cv2
import numpy as np

def align_tiles_to_mask(tile_image: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Align the tile image to the given mask using feature matching and homography.
    If enough keypoints are found, warp the tile image to the mask's perspective.
    """
    # Initialize ORB detector
    orb = cv2.ORB_create()
    kp1, des1 = orb.detectAndCompute(tile_image, None)
    kp2, des2 = orb.detectAndCompute(mask, None)
    
    # If descriptors are not found, return the original tile image
    if des1 is None or des2 is None:
        return tile_image

    # Use BFMatcher to match descriptors
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    if len(matches) < 4:
        return tile_image  # Not enough matches for a reliable homography

    src_pts = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1,1,2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1,1,2)
    M, _ = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
    if M is not None:
        aligned_tile = cv2.warpPerspective(tile_image, M, (mask.shape[1], mask.shape[0]))
        return aligned_tile
    return tile_image
