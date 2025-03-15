import cv2
import numpy as np

# ✅ Crop Image to Remove Background & Borders
def crop_tile_image(image_path):
    """ Crops tile images to remove background and borders. """
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # ✅ Use Edge Detection to Identify Tile Region
    edges = cv2.Canny(gray, 50, 200)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # ✅ Find the Largest Contour (Tile Region)
    if contours:
        x, y, w, h = cv2.boundingRect(max(contours, key=cv2.contourArea))
        cropped = image[y:y+h, x:x+w]
        cv2.imwrite(image_path, cropped)  # ✅ Overwrite the original image with the cropped version

    return image_path

# ✅ Enhance Image Quality (Sharpening, Noise Reduction)
def enhance_tile_image(image_path):
    """ Enhances tile images by applying sharpening filters. """
    image = cv2.imread(image_path)
    
    # ✅ Apply Sharpening Kernel
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharpened = cv2.filter2D(image, -1, kernel)

    cv2.imwrite(image_path, sharpened)  # ✅ Overwrite with enhanced image
    return image_path

# ✅ Convert Image Format (JPEG, PNG)
def convert_image_format(image_path, output_format="jpg"):
    """ Converts tile images to a standardized format (JPG or PNG). """
    image = cv2.imread(image_path)
    output_path = image_path.rsplit(".", 1)[0] + f".{output_format}"
    cv2.imwrite(output_path, image)
    return output_path

def convert_image_to_png(image_path):
    """ Converts image to PNG format for lossless quality. """
    image = cv2.imread(image_path)
    output_path = image_path.rsplit(".", 1)[0] + ".png"
    cv2.imwrite(output_path, image, [cv2.IMWRITE_PNG_COMPRESSION, 9])  # Lossless compression
    return output_path

def convert_image_to_webp(image_path):
    """ Converts image to WEBP format for web performance optimization. """
    image = cv2.imread(image_path)
    output_path = image_path.rsplit(".", 1)[0] + ".webp"
    cv2.imwrite(output_path, image, [cv2.IMWRITE_WEBP_QUALITY, 80])  # 80% Quality for optimized size
    return output_path