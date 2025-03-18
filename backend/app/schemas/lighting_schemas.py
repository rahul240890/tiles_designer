from pydantic import BaseModel, UUID4, Field
from datetime import datetime

# ✅ Lighting Request Schema
class LightingRequestSchema(BaseModel):
    image_path: str = Field(..., description="Path to the image to apply lighting adjustments.")
    mode: str = Field(..., description="Lighting mode (daylight, warm, cool, dimmed, or custom).")
    brightness: int = Field(50, ge=0, le=100, description="Brightness level (0-100), only applicable if mode is custom.")
    contrast: int = Field(50, ge=0, le=100, description="Contrast level (0-100), only applicable if mode is custom.")

# ✅ Lighting Response Schema
class LightingResponseSchema(BaseModel):
    lighting_image_url: str = Field(..., description="URL of the adjusted image after applying lighting effects.")
    mode: str = Field(..., description="Selected lighting mode.")
    created_at: datetime = Field(default_factory=datetime.utcnow)
