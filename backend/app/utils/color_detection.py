import cv2
import numpy as np
from sklearn.cluster import KMeans
import webcolors

def extract_dominant_color(image_path):
    """ Extracts the most dominant color from a tile image and returns its HEX code. """
    
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image: {image_path}")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = image.reshape((-1, 3))  # Flatten image into a list of pixels

    kmeans = KMeans(n_clusters=1, n_init=10, max_iter=200)
    kmeans.fit(image)
    dominant_color = kmeans.cluster_centers_[0]

    hex_color = "#{:02x}{:02x}{:02x}".format(
        int(dominant_color[0]), int(dominant_color[1]), int(dominant_color[2])
    )

    return hex_color

import webcolors


def get_closest_color_name(hex_code):
    """ Matches HEX color code to the closest available color name. """
    
    def hex_to_rgb(value):
        """ Converts HEX to RGB tuple. """
        value = value.lstrip("#")
        return tuple(int(value[i:i+2], 16) for i in (0, 2, 4))

    requested_rgb = hex_to_rgb(hex_code)

    try:
        return webcolors.hex_to_name(hex_code).capitalize()
    except ValueError:
        min_colours = {}

        # ✅ FIX: Use `webcolors.names("css3")` for latest color mapping
        for name in webcolors.names("css3"):
            r, g, b = webcolors.name_to_rgb(name)
            rd = (r - requested_rgb[0]) ** 2
            gd = (g - requested_rgb[1]) ** 2
            bd = (b - requested_rgb[2]) ** 2
            min_colours[(rd + gd + bd)] = name

        return min_colours[min(min_colours.keys())].capitalize()
