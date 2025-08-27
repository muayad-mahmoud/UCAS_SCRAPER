from typing import List
from ....models.relations import CourseWithOptions, PaginatedCourseResponse
class CourseFinderResource:
    def __init__(self, db_client):
        self.db_client = db_client

    def search_providers(
        self,
        provider_id: str,
        page: int = 1,
        limit: int = 10,
        options: bool = False
    ) -> PaginatedCourseResponse:
        select_query = "*, options(*)" if options else "*"
        try:
            offset = (page - 1) * limit
            count_response = self.db_client.table("courses").select("*", count="exact").eq("provider_id", provider_id).execute()
            if not count_response.data:
                return []
            total = len(count_response.data) if count_response.data else 0
            response = self.db_client.table("courses").select(select_query).eq("provider_id", provider_id).range(offset, offset + limit).execute()
            if not response.data:
                return []
            return self._transform_to_results(response.data, total, page, limit)
        except Exception as e:
            raise ValueError(f"Error fetching courses: {str(e)}")

    def _transform_to_results(self, data, total, page, limit) -> PaginatedCourseResponse:
        results = [CourseWithOptions(**item) for item in data]
        for item in results:
            if not hasattr(item, 'options') or item.options is None:
                del item.options
        return PaginatedCourseResponse(total=total, page=page, per_page=limit, data=results)