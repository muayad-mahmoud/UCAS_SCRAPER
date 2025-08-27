from typing import Optional
from pydantic import BaseModel
from uuid import UUID

class ProviderGalleryResult(BaseModel):
    id: int
    provider_ID: UUID
    logoUrl: str
    institution_code: Optional[str] = None
    name: str
    competition_level: Optional[str]
    course_count: int