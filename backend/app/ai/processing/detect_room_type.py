import torch
import torchvision.transforms as T
from PIL import Image
import os

# ✅ Load Pre-Trained ResNet Model for Room Classification
model = torch.hub.load("pytorch/vision:v0.10.0", "resnet18", pretrained=True)
model.eval()

# ✅ Define Image Preprocessing
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ✅ Room Labels (Must be fine-tuned with Kitchen, Bathroom, Living Room, Bedroom, Dining Room, Balcony)
ROOM_LABELS = ["Kitchen", "Bathroom", "Living Room", "Bedroom", "Dining Room", "Balcony"]

def detect_room_type(image_path: str) -> str:
    """
    Predict the type of room based on the uploaded image.
    """
    input_image = Image.open(image_path).convert("RGB")
    input_tensor = transform(input_image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        predicted_class = output.argmax(1).item()

    return ROOM_LABELS[predicted_class]
