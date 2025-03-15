import cv2
import numpy as np
from keras.models import load_model

# ✅ Load Pre-Trained AI Model for Tile Detection
tile_classifier = load_model("models/tile_classifier.h5")  # Ensure you have a trained model

def is_tile_image(image_path):
    """ Classifies whether an image is a tile or not. """
    image = cv2.imread(image_path)
    image = cv2.resize(image, (224, 224))  # Resize for AI model
    image = np.expand_dims(image, axis=0) / 255.0  # Normalize

    prediction = tile_classifier.predict(image)
    return prediction[0][0] > 0.5  # ✅ Returns True if image is a tile, False otherwise
