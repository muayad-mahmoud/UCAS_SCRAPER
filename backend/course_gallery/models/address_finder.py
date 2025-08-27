from typing import Optional
from pydantic import BaseModel
from uuid import UUID

class AddressGalleryResult(BaseModel):
    id: int
    line1: Optional[str] = None
    line2: Optional[str] = None
    line3: Optional[str] = None
    line4: Optional[str] = None
    country: Optional[str] = None
    region: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    provider_id: UUID