from fastapi import APIRouter, HTTPException,Depends, Query
from typing import List
from ...core.database.db_client import DBClient
from ...core.database.resources.course_gallery import CourseFinderResource
from ...models.relations import CourseWithOptions, PaginatedCourseResponse


router = APIRouter(prefix="/courses", tags=["Courses"])

def get_course_resource():
    db_client = DBClient()
    return CourseFinderResource(db_client)

@router.get("/", response_model=PaginatedCourseResponse)
def search_courses(
    provider_id: str,
    options: bool = Query(False, description="Include options in response"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, description="Number of results per page"),
    course_resource: CourseFinderResource = Depends(get_course_resource)
):
    results = course_resource.search_providers(provider_id, page, limit, options)
    if not results:
        raise HTTPException(status_code=404, detail="No courses found")
    return results