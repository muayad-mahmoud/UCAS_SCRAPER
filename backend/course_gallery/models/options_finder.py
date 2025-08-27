from typing import Optional
from pydantic import BaseModel
from uuid import UUID

class OptionsGalleryResult(BaseModel):
    id: UUID
    course_id: UUID
    location: Optional[str] = None
    duration: str
    googleMapsUrl: Optional[str] = None
    startDate: Optional[str] = None
    Qualification: Optional[str] = None