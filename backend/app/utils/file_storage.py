import os
import shutil
from fastapi import UploadFile

BASE_STORAGE_PATH = "tiles_storage"
TEMP_STORAGE = os.path.join(BASE_STORAGE_PATH, "temp")

def ensure_directory(path):
    """ Ensures that the given directory exists, creating it if necessary. """
    if not os.path.exists(path):
        os.makedirs(path)

def delete_temp_file(file_path):
    """ Deletes a file from the temporary storage folder. """
    if os.path.exists(file_path):
        os.remove(file_path)
        return True
    return False

def sanitize_filename(filename):
    """ Removes spaces and special characters to avoid file path issues. """
    return filename.replace(" ", "_").replace("(", "").replace(")", "")

async def save_temp_files(files: list[UploadFile]) -> list:
    """ Saves uploaded files to a temporary storage folder. """
    ensure_directory(TEMP_STORAGE)  # ✅ Ensure temp folder exists

    saved_paths = []
    for file in files:
        safe_filename = sanitize_filename(file.filename)
        file_path = os.path.join(TEMP_STORAGE, safe_filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())  # ✅ Ensure file is saved properly

        saved_paths.append(file_path)

    return saved_paths

def get_tile_storage_path(collection_id, tile_id, filename):
    """ Returns the structured storage path for tile images. """
    collection_folder = os.path.join(BASE_STORAGE_PATH, str(collection_id))
    ensure_directory(collection_folder)

    return os.path.join(collection_folder, f"{tile_id}_{filename}")

def move_file_to_storage(temp_path, collection_id, tile_id, filename):
    """ Moves a temporary file to its permanent storage location. """
    new_path = get_tile_storage_path(collection_id, tile_id, filename)
    shutil.move(temp_path, new_path)
    return new_path
