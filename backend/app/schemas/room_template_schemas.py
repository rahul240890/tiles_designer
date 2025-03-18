from pydantic import BaseModel, UUID4, Field
from datetime import datetime

class RoomTemplateResponse(BaseModel):
    id: UUID4
    name: str
    category: str
    image_url: str
    created_at: datetime
