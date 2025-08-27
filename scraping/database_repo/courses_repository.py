from .base_repository import BaseRepository


class CoursesRepository(BaseRepository):
    def __init__(self, supabase_client):
        super().__init__(supabase_client, "courses")

    def bulk_create_non_duplicate(self, courses):
        existing_ids = {course['id'] for course in self.find_all()}
        new_courses = [course for course in courses if course['id'] not in existing_ids]
        if not new_courses:
            return []

        return self.bulk_create(new_courses)
