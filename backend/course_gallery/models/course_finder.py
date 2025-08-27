from typing import Optional
from pydantic import BaseModel
from uuid import UUID

# Something like this. Adjust as necessary
class CourseGalleryProviderResult(BaseModel):
    id: str
    academicYear: int
    courseTitle: str
    summary: str
    provider_id: UUID
    # courses: list[UcasCourse]


# TODO
