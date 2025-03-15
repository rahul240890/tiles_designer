import fitz
import os
from app.utils.image_processing import enhance_tile_image, crop_tile_image
from app.utils.color_detection import extract_dominant_color, get_closest_color_name
from app.utils.image_filter import is_tile_image

TEMP_STORAGE_PATH = "tiles_storage/temp/"

async def process_pdf(db, file, thickness: float):
    """ Extracts images from PDF and processes them into tile images. """

    # ✅ Ensure the temp folder exists before saving the file
    if not os.path.exists(TEMP_STORAGE_PATH):
        os.makedirs(TEMP_STORAGE_PATH)

    pdf_path = os.path.join(TEMP_STORAGE_PATH, file.filename)

    with open(pdf_path, "wb") as f:
        f.write(file.file.read())

    doc = fitz.open(pdf_path)
    extracted_tiles = []

    for page in doc:
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_path = os.path.join(TEMP_STORAGE_PATH, f"page_{page.number}_img_{img_index}.png")

            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)

            # ✅ Filter & Process Tile Images
            if not is_tile_image(image_path):
                os.remove(image_path)
                continue

            cropped_img = crop_tile_image(image_path)
            enhanced_img = enhance_tile_image(cropped_img)

            # ✅ Detect Color
            hex_color = extract_dominant_color(enhanced_img)
            color_name = get_closest_color_name(hex_color)

            # ✅ Store Extracted Tile Data
            extracted_tiles.append({
                "temp_image_path": enhanced_img,
                "detected_color_name": color_name,
                "detected_color_hex": hex_color,
                "thickness": thickness
            })

    return {"tiles": extracted_tiles}
