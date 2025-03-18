from pydantic import BaseModel, UUID4, Field
from datetime import datetime

class PaintRequestSchema(BaseModel):
    segmentation_id: UUID4 = Field(..., description="Segmentation ID from AI processing")
    paint_color: str = Field(..., description="HEX color code for wall paint (e.g., #FF5733)")

class PaintResponseSchema(BaseModel):
    painted_image_url: str
    paint_color: str
