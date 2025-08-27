from .provider_finder import ProviderGalleryResult
from .address_finder import AddressGalleryResult
from .course_finder import CourseGalleryProviderResult
from .options_finder import OptionsGalleryResult
from typing import Optional
from pydantic import BaseModel
class ProviderWithAddress(ProviderGalleryResult):
    address: Optional[AddressGalleryResult] = None

class CourseWithOptions(CourseGalleryProviderResult):
    options: Optional[list[OptionsGalleryResult]] = None

class ProviderWithCourses(ProviderGalleryResult):
    courses: list[CourseGalleryProviderResult]

class CourseWithProvider(CourseGalleryProviderResult):
    provider: ProviderGalleryResult

class PaginatedCourseResponse(BaseModel):
    total: int
    page: int
    per_page: int
    data: list[CourseWithOptions]

class PaginatedProviderResponse(BaseModel):
    total: int
    page: int
    per_page: int
    data: list[ProviderWithAddress]
